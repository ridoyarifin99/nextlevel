(function () {
  "use strict";

  if (window.__NLSNavScrollBound) return;
  window.__NLSNavScrollBound = true;

  const SHOW_AT_TOP = 12;
  const HIDE_AFTER = 56;
  const MIN_DELTA = 4;
  const MOBILE_MAX = 1024;

  let lastY = 0;
  let ticking = false;
  let hidden = false;

  const getY = () => Math.max(
    0,
    window.scrollY ||
      window.pageYOffset ||
      document.documentElement.scrollTop ||
      0
  );

  function getBars() {
    return {
      top:
        document.getElementById("nlsHeader") ||
        document.querySelector(".nls-header"),
      bottom: document.getElementById("nls-mobile-bottom-nav")
    };
  }

  function setTopHidden(value) {
    const { top } = getBars();
    if (!top) return;

    top.classList.toggle("nls-scroll-hidden", value);
    top.style.setProperty(
      "transform",
      value ? "translate3d(0,-110%,0)" : "translate3d(0,0,0)",
      "important"
    );
    top.style.setProperty("opacity", value ? "0" : "1", "important");
    top.style.setProperty(
      "pointer-events",
      value ? "none" : "auto",
      "important"
    );
  }

  function setBottomHidden(value) {
    const { bottom } = getBars();
    if (!bottom) return;

    // Bottom navigation exists only on mobile/tablet.
    const shouldHide = window.innerWidth <= MOBILE_MAX && value;

    bottom.classList.toggle("nls-scroll-hidden", shouldHide);
    bottom.style.setProperty(
      "transform",
      shouldHide
        ? "translate3d(0,calc(100% + 24px),0)"
        : "translate3d(0,0,0)",
      "important"
    );
    bottom.style.setProperty("opacity", shouldHide ? "0" : "1", "important");
    bottom.style.setProperty(
      "pointer-events",
      shouldHide ? "none" : "auto",
      "important"
    );
  }

  function setHidden(value) {
    hidden = value;
    setTopHidden(value);
    setBottomHidden(value);
  }

  function update() {
    ticking = false;

    const current = getY();
    const delta = current - lastY;

    // Always show the navigation at the very top.
    if (current <= SHOW_AT_TOP) {
      setHidden(false);
      lastY = current;
      return;
    }

    if (Math.abs(delta) >= MIN_DELTA) {
      if (delta > 0 && current > HIDE_AFTER) {
        setHidden(true);
      } else if (delta < 0) {
        setHidden(false);
      }
    }

    lastY = current;
  }

  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(update);
  }

  function init() {
    lastY = getY();
    hidden = false;
    setHidden(false);

    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("scroll", onScroll, {
      passive: true,
      capture: true
    });

    window.addEventListener(
      "resize",
      () => {
        lastY = getY();
        setHidden(false);
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
