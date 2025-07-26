import {
  createOpenAIModel,
  generateChatTitle,
} from "../../../services/ai-service";

import { updateChat } from "../../../repository/chatRepository";

export default defineEventHandler(async (e) => {
  const { id } = getRouterParams(e);
  const { message } = await readBody(e);
  const model = createOpenAIModel(useRuntimeConfig().openaiApiKey);
  const title = await generateChatTitle(model, message);

  return updateChat(id as string, { title });
});
