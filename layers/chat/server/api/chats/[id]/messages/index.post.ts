import { createMessageForChat } from "../../../../repository/chatRepository";

export default defineEventHandler(async (e) => {
  const { id: chatId } = getRouterParams(e);
  const { content, role } = await readBody(e);

  return createMessageForChat({
    chatId,
    content,
    role,
  });
});
