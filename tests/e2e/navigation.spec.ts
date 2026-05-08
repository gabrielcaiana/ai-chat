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
    await expect(page).toHaveURL(/\/$/);

    // Main landing page sections
    await helpers.expectElementVisible('.lp');
    await helpers.expectElementVisible('.lp-hero');
    await helpers.expectElementVisible('.lp-features');
  });

  test('should handle page interactions correctly', async ({ page }) => {
    // Primary CTA button is functional
    const mainButton = page.locator('button:has-text("Start chatting")');
    await expect(mainButton).toBeVisible();
    await expect(mainButton).toBeEnabled();

    // Features grid and first card are visible
    await helpers.expectElementVisible('.lp-features__grid');
    await helpers.expectElementVisible('.lp-card:first-child');
  });

  test('should display all sections correctly', async () => {
    // Hero section
    await helpers.expectElementVisible('.lp-hero');
    await helpers.expectElementVisible('.lp-hero__title');

    // Features section
    await helpers.expectElementVisible('.lp-features');
    await helpers.expectElementVisible('.lp-features__grid');

    // CTA section
    await helpers.expectElementVisible('.lp-cta');

    // Footer
    await helpers.expectElementVisible('.lp-footer');
  });

  test('should maintain responsive design', async ({ page }) => {
    // Desktop
    await page.setViewportSize({ width: 1920, height: 1080 });
    await helpers.expectElementVisible('.lp-hero__title');
    await helpers.expectElementVisible('.lp-features__grid');

    // Mobile
    await page.setViewportSize({ width: 375, height: 667 });
    await helpers.expectElementVisible('.lp-hero__title');
    await helpers.expectElementVisible('.lp-features__grid');

    // Tablet
    await page.setViewportSize({ width: 768, height: 1024 });
    await helpers.expectElementVisible('.lp-hero__title');
    await helpers.expectElementVisible('.lp-features__grid');
  });
});
