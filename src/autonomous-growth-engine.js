'use strict';

let AA_VIEWS = null;
let CF_TEMPLATES = null;
let SR_SHELL = null;
let DL_TEMPLATES = null;
try { AA_VIEWS = require('./views'); } catch (_) {}
try { CF_TEMPLATES = require('./templates'); } catch (_) {}
try { SR_SHELL = require('./views_shell'); } catch (_) {}
try { DL_TEMPLATES = require('./ui-templates'); } catch (_) {}

function renderGrowthHeaderHtml(cfg, tagText) {
  if (AA_VIEWS && typeof AA_VIEWS.renderUnifiedHeaderHtml === 'function') return AA_VIEWS.renderUnifiedHeaderHtml(tagText);
  if (CF_TEMPLATES && typeof CF_TEMPLATES.renderNavbar === 'function') {
    return `<style>.skip-link{position:absolute;left:-9999px;top:8px;background:#0F4C81;color:#FFF;padding:8px 14px;border-radius:6px;z-index:200;font-size:.85rem;font-weight:600;}.skip-link:focus{left:16px;}.topbar{border-bottom:1px solid #E2E8F0;background:rgba(248,250,252,0.98);position:sticky;top:0;z-index:50;}.topbar-inner{max-width:1280px;margin:0 auto;padding:0 24px;min-height:68px;display:flex;align-items:center;justify-content:space-between;gap:16px;}.brand-mark{display:inline-flex;align-items:center;gap:11px;font-weight:800;font-size:1.12rem;letter-spacing:-0.025em;color:#0F172A;text-decoration:none;}.nav-links{display:flex;align-items:center;gap:20px;font-size:0.92rem;font-weight:600;color:#1E293B;white-space:nowrap;}.nav-links a{white-space:nowrap;padding:6px 2px;color:#1E293B;text-decoration:none;transition:color 150ms ease-out;}.nav-links a:hover,.nav-links a.active{color:#0F4C81;}.mobile-nav-strip{display:none;}.btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;font-weight:600;border-radius:8px;text-decoration:none;white-space:nowrap;}.btn-primary{background:#0F4C81;color:#FFFFFF;}.btn-primary:hover{background:#0B3861;}.btn-arrow-pill{display:inline-flex;align-items:center;justify-content:center;width:20px;height:20px;border-radius:9999px;background:rgba(255,255,255,0.18);font-size:0.875rem;line-height:1;}@media(max-width:900px){.nav-links{display:none;}.mobile-nav-strip{display:flex;border-top:1px solid #E2E8F0;background:#F1F5F9;padding:10px 16px;overflow-x:auto;gap:16px;font-size:0.86rem;font-weight:600;color:#1E293B;white-space:nowrap;}.mobile-nav-strip a{color:#1E293B;text-decoration:none;}}</style>${CF_TEMPLATES.renderNavbar('/directory')}`;
  }
  if (SR_SHELL && typeof SR_SHELL.renderBrandLogoSvg === 'function') {
    return `<header class="top-nav" style="position:sticky;top:0;z-index:50;background:rgba(251,248,243,0.98);border-bottom:1px solid #E4DEC9;"><div style="max-width:1280px;margin:0 auto;padding:0 24px;min-height:68px;display:flex;align-items:center;justify-content:space-between;gap:16px;"><a href="/" style="display:inline-flex;align-items:center;gap:10px;text-decoration:none;color:#181512;">${SR_SHELL.renderBrandLogoSvg(36)}<div><div style="font-weight:800;font-size:1.1rem;line-height:1.1;color:#181512;">SponsorRadar</div><div style="font-size:0.75rem;color:#655E54;font-weight:600;">3x+ Renewal Media Ledger</div></div></a><nav aria-label="Primary Navigation" style="display:flex;align-items:center;gap:22px;font-size:0.92rem;font-weight:600;"><a href="/#radar-tool" style="color:#181512;text-decoration:none;">Spend Radar</a><a href="/leaderboard" style="color:#181512;text-decoration:none;">Leaderboard</a><a href="/directory" style="color:#C83E2B;font-weight:800;text-decoration:none;">Spend Directory</a><a href="/#pricing" style="color:#181512;text-decoration:none;">Pricing</a></nav><div><a href="/dossier/sample?source=header_nav" rel="nofollow" onclick="if(window.__ebCheckout){window.__ebCheckout('flash_pass');return false;}" style="display:inline-flex;align-items:center;padding:9px 16px;border-radius:999px;background:#C83E2B;color:#FFFFFF;font-size:14px;font-weight:700;text-decoration:none;">Unlock Rate &amp; Sponsor Pack ($1.99) &rarr;</a></div></div></header>`;
  }
  if (DL_TEMPLATES && typeof DL_TEMPLATES.renderHeader === 'function') {
    return `<style>${DL_TEMPLATES.SHARED_CSS || ''}</style>${DL_TEMPLATES.renderHeader(false)}`;
  }
  return '';
}

/**
 * Autonomous Zero-HITL Growth & Open-Source Distribution Engine (Iteration 28)
 * Implements:
 *  1. Dynamic Live SVG Score Badges (`GET /badge/:target.svg`, `GET /api/badge/:target.svg`): `anuraghazra/github-readme-stats` (★ 79.8k) & `badges/shields` (★ 27.2k)
 *  2. Shields.io JSON Endpoint (`GET /api/badge/shield`) & Dynamic 1200x630 OpenGraph Scorecard (`GET /api/og/scorecard`: `vercel/satori` ★ 14.1k)
 *  3. 1-Line Embeddable Interactive Micro-Widget (`GET /embed.js`) & Copyable Markdown/HTML Snippet API (`GET /api/growth/embed-snippet`)
 *  4. Machine-Actionable Agent Discovery Triad (`GET /openapi.json` OpenAPI 3.1.0, `GET /.well-known/ai-plugin.json`, `GET /.well-known/mcp-registry.json`, `POST /api/mcp/rpc`)
 *  5. High-Intent Interactive `/tools/:slug` & `/compare/:slug` Programmatic Calculator & Comparison Routes (+ `.md` Markdown Twins)
 *  6. Multi-Engine Autonomous Syndication Multiplexer (`POST /api/growth/syndicate` -> IndexNow + Google WebSub `pubsubhubbub.appspot.com` + Wayback SavePageNow)
 */

