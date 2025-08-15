import { test, expect } from '@playwright/test';
import { createTestHelpers } from './utils/test-helpers';

test.describe('Home Page', () => {
  let helpers: ReturnType<typeof createTestHelpers>;

  test.beforeEach(async ({ page }) => {
    helpers = createTestHelpers(page);
    await page.goto('/');
    await helpers.waitForPageLoad();
  });

  test('should display the main page elements', async ({ page }) => {
    // Verificar se há conteúdo na página
    const bodyText = await page.textContent('body');
    expect(bodyText).toBeTruthy();
    expect(bodyText!.length).toBeGreaterThan(100);

    // Verificar se há botões de ação
    await helpers.expectElementVisible('button');
  });

  test('should have proper page structure', async ({ page }) => {
    // Verificar se há seções principais
    await helpers.expectElementVisible('.landing-page');

    // Verificar se há conteúdo de hero
    await helpers.expectElementVisible('.hero-content');

    // Verificar se há botão de CTA
    const ctaButton = page.locator('button:has-text("Start Your First Chat")');
    await expect(ctaButton).toBeVisible();
  });

  test('should be responsive on different screen sizes', async ({ page }) => {
    // Testar desktop
    await page.setViewportSize({ width: 1920, height: 1080 });
    await helpers.expectElementVisible('.hero-title');

    // Testar mobile
    await page.setViewportSize({ width: 375, height: 667 });
    await helpers.expectElementVisible('.hero-title');

    // Testar tablet
    await page.setViewportSize({ width: 768, height: 1024 });
    await helpers.expectElementVisible('.hero-title');
  });

  test('should have working CTA buttons', async ({ page }) => {
    // Verificar botão principal
    const mainButton = page.locator('button:has-text("Start Your First Chat")');
    await expect(mainButton).toBeVisible();
    await expect(mainButton).toBeEnabled();

    // Verificar botão secundário
    const secondaryButton = page.locator(
      'button:has-text("Create A New Chat")'
    );
    await expect(secondaryButton).toBeVisible();
    await expect(secondaryButton).toBeEnabled();
  });
});
