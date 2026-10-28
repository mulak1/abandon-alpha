const PRESET_DATA = {
  shopify_dtc: { storeName: 'Gymshark', storeUrl: 'gymshark.com', stack: 'Shopify + Stripe', monthlySessions: 3200, aovUsd: 92, abandonRatePct: 71.5, failedCardRatePct: 4.8 },
  b2b_saas: { storeName: 'Linear', storeUrl: 'linear.app', stack: 'Stripe Billing SaaS', monthlySessions: 950, aovUsd: 89, abandonRatePct: 68.0, failedCardRatePct: 7.4 },
  creator_info: { storeName: 'MasterClass', storeUrl: 'masterclass.com', stack: 'Next.js + Stripe', monthlySessions: 1400, aovUsd: 115, abandonRatePct: 74.2, failedCardRatePct: 5.5 },
  subscription_app: { storeName: 'Whoop', storeUrl: 'whoop.com', stack: 'Stripe Billing SaaS', monthlySessions: 5400, aovUsd: 72, abandonRatePct: 69.4, failedCardRatePct: 8.6 }
};

let currentPreset = 'shopify_dtc';
const AA_STATE_KEY = 'aa_workspace_state_v1';

function formatUsd(num) {
  return '$' + Math.round(Number(num || 0)).toLocaleString();
}

