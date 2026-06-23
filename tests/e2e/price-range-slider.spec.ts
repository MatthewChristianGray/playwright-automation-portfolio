import { test, expect } from '@playwright/test';
import { ProductListingPage } from '../../pages/ProductListingPage';

test.describe('Price range slider', () => {
  let listingPage: ProductListingPage;

  test.beforeEach(async ({ page }) => {
    listingPage = new ProductListingPage(page);
    await listingPage.goto();
  });

  test('moving the min handle filters out products below the minimum price', async () => {
    await listingPage.setPriceRange(50, 200);

    const appliedMin = await listingPage.getAppliedMinPrice();
    const prices = await listingPage.getProductPrices();

    for (const price of prices) {
      expect(price).toBeGreaterThanOrEqual(appliedMin);
    }
  });

  test('moving the max handle filters out products above the maximum price', async () => {
    await listingPage.setPriceRange(0, 50);

    const appliedMax = await listingPage.getAppliedMaxPrice();
    const prices = await listingPage.getProductPrices();

    for (const price of prices) {
      expect(price).toBeLessThanOrEqual(appliedMax);
    }
  });

  test('moving both handles filters products within the price range', async () => {
    await listingPage.setPriceRange(15, 60);

    const appliedMin = await listingPage.getAppliedMinPrice();
    const appliedMax = await listingPage.getAppliedMaxPrice();
    const prices = await listingPage.getProductPrices();

    for (const price of prices) {
      expect(price).toBeGreaterThanOrEqual(appliedMin);
      expect(price).toBeLessThanOrEqual(appliedMax);
    }
  });
});
