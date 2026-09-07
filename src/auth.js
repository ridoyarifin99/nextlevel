"use strict";

/*
 * Compatibility entry point for legacy pages that still reference /src/auth.js.
 * The canonical Supabase authentication implementation is /js/auth.js.
 *
 * This shim only handles legacy production cleanup. Product-page fixes are
 * loaded centrally by /js/supabase-config.js so details.html never gets two
 * competing copies of the same runtime.
 */
(function () {
  if (typeof window !== "undefined") {
    var apiBase = window.AUTH_API_BASE;
    if (typeof apiBase === "string" && /^(https?:\/\/)?(localhost|127\.0\.0\.1)(:\d+)?/i.test(apiBase)) {
      try { delete window.AUTH_API_BASE; } catch (_) { window.AUTH_API_BASE = ""; }
    }
  }

  function fixProductionAssets() {
    var icon = document.querySelector('link[rel="icon"]');
    if (icon) {
      icon.href = "/images/next_level.png";
      icon.type = "image/png";
    }
  }

  function init() {
    fixProductionAssets();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
