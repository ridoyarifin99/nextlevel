/*
 * Next Level Subs - Authentication compatibility entry point
 */
(function () {
  'use strict';

  var isDashboard = /(^|\/)dashboard\.html$/i.test(window.location.pathname) || window.location.pathname === '/';

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
