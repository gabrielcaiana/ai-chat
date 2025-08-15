// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs';

export default withNuxt({
  files: ['**/*.ts', '**/*.vue', '**/*.tsx'],
  ignores: [
    'node_modules/',
    '.nuxt/',
    '.output/',
    'dist/',
    'build/',
    'coverage/',
    '*.config.js',
    '*.config.mjs',
    '*.config.ts',
  ],
  rules: {
    'import/no-duplicates': 'off',
  },
});
