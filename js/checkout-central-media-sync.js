"use strict";
/* NEXT LEVEL SUBS — checkout product media must always come from the central catalog. */
(function(){
  if(window.__NLSCheckoutCentralMediaSync)return;
  window.__NLSCheckoutCentralMediaSync=true;
  const CART="streamHubCart";
  const readCart=()=>{try{const v=JSON.parse(localStorage.getItem(CART)||"[]");return Array.isArray(v)?v:[]}catch{return[]}};
  const clean=v=>String(v??"").trim();
  const abs=v=>{try{return new URL(v,location.origin).href}catch{return clean(v)}};
  const products=()=>window.NLSCentralCatalog?.products||[];
  const findProduct=item=>{const key=clean(item?.slug||item?.product_slug).toLowerCase();const name=clean(item?.name).toLowerCase();return products().find(p=>clean(p.slug).toLowerCase()===key)||products().find(p=>clean(p.name).toLowerCase()===name)||null};
  const centralLogo=p=>clean(p?.logo||p?.product_logo||p?.image);
  function summaryImages(){
    const roots=[
      ...document.querySelectorAll("#orderSummary,.order-summary,.order-summary-card,.checkout-order-summary,.cart-summary,.summary-items,.order-items")
    ];
    const imgs=[];
    roots.forEach(root=>root.querySelectorAll("img").forEach(img=>{if(!imgs.includes(img))imgs.push(img)}));
    if(imgs.length)return imgs;
    return Array.from(document.querySelectorAll("img")).filter(img=>{
      if(img.classList.contains("logo-image"))return false;
      if(img.closest(".checkout-header,.payment-method,.payment-method-grid"))return false;
      const r=img.getBoundingClientRect();
      return r.width>20&&r.height>20;
    });
  }
  function apply(){
    const cart=readCart();if(!cart.length)return;
    const imgs=summaryImages();
    cart.forEach((item,index)=>{
      const p=findProduct(item);if(!p)return;
      const logo=centralLogo(p);if(!logo)return;
      let img=imgs[index];
      if(!img){
        const name=clean(p.name).toLowerCase();
        const candidates=Array.from(document.querySelectorAll("img")).filter(x=>!x.closest(".checkout-header,.payment-method,.payment-method-grid")&&!x.classList.contains("logo-image"));
        img=candidates.find(x=>clean(x.alt).toLowerCase()===name);
      }
      if(!img)return;
      const url=abs(logo);
      if(img.src!==url){img.src=url;img.removeAttribute("srcset");img.removeAttribute("data-src");}
      img.dataset.nlsCentralLogo="true";
      img.alt=p.name||item.name||"Product";
    });
  }
  function boot(){
    apply();
    window.addEventListener("nls:central-catalog-ready",apply);
    window.addEventListener("nextlevel:products-updated",apply);
    window.addEventListener("nextlevel:checkout-cart-updated",()=>setTimeout(apply,0));
    const observer=new MutationObserver(()=>apply());
    observer.observe(document.body,{childList:true,subtree:true});
    setInterval(apply,1000);
  }
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",boot,{once:true});else boot();
})();
