import { chromium, type FullConfig } from '@playwright/test';

async function globalSetup(config: FullConfig) {
  const { baseURL } = config.projects[0].use;

  if (!baseURL) {
    console.warn('No baseURL configured, skipping global setup');
    return;
  }

  console.log(`🌐 Setting up E2E tests for: ${baseURL}`);

  // Verificar se o servidor está rodando
  try {
    const browser = await chromium.launch();
    const page = await browser.newPage();

    // Aguardar o servidor estar disponível
    await page.goto(baseURL, { waitUntil: 'networkidle', timeout: 30000 });

    console.log('✅ Server is running and accessible');
    await browser.close();
  } catch (error) {
    console.error('❌ Failed to connect to server:', error);
    throw error;
  }
}

export default globalSetup;
