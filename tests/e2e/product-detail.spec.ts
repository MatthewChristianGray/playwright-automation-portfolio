import { test, expect } from '@playwright/test';
import { ProductDetailPage } from '../../pages/ProductDetailPage';

// A stable product slug that exists on the site
const PRODUCT_SLUG = 'combination-pliers';

test.describe('Product detail page', () => {
  let detailPage: ProductDetailPage;

  test.beforeEach(async ({ page }) => {
    detailPage = new ProductDetailPage(page);
    await detailPage.gotoBySlug(PRODUCT_SLUG);
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

  test('breadcrumb contains a link back to the product listing', async ({ page }) => {
    await expect(detailPage.breadcrumb).toBeVisible();
    const homeLink = detailPage.breadcrumb.getByRole('link', { name: 'Home' });
    await expect(homeLink).toBeVisible();
  });

  test('navigating to a product from the listing keeps the name consistent', async ({ page }) => {
    const detailPageFresh = new ProductDetailPage(page);
    const nameFromListing = await detailPageFresh.gotoFirstProductFromListing();
    const nameOnDetailPage = await detailPageFresh.productName.textContent();
    expect(nameOnDetailPage?.trim()).toBe(nameFromListing);
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
