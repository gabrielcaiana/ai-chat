// @ts-check
import withNuxt from "./.nuxt/eslint.config.mjs";

export default withNuxt({
  files: ["**/*.ts", "**/*.vue", "**/*.tsx"],
  rules: {
    "import/no-duplicates": "off",
  },
});
