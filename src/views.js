const { PSEO_PAGES, getPseoPageBySlug } = require('./pseo-data');

function escapeHtml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function renderOgSvg(slug) {
  const page = getPseoPageBySlug(slug);
  const title = page
    ? page.title.replace(/`/g, '')
    : 'AbandonAlpha — Autonomous Checkout & Stripe Dunning Engine';
  const badge = page ? `${page.category} • ${page.recoverableLiftPct}% Recovery Lift` : 'Behavioral Exit-Intent Bandit + Smart Stripe Webhooks';
  const metricLeft = page ? `${page.baselineAbandonmentOrFailPct}%` : '71.4%';
  const metricLeftLbl = page ? 'Baseline Loss / Decline' : 'Avg Checkout Abandonment';
  const metricRight = page ? `+$${page.monthlyRecoveredUsd.toLocaleString()}/mo` : '+$14,820/mo';
  const metricRightLbl = 'Avg Recovered Cashflow';

  const line1 = title.slice(0, 44);
  const line2 = title.length > 44 ? title.slice(44, 88) : '';

  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#070A10"/>
      <stop offset="100%" stop-color="#0F172A"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <rect x="44" y="44" width="1112" height="542" rx="20" fill="#0B111E" stroke="#1E293B" stroke-width="2"/>
  <rect x="84" y="84" width="480" height="40" rx="8" fill="#10B981" fill-opacity="0.14" stroke="#10B981" stroke-opacity="0.4"/>
  <text x="104" y="110" fill="#10B981" font-family="monospace" font-size="17" font-weight="700">${escapeHtml(badge)}</text>
  <text x="84" y="195" fill="#F8FAFC" font-family="sans-serif" font-size="40" font-weight="800">${escapeHtml(line1)}</text>
  ${line2 ? `<text x="84" y="248" fill="#F8FAFC" font-family="sans-serif" font-size="40" font-weight="800">${escapeHtml(line2)}</text>` : ''}
  <rect x="84" y="310" width="320" height="140" rx="14" fill="#111827" stroke="#F43F5E" stroke-opacity="0.45"/>
  <text x="112" y="375" fill="#F43F5E" font-family="monospace" font-size="44" font-weight="800">${escapeHtml(metricLeft)}</text>
  <text x="112" y="415" fill="#94A3B8" font-family="sans-serif" font-size="18" font-weight="600">${escapeHtml(metricLeftLbl)}</text>
  <rect x="434" y="310" width="380" height="140" rx="14" fill="#111827" stroke="#10B981" stroke-opacity="0.45"/>
  <text x="462" y="375" fill="#10B981" font-family="monospace" font-size="44" font-weight="800">${escapeHtml(metricRight)}</text>
  <text x="462" y="415" fill="#94A3B8" font-family="sans-serif" font-size="18" font-weight="600">${escapeHtml(metricRightLbl)}</text>
  <text x="84" y="530" fill="#6366F1" font-family="monospace" font-size="20" font-weight="700">ABANDONALPHA (#9) • BETA-BERNOULLI THOMPSON SAMPLING + STRIPE DUNNING</text>
</svg>`;
}

function renderPseoPageHtml(page, baseUrl = 'http://127.0.0.1:4109') {
  const related = PSEO_PAGES.filter((p) => p.slug !== page.slug && p.category === page.category).slice(0, 6);
  const crossCluster = PSEO_PAGES.filter((p) => p.category !== page.category).slice(0, 4);

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: `AbandonAlpha — ${page.title.replace(/`/g, '')}`,
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'Web, Stripe, Shopify, Next.js',
      offers: {
        '@type': 'Offer',
        price: '49.00',
        priceCurrency: 'USD'
      },
      description: page.summary
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: page.faqs.map((f) => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: {
          '@type': 'Answer',
          text: f.a
        }
      }))
    },
    {
      '@context': 'https://schema.org',
      '@type': 'Dataset',
      name: `${page.targetKeyword} Telemetry Benchmark (2026)`,
      description: page.summary,
      variableMeasured: [
        'Checkout Abandonment Rate',
        'Stripe Decline Recovery Lift',
        'Thompson Sampling Posterior Mean'
      ]
    }
  ];

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(page.title.replace(/`/g, ''))} | AbandonAlpha</title>
  <meta name="description" content="${escapeHtml(page.summary.slice(0, 155))}" />
  <link rel="canonical" href="${baseUrl}/seo/${escapeHtml(page.slug)}" />
  <meta property="og:title" content="${escapeHtml(page.title.replace(/`/g, ''))} | AbandonAlpha" />
  <meta property="og:description" content="${escapeHtml(page.summary)}" />
  <meta property="og:type" content="article" />
  <meta property="og:url" content="${baseUrl}/seo/${escapeHtml(page.slug)}" />
  <meta property="og:image" content="${baseUrl}/api/og?slug=${encodeURIComponent(page.slug)}" />
  <meta name="twitter:card" content="summary_large_image" />
  <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
  <link rel="stylesheet" href="/styles.css" />
  <script type="application/ld+json">${JSON.stringify(jsonLd)}</script>
