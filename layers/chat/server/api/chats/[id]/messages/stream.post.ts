// stream.post.ts — main AI streaming endpoint
//
// This is the core of the chat experience. It receives the conversation history
// and user settings, creates the appropriate AI model, and streams the response
// back to the browser token-by-token via chunked transfer encoding.
//
// Full request/response flow:
//   Browser (useChat.sendMessage)
//     → POST /api/chats/[id]/messages/stream
//         headers: { x-ai-token: '<user api key>' }
//         body:    { messages: [...], provider: 'openai', model: 'gpt-4o' }
//     → createModel(provider, model, apiKey)  ← ai-service factory
//     → streamText() via Vercel AI SDK        ← provider-agnostic streaming
//     → TransformStream:
//         transform: forward each chunk to browser  (real-time display)
//         flush:     save full response to DB        (persistence)
//
// Token resolution priority (apiKey):
//   1. x-ai-token header — UI-configured key, sent from the browser
//   2. body.apiToken     — fallback body field (less common)
//   3. NUXT_OPENAI_API_KEY env var — server-side shared fallback for OpenAI

import {
  getMessagesByChatId,
  createMessageForChat,
} from '../../../../repository/chatRepository';
import {
  createModel,
  streamChatResponse,
} from '../../../../services/ai-service';

export default defineEventHandler(async event => {
  const { id } = getRouterParams(event) as { id: string };
  const body = await readBody(event);

  const provider: string = body?.provider ?? 'openai';
  const model: string = body?.model ?? 'gpt-4o-mini';
  const apiToken: string =
    getHeader(event, 'x-ai-token') ||
    body?.apiToken ||
    useRuntimeConfig().openaiApiKey ||
    '';

  // Load the full conversation history from DB to give the model context
  const history = await getMessagesByChatId(id);
  const aiModel = createModel(provider, model, apiToken);
  const stream = await streamChatResponse(aiModel, history);

  setResponseHeaders(event, {
    'Content-Type': 'text/html',
    'Cache-Control': 'no-cache',
    'Transfer-Encoding': 'chunked',
  });

  // Accumulate the full response text as chunks arrive so we can persist it
  // to the DB in the flush() callback after streaming completes.
  // This way the browser gets real-time feedback AND the message is saved.
  let completeResponse = '';

  const transformStream = new TransformStream({
    transform(chunk, controller) {
      completeResponse += chunk;
      controller.enqueue(chunk); // forward to browser immediately
    },
    async flush() {
      // Stream finished — persist the complete assistant message to the DB
      await createMessageForChat({
        chatId: id,
        content: completeResponse,
        role: 'assistant',
      });
    },
  });

  return stream.pipeThrough(transformStream);
});
