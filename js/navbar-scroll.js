(function () {
  "use strict";

  /*
   * SINGLE owner of navbar show/hide behavior.
   *
   * The page uses the real document scroll position only. In particular,
   * mobile browser chrome can fire resize/visualViewport events while the
   * user is scrolling at the bottom edge. A resize must NEVER be interpreted
   * as an upward scroll, otherwise the bottom navbar can pop back in only
   * after an extra forced swipe/overscroll.
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

    if (Math.abs(delta) < MIN_DELTA) return;

    if (delta > 0) {
      /* Normal downward scrolling: hide. */
      applyState(true);
    } else if (delta < 0) {
      /* Reveal only after a real upward document movement. */
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

  function onResize() {
    /*
     * IMPORTANT: Do not call applyState(false) here.
     * Android/iOS browser UI changes can emit resize while the user is at the
     * bottom of the document. Keeping the current state prevents an unwanted
     * navbar reveal that requires another forced swipe to reproduce.
     */
    const currentY = getY();
    lastY = currentY;
    if (currentY <= TOP_ZONE) applyState(false);
    else applyState(hidden);
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
