import { test, expect } from '@playwright/test';
import { SearchPage } from '../../pages/SearchPage';

test.describe('Product search', () => {
  let searchPage: SearchPage;

  test.beforeEach(async ({ page }) => {
    searchPage = new SearchPage(page);
    await searchPage.goto();
  });

  test('searching "pliers" returns at least one result', async () => {
    await searchPage.search('pliers');
    const count = await searchPage.getResultCount();
    expect(count).toBeGreaterThan(0);
  });

  test('search results contain the searched keyword in product names', async () => {
    await searchPage.search('hammer');
    const names = await searchPage.getResultNames();
    expect(names.length).toBeGreaterThan(0);
    const allMatch = names.every(n => n.toLowerCase().includes('hammer'));
    expect(allMatch).toBe(true);
  });

  test('a nonsense query shows a no-results message', async () => {
    await searchPage.search('xyzzy12345');
    await expect(searchPage.noResultsMessage).toBeVisible();
  });

  test('nonsense query returns zero product cards', async () => {
    await searchPage.search('xyzzy12345');
    const count = await searchPage.getResultCount();
    expect(count).toBe(0);
  });

  test('searching returns fewer results than the unfiltered listing', async () => {
    const allResults = await searchPage.getResultCount();
    await searchPage.search('pliers');
    const filteredResults = await searchPage.getResultCount();
    expect(filteredResults).toBeLessThan(allResults);
  });

  test('a second search replaces the first search results', async () => {
    await searchPage.search('hammer');
    const hammerResults = await searchPage.getResultNames();

    await searchPage.search('pliers');
    const pliersResults = await searchPage.getResultNames();

    expect(pliersResults).not.toEqual(hammerResults);
  });
});
