"use strict";
/* NEXT LEVEL SUBS — related cards use the same visual/action pattern as index.html. */
(function(){
  if(!/\/details\.html$/i.test(location.pathname)&&!/\/product\//i.test(location.pathname))return;
  if(window.__NLSRelatedCardsFix)return;window.__NLSRelatedCardsFix=true;
  const esc=v=>String(v??"").replace(/[&<>\"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#039;'}[c]));
  const abs=u=>{try{return new URL(u,location.origin).href}catch{return u||""}};
  const rating=p=>{if(Number(p.rating)>0)return Number(p.rating).toFixed(1);let h=0,s=String(p.slug||p.name||'');for(let i=0;i<s.length;i++)h=(h*31+s.charCodeAt(i))|0;return Math.min(5,4+Math.abs(h%21)/10).toFixed(1)};
  const cartAdd=(e,p,plan,card)=>{e.preventDefault();e.stopPropagation();let cart=[];try{cart=JSON.parse(localStorage.getItem('streamHubCart')||'[]');if(!Array.isArray(cart))cart=[]}catch{};const old=cart.find(x=>x.slug===p.slug||x.product_id===p.id);if(old){old.quantity=(Number(old.quantity)||1)+1}else cart.push({...p,product_id:p.id,product_slug:p.slug,selectedPlan:plan?{...plan,product_id:p.id}:undefined,plan_id:plan?.id||null,price:Number(plan?.price??p.price??0),duration:plan?.duration||plan?.name||p.duration||'month',quantity:1,image:p.image||p.logo||''});localStorage.setItem('streamHubCart',JSON.stringify(cart));window.dispatchEvent(new CustomEvent('nextlevel:checkout-cart-updated',{detail:{cart}}));if(typeof window.flyToCart==='function')window.flyToCart(card.querySelector('.product-image'));if(typeof window.showNotif==='function')window.showNotif(`${p.name}${old?' quantity updated in cart':' added to cart'}`);const m=document.getElementById('successModal');if(m)m.classList.remove('hidden');};
  function render(){
    const c=window.NLSCentralCatalog,root=document.getElementById('relatedProducts');if(!c?.products?.length||!root)return;
    const current=window.__NLS_CENTRAL_PRODUCT__;
    const products=c.products.filter(p=>p&&p.id!==current?.id&&!p.is_archived&&p.is_available!==false).slice(0,5);
    if(!products.length)return;
    root.innerHTML=products.map((p,idx)=>{
      const media=Array.isArray(p.product_media)?p.product_media.filter(x=>x&&x.is_active!==false):[];
      const image=media.find(x=>x.role==='primary')?.url||p.image||p.image_url||p.logo||'';
      const plans=(p.product_plans||[]).filter(x=>x&&x.is_available!==false).sort((a,b)=>(a.display_order||0)-(b.display_order||0));
      const plan=plans[0];
      const price=Number(plan?.price??p.price??0);
      const duration=plan?.duration||plan?.name||p.duration||'month';
      const cats=Array.isArray(p.product_categories)?p.product_categories.map(x=>String(x.slug||x.name||'').toLowerCase()):Array.isArray(p.categories)?p.categories.map(x=>String(x).toLowerCase()):[];
      const best=cats.includes('best-selling')||cats.includes('best_selling');
      const combo=cats.includes('combo')||cats.includes('combos');
      let services=p.services;
      if(!Array.isArray(services)&&Array.isArray(p.extra_data?.services))services=p.extra_data.services;
      let serviceIcons=p.serviceIcons||p.service_icons||p.extra_data?.serviceIcons||p.extra_data?.service_icons;
      let serviceColors=p.serviceColors||p.service_colors||p.extra_data?.serviceColors||p.extra_data?.service_colors;
      let servicesHtml='';
      if(Array.isArray(services)&&Array.isArray(serviceIcons)&&Array.isArray(serviceColors)){
        servicesHtml='<div class="combo-services mt-2">';
        services.forEach((sv,i)=>{const icon=serviceIcons[i]||'fas fa-circle',color=serviceColors[i]||p.color||'#6a11cb';servicesHtml+=`<div class="flex items-center"><div class="combo-service-icon mr-1"><i class="${esc(icon)}" style="color:${esc(color)};font-size:12px;"></i></div><span class="text-xs">${esc(sv)}</span></div>`});
        servicesHtml+='</div>';
      }
      const imageHtml=image?`<img src="${esc(abs(image))}" alt="${esc(p.name)}" class="product-image" loading="lazy" decoding="async">`:`<i class="${esc(p.icon||'fas fa-shield-alt')} product-icon"></i>`;
      const badge=best?'<span class="best-seller-badge">BEST SELLER</span>':(combo?'<span class="combo-badge">COMBO</span>':'');
      return `<div class="subscription-card ${combo?'combo-card':''}" data-product-slug="${esc(p.slug)}" data-product-id="${esc(p.id)}" data-aos="fade-up" data-aos-delay="${idx*50}">${badge}<a href="/product/${encodeURIComponent(p.slug)}" class="card-link" aria-label="View ${esc(p.name)}"><div class="product-image-container">${imageHtml}</div><div class="p-3 sm:p-4"><h3 class="font-bold text-base sm:text-lg leading-tight mb-1">${esc(p.name)}</h3><p class="text-xs text-gray-500 mb-3 line-clamp-2" style="display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;">${esc(p.description||'')}</p>${servicesHtml}<div class="flex justify-between items-center mb-3"><div><span class="text-lg sm:text-xl font-bold">৳${price}</span><span class="text-xs text-gray-500">/${esc(duration)}</span></div><div class="flex items-center text-xs"><i class="fas fa-star text-yellow-400"></i><span class="ml-1 text-gray-600">${rating(p)}</span></div></div><div class="flex flex-col gap-2"><button type="button" class="w-full py-1.5 sm:py-2 rounded-lg font-medium text-white text-sm btn-primary" data-add-cart="${esc(p.name)}">Add to Cart</button><span class="nls-btn-details text-sm">See Details <i class="fa-solid fa-arrow-right-long"></i></span></div></div></a></div>`;
    }).join('');
    root.querySelectorAll('.subscription-card').forEach(card=>{const p=c.getById(card.dataset.productId)||c.getBySlug(card.dataset.productSlug);if(!p)return;const plan=(p.product_plans||[]).filter(x=>x&&x.is_available!==false).sort((a,b)=>(a.display_order||0)-(b.display_order||0))[0];card.querySelector('[data-add-cart]')?.addEventListener('click',e=>cartAdd(e,p,plan,card));});
    if(typeof AOS!=='undefined')AOS.refresh();
  }
  function ensure(){const root=document.getElementById('relatedProducts');if(!root)return;if(!root.querySelector('[data-add-cart]'))render();}
  function boot(){render();window.addEventListener('nls:central-catalog-ready',render);window.addEventListener('nextlevel:products-updated',render);setInterval(ensure,400)}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
