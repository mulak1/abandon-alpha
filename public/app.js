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

const SPECIMEN_SUBJECT_BY_DECLINE = {
  insufficient_funds: {
    tpl: (b) => `"Quick heads-up on your ${b} billing settings"`,
    meta: '(41.8% Open Rate • 1st/15th Payday Retry)'
  },
  do_not_honor: {
    tpl: (b) => `"Bank security hold on your ${b} order — 1-tap verify"`,
    meta: '(44.2% Open Rate • +24h Issuer Cooldown)'
  },
  expired_card: {
    tpl: (b) => `"Your ${b} card on file expired — update in 1 tap"`,
    meta: '(48.6% Open Rate • Apple Pay / Link 1-Tap Updater)'
  },
  authentication_required: {
    tpl: (b) => `"Confirm your ${b} payment (3DS2 1-Tap Verification)"`,
    meta: '(46.1% Open Rate • Instant Mobile 3DS2 Link)'
  },
  processing_error: {
    tpl: (b) => `"We held your ${b} order while your bank clears a timeout"`,
    meta: '(39.4% Open Rate • +4h Exponential Backoff)'
  }
};

function buildDeclineSpecificFix1Snippet(storeName, aovUsd, activeRule, specObj) {
  const retryHrs = activeRule === 'expired_card' ? 0 : (activeRule === 'do_not_honor' ? 24 : (activeRule === 'authentication_required' ? 1 : (activeRule === 'processing_error' ? 4 : 72)));
  const windowKey = activeRule === 'expired_card' ? 'ZERO_RETRY_1TAP_UPDATER' : (activeRule === 'do_not_honor' ? '24H_ISSUER_COOLDOWN' : (activeRule === 'authentication_required' ? 'INSTANT_3DS2_LINK' : (activeRule === 'processing_error' ? '4H_EXP_BACKOFF' : '1ST_15TH_0600_LOCAL')));
  const subj = (specObj || SPECIMEN_SUBJECT_BY_DECLINE[activeRule] || SPECIMEN_SUBJECT_BY_DECLINE.insufficient_funds).tpl(storeName);
  return [
    `/* Fix #1 Copy-Paste Checkout & Stripe Retry Rule (${storeName} · ${activeRule}) */`,
    `<script src="https://cdn.abandonalpha.com/sdk/v2/exit-bandit-c1-c6.js" data-merchant="${cleanMerchantDomain(storeName)}" data-aov="${aovUsd}" data-decline-focus="${activeRule}" async></script>`,
    `<script>window.AbandonAlphaRules = { declineCode: "${activeRule}", retryAfterHours: ${retryHrs}, window: "${windowKey}", subjectLine: ${subj}, allowPromoStacking: false };</script>`
  ].join('\n');
}

