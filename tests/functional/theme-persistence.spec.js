const { test, expect } = require('@playwright/test');
const { getCurrentTheme, toggleTheme, expectTheme, expectThemePersistsAcrossRoutes } = require('../helpers/theme-helper');

test.describe('theme persistence behavior', () => {
  test('default theme is light for first visit', async ({ page }) => {
    await page.goto('/');
    const current = await getCurrentTheme(page);
    expect(current).toBe('light');
  });

  test('selected theme persists across reload and route changes', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('#theme-toggle')).toBeVisible();

    await toggleTheme(page);
    await expectTheme(page, 'dark', expect);

    await page.reload();
    await expectTheme(page, 'dark', expect);

    await expectThemePersistsAcrossRoutes(
      page,
      ['/pages/about-me.html', '/calculator/billions.html', '/pages/cv.html', '/'],
      'dark',
      expect
    );
  });
});
