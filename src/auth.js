"use strict";
(function(){
  var W=window,D=document;

  /* The homepage currently schedules its first real product render after 1500ms.
     That is unnecessarily long on mobile and makes the product area look empty.
     Only shorten that exact render timer; leave every other timer untouched. */
  var nativeSetTimeout=W.setTimeout;
  W.setTimeout=function(fn,delay){
    var args=[].slice.call(arguments,2);
    if(delay===1500 && typeof fn==='function' && /renderCats/.test(String(fn)))delay=0;
    return nativeSetTimeout.apply(W,[fn,delay].concat(args));
  };

  function fixIcon(){
    var x=D.querySelector('link[rel="icon"],link[rel="shortcut icon"]');
    if(x){x.href='/images/next_level.png';x.type='image/png'}
  }

  function addDashboardHeader(){
    if(!D.body||D.getElementById('nlsDashboardMobileHeader'))return;
    var old=D.querySelector('.dashboard-header');
    if(!old)return;
    old.classList.add('nls-dashboard-desktop-header');
    var h=D.createElement('header');
    h.id='nlsDashboardMobileHeader';
    h.className='nls-header nls-universal-header';
    h.innerHTML='<div class="nls-container"><div class="nls-left"><button class="nls-hamburger" id="nlsDashboardMenuBtn" type="button" aria-label="Open categories"><span></span><span></span><span></span></button><a href="/" class="nls-logo-link"><img src="/images/next_level.png" alt="Next Level Subs Logo" class="nls-logo-img"></a></div><div class="nls-right"><button class="nls-icon-btn" id="nlsDashboardSearch" type="button" aria-label="Search"><i class="fas fa-search"></i></button><a id="nlsDashboardAccount" class="nls-account-link nls-user-link" href="/dashboard.html" aria-label="Dashboard"><i class="fa-solid fa-circle-user nls-account-icon"></i></a><button id="nlsDashboardCartBtn" class="nls-cart-btn" type="button" aria-label="Shopping cart"><i class="fa-solid fa-basket-shopping-simple"></i><span class="nls-cart-text">Cart</span><span id="nlsDashboardCartCount" class="cart-badge">0</span></button></div></div>';
    D.body.insertBefore(h,D.body.firstChild);

    var ov=D.createElement('div');ov.id='nlsDashboardOverlay';ov.className='nls-drawer-overlay';
    var dr=D.createElement('aside');dr.id='nlsDashboardDrawer';dr.className='nls-drawer';
    dr.innerHTML='<div class="nls-drawer-header"><a href="/" class="nls-drawer-logo"><img src="/images/next_level.png" alt="Logo" class="nls-logo-img"></a><button id="nlsDashboardClose" class="nls-drawer-close" type="button" aria-label="Close Menu"><i class="fas fa-times"></i></button></div><nav class="nls-drawer-nav"><a href="/best-selling" class="nls-drawer-link"><i class="fa-solid fa-crown"></i> Best Sellers</a><a href="/streaming" class="nls-drawer-link"><i class="fa-solid fa-fire"></i> Streaming</a><a href="/music" class="nls-drawer-link"><i class="fa-solid fa-music"></i> Music</a><a href="/storage" class="nls-drawer-link"><i class="fa-solid fa-cloud"></i> Cloud Storage</a><a href="/vpn" class="nls-drawer-link"><i class="fa-solid fa-shield-halved"></i> VPN</a><a href="/aiDesign" class="nls-drawer-link"><i class="fa-solid fa-robot"></i> AI &amp; Design</a><a href="/combos" class="nls-drawer-link"><i class="fa-solid fa-layer-group"></i> Combos</a><a href="/education" class="nls-drawer-link"><i class="fa-solid fa-graduation-cap"></i> Education</a><a href="/adult" class="nls-drawer-link nls-adult"><i class="fa-solid fa-fire"></i> Adult 18+</a></nav></aside>';
    D.body.insertBefore(ov,h.nextSibling);D.body.insertBefore(dr,ov.nextSibling);

    function toggle(v){dr.classList.toggle('active',v);ov.classList.toggle('active',v);document.body.style.overflow=v?'hidden':''}
    D.getElementById('nlsDashboardMenuBtn').addEventListener('click',function(){toggle(!dr.classList.contains('active'))});
    D.getElementById('nlsDashboardClose').addEventListener('click',function(){toggle(false)});
    ov.addEventListener('click',function(){toggle(false)});
    D.getElementById('nlsDashboardSearch').addEventListener('click',function(){W.location.href='/?search=1'});
    D.getElementById('nlsDashboardCartBtn').addEventListener('click',function(){openUniversalCart()});
  }

  function addUniversalCart(){
    if(!D.body)return;
    var existing=D.getElementById('cartSidebar');
    if(existing){
      updateUniversalCartCount();
      return;
    }
    var ov=D.createElement('div');ov.id='cartOverlay';ov.className='cart-overlay';
    var side=D.createElement('aside');side.id='cartSidebar';side.className='cart-sidebar';
    side.innerHTML='<div class="cart-header"><div class="cart-title-wrap"><i class="fas fa-shopping-cart cart-title-icon"></i><h2 class="cart-title">Your Cart</h2><span id="cartHeaderCount" class="cart-item-count">0</span></div><button id="nlsUniversalCartClose" class="cart-close-btn" type="button" aria-label="Close cart"><i class="fas fa-times"></i></button></div><div id="cartItems" class="cart-items-container"></div><div id="cartFooter" class="cart-footer"><div class="cart-total-row"><span class="cart-total-label">Subtotal</span><span id="cartTotal" class="cart-total-amount">৳0</span></div><p class="cart-taxes">Taxes and discounts calculated at checkout</p><button id="nlsUniversalCheckout" class="cart-checkout-btn" type="button">Proceed to Checkout <i class="fas fa-arrow-right"></i></button></div>';
    D.body.appendChild(ov);D.body.appendChild(side);
    ov.addEventListener('click',closeUniversalCart);
    D.getElementById('nlsUniversalCartClose').addEventListener('click',closeUniversalCart);
    D.getElementById('nlsUniversalCheckout').addEventListener('click',function(){W.location.href='/checkout.html'});
    updateUniversalCartCount();
  }

  function readUniversalCart(){
    try{var v=JSON.parse(W.localStorage.getItem('streamHubCart')||'[]');return Array.isArray(v)?v:[]}catch(e){return []}
  }
  function updateUniversalCartCount(){
    var cart=readUniversalCart(),q=cart.reduce(function(s,i){return s+Number(i.quantity||0)},0);
    ['nlsDashboardCartCount','cartCount'].forEach(function(id){var el=D.getElementById(id);if(el)el.textContent=q});
    var hc=D.getElementById('cartHeaderCount');if(hc)hc.textContent=q;
  }
  function openUniversalCart(){
    addUniversalCart();
    var ov=D.getElementById('cartOverlay'),side=D.getElementById('cartSidebar');
    if(!ov||!side)return;
    renderUniversalCart();ov.classList.add('active');side.classList.add('open');
    document.body.style.overflow='hidden';
  }
  function closeUniversalCart(){
    var ov=D.getElementById('cartOverlay'),side=D.getElementById('cartSidebar');
    if(ov)ov.classList.remove('active');if(side)side.classList.remove('open');
    document.body.style.overflow='';
  }
  function renderUniversalCart(){
    var box=D.getElementById('cartItems'),foot=D.getElementById('cartFooter'),totalEl=D.getElementById('cartTotal');
    if(!box)return;
    var cart=readUniversalCart();updateUniversalCartCount();box.innerHTML='';
    if(!cart.length){box.innerHTML='<div class="empty-cart-state"><i class="fa-solid fa-basket-shopping-simple"></i><h3>Your cart is empty</h3><p>Add some subscriptions to get started</p></div>';if(foot)foot.classList.add('hidden');if(totalEl)totalEl.textContent='৳0';return}
    if(foot)foot.classList.remove('hidden');
    var total=0;
    cart.forEach(function(i){
      var qty=Math.max(1,Number(i.quantity||1)),price=Number(i.price||0);total+=price*qty;
      var ci=D.createElement('div');ci.className='cart-item';
      var image=i.image?'<img src="'+String(i.image).replace(/"/g,'&quot;')+'" alt="" class="cart-item-img">':'<div class="cart-item-img" style="display:flex;align-items:center;justify-content:center"><i class="'+String(i.icon||'fas fa-tv').replace(/"/g,'&quot;')+'"></i></div>';
      ci.innerHTML=image+'<div class="cart-item-info"><p class="cart-item-name">'+String(i.name||'Subscription').replace(/[&<>]/g,'')+'</p><p class="cart-item-price">৳'+price+' × '+qty+'</p></div>';
      box.appendChild(ci);
    });
    if(totalEl)totalEl.textContent='৳'+total;
  }

  function addStyle(){
    if(D.getElementById('nls-universal-mobile-style'))return;
    var s=D.createElement('style');s.id='nls-universal-mobile-style';s.textContent=`
@media(max-width:767px){
:root{--nls-ease:cubic-bezier(.16,1,.3,1)}
body{padding-top:54px!important;padding-bottom:calc(70px + env(safe-area-inset-bottom))!important}
.nls-dashboard-desktop-header{display:none!important}
.nls-universal-header{display:block!important}
.nls-header{position:fixed!important;inset:0 0 auto 0!important;width:100%!important;height:54px!important;z-index:10001!important;background:rgba(255,255,255,.97)!important;backdrop-filter:blur(18px) saturate(160%)!important;-webkit-backdrop-filter:blur(18px) saturate(160%)!important;transform:translate3d(0,0,0)!important;transition:transform .32s var(--nls-ease)!important;will-change:transform;contain:layout paint}
.nls-header.nls-scroll-hidden{transform:translate3d(0,-110%,0)!important}
.nls-container,.nls-header.scrolled .nls-container{height:54px!important;min-height:54px!important;padding:0 8px!important;gap:0!important;transition:none!important}
.nls-left{flex:1 1 auto!important;min-width:0!important;gap:0!important}.nls-nav{display:none!important}
.nls-hamburger{display:flex!important;flex:0 0 40px!important;width:40px!important;height:40px!important;align-items:center!important;justify-content:center!important;margin:0!important;transition:transform .22s var(--nls-ease)!important}.nls-hamburger span{left:8px!important}
.nls-logo-link{position:absolute!important;left:50%!important;top:50%!important;transform:translate3d(-50%,-50%,0)!important;gap:0!important;max-width:38vw!important}.nls-logo-img,.nls-header.scrolled .nls-logo-img{height:34px!important;width:auto!important;max-width:38vw!important}.nls-logo-text-container{display:none!important}
.nls-right{margin-left:auto!important;gap:1px!important;height:54px!important}.nls-search-desktop{display:none!important}
#mobileSearchToggle,#cartBtn,#nlsDashboardSearch,#nlsDashboardCartBtn{display:inline-flex!important;align-items:center!important;justify-content:center!important;width:40px!important;height:40px!important;padding:0!important;border:0!important;border-radius:50%!important;background:transparent!important;color:#334155!important;position:relative!important;transition:transform .16s var(--nls-ease),background .16s ease!important}
#mobileSearchToggle:active,#cartBtn:active,#nlsDashboardSearch:active,#nlsDashboardCartBtn:active{transform:scale(.91)!important;background:#f1f5f9!important}
#mobileSearchToggle i,#cartBtn i,#nlsDashboardSearch i,#nlsDashboardCartBtn i{font-size:18px!important}
#loginLink,.nls-user-link{display:none!important}.nls-cart-text,.nls-auth-text,.nls-account-link{display:none!important}
#cartBtn .cart-badge,#nlsDashboardCartBtn .cart-badge{top:0!important;right:-1px!important}
.nls-drawer{z-index:10004!important}.nls-drawer-overlay{z-index:10003!important}.nls-mobile-search-panel{z-index:10005!important}
.nls-mobile-search-panel{top:54px!important;transition:transform .25s var(--nls-ease),opacity .18s ease!important}
#cartOverlay,.cart-overlay{z-index:10020!important}
#cartSidebar,.cart-sidebar{z-index:10021!important;top:0!important;bottom:0!important;height:100dvh!important;max-height:100dvh!important;transform:translate3d(105%,0,0)!important;transition:transform .42s var(--nls-ease)!important}
#cartSidebar.open,.cart-sidebar.open{transform:translate3d(0,0,0)!important}
#nlsMobileBottomNav{position:fixed!important;left:8px!important;right:8px!important;bottom:max(8px,env(safe-area-inset-bottom))!important;height:54px!important;min-height:54px!important;padding:4px 5px!important;display:grid!important;grid-template-columns:repeat(5,minmax(0,1fr))!important;gap:2px!important;align-items:stretch!important;visibility:visible!important;opacity:1!important;background:rgba(255,255,255,.97)!important;border:1px solid rgba(226,232,240,.95)!important;border-radius:17px!important;box-shadow:0 8px 24px rgba(15,23,42,.16),0 1px 5px rgba(15,23,42,.08)!important;z-index:10000!important;backdrop-filter:blur(18px) saturate(160%)!important;-webkit-backdrop-filter:blur(18px) saturate(160%)!important;transform:translate3d(0,0,0)!important;transition:transform .34s var(--nls-ease)!important;will-change:transform;contain:layout paint}
#nlsMobileBottomNav.nls-scroll-hidden{transform:translate3d(0,calc(100% + 20px),0)!important;pointer-events:none!important}
#nlsMobileBottomNav .nls-bottom-item{height:44px;min-width:0;margin:0;border:0;border-radius:12px;background:transparent;color:#64748b;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px;cursor:pointer;text-decoration:none;-webkit-tap-highlight-color:transparent;transition:background .14s ease,color .14s ease,transform .16s var(--nls-ease)}
#nlsMobileBottomNav .nls-bottom-item i{font-size:17px;line-height:17px;height:17px}.nls-bottom-label{font:600 8.5px/10px Inter,system-ui,sans-serif;white-space:nowrap;letter-spacing:-.05px}
#nlsMobileBottomNav .nls-bottom-item.active{color:#2563eb;background:#eaf1ff}#nlsMobileBottomNav .nls-bottom-item:active{transform:scale(.94);background:#eaf1ff}

/* Product cards use their own compositor-friendly entrance animation. This avoids AOS hiding dynamically-rendered cards. */
.subscription-card[data-aos]{opacity:1!important;transform:none!important;animation:nlsProductEnter .52s var(--nls-ease) both!important;will-change:transform,opacity}
.subscription-card[data-aos]:nth-child(2){animation-delay:35ms!important}.subscription-card[data-aos]:nth-child(3){animation-delay:70ms!important}.subscription-card[data-aos]:nth-child(4){animation-delay:105ms!important}.subscription-card[data-aos]:nth-child(5){animation-delay:140ms!important}.subscription-card[data-aos]:nth-child(6){animation-delay:175ms!important}.subscription-card[data-aos]:nth-child(7){animation-delay:210ms!important}.subscription-card[data-aos]:nth-child(8){animation-delay:245ms!important}
@keyframes nlsProductEnter{from{opacity:0;transform:translate3d(0,14px,0)}to{opacity:1;transform:translate3d(0,0,0)}}
}
@media(min-width:768px){#nlsMobileBottomNav{display:none!important}.nls-universal-header{display:none!important}}
`;
    D.documentElement.appendChild(s)
  }

  function addNav(){
    if(D.getElementById('nlsMobileBottomNav'))return;
    var n=D.createElement('nav');n.id='nlsMobileBottomNav';n.setAttribute('aria-label','Mobile navigation');
    n.innerHTML='<a class="nls-bottom-item" data-bottom-nav="home" href="/"><i class="fa-solid fa-house"></i><span class="nls-bottom-label">Home</span></a><button class="nls-bottom-item" data-bottom-nav="categories" type="button"><i class="fa-solid fa-grid-2"></i><span class="nls-bottom-label">Categories</span></button><button class="nls-bottom-item" data-bottom-nav="offers" type="button"><i class="fa-solid fa-tags"></i><span class="nls-bottom-label">Offers</span></button><a class="nls-bottom-item" data-bottom-nav="whatsapp" href="https://wa.me/8801644490566" target="_blank" rel="noopener noreferrer"><i class="fa-brands fa-whatsapp"></i><span class="nls-bottom-label">WhatsApp</span></a><a class="nls-bottom-item" data-bottom-nav="account" href="/login.html?redirect=/"><i class="fa-solid fa-circle-user"></i><span class="nls-bottom-label">Account</span></a>';
    D.documentElement.appendChild(n);
    var items=[].slice.call(n.querySelectorAll('[data-bottom-nav]')),p=(W.location.pathname.replace(/\/+$/,'')||'/');
    function active(k){items.forEach(function(x){var a=x.dataset.bottomNav===k;x.classList.toggle('active',a);if(a)x.setAttribute('aria-current','page');else x.removeAttribute('aria-current')})}
    active(p==='/'?'home':p==='/dashboard.html'||p==='/dashboard'?'account':'');
    n.querySelector('[data-bottom-nav="categories"]').addEventListener('click',function(){active('categories');var b=D.getElementById('mobileMenuBtn');if(b)b.click();else{var db=D.getElementById('nlsDashboardMenuBtn');if(db)db.click()}});
    n.querySelector('[data-bottom-nav="offers"]').addEventListener('click',function(){active('offers');var t=D.querySelector('#offers,#offer,#specialOffers,[data-offers]');if(t)t.scrollIntoView({behavior:'smooth',block:'start'});else if(p!=='/')W.location.href='/#offers'});
    n.querySelector('[data-bottom-nav="account"]').addEventListener('click',function(){var u=D.getElementById('userAccountArea'),l=D.getElementById('loginLink');if(u&&getComputedStyle(u).display!=='none')this.href=u.getAttribute('href')||'/dashboard.html';else if(l)this.href=l.getAttribute('href')||'/login.html?redirect=/';active('account')});
  }

  function setupScrollNav(){
    var last=W.scrollY||0,down=0,up=0,hidden=false,raf=0;
    function apply(){raf=0;var y=W.scrollY||0;if(y<=8){hidden=false;down=0;up=0}else if(y>last){down+=y-last;up=0;if(down>=28){hidden=true;down=0}}else if(y<last){up+=last-y;down=0;if(up>=14){hidden=false;up=0}};last=y;D.querySelectorAll('.nls-header,#nlsMobileBottomNav').forEach(function(el){el.classList.toggle('nls-scroll-hidden',hidden)})}
    W.addEventListener('scroll',function(){if(!raf)raf=W.requestAnimationFrame(apply)},{passive:true});
  }

  function syncAccount(){
    var u=D.getElementById('userAccountArea'),l=D.getElementById('loginLink'),a=D.getElementById('nlsDashboardAccount');
    if(!a)return;
    if(u&&getComputedStyle(u).display!=='none'){a.href=u.getAttribute('href')||'/dashboard.html'}else if(l){a.href=l.getAttribute('href')||'/login.html?redirect=/'}
  }

  function watchAuth(){
    syncAccount();
    W.addEventListener('nextlevelauthchange',syncAccount);
    if(D.readyState==='loading')D.addEventListener('DOMContentLoaded',syncAccount,{once:true});
  }

  fixIcon();addStyle();
  if(D.readyState==='loading')D.addEventListener('DOMContentLoaded',function(){addDashboardHeader();addUniversalCart();addNav();setupScrollNav();watchAuth()},{once:true});
  else{addDashboardHeader();addUniversalCart();addNav();setupScrollNav();watchAuth()}
})();
