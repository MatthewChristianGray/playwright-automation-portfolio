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

  test('search results include products matching the query keyword', async () => {
    await searchPage.search('hammer');
    const names = await searchPage.getResultNames();
    expect(names.length).toBeGreaterThan(0);
    // Site uses broad matching — verify at least one visible result contains the keyword
    const anyMatch = names.some(n => n.toLowerCase().includes('hammer'));
    expect(anyMatch).toBe(true);
  });

  test('searching shows a results heading with the queried term', async () => {
    await searchPage.search('pliers');
    await expect(searchPage.resultsHeading).toContainText('Searched for: pliers');
  });

  test('results heading shows the count of matching products', async () => {
    await searchPage.search('pliers');
    await expect(searchPage.resultsCountText).toBeVisible();
  });

  test('a specific search returns fewer matches than a broader search', async () => {
    // "hammer" fills a full page (9+); "claw hammer" returns 6 — all under the page limit
    await searchPage.search('hammer');
    const broadCount = await searchPage.getResultCount();

    await searchPage.search('claw hammer');
    const specificCount = await searchPage.getResultCount();

    expect(specificCount).toBeLessThan(broadCount);
  });

  test('a second search replaces the first search results', async () => {
    await searchPage.search('hammer');
    const hammerResults = await searchPage.getResultNames();

    await searchPage.search('pliers');
    const pliersResults = await searchPage.getResultNames();

    expect(pliersResults).not.toEqual(hammerResults);
  });
});
