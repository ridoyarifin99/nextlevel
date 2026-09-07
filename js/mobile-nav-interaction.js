(function () {
  "use strict";

  if (window.__NLSMobileNavInteractionLoaded) return;
  window.__NLSMobileNavInteractionLoaded = true;

  /*
   * The mobile bottom navigation is persistent by design.
   *
   * Older versions hid it whenever the user tapped the top navbar. That made
   * navigation disappear during checkout/login/signup interactions and fought
   * with navbar-scroll.js. Visibility is now owned by responsive CSS only.
   */
  function keepBottomNavStable() {
    const nav = document.getElementById("nls-mobile-bottom-nav");
    if (!nav || window.innerWidth > 1024) return;

    nav.classList.remove("nls-scroll-hidden");
    nav.style.setProperty("z-index", "50", "important");
    nav.style.setProperty("transform", "translate3d(0,0,0)", "important");
    nav.style.setProperty("opacity", "1", "important");
    nav.style.setProperty("visibility", "visible", "important");
    nav.style.setProperty("pointer-events", "auto", "important");
  }

  function boot() {
    keepBottomNavStable();
    window.addEventListener("resize", keepBottomNavStable, { passive: true });
    window.addEventListener("pageshow", keepBottomNavStable, { passive: true });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot, { once: true });
  } else {
    boot();
  }
})();
