<script setup lang="ts">
  // CompareColumn — one model's live output + metrics footer.
  // While streaming we render plain text (cheap, no re-parse per token);
  // once finished we switch to the Markdown renderer.
  import type { CompareColumn } from '../composables/useCompare';
  import { findModel } from '../../shared/catalog/models';

  const props = defineProps<{ column: CompareColumn; index: number }>();

  const label = computed(
    () =>
      findModel(props.column.provider, props.column.model)?.label ??
      props.column.model
  );

  function ms(v: number | null | undefined) {
    if (v === null || v === undefined) return '—';
    return v >= 1000 ? `${(v / 1000).toFixed(2)} s` : `${v} ms`;
  }

  function usd(v: number | null | undefined) {
    if (v === null || v === undefined) return 'n/a';
    if (v === 0) return '$0';
    return v < 0.01 ? `$${v.toFixed(6)}` : `$${v.toFixed(4)}`;
  }

  const tokensPerSecond = computed(() => {
    const r = props.column.result;
    if (!r?.outputTokens || !r.latencyMs || r.ttftMs === null) return null;
    const genMs = r.latencyMs - r.ttftMs;
    return genMs > 0 ? Math.round((r.outputTokens / genMs) * 1000) : null;
  });
</script>

<template>
  <section
    class="cc"
    :class="`cc--${column.status}`"
    :data-testid="`compare-column-${index}`"
  >
    <header class="cc__head">
      <span class="cc__dot" />
      <span class="cc__model">{{ label }}</span>
      <span class="cc__provider">{{ column.provider }}</span>
    </header>

    <div class="cc__body">
      <p v-if="column.status === 'error'" class="cc__error">
        <UIcon name="i-lucide-triangle-alert" />
        {{ column.result?.error ?? 'Request failed' }}
      </p>
      <MarkdownRenderer
        v-else-if="column.status === 'success' && column.output"
        :content="column.output"
        :cache-key="`compare-${index}-${column.model}`"
      />
      <pre v-else class="cc__stream">{{ column.output }}<span
          v-if="column.status === 'streaming'"
          class="cc__caret"
        /></pre>
    </div>

    <footer class="cc__metrics" data-testid="compare-metrics">
      <div class="cc__metric">
        <span>TTFT</span><strong>{{ ms(column.result?.ttftMs) }}</strong>
      </div>
      <div class="cc__metric">
        <span>Total</span><strong>{{ ms(column.result?.latencyMs) }}</strong>
      </div>
      <div class="cc__metric">
        <span>Tokens in/out</span>
        <strong>
          {{ column.result?.inputTokens ?? '—' }} /
          {{ column.result?.outputTokens ?? '—' }}
        </strong>
      </div>
      <div class="cc__metric">
        <span>tok/s</span><strong>{{ tokensPerSecond ?? '—' }}</strong>
      </div>
      <div class="cc__metric">
        <span>Est. cost</span><strong>{{ usd(column.result?.costUsd) }}</strong>
      </div>
    </footer>
  </section>
</template>

<style scoped>
  .cc {
    display: flex;
    flex-direction: column;
    min-width: 0;
    min-height: 0;
    background: var(--h-surface);
    border: 1px solid var(--h-border);
    border-radius: var(--ui-radius);
    overflow: hidden;
  }

  .cc--streaming {
    border-color: var(--h-cyan-border);
  }

  .cc--error {
    border-color: rgba(248, 113, 113, 0.35);
  }

  .cc__head {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.625rem 0.875rem;
    border-bottom: 1px solid var(--h-border);
    font-size: 0.8125rem;
  }

  .cc__dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: var(--ui-text-dimmed);
  }

  .cc--streaming .cc__dot {
    background: var(--h-cyan);
    box-shadow: 0 0 8px var(--h-cyan);
    animation: cc-pulse 1s infinite;
  }

  .cc--success .cc__dot {
    background: #34d399;
  }

  .cc--error .cc__dot {
    background: #f87171;
  }

  .cc__model {
    font-weight: 600;
    color: var(--ui-text-highlighted);
  }

  .cc__provider {
    margin-left: auto;
    font-family: var(--font-mono);
    font-size: 0.6875rem;
    color: var(--ui-text-dimmed);
    text-transform: uppercase;
    letter-spacing: 0.06em;
  }

  .cc__body {
    flex: 1;
    overflow-y: auto;
    padding: 0.875rem;
    font-size: 0.875rem;
    line-height: 1.6;
  }

  .cc__stream {
    margin: 0;
    white-space: pre-wrap;
    word-break: break-word;
    font-family: var(--font-sans);
    color: var(--ui-text);
  }

  .cc__caret {
    display: inline-block;
    width: 7px;
    height: 1em;
    margin-left: 2px;
    vertical-align: text-bottom;
    background: var(--h-cyan);
    animation: cc-pulse 0.8s infinite;
  }

  .cc__error {
    display: flex;
    gap: 0.5rem;
    color: #fca5a5;
    font-size: 0.8125rem;
    word-break: break-word;
  }

  .cc__metrics {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(68px, 1fr));
    row-gap: 0.5rem;
    gap: 0.25rem;
    padding: 0.625rem 0.875rem;
    border-top: 1px solid var(--h-border);
    background: var(--h-surface-2);
  }

  .cc__metric {
    display: flex;
    flex-direction: column;
    gap: 0.125rem;
    min-width: 0;
  }

  .cc__metric span {
    font-size: 0.625rem;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: var(--ui-text-dimmed);
  }

  .cc__metric strong {
    font-family: var(--font-mono);
    font-size: 0.75rem;
    font-weight: 500;
    color: var(--ui-text);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  @keyframes cc-pulse {
    50% {
      opacity: 0.35;
    }
  }
</style>
