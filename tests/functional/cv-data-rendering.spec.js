const { test, expect } = require('@playwright/test');
const { cvData } = require('../fixtures/test-data');

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// Independent oracle for the "Nov 2020 — Present" period format
function expectedPeriod(job) {
  const month = (value) => {
    const [year, m] = String(value).split('-');
    return m ? `${MONTHS[Number(m) - 1]} ${year}` : year;
  };
  return `${month(job.from)} — ${job.current ? 'Present' : month(job.to)}`;
}

const topLevelKeys = Object.keys(cvData);

async function stubPrint(page) {
  await page.addInitScript(() => {
    window.__printCalls = 0;
    window.print = () => { window.__printCalls += 1; };
  });
}

test.describe('CV JSON view', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/pages/cv.html');
    await expect(page.locator('#json-output .json-line').first()).toBeVisible();
  });

  test('json panel renders the CV data', async ({ page }) => {
    const output = page.locator('#json-output');

    await expect(output).toContainText('"name"');
    await expect(output).toContainText(cvData.basics.name);
    await expect(output).toContainText('"label"');
    await expect(output).toContainText(cvData.basics.label);
    await expect(output).toContainText('"experience"');
    await expect(output).toContainText(cvData.experience[0].company);
  });

  test('json panel shows every line of the pretty-printed CV', async ({ page }) => {
    const prettyLineCount = JSON.stringify(cvData, null, 2).split('\n').length;
    await expect(page.locator('#json-output .json-line')).toHaveCount(prettyLineCount);
  });

  test('every top-level key has a fold control', async ({ page }) => {
    for (const key of topLevelKeys) {
      await expect(page.locator(`[data-fold="${key}"] .json-fold-btn`)).toHaveAttribute('aria-expanded', 'true');
    }
  });

  test('clicking a key folds it to one line and clicking again restores it', async ({ page }) => {
    const lines = page.locator('#json-output .json-line');
    const row = page.locator('[data-fold="experience"]');
    const fullCount = await lines.count();

    await row.click();
    await expect(row).toContainText('[ … ]');
    await expect(row.locator('.json-fold-btn')).toHaveAttribute('aria-expanded', 'false');
    await expect(row.locator('.json-fold-btn')).toHaveText('+');
    await expect(page.locator('#json-output')).not.toContainText(cvData.experience[0].highlights[0]);
    expect(await lines.count()).toBeLessThan(fullCount);

    await row.click();
    await expect(row.locator('.json-fold-btn')).toHaveAttribute('aria-expanded', 'true');
    await expect(lines).toHaveCount(fullCount);
  });

  test('line numbers renumber after folding', async ({ page }) => {
    await page.locator('[data-fold="basics"]').click();

    const numbers = await page.locator('#json-output .json-ln').allTextContents();
    expect(numbers).toEqual(numbers.map((_, i) => String(i + 1)));
  });

  test('fold control works from the keyboard and keeps focus', async ({ page }) => {
    const button = page.locator('[data-fold="skills"] .json-fold-btn');

    await button.focus();
    await page.keyboard.press('Enter');

    const refreshed = page.locator('[data-fold="skills"] .json-fold-btn');
    await expect(refreshed).toHaveAttribute('aria-expanded', 'false');
    await expect(refreshed).toBeFocused();
  });
});

