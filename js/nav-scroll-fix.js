(function () {
  "use strict";

  if (window.__NLSNavScrollFixLoaded) return;
  window.__NLSNavScrollFixLoaded = true;

  const MOBILE_MAX = 1024;
  const HIDE_AFTER_Y = 56;
  const MIN_DELTA = 3;

  let header = null;
  let bottom = null;
  let lastY = 0;
  let ticking = false;
  let hidden = false;
  let initialized = false;

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

  function findElements() {
    header = document.getElementById("nlsHeader") || document.querySelector(".nls-header");
    bottom = document.getElementById("nls-mobile-bottom-nav");

    if (header) {
      const height = Math.ceil(header.getBoundingClientRect().height || header.offsetHeight || 72);
      header.style.setProperty("--nls-header-hide-offset", `${height + 4}px`);
    }
  }

  function applyState(shouldHide) {
    findElements();

    if (hidden === shouldHide && initialized) return;
    hidden = shouldHide;
    initialized = true;

    const mobile = window.innerWidth <= MOBILE_MAX;

    if (!mobile) {
      hidden = false;
    }

    if (header) {
      if (hidden) {
        /*
         * Do not depend on transform alone. The header is position:sticky,
         * so a negative sticky top guarantees that the entire header leaves
         * the viewport even when another stylesheet/script touches transform.
         */
        header.style.setProperty("top", "calc(-1 * var(--nls-header-hide-offset, 76px))", "important");
        header.style.setProperty("transform", "translate3d(0,-8px,0)", "important");
        header.style.setProperty("opacity", "0", "important");
        header.style.setProperty("pointer-events", "none", "important");
        header.classList.add("nls-scroll-hidden");
      } else {
        header.style.setProperty("top", "0px", "important");
        header.style.setProperty("transform", "translate3d(0,0,0)", "important");
        header.style.setProperty("opacity", "1", "important");
        header.style.setProperty("pointer-events", "auto", "important");
        header.classList.remove("nls-scroll-hidden");
      }
    }

    if (bottom) {
      if (hidden) {
        bottom.style.setProperty("transform", "translate3d(0,calc(100% + 24px),0)", "important");
        bottom.style.setProperty("opacity", "0", "important");
        bottom.style.setProperty("pointer-events", "none", "important");
        bottom.classList.add("nls-scroll-hidden");
      } else {
        bottom.style.setProperty("transform", "translate3d(0,0,0)", "important");
        bottom.style.setProperty("opacity", "1", "important");
        bottom.style.setProperty("pointer-events", "auto", "important");
        bottom.classList.remove("nls-scroll-hidden");
      }
    }
  }

  function update() {
    ticking = false;
    findElements();

    if (window.innerWidth > MOBILE_MAX) {
      applyState(false);
      lastY = getY();
      return;
    }

    const y = getY();
    const delta = y - lastY;

    /* Always show both bars at the very top. */
    if (y <= 12) {
      applyState(false);
      lastY = y;
      return;
    }

    /* Ignore tiny touch/trackpad movement. */
    if (Math.abs(delta) < MIN_DELTA) {
      lastY = y;
      return;
    }

    /* Down = hide. Up = show. */
    if (delta > 0 && y > HIDE_AFTER_Y) {
      applyState(true);
    } else if (delta < 0) {
      applyState(false);
    }

    lastY = y;
  }

  function scheduleUpdate() {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(update);
  }

  function resetAfterResize() {
    findElements();
    lastY = getY();
    applyState(false);
  }

  function init() {
    findElements();
    lastY = getY();
    applyState(false);

    /* Window catches normal page scrolling. Capture catches nested scroll containers. */
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    document.addEventListener("scroll", scheduleUpdate, { passive: true, capture: true });
    window.addEventListener("resize", resetAfterResize, { passive: true });
    window.addEventListener("orientationchange", function () {
      window.setTimeout(resetAfterResize, 120);
    }, { passive: true });

    /* The bottom nav is injected dynamically, so keep discovering it. */
    if (window.MutationObserver && document.body) {
      const observer = new MutationObserver(function () {
        const previousBottom = bottom;
        findElements();
        if (!previousBottom && bottom) {
          applyState(false);
        }
      });
      observer.observe(document.body, { childList: true, subtree: true });
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
