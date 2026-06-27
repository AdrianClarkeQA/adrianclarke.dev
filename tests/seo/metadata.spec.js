const { test, expect } = require('@playwright/test');
const { pageMatrix } = require('../fixtures/pages');

test.describe('seo metadata contract', () => {
  for (const pageDef of pageMatrix) {
    test(`${pageDef.name} page exposes required metadata`, async ({ page }) => {
      await page.goto(pageDef.route);

      await expect(page).toHaveTitle(/.+/);
      await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', /\S+/);

      if (pageDef.canonical) {
        await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', pageDef.canonical);
      }

      await expect(page.locator('meta[property="og:title"]')).toHaveAttribute('content', /\S+/);
      await expect(page.locator('meta[property="og:description"]')).toHaveAttribute('content', /\S+/);
    });
  }
});
