# CLAUDE.md

Guidance for Claude Code when working in this repository.

## Purpose

This is an **AI model testing laboratory** — a full-stack chat interface for exploring, comparing, and benchmarking LLMs across providers (OpenAI, Anthropic, Ollama). The primary goal is deep study of LLM behavior, not feature shipping. Prioritize clarity, extensibility, and clean separation of concerns.

---

## Commands

```bash
pnpm install          # Install dependencies
pnpm dev              # Start dev server → http://localhost:3000
pnpm build            # Production build
pnpm lint             # Run ESLint
pnpm lint:fix         # Fix lint issues
pnpm type-check       # TypeScript validation
pnpm test:run         # Unit tests (single run)
pnpm test             # Unit tests (watch mode)
pnpm test:coverage    # Unit tests with coverage
pnpm test:e2e         # E2E tests (Playwright)
pnpm prisma:migrate   # Run Prisma migrations (dev)
```

Run a single unit test:

```bash
pnpm vitest run tests/unit/path/to/file.test.ts
```

---

## Architecture

**Nuxt 4** app using **Nuxt Layers** to separate concerns. Three layers compose at build time via root `nuxt.config.ts`.

### Layers

| Layer       | Path                | Purpose                                                     |
| ----------- | ------------------- | ----------------------------------------------------------- |
| `base`      | `layers/base/`      | Design system, layout, shared components, global CSS        |
| `chat`      | `layers/chat/`      | Core feature: chat UI, API routes, AI service, repositories |
| `marketing` | `layers/marketing/` | Landing page (no auth needed)                               |

### Key components (`layers/base/app/components/`)

- **AppHeader** — Fixed header with model selector pill + settings icon + New Chat button
- **AppSidebar** — Left nav: projects, date-grouped chat history, active state with cyan accent
- **SettingsModal** — Teleport modal for provider / API token / model configuration
- **MarkdownRenderer** — MDC-based markdown with syntax highlighting
- **TypewriterText** — Clip-path typewriter animation for chat titles

### Key composables (`layers/chat/app/composables/`)

- **useSettings** — Global state: `apiToken`, `selectedModel`, `selectedProvider` via `useState` + `localStorage`. Exposes `openSettings()`, `save()`, `load()`. Load on mount from any component via `load()`.
- **useChat(chatId)** — Single chat: `messages`, `sendMessage()`, `fetchMessages()`, `assignToProject()`. Passes settings (token, model, provider) to the stream endpoint automatically.
- **useChats()** — All chats list: `chats`, `createChat()`, `createChatAndNavigate()`, `fetchChats()`
- **useProjects()** / **useProject(id)** — Project CRUD

### AI service (`layers/chat/server/services/ai-service.ts`)

Central factory for all model creation:

```typescript
createModel(provider, model, apiKey) → LanguageModel   // AI SDK v7, no casts
```

Supported providers:

- `'openai'` — via `@ai-sdk/openai`. Models: gpt-6-astra, gpt-6.1-sol, gpt-6-luna
- `'anthropic'` — via `@ai-sdk/anthropic`. Models: claude-fable-5-1, claude-opus-5-5, claude-sonnet-5-5, claude-haiku-5-5
- `'ollama'` — via `ai-sdk-ollama` (`OLLAMA_BASE_URL`, default localhost:11434). Models: any model installed locally

The model catalog + price table lives in `layers/chat/shared/catalog/models.ts` (used by Settings UI, Compare page and cost estimation). In v7, system prompts go in `instructions`, not in `messages`.

### Compare service (`layers/chat/server/services/compare-service.ts`)

`runComparison({ prompt, targets, resolveModel, emit })` runs `streamText` for every target in parallel and returns per-model `CompareResult` (output, TTFT, latency, tokens, estimated cost, error). `createCompareStream()` wraps it as NDJSON for `POST /api/compare`; runs are persisted via `runRepository` (`Run` → `RunResult`). Pure and DI-friendly: unit tests use `MockLanguageModelV4` from `ai/test`.

### Stream endpoint (`layers/chat/server/api/chats/[id]/messages/stream.post.ts`)

Reads from request:

- `body.provider` — which provider to use (default: `'openai'`)
- `body.model` — which model to use (default: `'gpt-6-luna'`)
- `header['x-ai-token']` or `body.apiToken` — API key (falls back to `NUXT_OPENAI_API_KEY`)

### Data flow

```
Vue Component
  → useChat.sendMessage()
    → POST /api/chats/[id]/messages (persist user message)
    → POST /api/chats/[id]/messages/stream (stream AI response)
        headers: { x-ai-token: token }
        body: { messages, provider, model }
      → ai-service.createModel(provider, model, apiKey)
      → streamText() via Vercel AI SDK
      → TransformStream: stream chunks to client + save complete response to DB
```

### Database

Prisma schema at `prisma/schema.prisma`.

```
User → Project → Chat → Message
Run → RunResult            (compare history)
```

