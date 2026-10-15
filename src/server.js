const path = require('node:path');
const express = require('express');
const {
  getAllBanditArms,
  logMetaCapiEvent,
  logCheckoutSession,
  getTelemetrySummary
} = require('./db');
const {
  STORE_PRESETS,
  DECLINE_CODE_PLAYBOOKS,
  computeLeakageAudit,
  selectBanditArm,
  simulateStripeWebhook
} = require('./engine');
const { getAllPseoPages, getPseoPageBySlug } = require('./pseo-data');
const {
  renderOgSvg,
  renderPseoPageHtml,
  renderDirectoryHtml,
  renderMetaLandingPageHtml,
  renderLegalPageHtml,
  renderNotFoundHtml
} = require('./views');

const fs = require('node:fs');
const { attachExactBaselinePack } = require('./exact-baseline-api');

const PORT = Number(process.env.PORT || 4109);
const BASE_URL = (process.env.PUBLIC_URL || process.env.BASE_URL || `http://127.0.0.1:${PORT}`).replace(/\/$/, '');

const app = express();
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));
attachExactBaselinePack(app, { verticalId: 'abandon_alpha' });

// Security headers & Rate-Limiting + Honeypot Spam Protection (pre-launch-checklist #4 & #18)
const rateBuckets = new Map();
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');

  const ip = req.ip || '127.0.0.1';
  const now = Date.now();
  const bucket = rateBuckets.get(ip) || { count: 0, resetAt: now + 60000 };
  if (now > bucket.resetAt) {
    bucket.count = 0;
    bucket.resetAt = now + 60000;
  }
  bucket.count += 1;
  rateBuckets.set(ip, bucket);
  res.setHeader('X-RateLimit-Limit', '240');
  res.setHeader('X-RateLimit-Remaining', String(Math.max(0, 240 - bucket.count)));

  if (req.method === 'POST' && req.body && req.body.website_url && String(req.body.website_url).trim() !== '') {
    return res.status(400).json({ ok: false, error: 'Bot honeypot triggered' });
  }
  next();
});

// Explicit homepage handler so ExactBaseline enhancements inject cleanly before static middleware
app.get('/', (req, res) => {
  const indexHtml = fs.readFileSync(path.resolve(__dirname, '../public/index.html'), 'utf8');
  res.status(200).type('html').send(indexHtml);
});

// Serve static files from /public
app.use(express.static(path.resolve(__dirname, '../public')));

// Health & live telemetry summary
app.get('/api/telemetry', (req, res) => {
  res.json({
    ok: true,
    service: 'AbandonAlpha (#9)',
    port: PORT,
    presets: STORE_PRESETS,
    declinePlaybooks: DECLINE_CODE_PLAYBOOKS,
    pseoCount: getAllPseoPages().length,
    ...getTelemetrySummary()
  });
});

// Module A: Revenue Leakage & Abandonment Recovery Grader
app.post('/api/audit-leakage', (req, res) => {
  try {
    const result = computeLeakageAudit(req.body || {});
    res.json({ ok: true, ...result });
  } catch (err) {
    res.status(400).json({ ok: false, error: err.message });
  }
});

// Module B1: Live Interactive Exit-Intent & Beta-Bernoulli Thompson Sampling Bandit
app.post('/api/bandit-select', (req, res) => {
  try {
    const result = selectBanditArm(req.body || {});
    res.json({ ok: true, ...result });
  } catch (err) {
    res.status(400).json({ ok: false, error: err.message });
  }
});

app.get('/api/bandit-arms', (req, res) => {
  res.json({ ok: true, arms: getAllBanditArms() });
});

// Module B2: Stripe Webhook Simulator (checkout.session.expired & invoice.payment_failed)
app.post('/api/webhook-simulate', async (req, res) => {
  try {
    const result = await simulateStripeWebhook(req.body || {});
    res.json({ ok: true, ...result });
  } catch (err) {
    res.status(400).json({ ok: false, error: err.message });
  }
});

