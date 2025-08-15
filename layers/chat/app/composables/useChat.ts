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

  async function assignToProject(projectId: string | null) {
    if (!chat.value) return;

    const originalProjectId = chat.value.projectId;

    // Optimistically update the chat
    chat.value.projectId = projectId || undefined;

    try {
      const updatedChat = await $fetch<Chat>(`/api/chats/${chatId}`, {
        method: "PUT",
        body: {
          projectId,
        },
      });

      // Update the chat in the chats list
      const chatIndex = chats.value.findIndex((c) => c.id === chatId);
      if (chatIndex !== -1 && chats.value[chatIndex]) {
        chats.value[chatIndex].projectId = updatedChat.projectId;
        chats.value[chatIndex].updatedAt = updatedChat.updatedAt;
      }
    } catch (error) {
      console.error("Error assigning chat to project", error);
      // Revert optimistic update
      chat.value.projectId = originalProjectId;
      throw error;
    }
  }

  return {
    chat,
    messages,
    sendMessage,
    fetchMessages,
    assignToProject,
  };
}
