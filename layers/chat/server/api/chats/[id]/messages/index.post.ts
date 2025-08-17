import { CreateMessageSchema } from '~~/layers/chat/server/schema';
import { createMessageForChat } from '../../../../repository/chatRepository';

export default defineEventHandler(async e => {
  const { id } = getRouterParams(e);

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
