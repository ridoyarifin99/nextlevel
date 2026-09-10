"use strict";
/* Compatibility facade: every product value is sourced from NLSCentralCatalog. */
(function(){
  const boot=()=>{const c=window.NLSCentralCatalog;if(!c)return;window.NextLevelSubs=window.NextLevelSubs||{};window.NextLevelSubs.subscriptions=c.products;window.NextLevelSubs.getProductBySlug=c.getBySlug;window.products=c.products;window.dispatchEvent(new CustomEvent("nextlevel:products-updated",{detail:{products:c.products}}));};
  if(window.NLSCentralCatalog)boot();else window.addEventListener("nls:central-catalog-ready",boot,{once:true});
})();
