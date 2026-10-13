<script setup lang="ts">
  // /compare — run one prompt against several models side by side.
  // See useCompare() for the streaming flow and compare-service.ts for metrics.
  import { AI_PROVIDERS } from '../../../shared/catalog/models';
  import type { CompareRun } from '../../../shared/catalog/compare';

  useHead({ title: 'Compare models · AI Lab' });

  const {
    targets,
    columns,
    isRunning,
    fatal,
    history,
    run,
    loadRun,
    addTarget,
    removeTarget,
  } = useCompare();
  const { load } = useSettings();
  onMounted(load);

  const prompt = ref(
    'Explain in 3 short bullet points what "time to first token" means.'
  );
  const newProvider = ref(AI_PROVIDERS[2]!.id);
  const newModel = ref(AI_PROVIDERS[2]!.models[0]!.value);
  const modelsForNew = computed(
    () => AI_PROVIDERS.find(p => p.id === newProvider.value)?.models ?? []
  );
  watch(newProvider, () => {
    newModel.value = modelsForNew.value[0]?.value ?? '';
  });

  function submit() {
    run(prompt.value);
  }

  function selectRun(r: CompareRun) {
    prompt.value = r.prompt;
    loadRun(r);
  }

  function summary(r: CompareRun) {
    const ok = r.results.filter(x => x.status === 'success').length;
    return `${ok}/${r.results.length} ok`;
  }

  function when(iso: string) {
    return new Date(iso).toLocaleString(undefined, {
      dateStyle: 'short',
      timeStyle: 'short',
    });
  }
</script>

<template>
  <div class="cmp">
    <div class="cmp__main">
      <form class="cmp__form" @submit.prevent="submit">
        <div class="cmp__title">
          <UIcon name="i-lucide-columns-3" />
          <h1>Compare models</h1>
          <span class="cmp__hint">same prompt · parallel · streamed</span>
        </div>

        <textarea
          v-model="prompt"
          class="cmp__prompt"
          rows="3"
          placeholder="Type a prompt to send to every model…"
          data-testid="compare-prompt"
          @keydown.meta.enter="submit"
          @keydown.ctrl.enter="submit"
        />

        <div class="cmp__targets">
          <span
            v-for="(t, i) in targets"
            :key="`${t.provider}-${t.model}-${i}`"
            class="cmp__chip"
          >
            <span class="cmp__chip-provider">{{ t.provider }}</span>
            {{ t.model }}
            <button
              type="button"
              class="cmp__chip-x"
              :aria-label="`Remove ${t.model}`"
              @click="removeTarget(i)"
            >
              <UIcon name="i-lucide-x" />
            </button>
          </span>

          <div v-if="targets.length < 6" class="cmp__add">
            <select
              v-model="newProvider"
              class="cmp__select"
              aria-label="Provider"
            >
              <option v-for="p in AI_PROVIDERS" :key="p.id" :value="p.id">
                {{ p.label }}
              </option>
            </select>
            <select v-model="newModel" class="cmp__select" aria-label="Model">
              <option v-for="m in modelsForNew" :key="m.value" :value="m.value">
                {{ m.label }}
              </option>
            </select>
            <UButton
              type="button"
              size="xs"
              color="neutral"
              variant="soft"
              icon="i-lucide-plus"
              @click="addTarget({ provider: newProvider, model: newModel })"
            >
              Add
            </UButton>
          </div>

          <UButton
            type="submit"
            class="cmp__run"
            icon="i-lucide-play"
            :loading="isRunning"
            :disabled="!targets.length || !prompt.trim()"
            data-testid="compare-run"
          >
            Run {{ targets.length }} models
          </UButton>
        </div>
        <p v-if="fatal" class="cmp__fatal">{{ fatal }}</p>
      </form>

      <div
        v-if="columns.length"
        class="cmp__grid"
        :style="{ '--cols': columns.length }"
      >
        <CompareColumn
          v-for="(col, i) in columns"
          :key="i"
          :column="col"
          :index="i"
        />
      </div>
      <div v-else class="cmp__empty">
        <UIcon name="i-lucide-flask-conical" />
        <p>Pick models, write a prompt and hit Run. Results are saved below.</p>
      </div>
    </div>

    <aside class="cmp__history" data-testid="compare-history">
      <h2>Run history</h2>
      <p v-if="!history?.length" class="cmp__history-empty">No runs yet.</p>
      <button
        v-for="r in history"
        :key="r.id"
        type="button"
        class="cmp__run-item"
        @click="selectRun(r)"
      >
        <span class="cmp__run-prompt">{{ r.prompt }}</span>
        <span class="cmp__run-meta">
          {{ when(r.createdAt) }} · {{ r.results.length }} models ·
          {{ summary(r) }}
        </span>
      </button>
    </aside>
  </div>
