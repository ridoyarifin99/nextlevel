(function () {
  "use strict";

  /*
   * Header owns scroll-hide behavior.
   * The mobile bottom navigation is a persistent navigation surface and must
   * never be hidden because of document scrolling, browser chrome resizing, or
   * a tap on the top navbar. This prevents checkout/auth flows from losing the
   * bottom navigation unexpectedly.
   */
  if (window.__NLSNavScrollBound) return;
  window.__NLSNavScrollBound = true;

  const TOP_ZONE = 2;
  const MIN_DELTA = 1;
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

  function getHeader() {
    return document.getElementById("nlsHeader") || document.querySelector(".nls-header");
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

  function keepBottomNavVisible() {
    const bottom = document.getElementById("nls-mobile-bottom-nav");
    if (!bottom) return;

    const mobile = window.innerWidth <= MOBILE_MAX;
    bottom.classList.remove("nls-scroll-hidden");
    bottom.style.setProperty("z-index", "50", "important");
    bottom.style.setProperty("transform", mobile ? "translate3d(0,0,0)" : "none", "important");
    bottom.style.setProperty("opacity", mobile ? "1" : "", "important");
    bottom.style.setProperty("visibility", mobile ? "visible" : "", "important");
    bottom.style.setProperty("pointer-events", mobile ? "auto" : "", "important");
  }

  function update() {
    ticking = false;
    const currentY = getY();
    const delta = currentY - lastY;

    keepBottomNavVisible();

    if (currentY <= TOP_ZONE) {
      setHeaderHidden(false);
      lastY = currentY;
      return;
    }

    if (Math.abs(delta) < MIN_DELTA) return;

    if (delta > 0) setHeaderHidden(true);
    else setHeaderHidden(false);

    lastY = currentY;
  }

  function onScroll() {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(update);
  }

  function onResize() {
    const currentY = getY();
    lastY = currentY;
    keepBottomNavVisible();
    setHeaderHidden(currentY > TOP_ZONE ? hidden : false);
  }

  function init() {
    lastY = getY();
    setHeaderHidden(false);
    keepBottomNavVisible();
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
