import { test, expect } from '@playwright/test';
import { CartPage } from '../../pages/CartPage';

test.describe('Shopping cart', () => {
  // slowMo:800ms + multiple navigations per test require extended timeout
  test.setTimeout(90000);

  let cartPage: CartPage;

  test.beforeEach(async ({ page }) => {
    cartPage = new CartPage(page);
  });

  test('empty cart has no line items', async () => {
    await cartPage.goto();
    const count = await cartPage.getItemCount();
    expect(count).toBe(0);
  });

  test('adding a product appears as a line item in the cart', async () => {
    await cartPage.addProductToCart(0);
    await cartPage.goto();
    const count = await cartPage.getItemCount();
    expect(count).toBeGreaterThanOrEqual(1);
  });

  test('adding two different products shows two line items', async () => {
    await cartPage.addProductToCart(0);
    await cartPage.addProductToCart(1);
    await cartPage.goto();
    const count = await cartPage.getItemCount();
    expect(count).toBe(2);
  });

  test('removing an item decreases the cart item count', async () => {
    await cartPage.addProductToCart(0);
    await cartPage.addProductToCart(1);
    await cartPage.goto();
    const before = await cartPage.getItemCount();
    await cartPage.removeItem(0);
    const after = await cartPage.getItemCount();
    expect(after).toBe(before - 1);
  });

  test('removing the only item empties the cart', async () => {
    await cartPage.addProductToCart(0);
    await cartPage.goto();
    await cartPage.removeItem(0);
    const count = await cartPage.getItemCount();
    expect(count).toBe(0);
  });

  test('cart total scales with item quantity', async () => {
    await cartPage.addProductToCart(0, 1);
    await cartPage.goto();
    const oneUnitTotal = await cartPage.getTotal();

    await cartPage.addProductToCart(0, 1);
    await cartPage.goto();
    const twoUnitTotal = await cartPage.getTotal();

    expect(oneUnitTotal).toBeGreaterThan(0);
    expect(twoUnitTotal).toBeCloseTo(oneUnitTotal * 2, 1);
  });

  test('proceed to checkout button is visible when cart has items', async () => {
    await cartPage.addProductToCart(0);
    await cartPage.goto();
    await expect(cartPage.proceedButton).toBeVisible();
  });
});
