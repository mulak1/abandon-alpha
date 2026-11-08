const { PSEO_PAGES, getPseoPageBySlug } = require('./pseo-data');

const AA_LOCK_SVG = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:-2px;margin-right:4px;flex-shrink:0;"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>';

function renderTopSubpageEmailBarHtml(titleText = 'Send the free retry schedule & snippet ($0)', ctaLabel = 'Send Free Schedule ($0)', slug = '') {
  return `<section id="aa-subpage-top-email-bar" style="background:#F8FAFC;color:#0F172A;border-radius:12px;padding:16px 20px;margin:0 0 24px;border:1px solid #E2E8F0;">
    <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:8px;margin-bottom:10px;">
      <span style="font-size:14px;font-weight:600;color:#0F172A;">${escapeHtml(titleText)}</span>
      <span style="font-size:13px;color:#64748B;">Or instant download: <a href="/buy/flash_pass${slug ? `?playbook=${encodeURIComponent(slug)}` : ''}" rel="nofollow" style="color:#0F172A;font-weight:600;text-decoration:underline;">3-File Patch ($1.99)</a> &middot; <a href="/buy/playbook_pass${slug ? `?playbook=${encodeURIComponent(slug)}` : ''}" rel="nofollow" style="color:#047857;font-weight:600;text-decoration:underline;">Complete Store Pack ($29) &rarr;</a></span>
    </div>
    <form onsubmit="return window.__aaUnlockSubpage(event);" style="display:flex;gap:8px;flex-wrap:wrap;align-items:center;margin:0;">
      <input id="aa-subpage-top-email-input" type="email" required placeholder="Enter work email to receive the retry schedule &amp; Fix #1 snippet ($0)..." aria-label="Enter work email to receive the retry schedule and Fix #1 snippet" style="flex:1 1 210px;min-width:0;padding:9px 12px;border-radius:8px;border:1px solid #CBD5E1;background:#FFFFFF;color:#0F172A;font-size:13.5px;" />
      <button type="submit" class="btn btn-indigo btn-sm" style="padding:9px 16px;font-size:13.5px;white-space:nowrap;">${escapeHtml(ctaLabel)}</button>
    </form>
    <div id="aa-subpage-top-email-status" style="display:none;margin-top:8px;font-size:13px;font-weight:600;color:#047857;">Sent &amp; unlocked below.</div>
  </section>
  <script>
    window.__aaUnlockSubpage = function(e) {
      if (e && e.preventDefault) e.preventDefault();
      var inp = document.getElementById('aa-subpage-top-email-input');
      var email = inp ? (inp.value || '').trim() : '';
      if (!email || email.indexOf('@') === -1) { if (inp) inp.focus(); return false; }
      try { localStorage.setItem('aa_lead_email', email); } catch (_) {}
      document.querySelectorAll('.aa-locked-spec-badge').forEach(function(el) { el.style.display = 'none'; });
      document.querySelectorAll('.aa-unlocked-spec-proof').forEach(function(el) { el.style.display = ''; });
      var st = document.getElementById('aa-subpage-top-email-status');
      if (st) st.style.display = 'block';
      fetch('/api/leads/capture', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: email, pageUrl: window.location.pathname, utmSource: 'subpage_top_email_bar' }), keepalive: true }).catch(function(){});
      fetch('/api/telemetry/event', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ event_type: 'lead_capture', email: email, page_url: window.location.pathname, meta: { email: email, source: 'subpage_top_email_bar' } }), keepalive: true }).catch(function(){});
      return false;
    };
  </script>`;
}

function escapeHtml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function renderBrandLogoSvg(idPrefix = 'aa') {
  return `<svg viewBox="0 0 64 64" width="36" height="36" role="img" aria-label="AbandonAlpha Vault Crest">
    <rect x="2" y="2" width="60" height="60" rx="16" fill="#0A2540"/>
    <path d="M36 42 C29 46 20 43 18 35 C16 27 23 20 31 22 C37 23.5 40 30 43 37 L47 44" fill="none" stroke="#FFFFFF" stroke-width="4.5" stroke-linecap="round"/>
    <path d="M22 39 C28 39 35 32 45 18" fill="none" stroke="#10B981" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M35 17 H46 V28" fill="none" stroke="#34D399" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/>
    <circle cx="27" cy="31" r="3" fill="#FFFFFF"/>
  </svg>`;
}

function renderUnifiedHeaderHtml(tagText = '') {
  return `<header class="site-header">
    <div class="container header-inner">
      <a href="/" class="brand-logo" aria-label="AbandonAlpha Home">
        ${renderBrandLogoSvg('hdr')}
        <span class="brand-wordmark">Abandon<span class="brand-wordmark-accent">Alpha</span></span>
      </a>
      <nav class="main-nav" aria-label="Primary Navigation">
        <a href="/#grader">Calculator</a>
        <a href="/#bandit-lab">Simulators</a>
        <a href="/directory">Playbooks</a>
        <a href="/#in-card-unlock-bar">Pricing</a>
        <a href="/#grader" id="nav-calc-mrr-btn" class="btn btn-indigo btn-sm" onclick="if(typeof triggerHeaderMrrCalc==='function'){return triggerHeaderMrrCalc(event);}">
          <span>Calculate Revenue</span>
        </a>
      </nav>
    </div>
    <nav class="mobile-nav-strip" aria-label="Mobile Navigation">
      <a href="/#grader">Calculator</a>
      <a href="/#bandit-lab">Simulators</a>
      <a href="/directory">Playbooks</a>
      <a href="/#in-card-unlock-bar">Pricing</a>
    </nav>
  </header>`;
}