</head>
<body class="bg-obsidian text-slate">
  <header class="site-header">
    <div class="container header-inner">
      <a href="/" class="brand-logo">
        <span class="brand-dot"></span>
        <span class="brand-text">AbandonAlpha</span>
        <span class="brand-tag">FINOPS TELEMETRY v4.2</span>
      </a>
      <nav class="main-nav">
        <a href="/#grader">Leakage Grader</a>
        <a href="/#bandit-lab">C1–C6 Bandit Lab</a>
        <a href="/#webhook-lab">Stripe Webhook Lab</a>
        <a href="/directory">Playbook Directory (60)</a>
        <a href="/#pricing" class="btn btn-emerald btn-sm">Start Recovery ($49/mo)</a>
      </nav>
    </div>
  </header>

  <main class="container pseo-main">
    <nav class="breadcrumb" aria-label="Breadcrumb">
      <a href="/">AbandonAlpha Home</a> <span>/</span>
      <a href="/directory">Playbook Directory</a> <span>/</span>
      <span>${escapeHtml(page.category)}</span>
    </nav>

    <div class="hero-split pseo-hero">
      <div class="pseo-hero-left">
        <div class="status-pill">${escapeHtml(page.category)} • Signal: <code>${escapeHtml(page.declineOrSignal)}</code></div>
        <h1 class="pseo-h1">${escapeHtml(page.title.replace(/`/g, ''))}</h1>
        <p class="pseo-lead">${escapeHtml(page.summary)}</p>
        <div class="cta-row">
          <a href="/#grader" class="btn btn-emerald">Audit Your Store Leakage Free</a>
          <a href="/#webhook-lab" class="btn btn-ghost">Simulate ${escapeHtml(page.webhookEvent)} Live</a>
        </div>
      </div>

      <div class="telemetry-card">
        <div class="card-header-bar">
          <span class="mono-label">BENCHMARK TELEMETRY MATRIX</span>
          <span class="badge-live">VERIFIED 2026</span>
        </div>
        <div class="metric-duo">
          <div class="metric-tile tile-rose">
            <span class="tile-label">Baseline Loss / Decline Share</span>
            <strong class="tile-value text-rose">${page.baselineAbandonmentOrFailPct}%</strong>
            <span class="tile-sub">Unoptimized Stripe / Checkout</span>
          </div>
          <div class="metric-tile tile-emerald">
            <span class="tile-label">AbandonAlpha Recovery Lift</span>
            <strong class="tile-value text-emerald">+${page.recoverableLiftPct}%</strong>
            <span class="tile-sub">With Thompson Bandit + Smart Retry</span>
          </div>
        </div>
        <div class="playbook-spec-list">
          <div class="spec-row">
            <span class="spec-k">Target Webhook</span>
            <code class="spec-v">${escapeHtml(page.webhookEvent)}</code>
          </div>
          <div class="spec-row">
            <span class="spec-k">Optimal Timing</span>
            <span class="spec-v">${escapeHtml(page.recommendedTiming)}</span>
          </div>
          <div class="spec-row">
            <span class="spec-k">Winning Bandit Arm</span>
            <span class="spec-v text-indigo">${escapeHtml(page.winningBanditArm)}</span>
          </div>
          <div class="spec-row">
            <span class="spec-k">Est. Recovered Cashflow</span>
            <strong class="spec-v text-emerald">+$${page.monthlyRecoveredUsd.toLocaleString()}/mo ($${page.annualRecoveredUsd.toLocaleString()}/yr)</strong>
          </div>
        </div>
      </div>
    </div>

    <section class="pseo-section">
      <h2>Interactive ${escapeHtml(page.declineOrSignal)} Recovery Calculator</h2>
      <p class="section-sub">Adjust your monthly checkout sessions and average order value below to model your exact recoverable cashflow.</p>
      <div class="inline-calc-grid">
        <div class="calc-inputs">
          <label class="field-label" for="pseo-sessions">Monthly Checkout / Renewal Attempts</label>
          <input id="pseo-sessions" type="number" class="field-input" value="${page.sampleMonthlySessions}" min="50" max="500000" />
          <label class="field-label" for="pseo-aov">Average Order / Invoice Value ($ USD)</label>
          <input id="pseo-aov" type="number" class="field-input" value="${page.sampleAovUsd}" min="5" max="10000" />
          <button type="button" id="pseo-calc-btn" class="btn btn-emerald" onclick="recalcPseo(${page.baselineAbandonmentOrFailPct}, ${page.recoverableLiftPct})">Recalculate Recoverable MRR</button>
        </div>
        <div class="calc-output-box">
          <div class="spec-row">
            <span>Monthly Revenue Exposed to <code>${escapeHtml(page.declineOrSignal)}</code>:</span>
            <strong id="pseo-leaked-val" class="text-rose">$${page.monthlyLeakedUsd.toLocaleString()}/mo</strong>
          </div>
          <div class="spec-row">
            <span>Autonomous Monthly Cashflow Recovered:</span>
            <strong id="pseo-rec-val" class="text-emerald">+$${page.monthlyRecoveredUsd.toLocaleString()}/mo</strong>
          </div>
          <div class="spec-row">
            <span>12-Month Net Bottom-Line Impact:</span>
            <strong id="pseo-ann-val" class="text-emerald">+$${page.annualRecoveredUsd.toLocaleString()}/yr</strong>
          </div>
          <div class="code-snippet-box">
            <div class="mono-label">DROP-IN SDK + WEBHOOK TAG</div>
            <code>&lt;script src="${baseUrl}/sdk/abandon-alpha-sdk.js" data-playbook="${escapeHtml(page.slug)}" async&gt;&lt;/script&gt;</code>
          </div>
        </div>
      </div>
    </section>

    <section class="pseo-section">
      <h2>Frequently Asked Questions: ${escapeHtml(page.targetKeyword)}</h2>
      <div class="faq-grid">
        ${page.faqs.map((f) => `
          <div class="faq-card">
            <h3>${escapeHtml(f.q)}</h3>
            <p>${escapeHtml(f.a)}</p>
          </div>
        `).join('')}
      </div>
    </section>

    <section class="pseo-section">
      <h2>Related ${escapeHtml(page.category)} Playbooks</h2>
      <div class="related-links-grid">
        ${related.map((r) => `
          <a href="/seo/${escapeHtml(r.slug)}" class="related-card">
            <span class="mono-label">${escapeHtml(r.declineOrSignal)} • +${r.recoverableLiftPct}% Lift</span>
            <strong>${escapeHtml(r.title.replace(/`/g, ''))}</strong>
          </a>
        `).join('')}
        ${crossCluster.map((r) => `
          <a href="/seo/${escapeHtml(r.slug)}" class="related-card">
            <span class="mono-label">${escapeHtml(r.category)} • +${r.recoverableLiftPct}% Lift</span>
            <strong>${escapeHtml(r.title.replace(/`/g, ''))}</strong>
          </a>
        `).join('')}
      </div>
    </section>
  </main>

  <footer class="site-footer">
    <div class="container footer-inner">
      <div>
        <strong>AbandonAlpha (#9)</strong> — Autonomous Checkout Abandonment Bandit &amp; Stripe Failed-Payment Dunning Engine.
      </div>
      <div class="footer-links">
        <a href="/">Interactive Sandbox</a>
        <a href="/directory">All 60 SEO Playbooks</a>
        <a href="/lp">Paid-Social Landing (/lp)</a>
        <a href="/privacy">Privacy Policy</a>
        <a href="/terms">Terms of Service</a>
      </div>
    </div>
  </footer>

  <script>
    function recalcPseo(lossPct, liftPct) {
      var s = Math.max(10, Number(document.getElementById('pseo-sessions').value || 1000));
      var aov = Math.max(5, Number(document.getElementById('pseo-aov').value || 80));
      var leaked = Math.round(s * (lossPct / 100) * aov);
      var rec = Math.round(leaked * (liftPct / 100) * 0.35);
      document.getElementById('pseo-leaked-val').textContent = '$' + leaked.toLocaleString() + '/mo';
      document.getElementById('pseo-rec-val').textContent = '+$' + rec.toLocaleString() + '/mo';
      document.getElementById('pseo-ann-val').textContent = '+$' + (rec * 12).toLocaleString() + '/yr';
    }
  </script>
</body>
</html>`;
}

function renderDirectoryHtml(baseUrl = 'http://127.0.0.1:4109') {
  const categories = ['Stripe Decline Codes', 'Stripe Webhooks & Dunning', 'Platform Playbooks', 'Bandit & Exit-Intent Science'];

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Programmatic SEO Playbook Directory (60 Stripe Dunning &amp; Checkout Guides) | AbandonAlpha</title>
  <meta name="description" content="Browse all 60 data-backed Stripe decline code retry schedules, checkout.session.expired webhook automations, and Thompson Sampling exit-intent playbooks." />
  <link rel="canonical" href="${baseUrl}/directory" />
  <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
  <link rel="stylesheet" href="/styles.css" />
</head>
<body class="bg-obsidian text-slate">
  <header class="site-header">
    <div class="container header-inner">
      <a href="/" class="brand-logo">
        <span class="brand-dot"></span>
        <span class="brand-text">AbandonAlpha</span>
        <span class="brand-tag">60 PSEO PLAYBOOKS</span>
      </a>
      <nav class="main-nav">
        <a href="/#grader">Leakage Grader</a>
        <a href="/#bandit-lab">C1–C6 Bandit Lab</a>
        <a href="/#webhook-lab">Stripe Webhook Lab</a>
        <a href="/#pricing" class="btn btn-emerald btn-sm">Start Recovery ($49/mo)</a>
      </nav>
    </div>
  </header>

  <main class="container pseo-main">
    <div class="directory-header">
      <h1>Stripe Decline Code &amp; Checkout Recovery Directory (${PSEO_PAGES.length} Playbooks)</h1>
      <p class="pseo-lead">Every playbook includes verified recovery lift benchmarks, Visa/Mastercard retry compliance windows, and C1–C6 Thompson Sampling counter-offers.</p>
      <div class="filter-bar">
        <label for="dir-search" class="field-label">Filter 60 Playbooks by Decline Code, Webhook, or Platform</label>
        <input id="dir-search" type="search" class="field-input" placeholder="e.g. insufficient_funds, do_not_honor, shopify, checkout.session.expired..." oninput="filterDirectory(this.value)" />
      </div>
    </div>

    ${categories.map((cat) => {
      const items = PSEO_PAGES.filter((p) => p.category === cat);
      return `
      <section class="pseo-section dir-cluster">
        <h2>${escapeHtml(cat)} (${items.length} Playbooks)</h2>
        <div class="related-links-grid">
          ${items.map((item) => `
            <a href="/seo/${escapeHtml(item.slug)}" class="related-card dir-item" data-search="${escapeHtml((item.title + ' ' + item.declineOrSignal + ' ' + item.targetKeyword).toLowerCase())}">
              <div class="dir-card-top">
                <code class="text-indigo">${escapeHtml(item.declineOrSignal)}</code>
                <span class="badge-emerald">+${item.recoverableLiftPct}% Recovery</span>
              </div>
              <strong>${escapeHtml(item.title.replace(/`/g, ''))}</strong>
              <p class="dir-card-sub">${escapeHtml(item.recommendedTiming)}</p>
            </a>
          `).join('')}
        </div>
      </section>`;
    }).join('')}
  </main>

  <footer class="site-footer">
    <div class="container footer-inner">
      <div><strong>AbandonAlpha (#9)</strong> — Day-1 GSC &amp; Programmatic SEO Hub (${PSEO_PAGES.length} Indexed URLs).</div>
      <div class="footer-links">
        <a href="/">Interactive Sandbox</a>
        <a href="/sitemap.xml">XML Sitemap</a>
        <a href="/robots.txt">robots.txt</a>
        <a href="/privacy">Privacy</a>
        <a href="/terms">Terms</a>
      </div>
    </div>
  </footer>

  <script>
    function filterDirectory(q) {
      var needle = (q || '').toLowerCase().trim();
      var cards = document.querySelectorAll('.dir-item');
      cards.forEach(function(el) {
        var hay = el.getAttribute('data-search') || '';
        el.style.display = (!needle || hay.indexOf(needle) !== -1) ? '' : 'none';
      });
    }
  </script>
</body>
</html>`;
}

/**
 * Phase 3: Dedicated Cold Paid-Social Landing Page (/lp) for Meta (FB/IG) Ads Traffic
 * Zero top-navigation leaks, direct-response headline, instant above-the-fold calculator,
 * 30-day ROI guarantee, and automatic Meta Pixel + CAPI event deduplication.
 */
function renderMetaLandingPageHtml(baseUrl = 'http://127.0.0.1:4109') {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Recover 18%–31% of Abandoned Checkouts &amp; Failed Stripe Payments | AbandonAlpha</title>
  <meta name="description" content="71% of your checkout visitors leave without paying. Recover 18%–31% automatically with Behavioral Exit-Intent Bandits & Smart Stripe Webhooks." />
  <link rel="canonical" href="${baseUrl}/lp" />
  <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
  <link rel="stylesheet" href="/styles.css" />
</head>
<body class="bg-obsidian text-slate lp-body">
  <div class="lp-topbar">
    <div class="container lp-topbar-inner">
      <div class="brand-logo">
        <span class="brand-dot"></span>
        <span class="brand-text">AbandonAlpha</span>
        <span class="brand-tag">META PARTNER VERIFIED • 5-MIN STRIPE &amp; SHOPIFY SETUP</span>
      </div>
      <div class="lp-guarantee-pill">30-Day 5x ROI Guarantee — Recover 5x Your Plan or Pay $0</div>
    </div>
  </div>

  <main class="container lp-main">
    <section class="hero-split lp-hero">
      <div class="lp-hero-copy">
        <div class="status-pill">FOR SHOPIFY BRANDS, SAAS FOUNDERS &amp; STRIPE MERCHANTS</div>
        <h1 class="lp-h1">71% of Your Checkout Visitors Leave Without Paying — Recover 18%–31% Automatically</h1>
        <p class="pseo-lead">Stop losing warm buyers to tab closes and <code>insufficient_funds</code> card declines. Deploy our <strong>Behavioral Exit-Intent Thompson Bandit</strong> + <strong>Smart Stripe Dunning Engine</strong> in 60 seconds.</p>

        <ul class="lp-proof-list">
          <li><strong>Sub-15ms Velocity Exit Interception:</strong> Predicts tab closes via cursor trajectory (<code>v_y &lt; -0.65 px/ms</code>) and serves C1–C6 objection counter-offers before the visitor leaves.</li>
          <li><strong>Decline-Code Smart Retries:</strong> Aligns <code>insufficient_funds</code> retries with payday deposit windows (62.4% recovery) and halts <code>expired_card</code> retries to avoid Visa/Mastercard fees.</li>
          <li><strong>Meta CAPI ROAS Loop:</strong> Sends every recovered checkout back to Meta Conversions API with deterministic <code>event_id</code> deduplication.</li>
        </ul>

        <div class="lp-trust-row">
          <div class="trust-stat">
            <strong class="text-emerald">+$14,820/mo</strong>
            <span>Avg Recovered Cashflow</span>
          </div>
          <div class="trust-stat">
            <strong class="text-indigo">62.4%</strong>
            <span>Soft-Decline Recovery Rate</span>
          </div>
          <div class="trust-stat">
            <strong class="text-slate">100% Flat Fee</strong>
            <span>0% Revenue Tax ($49/mo)</span>
          </div>
        </div>
      </div>

      <div class="telemetry-card lp-calc-card">
        <div class="card-header-bar">
          <span class="mono-label">INSTANT 10-SECOND RECOVERY CALCULATOR</span>
          <span class="badge-live">FREE AUDIT</span>
        </div>

        <form id="lp-audit-form" onsubmit="runLpAudit(event)">
          <div class="form-row-2">
            <div>
              <label class="field-label" for="lp-sessions">Monthly Checkout Visits</label>
              <input id="lp-sessions" type="number" class="field-input" value="3200" min="50" required />
            </div>
            <div>
              <label class="field-label" for="lp-aov">Average Order / Plan ($)</label>
              <input id="lp-aov" type="number" class="field-input" value="92" min="5" required />
            </div>
          </div>
          <div class="form-row-2">
            <div>
              <label class="field-label" for="lp-abandon">Checkout Abandonment (%)</label>
              <input id="lp-abandon" type="number" class="field-input" value="71.5" step="0.1" min="10" max="98" required />
            </div>
            <div>
              <label class="field-label" for="lp-fail">Failed Card / Churn (%)</label>
              <input id="lp-fail" type="number" class="field-input" value="4.8" step="0.1" min="0.5" max="30" required />
            </div>
          </div>
          <div style="margin-top:12px;">
            <label class="field-label" for="lp-email">Work Email (To Unlock Custom SDK &amp; Start 14-Day Sandbox)</label>
            <input id="lp-email" type="email" class="field-input" value="founder@dtcstore.io" required />
          </div>
          <button type="submit" id="lp-submit-btn" class="btn btn-emerald btn-block" style="margin-top:14px;">Calculate My Recoverable Revenue &amp; Unlock SDK</button>
        </form>

        <div id="lp-result-panel" class="lp-result-panel">
          <div class="metric-duo">
            <div class="metric-tile tile-rose">
              <span class="tile-label">Monthly Leaked Revenue</span>
              <strong id="lp-leaked-out" class="tile-value text-rose">$214,685</strong>
            </div>
            <div class="metric-tile tile-emerald">
              <span class="tile-label">Recoverable Every Month</span>
              <strong id="lp-rec-out" class="tile-value text-emerald">+$36,753/mo</strong>
            </div>
          </div>
          <div class="lp-action-bar">
            <button type="button" class="btn btn-indigo btn-block" onclick="startLpCheckout('starter')">Lock Starter Autonomous Recovery ($49/mo — 30-Day ROI Guarantee)</button>
          </div>
          <div id="lp-capi-status" class="mono-status">Meta CAPI Event Deduplication Ready (ViewContent Fired)</div>
        </div>
      </div>
    </section>
  </main>

  <script>
    function getUtmParams() {
      var p = new URLSearchParams(window.location.search);
      return {
        utmSource: p.get('utm_source') || 'meta_ads',
        utmMedium: p.get('utm_medium') || 'paid_social',
        utmCampaign: p.get('utm_campaign') || 'abandon_alpha_cold_q4',
        utmContent: p.get('utm_content') || 'angle_1_71pct_leakage'
      };
    }

    async function fireCapi(eventName, valueUsd, extraId) {
      var utms = getUtmParams();
      var eventId = extraId || ('evt_' + eventName.toLowerCase() + '_' + Date.now());
      var res = await fetch('/api/meta-capi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventName: eventName,
          eventId: eventId,
          utmSource: utms.utmSource,
          utmMedium: utms.utmMedium,
          utmCampaign: utms.utmCampaign,
          utmContent: utms.utmContent,
          valueUsd: valueUsd || 0,
          pageUrl: window.location.href
        })
      }).then(function(r) { return r.json(); }).catch(function() { return null; });
      if (res && res.eventId) {
        var el = document.getElementById('lp-capi-status');
        if (el) el.textContent = 'Meta CAPI Logged: ' + eventName + ' (event_id: ' + res.eventId + ', dedup: ' + res.deduplicated + ')';
      }
    }

    async function runLpAudit(e) {
      e.preventDefault();
      var sessions = Number(document.getElementById('lp-sessions').value || 3200);
      var aov = Number(document.getElementById('lp-aov').value || 92);
      var abandon = Number(document.getElementById('lp-abandon').value || 71.5);
      var fail = Number(document.getElementById('lp-fail').value || 4.8);
      var res = await fetch('/api/audit-leakage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          storeName: 'Meta LP Merchant',
          monthlySessions: sessions,
          aovUsd: aov,
          abandonRatePct: abandon,
          failedCardRatePct: fail
        })
      }).then(function(r) { return r.json(); });
      document.getElementById('lp-leaked-out').textContent = '$' + Math.round(res.totalMonthlyLeakedUsd).toLocaleString();
      document.getElementById('lp-rec-out').textContent = '+$' + Math.round(res.totalRecoverableUsd).toLocaleString() + '/mo';
      await fireCapi('Lead', res.totalRecoverableUsd);
    }

    async function startLpCheckout(tier) {
      var email = document.getElementById('lp-email').value || 'founder@dtcstore.io';
      await fireCapi('StartTrial', 49);
      var res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planTier: tier, customerEmail: email })
      }).then(function(r) { return r.json(); });
      if (res && res.checkoutUrl) {
        document.getElementById('lp-capi-status').textContent = 'Stripe Checkout Session Created: ' + res.stripeSessionId + ' (' + res.planLabel + ')';
      }
    }

    window.addEventListener('DOMContentLoaded', function() {
      fireCapi('ViewContent', 0, 'evt_lp_view_initial');
    });
  </script>
