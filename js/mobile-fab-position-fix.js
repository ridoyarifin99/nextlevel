"use strict";

/* NEXT LEVEL SUBS — Floating action buttons must stay above the mobile bottom navigation. */
(() => {
  if (window.__NLSMobileFabPositionFix) return;
  window.__NLSMobileFabPositionFix = true;

  const MOBILE_MAX = 1024;
  const NAV_SELECTOR = "#nls-mobile-bottom-nav";
  const GAP = 14;
  const FAB_SIZE = 50;
  const FAB_GAP = 10;

  const isMobile = () => window.innerWidth <= MOBILE_MAX;
  const getNavOffset = () => {
    const nav = document.querySelector(NAV_SELECTOR);
    if (!nav || !isMobile()) return 0;
    const styles = window.getComputedStyle(nav);
    const bottom = parseFloat(styles.bottom) || 0;
    const height = nav.offsetHeight || 70;
    return Math.ceil(bottom + height + GAP);
  };

  function apply() {
    const indexFab = document.getElementById("backToTopBtn");
    const detailsFab = document.getElementById("fab");
    const whatsapp = document.getElementById("whatsappFab");
    if (!indexFab && !detailsFab) return;

    if (!isMobile()) {
      if (indexFab) indexFab.style.removeProperty("bottom");
      if (detailsFab) detailsFab.style.removeProperty("bottom");
      if (whatsapp) whatsapp.style.removeProperty("bottom");
      return;
    }

    const navOffset = getNavOffset();
    if (!navOffset) return;

    if (indexFab) {
      indexFab.style.setProperty("bottom", `${navOffset}px`, "important");
    }

    if (detailsFab) {
      let detailsBottom = navOffset;
      if (whatsapp) {
        const whatsappBottom = Math.max(5, navOffset - GAP + 5);
        whatsapp.style.setProperty("bottom", `${whatsappBottom}px`, "important");
        detailsBottom = whatsappBottom + FAB_SIZE + FAB_GAP;
      }
      detailsFab.style.setProperty("bottom", `${detailsBottom}px`, "important");
    }
  }

  function boot() {
    apply();
    window.addEventListener("resize", apply, { passive: true });
    window.addEventListener("orientationchange", () => setTimeout(apply, 100), { passive: true });

    const observer = new MutationObserver(() => {
      if (document.getElementById("nls-mobile-bottom-nav")) apply();
    });
    observer.observe(document.body, { childList: true, subtree: true });
    setTimeout(apply, 250);
    setTimeout(apply, 1000);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot, { once: true });
  } else {
    boot();
  }
})();
