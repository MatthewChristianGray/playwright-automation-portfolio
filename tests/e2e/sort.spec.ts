import { test, expect } from '@playwright/test';
import { ProductListingPage } from '../../pages/ProductListingPage';

test.describe('Product sort dropdown', () => {
  let listingPage: ProductListingPage;

  test.beforeEach(async ({ page }) => {
    listingPage = new ProductListingPage(page);
    await listingPage.goto();
  });

  test('Name (A - Z) sorts products alphabetically ascending', async () => {
    await listingPage.sortBy('name,asc');
    const names = await listingPage.getProductNames();
    expect(names).toEqual([...names].sort((a, b) => a.localeCompare(b)));
  });

  test('Name (Z - A) sorts products alphabetically descending', async () => {
    await listingPage.sortBy('name,desc');
    const names = await listingPage.getProductNames();
    expect(names).toEqual([...names].sort((a, b) => b.localeCompare(a)));
  });

  test('Price (High - Low) sorts products by price descending', async () => {
    await listingPage.sortBy('price,desc');
    const prices = await listingPage.getProductPrices();
    expect(prices).toEqual([...prices].sort((a, b) => b - a));
  });

  test('Price (Low - High) sorts products by price ascending', async () => {
    await listingPage.sortBy('price,asc');
    const prices = await listingPage.getProductPrices();
    expect(prices).toEqual([...prices].sort((a, b) => a - b));
  });
});
