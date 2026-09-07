"use strict";

/* Next Level Subs — legacy compatibility entry point. */
(function () {
  if (typeof window !== "undefined") {
    var apiBase = window.AUTH_API_BASE;
    if (typeof apiBase === "string" && /^(https?:\/\/)?(localhost|127\.0\.0\.1)(:\d+)?/i.test(apiBase)) {
      try { delete window.AUTH_API_BASE; } catch (_) { window.AUTH_API_BASE = ""; }
    }
  }

  function loadGlobalNavbarController() {
    if (window.__NLSNavScrollBound || document.querySelector('script[data-nextlevel-global-navbar-scroll]')) return;
    var script = document.createElement("script");
    script.src = "/js/navbar-scroll.js?v=20260908-4";
    script.async = false;
    script.dataset.nextlevelGlobalNavbarScroll = "true";
    (document.head || document.documentElement).appendChild(script);
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
    loadGlobalNavbarController();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();