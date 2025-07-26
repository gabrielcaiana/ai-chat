import { createChat } from "../../repository/chatRepository";

export default defineEventHandler(async (e) => {
  const { title, projectId } = await readBody(e);

  return createChat({
    title,
    projectId,
  });
});
