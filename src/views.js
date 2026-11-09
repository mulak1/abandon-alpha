const { PSEO_PAGES, getPseoPageBySlug } = require('./pseo-data');

const AA_LOCK_SVG = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:-2px;margin-right:4px;flex-shrink:0;"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>';

function renderTopSubpageEmailBarHtml() {
  return '';
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
        <a href="/#grader">1. Estimate Lost Sales</a>
        <a href="/#bandit-lab">2. Preview Exit Offers</a>
        <a href="/directory">3. Recovery Guides</a>
        <a href="/#in-card-unlock-bar">Pricing ($29)</a>
        <a href="/#grader" id="nav-calc-mrr-btn" class="btn btn-indigo btn-sm" onclick="if(typeof triggerHeaderMrrCalc==='function'){return triggerHeaderMrrCalc(event);}">
          <span>Calculate Lost Sales</span>
        </a>
      </nav>
    </div>
    <nav class="mobile-nav-strip" aria-label="Mobile Navigation">
      <a href="/#grader">1. Estimate Sales</a>
      <a href="/#bandit-lab">2. Exit Offers</a>
      <a href="/directory">3. Guides</a>
      <a href="/#in-card-unlock-bar">Pricing ($29)</a>
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
  <link rel="stylesheet" href="/styles.css?v=20261108c" />
  <script type="application/ld+json">${JSON.stringify(jsonLd).replace(/</g, '\\u003c')}</script>
  <script async src="https://www.googletagmanager.com/gtag/js?id=AW-18526471751"></script>
  <script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','AW-18526471751');</script>
</head>
<body>
  ${renderUnifiedHeaderHtml('FINOPS TELEMETRY v4.2')}

  <main class="container pseo-main" style="padding-top:14px;">
    <nav class="breadcrumb" aria-label="Breadcrumb" style="margin-bottom:8px;">
      <a href="/">AbandonAlpha Home</a> <span>/</span>
      <a href="/directory">Playbook Directory</a> <span>/</span>
      <span>${escapeHtml(page.category)}</span>
    </nav>

    <style>@media(max-width:640px){.inline-calc-grid{grid-template-columns:1fr!important;}.inline-calc-grid>*,.calc-inputs,.calc-output-box,.pseo-section,.code-snippet-box{min-width:0!important;max-width:100%!important;box-sizing:border-box!important;overflow-x:hidden!important;padding-inline:14px!important;}.btn,#pseo-calc-btn{max-width:100%!important;white-space:normal!important;}}</style>
    <div class="aa-sunlit-hero-banner">
      <div>
        <p class="section-kicker" style="margin:0 0 4px;font-size:12.5px;color:#047857;font-weight:700;">✦ ${escapeHtml(page.category)} · <code>${escapeHtml(page.declineOrSignal)}</code></p>
        <h1 class="pseo-h1" style="font-size:clamp(1.55rem, 2.2vw, 2.05rem);line-height:1.14;margin:0 0 6px 0;">${escapeHtml(cleanTitle)}</h1>
        <p class="pseo-lead" style="margin:0;font-size:0.92rem;line-height:1.45;">${escapeHtml(page.summary.replace(/`/g, '').slice(0, 145))}</p>
        <div class="aa-focus-pill-row">
          <span class="aa-focus-pill"><strong>+${page.recoverableLiftPct}%</strong> Recovery Lift</span>
          <span class="aa-focus-pill"><strong>+${page.monthlyRecoveredUsd.toLocaleString()}/mo</strong> Benchmark</span>
          <span class="aa-focus-pill"><strong>$29 One-Time</strong> · 0% Commission</span>
        </div>
      </div>
      <div class="aa-hero-photo-frame">
        <img src="/editorial-segment-2.jpg" alt="Sunlit retention lead reviewing Stripe decline recovery schedule" class="aa-hero-photo-img" width="420" height="166" loading="eager" fetchpriority="high" decoding="async" />
        <div class="aa-hero-photo-badge">
          <span><code>${escapeHtml(page.declineOrSignal)}</code> Playbook</span>
          <span style="color:#047857;">+${page.recoverableLiftPct}% Verified Lift</span>
        </div>
      </div>
    </div>

    <div class="hero-split pseo-hero" style="align-items:stretch;">
      <div class="grader-form-card" style="display:flex;flex-direction:column;justify-content:space-between;gap:14px;height:100%;">
        <div style="display:flex;flex-direction:column;gap:12px;">
          <div class="card-header-bar" style="margin-bottom:0;padding-bottom:10px;border-bottom:1px solid #E2E8F0;">
            <span style="color:#0F172A;font-weight:600;font-size:0.95rem;">Store &amp; decline calculator</span>
            <code style="font-size:12px;color:#475569;">${escapeHtml(page.declineOrSignal)}</code>
          </div>
          <div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap;">
            <span class="mono-label" style="font-size:12.5px;color:#475569;font-weight:600;">Preset:</span>
            <button type="button" onclick="setPseoTier(600, 42, ${page.baselineAbandonmentOrFailPct}, ${page.recoverableLiftPct})" class="preset-btn" style="padding:5px 10px;font-size:12.5px;">$25k store</button>
            <button type="button" onclick="setPseoTier(1800, 68, ${page.baselineAbandonmentOrFailPct}, ${page.recoverableLiftPct})" class="preset-btn" style="padding:5px 10px;font-size:12.5px;">$120k brand</button>
            <button type="button" onclick="setPseoTier(5200, 95, ${page.baselineAbandonmentOrFailPct}, ${page.recoverableLiftPct})" class="preset-btn" style="padding:5px 10px;font-size:12.5px;">$500k scale</button>
          </div>
          <div>
            <label class="field-label" for="pseo-sessions">Monthly checkout or renewal attempts</label>
            <input id="pseo-sessions" type="number" class="field-input" value="${page.sampleMonthlySessions}" min="50" max="500000" oninput="recalcPseo(${page.baselineAbandonmentOrFailPct}, ${page.recoverableLiftPct})" />
          </div>
          <div>
            <label class="field-label" for="pseo-aov">Average order or invoice value ($)</label>
            <input id="pseo-aov" type="number" class="field-input" value="${page.sampleAovUsd}" min="5" max="10000" oninput="recalcPseo(${page.baselineAbandonmentOrFailPct}, ${page.recoverableLiftPct})" />
          </div>
          <button type="button" id="pseo-calc-btn" class="btn btn-indigo btn-block" onclick="recalcPseo(${page.baselineAbandonmentOrFailPct}, ${page.recoverableLiftPct})">
            <span>Recalculate recoverable revenue</span>
          </button>
        </div>
        <div class="cta-row" style="padding-top:10px;border-top:1px solid #E2E8F0;justify-content:space-between;">
          <a id="pseo-open-grader-link" href="/?decline=${encodeURIComponent(page.declineOrSignal)}&amp;sessions=${page.sampleMonthlySessions}&amp;aov=${page.sampleAovUsd}#grader" style="font-size:13px;font-weight:600;color:#0F172A;text-decoration:underline;">Open full store audit &rarr;</a>
          <a id="pseo-open-wh-link" href="/?decline=${encodeURIComponent(page.declineOrSignal)}&amp;sessions=${page.sampleMonthlySessions}&amp;aov=${page.sampleAovUsd}#webhook-lab" style="font-size:13px;font-weight:600;color:#475569;text-decoration:underline;">Simulate ${escapeHtml(page.webhookEvent)}</a>
        </div>
      </div>

      <div class="telemetry-card" style="display:flex;flex-direction:column;justify-content:space-between;gap:14px;height:100%;">
        <div>
          <div class="card-header-bar" style="margin-bottom:12px;padding-bottom:10px;border-bottom:1px solid #E2E8F0;">
            <span style="color:#0F172A;font-weight:600;font-size:0.95rem;">Live 3-step recovery flow &amp; benchmark</span>
            <span style="font-size:12px;color:#64748B;font-weight:500;">+${page.recoverableLiftPct}% recovery lift</span>
          </div>
          <div class="metric-duo" style="margin-bottom:12px;">
            <div class="metric-tile" style="background:#F8FAFC;border-radius:12px;padding:14px;">
              <span class="tile-label">Monthly revenue exposed (${page.baselineAbandonmentOrFailPct}% loss)</span>
              <strong id="pseo-leaked-val" class="tile-value" style="color:#0F172A;">$${page.monthlyLeakedUsd.toLocaleString()}/mo</strong>
              <span class="tile-sub">Unoptimized Stripe / checkout</span>
            </div>
            <div class="metric-tile tile-emerald" style="padding:14px;">
              <span class="tile-label">Recoverable revenue (+${page.recoverableLiftPct}% lift)</span>
              <strong id="pseo-rec-val" class="tile-value text-emerald">+$${page.monthlyRecoveredUsd.toLocaleString()}/mo</strong>
              <span id="pseo-ann-val" class="tile-sub">+$${page.annualRecoveredUsd.toLocaleString()}/yr net impact</span>
            </div>
          </div>

          <div style="display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px;font-size:12px;line-height:1.35;margin-bottom:12px;">
            <div style="background:#F8FAFC;border-radius:8px;padding:8px 10px;">
              <strong style="display:block;color:#0F172A;">Step 1 &middot; Webhook</strong>
              <span style="color:#475569;"><code>${escapeHtml(page.webhookEvent)}</code> trigger</span>
            </div>
            <div style="background:#F8FAFC;border-radius:8px;padding:8px 10px;">
              <strong style="display:block;color:#0F172A;">Step 2 &middot; Retry window</strong>
              <span style="color:#475569;">${escapeHtml(page.optimalTimingWindow || '1st & 15th Payday (09:05 Local)')}</span>
            </div>
            <div style="background:#F8FAFC;border-radius:8px;padding:8px 10px;">
              <strong style="display:block;color:#0F172A;">Step 3 &middot; Counter-offer</strong>
              <span style="color:#475569;">${escapeHtml(page.winningArm || '1-Click Apple Pay / Pause')}</span>
            </div>
          </div>
        </div>

        <div class="code-snippet-box" style="margin-top:0;background:#F8FAFC;padding:14px;display:flex;flex-direction:column;gap:8px;">
          <div style="font-size:13px;color:#0F172A;">
            <span style="color:#475569;font-weight:600;">Unmasked Step-1 webhook &amp; Specimen #1:</span>
            <code style="font-weight:600;color:#0F172A;background:#FFFFFF;padding:2px 6px;border-radius:4px;font-size:12.5px;">"Quick heads-up on your ${escapeHtml(page.declineOrSignal)} billing settings"</code>
          </div>
          <details id="pseo-fix1-details" style="margin:0;">
            <summary id="pseo-fix1-summary-cta" style="cursor:pointer;font-size:12.5px;font-weight:600;color:#0F172A;">Get free Fix #1 snippet for ${escapeHtml(page.declineOrSignal)} (+$${page.monthlyRecoveredUsd.toLocaleString()}/mo lift &middot; $0) &rarr;</summary>
            <code id="pseo-fix1-code" style="display:block;margin-top:8px;padding:10px 12px;border-radius:8px;background:#0F172A;color:#F8FAFC;font-size:12px;line-height:1.45;white-space:pre-wrap;overflow-x:auto;">window.AbandonAlphaRules = { declineOrSignal: "${escapeHtml(page.declineOrSignal)}", webhook: "${escapeHtml(page.webhookEvent)}", retryWindow: "${escapeHtml(page.optimalTimingWindow || '1st & 15th Payday')}", expectedLiftPct: ${page.recoverableLiftPct} };</code>
            <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;margin-top:6px;">
              <button type="button" id="pseo-copy-fix1-btn" class="btn btn-ghost btn-sm" style="padding:4px 10px;font-size:12px;font-weight:600;" onclick="if(this.getAttribute('data-copied')==='1'){if(window.__ebCheckout)window.__ebCheckout('playbook_pass');else window.location.href='/buy/playbook_pass?playbook=${encodeURIComponent(page.slug)}';return;}var c=document.getElementById('pseo-fix1-code');if(navigator.clipboard&&c)navigator.clipboard.writeText(c.textContent);this.setAttribute('data-copied','1');this.textContent='✓ Copied Step-1 Rule — Get All 3 Files ($29) →';this.style.color='#047857';">Copy Free Fix #1 Snippet</button>
              <span style="font-size:11.5px;color:#64748B;">Step 1 of 3 &middot; Full 3-file bundle in $29 pack</span>
            </div>
          </details>
          <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;padding-top:6px;border-top:1px solid #E2E8F0;">
            <span id="pseo-roi-proof" style="font-size:13px;color:#475569;">Pays for $29 pack in &lt; 1 recovered order (${Math.max(10, Math.round(page.monthlyRecoveredUsd / 29)).toLocaleString()}x ROI) &middot; 0% commission:</span>
            <div style="display:inline-flex;align-items:center;gap:10px;flex-wrap:wrap;">
              <a id="pseo-dl-worker" href="/api/github-upgrade/stripe-recovery-worker.js?target=${encodeURIComponent(page.declineOrSignal)}&amp;decline=${encodeURIComponent(page.declineOrSignal)}" download style="font-size:12.5px;color:#475569;font-weight:500;text-decoration:underline;">Preview Worker (.JS)</a>
              <a id="pseo-buy-29" href="/buy/playbook_pass?playbook=${encodeURIComponent(page.slug)}&amp;decline=${encodeURIComponent(page.declineOrSignal)}&amp;sessions=${page.sampleMonthlySessions}&amp;aov=${page.sampleAovUsd}" rel="nofollow" class="btn btn-indigo btn-sm" style="display:inline-flex;padding:7px 14px;font-size:13px;">Get Complete Pack ($29) &rarr;</a>
              <a id="pseo-buy-199" href="/buy/flash_pass?playbook=${encodeURIComponent(page.slug)}&amp;decline=${encodeURIComponent(page.declineOrSignal)}&amp;sessions=${page.sampleMonthlySessions}&amp;aov=${page.sampleAovUsd}" rel="nofollow" style="font-size:13px;color:#64748B;text-decoration:underline;">or $1.99 single-store patch</a>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="editorial-break-card">
      <img src="/editorial-fintech-desk.jpg" alt="Payment card and laptop on travertine stone desk" class="editorial-break-img" width="280" height="144" loading="eager" decoding="async" />
      <div>
        <h2 class="section-h2" style="margin-bottom:4px;font-size:1.1rem;">Bank-aligned retry timing for <code>${escapeHtml(page.declineOrSignal)}</code></h2>
        <div class="aa-focus-pill-row"><span class="aa-focus-pill"><strong>Max 4</strong> Retries / 30d Safe</span><span class="aa-focus-pill"><strong>Payday</strong> Deposit Sync</span><span class="aa-focus-pill"><strong>Zero</strong> Lockout Risk</span></div>
      </div>
    </div>

    <section class="pseo-section" style="padding:8px 0;">
      <h2 class="section-h2" style="margin-bottom:6px;font-size:1.15rem;">Recovery benchmark: <code>${escapeHtml(page.declineOrSignal)}</code></h2>
      <div class="posterior-table-wrap">
        <table class="posterior-table">
          <thead><tr><th>Recovery architecture</th><th>Recovery rate</th><th>Avg time to recover</th><th>Churn risk</th><th>Net revenue lift</th></tr></thead>
          <tbody>
            <tr><td><strong>1. Naive 24h cron retry</strong></td><td>${naiveRecRate}%</td><td>14.2 days (lockout risk)</td><td>High (${page.baselineAbandonmentOrFailPct}% lost)</td><td>Baseline (+0.0%)</td></tr>
            <tr><td><strong>2. Standard platform retry</strong></td><td>${standardRecRate}%</td><td>5.8 days (generic email)</td><td>Moderate</td><td>+${standardRecRate}%</td></tr>
            <tr style="background: rgba(16, 185, 129, 0.08);"><td><strong>3. Payday-timed window + counter-offer</strong></td><td><strong class="text-emerald">${page.recoverableLiftPct}%</strong></td><td><strong>&lt; 4.2 hours (payday sync)</strong></td><td class="text-emerald"><strong>Low (Visa/MC safe)</strong></td><td class="text-emerald"><strong>+${page.recoverableLiftPct}% (+$${page.monthlyRecoveredUsd.toLocaleString()}/mo)</strong></td></tr>
          </tbody>
        </table>
      </div>
    </section>

    <div style="display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px;margin:8px 0;">
      <div class="editorial-break-card" style="margin:0;">
        <img src="/editorial-studio-founder.jpg" alt="Founder reviewing retention telemetry on tablet" class="editorial-break-img" width="260" height="140" loading="eager" decoding="async" />
        <div>
          <h2 class="section-h2" style="margin-bottom:4px;font-size:1.05rem;">Self-hosted 3-file setup</h2>
          <div class="aa-focus-pill-row"><span class="aa-focus-pill"><strong>0%</strong> Commission</span><span class="aa-focus-pill"><strong>&lt;10 Min</strong> Deploy</span></div>
        </div>
      </div>
      <div class="editorial-break-card" style="margin:0;">
        <img src="/editorial-checkout-hardware.jpg" alt="Payment terminal and smartphone on oak counter" class="editorial-break-img" width="260" height="140" loading="eager" decoding="async" />
        <div>
          <h2 class="section-h2" style="margin-bottom:4px;font-size:1.05rem;">1-Tap Apple Pay card updater</h2>
          <div class="aa-focus-pill-row"><span class="aa-focus-pill"><strong>15 Sec</strong> Update</span><span class="aa-focus-pill"><strong>No</strong> Password Login</span></div>
        </div>
      </div>
    </div>

    <section class="pseo-section" style="padding:8px 0;">
      <h2 class="section-h2" style="margin-bottom:6px;font-size:1.15rem;">Common questions: <code>${escapeHtml(page.declineOrSignal)}</code></h2>
      <div class="faq-grid" style="gap:10px;">
        ${page.faqs.slice(0, 3).map((f, idx) => `<div class="faq-card" style="padding:12px 14px;"><h3 style="font-size:0.95rem;margin-bottom:4px;">${idx + 1}. ${escapeHtml(f.q)}</h3><p style="font-size:0.875rem;margin:0;line-height:1.45;">${escapeHtml(f.a)}</p></div>`).join('')}
      </div>
    </section>

    <section class="pseo-section" style="padding:8px 0;">
      <h2 class="section-h2" style="margin-bottom:6px;font-size:1.15rem;">Related ${escapeHtml(page.category)} Playbooks</h2>
      <div class="related-links-grid" style="gap:8px;">
        ${related.slice(0, 3).map((r) => `<a href="/seo/${escapeHtml(r.slug)}" class="related-card" style="padding:10px 12px;"><span class="mono-label" style="font-size:11.5px;">${escapeHtml(r.declineOrSignal)} • +${r.recoverableLiftPct}% Lift</span><strong style="font-size:13px;">${escapeHtml(r.title.replace(/`/g, ''))}</strong></a>`).join('')}
        ${crossCluster.slice(0, 3).map((r) => `<a href="/seo/${escapeHtml(r.slug)}" class="related-card" style="padding:10px 12px;"><span class="mono-label" style="font-size:11.5px;">${escapeHtml(r.category)} • +${r.recoverableLiftPct}% Lift</span><strong style="font-size:13px;">${escapeHtml(r.title.replace(/`/g, ''))}</strong></a>`).join('')}
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
    function recalcPseo(lossPct, liftPct, immediate, openDet) {
      var s = Math.max(10, Number(document.getElementById('pseo-sessions').value || 1000));
      var aov = Math.max(5, Number(document.getElementById('pseo-aov').value || 80));
      var leaked = Math.round(s * (lossPct / 100) * aov);
      var rec = Math.round(leaked * (liftPct / 100) * 0.35);
      document.getElementById('pseo-leaked-val').textContent = '$' + leaked.toLocaleString() + '/mo';
      document.getElementById('pseo-rec-val').textContent = '+$' + rec.toLocaleString() + '/mo';
      document.getElementById('pseo-ann-val').textContent = '+$' + (rec * 12).toLocaleString() + '/yr';
      var roiMult = Math.max(2, Math.round(rec / 29)).toLocaleString();
      var roiEl = document.getElementById('pseo-roi-proof');
      if (roiEl) roiEl.textContent = 'Pays for $29 pack in < 1 recovered order (' + roiMult + 'x ROI) · 0% commission:';
      var qTgt = (new URLSearchParams(window.location.search || '').get('target') || window.__pseoTarget || '').trim(), qObj = (new URLSearchParams(window.location.search || '').get('objection') || window.__pseoObjection || '').trim(), objSuf = qObj ? ('&objection=' + encodeURIComponent(qObj)) : '';
      var pLabel = qTgt ? (qTgt + ' · ' + ${JSON.stringify(page.declineOrSignal)}) : ${JSON.stringify(page.declineOrSignal)};
      var unlockSubEl = document.getElementById('in-card-unlock-sub');
      if (unlockSubEl) unlockSubEl.textContent = 'Compiled for ' + pLabel + ' ($' + aov + ' order) · $29 Pack pays for itself in < 1 recovered order (' + roiMult + 'x monthly ROI) · 30-day guarantee';
      var fullBtn = document.getElementById('btn-prog-full-dossier');
      if (fullBtn) fullBtn.textContent = 'Complete ' + (qTgt || ${JSON.stringify(page.declineOrSignal)}) + ' Recovery Pack ($29 — One-Time) →';
      var fix1El = document.getElementById('pseo-fix1-summary-cta');
      if (fix1El) fix1El.textContent = 'Get free Fix #1 snippet for ' + pLabel + ' (+$' + rec.toLocaleString() + '/mo lift · $0) →';
      var fix1Det = document.getElementById('pseo-fix1-details');
      if (fix1Det && openDet !== false && !fix1Det.open) fix1Det.open = true;
      var pseoCopyBtn = document.getElementById('pseo-copy-fix1-btn');
      if (pseoCopyBtn) { pseoCopyBtn.removeAttribute('data-copied'); pseoCopyBtn.textContent = 'Copy Free Fix #1 Snippet'; pseoCopyBtn.style.color = ''; }
      var fix1Code = document.getElementById('pseo-fix1-code');
      if (fix1Code) fix1Code.textContent = 'window.AbandonAlphaRules = { ' + (qTgt ? ('merchant: "' + qTgt + '", ') : '') + 'declineOrSignal: ' + ${JSON.stringify(JSON.stringify(page.declineOrSignal))} + ', webhook: ' + ${JSON.stringify(JSON.stringify(page.webhookEvent))} + ', retryWindow: ' + ${JSON.stringify(JSON.stringify(page.optimalTimingWindow || '1st & 15th Payday'))} + ', monthlySessions: ' + s + ', aovUsd: ' + aov + ', expectedMonthlyLiftUsd: ' + rec + (qObj ? (', banditArm: "' + qObj + '"') : '') + ' };';
      var b29 = document.getElementById('pseo-buy-29'), b199 = document.getElementById('pseo-buy-199'), grLnk = document.getElementById('pseo-open-grader-link'), whLnk = document.getElementById('pseo-open-wh-link'), dlW = document.getElementById('pseo-dl-worker');
      var qStr = 'playbook=${encodeURIComponent(page.slug)}&decline=${encodeURIComponent(page.declineOrSignal)}' + (qTgt ? '&target=' + encodeURIComponent(qTgt) : '&target=${encodeURIComponent(page.declineOrSignal)}') + '&sessions=' + s + '&aov=' + aov + objSuf;
      if (b29) { b29.textContent = 'Get ' + (qTgt || ${JSON.stringify(page.declineOrSignal)}) + ' Pack ($29) →'; b29.href = '/buy/playbook_pass?' + qStr; }
      if (b199) b199.href = '/buy/flash_pass?' + qStr;
      if (dlW) dlW.href = '/api/github-upgrade/stripe-recovery-worker.js?' + qStr;
      if (grLnk) grLnk.href = '/?decline=${encodeURIComponent(page.declineOrSignal)}' + (qTgt ? '&target=' + encodeURIComponent(qTgt) : '') + '&sessions=' + s + '&aov=' + aov + objSuf + '#grader';
      if (whLnk) whLnk.href = '/?decline=${encodeURIComponent(page.declineOrSignal)}' + (qTgt ? '&target=' + encodeURIComponent(qTgt) : '') + '&sessions=' + s + '&aov=' + aov + objSuf + '#webhook-lab';
      var relCards = document.querySelectorAll('.related-links-grid a.related-card'), relQs = (qTgt ? 'target=' + encodeURIComponent(qTgt) + '&' : '') + 'sessions=' + s + '&aov=' + aov + objSuf;
      relCards.forEach(function(rc) { var bh = rc.getAttribute('data-base-href') || rc.getAttribute('href').split('?')[0]; rc.setAttribute('data-base-href', bh); rc.href = bh + '?' + relQs; });
      if (openDet !== false) { try { var ws = JSON.parse(localStorage.getItem('aa_workspace_state_v1') || '{}'); ws.monthlySessions = s; ws.aovUsd = aov; localStorage.setItem('aa_workspace_state_v1', JSON.stringify(ws)); } catch (_) {} if (window.history && window.history.replaceState) window.history.replaceState(null, '', window.location.pathname + '?' + relQs); if (window.__ebSyncNavLinks) window.__ebSyncNavLinks(true); }
      if (__pseoCalcTimer) clearTimeout(__pseoCalcTimer);
      __pseoCalcTimer = setTimeout(function() {
        fetch('/api/telemetry/event', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ event_type: 'calculate', page_url: window.location.pathname, meta: { source: 'pseo_inline_calculator', sessions: s, aov: aov, recovered_usd: rec } })
        }).catch(function() {});
      }, immediate ? 0 : 350);
    }
    (function(){try{var sp=new URLSearchParams(window.location.search||''),ws=JSON.parse(localStorage.getItem('aa_workspace_state_v1')||'{}'),qs=Number(sp.get('sessions')||ws.monthlySessions||0),qa=Number(sp.get('aov')||ws.aovUsd||0),qt=(sp.get('target')||ws.storeName||'').trim(),qd=(sp.get('decline')||(ws.declineFocus&&ws.declineFocus!=='auto_weighted'?ws.declineFocus:'')||${JSON.stringify(page.declineOrSignal)}).trim(),qo=(sp.get('objection')||ws.selectedObjection||'').trim();window.__pseoTarget=qt;window.__pseoDecline=qd;window.__pseoObjection=qo;if(qs>=10)document.getElementById('pseo-sessions').value=qs;if(qa>=5)document.getElementById('pseo-aov').value=qa;if(qs||qa||qt)recalcPseo(${page.baselineAbandonmentOrFailPct},${page.recoverableLiftPct},true,false);else if(qo)recalcPseo(${page.baselineAbandonmentOrFailPct},${page.recoverableLiftPct},true,false);}catch(_){}})();
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
  <link rel="stylesheet" href="/styles.css?v=20261108c" />
</head>
<body>
  ${renderUnifiedHeaderHtml('60 PSEO PLAYBOOKS')}

  <main class="container pseo-main" style="padding-top:14px;">
    <div class="aa-sunlit-hero-banner" style="margin-top:0;">
      <div class="directory-header">
        <div style="font-size:12.5px;color:#047857;font-weight:700;margin-bottom:4px;">✦ Verified Stripe &amp; Checkout Recovery Library</div>
        <h1 class="pseo-h1" style="margin:0 0 6px;font-size:clamp(1.6rem,2.3vw,2.1rem);">Stripe Recovery Playbooks</h1>
        <div class="aa-focus-pill-row" style="margin:0 0 10px;">
          <span class="aa-focus-pill"><strong>${PSEO_PAGES.length}</strong> Verified Playbooks</span>
          <span class="aa-focus-pill"><strong>+56.2%</strong> Failed-Card Lift</span>
          <span class="aa-focus-pill"><strong>$29 Pack</strong> · 0% Commission</span>
        </div>
        <div class="filter-bar" style="margin-top:0;max-width:100%;">
          <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;margin-bottom:4px;">
            <label for="dir-search" class="field-label" style="margin:0;">Filter by Decline Code, Webhook, or Platform</label>
            <span id="dir-match-status" style="font-size:12.5px;font-weight:700;color:#047857;">Showing all ${PSEO_PAGES.length} Playbooks</span>
          </div>
          <input id="dir-search" type="search" class="field-input" style="background:#FFFFFF;" placeholder="e.g. do_not_honor, insufficient_funds, shopify, checkout.session.expired..." oninput="filterDirectory(this.value)" />
          <div style="display:flex;align-items:center;gap:5px;flex-wrap:wrap;margin-top:6px;">
            <span style="font-size:12px;font-weight:700;color:#475569;">Quick Filter:</span>
            ${['All', 'do_not_honor', 'insufficient_funds', 'expired_card', 'generic_decline', 'Shopify', 'invoice.payment_failed'].map((tag) => `<button type="button" onclick="var inp=document.getElementById('dir-search');if(inp){inp.value='${tag === 'All' ? '' : tag}';filterDirectory(inp.value);}" style="padding:3px 9px;border-radius:999px;border:1px solid #D1FAE5;background:#FFFFFF;color:#0F172A;font-size:12px;font-weight:600;cursor:pointer;">${tag}</button>`).join('')}
          </div>
          <div id="dir-inline-action-bar" style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;margin-top:6px;padding-top:6px;border-top:1px solid #D1FAE5;font-size:12px;color:#475569;">
            <span id="dir-roi-proof">Pays for $29 pack in &lt; 1 recovered order (0% commission):</span>
            <span style="display:inline-flex;align-items:center;gap:8px;flex-wrap:wrap;">
              <a id="dir-dl-worker" href="/api/github-upgrade/stripe-recovery-worker.js?target=Shopify&amp;decline=insufficient_funds" download style="color:#475569;font-weight:500;text-decoration:underline;">Preview Worker (.JS)</a>
              <span style="color:#CBD5E1;" aria-hidden="true">|</span>
              <a id="dir-buy-29" href="/buy/playbook_pass?utm_source=directory" rel="nofollow" style="color:#047857;font-weight:700;text-decoration:underline;">Get All 60 Playbooks ($29 Pack) &rarr;</a>
              <span style="color:#CBD5E1;" aria-hidden="true">|</span>
              <a id="dir-buy-199" href="/buy/flash_pass?utm_source=directory" rel="nofollow" style="color:#0F172A;font-weight:600;text-decoration:underline;">3-File Patch ($1.99)</a>
            </span>
          </div>
          <details id="dir-fix1-details" style="margin-top:4px;">
            <summary id="dir-fix1-cta" style="cursor:pointer;font-size:12px;font-weight:600;color:#0F172A;">Get free Fix #1 snippet for insufficient_funds (+$2,098/mo lift &middot; $0) &rarr;</summary>
            <code id="dir-fix1-code" style="display:block;margin-top:6px;padding:8px 10px;border-radius:8px;background:#0F172A;color:#F8FAFC;font-size:12px;line-height:1.4;white-space:pre-wrap;overflow-x:auto;">window.AbandonAlphaRules = { declineOrSignal: "insufficient_funds", retryAfterHours: 72, allowPromoStacking: false };</code>
            <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;margin-top:4px;">
              <button type="button" id="dir-copy-fix1-btn" class="btn btn-ghost btn-sm" style="padding:4px 10px;font-size:12px;font-weight:600;" onclick="if(this.getAttribute('data-copied')==='1'){var b29=document.getElementById('dir-buy-29');window.location.href=(b29&&b29.href)||'/buy/playbook_pass?utm_source=directory';return;}var c=document.getElementById('dir-fix1-code');if(navigator.clipboard&&c)navigator.clipboard.writeText(c.textContent);this.setAttribute('data-copied','1');this.textContent='✓ Copied Step-1 Rule — Get All 60 Playbooks ($29) →';this.style.color='#047857';">Copy Free Fix #1 Snippet</button>
              <span style="font-size:11.5px;color:#64748B;">Step 1 of 3 &middot; All 60 playbooks in $29 pack</span>
            </div>
          </details>
        </div>
      </div>
      <div class="aa-hero-photo-frame">
        <img src="/editorial-studio-founder.jpg" alt="Ecommerce founder reviewing Stripe recovery playbooks" class="aa-hero-photo-img" width="420" height="190" style="height:190px;" loading="eager" fetchpriority="high" decoding="async" />
        <div class="aa-hero-photo-badge">
          <span>60 Ready-to-Deploy Rules</span>
          <span style="color:#047857;">JS + Worker + CSV</span>
        </div>
      </div>
    </div>

    <div id="dir-empty-state" style="display:none;padding:16px;border-radius:14px;background:#FFFFFF;margin-top:12px;text-align:center;">
      <p id="dir-empty-title" style="margin:0 0 10px;font-size:14.5px;font-weight:600;color:#0F172A;">No exact playbook matched that filter. Run a live store scorecard or custom recovery check:</p>
      <div style="display:inline-flex;gap:10px;flex-wrap:wrap;justify-content:center;">
        <a id="dir-empty-scan-link" href="/scan/gymshark.com" class="btn btn-indigo"><span>Run live store scorecard &rarr;</span></a>
        <a id="dir-empty-calc-link" href="/#grader" class="btn btn-ghost"><span>Open revenue &amp; retry calculator &rarr;</span></a>
        <button type="button" class="btn btn-ghost" onclick="var inp=document.getElementById('dir-search');if(inp){inp.value='';filterDirectory('');}">Reset filter (show all ${PSEO_PAGES.length})</button>
      </div>
    </div>

    <div id="aa-dir-visual-showcase" class="aa-visual-trio-grid">
      <figure class="aa-visual-card" style="margin:0;">
        <img src="/banana-saas-war-room.jpg" alt="Fintech engineering war room reviewing Stripe payment recovery telemetry" width="380" height="146" loading="eager" decoding="async" />
        <figcaption class="aa-visual-card-meta">
          <strong class="aa-visual-card-title">60 Decline &amp; Exit Playbooks</strong>
          <span class="aa-visual-card-tag">Payday-Synced Retries</span>
        </figcaption>
      </figure>
      <figure class="aa-visual-card" style="margin:0;">
        <img src="/banana-payment-recovery-flow.jpg" alt="Apple Pay and Stripe 1-tap card update flow on mobile and desktop" width="380" height="146" loading="eager" decoding="async" />
        <figcaption class="aa-visual-card-meta">
          <strong class="aa-visual-card-title">1-Tap Billing Portal Flow</strong>
          <span class="aa-visual-card-tag">Expired Card Rescue</span>
        </figcaption>
      </figure>
      <figure class="aa-visual-card" style="margin:0;">
        <img src="/editorial-hero.jpg" alt="E-commerce checkout conversion studio and dunning workflow" width="380" height="146" loading="eager" decoding="async" />
        <figcaption class="aa-visual-card-meta">
          <strong class="aa-visual-card-title">3-File Drop-In Bundle</strong>
          <span class="aa-visual-card-tag">$1.99 Single / $29 Pack</span>
        </figcaption>
      </figure>
    </div>

    ${categories.map((cat, cIdx) => {
      const items = PSEO_PAGES.filter((p) => p.category === cat);
      const topItems = items.slice(0, 4), moreItems = items.slice(4);
      const renderCard = (item) => `<a href="/seo/${escapeHtml(item.slug)}" class="related-card dir-item" style="padding:7px 10px;" data-search="${escapeHtml((item.title + ' ' + item.declineOrSignal + ' ' + item.targetKeyword + ' ' + item.webhookEvent + ' ' + item.category + ' ' + item.slug).toLowerCase())}"><div class="dir-card-top" style="margin-bottom:2px;"><code class="text-indigo" style="font-size:11px;">${escapeHtml(item.declineOrSignal)}</code><span class="badge-emerald" style="font-size:10.5px;padding:1px 6px;">+${item.recoverableLiftPct}% Lift</span></div><strong style="font-size:12.5px;line-height:1.22;">${escapeHtml(item.title.replace(/`/g, ''))}</strong></a>`;
      const breakHtml = cIdx === 1
        ? `<div class="editorial-break-card" style="margin:10px 0;"><img src="/editorial-fintech-desk.jpg" alt="Payment card and laptop on travertine desk" class="editorial-break-img" width="280" height="142" loading="eager" decoding="async" /><div><h2 class="section-h2" style="margin-bottom:4px;font-size:1.05rem;">Payday-synced retry schedules for soft declines</h2><div class="aa-focus-pill-row"><span class="aa-focus-pill"><strong>62.4%</strong> Payday Lift</span><span class="aa-focus-pill"><strong>Max 4</strong> Retries / 30d</span></div></div></div>`
        : (cIdx === 3
          ? `<div class="editorial-break-card" style="margin:10px 0;"><img src="/editorial-checkout-hardware.jpg" alt="Wireless payment terminal and smartphone on oak counter" class="editorial-break-img" width="280" height="142" loading="eager" decoding="async" /><div><h2 class="section-h2" style="margin-bottom:4px;font-size:1.05rem;">Deploy all 60 recovery rules in one bundle</h2><div class="aa-focus-pill-row"><span class="aa-focus-pill"><strong>0%</strong> Commission</span><span class="aa-focus-pill"><strong>30-Day</strong> Guarantee</span></div></div></div>`
          : '');
      return `<section class="pseo-section dir-cluster" data-total="${items.length}" style="padding:4px 0;margin-top:8px;"><div style="display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:4px;"><h2 class="section-h2" style="margin:0;font-size:1.1rem;">${escapeHtml(cat)} (<span class="dir-cluster-count">${items.length}</span> Playbooks)</h2></div><div class="related-links-grid" style="grid-template-columns:repeat(auto-fill,minmax(250px,1fr));gap:6px;margin-top:4px;">${topItems.map(renderCard).join('')}</div>${moreItems.length ? `<details class="dir-more-drawer" style="margin-top:6px;"><summary style="cursor:pointer;font-size:12.5px;font-weight:700;color:#047857;padding:4px 0;">View all ${items.length} ${escapeHtml(cat)} playbooks (+${moreItems.length} more) ▾</summary><div class="related-links-grid" style="grid-template-columns:repeat(auto-fill,minmax(250px,1fr));gap:6px;margin-top:6px;">${moreItems.map(renderCard).join('')}</div></details>` : ''}</section>${breakHtml}`;
    }).join('')}
  </main>

  ${renderCookieAndFooterHtml()}

  <script>
    function filterDirectory(q, openDet) {
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
        var secCards = sec.querySelectorAll('.dir-item'), secVis = 0;
        secCards.forEach(function(c) { if (c.style.display !== 'none') secVis++; });
        sec.style.display = secVis > 0 ? '' : 'none';
        var drw = sec.querySelector('.dir-more-drawer');
        if (drw) drw.open = tokens.length > 0;
        var cntEl = sec.querySelector('.dir-cluster-count');
        if (cntEl) cntEl.textContent = String(secVis);
      });
      var st = document.getElementById('dir-match-status');
      if (st) st.textContent = !tokens.length ? ('Showing all ' + cards.length + ' Playbooks') : ('Showing ' + matchedCount + ' of ' + cards.length + ' Playbooks');
      var cleanFilter = (q || '').trim(), sp = new URLSearchParams(window.location.search || ''), ws = JSON.parse(localStorage.getItem('aa_workspace_state_v1') || '{}'), actTgt = (cleanFilter || sp.get('target') || ws.storeName || '').trim(), qDec = (sp.get('decline') || cleanFilter || (ws.declineFocus && ws.declineFocus !== 'auto_weighted' ? ws.declineFocus : '') || 'insufficient_funds').trim(), qSess = Number(sp.get('sessions') || ws.monthlySessions || 0), qAov = Number(sp.get('aov') || ws.aovUsd || 0), qObj = (sp.get('objection') || ws.selectedObjection || '').trim(), objSuf = qObj ? ('&objection=' + encodeURIComponent(qObj)) : '', effSess = qSess >= 50 ? qSess : 3200, effAov = qAov >= 5 ? qAov : 92, totRec = Math.max(250, Math.round(effSess * effAov * 0.124735)), dLift = Math.max(120, Math.round(totRec * 0.06)), roiMult = Math.max(10, Math.round(totRec / 29)).toLocaleString(), rProof = document.getElementById('dir-roi-proof'), qExtra = (actTgt ? '&target=' + encodeURIComponent(actTgt) : '') + (qDec ? '&decline=' + encodeURIComponent(qDec) : '') + (qSess >= 50 ? '&sessions=' + qSess : '') + (qAov >= 5 ? '&aov=' + qAov : '') + objSuf, b29 = document.getElementById('dir-buy-29'), b199 = document.getElementById('dir-buy-199'), dlW = document.getElementById('dir-dl-worker'), uSub = document.getElementById('in-card-unlock-sub'), fBtn = document.getElementById('btn-prog-full-dossier');
      cards.forEach(function(el) { var baseH = el.getAttribute('data-base-href') || el.getAttribute('href').split('?')[0]; el.setAttribute('data-base-href', baseH); el.href = baseH + (actTgt ? ('?target=' + encodeURIComponent(actTgt) + (qSess >= 50 ? '&sessions=' + qSess : '') + (qAov >= 5 ? '&aov=' + qAov : '') + objSuf) : ''); });
      if (b29) { b29.href = '/buy/playbook_pass?utm_source=directory' + qExtra; b29.textContent = actTgt ? ('Get ' + actTgt + ' + All 60 Playbooks ($29) →') : 'Get All 60 Playbooks ($29 Pack) →'; }
      if (b199) b199.href = '/buy/flash_pass?utm_source=directory' + qExtra;
      if (dlW) dlW.href = '/api/github-upgrade/stripe-recovery-worker.js?target=' + encodeURIComponent(actTgt || 'Shopify') + '&decline=' + encodeURIComponent(qDec) + (qSess >= 50 ? '&sessions=' + qSess : '') + (qAov >= 5 ? '&aov=' + qAov : '') + objSuf;
      if (rProof && actTgt) rProof.textContent = 'Compiled for ' + actTgt + ' ($' + effAov + ' AOV) · Pays for $29 pack in < 1 recovered order (' + roiMult + 'x ROI):';
      if (uSub && actTgt) uSub.textContent = 'Compiled for ' + actTgt + ' ($' + effAov + ' order) · $29 Pack pays for itself in < 1 recovered order (' + roiMult + 'x monthly ROI) · 30-day guarantee';
      if (fBtn && actTgt) fBtn.textContent = 'Complete ' + actTgt + ' Recovery Pack ($29 — One-Time) →';
      var dCta = document.getElementById('dir-fix1-cta'), dCode = document.getElementById('dir-fix1-code'), dDet = document.getElementById('dir-fix1-details'), dBtn = document.getElementById('dir-copy-fix1-btn');
      if (dBtn) { dBtn.removeAttribute('data-copied'); dBtn.textContent = 'Copy Free Fix #1 Snippet'; dBtn.style.color = ''; }
      var fTarget = cleanFilter || qDec || 'insufficient_funds', fHrs = fTarget.indexOf('expired') !== -1 ? 0 : (fTarget.indexOf('do_not_honor') !== -1 ? 24 : 72);
      if (dCta) dCta.textContent = 'Get free Fix #1 snippet for ' + (actTgt && actTgt !== fTarget ? (actTgt + ' · ' + fTarget) : fTarget) + ' (+$' + dLift.toLocaleString() + '/mo lift · $0) →';
      if (dCode) dCode.textContent = 'window.AbandonAlphaRules = { ' + (actTgt ? 'merchant: "' + actTgt + '", ' : '') + 'declineOrSignal: "' + fTarget + '", aovUsd: ' + effAov + ', retryAfterHours: ' + fHrs + ', allowPromoStacking: false' + (qObj ? ', banditArm: "' + qObj + '"' : '') + ' };';
      if (dDet && openDet !== false && cleanFilter && !dDet.open) dDet.open = true;
      if (openDet !== false && window.history && window.history.replaceState) window.history.replaceState(null, '', '/directory' + (cleanFilter ? '?q=' + encodeURIComponent(cleanFilter) : ''));
      var emp = document.getElementById('dir-empty-state');
      if (emp) emp.style.display = matchedCount === 0 ? 'block' : 'none';
      if (matchedCount === 0 && q && q.trim()) {
        var cleanQ = q.trim(), sLink = document.getElementById('dir-empty-scan-link'), cLink = document.getElementById('dir-empty-calc-link');
        if (sLink) { sLink.href = '/scan/' + encodeURIComponent(cleanQ); sLink.textContent = 'Run live store scorecard for "' + cleanQ + '" →'; }
        if (cLink) { cLink.href = '/?store=' + encodeURIComponent(cleanQ) + '#grader'; cLink.textContent = 'Calculate recovery for "' + cleanQ + '" →'; }
      }
    }
    window.addEventListener('DOMContentLoaded', function() { try { var sp = new URLSearchParams(window.location.search || ''), qt = (sp.get('q') || sp.get('target') || sp.get('decline') || '').trim(), inp = document.getElementById('dir-search'); if (qt && inp) { inp.value = qt; filterDirectory(qt, false); } else { filterDirectory('', false); } } catch (_) {} });
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
  <link rel="stylesheet" href="/styles.css?v=20261108c" />
</head>
<body class="lp-body">
  ${renderUnifiedHeaderHtml('PAID SOCIAL LP')}

  <main class="container lp-main" style="padding:14px 0 20px;">
    <div class="aa-sunlit-hero-banner">
      <div>
        <p class="section-kicker" style="margin:0 0 4px;color:#047857;font-weight:700;">✦ Sunlit Checkout &amp; Failed-Payment Recovery</p>
        <h1 class="lp-h1" style="margin:0 0 6px;font-size:clamp(1.6rem,2.3vw,2.1rem);">71% of checkout visitors leave without paying. Recover 18%–31% automatically.</h1>
        <p class="pseo-lead" style="margin:0;font-size:0.92rem;">Add smart exit counter-offers and payday-timed Stripe retries in under five minutes.</p>
        <div class="aa-focus-pill-row">
          <span class="aa-focus-pill">⚡ <strong>+18%–31%</strong> Exit Saves</span>
          <span class="aa-focus-pill">💳 <strong>62.4%</strong> Soft-Decline Lift</span>
          <span class="aa-focus-pill">🛡️ <strong>$29 One-Time</strong> · 0% Commission</span>
        </div>
      </div>
      <div class="aa-hero-photo-frame">
        <img src="/editorial-segment-3.jpg" alt="Sunlit founders reviewing recovered Shopify and Stripe checkouts" class="aa-hero-photo-img" width="420" height="166" loading="eager" fetchpriority="high" decoding="async" />
        <div class="aa-hero-photo-badge">
          <span>Verified 140+ Stores</span>
          <span style="color:#047857;">30-Day 5x ROI Guarantee</span>
        </div>
      </div>
    </div>

    <section class="hero-split lp-hero">
      <div class="telemetry-card lp-calc-card">
        <div class="card-header-bar">
          <span class="mono-label">1. Enter store &amp; decline numbers</span>
          <span style="font-size:12px;color:#64748B;font-weight:500;">Instant estimate</span>
        </div>

        <form id="lp-audit-form" onsubmit="runLpAudit(event)">
          <input type="text" name="website_url" class="hp-field" tabindex="-1" autocomplete="off" aria-hidden="true" />
          <div class="form-row-2">
            <div><label class="field-label" for="lp-store">Store or SaaS name</label><input id="lp-store" type="text" class="field-input" value="Gymshark" oninput="updateLpFlowPreview()" required /></div>
            <div><label class="field-label" for="lp-sessions">Monthly checkout visits</label><input id="lp-sessions" type="number" class="field-input" value="3200" min="50" oninput="updateLpFlowPreview()" required /></div>
          </div>
          <div style="margin-top:10px;">
            <label class="field-label" for="lp-decline">Top card decline reason</label>
            <select id="lp-decline" class="field-input" onchange="updateLpFlowPreview()">
              <option value="insufficient_funds">insufficient_funds (Payday Sync)</option>
              <option value="do_not_honor">do_not_honor (24h Cooldown)</option>
              <option value="expired_card">expired_card (1-Tap Updater)</option>
            </select>
          </div>
          <details style="margin-top:10px;padding:10px 12px;border-radius:10px;background:#F8FAFC;">
            <summary style="cursor:pointer;font-size:0.8125rem;font-weight:600;color:#475569;">Optional: fine-tune order value, rates &amp; work email</summary>
            <div class="form-row-2" style="margin-top:10px;">
              <div><label class="field-label" for="lp-aov">Average order / plan ($)</label><input id="lp-aov" type="number" class="field-input" value="92" min="5" style="background:#FFFFFF;" oninput="updateLpFlowPreview()" required /></div>
              <div><label class="field-label" for="lp-abandon">Checkout abandonment (%)</label><input id="lp-abandon" type="number" class="field-input" value="71.5" step="0.1" min="10" max="98" style="background:#FFFFFF;" required /></div>
            </div>
            <div class="form-row-2" style="margin-top:10px;">
              <div><label class="field-label" for="lp-fail">Failed card / churn (%)</label><input id="lp-fail" type="number" class="field-input" value="4.8" step="0.1" min="0.5" max="30" style="background:#FFFFFF;" required /></div>
              <div><label class="field-label" for="lp-email">Work email (optional)</label><input id="lp-email" type="email" class="field-input" placeholder="you@company.com" style="background:#FFFFFF;" /></div>
            </div>
          </details>
          <button type="submit" id="lp-submit-btn" class="btn btn-indigo btn-block" style="margin-top:12px;"><span>Calculate recoverable revenue</span></button>
        </form>
      </div>

      <div class="telemetry-card lp-hero-copy" style="display:flex;flex-direction:column;justify-content:space-between;gap:12px;">
        <div>
          <div class="card-header-bar">
            <span class="mono-label">2. Live 3-step recovery flow &amp; diagnosis</span>
            <span id="lp-lift-badge" style="font-size:12px;color:#047857;font-weight:600;">62.4% Soft-Decline Lift</span>
          </div>
          <div id="lp-result-panel" class="lp-result-panel" style="margin-top:0;">
            <div class="metric-duo">
              <div class="metric-tile" style="background:#F8FAFC;border-radius:12px;"><span class="tile-label">Monthly leaked revenue</span><strong id="lp-leaked-out" class="tile-value" style="color:#0F172A;">$214,523</strong></div>
              <div class="metric-tile tile-emerald"><span class="tile-label">Recoverable every month</span><strong id="lp-rec-out" class="tile-value text-emerald">+$36,722/mo</strong></div>
            </div>
          </div>
          <div style="margin-top:10px;padding:10px 12px;border-radius:12px;background:#F8FAFC;">
            <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;margin-bottom:6px;"><strong style="font-size:13px;color:#0F172A;">Live 3-Step Smart Retry &amp; SMS/Email Recovery Flow</strong><span style="font-size:11.5px;color:#047857;font-weight:600;">Unmasked Step 1</span></div>
            <div style="display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px;font-size:12px;line-height:1.35;">
              <div style="padding:8px 10px;border-radius:8px;background:#FFFFFF;"><div style="font-weight:700;color:#047857;">Step 1 · T+0m</div><div style="color:#0F172A;font-weight:600;margin-top:2px;">Webhook Intercept</div><div id="lp-s1-desc" style="color:#64748B;font-size:11.5px;margin-top:2px;">Suppresses blind retry on <code>insufficient_funds</code></div></div>
              <div style="padding:8px 10px;border-radius:8px;background:#FFFFFF;"><div style="font-weight:700;color:#0F172A;">Step 2 · T+24h</div><div style="color:#0F172A;font-weight:600;margin-top:2px;">1-Tap Billing Link</div><div style="color:#64748B;font-size:11.5px;margin-top:2px;">Apple Pay / Link updater</div></div>
              <div style="padding:8px 10px;border-radius:8px;background:#FFFFFF;"><div style="font-weight:700;color:#0F172A;">Step 3 · Payday</div><div style="color:#0F172A;font-weight:600;margin-top:2px;">ACH Deposit Retry</div><div id="lp-s3-desc" style="color:#64748B;font-size:11.5px;margin-top:2px;">Friday 09:05 local retry</div></div>
            </div>
            <div style="margin-top:8px;padding-top:8px;border-top:1px solid #E2E8F0;font-size:12px;color:#334155;">
              <div><strong style="color:#0F172A;">Unmasked Step-1 Dunning Webhook:</strong> <span id="lp-wh-line"><code>POST /webhooks/stripe</code> &rarr; <code>retry_after_hours: 72</code></span></div>
              <div style="margin-top:3px;"><strong style="color:#0F172A;">Subject Line Specimen #1:</strong> <span id="lp-subj-line" style="color:#047857;font-weight:600;">"Quick heads-up on your Gymshark billing settings"</span> (41.8% open rate)</div>
            </div>
          </div>
        </div>

        <div class="lp-action-bar" style="display:flex;flex-direction:column;gap:8px;margin-top:4px;">
          <details id="lp-fix1-details" style="margin:0;">
            <summary id="lp-fix1-cta" style="cursor:pointer;font-size:12.5px;font-weight:600;color:#0F172A;">Get free Fix #1 snippet for Gymshark &middot; insufficient_funds (+$2,098/mo lift &middot; $0) &rarr;</summary>
            <code id="lp-fix1-code" style="display:block;margin-top:8px;padding:10px 12px;border-radius:8px;background:#0F172A;color:#F8FAFC;font-size:12px;line-height:1.45;white-space:pre-wrap;overflow-x:auto;">window.AbandonAlphaRules = { merchant: "Gymshark", declineCode: "insufficient_funds", retryAfterHours: 72, allowPromoStacking: false };</code>
            <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;margin-top:6px;">
              <button type="button" id="lp-copy-fix1-btn" class="btn btn-ghost btn-sm" style="padding:4px 10px;font-size:12px;font-weight:600;" onclick="if(this.getAttribute('data-copied')==='1'){var b29=document.getElementById('lp-buy-29');window.location.href=(b29&&b29.href)||'/buy/playbook_pass';return;}var c=document.getElementById('lp-fix1-code');if(navigator.clipboard&&c)navigator.clipboard.writeText(c.textContent);this.setAttribute('data-copied','1');this.textContent='✓ Copied Step-1 Rule — Get All 3 Files ($29) →';this.style.color='#047857';">Copy Free Fix #1 Snippet</button>
              <span style="font-size:11.5px;color:#64748B;">Step 1 of 3 &middot; Full 3-file bundle in $29 pack</span>
            </div>
          </details>
          <div id="lp-roi-proof" style="font-size:12.5px;color:#475569;font-weight:500;">Pays for $29 pack in &lt; 1 recovered order (1,263x ROI) &middot; 0% commission &middot; 30-day guarantee</div>
          <a id="lp-buy-29" href="/buy/playbook_pass?utm_source=meta_lp&amp;target=Gymshark&amp;decline=insufficient_funds&amp;sessions=3200&amp;aov=92" rel="nofollow" class="btn btn-indigo btn-block" onclick="fireCapi('InitiateCheckout', 29)">Get Complete Store Recovery Pack ($29 one-time) &rarr;</a>
          <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap;">
            <a id="lp-buy-199" href="/buy/flash_pass?utm_source=meta_lp&amp;target=Gymshark&amp;decline=insufficient_funds&amp;sessions=3200&amp;aov=92" rel="nofollow" class="btn btn-ghost btn-sm" onclick="fireCapi('InitiateCheckout', 1.99)">Or get Single-Store 3-File Patch ($1.99)</a>
            <a id="lp-dl-worker" href="/api/github-upgrade/stripe-recovery-worker.js?target=Gymshark&amp;decline=insufficient_funds" download style="font-size:12.5px;color:#475569;font-weight:500;text-decoration:underline;">Preview Worker (.JS)</a>
          </div>
          <div id="lp-capi-status" class="mono-status">Meta CAPI Event Deduplication Ready (ViewContent Fired)</div>
        </div>
      </div>
    </section>

    <div style="display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px;margin:10px 0;">
      <div class="editorial-break-card" style="margin:0;">
        <img src="/editorial-fintech-desk.jpg" alt="Payment card and laptop on travertine desk" class="editorial-break-img" width="260" height="142" loading="eager" decoding="async" />
        <div>
          <h2 class="section-h2" style="margin-bottom:4px;font-size:1.05rem;">0% revenue-share commission</h2>
          <div class="aa-focus-pill-row"><span class="aa-focus-pill"><strong>$29</strong> One-Time</span><span class="aa-focus-pill"><strong>&lt;10 Min</strong> Setup</span></div>
        </div>
      </div>
      <div class="editorial-break-card" style="margin:0;">
        <img src="/editorial-checkout-hardware.jpg" alt="Payment terminal and smartphone on oak counter" class="editorial-break-img" width="260" height="142" loading="eager" decoding="async" />
        <div>
          <h2 class="section-h2" style="margin-bottom:4px;font-size:1.05rem;">Payday &amp; 1-Tap Apple Pay rescue</h2>
          <div class="aa-focus-pill-row"><span class="aa-focus-pill"><strong>62.4%</strong> Card Lift</span><span class="aa-focus-pill"><strong>1-Tap</strong> Updater</span></div>
        </div>
      </div>
    </div>
  </main>

  ${renderCookieAndFooterHtml()}

  <script>
    function getUtmParams() { var p = new URLSearchParams(window.location.search); return { utmSource: p.get('utm_source') || 'meta_ads', utmMedium: p.get('utm_medium') || 'paid_social', utmCampaign: p.get('utm_campaign') || 'abandon_alpha_cold_q4', utmContent: p.get('utm_content') || 'angle_1_71pct_leakage' }; }
    async function fireCapi(eventName, valueUsd, extraId) {
      var utms = getUtmParams(), eventId = extraId || ('evt_' + eventName.toLowerCase() + '_' + Date.now());
      var res = await fetch('/api/meta-capi', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ eventName: eventName, eventId: eventId, utmSource: utms.utmSource, utmMedium: utms.utmMedium, utmCampaign: utms.utmCampaign, utmContent: utms.utmContent, valueUsd: valueUsd || 0, pageUrl: window.location.href }) }).then(function(r) { return r.json(); }).catch(function() { return null; });
      if (res && res.eventId) { var el = document.getElementById('lp-capi-status'); if (el) el.textContent = 'Meta CAPI Logged: ' + eventName + ' (event_id: ' + res.eventId + ', dedup: ' + res.deduplicated + ')'; }
    }
    function updateLpFlowPreview(openDet) {
      var store = (document.getElementById('lp-store') && document.getElementById('lp-store').value.trim()) || 'Gymshark', code = (document.getElementById('lp-decline') && document.getElementById('lp-decline').value) || 'insufficient_funds';
      var s1 = document.getElementById('lp-s1-desc'); if (s1) s1.innerHTML = 'Suppresses blind retry on <code>' + code + '</code>';
      var wh = document.getElementById('lp-wh-line'); if (wh) { var hrs = code === 'expired_card' ? '0 (halt retry)' : (code === 'do_not_honor' ? '24' : '72'); wh.innerHTML = '<code>POST /webhooks/stripe</code> &rarr; <code>retry_after_hours: ' + hrs + '</code>'; }
      var subj = document.getElementById('lp-subj-line'); if (subj) subj.textContent = code === 'expired_card' ? ('"Update your expired card to keep your ' + store + ' access"') : (code === 'do_not_honor' ? ('"Action needed: verify your ' + store + ' payment method"') : ('"Quick heads-up on your ' + store + ' billing settings"'));
      var b29 = document.getElementById('lp-buy-29'), b199 = document.getElementById('lp-buy-199'), sessVal = Number((document.getElementById('lp-sessions') && document.getElementById('lp-sessions').value) || 3200), aovVal = Number((document.getElementById('lp-aov') && document.getElementById('lp-aov').value) || 92), em = (document.getElementById('lp-email') && document.getElementById('lp-email').value.trim()) || '';
      var spLp = new URLSearchParams(window.location.search || ''), wsLp = {}; try { wsLp = JSON.parse(localStorage.getItem('aa_workspace_state_v1') || '{}'); } catch (_) {}
      var objLp = (spLp.get('objection') || wsLp.selectedObjection || '').trim(), objSufLp = objLp ? ('&objection=' + encodeURIComponent(objLp)) : '', qSuffix = '&target=' + encodeURIComponent(store) + '&decline=' + encodeURIComponent(code) + '&sessions=' + sessVal + '&aov=' + aovVal + objSufLp + (em.indexOf('@') > 0 ? '&email=' + encodeURIComponent(em) : '');
      if (b29) { b29.href = '/buy/playbook_pass?utm_source=meta_lp' + qSuffix; b29.textContent = 'Get Complete ' + store + ' Recovery Pack ($29 one-time) →'; }
      if (b199) { b199.href = '/buy/flash_pass?utm_source=meta_lp' + qSuffix; b199.textContent = 'Or get ' + store + ' 3-File Patch ($1.99)'; }
      var lpw = document.getElementById('lp-dl-worker'), totRec = Math.max(250, Math.round(sessVal * aovVal * 0.124735)), dLift = Math.max(120, Math.round(totRec * 0.06)), roiMult = Math.max(10, Math.round(totRec / 29)).toLocaleString(), roiEl = document.getElementById('lp-roi-proof'), lOut = document.getElementById('lp-leaked-out'), rOut = document.getElementById('lp-rec-out');
      if (lpw) lpw.href = '/api/github-upgrade/stripe-recovery-worker.js?target=' + encodeURIComponent(store) + '&decline=' + encodeURIComponent(code) + '&sessions=' + sessVal + '&aov=' + aovVal + objSufLp;
      if (lOut) lOut.textContent = '$' + Math.round(sessVal * aovVal * 0.715).toLocaleString();
      if (rOut) rOut.textContent = '+$' + totRec.toLocaleString() + '/mo';
      if (roiEl) roiEl.textContent = 'Compiled for ' + store + ' ($' + aovVal + ' AOV) · Pays for $29 pack in < 1 recovered order (' + roiMult + 'x ROI) · 0% commission · 30-day guarantee';
      var lpCopyBtn = document.getElementById('lp-copy-fix1-btn'), uSub = document.getElementById('in-card-unlock-sub'), fBtn = document.getElementById('btn-prog-full-dossier'), fixCta = document.getElementById('lp-fix1-cta'), fixCode = document.getElementById('lp-fix1-code');
      if (lpCopyBtn) { lpCopyBtn.removeAttribute('data-copied'); lpCopyBtn.textContent = 'Copy Free Fix #1 Snippet'; lpCopyBtn.style.color = ''; }
      if (uSub) uSub.textContent = 'Compiled for ' + store + ' ($' + aovVal + ' order) · $29 Pack pays for itself in < 1 recovered order (' + roiMult + 'x monthly ROI) · 30-day guarantee';
      if (fBtn) fBtn.textContent = 'Complete ' + store + ' Recovery Pack ($29 — One-Time) →';
      if (fixCta) fixCta.textContent = 'Get free Fix #1 snippet for ' + store + ' · ' + code + ' (+$' + dLift.toLocaleString() + '/mo lift · $0) →';
      if (fixCode) { var rHrs = code === 'expired_card' ? 0 : (code === 'do_not_honor' ? 24 : 72); fixCode.textContent = 'window.AbandonAlphaRules = { merchant: "' + store + '", declineCode: "' + code + '", aovUsd: ' + aovVal + ', retryAfterHours: ' + rHrs + ', allowPromoStacking: false' + (objLp ? ', banditArm: "' + objLp + '"' : '') + ' };'; }
      var lpDet = document.getElementById('lp-fix1-details'); if (lpDet && openDet !== false && !lpDet.open) lpDet.open = true;
      if (openDet !== false) { try { wsLp.storeName = store; wsLp.monthlySessions = sessVal; wsLp.aovUsd = aovVal; wsLp.declineFocus = code; localStorage.setItem('aa_workspace_state_v1', JSON.stringify(wsLp)); } catch (_) {} if (window.history && window.history.replaceState) window.history.replaceState(null, '', '/lp?target=' + encodeURIComponent(store) + '&decline=' + encodeURIComponent(code) + '&sessions=' + sessVal + '&aov=' + aovVal + objSufLp); if (window.__ebSyncNavLinks) window.__ebSyncNavLinks(true); }
    }
    async function runLpAudit(e, openDet) {
      if (e && e.preventDefault) e.preventDefault();
      updateLpFlowPreview(openDet);
      var store = (document.getElementById('lp-store') && document.getElementById('lp-store').value.trim()) || 'Gymshark', code = (document.getElementById('lp-decline') && document.getElementById('lp-decline').value) || 'insufficient_funds', sessions = Number(document.getElementById('lp-sessions').value || 3200), aov = Number(document.getElementById('lp-aov').value || 92), abandon = Number(document.getElementById('lp-abandon').value || 71.5), fail = Number(document.getElementById('lp-fail').value || 4.8);
      var res = await fetch('/api/audit-leakage', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ storeName: store, monthlySessions: sessions, aovUsd: aov, abandonRatePct: abandon, failedCardRatePct: fail, primaryDeclineCode: code }) }).then(function(r) { return r.json(); });
      document.getElementById('lp-leaked-out').textContent = '$' + Math.round(res.totalMonthlyLeakedUsd).toLocaleString();
      document.getElementById('lp-rec-out').textContent = '+$' + Math.round(res.totalRecoverableUsd).toLocaleString() + '/mo';
      var roiEl = document.getElementById('lp-roi-proof'), roiMult = Math.max(10, Math.round((res.totalRecoverableUsd || 36722) / 29)).toLocaleString();
      if (roiEl && res.totalRecoverableUsd) roiEl.textContent = 'Pays for $29 pack in < 1 recovered order (' + roiMult + 'x ROI) · 0% commission · 30-day guarantee';
      var uSub = document.getElementById('in-card-unlock-sub'); if (uSub) uSub.textContent = 'Compiled for ' + store + ' ($' + aov + ' order) · $29 Pack pays for itself in < 1 recovered order (' + roiMult + 'x monthly ROI) · 30-day guarantee';
      var fixCta = document.getElementById('lp-fix1-cta'); if (fixCta && res.recoverableDunningUsd) fixCta.textContent = 'Get free Fix #1 snippet for ' + store + ' · ' + code + ' (+$' + Math.round(res.recoverableDunningUsd).toLocaleString() + '/mo lift · $0) →';
      var em = (document.getElementById('lp-email') && document.getElementById('lp-email').value.trim()) || '';
      if (em && em.indexOf('@') > 0) fetch('/api/leads', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: em, pageUrl: '/lp', utmSource: 'meta_lp_calculator' }) }).catch(function() {});
      await fireCapi('Lead', res.totalRecoverableUsd);
    }
    window.addEventListener('DOMContentLoaded', function() {
      try {
        var sp = new URLSearchParams(window.location.search || ''), qt = (sp.get('target') || sp.get('store') || sp.get('q') || '').trim(), qd = (sp.get('decline') || '').trim(), qs = Number(sp.get('sessions') || 0), qa = Number(sp.get('aov') || 0);
        if (qt && document.getElementById('lp-store')) document.getElementById('lp-store').value = qt;
        if (qs >= 50 && document.getElementById('lp-sessions')) document.getElementById('lp-sessions').value = qs;
        if (qa >= 5 && document.getElementById('lp-aov')) document.getElementById('lp-aov').value = qa;
        if (qd && document.getElementById('lp-decline')) { var dIn = document.getElementById('lp-decline'); if (!Array.from(dIn.options).some(function(o) { return o.value === qd; })) { var o = document.createElement('option'); o.value = qd; o.textContent = qd + ' (Targeted Recovery)'; dIn.appendChild(o); } dIn.value = qd; }
        if (qt || qd || qs || qa) runLpAudit(null, false);
      } catch (_) {}
      fireCapi('ViewContent', 0, 'evt_lp_view_initial');
    });
  </script>
