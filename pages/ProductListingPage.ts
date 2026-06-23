import { Page, Locator } from '@playwright/test';

export class ProductListingPage {
  readonly sortDropdown: Locator;
  readonly productNames: Locator;
  readonly productPrices: Locator;

  constructor(private readonly page: Page) {
    this.sortDropdown = page.getByTestId('sort');
    this.productNames = page.getByTestId('product-name');
    this.productPrices = page.getByTestId('product-price');
  }

  async goto() {
    await this.page.goto('/');
    await this.sortDropdown.waitFor({ state: 'visible' });
  }

  async sortBy(value: string) {
    await this.sortDropdown.selectOption(value);
    await this.page.waitForLoadState('networkidle');
  }

  async getProductNames(): Promise<string[]> {
    return this.productNames.allTextContents();
  }

  async getProductPrices(): Promise<number[]> {
    const texts = await this.productPrices.allTextContents();
    return texts.map(t => parseFloat(t.replace('$', '')));
  }
}
