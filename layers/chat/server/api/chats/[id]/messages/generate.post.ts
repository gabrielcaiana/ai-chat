import {
  getMessagesByChatId,
  createMessageForChat,
  getChatByIdForUser,
} from '../../../../repository/chatRepository';
import {
  createOpenAIModel,
  generateChatResponse,
} from '../../../../services/ai-service';

import { getAuthenticatedUserId } from '#layers/auth/server/utils/auth';

export default defineEventHandler(async e => {
  const { id } = getRouterParams(e);
  const userId = await getAuthenticatedUserId(e);

  // Verify user owns the chat
  const chat = await getChatByIdForUser(id as string, userId);
  if (!chat) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Chat not found',
    });
  }

  const messages = await getMessagesByChatId(id as string);
  const model = createOpenAIModel(useRuntimeConfig().openaiApiKey);
  const reply = await generateChatResponse({ model, messages });

  return createMessageForChat({
    chatId: id as string,
    content: reply,
    role: 'assistant',
  });
});
