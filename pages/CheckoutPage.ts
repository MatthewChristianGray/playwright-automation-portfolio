import { Page, Locator } from '@playwright/test';

export const CHECKOUT_USER = {
  email: 'customer@practicesoftwaretesting.com',
  password: 'welcome01',
};

export const BILLING = {
  address: '123 Main Street',
  city: 'Austin',
  state: 'Texas',
  country: 'US',
  postcode: '78701',
};

export class CheckoutPage {
  // Cart / step 1
  readonly proceedToCheckout: Locator;

  // Sign-in step
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly loginSubmit: Locator;

  // Billing address step
  readonly addressInput: Locator;
  readonly cityInput: Locator;
  readonly stateInput: Locator;
  readonly countrySelect: Locator;
  readonly postcodeInput: Locator;
  readonly proceedToBilling: Locator;

  // Payment step
  readonly paymentMethodSelect: Locator;
  readonly proceedToConfirm: Locator;

  // Confirmation step
  readonly orderConfirmation: Locator;
  readonly finishButton: Locator;

  constructor(private readonly page: Page) {
    this.proceedToCheckout = page.getByTestId('proceed-1');

    this.emailInput = page.getByTestId('email');
    this.passwordInput = page.getByTestId('password');
    this.loginSubmit = page.getByTestId('login-submit');

    this.addressInput = page.getByTestId('address');
    this.cityInput = page.getByTestId('city');
    this.stateInput = page.getByTestId('state');
    this.countrySelect = page.getByTestId('country');
    this.postcodeInput = page.getByTestId('postcode');
    this.proceedToBilling = page.getByTestId('proceed-2');

    this.paymentMethodSelect = page.getByTestId('payment-method');
    this.proceedToConfirm = page.getByTestId('proceed-3');

    this.orderConfirmation = page.getByTestId('order-confirmation');
    this.finishButton = page.getByTestId('finish');
  }

  async addProductAndGoToCart(slug = 'combination-pliers') {
    await this.page.goto(`/product/${slug}`);
    await this.page.getByTestId('quantity').waitFor({ state: 'visible' });
    await this.page.getByTestId('add-to-cart').click();
    await this.page.getByTestId('cart-quantity').waitFor({ state: 'visible' });
    await this.page.goto('/cart');
    await this.page.waitForLoadState('networkidle');
  }

  async loginDuringCheckout() {
    await this.emailInput.fill(CHECKOUT_USER.email);
    await this.passwordInput.fill(CHECKOUT_USER.password);
    await this.loginSubmit.click();
    await this.page.waitForLoadState('networkidle');
  }

  async fillBillingAddress(billing = BILLING) {
    await this.addressInput.fill(billing.address);
    await this.cityInput.fill(billing.city);
    await this.stateInput.fill(billing.state);
    await this.countrySelect.selectOption(billing.country);
    await this.postcodeInput.fill(billing.postcode);
  }

  async selectPaymentMethod(method = 'Credit Card') {
    await this.paymentMethodSelect.selectOption({ label: method });
  }
}
