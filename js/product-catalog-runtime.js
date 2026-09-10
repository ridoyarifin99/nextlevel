"use strict";
/* Compatibility facade: legacy page UI stays unchanged; all product data comes from NLSCentralCatalog. */
(function(){
  const boot=()=>{
    const c=window.NLSCentralCatalog;
    if(!c)return;
    window.NextLevelSubs=window.NextLevelSubs||{};
    window.NextLevelSubs.subscriptions=c.products||[];
    window.NextLevelSubs.getProductBySlug=c.getBySlug;
    window.products=c.products||[];
    window.getProducts=()=>window.NLSCentralCatalog?.products||window.NextLevelSubs?.subscriptions||[];
    window.NextLevelSubs.getProducts=window.getProducts;
    window.dispatchEvent(new CustomEvent("nextlevel:products-updated",{detail:{products:window.getProducts()}}));
  };
  if(window.NLSCentralCatalog)boot();
  else window.addEventListener("nls:central-catalog-ready",boot,{once:true});
})();
