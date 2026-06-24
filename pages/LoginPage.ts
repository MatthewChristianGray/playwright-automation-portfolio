import { Page, Locator } from '@playwright/test';

// Credentials are loaded from .env (Playwright 1.47+ auto-loads .env files)
export const TEST_USER = {
  email: process.env.TEST_USER_EMAIL!,
  password: process.env.TEST_USER_PASSWORD!,
};

export class LoginPage {
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;
  readonly loginError: Locator;
  readonly navSignIn: Locator;
  // "Sign out" is a generic div, not a link, so getByText is the right locator
  readonly navSignOut: Locator;
  // After login the customer's name appears as a button in the nav menubar
  readonly userMenu: Locator;

  constructor(private readonly page: Page) {
    this.emailInput = page.getByTestId('email');
    this.passwordInput = page.getByTestId('password');
    this.submitButton = page.getByTestId('login-submit');
    this.loginError = page.getByTestId('login-error');
    this.navSignIn = page.getByTestId('nav-sign-in');
    this.navSignOut = page.getByText('Sign out');
    this.userMenu = page.getByRole('button', { name: 'Jane Doe' });
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
    await this.page.waitForURL(/\/account/);
  }

  async logout() {
    await this.userMenu.click();
    await this.navSignOut.click();
    await this.page.waitForURL(/\/auth\/login/);
  }
}
