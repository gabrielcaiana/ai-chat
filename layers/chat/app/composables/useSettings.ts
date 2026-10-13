// useSettings.ts — global state for AI provider, model, and API token
//
// This composable is the single source of truth for user-configured AI settings.
// State is stored in Nuxt's useState() (SSR-safe global reactive state) and
// persisted to localStorage so settings survive page refreshes.
//
// Why useState and not a plain ref?
//   useState() creates a key-scoped global — any component that calls useSettings()
//   gets the same reactive state. A plain ref would create isolated instances.
//
// Usage pattern:
//   1. Call load() once on app mount (AppSidebar does this)
//   2. Read currentModel / currentProvider anywhere in the UI
//   3. Settings → openSettings() → user saves → save() → localStorage updated
//   4. useChat() reads apiToken/selectedModel/selectedProvider to pass to the API
//
// Adding a new provider: add an entry to AI_PROVIDERS (shared/catalog/models.ts), install the SDK,
// and add a `case` to createModel() in ai-service.ts. That's it.

// The provider/model catalog (with prices) lives in layers/chat/shared/catalog/models.ts
// so the server can use the same table to estimate costs.
import { AI_PROVIDERS } from '../../shared/catalog/models';
import type { ModelOption, Provider } from '../../shared/catalog/models';

export { AI_PROVIDERS };
export type { ModelOption, Provider };

export function useSettings() {
  // Global reactive state — shared across all component instances via useState key
  const isSettingsOpen = useState<boolean>('settings.modal.open', () => false);
  const apiToken = useState<string>('settings.apiToken', () => '');
  const selectedModel = useState<string>(
    'settings.selectedModel',
    () => 'gpt-6-luna'
  );
  const selectedProvider = useState<string>(
    'settings.selectedProvider',
    () => 'openai'
  );

  // streamingMode controls which endpoint useChat uses to get AI responses:
  //   true  → POST /messages/stream  (streamText  — token-by-token, real-time UX)
  //   false → POST /messages/generate (generateText — waits for full response)
  // Useful for comparing latency/UX between the two approaches in this lab.
  const streamingMode = useState<boolean>('settings.streamingMode', () => true);

  // Derived state — automatically recomputes when selectedProvider/selectedModel changes
  const currentProvider = computed(
    () =>
      AI_PROVIDERS.find(p => p.id === selectedProvider.value) ??
      AI_PROVIDERS[0]!
  );

  const availableModels = computed(() => currentProvider.value.models);

  const currentModel = computed(
    () =>
      availableModels.value.find(m => m.value === selectedModel.value) ??
      availableModels.value[0]!
  );

  function openSettings() {
    isSettingsOpen.value = true;
  }

  function closeSettings() {
    isSettingsOpen.value = false;
  }

  // selectProvider — switches the active provider and resets the model to that
  // provider's first option, avoiding a state where selectedModel doesn't exist
  // in the newly selected provider's model list.
  function selectProvider(id: string) {
    selectedProvider.value = id;
    const provider = AI_PROVIDERS.find(p => p.id === id);
    if (provider?.models[0]) {
      selectedModel.value = provider.models[0].value;
    }
  }

  // save — persists settings to localStorage and closes the modal.
  // localStorage is only accessed client-side (import.meta.client guard) to
  // avoid SSR errors since localStorage doesn't exist on the server.
  function save() {
    if (import.meta.client) {
      localStorage.setItem('ai_api_token', apiToken.value);
      localStorage.setItem('ai_selected_model', selectedModel.value);
      localStorage.setItem('ai_provider', selectedProvider.value);
      localStorage.setItem('ai_streaming_mode', String(streamingMode.value));
    }
    closeSettings();
  }

  // load — hydrates state from localStorage on app mount.
  // Called in AppSidebar.onMounted() so settings are restored before the first
  // message is sent. Safe to call multiple times (reads are idempotent).
  function load() {
    if (import.meta.client) {
      const token = localStorage.getItem('ai_api_token');
      const model = localStorage.getItem('ai_selected_model');
      const provider = localStorage.getItem('ai_provider');
      const streaming = localStorage.getItem('ai_streaming_mode');
      if (token !== null) apiToken.value = token;
      if (model) selectedModel.value = model;
      if (provider) selectedProvider.value = provider;
      if (streaming !== null) streamingMode.value = streaming !== 'false';
    }
  }

  return {
    isSettingsOpen,
    apiToken,
    selectedModel,
    selectedProvider,
    streamingMode,
    currentProvider,
    currentModel,
    availableModels,
    providers: AI_PROVIDERS,
    openSettings,
    closeSettings,
    selectProvider,
    save,
    load,
  };
}
