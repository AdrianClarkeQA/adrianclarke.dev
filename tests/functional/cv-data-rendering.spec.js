const { test, expect } = require('@playwright/test');

test.describe('CV data rendering', () => {
  test('json panel and key profile fields are rendered', async ({ page }) => {
    await page.goto('/pages/cv.html');
    await expect(page.locator('#json-output')).toBeVisible();

    await expect(page.locator('#json-output')).toContainText('"name"');
    await expect(page.locator('#json-output')).toContainText('Adrian Clarke');
    await expect(page.locator('#json-output')).toContainText('"label"');
    await expect(page.locator('#json-output')).toContainText('QA Engineer');
    await expect(page.locator('#json-output')).toContainText('"experience"');
    await expect(page.locator('#json-output')).toContainText('Click Dealer');
  });

  test('print-friendly page includes core sections', async ({ page }) => {
    await page.goto('/pages/curriculum-vitae.html');
    await expect(page.getByRole('heading', { name: 'Curriculum Vitae' })).toBeVisible();

    await expect(page.locator('#cv-print-content')).toContainText('Adrian Clarke');
    await expect(page.locator('#cv-print-content')).toContainText('Summary');
    await expect(page.locator('#cv-print-content')).toContainText('Experience');
    await expect(page.locator('#cv-print-content')).toContainText('Skills');
    await expect(page.locator('#cv-print-content')).toContainText('Education');
  });
});
