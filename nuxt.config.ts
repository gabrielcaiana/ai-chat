import { fileURLToPath } from "url";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-20",

  // Extend from layers
  extends: ["./layers/base", "./layers/chat"],

  // Modules - moved to main config to ensure proper loading
  modules: ["@nuxt/eslint", "@nuxtjs/mdc", "@nuxt/ui"],

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
});
