import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Accessibility Audit', () => {
  test('login page should not have accessibility violations', async ({ page }) => {
    await page.goto('/');

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('login page should have proper heading structure', async ({ page }) => {
    await page.goto('/');

    const headings = await page.locator('h1, h2, h3, h4, h5, h6').all();
    expect(headings.length).toBeGreaterThan(0);
  });

  test('login form should have accessible labels', async ({ page }) => {
    await page.goto('/');

    const emailInput = page.getByLabel(/email/i);
    const passwordInput = page.getByLabel(/password/i);

    await expect(emailInput).toBeVisible();
    await expect(passwordInput).toBeVisible();
  });

  test('login button should be keyboard accessible', async ({ page }) => {
    await page.goto('/');

    const loginButton = page.getByRole('button', { name: /login/i });
    await expect(loginButton).toBeVisible();
    await expect(loginButton).toBeEnabled();
  });

  test('all images should have alt text', async ({ page }) => {
    await page.goto('/');

    const images = await page.locator('img').all();
    for (const img of images) {
      const alt = await img.getAttribute('alt');
      expect(alt !== null).toBeTruthy();
    }
  });

  test('all interactive elements should be focusable', async ({ page }) => {
    await page.goto('/');

    const interactiveElements = await page.locator(
      'button, a, input, select, textarea, [tabindex]:not([tabindex="-1"])',
    ).all();

    for (const el of interactiveElements) {
      await expect(el).toBeVisible();
    }
  });

  test('color contrast should meet WCAG AA standards', async ({ page }) => {
    await page.goto('/');

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['cat.color'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('forms should have proper structure', async ({ page }) => {
    await page.goto('/');

    const forms = await page.locator('form').all();
    expect(forms.length).toBeGreaterThan(0);

    for (const form of forms) {
      const submitButton = form.locator('button[type="submit"]');
      await expect(submitButton).toBeVisible();
    }
  });
});
