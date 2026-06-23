import { Page, Locator } from '@playwright/test';

const SLIDER_MIN = 0;
const SLIDER_MAX = 200;

export class ProductListingPage {
  readonly sortDropdown: Locator;
  readonly productNames: Locator;
  readonly productPrices: Locator;
  private readonly minPriceHandle: Locator;
  private readonly maxPriceHandle: Locator;
  private readonly sliderBar: Locator;

  constructor(private readonly page: Page) {
    this.sortDropdown = page.getByTestId('sort');
    this.productNames = page.getByTestId('product-name');
    this.productPrices = page.getByTestId('product-price');
    this.minPriceHandle = page.locator('.ngx-slider-pointer-min');
    this.maxPriceHandle = page.locator('.ngx-slider-pointer-max');
    this.sliderBar = page.locator('.ngx-slider-full-bar');
  }

  async goto() {
    await this.page.goto('/');
    await this.sortDropdown.waitFor({ state: 'visible' });
    await this.productNames.first().waitFor({ state: 'visible' });
  }

  // ── Sort ────────────────────────────────────────────────────────────────────

  async sortBy(value: string) {
    await this.sortDropdown.scrollIntoViewIfNeeded();
    await this.sortDropdown.selectOption(value);
    await this.page.waitForLoadState('networkidle');
    await this.productNames.first().scrollIntoViewIfNeeded();
  }

  // ── Price range slider ───────────────────────────────────────────────────────

  async setPriceRange(minPrice: number, maxPrice: number) {
    await this.sliderBar.scrollIntoViewIfNeeded();

    const barBox = await this.sliderBar.boundingBox();
    if (!barBox) throw new Error('Slider bar not found');

    const toX = (value: number) =>
      barBox.x + ((value - SLIDER_MIN) / (SLIDER_MAX - SLIDER_MIN)) * barBox.width;

    await this.dragHandle(this.minPriceHandle, toX(minPrice));
    await this.dragHandle(this.maxPriceHandle, toX(maxPrice));

    await this.page.waitForLoadState('networkidle');
    await this.productNames.first().scrollIntoViewIfNeeded();
  }

  async getAppliedMinPrice(): Promise<number> {
    return parseInt(await this.minPriceHandle.getAttribute('aria-valuenow') ?? '0');
  }

  async getAppliedMaxPrice(): Promise<number> {
    return parseInt(await this.maxPriceHandle.getAttribute('aria-valuenow') ?? '200');
  }

  // ── Category filters ─────────────────────────────────────────────────────────

  async checkCategory(name: string) {
    const checkbox = this.categoryCheckbox(name);
    await checkbox.scrollIntoViewIfNeeded();
    await checkbox.check();
    await this.page.waitForLoadState('networkidle');
    await this.productNames.first().scrollIntoViewIfNeeded();
  }

  async uncheckCategory(name: string) {
    const checkbox = this.categoryCheckbox(name);
    await checkbox.scrollIntoViewIfNeeded();
    await checkbox.uncheck();
    await this.page.waitForLoadState('networkidle');
    await this.productNames.first().scrollIntoViewIfNeeded();
  }

  async areAllSubcategoriesChecked(parentName: string): Promise<boolean> {
    const checkboxes = this.subcategoryCheckboxes(parentName);
    const count = await checkboxes.count();
    for (let i = 0; i < count; i++) {
      if (!(await checkboxes.nth(i).isChecked())) return false;
    }
    return true;
  }

  async areAllSubcategoriesUnchecked(parentName: string): Promise<boolean> {
    const checkboxes = this.subcategoryCheckboxes(parentName);
    const count = await checkboxes.count();
    for (let i = 0; i < count; i++) {
      if (await checkboxes.nth(i).isChecked()) return false;
    }
    return true;
  }

  async getProductCount(): Promise<number> {
    return this.productNames.count();
  }

  // ── Shared helpers ───────────────────────────────────────────────────────────

  async getProductNames(): Promise<string[]> {
    return this.productNames.allTextContents();
  }

  async getProductPrices(): Promise<number[]> {
    const texts = await this.productPrices.allTextContents();
    return texts.map(t => parseFloat(t.replace('$', '')));
  }

  private categoryCheckbox(name: string): Locator {
    return this.page
      .locator('.checkbox label')
      .filter({ hasText: name })
      .locator('input');
  }

  private subcategoryCheckboxes(parentName: string): Locator {
    return this.page
      .locator('.checkbox')
      .filter({ has: this.page.locator('label').filter({ hasText: parentName }) })
      .locator('ul input[type="checkbox"]');
  }

  private async dragHandle(handle: Locator, targetX: number) {
    const box = await handle.boundingBox();
    if (!box) throw new Error('Slider handle not found');

    const startX = box.x + box.width / 2;
    const centerY = box.y + box.height / 2;

    await this.page.mouse.move(startX, centerY);
    await this.page.mouse.down();
    await this.page.mouse.move(targetX, centerY, { steps: 30 });
    await this.page.mouse.up();
  }
}
