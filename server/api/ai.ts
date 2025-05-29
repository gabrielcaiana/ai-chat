import {
  generateChatResponse,
  createOllamaModel,
  // createOpenAIModel,
} from "../services/ai-service";

export default defineEventHandler(async (e) => {
  const body = await readBody(e);
  const { messages } = body;

  const id = messages.length.toString();

  // utiliza o modelo openai para responder a mensagem
  // const openaiApiKey = useRuntimeConfig().openaiApiKey;
  // const openaiModel = createOpenAIModel(openaiApiKey);

  // utiliza o modelo ollama para responder a mensagem
  const ollamaModel = createOllamaModel();

  // gera a resposta para a mensagem
  const response = await generateChatResponse({
    model: ollamaModel,
    messages,
  });

  return {
    id,
    role: "assistant",
    content: response,
  };
});
