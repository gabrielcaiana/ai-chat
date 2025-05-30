# AI Chat 🤖

<p align="center">
  <img src="https://img.shields.io/badge/status-in%20development-yellow" alt="Status: In Development">
  <img src="https://img.shields.io/badge/vue.js-3.5.13-42b883" alt="Vue.js">
  <img src="https://img.shields.io/badge/nuxt-3.16.1-00DC82" alt="Nuxt">
  <img src="https://img.shields.io/badge/node-%3E=18.0.0-brightgreen" alt="Node">
  <img src="https://img.shields.io/badge/license-MIT-blue" alt="License">
</p>

A modern AI chat application built with Nuxt 3, Vue.js, and OpenAI integration. This project provides a clean and intuitive interface for interacting with AI models.

## ✨ Features

- 🎨 Modern and responsive UI with Nuxt UI
- 🌙 Theme support with Material Design Components (MDC)
- 💬 Real-time chat interface
- 🤖 OpenAI integration
- 📝 Markdown support with syntax highlighting
- 🔄 Auto-scrolling chat window
- ⌨️ Multi-line input support
- 🎯 TypeScript support

## 🛠️ Tech Stack

- [Vue.js 3](https://vuejs.org/) - Progressive JavaScript Framework
- [Nuxt 3](https://nuxt.com/) - Vue.js Framework
- [Nuxt UI](https://ui.nuxt.com/) - UI Components
- [@nuxtjs/mdc](https://mdc.nuxtjs.org/) - Material Design Components
- [OpenAI SDK](https://platform.openai.com/) - AI Integration
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
├── server/             # Server-side code
├── public/             # Public static files
├── .nuxt/              # Nuxt build files
└── nuxt.config.ts      # Nuxt configuration
```

## 🚀 Getting Started

### Prerequisites

- Node.js (>= 18.0.0)
- pnpm (>= 8.10.0)

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/nuxt-chat.git
cd nuxt-chat
```

2. Install dependencies:

```bash
pnpm install
```

3. Create a `.env` file in the root directory:

```env
NUXT_OPENAI_API_KEY=your_openai_api_key
NUXT_PUBLIC_APP_ENV=development
NUXT_PUBLIC_BASE_URL=http://localhost:3000
```

### Development

Start the development server:

```bash
pnpm dev
```

The application will be available at `http://localhost:3000`

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
