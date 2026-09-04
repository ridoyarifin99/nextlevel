/* Next Level Subs - Authentication compatibility entry point */
(function () {
  'use strict';
  var dashboardPath = window.location.pathname.replace(/\/+$/, '') || '/';
  var isDashboard = dashboardPath === '/dashboard' || /\/dashboard\.html$/i.test(window.location.pathname) || dashboardPath === '/';
  var isCheckout = /(^|\/)checkout\.html$/i.test(window.location.pathname) || dashboardPath === '/checkout';
  var isAuthCallback = !!(new URLSearchParams(window.location.search).get('code') || new URLSearchParams(window.location.search).get('error') || window.location.hash.indexOf('access_token=') !== -1 || window.location.hash.indexOf('error=') !== -1);
  if (isCheckout && !isAuthCallback) {
    try { window.localStorage.removeItem('pendingCheckoutOrder'); } catch (e) { console.warn('Unable to clear stale checkout state:', e); }
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
  if (isDashboard) loadScript('/src/auth.js', 'universal-mobile-nav');
  if (isDashboard) {
    loadScript('/js/dashboard-expiry-lock.js', 'expiry-lock');
    if (!document.querySelector('script[data-nextlevel-auth="dashboard-ui-v2"]')) {
      var dashboardUi = document.createElement('script');
      dashboardUi.src = '/js/dashboard-ui-v2.js?v=20260905';
      dashboardUi.async = false;
      dashboardUi.dataset.nextlevelAuth = 'dashboard-ui-v2';
      document.head.appendChild(dashboardUi);
    }
  }
})();
