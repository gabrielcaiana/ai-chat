<script setup lang="ts">
const route = useRoute();
const appConfig = useAppConfig();

const {
  messages,
  chat: chatFromChats,
  sendMessage,
} = useChat(route.params.id as string);

if (!chatFromChats.value) {
  await navigateTo("/", { replace: true });
}

const chat = computed(() => chatFromChats.value as Chat);

const typing = ref(false);

const handleSendMessage = async (message: string) => {
  typing.value = true;
  await sendMessage(message);
  typing.value = false;
};

const title = computed(() => {
  return chat.value?.title
    ? `${chat.value.title} - ${appConfig.title}`
    : appConfig.title;
});

useHead({
  title,
});
</script>

<template>
  <ChatWindow
    :messages
    :chat="chat!"
    :typing
    @send-message="handleSendMessage"
  />
</template>
