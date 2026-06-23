import { test, expect } from '@playwright/test';
import { ProductDetailPage } from '../../pages/ProductDetailPage';

test.describe('Product detail page', () => {
  let detailPage: ProductDetailPage;

  test.beforeEach(async ({ page }) => {
    detailPage = new ProductDetailPage(page);
    await detailPage.gotoFirstProductFromListing();
  });

  test('product name is visible', async () => {
    await expect(detailPage.productName).toBeVisible();
    await expect(detailPage.productName).not.toBeEmpty();
  });

  test('product price is displayed and is a positive number', async () => {
    await expect(detailPage.productPrice).toBeVisible();
    const price = await detailPage.getPrice();
    expect(price).toBeGreaterThan(0);
  });

  test('product description is visible', async () => {
    await expect(detailPage.productDescription).toBeVisible();
    await expect(detailPage.productDescription).not.toBeEmpty();
  });

  test('nav Home link navigates back to the product listing', async ({ page }) => {
    const homeLink = page.getByRole('link', { name: 'Home' });
    await expect(homeLink).toBeVisible();
    await homeLink.click();
    await expect(page).toHaveURL('/');
  });

  test('page URL matches the product detail pattern', async ({ page }) => {
    await expect(page).toHaveURL(/\/product\/.+/);
  });

  test('add to cart button increments the cart badge', async () => {
    await detailPage.addToCart(1);
    const count = await detailPage.getCartBadgeCount();
    expect(count).toBeGreaterThanOrEqual(1);
  });

  test('adding multiple units reflects in the cart badge count', async () => {
    await detailPage.addToCart(3);
    const count = await detailPage.getCartBadgeCount();
    expect(count).toBeGreaterThanOrEqual(3);
  });
});
