<script setup lang="ts">
  const { showScrollButton, scrollToBottom, pinToBottom } = useChatScroll();
  const { currentModel, currentProvider } = useSettings();

  const props = defineProps<{
    messages: Message[];
    chat: Chat;
    typing: boolean;
  }>();

  const emit = defineEmits(['send-message']);

  function handleSendMessage(message: string) {
    emit('send-message', message);
  }

  watch(() => props.messages, pinToBottom, { deep: true });

  const route = useRoute();
  const isOnProjectPage = computed(() => !!route.params.projectId);
  const isAssignModalOpen = ref(false);
</script>

<template>
  <div ref="scrollContainer" class="cw">
    <div class="cw__inner">
      <!-- Empty state -->
      <div v-if="!messages?.length" class="cw__empty">
        <div class="cw__empty-content">
          <div class="cw__empty-icon">
            <UIcon name="i-lucide-bot" />
          </div>
          <h2 class="cw__empty-title">How can I help you today?</h2>
          <p class="cw__empty-sub">
            Using
            <span class="cw__empty-model">{{ currentModel?.label }}</span>
            via {{ currentProvider?.label }}
          </p>
          <ChatInput @send-message="handleSendMessage" />
        </div>
      </div>

      <template v-else>
        <!-- Chat header -->
        <div class="cw__chat-header">
          <h1 class="cw__chat-title">
            <TypewriterText :text="chat.title || 'Untitled Chat'" />
          </h1>
          <div class="cw__chat-actions">
            <div class="cw__model-pill">
              <UIcon name="i-lucide-cpu" class="cw__model-pill-icon" />
              <span>{{ currentModel?.label }}</span>
            </div>
            <UButton
              v-if="!isOnProjectPage"
              color="neutral"
              variant="ghost"
              icon="i-lucide-folder-plus"
              size="xs"
              @click="isAssignModalOpen = true"
            >
              Assign to Project
            </UButton>
          </div>
        </div>

        <!-- Messages -->
        <div class="cw__messages">
          <div
            v-for="message in messages"
            :key="message.id"
            class="cw__msg"
            :class="{
              'cw__msg--user': message.role === 'user',
              'cw__msg--ai': message.role === 'assistant',
            }"
          >
            <!-- AI avatar -->
            <div v-if="message.role === 'assistant'" class="cw__msg-avatar">
              <UIcon name="i-lucide-bot" />
            </div>

            <div class="cw__msg-body">
              <div v-if="message.role === 'assistant'" class="cw__msg-sender">
                {{ currentModel?.label ?? 'AI' }}
              </div>
              <div class="cw__msg-content">
                <MarkdownRenderer
                  :content="message.content"
                  :cache-key="message.id"
                />
              </div>
            </div>
          </div>

          <!-- Typing indicator -->
          <div v-if="typing" class="cw__msg cw__msg--ai">
            <div class="cw__msg-avatar">
              <UIcon name="i-lucide-bot" />
            </div>
            <div class="cw__msg-body">
              <div class="cw__msg-sender">
                {{ currentModel?.label ?? 'AI' }}
              </div>
              <div class="cw__typing">
                <span class="cw__typing-dot" />
                <span class="cw__typing-dot" />
                <span class="cw__typing-dot" />
              </div>
            </div>
          </div>
        </div>

        <!-- Input area -->
        <div class="cw__input-area">
          <div class="cw__scroll-btn-wrap">
            <button
              v-if="showScrollButton"
              class="cw__scroll-btn"
              @click="scrollToBottom()"
            >
              <UIcon name="i-lucide-arrow-down" />
            </button>
          </div>
          <ChatInput @send-message="handleSendMessage" />
        </div>
      </template>
    </div>

    <LazyAssignToProjectModal
      v-if="isAssignModalOpen"
      :chat-id="chat.id"
      @close="isAssignModalOpen = false"
    />
  </div>
</template>

