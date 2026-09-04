"use strict";

/* Legacy compatibility shim + immediate, lightweight storefront mobile navigation. */
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

  function installNavigation() {
    if (!document.documentElement || document.getElementById("nlsMobileBottomNav")) return;

    var style = document.createElement("style");
    style.id = "nls-mobile-navigation-style";
    style.textContent = `
@media (max-width:767px){
  html{--nls-mobile-nav-h:54px}
  body{padding-top:54px!important;padding-bottom:calc(70px + env(safe-area-inset-bottom))!important}

  /* Compact Facebook-like top navigation. Search/cart intentionally removed on mobile. */
  .nls-header{position:fixed!important;top:0!important;left:0!important;right:0!important;width:100%!important;height:54px!important;z-index:10001!important;background:rgba(255,255,255,.98)!important;backdrop-filter:blur(14px) saturate(150%)!important;-webkit-backdrop-filter:blur(14px) saturate(150%)!important;transform:translate3d(0,0,0)!important;transition:transform .2s ease!important;will-change:transform}
  .nls-header.nls-scroll-hidden{transform:translate3d(0,-110%,0)!important}
  .nls-container,.nls-header.scrolled .nls-container{height:54px!important;min-height:54px!important;padding:0 8px!important;gap:0!important}
  .nls-left{flex:1 1 auto!important;min-width:0!important;gap:0!important}
  .nls-nav{display:none!important}
  .nls-hamburger{display:flex!important;flex:0 0 40px!important;width:40px!important;height:40px!important;align-items:center!important;justify-content:center!important;margin:0!important}
  .nls-hamburger span{left:8px!important}
  .nls-logo-link{position:absolute!important;left:50%!important;top:50%!important;transform:translate(-50%,-50%)!important;gap:0!important;max-width:38vw!important}
  .nls-logo-img,.nls-header.scrolled .nls-logo-img{height:34px!important;width:auto!important;max-width:38vw!important}
  .nls-logo-text-container{display:none!important}
  .nls-right{margin-left:auto!important;gap:0!important;height:54px!important}
  .nls-search-desktop,#mobileSearchToggle,#cartBtn{display:none!important}
  #loginLink,.nls-user-link{display:inline-flex!important;align-items:center!important;justify-content:center!important;width:40px!important;height:40px!important;padding:0!important;border:0!important;border-radius:50%!important;background:transparent!important;color:#334155!important}
  #loginLink .nls-auth-text,.nls-user-link .nls-auth-text{display:none!important}

  /* Existing drawers always sit above both mobile bars. */
  .nls-drawer{z-index:10004!important}
  .nls-drawer-overlay{z-index:10003!important}
  .nls-mobile-search-panel{z-index:10005!important}

  #nlsMobileBottomNav{position:fixed!important;left:8px!important;right:8px!important;bottom:max(8px,env(safe-area-inset-bottom))!important;height:54px!important;min-height:54px!important;padding:4px 5px!important;display:grid!important;grid-template-columns:repeat(5,minmax(0,1fr))!important;gap:2px!important;align-items:stretch!important;visibility:visible!important;opacity:1!important;background:rgba(255,255,255,.98)!important;border:1px solid rgba(226,232,240,.95)!important;border-radius:17px!important;box-shadow:0 8px 24px rgba(15,23,42,.16),0 1px 5px rgba(15,23,42,.08)!important;z-index:10000!important;backdrop-filter:blur(14px) saturate(150%)!important;-webkit-backdrop-filter:blur(14px) saturate(150%)!important;transform:translate3d(0,0,0)!important;transition:transform .2s ease,opacity .15s ease!important;will-change:transform,opacity;pointer-events:auto}
  #nlsMobileBottomNav.nls-scroll-hidden{transform:translate3d(0,calc(100% + 20px),0)!important;opacity:0!important;pointer-events:none!important}
  #nlsMobileBottomNav .nls-bottom-item{position:relative;height:44px;min-width:0;margin:0;border:0;border-radius:12px;background:transparent;color:#64748b;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px;cursor:pointer;text-decoration:none;-webkit-tap-highlight-color:transparent;transition:background .12s ease,color .12s ease,transform .12s ease}
  #nlsMobileBottomNav .nls-bottom-item i{font-size:17px;line-height:17px;height:17px}
  #nlsMobileBottomNav .nls-bottom-label{font:600 8.5px/10px Inter,system-ui,sans-serif;white-space:nowrap;letter-spacing:-.05px}
  #nlsMobileBottomNav .nls-bottom-item.active{color:#2563eb;background:#eaf1ff}
  #nlsMobileBottomNav .nls-bottom-item:active{transform:scale(.94);background:#eaf1ff}
  #nlsMobileBottomNav .nls-bottom-badge{position:absolute;top:3px;right:calc(50% - 18px);min-width:16px;height:16px;padding:0 3px;border-radius:999px;background:#ef4444;color:#fff;border:2px solid #fff;font:700 8px/12px Inter,system-ui,sans-serif;text-align:center}
}
@media (min-width:768px){#nlsMobileBottomNav{display:none!important}}
`;
    document.documentElement.appendChild(style);

    var nav = document.createElement("nav");
    nav.id = "nlsMobileBottomNav";
    nav.setAttribute("aria-label", "Mobile navigation");
    nav.innerHTML = `
      <a class="nls-bottom-item" data-bottom-nav="home" href="/" aria-label="Home"><i class="fa-solid fa-house"></i><span class="nls-bottom-label">Home</span></a>
      <button class="nls-bottom-item" data-bottom-nav="categories" type="button" aria-label="Categories"><i class="fa-solid fa-grid-2"></i><span class="nls-bottom-label">Categories</span></button>
      <button class="nls-bottom-item" data-bottom-nav="offers" type="button" aria-label="Offers"><i class="fa-solid fa-tags"></i><span class="nls-bottom-label">Offers</span></button>
      <a class="nls-bottom-item" data-bottom-nav="whatsapp" href="https://wa.me/8801644490566" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp"><i class="fa-brands fa-whatsapp"></i><span class="nls-bottom-label">WhatsApp</span></a>
      <a class="nls-bottom-item" data-bottom-nav="account" href="/login.html?redirect=/" aria-label="Account"><i class="fa-solid fa-circle-user"></i><span class="nls-bottom-label">Account</span></a>`;

    /* Append directly to <html>, not after DOMContentLoaded/body, so there is no navigation flash. */
    document.documentElement.appendChild(nav);

    var items = Array.prototype.slice.call(nav.querySelectorAll("[data-bottom-nav]"));
    var home = nav.querySelector('[data-bottom-nav="home"]');
    var categories = nav.querySelector('[data-bottom-nav="categories"]');
    var offers = nav.querySelector('[data-bottom-nav="offers"]');
    var account = nav.querySelector('[data-bottom-nav="account"]');

    function setActive(key) {
      items.forEach(function (item) {
        var active = item.getAttribute("data-bottom-nav") === key;
        item.classList.toggle("active", active);
        if (active) item.setAttribute("aria-current", "page");
        else item.removeAttribute("aria-current");
      });
    }

    var path = window.location.pathname.replace(/\/+$/, "") || "/";
    setActive(path === "/" ? "home" : "");

    /* Use the existing category button, but never dispatch synthetic events from the nav itself. */
    categories.addEventListener("click", function (event) {
      event.preventDefault();
      setActive("categories");
      var button = document.getElementById("mobileMenuBtn");
      if (button) button.click();
    });

    /* Offers: use an existing offers section when present; otherwise return to the storefront. */
    offers.addEventListener("click", function (event) {
      event.preventDefault();
      setActive("offers");
      var target = document.querySelector("#offers,#offer,#specialOffers,[data-offers]");
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      } else if (path !== "/") {
        window.location.href = "/#offers";
      } else {
        var hashTarget = document.getElementById("offers");
        if (hashTarget) hashTarget.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });

    /* Account link is kept live with the existing auth navbar. */
    function syncAccount() {
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
    syncAccount();

    if (window.MutationObserver) {
      var observer = new MutationObserver(syncAccount);
      observer.observe(document.documentElement, { childList: true, subtree: true, attributes: true, attributeFilter: ["style", "href", "class"] });
    }

    /* Delegated visual state keeps taps immediate and does not interfere with page navigation. */
    nav.addEventListener("click", function (event) {
      var item = event.target.closest ? event.target.closest("[data-bottom-nav]") : null;
      if (!item) return;
      var key = item.getAttribute("data-bottom-nav");
      if (key === "whatsapp" || key === "home" || key === "account") setActive(key);
    }, false);

    var lastY = window.scrollY || 0;
    var ticking = false;
    var threshold = 14;

    function showBars() {
      var header = document.querySelector(".nls-header");
      if (header) header.classList.remove("nls-scroll-hidden");
      nav.classList.remove("nls-scroll-hidden");
    }

    function scrollUpdate() {
      var y = Math.max(0, window.scrollY || window.pageYOffset || 0);
      var delta = y - lastY;
      var header = document.querySelector(".nls-header");
      var drawer = document.getElementById("mobileDrawer");
      var overlay = document.getElementById("mobileMenuOverlay");
      var searchPanel = document.getElementById("mobileSearchPanel");
      var drawerOpen = function (el) { return !!el && (el.classList.contains("open") || el.classList.contains("active")); };

      if (y <= 8 || delta < -threshold) {
        if (header) header.classList.remove("nls-scroll-hidden");
        nav.classList.remove("nls-scroll-hidden");
      } else if (delta > threshold && !drawerOpen(drawer) && !drawerOpen(overlay) && !drawerOpen(searchPanel)) {
        if (header) header.classList.add("nls-scroll-hidden");
        nav.classList.add("nls-scroll-hidden");
      }
      lastY = y;
      ticking = false;
    }

    window.addEventListener("scroll", function () {
      if (!ticking) {
        window.requestAnimationFrame(scrollUpdate);
        ticking = true;
      }
    }, { passive: true });

    window.addEventListener("resize", function () {
      if (window.innerWidth >= 768) showBars();
    }, { passive: true });
  }

  function init() {
    fixProductionAssets();
    installNavigation();
  }

  /* Run immediately whenever possible; this eliminates the previous DOMContentLoaded navigation flash. */
  if (document.readyState === "loading") {
    init();
    document.addEventListener("DOMContentLoaded", fixProductionAssets, { once: true });
  } else {
    init();
  }
})();
