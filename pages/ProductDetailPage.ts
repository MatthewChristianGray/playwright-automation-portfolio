import { Page, Locator } from '@playwright/test';

export class ProductDetailPage {
  readonly productName: Locator;
  readonly productPrice: Locator;
  readonly productDescription: Locator;
  readonly quantityInput: Locator;
  readonly addToCartButton: Locator;
  readonly cartNavBadge: Locator;
  constructor(private readonly page: Page) {
    this.productName = page.getByTestId('product-name');
    this.productPrice = page.getByTestId('unit-price');
    this.productDescription = page.getByTestId('product-description');
    this.quantityInput = page.getByTestId('quantity');
    this.addToCartButton = page.getByTestId('add-to-cart');
    this.cartNavBadge = page.getByTestId('cart-quantity');
  }

  async gotoBySlug(slug: string) {
    await this.page.goto(`/product/${slug}`);
    await this.productName.waitFor({ state: 'visible' });
  }

  async gotoFirstProductFromListing(): Promise<string> {
    await this.page.goto('/');
    const firstProduct = this.page.getByTestId('product-name').first();
    await firstProduct.waitFor({ state: 'visible' });
    const name = await firstProduct.textContent();
    await firstProduct.click();
    // Wait for navigation to the product detail URL
    await this.page.waitForURL(/\/product\/.+/);
    await this.page.waitForLoadState('networkidle');
    return name?.trim() ?? '';
  }

  async addToCart(quantity = 1) {
    await this.quantityInput.fill(String(quantity));
    await this.addToCartButton.click();
    await this.cartNavBadge.waitFor({ state: 'visible' });
  }

  async getCartBadgeCount(): Promise<number> {
    const text = await this.cartNavBadge.textContent();
    return parseInt(text ?? '0');
  }

  async getPrice(): Promise<number> {
    const text = await this.productPrice.textContent();
    return parseFloat(text?.replace('$', '') ?? '0');
  }
}