</template>

<style scoped>
  .cmp {
    display: flex;
    height: 100%;
    min-height: 0;
  }

  .cmp__main {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 1.25rem;
    min-width: 0;
    min-height: 0;
  }

  .cmp__form {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .cmp__title {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: var(--h-cyan);
  }

  .cmp__title h1 {
    font-size: 1rem;
    font-weight: 600;
    color: var(--ui-text-highlighted);
  }

  .cmp__hint {
    font-family: var(--font-mono);
    font-size: 0.6875rem;
    color: var(--ui-text-dimmed);
  }

  .cmp__prompt {
    width: 100%;
    resize: vertical;
    padding: 0.75rem;
    background: var(--h-surface);
    border: 1px solid var(--h-border);
    border-radius: var(--ui-radius);
    color: var(--ui-text);
    font: inherit;
    font-size: 0.875rem;
  }

  .cmp__prompt:focus {
    outline: none;
    border-color: var(--h-cyan-border);
  }

  .cmp__targets {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 0.5rem;
  }

  .cmp__chip {
    display: inline-flex;
    align-items: center;
    gap: 0.375rem;
    padding: 0.25rem 0.25rem 0.25rem 0.625rem;
    background: var(--h-cyan-dim);
    border: 1px solid var(--h-cyan-border);
    border-radius: 999px;
    font-family: var(--font-mono);
    font-size: 0.75rem;
    color: var(--ui-text);
  }

  .cmp__chip-provider {
    color: var(--h-cyan);
  }

  .cmp__chip-x {
    display: inline-flex;
    padding: 0.125rem;
    border-radius: 999px;
    color: var(--ui-text-muted);
  }

  .cmp__chip-x:hover {
    background: var(--h-surface-3);
  }

  .cmp__add {
    display: inline-flex;
    gap: 0.375rem;
  }

  .cmp__select {
    padding: 0.25rem 0.5rem;
    background: var(--h-surface);
    border: 1px solid var(--h-border);
    border-radius: var(--ui-radius);
    color: var(--ui-text);
    font-size: 0.75rem;
  }

  .cmp__run {
    margin-left: auto;
  }

  .cmp__fatal {
    color: #fca5a5;
    font-size: 0.8125rem;
  }

  .cmp__grid {
    flex: 1;
    min-height: 0;
    display: grid;
    grid-template-columns: repeat(var(--cols), minmax(260px, 1fr));
    gap: 0.75rem;
    overflow-x: auto;
  }

  .cmp__empty {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    color: var(--ui-text-dimmed);
    font-size: 0.875rem;
  }

  .cmp__history {
    width: 260px;
    flex-shrink: 0;
    padding: 1.25rem 0.75rem;
    border-left: 1px solid var(--h-border);
    overflow-y: auto;
  }

  .cmp__history h2 {
    margin-bottom: 0.75rem;
    font-size: 0.6875rem;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--ui-text-dimmed);
  }

  .cmp__history-empty {
    font-size: 0.8125rem;
    color: var(--ui-text-dimmed);
  }

  .cmp__run-item {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    width: 100%;
    padding: 0.5rem;
    border-radius: var(--ui-radius);
    text-align: left;
  }

  .cmp__run-item:hover {
    background: var(--h-surface-3);
  }

  .cmp__run-prompt {
    font-size: 0.8125rem;
    color: var(--ui-text);
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .cmp__run-meta {
    font-family: var(--font-mono);
    font-size: 0.625rem;
    color: var(--ui-text-dimmed);
  }
</style>
