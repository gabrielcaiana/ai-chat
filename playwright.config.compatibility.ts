import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true, // Paralelo para compatibilidade
  forbidOnly: false, // Permite only() para testes específicos
  retries: 1,
  workers: 3, // Mais workers para compatibilidade
  reporter: [
    ['html'],
    ['json', { outputFile: 'test-results/compatibility-results.json' }],
    ['junit', { outputFile: 'test-results/compatibility-results.xml' }],
  ],
  use: {
    baseURL: process.env.BASE_URL || 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 15000,
    navigationTimeout: 30000,
  },
  projects: [
    // Todos os navegadores para compatibilidade completa
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },
  ],
  outputDir: 'test-results/',
  globalSetup: './tests/e2e/global-setup.ts',
  timeout: 60000,
});
