# Configuração do Cloudflare KV Store

Este documento explica como configurar a autenticação para o Cloudflare KV store no Nuxt 4.

## Variáveis de Ambiente Necessárias

Adicione as seguintes variáveis ao seu arquivo `.env`:

```env
# Cloudflare KV Store Configuration (Production only)
CLOUDFLARE_ACCOUNT_ID=your_cloudflare_account_id
CLOUDFLARE_API_TOKEN=your_cloudflare_api_token
CLOUDFLARE_NAMESPACE_ID=your_cloudflare_namespace_id
```

## Como Obter as Credenciais

### 1. Account ID

- Acesse o [Cloudflare Dashboard](https://dash.cloudflare.com/)
- Vá para a seção "Workers & Pages"
- O Account ID está visível no canto superior direito

### 2. API Token

- No Cloudflare Dashboard, vá para "My Profile" > "API Tokens"
- Clique em "Create Token"
- Use o template "Custom token" ou crie um token com as seguintes permissões:
  - **Account**: KV Storage:Edit
  - **Zone**: Zone:Read (se necessário)
- Copie o token gerado

### 3. Namespace ID

- No Cloudflare Dashboard, vá para "Workers & Pages" > "KV"
- Crie um novo namespace ou use um existente
- O Namespace ID está visível na URL ou na lista de namespaces

## Configuração no Nuxt

A configuração já está implementada no `nuxt.config.ts`:

```typescript
$production: {
  nitro: {
    storage: {
      db: {
        driver: "cloudflare-kv-http",
        name: "db",
        accountId: process.env.CLOUDFLARE_ACCOUNT_ID,
        apiToken: process.env.CLOUDFLARE_API_TOKEN,
        namespaceId: process.env.CLOUDFLARE_NAMESPACE_ID,
      },
    },
  },
}
```

## Uso no Código

Para acessar o storage no seu código:

```typescript
// Em um composable ou server route
const { $storage } = useNuxtApp();

// Armazenar dados
await $storage.setItem("db:key", "value");

// Recuperar dados
const value = await $storage.getItem("db:key");

// Deletar dados
await $storage.removeItem("db:key");
```

## Segurança

- **Nunca** commite as credenciais do Cloudflare no repositório
- Use variáveis de ambiente em produção
- Configure as permissões mínimas necessárias no API Token
- Considere usar Cloudflare Workers para operações mais complexas

## Troubleshooting

### Erro de Autenticação

- Verifique se o API Token tem as permissões corretas
- Confirme se o Account ID está correto
- Verifique se o Namespace ID existe e está acessível

### Erro de Conectividade

- Verifique se as variáveis de ambiente estão definidas
- Confirme se o projeto está em modo de produção
- Verifique os logs do Cloudflare para mais detalhes
