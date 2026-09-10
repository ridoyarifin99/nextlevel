"use strict";
(() => {
  if (window.__NLSDetailsCentralRuntimeV2Booted) return;
  window.__NLSDetailsCentralRuntimeV2Booted = true;

  const start = () => {
    const p = window.__NLS_CENTRAL_PRODUCT__;
    if (!p) {
      if (!window.__NLSDetailsCentralRuntimeV2Waiting) {
        window.__NLSDetailsCentralRuntimeV2Waiting = true;
        let attempts = 0;
        const timer = setInterval(() => {
          if (window.__NLS_CENTRAL_PRODUCT__) {
            clearInterval(timer);
            window.__NLSDetailsCentralRuntimeV2Waiting = false;
            start();
          } else if (++attempts >= 120) {
            clearInterval(timer);
            window.__NLSDetailsCentralRuntimeV2Waiting = false;
            console.warn("NEXT LEVEL SUBS: central product data was not injected into details page");
          }
        }, 50);
      }
      return;
    }
    if (window.__NLSDetailsCentralRuntimeV2Applied) return;
    window.__NLSDetailsCentralRuntimeV2Applied = true;

    const root = document.getElementById('productDetails');
    if (!root) return;

    const plans = (p.product_plans || [])
      .filter(x => x && x.is_available !== false)
      .sort((a,b) => (a.display_order || 0) - (b.display_order || 0));
    const media = role => (p.product_media || [])
      .filter(x => x && x.is_active !== false && x.role === role)
      .sort((a,b) => (a.display_order || 0) - (b.display_order || 0));
    const primary = media('primary')[0]?.url || p.image_url || p.image || '';
    const gallery = media('gallery').map(x => x.url).filter(Boolean);
    const images = [...new Set([primary, ...gallery].filter(Boolean))];
    const esc = v => String(v ?? '').replace(/[&<>\"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#039;'}[c]));
    const abs = u => { try { return new URL(u, location.origin).href; } catch { return u; } };
    const money = (v,c='BDT') => `${c === 'BDT' ? '৳' : c + ' '}${Number(v || 0).toLocaleString('en-BD',{maximumFractionDigits:2})}`;
    const rating = Number(p.rating || 0) || 5;
    const reviews = Number(p.reviews || p.review_count || 0);
    let selectedIndex = 0;
    let currentSlide = 0;

    const stars = () => {
      const full = Math.floor(rating);
      const half = rating % 1 >= .5;
      let s = '';
      for (let i=0;i<full;i++) s += '<i class="fas fa-star"></i>';
      if (half && full < 5) s += '<i class="fas fa-star-half-alt"></i>';
      for (let i=full + (half ? 1 : 0);i<5;i++) s += '<i class="far fa-star"></i>';
      return s;
    };

    function render() {
      const safeImages = images.length ? images : [p.image_url || p.image || ''];
      root.innerHTML = `
        <div class="animate-slide-in-left" data-aos="fade-right">
          <div class="gallery-container">
            <div class="gallery-slider" id="gallerySlider">
              ${safeImages.map((u,i)=>`<div class="gallery-slide"><img src="${esc(abs(u))}" alt="${esc(p.name)} ${i+1}"><div class="absolute top-4 right-4 bg-white rounded-full p-2 shadow-md cursor-pointer hover:scale-110 transition-transform" onclick="toggleFavorite()"><i id="favoriteIcon" class="far fa-heart text-xl"></i></div></div>`).join('')}
            </div>
            <div class="gallery-nav gallery-prev" onclick="prevSlide()"><i class="fas fa-chevron-left"></i></div>
            <div class="gallery-nav gallery-next" onclick="nextSlide()"><i class="fas fa-chevron-right"></i></div>
          </div>
          <div class="gallery-dots">${safeImages.map((_,i)=>`<div class="gallery-dot ${i===0?'active':''}" onclick="goToSlide(${i})"></div>`).join('')}</div>
          <div class="flex mt-4 space-x-2 overflow-x-auto pb-2">${safeImages.map((u,i)=>`<img src="${esc(abs(u))}" alt="${esc(p.name)} ${i+1}" class="gallery-thumbnail w-20 h-20 rounded-lg object-cover flex-shrink-0 cursor-pointer ${i===0?'active':''}" onclick="goToSlide(${i})">`).join('')}</div>
        </div>
        <div class="animate-slide-in-right" data-aos="fade-left">
          <div class="flex items-center mb-4">
            <img src="${esc(abs(primary || safeImages[0]))}" alt="${esc(p.name)}" class="w-16 h-16 rounded-xl mr-4 object-contain" style="box-shadow:0 4px 12px rgba(0,0,0,0.08);">
            <div>
              <h1 class="text-3xl font-bold" style="background:linear-gradient(to right,var(--primary-color),var(--secondary-color));-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;">${esc(p.name)}</h1>
              <div class="flex items-center mt-1"><div class="flex text-yellow-400">${stars()}</div><span class="ml-2 text-gray-600">${rating.toFixed(1)} (${reviews.toLocaleString()} reviews)</span></div>
            </div>
          </div>
          <p class="text-gray-600 mb-6">${esc(p.description || '')}</p>
          <div class="mb-6">
            <h3 class="text-lg font-semibold mb-3">Select Subscription Plan:</h3>
            <div class="grid grid-cols-2 gap-3" data-central-plan-list="1">
              ${plans.map((pl,i)=>`<div class="plan-card p-4 rounded-xl border border-gray-200 text-center ${i===0?'selected':''} ${pl.is_popular || pl.popular ? 'relative':''}" data-central-plan-index="${i}">${pl.is_popular || pl.popular ? '<span class="popular-badge">MOST POPULAR</span>' : ''}<div class="font-medium mt-3">${esc(pl.duration || pl.name || 'Plan')}</div><div class="text-2xl font-bold mt-1">${esc(money(pl.price,pl.currency || p.currency || 'BDT'))}</div>${pl.old_price != null ? `<div class="text-xs text-gray-400 line-through">${esc(money(pl.old_price,pl.currency || p.currency || 'BDT'))}</div>` : ''}</div>`).join('')}
            </div>
          </div>
          <div class="mb-6">
            <h3 class="text-lg font-semibold mb-3">Key Features:</h3>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2" data-central-features="1">
              ${(Array.isArray(p.features) ? p.features : []).map((f,i)=>`<div class="feature-item flex items-center p-2 bg-gray-50 rounded-lg" style="animation-delay:${i*.1}s"><i class="fas fa-check-circle text-green-500 mr-2"></i><span class="text-gray-700">${esc(typeof f === 'string' ? f : f?.text || f?.name || '')}</span></div>`).join('')}
            </div>
          </div>
          <div class="flex space-x-4">
            <button onclick="addToCart()" class="flex-1 py-3 rounded-xl font-bold text-white btn-primary text-base"><i class="fa-regular fa-cart-circle-plus mr-2"></i>Add to Cart</button>
            <button onclick="buyNow()" class="flex-1 py-3 rounded-xl font-bold text-white btn-whatsapp text-base"><i class="fab fa-whatsapp mr-2"></i>Buy Now</button>
          </div>
          <div class="mt-6 pt-6 border-t border-gray-200"><div class="flex flex-wrap items-center justify-between text-sm text-gray-600 gap-2"><div class="flex items-center"><i class="fas fa-shield-alt mr-2 text-purple-500"></i><span>30-Day Money Back Guarantee</span></div><div class="flex items-center"><i class="fas fa-lock mr-2 text-blue-500"></i><span>Secure Payment</span></div><div class="flex items-center"><i class="fas fa-headset mr-2 text-pink-500"></i><span>24/7 Support</span></div></div></div>
        </div>`;

      root.querySelectorAll('[data-central-plan-index]').forEach(el => el.addEventListener('click', () => {
        selectedIndex = Number(el.dataset.centralPlanIndex) || 0;
        root.querySelectorAll('[data-central-plan-index]').forEach(x => x.classList.toggle('selected', x === el));
      }));
      root.querySelectorAll('.feature-item').forEach((el,i) => setTimeout(() => el.classList.add('show'), i * 80));
    }

    function selectedPlan() {
      return plans[selectedIndex] || plans[0] || { price:p.price || 0, currency:p.currency || 'BDT', duration:'Standard' };
    }
    function cartItem() {
      const plan = selectedPlan();
      return {...p, product_id:p.id, selectedPlan:{...plan, product_id:p.id}, plan_id:plan.id || null, price:plan.price, quantity:1, image:primary};
    }
    function saveItem() {
      const item = cartItem();
      let cart=[];
      try { cart=JSON.parse(localStorage.getItem('streamHubCart') || '[]'); if(!Array.isArray(cart)) cart=[]; } catch {}
      const idx=cart.findIndex(x => x.product_id === item.product_id || x.name === item.name);
      if(idx >= 0) cart[idx]=item; else cart.push(item);
      localStorage.setItem('streamHubCart',JSON.stringify(cart));
      return item;
    }
    function addToCartCentral() { saveItem(); const m=document.getElementById('successModal'); if(m)m.classList.remove('hidden'); }
    function buyNowCentral() { saveItem(); location.href='/checkout.html'; }
    function selectPlanCentral(i) { selectedIndex=Math.max(0,Math.min(Number(i)||0,plans.length-1)); root.querySelectorAll('[data-central-plan-index]').forEach(x=>x.classList.toggle('selected',Number(x.dataset.centralPlanIndex)===selectedIndex)); }
    function goToSlideCentral(i) { currentSlide=Math.max(0,Math.min(Number(i)||0,images.length-1)); const s=document.getElementById('gallerySlider'); if(s)s.style.transform=`translateX(-${currentSlide*100}%)`; root.querySelectorAll('.gallery-dot,.gallery-thumbnail').forEach((x,j)=>x.classList.toggle('active',j===currentSlide)); }
    function nextSlideCentral() { goToSlideCentral(currentSlide+1 >= images.length ? 0 : currentSlide+1); }
    function prevSlideCentral() { goToSlideCentral(currentSlide-1 < 0 ? images.length-1 : currentSlide-1); }

    window.addToCart=addToCartCentral;
    window.buyNow=buyNowCentral;
    window.selectPlan=selectPlanCentral;
    window.goToSlide=goToSlideCentral;
    window.nextSlide=nextSlideCentral;
    window.prevSlide=prevSlideCentral;

    const breadcrumb=document.getElementById('breadcrumbProduct');
    if(breadcrumb) breadcrumb.textContent=p.name;
    document.title=`${p.name} Subscription | NEXT LEVEL SUBS`;

    window.switchTab = function(tab) {
      const out=document.getElementById('tabContent'); if(!out)return;
      document.querySelectorAll('.tab-button').forEach(b=>b.classList.toggle('active',(b.textContent||'').toLowerCase().includes(tab)));
      if(tab==='description') out.innerHTML=`<div class="prose max-w-none"><p class="text-gray-700">${esc(p.description||'')}</p></div>`;
      else if(tab==='features') out.innerHTML=`<div class="grid grid-cols-1 md:grid-cols-2 gap-4">${(p.features||[]).map(f=>`<div class="flex items-start p-4 bg-gray-50 rounded-lg"><i class="fas fa-check-circle text-green-500 mt-1 mr-3"></i><span>${esc(typeof f==='string'?f:f?.text||f?.name||'')}</span></div>`).join('')}</div>`;
      else if(tab==='faq') out.innerHTML=(p.faq||[]).length?`<div class="space-y-4">${p.faq.map(f=>`<div class="border border-gray-200 rounded-lg p-4"><div class="font-semibold">${esc(f.question||'')}</div><div class="text-gray-600 mt-2">${esc(f.answer||'')}</div></div>`).join('')}</div>`:'<p class="text-gray-600">No FAQs available for this product.</p>';
      else out.innerHTML='<p class="text-gray-600">No customer reviews available yet.</p>';
    };

    async function patchRelated() {
      const db=window.supabaseClient; if(!db)return;
      try {
        const r=await db.from('products').select('id,name,slug,description,image_url,price,currency,product_media(role,url,is_active,display_order),product_plans(price,currency,duration,is_available,display_order)').eq('is_available',true).eq('is_archived',false).neq('id',p.id).order('display_order').limit(5);
        if(r.error||!r.data)return;
        const related=document.getElementById('relatedProducts'); if(!related)return;
        related.innerHTML=r.data.map(x=>{
          const m=(x.product_media||[]).filter(y=>y.is_active!==false&&y.role==='primary').sort((a,b)=>(a.display_order||0)-(b.display_order||0))[0]?.url||x.image_url||'';
          const pl=(x.product_plans||[]).filter(y=>y.is_available!==false).sort((a,b)=>(a.display_order||0)-(b.display_order||0))[0];
          return `<div class="subscription-card"><a href="/product/${encodeURIComponent(x.slug)}" class="card-link"><div class="product-image-container"><img src="${esc(abs(m))}" alt="${esc(x.name)}" class="product-image" loading="lazy"></div><div class="p-3"><h3 class="font-bold text-base">${esc(x.name)}</h3><p class="text-xs text-gray-500 mb-2">${esc(x.description||'')}</p><div class="text-lg font-bold">${esc(money(pl?.price??x.price,x.currency||pl?.currency||'BDT'))}</div><span class="nls-btn-details text-sm">See Details <i class="fa-solid fa-arrow-right-long"></i></span></div></a></div>`;
        }).join('');
      } catch(e) { console.warn('Central related products unavailable',e); }
    }

    render();
    window.switchTab('description');
    patchRelated();
    if (typeof AOS !== 'undefined') setTimeout(() => AOS.refresh(), 100);
    [700,1600,3000].forEach(ms => setTimeout(() => { if(window.__NLS_CENTRAL_PRODUCT__ === p) { render(); patchRelated(); } }, ms));
  };

  start();
})();