function updateUnmaskedSdkPreview(auditRes) {
  const storeName = document.getElementById('input-store')?.value?.trim() || 'Gymshark';
  window.__ebActiveEntity = storeName;
  const rawUrl = document.getElementById('input-store-url')?.value || storeName;
  const domain = cleanMerchantDomain(rawUrl);
  const declineCode = document.getElementById('input-decline-focus')?.value || 'insufficient_funds';
  const activeRule = declineCode === 'auto_weighted' ? 'insufficient_funds' : declineCode;
  const exitUsd = auditRes?.recoverableExitUsd ? '+' + formatUsd(auditRes.recoverableExitUsd) + '/mo' : '+$34,521/mo';
  const dunningUsd = auditRes?.recoverableDunningUsd ? '+' + formatUsd(auditRes.recoverableDunningUsd) + '/mo' : '+$2,201/mo';

  const brandLabelEl = document.getElementById('aa-spark-brand-label');
  if (brandLabelEl) brandLabelEl.textContent = storeName;
  const specObj = SPECIMEN_SUBJECT_BY_DECLINE[activeRule] || SPECIMEN_SUBJECT_BY_DECLINE.insufficient_funds;
  const subjQuoteEl = document.getElementById('aa-unmasked-subject-quote');
  if (subjQuoteEl) subjQuoteEl.textContent = specObj.tpl(storeName);
  const subjMetaEl = document.getElementById('aa-unmasked-subject-meta');
  if (subjMetaEl) subjMetaEl.textContent = specObj.meta;

  const fold1S1Desc = document.getElementById('aa-fold1-s1-desc');
  if (fold1S1Desc) fold1S1Desc.innerHTML = 'Suppresses blind retry on <code>' + escapeUiHtml(activeRule) + '</code>';
  const fold1S2Title = document.getElementById('aa-fold1-s2-title');
  const fold1S2Desc = document.getElementById('aa-fold1-s2-desc');
  const fold1S3Desc = document.getElementById('aa-fold1-s3-desc');
  if (fold1S2Title && fold1S2Desc && fold1S3Desc) {
    if (activeRule === 'expired_card') {
      fold1S2Title.textContent = 'Step 2 · Zero-Retry Halt';
      fold1S2Desc.textContent = 'Halts automatic charges to avoid Visa penalty fees';
      fold1S3Desc.textContent = 'Sends 1-Tap Apple Pay / Link card-updater SMS (54.2% lift)';
    } else if (activeRule === 'do_not_honor') {
      fold1S2Title.textContent = 'Step 2 · +24h Cooldown';
      fold1S2Desc.textContent = 'Waits 24h for issuer fraud-velocity lock to clear';
      fold1S3Desc.textContent = '1-Tap biometric 3DS2 & backup card link (47.8% lift)';
    } else if (activeRule === 'authentication_required') {
      fold1S2Title.textContent = 'Step 2 · Instant 3DS2';
      fold1S2Desc.textContent = 'Routes buyer to mobile biometric 3DS2 session';
      fold1S3Desc.textContent = 'Preserves active cart & subscription (46.1% lift)';
    } else {
      fold1S2Title.textContent = 'Step 2 · 1st/15th Payday';
      fold1S2Desc.textContent = '06:00 local deposit retry + Specimen #1 email';
      fold1S3Desc.textContent = '1-Tap Apple Pay / Link updater & 14d pause (62.4% lift)';
    }
  }
  const roiProofEl = document.getElementById('aa-pack-roi-proof');
  if (roiProofEl) {
    const totalRec = Number(auditRes?.totalRecoverableUsd || 36722);
    const roiMult = Math.max(10, Math.round(totalRec / 29)).toLocaleString();
    roiProofEl.textContent = 'Pays for $29 pack in < 1 recovered order (' + roiMult + 'x ROI) · 0% commission:';
  }
  const fix1SummaryEl = document.getElementById('aa-fix1-summary-cta');
  if (fix1SummaryEl) {
    fix1SummaryEl.textContent = 'Get free Fix #1 snippet for ' + storeName + ' · ' + activeRule + ' (' + dunningUsd + ' lift · $0) →';
  }
  const aovVal = Number(document.getElementById('input-aov')?.value || auditRes?.aovUsd || 92);
  const unlockSubEl = document.getElementById('in-card-unlock-sub');
  if (unlockSubEl) {
    const totalRec = Number(auditRes?.totalRecoverableUsd || 36722);
    const roiMult = Math.max(10, Math.round(totalRec / 29)).toLocaleString();
    unlockSubEl.textContent = `Compiled for ${storeName} ($${aovVal} order) · $29 Pack pays for itself in < 1 recovered order (${roiMult}x monthly ROI) · 30-day guarantee`;
  }
  const fullDossierBtn = document.getElementById('btn-prog-full-dossier');
  if (fullDossierBtn) {
    fullDossierBtn.textContent = `Complete ${storeName} Recovery Pack ($29 — One-Time) →`;
  }
  const flashPassBtn = document.getElementById('btn-prog-flash-pass');
  if (flashPassBtn) {
    flashPassBtn.textContent = `Get ${storeName} 3-File Patch ($1.99) →`;
  }
  ['aa-screen1-buy-29', 'wh-buy-29'].forEach((btnId) => {
    const b = document.getElementById(btnId);
    if (b) b.textContent = `Complete ${storeName} Pack ($29) →`;
  });
  const modalBuy29 = document.getElementById('modal-buy-29');
  if (modalBuy29) {
    modalBuy29.textContent = `Deploy Exit Modal on ${storeName} ($29 Pack) →`;
  }
  const totalRecVal = Number(auditRes?.totalRecoverableUsd || 36722);
  const roiMultVal = Math.max(10, Math.round(totalRecVal / 29)).toLocaleString();
  const stickySubEl = document.getElementById('sticky-sub-benefit');
  if (stickySubEl) {
    stickySubEl.textContent = `${storeName} (+${formatUsd(totalRecVal)}/mo recoverable) · $29 Pack pays for itself in < 1 order (${roiMultVal}x ROI)`;
  }
  const stickyVaultBtn = document.getElementById('btn-sticky-vault-unlock');
  if (stickyVaultBtn) {
    stickyVaultBtn.textContent = `Complete ${storeName} Pack ($29) →`;
  }
  const toastTitleEl = document.getElementById('eb-ouibounce-title');
  if (toastTitleEl) {
    toastTitleEl.textContent = `Save Your ${storeName} Recovery Plan (+${formatUsd(totalRecVal)}/mo)`;
  }
  const cmdkBuy29Lbl = document.getElementById('cmdk-buy-29-label');
  if (cmdkBuy29Lbl) {
    cmdkBuy29Lbl.textContent = `Get Complete ${storeName} Recovery Pack`;
  }
  const liveSnippetEl = document.getElementById('out-sdk-snippet');
  const isUnlockedNow = Boolean(window.__aaSampleEmailUnlocked || window.__ebIsUnlocked || (typeof localStorage !== 'undefined' && (localStorage.getItem('aa_captured_email') || localStorage.getItem('eb_captured_email'))));
  if (liveSnippetEl && isUnlockedNow) {
    liveSnippetEl.textContent = buildDeclineSpecificFix1Snippet(storeName, aovVal, activeRule, specObj);
  }
  const fold1WhLine = document.getElementById('aa-fold1-wh-line');
  if (fold1WhLine) {
    const whHours = activeRule === 'expired_card' ? '0 (halt retry)' : (activeRule === 'do_not_honor' ? '24' : '72');
    fold1WhLine.innerHTML = '<code>POST /webhooks/stripe</code> &rarr; <code>retry_after_hours: ' + whHours + '</code>';
  }
  const fold1SubjLine = document.getElementById('aa-fold1-subj-line');
  if (fold1SubjLine) fold1SubjLine.textContent = specObj.tpl(storeName);

  const permalinkEl = document.getElementById('aa-live-scan-permalink');
  if (permalinkEl) {
    permalinkEl.href = '/scan/' + encodeURIComponent(domain);
    permalinkEl.textContent = 'Shareable report: /scan/' + domain + ' →';
  }

  const previewEl = document.getElementById('out-sdk-unmasked-preview');
  if (previewEl) {
    previewEl.innerHTML = [
      `<div style="display:flex;justify-content:space-between;align-items:center;gap:10px;padding:8px 12px;border-radius:8px;background:#FFFFFF;">`,
      `  <span style="font-size:0.8125rem;color:#0A2540;font-weight:700;">1. Complete Drop-In Checkout Recovery Code Patch <span style="color:#64748B;font-weight:500;">(${escapeUiHtml(activeRule)} + ${escapeUiHtml(storeName)} Copy-Paste Checkout Fix)</span></span>`,
      `  <span style="font-size:0.8125rem;color:#047857;font-weight:700;white-space:nowrap;">${escapeUiHtml(exitUsd)} &bull; Fix #1 Sample</span>`,
      `</div>`,
      `<div style="display:flex;justify-content:space-between;align-items:center;gap:10px;padding:8px 12px;border-radius:8px;background:#FFFFFF;">`,
      `  <span style="font-size:0.8125rem;color:#0A2540;font-weight:700;">2. 3-Part Klaviyo/Shopify Abandoned Cart Flow Templates <span style="color:#64748B;font-weight:500;">(1-Tap Apple Pay + SMS)</span></span>`,
      `  <span style="font-size:0.8125rem;color:#047857;font-weight:700;white-space:nowrap;">${escapeUiHtml(dunningUsd)} &bull; Included in $1.99 Kit</span>`,
      `</div>`,
      `<div style="display:flex;justify-content:space-between;align-items:center;gap:10px;padding:8px 12px;border-radius:8px;background:#FFFFFF;">`,
      `  <span style="font-size:0.8125rem;color:#0A2540;font-weight:700;">3. CFO Revenue Recovery Forecast <span style="color:#64748B;font-weight:500;">(12-Month Net MRR Model)</span></span>`,
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
    btnEl.textContent = res && res.ok ? `✓ Scanned ${res.storeName}` : 'Scan Store →';
    if (res && res.ok) {
      btnEl.style.background = '#ECFDF5';
      btnEl.style.color = '#047857';
      setTimeout(() => {
        btnEl.textContent = 'Scan Store →';
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
  const whAmtEl = document.getElementById('wh-amount');
  if (whAmtEl && p.aovUsd) whAmtEl.value = p.aovUsd;

  try {
    const u = new URL(window.location.href);
    u.searchParams.set('preset', presetKey);
    window.history.replaceState({}, '', u.pathname + u.search + u.hash);
  } catch (_) {}

  saveAaWorkspaceState();
  runAuditRequest(presetKey, false, true, true);
  if (typeof runWebhookSimulation === 'function') runWebhookSimulation();
  if (typeof triggerBanditObjection === 'function') {
    const selObjBtn = document.querySelector('#objection-btn-group .objection-btn.selected');
    triggerBanditObjection(selObjBtn?.getAttribute('data-obj') || 'C1_PRICE', selObjBtn);
  }
}

function onDeclineFocusChange(declineCode) {
  const whSelect = document.getElementById('wh-decline-code');
  if (whSelect && declineCode && declineCode !== 'auto_weighted') {
    const hasOpt = Array.from(whSelect.options || []).some((o) => o.value === declineCode);
    if (hasOpt) whSelect.value = declineCode;
  }
  runAuditRequest(currentPreset, false, true, true);
  if (typeof runWebhookSimulation === 'function') runWebhookSimulation();
}

async function submitLeakageAudit(e) {
  if (e && e.preventDefault) e.preventDefault();
  const whAmtEl = document.getElementById('wh-amount');
  const aovVal = Number(document.getElementById('input-aov')?.value || 92);
  if (whAmtEl && aovVal > 0) whAmtEl.value = aovVal;
  await runAuditRequest(currentPreset, false, true, true);
  if (typeof runWebhookSimulation === 'function') runWebhookSimulation();
  if (typeof triggerBanditObjection === 'function') {
    const selObjBtn = document.querySelector('#objection-btn-group .objection-btn.selected');
    triggerBanditObjection(selObjBtn?.getAttribute('data-obj') || 'C1_PRICE', selObjBtn);
  }
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
      btn.innerHTML = '<span>Calculate recoverable revenue</span>';
    }
    if (navBtn) navBtn.innerHTML = '<span>Calculate revenue</span>';
    return;
  }

  if (isExplicitClick && btn) {
    if (auditBtnResetTimer) clearTimeout(auditBtnResetTimer);
    btn.style.background = '#047857';
    btn.innerHTML = `<span>Calculated: +${formatUsd(res.totalRecoverableUsd)}/mo recoverable</span>`;
    auditBtnResetTimer = setTimeout(() => {
      btn.style.background = '';
      btn.innerHTML = '<span>Calculate recoverable revenue</span>';
    }, 3200);
  } else if (btn) {
    btn.style.background = '';
    btn.innerHTML = '<span>Calculate recoverable revenue</span>';
  }
  if (navBtn) navBtn.innerHTML = '<span>Calculate revenue</span>';

  window.__LAST_AUDIT_RES__ = res;
  if (isManualTrigger) saveAaWorkspaceState();

  document.getElementById('out-grade-badge').textContent = `Score: ${res.gradeScore}/100`;
  document.getElementById('out-total-leaked').textContent = formatUsd(res.totalMonthlyLeakedUsd);
  document.getElementById('out-leaked-sub').textContent = `${formatUsd(res.leakedCheckoutUsd)} Cart + ${formatUsd(res.leakedDunningUsd)} Failed Cards`;
  document.getElementById('out-total-recovered').textContent = `+${formatUsd(res.totalRecoverableUsd)}/mo`;
  document.getElementById('out-annual-recovered').textContent = `+${formatUsd(res.annualizedRecoverableUsd)}/yr Net Impact (${res.roiMultipleStarter}x ROI)`;
  document.getElementById('out-exit-recovered').textContent = `+${formatUsd(res.recoverableExitUsd)}/mo (${res.recoveredOrdersCount} orders)`;
  document.getElementById('out-dunning-recovered').textContent = `+${formatUsd(res.recoverableDunningUsd)}/mo`;
  const sparkBrandEl = document.getElementById('aa-spark-brand-label');
  if (sparkBrandEl) sparkBrandEl.textContent = res.storeName || 'Gymshark';
  const sparkSplitEl = document.getElementById('aa-spark-split-nums');
  if (sparkSplitEl) sparkSplitEl.innerHTML = `${formatUsd(res.leakedCheckoutUsd)} Cart Abandon + ${formatUsd(res.leakedDunningUsd)} Failed Cards &rarr; <strong>+${formatUsd(res.totalRecoverableUsd)}/mo Recoverable</strong> (62.4% Soft-Decline Lift)`;
  updateUnmaskedSdkPreview(res);
  const isSampleUnlocked = Boolean(window.__aaSampleEmailUnlocked || window.__ebIsUnlocked || (localStorage.getItem('aa_captured_email') || localStorage.getItem('eb_captured_email')));
  const snippetEl = document.getElementById('out-sdk-snippet');
  const snippetWrapEl = document.getElementById('out-sdk-snippet-wrap');
  if (snippetEl) {
    const activeRule = primaryDeclineCode === 'auto_weighted' ? 'insufficient_funds' : primaryDeclineCode;
    snippetEl.textContent = isSampleUnlocked
      ? buildDeclineSpecificFix1Snippet(res.storeName || 'Gymshark', res.aovUsd || 92, activeRule)
      : '/* [LOCKED PREVIEW]: Enter your work email ($0) above to unmask Fix #1 Copy-Paste Checkout Fix, or unlock the $1.99 Complete Recovery Code Patch */';
    if (isSampleUnlocked) {
      snippetEl.style.display = 'block';
      if (snippetWrapEl) snippetWrapEl.style.display = 'flex';
    }
  }

  const statusEl = document.getElementById('audit-form-status');
  if (isManualTrigger || isExplicitClick) {
    const fix1Details = document.getElementById('aa-fix1-details');
    if (fix1Details && !fix1Details.open) fix1Details.open = true;
    if (statusEl) {
      statusEl.innerHTML = `<span>Updated estimate for <strong>${escapeUiHtml(res.storeName)}</strong>: <strong>+${formatUsd(res.totalRecoverableUsd)}/mo recoverable</strong></span>`;
      statusEl.style.color = '#475569';
      statusEl.style.fontWeight = '500';
      statusEl.style.background = 'transparent';
      statusEl.style.border = 'none';
      statusEl.style.padding = '2px 0';
    }
  }

  if (Array.isArray(res.dunningBreakdown)) {
    const breakdownHtml = res.dunningBreakdown.slice(0, 3).map((d) => {
      const seoHref = DECLINE_SEO_LINKS[d.declineCode] || '/directory';
      return `
      <li>
        <a href="${seoHref}" style="display:flex;justify-content:space-between;align-items:center;gap:6px;text-decoration:none;padding:2px 0;">
          <span style="font-size:0.8125rem;color:#475569;">
            <code style="font-weight:600;color:#0F172A;">${d.declineCode}</code>
            <span style="color:#64748B;font-size:0.75rem;"> (${d.recoveryRatePct}% recoverable &middot; ${d.sharePct}% share)</span>
          </span>
          <span style="font-size:0.8125rem;color:#334155;font-weight:600;white-space:nowrap;">+${formatUsd(d.recoveredUsd)}/mo</span>
        </a>
      </li>`;
    }).join('');
    document.getElementById('out-dunning-breakdown').innerHTML = breakdownHtml;
  }
}

window.__aaUnlockSampleSnippet = function(ev) {
  if (ev && ev.preventDefault) ev.preventDefault();
  const emIn = document.getElementById('aa-inline-sample-email') || document.getElementById('eb-inline-scorecard-email');
  const email = emIn && emIn.value ? emIn.value.trim() : '';
  if (!email || !email.includes('@')) {
    if (emIn) emIn.focus();
    return false;
  }
  window.__aaSampleEmailUnlocked = true;
  try {
    localStorage.setItem('aa_captured_email', email);
    localStorage.setItem('eb_captured_email', email);
  } catch (_) {}
  const storeName = document.getElementById('input-store')?.value || 'Gymshark';
  const aovUsd = Number(document.getElementById('input-aov')?.value || 92);
  const declineCode = document.getElementById('input-decline-focus')?.value || 'insufficient_funds';
  const activeRule = declineCode === 'auto_weighted' ? 'insufficient_funds' : declineCode;
  const unmaskedCode = buildDeclineSpecificFix1Snippet(storeName, aovUsd, activeRule);
  const snippetEl = document.getElementById('out-sdk-snippet');
  const snippetWrapEl = document.getElementById('out-sdk-snippet-wrap');
  if (snippetEl) {
    snippetEl.textContent = unmaskedCode;
    snippetEl.style.display = 'block';
  }
  if (snippetWrapEl) snippetWrapEl.style.display = 'flex';
  const prevEl = document.getElementById('out-sdk-unmasked-preview');
  if (prevEl) prevEl.style.display = 'block';
  const leak2Badge = document.getElementById('aa-locked-badge-leak2');
  if (leak2Badge) leak2Badge.style.display = 'none';
  const leak2Unmasked = document.getElementById('aa-unmasked-leak-2');
  if (leak2Unmasked) leak2Unmasked.style.display = 'block';
  const btnEl = document.getElementById('aa-inline-sample-btn');
  if (btnEl) btnEl.textContent = '✓ Fix #1 Unmasked!';
  const statusEl = document.getElementById('aa-inline-sample-status');
  if (statusEl) {
    statusEl.style.display = 'block';
    statusEl.innerHTML = `✓ Fix #1 Copy-Paste Checkout Fix Unmasked &amp; Audit Saved for <strong>${escapeUiHtml(email)}</strong> &bull; <a href="/buy/playbook_pass?target=${encodeURIComponent(storeName)}&email=${encodeURIComponent(email)}" style="color:#047857;text-decoration:underline;">Get Complete ${escapeUiHtml(storeName)} Pack ($29) &rarr;</a> &middot; <a href="/buy/flash_pass?target=${encodeURIComponent(storeName)}&email=${encodeURIComponent(email)}" style="color:#0F172A;text-decoration:underline;">3-File Patch ($1.99) &rarr;</a>`;
  }
  fetch('/api/leads', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, pageUrl: window.location.pathname, utmSource: 'aa_inline_fix1_sample' })
  }).catch(() => {});
  if (window.__LAST_WH_RES__) renderWebhookOutput(window.__LAST_WH_RES__, window.__LAST_WH_PAYLOAD__);
  return false;
};

