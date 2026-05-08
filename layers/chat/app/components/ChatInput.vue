<script setup lang="ts">
  const { isStreaming = false } = defineProps<{
    isStreaming?: boolean;
  }>();

  const emit = defineEmits<{
    (e: 'send-message', message: string): void;
  }>();

  const { currentModel, streamingMode } = useSettings();

  const textareaRef = useTemplateRef('textareaRef');
  const newMessage = ref('');

  const handleSendMessage = () => {
    if (!newMessage.value.trim() || isStreaming) return;
    emit('send-message', newMessage.value.trim());
    newMessage.value = '';
    nextTick(() => {
      adjustTextareaHeight();
      textareaRef.value?.focus();
    });
  };

  const adjustTextareaHeight = async (): Promise<void> => {
    if (textareaRef.value) {
      textareaRef.value.style.height = 'auto';
      await nextTick();
      textareaRef.value.style.height = `${Math.min(textareaRef.value.scrollHeight, 200)}px`;
    }
  };

  onMounted(() => {
    textareaRef.value?.focus();
  });

  watch(
    () => isStreaming,
    async (value: boolean) => {
      if (!value) {
        await nextTick();
        textareaRef.value?.focus();
      }
    }
  );
</script>

<template>
  <form class="ci" @submit.prevent="handleSendMessage">
    <div class="ci__wrapper" :class="{ 'ci__wrapper--disabled': isStreaming }">
      <textarea
        ref="textareaRef"
        v-model="newMessage"
        class="ci__textarea"
        :disabled="isStreaming"
        :rows="1"
        placeholder="Send a message..."
        @input="adjustTextareaHeight"
        @keydown.enter.exact.prevent="handleSendMessage"
      />

      <div class="ci__footer">
        <div class="ci__model-badge">
          <UIcon name="i-lucide-cpu" class="ci__model-badge-icon" />
          <span>{{ currentModel?.label ?? '...' }}</span>
          <span
            class="ci__mode-tag"
            :class="
              streamingMode ? 'ci__mode-tag--stream' : 'ci__mode-tag--sync'
            "
          >
            {{ streamingMode ? 'stream' : 'sync' }}
          </span>
        </div>
        <div class="ci__actions">
          <span class="ci__hint">Enter to send</span>
          <button
            type="submit"
            class="ci__send"
            :disabled="!newMessage.trim() || isStreaming"
            :class="{ 'ci__send--active': newMessage.trim() && !isStreaming }"
          >
            <UIcon v-if="!isStreaming" name="i-lucide-send" />
            <div v-else class="ci__spinner" />
          </button>
        </div>
      </div>
    </div>
  </form>
</template>

<style scoped>
  .ci {
    width: 100%;
  }

  .ci__wrapper {
    background: var(--h-surface);
    border: 1px solid var(--h-border);
    border-radius: 12px;
    transition:
      border-color 0.15s,
      box-shadow 0.15s;
    overflow: hidden;
  }

  .ci__wrapper:focus-within {
    border-color: var(--h-cyan-border);
    box-shadow:
      0 0 0 3px var(--h-cyan-dim),
      var(--h-cyan-glow);
  }

  .ci__wrapper--disabled {
    opacity: 0.7;
  }

  .ci__textarea {
    width: 100%;
    padding: 0.875rem 1rem 0.375rem;
    background: transparent;
    border: none;
    outline: none;
    resize: none;
    font-family: var(--font-sans);
    font-size: 0.9375rem;
    color: var(--ui-text);
    line-height: 1.6;
    max-height: 200px;
    overflow-y: auto;
    scrollbar-width: thin;
    scrollbar-color: var(--h-border) transparent;
  }

  .ci__textarea::placeholder {
    color: var(--ui-text-dimmed);
  }

  .ci__textarea:disabled {
    cursor: not-allowed;
  }

  .ci__footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.375rem 0.625rem 0.625rem;
  }

  .ci__model-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.3rem;
    font-size: 0.6875rem;
    font-family: var(--font-mono);
    color: var(--ui-text-dimmed);
  }

  .ci__model-badge-icon {
    font-size: 0.6875rem;
    color: var(--h-cyan);
  }

  .ci__mode-tag {
    font-size: 0.6rem;
    font-weight: 600;
    letter-spacing: 0.06em;
    padding: 0.1rem 0.35rem;
    border-radius: 3px;
    text-transform: uppercase;
  }

  .ci__mode-tag--stream {
    background: rgba(14, 165, 233, 0.12);
    color: var(--h-cyan);
    border: 1px solid rgba(14, 165, 233, 0.25);
  }

  .ci__mode-tag--sync {
    background: rgba(168, 85, 247, 0.12);
    color: #a855f7;
    border: 1px solid rgba(168, 85, 247, 0.25);
  }

  .ci__actions {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .ci__hint {
    font-size: 0.6875rem;
    color: var(--ui-text-dimmed);
  }

  .ci__send {
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--h-surface-3);
    border: 1px solid var(--h-border);
    border-radius: 8px;
    color: var(--ui-text-dimmed);
    font-size: 0.875rem;
    transition:
      background 0.15s,
      border-color 0.15s,
      color 0.15s;
  }

  .ci__send--active {
    background: var(--h-cyan);
    border-color: var(--h-cyan);
    color: #000;
  }
  .ci__send--active:hover {
    background: #38bdf8;
    border-color: #38bdf8;
  }

  .ci__send:disabled {
    cursor: not-allowed;
  }

  /* Spinner for streaming state */
  .ci__spinner {
    width: 14px;
    height: 14px;
    border: 2px solid rgba(14, 165, 233, 0.3);
    border-top-color: var(--h-cyan);
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
</style>
