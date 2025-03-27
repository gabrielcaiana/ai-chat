<script setup lang="ts">
const { messages, chat, sendMessage } = useChat();

useHeadSafe({
  title: chat.value.title
});
</script>

<template>
  <ChatWindow :messages="messages" :chat="chat" @send-message="sendMessage" />
</template>