window.__aaUnlockWebhookSample = function(ev) {
  if (ev && ev.preventDefault) ev.preventDefault();
  const emIn = document.getElementById('wh-inline-sample-email') || document.getElementById('aa-inline-sample-email');
  const email = emIn && emIn.value ? emIn.value.trim() : '';
  if (!email || !email.includes('@')) {
    if (emIn) emIn.focus();
    return false;
  }
  const topEmIn = document.getElementById('aa-inline-sample-email');
  if (topEmIn && !topEmIn.value) topEmIn.value = email;
  window.__aaUnlockSampleSnippet();
  const whBtn = document.getElementById('wh-inline-sample-btn');
  if (whBtn) whBtn.textContent = '✓ Retry Copy Unmasked!';
  if (!window.__LAST_WH_RES__) {
    runWebhookSimulation();
  }
  return false;
};

function copySdkSnippet() {
  const hasEm = Boolean(window.__aaSampleEmailUnlocked || window.__ebIsUnlocked || (localStorage.getItem('aa_captured_email') || localStorage.getItem('eb_captured_email')));
  const emIn = document.getElementById('aa-inline-sample-email');
  if (!hasEm) {
    if (emIn && emIn.value && emIn.value.includes('@')) {
      window.__aaUnlockSampleSnippet();
    } else {
      if (emIn) {
        emIn.focus();
        if (emIn.scrollIntoView) emIn.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      const btn = document.getElementById('copy-sdk-btn');
      if (btn) btn.textContent = 'Enter Work Email ($0) Below to Unmask & Copy!';
      return;
    }
  }
  const code = document.getElementById('out-sdk-snippet').textContent;
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(code).catch(() => {});
  }
  if (window.__ebLogEvent) window.__ebLogEvent('copy_summary', { type: 'copy_fix1_snippet' });
  const btn = document.getElementById('copy-sdk-btn');
  if (btn) {
    btn.textContent = '✓ Copied File 1 of 3 — Get All 3 Production Files ($29) →';
    btn.style.color = '#047857';
    btn.setAttribute('data-copied-fix1', '1');
    btn.onclick = function() {
      if (window.__ebCheckout) window.__ebCheckout('playbook_pass');
      else initiateStripeCheckout('starter');
    };
  }
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
      <tr data-objection="${arm.objection_code}" style="cursor:pointer;${isWin ? 'background: #F8FAFC;' : ''}" onclick="triggerBanditObjection('${arm.objection_code}')">
        <td>
          <strong style="color:#0F172A;font-weight:600;">${humanTitle}</strong>
          <div style="font-size:0.8125rem; color:#64748B;">${arm.objection_label}</div>
        </td>
        <td><code style="color:#0F172A;font-weight:600;">${arm.offer_code}</code> <span style="color:#64748B;font-size:0.8125rem;">(-${arm.discount_pct}%)</span></td>
        <td style="color:#334155;">${arm.alpha}</td>
        <td style="color:#64748B;">${Number(arm.alpha || 0) + Number(arm.beta || 0)}</td>
        <td>
          <strong style="color:#0F172A;font-weight:600;">${arm.posterior_mean_pct}%</strong>
          <div class="prob-bar-bg"><div class="prob-bar-fill" style="width:${barWidth}%"></div></div>
        </td>
        <td style="color:#047857;font-weight:600;">$${Math.round(arm.recovered_revenue_usd).toLocaleString()}</td>
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

  const storeName = (document.getElementById('input-store')?.value || '').trim() || 'Gymshark';
  const aovUsd = Number(document.getElementById('input-aov')?.value || 92);
  const storeCtxEl = document.getElementById('bandit-store-context');
  if (storeCtxEl) {
    storeCtxEl.textContent = `Matched counter-offer for ${storeName} ($${aovUsd.toLocaleString()} order)`;
  }
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

function copyBanditOfferPreview(btnEl) {
  const ctx = (document.getElementById('bandit-store-context')?.textContent || '').trim();
  const headline = (document.getElementById('bandit-offer-headline')?.textContent || '').trim();
  const subtext = (document.getElementById('bandit-offer-subtext')?.textContent || '').trim();
  const code = (document.getElementById('bandit-offer-code')?.textContent || '').trim();
  const saveRate = (document.getElementById('bandit-sampled-theta')?.textContent || '').trim();
  const erpv = (document.getElementById('bandit-erpv')?.textContent || '').trim();
  const text = `${ctx}\nOffer: ${headline}\n${subtext}\nCode: ${code} · Save rate: ${saveRate} · Net saved/visitor: ${erpv}`;
  if (navigator.clipboard && text) {
    navigator.clipboard.writeText(text).catch(() => {});
  }
  if (typeof window.__ebLogEvent === 'function') {
    window.__ebLogEvent('copy_bandit_offer', {
      store: document.getElementById('input-store')?.value || 'Gymshark',
      code
    });
  }
  if (btnEl) {
    const prev = btnEl.textContent;
    btnEl.textContent = '✓ Copied Counter-Offer (All 6 in $29 Pack)';
    setTimeout(() => { btnEl.textContent = prev; }, 2400);
  }
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
  if (whStatusEl && isExplicitWhClick) {
    whStatusEl.textContent = `✓ Simulated ${payload.eventType} (${payload.declineCode} • $${payload.amountUsd}): ${res.expectedRecoveryRatePct}% Expected Recovery`;
    whStatusEl.style.color = '#047857';
    whStatusEl.style.fontWeight = '700';
    whStatusEl.style.background = '#ECFDF5';
    whStatusEl.style.padding = '8px 12px';
    whStatusEl.style.borderRadius = '8px';
  }
  const whOutCard = document.getElementById('wh-out-classification')?.closest('.telemetry-card');
  if (isExplicitWhClick && whOutCard) {
    whOutCard.style.transition = 'box-shadow 300ms ease';
    whOutCard.style.boxShadow = '0 0 0 3px #10B981, 0 14px 32px rgba(4, 120, 87, 0.16)';
    setTimeout(() => { whOutCard.style.boxShadow = ''; }, 1400);
  }

  window.__LAST_WH_RES__ = res;
  window.__LAST_WH_PAYLOAD__ = payload;
  renderWebhookOutput(res, payload);
}

function renderWebhookOutput(res, payload) {
  if (!res || !payload) return;
  document.getElementById('wh-out-classification').textContent = res.classification;
  document.getElementById('wh-out-recovery-rate').textContent = `Expected Recovery: ${res.expectedRecoveryRatePct}%`;
  document.getElementById('wh-out-network-rule').textContent = `Card Network Mandate: ${res.cardNetworkRule}`;
  document.getElementById('wh-out-model').textContent = res.geminiModel;
  document.getElementById('wh-out-subject').textContent = `Subject: ${res.recoveryCopy.emailSubject}`;
  document.getElementById('wh-out-body').textContent = window.__ebIsUnlocked
    ? `${res.recoveryCopy.emailBody}\n\n[SMS Dispatch]: ${res.recoveryCopy.smsBody}`
    : `${res.recoveryCopy.emailBody}`;

  if (Array.isArray(res.retrySchedule) && res.retrySchedule.length > 0) {
    const s = res.retrySchedule[0];
    document.getElementById('wh-timeline-container').innerHTML = `
      <div class="timeline-step">
        <strong>Step ${s.step} • ${escapeUiHtml(s.timing || s.delay || 'Unmasked Window')}</strong>
        <p>${escapeUiHtml(s.action || `Verified retry window for ${payload.declineCode}`)}</p>
      </div>`;
  }
}

function copyWebhookEmailPreview(btnEl) {
  const subj = (document.getElementById('wh-out-subject')?.textContent || '').trim();
  const body = (document.getElementById('wh-out-body')?.textContent || '').trim();
  const text = `${subj}\n\n${body}`;
  if (navigator.clipboard && text) {
    navigator.clipboard.writeText(text).catch(() => {});
  }
  if (typeof window.__ebLogEvent === 'function') {
    window.__ebLogEvent('copy_webhook_email', {
      store: document.getElementById('input-store')?.value || 'Gymshark',
      decline: document.getElementById('wh-decline-code')?.value || 'insufficient_funds'
    });
  }
  if (btnEl) {
    const prev = btnEl.textContent;
    btnEl.textContent = '✓ Copied Step-1 Email (SMS + Worker in $29 Pack)';
    setTimeout(() => { btnEl.textContent = prev; }, 2400);
  }
}

async function initiateStripeCheckout(planTier) {
  if (typeof gtag === 'function') {
    gtag('event', 'begin_checkout', {
      'value': planTier === 'starter' ? 49.00 : (planTier === 'growth' ? 149.00 : (planTier === 'flash_199' ? 1.99 : 29.00)),
      'currency': 'USD'
    });
  }
  const placeholderRx = /^(founder@merchant\.io|founder@dtcstore\.io|test@|audit@|example@)/i;
  const candidateEmails = [
    document.getElementById('aa-hero-free-email')?.value,
    document.getElementById('aa-inline-sample-email')?.value,
    document.getElementById('eb-inline-scorecard-email')?.value,
    document.getElementById('wh-email')?.value,
    (() => { try { return localStorage.getItem('eb_lead_email') || localStorage.getItem('aa_captured_email') || ''; } catch (_) { return ''; } })()
  ].map((v) => String(v || '').trim()).filter((v) => v.includes('@') && !placeholderRx.test(v));
  const email = candidateEmails[0] || '';
  const storeDomain = document.getElementById('input-store')?.value || 'AuraBotanics DTC';

  if (typeof window.__ebLogEvent === 'function') {
    window.__ebLogEvent('checkout_intent', { tier: planTier, store: storeDomain });
  }

  const res = await fetch('/api/checkout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ planTier, customerEmail: email, customer_email: email, email, allow_promotion_codes: false, storeDomain })
  }).then((r) => r.json()).catch(() => null);

  if (!res || !res.ok) return;

  const banner = document.getElementById('checkout-status-banner');
  const text = document.getElementById('checkout-status-text');
  const badge = document.getElementById('checkout-session-badge');
  if (banner && text && badge) {
    banner.style.display = 'block';
    badge.textContent = res.stripeSessionId;
    const emailLabel = res.customerEmail ? ` (${res.customerEmail})` : '';
    text.innerHTML = `Initialized ${res.planLabel} for ${res.storeDomain}${emailLabel}. Protected by ${res.guarantee}. <a href="${res.checkoutUrl || '/buy/playbook_pass'}" style="color:var(--accent-indigo);text-decoration:underline;font-weight:700;margin-left:6px;">Proceed to Stripe Checkout →</a>`;
  }
  if (!navigator.webdriver && res.checkoutUrl && res.checkoutUrl.startsWith('https://checkout.stripe.com')) {
    window.location.href = res.checkoutUrl;
  }
}

