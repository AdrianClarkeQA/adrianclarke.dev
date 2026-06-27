const { test, expect } = require('@playwright/test');

test.describe('frontend smoke checks', () => {
  const contentPages = ['/', '/pages/about-me.html', '/pages/cv.html', '/calculator/billions.html'];

  test('home page renders core hero and injected nav/footer', async ({ page }) => {
    await page.goto('/');

    await expect(page.locator('h1.hero-title')).toContainText('Adrian');
    await expect(page.getByRole('link', { name: 'About Me' }).first()).toBeVisible();
    await expect(page.locator('footer')).toBeVisible();
  });

  test('about page shows biography content', async ({ page }) => {
    await page.goto('/pages/about-me.html');

    await expect(page.locator('h1.hero-title')).toContainText('About');
    await expect(page.locator('h1.hero-title')).toContainText('Me');
    await expect(page.getByText('If you want to get in touch')).toBeVisible();
  });

  test('cv page renders JSON panel and print-friendly link', async ({ page }) => {
    await page.goto('/pages/cv.html');

    await expect(page.locator('#json-output')).toBeVisible();
    await expect(page.getByRole('link', { name: 'Print-friendly version' })).toBeVisible();
  });

  test('print cv page has print button', async ({ page }) => {
    await page.goto('/pages/curriculum-vitae.html');

    await expect(page.getByRole('heading', { name: 'Curriculum Vitae' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Print' })).toBeVisible();
  });

  test('content pages expose a title and meta description', async ({ page }) => {
    for (const path of contentPages) {
      await page.goto(path);

      await expect(page).toHaveTitle(/.+/);

      const description = page.locator('meta[name="description"]');
      await expect(description).toHaveAttribute('content', /\S+/);
    }
  });

  test('theme toggle switches mode and persists after reload', async ({ page }) => {
    await page.goto('/');

    const html = page.locator('html');
    const toggle = page.locator('#theme-toggle');

    await expect(toggle).toBeVisible();
    await expect(html).not.toHaveAttribute('data-theme', 'dark');

    await toggle.click();
    await expect(html).toHaveAttribute('data-theme', 'dark');

    await page.reload();
    await expect(html).toHaveAttribute('data-theme', 'dark');
  });

  test('billions calculator preset updates result with formatted output', async ({ page }) => {
    await page.goto('/calculator/billions.html');

    await page.getByRole('button', { name: '£1 billion' }).click();

    const resultMain = page.locator('#result-main');
    await expect(resultMain).toContainText('£1,000,000,000');
    await expect(resultMain).toContainText('years');

    await expect(page.locator('#calc-breakdown')).toBeVisible();
    await expect(page.locator('#calc-comparisons')).toBeVisible();
    await expect(page.locator('#comparison-list li')).toHaveCount(5);
  });

  test('404 page is accessible and provides route back home', async ({ page }) => {
    await page.goto('/404.html');

    await expect(page.getByRole('heading', { name: 'Oops! No worries.' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Back to home →' })).toBeVisible();
  });

  test('robots and manifest endpoints are reachable', async ({ request }) => {
    const robots = await request.get('/robots.txt');
    expect(robots.ok()).toBeTruthy();
    await expect.soft(robots.text()).resolves.toContain('User-agent: *');

    const manifest = await request.get('/site.webmanifest');
    expect(manifest.ok()).toBeTruthy();
    const manifestJson = await manifest.json();

    expect(manifestJson).toHaveProperty('icons');
    expect(Array.isArray(manifestJson.icons)).toBeTruthy();
    expect(manifestJson.icons.length).toBeGreaterThan(0);
  });
});
