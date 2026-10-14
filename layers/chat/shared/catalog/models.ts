// models.ts — single catalog of providers, models and prices
//
// Shared by the client (Settings UI, Compare page) and the server (cost
// estimation in the compare service). Keeping it in one place means adding a
// model is a one-line change and the price table never drifts from the UI.
//
// Prices are list prices in USD per 1M tokens (standard tier, short context),
// as published by each provider. They are an *estimate*: cache hits, batch
// discounts and long-context surcharges are not modelled.
// Last reviewed: 2026-10-13.

export type ProviderId = 'openai' | 'anthropic' | 'ollama';

export interface ModelPrice {
  /** USD per 1M input tokens */
  input: number;
  /** USD per 1M output tokens */
  output: number;
}

export interface ModelOption {
  value: string;
  label: string;
  description: string;
  context: string;
  price?: ModelPrice;
}

export interface Provider {
  id: ProviderId;
  label: string;
  models: ModelOption[];
}

// Local models run on your own hardware: marginal API cost is zero.
const LOCAL: ModelPrice = { input: 0, output: 0 };

export const AI_PROVIDERS: Provider[] = [
  {
    id: 'openai',
    label: 'OpenAI',
    models: [
      {
        value: 'gpt-6-astra',
        label: 'GPT-6 Astra',
        description: 'Most capable',
        context: '1M ctx',
        price: { input: 10, output: 50 },
      },
      {
        value: 'gpt-6.1-sol',
        label: 'GPT-6.1 Sol',
        description: 'Balanced',
        context: '1M ctx',
        price: { input: 2, output: 10 },
      },
      {
        value: 'gpt-6-luna',
        label: 'GPT-6 Luna',
        description: 'Fast & cheap',
        context: '1M ctx',
        price: { input: 0.1, output: 0.5 },
      },
    ],
  },
  {
    id: 'anthropic',
    label: 'Anthropic',
    models: [
      {
        value: 'claude-fable-5-1',
        label: 'Claude Fable 5.1',
        description: 'Most capable',
        context: '1M ctx',
        price: { input: 10, output: 50 },
      },
      {
        value: 'claude-opus-5-5',
        label: 'Claude Opus 5.5',
        description: 'Agentic & coding',
        context: '1M ctx',
        price: { input: 4, output: 20 },
      },
      {
        value: 'claude-sonnet-5-5',
        label: 'Claude Sonnet 5.5',
        description: 'Balanced',
        context: '1M ctx',
        price: { input: 2, output: 10 },
      },
      {
        value: 'claude-haiku-5-5',
        label: 'Claude Haiku 5.5',
        description: 'Fastest',
        context: '1M ctx',
        // ≤100K-token prompts; longer prompts are billed at $0.50 / $2.50
        price: { input: 0.1, output: 0.5 },
      },
    ],
  },
  {
    id: 'ollama',
    label: 'Ollama (Local)',
    models: [
      {
        value: 'qwen2.5:0.5b',
        label: 'Qwen 2.5 0.5B',
        description: 'Tiny, CPU friendly',
        context: 'Local',
        price: LOCAL,
      },
      {
        value: 'smollm2:135m',
        label: 'SmolLM2 135M',
        description: 'Tiny, CPU friendly',
        context: 'Local',
        price: LOCAL,
      },
      {
        value: 'llama3.2',
        label: 'Llama 3.2 3B',
        description: 'Local model',
        context: 'Local',
        price: LOCAL,
      },
      {
        value: 'qwen3:8b',
        label: 'Qwen3 8B',
        description: 'Local model',
        context: 'Local',
        price: LOCAL,
      },
    ],
  },
];

export function findModel(
  provider: string,
  model: string
): ModelOption | undefined {
  return AI_PROVIDERS.find(p => p.id === provider)?.models.find(
    m => m.value === model
  );
}

// getModelPrice — Ollama is always free; any other unknown model returns
// undefined so the UI can show "n/a" instead of a misleading $0.
export function getModelPrice(
  provider: string,
  model: string
): ModelPrice | undefined {
  if (provider === 'ollama') return LOCAL;
  return findModel(provider, model)?.price;
}

export function estimateCostUsd(
  provider: string,
  model: string,
  inputTokens: number | null | undefined,
  outputTokens: number | null | undefined
): number | null {
  const price = getModelPrice(provider, model);
  if (!price) return null;
  const cost =
    ((inputTokens ?? 0) * price.input + (outputTokens ?? 0) * price.output) /
    1_000_000;
  // Round to 8 decimal places to avoid floating point noise in the UI/DB
  return Math.round(cost * 1e8) / 1e8;
}
