import { getMessagesByChatId } from "../../../../repository/chatRepository";

export default defineEventHandler(async (event) => {
  const { id } = getRouterParams(event);
  const messages = await getMessagesByChatId(id as string);
  return messages;
});
