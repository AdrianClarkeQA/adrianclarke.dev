const { test, expect } = require('@playwright/test');
const { collectInternalLinks, assertPathsResolveOk } = require('../helpers/crawl-helper');

test.describe('internal links and asset integrity', () => {
  test('core internal links from home are reachable', async ({ page, request }) => {
    await page.goto('/');
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

  test('key social and icon assets referenced by pages are reachable', async ({ request }) => {
    const assets = [
      '/assets/images/avatar-brick-square.jpg',
      '/assets/icons/favicon-32x32-v2.png',
      '/assets/icons/favicon-16x16-v2.png',
      '/assets/icons/apple-touch-icon-v2.png'
    ];

    await assertPathsResolveOk(request, assets, expect);
  });
});
