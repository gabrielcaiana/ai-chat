// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },

  runtimeConfig: {
    openaiApiKey: process.env.NUXT_OPENAI_API_KEY,
    public: {
      appEnv: process.env.NUXT_PUBLIC_APP_ENV,
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
          accountId: process.env.NUXT_CLOUDFLARE_ACCOUNT_ID,
          apiToken: process.env.NUXT_CLOUDFLARE_API_TOKEN,
          namespaceId: process.env.NUXT_CLOUDFLARE_NAMESPACE_ID,
        },
      },
    },
  },
  // }),
});
