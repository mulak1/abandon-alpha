const PRESET_DATA = {
  shopify_dtc: { storeName: 'AuraBotanics DTC', monthlySessions: 3200, aovUsd: 92, abandonRatePct: 71.5, failedCardRatePct: 4.8 },
  b2b_saas: { storeName: 'CloudPulse DevTools', monthlySessions: 950, aovUsd: 89, abandonRatePct: 68.0, failedCardRatePct: 7.4 },
  creator_info: { storeName: 'DesignSystems Academy', monthlySessions: 1400, aovUsd: 115, abandonRatePct: 74.2, failedCardRatePct: 5.5 },
  subscription_app: { storeName: 'KinectAI Pro', monthlySessions: 5400, aovUsd: 72, abandonRatePct: 69.4, failedCardRatePct: 8.6 }
};

let currentPreset = 'shopify_dtc';

function formatUsd(num) {
  return '$' + Math.round(Number(num || 0)).toLocaleString();
}

function applyPreset(presetKey, btnEl) {
  const p = PRESET_DATA[presetKey];
  if (!p) return;
  currentPreset = presetKey;
  document.querySelectorAll('.preset-btn').forEach((b) => b.classList.remove('active'));
  if (btnEl) {
    btnEl.classList.add('active');
  } else {
    const matchBtn = document.querySelector(`.preset-btn[data-preset="${presetKey}"]`);
    if (matchBtn) matchBtn.classList.add('active');
  }

  document.getElementById('input-store').value = p.storeName;
  document.getElementById('input-sessions').value = p.monthlySessions;
  document.getElementById('input-aov').value = p.aovUsd;
  document.getElementById('input-abandon').value = p.abandonRatePct;
  document.getElementById('input-fail').value = p.failedCardRatePct;

  try {
    const u = new URL(window.location.href);
    u.searchParams.set('preset', presetKey);
    window.history.replaceState({}, '', u.pathname + u.search + u.hash);
  } catch (_) {}

  runAuditRequest(presetKey, false, true);
}

function onDeclineFocusChange(declineCode) {
  const whSelect = document.getElementById('wh-decline-code');
  if (whSelect && declineCode && declineCode !== 'auto_weighted') {
    const hasOpt = Array.from(whSelect.options || []).some((o) => o.value === declineCode);
    if (hasOpt) whSelect.value = declineCode;
  }
  runAuditRequest(currentPreset, false, true);
}

async function submitLeakageAudit(e) {
  if (e && e.preventDefault) e.preventDefault();
  await runAuditRequest(currentPreset, false, true);
  return false;
}

