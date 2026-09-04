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

    // The dashboard renderer is declared by the inline script immediately
    // after this compatibility entry point. Dynamically injecting the UI
    // enhancer can race with that renderer and let the old cards render first.
    // Use a parser-blocking script tag so the enhancer is guaranteed to start
    // before the dashboard's data-fetch/render code executes.
    if (!document.querySelector('script[data-nextlevel-auth="dashboard-ui-v2"]')) {
      document.write('<script src="/js/dashboard-ui-v2.js" data-nextlevel-auth="dashboard-ui-v2"><\\/script>');
    }
  }
})();
