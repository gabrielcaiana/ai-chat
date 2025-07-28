import { fileURLToPath } from "url";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-20",

  css: ["./layers/base/app/assets/css/main.css"],

  // TypeScript enhancements
  typescript: {
    typeCheck: "build",
    strict: true,
  },

  // Custom aliases for better imports
  alias: {
    types: fileURLToPath(new URL("./layers/chat/app/types", import.meta.url)),
    shared: fileURLToPath(new URL("./layers/chat/shared", import.meta.url)),
  },

  // Performance optimizations
  experimental: {
    buildCache: true,
    componentIslands: true,
    browserDevtoolsTiming: process.env.NODE_ENV === "development",
  },

  runtimeConfig: {
    openaiApiKey: process.env.NUXT_OPENAI_API_KEY,
    public: {
      appEnv: process.env.NUXT_PUBLIC_APP_ENV,
      baseUrl: process.env.NUXT_PUBLIC_BASE_URL,
    },
  },

  mdc: {
    highlight: {
      // https://shiki.matsu.io/themes
      theme: "catppuccin-frappe",
      langs: [
        "js",
        "jsx",
        "json",
        "ts",
        "tsx",
        "vue",
        "css",
        "html",
        "bash",
        "md",
        "mdc",
        "yaml",
      ],
    },
  },

  nitro: {
    storage: {
      db: {
        driver: "fs",
        base: "./.data",
      },
    },
  },

  $production: {
    nitro: {
      storage: {
        db: {
          driver: "cloudflare-kv-http",
          name: "db",
          // Cloudflare KV configuration
          accountId: process.env.NUXT_CLOUDFLARE_ACCOUNT_ID,
          namespaceId: process.env.NUXT_CLOUDFLARE_NAMESPACE_ID,
          apiToken: process.env.NUXT_CLOUDFLARE_API_TOKEN,
        },
      },
    },
  },
});
