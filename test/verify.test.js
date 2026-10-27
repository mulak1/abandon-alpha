const assert = require('node:assert/strict');
const { computeLeakageAudit, selectBanditArm } = require('../src/engine');
const { getAllPseoPages, getPseoPageBySlug } = require('../src/pseo-data');
const { renderPseoPageHtml } = require('../src/views');

function runTests() {
  const pages = getAllPseoPages();
  assert.equal(pages.length, 60, 'Expected 60 pSEO playbooks');

  const page = getPseoPageBySlug('stripe-decline-code-insufficient-funds-recovery');
  assert.ok(page, 'Expected insufficient_funds pSEO page');
  const html = renderPseoPageHtml(page, 'https://www.abandonalpha.com');
  assert.ok(html.includes('BreadcrumbList'), 'Expected BreadcrumbList JSON-LD on /seo/:slug');
  assert.ok(html.includes('/#in-card-unlock-bar'), 'Expected pricing anchor to point to /#in-card-unlock-bar');

  const audit = computeLeakageAudit({ monthlySessions: 999999999, aovUsd: 999999999 });
  assert.equal(audit.monthlySessions, 500000, 'Expected monthlySessions clamped to 500000');
  assert.equal(audit.aovUsd, 50000, 'Expected aovUsd clamped to 50000');

  const bandit = selectBanditArm({ objectionCode: 'C1_PRICE', aovUsd: 9999999 });
  assert.ok(bandit.selectedArm.net_order_value_usd <= 50000, 'Expected bandit net_order_value_usd clamped');
  console.log('PASS: abandon-alpha unit & SEO verification tests passed.');
}

runTests();