function triggerHeaderMrrCalc(e) {
  if (e && e.preventDefault) e.preventDefault();
  const graderEl = document.getElementById('grader');
  if (graderEl && graderEl.scrollIntoView) {
    graderEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
  runAuditRequest(currentPreset, false, true);
  return false;
}

const DECLINE_SEO_LINKS = {
  insufficient_funds: '/seo/stripe-decline-code-insufficient-funds-recovery',
  do_not_honor: '/seo/stripe-decline-code-do-not-honor-retry-schedule',
  expired_card: '/seo/stripe-decline-code-expired-card-dunning-flow',
  authentication_required: '/seo/stripe-decline-code-authentication-required-3ds-flow',
  processing_error: '/seo/stripe-decline-code-processing-error-exponential-backoff'
};

async function runAuditRequest(presetType, isAutoInit, isManualTrigger) {
  const btn = document.getElementById('run-audit-btn');
  const navBtn = document.getElementById('nav-calc-mrr-btn');
  if (isManualTrigger && btn) btn.innerHTML = '<span>Calculating MRR...</span><span class="btn-icon-circle" aria-hidden="true">↻</span>';
  if (isManualTrigger && navBtn) navBtn.innerHTML = '<span>Calculating...</span><span class="btn-icon-circle" aria-hidden="true">↻</span>';

  const primaryDeclineCode = document.getElementById('input-decline-focus')?.value || 'auto_weighted';
  const payload = {
    presetType: presetType || 'custom',
    primaryDeclineCode,
    storeName: document.getElementById('input-store').value,
    monthlySessions: Number(document.getElementById('input-sessions').value),
    aovUsd: Number(document.getElementById('input-aov').value),
    abandonRatePct: Number(document.getElementById('input-abandon').value),
    failedCardRatePct: Number(document.getElementById('input-fail').value),
    unlocked: Boolean(window.__ebIsUnlocked),
    website_url: document.getElementById('input-honeypot')?.value || ''
  };

  if (isManualTrigger) {
    try {
      const u = new URL(window.location.href);
      u.searchParams.set('preset', payload.presetType);
      if (primaryDeclineCode !== 'auto_weighted') u.searchParams.set('decline', primaryDeclineCode);
      else u.searchParams.delete('decline');
      u.searchParams.set('sessions', String(payload.monthlySessions));
      u.searchParams.set('aov', String(payload.aovUsd));
      window.history.replaceState({}, '', u.pathname + u.search + u.hash);
    } catch (_) {}
  }

  const headers = { 'Content-Type': 'application/json' };
  if (isAutoInit) headers['x-auto-init'] = '1';
  const res = await fetch('/api/audit-leakage', {
    method: 'POST',
    headers,
    body: JSON.stringify(payload)
  }).then((r) => r.json()).catch(() => null);

  if (btn) btn.innerHTML = '<span>Calculate My Recoverable Revenue</span><span class="btn-icon-circle" aria-hidden="true">↗</span>';
  if (navBtn) navBtn.innerHTML = '<span>Calculate Recoverable MRR</span><span class="btn-icon-circle" aria-hidden="true">↗</span>';
  if (!res || !res.ok) return;

  document.getElementById('out-grade-badge').textContent = `GRADE: ${res.letterGrade} (${res.gradeScore}/100)`;
  document.getElementById('out-total-leaked').textContent = formatUsd(res.totalMonthlyLeakedUsd);
  document.getElementById('out-leaked-sub').textContent = `${formatUsd(res.leakedCheckoutUsd)} Cart + ${formatUsd(res.leakedDunningUsd)} Failed Cards`;
  document.getElementById('out-total-recovered').textContent = `+${formatUsd(res.totalRecoverableUsd)}/mo`;
  document.getElementById('out-annual-recovered').textContent = `+${formatUsd(res.annualizedRecoverableUsd)}/yr Net Impact (${res.roiMultipleStarter}x ROI)`;
  document.getElementById('out-exit-recovered').textContent = `+${formatUsd(res.recoverableExitUsd)}/mo (${res.recoveredOrdersCount} orders)`;
  document.getElementById('out-dunning-recovered').textContent = `+${formatUsd(res.recoverableDunningUsd)}/mo`;
  document.getElementById('out-sdk-snippet').textContent = window.__ebIsUnlocked ? res.sdkSnippet : '/* [LOCKED PREVIEW]: Unlock the $1.99 Single-Audit Pass to reveal your custom C1-C6 Bandit SDK tag & Stripe retry worker */';

  const statusEl = document.getElementById('audit-form-status');
  if (statusEl) {
    const focusNote = primaryDeclineCode !== 'auto_weighted' ? ` • Primary Focus: ${primaryDeclineCode}` : '';
    statusEl.textContent = `✓ Recoverable MRR Calculated for ${res.storeName}: +${formatUsd(res.totalRecoverableUsd)}/mo (+${formatUsd(res.annualizedRecoverableUsd)}/yr across ${res.monthlySessions.toLocaleString()} sessions${focusNote})`;
    statusEl.style.color = '#059669';
    statusEl.style.fontWeight = '700';
  }

  const mrrTile = document.getElementById('recoverable-mrr-tile') || document.getElementById('out-total-recovered')?.parentElement;
  if (isManualTrigger && mrrTile) {
    mrrTile.style.transition = 'box-shadow 250ms ease, transform 250ms ease';
    mrrTile.style.boxShadow = '0 0 0 3px rgba(16, 185, 129, 0.45)';
    mrrTile.style.transform = 'scale(1.02)';
    setTimeout(() => {
      mrrTile.style.boxShadow = '';
      mrrTile.style.transform = '';
    }, 900);
  }

  if (Array.isArray(res.dunningBreakdown)) {
    const breakdownHtml = res.dunningBreakdown.slice(0, 3).map((d) => {
      const seoHref = DECLINE_SEO_LINKS[d.declineCode] || '/directory';
      return `
      <div class="spec-row">
        <span class="spec-k"><a href="${seoHref}"><code>${d.declineCode}</code></a> (${d.recoveryRatePct}% recoverable${d.sharePct ? ` • ${d.sharePct}% share` : ''} • Schedule Locked 🔒)</span>
        <span class="spec-v text-emerald">+${formatUsd(d.recoveredUsd)}/mo</span>
      </div>`;
    }).join('');
    document.getElementById('out-dunning-breakdown').innerHTML = breakdownHtml;
  }
}

function copySdkSnippet() {
  const code = document.getElementById('out-sdk-snippet').textContent;
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(code).catch(() => {});
  }
  const btn = document.getElementById('copy-sdk-btn');
  btn.textContent = 'Copied to Clipboard!';
  setTimeout(() => {
    btn.textContent = 'Copy Script Tag';
  }, 1800);
}

