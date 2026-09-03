/*
 * Next Level Subs - Authentication compatibility entry point
 *
 * This file is intentionally kept as the public authentication entry point
 * used by the account pages. The actual authentication implementation lives
 * in /js/auth.js so there is only one source of truth.
 *
 * Load this file after /js/supabase-config.js and before page-specific auth code.
 */
(function () {
  'use strict';

  // auth.js is the canonical implementation. If it has already been loaded,
  // there is nothing else to do.
  if (window.NextLevelAuth) return;

  // Load the canonical auth implementation when this compatibility entry
  // point is requested directly by an existing page.
  var existing = document.querySelector('script[data-nextlevel-auth="canonical"]');
  if (existing) return;

  var script = document.createElement('script');
  script.src = '/js/auth.js';
  script.async = false;
  script.dataset.nextlevelAuth = 'canonical';
  document.head.appendChild(script);
})();
