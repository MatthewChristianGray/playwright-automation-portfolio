import { test, expect } from '@playwright/test';
import { ProductListingPage } from '../../pages/ProductListingPage';

test.describe('Category filter checkboxes', () => {
  let listingPage: ProductListingPage;

  test.beforeEach(async ({ page }) => {
    listingPage = new ProductListingPage(page);
    await listingPage.goto();
  });

  test('checking a parent category checks all its subcategories', async () => {
    await listingPage.checkCategory('Hand Tools');
    expect(await listingPage.areAllSubcategoriesChecked('Hand Tools')).toBe(true);
  });

  test('unchecking a parent category unchecks all its subcategories', async () => {
    await listingPage.checkCategory('Hand Tools');
    await listingPage.uncheckCategory('Hand Tools');
    expect(await listingPage.areAllSubcategoriesUnchecked('Hand Tools')).toBe(true);
  });

  test('checking a subcategory filters the product list', async () => {
    const initialCount = await listingPage.getProductCount();
    await listingPage.checkCategory('Hammer');
    const filteredCount = await listingPage.getProductCount();
    expect(filteredCount).toBeLessThan(initialCount);
  });

  test('unchecking a subcategory restores the full product list', async () => {
    const initialCount = await listingPage.getProductCount();
    await listingPage.checkCategory('Hammer');
    await listingPage.uncheckCategory('Hammer');
    const restoredCount = await listingPage.getProductCount();
    expect(restoredCount).toBe(initialCount);
  });
});
