const { test, expect } = require('@playwright/test');

const viewports = [
  { name: 'desktop', size: { width: 1280, height: 900 } },
  { name: 'mobile', size: { width: 390, height: 844 } }
];

async function tabUntil(page, predicate, maxTabs = 40) {
  for (let i = 0; i < maxTabs; i += 1) {
    await page.keyboard.press('Tab');
    if (await predicate()) {
      return true;
    }
  }
  return false;
}

for (const viewport of viewports) {
  test.describe(`keyboard navigation ${viewport.name}`, () => {
    test.use({ viewport: viewport.size });

    test('tab flow can reach nav, main actions, and footer links', async ({ page }) => {
      await page.goto('/');
      await expect(page.locator('nav.nav')).toBeVisible();
      await expect(page.locator('footer')).toBeVisible();

      const reachedNav = await tabUntil(page, async () => {
        return page.evaluate(() => {
          return !!document.activeElement && !!document.activeElement.closest('nav');
        });
      });
      expect(reachedNav).toBeTruthy();

      const reachedMainAction = await tabUntil(page, async () => {
        return page.evaluate(() => {
          const active = document.activeElement;
          return !!active && active.tagName === 'A' && active.textContent.includes('View CV');
        });
      });
      expect(reachedMainAction).toBeTruthy();

      const reachedFooter = await tabUntil(page, async () => {
        return page.evaluate(() => {
          return !!document.activeElement && !!document.activeElement.closest('footer');
        });
      }, 60);
      expect(reachedFooter).toBeTruthy();
    });

    test('theme toggle is keyboard-operable', async ({ page }) => {
      await page.goto('/');
      await expect(page.locator('#theme-toggle')).toBeVisible();

      const focusedThemeToggle = await tabUntil(page, async () => {
        return page.evaluate(() => {
          return document.activeElement && document.activeElement.id === 'theme-toggle';
        });
      });
      expect(focusedThemeToggle).toBeTruthy();

      await page.keyboard.press('Enter');
      await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
    });
  });
}
