(function () {
  "use strict";

  /*
   * SINGLE owner of the responsive navbar scroll behavior.
   *
   * Rule:
   *   - At the top: show both navbars.
   *   - Real downward intent: hide both navbars.
   *   - Real upward intent: show both navbars.
   *
   * Important: scroll position alone is NOT allowed to reveal the navbar at
   * the bottom of the document. Mobile browsers can emit a small reverse
   * scroll correction during overscroll/momentum. Touch and wheel gestures
   * are therefore handled directly as the source of user intent.
   */
  if (window.__NLSNavScrollBound) return;
  window.__NLSNavScrollBound = true;

  const TOP_ZONE = 2;
  const MIN_SCROLL_DELTA = 1;
  const INTENT_DELTA = 3;
  const BOTTOM_TOLERANCE = 4;
  const MOBILE_MAX = 1024;

  let lastY = 0;
  let hidden = false;
  let ticking = false;
  let touchLastY = null;

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

  function getHeader() {
    return document.getElementById("nlsHeader") || document.querySelector(".nls-header");
  }

  function getBottomNav() {
    return document.getElementById("nls-mobile-bottom-nav");
  }

  function isAtBottom(y = getY()) {
    const doc = document.documentElement;
    const maxY = Math.max(0, doc.scrollHeight - window.innerHeight);
    return y >= maxY - BOTTOM_TOLERANCE;
  }

  function applyState(shouldHide) {
    hidden = Boolean(shouldHide);

    const header = getHeader();
    const bottom = getBottomNav();

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

    if (bottom) {
      const shouldHideBottom = hidden && window.innerWidth <= MOBILE_MAX;
      bottom.classList.toggle("nls-scroll-hidden", shouldHideBottom);
      bottom.style.setProperty(
        "transform",
        shouldHideBottom
          ? "translate3d(0,calc(100% + 24px),0)"
          : "translate3d(0,0,0)",
        "important"
      );
      bottom.style.setProperty("opacity", shouldHideBottom ? "0" : "1", "important");
      bottom.style.setProperty("pointer-events", shouldHideBottom ? "none" : "auto", "important");
    }
  }

  function show() {
    if (hidden) applyState(false);
  }

  function hide() {
    if (!hidden) applyState(true);
  }

  function updateFromScroll() {
    ticking = false;

    const currentY = getY();
    const delta = currentY - lastY;

    if (currentY <= TOP_ZONE) {
      show();
      lastY = currentY;
      return;
    }

    if (Math.abs(delta) < MIN_SCROLL_DELTA) return;

    if (delta > 0) {
      /* Actual page movement downward is always a hide. */
      hide();
    } else if (delta < 0) {
      /*
       * Never infer an upward user gesture from a bottom-edge correction.
       * If the user really swipes/wheels upward, the gesture handlers below
       * call show() directly, even when the page cannot scroll any further.
       */
      if (!isAtBottom(currentY)) show();
    }

    lastY = currentY;
  }

  function onScroll() {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(updateFromScroll);
  }

  function onWheel(event) {
    const deltaY = Number(event.deltaY) || 0;
    if (Math.abs(deltaY) < INTENT_DELTA) return;

    /* Wheel direction is explicit user intent, including at page bottom. */
    if (deltaY > 0) hide();
    else show();
  }

  function onTouchStart(event) {
    if (!event.touches || !event.touches.length) return;
    touchLastY = event.touches[0].clientY;
  }

  function onTouchMove(event) {
    if (!event.touches || !event.touches.length || touchLastY === null) return;

    const y = event.touches[0].clientY;
    const fingerDelta = y - touchLastY;

    if (Math.abs(fingerDelta) >= INTENT_DELTA) {
      /* Finger up = page/downward intent -> hide. Finger down -> show. */
      if (fingerDelta < 0) hide();
      else show();
      touchLastY = y;
    }
  }

  function onTouchEnd() {
    touchLastY = null;
  }

  function init() {
    lastY = getY();
    applyState(false);

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("wheel", onWheel, { passive: true });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    window.addEventListener("touchcancel", onTouchEnd, { passive: true });

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
