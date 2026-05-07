# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm install          # Install dependencies
pnpm dev              # Start dev server
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

Run a single unit test file:

```bash
pnpm vitest run tests/unit/path/to/file.test.ts
```

## Architecture

This is a **Nuxt 4** app using **Nuxt Layers** to separate features. The three layers are composed at build time via `nuxt.config.ts` at the root.

### Layers

- **`layers/base/`** — Shared layout, components (`AppSidebar`, `AppHeader`, `MarkdownRenderer`, `TypewriterText`), global CSS (Catppuccin Frappé theme), and Prisma utility
- **`layers/chat/`** — Core app: chat UI, API routes, AI service, repositories
- **`layers/marketing/`** — Landing page

### Data flow (chat)

```
Vue Component → composable (useChat, useSendMessage) → fetch /api/chats/[id]/messages/stream
  → Nitro server route → ai-service.ts → Ollama (dev) / OpenAI (prod)
  → messages stored via chatRepository.ts → Prisma → PostgreSQL (Supabase)
```

### AI service

`layers/chat/server/services/ai-service.ts` — switches between **Ollama** (`llama3.2`, for `appEnv=development`) and **OpenAI** (`gpt-4o-mini`, for production) using the Vercel AI SDK. The `NUXT_PUBLIC_APP_ENV` env var controls which provider is used.

### Database

Prisma schema at `prisma/schema.prisma`. Models: `User → Project → Chat → Message` (all cascading deletes except Project→Chat which nullifies). Data access is entirely through repositories in `layers/chat/server/repository/`.

### API routes

All under `layers/chat/server/api/`. Key endpoints:

- `POST /api/ai` — non-streaming chat (dev)
- `POST /api/chats/[id]/messages/stream` — streaming chat response
- `POST /api/chats/[id]/messages/generate` — non-streaming with persistence
- `POST /api/chats/[id]/title` — auto-generate chat title
- `GET|POST /api/projects` and `GET|PUT /api/chats` — CRUD

Request bodies are validated with Zod schemas in `layers/chat/server/utils/schema.ts`.

### Storage

Nitro unstorage is configured in `layers/chat/nuxt.config.ts`. In development it uses the filesystem (`fs`); production is configured for Cloudflare KV (currently commented out — Supabase/Prisma is the active persistence layer).

## Environment variables

Copy `.env.sample` to `.env`. Required variables:

```
NUXT_PUBLIC_APP_ENV=development          # or production
NUXT_OPENAI_API_KEY=                     # required in production
NUXT_DATABASE_URL=                       # Supabase connection pooling URL
NUXT_DIRECT_URL=                         # Supabase direct URL (for migrations)
```

## Testing

- **Unit tests**: Vitest with jsdom, files in `tests/unit/`
- **E2E tests**: Playwright, files in `tests/e2e/`, runs against `http://localhost:3000`
- Pre-commit: Husky runs lint-staged (ESLint + Prettier) and validates conventional commit messages

## Key conventions

- Commit messages must follow **Conventional Commits** (enforced by Husky)
- The `shared/utils/` directory at the root is aliased and available in both app and server code
- Nuxt auto-imports apply within each layer; cross-layer imports need explicit paths
