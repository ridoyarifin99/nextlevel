(function () {
  "use strict";

  if (window.__NLSNavScrollBound) return;
  window.__NLSNavScrollBound = true;

  const TOP_ZONE = 40;
  const MIN_DELTA = 2;
  const MOBILE_MAX = 1024;
  const HIDE_DISTANCE = 8;

  let lastY = window.scrollY || document.documentElement.scrollTop || 0;
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
      header.style.setProperty("transform", hidden ? "translate3d(0, -110%, 0)" : "translate3d(0, 0, 0)", "important");
      header.style.setProperty("opacity", hidden ? "0" : "1", "important");
      header.style.setProperty("visibility", hidden ? "hidden" : "visible", "important");
      header.style.setProperty("pointer-events", hidden ? "none" : "auto", "important");
      header.style.setProperty("will-change", "transform", "important");
    }

    if (bottom) {
      const mobileHide = hidden && window.innerWidth <= MOBILE_MAX;
      bottom.classList.toggle("nls-scroll-hidden", mobileHide);
      bottom.style.setProperty("transform", mobileHide ? "translate3d(0, calc(100% + 24px), 0)" : "translate3d(0, 0, 0)", "important");
      bottom.style.setProperty("opacity", mobileHide ? "0" : "1", "important");
      bottom.style.setProperty("pointer-events", mobileHide ? "none" : "auto", "important");
    }
  }

  function update() {
    ticking = false;

    const currentY = getY();
    const delta = currentY - lastY;

    // Always show at the top.
    if (currentY <= TOP_ZONE) {
      applyState(false);
      lastY = currentY;
      return;
    }

    // Ignore tiny scroll jitter.
    if (Math.abs(delta) < MIN_DELTA) return;

    // Down = hide, up = immediately show.
    if (delta > 0 && currentY > HIDE_DISTANCE) {
      applyState(true);
    } else if (delta < 0) {
      applyState(false);
    }

    lastY = currentY;
  }

  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(update);
  }

  function init() {
    lastY = getY();
    applyState(false);

    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("scroll", onScroll, { passive: true, capture: true });

    window.addEventListener("resize", function () {
      lastY = getY();
      applyState(false);
    }, { passive: true });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
