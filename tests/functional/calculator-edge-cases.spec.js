const { test, expect } = require('@playwright/test');

test.describe('calculator edge cases', () => {
  test('zero input renders a valid formatted result', async ({ page }) => {
    await page.goto('/calculator/billions.html');
    await page.locator('#target-number').fill('0');

    await expect(page.locator('#result-main')).toContainText('PS0'.replace('PS', '£'));
    await expect(page.locator('#result-main')).toContainText('seconds');
  });

  test('decimal-like input is sanitized to digits and remains formatted', async ({ page }) => {
    await page.goto('/calculator/billions.html');
    await page.locator('#target-number').fill('12.34');

    await expect(page.locator('#target-number')).toHaveValue('1234');
    await expect(page.locator('#result-main')).toContainText('PS1,234'.replace('PS', '£'));
  });

  test('very large values remain stable and formatted with commas', async ({ page }) => {
    await page.goto('/calculator/billions.html');
    await page.locator('#target-number').fill('1000000000000');

    await expect(page.locator('#result-main')).toContainText('PS1,000,000,000,000'.replace('PS', '£'));
    await expect(page.locator('#calc-breakdown')).toBeVisible();
    await expect(page.locator('#calc-comparisons')).toBeVisible();
  });

  test('non-digit input is normalized to digits', async ({ page }) => {
    await page.goto('/calculator/billions.html');
    await page.locator('#target-number').fill('-100');
    await expect(page.locator('#target-number')).toHaveValue('100');

    await expect(page.locator('#result-main')).toContainText('At £1 per second, £100 takes 100 seconds.');
  });

  test('preset path still renders comparisons list', async ({ page }) => {
    await page.goto('/calculator/billions.html');
    await page.getByRole('button', { name: 'PS1 billion'.replace('PS', '£') }).click();

    await expect(page.locator('#result-main')).toContainText('PS1,000,000,000'.replace('PS', '£'));
    await expect(page.locator('#comparison-list li')).toHaveCount(5);
  });
});
