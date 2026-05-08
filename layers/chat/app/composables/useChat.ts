// useChat.ts — manages a single chat's state and all interactions with the API
//
// Responsible for:
//   - Holding the message list (derived from the global chats state)
//   - Sending user messages and streaming AI responses
//   - Auto-generating a title after the first message
//   - Assigning a chat to a project
//
// Why derive messages from useChats() instead of fetching them separately?
//   useChats() maintains a global chats array (with messages embedded). Deriving
//   from it means the sidebar, header, and chat window all react to the same
//   state without any manual sync.
//
// Streaming flow:
//   sendMessage(text)
//     1. Optimistically add user message to the list (instant UI feedback)
//     2. POST /messages — persist the user message to DB, swap optimistic copy
//     3. Add a placeholder assistant message (content = '')
//     4. POST /messages/stream — receive chunks, append to placeholder in real time
//     5. flush() on the server saves the complete response to DB
//     6. fetchMessages({ refresh: true }) — replace streaming placeholder with DB copy

export default function useChat(chatId: string) {
  const { chats } = useChats();
  // Pull provider/model/token/mode from the global settings state
  const { apiToken, selectedModel, selectedProvider, streamingMode } =
    useSettings();

  // Derive the current chat and its messages from the global chats list
  const chat = computed(() => chats.value.find(c => c.id === chatId));
  const messages = computed<Message[]>(() => chat.value?.messages || []);

  const { data, execute, status } = useFetch<Message[]>(
    `/api/chats/${chatId}/messages`,
    {
      default: () => [],
      immediate: false,
    }
  );

  // fetchMessages — loads/refreshes messages from the DB.
  // Skips the fetch if messages are already present and refresh is not forced,
  // avoiding redundant requests when navigating back to an open chat.
  async function fetchMessages({
    refresh = false,
  }: {
    refresh?: boolean;
  } = {}) {
    const hasExistingMessages = messages.value.length > 1;
    const isRequestInProgress = status.value !== 'idle';
    const shouldSkipDueToExistingState =
      !refresh && (hasExistingMessages || isRequestInProgress);

    if (shouldSkipDueToExistingState || !chat.value) {
      return;
    }
    await execute();
    chat.value.messages = data.value;
  }

  // generateChatTitle — asks the AI to summarise the first message into a short
  // title (≤3 words). Uses the same provider/model/token as the active chat so
  // the same model generates both the response and its label.
  async function generateChatTitle(message: string) {
    if (!chat.value) return;

    const updatedChat = await $fetch<Chat>(`/api/chats/${chatId}/title`, {
      method: 'POST',
      headers: {
        // Forward the user's API key to the server — same pattern as sendMessage
        ...(apiToken.value ? { 'x-ai-token': apiToken.value } : {}),
      },
      body: {
        message,
        model: selectedModel.value,
        provider: selectedProvider.value,
      },
    });
    chat.value.title = updatedChat.title;
  }

  async function sendMessage(message: string) {
    if (!chat.value) return;

    // Generate a title on the very first message so the sidebar label is meaningful
    if (messages.value.length === 0) {
      generateChatTitle(message); // fire-and-forget, doesn't block the response
    }

    // --- Step 1: Optimistic user message ---
    // Add the message immediately so the UI feels instant, then replace it with
    // the DB-persisted copy once the POST completes.
    const optimisticUserMessage: Message = {
      id: `optimistic-user-message-${Date.now()}`,
      role: 'user',
      content: message,
      createdAt: new Date(),
      updatedAt: new Date(),
      chatId,
    };
    messages.value.push(optimisticUserMessage);
    const userMessageIndex = messages.value.length - 1;

    try {
      const newMessage = await $fetch<Message>(
        `/api/chats/${chatId}/messages`,
        {
          method: 'POST',
          body: { content: message, role: 'user' },
        }
      );
      messages.value[userMessageIndex] = newMessage; // replace optimistic copy
    } catch (error) {
      console.error('Error sending user message', error);
      messages.value.splice(userMessageIndex, 1); // revert on failure
      return;
    }

    // --- Step 2: AI response (streaming or sync depending on settings) ---
    const headers: Record<string, string> = apiToken.value
      ? { 'x-ai-token': apiToken.value }
      : {};
    const body = {
      model: selectedModel.value,
      provider: selectedProvider.value,
    };

    if (streamingMode.value) {
      // STREAMING MODE — /messages/stream → streamText()
      // Add an empty placeholder message that gets filled token-by-token.
      // Each chunk from the server is appended to it, giving real-time feedback.
      messages.value.push({
        id: `streaming-message-${Date.now()}`,
        role: 'assistant',
        content: '',
        createdAt: new Date(),
        updatedAt: new Date(),
        chatId,
      });
      const lastMessage = messages.value[messages.value.length - 1] as Message;

      try {
        const response = await $fetch<ReadableStream>(
          `/api/chats/${chatId}/messages/stream`,
          { method: 'POST', responseType: 'stream', headers, body }
        );

        const reader = response
          .pipeThrough(new TextDecoderStream())
          .getReader();
        await reader.read().then(function processText({
          done,
          value,
        }): Promise<void> | void {
          if (done) return;
          lastMessage.content += value;
          return reader.read().then(processText);
        });
      } catch (error) {
        console.error('Error streaming message:', error);
      } finally {
        // Replace placeholder with the DB copy so IDs/timestamps are correct
        await fetchMessages({ refresh: true });
      }
    } else {
      // SYNC MODE — /messages/generate → generateText()
      // Waits for the full response before showing anything. The endpoint
      // persists the message to DB and returns it directly — no placeholder needed.
      try {
        const reply = await $fetch<Message>(
          `/api/chats/${chatId}/messages/generate`,
          { method: 'POST', headers, body }
        );
        messages.value.push(reply);
      } catch (error) {
        console.error('Error generating message:', error);
      }
    }

    chat.value.updatedAt = new Date();
  }

  // assignToProject — moves a chat into a project (or removes it with null).
  // Updates optimistically so the sidebar reacts instantly, then reverts on error.
  async function assignToProject(projectId: string | null) {
    if (!chat.value) return;

    const originalProjectId = chat.value.projectId;
    chat.value.projectId = projectId || null;

    try {
      const updatedChat = await $fetch<Chat>(`/api/chats/${chatId}`, {
        method: 'PUT',
        body: { projectId },
      });

      const chatIndex = chats.value.findIndex(c => c.id === chatId);
      if (chatIndex !== -1 && chats.value[chatIndex]) {
        chats.value[chatIndex].projectId = updatedChat.projectId;
        chats.value[chatIndex].updatedAt = updatedChat.updatedAt;
      }
    } catch (error) {
      console.error('Error assigning chat to project', error);
      chat.value.projectId = originalProjectId; // revert optimistic update
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
