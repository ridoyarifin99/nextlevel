"use strict";

/* Legacy compatibility shim + lightweight storefront mobile navigation. */
(function () {
  if (typeof window !== "undefined") {
    var apiBase = window.AUTH_API_BASE;
    if (typeof apiBase === "string" && /^(https?:\/\/)?(localhost|127\.0\.0\.1)(:\d+)?/i.test(apiBase)) {
      try { delete window.AUTH_API_BASE; } catch (_) { window.AUTH_API_BASE = ""; }
    }
  }

  function fixProductionAssets() {
    var icon = document.querySelector('link[rel="icon"], link[rel="shortcut icon"]');
    if (icon) { icon.href = "/images/next_level.png"; icon.type = "image/png"; }
  }

  function installNavigation() {
    if (!document.documentElement || document.getElementById("nlsMobileBottomNav")) return;

    var style = document.createElement("style");
    style.id = "nls-mobile-navigation-style";
    style.textContent = `
@media (max-width:767px){
  body{padding-top:54px!important;padding-bottom:calc(70px + env(safe-area-inset-bottom))!important}
  .nls-header{position:fixed!important;top:0!important;left:0!important;right:0!important;width:100%!important;height:54px!important;z-index:10001!important;background:rgba(255,255,255,.98)!important;backdrop-filter:blur(14px) saturate(150%)!important;-webkit-backdrop-filter:blur(14px) saturate(150%)!important;transform:translate3d(0,0,0)!important;transition:transform .22s cubic-bezier(.16,1,.3,1)!important;will-change:transform}
  .nls-header.nls-scroll-hidden{transform:translate3d(0,-110%,0)!important}
  .nls-container,.nls-header.scrolled .nls-container{height:54px!important;min-height:54px!important;padding:0 8px!important;gap:0!important}
  .nls-left{flex:1 1 auto!important;min-width:0!important;gap:0!important}.nls-nav{display:none!important}
  .nls-hamburger{display:flex!important;flex:0 0 40px!important;width:40px!important;height:40px!important;align-items:center!important;justify-content:center!important;margin:0!important}.nls-hamburger span{left:8px!important}
  .nls-logo-link{position:absolute!important;left:50%!important;top:50%!important;transform:translate(-50%,-50%)!important;gap:0!important;max-width:38vw!important}
  .nls-logo-img,.nls-header.scrolled .nls-logo-img{height:34px!important;width:auto!important;max-width:38vw!important}.nls-logo-text-container{display:none!important}
  .nls-right{margin-left:auto!important;gap:2px!important;height:54px!important}.nls-search-desktop{display:none!important}
  #mobileSearchToggle,#cartBtn{display:inline-flex!important;align-items:center!important;justify-content:center!important;width:40px!important;height:40px!important;padding:0!important;border:0!important;border-radius:50%!important;background:transparent!important;color:#334155!important;position:relative!important}
  #mobileSearchToggle i,#cartBtn i{font-size:18px!important}#loginLink,.nls-user-link{display:none!important}.nls-cart-text,.nls-auth-text,.nls-account-link{display:none!important}
  #cartBtn .cart-badge{top:0!important;right:-1px!important}.nls-drawer{z-index:10004!important}.nls-drawer-overlay{z-index:10003!important}.nls-mobile-search-panel{z-index:10005!important}
  #nlsMobileBottomNav{position:fixed!important;left:8px!important;right:8px!important;bottom:max(8px,env(safe-area-inset-bottom))!important;height:54px!important;min-height:54px!important;padding:4px 5px!important;display:grid!important;grid-template-columns:repeat(5,minmax(0,1fr))!important;gap:2px!important;align-items:stretch!important;visibility:visible!important;opacity:1!important;background:rgba(255,255,255,.98)!important;border:1px solid rgba(226,232,240,.95)!important;border-radius:17px!important;box-shadow:0 8px 24px rgba(15,23,42,.16),0 1px 5px rgba(15,23,42,.08)!important;z-index:10000!important;backdrop-filter:blur(14px) saturate(150%)!important;-webkit-backdrop-filter:blur(14px) saturate(150%)!important;transform:translate3d(0,0,0)!important;transition:transform .22s cubic-bezier(.16,1,.3,1),opacity .18s ease!important;will-change:transform,opacity;pointer-events:auto}
  #nlsMobileBottomNav.nls-scroll-hidden{transform:translate3d(0,calc(100% + 20px),0)!important;opacity:0!important;pointer-events:none!important}
  #nlsMobileBottomNav .nls-bottom-item{position:relative;height:44px;min-width:0;margin:0;border:0;border-radius:12px;background:transparent;color:#64748b;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px;cursor:pointer;text-decoration:none;-webkit-tap-highlight-color:transparent;transition:background .12s ease,color .12s ease,transform .12s ease}
  #nlsMobileBottomNav .nls-bottom-item i{font-size:17px;line-height:17px;height:17px}.nls-bottom-label{font:600 8.5px/10px Inter,system-ui,sans-serif;white-space:nowrap;letter-spacing:-.05px}
  #nlsMobileBottomNav .nls-bottom-item.active{color:#2563eb;background:#eaf1ff}#nlsMobileBottomNav .nls-bottom-item:active{transform:scale(.96);background:#eaf1ff}
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
    document.documentElement.appendChild(nav);

    var items = Array.prototype.slice.call(nav.querySelectorAll("[data-bottom-nav]"));
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

    categories.addEventListener("click", function (event) {
      event.preventDefault();
      setActive("categories");
      var button = document.getElementById("mobileMenuBtn");
      if (button) button.click();
    });

    offers.addEventListener("click", function (event) {
      event.preventDefault();
      setActive("offers");
      var target = document.querySelector("#offers,#offer,#specialOffers,[data-offers]");
      if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
      else if (path !== "/") window.location.href = "/#offers";
    });

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

    account.addEventListener("click", function () {
      syncAccount();
      setActive("account");
    });
    window.addEventListener("nextlevelauthchange", syncAccount);
    document.addEventListener("DOMContentLoaded", syncAccount, { once: true });
    syncAccount();

    /* Direction-aware navigation: small scroll noise is ignored so the bars do not flicker. */
    var lastY = window.scrollY || 0;
    var direction = 0;
    var accumulated = 0;
    var ticking = false;
    var hideDistance = 28;
    var showDistance = 14;

    function scrollUpdate() {
      var y = Math.max(0, window.scrollY || window.pageYOffset || 0);
      var delta = y - lastY;
      var header = document.querySelector(".nls-header");
      var drawer = document.getElementById("mobileDrawer");
      var overlay = document.getElementById("mobileMenuOverlay");
      var searchPanel = document.getElementById("mobileSearchPanel");
      var open = function (el) { return !!el && (el.classList.contains("open") || el.classList.contains("active")); };
      var blocked = open(drawer) || open(overlay) || open(searchPanel);

      if (y <= 8) {
        if (header) header.classList.remove("nls-scroll-hidden");
        nav.classList.remove("nls-scroll-hidden");
        direction = 0;
        accumulated = 0;
      } else if (!blocked && Math.abs(delta) >= 2) {
        var nextDirection = delta > 0 ? 1 : -1;
        if (nextDirection !== direction) {
          direction = nextDirection;
          accumulated = 0;
        }
        accumulated += Math.abs(delta);
        if (direction > 0 && accumulated >= hideDistance) {
          if (header) header.classList.add("nls-scroll-hidden");
          nav.classList.add("nls-scroll-hidden");
          accumulated = 0;
        } else if (direction < 0 && accumulated >= showDistance) {
          if (header) header.classList.remove("nls-scroll-hidden");
          nav.classList.remove("nls-scroll-hidden");
          accumulated = 0;
        }
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
      lastY = window.scrollY || 0;
      direction = 0;
      accumulated = 0;
      if (window.innerWidth >= 768) {
        var header = document.querySelector(".nls-header");
        if (header) header.classList.remove("nls-scroll-hidden");
        nav.classList.remove("nls-scroll-hidden");
      }
    }, { passive: true });
  }

  fixProductionAssets();
  installNavigation();
})();
