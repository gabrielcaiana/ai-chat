import { createChat } from "../../repository/chatRepository";
import { CreateChatSchema } from "../../schema";

export default defineEventHandler(async (e) => {
  const { success, data } = await readValidatedBody(
    e,
    CreateChatSchema.safeParse
  );

  if (!success) {
    return 400;
  }

  const { title, projectId } = data;

  const storage = useStorage("db");
  await storage.setItem("chats:has-new-chat", true);

  return createChat({
    title,
    projectId,
  });
});
