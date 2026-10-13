// useCompare.ts — client state for the side-by-side Compare page
//
// Flow:
//   run(prompt)
//     → POST /api/compare (NDJSON stream)
//     → each line is a CompareEvent:
//         delta  → append text to that model's column (live)
//         result → fill the metrics footer (TTFT, latency, tokens, cost, error)
//         done   → refresh the run history
//
// Columns are keyed by index, so the same model can appear twice (useful to
// observe non-determinism between two identical calls).

import type {
  CompareEvent,
  CompareResult,
  CompareRun,
  CompareTarget,
} from '../../shared/catalog/compare';

export interface CompareColumn extends CompareTarget {
  output: string;
  status: 'idle' | 'streaming' | 'success' | 'error';
  result: CompareResult | null;
}

export function parseNdjsonLines(buffer: string): {
  events: CompareEvent[];
  rest: string;
} {
  const lines = buffer.split('\n');
  const rest = lines.pop() ?? '';
  const events = lines
    .filter(line => line.trim())
    .map(line => JSON.parse(line) as CompareEvent);
  return { events, rest };
}

export function useCompare() {
  const { apiToken, selectedProvider } = useSettings();

  const targets = useState<CompareTarget[]>('compare.targets', () => [
    { provider: 'ollama', model: 'qwen2.5:0.5b' },
    { provider: 'ollama', model: 'smollm2:135m' },
  ]);
  const columns = ref<CompareColumn[]>([]);
  const isRunning = ref(false);
  const lastRunId = ref<string | null>(null);
  const fatal = ref<string | null>(null);

  const { data: history, refresh: refreshHistory } = useFetch<CompareRun[]>(
    '/api/compare/runs',
    { default: () => [], server: false }
  );

  function applyEvent(event: CompareEvent) {
    switch (event.type) {
      case 'delta': {
        const col = columns.value[event.index];
        if (col) col.output += event.text;
        break;
      }
      case 'result': {
        const col = columns.value[event.index];
        if (col) {
          col.result = event.result;
          col.status = event.result.status;
          col.output = event.result.output;
        }
        break;
      }
      case 'done':
        lastRunId.value = event.runId;
        break;
      case 'fatal':
        fatal.value = event.message;
        break;
    }
  }

  async function run(prompt: string) {
    if (isRunning.value || !prompt.trim() || !targets.value.length) return;
    isRunning.value = true;
    fatal.value = null;
    lastRunId.value = null;
    columns.value = targets.value.map(t => ({
      ...t,
      output: '',
      status: 'streaming',
      result: null,
    }));

    // The Settings modal stores one key for the selected provider; forward it
    // only for that provider. The server falls back to env vars for the rest.
    const apiKeys: Record<string, string> = {};
    if (apiToken.value && selectedProvider.value !== 'ollama') {
      apiKeys[selectedProvider.value] = apiToken.value;
    }

    try {
      const stream = await $fetch<ReadableStream<Uint8Array>>('/api/compare', {
        method: 'POST',
        responseType: 'stream',
        body: { prompt, targets: targets.value, apiKeys },
      });
      const reader = stream.pipeThrough(new TextDecoderStream()).getReader();
      let buffer = '';
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        const parsed = parseNdjsonLines(buffer + value);
        buffer = parsed.rest;
        parsed.events.forEach(applyEvent);
      }
      if (buffer.trim())
        parseNdjsonLines(buffer + '\n').events.forEach(applyEvent);
    } catch (error) {
      fatal.value = error instanceof Error ? error.message : String(error);
      columns.value.forEach(c => {
        if (c.status === 'streaming') c.status = 'error';
      });
    } finally {
      isRunning.value = false;
      await refreshHistory();
    }
  }

  // loadRun — show a past run from history in the columns
  function loadRun(saved: CompareRun) {
    columns.value = saved.results.map(r => ({
      provider: r.provider,
      model: r.model,
      output: r.output,
      status: r.status,
      result: r,
    }));
    lastRunId.value = saved.id;
  }

  function addTarget(target: CompareTarget) {
    if (targets.value.length >= 6) return;
    targets.value.push({ ...target });
  }

  function removeTarget(index: number) {
    targets.value.splice(index, 1);
  }

  return {
    targets,
    columns,
    isRunning,
    lastRunId,
    fatal,
    history,
    run,
    loadRun,
    addTarget,
    removeTarget,
    refreshHistory,
  };
}
