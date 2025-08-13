<script setup lang="ts">
const { fetchChats, prefetchChatMessages } = useChats();
const { fetchProjects } = useProjects();

await Promise.all([fetchChats(), fetchProjects()]);
await callOnce(prefetchChatMessages);
</script>

<template>
  <UApp>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>
