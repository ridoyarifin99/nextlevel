(function () {
  "use strict";

  if (window.__NLSNavScrollBound) return;
  window.__NLSNavScrollBound = true;

  /*
   * YouTube / Instagram-style navigation.
   * Downward intent hides both navbars; upward intent reveals them.
   * Touch/wheel intent is tracked separately so browser momentum/overscroll
   * at the bottom of a page cannot accidentally reveal the bottom navbar.
   */
  const TOP_ZONE = 2;
  const MIN_DELTA = 1;
  const INTENT_DELTA = 2;
  const MOBILE_MAX = 1024;

  let lastY = 0;
  let hidden = false;
  let ticking = false;
  let lastIntent = 0; // +1 = content moving down, -1 = content moving up
  let touchStartY = null;
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

  function applyState(shouldHide) {
    const header = getHeader();
    const bottom = getBottomNav();
    hidden = !!shouldHide;

    if (header) {
      header.classList.toggle("nls-scroll-hidden", hidden);
      header.style.setProperty(
        "transform",
        hidden ? "translate3d(0, -110%, 0)" : "translate3d(0, 0, 0)",
        "important"
      );
      header.style.setProperty("opacity", hidden ? "0" : "1", "important");
      header.style.setProperty("visibility", hidden ? "hidden" : "visible", "important");
      header.style.setProperty("pointer-events", hidden ? "none" : "auto", "important");
      header.style.setProperty("will-change", "transform", "important");
    }

    if (bottom) {
      const mobileHide = hidden && window.innerWidth <= MOBILE_MAX;
      bottom.classList.toggle("nls-scroll-hidden", mobileHide);
      bottom.style.setProperty(
        "transform",
        mobileHide ? "translate3d(0, calc(100% + 24px), 0)" : "translate3d(0, 0, 0)",
        "important"
      );
      bottom.style.setProperty("opacity", mobileHide ? "0" : "1", "important");
      bottom.style.setProperty("pointer-events", mobileHide ? "none" : "auto", "important");
    }
  }

  function recordIntent(direction) {
    if (direction !== 1 && direction !== -1) return;
    lastIntent = direction;
  }

  function update() {
    ticking = false;

    const currentY = getY();
    const delta = currentY - lastY;

    if (currentY <= TOP_ZONE) {
      applyState(false);
      lastY = currentY;
      return;
    }

    if (Math.abs(delta) < MIN_DELTA) return;

    /* Prefer the actual scroll direction when available. */
    if (delta > 0) {
      recordIntent(1);
      applyState(true);
    } else if (delta < 0) {
      /*
       * At the bottom, browsers can emit a tiny upward correction while a
       * downward swipe/momentum is settling. Do not reveal the nav unless
       * the user's actual gesture/wheel intent is upward.
       */
      const doc = document.documentElement;
      const maxY = Math.max(0, doc.scrollHeight - window.innerHeight);
      const atBottom = currentY >= maxY - 2;

      if (!atBottom || lastIntent === -1) {
        recordIntent(-1);
        applyState(false);
      }
    }

    lastY = currentY;
  }

  function onScroll() {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(update);
  }

  function onWheel(event) {
    if (Math.abs(event.deltaY) < INTENT_DELTA) return;
    recordIntent(event.deltaY > 0 ? 1 : -1);
  }

  function onTouchStart(event) {
    if (!event.touches || !event.touches.length) return;
    touchStartY = event.touches[0].clientY;
    touchLastY = touchStartY;
  }

  function onTouchMove(event) {
    if (!event.touches || !event.touches.length || touchLastY === null) return;
    const y = event.touches[0].clientY;
    const fingerDelta = y - touchLastY;

    if (Math.abs(fingerDelta) >= INTENT_DELTA) {
      /* Finger up => page moves down; finger down => page moves up. */
      recordIntent(fingerDelta < 0 ? 1 : -1);
      touchLastY = y;
    }
  }

  function onTouchEnd() {
    touchStartY = null;
    touchLastY = null;
  }

  function init() {
    lastY = getY();
    applyState(false);

    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("scroll", onScroll, { passive: true, capture: true });
    window.addEventListener("wheel", onWheel, { passive: true });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    window.addEventListener("touchcancel", onTouchEnd, { passive: true });

    window.addEventListener(
      "resize",
      function () {
        lastY = getY();
        lastIntent = 0;
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
