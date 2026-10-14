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

  document.addEventListener('mousemove', function (e) {
    if (firedInSession) return;
    var v = computeVelocity(e.clientY, Date.now());
    if (e.clientY < 48 && v.vy < -0.65 && v.tau < 65) {
      firedInSession = true;
      if (typeof window.AbandonAlphaTriggerModal === 'function') {
        window.AbandonAlphaTriggerModal({
          clientY: e.clientY,
          velocityY: v.vy,
          timeToEdgeMs: v.tau,
          tabHidden: false
        });
      }
    }
  }, { passive: true });

  document.addEventListener('visibilitychange', function () {
    if (document.visibilityState === 'hidden' && !firedInSession) {
      firedInSession = true;
      if (typeof window.AbandonAlphaTriggerModal === 'function') {
        window.AbandonAlphaTriggerModal({
          clientY: 12,
          velocityY: -0.92,
          timeToEdgeMs: 18,
          tabHidden: true
        });
      }
    }
  });

  window.AbandonAlphaSDK = {
    version: '4.2.0',
    merchantId: merchantId,
    defaultAov: defaultAov,
    resetSessionLock: function () {
      firedInSession = false;
    }
  };
})(window, document);
