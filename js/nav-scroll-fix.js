(function () {
  "use strict";

  if (window.__NLSNavScrollFixLoaded) return;
  window.__NLSNavScrollFixLoaded = true;

  function init() {
    const header = document.getElementById("nlsHeader") || document.querySelector(".nls-header");
    const bottom = document.getElementById("nls-mobile-bottom-nav");
    if (!header && !bottom) return;

    let lastY = Math.max(0, window.scrollY || window.pageYOffset || 0);
    let ticking = false;
    let hidden = false;

    function applyHidden(value) {
      if (hidden === value) return;
      hidden = value;

      if (header) {
        if (value) {
          header.style.setProperty("transform", "translate3d(0,-110%,0)", "important");
          header.style.setProperty("opacity", "0", "important");
          header.style.setProperty("pointer-events", "none", "important");
        } else {
          header.style.removeProperty("transform");
          header.style.removeProperty("opacity");
          header.style.removeProperty("pointer-events");
        }
      }

      if (bottom) {
        if (value) {
          bottom.style.setProperty("transform", "translate3d(0,calc(100% + 24px),0)", "important");
          bottom.style.setProperty("opacity", "0", "important");
          bottom.style.setProperty("pointer-events", "none", "important");
        } else {
          bottom.style.removeProperty("transform");
          bottom.style.removeProperty("opacity");
          bottom.style.removeProperty("pointer-events");
        }
      }
    }

    function update() {
      ticking = false;

      if (window.innerWidth > 1024) {
        applyHidden(false);
        lastY = Math.max(0, window.scrollY || window.pageYOffset || 0);
        return;
      }

      const y = Math.max(0, window.scrollY || window.pageYOffset || 0);
      const delta = y - lastY;

      if (y <= 12) {
        applyHidden(false);
        lastY = y;
        return;
      }

      if (Math.abs(delta) >= 4) {
        if (delta > 0) applyHidden(true);
        else applyHidden(false);
      }

      lastY = y;
    }

    function onScroll() {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", function () {
      lastY = Math.max(0, window.scrollY || window.pageYOffset || 0);
      applyHidden(false);
    }, { passive: true });

    applyHidden(false);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      init();
      setTimeout(init, 150);
    }, { once: true });
  } else {
    init();
    setTimeout(init, 150);
  }
})();
