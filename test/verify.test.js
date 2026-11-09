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
  assert.ok(scanHtml.includes("bp.href='/buy/playbook_pass'+qStr") && lbHtml.includes("roi.textContent='Compiled for '+s.target"), '/scan/* and /leaderboard must sync custom volume query parameters into $29/$1.99 links and reset copy buttons on target change');
  assert.ok(lpHtml.includes("'&sessions=' + sessVal + '&aov=' + aovVal") && sampleHtml.includes("b199.textContent='Or unlock '+st+' 3-File Patch ($1.99)'") && html.includes("pseoCopyBtn.removeAttribute('data-copied')"), '/lp, /sample, and /seo/* must reset 2-stage copy buttons on input change and personalize $29/$1.99 links with sessions, aov, and store name');
  assert.ok(dirHtml.includes('id="dir-fix1-details"') && dirHtml.includes('id="dir-copy-fix1-btn"'), '/directory must include a dynamic Fix #1 snippet drawer and 2-stage copy button that updates and opens on filter selection');
  assert.ok(rawAppJs.includes("copySdkBtnEl.removeAttribute('data-copied-fix1')") && rawAppJs.includes("['aa-screen1-buy-199', 'wh-buy-199', 'bandit-buy-199'].forEach"), 'Homepage calculator must reset copy-sdk-btn 2-stage state and personalize $1.99/$29 status links when store or decline code changes');
  const rawEbApiJs = fs.readFileSync(path.join(__dirname, '..', 'src', 'exact-baseline-api.js'), 'utf8');
  assert.ok(renderedHome.includes('#input-sessions, #pseo-sessions, #eb-growth-vol-sessions') && rawEbApiJs.includes("p.set('metadata[sessions]', String(rawSessions))"), '__ebCheckout and handleTierCheckout must collect and forward sessions, aov, and decline into Stripe Checkout metadata and telemetry');
  assert.ok(rawAppJs.includes('const isDeclineLike =') && rawAppJs.includes('✓ Payment Confirmed for <strong>') && renderedHome.includes("cTgt ? (' for ' + cTgt) : ''"), 'Post-purchase (?checkout=success) and cancel-return (?checkout=cancel) must smartly hydrate target store vs decline code and unmask/fulfill the store-specific bundle');
  assert.ok(rawEbApiJs.includes('## 0. Custom Recovery Rules for ${qTgt}') && rawAppJs.includes('/api/github-upgrade/llms-bundle.txt${dlQs}'), 'Downloadable .TXT and .CSV fulfillment endpoints must dynamically include the buyer target store, decline code, and AOV');
  assert.ok(rawEbApiJs.includes('const merchant = ${JSON.stringify(qTgt)};') && renderedHome.includes('id="cmdk-dl-csv"') && renderedHome.includes('id="cmdk-dl-txt"') && renderedHome.includes('id="wh-dl-worker"'), 'Cmd+K modal, Webhook Retry Lab, and downloadable Stripe worker endpoint must dynamically personalize store and decline parameters');
  assert.ok(rawEbApiJs.includes('Step 1 (T+0m): Webhook intercept') && rawEbApiJs.includes('const totRec = (qSess > 0 || qAov > 0)') && renderedHome.includes('id="cmdk-dl-js"'), 'Exported .CSV and .TXT bundles must compute custom volume KPIs and 3-step recovery schedule, and Cmd+K must expose .JS worker download');
  assert.ok(sampleHtml.includes('id="sample-dl-worker"') && sampleHtml.includes('id="sample-dl-bundle"') && sampleHtml.includes('id="sample-dl-csv"') && renderedHome.includes('id="cmdk-sample-link"'), '/sample must provide live personalized download links for all 3 files and hydrate from URL query params');
  assert.ok(lpHtml.includes("'&decline=' + encodeURIComponent(code)") && lpHtml.includes('if (qt || qd || qs || qa) runLpAudit(null, false)'), '/lp must hydrate store, decline, sessions, and aov from URL query params and forward decline code into $29/$1.99 buy links');
  assert.ok(html.includes('id="pseo-dl-worker"') && html.includes('if(qs||qa||qt)recalcPseo('), '/seo/* playbooks must expose a dynamic Preview Worker (.JS) download link and hydrate URL query params on load');
  assert.ok(scanHtml.includes('id="eb-scan-dl-worker"') && rawGrowthJs.includes('id="eb-growth-dl-worker"'), '/scan/*, /compare/*, and /tools/* must expose dynamic Preview Worker (.JS) links and forward decline codes into buy links');
  assert.ok(lbHtml.includes('id="lb-prev-dl-worker"') && lbHtml.includes('window.__lbRunInlineCheck(null,false)') && scanHtml.includes('window.__ebRecalcScanVolume(false)'), '/leaderboard and /scan/* must hydrate URL query parameters on load and expose Preview Worker (.JS) downloads');
  assert.ok(dirHtml.includes('id="dir-dl-worker"') && dirHtml.includes('filterDirectory(qt, false)') && rawGrowthJs.includes('window.__ebRecalcGrowthVolume(false)'), '/directory, /compare/*, and /tools/* must hydrate URL query parameters on load and expose Preview Worker (.JS) downloads');
  assert.ok(lpHtml.includes('id="lp-dl-worker"') && rawGrowthJs.includes('item.slug}${qs}'), '/lp must expose Preview Worker (.JS) download and /compare/* / /tools/* fallback redirects must preserve query parameters');
  assert.ok(rawAppJs.includes('/scan/${encodeURIComponent(domain)}?decline=') && rawGrowthJs.includes("pl.href='/scan/'+encodeURIComponent(tgt)+'?decline='"), 'Homepage and /compare/* / /tools/* permalink links to /scan/* must carry active decline, sessions, and aov query parameters');
  assert.ok(lbHtml.includes("var qExtra='&decline='+encodeURIComponent(code)") && html.includes('var pLabel = qTgt ?'), '/leaderboard and /seo/* must synchronously hydrate decline, sessions, aov, and target merchant across Fix #1 snippets, worker downloads, and /scan/* links');
  assert.ok(rawServerJs.includes('/seo/${bestSlug}${qs}') && dirHtml.includes("el.setAttribute('data-base-href', baseH)"), '/seo/:slug fallback redirects must preserve query strings and /directory must forward active target/volume params into playbook links');
  assert.ok(html.includes('.related-links-grid a.related-card') && rawGrowthJs.includes('window.history.replaceState(null,\'\',window.location.pathname+qStr)'), '/seo/* related playbook cards must carry active target, sessions, and aov parameters and subpage calculators must sync URL state');
  assert.ok(rawAppJs.includes('#out-dunning-breakdown a') && rawAppJs.includes('a[href^="/directory"]') && rawAppJs.includes('window.history.replaceState(null, \'\', `/?target='), 'Homepage must forward active store, decline, sessions, and aov into Fold-1 breakdown links and /directory navbar links, and sync URL state');
  assert.ok(renderedHome.includes('window.__ebSyncNavLinks = function(') && renderedHome.includes('footer a, .mobile-nav-strip a, a[href^="/scan/"]'), 'All pages and subpages must synchronize header, breadcrumb, footer, and /scan/* links with active target, decline, sessions, and aov parameters');
  assert.ok(renderedHome.includes("localStorage.getItem('aa_workspace_state_v1')") && html.includes('window.__pseoTarget=qt;'), 'Subpages must hydrate and persist storeName, monthlySessions, aovUsd, and declineFocus via aa_workspace_state_v1 in localStorage when visited without query parameters');
  assert.ok(lbHtml.includes("ws=JSON.parse(localStorage.getItem('aa_workspace_state_v1')||'{}')") && dirHtml.includes("actTgt = (cleanFilter || sp.get('target') || ws.storeName || '').trim()"), '/leaderboard and /directory must hydrate active store, decline, sessions, and aov from aa_workspace_state_v1 on bare URL visits');
  assert.ok(renderedHome.includes('id="modal-dl-worker"') && rawAppJs.includes("['wh-dl-worker', 'modal-dl-worker', 'bandit-dl-worker'].forEach") && renderedHome.includes('id="toast-dl-worker"'), 'Exit-intent modal (#exit-intent-modal), bandit lab (#bandit-lab), and toast (#eb-ouibounce-toast) must expose personalized worker (.JS) downloads and checkout links');
  assert.ok(renderedHome.includes('id="bandit-dl-worker"') && rawAppJs.includes("['aa-screen1-buy-29', 'wh-buy-29', 'bandit-buy-29'].forEach") && rawAppJs.includes("if (qStore || qAov || qObjection || restoredFromStorage)"), 'Exit Counter-Offer Simulator (#bandit-lab) must auto-hydrate store context, ERPV, $29/$1.99 CTAs, and Preview Worker (.JS) link on deep-link store/AOV/objection visits');
  assert.ok(rawAppJs.includes('id="cancel-dl-worker"') && renderedHome.includes('id="toast-cancel-dl-worker"') && rawAppJs.includes("fix1Det.open = checkoutState === 'cancel'"), 'Cancel-return (?checkout=cancel) must auto-expand Fix #1 snippet drawer and surface personalized Preview Worker (.JS) downloads in both the inline status bar and rescue toast');
  [renderedHome, html, scanHtml, lpHtml, sampleHtml, dirHtml, lbHtml].forEach((pageHtml, idx) => {
    const scriptMatches = Array.from(pageHtml.matchAll(/<script(?![^>]*application\/ld\+json)[^>]*>([\s\S]*?)<\/script>/gi));
    scriptMatches.forEach((m) => {
      if (m[1] && m[1].trim()) assert.doesNotThrow(() => new Function(m[1]), `Inline <script> in page index ${idx} must be syntactically valid JS`);
    });
  });

  assert.ok(rawAppJs.includes("['wh-dl-worker', 'modal-dl-worker', 'cmdk-dl-js'].forEach") && rawAppJs.includes("if (id === 'wh-decline-code' && el.value)") && !renderedHome.includes('#audit-form button\''), 'Webhook Retry Lab (#webhook-lab) must synchronize Fold-1 decline focus and download URLs without __ebTriggerHostCalc clicking .preset-btn and resetting custom store inputs');
  assert.ok(rawAppJs.includes("if (id === 'input-aov' && Number(el.value) >= 5 && document.getElementById('wh-amount'))") && rawAppJs.includes("window.location.hash === '#webhook-lab' || qDecline || qStore || qAov"), 'Deep-link AOV and #input-aov edits must synchronize #wh-amount and auto-run #webhook-lab simulation');
  assert.ok(rawAppJs.includes("if (id === 'input-store' || id === 'input-aov')") && rawAppJs.includes("if (res.estimatedAovUsd) {"), 'probeLiveMerchantStore and live #input-store/#input-aov edits must re-simulate both #webhook-lab and #bandit-lab in lockstep');
  assert.ok(renderedHome.includes('id="wh-amount" type="number" class="field-input" value="92"') && rawAppJs.includes("else if (id === 'wh-amount' && Number(el.value) >= 5)"), '#wh-amount must initialize to $92 (matching active preset AOV) and two-way sync with #input-aov');
  assert.ok(renderedHome.includes('id="modal-copy-offer-btn"') && rawAppJs.includes("['bandit-copy-offer-btn', 'modal-copy-offer-btn'].forEach") && rawAppJs.includes("if (mHead && bHead) mHead.textContent ="), 'Exit-intent modal (#exit-intent-modal) must mirror active #bandit-lab counter-offer headline, code, save rate, and ERPV on open and expose #modal-copy-offer-btn');
  assert.ok(renderedHome.includes('data-obj="C3_APPROVAL" onclick="modalSelectObjection(\'C3_APPROVAL\')"') && rawAppJs.includes("document.querySelectorAll('#objection-btn-group .objection-btn, #exit-intent-modal .objection-btn')") && rawAppJs.includes('selectedObjection:'), 'Selected objection state must synchronize across #bandit-lab and #exit-intent-modal and persist in aa_workspace_state_v1');
  assert.ok(rawEbApiJs.includes('const armMap = { C1_PRICE:') && rawAppJs.includes('&objection=${encodeURIComponent(selObj)}'), 'Downloadable .JS worker endpoint and worker preview links must dynamically include the visitor selected objection arm');
  assert.ok(rawEbApiJs.includes('banditArm: "${armCode}"') && renderedHome.includes("actObj ? '&objection=' + encodeURIComponent(actObj) : ''"), 'Downloadable .TXT bundle and Cmd+K modal download links must also include the visitor selected counter-offer objection arm');
  assert.ok(rawEbApiJs.includes("${qTgt} (${qDec}${qObj ? ' • ' + qObj : ''})") && renderedHome.includes("cObj ? '&objection=' + encodeURIComponent(cObj) : ''"), 'Downloadable .CSV export and post-checkout (?checkout=success / ?checkout=cancel) fulfillment links must also include the selected objection arm');
  assert.ok(rawEbApiJs.includes("if (rawObjection) p.set('metadata[objection]', rawObjection)") && renderedHome.includes("decline: actDec, objection: actObj"), '__ebCheckout and handleTierCheckout must collect and forward the selected objection arm into Stripe Checkout metadata, return URLs, and fallback /buy/:tier links');
  assert.ok(rawAppJs.includes("if (hasDeepLink) saveAaWorkspaceState()") && renderedHome.includes("window.__pseoTarget || ws.storeName") && html.includes("window.__pseoDecline=qd"), 'Deep-link visits on / must persist workspace state and subpages (/seo/*) must forward active store, decline, and objection into Cmd+K and __ebCheckout');
  assert.ok(renderedHome.includes('querySelectorAll(\'a[href^="/api/github-upgrade/"]\')') && renderedHome.includes("obj ? '&objection=' + encodeURIComponent(obj) : ''"), '__ebSyncNavLinks must propagate the active objection arm across all /api/github-upgrade/ download links and cross-page navigation links on every subpage');
  assert.ok(sampleHtml.includes("var qStr='?target='+encodeURIComponent(st)+'&decline='+encodeURIComponent(cd)+'&sessions='+sess+'&aov='+aov") && sampleHtml.includes("Compiled for '+st+' ($'+aov+' AOV)"), '/dossier/sample must dynamically compute ROI multiple, Fix #1 lift, and download query strings from active sessions, aov, and objection');
  assert.ok(dirHtml.includes("if (rProof && actTgt) rProof.textContent = 'Compiled for ' + actTgt + ' ($' + effAov + ' AOV)") && dirHtml.includes("aovUsd: ' + effAov"), '/directory must dynamically compute ROI multiple, Fix #1 lift, and snippet aovUsd from active sessions and aov');
  assert.ok(rawAppJs.includes('data-objection="${selObj}"') && rawAppJs.includes('banditArm: "${armCode}"') && renderedHome.includes("#pseo-fix1-code, #dir-fix1-code, #lp-fix1-code, #sample-fix1-code"), 'On-page Fix #1 snippet previews across / and all subpages must dynamically include the visitor selected counter-offer banditArm');
  assert.ok(lpHtml.includes("if (roiEl) roiEl.textContent = 'Compiled for ' + store + ' ($' + aovVal + ' AOV)") && lpHtml.includes("aovUsd: ' + aovVal"), 'updateLpFlowPreview on /lp must dynamically compute leaked revenue, recoverable revenue, ROI multiple, Fix #1 lift, and worker query parameters from active sessions and aov');
  assert.ok(lbHtml.includes("roi.textContent='Compiled for '+s.target+' ($'+effAov+' AOV)") && lbHtml.includes("aovUsd: '+effAov"), '__lbRunInlineCheck on /leaderboard must dynamically compute ROI multiple, Fix #1 lift, snippet aovUsd, and objection worker parameter from active sessions and aov');
  assert.ok(scanHtml.includes("roiEl.textContent='Compiled for '+tgt+' ($'+aov+' AOV)") && scanHtml.includes("if(window.__ebRecalcScanVolume)window.__ebRecalcScanVolume(true)"), '__ebRecalcScanVolume and __ebRunScanWb on /scan/* must preserve custom volume, aovUsd, ROI multiple, and objection across store checks');
  assert.ok(rawGrowthJs.includes("roiEl.textContent='Compiled for '+tgt+' ($'+aov+' AOV)") && rawGrowthJs.includes("if(window.__ebRecalcGrowthVolume)window.__ebRecalcGrowthVolume(true)"), '__ebRecalcGrowthVolume and __ebRunGrowthWb on /compare/* and /tools/* must preserve custom volume, aovUsd, ROI multiple, and objection across store checks');
  assert.ok(html.includes('window.__pseoObjection=qo;') && html.includes('banditArm: "\' + qObj + \'"') && html.includes("ws.monthlySessions = s; ws.aovUsd = aov;"), 'recalcPseo on /seo/:slug must preserve banditArm and objection query params across live edits and persist updated sessions/AOV into aa_workspace_state_v1');
  assert.ok(scanHtml.includes("ws.storeName=tgt;ws.monthlySessions=sess;ws.aovUsd=aov;ws.declineFocus=code;") && lbHtml.includes("ws.storeName=v;localStorage.setItem('aa_workspace_state_v1'") && rawGrowthJs.includes("ws.storeName=tgt;ws.monthlySessions=sess;ws.aovUsd=aov;ws.declineFocus=code;"), 'Interactive store/volume checks on /scan/*, /leaderboard, /compare/*, and /tools/* must persist updated store, sessions, AOV, and decline into aa_workspace_state_v1 and sync nav links');
  assert.ok(lpHtml.includes("wsLp.storeName = store; wsLp.monthlySessions = sessVal; wsLp.aovUsd = aovVal; wsLp.declineFocus = code;") && dirHtml.includes("qObj ? ', banditArm: \"' + qObj + '\"' : ''") && sampleHtml.includes("ws.storeName=st;ws.declineFocus=cd;localStorage.setItem('aa_workspace_state_v1'"), 'Interactive edits on /lp, /directory, and /dossier/sample must preserve banditArm and objection params and persist updated store/volume into aa_workspace_state_v1');
  assert.ok(renderedHome.includes("var spWs = new URLSearchParams(window.location.search || '')") && renderedHome.includes("o.textContent = wdec + ' (Targeted Recovery)'"), '__ebBootAll must merge partial query strings (e.g. ?utm_source=... or ?source=header_nav) with aa_workspace_state_v1 and dynamically append custom decline options on subpages');
  assert.ok(lbHtml.includes("fk.textContent='window.AbandonAlphaRules = { merchant: \"'+s.target+'\"") && rawGrowthJs.includes("pl.href='/scan/'+encodeURIComponent(tgt)+'?decline='+encodeURIComponent(code)+'&sessions='+sess+'&aov='+aov+(obj?'&objection='+encodeURIComponent(obj):'')"), '__lbRunInlineCheck inspect callback and __ebRecalcGrowthVolume permalink must sync canonical s.target and forward active objection into /scan/* links');
  assert.ok(renderedHome.includes("var rawH = (a.getAttribute('href') || '').split('?')[0], bh = rawH.indexOf('/scan/') === 0 ? rawH :"), '__ebSyncNavLinks must preserve dynamic /scan/:target paths on #eb-growth-permalink-btn and #lb-prev-report-link without overwriting them from a stale data-base-nav-href attribute');
  assert.ok(rawEbApiJs.includes('0.124735') && lpHtml.includes('0.124735') && dirHtml.includes('0.124735') && lbHtml.includes('0.124735') && sampleHtml.includes('0.124735'), 'All subpages (/lp, /directory, /leaderboard, /dossier/sample) and .CSV exports must use the canonical 0.124735 recoverable revenue multiplier matching computeLeakageAudit');
  assert.ok(rawEbApiJs.includes("const csvQs = (qDec ? '&decline=' + encodeURIComponent(qDec) : '')") && rawEbApiJs.includes('Projected Monthly Recovery: +$${totRec.toLocaleString()}/mo (${roiMult}x ROI vs. $29 Pack'), '.CSV and .TXT exports must include full query params in Unlock_Full_Model_URL links and Projected Monthly Recovery in .TXT bundles');
  assert.ok(rawAppJs.includes("params.get('unlock') === 'flash_pass' ? 'success' : ''") && renderedHome.includes('id="toast-succ-dl-txt"') && renderedHome.includes('wsC.storeName'), 'Post-purchase (?checkout=success / ?unlock=flash_pass) and cancel-return (?checkout=cancel) must hydrate aa_workspace_state_v1 first and expose 3-file fulfillment links across / and subpages');
  assert.ok(rawEbApiJs.includes('const buildBuyLinks = (email, extraQs = \'\')') && rawEbApiJs.includes('Est. +$${estRec.toLocaleString()}/mo recovery (${roiMult}x ROI') && rawAppJs.includes('target: storeName, decline: activeRule, sessions: sessVal, aov: aovUsd, objection: selObj'), 'Lead capture (/api/leads) and handleTierCheckout must include custom target, decline, sessions, aov, objection, and calculated ROI multiple in direct_buy_links and Stripe Checkout descriptions');
  assert.ok(renderedHome.includes("if (fDetT) fDetT.open = true;") && renderedHome.includes('href="/buy/playbook_pass\' + tQs + \'&email=\' + encodeURIComponent(email)') && renderedHome.includes('wsL.storeName'), 'window.__ebSendExitSummary and window.__ebCaptureEmailLead must auto-open Fix #1 snippet drawers on subpages and forward custom target, decline, sessions, aov, and objection into lead capture and toast buy links');
  assert.ok(rawEbApiJs.includes("app.get('/api/github-upgrade/abandon-alpha-bandit-sdk.js'") && rawEbApiJs.includes("app.get('/api/github-upgrade/payday-retry-schedule.csv'") && rawEbApiJs.includes('projected_monthly_recovery_usd: projectedMonthlyRecoveryUsd, roi_vs_29_pack_x: roiMult'), 'All 3 deliverable endpoints (stripe-recovery-worker.js, abandon-alpha-bandit-sdk.js, payday-retry-schedule.csv) must embed store-personalized sessions, AOV, projected monthly recovery, ROI multiple, and $29 pack links');
  assert.equal((dirHtml.match(/class="related-card dir-item"/g) || []).length, 60, '/directory must render all 60 pSEO playbooks across all 4 categories');
  assert.ok(!html.includes('insufficient_funds billing settings') && !html.includes('deposit wind</p>'), '/seo/:slug must not cut off summary mid-word or put raw decline code where store name belongs');
  assert.ok(lpHtml.includes('id="lp-capi-status" class="mono-status" style="display:none;"'), '/lp must hide internal CAPI debug log from customer view');
  assert.ok(!sampleHtml.includes('id="eb-subpage-visual-showcase"'), '/sample must not stack duplicate 3-card subpage visual strip below its editorial cards');
  [renderedHome, html, scanHtml, lpHtml, sampleHtml, dirHtml, lbHtml].forEach((pageHtml, idx) => {
    assert.ok(!pageHtml.includes('/banana-saas-war-room.jpg'), `Page index ${idx} must not use dark night-time /banana-saas-war-room.jpg image`);
    const ldBlocks = Array.from(pageHtml.matchAll(/<script[^>]*application\/ld\+json[^>]*>([\s\S]*?)<\/script>/gi));
    ldBlocks.forEach((m) => {
      const parsed = JSON.parse(m[1]);
      const items = Array.isArray(parsed) ? parsed : (parsed['@graph'] || [parsed]);
      items.forEach((node) => {
        if (node && node['@type'] === 'Dataset') {
          assert.ok(node.license, `Dataset in page index ${idx} must have license field for Google Search Console`);
          assert.ok(node.creator && node.creator['@type'] === 'Organization' && node.creator.name, `Dataset in page index ${idx} must have inline creator Organization with @type and name for Google Search Console`);
        }
      });
    });
  });

  console.log('PASS: abandon-alpha unit, SEO & cross-brand isolation verification tests passed.');
}

runTests();