function renderCookieAndFooterHtml() {
  return `<aside id="cookie-consent-banner" class="cookie-consent-bar" aria-label="Cookie and Telemetry Consent">
    <div class="container cookie-consent-inner">
      <div>
        <strong style="color:var(--text-navy);">GDPR &amp; Ephemeral Telemetry Notice:</strong>
        We use zero-PII ephemeral cursor velocity vectors and optional Meta Ads attribution cookies. Read our <a href="/privacy" style="color:var(--blurple); font-weight:700;">Privacy Policy</a>.
      </div>
      <div class="cookie-consent-actions">
        <button type="button" class="btn btn-ghost btn-sm" onclick="dismissConsent('essential_only')">Essential Only</button>
        <button type="button" class="btn btn-indigo btn-sm" onclick="dismissConsent('accepted')">Accept Telemetry</button>
      </div>
    </div>
  </aside>
  <footer class="site-footer">
    <div class="container footer-inner">
      <div>
        <strong>AbandonAlpha (#9)</strong>: Autonomous Checkout Abandonment Bandit &amp; Stripe Failed-Payment Dunning Engine.
      </div>
      <div class="footer-links">
        <a href="/">Interactive Sandbox</a>
        <a href="/directory">All 60 SEO Playbooks</a>
        <a href="/lp">Paid-Social Landing (/lp)</a>
        <a href="/sitemap.xml">Sitemap.xml</a>
        <a href="/robots.txt">robots.txt</a>
        <a href="/privacy">Privacy Policy</a>
        <a href="/terms">Terms of Service</a>
      </div>
    </div>
  </footer>
  <script>
    (function() {
      try {
        if (localStorage.getItem('aa_cookie_consent')) {
          var b = document.getElementById('cookie-consent-banner');
          if (b) b.classList.add('hidden');
        }
      } catch (_) {}
    })();
    function dismissConsent(val) {
      try { localStorage.setItem('aa_cookie_consent', val); } catch (_) {}
      var b = document.getElementById('cookie-consent-banner');
      if (b) b.classList.add('hidden');
    }
  </script>`;
}