<style scoped>
  .cw {
    overflow-y: auto;
    width: 100%;
    flex: 1 1 auto;
    height: 100%;
    min-height: 0;
  }

  .cw__inner {
    max-width: 800px;
    margin: 0 auto;
    padding: 0 1.5rem;
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  /* Empty state */
  .cw__empty {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 100%;
  }

  .cw__empty-content {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    padding: 2rem 0 3rem;
  }

  .cw__empty-icon {
    width: 52px;
    height: 52px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--h-cyan-dim);
    border: 1px solid var(--h-cyan-border);
    border-radius: 12px;
    color: var(--h-cyan);
    font-size: 1.5rem;
  }

  .cw__empty-title {
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--ui-text-highlighted);
    letter-spacing: -0.02em;
    text-align: center;
  }

  .cw__empty-sub {
    font-size: 0.8125rem;
    color: var(--ui-text-dimmed);
    text-align: center;
  }

  .cw__empty-model {
    font-family: var(--font-mono);
    color: var(--h-cyan);
    font-size: 0.8em;
  }

  /* Chat header */
  .cw__chat-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1.25rem 0 1rem;
    border-bottom: 1px solid var(--h-border);
    margin-bottom: 1.5rem;
    gap: 1rem;
    flex-shrink: 0;
  }

  .cw__chat-title {
    font-size: 1.125rem;
    font-weight: 600;
    color: var(--ui-text);
    letter-spacing: -0.01em;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .cw__chat-actions {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    flex-shrink: 0;
  }

  .cw__model-pill {
    display: inline-flex;
    align-items: center;
    gap: 0.3rem;
    padding: 0.25rem 0.625rem;
    background: var(--h-surface-3);
    border: 1px solid var(--h-border);
    border-radius: 20px;
    font-size: 0.6875rem;
    font-family: var(--font-mono);
    color: var(--ui-text-dimmed);
  }

  .cw__model-pill-icon {
    font-size: 0.6875rem;
    color: var(--h-cyan);
  }

  /* Messages */
  .cw__messages {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    padding-bottom: 9rem;
  }

  .cw__msg {
    display: flex;
    gap: 0.875rem;
    padding: 0.75rem 0;
  }

  .cw__msg--user {
    flex-direction: row-reverse;
    gap: 0;
  }

  .cw__msg--ai {
    align-items: flex-start;
  }

  .cw__msg-avatar {
    width: 28px;
    height: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--h-cyan-dim);
    border: 1px solid var(--h-cyan-border);
    border-radius: 8px;
    color: var(--h-cyan);
    font-size: 0.875rem;
    flex-shrink: 0;
    margin-top: 2px;
  }

  .cw__msg-body {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    min-width: 0;
    max-width: 100%;
  }

  .cw__msg--user .cw__msg-body {
    max-width: 72%;
  }

  .cw__msg-sender {
    font-size: 0.6875rem;
    font-weight: 600;
    color: var(--h-cyan);
    font-family: var(--font-mono);
    letter-spacing: 0.02em;
    margin-left: 0.125rem;
  }

  .cw__msg-content {
    color: var(--ui-text);
    word-wrap: break-word;
    overflow-wrap: break-word;
    line-height: 1.65;
  }

  .cw__msg--user .cw__msg-content {
    background: var(--h-surface-2);
    border: 1px solid var(--h-border);
    border-radius: 12px 2px 12px 12px;
    padding: 0.625rem 0.875rem;
    font-size: 0.9375rem;
  }

  .cw__msg--ai .cw__msg-content {
    font-size: 0.9375rem;
  }

  /* Typing */
  .cw__typing {
    display: flex;
    align-items: center;
    gap: 0.3rem;
    padding: 0.75rem 0;
  }

  .cw__typing-dot {
    width: 6px;
    height: 6px;
    background: var(--h-cyan);
    border-radius: 50%;
    animation: typing-bounce 1.2s ease-in-out infinite;
  }
  .cw__typing-dot:nth-child(2) {
    animation-delay: 0.2s;
  }
  .cw__typing-dot:nth-child(3) {
    animation-delay: 0.4s;
  }

  @keyframes typing-bounce {
    0%,
    100% {
      opacity: 0.3;
      transform: translateY(0);
    }
    50% {
      opacity: 1;
      transform: translateY(-4px);
    }
  }

  /* Input area */
  .cw__input-area {
    position: fixed;
    bottom: 0;
    max-width: 800px;
    width: calc(100% - 3rem);
    padding-bottom: 1.25rem;
    background: linear-gradient(to top, var(--ui-bg) 60%, transparent);
    z-index: 10;
  }

  .cw__scroll-btn-wrap {
    position: absolute;
    bottom: calc(100% + 0.5rem);
    left: 0;
    width: 100%;
    display: flex;
    justify-content: center;
    pointer-events: none;
  }

  .cw__scroll-btn {
    pointer-events: auto;
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--h-surface-2);
    border: 1px solid var(--h-border);
    border-radius: 50%;
    color: var(--ui-text-muted);
    font-size: 0.875rem;
    transition:
      background 0.15s,
      border-color 0.15s;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);
  }
  .cw__scroll-btn:hover {
    background: var(--h-surface-3);
    border-color: var(--h-border-hi);
  }
</style>
