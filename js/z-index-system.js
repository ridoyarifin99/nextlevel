(function () {
  "use strict";

  if (window.__NLSZIndexSystemLoaded) return;
  window.__NLSZIndexSystemLoaded = true;

  /*
   * NEXT LEVEL SUBS global stacking order.
   * Keep this intentionally small and predictable. Values are only compared
   * inside the same stacking context, so component parents must not introduce
   * unnecessary z-index/transform stacking contexts.
   *
   *  1  background/decorations
   * 10  normal floating content
   * 20  sticky/fixed top navigation
   * 30  dropdowns/search menus
   * 40  mobile drawer + drawer overlay
   * 50  persistent mobile bottom navigation
   * 60  floating action buttons
   * 70  cart/modal overlays
   * 80  dialogs/modals
   * 90  loading/toast/notification layers
   * 100 emergency/topmost app UI
   */
  const STYLE_ID = "nls-global-z-index-system";

  function install() {
    if (document.getElementById(STYLE_ID)) return;

    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = `
      /* ===== NLS GLOBAL Z-INDEX SYSTEM ===== */
      .background-orb,
      .orb-one,
      .orb-two { z-index: 1 !important; }

      .nls-header,
      #nlsHeader,
      .checkout-header { z-index: 20 !important; }

      .search-dropdown,
      .nls-nav-more-menu,
      .nls-mobile-search-panel { z-index: 30 !important; }

      .mobile-menu-overlay,
      #mobileMenuOverlay,
      .nls-drawer-overlay { z-index: 40 !important; }

      .nav-menu,
      .nls-drawer,
      #mobileDrawer { z-index: 41 !important; }

      #nls-mobile-bottom-nav { z-index: 50 !important; }

      .fab,
      .whatsapp-fab { z-index: 60 !important; }

      .cart-overlay { z-index: 70 !important; }
      .cart-sidebar { z-index: 71 !important; }

      #successModal,
      #accountSetupModal,
      .nls-modal,
      .modal { z-index: 80 !important; }

      .loading-overlay,
      .notification,
      #notification,
      .toast,
      [role="alert"] { z-index: 90 !important; }

      /* Keep modal content above its own backdrop while remaining below
         nothing except explicit top-level emergency UI. */
      #successModal .modal-backdrop,
      #accountSetupModal .modal-backdrop { z-index: 0 !important; }
      #successModal .success-modal-wrapper,
      #accountSetupModal .success-modal-wrapper { z-index: 1 !important; }

      /* The bottom nav is persistent. Its visibility is controlled only by
         responsive CSS, never by competing z-index/scroll scripts. */
      @media (max-width:1024px) {
        #nls-mobile-bottom-nav {
          display: block !important;
          visibility: visible !important;
        }
      }
      @media (min-width:1025px) {
        #nls-mobile-bottom-nav { display: none !important; }
      }
    `;
    document.head.appendChild(style);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", install, { once: true });
  } else {
    install();
  }
})();
