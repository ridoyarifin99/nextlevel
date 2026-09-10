"use strict";
/* Dashboard product identity/media bridge — central catalog is authoritative. */
(function(){
  if(window.__NLSDashboardCentralSync)return; window.__NLSDashboardCentralSync=true;
  const slug=v=>String(v||"").toLowerCase().trim().replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"");
  const text=e=>String(e?.textContent||"").trim();
  const apply=()=>{
    const c=window.NLSCentralCatalog;if(!c?.products?.length)return;
    document.querySelectorAll(".subscription-card").forEach(card=>{
      const nameEl=card.querySelector(".subscription-name")||card.querySelector("h3,h4");
      const current=text(nameEl); const product=c.getBySlug(card.dataset.productSlug)||c.getByName(current)||c.products.find(p=>slug(p.name)===slug(current));
      if(!product)return;
      card.dataset.productSlug=product.slug;
      if(nameEl&&nameEl.textContent!==product.name)nameEl.textContent=product.name;
      const image=(product.logo||product.image||"");
      if(image){const img=card.querySelector("img");if(img){img.src=image;img.removeAttribute("srcset");img.alt=product.name+" logo";}}
      const price=product.product_plans?.[0]?.price??product.price;
      card.querySelectorAll("[data-product-price],.subscription-price").forEach(el=>{if(price!=null&&!el.dataset.nlsManualPrice)el.textContent=`৳${Number(price||0).toLocaleString("en-BD")}`;});
    });
  };
  const boot=()=>{apply();new MutationObserver(()=>requestAnimationFrame(apply)).observe(document.body,{childList:true,subtree:true});window.addEventListener("nls:central-catalog-ready",apply);window.addEventListener("nextlevel:products-updated",apply);setInterval(apply,5000)};
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",boot,{once:true});else boot();
})();
