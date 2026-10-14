const path = require('node:path');
const fs = require('node:fs');
const { chromium } = require('playwright');
const { app } = require('../src/server');

const PORT = 4109;
const BASE_URL = `http://127.0.0.1:${PORT}`;
const SCREENSHOT_DIR = path.resolve(__dirname, '../screenshots');

if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

async function runVerification() {
  let server;
  await new Promise((resolve) => {
    server = app.listen(PORT, '127.0.0.1', resolve);
  });
  console.log(`[Verify] Server listening on ${BASE_URL}`);

  const consoleErrors = [];
  const pageErrors = [];
  const results = {};

  const browser = await chromium.launch({ headless: true });

  try {
    // 1. Desktop (1440x900) Verification
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await context.newPage();

    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });
    page.on('pageerror', (err) => {
      pageErrors.push(err.message);
    });

    const homeResp = await page.goto(BASE_URL, { waitUntil: 'networkidle' });
    results.homeStatus = homeResp.status();

    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, '01-desktop-hero-grader.png'),
      fullPage: false
    });

    // Test Module A: Interactive Leakage Audit Preset + Form Submission
    await page.click('button[data-preset="b2b_saas"]');
    await page.waitForTimeout(250);
    const b2bRecovered = await page.textContent('#out-total-recovered');
    results.b2bRecovered = b2bRecovered;

    // Test Module B1: Thompson Sampling Bandit Simulator
    await page.locator('#bandit-lab').scrollIntoViewIfNeeded();
    await page.click('button[data-obj="C3_APPROVAL"]');
    await page.waitForTimeout(250);
    const selectedOfferCode = await page.textContent('#bandit-offer-code');
    const posteriorRowsCount = await page.locator('#posterior-table-body tr').count();
    results.selectedOfferCodeAfterC3 = selectedOfferCode;
    results.posteriorRowsCount = posteriorRowsCount;

    // Test Module B2: Stripe Webhook Simulator
    await page.locator('#webhook-lab').scrollIntoViewIfNeeded();
    await page.selectOption('#wh-decline-code', 'do_not_honor');
    await page.click('#wh-submit-btn');
    await page.waitForTimeout(300);
    const webhookRecoveryText = await page.textContent('#wh-out-recovery-rate');
    results.webhookRecoveryText = webhookRecoveryText;

    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, '02-desktop-bandit-webhook-labs.png'),
      fullPage: false
    });

    // Test Self-Serve Stripe Checkout Initiation ($149 Growth)
    await page.locator('#pricing').scrollIntoViewIfNeeded();
    await page.click('#checkout-growth-btn');
    await page.waitForTimeout(250);
    const checkoutBadge = await page.textContent('#checkout-session-badge');
    results.checkoutSessionBadge = checkoutBadge;

    // Test Live Exit-Intent Modal
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.click('#trigger-exit-modal-btn');
    await page.waitForTimeout(200);
    await page.click('#exit-intent-modal button.objection-btn >> nth=2');
    await page.waitForTimeout(250);
    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, '03-desktop-exit-intent-modal.png'),
      fullPage: false
    });
    await page.keyboard.press('Escape');

    // 2. Cold Paid-Social Landing Page (/lp) Verification
    const lpResp = await page.goto(`${BASE_URL}/lp?utm_source=meta_ads&utm_campaign=q4_launch`, { waitUntil: 'networkidle' });
    results.lpStatus = lpResp.status();
    await page.click('#lp-submit-btn');
    await page.waitForTimeout(250);
    results.lpCapiStatus = await page.textContent('#lp-capi-status');
    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, '05-meta-lp-desktop.png'),
      fullPage: false
    });

    // 3. Programmatic SEO Directory (/directory) & Slug (/seo/:slug) Verification
    const dirResp = await page.goto(`${BASE_URL}/directory`, { waitUntil: 'networkidle' });
    results.directoryStatus = dirResp.status();
    results.directoryCardCount = await page.locator('.dir-item').count();
    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, '07-pseo-directory.png'),
      fullPage: false
    });

    const seoResp = await page.goto(`${BASE_URL}/seo/stripe-decline-code-insufficient-funds-recovery`, { waitUntil: 'networkidle' });
    results.seoSlugStatus = seoResp.status();
    await page.click('#pseo-calc-btn');
    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, '06-pseo-playbook-page.png'),
      fullPage: false
    });

    await context.close();

    // 4. Mobile Viewport (390x844) Verification
    const mobileContext = await browser.newContext({
      viewport: { width: 390, height: 844 },
      isMobile: true
    });
    const mobilePage = await mobileContext.newPage();
    mobilePage.on('console', (msg) => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    });
    mobilePage.on('pageerror', (err) => {
      pageErrors.push(err.message);
    });

    const mobResp = await mobilePage.goto(BASE_URL, { waitUntil: 'networkidle' });
    results.mobileHomeStatus = mobResp.status();
    await mobilePage.screenshot({
      path: path.join(SCREENSHOT_DIR, '04-mobile-home.png'),
      fullPage: false
    });
    await mobileContext.close();

    // 5. Direct HTTP Route & API Verification
    const sitemapRes = await fetch(`${BASE_URL}/sitemap.xml`);
    const sitemapText = await sitemapRes.text();
    results.sitemapStatus = sitemapRes.status;
    results.sitemapUrlCount = (sitemapText.match(/<loc>/g) || []).length;

    const robotsRes = await fetch(`${BASE_URL}/robots.txt`);
    results.robotsStatus = robotsRes.status;

    const ogRes = await fetch(`${BASE_URL}/api/og?slug=stripe-decline-code-insufficient-funds-recovery`);
    results.ogStatus = ogRes.status;
    results.ogContentType = ogRes.headers.get('content-type');

    const capi1 = await fetch(`${BASE_URL}/api/meta-capi`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ eventName: 'Purchase', eventId: 'evt_dedup_test_999', valueUsd: 149 })
    }).then((r) => r.json());
    const capi2 = await fetch(`${BASE_URL}/api/meta-capi`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ eventName: 'Purchase', eventId: 'evt_dedup_test_999', valueUsd: 149 })
    }).then((r) => r.json());
    results.metaCapiFirstCall = capi1;
    results.metaCapiSecondCallDedup = capi2;

    const checkoutRes = await fetch(`${BASE_URL}/api/checkout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ planTier: 'starter', customerEmail: 'verify@abandonalpha.io' })
    });
    results.checkoutApiStatus = checkoutRes.status;

    results.consoleErrorsCount = consoleErrors.length;
    results.pageErrorsCount = pageErrors.length;
    results.consoleErrors = consoleErrors;
    results.pageErrors = pageErrors;

    console.log('\n=== PLAYWRIGHT E2E VERIFICATION SUMMARY ===');
    console.log(JSON.stringify(results, null, 2));

    if (consoleErrors.length > 0 || pageErrors.length > 0) {
      throw new Error(`Detected browser errors: ${JSON.stringify({ consoleErrors, pageErrors })}`);
    }
  } finally {
    await browser.close();
    server.close();
  }
}

runVerification().catch((err) => {
  console.error('[Verify] FAILED:', err);
  process.exit(1);
});
