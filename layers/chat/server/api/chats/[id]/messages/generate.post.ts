import {
  getMessagesByChatId,
  createMessageForChat,
} from "../../../../repository/chatRepository";
import {
  createOpenAIModel,
  generateChatResponse,
} from "../../../../services/ai-service";

export default defineEventHandler(async (e) => {
  const { id } = getRouterParams(e);

  const messages = await getMessagesByChatId(id);
  const model = createOpenAIModel(useRuntimeConfig().openaiApiKey);
  const reply = await generateChatResponse({ model, messages });

  return createMessageForChat({
    chatId: id,
    content: reply,
    role: "assistant",
  });
});
