(function () {
  "use strict";
  if (window.__NLSMobileNavInteractionLoaded) return;
  window.__NLSMobileNavInteractionLoaded = true;

  const MOBILE_MAX = 1024;
  const NAV_ID = "nls-mobile-bottom-nav";
  const HEADER_ID = "nlsHeader";

  function isMobile() {
    return window.innerWidth <= MOBILE_MAX;
  }

  function hideBottomNav() {
    if (!isMobile()) return;
    const bottom = document.getElementById(NAV_ID);
    if (!bottom) return;

    bottom.classList.add("nls-scroll-hidden");
    bottom.style.setProperty("transform", "translate3d(0,calc(100% + 24px),0)", "important");
    bottom.style.setProperty("opacity", "0", "important");
    bottom.style.setProperty("pointer-events", "none", "important");
  }

  function bind() {
    const header = document.getElementById(HEADER_ID) || document.querySelector(".nls-header");
    if (!header || header.dataset.mobileBottomHideBound === "true") return;
    header.dataset.mobileBottomHideBound = "true";

    /* A tap/click anywhere in the mobile top navbar hides the bottom navbar.
       Desktop is intentionally excluded. */
    const handleTopNavInteraction = function () {
      if (isMobile()) hideBottomNav();
    };

    header.addEventListener("touchstart", handleTopNavInteraction, { passive: true });
    header.addEventListener("click", handleTopNavInteraction, { passive: true });
  }

  function boot() {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", bind, { once: true });
    } else {
      bind();
    }
  }

  boot();
  window.addEventListener("resize", bind, { passive: true });
})();
