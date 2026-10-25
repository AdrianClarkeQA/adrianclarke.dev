const { test, expect } = require('@playwright/test');
const { getCurrentTheme, setThemeBeforeNavigation, toggleTheme, expectTheme, expectThemePersistsAcrossRoutes } = require('../helpers/theme-helper');

test.describe('theme persistence behavior', () => {
  test('default theme is light for first visit with a light OS setting', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/');
    const current = await getCurrentTheme(page);
    expect(current).toBe('light');
  });

  test('first visit follows a dark OS setting', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/');
    await expectTheme(page, 'dark', expect);
  });

  test('a saved choice wins over the OS setting', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'dark' });
    await setThemeBeforeNavigation(page, 'light');
    await page.goto('/');
    await expectTheme(page, 'light', expect);
  });

  test('toggle label names the mode it switches to', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/');
    const toggle = page.locator('#theme-toggle');

    await expect(toggle).toHaveText('Dark mode');
    await toggleTheme(page);
    await expect(toggle).toHaveText('Light mode');
    await toggleTheme(page);
    await expect(toggle).toHaveText('Dark mode');
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
      ['/pages/about-me.html', '/calculator/billions.html', '/pages/cv.html', '/pages/curriculum-vitae.html', '/'],
      'dark',
      expect
    );
  });
});
