"use strict";
/* NEXT LEVEL SUBS — related cards keep the same card/action pattern as index.html. */
(function(){
  if(!/\/details\.html$/i.test(location.pathname)&&!/\/product\//i.test(location.pathname))return;
  if(window.__NLSRelatedCardsFix)return;window.__NLSRelatedCardsFix=true;
  const esc=v=>String(v??"").replace(/[&<>\"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#039;'}[c]));
  const abs=u=>{try{return new URL(u,location.origin).href}catch{return u||""}};
  const money=v=>`৳${Number(v||0).toLocaleString('en-BD',{maximumFractionDigits:2})}`;
  function addRelated(e,product,plan){
    e.preventDefault();e.stopPropagation();
    let cart=[];try{cart=JSON.parse(localStorage.getItem('streamHubCart')||'[]');if(!Array.isArray(cart))cart=[]}catch{}
    const item={...product,product_id:product.id,product_slug:product.slug,selectedPlan:plan?{...plan,product_id:product.id}:undefined,plan_id:plan?.id||null,price:Number(plan?.price??product.price??0),quantity:1,image:product.image||product.logo||""};
    const i=cart.findIndex(x=>x.product_id===item.product_id||x.slug===item.slug);if(i>=0)cart[i]=item;else cart.push(item);
    localStorage.setItem('streamHubCart',JSON.stringify(cart));
    window.dispatchEvent(new CustomEvent('nextlevel:checkout-cart-updated',{detail:{cart}}));
    const m=document.getElementById('successModal');if(m)m.classList.remove('hidden');
  }
  function render(){
    const c=window.NLSCentralCatalog,root=document.getElementById('relatedProducts');if(!c?.products?.length||!root)return;
    const current=window.__NLS_CENTRAL_PRODUCT__;
    const products=c.products.filter(x=>x&&x.id!==current?.id&&!x.is_archived&&x.is_available!==false).slice(0,5);
    if(!products.length)return;
    root.innerHTML=products.map(p=>{
      const media=Array.isArray(p.product_media)?p.product_media.filter(x=>x&&x.is_active!==false):[];
      const image=media.find(x=>x.role==='primary')?.url||p.image||p.image_url||p.logo||'';
      const plans=(p.product_plans||[]).filter(x=>x&&x.is_available!==false).sort((a,b)=>(a.display_order||0)-(b.display_order||0));
      const plan=plans[0];
      return `<div class="subscription-card" data-product-slug="${esc(p.slug)}" data-product-id="${esc(p.id)}"><div class="card-link"><a href="/product/${encodeURIComponent(p.slug)}" class="related-card-main"><div class="product-image-container"><img src="${esc(abs(image))}" alt="${esc(p.name)}" class="product-image" loading="lazy"></div><div class="p-3"><h3 class="font-bold text-base">${esc(p.name)}</h3><p class="text-xs text-gray-500 mb-2">${esc(p.description||'')}</p><div class="text-2xl font-bold">${esc(money(plan?.price??p.price))}</div></a><div class="related-card-actions"><button type="button" class="add-to-cart-btn" aria-label="Add ${esc(p.name)} to cart"><i class="fa-regular fa-cart-circle-plus"></i><span>Add to Cart</span></button><a href="/product/${encodeURIComponent(p.slug)}" class="nls-btn-details" aria-label="See details for ${esc(p.name)}">See Details <i class="fa-solid fa-arrow-right-long"></i></a></div></div></div></div>`;
    }).join('');
    root.querySelectorAll('.subscription-card').forEach(card=>{
      const p=c.getById(card.dataset.productId)||c.getBySlug(card.dataset.productSlug);if(!p)return;
      const plan=(p.product_plans||[]).filter(x=>x&&x.is_available!==false).sort((a,b)=>(a.display_order||0)-(b.display_order||0))[0];
      card.querySelector('.add-to-cart-btn')?.addEventListener('click',e=>addRelated(e,p,plan));
    });
  }
  function boot(){render();window.addEventListener('nls:central-catalog-ready',render);window.addEventListener('nextlevel:products-updated',render);[500,1200,2500].forEach(ms=>setTimeout(render,ms));}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
