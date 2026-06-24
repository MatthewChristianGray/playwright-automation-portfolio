import { test, expect } from '@playwright/test';
import { LoginPage, TEST_USER } from '../../pages/LoginPage';

test.describe('Authentication', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  test('valid credentials log the user in and redirect to account', async ({ page }) => {
    await loginPage.loginAsTestUser();
    await expect(page).toHaveURL(/\/account/);
    await expect(loginPage.userMenu).toBeVisible();
  });

  test('invalid password shows an error message', async () => {
    await loginPage.login(TEST_USER.email, 'wrongpassword');
    await expect(loginPage.loginError).toBeVisible();
  });

  test('unknown email shows an error message', async () => {
    await loginPage.login('nobody@example.com', 'irrelevant');
    await expect(loginPage.loginError).toBeVisible();
  });

  test('empty form submission shows validation errors', async ({ page }) => {
    await loginPage.submitButton.click();
    await expect(page).toHaveURL(/\/auth\/login/);
    await expect(loginPage.emailInput).toHaveAttribute('aria-invalid', 'true');
  });

  test('logged-in user can sign out and is redirected to login', async ({ page }) => {
    await loginPage.loginAsTestUser();
    await loginPage.logout();
    await expect(page).toHaveURL(/\/auth\/login/);
    await expect(loginPage.navSignIn).toBeVisible();
  });

  test('protected account page redirects unauthenticated user to login', async ({ page }) => {
    await page.goto('/account');
    await expect(page).toHaveURL(/\/auth\/login/);
  });
});
