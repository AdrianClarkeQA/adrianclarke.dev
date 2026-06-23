const { test, expect } = require('@playwright/test');

test.describe('frontend smoke checks', () => {
  test('home page renders core hero and injected nav/footer', async ({ page }) => {
    await page.goto('/');

    await expect(page.locator('h1.hero-title')).toContainText('Adrian');
    await expect(page.getByRole('link', { name: 'About Me' }).first()).toBeVisible();
    await expect(page.locator('footer')).toBeVisible();
  });

  test('about page shows biography content', async ({ page }) => {
    await page.goto('/pages/about-me.html');

    await expect(page.locator('h1.hero-title')).toContainText('AboutMe');
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
});
