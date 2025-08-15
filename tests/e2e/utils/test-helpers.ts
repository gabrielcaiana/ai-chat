import { type Page, expect } from '@playwright/test';

export class TestHelpers {
  constructor(private page: Page) {}

  /**
   * Aguarda a página carregar completamente
   */
  async waitForPageLoad() {
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Verifica se um elemento está visível
   */
  async expectElementVisible(selector: string, timeout = 5000) {
    await expect(this.page.locator(selector)).toBeVisible({ timeout });
  }

  /**
   * Verifica se um elemento contém texto específico
   */
  async expectElementContainsText(selector: string, text: string) {
    await expect(this.page.locator(selector)).toContainText(text);
  }

  /**
   * Clica em um elemento e aguarda navegação
   */
  async clickAndWaitForNavigation(selector: string) {
    await Promise.all([
      this.page.waitForLoadState('networkidle'),
      this.page.click(selector),
    ]);
  }

  /**
   * Preenche um campo de input
   */
  async fillInput(selector: string, value: string) {
    await this.page.fill(selector, value);
  }

  /**
   * Submete um formulário
   */
  async submitForm(selector: string) {
    await this.page.locator(selector).submit();
  }

  /**
   * Verifica se a URL atual contém um caminho específico
   */
  async expectUrlContains(path: string) {
    await expect(this.page).toHaveURL(new RegExp(path));
  }

  /**
   * Aguarda um elemento aparecer e depois desaparecer (loading states)
   */
  async waitForLoadingState(loadingSelector: string, timeout = 10000) {
    await this.page.waitForSelector(loadingSelector, {
      state: 'visible',
      timeout,
    });
    await this.page.waitForSelector(loadingSelector, {
      state: 'hidden',
      timeout,
    });
  }

  /**
   * Tira screenshot da página atual
   */
  async takeScreenshot(name: string) {
    await this.page.screenshot({ path: `test-results/${name}.png` });
  }
}

/**
 * Factory function para criar helpers de teste
 */
export function createTestHelpers(page: Page): TestHelpers {
  return new TestHelpers(page);
}
