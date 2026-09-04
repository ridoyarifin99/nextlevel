"use strict";
(function(){
  var W=window,D=document;
  if(typeof W.AUTH_API_BASE==='string'&&/^(https?:\/\/)?(localhost|127\.0\.0\.1)(:\d+)?/i.test(W.AUTH_API_BASE)){try{delete W.AUTH_API_BASE}catch(e){W.AUTH_API_BASE=''}}
  function fixIcon(){var x=D.querySelector('link[rel="icon"],link[rel="shortcut icon"]');if(x){x.href='/images/next_level.png';x.type='image/png'}}
  function addDashboardHeader(){
    if(!D.body||D.getElementById('nlsDashboardMobileHeader'))return;
    var old=D.querySelector('.dashboard-header');
    if(!old)return;
    old.classList.add('nls-dashboard-desktop-header');
    var h=D.createElement('header');h.id='nlsDashboardMobileHeader';h.className='nls-header nls-universal-header';
    h.innerHTML='<div class="nls-container"><div class="nls-left"><button class="nls-hamburger" id="nlsDashboardMenuBtn" type="button" aria-label="Open categories"><span></span><span></span><span></span></button><a href="/" class="nls-logo-link"><img src="/images/next_level.png" alt="Next Level Subs Logo" class="nls-logo-img"></a></div><div class="nls-right"><button class="nls-icon-btn" id="nlsDashboardSearch" type="button" aria-label="Search"><i class="fas fa-search"></i></button><a class="nls-account-link nls-user-link" href="/dashboard.html" aria-label="Dashboard"><i class="fa-solid fa-circle-user nls-account-icon"></i></a></div></div>';
    D.body.insertBefore(h,D.body.firstChild);
    var ov=D.createElement('div');ov.id='nlsDashboardOverlay';ov.className='nls-drawer-overlay';
    var dr=D.createElement('aside');dr.id='nlsDashboardDrawer';dr.className='nls-drawer';dr.innerHTML='<div class="nls-drawer-header"><a href="/" class="nls-drawer-logo"><img src="/images/next_level.png" alt="Logo" class="nls-logo-img"></a><button id="nlsDashboardClose" class="nls-drawer-close" type="button" aria-label="Close Menu"><i class="fas fa-times"></i></button></div><nav class="nls-drawer-nav"><a href="/best-selling" class="nls-drawer-link"><i class="fa-solid fa-crown"></i> Best Sellers</a><a href="/streaming" class="nls-drawer-link"><i class="fa-solid fa-fire"></i> Streaming</a><a href="/music" class="nls-drawer-link"><i class="fa-solid fa-music"></i> Music</a><a href="/storage" class="nls-drawer-link"><i class="fa-solid fa-cloud"></i> Cloud Storage</a><a href="/vpn" class="nls-drawer-link"><i class="fa-solid fa-shield-halved"></i> VPN</a><a href="/aiDesign" class="nls-drawer-link"><i class="fa-solid fa-robot"></i> AI &amp; Design</a><a href="/combos" class="nls-drawer-link"><i class="fa-solid fa-layer-group"></i> Combos</a><a href="/education" class="nls-drawer-link"><i class="fa-solid fa-graduation-cap"></i> Education</a><a href="/adult" class="nls-drawer-link nls-adult"><i class="fa-solid fa-fire"></i> Adult 18+</a></nav></aside>';
    D.body.insertBefore(ov,h.nextSibling);D.body.insertBefore(dr,ov.nextSibling);
    function toggle(v){dr.classList.toggle('active',v);ov.classList.toggle('active',v);document.body.style.overflow=v?'hidden':'';}
    D.getElementById('nlsDashboardMenuBtn').addEventListener('click',function(){toggle(!dr.classList.contains('active'))});
    D.getElementById('nlsDashboardClose').addEventListener('click',function(){toggle(false)});ov.addEventListener('click',function(){toggle(false)});
    D.getElementById('nlsDashboardSearch').addEventListener('click',function(){W.location.href='/?search=1'});
  }
  function addStyle(){
    if(D.getElementById('nls-universal-mobile-style'))return;
    var s=D.createElement('style');s.id='nls-universal-mobile-style';s.textContent=`
@media(max-width:767px){
:root{--nls-ease:cubic-bezier(.22,1,.36,1)}
body{padding-top:54px!important;padding-bottom:calc(70px + env(safe-area-inset-bottom))!important}
.nls-dashboard-desktop-header{display:none!important}
.nls-universal-header{display:block!important}
.nls-header{position:fixed!important;inset:0 0 auto 0!important;width:100%!important;height:54px!important;z-index:10001!important;background:rgba(255,255,255,.97)!important;backdrop-filter:blur(18px) saturate(160%)!important;-webkit-backdrop-filter:blur(18px) saturate(160%)!important;transform:translate3d(0,0,0)!important;transition:transform .36s var(--nls-ease)!important;will-change:transform;contain:layout paint}
.nls-header.nls-scroll-hidden{transform:translate3d(0,-110%,0)!important}
.nls-container,.nls-header.scrolled .nls-container{height:54px!important;min-height:54px!important;padding:0 8px!important;gap:0!important;transition:none!important}
.nls-left{flex:1 1 auto!important;min-width:0!important;gap:0!important}.nls-nav{display:none!important}
.nls-hamburger{display:flex!important;flex:0 0 40px!important;width:40px!important;height:40px!important;align-items:center!important;justify-content:center!important;margin:0!important;transition:transform .28s var(--nls-ease)!important}.nls-hamburger span{left:8px!important}
.nls-logo-link{position:absolute!important;left:50%!important;top:50%!important;transform:translate3d(-50%,-50%,0)!important;gap:0!important;max-width:38vw!important}.nls-logo-img,.nls-header.scrolled .nls-logo-img{height:34px!important;width:auto!important;max-width:38vw!important}.nls-logo-text-container{display:none!important}
.nls-right{margin-left:auto!important;gap:2px!important;height:54px!important}.nls-search-desktop{display:none!important}
#mobileSearchToggle,#cartBtn,#nlsDashboardSearch{display:inline-flex!important;align-items:center!important;justify-content:center!important;width:40px!important;height:40px!important;padding:0!important;border:0!important;border-radius:50%!important;background:transparent!important;color:#334155!important;position:relative!important;transition:transform .18s var(--nls-ease),background .18s ease!important}
#mobileSearchToggle:active,#cartBtn:active,#nlsDashboardSearch:active{transform:scale(.92)!important;background:#f1f5f9!important}
#mobileSearchToggle i,#cartBtn i,#nlsDashboardSearch i{font-size:18px!important}#loginLink,.nls-user-link{display:none!important}.nls-cart-text,.nls-auth-text,.nls-account-link{display:none!important}
#cartBtn .cart-badge{top:0!important;right:-1px!important}
.nls-drawer{z-index:10004!important}.nls-drawer-overlay{z-index:10003!important}.nls-mobile-search-panel{z-index:10005!important}
.nls-mobile-search-panel{top:54px!important;transition:transform .28s var(--nls-ease),opacity .2s ease!important}
#cartOverlay,.cart-overlay{z-index:10020!important}#cartSidebar,.cart-sidebar{z-index:10021!important;bottom:0!important}
#nlsMobileBottomNav{position:fixed!important;left:8px!important;right:8px!important;bottom:max(8px,env(safe-area-inset-bottom))!important;height:54px!important;min-height:54px!important;padding:4px 5px!important;display:grid!important;grid-template-columns:repeat(5,minmax(0,1fr))!important;gap:2px!important;align-items:stretch!important;visibility:visible!important;opacity:1!important;background:rgba(255,255,255,.97)!important;border:1px solid rgba(226,232,240,.95)!important;border-radius:17px!important;box-shadow:0 8px 24px rgba(15,23,42,.16),0 1px 5px rgba(15,23,42,.08)!important;z-index:10000!important;backdrop-filter:blur(18px) saturate(160%)!important;-webkit-backdrop-filter:blur(18px) saturate(160%)!important;transform:translate3d(0,0,0)!important;transition:transform .38s var(--nls-ease)!important;will-change:transform;contain:layout paint}
#nlsMobileBottomNav.nls-scroll-hidden{transform:translate3d(0,calc(100% + 20px),0)!important;opacity:1!important;pointer-events:none!important}
#nlsMobileBottomNav .nls-bottom-item{height:44px;min-width:0;margin:0;border:0;border-radius:12px;background:transparent;color:#64748b;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px;cursor:pointer;text-decoration:none;-webkit-tap-highlight-color:transparent;transition:background .16s ease,color .16s ease,transform .18s var(--nls-ease)}
#nlsMobileBottomNav .nls-bottom-item i{font-size:17px;line-height:17px;height:17px}.nls-bottom-label{font:600 8.5px/10px Inter,system-ui,sans-serif;white-space:nowrap;letter-spacing:-.05px}
#nlsMobileBottomNav .nls-bottom-item.active{color:#2563eb;background:#eaf1ff}#nlsMobileBottomNav .nls-bottom-item:active{transform:scale(.94);background:#eaf1ff}
}
@media(min-width:768px){#nlsMobileBottomNav{display:none!important}.nls-universal-header{display:none!important}}
`;
    D.documentElement.appendChild(s)
  }
  function addNav(){
    if(D.getElementById('nlsMobileBottomNav'))return;
    var n=D.createElement('nav');n.id='nlsMobileBottomNav';n.setAttribute('aria-label','Mobile navigation');n.innerHTML='<a class="nls-bottom-item" data-bottom-nav="home" href="/"><i class="fa-solid fa-house"></i><span class="nls-bottom-label">Home</span></a><button class="nls-bottom-item" data-bottom-nav="categories" type="button"><i class="fa-solid fa-grid-2"></i><span class="nls-bottom-label">Categories</span></button><button class="nls-bottom-item" data-bottom-nav="offers" type="button"><i class="fa-solid fa-tags"></i><span class="nls-bottom-label">Offers</span></button><a class="nls-bottom-item" data-bottom-nav="whatsapp" href="https://wa.me/8801644490566" target="_blank" rel="noopener noreferrer"><i class="fa-brands fa-whatsapp"></i><span class="nls-bottom-label">WhatsApp</span></a><a class="nls-bottom-item" data-bottom-nav="account" href="/login.html?redirect=/"><i class="fa-solid fa-circle-user"></i><span class="nls-bottom-label">Account</span></a>';D.documentElement.appendChild(n);
    var items=[].slice.call(n.querySelectorAll('[data-bottom-nav]')),p=(W.location.pathname.replace(/\/+$/,'')||'/');function active(k){items.forEach(function(x){var a=x.dataset.bottomNav===k;x.classList.toggle('active',a);if(a)x.setAttribute('aria-current','page');else x.removeAttribute('aria-current')})}active(p==='/'?'home':p==='/dashboard.html'?'account':'');
    n.querySelector('[data-bottom-nav="categories"]').addEventListener('click',function(){active('categories');var b=D.getElementById('mobileMenuBtn');if(b)b.click();else{var db=D.getElementById('nlsDashboardMenuBtn');if(db)db.click()}});
    n.querySelector('[data-bottom-nav="offers"]').addEventListener('click',function(){active('offers');var t=D.querySelector('#offers,#offer,#specialOffers,[data-offers]');if(t)t.scrollIntoView({behavior:'smooth',block:'start'});else if(p!=='/')W.location.href='/#offers'});
    n.querySelector('[data-bottom-nav="account"]').addEventListener('click',function(){var u=D.getElementById('userAccountArea'),l=D.getElementById('loginLink');if(u&&getComputedStyle(u).display!=='none')this.href=u.getAttribute('href')||'/dashboard.html';else if(l)this.href=l.getAttribute('href')||'/login.html?redirect=/';active('account')});
  }
  function smoothAOS(){
    if(!W.AOS||!W.AOS.init)return;var orig=W.AOS.init;if(orig.__nls)return;var wrap=function(o){o=o||{};o.duration=600;o.easing='ease-out-cubic';o.once=true;o.delay=0;o.offset=50;o.disableMutationObserver=true;return orig.call(W.AOS,o)};wrap.__nls=true;W.AOS.init=wrap
  }
  /* The homepage intentionally waits 1500ms before replacing skeletons. Shorten only that exact storefront render callback. */
  function removeRenderDelay(){
    if(!W.setTimeout||W.setTimeout.__nls)return;var native=W.setTimeout;var patched=function(fn,delay){if(delay===1500&&typeof fn==='function'){var q=Function.prototype.toString.call(fn);if(q.indexOf('renderCats')>-1&&q.indexOf('updateCartUI')>-1)delay=80}return native.apply(W,[fn,delay].concat([].slice.call(arguments,2)))};patched.__nls=true;W.setTimeout=patched
  }
  fixIcon();addStyle();smoothAOS();removeRenderDelay();
  if(D.readyState==='loading')D.addEventListener('DOMContentLoaded',function(){addDashboardHeader();addNav()}, {once:true});else{addDashboardHeader();addNav()}
})();
