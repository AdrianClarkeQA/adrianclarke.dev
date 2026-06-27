function normalizeInternalPath(urlString, baseOrigin) {
  try {
    const candidate = new URL(urlString, baseOrigin);
    if (candidate.origin !== baseOrigin) {
      return null;
    }

    if (candidate.pathname === '') {
      return '/';
    }

    return candidate.pathname;
  } catch (_error) {
    return null;
  }
}

async function collectInternalLinks(page) {
  const baseOrigin = new URL(page.url()).origin;
  const hrefs = await page.locator('a[href]').evaluateAll((anchors) => {
    return anchors.map((anchor) => anchor.getAttribute('href')).filter(Boolean);
  });

  const normalized = hrefs
    .map((href) => normalizeInternalPath(href, baseOrigin))
    .filter(Boolean)
    .filter((path) => !path.startsWith('/#'));

  return [...new Set(normalized)];
}

async function assertPathsResolveOk(request, paths, expect) {
  for (const path of paths) {
    const response = await request.get(path);
    expect(response.ok(), `Expected ${path} to return 2xx/3xx`).toBeTruthy();
  }
}

module.exports = {
  collectInternalLinks,
  normalizeInternalPath,
  assertPathsResolveOk
};
