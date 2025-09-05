import { CreateMessageSchema } from '~~/layers/chat/server/schema';
import {
  createMessageForChat,
  getChatByIdForUser,
} from '../../../../repository/chatRepository';
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
    CreateMessageSchema.safeParse
  );

  if (!success) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request',
    });
  }

  const { content, role } = data;

  return createMessageForChat({
    chatId: id as string,
    content,
    role,
  });
});
