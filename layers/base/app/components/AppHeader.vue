<script setup lang="ts">
  defineProps<{
    isSidebarOpen: boolean;
  }>();

  const emit = defineEmits(['toggle-sidebar']);

  const { createChatAndNavigate } = useChats();
  const { currentModel, openSettings } = useSettings();

  async function handleCreateChat() {
    await createChatAndNavigate();
  }
</script>

<template>
  <header class="hdr">
    <div class="hdr__left">
      <button
        class="hdr__toggle"
        :title="isSidebarOpen ? 'Close sidebar' : 'Open sidebar'"
        @click="emit('toggle-sidebar')"
      >
        <UIcon
          :name="
            isSidebarOpen
              ? 'i-lucide-panel-left-close'
              : 'i-lucide-panel-left-open'
          "
          class="hdr__toggle-icon"
        />
      </button>

      <NuxtLink to="/" class="hdr__brand">
        <div class="hdr__brand-icon">
          <UIcon name="i-lucide-bot" />
        </div>
        <span class="hdr__brand-name">ai.caiana.studio</span>
      </NuxtLink>
    </div>

    <div class="hdr__right">
      <button
        class="hdr__model-badge"
        title="Change model"
        @click="openSettings"
      >
        <UIcon name="i-lucide-cpu" class="hdr__model-icon" />
        <span class="hdr__model-label">{{
          currentModel?.label ?? 'Select model'
        }}</span>
        <UIcon name="i-lucide-chevrons-up-down" class="hdr__model-caret" />
      </button>

      <button class="hdr__icon-btn" title="Settings" @click="openSettings">
        <UIcon name="i-lucide-settings-2" />
      </button>

      <button class="hdr__new-chat" @click="handleCreateChat">
        <UIcon name="i-lucide-plus" class="hdr__new-chat-icon" />
        <span>New Chat</span>
      </button>
    </div>
  </header>
</template>

<style scoped>
  .hdr {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    height: var(--h-header-h);
    background: var(--h-surface);
    border-bottom: 1px solid var(--h-border);
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 1rem;
    z-index: 100;
    gap: 1rem;
  }

  /* Left */
  .hdr__left {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    flex-shrink: 0;
  }

  .hdr__toggle {
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 6px;
    color: var(--ui-text-dimmed);
    transition:
      background 0.15s,
      color 0.15s;
  }
  .hdr__toggle:hover {
    background: var(--h-surface-3);
    color: var(--ui-text-muted);
  }
  .hdr__toggle-icon {
    font-size: 1rem;
  }

  .hdr__brand {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    text-decoration: none;
  }

  .hdr__brand-icon {
    width: 26px;
    height: 26px;
    background: var(--h-cyan-dim);
    border: 1px solid var(--h-cyan-border);
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--h-cyan);
    font-size: 0.875rem;
    flex-shrink: 0;
  }

  .hdr__brand-name {
    font-size: 0.875rem;
    font-weight: 600;
    color: var(--ui-text);
    letter-spacing: -0.01em;
  }

  /* Right */
  .hdr__right {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    flex-shrink: 0;
  }

  .hdr__model-badge {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    padding: 0.3125rem 0.6rem;
    background: var(--h-surface-2);
    border: 1px solid var(--h-border);
    border-radius: 6px;
    transition:
      border-color 0.15s,
      background 0.15s;
    cursor: pointer;
  }
  .hdr__model-badge:hover {
    border-color: var(--h-border-hi);
    background: var(--h-surface-3);
  }

  .hdr__model-icon {
    font-size: 0.75rem;
    color: var(--h-cyan);
  }

  .hdr__model-label {
    font-size: 0.75rem;
    font-weight: 500;
    color: var(--ui-text-muted);
    font-family: var(--font-mono);
    max-width: 120px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .hdr__model-caret {
    font-size: 0.6875rem;
    color: var(--ui-text-dimmed);
  }

  .hdr__icon-btn {
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 6px;
    color: var(--ui-text-dimmed);
    transition:
      background 0.15s,
      color 0.15s;
    font-size: 0.9375rem;
  }
  .hdr__icon-btn:hover {
    background: var(--h-surface-3);
    color: var(--ui-text-muted);
  }

  .hdr__new-chat {
    display: inline-flex;
    align-items: center;
    gap: 0.3rem;
    padding: 0.34375rem 0.75rem;
    background: var(--h-cyan);
    border-radius: 6px;
    font-size: 0.8125rem;
    font-weight: 600;
    color: #000;
    transition: background 0.15s;
  }
  .hdr__new-chat:hover {
    background: #38bdf8;
  }
  .hdr__new-chat-icon {
    font-size: 0.875rem;
  }
</style>
