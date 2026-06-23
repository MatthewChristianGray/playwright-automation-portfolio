import { test, expect } from '@playwright/test';
import { CheckoutPage } from '../../pages/CheckoutPage';

test.describe('Checkout flow', () => {
  let checkout: CheckoutPage;

  test.beforeEach(async ({ page }) => {
    checkout = new CheckoutPage(page);
    await checkout.addProductAndGoToCart();
  });

  test('proceed to checkout button is visible in the cart', async () => {
    await expect(checkout.proceedToCheckout).toBeVisible();
  });

  test('clicking proceed to checkout advances to the sign-in step', async ({ page }) => {
    await checkout.proceedToCheckout.click();
    await expect(page).toHaveURL(/checkout/);
    await expect(checkout.emailInput).toBeVisible();
  });

  test('logging in during checkout advances to the billing address step', async ({ page }) => {
    await checkout.proceedToCheckout.click();
    await checkout.loginDuringCheckout();
    await expect(checkout.addressInput).toBeVisible();
  });

  test('billing address step advances after filling required fields', async ({ page }) => {
    await checkout.proceedToCheckout.click();
    await checkout.loginDuringCheckout();
    await checkout.fillBillingAddress();
    await checkout.proceedToBilling.click();
    await expect(checkout.paymentMethodSelect).toBeVisible();
  });

  test('full happy-path checkout reaches the order confirmation', async ({ page }) => {
    await checkout.proceedToCheckout.click();
    await checkout.loginDuringCheckout();
    await checkout.fillBillingAddress();
    await checkout.proceedToBilling.click();
    await checkout.selectPaymentMethod();
    await checkout.proceedToConfirm.click();
    await expect(checkout.orderConfirmation).toBeVisible();
  });

  test('order confirmation page shows a finish button', async ({ page }) => {
    await checkout.proceedToCheckout.click();
    await checkout.loginDuringCheckout();
    await checkout.fillBillingAddress();
    await checkout.proceedToBilling.click();
    await checkout.selectPaymentMethod();
    await checkout.proceedToConfirm.click();
    await expect(checkout.finishButton).toBeVisible();
  });
});
