(function () {
  "use strict";
  if (window.__NLSNavScrollBound) return;
  window.__NLSNavScrollBound = true;

  const MAX_MOBILE = 1024;
  const SHOW_AT_TOP = 12;
  const HIDE_AFTER = 56;
  const MIN_DELTA = 4;
  let lastY = 0;
  let ticking = false;
  let hidden = false;

  const y = () => Math.max(0, window.scrollY || window.pageYOffset || document.documentElement.scrollTop || 0);
  const bars = () => ({
    top: document.getElementById("nlsHeader") || document.querySelector(".nls-header"),
    bottom: document.getElementById("nls-mobile-bottom-nav")
  });

  function setHidden(value) {
    if (hidden === value) return;
    hidden = value;
    const { top, bottom } = bars();

    if (top) {
      top.classList.toggle("nls-scroll-hidden", value);
      top.style.setProperty("transform", value ? "translate3d(0,-110%,0)" : "translate3d(0,0,0)", "important");
      top.style.setProperty("opacity", value ? "0" : "1", "important");
      top.style.setProperty("pointer-events", value ? "none" : "auto", "important");
    }
    if (bottom) {
      bottom.classList.toggle("nls-scroll-hidden", value);
      bottom.style.setProperty("transform", value ? "translate3d(0,calc(100% + 24px),0)" : "translate3d(0,0,0)", "important");
      bottom.style.setProperty("opacity", value ? "0" : "1", "important");
      bottom.style.setProperty("pointer-events", value ? "none" : "auto", "important");
    }
  }

  function update() {
    ticking = false;
    if (window.innerWidth > MAX_MOBILE) {
      setHidden(false);
      lastY = y();
      return;
    }
    const current = y();
    const delta = current - lastY;
    if (current <= SHOW_AT_TOP) {
      setHidden(false);
      lastY = current;
      return;
    }
    if (Math.abs(delta) >= MIN_DELTA) {
      if (delta > 0 && current > HIDE_AFTER) setHidden(true);
      else if (delta < 0) setHidden(false);
    }
    lastY = current;
  }

  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(update);
  }

  function init() {
    lastY = y();
    setHidden(false);
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("scroll", onScroll, { passive: true, capture: true });
    window.addEventListener("resize", () => { lastY = y(); setHidden(false); }, { passive: true });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, { once: true });
  else init();
})();
