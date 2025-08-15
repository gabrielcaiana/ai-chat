import { test, expect } from '@playwright/test';
import { createTestHelpers } from './utils/test-helpers';

test.describe('Chat Functionality', () => {
  let helpers: ReturnType<typeof createTestHelpers>;

  test.beforeEach(async ({ page }) => {
    helpers = createTestHelpers(page);
    await page.goto('/');
    await helpers.waitForPageLoad();
  });

  test('should have chat interface elements', async () => {
    // Verificar se há elementos de chat na landing page
    await helpers.expectElementVisible(
      'button:has-text("Start Your First Chat")'
    );

    // Verificar se há seções de features relacionadas ao chat
    await helpers.expectElementVisible('.feature-card:first-child');
  });

  test('should have proper page structure', async () => {
    // Verificar se há seções principais
    await helpers.expectElementVisible('.landing-page');

    // Verificar se há conteúdo de features
    await helpers.expectElementVisible('.features-grid');

    // Verificar se há seção de benefícios
    await helpers.expectElementVisible('.benefits-section');
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

  test('should display feature cards correctly', async ({ page }) => {
    // Verificar se há cards de features
    const featureCards = page.locator('.feature-card');
    await expect(featureCards).toHaveCount(3);
  });

  test('should be accessible', async ({ page }) => {
    // Verificar se botões CTA têm texto descritivo
    const ctaButtons = page.locator(
      'button:has-text("Start Your First Chat"), button:has-text("Create A New Chat")'
    );

    for (let i = 0; i < (await ctaButtons.count()); i++) {
      const button = ctaButtons.nth(i);
      const hasText = (await button.textContent()) !== '';

      expect(hasText).toBeTruthy();
    }

    // Verificar se imagens têm alt text
    const images = page.locator('img');
    for (let i = 0; i < (await images.count()); i++) {
      const image = images.nth(i);
      const altText = await image.getAttribute('alt');

      expect(altText).toBeTruthy();
      expect(altText!.length).toBeGreaterThan(0);
    }
  });
});
