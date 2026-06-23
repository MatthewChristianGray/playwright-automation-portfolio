import { test, expect } from '@playwright/test';
import { CartPage } from '../../pages/CartPage';

const PRODUCT_SLUG = 'combination-pliers';
const PRODUCT_SLUG_2 = 'bolt-cutters';

test.describe('Shopping cart', () => {
  let cartPage: CartPage;

  test.beforeEach(async ({ page }) => {
    cartPage = new CartPage(page);
  });

  test('empty cart shows an empty state message', async () => {
    await cartPage.goto();
    await expect(cartPage.emptyCartMessage).toBeVisible();
  });

  test('adding a product appears as a line item in the cart', async () => {
    await cartPage.addProductToCart(PRODUCT_SLUG);
    await cartPage.goto();
    const count = await cartPage.getItemCount();
    expect(count).toBeGreaterThanOrEqual(1);
  });

  test('adding two different products shows two line items', async () => {
    await cartPage.addProductToCart(PRODUCT_SLUG);
    await cartPage.addProductToCart(PRODUCT_SLUG_2);
    await cartPage.goto();
    const count = await cartPage.getItemCount();
    expect(count).toBe(2);
  });

  test('removing an item decreases the cart item count', async () => {
    await cartPage.addProductToCart(PRODUCT_SLUG);
    await cartPage.addProductToCart(PRODUCT_SLUG_2);
    await cartPage.goto();
    const before = await cartPage.getItemCount();
    await cartPage.removeItem(0);
    const after = await cartPage.getItemCount();
    expect(after).toBe(before - 1);
  });

  test('removing the only item shows the empty cart message', async () => {
    await cartPage.addProductToCart(PRODUCT_SLUG);
    await cartPage.goto();
    await cartPage.removeItem(0);
    await expect(cartPage.emptyCartMessage).toBeVisible();
  });

  test('cart total updates when item quantity is changed', async () => {
    await cartPage.addProductToCart(PRODUCT_SLUG, 1);
    await cartPage.goto();
    const originalTotal = await cartPage.getTotal();
    await cartPage.setItemQuantity(2);
    const updatedTotal = await cartPage.getTotal();
    expect(updatedTotal).toBeCloseTo(originalTotal * 2, 1);
  });

  test('proceed to checkout button is visible when cart has items', async () => {
    await cartPage.addProductToCart(PRODUCT_SLUG);
    await cartPage.goto();
    await expect(cartPage.proceedButton).toBeVisible();
  });
});
