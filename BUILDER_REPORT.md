# Builder Report: AbandonAlpha (#9)

**Agent**: `Builder-AbandonAlpha`
**Workspace Root**: `/Users/kadermula/Downloads/Ideas/studio/abandon-alpha/`
**Live Server URL**: `http://127.0.0.1:4109`
**SQLite Database**: `/Users/kadermula/Downloads/Ideas/studio/abandon-alpha/data/abandon_alpha.db`
**Status**: **100% COMPLETE & VERIFIED (0 Console/Page Errors)**

---

## 1. Executive Summary & Architecture

**AbandonAlpha (#9)** is an autonomous checkout, cart & session abandonment recovery, behavioral exit-intent Thompson Sampling bandit, and Stripe failed-payment dunning engine built in a strictly isolated workspace on port `4109`.

### Module Inventory (All `<1,000` Lines Per File)
| File | Lines | Responsibility |
| :--- | :--- | :--- |
| [src/db.js](file:///Users/kadermula/Downloads/Ideas/studio/abandon-alpha/src/db.js) | 308 | SQLite WAL database (`abandon_alpha.db`) managing `bandit_arms`, `bandit_events`, `leakage_audits`, `webhook_simulations`, `meta_capi_events` (`UNIQUE(event_id)` deduplication), and `checkout_sessions`. |
| [src/engine.js](file:///Users/kadermula/Downloads/Ideas/studio/abandon-alpha/src/engine.js) | 373 | Deterministic Revenue Leakage & Dunning Grader (`computeLeakageAudit`), Mouse-Velocity Trajectory Predictor (`computeExitTrajectoryScore`), Beta-Bernoulli Thompson Sampler (`selectBanditArm`), and Stripe Webhook Simulator (`simulateStripeWebhook` with `@google/genai` `gemini-3.8-flash` + zero-latency deterministic fallback). |
| [src/pseo-data.js](file:///Users/kadermula/Downloads/Ideas/studio/abandon-alpha/src/pseo-data.js) | 563 | 60 Programmatic SEO playbooks across Stripe Decline Codes (20), Stripe Webhooks & Subscription Churn (14), Platform Checkout Playbooks (14), and Behavioral Bandit Science (12). |
| [src/views.js](file:///Users/kadermula/Downloads/Ideas/studio/abandon-alpha/src/views.js) | 468 | SSR HTML renderer for `/seo/:slug`, `/directory`, `/lp` (Cold Meta Ads Landing Page), `/privacy`, `/terms`, `404`, and dynamic SVG OpenGraph cards (`/api/og`). |
| [src/server.js](file:///Users/kadermula/Downloads/Ideas/studio/abandon-alpha/src/server.js) | 228 | Express server bound to `127.0.0.1:4109` with security headers, REST endpoints, `/sitemap.xml` (65 URLs), and `/robots.txt`. |
| [public/index.html](file:///Users/kadermula/Downloads/Ideas/studio/abandon-alpha/public/index.html) | 341 | High-Contrast Revenue Telemetry & FinOps Dark UI (`#070A10` obsidian, `#10B981` emerald, `#F43F5E` rose, `#6366F1` indigo) with above-the-fold Free Grader, Live C1–C6 Bandit Lab, Stripe Webhook Lab, and Self-Serve Pricing (`$49/mo` & `$149/mo`). |
| [public/styles.css](file:///Users/kadermula/Downloads/Ideas/studio/abandon-alpha/public/styles.css) | 594 | Anti-slop stylesheet with tactile `:active` scale physics, explicit property transitions, tabular-nums posteriors, and responsive mobile layout. |
| [public/app.js](file:///Users/kadermula/Downloads/Ideas/studio/abandon-alpha/public/app.js) | 222 | Client telemetry controller for presets, real-time SQLite posterior table rendering, webhook simulation, and Stripe checkout fulfillment. |
| [public/sdk/abandon-alpha-sdk.js](file:///Users/kadermula/Downloads/Ideas/studio/abandon-alpha/public/sdk/abandon-alpha-sdk.js) | 68 | Embeddable `<4KB` script tracking cursor velocity vectors ($v_y, \tau$) and `document.visibilityState` to trigger C1–C6 recovery modals. |

---

## 2. Phase-by-Phase Deliverables

### Phase 0: Skill Loading, GitHub Scout & Custom Skill Synthesis
- Scouted open-source exit-intent (`carlsednaoui/ouibounce`, `daltonmenezes/use-exit-intent`), Thompson Sampling (`stitchfix/mab`, `glowindex_mvp/src/telemetry/mab.ts`), and Stripe decline-code retry architectures.
- Documented findings in [GITHUB_SCOUT_REPORT.md](file:///Users/kadermula/Downloads/Ideas/studio/abandon-alpha/GITHUB_SCOUT_REPORT.md).
- Synthesized project-local skill [.agents/skills/abandon-alpha-recovery/SKILL.md](file:///Users/kadermula/Downloads/Ideas/studio/abandon-alpha/.agents/skills/abandon-alpha-recovery/SKILL.md).

### Phase 1: Core Deterministic + Gemini Engine & 60-Page Programmatic SEO Engine
- **Module A (`POST /api/audit-leakage`)**: Computes Monthly Leaked Checkout Revenue, Failed-Payment Dunning Leakage, Recoverable Exit-Intent Revenue, Recoverable Dunning MRR by decline code (`insufficient_funds` 62.4%, `do_not_honor` 47.8%, `expired_card` 54.2%, `authentication_required` 51.0%), 3-step webhook recovery sequence, and ready-to-embed `<script>` tag.
- **Module B (`POST /api/bandit-select` & `POST /api/webhook-simulate`)**: Live C1–C6 Objection Thompson Sampling Bandit updating `alpha`/`beta` posteriors in SQLite (`abandon_alpha.db`) in real time + Stripe `checkout.session.expired` and `invoice.payment_failed` simulator.
- **Day-1 GSC & pSEO Engine**: 60 high-intent `/seo/:slug` pages, `/directory` hub, `/sitemap.xml` (65 URLs), `/robots.txt`, dynamic SVG OpenGraph cards (`/api/og`), and `SoftwareApplication` + `FAQPage` + `Dataset` JSON-LD.

### Phase 2 & 3: Anti-Slop FinOps UI, Stripe Checkout & Meta Ads GTM Kit
- Built dedicated cold paid-social landing page at `/lp` with zero navigation leaks, 10-second calculator above the fold, 30-day 5x ROI guarantee, and automatic `POST /api/meta-capi` event logging (`ViewContent`, `Lead`, `StartTrial`, `Purchase`) with `UNIQUE(event_id)` deduplication.
- Authored [GTM_VALIDATION_KIT.md](file:///Users/kadermula/Downloads/Ideas/studio/abandon-alpha/GTM_VALIDATION_KIT.md) with 5 direct-response Meta Ad angles and GSC launch checklist.

---

## 3. Design Engineering Review (`emil-design-eng` + `code-craft`)

| Before | After | Why |
| :--- | :--- | :--- |
| Generic `transition: all 300ms` on buttons and cards | `transition: transform 160ms ease-out, background-color 160ms ease-out, border-color 160ms ease-out` | Prevents layout thrash and keeps interactions under 200ms with responsive `ease-out` curves |
| Static buttons without press feedback | `.btn:active { transform: scale(0.97); }` on all CTAs, presets, and C1–C6 objection buttons | Simulates physical tactile push on click/tap |
| Mobile `.brand-tag` badge wrapping to 4 lines on `390px` viewport | Hidden `.brand-tag` below `920px` and tightened `.btn-sm` padding (`7px 12px`) | Keeps mobile header on a single 68px line with zero horizontal overflow |
| Raw LaTeX/backtick strings in HTML copy | Semantic `<code>Beta(α, β)</code>`, `<code>θ̃</code>`, and `<code>insufficient_funds</code>` badges | Eliminates raw markup artifacts and reinforces FinOps telemetry precision |

---

## 4. Phase 4: Headless Playwright E2E Verification & Screenshots

Executed isolated headless Chromium verification via [scripts/verify-playwright.js](file:///Users/kadermula/Downloads/Ideas/studio/abandon-alpha/scripts/verify-playwright.js) against `http://127.0.0.1:4109`:
- **`/` Desktop (`1440x900`) & Mobile (`390x844`)**: HTTP 200, **0 console errors, 0 page errors**.
- **Interactive Leakage Audit (`POST /api/audit-leakage`)**: Verified preset switch (`b2b_saas` → `+$10,523/mo` recovered) and live DOM update.
- **Thompson Sampling Bandit (`POST /api/bandit-select`)**: Verified `C3_APPROVAL` selection (`CFO-LOCK14`) and `C5_SUBSCRIPTION` modal selection (`ONETIME-PASS`, SQLite posterior $\alpha$ incremented live in DOM).
- **Webhook Simulator (`POST /api/webhook-simulate`)**: Verified `do_not_honor` simulation (`Expected Recovery: 47.8%`).
- **All Routes & APIs HTTP 200**: `/lp`, `/directory` (60 cards), `/seo/stripe-decline-code-insufficient-funds-recovery`, `/sitemap.xml` (65 URLs), `/robots.txt`, `/api/og`, `/api/meta-capi` (`deduplicated: false` then `deduplicated: true`), and `/api/checkout` (`$49` & `$149`).
- **Screenshots Saved**:
  - [01-desktop-hero-grader.png](file:///Users/kadermula/Downloads/Ideas/studio/abandon-alpha/screenshots/01-desktop-hero-grader.png)
  - [02-desktop-bandit-webhook-labs.png](file:///Users/kadermula/Downloads/Ideas/studio/abandon-alpha/screenshots/02-desktop-bandit-webhook-labs.png)
  - [03-desktop-exit-intent-modal.png](file:///Users/kadermula/Downloads/Ideas/studio/abandon-alpha/screenshots/03-desktop-exit-intent-modal.png)
  - [04-mobile-home.png](file:///Users/kadermula/Downloads/Ideas/studio/abandon-alpha/screenshots/04-mobile-home.png)
  - [05-meta-lp-desktop.png](file:///Users/kadermula/Downloads/Ideas/studio/abandon-alpha/screenshots/05-meta-lp-desktop.png)
  - [06-pseo-playbook-page.png](file:///Users/kadermula/Downloads/Ideas/studio/abandon-alpha/screenshots/06-pseo-playbook-page.png)
  - [07-pseo-directory.png](file:///Users/kadermula/Downloads/Ideas/studio/abandon-alpha/screenshots/07-pseo-directory.png)

### Ponytail Sign-Off
- **Skipped (YAGNI)**: Skipped multi-tenant OAuth login walls and heavy client bundler toolchains so visitors land directly inside the working Leakage Grader, Thompson Bandit Lab, and Webhook Simulator with zero cold-start friction.
- **Residual Risk**: Live Stripe API session creation and Gemini 3.8 Flash copy generation activate automatically when `STRIPE_SECRET_KEY` and `GEMINI_API_KEY` environment variables are present, defaulting to deterministic FinOps fulfillment locally.