- Project→Chat: `SET NULL` on delete (chats survive project deletion)
- All others: cascade delete
- Data access only via repositories in `layers/chat/server/repository/`

### API routes (`layers/chat/server/api/`)

| Method   | Path                                | Description                       |
| -------- | ----------------------------------- | --------------------------------- |
| GET      | `/api/chats`                        | List all chats                    |
| POST     | `/api/chats`                        | Create chat                       |
| GET      | `/api/chats/[id]`                   | Get chat                          |
| PUT      | `/api/chats/[id]`                   | Update chat (e.g. assign project) |
| POST     | `/api/chats/[id]/messages/stream`   | Stream AI response                |
| POST     | `/api/chats/[id]/messages/generate` | Non-streaming response            |
| POST     | `/api/chats/[id]/title`             | Auto-generate title               |
| POST     | `/api/compare`                      | Side-by-side run (NDJSON stream)  |
| GET      | `/api/compare/runs`                 | Run history                       |
| GET      | `/api/compare/runs/[id]`            | One run with results              |
| GET/POST | `/api/projects`                     | List / create projects            |
| GET/PUT  | `/api/projects/[id]`                | Get / update project              |

Request bodies validated with Zod in `layers/chat/server/utils/schema.ts`.

---

## Design System

Theme: **Harness-inspired** dark interface. All tokens in `layers/base/app/assets/css/main.css`.

| Token             | Value                   | Usage               |
| ----------------- | ----------------------- | ------------------- |
| `--h-cyan`        | `#0ea5e9`               | Primary accent      |
| `--h-cyan-dim`    | `rgba(14,165,233,0.07)` | Tinted backgrounds  |
| `--h-cyan-border` | `rgba(14,165,233,0.28)` | Accent borders      |
| `--h-surface`     | `#0c1118`               | Sidebar, header     |
| `--h-surface-2`   | `#111924`               | Elevated cards      |
| `--h-surface-3`   | `#18222f`               | Hover states        |
| `--h-border`      | `#1b2635`               | Default borders     |
| `--h-border-hi`   | `#2a3f5e`               | Highlighted borders |
| `--h-sidebar-w`   | `240px`                 | Sidebar width       |
| `--h-header-h`    | `52px`                  | Header height       |

Fonts: **Sora** (UI) + **JetBrains Mono** (labels, code, model names) via Google Fonts.

Icons: `i-lucide-*` (collection installed via `@iconify-json/lucide`).

---

## Environment Variables

Copy `.env.sample` to `.env`:

```env
NUXT_PUBLIC_APP_ENV=development       # 'development' | 'production'
NUXT_OPENAI_API_KEY=                  # Server-side fallback key (UI key takes priority)
NUXT_DATABASE_URL=                    # Supabase connection pooling URL
NUXT_DIRECT_URL=                      # Supabase direct URL (for migrations)
```

> The UI-configured API token always takes priority over the server-side env key. Set `NUXT_OPENAI_API_KEY` only as a shared fallback.

---

## Testing

- **Unit tests**: Vitest + jsdom — `tests/unit/`
- **E2E tests**: Playwright — `tests/e2e/` — requires server at `http://localhost:3000`
- Pre-commit: Husky → lint-staged (ESLint + Prettier) + conventional commit message validation

---

## Key Conventions

- Commit messages: **Conventional Commits** (enforced by Husky + commitlint)
- `shared/utils/` at root is aliased and available in both app and server code
- Nuxt auto-imports apply within each layer; cross-layer imports need explicit paths
- Never import from `layers/chat/` inside `layers/base/` — base must stay provider-agnostic
- All AI provider switching happens in `ai-service.ts` — no provider logic in routes
- Settings (token, model, provider) are owned by `useSettings` — no direct localStorage access elsewhere

---

## Comments

This is a **lab and study project**. Comments are required on all core flows — the goal is that any developer (or future self) can open a file and immediately understand what it does, why it works that way, and how it connects to the rest of the system.

**Where to comment:**

- Top of each core file: a block comment explaining the file's responsibility, the flow it participates in, and any non-obvious design decisions
- Above each exported function: what it does, why it exists, and any important edge cases or gotchas
- Inline on non-obvious logic: explain the _why_, not the _what_ (the code already shows what)

**What not to comment:**

- Self-explanatory variable names or trivial operations
- Re-stating what the code already clearly says (e.g. `// increment counter` above `count++`)

**Style:**

- Use `//` line comments, never JSDoc blocks unless generating public API docs
- Keep comments in English for consistency
- Write as if explaining to a colleague who understands the language but is new to the project

---

## Adding a New AI Provider

See [`docs/PROVIDERS.md`](docs/PROVIDERS.md) for a step-by-step guide.

Quick checklist:

1. Install the `@ai-sdk/<provider>` package
2. Add a `case` to `createModel()` in `ai-service.ts`
3. Add the provider + models array to `AI_PROVIDERS` in `useSettings.ts`
4. That's it — the UI picks it up automatically
