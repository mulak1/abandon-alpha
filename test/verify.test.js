const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { computeLeakageAudit, selectBanditArm } = require('../src/engine');
const { getAllPseoPages, getPseoPageBySlug } = require('../src/pseo-data');
const { renderPseoPageHtml } = require('../src/views');
const { VERTICAL_CONFIGS } = require('../src/exact-baseline-api');
const { renderExactBaselineEnhancements } = require('../src/exact-baseline-ui');

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

  const rawIndex = fs.readFileSync(path.join(__dirname, '..', 'public', 'index.html'), 'utf8');
  const cfg = VERTICAL_CONFIGS.abandon_alpha;
  assert.equal(cfg.corePriceUsd, 29, 'Expected AbandonAlpha corePriceUsd to be 29');
  assert.equal(cfg.proPriceUsd, 49, 'Expected AbandonAlpha proPriceUsd to be 49');
  const renderedHome = renderExactBaselineEnhancements(rawIndex, cfg, '/');
  assert.ok(!renderedHome.includes('Full 109-Row Buyer Vault'), 'Must not leak SponsorRadar 109-Row Buyer Vault into AbandonAlpha');
  assert.ok(!renderedHome.includes('Unlock Creator Pass ($19)'), 'Must not leak SponsorRadar Creator Pass CTA into AbandonAlpha');
  assert.ok(!renderedHome.includes('$39 Pack'), 'Must not have conflicting $39 Pack label on homepage');
  assert.ok(renderedHome.includes('Complete Store Recovery Pack ($29'), 'Must feature unified $29 Complete Store Recovery Pack');
  assert.ok(renderedHome.includes('3-File Patch ($1.99)'), 'Must feature $1.99 3-File Patch option');

  const gymsharkPresetMatches = renderedHome.match(/>Gymshark \(Store\)</g) || [];
  assert.equal(gymsharkPresetMatches.length, 1, 'Must have exactly 1 Gymshark (Store) preset button on the homepage (no duplicate preset bars)');
  assert.ok(!renderedHome.includes('id="aa-spark-lock-2"'), 'Must not render stacked yellow/purple lock badge bombardment above the calculator');
  assert.ok(!renderedHome.includes('id="eb-leaderboard-home-showcase"'), 'Must not inject duplicate leaderboard card between hero and labs');

  console.log('PASS: abandon-alpha unit, SEO & cross-brand isolation verification tests passed.');
}

runTests();
