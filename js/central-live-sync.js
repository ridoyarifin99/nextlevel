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
  const signature=products=>JSON.stringify((products||[]).map(p=>({id:p.id,slug:p.slug,name:p.name,image:p.image,logo:p.logo,plans:(p.product_plans||[]).map(x=>({id:x.id,duration:x.duration,price:x.price,available:x.is_available})),media:(p.product_media||[]).filter(x=>x&&x.is_active!==false).map(x=>({id:x.id,role:x.role,url:x.url}))})));
  const currentProduct=()=>{
    const all=window.NLSCentralCatalog?.products||[];
    const m=location.pathname.match(/\/product\/([^/?#]+)/i);
    const key=decodeURIComponent(m?.[1]||new URLSearchParams(location.search).get("name")||"");
    if(!key)return null;
    return all.find(p=>String(p.slug||"").toLowerCase()===key.toLowerCase()||String(p.name||"").toLowerCase()===key.toLowerCase())||null;
  };

  function refreshCartUI(){
    try{
      const fns=["renderCart","renderCartDrawer","updateCartUI","updateCartCount","renderOrderSummary","updateOrderSummary","calculateTotals"];
      fns.forEach(name=>{if(typeof window[name]==="function"){try{window[name]()}catch(e){}}});
      window.dispatchEvent(new CustomEvent("nextlevel:central-live-updated"));
    }catch(e){}
  }

  let lastPublished="";
  function handleCatalog(products){
    const sig=signature(products);
    const previous=lastPublished;
    lastPublished=sig;
    if(isCheckout||isDashboard||isAdminOrders)refreshCartUI();

    if(isDetails&&previous&&previous!==sig){
      const p=currentProduct();
      if(p){
        const key=`nls:details-live:${location.href}`;
        const seen=sessionStorage.getItem(key);
        if(seen!==sig){
          sessionStorage.setItem(key,sig);
          location.reload();
        }
      }
    }

    if(isIndex&&previous&&previous!==sig){
      const oldIds=(JSON.parse(previous)||[]).map(x=>x.id).sort().join(",");
      const newIds=(products||[]).map(x=>x.id).sort().join(",");
      if(oldIds!==newIds){
        const key=`nls:index-live:${location.pathname}`;
        const seen=sessionStorage.getItem(key);
        if(seen!==sig){sessionStorage.setItem(key,sig);location.reload();}
      }
    }
  }

  function subscribe(){
    const db=window.supabaseClient;
    if(!db?.channel)return;
    const channel=db.channel("nls-central-catalog-live")
      .on("postgres_changes",{event:"*",schema:"public",table:"products"},()=>window.NLSCentralCatalogRefresh?.())
      .on("postgres_changes",{event:"*",schema:"public",table:"product_plans"},()=>window.NLSCentralCatalogRefresh?.())
      .on("postgres_changes",{event:"*",schema:"public",table:"product_media"},()=>window.NLSCentralCatalogRefresh?.());
    channel.subscribe(status=>{if(status==="CHANNEL_ERROR"||status==="TIMED_OUT")setTimeout(subscribe,3000);});
  }

  function boot(){
    const apply=()=>handleCatalog(window.NLSCentralCatalog?.products||[]);
    apply();
    window.addEventListener("nls:central-catalog-ready",apply);
    window.addEventListener("nextlevel:products-updated",apply);
    subscribe();
  }

  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",boot,{once:true});else boot();
})();
