// compare.ts — types shared by the compare service (server) and the
// Compare page (client). The wire format is NDJSON of CompareEvent.

export interface CompareTarget {
  provider: string;
  model: string;
}

export interface CompareResult extends CompareTarget {
  position: number;
  status: 'success' | 'error';
  output: string;
  error: string | null;
  finishReason: string | null;
  ttftMs: number | null;
  latencyMs: number | null;
  inputTokens: number | null;
  outputTokens: number | null;
  costUsd: number | null;
}

// Events streamed to the browser as NDJSON (one JSON object per line).
export type CompareEvent =
  | { type: 'start'; targets: CompareTarget[] }
  | { type: 'delta'; index: number; text: string }
  | { type: 'result'; index: number; result: CompareResult }
  | { type: 'done'; runId: string | null; results: CompareResult[] }
  | { type: 'fatal'; message: string };

// Persisted shape returned by GET /api/compare/runs
export interface CompareRun {
  id: string;
  prompt: string;
  createdAt: string;
  results: (CompareResult & { id: string })[];
}
