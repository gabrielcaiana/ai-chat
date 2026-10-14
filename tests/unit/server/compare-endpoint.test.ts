// Endpoint test for POST /api/compare.
// Nitro/h3 auto-imports are stubbed as globals so the handler runs in plain
// Vitest; the model factory and repository are mocked (no network, no DB).
import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { CompareEvent } from '../../../layers/chat/shared/catalog/compare';
import { streamingModel, failingModel } from './mock-model';

const createModel = vi.fn();
const createRun = vi.fn();

vi.mock('../../../layers/chat/server/services/ai-service', () => ({
  createModel: (...args: unknown[]) => createModel(...args),
}));
vi.mock('../../../layers/chat/server/repository/runRepository', () => ({
  createRun: (...args: unknown[]) => createRun(...args),
}));

type FakeEvent = { body: unknown; headers: Record<string, string> };

vi.stubGlobal('defineEventHandler', (fn: unknown) => fn);
vi.stubGlobal(
  'readValidatedBody',
  async (e: FakeEvent, validate: (b: unknown) => unknown) => validate(e.body)
);
vi.stubGlobal('setResponseHeaders', (e: FakeEvent, h: Record<string, string>) =>
  Object.assign(e.headers, h)
);
vi.stubGlobal('useRuntimeConfig', () => ({
  openaiApiKey: 'env-openai',
  anthropicApiKey: 'env-anthropic',
}));
vi.stubGlobal(
  'createError',
  (opts: { statusCode: number; statusMessage: string }) =>
    Object.assign(new Error(opts.statusMessage), opts)
);

const { default: handler } = await import(
  '../../../layers/chat/server/api/compare/index.post'
);

async function call(body: unknown) {
  const event: FakeEvent = { body, headers: {} };
  const stream = (await (handler as (e: FakeEvent) => unknown)(
    event
  )) as ReadableStream<Uint8Array>;
  const text = await new Response(stream).text();
  const events = text
    .trim()
    .split('\n')
    .map(l => JSON.parse(l) as CompareEvent);
  return { event, events };
}

describe('POST /api/compare', () => {
  beforeEach(() => {
    createModel.mockReset();
    createRun.mockReset().mockResolvedValue({ id: 'run-42' });
  });

  it('streams NDJSON events for each model and persists the run', async () => {
    createModel.mockImplementation((provider: string) =>
      provider === 'ollama'
        ? streamingModel(['local'])
        : streamingModel(['cloud'])
    );

    const { event, events } = await call({
      prompt: 'Say hi',
      targets: [
        { provider: 'ollama', model: 'qwen2.5:0.5b' },
        { provider: 'openai', model: 'gpt-6-luna' },
      ],
    });

    expect(event.headers['Content-Type']).toContain('application/x-ndjson');
    const results = events.filter(e => e.type === 'result');
    expect(results).toHaveLength(2);
    expect(events.at(-1)).toMatchObject({ type: 'done', runId: 'run-42' });
    expect(createRun).toHaveBeenCalledWith('Say hi', expect.any(Array));
  });

  it('prefers request API keys and falls back to env per provider', async () => {
    createModel.mockReturnValue(streamingModel(['x']));
    await call({
      prompt: 'hi',
      targets: [
        { provider: 'openai', model: 'gpt-6-luna' },
        { provider: 'anthropic', model: 'claude-haiku-5-5' },
        { provider: 'ollama', model: 'qwen2.5:0.5b' },
      ],
      apiKeys: { anthropic: 'ui-anthropic' },
    });
    expect(createModel).toHaveBeenCalledWith(
      'openai',
      'gpt-6-luna',
      'env-openai'
    );
    expect(createModel).toHaveBeenCalledWith(
      'anthropic',
      'claude-haiku-5-5',
      'ui-anthropic'
    );
    expect(createModel).toHaveBeenCalledWith(
      'ollama',
      'qwen2.5:0.5b',
      undefined
    );
  });

  it('fails fast for cloud models without an API key', async () => {
    vi.stubGlobal('useRuntimeConfig', () => ({}));
    createModel.mockReturnValue(streamingModel(['ok']));
    const { events } = await call({
      prompt: 'hi',
      targets: [
        { provider: 'openai', model: 'gpt-6-luna' },
        { provider: 'ollama', model: 'qwen2.5:0.5b' },
      ],
    });
    vi.stubGlobal('useRuntimeConfig', () => ({
      openaiApiKey: 'env-openai',
      anthropicApiKey: 'env-anthropic',
    }));
    const done = events.at(-1) as Extract<CompareEvent, { type: 'done' }>;
    expect(done.results[0]).toMatchObject({
      status: 'error',
      error: 'No API key configured for openai',
    });
    expect(done.results[1]!.status).toBe('success');
    expect(createModel).toHaveBeenCalledTimes(1);
  });

  it('keeps going when one model fails', async () => {
    createModel.mockImplementation((provider: string) =>
      provider === 'openai'
        ? failingModel('quota exceeded')
        : streamingModel(['ok'])
    );
    const { events } = await call({
      prompt: 'hi',
      targets: [
        { provider: 'openai', model: 'gpt-6-luna' },
        { provider: 'ollama', model: 'qwen2.5:0.5b' },
      ],
    });
    const done = events.at(-1) as Extract<CompareEvent, { type: 'done' }>;
    expect(done.results.map(r => r.status)).toEqual(['error', 'success']);
    expect(done.results[0]!.error).toContain('quota exceeded');
  });

  it.each([
    [{ prompt: '', targets: [{ provider: 'ollama', model: 'x' }] }],
    [{ prompt: 'hi', targets: [] }],
    [{ prompt: 'hi', targets: [{ provider: 'bogus', model: 'x' }] }],
    [
      {
        prompt: 'hi',
        targets: Array(7).fill({ provider: 'ollama', model: 'x' }),
      },
    ],
  ])('rejects invalid bodies with 400 (%#)', async body => {
    await expect(call(body)).rejects.toMatchObject({ statusCode: 400 });
    expect(createModel).not.toHaveBeenCalled();
  });
});