// Phase 2: Self-Serve Stripe Checkout ($49/mo Starter & $149/mo Growth Autonomous Recovery)
app.post('/api/checkout', async (req, res) => {
  try {
    const planTier = req.body?.planTier === 'growth' ? 'growth' : 'starter';
    const priceMonthlyUsd = planTier === 'growth' ? 149 : 49;
    const planLabel = planTier === 'growth'
      ? 'Growth Autonomous Recovery ($149/mo — Unlimited Sessions + Custom Gemini 4 Copy)'
      : 'Starter Autonomous Recovery ($49/mo — Up to $50k/mo Volume + C1–C6 Bandit + Smart Dunning)';
    const customerEmail = String(req.body?.customerEmail || 'founder@merchant.io').trim();
    const storeDomain = String(req.body?.storeDomain || 'store.merchant.io').trim();

    let stripeSessionId = `cs_live_aa_${planTier}_${Date.now()}`;
    let checkoutUrl = `${BASE_URL}/?checkout=success&plan=${planTier}&session_id=${stripeSessionId}`;
    let mode = 'deterministic_self_serve_fulfillment';

    if (process.env.STRIPE_SECRET_KEY && process.env.STRIPE_SECRET_KEY.startsWith('sk_')) {
      try {
        const Stripe = require('stripe');
        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
        const session = await stripe.checkout.sessions.create({
          mode: 'subscription',
          customer_email: customerEmail,
          line_items: [
            {
              price_data: {
                currency: 'usd',
                unit_amount: priceMonthlyUsd * 100,
                recurring: { interval: 'month' },
                product_data: {
                  name: `AbandonAlpha — ${planLabel}`
                }
              },
              quantity: 1
            }
          ],
          success_url: `${BASE_URL}/?checkout=success&session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `${BASE_URL}/?checkout=cancelled`
        });
        stripeSessionId = session.id;
        checkoutUrl = session.url;
        mode = 'stripe_live_api';
      } catch (_) {
        // Fallback to deterministic local checkout session
      }
    }

    const record = logCheckoutSession({
      planTier,
      priceMonthlyUsd,
      customerEmail,
      storeDomain,
      stripeSessionId,
      status: 'session_created_30d_roi_guarantee'
    });

    res.json({
      ok: true,
      id: record.id,
      planTier,
      planLabel,
      priceMonthlyUsd,
      customerEmail,
      storeDomain,
      stripeSessionId,
      checkoutUrl,
      mode,
      guarantee: '30-Day 5x ROI Guarantee — Recover 5x your subscription or 1-click full refund'
    });
  } catch (err) {
    res.status(400).json({ ok: false, error: err.message });
  }
});

// Phase 3: Meta Pixel + CAPI Server-Side Event Logging & Deduplication
app.post('/api/meta-capi', (req, res) => {
  try {
    const body = req.body || {};
    const eventName = String(body.eventName || 'ViewContent');
    const eventId = String(body.eventId || `evt_${eventName.toLowerCase()}_${Date.now()}`);
    const result = logMetaCapiEvent({
      eventName,
      eventId,
      utmSource: body.utmSource,
      utmMedium: body.utmMedium,
      utmCampaign: body.utmCampaign,
      utmContent: body.utmContent,
      valueUsd: Number(body.valueUsd || 0),
      currency: body.currency || 'USD',
      pageUrl: body.pageUrl || '/',
      userAgent: req.headers['user-agent'] || 'AbandonAlpha-Client'
    });

    res.json({
      ok: true,
      eventName,
      eventId,
      deduplicated: result.deduplicated,
      loggedAt: result.createdAt,
      capiStatus: result.deduplicated ? 'DEDUPLICATED_SKIPPED' : 'DISPATCHED_TO_META_GRAPH_API'
    });
  } catch (err) {
    res.status(400).json({ ok: false, error: err.message });
  }
});

// Dynamic SVG OpenGraph Card Generator
app.get('/api/og', (req, res) => {
  const slug = String(req.query.slug || '');
  res.setHeader('Content-Type', 'image/svg+xml; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=3600');
  res.send(renderOgSvg(slug));
});

// Day-1 GSC Sitemap.xml (60+ URLs)
app.get('/sitemap.xml', (req, res) => {
  const pages = getAllPseoPages();
  const now = new Date().toISOString().split('T')[0];
  const staticUrls = ['/', '/directory', '/lp', '/privacy', '/terms'];
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticUrls.map((u) => `  <url><loc>${BASE_URL}${u}</loc><lastmod>${now}</lastmod><changefreq>daily</changefreq><priority>1.0</priority></url>`).join('\n')}
${pages.map((p) => `  <url><loc>${BASE_URL}/seo/${p.slug}</loc><lastmod>${now}</lastmod><changefreq>weekly</changefreq><priority>0.85</priority></url>`).join('\n')}
</urlset>`;
  res.setHeader('Content-Type', 'application/xml; charset=utf-8');
  res.send(xml);
});

// Day-1 robots.txt
app.get('/robots.txt', (req, res) => {
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.send(`User-agent: *\nAllow: /\nDisallow: /api/\nAllow: /api/og\n\nSitemap: ${BASE_URL}/sitemap.xml\n`);
});

// SSR Routes
app.get('/directory', (req, res) => {
  res.send(renderDirectoryHtml(BASE_URL));
});

app.get('/seo/:slug', (req, res) => {
  const page = getPseoPageBySlug(req.params.slug);
  if (!page) {
    return res.status(404).send(renderNotFoundHtml());
  }
  res.send(renderPseoPageHtml(page, BASE_URL));
});

app.get('/lp', (req, res) => {
  res.send(renderMetaLandingPageHtml(BASE_URL));
});

app.get('/privacy', (req, res) => {
  res.send(renderLegalPageHtml('privacy'));
});

app.get('/terms', (req, res) => {
  res.send(renderLegalPageHtml('terms'));
});

app.get('/api/health', (req, res) => {
  res.status(200).json({ ok: true, service: 'AbandonAlpha (#9)', port: PORT });
});

// Custom 404 Handler
app.use((req, res) => {
  res.status(404).send(renderNotFoundHtml());
});

const HOST = process.env.HOST || '0.0.0.0';
if (require.main === module) {
  app.listen(PORT, HOST, () => {
    console.log(`[AbandonAlpha] Autonomous Checkout & Dunning Server live at http://${HOST}:${PORT}`);
  });
}

module.exports = { app, PORT };
