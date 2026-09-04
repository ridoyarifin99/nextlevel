/*
 * Next Level Subs - Authentication compatibility entry point
 */
(function () {
  'use strict';

  // Dashboard is exposed publicly as /dashboard, while dashboard.html is
  // redirected there by vercel.json. Detect both forms so dashboard-only
  // helpers are actually loaded on production.
  var dashboardPath = window.location.pathname.replace(/\/+$/, '') || '/';
  var isDashboard = dashboardPath === '/dashboard' || /\/dashboard\.html$/i.test(dashboardPath) || dashboardPath === '/';
  var isCheckout = /(^|\/)checkout\.html$/i.test(window.location.pathname) || dashboardPath === '/checkout';
  var isAuthCallback = !!(
    new URLSearchParams(window.location.search).get('code') ||
    new URLSearchParams(window.location.search).get('error') ||
    window.location.hash.indexOf('access_token=') !== -1 ||
    window.location.hash.indexOf('error=') !== -1
  );

  // Never allow stale checkout state to auto-submit an order on a normal
  // checkout visit. Preserve it only while returning from OAuth.
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

  if (!window.NextLevelAuth) loadScript('/js/auth.js', 'canonical');

  if (isDashboard) {
    loadScript('/js/dashboard-expiry-lock.js', 'expiry-lock');

    // dashboard.html is the renderer source, but production users normally
    // arrive through /dashboard. Load the DOM-based UI enhancer explicitly
    // for that route as well. It waits for #subscriptionsContainer and then
    // upgrades the rendered cards, so it does not depend on inline globals.
    if (!document.querySelector('script[data-nextlevel-auth="dashboard-ui-v2"]')) {
      var dashboardUi = document.createElement('script');
      dashboardUi.src = '/js/dashboard-ui-v2.js?v=20260905';
      dashboardUi.async = false;
      dashboardUi.dataset.nextlevelAuth = 'dashboard-ui-v2';
      document.head.appendChild(dashboardUi);
    }
  }
})();
