(function () {
  "use strict";

  /*
   * SINGLE owner of navbar show/hide behavior.
   *
   * Important:
   * We intentionally listen only to REAL document scrolling.
   * Touch/wheel direction is not used because browsers can report gesture
   * movement while the document is already at its scroll limit. That was
   * causing the navbar and floating controls to reappear after an extra
   * downward swipe at the bottom of the page.
   */
  if (window.__NLSNavScrollBound) return;
  window.__NLSNavScrollBound = true;

  const TOP_ZONE = 2;
  const MIN_DELTA = 1;
  const BOTTOM_GUARD = 12;
  const MOBILE_MAX = 1024;

  let lastY = 0;
  let hidden = false;
  let ticking = false;

  function getY() {
    return Math.max(
      0,
      window.scrollY ||
        window.pageYOffset ||
        document.documentElement.scrollTop ||
        document.body.scrollTop ||
        0
    );
  }

  function getMaxY() {
    const doc = document.documentElement;
    return Math.max(0, doc.scrollHeight - window.innerHeight);
  }

  function getHeader() {
    return document.getElementById("nlsHeader") || document.querySelector(".nls-header");
  }

  function getBottomNav() {
    return document.getElementById("nls-mobile-bottom-nav");
  }

  function applyState(shouldHide) {
    hidden = Boolean(shouldHide);

    const header = getHeader();
    if (header) {
      header.classList.toggle("nls-scroll-hidden", hidden);
      header.style.setProperty(
        "transform",
        hidden ? "translate3d(0,-110%,0)" : "translate3d(0,0,0)",
        "important"
      );
      header.style.setProperty("opacity", hidden ? "0" : "1", "important");
      header.style.setProperty("visibility", hidden ? "hidden" : "visible", "important");
      header.style.setProperty("pointer-events", hidden ? "none" : "auto", "important");
    }

    const bottom = getBottomNav();
    if (bottom) {
      const hideBottom = hidden && window.innerWidth <= MOBILE_MAX;
      bottom.classList.toggle("nls-scroll-hidden", hideBottom);
      bottom.style.setProperty(
        "transform",
        hideBottom ? "translate3d(0,calc(100% + 24px),0)" : "translate3d(0,0,0)",
        "important"
      );
      bottom.style.setProperty("opacity", hideBottom ? "0" : "1", "important");
      bottom.style.setProperty("pointer-events", hideBottom ? "none" : "auto", "important");
    }
  }

  function update() {
    ticking = false;

    const currentY = getY();
    const maxY = getMaxY();
    const delta = currentY - lastY;

    if (currentY <= TOP_ZONE) {
      applyState(false);
      lastY = currentY;
      return;
    }

    if (Math.abs(delta) < MIN_DELTA) {
      return;
    }

    if (delta > 0) {
      /* Normal downward scrolling: hide. */
      applyState(true);
    } else if (delta < 0) {
      /*
       * Only reveal when the page has genuinely moved upward away from the
       * bottom. A small bottom-edge correction/bounce must never reveal it.
       */
      const movedAwayFromBottom = currentY < maxY - BOTTOM_GUARD;
      if (movedAwayFromBottom) applyState(false);
    }

    lastY = currentY;
  }

  function onScroll() {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(update);
  }

  function init() {
    lastY = getY();
    applyState(false);
    window.addEventListener("scroll", onScroll, { passive: true });

    window.addEventListener(
      "resize",
      function () {
        lastY = getY();
        applyState(false);
      },
      { passive: true }
    );
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
