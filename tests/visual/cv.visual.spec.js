const { test, expect } = require('@playwright/test');

const viewports = [
  { name: 'desktop', size: { width: 1440, height: 2600 } },
  { name: 'mobile', size: { width: 390, height: 3200 } }
];

const themes = ['light', 'dark'];

for (const viewport of viewports) {
  test.describe(`cv visual ${viewport.name}`, () => {
    test.use({ viewport: viewport.size });

    for (const theme of themes) {
      test(`cv page ${theme} baseline`, async ({ page }) => {
        await page.addInitScript((selectedTheme) => {
          localStorage.setItem('theme', selectedTheme);
        }, theme);

        await page.goto('/pages/cv.html');
        await expect(page.locator('nav.nav')).toBeVisible();
        await expect(page.locator('#json-output .json-line').first()).toBeVisible();
        await expect(page.locator('footer')).toBeVisible();

        await page.evaluate(async () => {
          if (document.fonts && document.fonts.ready) {
            await document.fonts.ready;
          }
        });

        await expect(page).toHaveScreenshot(`cv-${viewport.name}-${theme}.png`, {
          fullPage: true,
          animations: 'disabled'
        });
      });

      test(`cv readable view ${theme} baseline`, async ({ page }) => {
        await page.addInitScript((selectedTheme) => {
          localStorage.setItem('theme', selectedTheme);
        }, theme);

        await page.goto('/pages/cv.html');
        await expect(page.locator('nav.nav')).toBeVisible();
        await expect(page.locator('footer')).toBeVisible();
        await page.getByRole('button', { name: 'Readable' }).click();
        await expect(page.locator('#cv-readable .cv-job').first()).toBeVisible();

        await page.evaluate(async () => {
          if (document.fonts && document.fonts.ready) {
            await document.fonts.ready;
          }
        });

        await expect(page).toHaveScreenshot(`cv-readable-${viewport.name}-${theme}.png`, {
          fullPage: true,
          animations: 'disabled'
        });
      });
    }

    test('print-friendly page baseline', async ({ page }) => {
      await page.goto('/pages/curriculum-vitae.html');
      await expect(page.getByRole('heading', { name: 'Curriculum Vitae' })).toBeVisible();
      await expect(page.locator('#cv-print-content .cv-job').first()).toBeVisible();
      await expect(page.locator('footer')).toBeVisible();

      await page.evaluate(async () => {
        if (document.fonts && document.fonts.ready) {
          await document.fonts.ready;
        }
      });

      await expect(page).toHaveScreenshot(`curriculum-vitae-${viewport.name}.png`, {
        fullPage: true,
        animations: 'disabled'
      });
    });
  });
}
