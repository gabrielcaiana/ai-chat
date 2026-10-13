// compare-service.ts — fan one prompt out to N models and measure each one
//
// This is the engine behind the side-by-side Compare page. It is deliberately
// free of HTTP and DB concerns so it can be unit-tested with mock models:
//
//   runComparison({ prompt, targets, resolveModel, emit })
//     ├─ for each target, in parallel:
//     │    streamText(model, prompt)
//     │      text-delta → emit({ type: 'delta' })   ← live column in the UI
//     │      first delta → TTFT (time to first token)
//     │      finish      → total latency + token usage + estimated cost
//     │      error       → captured per model, never fails the whole run
//     └─ resolves with one CompareResult per target (same order as input)
//
// Errors are isolated on purpose: one model timing out or a missing API key
// should not hide the results of the others — that's the whole point of a
// comparison.

import { streamText } from 'ai';
import type { LanguageModel } from 'ai';
import { estimateCostUsd } from '../../shared/catalog/models';

import type {
  CompareTarget,
  CompareResult,
  CompareEvent,
} from '../../shared/catalog/compare';

export type { CompareTarget, CompareResult, CompareEvent };

export interface RunComparisonOptions {
  prompt: string;
  targets: CompareTarget[];
  resolveModel: (target: CompareTarget) => LanguageModel;
  emit?: (event: CompareEvent) => void;
  abortSignal?: AbortSignal;
  /** Injectable clock, used by tests for deterministic timings. */
  now?: () => number;
}

export function errorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (typeof error === 'string') return error;
  try {
    return JSON.stringify(error);
  } catch {
    return 'Unknown error';
  }
}

async function runOne(
  target: CompareTarget,
  index: number,
  opts: RunComparisonOptions
): Promise<CompareResult> {
  const now = opts.now ?? (() => performance.now());
  const emit = opts.emit ?? (() => {});
  const startedAt = now();

  const result: CompareResult = {
    ...target,
    position: index,
    status: 'success',
    output: '',
    error: null,
    finishReason: null,
    ttftMs: null,
    latencyMs: null,
    inputTokens: null,
    outputTokens: null,
    costUsd: null,
  };

  try {
    const model = opts.resolveModel(target);
    const stream = streamText({
      model,
      prompt: opts.prompt,
      // No silent retries: we want to measure the real first attempt.
      maxRetries: 0,
      abortSignal: opts.abortSignal,
    });

    for await (const part of stream.fullStream) {
      if (part.type === 'text-delta') {
        if (!part.text) continue;
        if (result.ttftMs === null) {
          result.ttftMs = Math.round(now() - startedAt);
        }
        result.output += part.text;
        emit({ type: 'delta', index, text: part.text });
      } else if (part.type === 'error') {
        throw part.error;
      } else if (part.type === 'abort') {
        throw new Error('Aborted');
      } else if (part.type === 'finish') {
        result.finishReason = part.finishReason ?? null;
        result.inputTokens = part.totalUsage.inputTokens ?? null;
        result.outputTokens = part.totalUsage.outputTokens ?? null;
      }
    }

    result.costUsd = estimateCostUsd(
      target.provider,
      target.model,
      result.inputTokens,
      result.outputTokens
    );
  } catch (error) {
    result.status = 'error';
    result.error = errorMessage(error);
  } finally {
    result.latencyMs = Math.round(now() - startedAt);
  }

  emit({ type: 'result', index, result });
  return result;
}

export async function runComparison(
  opts: RunComparisonOptions
): Promise<CompareResult[]> {
  opts.emit?.({ type: 'start', targets: opts.targets });
  return Promise.all(opts.targets.map((t, i) => runOne(t, i, opts)));
}

// createCompareStream — wraps runComparison in an NDJSON ReadableStream.
//
// Each line is a CompareEvent. After every model settles, the run is handed
// to `persist` (DB write) and a final `done` event carries the run id, so the
// UI can link to it in the history list. Persistence failures are reported as
// `fatal` but do not discard the results already streamed.
export function createCompareStream(
  opts: Omit<RunComparisonOptions, 'emit'> & {
    persist?: (results: CompareResult[]) => Promise<{ id: string } | null>;
  }
): ReadableStream<Uint8Array> {
  const encoder = new TextEncoder();
  return new ReadableStream<Uint8Array>({
    async start(controller) {
      const send = (event: CompareEvent) =>
        controller.enqueue(encoder.encode(JSON.stringify(event) + '\n'));

      const results = await runComparison({ ...opts, emit: send });

      let runId: string | null = null;
      try {
        runId = (await opts.persist?.(results))?.id ?? null;
      } catch (error) {
        send({
          type: 'fatal',
          message: `Run not saved: ${errorMessage(error)}`,
        });
      }

      send({ type: 'done', runId, results });
      controller.close();
    },
  });
}
