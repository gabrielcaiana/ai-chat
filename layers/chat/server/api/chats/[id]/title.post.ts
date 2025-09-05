import {
  createOpenAIModel,
  generateChatTitle,
} from '../../../services/ai-service';

import {
  updateChat,
  getChatByIdForUser,
} from '../../../repository/chatRepository';
import { UpdateChatTitleSchema } from '../../../schema';
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

  const { success, data } = await readValidatedBody(
    e,
    UpdateChatTitleSchema.safeParse
  );

  if (!success) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request',
    });
  }

  const { message } = data;

  const model = createOpenAIModel(useRuntimeConfig().openaiApiKey);
  const title = await generateChatTitle(model, message);

  return updateChat(id as string, { title });
});
