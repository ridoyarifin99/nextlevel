"use strict";

/*
 * Compatibility entry point for legacy pages that still reference /src/auth.js.
 * The canonical Supabase authentication implementation is /js/auth.js.
 *
 * This shim also removes the old localhost API setting, normalizes the
 * homepage favicon, and adds the mobile Facebook-style navigation used by
 * the storefront when a .nls-header is present.
 */
(function () {
  if (typeof window !== "undefined") {
    var apiBase = window.AUTH_API_BASE;
    if (typeof apiBase === "string" && /^(https?:\/\/)?(localhost|127\.0\.0\.1)(:\d+)?/i.test(apiBase)) {
      try { delete window.AUTH_API_BASE; } catch (_) { window.AUTH_API_BASE = ""; }
    }
  }

  function fixProductionAssets() {
    var icon = document.querySelector('link[rel="icon"]');
    if (icon) {
      icon.href = "/images/next_level.png";
      icon.type = "image/png";
    }
  }

  function addMobileNavigation() {
    var header = document.querySelector(".nls-header");
    if (!header || document.getElementById("nlsMobileBottomNav")) return;

    var style = document.createElement("style");
    style.id = "nls-mobile-navigation-style";
    style.textContent = `
      @media (max-width: 767px) {
        body { padding-bottom: calc(82px + env(safe-area-inset-bottom)); }

        .nls-header {
          position: sticky !important;
          top: 0 !important;
          border-bottom: 1px solid rgba(226,232,240,.8) !important;
          box-shadow: 0 2px 14px rgba(15,23,42,.07) !important;
          background: rgba(255,255,255,.94) !important;
          backdrop-filter: blur(18px) saturate(160%) !important;
          -webkit-backdrop-filter: blur(18px) saturate(160%) !important;
        }

        .nls-container,
        .nls-header.scrolled .nls-container {
          position: relative !important;
          height: 58px !important;
          min-height: 58px !important;
          padding: 0 10px !important;
          gap: 0 !important;
        }

        .nls-left { flex: 1 1 auto !important; min-width: 0 !important; gap: 0 !important; }
        .nls-nav { display: none !important; }

        .nls-hamburger {
          display: flex !important;
          flex: 0 0 42px !important;
          width: 42px !important;
          height: 42px !important;
          align-items: center !important;
          justify-content: center !important;
          margin: 0 !important;
        }
        .nls-hamburger span { left: 9px !important; }

        .nls-logo-link {
          position: absolute !important;
          left: 50% !important;
          top: 50% !important;
          transform: translate(-50%, -50%) !important;
          gap: 0 !important;
          max-width: 42vw !important;
        }
        .nls-logo-link:hover .nls-logo-img { transform: none !important; }
        .nls-logo-img,
        .nls-header.scrolled .nls-logo-img {
          height: 36px !important;
          width: auto !important;
          max-width: 42vw !important;
        }
        .nls-logo-text-container { display: none !important; }

        .nls-right {
          margin-left: auto !important;
          gap: 2px !important;
          height: 58px !important;
        }
        .nls-search-desktop { display: none !important; }
        .nls-icon-btn,
        .nls-cart-btn {
          display: inline-flex !important;
          align-items: center !important;
          justify-content: center !important;
          width: 42px !important;
          height: 42px !important;
          padding: 0 !important;
          border: 0 !important;
          border-radius: 50% !important;
          background: transparent !important;
          color: #334155 !important;
          position: relative !important;
        }
        .nls-icon-btn i,
        .nls-cart-btn i { font-size: 19px !important; }
        .nls-cart-text,
        .nls-auth-text,
        .nls-account-link { display: none !important; }
        .nls-cart-btn .cart-badge { top: 1px !important; right: 0 !important; }

        .nls-mobile-search-panel { z-index: 1001 !important; }

        #nlsMobileBottomNav {
          position: fixed;
          left: 10px;
          right: 10px;
          bottom: max(10px, env(safe-area-inset-bottom));
          height: 64px;
          padding: 6px 7px;
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          align-items: center;
          gap: 3px;
          background: rgba(255,255,255,.96);
          border: 1px solid rgba(226,232,240,.9);
          border-radius: 21px;
          box-shadow: 0 12px 35px rgba(15,23,42,.18), 0 2px 8px rgba(15,23,42,.08);
          z-index: 9999;
          backdrop-filter: blur(18px) saturate(170%);
          -webkit-backdrop-filter: blur(18px) saturate(170%);
        }

        #nlsMobileBottomNav .nls-bottom-item {
          position: relative;
          height: 52px;
          min-width: 0;
          border: 0;
          border-radius: 16px;
          background: transparent;
          color: #64748b;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          -webkit-tap-highlight-color: transparent;
          transition: transform .18s ease, background .18s ease, color .18s ease;
        }
        #nlsMobileBottomNav .nls-bottom-item:active { transform: scale(.92); }
        #nlsMobileBottomNav .nls-bottom-item.active {
          color: #2563eb;
          background: #e8f0ff;
        }
        #nlsMobileBottomNav .nls-bottom-item i { font-size: 21px; line-height: 1; }
        #nlsMobileBottomNav .nls-bottom-item .nls-bottom-badge {
          position: absolute;
          top: 6px;
          right: calc(50% - 17px);
          min-width: 17px;
          height: 17px;
          padding: 0 4px;
          border-radius: 999px;
          background: #ef4444;
          color: #fff;
          border: 2px solid #fff;
          font: 700 9px/13px Inter, system-ui, sans-serif;
          text-align: center;
        }

        .nls-drawer { z-index: 10000 !important; }
        .nls-drawer-overlay { z-index: 9998 !important; }
      }

      @media (min-width: 768px) {
        #nlsMobileBottomNav { display: none !important; }
      }
    `;
    document.head.appendChild(style);

    var nav = document.createElement("nav");
    nav.id = "nlsMobileBottomNav";
    nav.setAttribute("aria-label", "Mobile navigation");
    nav.innerHTML = `
      <a class="nls-bottom-item" data-bottom-nav="home" href="/" aria-label="Home">
        <i class="fa-solid fa-house"></i>
      </a>
      <button class="nls-bottom-item" data-bottom-nav="categories" type="button" aria-label="Categories">
        <i class="fa-solid fa-grid-2"></i>
      </button>
      <button class="nls-bottom-item" data-bottom-nav="search" type="button" aria-label="Search">
        <i class="fa-solid fa-magnifying-glass"></i>
      </button>
      <button class="nls-bottom-item" data-bottom-nav="cart" type="button" aria-label="Cart">
        <i class="fa-solid fa-basket-shopping-simple"></i>
        <span class="nls-bottom-badge" id="nlsBottomCartCount" hidden>0</span>
      </button>
      <a class="nls-bottom-item" data-bottom-nav="account" href="/login.html?redirect=/" aria-label="Account">
        <i class="fa-solid fa-circle-user"></i>
      </a>
    `;
    document.body.appendChild(nav);

    var home = nav.querySelector('[data-bottom-nav="home"]');
    var categories = nav.querySelector('[data-bottom-nav="categories"]');
    var search = nav.querySelector('[data-bottom-nav="search"]');
    var cart = nav.querySelector('[data-bottom-nav="cart"]');
    var account = nav.querySelector('[data-bottom-nav="account"]');

    var currentPath = window.location.pathname.replace(/\\/+$/, "") || "/";
    if (currentPath === "/") home.classList.add("active");

    categories.addEventListener("click", function () {
      var button = document.getElementById("mobileMenuBtn");
      if (button) button.click();
    });

    search.addEventListener("click", function () {
      var button = document.getElementById("mobileSearchToggle");
      if (button) button.click();
      else {
        var input = document.getElementById("mobileSearchInput");
        if (input) input.focus();
      }
    });

    cart.addEventListener("click", function () {
      var button = document.getElementById("cartBtn");
      if (button) button.click();
    });

    function syncAccountLink() {
      var loggedIn = document.getElementById("userAccountArea");
      var login = document.getElementById("loginLink");
      var visibleUser = loggedIn && getComputedStyle(loggedIn).display !== "none";
      if (visibleUser) {
        account.href = loggedIn.getAttribute("href") || "/dashboard.html";
        account.setAttribute("aria-label", "Dashboard");
      } else if (login) {
        account.href = login.getAttribute("href") || "/login.html?redirect=/";
      }
    }

    function syncCartBadge() {
      var source = document.getElementById("cartCount");
      var badge = document.getElementById("nlsBottomCartCount");
      if (!badge) return;
      var count = source ? parseInt(source.textContent || "0", 10) || 0 : 0;
      badge.textContent = count > 99 ? "99+" : String(count);
      badge.hidden = count <= 0;
    }

    syncAccountLink();
    syncCartBadge();

    var cartSource = document.getElementById("cartCount");
    if (cartSource && window.MutationObserver) {
      new MutationObserver(syncCartBadge).observe(cartSource, { childList: true, characterData: true, subtree: true, attributes: true });
    }

    if (window.MutationObserver) {
      var authArea = document.getElementById("userAccountArea");
      if (authArea) new MutationObserver(syncAccountLink).observe(authArea, { attributes: true, attributeFilter: ["style", "class"] });
    }
  }

  function init() {
    fixProductionAssets();
    addMobileNavigation();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
