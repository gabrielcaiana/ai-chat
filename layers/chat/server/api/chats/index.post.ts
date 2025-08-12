import { createChat } from "../../repository/chatRepository";

export default defineEventHandler(async (e) => {
  const { title, projectId } = await readBody(e);

  const storage = useStorage("db");
  await storage.setItem("chats:has-new-chat", true);

  return createChat({
    title,
    projectId,
  });
});
