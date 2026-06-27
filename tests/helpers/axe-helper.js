const AxeBuilder = require('@axe-core/playwright').default;

function formatA11yViolations(violations) {
  return violations.map((violation) => ({
    id: violation.id,
    impact: violation.impact,
    nodes: violation.nodes.length,
    description: violation.description
  }));
}

async function scanCriticalAndSerious(page, excludes = []) {
  const builder = new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']);

  for (const selector of excludes) {
    builder.exclude(selector);
  }

  const results = await builder.analyze();
  return results.violations.filter((violation) => {
    return violation.impact === 'critical' || violation.impact === 'serious';
  });
}

module.exports = {
  formatA11yViolations,
  scanCriticalAndSerious
};
