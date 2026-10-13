// POST /api/compare — run one prompt against N models in parallel
//
// Request:  { prompt, targets: [{ provider, model }], apiKeys?: { openai, anthropic } }
// Response: application/x-ndjson stream of CompareEvent (see compare-service.ts)
//   {"type":"start",...}
//   {"type":"delta","index":0,"text":"Hel"}      ← interleaved across models
//   {"type":"result","index":1,"result":{...}}   ← per-model metrics/error
//   {"type":"done","runId":"…","results":[…]}    ← after the Run is persisted
//
// API key resolution per provider:
//   1. body.apiKeys[provider]   (UI-configured, request-scoped, never stored)
//   2. NUXT_OPENAI_API_KEY / NUXT_ANTHROPIC_API_KEY env vars
//   Ollama needs no key. A cloud model without a key fails fast with an
//   error in its own column (no request is sent).

import { CompareRequestSchema } from '../../schema';
import { createModel } from '../../services/ai-service';
import { createCompareStream } from '../../services/compare-service';
import { createRun } from '../../repository/runRepository';

export default defineEventHandler(async event => {
  const parsed = await readValidatedBody(event, CompareRequestSchema.safeParse);
  if (!parsed.success) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request',
      data: parsed.error.issues,
    });
  }

  const { prompt, targets, apiKeys } = parsed.data;
  const config = useRuntimeConfig();
  const keyFor = (provider: string): string | undefined => {
    if (provider === 'openai') return apiKeys?.openai || config.openaiApiKey;
    if (provider === 'anthropic')
      return apiKeys?.anthropic || config.anthropicApiKey;
    return undefined;
  };

  setResponseHeaders(event, {
    'Content-Type': 'application/x-ndjson; charset=utf-8',
    'Cache-Control': 'no-cache',
    'X-Accel-Buffering': 'no',
  });

  return createCompareStream({
    prompt,
    targets,
    resolveModel: t => {
      const apiKey = keyFor(t.provider);
      // Fail fast (no network call) when a cloud provider has no key.
      if (t.provider !== 'ollama' && !apiKey) {
        throw new Error(`No API key configured for ${t.provider}`);
      }
      return createModel(t.provider, t.model, apiKey);
    },
    persist: results => createRun(prompt, results),
  });
});
