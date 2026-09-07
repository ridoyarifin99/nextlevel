(function () {
  "use strict";

  /*
   * NEXT LEVEL SUBS global stacking order + header scroll behavior.
   * The mobile bottom navigation is persistent and never participates in
   * scroll-hide logic. Modals/dialogs intentionally sit above it.
   */
  if (window.__NLSNavScrollBound) return;
  window.__NLSNavScrollBound = true;

  const STYLE_ID = "nls-global-z-index-system-runtime";
  const TOP_ZONE = 2;
  const MIN_DELTA = 1;
  const MOBILE_MAX = 1024;

  let lastY = 0;
  let hidden = false;
  let ticking = false;

  function installZIndexSystem() {
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = `
      /* NLS z-index layers: 1 background, 10 content, 20 header,
         30 menus, 40 drawer, 50 mobile bottom nav, 60 FAB,
         70 cart overlay, 71 cart, 80 modal, 90 alerts/loading. */
      .background-orb,.orb-one,.orb-two{z-index:1!important}
      .nls-header,#nlsHeader,.checkout-header{z-index:20!important}
      .search-dropdown,.nls-nav-more-menu,.nls-mobile-search-panel{z-index:30!important}
      .mobile-menu-overlay,#mobileMenuOverlay,.nls-drawer-overlay{z-index:40!important}
      .nav-menu,.nls-drawer,#mobileDrawer{z-index:41!important}
      #nls-mobile-bottom-nav{z-index:50!important}
      .fab,.whatsapp-fab{z-index:60!important}
      .cart-overlay{z-index:70!important}
      .cart-sidebar{z-index:71!important}
      #successModal,#accountSetupModal,.nls-modal,.modal{z-index:80!important}
      .loading-overlay,.notification,#notification,.toast,[role="alert"]{z-index:90!important}
      @media(max-width:1024px){#nls-mobile-bottom-nav{display:block!important;visibility:visible!important;z-index:50!important}}
      @media(min-width:1025px){#nls-mobile-bottom-nav{display:none!important}}
    `;
    document.head.appendChild(style);
  }

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
    installZIndexSystem();
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
