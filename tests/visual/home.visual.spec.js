const { test, expect } = require('@playwright/test');

const viewports = [
  { name: 'desktop', size: { width: 1440, height: 2400 } },
  { name: 'mobile', size: { width: 390, height: 2800 } }
];

const themes = ['light', 'dark'];

for (const viewport of viewports) {
  test.describe(`home visual ${viewport.name}`, () => {
    test.use({ viewport: viewport.size });

    for (const theme of themes) {
      test(`${theme} baseline`, async ({ page }) => {
        await page.addInitScript((selectedTheme) => {
          localStorage.setItem('theme', selectedTheme);
        }, theme);

        await page.goto('/');
        await expect(page.locator('nav.nav')).toBeVisible();
        await expect(page.locator('footer')).toBeVisible();
        await expect(page.locator('#skills-grid .skill-row').first()).toBeVisible();

        await page.evaluate(async () => {
          if (document.fonts && document.fonts.ready) {
            await document.fonts.ready;
          }
        });

        await expect(page).toHaveScreenshot(`home-${viewport.name}-${theme}.png`, {
          fullPage: true,
          animations: 'disabled'
        });
      });
    }
  });
}
