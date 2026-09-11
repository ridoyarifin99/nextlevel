"use strict";
(function(){
  if(window.__NLSIndexUICentral) return;
  window.__NLSIndexUICentral = true;

  const $ = id => document.getElementById(id);
  const esc = v => String(v ?? "").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/\"/g,"&quot;").replace(/'/g,"&#039;");
  const norm = v => String(v ?? "").trim().toLowerCase();
  const catalog = () => Array.isArray(window.NLSCentralCatalog?.products) ? window.NLSCentralCatalog.products : [];
  const valid = p => p && p.is_available !== false && p.is_archived !== true && String(p.slug||"").trim() && String(p.name||"").trim();
  const cats = p => {
    const out=[];
    if(Array.isArray(p?.categories)) out.push(...p.categories);
    if(Array.isArray(p?.extra_data?.categories)) out.push(...p.extra_data.categories);
    if(p?.product_categories?.slug) out.push(p.product_categories.slug);
    if(Array.isArray(p?.product_categories)) out.push(...p.product_categories.map(x=>x?.slug||x?.name));
    return [...new Set(out.map(norm).filter(Boolean))];
  };
  const plans = p => Array.isArray(p?.product_plans) ? p.product_plans.filter(x=>x && x.is_available !== false) : [];
  const plan = p => plans(p)[0] || null;
  const price = p => Number(plan(p)?.price ?? p?.price ?? 0);
  const duration = p => String(plan(p)?.duration ?? p?.duration ?? "month");
  const image = p => p?.logo || p?.product_logo || p?.image || p?.image_url || "";
  const products = () => catalog().filter(valid);

  const sInp=$('searchInput'),mInp=$('mobileSearchInput'),sDrop=$('searchDropdown'),sResC=$('searchResults'),noSRes=$('noSearchResults');
  const cBtn=$('cartBtn'),cSide=$('cartSidebar'),cOvl=$('cartOverlay'),cClose=$('closeCartBtn'),cItems=$('cartItems'),cCount=$('cartCount'),cHeadCount=$('cartHeaderCount'),cTotal=$('cartTotal'),cFoot=$('cartFooter'),cOut=$('checkoutBtn');
  const notif=$('notification'),notifT=$('notificationText'),cSD=$('clearSearchDesktop'),cSM=$('clearSearchMobile');
  const mBtn=$('mobileMenuBtn'),mDraw=$('mobileDrawer'),mOvl=$('mobileMenuOverlay'),cDraw=$('closeDrawerBtn'),mTog=$('mobileSearchToggle'),mPan=$('mobileSearchPanel');
  const nMB=$('navMoreBtn'),nMC=$('navMoreContainer'),nlsHeader=$('nlsHeader'),back=$('backToTopBtn');
  const dSW=$('desktopSearchWrapper'),mSW=$('mobileSearchWrapper');
  const minP=$('minPrice'),maxP=$('maxPrice'),minPV=$('minPriceValue'),maxPV=$('maxPriceValue'),sortS=$('sortSelect'),noRes=$('noResults');
  let cart=[],searchTimer=null,filterTimer=null;

  function loadCart(){ try{const x=JSON.parse(localStorage.getItem('streamHubCart')||'[]');cart=Array.isArray(x)?x:[];}catch{cart=[];} }
  function saveCart(){ try{localStorage.setItem('streamHubCart',JSON.stringify(cart));}catch{} }
  function centralProduct(slug){ return products().find(p=>norm(p.slug)===norm(slug)); }
  function canonicalizeCart(){
    const bySlug=new Map(products().map(p=>[norm(p.slug),p]));
    cart=cart.map(item=>{
      const p=bySlug.get(norm(item.slug||item.product_slug)); if(!p) return null;
      const pl=plans(p).find(x=>String(x.id)===String(item.selectedPlan?.id))||plans(p).find(x=>norm(x.duration)===norm(item.duration))||plan(p); if(!pl)return null;
      return {...item,name:p.name,slug:p.slug,product_slug:p.slug,image:image(p),logo:p.logo||p.product_logo||image(p),product_logo:p.logo||p.product_logo||image(p),price:Number(pl.price??p.price??0),duration:pl.duration||"month",selectedPlan:{...pl,price:Number(pl.price||0)}};
    }).filter(Boolean);
    saveCart();
  }
  function notify(msg){if(!notif||!notifT)return;notifT.textContent=msg;notif.classList.add('show');setTimeout(()=>notif.classList.remove('show'),2500);}
  function updateCartUI(){
    if(!cItems)return;
    const qty=cart.reduce((s,i)=>s+Number(i.quantity||0),0); if(cCount)cCount.textContent=qty;if(cHeadCount)cHeadCount.textContent=qty;
    cItems.innerHTML='';
    if(!cart.length){cItems.innerHTML='<div class="empty-cart-state"><i class="fa-solid fa-basket-shopping-simple"></i><h3>Your cart is empty</h3><p>Add some subscriptions to get started</p></div>';cFoot?.classList.add('hidden');if(cTotal)cTotal.textContent='৳0';return;}
    cFoot?.classList.remove('hidden');
    cart.forEach(item=>{
      const row=document.createElement('div');row.className='cart-item';
      const src=item.logo||item.product_logo||item.image||'';
      row.innerHTML=`${src?`<img src="${esc(src)}" alt="${esc(item.name)}" class="cart-item-img">`:`<div class="cart-item-img"></div>`}<div class="cart-item-info"><h4 class="cart-item-name">${esc(item.name)}</h4><p class="cart-item-price">৳${Number(item.price||0).toLocaleString('en-BD')} / ${esc(item.duration||'month')}</p></div><div class="cart-item-controls"><button type="button" class="cart-item-remove"><i class="fas fa-times-circle"></i></button><div class="cart-qty-wrap"><button type="button" class="cart-qty-btn minus"><i class="fas fa-minus" style="font-size:10px"></i></button><span class="cart-qty-val">${Number(item.quantity||1)}</span><button type="button" class="cart-qty-btn plus"><i class="fas fa-plus" style="font-size:10px"></i></button></div></div>`;
      row.querySelector('.minus')?.addEventListener('click',()=>setQty(item.slug,Number(item.quantity||1)-1));
      row.querySelector('.plus')?.addEventListener('click',()=>setQty(item.slug,Number(item.quantity||1)+1));
      row.querySelector('.cart-item-remove')?.addEventListener('click',()=>remove(item.slug));
      cItems.appendChild(row);
    });
    if(cTotal)cTotal.textContent=`৳${cart.reduce((s,i)=>s+Number(i.price||0)*Number(i.quantity||0),0).toLocaleString('en-BD')}`;
  }
  function add(slug){
    const p=centralProduct(slug); if(!p)return;
    const pl=plan(p); if(!pl)return notify('This subscription is currently unavailable');
    const found=cart.find(i=>norm(i.slug)===norm(p.slug));
    if(found)found.quantity=Number(found.quantity||0)+1;else cart.push({name:p.name,slug:p.slug,product_slug:p.slug,image:image(p),logo:p.logo||p.product_logo||image(p),product_logo:p.logo||p.product_logo||image(p),price:Number(pl.price??p.price??0),duration:pl.duration||'month',selectedPlan:{...pl,price:Number(pl.price||0)},quantity:1});
    saveCart();updateCartUI();notify(`${p.name} added to cart`);window.dispatchEvent(new CustomEvent('nextlevel:checkout-cart-updated',{detail:{cart}}));
  }
  function remove(slug){const p=cart.find(i=>norm(i.slug)===norm(slug));cart=cart.filter(i=>norm(i.slug)!==norm(slug));saveCart();updateCartUI();if(p)notify(`${p.name} removed from cart`);}
  function setQty(slug,q){if(q<=0)return remove(slug);const p=cart.find(i=>norm(i.slug)===norm(slug));if(!p)return;p.quantity=Math.max(1,q);saveCart();updateCartUI();window.dispatchEvent(new CustomEvent('nextlevel:checkout-cart-updated',{detail:{cart}}));}
  function openCart(){cSide?.classList.add('open');cOvl?.classList.add('active');document.body.classList.add('cart-open');updateCartUI();}
  function closeCart(){cSide?.classList.remove('open');cOvl?.classList.remove('active');document.body.classList.remove('cart-open');}
  function checkout(){if(!cart.length)return;saveCart();location.href='checkout.html';}
  function moveDrop(w){if(w&&sDrop&&sDrop.parentElement!==w)w.appendChild(sDrop);}
  function highlight(text,term){const e=esc(text),t=esc(term);if(!t)return e;return e.replace(new RegExp(`(${t.replace(/[.*+?^${}()|[\\]\\]/g,'\\\\$&')})`,'gi'),'<span class="search-highlight">$1</span>');}
  function search(term){
    const q=norm(term);if(!q){sDrop?.classList.remove('active');return;}
    const found=products().filter(p=>norm(p.name).includes(q)||norm(p.description).includes(q)||cats(p).some(c=>c.includes(q)));
    if(sResC)sResC.innerHTML='';noSRes?.classList.toggle('hidden',!!found.length);
    found.forEach(p=>{const row=document.createElement('div');row.className='search-dropdown-item';const src=image(p);row.innerHTML=`<div class="sdi-img">${src?`<img src="${esc(src)}" alt="${esc(p.name)}" style="width:100%;height:100%;object-fit:contain">`:'<i class="fas fa-play-circle"></i>'}</div><div class="sdi-info"><h4>${highlight(p.name,q)}</h4><p>${highlight(p.description||'',q)}</p></div><div class="sdi-action"><span class="sdi-price">৳${price(p).toLocaleString('en-BD')}</span><button type="button" class="sdi-add-btn">Add</button></div>`;row.querySelector('.sdi-add-btn')?.addEventListener('click',e=>{e.stopPropagation();add(p.slug);sDrop?.classList.remove('active');});row.addEventListener('click',e=>{if(!e.target.closest('.sdi-add-btn'))location.href=`/product/${encodeURIComponent(p.slug)}`;});sResC?.appendChild(row);});sDrop?.classList.add('active');}
  function onSearch(e){const value=e.target.value;if(sInp&&e.target===sInp)mInp&&(mInp.value=value);if(mInp&&e.target===mInp)sInp&&(sInp.value=value);cSD?.classList.toggle('visible',!!value);cSM?.classList.toggle('visible',!!value);clearTimeout(searchTimer);searchTimer=setTimeout(()=>search(value),150);}
  function clearSearch(){if(sInp)sInp.value='';if(mInp)mInp.value='';sDrop?.classList.remove('active');cSD?.classList.remove('visible');cSM?.classList.remove('visible');}
  function setupNav(){
    const links=document.querySelectorAll('.nls-nav-link,.nls-drawer-link');
    links.forEach(l=>l.addEventListener('click',e=>{const href=l.getAttribute('href')||'';if(!href.startsWith('/'))return;const id=l.dataset.section;if(!id||!$(id))return;e.preventDefault();history.pushState({id},'',href);$(id).scrollIntoView({behavior:'smooth'});links.forEach(x=>x.classList.toggle('active',x.dataset.section===id));if(mDraw?.classList.contains('active'))toggleMenu();if(nMC?.classList.contains('active'))nMC.classList.remove('active');}));
    window.addEventListener('popstate',()=>{const id=location.pathname.slice(1);if($(id))$(id).scrollIntoView({behavior:'smooth'});});
  }
  function toggleMenu(){const open=!mDraw?.classList.contains('active');mDraw?.classList.toggle('active',open);mOvl?.classList.toggle('active',open);mBtn?.classList.toggle('active',open);document.body.style.overflow=open?'hidden':'';}
  function syncFilters(){
    if(!minP||!maxP)return;
    const all=products(),max=Math.max(0,...all.map(price));if(Number(maxP.value||0)<max)maxP.value=max;if(Number(minP.value||0)>max)minP.value=0;
    if(minPV)minPV.textContent=`৳${Number(minP.value||0).toLocaleString('en-BD')}`;if(maxPV)maxPV.textContent=`৳${Number(maxP.value||max).toLocaleString('en-BD')}`;
  }
  function init(){
    loadCart();canonicalizeCart();updateCartUI();setupNav();syncFilters();
    sInp?.addEventListener('input',onSearch);mInp?.addEventListener('input',onSearch);cSD?.addEventListener('click',clearSearch);cSM?.addEventListener('click',clearSearch);
    cBtn?.addEventListener('click',openCart);cClose?.addEventListener('click',closeCart);cOvl?.addEventListener('click',closeCart);cOut?.addEventListener('click',checkout);
    mBtn?.addEventListener('click',toggleMenu);cDraw?.addEventListener('click',toggleMenu);mOvl?.addEventListener('click',toggleMenu);
    nMB?.addEventListener('click',e=>{e.preventDefault();nMC?.classList.toggle('active');nMB.setAttribute('aria-expanded',nMC?.classList.contains('active')?'true':'false');});
    mTog?.addEventListener('click',e=>{e.stopPropagation();mPan?.classList.toggle('active');if(mPan?.classList.contains('active'))setTimeout(()=>mInp?.focus(),50);else sDrop?.classList.remove('active');});
    document.addEventListener('click',e=>{if(nMC&&!nMC.contains(e.target)){nMC.classList.remove('active');nMB?.setAttribute('aria-expanded','false');}if(sDrop?.classList.contains('active')&&!sDrop.contains(e.target)&&e.target!==sInp&&e.target!==mInp&&e.target!==mTog)sDrop.classList.remove('active');});
    window.addEventListener('scroll',()=>{nlsHeader?.classList.toggle('scrolled',window.scrollY>50);back?.classList.toggle('visible',window.scrollY>300);if(sDrop?.classList.contains('active'))sDrop.classList.remove('active');},{passive:true});
    back?.addEventListener('click',()=>window.scrollTo({top:0,behavior:'smooth'}));
    window.addEventListener('nls:central-catalog-ready',()=>{canonicalizeCart();updateCartUI();syncFilters();});
    window.addEventListener('nextlevel:products-updated',()=>{canonicalizeCart();updateCartUI();syncFilters();});
    window.addEventListener('nextlevel:checkout-cart-updated',e=>{if(Array.isArray(e.detail?.cart)){try{cart=e.detail.cart;updateCartUI();}catch{}}});
    if(typeof AOS!=='undefined'){AOS.init({duration:600,easing:'ease-out-cubic',once:true,offset:50});window.addEventListener('load',()=>AOS.refresh());}
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
