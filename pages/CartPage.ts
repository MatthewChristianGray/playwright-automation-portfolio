import { Page, Locator } from '@playwright/test';

export class CartPage {
  readonly cartItems: Locator;
  readonly emptyCartMessage: Locator;
  readonly cartTotal: Locator;
  readonly proceedButton: Locator;

  constructor(private readonly page: Page) {
    this.cartItems = page.getByTestId('cart-item');
    this.emptyCartMessage = page.getByTestId('cart-empty');
    this.cartTotal = page.getByTestId('cart-total');
    this.proceedButton = page.getByTestId('proceed-1');
  }

  async goto() {
    await this.page.goto('/cart');
    await this.page.waitForLoadState('networkidle');
  }

  async addProductToCart(slug: string, quantity = 1) {
    await this.page.goto(`/product/${slug}`);
    await this.page.getByTestId('quantity').waitFor({ state: 'visible' });
    await this.page.getByTestId('quantity').fill(String(quantity));
    await this.page.getByTestId('add-to-cart').click();
    await this.page.getByTestId('cart-quantity').waitFor({ state: 'visible' });
  }

  async getItemCount(): Promise<number> {
    return this.cartItems.count();
  }

  async getItemQuantity(index = 0): Promise<number> {
    const qtyInput = this.cartItems.nth(index).getByTestId('cart-product-quantity');
    const value = await qtyInput.inputValue();
    return parseInt(value);
  }

  async setItemQuantity(quantity: number, index = 0) {
    const qtyInput = this.cartItems.nth(index).getByTestId('cart-product-quantity');
    await qtyInput.fill(String(quantity));
    await qtyInput.press('Tab');
    await this.page.waitForLoadState('networkidle');
  }

  async removeItem(index = 0) {
    const deleteBtn = this.cartItems.nth(index).getByTestId('delete-product');
    await deleteBtn.click();
    await this.page.waitForLoadState('networkidle');
  }

  async getTotal(): Promise<number> {
    const text = await this.cartTotal.textContent();
    return parseFloat(text?.replace('$', '') ?? '0');
  }

  async getLineItemPrice(index = 0): Promise<number> {
    const priceEl = this.cartItems.nth(index).getByTestId('product-price');
    const text = await priceEl.textContent();
    return parseFloat(text?.replace('$', '') ?? '0');
  }
}
