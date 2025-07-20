# AI Chat Server API 🚀

This is the server-side API implementation for the AI Chat application. It provides a flexible chat interface that switches between Ollama (development) and OpenAI (production) models.

## 🛠️ Architecture

```
server/
├── api/
│   └── ai.ts           # Main API endpoint handler
├── services/
│   └── ai-service.ts   # AI service implementation
└── tsconfig.json       # TypeScript configuration
```

## 🤖 AI Models

The application supports two AI models:

### Development Environment (Ollama)

- Uses local Ollama instance
- Model: `llama3.2`
- No API key required
- Runs completely locally

### Production Environment (OpenAI)

- Uses OpenAI's API
- Model: `gpt-4o-mini`
- Requires OpenAI API key
- Cloud-based solution

## 🔌 API Endpoints

### POST `/api/ai`

Main endpoint for chat interactions.

#### Request Body

```typescript
{
  messages: Array<{
    role: "user" | "assistant";
    content: string;
  }>;
}
```

#### Response

```typescript
{
  id: string,
  role: "assistant",
  content: string
}
```

## 💻 Environment Configuration

The API automatically switches between Ollama and OpenAI based on the `NUXT_PUBLIC_APP_ENV` environment variable:

```env
# Development (uses Ollama)
NUXT_PUBLIC_APP_ENV=development

# Production (uses OpenAI)
NUXT_PUBLIC_APP_ENV=production
NUXT_OPENAI_API_KEY=your_openai_api_key
```

## 🚀 Local Development

1. Install Ollama locally:

```bash
# macOS/Linux
curl https://ollama.ai/install.sh | sh

# Windows
# Download from https://ollama.ai/download
```

2. Pull the Llama model:

```bash
ollama pull llama3.2
```

3. Start Ollama:

```bash
ollama serve
```

## 🔒 Security

- OpenAI API key is only required in production
- Environment variables are properly handled through Nuxt's runtime config
- API responses are sanitized and validated

## 🔄 Error Handling

The API implements proper error handling for:

- Empty message arrays
- Invalid message formats
- Model generation errors
- Environment configuration issues

## 📚 Dependencies

- `@ai-sdk/openai`: OpenAI SDK integration
- `ollama-ai-provider`: Ollama integration
- `ai`: Core AI functionality