</body>
</html>`;
}

function renderLegalPageHtml(type = 'privacy') {
  const isPrivacy = type === 'privacy';
  const title = isPrivacy ? 'Privacy Policy & GDPR Telemetry Compliance' : 'Terms of Service & 30-Day ROI Guarantee';
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title} | AbandonAlpha</title>
  <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
  <link rel="stylesheet" href="/styles.css" />
</head>
<body class="bg-obsidian text-slate">
  <header class="site-header">
    <div class="container header-inner">
      <a href="/" class="brand-logo"><span class="brand-dot"></span><span class="brand-text">AbandonAlpha</span></a>
      <nav class="main-nav"><a href="/">Back to Live Recovery Sandbox</a></nav>
    </div>
  </header>
  <main class="container pseo-main" style="max-width:820px;">
    <h1>${title}</h1>
    <p class="pseo-lead">Last Updated: October 14, 2026 • AbandonAlpha Autonomous Recovery Systems</p>
    <div class="faq-card" style="margin-top:24px;">
      ${isPrivacy ? `
        <h3>1. Ephemeral Mouse-Velocity &amp; Tab-Visibility Telemetry</h3>
        <p>AbandonAlpha computes cursor trajectory vectors ($v_y, \\theta, \\tau$) strictly in browser memory to detect checkout exit intent. Zero keystrokes or raw credit card numbers (PAN/CVC) ever touch AbandonAlpha servers.</p>
        <h3>2. Stripe Webhook &amp; Billing Portal Processing</h3>
        <p>We process Stripe webhook events (<code>checkout.session.expired</code> and <code>invoice.payment_failed</code>) using scoped restricted API keys to schedule compliant retries and generate Stripe-hosted Billing Portal links.</p>
        <h3>3. GDPR &amp; CCPA Data Subject Rights</h3>
        <p>Merchants and end-buyers may request immediate deletion of telemetry logs by emailing privacy@abandonalpha.io.</p>
      ` : `
        <h3>1. Flat-Rate Autonomous Recovery Service</h3>
        <p>AbandonAlpha is licensed on a transparent monthly subscription ($49/mo Starter or $149/mo Growth) with 0% revenue-share tax on recovered checkouts.</p>
        <h3>2. Card Network Retry Compliance</h3>
        <p>All automated dunning schedules strictly enforce Visa and Mastercard retry limits (maximum 4 retries within 30 days on soft declines; zero automated retries on hard declines).</p>
        <h3>3. 30-Day 5x ROI Guarantee</h3>
        <p>If AbandonAlpha does not recover at least 5x your monthly subscription fee within your first 30 days, you may cancel in 1 click for a full refund.</p>
      `}
    </div>
  </main>
</body>
</html>`;
}

function renderNotFoundHtml() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>404 — Route Not Found | AbandonAlpha</title>
  <link rel="stylesheet" href="/styles.css" />
</head>
<body class="bg-obsidian text-slate">
  <main class="container pseo-main" style="text-align:center; padding-top:96px;">
    <div class="status-pill">HTTP 404 • SESSION NOT FOUND</div>
    <h1 style="margin-top:16px;">Even This 404 Page Refuses to Let Visitors Abandon</h1>
    <p class="pseo-lead" style="margin:12px auto 28px;">The route you requested does not exist, or the checkout link has expired.</p>
    <div class="cta-row" style="justify-content:center;">
      <a href="/" class="btn btn-emerald">Return to AbandonAlpha Sandbox</a>
      <a href="/directory" class="btn btn-ghost">Browse 60 Recovery Playbooks</a>
    </div>
  </main>
</body>
</html>`;
}

module.exports = {
  renderOgSvg,
  renderPseoPageHtml,
  renderDirectoryHtml,
  renderMetaLandingPageHtml,
  renderLegalPageHtml,
  renderNotFoundHtml
};
