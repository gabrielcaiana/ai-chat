// generate.post.ts — non-streaming AI response endpoint
//
// Alternative to stream.post.ts for cases where you want the full response at once
// instead of token-by-token chunks. Useful for programmatic use, testing, or
// comparing response quality without the complexity of streaming.
//
// Accepts the same provider/model/token contract as the stream endpoint so both
// endpoints are interchangeable from the caller's perspective.
//
// Flow:
//   POST /api/chats/[id]/messages/generate { provider, model, x-ai-token }
//     → createModel(provider, model, apiKey)
//     → generateChatResponse() — waits for the full response (no streaming)
//     → createMessageForChat() — persists to DB
//     → returns the saved Message

import {
  getMessagesByChatId,
  createMessageForChat,
} from '../../../../repository/chatRepository';
import {
  createModel,
  generateChatResponse,
} from '../../../../services/ai-service';

export default defineEventHandler(async e => {
  const { id } = getRouterParams(e);
  const body = await readBody(e);

  // Same provider/model/token resolution as stream.post.ts
  const provider: string = body?.provider ?? 'openai';
  const modelName: string = body?.model ?? 'gpt-6-luna';
  const apiKey: string =
    getHeader(e, 'x-ai-token') ||
    body?.apiToken ||
    useRuntimeConfig().openaiApiKey ||
    '';

  const messages = await getMessagesByChatId(id as string);
  const model = createModel(provider, modelName, apiKey);

  const reply = await generateChatResponse({ model, messages });

  return createMessageForChat({
    chatId: id as string,
    content: reply,
    role: 'assistant',
  });
});
