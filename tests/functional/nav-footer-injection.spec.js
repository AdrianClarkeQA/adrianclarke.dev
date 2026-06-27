const { test, expect } = require('@playwright/test');
const { navFooterRoutes } = require('../fixtures/pages');

test.describe('shared nav/footer injection', () => {
  test('nav and footer appear on all key routes', async ({ page }) => {
    for (const route of navFooterRoutes) {
      await page.goto(route);
      await expect(page.locator('nav.nav')).toBeVisible();
      await expect(page.locator('footer')).toBeVisible();
    }
  });

  test('injected nav and footer links point to valid destinations', async ({ page, request }) => {
    await page.goto('/');
    await expect(page.locator('nav.nav')).toBeVisible();
    await expect(page.locator('footer')).toBeVisible();

    const linksToCheck = [
      '/index.html',
      '/pages/about-me.html',
      '/pages/cv.html',
      '/calculator/billions.html'
    ];

    for (const path of linksToCheck) {
      const response = await request.get(path);
      expect(response.ok(), `Expected ${path} to be reachable`).toBeTruthy();
    }
  });
});