function cleanMerchantDomain(raw) {
  const s = String(raw || '').trim().toLowerCase().replace(/^https?:\/\//, '').replace(/^www\./, '').split(/[/?#]/)[0];
  if (s && s.includes('.')) return s.replace(/[^a-z0-9.-]/g, '');
  const slug = String(raw || 'gymshark').toLowerCase().replace(/[^a-z0-9]/g, '');
  return (slug || 'gymshark') + '.com';
}

function saveAaWorkspaceState() {
  try {
    const state = {
      preset: currentPreset,
      storeName: document.getElementById('input-store')?.value || '',
      storeUrl: document.getElementById('input-store-url')?.value || '',
      monthlySessions: Number(document.getElementById('input-sessions')?.value || 3200),
      aovUsd: Number(document.getElementById('input-aov')?.value || 92),
      declineFocus: document.getElementById('input-decline-focus')?.value || 'auto_weighted',
      abandonRatePct: Number(document.getElementById('input-abandon')?.value || 71.5),
      failedCardRatePct: Number(document.getElementById('input-fail')?.value || 4.8),
      customStack: document.getElementById('custom-stack')?.value || 'Shopify + Stripe',
      customMaxRebate: document.getElementById('custom-max-rebate')?.value || '15% Founders Cap',
      customPaydaySync: document.getElementById('custom-payday-sync')?.value || '1st & 15th 06:00 Local',
      whEventType: document.getElementById('wh-event-type')?.value || 'invoice.payment_failed',
      whDeclineCode: document.getElementById('wh-decline-code')?.value || 'insufficient_funds',
      whEmail: document.getElementById('wh-email')?.value || 'founder@merchant.io',
      whAmount: Number(document.getElementById('wh-amount')?.value || 149),
      savedAt: Date.now()
    };
    localStorage.setItem(AA_STATE_KEY, JSON.stringify(state));
  } catch (_) {}
}

function restoreAaWorkspaceState() {
  try {
    const raw = localStorage.getItem(AA_STATE_KEY);
    if (!raw) return false;
    const s = JSON.parse(raw);
    if (!s || typeof s !== 'object') return false;
    const setVal = (id, v) => {
      const el = document.getElementById(id);
      if (!el || v === undefined || v === null || v === '') return;
      if (el.tagName === 'SELECT' && !Array.from(el.options).some((o) => o.value === String(v))) return;
      el.value = v;
    };
    if (s.preset) currentPreset = s.preset;
    setVal('input-store', s.storeName);
    setVal('input-store-url', s.storeUrl);
    setVal('input-sessions', s.monthlySessions);
    setVal('input-aov', s.aovUsd);
    setVal('input-decline-focus', s.declineFocus);
    setVal('input-abandon', s.abandonRatePct);
    setVal('input-fail', s.failedCardRatePct);
    setVal('custom-stack', s.customStack);
    setVal('custom-max-rebate', s.customMaxRebate);
    setVal('custom-payday-sync', s.customPaydaySync);
    setVal('wh-event-type', s.whEventType);
    setVal('wh-decline-code', s.whDeclineCode);
    setVal('wh-email', s.whEmail);
    setVal('wh-amount', s.whAmount);
    return true;
  } catch (_) {
    return false;
  }
}

function escapeUiHtml(str) {
  return String(str || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function updateUnmaskedSdkPreview(auditRes) {
  const storeName = document.getElementById('input-store')?.value || 'Gymshark';
  const rawUrl = document.getElementById('input-store-url')?.value || storeName;
  const domain = cleanMerchantDomain(rawUrl);
  const declineCode = document.getElementById('input-decline-focus')?.value || 'insufficient_funds';
  const activeRule = declineCode === 'auto_weighted' ? 'insufficient_funds' : declineCode;
  const exitUsd = auditRes?.recoverableExitUsd ? '+' + formatUsd(auditRes.recoverableExitUsd) + '/mo' : '+$34,521/mo';
  const dunningUsd = auditRes?.recoverableDunningUsd ? '+' + formatUsd(auditRes.recoverableDunningUsd) + '/mo' : '+$2,201/mo';

  const permalinkEl = document.getElementById('aa-live-scan-permalink');
  if (permalinkEl) {
    permalinkEl.href = '/scan/' + encodeURIComponent(domain);
    permalinkEl.textContent = 'Public Scan (/scan/' + domain + ') ↗';
  }

  const previewEl = document.getElementById('out-sdk-unmasked-preview');
  if (previewEl) {
    previewEl.innerHTML = [
      `<div style="display:flex;justify-content:space-between;align-items:center;gap:10px;padding:8px 12px;border-radius:8px;background:#FFFFFF;">`,
      `  <span style="font-size:0.8125rem;color:#0A2540;font-weight:700;">1. stripe-retry-rules.json <span style="color:#64748B;font-weight:500;">(${escapeUiHtml(activeRule)} Cron)</span></span>`,
      `  <span style="font-size:0.8125rem;color:#047857;font-weight:700;white-space:nowrap;">${escapeUiHtml(dunningUsd)} &bull; Locked</span>`,
      `</div>`,
      `<div style="display:flex;justify-content:space-between;align-items:center;gap:10px;padding:8px 12px;border-radius:8px;background:#FFFFFF;">`,
      `  <span style="font-size:0.8125rem;color:#0A2540;font-weight:700;">2. exit-bandit-c1-c6.js <span style="color:#64748B;font-weight:500;">(${escapeUiHtml(storeName)} Exit Script)</span></span>`,
      `  <span style="font-size:0.8125rem;color:#047857;font-weight:700;white-space:nowrap;">${escapeUiHtml(exitUsd)} &bull; Locked</span>`,
      `</div>`,
      `<div style="display:flex;justify-content:space-between;align-items:center;gap:10px;padding:8px 12px;border-radius:8px;background:#FFFFFF;">`,
      `  <span style="font-size:0.8125rem;color:#0A2540;font-weight:700;">3. dunning-sms-email.md <span style="color:#64748B;font-weight:500;">(1-Tap Apple Pay)</span></span>`,
      `  <span style="font-size:0.8125rem;color:#047857;font-weight:700;white-space:nowrap;">Included in $1.99 Kit</span>`,
      `</div>`
    ].join('');
  }
}

function onCustomizerChange() {
  updateUnmaskedSdkPreview(window.__LAST_AUDIT_RES__);
  saveAaWorkspaceState();
}

async function probeLiveMerchantStore(domainOverride) {
  const inputUrlEl = document.getElementById('input-store-url');
  const btnEl = document.getElementById('btn-probe-store');
  const badgeEl = document.getElementById('probed-stack-badge');
  const rawDomain = domainOverride || inputUrlEl?.value?.trim() || document.getElementById('input-store')?.value?.trim() || 'gymshark.com';
  if (inputUrlEl && !inputUrlEl.value.trim()) inputUrlEl.value = rawDomain;

  if (btnEl) {
    btnEl.disabled = true;
    btnEl.textContent = 'Probing...';
  }
  const res = await fetch('/api/probe-store', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ domain: rawDomain })
  }).then((r) => r.json()).catch(() => null);

  if (btnEl) {
    btnEl.disabled = false;
    btnEl.textContent = res && res.ok ? `✓ Scanned ${res.storeName}` : 'Scan Store ↗';
    if (res && res.ok) {
      btnEl.style.background = '#ECFDF5';
      btnEl.style.color = '#047857';
      setTimeout(() => {
        btnEl.textContent = 'Scan Store ↗';
        btnEl.style.background = '';
        btnEl.style.color = '';
      }, 2800);
    }
  }
  if (!res || !res.ok) return;

  if (res.storeName) document.getElementById('input-store').value = res.storeName;
  if (res.estimatedSessions) document.getElementById('input-sessions').value = res.estimatedSessions;
  if (res.estimatedAovUsd) document.getElementById('input-aov').value = res.estimatedAovUsd;
  if (res.estimatedAbandonRatePct) document.getElementById('input-abandon').value = res.estimatedAbandonRatePct;
  if (res.estimatedFailedCardRatePct) document.getElementById('input-fail').value = res.estimatedFailedCardRatePct;
  if (res.recommendedDeclineFocus) {
    const df = document.getElementById('input-decline-focus');
    if (df) df.value = res.recommendedDeclineFocus;
  }
  const customStackEl = document.getElementById('custom-stack');
  if (customStackEl && res.detectedStack && Array.from(customStackEl.options).some((o) => o.value === res.detectedStack)) {
    customStackEl.value = res.detectedStack;
  }
  if (badgeEl) {
    badgeEl.style.display = 'inline-block';
    badgeEl.textContent = `● ${res.detectedStack || 'Stripe + Shopify'} Verified`;
  }
  saveAaWorkspaceState();
  await runAuditRequest('custom', false, true);
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
  if (document.getElementById('input-store-url')) document.getElementById('input-store-url').value = p.storeUrl || '';
  if (document.getElementById('custom-stack') && p.stack) document.getElementById('custom-stack').value = p.stack;
  document.getElementById('input-sessions').value = p.monthlySessions;
  document.getElementById('input-aov').value = p.aovUsd;
  document.getElementById('input-abandon').value = p.abandonRatePct;
  document.getElementById('input-fail').value = p.failedCardRatePct;

  try {
    const u = new URL(window.location.href);
    u.searchParams.set('preset', presetKey);
    window.history.replaceState({}, '', u.pathname + u.search + u.hash);
  } catch (_) {}

  saveAaWorkspaceState();
  runAuditRequest(presetKey, false, true, true);
}

