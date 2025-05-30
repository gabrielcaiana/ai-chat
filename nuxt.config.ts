// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",

  future: {
    compatibilityVersion: 4,
  },

  css: ["~/assets/css/main.css"],

  runtimeConfig: {
    openaiApiKey: "",
    public: {
      appEnv: process.env.APP_ENV || "development",
      apiBase: process.env.API_BASE || "http://localhost:3000/api",
    },
  },

  mdc: {
    highlight: {
      // https://shiki.matsu.io/themes
      theme: "aurora-x",
      langs: ["html", "markdown", "vue", "typescript", "javascript"],
    },
  },
});