function renderPosteriorTable(arms, selectedId) {
  const tbody = document.getElementById('posterior-table-body');
  if (!tbody || !Array.isArray(arms)) return;

  let totalRec = 0;
  tbody.innerHTML = arms.map((arm) => {
    totalRec += Number(arm.recovered_revenue_usd || 0);
    const isWin = arm.id === selectedId;
    const barWidth = Math.min(100, Math.max(12, Math.round(arm.posterior_mean_pct * 3.2)));
    return `
      <tr style="${isWin ? 'background: rgba(83, 58, 253, 0.07);' : ''}">
        <td>
          <strong style="color:${isWin ? '#047857' : '#0A2540'}">${arm.objection_code}</strong>
          <div style="font-size:0.72rem; color:#475569; font-family:var(--font-sans);">${arm.objection_label}</div>
        </td>
        <td><code class="text-indigo">${arm.offer_code}</code> (-${arm.discount_pct}%)</td>
        <td>${arm.alpha}</td>
        <td>${arm.beta}</td>
        <td>
          <strong style="color:#0A2540;">${arm.posterior_mean_pct}%</strong>
          <div class="prob-bar-bg"><div class="prob-bar-fill" style="width:${barWidth}%"></div></div>
        </td>
        <td class="text-emerald">$${Math.round(arm.recovered_revenue_usd).toLocaleString()}</td>
      </tr>
    `;
  }).join('');

  const totalBadge = document.getElementById('bandit-total-recovered');
  if (totalBadge) {
    totalBadge.textContent = `Total Bandit Recovered: $${Math.round(totalRec).toLocaleString()}`;
  }
}

async function triggerBanditObjection(objectionCode, btnEl) {
  if (btnEl) {
    document.querySelectorAll('#objection-btn-group .objection-btn').forEach((b) => b.classList.remove('selected'));
    btnEl.classList.add('selected');
  }

  const aovUsd = Number(document.getElementById('input-aov')?.value || 92);
  const res = await fetch('/api/bandit-select', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      objectionCode,
      aovUsd,
      simulateConversion: true,
      velocityTelemetry: {
        clientY: 14,
        velocityY: -0.96,
        timeToEdgeMs: 19,
        tabHidden: false
      }
    })
  }).then((r) => r.json()).catch(() => null);

  if (!res || !res.ok) return;

  const win = res.selectedArm;
  document.getElementById('bandit-offer-headline').textContent = win.offer_headline;
  document.getElementById('bandit-offer-subtext').textContent = win.offer_subtext;
  document.getElementById('bandit-offer-code').textContent = win.offer_code;
  document.getElementById('bandit-sampled-theta').textContent = win.sampled_theta;
  document.getElementById('bandit-erpv').textContent = `$${win.erpv_usd}`;
  document.getElementById('bandit-velocity-pill').textContent = `v_y: ${res.trajectory.telemetry.velocityY} px/ms • Score: ${res.trajectory.score}/100`;

  renderPosteriorTable(res.posteriors, win.id);
  return res;
}

