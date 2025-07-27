export default function useChat(chatId: string) {
  const { chats } = useChats();
  const chat = computed(() => chats.value.find((c) => c.id === chatId));
  const messages = computed<ChatMessage[]>(() => chat.value?.messages || []);

  const { data, execute, status } = useFetch<ChatMessage[]>(
    `/api/chats/${chatId}/messages`,
    {
      default: () => [],
      immediate: false,
    }
  );

  async function fetchMessages() {
    if (status.value !== "idle" || !chat.value) return;
    await execute();
    chat.value.messages = data.value;
  }

  async function generateTitleChat(message: string) {
    if (!chat.value) return;

    const updateChat = await $fetch<Chat>(`/api/chats/${chat.value.id}/title`, {
      method: "POST",
      body: {
        message,
      },
    });

    chat.value.title = updateChat.title;
  }

  async function sendMessage(message: string) {
    if (!chat.value) return;

    if (messages.value.length === 0) {
      generateTitleChat(message);
    }

    const newMessage = await $fetch<ChatMessage>(
      `/api/chats/${chatId}/messages`,
      {
        method: "POST",
        body: {
          content: message,
          role: "user",
        },
      }
    );
    messages.value.push(newMessage);

    const aiResponse = await $fetch<ChatMessage>(
      `/api/chats/${chatId}/messages/generate`,
      {
        method: "POST",
      }
    );
    messages.value.push(aiResponse);

    chat.value.updatedAt = new Date();
  }

  return {
    chat,
    messages,
    sendMessage,
    fetchMessages,
  };
}
