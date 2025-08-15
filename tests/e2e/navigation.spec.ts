import { test, expect } from '@playwright/test';
import { createTestHelpers } from './utils/test-helpers';

test.describe('Navigation and Routing', () => {
  let helpers: ReturnType<typeof createTestHelpers>;

  test.beforeEach(async ({ page }) => {
    helpers = createTestHelpers(page);
    await page.goto('/');
    await helpers.waitForPageLoad();
  });

  test('should have working page structure', async ({ page }) => {
    // Verificar se a página carregou corretamente
    await expect(page).toHaveURL(/\/$/);

    // Verificar se há seções principais
    await helpers.expectElementVisible('.landing-page');
    await helpers.expectElementVisible('.hero-section');
    await helpers.expectElementVisible('.features-section');
  });

  test('should handle page interactions correctly', async ({ page }) => {
    // Verificar se os botões CTA estão funcionais
    const mainButton = page.locator('button:has-text("Start Your First Chat")');
    await expect(mainButton).toBeVisible();
    await expect(mainButton).toBeEnabled();

    // Verificar se há seção de features
    await helpers.expectElementVisible('.features-grid');
    await helpers.expectElementVisible('.feature-card:first-child');
  });

  test('should have proper page structure', async ({ page }) => {
    // Verificar se a página tem estrutura básica
    const bodyText = await page.textContent('body');
    expect(bodyText).toBeTruthy();
    expect(bodyText!.length).toBeGreaterThan(100);
  });

  test('should display all sections correctly', async () => {
    // Verificar seção hero
    await helpers.expectElementVisible('.hero-section');
    await helpers.expectElementVisible('.hero-title');

    // Verificar seção features
    await helpers.expectElementVisible('.features-section');
    await helpers.expectElementVisible('.features-grid');

    // Verificar seção benefits
    await helpers.expectElementVisible('.benefits-section');

    // Verificar seção CTA
    await helpers.expectElementVisible('.cta-section');
  });

  test('should maintain responsive design', async ({ page }) => {
    // Testar desktop
    await page.setViewportSize({ width: 1920, height: 1080 });
    await helpers.expectElementVisible('.hero-title');
    await helpers.expectElementVisible('.features-grid');

    // Testar mobile
    await page.setViewportSize({ width: 375, height: 667 });
    await helpers.expectElementVisible('.hero-title');
    await helpers.expectElementVisible('.features-grid');

    // Testar tablet
    await page.setViewportSize({ width: 768, height: 1024 });
    await helpers.expectElementVisible('.hero-title');
    await helpers.expectElementVisible('.features-grid');
  });
});
