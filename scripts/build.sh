#!/bin/bash

# Script de build que verifica variáveis do Cloudflare antes de executar

echo "🔍 Verificando variáveis de ambiente do Cloudflare..."

# Verifica se todas as variáveis do Cloudflare estão definidas
if [ -n "$NUXT_CLOUDFLARE_ACCOUNT_ID" ] && [ -n "$NUXT_CLOUDFLARE_API_TOKEN" ] && [ -n "$NUXT_CLOUDFLARE_NAMESPACE_ID" ]; then
    echo "✅ Todas as variáveis do Cloudflare estão definidas"
    echo "🚀 Executando build com Cloudflare KV..."
    pnpm run build
else
    echo "⚠️  Variáveis do Cloudflare não estão definidas"
    echo "📝 Executando build com storage local..."
    
    # Remove temporariamente as variáveis do Cloudflare para evitar erros
    unset NUXT_CLOUDFLARE_ACCOUNT_ID
    unset NUXT_CLOUDFLARE_API_TOKEN
    unset NUXT_CLOUDFLARE_NAMESPACE_ID
    
    # Executa o build
    pnpm run build
fi 