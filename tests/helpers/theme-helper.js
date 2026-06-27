async function setThemeBeforeNavigation(page, theme) {
  await page.addInitScript((selectedTheme) => {
    localStorage.setItem('theme', selectedTheme);
  }, theme);
}

async function getCurrentTheme(page) {
  const activeTheme = await page.locator('html').getAttribute('data-theme');
  return activeTheme === 'dark' ? 'dark' : 'light';
}

async function toggleTheme(page) {
  await page.locator('#theme-toggle').click();
}

async function expectTheme(page, expectedTheme, expect) {
  const html = page.locator('html');
  if (expectedTheme === 'dark') {
    await expect(html).toHaveAttribute('data-theme', 'dark');
  } else {
    await expect(html).not.toHaveAttribute('data-theme', 'dark');
  }
}

async function expectThemePersistsAcrossRoutes(page, routes, expectedTheme, expect) {
  for (const route of routes) {
    await page.goto(route);
    await expect(page.locator('#theme-toggle')).toBeVisible();
    await expectTheme(page, expectedTheme, expect);
  }
}

module.exports = {
  setThemeBeforeNavigation,
  getCurrentTheme,
  toggleTheme,
  expectTheme,
  expectThemePersistsAcrossRoutes
};
