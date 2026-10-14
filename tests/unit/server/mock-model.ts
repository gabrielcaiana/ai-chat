// Helpers to build fake language models for server-side unit tests.
// Uses the official AI SDK test utilities so we exercise the real
// streamText/generateText code paths without any network calls.
import { MockLanguageModelV4 } from 'ai/test';
import { simulateReadableStream } from 'ai';

export function usage(input: number, output: number) {
  return {
    inputTokens: {
      total: input,
      noCache: input,
      cacheRead: undefined,
      cacheWrite: undefined,
    },
    outputTokens: { total: output, text: output, reasoning: undefined },
  };
}

export function streamingModel(
  chunks: string[],
  { input = 10, output = chunks.length, modelId = 'mock' } = {}
) {
  return new MockLanguageModelV4({
    modelId,
    doStream: async () => ({
      stream: simulateReadableStream({
        chunks: [
          { type: 'text-start', id: 't1' },
          ...chunks.map(delta => ({
            type: 'text-delta' as const,
            id: 't1',
            delta,
          })),
          { type: 'text-end', id: 't1' },
          {
            type: 'finish',
            finishReason: { unified: 'stop', raw: 'stop' },
            usage: usage(input, output),
          },
        ],
      }),
    }),
  });
}

export function failingModel(message: string) {
  return new MockLanguageModelV4({
    doStream: async () => {
      throw new Error(message);
    },
  });
}

export function generatingModel(text: string) {
  return new MockLanguageModelV4({
    doGenerate: async () => ({
      content: [{ type: 'text', text }],
      finishReason: { unified: 'stop', raw: 'stop' },
      usage: usage(5, 3),
      warnings: [],
    }),
  });
}
