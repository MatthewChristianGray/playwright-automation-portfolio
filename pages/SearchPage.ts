import { Page, Locator } from '@playwright/test';

export class SearchPage {
  readonly searchInput: Locator;
  readonly searchSubmit: Locator;
  readonly productNames: Locator;
  readonly noResultsMessage: Locator;

  constructor(private readonly page: Page) {
    this.searchInput = page.getByTestId('search-query');
    this.searchSubmit = page.getByTestId('search-submit');
    this.productNames = page.getByTestId('product-name');
    this.noResultsMessage = page.getByTestId('search-no-results');
  }

  async goto() {
    await this.page.goto('/');
    await this.searchInput.waitFor({ state: 'visible' });
  }

  async search(query: string) {
    await this.searchInput.clear();
    await this.searchInput.fill(query);
    await this.searchSubmit.click();
    await this.page.waitForLoadState('networkidle');
  }

  async getResultCount(): Promise<number> {
    return this.productNames.count();
  }

  async getResultNames(): Promise<string[]> {
    return this.productNames.allTextContents();
  }
}
