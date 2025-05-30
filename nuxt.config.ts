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
      appEnv: "",
      baseUrl: "",
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
