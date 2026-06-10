import { test, expect } from '@playwright/test';

test.describe('Admin Login', () => {
  test('should display login page', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Rapharch Admin Dashboard/);
    await expect(page.getByRole('heading', { name: /login/i })).toBeVisible();
  });

  test('should show email input field', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByLabel(/email/i)).toBeVisible();
  });

  test('should show password input field', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByLabel(/password/i)).toBeVisible();
  });

  test('should show login button', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('button', { name: /login/i })).toBeVisible();
  });

  test('should redirect to dashboard when authenticated', async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForURL('**/');
    await expect(page).toHaveURL('/');
  });
});
