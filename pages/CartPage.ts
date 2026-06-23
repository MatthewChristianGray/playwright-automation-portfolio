import { Page, Locator } from '@playwright/test';

export class CartPage {
  // Product rows live in the table's middle rowgroup (tbody); header and footer are first/last
  readonly cartItems: Locator;
  readonly proceedButton: Locator;

  constructor(private readonly page: Page) {
    this.cartItems = page.locator('table').getByRole('rowgroup').nth(1).getByRole('row');
    this.proceedButton = page.getByRole('button', { name: 'Proceed to checkout' });
  }

  async goto() {
    await this.page.goto('/checkout');
    await this.page.waitForLoadState('load');
    // Angular fetches cart data asynchronously — wait for the table or confirm empty cart
    try {
      await this.page.locator('table').waitFor({ state: 'visible', timeout: 8000 });
    } catch {
      // No table means the cart is empty — that's a valid state
    }
  }

  async addProductToCart(productIndex = 0, quantity = 1) {
    await this.page.goto('/');
    const products = this.page.getByTestId('product-name');
    await products.first().waitFor({ state: 'visible' });

    // Read current badge count so we can wait for it to increment (handles successive adds)
    const badge = this.page.getByTestId('cart-quantity');
    let currentCount = 0;
    if (await badge.isVisible()) {
      currentCount = parseInt((await badge.textContent()) ?? '0');
    }

    await products.nth(productIndex).click();
    await this.page.waitForURL(/\/product\/.+/);
    await this.page.waitForLoadState('domcontentloaded');

    if (quantity !== 1) {
      const qtyInput = this.page.getByTestId('quantity');
      await qtyInput.waitFor({ state: 'visible' });
      await qtyInput.fill(String(quantity));
    }

    await this.page.getByTestId('add-to-cart').click();

    // Wait for the badge count to reach the expected value
    const expected = currentCount + quantity;
    if (currentCount === 0) {
      await badge.waitFor({ state: 'visible' });
    } else {
      await this.page.waitForFunction(
        (n: number) => {
          const el = document.querySelector('[data-test="cart-quantity"]');
          return !!el && parseInt(el.textContent?.trim() || '0') >= n;
        },
        expected
      );
    }
  }

  async getItemCount(): Promise<number> {
    return this.cartItems.count();
  }

  async removeItem(index = 0) {
    const badge = this.page.getByTestId('cart-quantity');
    const currentBadgeCount = parseInt((await badge.textContent()) ?? '0');

    // page.evaluate runs immediately without locator auto-wait, bypassing re-render races
    await this.page.evaluate((rowIndex: number) => {
      const rows = document.querySelectorAll('table tbody tr');
      const row = rows[rowIndex];
      const imgs = row?.querySelectorAll('img');
      (imgs?.[imgs.length - 1] as HTMLElement | undefined)?.click();
    }, index);

    // Wait for cart badge to reflect the removal (or disappear entirely on last item)
    await this.page.waitForFunction(
      (expected: number) => {
        const el = document.querySelector('[data-test="cart-quantity"]');
        if (!el) return expected <= 0;
        return parseInt(el.textContent?.trim() || '0') < expected;
      },
      currentBadgeCount,
      { timeout: 15000 }
    );
  }

  async getTotal(): Promise<number> {
    // Total row is in the last rowgroup (tfoot); amount is in the 4th cell (index 3)
    const totalRow = this.page.locator('table').getByRole('rowgroup').last().getByRole('row');
    const totalCell = totalRow.getByRole('cell').nth(3);
    const text = await totalCell.textContent();
    return parseFloat(text?.replace('$', '') ?? '0');
  }
}
