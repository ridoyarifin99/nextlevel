(function () {
  "use strict";

  /*
   * Single owner of header/bottom-nav scroll behavior.
   * The bottom navigation has its own visibility rule: it must be visible
   * whenever the user reaches the actual bottom of the document. This avoids
   * requiring an extra/forced upward swipe after the last scroll movement.
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

  function setHeaderHidden(shouldHide) {
    hidden = Boolean(shouldHide);
    const header = getHeader();
    if (!header) return;

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

  function setBottomNavVisible(visible) {
    const bottom = getBottomNav();
    if (!bottom) return;

    const shouldShow = window.innerWidth <= MOBILE_MAX && visible;
    bottom.classList.toggle("nls-scroll-hidden", !shouldShow);
    bottom.style.setProperty(
      "transform",
      shouldShow ? "translate3d(0,0,0)" : "translate3d(0,calc(100% + 24px),0)",
      "important"
    );
    bottom.style.setProperty("opacity", shouldShow ? "1" : "0", "important");
    bottom.style.setProperty("pointer-events", shouldShow ? "auto" : "none", "important");
  }

  function applyState(shouldHideHeader) {
    setHeaderHidden(shouldHideHeader);
    setBottomNavVisible(!shouldHideHeader);
  }

  function update() {
    ticking = false;

    const currentY = getY();
    const maxY = getMaxY();
    const delta = currentY - lastY;
    const atBottom = currentY >= Math.max(0, maxY - BOTTOM_GUARD);

    if (currentY <= TOP_ZONE) {
      applyState(false);
      lastY = currentY;
      return;
    }

    /* Reaching the bottom is an explicit UI state. Show the bottom nav
       immediately, even if the last gesture was downward. */
    if (atBottom) {
      setHeaderHidden(true);
      setBottomNavVisible(true);
      lastY = currentY;
      return;
    }

    if (Math.abs(delta) < MIN_DELTA) return;

    if (delta > 0) {
      /* Normal downward scrolling: hide both navigation bars. */
      applyState(true);
    } else {
      /* Any real upward document movement reveals navigation. */
      applyState(false);
    }

    lastY = currentY;
  }

  function onScroll() {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(update);
  }

  function onResize() {
    /* Browser chrome/address-bar resize must not be treated as scrolling. */
    const currentY = getY();
    lastY = currentY;

    if (currentY <= TOP_ZONE) {
      applyState(false);
      return;
    }

    const maxY = getMaxY();
    const atBottom = currentY >= Math.max(0, maxY - BOTTOM_GUARD);

    if (atBottom) {
      setHeaderHidden(true);
      setBottomNavVisible(true);
    } else {
      setHeaderHidden(hidden);
      setBottomNavVisible(!hidden);
    }
  }

  function init() {
    lastY = getY();
    applyState(false);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize, { passive: true });
    if (window.visualViewport) {
      window.visualViewport.addEventListener("resize", onResize, { passive: true });
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
