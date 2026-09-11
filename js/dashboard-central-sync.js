"use strict";
/* Dashboard product identity/media/plan bridge — central catalog is authoritative. */
(function(){
  if(window.__NLSDashboardCentralSync)return; window.__NLSDashboardCentralSync=true;
  const slug=v=>String(v||"").toLowerCase().trim().replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"");
  const text=e=>String(e?.textContent||"").trim();
  const money=v=>`৳${Number(v||0).toLocaleString("en-BD")}`;
  const findProduct=(card)=>{
    const nameEl=card.querySelector(".subscription-name");
    const name=text(nameEl);
    const all=window.NLSCentralCatalog?.products||[];
    return all.find(p=>slug(p.slug)===slug(card.dataset.productSlug))||all.find(p=>slug(p.name)===slug(name))||all.find(p=>String(p.name||"").toLowerCase()===name.toLowerCase())||null;
  };
  const apply=()=>{
    const products=window.NLSCentralCatalog?.products||[];
    if(!products.length)return;
    document.querySelectorAll(".subscription-card").forEach(card=>{
      const product=findProduct(card); if(!product)return;
      card.dataset.productSlug=product.slug||"";
      const nameEl=card.querySelector(".subscription-name");
      if(nameEl)nameEl.textContent=product.name||text(nameEl);

      const image=product.logo||product.image||"";
      const img=card.querySelector(".subscription-product-image");
      if(img&&image){
        if(img.tagName==="IMG"){img.src=image;img.removeAttribute("srcset");img.alt=product.name+" logo";img.style.display="";}
        else {img.outerHTML=`<img src="${String(image).replace(/&/g,"&amp;").replace(/\"/g,"&quot;")}" alt="${String(product.name||"").replace(/&/g,"&amp;").replace(/\"/g,"&quot;")}" class="subscription-product-image" loading="lazy">`;}
      }

      const plans=Array.isArray(product.product_plans)?product.product_plans.filter(p=>p?.is_available!==false):[];
      if(plans.length){
        const planId=String(card.dataset.planId||"");
        const planDuration=text(card.querySelector(".subscription-product-row > div > div:not(.subscription-name)"));
        const plan=plans.find(p=>planId&&String(p.id)===planId)||plans.find(p=>String(p.duration||p.name||"").toLowerCase()===planDuration.toLowerCase())||plans[0];
        const wrapper=nameEl?.parentElement;
        if(wrapper){
          let planEl=wrapper.querySelector("[data-nls-central-plan]");
          if(!planEl){planEl=document.createElement("div");planEl.dataset.nlsCentralPlan="true";planEl.style.cssText="margin-top:5px;color:var(--tl);font-size:.75rem;font-weight:600;";wrapper.appendChild(planEl);}
          planEl.textContent=plan.name||plan.duration||"Plan";
          planEl.title=`Current catalog price: ${money(plan.price)}`;
        }
        const priceEl=card.querySelector("[data-nls-dashboard-price],.subscription-price");
        if(priceEl&&!priceEl.dataset.nlsManualPrice)priceEl.textContent=money(plan.price);
      }
    });

    /* If a subscription detail modal is already open, update its catalog-facing fields too. */
    const modalTitle=document.getElementById("nlsModalTitle");
    if(modalTitle&&text(modalTitle)){
      const product=products.find(p=>slug(p.name)===slug(text(modalTitle))||slug(p.slug)===slug(text(modalTitle)));
      if(product){
        const plans=product.product_plans||[];
        const plan=plans.find(p=>p?.is_available!==false)||null;
        const values=[...document.querySelectorAll("#nlsModalBody .nls-detail-item")];
        values.forEach(item=>{
          const label=text(item.querySelector(".nls-detail-label")).toLowerCase();
          const value=item.querySelector(".nls-detail-value");
          if(!value)return;
          if(label==="product")value.textContent=product.name;
          if(label==="plan"&&plan)value.textContent=plan.name||plan.duration||"Plan";
          if(label==="price"&&plan)value.textContent=money(plan.price);
        });
      }
    }
  };
  const refresh=()=>{apply();};
  window.NLSDashboardCentralRefresh=refresh;
  const boot=()=>{
    apply();
    new MutationObserver(()=>requestAnimationFrame(apply)).observe(document.body,{childList:true,subtree:true});
    window.addEventListener("nls:central-catalog-ready",apply);
    window.addEventListener("nextlevel:products-updated",apply);
    setInterval(apply,2000);
  };
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",boot,{once:true});else boot();
})();
