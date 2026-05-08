<script setup lang="ts">
  const {
    isSettingsOpen,
    apiToken,
    selectedModel,
    selectedProvider,
    streamingMode,
    currentProvider,
    providers,
    closeSettings,
    selectProvider,
    save,
  } = useSettings();

  const showToken = ref(false);

  function handleClose() {
    closeSettings();
  }
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="isSettingsOpen" class="sm-backdrop" @click.self="handleClose">
        <div class="sm-panel">
          <!-- Header -->
          <div class="sm-header">
            <div class="sm-header__left">
              <div class="sm-header__icon">
                <UIcon name="i-lucide-sliders-horizontal" />
              </div>
              <div>
                <h2 class="sm-header__title">Configuration</h2>
                <p class="sm-header__sub">AI provider and model preferences</p>
              </div>
            </div>
            <button class="sm-close" @click="handleClose">
              <UIcon name="i-lucide-x" />
            </button>
          </div>

          <div class="sm-body">
            <!-- Provider selector -->
            <div class="sm-section">
              <label class="sm-label">Provider</label>
              <div class="sm-provider-tabs">
                <button
                  v-for="p in providers"
                  :key="p.id"
                  class="sm-provider-tab"
                  :class="{
                    'sm-provider-tab--active': selectedProvider === p.id,
                  }"
                  @click="selectProvider(p.id)"
                >
                  {{ p.label }}
                </button>
              </div>
            </div>

            <!-- API Token -->
            <div class="sm-section">
              <label class="sm-label" for="api-token">API Token</label>
              <div class="sm-token-wrapper">
                <input
                  id="api-token"
                  v-model="apiToken"
                  class="sm-token-input"
                  :type="showToken ? 'text' : 'password'"
                  placeholder="Enter your API key..."
                  autocomplete="off"
                  spellcheck="false"
                />
                <button
                  class="sm-token-toggle"
                  :title="showToken ? 'Hide token' : 'Show token'"
                  @click="showToken = !showToken"
                >
                  <UIcon
                    :name="showToken ? 'i-lucide-eye-off' : 'i-lucide-eye'"
                  />
                </button>
              </div>
              <p class="sm-hint">
                <UIcon name="i-lucide-lock" class="sm-hint__icon" />
                Stored locally in your browser only
              </p>
            </div>

            <!-- Response mode toggle -->
            <!-- Lets you compare streaming (token-by-token) vs sync (full response at once) -->
            <div class="sm-section">
              <label class="sm-label">Response Mode</label>
              <div class="sm-provider-tabs">
                <button
                  class="sm-provider-tab"
                  :class="{ 'sm-provider-tab--active': streamingMode }"
                  @click="streamingMode = true"
                >
                  <UIcon
                    name="i-lucide-zap"
                    style="font-size: 0.75rem; margin-right: 0.3rem"
                  />
                  Streaming
                </button>
                <button
                  class="sm-provider-tab"
                  :class="{ 'sm-provider-tab--active': !streamingMode }"
                  @click="streamingMode = false"
                >
                  <UIcon
                    name="i-lucide-square"
                    style="font-size: 0.75rem; margin-right: 0.3rem"
                  />
                  Sync
                </button>
              </div>
              <p class="sm-hint">
                <UIcon name="i-lucide-info" class="sm-hint__icon" />
                {{
                  streamingMode
                    ? 'Tokens arrive in real time (streamText)'
                    : 'Waits for the full response (generateText)'
                }}
              </p>
            </div>

            <!-- Model selector -->
            <div class="sm-section">
              <label class="sm-label">Model</label>
              <div class="sm-model-list">
                <label
                  v-for="model in currentProvider.models"
                  :key="model.value"
                  class="sm-model-item"
                  :class="{
                    'sm-model-item--active': selectedModel === model.value,
                  }"
                >
                  <input
                    v-model="selectedModel"
                    type="radio"
                    :value="model.value"
                    class="sm-model-radio"
                  />
                  <div class="sm-model-info">
                    <span class="sm-model-name">{{ model.label }}</span>
                    <span class="sm-model-desc">{{ model.description }}</span>
                  </div>
                  <span class="sm-model-ctx">{{ model.context }}</span>
                </label>
              </div>
            </div>
          </div>

          <!-- Footer -->
          <div class="sm-footer">
            <button class="sm-btn sm-btn--ghost" @click="handleClose">
              Cancel
            </button>
            <button class="sm-btn sm-btn--primary" @click="save">
              <UIcon name="i-lucide-check" />
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
  .sm-backdrop {
    position: fixed;
    inset: 0;
    background: rgba(3, 6, 14, 0.82);
    backdrop-filter: blur(6px);
    z-index: 200;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1rem;
  }

  .sm-panel {
    width: 100%;
    max-width: 520px;
    background: var(--h-surface);
    border: 1px solid var(--h-border);
    border-radius: 10px;
    box-shadow:
      0 0 0 1px rgba(14, 165, 233, 0.06),
      0 24px 64px rgba(0, 0, 0, 0.6),
      0 8px 24px rgba(0, 0, 0, 0.4);
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  /* Header */
  .sm-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1.25rem 1.5rem;
    border-bottom: 1px solid var(--h-border);
    background: var(--h-surface-2);
  }

  .sm-header__left {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .sm-header__icon {
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--h-cyan-dim);
    border: 1px solid var(--h-cyan-border);
    border-radius: 8px;
    color: var(--h-cyan);
    font-size: 1rem;
    flex-shrink: 0;
  }

  .sm-header__title {
    font-size: 0.9375rem;
    font-weight: 600;
    color: var(--ui-text-highlighted);
    line-height: 1.3;
  }

  .sm-header__sub {
    font-size: 0.75rem;
    color: var(--ui-text-dimmed);
    margin-top: 1px;
  }

  .sm-close {
    width: 28px;
    height: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 6px;
    color: var(--ui-text-dimmed);
    transition:
      background 0.15s,
      color 0.15s;
    flex-shrink: 0;
  }
  .sm-close:hover {
    background: var(--h-surface-3);
    color: var(--ui-text);
  }

  /* Body */
  .sm-body {
    padding: 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    overflow-y: auto;
  }

  .sm-section {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .sm-label {
    font-size: 0.6875rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--ui-text-dimmed);
  }

  /* Provider tabs */
  .sm-provider-tabs {
    display: flex;
    gap: 0.375rem;
    background: var(--h-surface-2);
    border: 1px solid var(--h-border);
    border-radius: 8px;
    padding: 0.25rem;
  }

  .sm-provider-tab {
    flex: 1;
    padding: 0.4375rem 0.75rem;
    font-size: 0.8125rem;
    font-weight: 500;
    border-radius: 6px;
    color: var(--ui-text-muted);
    transition:
      background 0.15s,
      color 0.15s;
    text-align: center;
  }

  .sm-provider-tab:hover {
    color: var(--ui-text);
    background: var(--h-surface-3);
  }

  .sm-provider-tab--active {
    background: var(--h-cyan-dim);
    color: var(--h-cyan);
    border: 1px solid var(--h-cyan-border);
  }

  /* Token input */
  .sm-token-wrapper {
    display: flex;
    align-items: center;
    background: var(--h-surface-2);
    border: 1px solid var(--h-border);
    border-radius: 8px;
    transition:
      border-color 0.15s,
      box-shadow 0.15s;
    overflow: hidden;
  }

  .sm-token-wrapper:focus-within {
    border-color: var(--h-cyan-border);
    box-shadow: 0 0 0 3px var(--h-cyan-dim);
  }

  .sm-token-input {
    flex: 1;
    padding: 0.6rem 0.875rem;
    background: transparent;
    border: none;
    outline: none;
    font-family: var(--font-mono);
    font-size: 0.8125rem;
    color: var(--ui-text);
    letter-spacing: 0.02em;
  }

  .sm-token-input::placeholder {
    color: var(--ui-text-dimmed);
    font-family: var(--font-sans);
  }

  .sm-token-toggle {
    padding: 0.5rem 0.75rem;
    color: var(--ui-text-dimmed);
    transition: color 0.15s;
    border-left: 1px solid var(--h-border);
  }
  .sm-token-toggle:hover {
    color: var(--ui-text-muted);
  }

  .sm-hint {
    display: flex;
    align-items: center;
    gap: 0.3rem;
    font-size: 0.7rem;
    color: var(--ui-text-dimmed);
  }
  .sm-hint__icon {
    font-size: 0.65rem;
  }

  /* Model list */
  .sm-model-list {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    background: var(--h-surface-2);
    border: 1px solid var(--h-border);
    border-radius: 8px;
    overflow: hidden;
  }

  .sm-model-item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem 1rem;
    cursor: pointer;
    transition: background 0.12s;
    border-bottom: 1px solid var(--h-border);
  }
  .sm-model-item:last-child {
    border-bottom: none;
  }
  .sm-model-item:hover {
    background: var(--h-surface-3);
  }

  .sm-model-item--active {
    background: var(--h-cyan-dim);
  }
  .sm-model-item--active:hover {
    background: rgba(14, 165, 233, 0.1);
  }

  .sm-model-radio {
    width: 14px;
    height: 14px;
    accent-color: var(--h-cyan);
    flex-shrink: 0;
    cursor: pointer;
  }

  .sm-model-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 1px;
  }

  .sm-model-name {
    font-size: 0.8125rem;
    font-weight: 500;
    color: var(--ui-text);
  }

  .sm-model-item--active .sm-model-name {
    color: var(--h-cyan);
  }

  .sm-model-desc {
    font-size: 0.7rem;
    color: var(--ui-text-dimmed);
  }

  .sm-model-ctx {
    font-family: var(--font-mono);
    font-size: 0.6875rem;
    color: var(--ui-text-dimmed);
    background: var(--h-surface-3);
    padding: 0.1875rem 0.5rem;
    border-radius: 4px;
    flex-shrink: 0;
  }

  /* Footer */
  .sm-footer {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 0.625rem;
    padding: 1rem 1.5rem;
    border-top: 1px solid var(--h-border);
    background: var(--h-surface-2);
  }

  .sm-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.375rem;
    padding: 0.5rem 1rem;
    font-size: 0.8125rem;
    font-weight: 500;
    border-radius: 6px;
    transition:
      background 0.15s,
      color 0.15s,
      border-color 0.15s;
  }

  .sm-btn--ghost {
    color: var(--ui-text-muted);
    border: 1px solid var(--h-border);
  }
  .sm-btn--ghost:hover {
    background: var(--h-surface-3);
    color: var(--ui-text);
  }

  .sm-btn--primary {
    background: var(--h-cyan);
    color: #000;
    font-weight: 600;
  }
  .sm-btn--primary:hover {
    background: #38bdf8;
  }

  /* Modal transitions */
  .modal-enter-active,
  .modal-leave-active {
    transition: opacity 0.2s ease;
  }
  .modal-enter-active .sm-panel,
  .modal-leave-active .sm-panel {
    transition:
      transform 0.2s ease,
      opacity 0.2s ease;
  }
  .modal-enter-from,
  .modal-leave-to {
    opacity: 0;
  }
  .modal-enter-from .sm-panel,
  .modal-leave-to .sm-panel {
    transform: translateY(-8px) scale(0.98);
    opacity: 0;
  }
</style>