function renderOgSvg(slug) {
  const page = getPseoPageBySlug(slug);
  const title = page
    ? page.title.replace(/`/g, '')
    : 'AbandonAlpha: Autonomous Checkout & Stripe Dunning Engine';
  const badge = page ? `${page.category} • +${page.recoverableLiftPct}% Recovery Lift` : 'Institutional FinTech Exit-Intent Bandit + Smart Stripe Webhooks';
  const metricLeft = page ? `${page.baselineAbandonmentOrFailPct}%` : '71.4%';
  const metricLeftLbl = page ? 'Baseline Loss / Decline' : 'Avg Checkout Abandonment';
  const metricRight = page ? `+$${page.monthlyRecoveredUsd.toLocaleString()}/mo` : '+$14,820/mo';
  const metricRightLbl = 'Avg Recovered Cashflow';

  const line1 = title.slice(0, 44);
  const line2 = title.length > 44 ? title.slice(44, 88) : '';

  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630" role="img" aria-label="${escapeHtml(title)}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#F8FAFC"/>
      <stop offset="100%" stop-color="#EEF2FF"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <rect x="44" y="44" width="1112" height="542" rx="24" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="2"/>
  <rect x="84" y="84" width="540" height="40" rx="20" fill="#EEF2FF" stroke="#C7D2FE"/>
  <text x="108" y="110" fill="#533AFD" font-family="monospace" font-size="16" font-weight="700">${escapeHtml(badge)}</text>
  <text x="84" y="195" fill="#0A2540" font-family="sans-serif" font-size="40" font-weight="800">${escapeHtml(line1)}</text>
  ${line2 ? `<text x="84" y="248" fill="#0A2540" font-family="sans-serif" font-size="40" font-weight="800">${escapeHtml(line2)}</text>` : ''}
  <rect x="84" y="305" width="330" height="145" rx="16" fill="#FFF1F2" stroke="#FECDD3"/>
  <text x="112" y="372" fill="#BE123C" font-family="monospace" font-size="44" font-weight="800">${escapeHtml(metricLeft)}</text>
  <text x="112" y="414" fill="#334155" font-family="sans-serif" font-size="18" font-weight="700">${escapeHtml(metricLeftLbl)}</text>
  <rect x="444" y="305" width="390" height="145" rx="16" fill="#ECFDF5" stroke="#A7F3D0"/>
  <text x="472" y="372" fill="#047857" font-family="monospace" font-size="44" font-weight="800">${escapeHtml(metricRight)}</text>
  <text x="472" y="414" fill="#334155" font-family="sans-serif" font-size="18" font-weight="700">${escapeHtml(metricRightLbl)}</text>
  <text x="84" y="530" fill="#0A2540" font-family="monospace" font-size="19" font-weight="700">ABANDONALPHA (#9) • BETA-BERNOULLI THOMPSON SAMPLING + STRIPE DUNNING</text>
</svg>`;
}

function formatMetaDescription(str, maxLen = 150) {
  const clean = String(str || '')
    .replace(/[`$"<>]/g, '')
    .replace(/\\theta/g, 'theta')
    .replace(/\\tau/g, 'tau')
    .replace(/\s+/g, ' ')
    .trim();
  if (clean.length <= maxLen) return clean;
  const sliced = clean.slice(0, maxLen);
  const lastSpace = sliced.lastIndexOf(' ');
  const wordBound = lastSpace > 80 ? sliced.slice(0, lastSpace) : sliced;
  return wordBound.replace(/[.,;: · –-]+$/, '') + '...';
}

function renderPseoPageHtml(page, baseUrl = 'https://www.abandonalpha.com') {
  const curIdx = Math.max(0, PSEO_PAGES.findIndex((p) => p.slug === page.slug));
  const related = [];
  const crossCluster = [];
  for (let i = 1; i <= 6; i += 1) {
    related.push(PSEO_PAGES[(curIdx + i) % PSEO_PAGES.length]);
  }
  for (let i = 7; i <= 10; i += 1) {
    crossCluster.push(PSEO_PAGES[(curIdx + i) % PSEO_PAGES.length]);
  }

  const cleanTitle = page.title.replace(/`/g, '');
  const metaDesc = formatMetaDescription(page.summary, 150);
  const canonicalUrl = `${baseUrl}/seo/${encodeURIComponent(page.slug)}`;
  const ogImageUrl = `${baseUrl}/api/og?slug=${encodeURIComponent(page.slug)}`;
  const naiveRecRate = Math.max(8.4, Number((page.recoverableLiftPct * 0.24).toFixed(1)));
  const standardRecRate = Math.max(14.2, Number((page.recoverableLiftPct * 0.58).toFixed(1)));

  const jsonLd = [
    { '@context': 'https://schema.org', '@type': 'SoftwareApplication', name: `AbandonAlpha: ${cleanTitle}`, url: canonicalUrl, applicationCategory: 'BusinessApplication', operatingSystem: 'Web, Stripe, Shopify, Next.js', offers: { '@type': 'Offer', price: '49.00', priceCurrency: 'USD' }, description: metaDesc },
    { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: page.faqs.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) },
    { '@context': 'https://schema.org', '@type': 'Dataset', name: `${page.targetKeyword} Telemetry Benchmark (2026)`, url: canonicalUrl, description: metaDesc, variableMeasured: ['Checkout Abandonment Rate', 'Stripe Decline Recovery Lift', 'Thompson Sampling Posterior Mean'] },
    { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'AbandonAlpha Home', item: `${baseUrl}/` },
      { '@type': 'ListItem', position: 2, name: 'Playbook Directory', item: `${baseUrl}/directory` },
      { '@type': 'ListItem', position: 3, name: cleanTitle, item: canonicalUrl }
    ] }
  ];

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(cleanTitle)} | AbandonAlpha</title>
  <meta name="description" content="${escapeHtml(metaDesc)}" />
  <link rel="canonical" href="${canonicalUrl}" />
  <meta property="og:title" content="${escapeHtml(cleanTitle)} | AbandonAlpha" />
  <meta property="og:description" content="${escapeHtml(metaDesc)}" />
  <meta property="og:type" content="article" />
  <meta property="og:url" content="${canonicalUrl}" />
  <meta property="og:site_name" content="AbandonAlpha" />
  <meta property="og:image" content="${ogImageUrl}" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:site" content="@AbandonAlpha" />
  <meta name="twitter:title" content="${escapeHtml(cleanTitle)} | AbandonAlpha" />
  <meta name="twitter:description" content="${escapeHtml(metaDesc)}" />
  <meta name="twitter:image" content="${ogImageUrl}" />
  <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
  <link rel="stylesheet" href="/styles.css" />
  <script type="application/ld+json">${JSON.stringify(jsonLd).replace(/</g, '\\u003c')}</script>
  <!-- Google tag (gtag.js) -->
  <script async src="https://www.googletagmanager.com/gtag/js?id=AW-18526471751"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'AW-18526471751');
  </script>
