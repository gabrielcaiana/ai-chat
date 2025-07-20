// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  css: ["./layers/base/app/assets/css/main.css"],
  mdc: {
    highlight: {
      theme: "material-theme-palenight",
      langs: ["html", "markdown", "vue", "typescript", "javascript"],
    },
  },
});
