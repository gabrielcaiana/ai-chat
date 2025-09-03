<h1 align="center"># AI Chat 🚧</h1>

<p align="center">
  <img src="https://img.shields.io/badge/status-in%20development-yellow" alt="Status: In Development">
  <img src="https://img.shields.io/badge/vue.js-3.5.13-42b883" alt="Vue.js">
  <img src="https://img.shields.io/badge/nuxt-3.16.1-00DC82" alt="Nuxt">
  <img src="https://img.shields.io/badge/node-%3E=18.0.0-brightgreen" alt="Node">
  <img src="https://img.shields.io/badge/license-MIT-blue" alt="License">
</p>

A modern AI chat application built with Nuxt 4, Vue.js, and OpenAI integration. This project provides a clean and intuitive interface for interacting with AI models, using Ollama locally for development and OpenAI for production.

## ✨ Features

- 🎨 Modern and responsive UI with Nuxt UI
- 🌙 Theme support with Material Design Components (MDC)
- 💬 Real-time chat interface
- 🤖 Dual AI model support (Ollama for development, OpenAI for production)
- 📝 Markdown support with syntax highlighting
- 🔄 Auto-scrolling chat window
- ⌨️ Multi-line input support
- 🎯 TypeScript support

## 🛠️ Tech Stack

- [Vue.js 3](https://vuejs.org/) - Progressive JavaScript Framework
- [Nuxt 4](https://nuxt.com/) - Vue.js Framework
- [Nuxt UI](https://ui.nuxt.com/) - UI Components
- [@nuxtjs/mdc](https://mdc.nuxtjs.org/) - Material Design Components
- [OpenAI SDK](https://platform.openai.com/) - Production AI Integration
- [Ollama](https://ollama.ai/) - Development AI Integration
- [Cloudflare KV](https://developers.cloudflare.com/workers/kv/) - Production Storage
- [TypeScript](https://www.typescriptlang.org/) - Type Safety

## 📦 Project Structure

```
nuxt-chat/
├── app/
│   ├── components/        # Vue components
│   │   ├── ChatInput.vue    # Chat input component
│   │   ├── ChatWindow.vue   # Main chat interface
│   │   └── MarkdownRenderer.vue # Markdown rendering
│   ├── pages/            # Application routes
│   └── assets/          # Static assets
├── server/             # Server-side code (See server/README.md)
├── public/             # Public static files
├── .nuxt/              # Nuxt build files
└── nuxt.config.ts      # Nuxt configuration
```

For detailed information about the server API and AI integration, see [Server API Documentation](server/README.md).

For Cloudflare KV Store configuration, see [Cloudflare Setup Documentation](docs/CLOUDFLARE_SETUP.md).

For CI/CD pipeline details, see [CI/CD Documentation](docs/CI_CD.md).

## 🚀 Getting Started

### Prerequisites

- Node.js (>= 18.0.0)
- pnpm (>= 8.10.0)
- Ollama (for development)

### Installation

1. Clone the repository:

```bash
git clone https://github.com/gabrielcaiana/nuxt-chat.git
cd nuxt-chat
```

2. Install dependencies:

```bash
pnpm install
```

3. Install and setup Ollama (for development):

```bash
# macOS/Linux
curl https://ollama.ai/install.sh | sh

# Windows
# Download from https://ollama.ai/download

# Pull the model
ollama pull llama3.2
```

4. Create a `.env` file in the root directory:

```env
# Development
NUXT_PUBLIC_APP_ENV=development
NUXT_PUBLIC_BASE_URL=http://localhost:3000

# Production only
NUXT_OPENAI_API_KEY=your_openai_api_key  # Only required in production

# Cloudflare KV Store Configuration (Production only)
NUXT_CLOUDFLARE_ACCOUNT_ID=your_cloudflare_account_id
NUXT_CLOUDFLARE_API_TOKEN=your_cloudflare_api_token
NUXT_CLOUDFLARE_NAMESPACE_ID=your_cloudflare_namespace_id
NUXT_DATABASE_NAME=
NUXT_DATABASE_PASSWORD=

# Connect to Supabase via connection pooling
NUXT_DATABASE_URL=

# Direct connection to the database. Used for migrations
NUXT_DIRECT_URL=
```

### Development

1. Start Ollama server:

```bash
ollama serve
```

2. Start the development server in a new terminal:

```bash
pnpm dev
```

The application will be available at `http://localhost:3000`

## 🧪 Testing

### Unit Tests

```bash
# run tests
pnpm test:run

# run tests with UI
pnpm test:ui

# run tests with coverage
pnpm test:coverage
```

### E2E Tests

```bash
# run E2E tests
pnpm test:e2e

# run E2E tests with UI
pnpm test:e2e:ui

# run E2E tests in headed mode
pnpm test:e2e:headed

# run E2E tests in debug mode
pnpm test:e2e:debug

# install Playwright browsers
pnpm test:e2e:install
```

For detailed E2E testing information, see [E2E Testing Documentation](docs/E2E_TESTING.md).

## 🔍 Code Quality

```bash
# lint code
pnpm lint

# fix linting issues
pnpm lint:fix

# type check
pnpm type-check

# format code
pnpm prettier --write .
```

## 🪝 Git Hooks

Este projeto usa [Husky](https://typicode.github.io/husky/) para gerenciar hooks Git:

- **Pre-commit**: Executa lint-staged, testes, lint e type-check
- **Commit-msg**: Valida mensagens de commit seguindo [Conventional Commits](docs/COMMIT_CONVENTION.md)

### Exemplo de Commit

```bash
git commit -m "feat: add new user authentication feature"
```

## 🚀 CI/CD

O projeto usa GitHub Actions para automação contínua:

### Pipeline de CI

1. **Setup**: Node.js 22.x + pnpm
2. **Dependências**: Instalação com cache
3. **Qualidade**: Lint + Type-check
4. **Testes Unitários**: Execução + Cobertura
5. **Testes E2E**: Playwright + Múltiplos navegadores
6. **Build**: Aplicação de produção
7. **Relatórios**: Upload de cobertura + Resultados E2E

### Status de Qualidade

- ✅ **Lint**: Código formatado e sem erros
- ✅ **Type-check**: Validação TypeScript
- ✅ **Testes Unitários**: 16/16 testes passando
- ✅ **Testes E2E**: Playwright configurado e funcional
- ✅ **Cobertura**: Meta de 80% de cobertura
- ✅ **Build**: Aplicação compilada com sucesso

### Arquivos de Configuração

- `.github/workflows/ci.yml` - Pipeline de CI/CD
- `.codecov.yml` - Configuração de cobertura
- `commitlint.config.mjs` - Regras de commit
- `.prettierrc` - Formatação de código
- `playwright.config.ts` - Configuração de testes E2E

### Production

Build the application:

```bash
pnpm build
```

Preview the production build:

```bash
pnpm preview
```

## 🎨 Theme Configuration

The project uses MDC for syntax highlighting with the Catppuccin Frappé theme. Theme configuration can be found in `nuxt.config.ts`:

```typescript
mdc: {
  highlight: {
    theme: "catppuccin-frappe",
    langs: ["js", "jsx", "json", "ts", "tsx", "vue", "css", "html", "bash", "md", "mdc", "yaml"],
  },
}
```

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

Contributions are welcome! Feel free to open issues and submit pull requests.

## 📫 Contact

- Author: Gabriel Caiana
- GitHub: http://github.com/gabrielcaiana

---

<p align="center">Made with ❤️ and ☕</p>
