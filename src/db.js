const path = require('node:path');
const fs = require('node:fs');
const Database = require('better-sqlite3');

const DATA_DIR = path.resolve(__dirname, '../data');
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const DB_PATH = path.join(DATA_DIR, 'abandon_alpha.db');
const db = new Database(DB_PATH);
const origPrepare = db.prepare.bind(db);
const stmtCache = new Map();
db.prepare = function cachedPrepare(sql) {
  let stmt = stmtCache.get(sql);
  if (!stmt) { stmt = origPrepare(sql); stmtCache.set(sql, stmt); }
  return stmt;
};

db.pragma('journal_mode = WAL');
db.pragma('synchronous = NORMAL');

db.exec(`
  CREATE TABLE IF NOT EXISTS bandit_arms (
    id TEXT PRIMARY KEY,
    objection_code TEXT NOT NULL,
    objection_label TEXT NOT NULL,
    offer_headline TEXT NOT NULL,
    offer_subtext TEXT NOT NULL,
    offer_code TEXT NOT NULL,
    discount_pct REAL NOT NULL,
    impressions INTEGER NOT NULL DEFAULT 0,
    conversions INTEGER NOT NULL DEFAULT 0,
    alpha REAL NOT NULL DEFAULT 1,
    beta REAL NOT NULL DEFAULT 1,
    recovered_revenue_usd REAL NOT NULL DEFAULT 0,
    updated_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS bandit_events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id TEXT NOT NULL,
    objection_code TEXT NOT NULL,
    selected_arm_id TEXT NOT NULL,
    sampled_theta REAL NOT NULL,
    erpv_usd REAL NOT NULL,
    converted INTEGER NOT NULL DEFAULT 0,
    aov_usd REAL NOT NULL DEFAULT 92,
    velocity_score REAL NOT NULL DEFAULT 84,
    created_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS leakage_audits (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    store_name TEXT NOT NULL,
    preset_type TEXT NOT NULL,
    monthly_sessions INTEGER NOT NULL,
    aov_usd REAL NOT NULL,
    abandon_rate_pct REAL NOT NULL,
    failed_card_rate_pct REAL NOT NULL,
    leaked_checkout_usd REAL NOT NULL,
    leaked_dunning_usd REAL NOT NULL,
    recoverable_exit_usd REAL NOT NULL,
    recoverable_dunning_usd REAL NOT NULL,
    total_recoverable_usd REAL NOT NULL,
    created_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS webhook_simulations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    event_type TEXT NOT NULL,
    decline_code TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    amount_usd REAL NOT NULL,
    objection_code TEXT NOT NULL,
    retry_schedule_json TEXT NOT NULL,
    recovery_copy_json TEXT NOT NULL,
    gemini_model TEXT NOT NULL,
    created_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS meta_capi_events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    event_name TEXT NOT NULL,
    event_id TEXT NOT NULL UNIQUE,
    utm_source TEXT,
    utm_medium TEXT,
    utm_campaign TEXT,
    utm_content TEXT,
    value_usd REAL DEFAULT 0,
    currency TEXT DEFAULT 'USD',
    page_url TEXT,
    user_agent TEXT,
    created_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS checkout_sessions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    plan_tier TEXT NOT NULL,
    price_monthly_usd INTEGER NOT NULL,
    customer_email TEXT NOT NULL,
    store_domain TEXT,
    stripe_session_id TEXT NOT NULL,
    status TEXT NOT NULL,
    created_at TEXT NOT NULL
  );
`);

