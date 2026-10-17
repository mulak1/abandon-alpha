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
  if (btnEl) btnEl.classList.add('active');

  document.getElementById('input-store').value = p.storeName;
  document.getElementById('input-sessions').value = p.monthlySessions;
  document.getElementById('input-aov').value = p.aovUsd;
  document.getElementById('input-abandon').value = p.abandonRatePct;
  document.getElementById('input-fail').value = p.failedCardRatePct;

  runAuditRequest(presetKey);
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

async function runAuditRequest(presetType, isAutoInit, isManualTrigger) {
  const btn = document.getElementById('run-audit-btn');
  const navBtn = document.getElementById('nav-calc-mrr-btn');
  if (isManualTrigger && btn) btn.innerHTML = '<span>Calculating MRR...</span><span class="btn-icon-circle" aria-hidden="true">↻</span>';
  if (isManualTrigger && navBtn) navBtn.innerHTML = '<span>Calculating...</span><span class="btn-icon-circle" aria-hidden="true">↻</span>';

  const payload = {
    presetType: presetType || 'custom',
    storeName: document.getElementById('input-store').value,
    monthlySessions: Number(document.getElementById('input-sessions').value),
    aovUsd: Number(document.getElementById('input-aov').value),
    abandonRatePct: Number(document.getElementById('input-abandon').value),
    failedCardRatePct: Number(document.getElementById('input-fail').value),
    website_url: document.getElementById('input-honeypot')?.value || ''
  };

  const headers = { 'Content-Type': 'application/json' };
  if (isAutoInit) headers['x-auto-init'] = '1';
  const res = await fetch('/api/audit-leakage', {
    method: 'POST',
    headers,
    body: JSON.stringify(payload)
  }).then((r) => r.json()).catch(() => null);

  if (btn) btn.innerHTML = '<span>Calculate Recoverable MRR</span><span class="btn-icon-circle" aria-hidden="true">↗</span>';
  if (navBtn) navBtn.innerHTML = '<span>Calculate Recoverable MRR</span><span class="btn-icon-circle" aria-hidden="true">↗</span>';
  if (!res || !res.ok) return;

  document.getElementById('out-grade-badge').textContent = `GRADE: ${res.letterGrade} (${res.gradeScore}/100)`;
  document.getElementById('out-total-leaked').textContent = formatUsd(res.totalMonthlyLeakedUsd);
  document.getElementById('out-leaked-sub').textContent = `${formatUsd(res.leakedCheckoutUsd)} Cart + ${formatUsd(res.leakedDunningUsd)} Failed Cards`;
  document.getElementById('out-total-recovered').textContent = `+${formatUsd(res.totalRecoverableUsd)}/mo`;
  document.getElementById('out-annual-recovered').textContent = `+${formatUsd(res.annualizedRecoverableUsd)}/yr Net Impact (${res.roiMultipleStarter}x ROI)`;
  document.getElementById('out-exit-recovered').textContent = `+${formatUsd(res.recoverableExitUsd)}/mo (${res.recoveredOrdersCount} orders)`;
  document.getElementById('out-dunning-recovered').textContent = `+${formatUsd(res.recoverableDunningUsd)}/mo`;
  document.getElementById('out-sdk-snippet').textContent = res.sdkSnippet;

  const statusEl = document.getElementById('audit-form-status');
  if (statusEl) {
    statusEl.textContent = `✓ Recoverable MRR Calculated for ${res.storeName}: +${formatUsd(res.totalRecoverableUsd)}/mo (+${formatUsd(res.annualizedRecoverableUsd)}/yr across ${res.monthlySessions.toLocaleString()} sessions)`;
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
    const breakdownHtml = res.dunningBreakdown.slice(0, 3).map((d) => `
      <div class="spec-row">
        <span class="spec-k"><code>${d.declineCode}</code> (${d.recoveryRatePct}% recovery)</span>
        <span class="spec-v text-emerald">+${formatUsd(d.recoveredUsd)}/mo</span>
      </div>
    `).join('');
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
  document.getElementById('wh-out-body').textContent = `${res.recoveryCopy.emailBody}\n\n[SMS Dispatch]: ${res.recoveryCopy.smsBody}`;

  if (Array.isArray(res.retrySchedule)) {
    document.getElementById('wh-timeline-container').innerHTML = res.retrySchedule.map((s) => `
      <div class="timeline-step">
        <strong>Step ${s.step} • ${s.timing} — ${s.channel}</strong>
        <p>${s.action}</p>
      </div>
    `).join('');
  }
}

async function initiateStripeCheckout(planTier) {
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
  text.textContent = `Initialized ${res.planLabel} for ${res.storeDomain} (${res.customerEmail}). Protected by ${res.guarantee}.`;
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
    document.getElementById('modal-offer-subtext').textContent = `${res.selectedArm.offer_subtext} — SQLite Posterior α updated to ${res.selectedArm.updated_alpha}!`;
  }
}

function setCookieConsent(choice) {
  try {
    localStorage.setItem('aa_cookie_consent', choice);
  } catch (_) {}
  const banner = document.getElementById('cookie-consent-banner');
  if (banner) banner.style.display = 'none';
}

window.AbandonAlphaTriggerModal = function () {
  openExitIntentModal();
};

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
  await runAuditRequest('shopify_dtc', true);
});