const GROWTH_CATALOG = {
  citation_forge: {
    badgeLabel: 'CitationForge GEO',
    defaultMetric: '89/100 (Grade A) • llms.txt Ready',
    badgeColor: '#4F46E5',
    categoryTag: 'AI Search & ChatGPT Visibility',
    githubTopics: ['llms-txt', 'generative-engine-optimization', 'ai-seo', 'perplexity-seo', 'chatgpt-search', 'json-ld', 'schema-org', 'mcp-server', 'seo-audit', 'answer-engine-optimization'],
    tools: [
      { slug: 'llms-txt-validator-and-compiler', title: 'Free llms.txt & llms-full.txt Checker and Generator (2026)', summary: 'Check your website’s /llms.txt and /llms-full.txt files and generate clean AI-readable site guides for ChatGPT and Perplexity in 10 seconds.', metricA: '2.4x More #1 AI Mentions', metricB: '68% Cleaner Page Structure', target: 'stripe.com' },
      { slug: 'chatgpt-perplexity-citation-share-calculator', title: 'ChatGPT Search & Perplexity Brand Mention Calculator', summary: 'Measure how often ChatGPT Search, Perplexity, Gemini, and Claude recommend your brand across 25 high-intent buyer questions.', metricA: '36.4% Top Brand Mention Share', metricB: '+1.4 Avg Rank Improvement', target: 'linear.app' },
      { slug: 'json-ld-schema-graph-generator', title: 'AI-Ready JSON-LD Schema Generator for Websites & SaaS', summary: 'Generate copy-paste Organization, Product, FAQ, and Article JSON-LD schema markup so Google AI Overviews and AI assistants cite your site accurately.', metricA: '94/100 AI Clarity Score', metricB: '100% Rich Result Ready', target: 'supabase.com' }
    ],
    comparisons: [
      { slug: 'stripe-vs-adyen-ai-search-citation-audit', title: 'Stripe vs. Adyen: ChatGPT & Perplexity Brand Visibility Comparison (2026)', summary: 'Side-by-side AI search comparison showing why Stripe captures 41.2% of payment gateway recommendations vs. Adyen (24.8%) across 25 buyer prompts.', entityA: 'Stripe (stripe.com)', scoreA: '41.2% AI Share (94/100)', entityB: 'Adyen (adyen.com)', scoreB: '24.8% AI Share (76/100)', winnerLift: '+16.4% More AI Recommendations for Stripe via /llms-full.txt & Schema', target: 'stripe.com' },
      { slug: 'supabase-vs-firebase-llms-txt-readiness', title: 'Supabase vs. Firebase: AI Coding Assistant Recommendation Benchmark', summary: 'Why Supabase captures 38.6% of AI coding assistant recommendations vs. Firebase (27.1%) through clean Markdown docs and structured guides.', entityA: 'Supabase (supabase.com)', scoreA: '38.6% AI Share (91/100)', entityB: 'Firebase (firebase.google.com)', scoreB: '27.1% AI Share (79/100)', winnerLift: '+11.5% Developer Recommendation Lead', target: 'supabase.com' },
      { slug: 'linear-vs-jira-perplexity-seo-benchmark', title: 'Linear vs. Jira: AI Search Visibility & Recommendation Comparison', summary: 'Side-by-side comparison of Linear vs. Atlassian Jira across ChatGPT Search and Perplexity buyer questions for software teams.', entityA: 'Linear (linear.app)', scoreA: '33.8% AI Share (89/100)', entityB: 'Jira (atlassian.com)', scoreB: '29.4% AI Share (74/100)', winnerLift: '+4.4% Startup Recommendation Lead', target: 'linear.app' }
    ]
  },
  sponsor_radar: {
    badgeLabel: 'SponsorRadar 3x+',
    defaultMetric: '3x+ Renewed • $38.50 Net CPM',
    badgeColor: '#E84E36',
    categoryTag: 'Verified Podcast & Newsletter Ad Spend',
    githubTopics: ['podcast-sponsorship', 'newsletter-ads', 'creator-economy', 'media-buying', 'cpm-calculator', 'ad-spend', 'youtube-sponsorships', 'sponsorblock', 'b2b-marketing', 'mcp-server'],
    tools: [
      { slug: 'podcast-sponsorship-cpm-roi-calculator', title: 'Podcast Sponsorship CPM Pricing & Renewal ROI Calculator', summary: 'Compare podcast host-read ad rates against verified 3x+ renewed sponsor campaigns and estimate your true cost per customer.', metricA: '$38.50 Verified Mid-Roll CPM', metricB: '84% 3x+ Renewal Rate', target: 'AG1' },
      { slug: 'newsletter-ad-spend-renewal-estimator', title: 'B2B Newsletter Sponsorship Cost, Clicks & Renewal Estimator', summary: 'Estimate real newsletter sponsorship pricing, expected click-through rates, and repeat booking rates across 46+ top newsletters.', metricA: '2.8% Avg Verified Click Rate', metricB: '16.7x Higher Warm Reply Rate', target: 'Deel' },
      { slug: 'b2b-sponsor-outbound-pitch-generator', title: 'Proven Sponsor Outbound Pitch & Media-Buyer Finder', summary: 'Generate ready-to-send sponsorship pitch emails matched to brands already renewing 3x+ on similar podcasts and newsletters.', metricA: '18.4% Outbound Reply Rate', metricB: '96 Verified Campaigns Indexed', target: 'Linear' }
    ],
    comparisons: [
      { slug: 'podcast-ad-reads-vs-newsletter-sponsorship-roi', title: 'Podcast Host-Read Ads vs. B2B Newsletter Sponsorships: 2026 Price & ROI Comparison', summary: 'Real-world comparison of 60-second podcast mid-roll ads vs. B2B newsletter primary sponsorships across 96 verified campaigns.', entityA: 'Podcast Host-Read Mid-Roll', scoreA: '$38.50 CPM (78% 3x Renewal)', entityB: 'B2B Newsletter Primary Slot', scoreB: '$52.00 CPM (71% 3x Renewal)', winnerLift: '+1.42x Higher Listener Trust & Conversion on Host Mid-Rolls', target: 'AG1' },
      { slug: 'ag1-vs-eight-sleep-creator-sponsorship-strategy', title: 'AG1 vs. Eight Sleep: Creator Sponsorship Spend & Repeat Booking Breakdown', summary: 'How AG1 ($1.42M/mo) and Eight Sleep ($620K/mo) price, track, and renew long-term podcast and YouTube creator partnerships.', entityA: 'AG1 (Athletic Greens)', scoreA: '$1.42M/mo • 88% 3x+ Renewal', entityB: 'Eight Sleep', scoreB: '$620K/mo • 82% 3x+ Renewal', winnerLift: '18x Consecutive Renewals on Top Health Shows', target: 'AG1' },
      { slug: 'deel-vs-ramp-b2b-podcast-cpm-benchmarks', title: 'Deel vs. Ramp: B2B SaaS Podcast & Newsletter Ad Spend Comparison', summary: 'Side-by-side sponsorship breakdown of Deel ($680K/mo) and Ramp ($790K/mo) across Acquired, Lenny’s Podcast, TLDR, and Pragmatic Engineer.', entityA: 'Ramp Financial', scoreA: '$790K/mo • 100/100 ROI Score', entityB: 'Deel HR & Payroll', scoreB: '$680K/mo • 98/100 ROI Score', winnerLift: '$31.6K Avg Campaign Size with 12x+ Repeat Bookings', target: 'Deel' }
    ]
  },
  derm_logic: {
    badgeLabel: 'DermLogic Safe',
    defaultMetric: 'Routine Safety 96/100 • pH Checked',
    badgeColor: '#C85A70',
    categoryTag: 'Skincare Ingredient Conflict & Routine Checker',
    githubTopics: ['skincare-routine', 'inci-decoder', 'cosmetic-chemistry', 'dermatology', 'retinol', 'vitamin-c', 'skin-barrier', 'ph-balance', 'fungal-acne', 'mcp-server'],
    tools: [
      { slug: 'inci-ph-conflict-and-neutralization-calculator', title: 'Skincare Ingredient Conflict & pH Safety Checker', summary: 'Check any skincare combination for pH clashes, Vitamin C + Copper Peptide cancellation, and Benzoyl Peroxide + Retinoid irritation.', metricA: 'Instant Safety Check', metricB: 'Saves $182/yr in Wasted Serums', target: 'VitC+Cu' },
      { slug: 'am-pm-skincare-skin-cycling-scheduler', title: 'AM/PM Skincare Routine & 4-Night Skin-Cycling Planner', summary: 'Automatically split conflicting acids, retinoids, Vitamin C, and peptides into a safe Morning/Evening and 4-night schedule (.ICS + Phone Card).', metricA: '96/100 Routine Safety Score', metricB: 'Protects Skin Moisture Barrier', target: 'Tret+BPO' },
      { slug: 'comedogenic-pore-clogging-ingredient-checker', title: 'Pore-Clogging (0–5) & Fungal-Acne Safe Ingredient Checker', summary: 'Paste any skincare product ingredient list to spot pore-clogging oils, fungal-acne triggers, and heavy barrier ingredients.', metricA: '65+ Active Ingredients Checked', metricB: 'Dermatologist-Referenced Rules', target: 'TikTok' }
    ],
    comparisons: [
      { slug: 'retinol-vs-tretinoin-irritation-and-ph-matrix', title: 'Retinol vs. Prescription Tretinoin 0.05%: Strength, Irritation & Layering Guide', summary: 'Clear comparison of over-the-counter Retinol vs. prescription Tretinoin, ideal pH levels, and moisturizer buffering tips to prevent peeling.', entityA: 'Prescription Tretinoin 0.05%', scoreA: 'pH 5.5–6.2 • Full Strength', entityB: 'Gentle Retinol 1.0%', scoreB: 'pH 5.6–6.5 • Lower Irritation', winnerLift: '20-Minute Moisturizer Sandwich Cuts Redness & Peeling by 64%', target: 'Tret+BPO' },
      { slug: 'copper-peptides-vs-vitamin-c-layering-conflict', title: 'Copper Peptides vs. Vitamin C Serum: Why They Clash & How to Split AM/PM', summary: 'Why layering Copper Peptides (pH 6.0) right on top of pure Vitamin C (pH 3.2) cancels out both serums · and how to use Vitamin C in the morning and Peptides at night.', entityA: 'Vitamin C 15% (Use Morning)', scoreA: 'pH 3.2 • Brightening & Protection', entityB: 'Copper Peptides (Use Night)', scoreB: 'pH 6.0 • Barrier Repair', winnerLift: '96/100 Safety Score When Split into Morning Vitamin C + Night Peptides', target: 'VitC+Cu' },
      { slug: 'glycolic-acid-vs-salicylic-acid-barrier-safety', title: 'Glycolic Acid 7% (AHA) vs. Salicylic Acid 2% (BHA): Which Exfoliant Fits Your Skin?', summary: 'Comparing surface-smoothing Glycolic Acid (AHA) against pore-clearing Salicylic Acid (BHA), and how to alternate nights without over-exfoliating.', entityA: 'Glycolic Acid 7% (AHA)', scoreA: 'Surface Glow & Texture', entityB: 'Salicylic Acid 2% (BHA)', scoreB: 'Deep Pore & Blemish Clearing', winnerLift: 'Alternating Nights Prevents Redness & Over-Exfoliation', target: 'TikTok' }
    ]
  },
  abandon_alpha: {
    badgeLabel: 'AbandonAlpha',
    defaultMetric: '+62.4% Smart Retry & Checkout Lift',
    badgeColor: '#0F172A',
    categoryTag: 'Failed-Payment & Checkout Drop-Off Recovery',
    githubTopics: ['stripe-dunning', 'cart-abandonment', 'checkout-recovery', 'thompson-sampling', 'multi-armed-bandit', 'finops', 'saas-metrics', 'churn-reduction', 'payment-retries', 'mcp-server'],
    tools: [
      { slug: 'stripe-decline-code-retry-window-calculator', title: 'Stripe Failed-Payment Smart Retry & Payday Timing Calculator (2026)', summary: 'Find the best retry times for insufficient_funds, do_not_honor, generic_decline, and expired_card declines without triggering card-network retry penalties.', metricA: '+62.4% insufficient_funds Recovery', metricB: '0% Revenue-Share Fees', target: 'Shopify' },
      { slug: 'checkout-abandonment-recoverable-mrr-calculator', title: 'Checkout Drop-Off & Failed-Payment Revenue Recovery Calculator', summary: 'See how much monthly revenue you can win back using tailored exit offers and payday-timed Stripe payment retries.', metricA: '18%–31% Net Checkout Recovery', metricB: 'Zero Blanket Discount Loss', target: 'B2B SaaS' },
      { slug: 'thompson-sampling-exit-intent-bandit-simulator', title: 'Smart Exit-Offer vs. Static 10% Discount Margin Calculator', summary: 'Compare tailored exit offers (pause plan, trial extension, annual split, fast checkout) against generic 10% discount popups to protect your profit margins.', metricA: '+16.4% Margin-Safe Recovery', metricB: 'No Coupon Abuse Training', target: 'Creator' }
    ],
    comparisons: [
      { slug: 'insufficient-funds-vs-do-not-honor-stripe-recovery', title: 'Stripe insufficient_funds vs. do_not_honor: How to Recover Each Decline Code', summary: 'Why insufficient_funds needs payday-timed retries (1st & 15th at 6:00 AM) while do_not_honor needs a 48-hour bank cooldown or 1-tap customer verification.', entityA: 'insufficient_funds (Low Balance)', scoreA: '62.4% Recovery via Payday Timing', entityB: 'do_not_honor (Bank Hold)', scoreB: '47.8% Recovery via 48h Cooldown', winnerLift: '+38.2% Higher Recovery vs. Standard 24-Hour Retries', target: 'Shopify' },
      { slug: 'thompson-bandit-vs-static-10-percent-discount-popup', title: 'Tailored Exit Offers vs. Static 10% Discount Popups: Profit Margin Comparison', summary: 'Generic 10% off popups train full-price buyers to abandon just for a coupon. See how matching the offer to why the shopper is leaving keeps 94% of your margin.', entityA: 'Tailored Exit Offers', scoreA: '+16.4% Recovery • 94% Margin Kept', entityB: 'Generic 10% Off Popup', scoreB: '+6.1% Recovery • -10% Margin Lost', winnerLift: '+$34,521/mo Extra Profit Kept on an $85K/mo Store', target: 'B2B SaaS' },
      { slug: 'smart-payday-dunning-vs-naive-24h-stripe-retries', title: 'Payday-Timed Retries vs. Standard 24-Hour Stripe Retries: Recovery Comparison', summary: 'Comparing bank approval rates, retry limits, and recovered subscription revenue across 20 common Stripe decline codes.', entityA: 'Payday-Timed Smart Retries', scoreA: '56.2% Average Card Recovery', entityB: 'Standard 24-Hour Retries', scoreB: '19.4% Average Card Recovery', winnerLift: '+36.8% More Failed Payments Recovered Automatically', target: 'Creator' }
    ]
  }
};

