(function () {
  "use strict";

  if (!/\/product\//i.test(location.pathname) && !/details\.html$/i.test(location.pathname)) return;
  if (window.__NLSDetailsScrollStabilityLoaded) return;
  window.__NLSDetailsScrollStabilityLoaded = true;

  const MOBILE_MAX = 1024;
  const STYLE_ID = "nls-details-scroll-stability";

  function isMobile() {
    return window.innerWidth <= MOBILE_MAX;
  }

  function injectCSS() {
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = `
      html {
        width:100%;
        max-width:100%;
        min-height:100%;
        overflow-x:clip;
        overflow-y:auto;
        -webkit-text-size-adjust:100%;
        text-size-adjust:100%;
        scroll-behavior:smooth;
      }
      body {
        width:100%;
        max-width:100%;
        min-width:0;
        min-height:100vh;
        min-height:100svh;
        min-height:100dvh;
        margin:0;
        overflow-x:clip;
        overflow-y:visible;
        position:relative;
        -webkit-overflow-scrolling:touch;
        touch-action:pan-y;
      }
      main {
        width:100%;
        max-width:100%;
        min-width:0;
        overflow:visible;
      }
      .nls-container,.nls-left,.nls-right,
      #productDetails,.product-details,.details-container,
      #tabContent,.tabs-container,.gallery-container,
      .plan-card,.feature-item,.subscription-card {
        min-width:0;
        max-width:100%;
      }
      img,video,canvas,svg,iframe { max-width:100%; }
      input,textarea,select,button { max-width:100%; }

      @media(max-width:${MOBILE_MAX}px){
        html,body { overflow-x:clip !important; }
        body:not(.cart-open) { overflow-y:visible !important; }
        .nls-header { padding-top:0 !important; }
        .nls-container {
          width:100% !important;
          padding-left:max(12px,env(safe-area-inset-left,0px)) !important;
          padding-right:max(12px,env(safe-area-inset-right,0px)) !important;
        }
        .nls-left { gap:clamp(6px,2vw,14px) !important; }
        .nls-right { gap:4px !important; }
        .nls-logo-link { min-width:0 !important; }
        .nls-logo-img { max-width:42vw !important; height:auto !important; }
        .nls-logo-text-container { max-width:24vw !important; width:110px !important; }

        #nls-mobile-bottom-nav {
          position:fixed !important;
          left:max(8px,env(safe-area-inset-left,0px)) !important;
          right:max(8px,env(safe-area-inset-right,0px)) !important;
          bottom:max(10px,env(safe-area-inset-bottom,0px)) !important;
        }

        .nls-drawer,
        .nls-drawer-overlay,
        .cart-overlay {
          height:100dvh !important;
          max-height:100dvh !important;
        }
        .nls-drawer { overflow-y:auto !important; -webkit-overflow-scrolling:touch; }
        .cart-sidebar {
          height:100dvh !important;
          max-height:100dvh !important;
          overflow:hidden !important;
        }
        .cart-items-container { min-height:0 !important; overflow-y:auto !important; -webkit-overflow-scrolling:touch; }

        .tab-button { min-width:0 !important; white-space:nowrap; }
        #tabContent { overflow:visible !important; }
        .gallery-container { width:100% !important; max-width:100% !important; }
        .gallery-slide { width:100% !important; min-width:100% !important; }
        .gallery-slide img { max-width:100% !important; }
        .plan-card { width:100% !important; }
        .feature-item span { min-width:0; overflow-wrap:anywhere; }
        #tabContent *,#productDetails * { overflow-wrap:anywhere; word-break:normal; }
        main { padding-bottom:calc(92px + env(safe-area-inset-bottom,0px)) !important; }
        .fab,.whatsapp-fab { bottom:calc(86px + env(safe-area-inset-bottom,0px)) !important; }
      }

      @media(min-width:${MOBILE_MAX + 1}px){
        html,body { overflow-x:hidden; }
        main { padding-bottom:0 !important; }
      }
    `;
    document.head.appendChild(style);
  }

  function setStyleIfChanged(el, prop, value) {
    if (el && el.style.getPropertyValue(prop) !== value) el.style.setProperty(prop, value);
  }

  function repairScrollLock() {
    const body = document.body;
    if (!body || !isMobile()) return;

    const drawer = document.getElementById("mobileDrawer");
    const drawerOpen = !!drawer && drawer.classList.contains("active");
    const cart = document.getElementById("cartSidebar");
    const cartOpen = !!cart && cart.classList.contains("open");

    if (!drawerOpen && !cartOpen) {
      body.classList.remove("nls-mobile-menu-open");
      ["overflow", "overflow-y", "position", "height"].forEach(p => body.style.removeProperty(p));
    }
  }

  function repairFixedPanels() {
    if (!isMobile()) return;
    const drawer = document.getElementById("mobileDrawer");
    const overlay = document.getElementById("mobileMenuOverlay");
    if (drawer) {
      setStyleIfChanged(drawer, "max-height", "100dvh");
      setStyleIfChanged(drawer, "height", "100dvh");
      setStyleIfChanged(drawer, "overflow-y", "auto");
      if (drawer.style.webkitOverflowScrolling !== "touch") drawer.style.webkitOverflowScrolling = "touch";
    }
    if (overlay) setStyleIfChanged(overlay, "height", "100dvh");
  }

  function refresh() {
    injectCSS();
    repairScrollLock();
    repairFixedPanels();
  }

  function init() {
    refresh();
    const observer = new MutationObserver(function () { refresh(); });
    observer.observe(document.body, { subtree:true, childList:true, attributes:true, attributeFilter:["class","style"] });
    window.addEventListener("resize", refresh, { passive:true });
    window.addEventListener("orientationchange", function () {
      setTimeout(refresh,100);
      setTimeout(refresh,500);
    }, { passive:true });
    window.addEventListener("pageshow", refresh, { passive:true });
    if (window.visualViewport) window.visualViewport.addEventListener("resize", refresh, { passive:true });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, { once:true });
  else init();
})();
