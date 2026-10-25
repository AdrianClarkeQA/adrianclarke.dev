const { test, expect } = require('@playwright/test');
const { navFooterRoutes } = require('../fixtures/pages');
const { viewports } = require('../fixtures/test-data');

async function box(locator) {
  const rect = await locator.boundingBox();
  expect(rect, 'Expected element to be rendered').not.toBeNull();
  return rect;
}

test.describe('desktop layout', () => {
  test.use({ viewport: viewports.desktop });

  test('sidebar sits beside the main content', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('aside.sidebar')).toBeVisible();

    const sidebar = await box(page.locator('aside.sidebar'));
    const main = await box(page.locator('main.main'));

    expect(sidebar.x + sidebar.width).toBeLessThanOrEqual(main.x + 1);
    expect(Math.abs(sidebar.y - main.y)).toBeLessThan(2);
  });
});

test.describe('mobile layout', () => {
  test.use({ viewport: viewports.mobile });

  test('no route scrolls horizontally', async ({ page }) => {
    for (const route of navFooterRoutes) {
      await page.goto(route);
      await expect(page.locator('aside.sidebar')).toBeVisible();
      await expect(page.locator('footer')).toBeVisible();

      const overflows = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
      expect(overflows, `Expected no horizontal scroll on ${route}`).toBe(false);
    }
  });

  test('sidebar stacks above the main content', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('aside.sidebar')).toBeVisible();

    const sidebar = await box(page.locator('aside.sidebar'));
    const main = await box(page.locator('main.main'));

    expect(sidebar.y + sidebar.height).toBeLessThanOrEqual(main.y + 1);
  });

  test('skill tools sit under the skill name so long names never overlap', async ({ page }) => {
    await page.goto('/');
    const rows = page.locator('#skills-grid .skill-row');
    await expect(rows.first()).toBeVisible();

    const count = await rows.count();
    for (let i = 0; i < count; i += 1) {
      const name = await box(rows.nth(i).locator('.skill-name'));
      const tools = await box(rows.nth(i).locator('.skill-tools'));
      expect(tools.y, `Row ${i + 1}: tools should start below the name`).toBeGreaterThanOrEqual(name.y + name.height - 1);
      expect(Math.abs(tools.x - name.x), `Row ${i + 1}: tools should line up under the name`).toBeLessThan(2);
    }
  });

  test('wide JSON lines scroll inside the terminal, not the page', async ({ page }) => {
    await page.goto('/pages/cv.html');
    const body = page.locator('#json-output');
    await expect(body.locator('.json-line').first()).toBeVisible();

    const scrolls = await body.evaluate((el) => el.scrollWidth > el.clientWidth);
    expect(scrolls).toBe(true);
  });
});