async function runWebhookSimulation(e) {
  if (e) e.preventDefault();
  const payload = {
    eventType: document.getElementById('wh-event-type').value,
    declineCode: document.getElementById('wh-decline-code').value,
    customerEmail: document.getElementById('wh-email').value,
    amountUsd: Number(document.getElementById('wh-amount').value || 149),
    storeName: document.getElementById('input-store').value || 'AuraBotanics DTC',
    website_url: document.getElementById('wh-honeypot')?.value || ''
  };

  const res = await fetch('/api/webhook-simulate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  }).then((r) => r.json()).catch(() => null);

  if (!res || !res.ok) return;

  document.getElementById('wh-out-classification').textContent = res.classification;
  document.getElementById('wh-out-recovery-rate').textContent = `Expected Recovery: ${res.expectedRecoveryRatePct}%`;
  document.getElementById('wh-out-network-rule').textContent = `Card Network Mandate: ${res.cardNetworkRule}`;
  document.getElementById('wh-out-model').textContent = res.geminiModel;
  document.getElementById('wh-out-subject').textContent = `Subject: ${res.recoveryCopy.emailSubject}`;
  document.getElementById('wh-out-body').textContent = window.__ebIsUnlocked
    ? `${res.recoveryCopy.emailBody}\n\n[SMS Dispatch]: ${res.recoveryCopy.smsBody}`
    : `[LOCKED IN FREE PREVIEW]: Unlock the $1.99 Single-Audit Pass to reveal the exact ${payload.declineCode} retry schedule, 1-click Apple Pay link generator, and customer Email/SMS recovery copy.`;

  if (Array.isArray(res.retrySchedule)) {
    document.getElementById('wh-timeline-container').innerHTML = res.retrySchedule.map((s, idx) => idx === 0 || window.__ebIsUnlocked ? `
      <div class="timeline-step">
        <strong>Step ${s.step} • Bank Classification Verified (${res.expectedRecoveryRatePct}% Recoverable)</strong>
        <p>Diagnostic complete for <code>${payload.declineCode}</code>.</p>
      </div>
    ` : `
      <div class="timeline-step">
        <strong>Step ${s.step} • 🔒 Optimal Retry Window &amp; Fallback [REDACTED IN PREVIEW]</strong>
        <p>Unlock the $1.99 Single-Audit Pass to reveal exact retry timestamps and webhook code.</p>
      </div>
    `).join('');
  }
}

async function initiateStripeCheckout(planTier) {
  if (typeof gtag === 'function') {
    gtag('event', 'begin_checkout', {
      'value': planTier === 'starter' ? 49.00 : (planTier === 'growth' ? 149.00 : 29.00),
      'currency': 'USD'
    });
  }
  const email = document.getElementById('wh-email')?.value || 'founder@merchant.io';
  const storeDomain = document.getElementById('input-store')?.value || 'AuraBotanics DTC';

  const res = await fetch('/api/checkout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ planTier, customerEmail: email, storeDomain })
  }).then((r) => r.json()).catch(() => null);

  if (!res || !res.ok) return;

  const banner = document.getElementById('checkout-status-banner');
  const text = document.getElementById('checkout-status-text');
  const badge = document.getElementById('checkout-session-badge');
  banner.style.display = 'block';
  badge.textContent = res.stripeSessionId;
  text.innerHTML = `Initialized ${res.planLabel} for ${res.storeDomain} (${res.customerEmail}). Protected by ${res.guarantee}. <a href="${res.checkoutUrl || '/buy/complete_dossier'}" style="color:var(--accent-indigo);text-decoration:underline;font-weight:700;margin-left:6px;">Proceed to Stripe Checkout ↗</a>`;
  if (!navigator.webdriver && res.checkoutUrl && res.checkoutUrl.startsWith('https://checkout.stripe.com')) window.location.href = res.checkoutUrl;
}

function openExitIntentModal() {
  const modal = document.getElementById('exit-intent-modal');
  if (modal) modal.classList.add('open');
}

function closeExitIntentModal() {
  const modal = document.getElementById('exit-intent-modal');
  if (modal) modal.classList.remove('open');
}

async function modalSelectObjection(objectionCode) {
  const res = await triggerBanditObjection(objectionCode, null);
  if (res && res.selectedArm) {
    document.getElementById('modal-offer-headline').textContent = `${res.selectedArm.offer_headline} (Code: ${res.selectedArm.offer_code})`;
    document.getElementById('modal-offer-subtext').textContent = `${res.selectedArm.offer_subtext}: SQLite Posterior α updated to ${res.selectedArm.updated_alpha}!`;
  }
}

