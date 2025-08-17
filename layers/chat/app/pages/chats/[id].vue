<script setup lang="ts">
  const route = useRoute();
  const appConfig = useAppConfig();

  const {
    messages,
    chat: chatFromChats,
    sendMessage,
    fetchMessages,
  } = useChat(route.params.id as string);

  await fetchMessages();

  if (!chatFromChats.value) {
    await navigateTo('/', { replace: true });
  }

  const chat = computed(() => chatFromChats.value as Chat);

  const typing = ref(false);

  const handleSendMessage = async (message: string) => {
    typing.value = true;
    await sendMessage(message);
    typing.value = false;
  };

  async function handleError() {
    await navigateTo('/', { replace: true });
  }

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
  <NuxtErrorBoundary>
    <ChatWindow
      :messages
      :chat="chat!"
      :typing
      @send-message="handleSendMessage"
    />

    <template #error="{ error }">
      <div class="h-screen flex flex-col items-center justify-center">
        Error - {{ (error as { statusCode?: number }).statusCode || 'Unknown' }}
        <p>An error occurred: {{ error?.message }}</p>

        <UButton
          class="mt-4"
          color="primary"
          variant="soft"
          icon="i-heroicons-arrow-left"
          @click="handleError"
        >
          Go back home
        </UButton>
      </div>
    </template>
  </NuxtErrorBoundary>
</template>
