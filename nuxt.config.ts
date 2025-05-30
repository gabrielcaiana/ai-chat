// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",

  future: {
    compatibilityVersion: 4,
  },

  css: ["~/assets/css/main.css"],

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
});