test.describe('CV readable view', () => {
  test('toggle switches between JSON and Readable views', async ({ page }) => {
    await page.goto('/pages/cv.html');

    const jsonButton = page.getByRole('button', { name: 'JSON', exact: true });
    const readableButton = page.getByRole('button', { name: 'Readable' });

    await expect(jsonButton).toHaveAttribute('aria-pressed', 'true');
    await expect(page.locator('#cv-json-view')).toBeVisible();
    await expect(page.locator('#cv-readable')).toBeHidden();

    await readableButton.click();
    await expect(readableButton).toHaveAttribute('aria-pressed', 'true');
    await expect(jsonButton).toHaveAttribute('aria-pressed', 'false');
    await expect(page.locator('#cv-json-view')).toBeHidden();
    await expect(page.locator('#cv-readable')).toBeVisible();

    await jsonButton.click();
    await expect(page.locator('#cv-json-view')).toBeVisible();
    await expect(page.locator('#cv-readable')).toBeHidden();
  });

  test('"A note from the nerd" shows with the JSON view only', async ({ page }) => {
    await page.goto('/pages/cv.html');
    const note = page.locator('#cv-note');

    await expect(note).toBeVisible();
    await page.getByRole('button', { name: 'Readable' }).click();
    await expect(note).toBeHidden();
    await page.getByRole('button', { name: 'JSON', exact: true }).click();
    await expect(note).toBeVisible();
  });

  test('readable view renders basics, experience and sections from cv.json', async ({ page }) => {
    await page.goto('/pages/cv.html');
    await page.getByRole('button', { name: 'Readable' }).click();
    const readable = page.locator('#cv-readable');

    await expect(readable.locator('.cv-name')).toHaveText(cvData.basics.name);
    await expect(readable.locator('.cv-subtitle')).toHaveText(`${cvData.basics.label} · ${cvData.basics.location}`);
    await expect(readable.locator('.cv-summary')).toHaveText(cvData.summary);

    await expect(readable.locator('.cv-job')).toHaveCount(cvData.experience.length);
    for (const [index, job] of cvData.experience.entries()) {
      const row = readable.locator('.cv-job').nth(index);
      await expect(row.locator('.cv-role')).toHaveText(job.role);
      await expect(row.locator('.cv-period')).toHaveText(expectedPeriod(job));
    }

    await expect(readable.locator('.cv-skill')).toHaveCount(cvData.skills.length);
    for (const label of ['Experience', 'Skills', 'Education', 'Certifications', 'Languages']) {
      await expect(readable.getByRole('heading', { name: label, exact: true })).toBeVisible();
    }
  });

  test('readable view links open in a new tab', async ({ page }) => {
    await page.goto('/pages/cv.html');
    await page.getByRole('button', { name: 'Readable' }).click();
    const links = page.locator('#cv-readable .cv-links a');

    await expect(links).toHaveCount(3);
    await expect(links.nth(0)).toHaveAttribute('href', cvData.basics.linkedin);
    await expect(links.nth(1)).toHaveAttribute('href', cvData.basics.github);
    for (let i = 0; i < 3; i += 1) {
      await expect(links.nth(i)).toHaveAttribute('target', '_blank');
      await expect(links.nth(i)).toHaveAttribute('rel', /noopener/);
    }
  });

  test('Print / save PDF switches to Readable and opens the print dialog', async ({ page }) => {
    await stubPrint(page);
    await page.goto('/pages/cv.html');
    await expect(page.locator('#json-output .json-line').first()).toBeVisible();

    await page.getByRole('button', { name: 'Print / save PDF' }).click();

    await expect(page.getByRole('button', { name: 'Readable' })).toHaveAttribute('aria-pressed', 'true');
    await expect.poll(() => page.evaluate(() => window.__printCalls)).toBe(1);
  });

  test('printing from the JSON view still prints the readable CV without page chrome', async ({ page }) => {
    await page.goto('/pages/cv.html');
    await expect(page.locator('#cv-readable .cv-name')).toHaveCount(1);

    await page.emulateMedia({ media: 'print' });

    await expect(page.locator('#cv-readable')).toBeVisible();
    await expect(page.locator('#cv-json-view')).toBeHidden();
    await expect(page.locator('.sidebar')).toBeHidden();
    await expect(page.locator('footer')).toBeHidden();
    await expect(page.locator('#cv-note')).toBeHidden();
  });
});

test.describe('print-friendly CV page', () => {
  test('includes core sections from cv.json', async ({ page }) => {
    await page.goto('/pages/curriculum-vitae.html');
    await expect(page.getByRole('heading', { name: 'Curriculum Vitae' })).toBeVisible();
    const content = page.locator('#cv-print-content');

    await expect(content).toContainText(cvData.basics.name);
    await expect(content).toContainText(cvData.summary);
    await expect(content.locator('.cv-job')).toHaveCount(cvData.experience.length);
    for (const label of ['Experience', 'Skills', 'Education']) {
      await expect(content.getByRole('heading', { name: label, exact: true })).toBeVisible();
    }
  });

  test('Print button opens the print dialog', async ({ page }) => {
    await stubPrint(page);
    await page.goto('/pages/curriculum-vitae.html');

    await page.getByRole('button', { name: 'Print' }).click();
    await expect.poll(() => page.evaluate(() => window.__printCalls)).toBe(1);
  });
});

test.describe('home skills index', () => {
  test('lists every skill from cv.json with a discipline count', async ({ page }) => {
    await page.goto('/');
    const rows = page.locator('#skills-grid .skill-row');

    await expect(rows).toHaveCount(cvData.skills.length);
    await expect(page.locator('#skills-count')).toHaveText(`${cvData.skills.length} disciplines`);

    for (const [index, skill] of cvData.skills.entries()) {
      await expect(rows.nth(index).locator('.skill-name')).toHaveText(skill.name);
      await expect(rows.nth(index).locator('.skill-tools')).toHaveText(skill.tools.join(' · '));
    }
  });
});
