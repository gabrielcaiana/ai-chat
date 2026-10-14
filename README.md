<div align="center">
  <h1>AI Lab</h1>
  <p><strong>Personal laboratory for exploring, testing and benchmarking Large Language Models</strong></p>
  <p>
    <img src="https://img.shields.io/badge/status-active-brightgreen" alt="Status">
    <img src="https://img.shields.io/badge/nuxt-4.0-00DC82" alt="Nuxt">
    <img src="https://img.shields.io/badge/vercel_ai_sdk-7-000000" alt="AI SDK">
    <img src="https://img.shields.io/badge/providers-OpenAI_·_Anthropic_·_Ollama-0ea5e9" alt="Providers">
    <img src="https://img.shields.io/badge/license-MIT-blue" alt="License">
  </p>
</div>

---

## What is this?

This is my personal AI model testing laboratory — a full-stack chat interface built to let me **explore, compare, and go deep on Large Language Models** in a controlled, reproducible environment.

The goal is not to build yet another chat app. The goal is to have a structured workspace where I can:

- Run the same prompt across different models and compare outputs side-by-side — **with TTFT, latency, tokens and estimated cost per model** ([see below](#compare-models-side-by-side))
- Test local models via **Ollama** without sending data to any cloud provider
- Quickly switch between **OpenAI**, **Anthropic** and local models using my own API keys
- Track conversations organized in **Projects** so experiments stay contextual
- Understand real-world LLM behavior: latency, reasoning quality, instruction following, code generation, hallucination patterns

Everything is self-hosted, privacy-first, and designed for depth — not breadth.

---

## Compare models side by side

![Compare models: one prompt, several models streaming in parallel](docs/assets/compare-demo.gif)

This is the feature I built this lab for. On `/compare` I write one prompt, pick up to 6 models (any mix of OpenAI, Anthropic and local Ollama models) and they all run **in parallel, streaming into their own column**. When each one finishes, its footer shows:

| Metric            | How I measure it                                                                                               |
| ----------------- | -------------------------------------------------------------------------------------------------------------- |
| **TTFT**          | time from request start to the first text token (server side)                                                  |
| **Total**         | time until the stream finishes (or fails)                                                                      |
| **Tokens in/out** | usage reported by the provider through the AI SDK                                                              |
| **tok/s**         | output tokens ÷ (total − TTFT)                                                                                 |
| **Est. cost**     | tokens × list price from [`models.ts`](layers/chat/shared/catalog/models.ts); `$0` for local, `n/a` if unknown |

Every run is saved (`Run` + `RunResult` in Postgres) and shows up in the **Run history** sidebar, so I can reopen a comparison later. Errors are isolated per model: a missing key or a provider outage turns that one column red and the others keep going. A cloud model without an API key fails fast, without sending any request.

| Streaming                                       | Results + metrics                           |
| ----------------------------------------------- | ------------------------------------------- |
| ![streaming](docs/assets/compare-streaming.png) | ![results](docs/assets/compare-results.png) |

Under the hood:

```
POST /api/compare  { prompt, targets: [{ provider, model }], apiKeys? }
  → compare-service.runComparison()        # Promise.all over targets
      streamText(model) per target          # AI SDK v7, maxRetries: 0
        text-delta → NDJSON {"type":"delta","index":i,"text":…}
        finish     → TTFT, latency, usage, cost → {"type":"result",…}
  → runRepository.createRun()               # Prisma: Run + RunResult[]
  → {"type":"done","runId":…}
GET /api/compare/runs        # history
GET /api/compare/runs/:id    # one run
```

---

## Providers Supported

Prices are list prices in USD per 1M tokens (input / output), reviewed on 2026-10-13. They are only used to _estimate_ cost; cache, batch and long-context pricing are not modelled. The single source of truth is [`layers/chat/shared/catalog/models.ts`](layers/chat/shared/catalog/models.ts).

| Provider      | Model ID                                                                  | Label             | Price (in / out)             |
| ------------- | ------------------------------------------------------------------------- | ----------------- | ---------------------------- |
| **OpenAI**    | `gpt-6-astra`                                                             | GPT-6 Astra       | $10 / $50                    |
|               | `gpt-6.1-sol`                                                             | GPT-6.1 Sol       | $2 / $10                     |
|               | `gpt-6-luna`                                                              | GPT-6 Luna        | $0.10 / $0.50                |
| **Anthropic** | `claude-fable-5-1`                                                        | Claude Fable 5.1  | $10 / $50                    |
|               | `claude-opus-5-5`                                                         | Claude Opus 5.5   | $4 / $20                     |
|               | `claude-sonnet-5-5`                                                       | Claude Sonnet 5.5 | $2 / $10                     |
|               | `claude-haiku-5-5`                                                        | Claude Haiku 5.5  | $0.10 / $0.50 (≤100K prompt) |
| **Ollama**    | `qwen2.5:0.5b`, `smollm2:135m`, `llama3.2`, `qwen3:8b`, + any local model | —                 | $0 (local)                   |

> Switching providers and models happens entirely in the UI — no code changes, no restarts. Any model ID the provider accepts works; only the ones above have a price.

---

## Tech Stack

| Layer          | Technology                                                                              |
| -------------- | --------------------------------------------------------------------------------------- |
| Framework      | [Nuxt 4](https://nuxt.com/) with Nuxt Layers                                            |
| UI             | [Nuxt UI](https://ui.nuxt.com/) + custom Harness-inspired design system                 |
| AI Integration | [Vercel AI SDK](https://ai-sdk.dev/) v7 (`ai` + `@ai-sdk/openai` + `@ai-sdk/anthropic`) |
| Local Models   | [Ollama](https://ollama.com/) via `ai-sdk-ollama`                                       |
| Database       | PostgreSQL via [Prisma](https://www.prisma.io/) + [Supabase](https://supabase.com/)     |
| Markdown       | [@nuxtjs/mdc](https://mdc.nuxtjs.org/) with syntax highlighting                         |
| Testing        | [Vitest](https://vitest.dev/) (unit) + [Playwright](https://playwright.dev/) (E2E)      |
| Language       | TypeScript throughout                                                                   |

---

## Getting Started

### 1. Clone and install

```bash
git clone https://github.com/gabrielcaiana/ai-lab.git
cd ai-lab
pnpm install
```

### 2. Configure environment

```bash
cp .env.sample .env
```

Edit `.env`:

```env
NUXT_PUBLIC_APP_ENV=development
NUXT_DATABASE_URL=postgresql://...    # Supabase pooling URL
NUXT_DIRECT_URL=postgresql://...      # Supabase direct URL
NUXT_OPENAI_API_KEY=                  # Optional — can also set per-session in the UI
NUXT_ANTHROPIC_API_KEY=               # Optional — used by /compare when the UI has no Anthropic key
OLLAMA_BASE_URL=http://localhost:11434 # Optional
```

### 3. Set up the database

Any Postgres works. For a fully local setup I use Docker:

```bash
docker run -d --name ai-lab-db -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=ailab -p 5432:5432 postgres:17
# .env → DATABASE_URL / DIRECT_URL = postgresql://postgres:postgres@localhost:5432/ailab
pnpm prisma:migrate
npx prisma db seed   # creates the default user used by chats
```

### 4. Start a local model (optional)

```bash
# Install Ollama: https://ollama.com
ollama serve
ollama pull qwen2.5:0.5b   # ~400 MB, runs fine on CPU
ollama pull smollm2:135m   # ~140 MB
```

With only local models the whole lab (including `/compare`) runs with **zero API spend**. On small CPU-only machines, running several models at once can starve threads; a Modelfile with `PARAMETER num_thread 3` per model fixed it for me.

### 5. Run the dev server

```bash
pnpm dev
# → http://localhost:3000
```

### 6. Configure your model in the UI

Click **Settings** (⚙) in the top-right corner → choose your provider → paste your API token → select a model.

---

## Project Structure

```
ai-lab/
├── layers/
│   ├── base/                        # Shared layout, design system, global CSS
│   │   └── app/
│   │       ├── assets/css/main.css  # Design tokens (Harness theme)
│   │       ├── components/
│   │       │   ├── AppHeader.vue    # Header with model selector
│   │       │   ├── AppSidebar.vue   # Navigation + chat history
│   │       │   └── SettingsModal.vue # Provider / token / model config
│   │       └── layouts/default.vue
│   ├── chat/                        # Core chat feature
│   │   ├── app/
│   │   │   ├── components/          # ChatWindow, ChatInput, CompareColumn
│   │   │   ├── composables/
│   │   │   │   ├── useCompare.ts    # Side-by-side runs (NDJSON stream) + history
│   │   │   │   ├── useChat.ts       # Single chat operations + streaming
│   │   │   │   ├── useChats.ts      # Chat list management
│   │   │   │   ├── useSettings.ts   # Provider/model/token state (→ localStorage)
│   │   │   │   └── useChatScroll.ts
│   │   │   └── pages/               # chats, projects, compare/
│   │   ├── shared/catalog/
│   │   │   ├── models.ts            # Providers, models and price table
│   │   │   └── compare.ts           # Compare wire types (NDJSON events)
│   │   └── server/
│   │       ├── api/                 # Nitro API routes (chats, projects, compare)
│   │       ├── repository/          # Prisma data access (chat, project, run)
│   │       └── services/
│   │           ├── ai-service.ts    # Multi-provider AI factory
│   │           └── compare-service.ts # Parallel fan-out + metrics
│   └── marketing/                   # Landing page
├── prisma/schema.prisma             # User → Project → Chat → Message; Run → RunResult
├── tests/
│   ├── unit/                        # Vitest
│   └── e2e/                         # Playwright
└── docs/                            # Testing guides ← start here
```

---

## Testing Guides

| Guide                                        | Description                                                  |
| -------------------------------------------- | ------------------------------------------------------------ |
| [Models Overview](docs/MODELS.md)            | All supported models, their strengths and when to use each   |
| [Ollama Setup](docs/OLLAMA.md)               | Running local models: install, pull, manage, benchmark       |
| [Adding Providers](docs/PROVIDERS.md)        | How to wire up a new AI provider to the codebase             |
| [Testing Workflow](docs/TESTING_WORKFLOW.md) | Structured methodology for comparing and benchmarking models |
| [E2E Testing](docs/E2E_TESTING.md)           | Playwright test setup and running E2E tests                  |
| [CI/CD](docs/CI_CD.md)                       | GitHub Actions pipeline                                      |

---

## Commands

```bash
pnpm dev              # Start dev server
pnpm build            # Production build
pnpm lint             # ESLint
pnpm lint:fix         # Auto-fix lint issues
pnpm type-check       # TypeScript check
pnpm test:run         # Unit tests (single run)
pnpm test             # Unit tests (watch)
pnpm test:coverage    # Unit tests with coverage
pnpm test:e2e         # E2E tests
pnpm prisma:migrate   # Run DB migrations
```

---

## How the AI routing works

Every message goes through this pipeline:

```
ChatInput → useChat.sendMessage()
  → POST /api/chats/[id]/messages/stream
    → reads { provider, model } from request body
    → reads API token from x-ai-token header (or server env)
    → ai-service.createModel(provider, model, apiKey)
    → streams response back via TransformStream
  → client reads stream chunk by chunk
  → response saved to DB when stream completes
```

The `useSettings` composable persists the selected provider/model/token to `localStorage` and attaches them to every stream request automatically.

---

## License

MIT © [Gabriel Caiana](https://github.com/gabrielcaiana)
