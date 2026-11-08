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
  assert.ok(rawAppJs.includes("if (typeof runWebhookSimulation === 'function') runWebhookSimulation()"), 'Changing Fold-1 preset or decline code must automatically sync and re-simulate the Stripe Webhook Retry Lab');
  assert.ok(renderedHome.includes('id="bandit-store-context"') && rawAppJs.includes('Matched counter-offer for ${storeName}'), 'Exit Counter-Offer Simulator must dynamically sync with Fold-1 store name and AOV');
  assert.ok(renderedHome.includes('id="wh-copy-email-btn"') && rawAppJs.includes('copyWebhookEmailPreview'), 'Stripe Webhook Retry Lab must surface unmasked Step-1 recovery email with 1-click copy and $29 pack upgrade framing');
  assert.ok(renderedHome.includes('id="bandit-copy-offer-btn"') && rawAppJs.includes('copyBanditOfferPreview'), 'Exit Counter-Offer Simulator must surface 1-click counter-offer copy and $1.99/$29 upgrade links');
  assert.ok(renderedHome.includes('id="in-card-unlock-sub"') && rawAppJs.includes('Complete ${storeName} Recovery Pack ($29'), 'Bottom pricing bar must dynamically personalize to visitor store name, AOV, and 1-order ROI payback');
  assert.ok(html.includes('in-card-unlock-sub') && rawGrowthJs.includes('in-card-unlock-sub') && scanHtml.includes('Get Complete '), 'Subpage calculators on /seo/*, /compare/*, /tools/*, and /scan/* must also personalize bottom pricing bar and CTAs');
  assert.ok(lpHtml.includes('Get Complete \' + store + \' Recovery Pack') && sampleHtml.includes('Get Complete \'+st+\' Recovery Pack') && lbHtml.includes('Get Complete \'+s.target+\' Pack'), '/lp, /sample, and /leaderboard must also dynamically personalize primary $29 Pack CTAs and bottom pricing bar');
  assert.ok(renderedHome.includes('id="modal-buy-29"') && !rawAppJs.includes('SQLite Posterior α updated'), 'Exit-Intent preview modal must feature store-personalized title, plain-English save rate copy, and direct $29/$1.99 checkout actions');
  assert.ok(dirHtml.includes('id="dir-inline-action-bar"') && dirHtml.includes('id="dir-buy-29"'), '/directory must include Fold-1 inline $29/$1.99 action bar that personalizes on filter selection');
  assert.ok(renderedHome.includes('#input-store, #lp-store, #sample-store, #eb-cnn-wb-input') && rawAppJs.includes('window.__ebActiveEntity = storeName'), '__ebCheckout must pass active store/domain target across all AbandonAlpha routes into Stripe Checkout');
  assert.ok(renderedHome.includes('Fix #1 Snippet Unmasked on Page!') && rawAppJs.includes('sticky-sub-benefit'), 'Exit-intent rescue toast and sticky conversion dock must use AbandonAlpha Fix #1 copy and dynamic store/ROI personalization');
  assert.ok(!renderedHome.includes('skin-cycling.ics') && renderedHome.includes('id="cmdk-buy-29"'), 'Cmd+K modal must not leak DermLogic skin-cycling.ics into AbandonAlpha and must offer personalized $29/$1.99 actions');
  assert.ok(renderedHome.includes('id="aa-fix1-details"') && rawAppJs.includes('/buy/playbook_pass?target=${encodeURIComponent(storeName)}&email=${encodeURIComponent(email)}'), 'Fold-1 $0 Fix #1 reveal form must keep <=3 initial Fold-1 inputs, auto-open on user interaction, and offer a personalized $29 Complete Pack upgrade link upon unlock');
  assert.ok(rawAppJs.includes("btn.setAttribute('data-copied-fix1', '1')") && html.includes("getAttribute('data-copied')==='1'") && scanHtml.includes("getAttribute('data-copied')==='1'") && sampleHtml.includes("getAttribute('data-copied')==='1'"), 'Copy Free Fix #1 Snippet buttons across /, /seo/*, /compare/*, /tools/*, /scan/*, /lp, /sample, and /leaderboard must transform into 1-click $29 Complete Pack checkout triggers after copying');
  assert.ok(rawAppJs.includes('✓ Copied Counter-Offer — Get All 6 in $29 Pack →') && rawAppJs.includes('✓ Copied Step-1 Email — Get SMS + Worker ($29) →'), 'Bandit counter-offer and Webhook Step-1 email copy buttons must transform into 1-click $29 Pack checkout triggers after copying and reset on new simulation');
  assert.ok(scanHtml.includes("h1.setAttribute('data-entity-name',s.target)") && rawGrowthJs.includes("fBtn.textContent='Complete '+s.target+' Recovery Pack ($29 — One-Time) →'"), '__ebRunScanWb on /scan/* and __ebRunGrowthWb on /compare/* and /tools/* must dynamically update data-entity-name, Fix #1 snippet, and bottom $29 Pack CTAs');
  assert.ok(html.includes('id="pseo-fix1-details"') && lpHtml.includes('id="lp-fix1-details"') && sampleHtml.includes('id="sample-fix1-details"') && rawGrowthJs.includes('id="eb-growth-fix1-details"') && scanHtml.includes('id="eb-scan-fix1-details"') && lbHtml.includes('id="lb-fix1-details"'), 'All subpage calculators (/seo/*, /lp, /sample, /compare/*, /tools/*, /scan/*, /leaderboard) must auto-expand their Fix #1 snippet drawer upon user calculation');
  assert.ok(html.includes('id="pseo-open-grader-link"') && html.includes('id="pseo-open-wh-link"') && !html.includes('retryWindow: "${escapeHtml'), '/seo/* calculator must dynamically update deep-link and checkout query params without HTML-entity escaping inside JS textContent');
  assert.ok(rawGrowthJs.includes('id="eb-growth-buy-29"') && rawGrowthJs.includes('id="eb-growth-buy-199"'), '/compare/* and /tools/* must dynamically personalize inline $29/$1.99 action pack links on target check and volume calculation');
  assert.ok(scanHtml.includes("bp.href='/buy/playbook_pass?target='+encodeURIComponent(tgt)+'&sessions='+sess+'&aov='+aov") && lbHtml.includes("roi.textContent='Compiled for '+s.target"), '/scan/* and /leaderboard must sync custom volume query parameters into $29/$1.99 links and reset copy buttons on target change');
  assert.ok(lpHtml.includes("'&sessions=' + sessVal + '&aov=' + aovVal") && sampleHtml.includes("b199.textContent='Or unlock '+st+' 3-File Patch ($1.99)'") && html.includes("pseoCopyBtn.removeAttribute('data-copied')"), '/lp, /sample, and /seo/* must reset 2-stage copy buttons on input change and personalize $29/$1.99 links with sessions, aov, and store name');
  assert.ok(dirHtml.includes('id="dir-fix1-details"') && dirHtml.includes('id="dir-copy-fix1-btn"'), '/directory must include a dynamic Fix #1 snippet drawer and 2-stage copy button that updates and opens on filter selection');
  assert.ok(rawAppJs.includes("copySdkBtnEl.removeAttribute('data-copied-fix1')") && rawAppJs.includes("['aa-screen1-buy-199', 'wh-buy-199'].forEach"), 'Homepage calculator must reset copy-sdk-btn 2-stage state and personalize $1.99/$29 status links when store or decline code changes');
  const rawEbApiJs = fs.readFileSync(path.join(__dirname, '..', 'src', 'exact-baseline-api.js'), 'utf8');
  assert.ok(renderedHome.includes('#input-sessions, #pseo-sessions, #eb-growth-vol-sessions') && rawEbApiJs.includes("p.set('metadata[sessions]', String(rawSessions))"), '__ebCheckout and handleTierCheckout must collect and forward sessions, aov, and decline into Stripe Checkout metadata and telemetry');
  assert.ok(rawAppJs.includes('const isDeclineLike =') && rawAppJs.includes('✓ Payment Confirmed for <strong>') && renderedHome.includes("cTgt ? (' for ' + cTgt) : ''"), 'Post-purchase (?checkout=success) and cancel-return (?checkout=cancel) must smartly hydrate target store vs decline code and unmask/fulfill the store-specific bundle');
  assert.ok(rawEbApiJs.includes('## 0. Custom Recovery Rules for ${qTgt}') && rawAppJs.includes('/api/github-upgrade/llms-bundle.txt${dlQs}'), 'Downloadable .TXT and .CSV fulfillment endpoints must dynamically include the buyer target store, decline code, and AOV');
  assert.ok(rawEbApiJs.includes('const merchant = ${JSON.stringify(qTgt)};') && renderedHome.includes('id="cmdk-dl-csv"') && renderedHome.includes('id="cmdk-dl-txt"') && renderedHome.includes('id="wh-dl-worker"'), 'Cmd+K modal, Webhook Retry Lab, and downloadable Stripe worker endpoint must dynamically personalize store and decline parameters');

  console.log('PASS: abandon-alpha unit, SEO & cross-brand isolation verification tests passed.');
}

runTests();
