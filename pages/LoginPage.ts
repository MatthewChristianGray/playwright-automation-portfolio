import { Page, Locator } from '@playwright/test';

export const TEST_USER = {
  email: 'customer@practicesoftwaretesting.com',
  password: 'welcome01',
};

export class LoginPage {
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;
  readonly loginError: Locator;
  readonly navSignIn: Locator;
  readonly userMenu: Locator;

  constructor(private readonly page: Page) {
    this.emailInput = page.getByTestId('email');
    this.passwordInput = page.getByTestId('password');
    this.submitButton = page.getByTestId('login-submit');
    this.loginError = page.getByTestId('login-error');
    this.navSignIn = page.getByTestId('nav-sign-in');
    this.userMenu = page.getByTestId('nav-user-menu');
  }

  async goto() {
    await this.page.goto('/auth/login');
    await this.emailInput.waitFor({ state: 'visible' });
  }

  async login(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
  }

  async loginAsTestUser() {
    await this.login(TEST_USER.email, TEST_USER.password);
    await this.page.waitForURL('/');
  }

  async logout() {
    await this.userMenu.click();
    await this.page.getByTestId('nav-sign-out').click();
    await this.page.waitForURL('/auth/login');
  }
}
