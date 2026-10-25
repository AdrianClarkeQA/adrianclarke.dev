const { test, expect } = require('@playwright/test');
const { collectInternalLinks, assertPathsResolveOk } = require('../helpers/crawl-helper');
const { pageMatrix } = require('../fixtures/pages');
const { site } = require('../fixtures/test-data');

test.describe('internal links and asset integrity', () => {
  test('core internal links from home are reachable', async ({ page, request }) => {
    await page.goto('/');
    await expect(page.locator('nav.nav')).toBeVisible();
    await expect(page.locator('footer')).toBeVisible();
    const links = await collectInternalLinks(page);

    const bounded = links.filter((link) => {
      return link !== '/' && !link.startsWith('/#');
    });

    await assertPathsResolveOk(request, bounded, expect);
  });

  test('robots and manifest are reachable and valid', async ({ request }) => {
    const robots = await request.get('/robots.txt');
    expect(robots.ok()).toBeTruthy();
    await expect.soft(robots.text()).resolves.toContain('User-agent: *');

    const manifest = await request.get('/site.webmanifest');
    expect(manifest.ok()).toBeTruthy();
    const manifestJson = await manifest.json();

    expect(Array.isArray(manifestJson.icons)).toBeTruthy();
    expect(manifestJson.icons.length).toBeGreaterThan(0);
  });

  test('key image and icon assets are reachable', async ({ request }) => {
    const assets = [
      site.avatar,
      site.socialImage,
      '/assets/icons/favicon-32x32-v2.png',
      '/assets/icons/favicon-16x16-v2.png',
      '/assets/icons/apple-touch-icon-v2.png'
    ];

    await assertPathsResolveOk(request, assets, expect);
  });

  test('every page shares the same, reachable social image', async ({ page, request }) => {
    for (const entry of pageMatrix) {
      await page.goto(entry.route);

      for (const selector of ['meta[property="og:image"]', 'meta[name="twitter:image"]']) {
        const content = await page.locator(selector).getAttribute('content');
        expect(content, `${selector} on ${entry.route}`).toBe(`https://adrianclarke.dev${site.socialImage}`);
      }
    }

    const response = await request.get(site.socialImage);
    expect(response.ok()).toBeTruthy();
  });
});
