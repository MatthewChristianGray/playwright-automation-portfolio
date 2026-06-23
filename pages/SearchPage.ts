import { Page, Locator } from '@playwright/test';

export class SearchPage {
  readonly searchInput: Locator;
  readonly searchSubmit: Locator;
  readonly productNames: Locator;
  // "Searched for: X" h3 — only rendered after Angular processes the search response
  readonly resultsHeading: Locator;
  // "N products found for 'X'" paragraph beneath the heading
  readonly resultsCountText: Locator;

  constructor(private readonly page: Page) {
    this.searchInput = page.getByTestId('search-query');
    this.searchSubmit = page.getByTestId('search-submit');
    this.productNames = page.getByTestId('product-name');
    this.resultsHeading = page.getByRole('heading', { level: 3 });
    // Scope to <p> elements first so textContent() returns the paragraph text, not a wrapper
    this.resultsCountText = page.locator('p').filter({ hasText: /\d+ products found for/i });
  }

  async goto() {
    await this.page.goto('/');
    await this.searchInput.waitFor({ state: 'visible' });
  }

  async search(query: string) {
    await this.searchInput.clear();
    await this.searchInput.fill(query);
    await this.searchSubmit.click();
    // Wait for the h3 to contain the new query — handles case where heading was already
    // visible from a previous search and waitFor({ state: 'visible' }) would return stale
    await this.page.waitForFunction(
      (q: string) => document.querySelector('h3')?.textContent?.toLowerCase().includes(q.toLowerCase()) ?? false,
      query
    );
  }

  async getResultCount(): Promise<number> {
    return this.productNames.count();
  }

  async getResultNames(): Promise<string[]> {
    return this.productNames.allTextContents();
  }

}