const INITIAL_ARMS = [
  {
    id: 'arm_c1_price_15off',
    objection_code: 'C1_PRICE',
    objection_label: 'Price is too high right now',
    offer_headline: 'Unlock 15% Instant Founders Rebate on This Order',
    offer_subtext: 'Applies code ALPHA15 automatically to your active Stripe Checkout session for the next 15 minutes.',
    offer_code: 'ALPHA15',
    discount_pct: 15,
    impressions: 420,
    conversions: 94,
    alpha: 95,
    beta: 327,
    recovered_revenue_usd: 7350.80
  },
  {
    id: 'arm_c2_browsing_credit',
    objection_code: 'C2_BROWSING',
    objection_label: 'Just browsing / not ready today',
    offer_headline: 'Save Cart for 48 Hours + Lock $15 Priority Credit',
    offer_subtext: 'We will email your exact cart state with a $15 credit reserved for 48 hours—zero pressure today.',
    offer_code: 'HOLD48-15',
    discount_pct: 10,
    impressions: 380,
    conversions: 61,
    alpha: 62,
    beta: 320,
    recovered_revenue_usd: 5050.80
  },
  {
    id: 'arm_c3_approval_quote',
    objection_code: 'C3_APPROVAL',
    objection_label: 'Need team / manager approval',
    offer_headline: 'Generate 1-Click CFO ROI PDF Quote + 14-Day Price Lock',
    offer_subtext: 'Download an instant procurement-ready invoice & ROI breakdown while locking your current tier pricing.',
    offer_code: 'CFO-LOCK14',
    discount_pct: 5,
    impressions: 290,
    conversions: 71,
    alpha: 72,
    beta: 220,
    recovered_revenue_usd: 6205.40
  },
  {
    id: 'arm_c4_competitor_switch',
    objection_code: 'C4_COMPETITOR',
    objection_label: 'Comparing with another tool/brand',
    offer_headline: 'Free White-Glove Migration + 20% Switcher Credit',
    offer_subtext: 'Our engineers import your workflows in <10 minutes plus 20% off your first 3 billing cycles.',
    offer_code: 'SWITCH20',
    discount_pct: 20,
    impressions: 310,
    conversions: 64,
    alpha: 65,
    beta: 247,
    recovered_revenue_usd: 4710.40
  },
  {
    id: 'arm_c5_subscription_pause',
    objection_code: 'C5_SUBSCRIPTION',
    objection_label: "Don't want a recurring subscription",
    offer_headline: 'Switch to 30-Day Pass (Zero Auto-Renew) or 1-Click Pause',
    offer_subtext: 'Pay once for 30 days of full autonomous recovery with zero recurring commitment or auto-renewal.',
    offer_code: 'ONETIME-PASS',
    discount_pct: 8,
    impressions: 350,
    conversions: 89,
    alpha: 90,
    beta: 262,
    recovered_revenue_usd: 7532.90
  },
  {
    id: 'arm_c6_feature_sandbox',
    objection_code: 'C6_FEATURE_FIT',
    objection_label: 'Unsure if it fits my stack / workflow',
    offer_headline: '14-Day Full Sandbox Trial ($0 Charged Today + 1-Click Cancel)',
    offer_subtext: 'Test live Stripe webhook recovery on your store for 14 days. Pay $0 unless it recovers 5x its cost.',
    offer_code: 'SANDBOX14',
    discount_pct: 12,
    impressions: 340,
    conversions: 82,
    alpha: 83,
    beta: 259,
    recovered_revenue_usd: 6638.70
  }
];

const countRow = db.prepare('SELECT COUNT(*) AS cnt FROM bandit_arms').get();
if (!countRow || countRow.cnt === 0) {
  const insertArm = db.prepare(`
    INSERT INTO bandit_arms (
      id, objection_code, objection_label, offer_headline, offer_subtext,
      offer_code, discount_pct, impressions, conversions, alpha, beta,
      recovered_revenue_usd, updated_at
    ) VALUES (
      @id, @objection_code, @objection_label, @offer_headline, @offer_subtext,
      @offer_code, @discount_pct, @impressions, @conversions, @alpha, @beta,
      @recovered_revenue_usd, @updated_at
    )
  `);
  const now = new Date().toISOString();
  const seedTx = db.transaction((arms) => {
    for (const arm of arms) {
      insertArm.run({ ...arm, updated_at: now });
    }
  });
  seedTx(INITIAL_ARMS);
}

function getAllBanditArms() {
  const rows = db.prepare('SELECT * FROM bandit_arms ORDER BY objection_code ASC').all();
  return rows.map((r) => {
    const mean = r.alpha / (r.alpha + r.beta);
    const variance = (r.alpha * r.beta) / (Math.pow(r.alpha + r.beta, 2) * (r.alpha + r.beta + 1));
    return {
      ...r,
      posterior_mean: Number(mean.toFixed(4)),
      posterior_mean_pct: Number((mean * 100).toFixed(2)),
      posterior_std: Number(Math.sqrt(variance).toFixed(4)),
      credible_interval_95: [
        Number((Math.max(0, mean - 1.96 * Math.sqrt(variance)) * 100).toFixed(1)),
        Number((Math.min(1, mean + 1.96 * Math.sqrt(variance)) * 100).toFixed(1))
      ]
    };
  });
}

function updateBanditArmStats({ armId, converted, netOrderValueUsd }) {
  const now = new Date().toISOString();
  if (converted) {
    db.prepare(`
      UPDATE bandit_arms
      SET impressions = impressions + 1,
          conversions = conversions + 1,
          alpha = alpha + 1,
          recovered_revenue_usd = ROUND(recovered_revenue_usd + ?, 2),
          updated_at = ?
      WHERE id = ?
    `).run(netOrderValueUsd, now, armId);
  } else {
    db.prepare(`
      UPDATE bandit_arms
      SET impressions = impressions + 1,
          beta = beta + 1,
          updated_at = ?
      WHERE id = ?
    `).run(now, armId);
  }
}

