const { test, expect } = require('@playwright/test');
const { performanceBudgets } = require('../fixtures/test-data');

test.describe('performance budgets', () => {
  test('home route stays within transfer and load budgets', async ({ page, request }) => {
    await page.goto('/');

    const navTiming = await page.evaluate(() => {
      const [entry] = performance.getEntriesByType('navigation');
      return entry ? entry.duration : 0;
    });

    expect(navTiming).toBeGreaterThan(0);
    expect(navTiming).toBeLessThan(performanceBudgets.homeLoadMs);

    const resources = [
      '/css/style.css',
      '/js/theme.js',
      '/js/nav-loader.js',
      '/js/footer-loader.js',
      '/js/avatar.js',
      '/assets/images/avatar-brick-square.jpg'
    ];

    let totalBytes = 0;
    let imageBytes = 0;
    let scriptBytes = 0;

    for (const resource of resources) {
      const response = await request.get(resource);
      expect(response.ok(), `Expected ${resource} to be reachable`).toBeTruthy();

      const body = await response.body();
      const size = body.length;
      totalBytes += size;

      if (resource.endsWith('.jpg') || resource.endsWith('.png') || resource.endsWith('.webp')) {
        imageBytes = Math.max(imageBytes, size);
      }

      if (resource.endsWith('.js')) {
        scriptBytes = Math.max(scriptBytes, size);
      }
    }

    expect(totalBytes).toBeLessThan(performanceBudgets.homeTotalTransferBytes);
    expect(imageBytes).toBeLessThan(performanceBudgets.maxImageBytes);
    expect(scriptBytes).toBeLessThan(performanceBudgets.maxScriptBytes);
  });
});