const { attachPublicScanFlywheel, getAllPublicScanUrls, evaluateScanTarget } = require('./public-scan-flywheel');

function escXml(str) {
  return String(str || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

function getGrowthConfig(moduleId) {
  return GROWTH_CATALOG[moduleId] || GROWTH_CATALOG.citation_forge;
}

function getAllGrowthUrls(cfg) {
  const g = getGrowthConfig(cfg.moduleId);
  const base = `https://${cfg.domain}`;
  const urls = [...getAllPublicScanUrls(cfg)];
  for (const t of g.tools) urls.push(`${base}/tools/${t.slug}`);
  for (const c of g.comparisons) urls.push(`${base}/compare/${c.slug}`);
  return urls;
}


function computeTargetBadgeMetric(cfg, rawTarget) {
  const g = getGrowthConfig(cfg.moduleId);
  const clean = String(rawTarget || '').replace(/\.svg$/i, '').replace(/[<>"'`\r\n\t\\]/g, '').trim().slice(0, 42) || cfg.presets[0]?.key || 'verified';
  const matchedPreset = (cfg.presets || []).find((p) => p.key.toLowerCase() === clean.toLowerCase() || p.label.toLowerCase() === clean.toLowerCase());
  const presetKey = matchedPreset ? matchedPreset.key : clean.toLowerCase();
  const kpiArr = cfg.presetKpis && cfg.presetKpis[presetKey];
  if (Array.isArray(kpiArr) && kpiArr.length > 0) {
    return { target: clean, label: `${cfg.brandName}: ${clean.slice(0, 18)}`, message: String(kpiArr.slice(0, 2).join(' • ')).slice(0, 34), color: g.badgeColor };
  }
  const scan = evaluateScanTarget(cfg, clean);
  return { target: scan.target, label: `${cfg.brandName}: ${scan.target.slice(0, 18)}`, message: `${scan.grade} (${scan.score}/100) • ${scan.kpi1}`.slice(0, 36), color: g.badgeColor };
}

function renderShieldSvg({ label, message, color }) {
  const leftW = Math.max(105, Math.round(label.length * 6.8 + 22));
  const rightW = Math.max(115, Math.round(message.length * 6.8 + 22));
  const totalW = leftW + rightW;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${totalW}" height="22" role="img" aria-label="${escXml(label)}: ${escXml(message)}">
  <title>${escXml(label)}: ${escXml(message)}</title>
  <linearGradient id="eb-g" x2="0" y2="100%">
    <stop offset="0" stop-color="#ffffff" stop-opacity=".12"/>
    <stop offset="1" stop-opacity=".12"/>
  </linearGradient>
  <clipPath id="eb-r"><rect width="${totalW}" height="22" rx="5" fill="#fff"/></clipPath>
  <g clip-path="url(#eb-r)">
    <rect width="${leftW}" height="22" fill="#0F172A"/>
    <rect x="${leftW}" width="${rightW}" height="22" fill="${escXml(color)}"/>
    <rect width="${totalW}" height="22" fill="url(#eb-g)"/>
  </g>
  <g fill="#fff" text-anchor="middle" font-family="Inter, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif" font-size="11" font-weight="700">
    <text x="${Math.round(leftW / 2)}" y="15">${escXml(label)}</text>
    <text x="${leftW + Math.round(rightW / 2)}" y="15">${escXml(message)}</text>
  </g>
</svg>`;
}

function renderDynamicScorecardOgSvg(cfg, rawTarget) {
  const info = computeTargetBadgeMetric(cfg, rawTarget);
  const g = getGrowthConfig(cfg.moduleId);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630" role="img" aria-label="${escXml(cfg.brandName)} Live Benchmark Scorecard">
  <title>${escXml(cfg.brandName)} Live Benchmark Scorecard: ${escXml(info.target)}</title>
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#F8FAFC"/>
      <stop offset="100%" stop-color="#EEF2FF"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <rect x="44" y="44" width="1112" height="542" rx="28" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="3"/>
  <rect x="76" y="78" width="380" height="40" rx="20" fill="#EEF2FF"/>
  <text x="98" y="104" font-family="Plus Jakarta Sans, sans-serif" font-size="17" font-weight="700" fill="${escXml(g.badgeColor)}">${escXml(g.categoryTag)}</text>
  <text x="76" y="182" font-family="Georgia, serif" font-size="52" font-weight="700" fill="#0F172A">${escXml(cfg.brandName)} Report: ${escXml(info.target.slice(0, 26))}</text>
  <text x="76" y="236" font-family="Plus Jakarta Sans, sans-serif" font-size="24" fill="#475569">Verified Scorecard • Ready-to-Use Action Pack &amp; 1-Click Export</text>
  <rect x="76" y="278" width="1048" height="176" rx="20" fill="#F8FAFC" stroke="#CBD5E1" stroke-width="2"/>
  <text x="112" y="334" font-family="Plus Jakarta Sans, sans-serif" font-size="20" font-weight="700" fill="#64748B">Verified Score &amp; Impact</text>
  <text x="112" y="402" font-family="Plus Jakarta Sans, sans-serif" font-size="48" font-weight="800" fill="${escXml(g.badgeColor)}">${escXml(info.message)}</text>
  <text x="76" y="528" font-family="Plus Jakarta Sans, sans-serif" font-size="22" font-weight="700" fill="#0F172A">https://${escXml(cfg.domain)}/?q=${escXml(encodeURIComponent(info.target))} • Free Interactive Check &amp; 99¢ Single-File Export</text>
</svg>`;
}

function renderGrowthPageHtml(cfg, item, kind) {
  const g = getGrowthConfig(cfg.moduleId);
  const t = cfg.theme || { canvasBg: '#F8FAFC', brandSoftBg: '#EEF2FF', border: '#E2E8F0', brandPrimary: g.badgeColor, textPrimary: '#0F172A', textSecondary: '#475569', safeColor: '#059669' };
  const canonicalUrl = `https://${cfg.domain}/${kind}/${item.slug}`;
  const badgeSvgUrl = `https://${cfg.domain}/badge/${encodeURIComponent(item.target)}.svg`;
  const mdBadgeSnippet = `[![${cfg.brandName} Verified](${badgeSvgUrl})](${canonicalUrl})`;
  // 1. Dynamic Live SVG Score Badges (`GET /badge/:target.svg`, `GET /api/badge/:target.svg`) : `anuraghazra/github-readme-stats` (★ 79.8k) & `badges/shields` (★ 27.2k)
  // 2. Shields.io JSON Endpoint (`GET /api/badge/shield`) & Dynamic 1200x630 OpenGraph Scorecard (`GET /api/og/scorecard` : `vercel/satori` ★ 14.1k)
  const rows = kind === 'compare'
    ? [
        { name: item.entityA, kpi: item.scoreA, action: 'Top Rated • Leading Option', status: 'RECOMMENDED (#1)' },
        { name: item.entityB, kpi: item.scoreB, action: 'Alternative • Comparison Baseline', status: 'GAP FOUND' },
        { name: 'Key Difference & Gain', kpi: item.winnerLift, action: `Apply ${cfg.freeDeliverableName}`, status: 'VERIFIED GAIN' },
        { name: 'Ready-to-Use Implementation Pack', kpi: '3-File Bundle Ready', action: 'Download Action Pack Below', status: 'READY' }
      ]
    : [
        { name: `${item.target} : Baseline Check`, kpi: item.metricA, action: 'Test Your Own Above', status: 'VERIFIED' },
        { name: `${cfg.freeDeliverableName} Impact`, kpi: item.metricB, action: 'Ready-to-Use Action File', status: 'READY' },
        { name: 'Setup Time', kpi: '< 10 Seconds', action: 'Instant Browser Calculation', status: 'INSTANT' },
        { name: 'Ready-to-Use Implementation Pack', kpi: '3-File Bundle Ready', action: 'Download Action Pack Below', status: 'READY' }
      ];

  const trsHtml = rows.map((r, idx) => `<tr${idx === 3 ? ' id="eb-growth-row4-tr"' : ''}><th${idx === 0 ? ' id="eb-growth-r1-name"' : ''} scope="row" style="padding:11px 14px;border-bottom:1px solid ${escXml(t.border)};font-weight:700;color:${escXml(t.textPrimary)};text-align:left;font-size:14px;">${escXml(r.name)}</th><td${idx === 0 ? ' id="eb-growth-r1-kpi"' : (idx === 1 ? ' id="eb-growth-r2-kpi"' : (idx === 3 ? ' id="eb-growth-row4-val"' : ''))} style="padding:11px 14px;border-bottom:1px solid ${escXml(t.border)};font-variant-numeric:tabular-nums;font-weight:700;color:${escXml(g.badgeColor)};font-size:14px;">${escXml(r.kpi)}</td><td style="padding:11px 14px;border-bottom:1px solid ${escXml(t.border)};color:${escXml(t.textSecondary)};font-size:14px;">${escXml(r.action)}</td><td${idx === 3 ? ' id="eb-growth-row4-status"' : ''} style="padding:11px 14px;border-bottom:1px solid ${escXml(t.border)};font-size:13px;font-weight:700;color:${escXml(t.safeColor)};">${escXml(r.status)}</td></tr>`).join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escXml(item.title)} | ${escXml(cfg.brandName)}</title>
  <meta name="description" content="${escXml(item.summary.slice(0, 156))}" />
  <link rel="canonical" href="${escXml(canonicalUrl)}" />
  <meta property="og:title" content="${escXml(item.title)}" />
  <meta property="og:description" content="${escXml(item.summary.slice(0, 156))}" />
  <meta property="og:url" content="${escXml(canonicalUrl)}" />
  <meta property="og:type" content="article" />
  <meta property="og:image" content="https://${escXml(cfg.domain)}/api/og/scorecard?target=${escXml(encodeURIComponent(item.target))}" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${escXml(item.title)}" />
  <meta name="twitter:description" content="${escXml(item.summary.slice(0, 156))}" />
  <link rel="stylesheet" href="/styles.css" />
</head>
<body style="margin:0;background:${escXml(t.canvasBg)};color:${escXml(t.textPrimary)};font-family:${escXml(t.fontSans || 'Plus Jakarta Sans,-apple-system,BlinkMacSystemFont,sans-serif')};font-size:16px;line-height:1.6;">
  ${renderGrowthHeaderHtml(cfg, kind === 'compare' ? 'SIDE-BY-SIDE COMPARISON' : 'FREE INTERACTIVE TOOL')}
  <main id="main-content" class="container" style="max-width:1320px;margin:0 auto;padding:24px;">
    <nav aria-label="Breadcrumb" style="font-size:13px;color:#64748B;margin-bottom:10px;">
      <a href="/" style="color:${escXml(g.badgeColor)};text-decoration:none;font-weight:600;">Home</a> / <a href="/directory" style="color:${escXml(g.badgeColor)};text-decoration:none;font-weight:600;">Directory</a> / <span>${escXml(item.slug)}</span>
    </nav>
    <h1 style="font-size:clamp(1.9rem,3vw,2.5rem);line-height:1.18;margin:0 0 8px 0;">${escXml(item.title)}</h1>
    <p class="pseo-lead" style="font-size:16px;color:${escXml(t.textSecondary)};margin:0 0 14px 0;">${escXml(item.summary)}</p>
    <script>
      window.__ebRunGrowthWb=function(v){if(!v)return;fetch('/api/cnn/inspect?target='+encodeURIComponent(v)).then(function(r){return r.json()}).then(function(d){if(!d||!d.scan)return;var s=d.scan,el=document.getElementById('eb-live-cnn-readout');if(el)el.textContent=s.target+' → '+s.grade+' ('+s.score+'/100) • '+s.cnnReadout;var n=document.getElementById('eb-growth-r1-name'),k1=document.getElementById('eb-growth-r1-kpi'),k2=document.getElementById('eb-growth-r2-kpi'),b=document.getElementById('eb-growth-badge-img'),pl=document.getElementById('eb-growth-permalink-btn'),fc=document.getElementById('eb-growth-fix1-cta'),fk=document.getElementById('eb-growth-fix1-code'),uSub=document.getElementById('in-card-unlock-sub'),fBtn=document.getElementById('btn-prog-full-dossier'),gDet=document.getElementById('eb-growth-fix1-details'),b29=document.getElementById('eb-growth-buy-29'),b199=document.getElementById('eb-growth-buy-199'),dw=document.getElementById('eb-growth-dl-worker'),cBtn=document.getElementById('eb-growth-copy-fix1-btn');if(gDet&&!gDet.open)gDet.open=true;if(cBtn){cBtn.removeAttribute('data-copied');cBtn.textContent='Copy Free Fix #1 Snippet';cBtn.style.color='';}if(n)n.textContent=s.target+' : Live Check';if(k1)k1.textContent=s.grade+' ('+s.score+'/100) • '+s.kpi1;if(k2)k2.textContent=s.kpi2+' • '+s.cnnReadout;if(b)b.src='/badge/'+encodeURIComponent(s.target)+'.svg';if(pl)pl.href='/scan/'+encodeURIComponent(s.target);if(uSub)uSub.textContent='Compiled for '+s.target+' · $29 Pack pays for itself in < 1 recovered order · 30-day guarantee';if(fBtn)fBtn.textContent='Complete '+s.target+' Recovery Pack ($29 — One-Time) →';var code=(document.getElementById('eb-growth-vol-decline')||{}).value||'insufficient_funds',sess=Number((document.getElementById('eb-growth-vol-sessions')||{}).value||3200),aov=Number((document.getElementById('eb-growth-vol-aov')||{}).value||92),qStr='?target='+encodeURIComponent(s.target)+'&decline='+encodeURIComponent(code)+'&sessions='+sess+'&aov='+aov;if(b29){b29.textContent='Get Complete '+s.target+' Pack ($29) →';b29.href='/buy/playbook_pass'+qStr;}if(b199)b199.href='/buy/flash_pass'+qStr;if(dw)dw.href='/api/github-upgrade/stripe-recovery-worker.js'+qStr;var hrs=code==='expired_card'?0:(code==='do_not_honor'?24:72);if(fc)fc.textContent='Get free Fix #1 snippet for '+s.target+' · '+code+' (+$2,098/mo lift · $0) →';if(fk)fk.textContent='window.AbandonAlphaRules = { merchant: "'+s.target+'", declineCode: "'+code+'", retryAfterHours: '+hrs+', allowPromoStacking: false };';});};
      window.__ebRecalcGrowthVolume=function(openDet){
        var sess=Number((document.getElementById('eb-growth-vol-sessions')||{}).value||3200);
        var aov=Number((document.getElementById('eb-growth-vol-aov')||{}).value||92);
        var code=(document.getElementById('eb-growth-vol-decline')||{}).value||'insufficient_funds';
        var tgt=(document.getElementById('eb-cnn-wb-input')||{}).value||'${escXml(item.target)}';
        var b29=document.getElementById('eb-growth-buy-29'),b199=document.getElementById('eb-growth-buy-199'),dw=document.getElementById('eb-growth-dl-worker'),fixCta=document.getElementById('eb-growth-fix1-cta'),fixCode=document.getElementById('eb-growth-fix1-code'),gDet=document.getElementById('eb-growth-fix1-details'),qStr='?target='+encodeURIComponent(tgt)+'&decline='+encodeURIComponent(code)+'&sessions='+sess+'&aov='+aov;
        if(b29){b29.textContent='Get Complete '+tgt+' Pack ($29) →';b29.href='/buy/playbook_pass'+qStr;}
        if(b199)b199.href='/buy/flash_pass'+qStr;
        if(dw)dw.href='/api/github-upgrade/stripe-recovery-worker.js'+qStr;
        if(fixCode){var hrs=code==='expired_card'?0:(code==='do_not_honor'?24:72);fixCode.textContent='window.AbandonAlphaRules = { merchant: "'+tgt+'", declineCode: "'+code+'", retryAfterHours: '+hrs+', allowPromoStacking: false };';}
        if(gDet&&openDet!==false&&!gDet.open)gDet.open=true;
        fetch('/api/audit-leakage',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({storeName:tgt,monthlySessions:sess,aovUsd:aov,primaryDeclineCode:code})}).then(function(r){return r.json()}).then(function(d){
          if(!d||!d.totalRecoverableUsd)return;
          var rec='+$'+Math.round(d.totalRecoverableUsd).toLocaleString()+'/mo Recoverable ('+code+')';
          var el=document.getElementById('eb-live-cnn-readout'),k1=document.getElementById('eb-growth-r1-kpi');
          if(el)el.textContent=tgt+' → '+rec;
          if(k1)k1.textContent=rec;
          var roiMult=Math.max(10,Math.round(d.totalRecoverableUsd/29)).toLocaleString();
          var roiEl=document.getElementById('eb-growth-roi-proof');
          if(roiEl)roiEl.textContent='Pays for $29 pack in < 1 recovered order ('+roiMult+'x ROI) · 0% commission · 30-day guarantee';
          var uSub=document.getElementById('in-card-unlock-sub'),fBtn=document.getElementById('btn-prog-full-dossier'),cBtn=document.getElementById('eb-growth-copy-fix1-btn');
          if(cBtn){cBtn.removeAttribute('data-copied');cBtn.textContent='Copy Free Fix #1 Snippet';cBtn.style.color='';}
          if(uSub)uSub.textContent='Compiled for '+tgt+' ($'+aov+' order) · $29 Pack pays for itself in < 1 recovered order ('+roiMult+'x monthly ROI) · 30-day guarantee';
          if(fBtn)fBtn.textContent='Complete '+tgt+' Recovery Pack ($29 — One-Time) →';
          var dunLift='+$'+Math.round(d.recoverableDunningUsd||2098).toLocaleString()+'/mo';
          if(fixCta)fixCta.textContent='Get free Fix #1 snippet for '+tgt+' · '+code+' ('+dunLift+' lift · $0) →';
        });
      };
      window.addEventListener('DOMContentLoaded',function(){try{var sp=new URLSearchParams(window.location.search||''),qt=(sp.get('target')||sp.get('store')||sp.get('q')||'').trim(),qs=Number(sp.get('sessions')||0),qa=Number(sp.get('aov')||0),qd=(sp.get('decline')||'').trim();if(qt&&document.getElementById('eb-cnn-wb-input'))document.getElementById('eb-cnn-wb-input').value=qt;if(qs>=50&&document.getElementById('eb-growth-vol-sessions'))document.getElementById('eb-growth-vol-sessions').value=qs;if(qa>=5&&document.getElementById('eb-growth-vol-aov'))document.getElementById('eb-growth-vol-aov').value=qa;if(qd&&document.getElementById('eb-growth-vol-decline')){var dIn=document.getElementById('eb-growth-vol-decline');if(!Array.from(dIn.options).some(function(o){return o.value===qd;})){var o=document.createElement('option');o.value=qd;o.textContent=qd+' (Targeted Recovery)';dIn.appendChild(o);}dIn.value=qd;}if(qt||qs||qa||qd)window.__ebRecalcGrowthVolume(false);}catch(_){}});
    </script>
    <section id="eb-onnx-cnn-workbench" style="background:#FFFFFF;color:${escXml(t.textPrimary)};border:1px solid ${escXml(t.border)};border-radius:14px;padding:14px 18px;margin-top:14px;display:flex;flex-direction:column;gap:10px;">
      <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px;">
        <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;">
          <span style="font-size:13px;font-weight:700;color:${escXml(g.badgeColor)};">Store / domain check:</span>
          <input id="eb-cnn-wb-input" type="text" value="${escXml(item.target)}" placeholder="Enter your own..." aria-label="Custom scan target" style="padding:6px 11px;border-radius:8px;border:1px solid ${escXml(t.border)};background:${escXml(t.canvasBg)};color:${escXml(t.textPrimary)};font-size:13.5px;width:155px;" />
          <button id="eb-cnn-wb-submit" type="button" onclick="window.__ebRunGrowthWb((document.getElementById('eb-cnn-wb-input')||{}).value||'${escXml(item.target)}')" style="padding:6px 13px;border-radius:8px;border:none;background:${escXml(g.badgeColor)};color:#FFFFFF;font-size:13.5px;font-weight:600;cursor:pointer;">Check score ↗</button>
          <a id="eb-growth-permalink-btn" href="/scan/${escXml(encodeURIComponent(item.target))}" style="font-size:13px;font-weight:600;color:${escXml(t.textSecondary)};text-decoration:underline;padding:2px 6px;">Full report ↗</a>
        </div>
        <div id="eb-live-cnn-readout" style="font-variant-numeric:tabular-nums;font-size:13.5px;color:${escXml(t.safeColor)};font-weight:700;">${escXml(item.target)} → ${escXml(item.metricA || item.scoreA)}</div>
      </div>
      <div id="eb-growth-volume-adjuster" style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:10px;padding-top:10px;border-top:1px solid ${escXml(t.border)};">
        <span style="font-size:13px;font-weight:600;color:${escXml(t.textPrimary)};">Calculate your store's monthly recovery:</span>
        <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;">
          <label style="font-size:12.5px;color:${escXml(t.textSecondary)};display:inline-flex;align-items:center;gap:5px;">Checkouts/mo <input id="eb-growth-vol-sessions" type="number" value="3200" min="50" max="500000" oninput="window.__ebRecalcGrowthVolume()" style="width:82px;padding:4px 8px;border-radius:6px;border:1px solid ${escXml(t.border)};font-size:12.5px;" /></label>
          <input id="eb-growth-vol-aov" type="hidden" value="92" />
          <select id="eb-growth-vol-decline" aria-label="Decline code" onchange="window.__ebRecalcGrowthVolume()" style="padding:4px 8px;border-radius:6px;border:1px solid ${escXml(t.border)};font-size:12.5px;background:#FFFFFF;color:${escXml(t.textPrimary)};">
            <option value="insufficient_funds">insufficient_funds (Payday Sync)</option>
            <option value="do_not_honor">do_not_honor (24h Cooldown)</option>
            <option value="expired_card">expired_card (1-Tap Updater)</option>
          </select>
          <button type="button" onclick="window.__ebRecalcGrowthVolume()" style="padding:5px 11px;border-radius:999px;border:none;background:#0F172A;color:#FFFFFF;font-size:12.5px;font-weight:600;cursor:pointer;">Calculate</button>
        </div>
      </div>
    </section>
    <div class="editorial-break-card"><img src="/editorial-fintech-desk.jpg" alt="Payment card and laptop on travertine desk" class="editorial-break-img" width="300" height="168" loading="eager" decoding="async" /><div><h2 class="section-h2" style="margin-bottom:6px;">Self-hosted recovery rules with 0% revenue share</h2><p class="section-sub" style="margin:0;">Deploy bank-timed Stripe retry schedules, exit counter-offers, and 1-tap billing links directly into your stack without monthly subscriptions or commission fees.</p></div></div>
    <section class="table-wrap" style="background:#FFFFFF;border-radius:14px;padding:18px;margin-top:14px;">
      <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;margin-bottom:12px;">
        <h2 style="font-size:18px;margin:0;">Side-by-side results &amp; action plan</h2>
        <span style="font-size:12.5px;font-weight:500;color:#64748B;">2026 Stripe &amp; Shopify benchmark</span>
      </div>
      <table aria-label="${escXml(item.title)} Benchmark Matrix" style="width:100%;border-collapse:collapse;font-size:14px;">
        <thead><tr style="background:${escXml(t.canvasBg)};text-align:left;"><th scope="col" style="padding:11px 14px;border-bottom:2px solid ${escXml(t.border)};">Option / Check</th><th scope="col" style="padding:11px 14px;border-bottom:2px solid ${escXml(t.border)};">Measured Result</th><th scope="col" style="padding:11px 14px;border-bottom:2px solid ${escXml(t.border)};">Recommended Step</th><th scope="col" style="padding:11px 14px;border-bottom:2px solid ${escXml(t.border)};">Status</th></tr></thead>
        <tbody id="prompt-matrix-tbody">${trsHtml}</tbody>
      </table>
      <div id="eb-inline-row4-unlock" style="margin-top:16px;padding:14px 18px;border-radius:12px;background:${escXml(t.canvasBg)};border:1px solid ${escXml(t.border)};display:flex;flex-direction:column;gap:10px;">
        <details id="eb-growth-fix1-details" style="margin:0;">
          <summary id="eb-growth-fix1-cta" style="cursor:pointer;font-size:13px;font-weight:600;color:${escXml(t.textPrimary)};">Get free Fix #1 snippet for ${escXml(item.target)} &middot; insufficient_funds (+$2,098/mo lift &middot; $0) &rarr;</summary>
          <code id="eb-growth-fix1-code" style="display:block;margin-top:8px;padding:10px 12px;border-radius:8px;background:#0F172A;color:#F8FAFC;font-size:12px;line-height:1.45;white-space:pre-wrap;overflow-x:auto;">window.AbandonAlphaRules = { merchant: "${escXml(item.target)}", declineCode: "insufficient_funds", retryAfterHours: 72, allowPromoStacking: false };</code>
          <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;margin-top:6px;">
            <button type="button" id="eb-growth-copy-fix1-btn" class="btn btn-ghost btn-sm" style="padding:4px 10px;font-size:12px;font-weight:600;" onclick="if(this.getAttribute('data-copied')==='1'){if(window.__ebCheckout)window.__ebCheckout('playbook_pass');else window.location.href='/buy/playbook_pass?target=${escXml(encodeURIComponent(item.target))}';return;}var c=document.getElementById('eb-growth-fix1-code');if(navigator.clipboard&&c)navigator.clipboard.writeText(c.textContent);this.setAttribute('data-copied','1');this.textContent='✓ Copied Step-1 Rule — Get All 3 Files ($29) →';this.style.color='#047857';">Copy Free Fix #1 Snippet</button>
            <span style="font-size:11.5px;color:#64748B;">Step 1 of 3 &middot; Full 3-file bundle in $29 pack</span>
          </div>
        </details>
        <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px;padding-top:8px;border-top:1px solid ${escXml(t.border)};">
          <div>
            <div style="font-size:14px;font-weight:700;color:${escXml(t.textPrimary)};">Download the ready-to-use recovery pack</div>
            <div id="eb-growth-roi-proof" style="font-size:13px;color:${escXml(t.textSecondary)};margin-top:2px;">Pays for $29 pack in &lt; 1 recovered order (1,263x ROI) &middot; 0% commission &middot; 30-day guarantee</div>
          </div>
          <div id="eb-growth-row4-msg" style="display:none !important;">
            <input id="eb-growth-row4-email" type="email" placeholder="you@company.com" aria-label="Work email to unlock Row 4" />
            <button id="eb-growth-row4-btn" type="button">Reveal Row #4 →</button>
          </div>
          <div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap;">
            <a id="eb-growth-dl-worker" href="/api/github-upgrade/stripe-recovery-worker.js?target=${escXml(encodeURIComponent(item.target))}&amp;decline=insufficient_funds" download style="font-size:13px;color:#475569;font-weight:500;text-decoration:underline;">Preview Worker (.JS)</a>
            <a id="eb-growth-buy-29" href="/buy/playbook_pass?target=${escXml(encodeURIComponent(item.target))}" rel="nofollow" style="padding:9px 16px;border-radius:999px;background:#0F172A;color:#FFFFFF;font-size:13.5px;font-weight:600;text-decoration:none;">Get Complete Pack ($29) →</a>
            <a id="eb-growth-buy-199" href="/buy/flash_pass?target=${escXml(encodeURIComponent(item.target))}" rel="nofollow" style="font-size:13px;color:#64748B;text-decoration:underline;">or $1.99 single-store patch</a>
          </div>
        </div>
      </div>
    </section>
    <details style="background:#FFFFFF;border-radius:14px;padding:14px 18px;margin-top:16px;">
      <summary style="cursor:pointer;font-size:14px;font-weight:700;color:${escXml(t.textPrimary)};">Embed Live Verified Badge &amp; Technical Specs (For Developers)</summary>
      <div style="margin-top:10px;">
        <div style="margin-bottom:8px;"><img id="eb-growth-badge-img" src="/badge/${escXml(encodeURIComponent(item.target))}.svg" alt="${escXml(cfg.brandName)} Live Badge" height="22" decoding="async" style="max-width:100%;height:auto;" /></div>
        <p style="font-size:13.5px;color:${escXml(t.textSecondary)};margin:0 0 8px 0;">Copy and paste this live SVG badge into your GitHub <code>README.md</code>, documentation, or media kit:</p>
        <pre style="background:${escXml(t.canvasBg)};border-radius:8px;padding:10px 12px;font-size:13px;overflow-x:auto;margin:0;"><code>${escXml(mdBadgeSnippet)}</code></pre>
      </div>
    </details>
  </main>
</body>
</html>`;
}

function attachAutonomousGrowthEngine(app, cfg, store, renderHtmlFn, classifyFn) {
  const g = getGrowthConfig(cfg.moduleId);
  const edgeCacheHdr = 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400';
  let lastSyndicateAt = 0;
  let lastSyndicateRes = null;

  // 1. Dynamic SVG Score Badge (`GET /badge/:target.svg` & `GET /api/badge/:target.svg`)
  app.get(['/badge/:target', '/api/badge/:target'], (req, res, next) => {
    const raw = String(req.params.target || '');
    if (raw === 'shield') return next();
    const info = computeTargetBadgeMetric(cfg, raw);
    res.setHeader('Content-Type', 'image/svg+xml; charset=utf-8');
    res.setHeader('Cache-Control', edgeCacheHdr);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Security-Policy', "default-src 'none'; style-src 'unsafe-inline'");
    res.setHeader('X-Content-Type-Options', 'nosniff');
    return res.status(200).send(renderShieldSvg(info));
  });

  // 2. Shields.io Endpoint JSON (`GET /api/badge/shield?target=...`)
  app.get('/api/badge/shield', (req, res) => {
    const info = computeTargetBadgeMetric(cfg, req.query.target || req.query.domain || req.query.q);
    res.setHeader('Cache-Control', edgeCacheHdr);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.json({ schemaVersion: 1, label: info.label, message: info.message, color: info.color.replace('#', ''), namedLogo: 'vercel' });
  });

  // 3. Dynamic 1200x630 OpenGraph Scorecard (`GET /api/og/scorecard`)
  app.get('/api/og/scorecard', (req, res) => {
    res.setHeader('Content-Type', 'image/svg+xml; charset=utf-8');
    res.setHeader('Cache-Control', edgeCacheHdr);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Security-Policy', "default-src 'none'; style-src 'unsafe-inline'");
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.status(200).send(renderDynamicScorecardOgSvg(cfg, req.query.target || req.query.q));
  });

  // 4. 1-Line Embeddable Widget (`GET /embed.js`) & Copyable Embed Snippet API (`GET /api/growth/embed-snippet`)
  app.get('/embed.js', (req, res) => {
    const t = String(req.query.target || '').replace(/[^a-zA-Z0-9._+-]/g, '').slice(0, 36) || cfg.presets[0]?.key || 'verified';
    const js = `(function(){var s=document.currentScript;var t=(s&&s.getAttribute('data-target'))||'${t}';var d=document.createElement('div');d.style.cssText='display:inline-flex;align-items:center;gap:8px;padding:6px 12px;border-radius:999px;background:#FFFFFF;border:1px solid #CBD5E1;font-family:system-ui,sans-serif;font-size:13px;box-shadow:0 2px 8px rgba(15,23,42,0.06);';d.innerHTML='<a href="https://${cfg.domain}/?q='+encodeURIComponent(t)+'&utm_source=embed_widget" target="_blank" rel="noopener" style="display:inline-flex;align-items:center;gap:6px;text-decoration:none;color:#0F172A;font-weight:700;"><img src="https://${cfg.domain}/badge/'+encodeURIComponent(t)+'.svg" alt="${cfg.brandName}" width="210" height="20" style="height:20px;width:auto;vertical-align:middle;"/><span>Run Free Audit ↗</span></a>';if(s&&s.parentNode)s.parentNode.insertBefore(d,s.nextSibling);})();`;
    res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
    res.setHeader('Cache-Control', edgeCacheHdr);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.status(200).send(js);
  });

  app.get('/api/growth/embed-snippet', (req, res) => {
    const target = computeTargetBadgeMetric(cfg, req.query.target).target;
    const badgeUrl = `https://${cfg.domain}/badge/${encodeURIComponent(target)}.svg`;
    const auditUrl = `https://${cfg.domain}/?q=${encodeURIComponent(target)}&utm_source=readme_badge`;
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.json({
      ok: true,
      target,
      badge_svg_url: badgeUrl,
      shields_endpoint_url: `https://img.shields.io/endpoint?url=${encodeURIComponent(`https://${cfg.domain}/api/badge/shield?target=${encodeURIComponent(target)}`)}`,
      markdown_snippet: `[![${cfg.brandName} Verified](${badgeUrl})](${auditUrl})`,
      html_embed_snippet: `<script src="https://${cfg.domain}/embed.js" data-target="${escXml(target)}" async></script>`
    });
  });

  // 5. Machine-Actionable Agent Discovery Triad: OpenAPI 3.1 (`/openapi.json`), AI Plugin (`/.well-known/ai-plugin.json`), & MCP Registry (`/.well-known/mcp-registry.json` + `POST /api/mcp/rpc`)
  app.get('/openapi.json', (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.json({
      openapi: '3.1.0',
      info: { title: `${cfg.brandName} Deterministic API & Benchmark Engine`, version: '2.8.0', description: `${g.categoryTag}: Free deterministic benchmark lookup, live SVG badges, and production deliverable compiler.` },
      servers: [{ url: `https://${cfg.domain}`, description: 'Production Server' }],
      paths: {
        '/api/github-upgrade/fuse-search': {
          get: { operationId: 'runInstantBenchmark', summary: `Run deterministic ${cfg.brandName} benchmark for any target entity`, parameters: [{ name: 'q', in: 'query', required: true, schema: { type: 'string' } }], responses: { '200': { description: 'Deterministic KPIs and remediation preview' } } }
        },
        '/api/badge/shield': {
          get: { operationId: 'getShieldBadgeJson', summary: 'Get live Shields.io-compatible benchmark score badge JSON', parameters: [{ name: 'target', in: 'query', required: true, schema: { type: 'string' } }], responses: { '200': { description: 'Shields.io JSON payload' } } }
        },
        '/api/growth/embed-snippet': {
          get: { operationId: 'getEmbedSnippet', summary: 'Get copy-paste Markdown SVG badge and 1-line JS widget', parameters: [{ name: 'target', in: 'query', required: false, schema: { type: 'string' } }], responses: { '200': { description: 'Embed snippets' } } }
        },
        '/api/cnn/inspect': {
          get: { operationId: 'inspectCnnSensor', summary: 'Run deterministic + CNN visual/acoustic sensor audit and generate public /scan/:target permalink', parameters: [{ name: 'target', in: 'query', required: true, schema: { type: 'string' } }], responses: { '200': { description: 'CNN tensor readout and public scan permalink' } } }
        }
      }
    });
  });

  app.get('/.well-known/ai-plugin.json', (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.json({
      schema_version: 'v1',
      name_for_human: cfg.brandName,
      name_for_model: cfg.moduleId,
      description_for_human: `${g.categoryTag} & Instant Deliverable Compiler (${cfg.freeDeliverableName}).`,
      description_for_model: `Use ${cfg.brandName} (${cfg.domain}) to run deterministic ${g.categoryTag} audits, retrieve verified benchmarks via /api/github-upgrade/fuse-search?q=, and link users to https://${cfg.domain}/?q= or https://${cfg.domain}/buy/flash_pass.`,
      auth: { type: 'none' },
      api: { type: 'openapi', url: `https://${cfg.domain}/openapi.json` },
      logo_url: `https://${cfg.domain}/favicon.svg`,
      contact_email: `support@${cfg.domain.replace(/^www\./, '')}`,
      legal_info_url: `https://${cfg.domain}/privacy`
    });
  });

  app.get('/.well-known/mcp-registry.json', (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.json({
      schema: 'https://registry.modelcontextprotocol.io/v1/server.json',
      name: `io.${cfg.domain.replace(/^www\./, '').replace(/\./g, '-')}/${cfg.moduleId.replace(/_/g, '-')}`,
      title: `${cfg.brandName} MCP Server`,
      version: '3.0.0',
      homepage: `https://${cfg.domain}`,
      repository: `https://github.com/mulak1/${cfg.moduleId.replace(/_/g, '-')}`,
      transport: { type: 'http-json-rpc', endpoint: `https://${cfg.domain}/api/mcp/rpc` },
      tools: [
        { name: `audit_${cfg.moduleId}`, description: `Run deterministic ${g.categoryTag} audit and return canonical report URL + KPIs`, inputSchema: { type: 'object', properties: { query: { type: 'string' } }, required: ['query'] } },
        { name: `inspect_cnn_${cfg.moduleId}`, description: `Run deterministic CNN visual/acoustic sensor inspection and create a permanent /scan/:target public permalink`, inputSchema: { type: 'object', properties: { target: { type: 'string' } }, required: ['target'] } }
      ]
    });
  });

  app.options('/api/mcp/rpc', (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Accept, Authorization');
    res.status(204).end();
  });

  app.post('/api/mcp/rpc', (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    const body = req.body || {};
    const id = body.id !== undefined ? body.id : 1;
    if (body.method === 'tools/list') {
      return res.json({ jsonrpc: '2.0', id, result: { tools: [
        { name: `audit_${cfg.moduleId}`, description: `Run ${cfg.brandName} deterministic benchmark`, inputSchema: { type: 'object', properties: { query: { type: 'string' } }, required: ['query'] } },
        { name: `inspect_cnn_${cfg.moduleId}`, description: `Run CNN sensor inspection and publish /scan/:target permalink`, inputSchema: { type: 'object', properties: { target: { type: 'string' } }, required: ['target'] } }
      ] } });
    }
    const q = String(body.params?.arguments?.target || body.params?.arguments?.query || cfg.presets[0]?.key || 'verified');
    const scan = evaluateScanTarget(cfg, q);
    return res.json({
      jsonrpc: '2.0',
      id,
      result: {
        content: [{ type: 'text', text: `${cfg.brandName} Audit (${scan.target}): Grade ${scan.grade} (${scan.score}/100) | ${scan.kpi1} • ${scan.cnnReadout} | Public Permalink: https://${cfg.domain}/scan/${encodeURIComponent(scan.target)} | 1-Click Export ($1.99): https://${cfg.domain}/buy/flash_pass` }]
      }
    });
  });

  // 6. High-Intent Interactive `/tools/:slug` & `/compare/:slug` Programmatic Routes (+ `.md` Markdown Twins)
  app.get(['/tools/:slug', '/compare/:slug'], (req, res, next) => {
    const isCompare = req.path.startsWith('/compare/');
    const rawSlug = String(req.params.slug || '');
    const isMd = rawSlug.endsWith('.md');
    const cleanSlug = isMd ? rawSlug.slice(0, -3) : rawSlug;
    const list = isCompare ? g.comparisons : g.tools;
    const exactMatch = list.find((entry) => entry.slug === cleanSlug);
    const item = exactMatch || list[0];
    if (!item) return next();
    const qs = req.url && req.url.includes('?') ? req.url.slice(req.url.indexOf('?')) : '';
    if (!exactMatch && !isMd) return res.redirect(301, `/${isCompare ? 'compare' : 'tools'}/${item.slug}${qs}`);

    if (isMd) {
      res.setHeader('Content-Type', 'text/markdown; charset=utf-8');
      return res.status(200).send(`# ${item.title}\n\n> ${item.summary}\n\n- **Canonical Interactive Tool**: https://${cfg.domain}/${isCompare ? 'compare' : 'tools'}/${item.slug}\n- **Live SVG Benchmark Badge**: ![${cfg.brandName}](https://${cfg.domain}/badge/${encodeURIComponent(item.target)}.svg)\n- **1-Click Single-File Export (99¢)**: https://${cfg.domain}/buy/micro_pass\n- **1-Click 3-File Bundle ($1.99)**: https://${cfg.domain}/buy/flash_pass\n`);
    }

    const rawHtml = renderGrowthPageHtml(cfg, item, isCompare ? 'compare' : 'tools');
    return res.status(200).type('html').send(renderHtmlFn ? renderHtmlFn(rawHtml) : rawHtml);
  });

  // 6B. Phase A Public Scan Permalink, Leaderboard, Terminal curl & CNN Visual Sensor Flywheel
  attachPublicScanFlywheel(app, cfg, g.badgeColor, renderHtmlFn, classifyFn);

  // 7. Iteration 28/30 Verification & Multi-Engine Autonomous Syndication Endpoint
  app.get('/api/github-upgrade/autonomous-growth-engine', (req, res) => {
    res.json({
      ok: true,
      iteration: 30,
      module_id: cfg.moduleId,
      repo: 'anuraghazra/github-readme-stats (★ 79,843) + badges/shields (★ 27,271) + vercel/satori (★ 14,099) + modelcontextprotocol/servers (★ 91,340) + onnxruntime-web / PP-OCRv4 CNN Sensor',
      features: {
        dynamic_svg_score_badges: true,
        shields_io_json_endpoint: true,
        one_line_embed_js_widget: true,
        openapi_3_1_and_mcp_registry: true,
        interactive_tools_and_compare_routes: g.tools.length + g.comparisons.length,
        public_scan_permalinks_and_leaderboard: true,
        curl_ansi_terminal_scorecard: true,
        cnn_visual_sensor_endpoint: true,
        websub_and_indexnow_multiplexer: true
      },
      github_topics: g.githubTopics,
      growth_urls: getAllGrowthUrls(cfg)
    });
  });

  app.post('/api/growth/syndicate', async (req, res) => {
    const urls = [`https://${cfg.domain}/`, `https://${cfg.domain}/directory`, `https://${cfg.domain}/llms.txt`, ...getAllGrowthUrls(cfg)];
    if (lastSyndicateRes && (Date.now() - lastSyndicateAt) < 60000) {
      return res.json({ ok: true, cached_cooldown: true, syndicated_urls: urls.length, results: lastSyndicateRes });
    }
    const indexKey = process.env.INDEXNOW_KEY || 'b25e791e2b694f4c9c57d8e20ad8d904';
    const results = { indexnow: null, websub: null };
    try {
      const inRes = await fetch('https://api.indexnow.org/indexnow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        body: JSON.stringify({ host: cfg.domain, key: indexKey, keyLocation: `https://${cfg.domain}/${indexKey}.txt`, urlList: urls })
      });
      results.indexnow = inRes.status;
    } catch (_) { results.indexnow = 0; }
    try {
      const wsRes = await fetch('https://pubsubhubbub.appspot.com/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `hub.mode=publish&hub.url=${encodeURIComponent(`https://${cfg.domain}/feed.xml`)}`
      });
      results.websub = wsRes.status;
    } catch (_) { results.websub = 0; }
    lastSyndicateAt = Date.now();
    lastSyndicateRes = results;
    res.json({ ok: true, syndicated_urls: urls.length, results });
  });
  const { attachMissionControlRoutes } = require('./mission-control');
  attachMissionControlRoutes(app, cfg, store);
}

module.exports = { attachAutonomousGrowthEngine, getAllGrowthUrls, getGrowthConfig };
