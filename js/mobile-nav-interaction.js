(function () {
  "use strict";

  if (window.__NLSMobileNavInteractionLoaded) return;
  window.__NLSMobileNavInteractionLoaded = true;

  /*
   * navbar-scroll.js is the single owner of mobile navigation visibility.
   * This helper only restores the correct stacking order after navigation,
   * resize, or browser back/forward events and never forces the nav visible.
   */
  function keepBottomNavLayer() {
    const nav = document.getElementById("nls-mobile-bottom-nav");
    if (!nav || window.innerWidth > 1024) return;
    nav.style.setProperty("z-index", "50", "important");
  }

  function boot() {
    keepBottomNavLayer();
    window.addEventListener("resize", keepBottomNavLayer, { passive: true });
    window.addEventListener("pageshow", keepBottomNavLayer, { passive: true });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot, { once: true });
  } else {
    boot();
  }
})();
