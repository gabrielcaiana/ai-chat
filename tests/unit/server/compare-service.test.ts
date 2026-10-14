import { describe, it, expect, vi } from 'vitest';
import {
  createCompareStream,
  runComparison,
  errorMessage,
} from '../../../layers/chat/server/services/compare-service';
import type { CompareEvent } from '../../../layers/chat/shared/catalog/compare';
import { estimateCostUsd } from '../../../layers/chat/shared/catalog/models';
import { failingModel, streamingModel } from './mock-model';

// Deterministic clock: every call advances 10ms.
function fakeClock() {
  let t = 0;
  return () => (t += 10);
}

async function readNdjson(stream: ReadableStream<Uint8Array>) {
  const text = await new Response(stream).text();
  return text
    .trim()
    .split('\n')
    .map(l => JSON.parse(l) as CompareEvent);
}

describe('estimateCostUsd', () => {
  it('uses the price table (USD per 1M tokens)', () => {
    // gpt-6-luna: $0.10 in / $0.50 out
    expect(estimateCostUsd('openai', 'gpt-6-luna', 1_000_000, 1_000_000)).toBe(
      0.6
    );
    expect(estimateCostUsd('anthropic', 'claude-sonnet-5-5', 1000, 500)).toBe(
      0.007
    );
  });

  it('is zero for local Ollama models, even unlisted ones', () => {
    expect(estimateCostUsd('ollama', 'any-local:7b', 1234, 5678)).toBe(0);
  });

  it('returns null for unknown paid models', () => {
    expect(estimateCostUsd('openai', 'not-a-model', 10, 10)).toBeNull();
  });
});

describe('runComparison', () => {
  it('runs every target and captures text, TTFT, latency, tokens and cost', async () => {
    const events: CompareEvent[] = [];
    const results = await runComparison({
      prompt: 'hi',
      targets: [
        { provider: 'openai', model: 'gpt-6-luna' },
        { provider: 'ollama', model: 'qwen2.5:0.5b' },
      ],
      resolveModel: t =>
        t.provider === 'openai'
          ? streamingModel(['Hello', ' world'], { input: 1000, output: 2000 })
          : streamingModel(['Oi'], { input: 4, output: 1 }),
      emit: e => events.push(e),
      now: fakeClock(),
    });

    expect(results).toHaveLength(2);
    const [a, b] = results;
    expect(a).toMatchObject({
      position: 0,
      status: 'success',
      output: 'Hello world',
      inputTokens: 1000,
      outputTokens: 2000,
      finishReason: 'stop',
      error: null,
    });
    // 1000 * 0.1/1M + 2000 * 0.5/1M
    expect(a!.costUsd).toBeCloseTo(0.0011, 8);
    expect(a!.ttftMs).toBeGreaterThan(0);
    expect(a!.latencyMs).toBeGreaterThanOrEqual(a!.ttftMs!);
    expect(b).toMatchObject({ output: 'Oi', costUsd: 0, status: 'success' });

    expect(events[0]).toEqual({
      type: 'start',
      targets: [
        { provider: 'openai', model: 'gpt-6-luna' },
        { provider: 'ollama', model: 'qwen2.5:0.5b' },
      ],
    });
    const deltas = events.filter(e => e.type === 'delta');
    expect(deltas).toContainEqual({ type: 'delta', index: 0, text: 'Hello' });
    expect(deltas).toContainEqual({ type: 'delta', index: 1, text: 'Oi' });
    expect(events.filter(e => e.type === 'result')).toHaveLength(2);
  });

  it('runs models in parallel, not sequentially', async () => {
    let inFlight = 0;
    let maxInFlight = 0;
    const slow = () => ({
      ...streamingModel(['x']),
      doStream: async (...args: unknown[]) => {
        inFlight++;
        maxInFlight = Math.max(maxInFlight, inFlight);
        await new Promise(r => setTimeout(r, 20));
        inFlight--;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return streamingModel(['x']).doStream(...(args as [any]));
      },
    });
    await runComparison({
      prompt: 'hi',
      targets: [
        { provider: 'ollama', model: 'a' },
        { provider: 'ollama', model: 'b' },
        { provider: 'ollama', model: 'c' },
      ],
      resolveModel: () => slow() as never,
    });
    expect(maxInFlight).toBe(3);
  });

  it('isolates errors per model', async () => {
    const results = await runComparison({
      prompt: 'hi',
      targets: [
        { provider: 'openai', model: 'gpt-6-luna' },
        { provider: 'anthropic', model: 'claude-haiku-5-5' },
        { provider: 'ollama', model: 'missing' },
      ],
      resolveModel: t => {
        if (t.provider === 'anthropic') return failingModel('401 invalid key');
        if (t.model === 'missing') throw new Error('model not found');
        return streamingModel(['ok']);
      },
    });

    expect(results.map(r => r.status)).toEqual(['success', 'error', 'error']);
    expect(results[1]!.error).toContain('401 invalid key');
    expect(results[2]!.error).toBe('model not found');
    expect(results[1]!.latencyMs).not.toBeNull();
    expect(results[1]!.costUsd).toBeNull();
  });
});

describe('createCompareStream', () => {
  it('streams NDJSON and persists the run before `done`', async () => {
    const persist = vi.fn().mockResolvedValue({ id: 'run-1' });
    const events = await readNdjson(
      createCompareStream({
        prompt: 'hi',
        targets: [{ provider: 'ollama', model: 'qwen2.5:0.5b' }],
        resolveModel: () => streamingModel(['a', 'b']),
        persist,
      })
    );

    expect(events.map(e => e.type)).toEqual([
      'start',
      'delta',
      'delta',
      'result',
      'done',
    ]);
    expect(persist).toHaveBeenCalledOnce();
    expect(persist.mock.calls[0]![0][0].output).toBe('ab');
    const done = events.at(-1);
    expect(done).toMatchObject({ type: 'done', runId: 'run-1' });
  });

  it('reports a persistence failure without dropping results', async () => {
    const events = await readNdjson(
      createCompareStream({
        prompt: 'hi',
        targets: [{ provider: 'ollama', model: 'qwen2.5:0.5b' }],
        resolveModel: () => streamingModel(['a']),
        persist: () => Promise.reject(new Error('db down')),
      })
    );
    expect(events).toContainEqual({
      type: 'fatal',
      message: 'Run not saved: db down',
    });
    expect(events.at(-1)).toMatchObject({ type: 'done', runId: null });
  });
});

describe('errorMessage', () => {
  it('normalises unknown error shapes', () => {
    expect(errorMessage(new Error('x'))).toBe('x');
    expect(errorMessage('y')).toBe('y');
    expect(errorMessage({ code: 1 })).toBe('{"code":1}');
  });
});