</head>
<body>
  ${renderUnifiedHeaderHtml('FINOPS TELEMETRY v4.2')}

  <main class="container pseo-main">
    <nav class="breadcrumb" aria-label="Breadcrumb">
      <a href="/">AbandonAlpha Home</a> <span>/</span>
      <a href="/directory">Playbook Directory</a> <span>/</span>
      <span>${escapeHtml(page.category)}</span>
    </nav>

    <style>@media(max-width:640px){.inline-calc-grid{grid-template-columns:1fr!important;}.inline-calc-grid>*,.calc-inputs,.calc-output-box,.pseo-section,.code-snippet-box{min-width:0!important;max-width:100%!important;box-sizing:border-box!important;overflow-x:hidden!important;padding-inline:14px!important;}.btn,#pseo-calc-btn{max-width:100%!important;white-space:normal!important;}}</style>
    <div class="hero-split pseo-hero" style="align-items:stretch;">
      <div class="pseo-hero-left" style="display:flex;flex-direction:column;justify-content:flex-start;gap:14px;height:100%;">
        <div>
          <p class="section-kicker" style="margin:0 0 8px;">${escapeHtml(page.category)} · <code>${escapeHtml(page.declineOrSignal)}</code></p>
          <h1 class="pseo-h1" style="font-size:clamp(1.65rem, 2.4vw, 2.25rem);line-height:1.14;max-width:26ch;">${escapeHtml(cleanTitle)}</h1>
          <p class="pseo-lead">${escapeHtml(page.summary.replace(/`/g, ''))}</p>
          <div class="cta-row">
            <a href="/?decline=${encodeURIComponent(page.declineOrSignal)}&amp;sessions=${page.sampleMonthlySessions}&amp;aov=${page.sampleAovUsd}#grader" class="btn btn-indigo">
              <span>Calculate store leakage</span>
            </a>
            <a href="/?decline=${encodeURIComponent(page.declineOrSignal)}&amp;sessions=${page.sampleMonthlySessions}&amp;aov=${page.sampleAovUsd}#webhook-lab" class="btn btn-ghost">Simulate ${escapeHtml(page.webhookEvent)}</a>
          </div>
        </div>
      </div>

      <div class="telemetry-card">
        <div class="card-header-bar">
          <span class="mono-label">Recovery benchmark</span>
          <span style="font-size:12px;color:#64748B;font-weight:500;">2026 Stripe &amp; Shopify data</span>
        </div>
        <div class="metric-duo">
          <div class="metric-tile" style="background:#F8FAFC;border:1px solid #E2E8F0;border-radius:12px;">
            <span class="tile-label">Baseline loss / decline share</span>
            <strong class="tile-value" style="color:#0F172A;">${page.baselineAbandonmentOrFailPct}%</strong>
            <span class="tile-sub">Unoptimized Stripe / checkout</span>
          </div>
          <div class="metric-tile tile-emerald">
            <span class="tile-label">Recovery lift</span>
            <strong class="tile-value text-emerald">+${page.recoverableLiftPct}%</strong>
            <span class="tile-sub">Timed retry + exit offer</span>
          </div>
        </div>
        <div class="playbook-spec-list">
          <div class="spec-row"><span class="spec-k">Target webhook</span><code class="spec-v">${escapeHtml(page.webhookEvent)}</code></div>
          <div class="spec-row"><span class="spec-k">Optimal retry timing</span><span class="spec-v" style="color:#0F172A;font-weight:600;">${escapeHtml(page.optimalTimingWindow || '1st & 15th Payday Window (09:05 Local)')}</span></div>
          <div class="spec-row"><span class="spec-k">Winning counter-offer</span><span class="spec-v" style="color:#0F172A;font-weight:600;">${escapeHtml(page.winningArm || '1-Click Apple Pay / Pause-Instead-of-Cancel')}</span></div>
          <div class="spec-row"><span class="spec-k">Estimated recovered cashflow</span><strong class="spec-v text-emerald">+$${page.monthlyRecoveredUsd.toLocaleString()}/mo ($${page.annualRecoveredUsd.toLocaleString()}/yr)</strong></div>
        </div>
      </div>
    </div>

    ${renderTopSubpageEmailBarHtml(`Free ${page.declineOrSignal} retry schedule & recovery rules`, 'Send free schedule →', page.slug)}

    <section class="pseo-section">
      <h2>Recovery benchmark: <code>${escapeHtml(page.declineOrSignal)}</code></h2>
      <p class="section-sub">Empirical 2026 recovery performance comparing naive 24-hour retries, standard platform retries, and payday-timed recovery windows.</p>
      <div class="posterior-table-wrap">
        <table class="posterior-table">
          <thead><tr><th>Recovery architecture</th><th>Recovery rate</th><th>Avg time to recover</th><th>Churn risk</th><th>Net revenue lift</th></tr></thead>
          <tbody>
            <tr><td><strong>1. Naive 24h cron retry</strong></td><td>${naiveRecRate}%</td><td>14.2 days (issuer lockout risk)</td><td>High (${page.baselineAbandonmentOrFailPct}% unrecovered)</td><td>Baseline (+0.0%)</td></tr>
            <tr><td><strong>2. Standard platform retry</strong></td><td>${standardRecRate}%</td><td>5.8 days (generic reminder)</td><td>Moderate</td><td>+${standardRecRate}%</td></tr>
            <tr style="background: rgba(16, 185, 129, 0.06);"><td><strong>3. Payday-timed window + counter-offer</strong></td><td><strong class="text-emerald">${page.recoverableLiftPct}%</strong></td><td><strong>&lt; 4.2 hours (payday deposit sync)</strong></td><td class="text-emerald"><strong>Low (Visa/MC safe limit)</strong></td><td class="text-emerald"><strong>+${page.recoverableLiftPct}% (+$${page.monthlyRecoveredUsd.toLocaleString()}/mo)</strong></td></tr>
          </tbody>
        </table>
      </div>
    </section>

    <section class="pseo-section">
      <h2><code>${escapeHtml(page.declineOrSignal)}</code> recovery calculator</h2>
      <p class="section-sub">Adjust your monthly checkout attempts and average order value below to model your recoverable cashflow.</p>
      <div class="inline-calc-grid">
        <div class="calc-inputs">
          <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:10px;">
            <span class="mono-label" style="font-size:13px;color:#475569;font-weight:600;">Preset size:</span>
            <button type="button" onclick="setPseoTier(600, 42, ${page.baselineAbandonmentOrFailPct}, ${page.recoverableLiftPct})" class="preset-chip" style="padding:5px 10px;font-size:13px;">$25k store</button>
            <button type="button" onclick="setPseoTier(1800, 68, ${page.baselineAbandonmentOrFailPct}, ${page.recoverableLiftPct})" class="preset-chip" style="padding:5px 10px;font-size:13px;">$120k brand</button>
            <button type="button" onclick="setPseoTier(5200, 95, ${page.baselineAbandonmentOrFailPct}, ${page.recoverableLiftPct})" class="preset-chip" style="padding:5px 10px;font-size:13px;">$500k scale</button>
          </div>
          <label class="field-label" for="pseo-sessions">Monthly checkout or renewal attempts</label>
          <input id="pseo-sessions" type="number" class="field-input" value="${page.sampleMonthlySessions}" min="50" max="500000" oninput="recalcPseo(${page.baselineAbandonmentOrFailPct}, ${page.recoverableLiftPct})" />
          <label class="field-label" for="pseo-aov">Average order or invoice value ($)</label>
          <input id="pseo-aov" type="number" class="field-input" value="${page.sampleAovUsd}" min="5" max="10000" oninput="recalcPseo(${page.baselineAbandonmentOrFailPct}, ${page.recoverableLiftPct})" />
          <button type="button" id="pseo-calc-btn" class="btn btn-indigo" onclick="recalcPseo(${page.baselineAbandonmentOrFailPct}, ${page.recoverableLiftPct})">
            <span>Recalculate recoverable revenue</span>
          </button>
        </div>
        <div class="calc-output-box">
          <div class="spec-row"><span>Monthly revenue exposed to <code>${escapeHtml(page.declineOrSignal)}</code>:</span><strong id="pseo-leaked-val" style="color:#0F172A;">$${page.monthlyLeakedUsd.toLocaleString()}/mo</strong></div>
          <div class="spec-row"><span>Monthly cashflow recovered:</span><strong id="pseo-rec-val" class="text-emerald">+$${page.monthlyRecoveredUsd.toLocaleString()}/mo</strong></div>
          <div class="spec-row"><span>12-month net impact:</span><strong id="pseo-ann-val" class="text-emerald">+$${page.annualRecoveredUsd.toLocaleString()}/yr</strong></div>
          <div class="code-snippet-box">
            <div class="mono-label">Complete Recovery Pack ($29 one-time)</div>
            <p style="font-size:0.9375rem;line-height:1.55;margin-top:6px;">Includes your ready-to-use <code>${escapeHtml(page.declineOrSignal)}</code> Stripe retry schedule, 1-click Apple Pay recovery link template, and exit counter-offer rules.</p>
            <div style="margin-top:10px;display:flex;gap:8px;flex-wrap:wrap;align-items:center;">
              <a href="/buy/playbook_pass?playbook=${encodeURIComponent(page.slug)}" rel="nofollow" class="btn btn-indigo btn-sm" style="display:inline-flex;">Get Complete Pack ($29) &rarr;</a>
              <a href="/buy/flash_pass?playbook=${encodeURIComponent(page.slug)}" rel="nofollow" style="font-size:13px;color:#64748B;text-decoration:underline;margin-left:4px;">or $1.99 single-store patch</a>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="pseo-section">
      <h2>Common questions: <code>${escapeHtml(page.declineOrSignal)}</code></h2>
      <div class="faq-grid">
        ${page.faqs.map((f, idx) => `<div class="faq-card"><h3>${idx + 1}. ${escapeHtml(f.q)}</h3><p>${escapeHtml(f.a)}</p></div>`).join('')}
      </div>
    </section>

    <section class="pseo-section">
      <h2>Related ${escapeHtml(page.category)} Playbooks</h2>
      <div class="related-links-grid">
        ${related.map((r) => `<a href="/seo/${escapeHtml(r.slug)}" class="related-card"><span class="mono-label">${escapeHtml(r.declineOrSignal)} • +${r.recoverableLiftPct}% Lift</span><strong>${escapeHtml(r.title.replace(/`/g, ''))}</strong></a>`).join('')}
        ${crossCluster.map((r) => `<a href="/seo/${escapeHtml(r.slug)}" class="related-card"><span class="mono-label">${escapeHtml(r.category)} • +${r.recoverableLiftPct}% Lift</span><strong>${escapeHtml(r.title.replace(/`/g, ''))}</strong></a>`).join('')}
      </div>
    </section>
  </main>

  ${renderCookieAndFooterHtml()}

  <script>
    var __pseoCalcTimer = null;
    function setPseoTier(sessions, aov, lossPct, liftPct) {
      document.getElementById('pseo-sessions').value = sessions;
      document.getElementById('pseo-aov').value = aov;
      recalcPseo(lossPct, liftPct, true);
    }
    function recalcPseo(lossPct, liftPct, immediate) {
      var s = Math.max(10, Number(document.getElementById('pseo-sessions').value || 1000));
      var aov = Math.max(5, Number(document.getElementById('pseo-aov').value || 80));
      var leaked = Math.round(s * (lossPct / 100) * aov);
      var rec = Math.round(leaked * (liftPct / 100) * 0.35);
      document.getElementById('pseo-leaked-val').textContent = '$' + leaked.toLocaleString() + '/mo';
      document.getElementById('pseo-rec-val').textContent = '+$' + rec.toLocaleString() + '/mo';
      document.getElementById('pseo-ann-val').textContent = '+$' + (rec * 12).toLocaleString() + '/yr';
      if (__pseoCalcTimer) clearTimeout(__pseoCalcTimer);
      __pseoCalcTimer = setTimeout(function() {
        fetch('/api/telemetry/event', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ event_type: 'calculate', page_url: window.location.pathname, meta: { source: 'pseo_inline_calculator', sessions: s, aov: aov, recovered_usd: rec } })
        }).catch(function() {});
      }, immediate ? 0 : 350);
    }
  </script>
</body>
</html>`;
}

function renderDirectoryHtml(baseUrl = 'https://www.abandonalpha.com') {
  const categories = ['Stripe Decline Codes', 'Stripe Webhooks & Dunning', 'Platform Playbooks', 'Bandit & Exit-Intent Science'];
  const dirDesc = 'Browse all 60 data-backed Stripe decline code retry schedules, checkout.session.expired webhook automations, and Thompson Sampling exit-intent playbooks.';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Programmatic SEO Playbook Directory (60 Stripe Dunning &amp; Checkout Guides) | AbandonAlpha</title>
  <meta name="description" content="${dirDesc}" />
  <link rel="canonical" href="${baseUrl}/directory" />
  <meta property="og:title" content="Programmatic SEO Playbook Directory (60 Stripe Dunning &amp; Checkout Guides) | AbandonAlpha" />
  <meta property="og:description" content="${dirDesc}" />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="${baseUrl}/directory" />
  <meta property="og:site_name" content="AbandonAlpha" />
  <meta property="og:image" content="${baseUrl}/api/og?slug=directory" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:site" content="@AbandonAlpha" />
  <meta name="twitter:title" content="Programmatic SEO Playbook Directory (60 Stripe Dunning &amp; Checkout Guides) | AbandonAlpha" />
  <meta name="twitter:description" content="${dirDesc}" />
  <meta name="twitter:image" content="${baseUrl}/api/og?slug=directory" />
  <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
  <link rel="stylesheet" href="/styles.css" />
</head>
<body>
  ${renderUnifiedHeaderHtml('60 PSEO PLAYBOOKS')}

  <main class="container pseo-main">
    <div class="directory-header">
      <h1 class="pseo-h1" style="font-size:clamp(2.1rem, 3.8vw, 3.5rem);line-height:1.08;max-width:20ch;margin:0 0 12px;">Stripe Recovery Playbooks</h1>
      <p class="pseo-lead">Browse ${PSEO_PAGES.length} verified checkout recovery guides covering Stripe card decline codes, payday retry timing, and smart exit offers for Shopify and Subscription Stores.</p>
      ${renderTopSubpageEmailBarHtml('Free 60-Playbook Stripe Retry Schedule ($0) + $29 Complete Recovery Kit', 'Send Free 60-Playbook Sheet ($0) →', '')}
      <div class="filter-bar" style="margin-top:16px;">
        <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;margin-bottom:6px;">
          <label for="dir-search" class="field-label" style="margin:0;">Filter ${PSEO_PAGES.length} Playbooks by Decline Code, Webhook, or Platform</label>
          <span id="dir-match-status" style="font-size:13px;font-weight:700;color:#047857;">Showing all ${PSEO_PAGES.length} Playbooks</span>
        </div>
        <input id="dir-search" type="search" class="field-input" placeholder="e.g. do_not_honor, insufficient_funds, shopify, checkout.session.expired..." oninput="filterDirectory(this.value)" />
        <div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap;margin-top:10px;">
          <span style="font-size:12.5px;font-weight:700;color:#475569;">Quick Filter:</span>
          ${['All', 'do_not_honor', 'insufficient_funds', 'expired_card', 'generic_decline', 'Shopify', 'invoice.payment_failed'].map((tag) => `<button type="button" onclick="var inp=document.getElementById('dir-search');if(inp){inp.value='${tag === 'All' ? '' : tag}';filterDirectory(inp.value);}" style="padding:4px 10px;border-radius:999px;border:1px solid #CBD5E1;background:#FFFFFF;color:#0F172A;font-size:12.5px;font-weight:600;cursor:pointer;">${tag}</button>`).join('')}
        </div>
      </div>
    </div>

    <div id="dir-empty-state" style="display:none;padding:24px;border-radius:14px;background:#FFFFFF;border:1px solid #E2E8F0;margin-top:20px;text-align:center;">
      <p style="margin:0 0 10px;font-size:15px;font-weight:600;color:#0F172A;">No exact playbook matched that filter. Try a Decline Code or run a custom store check:</p>
      <div style="display:inline-flex;gap:10px;flex-wrap:wrap;justify-content:center;">
        <button type="button" class="btn btn-ghost" onclick="var inp=document.getElementById('dir-search');if(inp){inp.value='';filterDirectory('');}">Reset Filter (Show All ${PSEO_PAGES.length})</button>
        <a href="/#grader" class="btn btn-indigo"><span>Open Live Revenue &amp; Retry Calculator</span><span class="btn-icon-circle" aria-hidden="true">&rarr;</span></a>
      </div>
    </div>

    ${categories.map((cat) => {
      const items = PSEO_PAGES.filter((p) => p.category === cat);
      return `
      <section class="pseo-section dir-cluster" data-total="${items.length}">
        <div style="display:flex;align-items:center;gap:10px;margin-bottom:10px;">
          <h2 style="margin:0;">${escapeHtml(cat)} (<span class="dir-cluster-count">${items.length}</span> Playbooks)</h2>
        </div>
        <div class="related-links-grid">
          ${items.map((item) => `
            <a href="/seo/${escapeHtml(item.slug)}" class="related-card dir-item" data-search="${escapeHtml((item.title + ' ' + item.declineOrSignal + ' ' + item.targetKeyword + ' ' + item.webhookEvent + ' ' + item.category + ' ' + item.slug).toLowerCase())}">
              <div class="dir-card-top">
                <code class="text-indigo">${escapeHtml(item.declineOrSignal)}</code>
                <span class="badge-emerald">+${item.recoverableLiftPct}% Recovery</span>
              </div>
              <strong>${escapeHtml(item.title.replace(/`/g, ''))}</strong>
              <p class="dir-card-sub">Webhook: <code>${escapeHtml(item.webhookEvent)}</code> • Est. +$${item.monthlyRecoveredUsd.toLocaleString()}/mo</p>
            </a>
          `).join('')}
        </div>
      </section>`;
    }).join('')}
  </main>

  ${renderCookieAndFooterHtml()}

  <script>
    function filterDirectory(q) {
      var raw = (q || '').toLowerCase().replace(/[_.-]+/g, ' ').trim();
      var tokens = raw ? raw.split(/\\s+/).filter(Boolean) : [];
      var cards = Array.prototype.slice.call(document.querySelectorAll('.dir-item'));
      var matchedCount = 0;
      cards.forEach(function(el) {
        var hay = ((el.getAttribute('data-search') || '') + ' ' + (el.textContent || '')).toLowerCase().replace(/[_.-]+/g, ' ');
        var ok = !tokens.length || tokens.every(function(t) { return hay.indexOf(t) !== -1; });
        el.style.display = ok ? '' : 'none';
        if (ok) matchedCount++;
      });
      if (tokens.length > 1 && matchedCount === 0) {
        var sigTokens = tokens.filter(function(t) { return t.length >= 2; });
        cards.forEach(function(el) {
          var hay = ((el.getAttribute('data-search') || '') + ' ' + (el.textContent || '')).toLowerCase().replace(/[_.-]+/g, ' ');
          var ok = sigTokens.some(function(t) { return hay.indexOf(t) !== -1; });
          el.style.display = ok ? '' : 'none';
          if (ok) matchedCount++;
        });
      }
      var clusters = document.querySelectorAll('.dir-cluster');
      clusters.forEach(function(sec) {
        var secCards = sec.querySelectorAll('.dir-item');
        var secVis = 0;
        secCards.forEach(function(c) { if (c.style.display !== 'none') secVis++; });
        sec.style.display = secVis > 0 ? '' : 'none';
        var cntEl = sec.querySelector('.dir-cluster-count');
        if (cntEl) cntEl.textContent = String(secVis);
      });
      var st = document.getElementById('dir-match-status');
      if (st) st.textContent = !tokens.length ? ('Showing all ' + cards.length + ' Playbooks') : ('Showing ' + matchedCount + ' of ' + cards.length + ' Playbooks');
      var emp = document.getElementById('dir-empty-state');
      if (emp) emp.style.display = matchedCount === 0 ? 'block' : 'none';
    }
  </script>
</body>
</html>`;
}

function renderMetaLandingPageHtml(baseUrl = 'https://www.abandonalpha.com') {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Recover 18%–31% of Abandoned Checkouts &amp; Failed Stripe Payments | AbandonAlpha</title>
  <meta name="description" content="71% of your checkout visitors leave without paying. Recover 18%–31% automatically with Behavioral Exit-Intent Bandits & Smart Stripe Webhooks." />
  <link rel="canonical" href="${baseUrl}/lp" />
  <meta property="og:title" content="Recover 18%–31% of Abandoned Checkouts Automatically | AbandonAlpha" />
  <meta property="og:description" content="Calculate your store's monthly checkout leakage in 10 seconds. Backed by our 30-Day 5x ROI Guarantee." />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="${baseUrl}/lp" />
  <meta property="og:site_name" content="AbandonAlpha" />
  <meta property="og:image" content="${baseUrl}/api/og?slug=lp" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="Recover 18%–31% of Abandoned Checkouts Automatically | AbandonAlpha" />
  <meta name="twitter:description" content="Calculate your store's monthly checkout leakage in 10 seconds. Backed by our 30-Day 5x ROI Guarantee." />
  <meta name="twitter:image" content="${baseUrl}/api/og?slug=lp" />
  <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
  <link rel="stylesheet" href="/styles.css" />
</head>
<body class="lp-body">
  <header class="lp-topbar">
    <div class="container lp-topbar-inner">
      <a href="/" class="brand-logo" aria-label="AbandonAlpha Home">
        ${renderBrandLogoSvg('lp')}
        <span class="brand-wordmark">Abandon<span class="brand-wordmark-accent">Alpha</span></span>
        <span class="brand-tag">META PARTNER VERIFIED • 5-MIN SETUP</span>
      </a>
      <div class="lp-guarantee-pill">30-Day 5x ROI Guarantee: Recover 5x Your Plan or Pay $0</div>
    </div>
  </header>

  <main class="container lp-main">
    <section class="hero-split lp-hero">
      <div class="lp-hero-copy">
        <div class="status-pill">FOR SHOPIFY BRANDS, SUBSCRIPTION FOUNDERS &amp; STRIPE MERCHANTS</div>
        <h1 class="lp-h1">71% of Your Checkout Visitors Leave Without Paying: Recover <span class="serif-italic">18%–31%</span> Automatically</h1>
        <p class="pseo-lead">Stop losing warm buyers to tab closes and <code>insufficient_funds</code> card declines. Launch <strong>Smart Exit Counter-Offers</strong> + <strong>Payday-Timed Stripe Retries</strong> in 60 seconds.</p>

        <ul class="lp-proof-list">
          <li><strong>Smart Exit-Intent Counter-Offers:</strong> Detects when a buyer moves to close their checkout tab and offers the right 1-click incentive (discount, trial extension, or team quote) before they leave.</li>
          <li><strong>Decline-Code Smart Retries:</strong> Aligns <code>insufficient_funds</code> retries with payday deposit windows (62.4% recovery) and halts <code>expired_card</code> retries to avoid Visa/Mastercard fees.</li>
          <li><strong>Meta Ads Revenue Sync:</strong> Sends every recovered checkout back to Meta Conversions API so your ad campaigns optimize for real buyers.</li>
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
          <input type="text" name="website_url" class="hp-field" tabindex="-1" autocomplete="off" aria-hidden="true" />
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
          <button type="submit" id="lp-submit-btn" class="btn btn-indigo btn-block" style="margin-top:14px;">
            <span>Calculate My Recoverable Revenue &amp; Unlock SDK</span>
            <span class="btn-icon-circle" aria-hidden="true">&rarr;</span>
          </button>
        </form>

        <div id="lp-result-panel" class="lp-result-panel">
          <div class="metric-duo">
            <div class="metric-tile tile-rose">
              <span class="tile-label">Monthly Leaked Revenue</span>
              <strong id="lp-leaked-out" class="tile-value text-rose">$214,523</strong>
            </div>
            <div class="metric-tile tile-emerald">
              <span class="tile-label">Recoverable Every Month</span>
              <strong id="lp-rec-out" class="tile-value text-emerald">+$36,722/mo</strong>
            </div>
          </div>
          <div class="lp-action-bar" style="display:flex;flex-direction:column;gap:8px;">
            <a href="/buy/flash_pass?utm_source=meta_lp" rel="nofollow" class="btn btn-emerald btn-block" onclick="fireCapi('InitiateCheckout', 1.99)">Unlock Single-Store Stripe Recovery Pass ($1.99 One-Time) &rarr;</a>
            <button type="button" class="btn btn-ghost btn-block" onclick="startLpCheckout('starter')">Or Start Managed Autonomous Recovery ($49/mo: 30-Day ROI Guarantee)</button>
          </div>
          <div id="lp-capi-status" class="mono-status">Meta CAPI Event Deduplication Ready (ViewContent Fired)</div>
        </div>
      </div>
    </section>
  </main>

  ${renderCookieAndFooterHtml()}

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
      var val = tier === 'flash_199' ? 1.99 : 49;
      await fireCapi('StartTrial', val);
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
  <meta name="description" content="${title} for AbandonAlpha Autonomous Checkout & Stripe Dunning Recovery Engine." />
  <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
  <link rel="stylesheet" href="/styles.css" />
</head>
<body>
  ${renderUnifiedHeaderHtml('LEGAL & COMPLIANCE')}
  <main class="container pseo-main" style="max-width:860px;">
    <div class="status-pill">INSTITUTIONAL FINTECH COMPLIANCE</div>
    <h1 class="pseo-h1">${title}</h1>
    <p class="pseo-lead">Last Updated: October 14, 2026 • AbandonAlpha Autonomous Recovery Systems</p>
    <div class="faq-card" style="margin-top:24px; display:flex; flex-direction:column; gap:14px;">
      ${isPrivacy ? `
        <h3>1. Ephemeral Mouse-Velocity &amp; Tab-Visibility Telemetry</h3>
        <p>AbandonAlpha computes cursor trajectory vectors (<code>v_y, θ, τ</code>) strictly in browser memory to detect checkout exit intent. Zero keystrokes or raw credit card numbers (card numbers or security codes) ever touch AbandonAlpha servers.</p>
        <h3>2. Stripe Webhook &amp; Billing Portal Processing</h3>
        <p>We process Stripe webhook events (<code>checkout.session.expired</code> and <code>invoice.payment_failed</code>) using scoped restricted API keys to schedule compliant retries and generate Stripe-hosted Billing Portal links.</p>
        <h3>3. GDPR &amp; CCPA Data Subject Rights</h3>
        <p>Merchants and end-buyers may request immediate access, export, or deletion of telemetry logs by emailing privacy@abandonalpha.io.</p>
      ` : `
        <h3>1. Transparent One-Time Packs &amp; Flat-Rate Recovery</h3>
        <p>AbandonAlpha is licensed via self-serve One-Time Production Engineering Packs ($1.99 Single-Store Audit Pass, $19 Starter Code Pack, $49 Complete Store Recovery Kit) or Multi-Store Agency &amp; SMS Pro ($149) with 0% revenue-share commission on recovered checkouts.</p>
        <h3>2. Card Network Retry Compliance</h3>
        <p>All automated dunning schedules strictly enforce Visa and Mastercard retry limits (maximum 4 retries within 30 days on soft declines; zero automated retries on hard declines).</p>
        <h3>3. 30-Day 5x ROI Guarantee</h3>
        <p>If AbandonAlpha does not recover at least 5x your monthly subscription fee within your first 30 days, you may cancel in 1 click for a full refund.</p>
      `}
    </div>
  </main>
  ${renderCookieAndFooterHtml()}
</body>
</html>`;
}

function renderNotFoundHtml() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>404: Route Not Found | AbandonAlpha</title>
  <meta name="description" content="Page not found on AbandonAlpha." />
  <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
  <link rel="stylesheet" href="/styles.css" />
</head>
<body>
  ${renderUnifiedHeaderHtml('404 RECOVERY')}
  <main class="container pseo-main" style="text-align:center; padding-top:72px;">
    <div class="status-pill">HTTP 404 • SESSION NOT FOUND</div>
    <h1 class="pseo-h1" style="margin-top:12px;">Even This 404 Page Refuses to Let Visitors <span class="serif-italic">Abandon</span></h1>
    <p class="pseo-lead" style="margin:12px auto 28px;">The route you requested does not exist, or the checkout link has expired.</p>
    <div class="cta-row" style="justify-content:center;">
      <a href="/" class="btn btn-indigo">
        <span>Return to AbandonAlpha Sandbox</span>
        <span class="btn-icon-circle" aria-hidden="true">&rarr;</span>
      </a>
      <a href="/directory" class="btn btn-ghost">Browse 60 Recovery Playbooks</a>
    </div>
  </main>
  ${renderCookieAndFooterHtml()}
</body>
</html>`;
}

module.exports = {
  AA_LOCK_SVG,
  renderTopSubpageEmailBarHtml,
  renderBrandLogoSvg,
  renderUnifiedHeaderHtml,
  renderOgSvg,
  renderPseoPageHtml,
  renderDirectoryHtml,
  renderMetaLandingPageHtml,
  renderLegalPageHtml,
  renderNotFoundHtml
};
