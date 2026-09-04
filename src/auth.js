"use strict";

/*
============================================================
NEXT LEVEL SUBS
STOREFRONT COMPATIBILITY + MOBILE NAVIGATION
============================================================

The real Supabase authentication module lives in /js/auth.js.
This file keeps legacy compatibility and owns the mobile
storefront navigation used by index.html and details.html.
============================================================
*/
(function () {
  if (typeof window !== "undefined") {
    var apiBase = window.AUTH_API_BASE;
    if (typeof apiBase === "string" && /^(https?:\/\/)?(localhost|127\.0\.0\.1)(:\d+)?/i.test(apiBase)) {
      try { delete window.AUTH_API_BASE; } catch (_) { window.AUTH_API_BASE = ""; }
    }
  }

  function fixProductionAssets() {
    var icon = document.querySelector('link[rel="icon"], link[rel="shortcut icon"]');
    if (icon) {
      icon.href = "/images/next_level.png";
      icon.type = "image/png";
    }
  }

  function addMobileNavigation() {
    if (document.getElementById("nlsMobileBottomNav")) return true;
    if (!document.body) return false;

    var style = document.getElementById("nls-mobile-navigation-style");
    if (!style) {
      style = document.createElement("style");
      style.id = "nls-mobile-navigation-style";
      style.textContent = `
@media (max-width:767px){
  body{padding-top:54px!important;padding-bottom:calc(70px + env(safe-area-inset-bottom))!important}

  /* Compact Facebook-style top bar */
  .nls-header{
    position:fixed!important;top:0!important;left:0!important;right:0!important;width:100%!important;
    height:54px!important;z-index:10010!important;background:rgba(255,255,255,.97)!important;
    backdrop-filter:blur(18px) saturate(160%)!important;-webkit-backdrop-filter:blur(18px) saturate(160%)!important;
    transform:translate3d(0,0,0)!important;transition:transform .24s cubic-bezier(.16,1,.3,1)!important;
    will-change:transform
  }
  .nls-header.nls-scroll-hidden{transform:translate3d(0,-110%,0)!important}
  .nls-container,.nls-header.scrolled .nls-container{height:54px!important;min-height:54px!important;padding:0 8px!important;gap:0!important}
  .nls-left{flex:1 1 auto!important;min-width:0!important;gap:0!important}
  .nls-nav{display:none!important}
  .nls-hamburger{display:flex!important;flex:0 0 40px!important;width:40px!important;height:40px!important;align-items:center!important;justify-content:center!important;margin:0!important}
  .nls-hamburger span{left:8px!important}
  .nls-logo-link{position:absolute!important;left:50%!important;top:50%!important;transform:translate(-50%,-50%)!important;gap:0!important;max-width:40vw!important}
  .nls-logo-img,.nls-header.scrolled .nls-logo-img{height:34px!important;width:auto!important;max-width:40vw!important}
  .nls-logo-text-container{display:none!important}
  .nls-right{margin-left:auto!important;gap:0!important;height:54px!important}
  .nls-search-desktop{display:none!important}
  .nls-icon-btn,.nls-cart-btn{
    display:inline-flex!important;align-items:center!important;justify-content:center!important;width:40px!important;height:40px!important;
    padding:0!important;border:0!important;border-radius:50%!important;background:transparent!important;color:#334155!important;position:relative!important
  }
  .nls-icon-btn i,.nls-cart-btn i{font-size:18px!important}
  .nls-cart-text,.nls-auth-text,.nls-account-link{display:none!important}
  .nls-cart-btn .cart-badge{top:0!important;right:-1px!important}

  /* Compact floating bottom navigation */
  #nlsMobileBottomNav{
    position:fixed!important;left:8px!important;right:8px!important;bottom:max(8px,env(safe-area-inset-bottom))!important;
    height:56px!important;min-height:56px!important;padding:4px 5px!important;
    display:grid!important;visibility:visible!important;opacity:1!important;grid-template-columns:repeat(5,1fr)!important;
    align-items:center!important;gap:2px!important;background:rgba(255,255,255,.98)!important;
    border:1px solid rgba(226,232,240,.95)!important;border-radius:17px!important;
    box-shadow:0 8px 26px rgba(15,23,42,.16),0 2px 7px rgba(15,23,42,.07)!important;
    z-index:10000!important;backdrop-filter:blur(18px) saturate(170%)!important;
    -webkit-backdrop-filter:blur(18px) saturate(170%)!important;transform:translate3d(0,0,0)!important;
    transition:transform .24s cubic-bezier(.16,1,.3,1),opacity .18s ease!important;will-change:transform;pointer-events:auto
  }
  #nlsMobileBottomNav.nls-scroll-hidden{transform:translate3d(0,calc(100% + 18px),0)!important;opacity:0!important;pointer-events:none!important}
  #nlsMobileBottomNav .nls-bottom-item{
    position:relative;height:44px;min-width:0;border:0;border-radius:13px;background:transparent;color:#64748b;
    display:flex;align-items:center;justify-content:center;cursor:pointer;-webkit-tap-highlight-color:transparent;
    transition:transform .16s ease,background .16s ease,color .16s ease;text-decoration:none;outline:none
  }
  #nlsMobileBottomNav .nls-bottom-item:active{transform:scale(.90)!important}
  #nlsMobileBottomNav .nls-bottom-item.active{color:#1877f2!important;background:#e7f0ff!important}
  #nlsMobileBottomNav .nls-bottom-item:focus-visible{box-shadow:0 0 0 2px rgba(24,119,242,.25)!important}
  #nlsMobileBottomNav .nls-bottom-item i{font-size:19px;line-height:1}
  #nlsMobileBottomNav .nls-bottom-badge{
    position:absolute;top:2px;right:calc(50% - 17px);min-width:16px;height:16px;padding:0 4px;border-radius:999px;
    background:#ef4444;color:#fff;border:2px solid #fff;font:700 8px/12px Inter,system-ui,sans-serif;text-align:center
  }

  /* Search opened from the bottom nav */
  .nls-mobile-search-panel.nls-mobile-search-open{
    display:block!important;visibility:visible!important;opacity:1!important;z-index:10020!important;
    pointer-events:auto!important;transform:translateY(0)!important;max-height:120px!important
  }

  /* Existing drawers must stay above the mobile navigation */
  .nls-drawer,.nls-drawer-overlay{z-index:10030!important}
  .nls-drawer{max-height:calc(100vh - 72px)!important}
  body.nls-cart-mobile-open [id*="cartDrawer"],
  body.nls-cart-mobile-open [class*="cart-drawer"],
  body.nls-cart-mobile-open [class*="cartDrawer"],
  body.nls-cart-mobile-open [class*="cart-sidebar"],
  body.nls-cart-mobile-open [class*="cartSidebar"]{
    z-index:10040!important;bottom:calc(72px + env(safe-area-inset-bottom))!important;max-height:calc(100vh - 80px)!important
  }
}
@media (min-width:768px){#nlsMobileBottomNav{display:none!important}}
      `;
      document.head.appendChild(style);
    }

    var nav = document.createElement("nav");
    nav.id = "nlsMobileBottomNav";
    nav.setAttribute("aria-label", "Mobile navigation");
    nav.innerHTML = `
<a class="nls-bottom-item" data-bottom-nav="home" href="/" aria-label="Home"><i class="fa-solid fa-house"></i></a>
<button class="nls-bottom-item" data-bottom-nav="categories" type="button" aria-label="Categories" aria-expanded="false"><i class="fa-solid fa-grid-2"></i></button>
<button class="nls-bottom-item" data-bottom-nav="search" type="button" aria-label="Search" aria-expanded="false"><i class="fa-solid fa-magnifying-glass"></i></button>
<button class="nls-bottom-item" data-bottom-nav="cart" type="button" aria-label="Cart" aria-expanded="false"><i class="fa-solid fa-basket-shopping-simple"></i><span class="nls-bottom-badge" id="nlsBottomCartCount" hidden>0</span></button>
<a class="nls-bottom-item" data-bottom-nav="account" href="/login.html?redirect=/" aria-label="Account"><i class="fa-solid fa-circle-user"></i></a>`;
    document.body.appendChild(nav);

    function getHeader() { return document.querySelector(".nls-header"); }
    function showNavigation() {
      var header = getHeader();
      if (header) header.classList.remove("nls-scroll-hidden");
      nav.classList.remove("nls-scroll-hidden");
    }

    function setActive(key) {
      nav.querySelectorAll(".nls-bottom-item").forEach(function (item) {
        var active = item.getAttribute("data-bottom-nav") === key;
        item.classList.toggle("active", active);
        if (active) item.setAttribute("aria-current", "page");
        else item.removeAttribute("aria-current");
      });
    }

    function isOpen(el) {
      if (!el) return false;
      var cs = window.getComputedStyle(el);
      return el.classList.contains("open") || el.classList.contains("active") ||
        el.getAttribute("aria-hidden") === "false" ||
        (cs.display !== "none" && cs.visibility !== "hidden" && cs.opacity !== "0");
    }

    function openSearch() {
      showNavigation();
      var panel = document.getElementById("mobileSearchPanel");
      var toggle = document.getElementById("mobileSearchToggle");
      if (toggle) toggle.click();
      if (panel) {
        panel.classList.add("nls-mobile-search-open");
        panel.setAttribute("aria-hidden", "false");
      }
      var input = document.getElementById("mobileSearchInput");
      if (input) setTimeout(function () { input.focus(); }, 40);
    }

    function findCartDrawer() {
      var selectors = [
        "#cartDrawer", "#cartSidebar", "#shoppingCartDrawer", "#shoppingCartSidebar",
        ".cart-drawer", ".cart-sidebar", ".nls-cart-drawer", ".nls-cart-sidebar",
        "[data-cart-drawer]", "[data-cart-sidebar]"
      ];
      for (var i = 0; i < selectors.length; i++) {
        var found = document.querySelector(selectors[i]);
        if (found) return found;
      }
      return null;
    }

    function normalizeCartDrawer() {
      var drawer = findCartDrawer();
      if (!drawer) return;
      drawer.style.zIndex = "10040";
      drawer.style.bottom = "calc(72px + env(safe-area-inset-bottom))";
      drawer.style.maxHeight = "calc(100vh - 80px)";
      drawer.style.overflowY = "auto";
      document.body.classList.add("nls-cart-mobile-open");
    }

    var home = nav.querySelector('[data-bottom-nav="home"]');
    var categories = nav.querySelector('[data-bottom-nav="categories"]');
    var search = nav.querySelector('[data-bottom-nav="search"]');
    var cart = nav.querySelector('[data-bottom-nav="cart"]');
    var account = nav.querySelector('[data-bottom-nav="account"]');
    var currentPath = window.location.pathname.replace(/\/+$/, "") || "/";
    if (currentPath === "/") setActive("home");

    home.addEventListener("click", function () { setActive("home"); });

    categories.addEventListener("click", function () {
      showNavigation();
      setActive("categories");
      var b = document.getElementById("mobileMenuBtn");
      if (b) {
        b.click();
        categories.setAttribute("aria-expanded", isOpen(document.getElementById("mobileDrawer")) ? "true" : "false");
      }
    });

    search.addEventListener("click", function () {
      setActive("search");
      search.setAttribute("aria-expanded", "true");
      openSearch();
    });

    cart.addEventListener("click", function () {
      showNavigation();
      setActive("cart");
      cart.setAttribute("aria-expanded", "true");
      var b = document.getElementById("cartBtn");
      if (b) b.click();
      setTimeout(normalizeCartDrawer, 0);
      setTimeout(normalizeCartDrawer, 80);
      setTimeout(normalizeCartDrawer, 250);
    });

    function syncAccountLink() {
      var user = document.getElementById("userAccountArea");
      var login = document.getElementById("loginLink");
      if (user && getComputedStyle(user).display !== "none") {
        account.href = user.getAttribute("href") || "/dashboard.html";
        account.setAttribute("aria-label", "Dashboard");
      } else if (login) {
        account.href = login.getAttribute("href") || "/login.html?redirect=/";
        account.setAttribute("aria-label", "Account");
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

    if (window.MutationObserver) {
      var cs = document.getElementById("cartCount");
      if (cs) new MutationObserver(syncCartBadge).observe(cs, {childList:true,characterData:true,subtree:true,attributes:true});
      var ua = document.getElementById("userAccountArea");
      if (ua) new MutationObserver(syncAccountLink).observe(ua, {attributes:true,attributeFilter:["style","class","href"]});
      var bodyObserver = new MutationObserver(function () {
        if (document.body.classList.contains("cart-open")) normalizeCartDrawer();
      });
      bodyObserver.observe(document.body, {attributes:true,attributeFilter:["class"],childList:true,subtree:true});
    }

    /* Keep drawers above the bottom navigation whenever they are opened. */
    document.addEventListener("click", function () {
      if (document.body.classList.contains("cart-open")) normalizeCartDrawer();
    }, true);

    var lastY = Math.max(0, window.scrollY || window.pageYOffset || 0);
    var ticking = false;
    var threshold = 12;
    function update() {
      var y = Math.max(0, window.scrollY || window.pageYOffset || 0);
      var delta = y - lastY;
      var header = getHeader();
      var drawer = document.getElementById("mobileDrawer");
      var overlay = document.getElementById("mobileMenuOverlay");
      var searchPanel = document.getElementById("mobileSearchPanel");
      if (y <= 10 || delta < -threshold) {
        if (header) header.classList.remove("nls-scroll-hidden");
        nav.classList.remove("nls-scroll-hidden");
      } else if (delta > threshold) {
        var menuOpen = drawer && isOpen(drawer);
        var overlayOpen = overlay && isOpen(overlay);
        var searchOpen = searchPanel && (searchPanel.classList.contains("nls-mobile-search-open") || isOpen(searchPanel));
        var cartOpen = document.body.classList.contains("cart-open");
        if (!menuOpen && !overlayOpen && !searchOpen && !cartOpen) {
          if (header) header.classList.add("nls-scroll-hidden");
          nav.classList.add("nls-scroll-hidden");
        }
      }
      lastY = y;
      ticking = false;
    }

    window.addEventListener("scroll", function () {
      if (!ticking) { requestAnimationFrame(update); ticking = true; }
    }, {passive:true});

    window.addEventListener("resize", function () {
      if (window.innerWidth >= 768) showNavigation();
      if (document.body.classList.contains("cart-open")) normalizeCartDrawer();
    }, {passive:true});

    return true;
  }

  function init() {
    fixProductionAssets();
    if (addMobileNavigation()) return;
    if (window.MutationObserver && document.documentElement) {
      var observer = new MutationObserver(function () {
        if (addMobileNavigation()) observer.disconnect();
      });
      observer.observe(document.documentElement, {childList:true,subtree:true});
      setTimeout(function () { observer.disconnect(); addMobileNavigation(); }, 5000);
    }
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, {once:true});
  else init();
})();
