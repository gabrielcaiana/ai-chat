import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: false,
  forbidOnly: true, // Sempre true no CI
  retries: 1, // Reduzido para 1 no CI (mais rápido)
  workers: 1, // 1 worker no CI para evitar conflitos
  reporter: [
    ['html'],
    ['json', { outputFile: 'test-results/results.json' }],
    ['junit', { outputFile: 'test-results/results.xml' }],
  ],
  use: {
    baseURL: process.env.BASE_URL || 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 20000, // Reduzido para ser mais rápido
    navigationTimeout: 30000, // Reduzido para ser mais rápido
  },
  projects: [
    // Apenas Chromium no CI - mais estável e rápido
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  outputDir: 'test-results/',
  timeout: 60000,
});
