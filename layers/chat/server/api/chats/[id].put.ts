import { updateChat } from '../../repository/chatRepository';
import { UpdateChatSchema } from '../../schema';

export default defineEventHandler(async event => {
  const { id } = getRouterParams(event) as { id: string };

  const { success, data } = await readValidatedBody(
    event,
    UpdateChatSchema.safeParse
  );

  if (!success) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request',
    });
  }

  const storage = useStorage('db');
  await storage.setItem('chats:has-new-chat', true);

  return updateChat(id, data);
});
