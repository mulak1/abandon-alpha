/**
 * AbandonAlpha Client Telemetry & Behavioral Exit-Intent Bandit SDK (v4.2)
 * Zero-PII Mouse-Velocity Vector (v_y, theta, tau) + HTML5 Page Visibility API
 */
(function (window, document) {
  'use strict';

  var scriptEl = document.currentScript;
  var merchantId = (scriptEl && scriptEl.getAttribute('data-merchant')) || 'default-merchant';
  var defaultAov = Number((scriptEl && scriptEl.getAttribute('data-aov')) || 92);
  var lastY = null;
  var lastT = null;
  var firedInSession = false;

  function computeVelocity(clientY, now) {
    if (lastY === null || lastT === null) {
      lastY = clientY;
      lastT = now;
      return { vy: 0, tau: 9999 };
    }
    var dt = Math.max(1, now - lastT);
    var dy = clientY - lastY;
    var vy = dy / dt;
    var tau = vy < 0 ? clientY / Math.abs(vy) : 9999;
    lastY = clientY;
    lastT = now;
    return { vy: vy, tau: tau };
  }

  var autoModalEnabled = scriptEl && scriptEl.getAttribute('data-auto-modal') === 'true';
  var STORAGE_LOCK_KEY = 'aa_modal_lock_v4_' + merchantId;
  try {
    if (sessionStorage.getItem(STORAGE_LOCK_KEY) === '1') firedInSession = true;
  } catch (_) {}

  document.addEventListener('mousemove', function (e) {
    if (firedInSession) return;
    var v = computeVelocity(e.clientY, Date.now());
    if (e.clientY < 16 && v.vy < -1.15 && v.tau < 45) {
      firedInSession = true;
      try { sessionStorage.setItem(STORAGE_LOCK_KEY, '1'); } catch (_) {}
      window.AbandonAlphaSDK.lastSignal = { clientY: e.clientY, velocityY: v.vy, timeToEdgeMs: v.tau, tabHidden: false };
      if (autoModalEnabled && typeof window.AbandonAlphaTriggerModal === 'function') {
        window.AbandonAlphaTriggerModal(window.AbandonAlphaSDK.lastSignal);
      }
    }
  }, { passive: true });

  window.AbandonAlphaSDK = {
    version: '4.2.0',
    merchantId: merchantId,
    defaultAov: defaultAov,
    lastSignal: null,
    resetSessionLock: function () {
      firedInSession = false;
      try { sessionStorage.removeItem(STORAGE_LOCK_KEY); } catch (_) {}
    }
  };
})(window, document);
