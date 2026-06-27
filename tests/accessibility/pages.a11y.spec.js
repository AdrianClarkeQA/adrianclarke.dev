const { test, expect } = require('@playwright/test');
const { pageMatrix } = require('../fixtures/pages');
const { themes } = require('../fixtures/test-data');
const { setThemeBeforeNavigation } = require('../helpers/theme-helper');
const { scanCriticalAndSerious, formatA11yViolations } = require('../helpers/axe-helper');

const allowedSeriousIds = new Set(['color-contrast', 'scrollable-region-focusable']);

for (const theme of themes) {
  test.describe(`a11y critical checks in ${theme} theme`, () => {
    for (const entry of pageMatrix) {
      test(`${entry.name} page has no critical/serious violations`, async ({ page }) => {
        await setThemeBeforeNavigation(page, theme);
        await page.goto(entry.route);
        await expect(page.locator('body')).toBeVisible();

        const violations = await scanCriticalAndSerious(page, ['#avatar-img']);
        const critical = violations.filter((violation) => violation.impact === 'critical');
        const unexpectedSerious = violations.filter((violation) => {
          return violation.impact === 'serious' && !allowedSeriousIds.has(violation.id);
        });

        expect(formatA11yViolations(critical)).toEqual([]);
        expect(formatA11yViolations(unexpectedSerious)).toEqual([]);
      });
    }
  });
}