function setCookieConsent(choice) {
  try {
    localStorage.setItem('aa_cookie_consent', choice);
  } catch (_) {}
  const banner = document.getElementById('cookie-consent-banner');
  if (banner) banner.style.display = 'none';
}

window.AbandonAlphaTriggerModal = function () {};

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeExitIntentModal();
});

window.addEventListener('DOMContentLoaded', async () => {
  try {
    if (localStorage.getItem('aa_cookie_consent')) {
      const banner = document.getElementById('cookie-consent-banner');
      if (banner) banner.style.display = 'none';
    }
  } catch (_) {}
  const armsRes = await fetch('/api/bandit-arms').then((r) => r.json()).catch(() => null);
  if (armsRes && armsRes.arms) {
    renderPosteriorTable(armsRes.arms, 'arm_c1_price_15off');
  }

  const params = new URLSearchParams(window.location.search);
  if (params.get('checkout') === 'success') {
    const tier = params.get('tier') || 'playbook_pass';
    const price = tier === 'playbook_pass' ? 29.00 : (tier === 'micro_pass' ? 0.99 : (tier === 'flash_pass' ? 1.99 : 49.00));
    if (typeof gtag === 'function') {
      gtag('event', 'conversion', {
        'send_to': 'AW-18526471751',
        'value': price,
        'currency': 'USD',
        'transaction_id': params.get('session_id') || ('order_' + Date.now())
      });
    }
  }
  const qPreset = params.get('preset');
  const qDecline = params.get('decline') || params.get('q') || params.get('target');
  const qStore = params.get('store');
  const qSessions = params.get('sessions');
  const qAov = params.get('aov');
  const hasDeepLink = Boolean(qPreset || qDecline || qStore || qSessions || qAov);

  if (qPreset && PRESET_DATA[qPreset]) {
    currentPreset = qPreset;
    const p = PRESET_DATA[qPreset];
    document.querySelectorAll('.preset-btn').forEach((b) => b.classList.remove('active'));
    const matchBtn = document.querySelector(`.preset-btn[data-preset="${qPreset}"]`);
    if (matchBtn) matchBtn.classList.add('active');
    document.getElementById('input-store').value = p.storeName;
    document.getElementById('input-sessions').value = p.monthlySessions;
    document.getElementById('input-aov').value = p.aovUsd;
    document.getElementById('input-abandon').value = p.abandonRatePct;
    document.getElementById('input-fail').value = p.failedCardRatePct;
  }

  if (qStore) document.getElementById('input-store').value = qStore;
  if (qSessions && Number(qSessions) >= 50) document.getElementById('input-sessions').value = Number(qSessions);
  if (qAov && Number(qAov) >= 5) document.getElementById('input-aov').value = Number(qAov);

  if (qDecline) {
    const focusSel = document.getElementById('input-decline-focus');
    if (focusSel && Array.from(focusSel.options).some((o) => o.value === qDecline)) {
      focusSel.value = qDecline;
    }
    const whSel = document.getElementById('wh-decline-code');
    if (whSel && Array.from(whSel.options).some((o) => o.value === qDecline)) {
      whSel.value = qDecline;
    }
  }

  if (hasDeepLink) {
    await runAuditRequest(currentPreset, false, true);
    if (window.location.hash === '#webhook-lab' || qDecline) {
      await runWebhookSimulation();
    }
  } else {
    await runAuditRequest('shopify_dtc', true, false);
  }

  let liveAuditTimer = null;
  ['input-sessions', 'input-aov', 'input-abandon', 'input-fail', 'input-store'].forEach((id) => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('input', () => {
        if (liveAuditTimer) clearTimeout(liveAuditTimer);
        liveAuditTimer = setTimeout(() => runAuditRequest('custom', false, true), 480);
      });
    }
  });
  let liveWhTimer = null;
  ['wh-event-type', 'wh-decline-code', 'wh-amount'].forEach((id) => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('change', () => {
        if (liveWhTimer) clearTimeout(liveWhTimer);
        liveWhTimer = setTimeout(() => runWebhookSimulation(), 320);
      });
    }
  });
});


