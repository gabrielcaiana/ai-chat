// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  css: ["./layers/base/app/assets/css/main.css"],

  modules: ["@nuxtjs/mdc", "@nuxt/ui"],

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
