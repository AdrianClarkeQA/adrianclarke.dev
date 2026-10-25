const { test, expect } = require('@playwright/test');
const { navFooterRoutes, currentNavByRoute } = require('../fixtures/pages');
const { site } = require('../fixtures/test-data');

test.describe('shared sidebar/footer injection', () => {
  test('sidebar nav and footer appear on all key routes', async ({ page }) => {
    for (const route of navFooterRoutes) {
      await page.goto(route);
      await expect(page.locator('aside.sidebar nav.nav')).toBeVisible();
      await expect(page.locator('footer')).toBeVisible();
    }
  });

  test('sidebar shows identity, portrait, LinkedIn and theme toggle', async ({ page }) => {
    await page.goto('/');
    const sidebar = page.locator('aside.sidebar');

    await expect(sidebar.locator('.sidebar-name')).toContainText('Adrian');
    await expect(sidebar.locator('.sidebar-meta')).toContainText(site.location);
    await expect(sidebar.locator('#avatar-img')).toHaveAttribute('src', site.avatar);
    await expect(sidebar.locator('#avatar-img')).toHaveAttribute('alt', 'Adrian Clarke');
    await expect.poll(() => sidebar.locator('#avatar-img').evaluate((img) => img.complete && img.naturalWidth > 0)).toBe(true);

    const linkedin = sidebar.getByRole('link', { name: 'LinkedIn' });
    await expect(linkedin).toHaveAttribute('href', site.linkedin);
    await expect(linkedin).toHaveAttribute('target', '_blank');

    await expect(sidebar.locator('#theme-toggle')).toBeVisible();
  });

  test('current page is marked in the sidebar nav', async ({ page }) => {
    for (const [route, expected] of Object.entries(currentNavByRoute)) {
      await page.goto(route);
      await expect(page.locator('nav.nav')).toBeVisible();

      const current = page.locator('nav.nav a[aria-current="page"]');
      if (expected) {
        await expect(current, `Expected "${expected}" to be current on ${route}`).toHaveCount(1);
        await expect(current).toContainText(expected);
      } else {
        await expect(current, `Expected no current nav item on ${route}`).toHaveCount(0);
      }
    }
  });

  test('injected sidebar and footer links point to valid destinations', async ({ page, request }) => {
    await page.goto('/');
    await expect(page.locator('nav.nav')).toBeVisible();
    await expect(page.locator('footer')).toBeVisible();

    const hrefs = await page.locator('aside.sidebar a[href^="/"], footer a[href^="/"]').evaluateAll((links) => {
      return links.map((link) => link.getAttribute('href'));
    });

    expect(hrefs).toEqual(expect.arrayContaining(['/', '/pages/about-me.html', '/pages/cv.html', '/calculator/billions.html']));

    for (const path of new Set(hrefs)) {
      const response = await request.get(path);
      expect(response.ok(), `Expected ${path} to be reachable`).toBeTruthy();
    }
  });
});
