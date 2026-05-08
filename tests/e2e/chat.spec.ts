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
    // Primary CTA to start a chat
    await helpers.expectElementVisible('button:has-text("Start chatting")');

    // First feature card is visible
    await helpers.expectElementVisible('.lp-card:first-child');
  });

  test('should have proper page structure', async () => {
    // Root container
    await helpers.expectElementVisible('.lp');

    // Features grid
    await helpers.expectElementVisible('.lp-features__grid');

    // CTA section
    await helpers.expectElementVisible('.lp-cta');
  });

  test('should have working CTA buttons', async ({ page }) => {
    // Hero button
    const heroButton = page.locator('button:has-text("Start chatting")');
    await expect(heroButton).toBeVisible();
    await expect(heroButton).toBeEnabled();

    // Nav "Open App" button
    const navButton = page.locator('button:has-text("Open App")');
    await expect(navButton).toBeVisible();
    await expect(navButton).toBeEnabled();
  });

  test('should display feature cards correctly', async ({ page }) => {
    // The landing page has 4 feature cards: Multi-Model, Streaming, Projects, Privacy
    const featureCards = page.locator('.lp-card');
    await expect(featureCards).toHaveCount(4);
  });

  test('should be accessible', async ({ page }) => {
    // CTA buttons have descriptive text
    const ctaButtons = page.locator(
      'button:has-text("Start chatting"), button:has-text("Open App")'
    );

    for (let i = 0; i < (await ctaButtons.count()); i++) {
      const button = ctaButtons.nth(i);
      const hasText = (await button.textContent()) !== '';
      expect(hasText).toBeTruthy();
    }

    // Images have alt text
    const images = page.locator('img');
    for (let i = 0; i < (await images.count()); i++) {
      const image = images.nth(i);
      const altText = await image.getAttribute('alt');
      expect(altText).toBeTruthy();
      expect(altText!.length).toBeGreaterThan(0);
    }
  });
});
