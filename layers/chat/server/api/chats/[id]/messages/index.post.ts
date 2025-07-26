import { createMessageForChat } from "../../../../repository/chatRepository";

export default defineEventHandler(async (e) => {
  const { id } = getRouterParams(e);
  const { content, role } = await readBody(e);

  return createMessageForChat({
    chatId: id as string,
    content,
    role,
  });
});
