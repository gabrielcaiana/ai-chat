<script setup lang="ts">
const { messages, chat, sendMessage } = useChat();
const appConfig = useAppConfig();

const title = computed(() => {
  return chat.value.title
    ? `${chat.value.title} - ${appConfig.title}`
    : appConfig.title;
});

useHead({
  title,
});
</script>

<template>
  <ChatWindow :messages="messages" :chat="chat" @send-message="sendMessage" />
</template>
