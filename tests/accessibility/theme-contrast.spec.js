const { test, expect } = require('@playwright/test');
const { themes } = require('../fixtures/test-data');
const { setThemeBeforeNavigation } = require('../helpers/theme-helper');

const contrastSelectors = ['.hero-title', '.hero-bio', '.btn-primary', '.btn-ghost'];

function toRgbParts(value) {
  const channels = value.match(/\d+\.?\d*/g);
  if (!channels || channels.length < 3) {
    return [0, 0, 0];
  }
  return channels.slice(0, 3).map(Number);
}

function channelToLinear(channel) {
  const normalized = channel / 255;
  if (normalized <= 0.03928) {
    return normalized / 12.92;
  }
  return ((normalized + 0.055) / 1.055) ** 2.4;
}

function luminance(rgb) {
  return (0.2126 * channelToLinear(rgb[0])) + (0.7152 * channelToLinear(rgb[1])) + (0.0722 * channelToLinear(rgb[2]));
}

test.describe('theme readability and contrast', () => {
  for (const theme of themes) {
    test(`text and controls maintain readable contrast in ${theme} theme`, async ({ page }) => {
      await setThemeBeforeNavigation(page, theme);
      await page.goto('/');

      for (const selector of contrastSelectors) {
        const ratio = await page.locator(selector).first().evaluate((element) => {
          function getOpaqueBackground(node) {
            let current = node;
            while (current) {
              const background = getComputedStyle(current).backgroundColor;
              if (background && !/rgba\(.+,\s*0\)/.test(background) && background !== 'transparent') {
                return background;
              }
              current = current.parentElement;
            }
            return 'rgb(255, 255, 255)';
          }

          const foreground = getComputedStyle(element).color;
          const background = getOpaqueBackground(element);
          return { foreground, background };
        });

        const fg = toRgbParts(ratio.foreground);
        const bg = toRgbParts(ratio.background);

        const light = Math.max(luminance(fg), luminance(bg));
        const dark = Math.min(luminance(fg), luminance(bg));
        const contrastRatio = (light + 0.05) / (dark + 0.05);
        expect(contrastRatio).toBeGreaterThanOrEqual(3);
      }
    });

    test(`focus indicator remains visible in ${theme} theme`, async ({ page }) => {
      await setThemeBeforeNavigation(page, theme);
      await page.goto('/');

      await page.locator('#theme-toggle').focus();
      const focusVisible = await page.locator('#theme-toggle').evaluate((element) => {
        const styles = getComputedStyle(element);
        const hasOutline = styles.outlineStyle !== 'none' && styles.outlineWidth !== '0px' && styles.outlineColor !== 'rgba(0, 0, 0, 0)';
        const hasShadow = styles.boxShadow && styles.boxShadow !== 'none';
        return hasOutline || hasShadow;
      });

      expect(focusVisible).toBeTruthy();
    });
  }
});
