(function () {
  "use strict";

  /* NEXT LEVEL SUBS — synchronized navigation scroll controller. */
  if (window.__NLSNavScrollBound) return;
  window.__NLSNavScrollBound = true;

  const STYLE_ID = "nls-global-z-index-system-runtime";
  const TOP_ZONE = 2;
  const MIN_DELTA = 3;
  const MOBILE_MAX = 1024;
  const MOBILE_REVEAL_DISTANCE = 18;

  let lastY = 0;
  let hidden = false;
  let ticking = false;
  let accumulatedUp = 0;

  function loadGlobalScrollSystem() {
    if (document.querySelector('script[data-nextlevel-global-scroll]')) return;
    if (window.__NLS_GLOBAL_SCROLL_SYSTEM__) return;
    const script = document.createElement("script");
    script.src = "/js/global-scroll-system.js?v=20260908-1";
    script.async = false;
    script.dataset.nextlevelGlobalScroll = "true";
    document.head.appendChild(script);
  }

  function installZIndexSystem() {
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = `
      .background-orb,.orb-one,.orb-two{z-index:1!important}
      .nls-header,#nlsHeader,.checkout-header{z-index:20!important}
      .search-dropdown,.nls-nav-more-menu,.nls-mobile-search-panel{z-index:30!important}
      .mobile-menu-overlay,#mobileMenuOverlay,.nls-drawer-overlay{z-index:90!important}
      .nls-drawer,#mobileDrawer{z-index:100!important}
      .nav-menu{z-index:41!important}
      #nls-mobile-bottom-nav{z-index:50!important}
      .fab,.whatsapp-fab{z-index:60!important}
      .cart-overlay{z-index:70!important}
      .cart-sidebar{z-index:71!important}
      #successModal,#accountSetupModal,.nls-modal,.modal{z-index:80!important}
      .loading-overlay,.notification,#notification,.toast,[role="alert"]{z-index:110!important}
      @media(max-width:1024px){#nls-mobile-bottom-nav{z-index:50!important}}
      @media(min-width:1025px){#nls-mobile-bottom-nav{display:none!important}}
    `;
    document.head.appendChild(style);
  }

  function getY() {
    return Math.max(0, window.scrollY || window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0);
  }

  function isMobile() { return window.innerWidth <= MOBILE_MAX; }

  /* Every normal site page uses nlsHeader; generic header is a safe fallback
     for pages that were built before the shared header class was introduced. */
  function getHeader() {
    return document.getElementById("nlsHeader")
      || document.querySelector(".nls-header, .checkout-header")
      || document.querySelector("body > header, header");
  }

  function getBottomNav() { return document.getElementById("nls-mobile-bottom-nav"); }

  function setElementVisibility(element, shouldHide, direction) {
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

    if (isMobile()) {
      setElementVisibility(header, hidden, "top");
      setElementVisibility(bottom, hidden, "bottom");
      if (bottom) bottom.style.setProperty("z-index", "50", "important");
    } else {
      setElementVisibility(header, hidden, "top");
      if (bottom) {
        bottom.classList.remove("nls-scroll-hidden");
        bottom.style.removeProperty("transform");
        bottom.style.removeProperty("opacity");
        bottom.style.removeProperty("visibility");
        bottom.style.removeProperty("pointer-events");
      }
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
      setNavigationHidden(true);
    } else {
      accumulatedUp += Math.abs(delta);
      if (accumulatedUp >= MOBILE_REVEAL_DISTANCE || !isMobile()) {
        setNavigationHidden(false);
        accumulatedUp = 0;
      }
    }
    lastY = currentY;
  }

  function onScroll() {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(update);
  }

  function onResize() {
    lastY = getY();
    accumulatedUp = 0;
    setNavigationHidden(getY() > TOP_ZONE ? hidden : false);
  }

  /* Keep the controller working even when a page inserts/replaces its header
     after the initial script load. */
  function observeNavigationDom() {
    const observer = new MutationObserver(() => {
      if (getY() <= TOP_ZONE) setNavigationHidden(false);
      else setNavigationHidden(hidden);
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }

  function init() {
    loadGlobalScrollSystem();
    installZIndexSystem();
    lastY = getY();
    setNavigationHidden(false);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize, { passive: true });
    if (window.visualViewport) window.visualViewport.addEventListener("resize", onResize, { passive: true });
    observeNavigationDom();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, { once: true });
  else init();
})();
