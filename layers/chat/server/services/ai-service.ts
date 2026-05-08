// ai-service.ts — central factory for all AI model creation
//
// This is the single place where providers are instantiated. Routes never import
// provider SDKs directly; they always call createModel() here. That keeps
// provider-specific logic contained and makes it trivial to add a new provider
// (one new `case` is all that's needed).
//
// Architecture:
//   route → createModel(provider, model, apiKey) → LanguageModelV1
//                                                 ↓
//                              streamText() or generateText() from Vercel AI SDK
//
// The Vercel AI SDK (package "ai") provides a unified interface over all providers
// via the LanguageModelV1 type, so the rest of the codebase is provider-agnostic.

import { generateText, streamText } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';
import { createAnthropic } from '@ai-sdk/anthropic';
import { createOllama } from 'ollama-ai-provider';
import type { Message, LanguageModelV1 } from 'ai';

// createModel — the main factory function
//
// Receives the provider id chosen by the user in the UI, the model name, and the
// API key (sent from the browser via the x-ai-token header). Returns a
// LanguageModelV1 that the Vercel AI SDK can use uniformly across all endpoints.
//
// To add a new provider: install `@ai-sdk/<provider>`, add a case here, and
// register it in AI_PROVIDERS inside useSettings.ts — the UI picks it up
// automatically with no other changes required.
export function createModel(
  provider: string = 'openai',
  modelName: string = 'gpt-4o-mini',
  apiKey?: string
): LanguageModelV1 {
  switch (provider) {
    case 'anthropic': {
      // Anthropic Claude models — requires a valid API key from console.anthropic.com
      const anthropic = createAnthropic({ apiKey: apiKey ?? '' });
      return anthropic(modelName) as unknown as LanguageModelV1;
    }
    case 'ollama': {
      // Ollama runs locally — no API key needed, but requires Ollama running on
      // localhost:11434 with the target model already pulled (`ollama pull <model>`)
      const ollama = createOllama();
      return ollama(modelName) as unknown as LanguageModelV1;
    }
    default: {
      // OpenAI — default provider, requires an API key from platform.openai.com
      const openai = createOpenAI({ apiKey: apiKey ?? '' });
      return openai(modelName) as unknown as LanguageModelV1;
    }
  }
}

// generateChatResponse — non-streaming, waits for the full response
//
// Used by the /generate endpoint as a simpler alternative to streaming.
// Prefer streamChatResponse for user-facing chat because it provides
// token-by-token feedback without waiting for the full response.
export async function generateChatResponse({
  model,
  messages,
}: {
  model: LanguageModelV1;
  messages: Message[];
}) {
  if (!isValidArray(messages)) {
    throw new Error('Messages must be an array and not empty');
  }

  const response = await generateText({ model, messages });
  return response.text.trim();
}

// generateChatTitle — asks the model to summarise the first user message into a
// short title (3 words or less). Called after the first message is sent so the
// chat gets a meaningful label in the sidebar instead of "Untitled Chat".
export async function generateChatTitle(
  model: LanguageModelV1,
  firstMessage: string
): Promise<string> {
  const response = await generateText({
    model,
    messages: [
      {
        role: 'system',
        content:
          'You are a helpful assistant that generates concise, descriptive titles for chat conversations. Generate a title that captures the essence of the first message in 3 short words or less.',
      },
      { role: 'user', content: firstMessage },
    ],
  });
  return response.text.trim();
}

// streamChatResponse — returns a ReadableStream of text chunks
//
// Uses Vercel AI SDK's streamText() which handles the SSE/chunked transfer
// protocol for each provider transparently. The caller (stream.post.ts) pipes
// this through a TransformStream that simultaneously forwards chunks to the
// browser and accumulates the full response for DB persistence.
export async function streamChatResponse(
  model: LanguageModelV1,
  messages: Message[]
) {
  if (!isValidArray(messages)) {
    throw new Error('Invalid messages format');
  }
  return streamText({ model, messages }).textStream;
}
