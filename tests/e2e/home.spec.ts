import { test, expect } from '@playwright/test';
import { createTestHelpers } from './utils/test-helpers';

test.describe('Home Page', () => {
  let helpers: ReturnType<typeof createTestHelpers>;

  test.beforeEach(async ({ page }) => {
    helpers = createTestHelpers(page);
    await page.goto('/');
    await helpers.waitForPageLoad();
  });

  test('should have proper page structure', async ({ page }) => {
    // Root container of the landing page
    await helpers.expectElementVisible('.lp');

    // Hero section
    await helpers.expectElementVisible('.lp-hero');

    // Primary CTA button in the hero
    const ctaButton = page.locator('button:has-text("Start chatting")');
    await expect(ctaButton).toBeVisible();
  });

  test('should be responsive on different screen sizes', async ({ page }) => {
    // Desktop
    await page.setViewportSize({ width: 1920, height: 1080 });
    await helpers.expectElementVisible('.lp-hero__title');

    // Mobile
    await page.setViewportSize({ width: 375, height: 667 });
    await helpers.expectElementVisible('.lp-hero__title');

    // Tablet
    await page.setViewportSize({ width: 768, height: 1024 });
    await helpers.expectElementVisible('.lp-hero__title');
  });

  test('should have working CTA buttons', async ({ page }) => {
    // Hero primary button
    const heroButton = page.locator('button:has-text("Start chatting")');
    await expect(heroButton).toBeVisible();
    await expect(heroButton).toBeEnabled();

    // Nav "Open App" button
    const navButton = page.locator('button:has-text("Open App")');
    await expect(navButton).toBeVisible();
    await expect(navButton).toBeEnabled();
  });
});
