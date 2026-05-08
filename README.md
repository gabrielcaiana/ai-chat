<div align="center">
  <h1>AI Lab</h1>
  <p><strong>Personal laboratory for exploring, testing and benchmarking Large Language Models</strong></p>
  <p>
    <img src="https://img.shields.io/badge/status-active-brightgreen" alt="Status">
    <img src="https://img.shields.io/badge/nuxt-4.0-00DC82" alt="Nuxt">
    <img src="https://img.shields.io/badge/vercel_ai_sdk-4.3-000000" alt="AI SDK">
    <img src="https://img.shields.io/badge/providers-OpenAI_·_Anthropic_·_Ollama-0ea5e9" alt="Providers">
    <img src="https://img.shields.io/badge/license-MIT-blue" alt="License">
  </p>
</div>

---

## What is this?

This is my personal AI model testing laboratory — a full-stack chat interface built to let me **explore, compare, and go deep on Large Language Models** in a controlled, reproducible environment.

The goal is not to build yet another chat app. The goal is to have a structured workspace where I can:

- Run the same prompt across different models and compare outputs side-by-side
- Test local models via **Ollama** without sending data to any cloud provider
- Quickly switch between **OpenAI**, **Anthropic** and local models using my own API keys
- Track conversations organized in **Projects** so experiments stay contextual
- Understand real-world LLM behavior: latency, reasoning quality, instruction following, code generation, hallucination patterns

Everything is self-hosted, privacy-first, and designed for depth — not breadth.

---

## Providers Supported

| Provider      | Models                                                                      | Requires               |
| ------------- | --------------------------------------------------------------------------- | ---------------------- |
| **OpenAI**    | GPT-4o, GPT-4o Mini, o1, o1-mini                                            | API Key                |
| **Anthropic** | Claude Opus 4, Sonnet 4, Haiku 4                                            | API Key                |
| **Ollama**    | Llama 3.2, Llama 3.1, Mistral, DeepSeek Coder, CodeLlama, + any local model | Ollama running locally |

> Switching providers and models happens entirely in the UI — no code changes, no restarts.

---

## Tech Stack

| Layer          | Technology                                                                              |
| -------------- | --------------------------------------------------------------------------------------- |
| Framework      | [Nuxt 4](https://nuxt.com/) with Nuxt Layers                                            |
| UI             | [Nuxt UI](https://ui.nuxt.com/) + custom Harness-inspired design system                 |
| AI Integration | [Vercel AI SDK](https://sdk.vercel.ai/) (`ai` + `@ai-sdk/openai` + `@ai-sdk/anthropic`) |
| Local Models   | [Ollama](https://ollama.ai/) via `ollama-ai-provider`                                   |
| Database       | PostgreSQL via [Prisma](https://www.prisma.io/) + [Supabase](https://supabase.com/)     |
| Markdown       | [@nuxtjs/mdc](https://mdc.nuxtjs.org/) with syntax highlighting                         |
| Testing        | [Vitest](https://vitest.dev/) (unit) + [Playwright](https://playwright.dev/) (E2E)      |
| Language       | TypeScript throughout                                                                   |

---

## Getting Started

### 1. Clone and install

```bash
git clone https://github.com/gabrielcaiana/ai-chat.git
cd ai-chat
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
```

### 3. Set up the database

```bash
pnpm prisma:migrate
```

### 4. Start a local model (optional)

```bash
# Install Ollama: https://ollama.ai
ollama pull llama3.2
ollama serve
```

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
ai-chat/
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
│   │   │   ├── components/          # ChatWindow, ChatInput
│   │   │   ├── composables/
│   │   │   │   ├── useChat.ts       # Single chat operations + streaming
│   │   │   │   ├── useChats.ts      # Chat list management
│   │   │   │   ├── useSettings.ts   # Provider/model/token state (→ localStorage)
│   │   │   │   └── useChatScroll.ts
│   │   │   └── pages/
│   │   └── server/
│   │       ├── api/                 # Nitro API routes
│   │       ├── repository/          # Prisma data access
│   │       └── services/
│   │           └── ai-service.ts    # Multi-provider AI factory
│   └── marketing/                   # Landing page
├── prisma/schema.prisma             # DB schema: User → Project → Chat → Message
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
