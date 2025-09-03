import { ChatMessageSchema } from '../schema';
import {
  generateChatResponse,
  createOllamaModel,
  createOpenAIModel,
} from '../services/ai-service';

export default defineEventHandler(async e => {
  const appEnv = useRuntimeConfig().public.appEnv;

  const { success, data } = await readValidatedBody(
    e,
    ChatMessageSchema.safeParse
  );

  if (!success) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request',
    });
  }

  const { messages } = data as {
    messages: Message[];
    chatId: string;
  };

  const id = messages.length.toString();

  // utiliza o modelo openai para responder a mensagem
  const openaiApiKey = useRuntimeConfig().openaiApiKey;
  const openaiModel = createOpenAIModel(openaiApiKey);

  // utiliza o modelo ollama para responder a mensagem
  const ollamaModel = createOllamaModel();

  // define o modelo a ser utilizado de acordo com o ambiente
  const model = appEnv === 'development' ? ollamaModel : openaiModel;

  // gera a resposta para a mensagem
  const response = await generateChatResponse({
    model,
    messages,
  });

  return {
    id,
    role: 'assistant',
    content: response,
  };
});
