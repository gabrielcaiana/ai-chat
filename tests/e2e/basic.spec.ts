import { test, expect } from '@playwright/test';

test.describe('Basic Page Loading', () => {
  test('should load the page successfully', async ({ page }) => {
    // Navegar para a página
    await page.goto('/');

    // Aguardar a página carregar
    await page.waitForLoadState('networkidle');

    // Verificar se a página carregou
    expect(page.url()).toContain('localhost:3000');

    // Verificar se há conteúdo HTML
    const content = await page.content();
    expect(content.length).toBeGreaterThan(1000);

    // Verificar se há elementos básicos
    const body = page.locator('body');
    await expect(body).toBeVisible();

    // Verificar se há algum texto na página
    const textContent = await page.textContent('body');
    expect(textContent).toBeTruthy();
    expect(textContent!.length).toBeGreaterThan(100);
  });

  test('should have basic page structure', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Verificar se há elementos básicos
    await expect(page.locator('html')).toBeVisible();
    await expect(page.locator('body')).toBeVisible();

    // Verificar se há meta tags (sem verificar visibilidade)
    const metaTags = page.locator('meta');
    const metaCount = await metaTags.count();
    expect(metaCount).toBeGreaterThan(0);
  });

  test('should handle page interactions', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Verificar se não há erros críticos no console
    const consoleErrors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    // Aguardar um pouco para capturar erros
    await page.waitForTimeout(2000);

    // Verificar se não há erros críticos
    const criticalErrors = consoleErrors.filter(
      error =>
        !error.includes('favicon') &&
        !error.includes('404') &&
        !error.includes('Failed to load resource') &&
        !error.includes('ResizeObserver loop limit exceeded')
    );

    expect(criticalErrors).toHaveLength(0);
  });
});
