"use strict";
/* NEXT LEVEL SUBS — live central catalog propagation across every storefront surface. */
(function(){
  if(window.__NLSCentralLiveSync)return;
  window.__NLSCentralLiveSync=true;
  const path=String(location.pathname||"").toLowerCase();
  const isDetails=/\/details\.html$/.test(path)||/\/product\//.test(path);
  const isIndex=/\/(index)?$/.test(path)||/\/index\.html$/.test(path);
  const isCheckout=/\/checkout\.html$/.test(path);
  const isDashboard=/\/dashboard\.html$/.test(path);
  const isAdminOrders=/\/admin-orders\.html$/.test(path);
  const productSignature=p=>p?JSON.stringify({id:p.id,slug:p.slug,name:p.name,image:p.image,logo:p.logo,plans:(p.product_plans||[]).map(x=>({id:x.id,name:x.name,duration:x.duration,price:x.price,available:x.is_available})),media:(p.product_media||[]).filter(x=>x&&x.is_active!==false).map(x=>({id:x.id,role:x.role,url:x.url,order:x.display_order}))}):"";
  const currentProduct=()=>{const all=window.NLSCentralCatalog?.products||[];const m=location.pathname.match(/\/product\/([^/?#]+)/i);const key=decodeURIComponent(m?.[1]||new URLSearchParams(location.search).get("name")||"");if(!key)return null;return all.find(p=>String(p.slug||"").toLowerCase()===key.toLowerCase()||String(p.name||"").toLowerCase()===key.toLowerCase())||null;};
  function refreshCartUI(){try{["renderCart","renderCartDrawer","updateCartUI","updateCartCount","renderOrderSummary","updateOrderSummary","calculateTotals"].forEach(name=>{if(typeof window[name]==="function"){try{window[name]()}catch(e){}}});window.dispatchEvent(new CustomEvent("nextlevel:central-live-updated"));}catch(e){}}
  let lastCatalog="",lastCurrentProduct="";
  function handleCatalog(products){
    const catalogSig=JSON.stringify((products||[]).map(p=>p.id).sort());
    const currentSig=productSignature(currentProduct());
    const catalogChanged=!!lastCatalog&&lastCatalog!==catalogSig;
    const currentChanged=!!lastCurrentProduct&&lastCurrentProduct!==currentSig;
    lastCatalog=catalogSig;lastCurrentProduct=currentSig;
    if(isCheckout||isDashboard||isAdminOrders)refreshCartUI();
    if(isDetails&&currentChanged&&currentSig){const key=`nls:details-live:${location.href}`,seen=sessionStorage.getItem(key);if(seen!==currentSig){sessionStorage.setItem(key,currentSig);location.reload();}}
    if(isIndex&&catalogChanged){const key=`nls:index-live:${location.pathname}`,seen=sessionStorage.getItem(key);if(seen!==catalogSig){sessionStorage.setItem(key,catalogSig);location.reload();}}
  }
  function subscribe(){const db=window.supabaseClient;if(!db?.channel)return;const channel=db.channel("nls-central-catalog-live").on("postgres_changes",{event:"*",schema:"public",table:"products"},()=>window.NLSCentralCatalogRefresh?.()).on("postgres_changes",{event:"*",schema:"public",table:"product_plans"},()=>window.NLSCentralCatalogRefresh?.()).on("postgres_changes",{event:"*",schema:"public",table:"product_media"},()=>window.NLSCentralCatalogRefresh?.());channel.subscribe(status=>{if(status==="CHANNEL_ERROR"||status==="TIMED_OUT")setTimeout(subscribe,3000);});}
  function boot(){const apply=()=>handleCatalog(window.NLSCentralCatalog?.products||[]);apply();window.addEventListener("nls:central-catalog-ready",apply);window.addEventListener("nextlevel:products-updated",apply);subscribe();}
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",boot,{once:true});else boot();
})();
