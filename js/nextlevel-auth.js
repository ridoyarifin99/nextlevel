/*
 * Next Level Subs - Authentication compatibility entry point
 */
(function () {
  'use strict';

  var isDashboard = /(^|\/)dashboard\.html$/i.test(window.location.pathname) || window.location.pathname === '/';
  var isCheckout = /(^|\/)checkout\.html$/i.test(window.location.pathname);
  var isAuthCallback = !!(
    new URLSearchParams(window.location.search).get('code') ||
    new URLSearchParams(window.location.search).get('error') ||
    window.location.hash.indexOf('access_token=') !== -1 ||
    window.location.hash.indexOf('error=') !== -1
  );

  // A previous checkout attempt must never be allowed to auto-submit a new
  // order simply because the customer later signs in with Google.
  // Keep the pending checkout only while returning from the OAuth callback.
  if (isCheckout && !isAuthCallback) {
    try {
      window.localStorage.removeItem('pendingCheckoutOrder');
    } catch (e) {
      console.warn('Unable to clear stale checkout state:', e);
    }
  }

  function loadScript(src, marker) {
    if (document.querySelector('script[data-nextlevel-auth="' + marker + '"]')) return;
    var script = document.createElement('script');
    script.src = src;
    script.async = false;
    script.dataset.nextlevelAuth = marker;
    document.head.appendChild(script);
  }

  // auth.js remains the canonical authentication implementation.
  if (!window.NextLevelAuth) {
    loadScript('/js/auth.js', 'canonical');
  }

  // Dashboard-only helper: after a component expiry date passes, credentials
  // are replaced by an expiry notice and a renewal CTA.
  if (isDashboard) {
    loadScript('/js/dashboard-expiry-lock.js', 'expiry-lock');
  }
})();
