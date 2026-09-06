"use strict";

/*
 * Compatibility entry point for legacy pages that still reference /src/auth.js.
 * The canonical Supabase authentication implementation is /js/auth.js.
 *
 * This shim also removes the old localhost API setting, normalizes the
 * homepage favicon, and loads the scoped product-page compatibility layer.
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

  function loadDetailsFix() {
    if (!/\/product\//i.test(window.location.pathname) && !/details\.html$/i.test(window.location.pathname)) return;
    if (window.__NLSDetailsFixRequested) return;
    window.__NLSDetailsFixRequested = true;

    var script = document.createElement("script");
    script.src = "/js/details-page-fix.js";
    script.defer = true;
    document.head.appendChild(script);
  }

  function init() {
    fixProductionAssets();
    loadDetailsFix();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
