(function () {
  "use strict";

  /* NEXT LEVEL SUBS — one global controller for top + mobile bottom navigation. */
  if (window.__NLSNavScrollBound) return;
  window.__NLSNavScrollBound = true;

  const STYLE_ID = "nls-global-navbar-scroll-style";
  const MOBILE_MAX = 1024;
  const TOP_ZONE = 4;
  const MIN_DELTA = 2;
  const MOBILE_REVEAL_DISTANCE = 6;
  const TRANSITION = "transform 280ms cubic-bezier(0.16,1,0.3,1), opacity 180ms ease, visibility 0s linear 280ms";

  let lastY = 0;
  let hidden = false;
  let accumulatedUp = 0;
  let ticking = false;
  let observerStarted = false;

  function isMobile() {
    return window.innerWidth <= MOBILE_MAX;
  }

  function getY() {
    return Math.max(0, window.scrollY || window.pageYOffset || document.documentElement.scrollTop || document.body?.scrollTop || 0);
  }

  function getHeader() {
    return document.getElementById("nlsHeader")
      || document.querySelector("header.nls-header, header.checkout-header")
      || document.querySelector("body > header, header");
  }

  function getBottomNav() {
    return document.getElementById("nls-mobile-bottom-nav");
  }

  function installStyles() {
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = `
      header.nls-header,#nlsHeader,header.checkout-header{
        transition:${TRANSITION}!important;
        will-change:transform,opacity;
      }
      #nls-mobile-bottom-nav{
        transition:${TRANSITION}!important;
        will-change:transform,opacity;
      }
      @media(min-width:1025px){#nls-mobile-bottom-nav{display:none!important}}
    `;
    (document.head || document.documentElement).appendChild(style);
  }

  function apply(element, shouldHide, direction) {
    if (!element) return;
    element.classList.toggle("nls-scroll-hidden", shouldHide);
    const transform = shouldHide
      ? (direction === "bottom" ? "translate3d(0,calc(100% + 24px),0)" : "translate3d(0,-110%,0)")
      : "translate3d(0,0,0)";
    element.style.setProperty("transform", transform, "important");
    element.style.setProperty("opacity", shouldHide ? "0" : "1", "important");
    element.style.setProperty("visibility", shouldHide ? "hidden" : "visible", "important");
    element.style.setProperty("pointer-events", shouldHide ? "none" : "auto", "important");
  }

  function setNavigationHidden(shouldHide) {
    hidden = Boolean(shouldHide);
    const header = getHeader();
    const bottom = getBottomNav();

    apply(header, hidden, "top");

    if (isMobile()) {
      apply(bottom, hidden, "bottom");
      if (bottom) bottom.style.setProperty("z-index", "50", "important");
    } else if (bottom) {
      bottom.classList.remove("nls-scroll-hidden");
      bottom.style.removeProperty("transform");
      bottom.style.removeProperty("opacity");
      bottom.style.removeProperty("visibility");
      bottom.style.removeProperty("pointer-events");
    }
  }

  function update() {
    ticking = false;
    const currentY = getY();
    const delta = currentY - lastY;

    if (currentY <= TOP_ZONE) {
      accumulatedUp = 0;
      setNavigationHidden(false);
      lastY = currentY;
      return;
    }

    if (Math.abs(delta) < MIN_DELTA) return;

    if (delta > 0) {
      accumulatedUp = 0;
      if (!hidden) setNavigationHidden(true);
    } else {
      accumulatedUp += Math.abs(delta);
      if (accumulatedUp >= (isMobile() ? MOBILE_REVEAL_DISTANCE : MIN_DELTA)) {
        accumulatedUp = 0;
        if (hidden) setNavigationHidden(false);
      }
    }

    lastY = currentY;
  }

  function onScroll() {
    if (ticking) return;
    ticking = true;
    (window.requestAnimationFrame || function (fn) { return setTimeout(fn, 0); })(update);
  }

  function resetAfterLayoutChange() {
    lastY = getY();
    accumulatedUp = 0;
    installStyles();
    setNavigationHidden(getY() > TOP_ZONE ? hidden : false);
  }

  function observeNavigation() {
    if (observerStarted || !document.body) return;
    observerStarted = true;
    const observer = new MutationObserver(function () {
      installStyles();
      const y = getY();
      if (y <= TOP_ZONE) setNavigationHidden(false);
      else setNavigationHidden(hidden);
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }

  function init() {
    installStyles();
    lastY = getY();
    setNavigationHidden(false);

    window.addEventListener("scroll", onScroll, { passive: true });
    /* Also catch scrolling produced by page/nested scrolling implementations. */
    document.addEventListener("scroll", onScroll, { passive: true, capture: true });
    window.addEventListener("resize", resetAfterLayoutChange, { passive: true });
    window.addEventListener("pageshow", resetAfterLayoutChange, { passive: true });
    if (window.visualViewport) window.visualViewport.addEventListener("resize", resetAfterLayoutChange, { passive: true });
    observeNavigation();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
