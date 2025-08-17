import {
  createOpenAIModel,
  generateChatTitle,
} from '../../../services/ai-service';

import { updateChat } from '../../../repository/chatRepository';
import { UpdateChatTitleSchema } from '../../../schema';

export default defineEventHandler(async e => {
  const { id } = getRouterParams(e);

  const { success, data } = await readValidatedBody(
    e,
    UpdateChatTitleSchema.safeParse
  );

  if (!success) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request',
    });
  }

  const { message } = data;

  const model = createOpenAIModel(useRuntimeConfig().openaiApiKey);
  const title = await generateChatTitle(model, message);

  return updateChat(id as string, { title });
});