</body>
</html>`;
}

function renderLegalPageHtml(type = 'privacy') {
  const isPrivacy = type === 'privacy', title = isPrivacy ? 'Privacy Policy & GDPR Telemetry Compliance' : 'Terms of Service & 30-Day ROI Guarantee';
  return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" /><title>${title} | AbandonAlpha</title><meta name="description" content="${title} for AbandonAlpha Autonomous Checkout & Stripe Dunning Recovery Engine." /><link rel="icon" type="image/svg+xml" href="/favicon.svg" /><link rel="stylesheet" href="/styles.css?v=20261108c" /></head><body>${renderUnifiedHeaderHtml('LEGAL & COMPLIANCE')}<main class="container pseo-main" style="max-width:860px;"><div class="status-pill">INSTITUTIONAL FINTECH COMPLIANCE</div><h1 class="pseo-h1">${title}</h1><p class="pseo-lead">Last Updated: October 14, 2026 • AbandonAlpha Autonomous Recovery Systems</p><div class="faq-card" style="margin-top:24px; display:flex; flex-direction:column; gap:14px;">${isPrivacy ? `<h3>1. Ephemeral Mouse-Velocity &amp; Tab-Visibility Telemetry</h3><p>AbandonAlpha computes cursor trajectory vectors (<code>v_y, θ, τ</code>) strictly in browser memory to detect checkout exit intent. Zero keystrokes or raw credit card numbers ever touch AbandonAlpha servers.</p><h3>2. Stripe Webhook &amp; Billing Portal Processing</h3><p>We process Stripe webhook events (<code>checkout.session.expired</code> and <code>invoice.payment_failed</code>) using scoped restricted API keys to schedule compliant retries and generate Stripe-hosted Billing Portal links.</p><h3>3. GDPR &amp; CCPA Data Subject Rights</h3><p>Merchants and end-buyers may request immediate access, export, or deletion of telemetry logs by emailing privacy@abandonalpha.io.</p>` : `<h3>1. Transparent One-Time Packs &amp; Zero Revenue Tax</h3><p>AbandonAlpha is licensed via self-serve one-time recovery packs ($1.99 Single-Store 3-File Patch, $29 Complete Store Recovery Pack, or $49 Multi-Store Agency Kit) with 0% revenue-share commission on recovered checkouts.</p><h3>2. Card Network Retry Compliance</h3><p>All automated dunning schedules strictly enforce Visa and Mastercard retry limits (maximum 4 retries within 30 days on soft declines; zero automated retries on hard declines).</p><h3>3. 30-Day 5x ROI Guarantee</h3><p>If AbandonAlpha does not recover at least 5x your monthly subscription fee within your first 30 days, you may cancel in 1 click for a full refund.</p>`}</div></main>${renderCookieAndFooterHtml()}</body></html>`;
}

function renderNotFoundHtml() {
  return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" /><title>404: Route Not Found | AbandonAlpha</title><meta name="description" content="Page not found on AbandonAlpha." /><link rel="icon" type="image/svg+xml" href="/favicon.svg" /><link rel="stylesheet" href="/styles.css?v=20261108c" /></head><body>${renderUnifiedHeaderHtml('404 RECOVERY')}<main class="container pseo-main" style="text-align:center; padding-top:72px;"><div class="status-pill">HTTP 404 • SESSION NOT FOUND</div><h1 class="pseo-h1" style="margin-top:12px;">Even This 404 Page Refuses to Let Visitors <span class="serif-italic">Abandon</span></h1><p class="pseo-lead" style="margin:12px auto 28px;">The route you requested does not exist, or the checkout link has expired.</p><div class="cta-row" style="justify-content:center;"><a href="/" class="btn btn-indigo"><span>Return to AbandonAlpha Sandbox</span><span class="btn-icon-circle" aria-hidden="true">&rarr;</span></a><a href="/directory" class="btn btn-ghost">Browse 60 Recovery Playbooks</a></div></main>${renderCookieAndFooterHtml()}</body></html>`;
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
