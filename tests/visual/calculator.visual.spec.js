const { test, expect } = require('@playwright/test');

const viewports = [
  { name: 'desktop', size: { width: 1440, height: 2800 } },
  { name: 'mobile', size: { width: 390, height: 3400 } }
];

const themes = ['light', 'dark'];

for (const viewport of viewports) {
  test.describe(`calculator visual ${viewport.name}`, () => {
    test.use({ viewport: viewport.size });

    for (const theme of themes) {
      test(`initial state ${theme} baseline`, async ({ page }) => {
        await page.addInitScript((selectedTheme) => {
          localStorage.setItem('theme', selectedTheme);
        }, theme);

        await page.goto('/calculator/billions.html');
        await expect(page.locator('nav.nav')).toBeVisible();
        await expect(page.locator('#result-main')).toContainText('Enter an amount to begin.');
        await expect(page.locator('footer')).toBeVisible();

        await page.evaluate(async () => {
          if (document.fonts && document.fonts.ready) {
            await document.fonts.ready;
          }
        });

        await expect(page).toHaveScreenshot(`calculator-initial-${viewport.name}-${theme}.png`, {
          fullPage: true,
          animations: 'disabled'
        });
      });

      test(`result state ${theme} baseline`, async ({ page }) => {
        await page.addInitScript((selectedTheme) => {
          localStorage.setItem('theme', selectedTheme);
        }, theme);

        await page.goto('/calculator/billions.html');
        await expect(page.locator('nav.nav')).toBeVisible();
        await page.getByRole('button', { name: '£1 billion' }).click();

        await expect(page.locator('#result-main')).toContainText('£1,000,000,000');
        await expect(page.locator('#calc-breakdown')).toBeVisible();
        await expect(page.locator('#calc-comparisons')).toBeVisible();
        await expect(page.locator('#comparison-list li')).toHaveCount(5);
        await expect(page.locator('footer')).toBeVisible();

        await page.evaluate(async () => {
          if (document.fonts && document.fonts.ready) {
            await document.fonts.ready;
          }
        });

        await expect(page).toHaveScreenshot(`calculator-result-${viewport.name}-${theme}.png`, {
          fullPage: true,
          animations: 'disabled'
        });
      });
    }
  });
}
