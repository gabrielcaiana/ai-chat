// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  css: ["./layers/base/app/assets/css/main.css"],

  typescript: {
    typeCheck: "build",
    strict: true,
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
});
