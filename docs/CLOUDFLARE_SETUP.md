# Configuração do Cloudflare KV Store

Este documento explica como configurar a autenticação para o Cloudflare KV store no Nuxt 4.

## Variáveis de Ambiente Necessárias

Adicione as seguintes variáveis ao seu arquivo `.env`:

```env
# Cloudflare KV Store Configuration (Production only)
NUXT_CLOUDFLARE_ACCOUNT_ID=your_cloudflare_account_id
NUXT_CLOUDFLARE_API_TOKEN=your_cloudflare_api_token
NUXT_CLOUDFLARE_NAMESPACE_ID=your_cloudflare_namespace_id
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

A configuração está implementada no `layers/chat/nuxt.config.ts`:

```typescript
$production: {
  nitro: {
    storage: {
      db: {
        driver: "cloudflare-kv-http",
        name: "db",
        accountId: process.env.NUXT_CLOUDFLARE_ACCOUNT_ID,
        apiToken: process.env.NUXT_CLOUDFLARE_API_TOKEN,
        namespaceId: process.env.NUXT_CLOUDFLARE_NAMESPACE_ID,
      },
    },
  },
},
```

## Script de Build Inteligente

O projeto usa um script de build (`scripts/build.sh`) que verifica automaticamente se as variáveis do Cloudflare estão disponíveis:

- **Se as variáveis existem**: Executa o build com Cloudflare KV
- **Se as variáveis não existem**: Remove as variáveis e executa o build com storage local

## Comportamento

- **Desenvolvimento**: Usa storage local (fs) em `./.data`
- **CI/CD sem credenciais**: Usa storage local (fs) em `./.data`
- **Produção com credenciais**: Usa Cloudflare KV

## Uso no Código

Para acessar o storage no seu código:

```typescript
// Em um composable ou server route
const storage = useStorage("db");

// Armazenar dados
await storage.setItem("key", "value");

// Recuperar dados
const value = await storage.getItem("key");

// Deletar dados
await storage.removeItem("key");
```

## Configuração no CI/CD

### AWS Amplify

O arquivo `amplify.yml` está configurado para:

1. **Usar o script de build inteligente** que verifica as variáveis
2. **Adicionar variáveis condicionalmente** no postBuild

```yaml
build:
  commands:
    - ./scripts/build.sh

postBuild:
  commands:
    # Só adiciona as variáveis do Cloudflare se elas existirem
    - |
      if [ -n "$NUXT_CLOUDFLARE_ACCOUNT_ID" ] && [ -n "$NUXT_CLOUDFLARE_API_TOKEN" ] && [ -n "$NUXT_CLOUDFLARE_NAMESPACE_ID" ]; then
        echo "NUXT_CLOUDFLARE_ACCOUNT_ID=$NUXT_CLOUDFLARE_ACCOUNT_ID" >> .amplify-hosting/compute/default/.env
        echo "NUXT_CLOUDFLARE_NAMESPACE_ID=$NUXT_CLOUDFLARE_NAMESPACE_ID" >> .amplify-hosting/compute/default/.env
        echo "NUXT_CLOUDFLARE_API_TOKEN=$NUXT_CLOUDFLARE_API_TOKEN" >> .amplify-hosting/compute/default/.env
      fi
```

### GitHub Actions

O workflow `.github/workflows/ci.yml` está configurado para:

1. **Usar o script de build inteligente**
2. **Passar secrets opcionais** do Cloudflare

```yaml
- name: Build
  run: ./scripts/build.sh
  env:
    CI: true
    # Cloudflare KV variables (optional - script will handle if not set)
    NUXT_CLOUDFLARE_ACCOUNT_ID: ${{ secrets.NUXT_CLOUDFLARE_ACCOUNT_ID }}
    NUXT_CLOUDFLARE_API_TOKEN: ${{ secrets.NUXT_CLOUDFLARE_API_TOKEN }}
    NUXT_CLOUDFLARE_NAMESPACE_ID: ${{ secrets.NUXT_CLOUDFLARE_NAMESPACE_ID }}
```

### Configurando Secrets no GitHub

Para usar Cloudflare KV no GitHub Actions:

1. Vá para **Settings** > **Secrets and variables** > **Actions**
2. Adicione os seguintes secrets:
   - `NUXT_CLOUDFLARE_ACCOUNT_ID`
   - `NUXT_CLOUDFLARE_API_TOKEN`
   - `NUXT_CLOUDFLARE_NAMESPACE_ID`

**Nota**: Se os secrets não estiverem configurados, o script automaticamente usará storage local.

## Segurança

- **Nunca** commite as credenciais do Cloudflare no repositório
- Use variáveis de ambiente em produção
- Configure as permissões mínimas necessárias no API Token
- O script de build garante fallback seguro para storage local

## Troubleshooting

### Erro "Missing required option `accountId`"

- O script de build deve resolver isso automaticamente
- Verifique se o script `scripts/build.sh` está executável (`chmod +x scripts/build.sh`)

### Erro de Autenticação

- Verifique se o API Token tem as permissões corretas
- Confirme se o Account ID está correto
- Verifique se o Namespace ID existe e está acessível

### Erro de Conectividade

- Verifique se as variáveis de ambiente estão definidas
- Confirme se o projeto está em modo de produção
- Verifique os logs do Cloudflare para mais detalhes
