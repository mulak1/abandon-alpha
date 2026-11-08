const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { computeLeakageAudit, selectBanditArm } = require('../src/engine');
const { getAllPseoPages, getPseoPageBySlug } = require('../src/pseo-data');
const { renderPseoPageHtml, renderDirectoryHtml, renderMetaLandingPageHtml, renderLegalPageHtml } = require('../src/views');
const { VERTICAL_CONFIGS } = require('../src/exact-baseline-api');
const { renderExactBaselineEnhancements, renderSampleDossierHtml } = require('../src/exact-baseline-ui');
const { evaluateScanTarget, renderPublicScanPageHtml, renderLeaderboardPageHtml } = require('../src/public-scan-flywheel');

function runTests() {
  const pages = getAllPseoPages();
  assert.equal(pages.length, 60, 'Expected 60 pSEO playbooks');

  const page = getPseoPageBySlug('stripe-decline-code-insufficient-funds-recovery');
  assert.ok(page, 'Expected insufficient_funds pSEO page');
  const html = renderPseoPageHtml(page, 'https://www.abandonalpha.com');
  assert.ok(html.includes('BreadcrumbList'), 'Expected BreadcrumbList JSON-LD on /seo/:slug');
  assert.ok(html.includes('/#in-card-unlock-bar'), 'Expected pricing anchor to point to /#in-card-unlock-bar');
  assert.ok(!html.includes('&amp;store=Stripe%20Decline'), 'Must not pass truncated SEO title as store name query param');
  assert.ok(html.includes('/buy/flash_pass?playbook=') && html.includes('/buy/playbook_pass?playbook='), 'Must offer both $1.99 and $29 pack options on pSEO calculator');
  assert.ok(!html.includes('>Stripe</h1>'), 'Must not truncate pSEO H1 title to a single word');
  assert.ok(!html.includes('tile-rose'), 'Must not use competing neon pink metric tile on pSEO pages');

  const lpHtml = renderMetaLandingPageHtml('https://www.abandonalpha.com');
  assert.ok(!lpHtml.includes('tile-rose'), 'Must not use competing neon pink metric tile on /lp');
  assert.ok(lpHtml.includes('/buy/playbook_pass?utm_source=meta_lp'), 'Must wire $29 Complete Store Recovery Pack directly on /lp');
  const termsHtml = renderLegalPageHtml('terms');
  assert.ok(termsHtml.includes('$29 Complete Store Recovery Pack'), 'Terms page must match $29 Complete Store Recovery Pack pricing');

  const audit = computeLeakageAudit({ monthlySessions: 999999999, aovUsd: 999999999 });
  assert.equal(audit.monthlySessions, 500000, 'Expected monthlySessions clamped to 500000');
  assert.equal(audit.aovUsd, 50000, 'Expected aovUsd clamped to 50000');

  const deepLinkAudit = computeLeakageAudit({ monthlySessions: 3550, aovUsd: 185, primaryDeclineCode: 'fraudulent' });
  assert.equal(deepLinkAudit.dunningBreakdown[0].declineCode, 'fraudulent', 'Expected deep-linked decline code (e.g. fraudulent) to be ranked #1 in dunningBreakdown');
  assert.equal(deepLinkAudit.roiMultipleStarter, Number((deepLinkAudit.totalRecoverableUsd / 29).toFixed(1)), 'Expected roiMultipleStarter to use $29 Complete Store Recovery Pack price');

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
  assert.ok(!renderedHome.includes('[Brand]'), 'Must not leave generic [Brand] placeholder in Specimen #1 subject line');
  assert.ok(renderedHome.includes('id="aa-unmasked-subject-quote"'), 'Must include dynamic Specimen #1 subject line quote element');
  assert.ok(renderedHome.includes('id="aa-screen1-buy-199"') && renderedHome.includes('id="aa-screen1-buy-29"'), 'Must wire distinct $1.99 and $29 inline checkout triggers');
  assert.ok(renderedHome.includes('id="wh-inline-unlock-form"') && renderedHome.includes('id="wh-buy-29"'), 'Must wire inline email reveal and $1.99/$29 checkout actions in Webhook Simulator');
  assert.ok(!renderedHome.includes('id="eb-customer-story-card"'), 'Must not bombard homepage with fake testimonial card strip');
  assert.ok(!renderedHome.includes('id="competitor-battlecard"'), 'Must not bombard homepage with competitor comparison wall');
  assert.ok(!renderedHome.includes('id="eb-sovrn-affiliate-strip"'), 'Must not bombard homepage with affiliate card strip');
  assert.ok(!renderedHome.includes('id="eb-ecosystem-handoff-banner"'), 'Must not bombard homepage with cross-promo banner');
  assert.ok(!renderedHome.includes('id="aa-user-segments-strip"'), 'Must not bombard homepage with filler user-segment cards');
  assert.ok(!renderedHome.includes('tile-rose'), 'Must enforce single bright element rule (no competing neon pink metric tile)');

  const rawAppJs = fs.readFileSync(path.join(__dirname, '..', 'public', 'app.js'), 'utf8');
  assert.ok(rawAppJs.includes('const placeholderRx = /^(founder@merchant\\.io'), 'initiateStripeCheckout must filter out placeholder emails so guest buyers are not misclassified as automated tests');
  const rawServerJs = fs.readFileSync(path.join(__dirname, '..', 'src', 'server.js'), 'utf8');
  assert.ok(rawServerJs.includes('rawCustomerEmail !== \'\' && isPlaceholderEmail'), 'POST /api/checkout must allow real guest buyers with empty email to create live Stripe sessions');

  const scanObj = evaluateScanTarget(cfg, 'gymshark.com');
  const scanHtml = renderPublicScanPageHtml(cfg, scanObj, '#0F172A');
  assert.ok(!scanHtml.includes('Step 1 of 3'), 'Public scan pages must not have Step 1 of 3 badge soup');
  assert.ok(!scanHtml.includes('Enter Email ($0) Above to Unmask Fix Plan'), 'Public scan pages must not lock Card 3 behind a purple pill');
  assert.ok(scanHtml.includes('/buy/playbook_pass?target='), 'Public scan pages must offer the $29 Complete Pack');

  const lbHtml = renderLeaderboardPageHtml(cfg, '#0F172A');
  assert.ok(!lbHtml.includes('#E11D48') && !lbHtml.includes('#D97706'), 'Leaderboard page must not use rainbow orange/red row bars');
  assert.ok(renderedHome.includes('id="aa-fold1-3step-flow"'), 'Homepage Fold 1 must include the Live 3-Step Smart Retry & SMS/Email Recovery Flow + Unmasked Step-1 Webhook');
  assert.ok(html.includes('Live 3-step recovery flow &amp; benchmark'), 'pSEO Fold 1 must include the 2-column Live 3-Step Recovery Flow & Benchmark');
  assert.ok(lpHtml.includes('class="site-header"'), '/lp must share the unified 70px site-header');
  assert.ok(scanHtml.includes('max-width:1320px') && lbHtml.includes('max-width:1320px'), '/scan and /leaderboard must use the unified 1320px container width');

  assert.ok(scanHtml.includes('id="eb-scan-volume-adjuster"'), 'Public scan pages must include inline custom store volume calculator');
  assert.ok(!scanHtml.includes('● Verified Source:') && !lbHtml.includes('● Verified Source:'), 'Scan and leaderboard pages must not have 3-column green-dot provenance banner clutter');

  assert.ok(lpHtml.includes('id="lp-decline"') && !lpHtml.includes('[Brand]'), '/lp must include dynamic decline selector and zero [Brand] placeholders');
  const sampleHtml = renderSampleDossierHtml(cfg);
  assert.ok(sampleHtml.includes('id="sample-decline"') && sampleHtml.includes('id="btn-sample-buy-29"'), '/sample must include interactive 2-column sample flow customizer and $29 Complete Pack button');
  assert.ok(lbHtml.includes('id="lb-instant-preview-card"') && lbHtml.includes('id="lb-empty-row"'), '/leaderboard must include inline store check preview card and empty-filter live check fallback');
  const dirHtml = renderDirectoryHtml('https://www.abandonalpha.com');
  assert.ok(dirHtml.includes('id="dir-empty-scan-link"') && dirHtml.includes('id="dir-empty-calc-link"'), '/directory must wire dynamic scan and calculator links when a custom store or query is typed');
  assert.ok(renderedHome.includes('id="aa-pack-roi-proof"') && html.includes('id="pseo-roi-proof"'), 'Fold 1 diagnosis card on / and /seo/* must surface live 1-order payback ROI proof');
  assert.ok(renderedHome.includes('id="aa-fix1-summary-cta"') && rawAppJs.includes('buildDeclineSpecificFix1Snippet') && html.includes('id="pseo-fix1-summary-cta"'), 'Fold 1 diagnosis card on / and /seo/* must surface dynamic store & decline-specific Fix #1 snippet unlock');
  const rawGrowthJs = fs.readFileSync(path.join(__dirname, '..', 'src', 'autonomous-growth-engine.js'), 'utf8');
  assert.ok(scanHtml.includes('id="eb-scan-roi-proof"') && scanHtml.includes('id="eb-scan-fix1-cta"') && rawGrowthJs.includes('id="eb-growth-roi-proof"') && rawGrowthJs.includes('id="eb-growth-fix1-cta"'), '/scan/*, /compare/*, and /tools/* must surface live 1-order payback ROI proof and Fix #1 snippet reveal');
  assert.ok(lpHtml.includes('id="lp-roi-proof"') && lpHtml.includes('id="lp-fix1-cta"') && sampleHtml.includes('id="sample-roi-proof"') && sampleHtml.includes('id="sample-fix1-cta"'), '/lp and /sample must surface live 1-order payback ROI proof and Fix #1 snippet reveal');
  assert.ok(lbHtml.includes('id="lb-roi-proof"') && lbHtml.includes('id="lb-fix1-cta"'), '/leaderboard must surface live 1-order payback ROI proof and Fix #1 snippet reveal');
  assert.ok(html.includes('id="pseo-copy-fix1-btn"') && rawGrowthJs.includes('id="eb-growth-copy-fix1-btn"') && scanHtml.includes('id="eb-scan-copy-fix1-btn"') && lpHtml.includes('id="lp-copy-fix1-btn"') && sampleHtml.includes('id="sample-copy-fix1-btn"') && lbHtml.includes('id="lb-copy-fix1-btn"'), 'All subpages must provide 1-click Copy Free Fix #1 Snippet with Step 1 of 3 upgrade framing');
  assert.ok(renderedHome.includes('Copy Free Fix #1 Snippet') && rawAppJs.includes('copy_fix1_snippet'), 'Main calculator must wire Copy Free Fix #1 Snippet telemetry and File 1 of 3 upgrade nudge');

  console.log('PASS: abandon-alpha unit, SEO & cross-brand isolation verification tests passed.');
}

runTests();
