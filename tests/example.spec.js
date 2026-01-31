const { test, expect } = require('@playwright/test');

test('homepage should load', async ({ page }) => {
  await page.goto('https://example.com');
  await expect(page).toHaveTitle(/Example Domain/);
});
