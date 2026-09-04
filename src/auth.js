"use strict";

/* Universal storefront navigation / legacy auth compatibility shim. */
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

  function installDashboardHeader() {
    if (document.getElementById("nlsHeader")) return;
    if (!document.body) return;

    var header = document.createElement("header");
    header.className = "nls-header nls-universal-header";
    header.id = "nlsHeader";
    header.innerHTML = `
      <div class="nls-container">
        <div class="nls-left">
          <button class="nls-hamburger" id="mobileMenuBtn" type="button" aria-label="Open Menu"><span></span><span></span><span></span></button>
          <a href="/" class="nls-logo-link" aria-label="Next Level Subs home">
            <img src="/images/next_level.png" alt="Next Level Subs Logo" class="nls-logo-img">
            <div class="nls-logo-text-container">
              <div class="nls-logo-text-item">Trusted</div><div class="nls-logo-text-item">Cheap</div>
              <div class="nls-logo-text-item">Secure</div><div class="nls-logo-text-item">24/7 Support</div>
            </div>
          </a>
          <nav class="nls-nav" aria-label="Main navigation"></nav>
        </div>
        <div class="nls-right">
          <button class="nls-icon-btn" id="mobileSearchToggle" type="button" aria-label="Search"><i class="fas fa-search"></i></button>
          <a id="userAccountArea" class="nls-account-link nls-user-link" href="/dashboard.html" aria-label="Open dashboard"><i class="fa-solid fa-circle-user nls-account-icon"></i><span class="nls-auth-text">Account</span></a>
          <button id="cartBtn" class="nls-cart-btn" type="button" aria-label="Shopping cart"><i class="fa-solid fa-basket-shopping-simple"></i><span class="nls-cart-text">Cart</span><span id="cartCount" class="cart-badge">0</span></button>
        </div>
      </div>`;
    document.body.insertBefore(header, document.body.firstChild);

    var drawer = document.createElement("aside");
    drawer.className = "nls-drawer";
    drawer.id = "mobileDrawer";
    drawer.innerHTML = `
      <div class="nls-drawer-header">
        <a href="/" class="nls-drawer-logo"><img src="/images/next_level.png" alt="Logo" class="nls-logo-img"></a>
        <button id="closeDrawerBtn" class="nls-drawer-close" type="button" aria-label="Close Menu"><i class="fas fa-times"></i></button>
      </div>
      <nav class="nls-drawer-nav" id="navMenuMobile">
        <a href="/best-selling" class="nls-drawer-link" data-section="best-selling"><i class="fa-solid fa-crown"></i> Best Sellers</a>
        <a href="/streaming" class="nls-drawer-link" data-section="streaming"><i class="fa-solid fa-fire"></i> Streaming</a>
        <a href="/music" class="nls-drawer-link" data-section="music"><i class="fa-solid fa-music"></i> Music</a>
        <a href="/storage" class="nls-drawer-link" data-section="storage"><i class="fa-solid fa-cloud"></i> Cloud Storage</a>
        <a href="/vpn" class="nls-drawer-link" data-section="vpn"><i class="fa-solid fa-shield-halved"></i> VPN</a>
        <a href="/aiDesign" class="nls-drawer-link" data-section="aiDesign"><i class="fa-solid fa-robot"></i> AI &amp; Design</a>
        <a href="/combos" class="nls-drawer-link" data-section="combos"><i class="fa-solid fa-layer-group"></i> Combos</a>
        <a href="/education" class="nls-drawer-link" data-section="education"><i class="fa-solid fa-graduation-cap"></i> Education</a>
        <a href="/adult" class="nls-drawer-link nls-adult" data-section="adult"><i class="fa-solid fa-fire"></i> Adult 18+</a>
      </nav>`;
    document.body.insertBefore(drawer, header.nextSibling);

    var overlay = document.createElement("div");
    overlay.className = "nls-drawer-overlay";
    overlay.id = "mobileMenuOverlay";
    document.body.insertBefore(overlay, drawer);

    var searchPanel = document.createElement("div");
    searchPanel.className = "nls-mobile-search-panel";
    searchPanel.id = "mobileSearchPanel";
    searchPanel.innerHTML = `<div class="nls-mobile-search-box" id="mobileSearchWrapper"><input type="text" id="mobileSearchInput" placeholder="Search subscriptions..." aria-label="Mobile Search"><button class="nls-search-btn" type="button" aria-label="Search"><i class="fas fa-search"></i></button></div>`;
    header.appendChild(searchPanel);

    var oldHeader = document.querySelector(".dashboard-header");
    if (oldHeader) oldHeader.classList.add("nls-dashboard-header-desktop-only");
  }

  function installNavigation() {
    if (!document.documentElement || document.getElementById("nlsMobileBottomNav")) return;

    /* Keep all navigation motion on the compositor: transform/opacity only, no layout animation. */
    var style = document.createElement("style");
    style.id = "nls-mobile-navigation-style";
    style.textContent = `
@media (max-width:767px){
  :root{--nls-nav-ease:cubic-bezier(.22,1,.36,1)}
  body{padding-top:54px!important;padding-bottom:calc(70px + env(safe-area-inset-bottom))!important}
  .nls-dashboard-header-desktop-only{display:none!important}
  .nls-header{position:fixed!important;top:0!important;left:0!important;right:0!important;width:100%!important;height:54px!important;z-index:10001!important;background:rgba(255,255,255,.97)!important;backdrop-filter:blur(18px) saturate(160%)!important;-webkit-backdrop-filter:blur(18px) saturate(160%)!important;transform:translate3d(0,0,0)!important;transition:transform .36s var(--nls-nav-ease)!important;will-change:transform;contain:layout paint}
  .nls-header.nls-scroll-hidden{transform:translate3d(0,-110%,0)!important}
  .nls-container,.nls-header.scrolled .nls-container{height:54px!important;min-height:54px!important;padding:0 8px!important;gap:0!important;transition:none!important}
  .nls-left{flex:1 1 auto!important;min-width:0!important;gap:0!important}.nls-nav{display:none!important}
  .nls-hamburger{display:flex!important;flex:0 0 40px!important;width:40px!important;height:40px!important;align-items:center!important;justify-content:center!important;margin:0!important;transition:transform .28s var(--nls-nav-ease)!important}.nls-hamburger span{left:8px!important}
  .nls-logo-link{position:absolute!important;left:50%!important;top:50%!important;transform:translate(-50%,-50%)!important;gap:0!important;max-width:38vw!important}
  .nls-logo-img,.nls-header.scrolled .nls-logo-img{height:34px!important;width:auto!important;max-width:38vw!important}.nls-logo-text-container{display:none!important}
  .nls-right{margin-left:auto!important;gap:2px!important;height:54px!important}.nls-search-desktop{display:none!important}
  #mobileSearchToggle,#cartBtn{display:inline-flex!important;align-items:center!important;justify-content:center!important;width:40px!important;height:40px!important;padding:0!important;border:0!important;border-radius:50%!important;background:transparent!important;color:#334155!important;position:relative!important;transition:transform .18s var(--nls-nav-ease),background .18s ease!important}
  #mobileSearchToggle:active,#cartBtn:active{transform:scale(.92)!important;background:#f1f5f9!important}
  #mobileSearchToggle i,#cartBtn i{font-size:18px!important}#loginLink,.nls-user-link{display:none!important}.nls-cart-text,.nls-auth-text,.nls-account-link{display:none!important}
  #cartBtn .cart-badge{top:0!important;right:-1px!important}
  .nls-drawer{z-index:10004!important}.nls-drawer-overlay{z-index:10003!important}.nls-mobile-search-panel{z-index:10005!important}
  .nls-mobile-search-panel{top:54px!important;transform:translate3d(0,-12px,0)!important;transition:transform .28s var(--nls-nav-ease),opacity .2s ease!important}
  .nls-mobile-search-panel.active{transform:translate3d(0,0,0)!important}
  /* Cart always sits above both navigation bars and overlays. */
  #cartOverlay,.cart-overlay{z-index:10020!important}
  #cartSidebar,.cart-sidebar{z-index:10021!important}
  #cartSidebar{bottom:0!important}
  #nlsMobileBottomNav{position:fixed!important;left:8px!important;right:8px!important;bottom:max(8px,env(safe-area-inset-bottom))!important;height:54px!important;min-height:54px!important;padding:4px 5px!important;display:grid!important;grid-template-columns:repeat(5,minmax(0,1fr))!important;gap:2px!important;align-items:stretch!important;visibility:visible!important;opacity:1!important;background:rgba(255,255,255,.97)!important;border:1px solid rgba(226,232,240,.95)!important;border-radius:17px!important;box-shadow:0 8px 24px rgba(15,23,42,.16),0 1px 5px rgba(15,23,42,.08)!important;z-index:10000!important;backdrop-filter:blur(18px) saturate(160%)!important;-webkit-backdrop-filter:blur(18px) saturate(160%)!important;transform:translate3d(0,0,0)!important;transition:transform .38s var(--nls-nav-ease)!important;will-change:transform;contain:layout paint}
  #nlsMobileBottomNav.nls-scroll-hidden{transform:translate3d(0,calc(100% + 20px),0)!important;opacity:1!important;pointer-events:none!important}
  #nlsMobileBottomNav .nls-bottom-item{position:relative;height:44px;min-width:0;margin:0;border:0;border-radius:12px;background:transparent;color:#64748b;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px;cursor:pointer;text-decoration:none;-webkit-tap-highlight-color:transparent;transition:background .16s ease,color .16s ease,transform .18s var(--nls-nav-ease)}
  #nlsMobileBottomNav .nls-bottom-item i{font-size:17px;line-height:17px;height:17px}.nls-bottom-label{font:600 8.5px/10px Inter,system-ui,sans-serif;white-space:nowrap;letter-spacing:-.05px}
  #nlsMobileBottomNav .nls-bottom-item.active{color:#2563eb;background:#eaf1ff}#nlsMobileBottomNav .nls-bottom-item:active{transform:scale(.94);background:#eaf1ff}
}
@media (min-width:768px){#nlsMobileBottomNav{display:none!important}.nls-universal-header{display:none!important}}
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
        if (active) item.setAttribute("aria-current", "page"); else item.removeAttribute("aria-current");
      });
    }

    var path = window.location.pathname.replace(/\/+$/, "") || "/";
    setActive(path === "/" ? "home" : path === "/dashboard.html" ? "account" : "");

    function openCategories() {
      var button = document.getElementById("mobileMenuBtn");
      if (button) { button.click(); return; }
      var drawer = document.getElementById("mobileDrawer");
      var overlay = document.getElementById("mobileMenuOverlay");
      if (drawer) drawer.classList.add("active");
      if (overlay) overlay.classList.add("active");
    }

    categories.addEventListener("click", function (event) {
      event.preventDefault();
      setActive("categories");
      openCategories();
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
      } else if (path === "/dashboard.html") {
        account.href = "/dashboard.html";
        account.setAttribute("aria-label", "Dashboard");
      }
    }

    account.addEventListener("click", function () { syncAccount(); setActive("account"); });
    window.addEventListener("nextlevelauthchange", syncAccount);
    document.addEventListener("DOMContentLoaded", syncAccount, { once: true });
    syncAccount();

    var lastY = window.scrollY || 0;
    var direction = 0;
    var accumulated = 0;
    var ticking = false;
    var hideDistance = 34;
    var showDistance = 16;

    function setBars(hidden) {
      var header = document.querySelector(".nls-header");
      if (header) header.classList.toggle("nls-scroll-hidden", hidden);
      nav.classList.toggle("nls-scroll-hidden", hidden);
    }

    function scrollUpdate() {
      var y = Math.max(0, window.scrollY || window.pageYOffset || 0);
      var delta = y - lastY;
      var header = document.querySelector(".nls-header");
      var drawer = document.getElementById("mobileDrawer");
      var overlay = document.getElementById("mobileMenuOverlay");
      var searchPanel = document.getElementById("mobileSearchPanel");
      var open = function (el) { return !!el && (el.classList.contains("open") || el.classList.contains("active")); };
      var blocked = open(drawer) || open(overlay) || open(searchPanel);

      if (y <= 8 || blocked) {
        setBars(false);
        direction = 0;
        accumulated = 0;
      } else if (Math.abs(delta) >= 2) {
        var nextDirection = delta > 0 ? 1 : -1;
        if (nextDirection !== direction) { direction = nextDirection; accumulated = 0; }
        accumulated += Math.abs(delta);
        if (direction > 0 && accumulated >= hideDistance) { setBars(true); accumulated = 0; }
        else if (direction < 0 && accumulated >= showDistance) { setBars(false); accumulated = 0; }
      }
      lastY = y;
      ticking = false;
    }

    window.addEventListener("scroll", function () {
      if (!ticking) { window.requestAnimationFrame(scrollUpdate); ticking = true; }
    }, { passive: true });

    window.addEventListener("resize", function () {
      lastY = window.scrollY || 0; direction = 0; accumulated = 0;
      if (window.innerWidth >= 768) setBars(false);
    }, { passive: true });
  }

  function improveAOS() {
    /* Do not create a second AOS instance. If a page initializes AOS, force the smooth settings once. */
    if (typeof window === "undefined" || typeof window.AOS === "undefined" || !window.AOS.init) return;
    var originalInit = window.AOS.init;
    if (originalInit.__nlsWrapped) return;
    var wrapped = function (options) {
      options = options || {};
      options.duration = Math.max(500, Math.min(Number(options.duration) || 600, 700));
      options.easing = "ease-out-cubic";
      options.once = true;
      options.offset = Number.isFinite(Number(options.offset)) ? Number(options.offset) : 50;
      options.delay = 0;
      options.disableMutationObserver = true;
      return originalInit.call(window.AOS, options);
    };
    wrapped.__nlsWrapped = true;
    window.AOS.init = wrapped;
  }

  fixProductionAssets();
  installDashboardHeader();
  installNavigation();
  improveAOS();
})();
