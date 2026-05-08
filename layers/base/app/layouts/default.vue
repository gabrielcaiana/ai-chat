<script setup lang="ts">
  const isSidebarOpen = ref(true);
</script>

<template>
  <div class="layout">
    <AppHeader
      :is-sidebar-open="isSidebarOpen"
      @toggle-sidebar="isSidebarOpen = !isSidebarOpen"
    />
    <AppSidebar :is-open="isSidebarOpen" />
    <main
      class="layout__main"
      :class="{ 'layout__main--shifted': isSidebarOpen }"
    >
      <slot />
    </main>
    <SettingsModal />
  </div>
</template>

<style scoped>
  .layout {
    height: 100vh;
    overflow: hidden;
    background: var(--ui-bg);
  }

  .layout__main {
    height: 100vh;
    margin-top: var(--h-header-h);
    height: calc(100vh - var(--h-header-h));
    transition: margin-left 0.25s cubic-bezier(0.4, 0, 0.2, 1);
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }

  .layout__main--shifted {
    margin-left: var(--h-sidebar-w);
  }
</style>
