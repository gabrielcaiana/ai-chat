# Adding a New AI Provider

The provider system is designed to be minimal — adding a new provider touches exactly 3 files and requires no changes to routes, components, or database schema.

---

## How the System Works

```
useSettings.ts          → defines available providers and models (UI layer)
ai-service.ts           → createModel() factory (server layer)
stream.post.ts          → reads provider/model from request (no changes needed)
```

The UI (`useSettings.ts`) and the server (`ai-service.ts`) are the only two places that know about specific providers.

---

## Step-by-Step: Adding a New Provider

This example adds **Groq** (fast inference for open-source models).

### Step 1 — Install the SDK

```bash
pnpm add @ai-sdk/groq
```

> Check the [Vercel AI SDK providers list](https://sdk.vercel.ai/providers/ai-sdk-providers) for available packages. If there's no official `@ai-sdk/<provider>`, check if the provider is OpenAI-compatible — in that case, use `createOpenAI` with a custom `baseURL`.

### Step 2 — Add to `ai-service.ts`

```typescript
// layers/chat/server/services/ai-service.ts
import { createGroq } from '@ai-sdk/groq'; // ← add import

export function createModel(
  provider: string = 'openai',
  modelName: string = 'gpt-6-luna',
  apiKey?: string
): LanguageModel {
  switch (provider) {
    case 'groq': {
      // ← add case
      const groq = createGroq({ apiKey: apiKey ?? '' });
      return groq(modelName);
    }
    // ... existing cases
  }
}
```

### Step 3 — Add to `useSettings.ts`

```typescript
// layers/chat/app/composables/useSettings.ts
export const AI_PROVIDERS: Provider[] = [
  // ... existing providers ...
  {
    id: 'groq',
    label: 'Groq',
    models: [
      {
        value: 'llama-3.3-70b-versatile',
        label: 'Llama 3.3 70B',
        description: 'Fast inference',
        context: '128k ctx',
      },
      {
        value: 'llama-3.1-8b-instant',
        label: 'Llama 3.1 8B',
        description: 'Fastest',
        context: '128k ctx',
      },
      {
        value: 'mixtral-8x7b-32768',
        label: 'Mixtral 8x7B',
        description: 'MoE model',
        context: '32k ctx',
      },
      {
        value: 'gemma2-9b-it',
        label: 'Gemma 2 9B',
        description: 'Google',
        context: '8k ctx',
      },
    ],
  },
];
```

That's it. The new provider appears in Settings immediately with no further changes.

---

## OpenAI-Compatible Providers (Custom Base URL)

Many providers (Groq, Together AI, Fireworks, OpenRouter, LM Studio, etc.) expose an OpenAI-compatible API. You can use `createOpenAI` with a custom `baseURL` instead of installing a dedicated package:

```typescript
case 'together': {
  const together = createOpenAI({
    apiKey: apiKey ?? '',
    baseURL: 'https://api.together.xyz/v1',
  })
  return together(modelName)
}
```

Works for:
| Provider | Base URL |
|----------|----------|
| Together AI | `https://api.together.xyz/v1` |
| Fireworks | `https://api.fireworks.ai/inference/v1` |
| OpenRouter | `https://openrouter.ai/api/v1` |
| LM Studio | `http://localhost:1234/v1` |
| Perplexity | `https://api.perplexity.ai` |
| Mistral | `https://api.mistral.ai/v1` |

---

## Adding a Model to an Existing Provider

Just add an entry to the `models` array in `AI_PROVIDERS`:

```typescript
{
  id: 'openai',
  label: 'OpenAI',
  models: [
    // existing...
    { value: 'gpt-4.1', label: 'GPT-4.1', description: 'Latest', context: '1M ctx' }, // ← new
  ],
},
```

No backend changes needed.

---

## Provider Checklist

When adding a new provider, verify:

- [ ] SDK installed (`pnpm add @ai-sdk/<provider>`)
- [ ] `createModel()` case added in `ai-service.ts`
- [ ] Provider + models added to `AI_PROVIDERS` in `useSettings.ts`
- [ ] `pnpm type-check` passes
- [ ] Test with a real API key in the UI Settings
- [ ] Check streaming works (some providers have quirks with `textStream`)

---

## Provider-Specific Notes

### Anthropic

Anthropic models require `max_tokens` to be set (the Vercel AI SDK handles this, but streaming may behave differently than OpenAI). Test with `claude-haiku-5-5` first — it's the cheapest.

### Ollama

No API key required. The `baseURL` defaults to `http://localhost:11434`. If Ollama runs on a different host/port, you'd need to make it configurable.

### o1 / o1-mini (OpenAI)

These models don't support streaming in the traditional sense — they compute the full response before sending. The app's streaming code still works (it just receives all tokens at once). Response time is significantly longer.

### Providers with Rate Limits

Some free tiers have aggressive rate limits. If you see timeout errors, add a retry wrapper around `streamText()` or use a paid tier key.