function openExitIntentModal() {
  const storeName = (document.getElementById('input-store')?.value || '').trim() || 'Gymshark';
  const aovUsd = Number(document.getElementById('input-aov')?.value || 92);
  const titleEl = document.getElementById('exit-modal-title');
  if (titleEl) {
    titleEl.textContent = `Wait: Before You Leave Your ${storeName} Checkout ($${aovUsd.toLocaleString()}), What Stopped You Today?`;
  }
  const modalBuy29 = document.getElementById('modal-buy-29');
  if (modalBuy29) {
    modalBuy29.textContent = `Deploy Exit Modal on ${storeName} ($29 Pack) →`;
  }
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
    document.getElementById('modal-offer-subtext').textContent = `${res.selectedArm.offer_subtext} · Save rate: ${res.selectedArm.posterior_mean_pct}% (+$${res.selectedArm.erpv_usd} net saved/visitor)`;
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
    const cleanDecline = String(qDecline).replace(/[^a-zA-Z0-9_.-]/g, '').slice(0, 48);
    if (cleanDecline) {
      ['input-decline-focus', 'wh-decline-code'].forEach((selId) => {
        const sel = document.getElementById(selId);
        if (!sel) return;
        if (!Array.from(sel.options).some((o) => o.value === cleanDecline)) {
          const opt = document.createElement('option');
          opt.value = cleanDecline;
          opt.textContent = `${cleanDecline} (Targeted Recovery)`;
          sel.appendChild(opt);
        }
        sel.value = cleanDecline;
      });
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


