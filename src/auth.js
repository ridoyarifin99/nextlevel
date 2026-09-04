"use strict";

/* Legacy compatibility shim + reliable storefront mobile navigation. */
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
body{padding-top:58px!important;padding-bottom:calc(82px + env(safe-area-inset-bottom))!important}
.nls-header{position:fixed!important;top:0!important;left:0!important;right:0!important;width:100%!important;z-index:10001!important;background:rgba(255,255,255,.96)!important;backdrop-filter:blur(18px) saturate(160%)!important;-webkit-backdrop-filter:blur(18px) saturate(160%)!important;transform:translate3d(0,0,0)!important;transition:transform .28s cubic-bezier(.16,1,.3,1)!important;will-change:transform}
.nls-header.nls-scroll-hidden{transform:translate3d(0,-105%,0)!important}
.nls-container,.nls-header.scrolled .nls-container{height:58px!important;min-height:58px!important;padding:0 10px!important;gap:0!important}
.nls-left{flex:1 1 auto!important;min-width:0!important;gap:0!important}.nls-nav{display:none!important}
.nls-hamburger{display:flex!important;flex:0 0 42px!important;width:42px!important;height:42px!important;align-items:center!important;justify-content:center!important;margin:0!important}
.nls-hamburger span{left:9px!important}
.nls-logo-link{position:absolute!important;left:50%!important;top:50%!important;transform:translate(-50%,-50%)!important;gap:0!important;max-width:42vw!important}
.nls-logo-img,.nls-header.scrolled .nls-logo-img{height:36px!important;width:auto!important;max-width:42vw!important}.nls-logo-text-container{display:none!important}
.nls-right{margin-left:auto!important;gap:2px!important;height:58px!important}.nls-search-desktop{display:none!important}
.nls-icon-btn,.nls-cart-btn{display:inline-flex!important;align-items:center!important;justify-content:center!important;width:42px!important;height:42px!important;padding:0!important;border:0!important;border-radius:50%!important;background:transparent!important;color:#334155!important;position:relative!important}
.nls-icon-btn i,.nls-cart-btn i{font-size:19px!important}.nls-cart-text,.nls-auth-text,.nls-account-link{display:none!important}.nls-cart-btn .cart-badge{top:1px!important;right:0!important}
.nls-mobile-search-panel{z-index:10002!important}
#nlsMobileBottomNav{position:fixed!important;left:10px!important;right:10px!important;bottom:max(10px,env(safe-area-inset-bottom))!important;height:64px!important;min-height:64px!important;padding:6px 7px!important;display:grid!important;visibility:visible!important;opacity:1!important;grid-template-columns:repeat(5,1fr)!important;align-items:center!important;gap:3px!important;background:rgba(255,255,255,.97)!important;border:1px solid rgba(226,232,240,.9)!important;border-radius:21px!important;box-shadow:0 12px 35px rgba(15,23,42,.18),0 2px 8px rgba(15,23,42,.08)!important;z-index:10000!important;backdrop-filter:blur(18px) saturate(170%)!important;-webkit-backdrop-filter:blur(18px) saturate(170%)!important;transform:translate3d(0,0,0)!important;transition:transform .28s cubic-bezier(.16,1,.3,1),opacity .22s ease!important;will-change:transform;pointer-events:auto}
#nlsMobileBottomNav.nls-scroll-hidden{transform:translate3d(0,calc(100% + 24px),0)!important;opacity:0!important;pointer-events:none!important}
#nlsMobileBottomNav .nls-bottom-item{position:relative;height:52px;min-width:0;border:0;border-radius:16px;background:transparent;color:#64748b;display:flex;align-items:center;justify-content:center;cursor:pointer;-webkit-tap-highlight-color:transparent;transition:transform .18s ease,background .18s ease,color .18s ease;text-decoration:none}
#nlsMobileBottomNav .nls-bottom-item:active{transform:scale(.92)}#nlsMobileBottomNav .nls-bottom-item.active{color:#2563eb;background:#e8f0ff}
#nlsMobileBottomNav .nls-bottom-item i{font-size:21px;line-height:1}
#nlsMobileBottomNav .nls-bottom-badge{position:absolute;top:6px;right:calc(50% - 17px);min-width:17px;height:17px;padding:0 4px;border-radius:999px;background:#ef4444;color:#fff;border:2px solid #fff;font:700 9px/13px Inter,system-ui,sans-serif;text-align:center}
.nls-drawer{z-index:10003!important}.nls-drawer-overlay{z-index:10002!important}
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
<button class="nls-bottom-item" data-bottom-nav="categories" type="button" aria-label="Categories"><i class="fa-solid fa-grid-2"></i></button>
<button class="nls-bottom-item" data-bottom-nav="search" type="button" aria-label="Search"><i class="fa-solid fa-magnifying-glass"></i></button>
<button class="nls-bottom-item" data-bottom-nav="cart" type="button" aria-label="Cart"><i class="fa-solid fa-basket-shopping-simple"></i><span class="nls-bottom-badge" id="nlsBottomCartCount" hidden>0</span></button>
<a class="nls-bottom-item" data-bottom-nav="account" href="/login.html?redirect=/" aria-label="Account"><i class="fa-solid fa-circle-user"></i></a>`;
    document.body.appendChild(nav);

    function getHeader() { return document.querySelector(".nls-header"); }
    function showNavigation() {
      var header = getHeader();
      if (header) header.classList.remove("nls-scroll-hidden");
      nav.classList.remove("nls-scroll-hidden");
    }

    var home = nav.querySelector('[data-bottom-nav="home"]');
    var categories = nav.querySelector('[data-bottom-nav="categories"]');
    var search = nav.querySelector('[data-bottom-nav="search"]');
    var cart = nav.querySelector('[data-bottom-nav="cart"]');
    var account = nav.querySelector('[data-bottom-nav="account"]');
    var currentPath = window.location.pathname.replace(/\/+$/, "") || "/";
    if (currentPath === "/") home.classList.add("active");

    categories.addEventListener("click", function () { showNavigation(); var b=document.getElementById("mobileMenuBtn"); if(b)b.click(); });
    search.addEventListener("click", function () { showNavigation(); var b=document.getElementById("mobileSearchToggle"); if(b)b.click(); else {var i=document.getElementById("mobileSearchInput");if(i)i.focus();} });
    cart.addEventListener("click", function () { showNavigation(); var b=document.getElementById("cartBtn"); if(b)b.click(); });

    function syncAccountLink() {
      var user = document.getElementById("userAccountArea");
      var login = document.getElementById("loginLink");
      if (user && getComputedStyle(user).display !== "none") {
        account.href = user.getAttribute("href") || "/dashboard.html";
        account.setAttribute("aria-label", "Dashboard");
      } else if (login) account.href = login.getAttribute("href") || "/login.html?redirect=/";
    }
    function syncCartBadge() {
      var source=document.getElementById("cartCount"), badge=document.getElementById("nlsBottomCartCount");
      if(!badge)return; var count=source?parseInt(source.textContent||"0",10)||0:0;
      badge.textContent=count>99?"99+":String(count); badge.hidden=count<=0;
    }
    syncAccountLink(); syncCartBadge();
    if (window.MutationObserver) {
      var cs=document.getElementById("cartCount"); if(cs)new MutationObserver(syncCartBadge).observe(cs,{childList:true,characterData:true,subtree:true,attributes:true});
      var ua=document.getElementById("userAccountArea"); if(ua)new MutationObserver(syncAccountLink).observe(ua,{attributes:true,attributeFilter:["style","class"]});
    }

    var lastY=Math.max(0,window.scrollY||window.pageYOffset||0), ticking=false, threshold=12;
    function update() {
      var y=Math.max(0,window.scrollY||window.pageYOffset||0), delta=y-lastY, header=getHeader();
      if(y<=10 || delta < -threshold){if(header)header.classList.remove("nls-scroll-hidden");nav.classList.remove("nls-scroll-hidden");}
      else if(delta > threshold){
        var d=document.getElementById("mobileDrawer"),o=document.getElementById("mobileMenuOverlay"),s=document.getElementById("mobileSearchPanel");
        var open=function(x){return x&&(x.classList.contains("open")||x.classList.contains("active"));};
        if(!open(d)&&!open(o)&&!open(s)){if(header)header.classList.add("nls-scroll-hidden");nav.classList.add("nls-scroll-hidden");}
      }
      lastY=y;ticking=false;
    }
    window.addEventListener("scroll",function(){if(!ticking){requestAnimationFrame(update);ticking=true;}},{passive:true});
    window.addEventListener("resize",function(){if(window.innerWidth>=768)showNavigation();},{passive:true});
    return true;
  }

  function init() {
    fixProductionAssets();
    if (addMobileNavigation()) return;
    if (window.MutationObserver && document.documentElement) {
      var observer=new MutationObserver(function(){if(addMobileNavigation())observer.disconnect();});
      observer.observe(document.documentElement,{childList:true,subtree:true});
      setTimeout(function(){observer.disconnect();addMobileNavigation();},5000);
    }
  }

  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init,{once:true});else init();
})();
