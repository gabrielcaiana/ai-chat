import { type Page, expect } from '@playwright/test';

export class TestHelpers {
  constructor(private page: Page) {}

  /**
   * Aguarda a página carregar completamente
   */
  async waitForPageLoad() {
    try {
      // Aguarda o DOM estar pronto
      await this.page.waitForLoadState('domcontentloaded', { timeout: 15000 });

      // Aguarda um tempo adicional para garantir que a página esteja estável
      await this.page.waitForTimeout(2000);

      // Verifica se há conteúdo na página
      await this.page.waitForFunction(
        () => {
          return (
            document.body &&
            document.body.textContent &&
            document.body.textContent.length > 0 &&
            !document.querySelector('.loading') &&
            !document.querySelector('[data-loading="true"]')
          );
        },
        { timeout: 15000 }
      );
    } catch {
      // Fallback: aguarda um tempo mínimo e verifica se há conteúdo
      await this.page.waitForTimeout(3000);
      const bodyText = await this.page.textContent('body');
      if (!bodyText || bodyText.length < 50) {
        throw new Error('Page failed to load properly');
      }
    }
  }

  /**
   * Aguarda a página estar estável (sem mudanças por um período)
   */
  async waitForPageStable(timeout = 5000) {
    await this.page.waitForTimeout(timeout);
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
    await this.page.locator(selector).click();
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
