"use strict";

/* NEXT LEVEL SUBS — Floating action buttons stay clear of the mobile bottom navigation. */
(() => {
  if (window.__NLSMobileFabPositionFix) return;
  window.__NLSMobileFabPositionFix = true;

  const MOBILE_MAX = 1024;
  const NAV_SELECTOR = "#nls-mobile-bottom-nav";
  const NAV_GAP = 14;
  const FAB_SIZE = 50;
  const FAB_GAP = 10;
  const HIDDEN_NAV_BOTTOM = 25;

  const isMobile = () => window.innerWidth <= MOBILE_MAX;

  function getNavOffset() {
    const nav = document.querySelector(NAV_SELECTOR);
    if (!nav || !isMobile()) return 0;
    if (nav.classList.contains("nls-scroll-hidden")) return HIDDEN_NAV_BOTTOM + nav.offsetHeight + NAV_GAP;
    const styles = window.getComputedStyle(nav);
    const bottom = parseFloat(styles.bottom) || 0;
    const height = nav.offsetHeight || 70;
    return Math.ceil(bottom + height + NAV_GAP);
  }

  function apply() {
    const indexFab = document.getElementById("backToTopBtn");
    const detailsFab = document.getElementById("fab");
    const whatsapp = document.getElementById("whatsappFab");
    const nav = document.querySelector(NAV_SELECTOR);
    if (!indexFab && !detailsFab) return;

    if (!isMobile()) {
      if (indexFab) indexFab.style.removeProperty("bottom");
      if (detailsFab) detailsFab.style.removeProperty("bottom");
      if (whatsapp) whatsapp.style.removeProperty("bottom");
      return;
    }

    const navOffset = getNavOffset();
    if (!navOffset) return;

    const navHidden = !!nav?.classList.contains("nls-scroll-hidden");
    const whatsappBottom = navHidden ? HIDDEN_NAV_BOTTOM : Math.max(5, navOffset - NAV_GAP + 5);

    if (indexFab) {
      indexFab.style.setProperty("bottom", `${navOffset}px`, "important");
    }

    if (detailsFab) {
      if (whatsapp) whatsapp.style.setProperty("bottom", `${whatsappBottom}px`, "important");
      detailsFab.style.setProperty("bottom", `${whatsappBottom + FAB_SIZE + FAB_GAP}px`, "important");
    }
  }

  function boot() {
    apply();
    window.addEventListener("resize", apply, { passive: true });
    window.addEventListener("orientationchange", () => setTimeout(apply, 100), { passive: true });
    window.addEventListener("scroll", apply, { passive: true });

    const observer = new MutationObserver(() => {
      if (document.getElementById(NAV_SELECTOR.slice(1))) apply();
    });
    observer.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ["class", "style"] });
    setTimeout(apply, 250);
    setTimeout(apply, 1000);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot, { once: true });
  } else {
    boot();
  }
})();