function onDeclineFocusChange(declineCode) {
  const whSelect = document.getElementById('wh-decline-code');
  if (whSelect && declineCode && declineCode !== 'auto_weighted') {
    const hasOpt = Array.from(whSelect.options || []).some((o) => o.value === declineCode);
    if (hasOpt) whSelect.value = declineCode;
  }
  runAuditRequest(currentPreset, false, true, true);
}

async function submitLeakageAudit(e) {
  if (e && e.preventDefault) e.preventDefault();
  await runAuditRequest(currentPreset, false, true, true);
  return false;
}

function triggerHeaderMrrCalc(e) {
  if (e && e.preventDefault) e.preventDefault();
  const graderEl = document.getElementById('grader');
  if (graderEl && graderEl.scrollIntoView) {
    graderEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
  runAuditRequest(currentPreset, false, true, true);
  return false;
}

const DECLINE_SEO_LINKS = {
  insufficient_funds: '/seo/stripe-decline-code-insufficient-funds-recovery',
  do_not_honor: '/seo/stripe-decline-code-do-not-honor-retry-schedule',
  expired_card: '/seo/stripe-decline-code-expired-card-dunning-flow',
  authentication_required: '/seo/stripe-decline-code-authentication-required-3ds-flow',
  processing_error: '/seo/stripe-decline-code-processing-error-exponential-backoff'
};

let auditBtnResetTimer = null;
async function runAuditRequest(presetType, isAutoInit, isManualTrigger, isExplicitClick) {
  const btn = document.getElementById('run-audit-btn');
  const navBtn = document.getElementById('nav-calc-mrr-btn');
  if (isExplicitClick && btn) {
    btn.style.background = '#3730A3';
    btn.innerHTML = '<span>Calculating Recoverable MRR...</span><span class="btn-icon-circle" aria-hidden="true">↻</span>';
  }
  if (isExplicitClick && navBtn) navBtn.innerHTML = '<span>Calculating...</span><span class="btn-icon-circle" aria-hidden="true">↻</span>';

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
  const [res] = await Promise.all([
    fetch('/api/audit-leakage', {
      method: 'POST',
      headers,
      body: JSON.stringify(payload)
    }).then((r) => r.json()).catch(() => null),
    isExplicitClick ? new Promise((r) => setTimeout(r, 180)) : Promise.resolve()
  ]);

  if (!res || !res.ok) {
    if (btn) {
      btn.style.background = '';
      btn.innerHTML = '<span>Calculate My Recoverable Revenue</span><span class="btn-icon-circle" aria-hidden="true">&rarr;</span>';
    }
    if (navBtn) navBtn.innerHTML = '<span>Calculate MRR</span><span class="btn-icon-circle" aria-hidden="true">&rarr;</span>';
    return;
  }

  if (isExplicitClick && btn) {
    if (auditBtnResetTimer) clearTimeout(auditBtnResetTimer);
    btn.style.background = '#047857';
    btn.innerHTML = `<span>✓ Calculated: +${formatUsd(res.totalRecoverableUsd)}/mo Recoverable</span><span class="btn-icon-circle" aria-hidden="true">✓</span>`;
    auditBtnResetTimer = setTimeout(() => {
      btn.style.background = '';
      btn.innerHTML = '<span>Calculate My Recoverable Revenue</span><span class="btn-icon-circle" aria-hidden="true">&rarr;</span>';
    }, 3200);
  } else if (btn) {
    btn.style.background = '';
    btn.innerHTML = '<span>Calculate My Recoverable Revenue</span><span class="btn-icon-circle" aria-hidden="true">&rarr;</span>';
  }
  if (navBtn) navBtn.innerHTML = '<span>Calculate MRR</span><span class="btn-icon-circle" aria-hidden="true">&rarr;</span>';

  window.__LAST_AUDIT_RES__ = res;
  if (isManualTrigger) saveAaWorkspaceState();

  document.getElementById('out-grade-badge').textContent = `Grade: ${res.letterGrade} (${res.gradeScore}/100)`;
  document.getElementById('out-total-leaked').textContent = formatUsd(res.totalMonthlyLeakedUsd);
  document.getElementById('out-leaked-sub').textContent = `${formatUsd(res.leakedCheckoutUsd)} Cart + ${formatUsd(res.leakedDunningUsd)} Failed Cards`;
  document.getElementById('out-total-recovered').textContent = `+${formatUsd(res.totalRecoverableUsd)}/mo`;
  document.getElementById('out-annual-recovered').textContent = `+${formatUsd(res.annualizedRecoverableUsd)}/yr Net Impact (${res.roiMultipleStarter}x ROI)`;
  document.getElementById('out-exit-recovered').textContent = `+${formatUsd(res.recoverableExitUsd)}/mo (${res.recoveredOrdersCount} orders)`;
  document.getElementById('out-dunning-recovered').textContent = `+${formatUsd(res.recoverableDunningUsd)}/mo`;
  updateUnmaskedSdkPreview(res);
  document.getElementById('out-sdk-snippet').textContent = window.__ebIsUnlocked ? res.sdkSnippet : '/* [LOCKED PREVIEW]: Unlock the $1.99 Single-Audit Pass to reveal your custom C1-C6 Bandit SDK tag & Stripe retry worker */';

  const statusEl = document.getElementById('audit-form-status');
  if (statusEl && (isManualTrigger || isExplicitClick)) {
    statusEl.innerHTML = `<span style="display:flex;justify-content:space-between;align-items:center;gap:8px;cursor:pointer;" onclick="var c=document.getElementById('aa-step2-card');if(c&&c.scrollIntoView)c.scrollIntoView({behavior:'smooth',block:'nearest'});"><span>✓ Step 1 Done for <strong>${escapeUiHtml(res.storeName)}</strong> &rarr; <strong>Now Focus on Step 2 (Right): +${formatUsd(res.totalRecoverableUsd)}/mo Recoverable</strong></span><span style="text-decoration:underline;white-space:nowrap;">Focus Step 2 &rarr;</span></span>`;
    statusEl.style.color = '#047857';
    statusEl.style.fontWeight = '700';
    statusEl.style.background = '#ECFDF5';
    statusEl.style.border = '1px solid #A7F3D0';
    statusEl.style.padding = '8px 12px';
    statusEl.style.borderRadius = '8px';
  }

  const mrrTile = document.getElementById('recoverable-mrr-tile') || document.getElementById('out-total-recovered')?.parentElement;
  const rightCard = document.getElementById('aa-step2-card') || (mrrTile ? mrrTile.closest('.telemetry-card') : null);
  const gradeBadge = document.getElementById('out-grade-badge');
  if ((isManualTrigger || isExplicitClick) && mrrTile) {
    if (gradeBadge) {
      gradeBadge.textContent = `👉 FOCUS HERE NEXT • ${res.storeName} (${res.letterGrade})`;
      gradeBadge.style.background = '#047857';
      gradeBadge.style.color = '#FFFFFF';
    }
    mrrTile.style.transition = 'transform 250ms ease, box-shadow 250ms ease';
    mrrTile.style.transform = 'scale(1.02)';
    mrrTile.style.boxShadow = '0 0 0 2px #10B981';
    if (rightCard) {
      rightCard.style.boxShadow = '0 0 0 3px #10B981, 0 14px 32px rgba(4, 120, 87, 0.16)';
      if (window.innerWidth < 960 && rightCard.scrollIntoView) {
        rightCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
    setTimeout(() => {
      mrrTile.style.transform = '';
      mrrTile.style.boxShadow = '';
    }, 1800);
  }

  if (Array.isArray(res.dunningBreakdown)) {
    const breakdownHtml = res.dunningBreakdown.slice(0, 3).map((d) => {
      const seoHref = DECLINE_SEO_LINKS[d.declineCode] || '/directory';
      return `
      <li>
        <a href="${seoHref}" style="display:flex;justify-content:space-between;align-items:center;gap:10px;text-decoration:none;padding:3px 6px;border-radius:6px;background:#F8FAFC;">
          <span style="font-size:0.8125rem;color:#334155;display:flex;align-items:center;gap:6px;">
            <span style="color:#64748B;font-weight:800;" aria-hidden="true">&bull;</span>
            <code style="font-weight:700;color:#0A2540;">${d.declineCode}</code>
            <span style="color:#64748B;font-size:0.75rem;">(${d.recoveryRatePct}% recoverable &bull; ${d.sharePct}% share)</span>
          </span>
          <strong class="text-emerald" style="font-size:0.8125rem;white-space:nowrap;">+${formatUsd(d.recoveredUsd)}/mo</strong>
        </a>
      </li>`;
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

const HUMAN_OBJECTION_TITLES = {
  C1_PRICE: 'Price Sensitivity',
  C2_TIMING: 'Just Browsing',
  C2_BROWSING: 'Just Browsing',
  C3_APPROVAL: 'Team Sign-Off',
  C4_COMPETITOR: 'Comparing Options',
  C5_SUBSCRIPTION: 'Subscription Fatigue',
  C6_FEATURE_FIT: 'Integration Fit'
};

function renderPosteriorTable(arms, selectedId) {
  const tbody = document.getElementById('posterior-table-body');
  if (!tbody || !Array.isArray(arms)) return;

  let totalRec = 0;
  tbody.innerHTML = arms.map((arm) => {
    totalRec += Number(arm.recovered_revenue_usd || 0);
    const isWin = arm.id === selectedId;
    const barWidth = Math.min(100, Math.max(12, Math.round(arm.posterior_mean_pct * 3.2)));
    const humanTitle = HUMAN_OBJECTION_TITLES[arm.objection_code] || arm.objection_label;
    return `
      <tr data-objection="${arm.objection_code}" style="cursor:pointer;${isWin ? 'background: #ECFDF5;' : ''}" onclick="triggerBanditObjection('${arm.objection_code}')">
        <td>
          <strong style="color:${isWin ? '#047857' : '#0A2540'}">${humanTitle}</strong>
          <div style="font-size:0.9375rem; color:#475569; font-family:var(--font-sans);">${arm.objection_label}</div>
          <div><button type="button" class="eb-row-sim-pill" onclick="event.stopPropagation();triggerBanditObjection('${arm.objection_code}')">${isWin ? '✓ Active Offer' : 'Simulate Offer ↗'}</button></div>
        </td>
        <td><code class="text-indigo">${arm.offer_code}</code> (-${arm.discount_pct}%)</td>
        <td>${arm.alpha}</td>
        <td>${Number(arm.alpha || 0) + Number(arm.beta || 0)}</td>
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
    totalBadge.textContent = `Total Recovered: $${Math.round(totalRec).toLocaleString()}`;
  }
  if (typeof window.__ebMountDeliverableCurtain === 'function') {
    window.__ebMountDeliverableCurtain();
  }
}

async function triggerBanditObjection(objectionCode, btnEl) {
  const normCode = objectionCode === 'C2_TIMING' ? 'C2_BROWSING' : objectionCode;
  document.querySelectorAll('#objection-btn-group .objection-btn').forEach((b) => {
    const match = btnEl ? (b === btnEl) : (b.getAttribute('data-obj') === normCode || b.getAttribute('data-obj') === objectionCode);
    b.classList.toggle('selected', match);
  });

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
  document.getElementById('bandit-sampled-theta').textContent = win.posterior_mean_pct ? `${win.posterior_mean_pct}%` : win.sampled_theta;
  document.getElementById('bandit-erpv').textContent = `$${win.erpv_usd}`;
  document.getElementById('bandit-velocity-pill').textContent = `Exit Signal Active • Score: ${res.trajectory.score}/100`;

  renderPosteriorTable(res.posteriors, win.id);
  return res;
}

let whBtnResetTimer = null;
async function runWebhookSimulation(e) {
  const isExplicitWhClick = Boolean(e && e.preventDefault);
  if (e && e.preventDefault) e.preventDefault();
  const whBtn = document.getElementById('wh-submit-btn');
  if (isExplicitWhClick && whBtn) {
    whBtn.style.background = '#3730A3';
    whBtn.innerHTML = '<span>Simulating Webhook Retry...</span><span class="btn-icon-circle" aria-hidden="true">↻</span>';
  }
  const payload = {
    eventType: document.getElementById('wh-event-type').value,
    declineCode: document.getElementById('wh-decline-code').value,
    customerEmail: document.getElementById('wh-email').value,
    amountUsd: Number(document.getElementById('wh-amount').value || 149),
    storeName: document.getElementById('input-store').value || 'Gymshark',
    website_url: document.getElementById('wh-honeypot')?.value || ''
  };

  const [res] = await Promise.all([
    fetch('/api/webhook-simulate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    }).then((r) => r.json()).catch(() => null),
    isExplicitWhClick ? new Promise((r) => setTimeout(r, 160)) : Promise.resolve()
  ]);

  if (!res || !res.ok) {
    if (whBtn) {
      whBtn.style.background = '';
      whBtn.innerHTML = '<span>Simulate Webhook Retry</span><span class="btn-icon-circle" aria-hidden="true">&rarr;</span>';
    }
    return;
  }

  if (isExplicitWhClick && whBtn) {
    if (whBtnResetTimer) clearTimeout(whBtnResetTimer);
    whBtn.style.background = '#047857';
    whBtn.innerHTML = `<span>✓ Simulated: ${res.expectedRecoveryRatePct}% Recovery (${payload.declineCode})</span><span class="btn-icon-circle" aria-hidden="true">✓</span>`;
    whBtnResetTimer = setTimeout(() => {
      whBtn.style.background = '';
      whBtn.innerHTML = '<span>Simulate Webhook Retry</span><span class="btn-icon-circle" aria-hidden="true">&rarr;</span>';
    }, 3200);
  }
  const whStatusEl = document.getElementById('wh-form-status');
  if (whStatusEl) {
    whStatusEl.textContent = `✓ Simulated ${payload.eventType} (${payload.declineCode} • $${payload.amountUsd}): ${res.expectedRecoveryRatePct}% Expected Recovery`;
    whStatusEl.style.color = '#047857';
    whStatusEl.style.fontWeight = '700';
    if (isExplicitWhClick) {
      whStatusEl.style.background = '#ECFDF5';
      whStatusEl.style.padding = '8px 12px';
      whStatusEl.style.borderRadius = '8px';
    }
  }
  const whOutCard = document.getElementById('wh-out-classification')?.closest('.telemetry-card');
  if (isExplicitWhClick && whOutCard) {
    whOutCard.style.transition = 'box-shadow 300ms ease';
    whOutCard.style.boxShadow = '0 0 0 3px #10B981, 0 14px 32px rgba(4, 120, 87, 0.16)';
    setTimeout(() => { whOutCard.style.boxShadow = ''; }, 1400);
  }

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
        <strong>Step ${s.step} • Optimal Retry Window &amp; Fallback [REDACTED IN PREVIEW]</strong>
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
        'send_to': 'AW-18526471751/u8wbCI673aMdEMeMjoJF',
        'value': price,
        'currency': 'USD',
        'transaction_id': params.get('session_id') || ('order_' + Date.now())
      });
    }
  }
  const restoredFromStorage = restoreAaWorkspaceState();
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
    if (document.getElementById('input-store-url') && p.storeUrl) document.getElementById('input-store-url').value = p.storeUrl;
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

  if (hasDeepLink || restoredFromStorage) {
    await runAuditRequest(currentPreset, !hasDeepLink, hasDeepLink);
    if (window.location.hash === '#webhook-lab' || qDecline) {
      await runWebhookSimulation();
    }
  } else {
    await runAuditRequest('shopify_dtc', true, false);
  }

  let liveAuditTimer = null;
  ['input-sessions', 'input-aov', 'input-abandon', 'input-fail', 'input-store', 'input-store-url'].forEach((id) => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('input', () => {
        saveAaWorkspaceState();
        updateUnmaskedSdkPreview(window.__LAST_AUDIT_RES__);
        if (liveAuditTimer) clearTimeout(liveAuditTimer);
        liveAuditTimer = setTimeout(() => runAuditRequest('custom', false, true), 480);
      });
    }
  });
  let liveWhTimer = null;
  ['wh-event-type', 'wh-decline-code', 'wh-amount', 'wh-email'].forEach((id) => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('change', () => {
        saveAaWorkspaceState();
        if (liveWhTimer) clearTimeout(liveWhTimer);
        liveWhTimer = setTimeout(() => runWebhookSimulation(), 320);
      });
    }
  });
});