function logBanditEvent(evt) {
  db.prepare(`
    INSERT INTO bandit_events (
      session_id, objection_code, selected_arm_id, sampled_theta,
      erpv_usd, converted, aov_usd, velocity_score, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    evt.sessionId,
    evt.objectionCode,
    evt.selectedArmId,
    evt.sampledTheta,
    evt.erpvUsd,
    evt.converted ? 1 : 0,
    evt.aovUsd,
    evt.velocityScore,
    new Date().toISOString()
  );
}

function logLeakageAudit(audit) {
  const info = db.prepare(`
    INSERT INTO leakage_audits (
      store_name, preset_type, monthly_sessions, aov_usd,
      abandon_rate_pct, failed_card_rate_pct, leaked_checkout_usd,
      leaked_dunning_usd, recoverable_exit_usd, recoverable_dunning_usd,
      total_recoverable_usd, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    audit.storeName,
    audit.presetType,
    audit.monthlySessions,
    audit.aovUsd,
    audit.abandonRatePct,
    audit.failedCardRatePct,
    audit.leakedCheckoutUsd,
    audit.leakedDunningUsd,
    audit.recoverableExitUsd,
    audit.recoverableDunningUsd,
    audit.totalRecoverableUsd,
    new Date().toISOString()
  );
  return info.lastInsertRowid;
}

function logWebhookSimulation(sim) {
  const info = db.prepare(`
    INSERT INTO webhook_simulations (
      event_type, decline_code, customer_email, amount_usd,
      objection_code, retry_schedule_json, recovery_copy_json,
      gemini_model, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    sim.eventType,
    sim.declineCode,
    sim.customerEmail,
    sim.amountUsd,
    sim.objectionCode,
    JSON.stringify(sim.retrySchedule),
    JSON.stringify(sim.recoveryCopy),
    sim.geminiModel,
    new Date().toISOString()
  );
  return info.lastInsertRowid;
}

function logMetaCapiEvent(event) {
  const existing = db.prepare('SELECT id, created_at FROM meta_capi_events WHERE event_id = ?').get(event.eventId);
  if (existing) {
    return { deduplicated: true, id: existing.id, createdAt: existing.created_at };
  }
  const now = new Date().toISOString();
  const info = db.prepare(`
    INSERT INTO meta_capi_events (
      event_name, event_id, utm_source, utm_medium, utm_campaign,
      utm_content, value_usd, currency, page_url, user_agent, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    event.eventName,
    event.eventId,
    event.utmSource || 'direct',
    event.utmMedium || 'none',
    event.utmCampaign || 'abandon_alpha_launch',
    event.utmContent || 'default',
    event.valueUsd || 0,
    event.currency || 'USD',
    event.pageUrl || '/',
    event.userAgent || 'AbandonAlpha-Client/1.0',
    now
  );
  return { deduplicated: false, id: info.lastInsertRowid, createdAt: now };
}

function logCheckoutSession(session) {
  const now = new Date().toISOString();
  const info = db.prepare(`
    INSERT INTO checkout_sessions (
      plan_tier, price_monthly_usd, customer_email, store_domain,
      stripe_session_id, status, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(
    session.planTier,
    session.priceMonthlyUsd,
    session.customerEmail,
    session.storeDomain || 'merchant.example.com',
    session.stripeSessionId,
    session.status,
    now
  );
  return { id: info.lastInsertRowid, createdAt: now };
}

function getTelemetrySummary() {
  const totalAudits = db.prepare('SELECT COUNT(*) AS cnt FROM leakage_audits').get().cnt;
  const totalBanditEvents = db.prepare('SELECT COUNT(*) AS cnt FROM bandit_events').get().cnt;
  const totalWebhookSims = db.prepare('SELECT COUNT(*) AS cnt FROM webhook_simulations').get().cnt;
  const totalCapiEvents = db.prepare('SELECT COUNT(*) AS cnt FROM meta_capi_events').get().cnt;
  const totalCheckouts = db.prepare('SELECT COUNT(*) AS cnt FROM checkout_sessions').get().cnt;
  const arms = getAllBanditArms();
  const totalRecoveredUsd = arms.reduce((acc, a) => acc + a.recovered_revenue_usd, 0);
  return {
    totalAudits,
    totalBanditEvents,
    totalWebhookSims,
    totalCapiEvents,
    totalCheckouts,
    totalRecoveredUsd: Number(totalRecoveredUsd.toFixed(2)),
    arms
  };
}

module.exports = {
  db,
  DB_PATH,
  getAllBanditArms,
  updateBanditArmStats,
  logBanditEvent,
  logLeakageAudit,
  logWebhookSimulation,
  logMetaCapiEvent,
  logCheckoutSession,
  getTelemetrySummary
};
