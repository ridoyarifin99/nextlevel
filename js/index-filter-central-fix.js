"use strict";
(function(){
  if(window.__NLSIndexFilterCentralFix)return;
  window.__NLSIndexFilterCentralFix=true;
  const products=()=>Array.isArray(window.NLSCentralCatalog?.products)?window.NLSCentralCatalog.products:[];
  const price=p=>{const plans=Array.isArray(p?.product_plans)?p.product_plans.filter(x=>x&&x.is_available!==false):[];return Number(plans[0]?.price??p?.price??0)};
  const sync=()=>{
    const min=document.getElementById("minPrice"),max=document.getElementById("maxPrice");
    if(!min||!max)return;
    const values=products().filter(p=>p&&p.is_available!==false&&p.is_archived!==true).map(price).filter(Number.isFinite);
    const catalogMax=Math.max(0,...values);
    if(catalogMax<=0)return;
    const currentMax=Number(max.value||0);
    max.min=0;max.max=catalogMax;
    min.min=0;min.max=catalogMax;
    if(!currentMax||currentMax<=0||currentMax>catalogMax)max.value=catalogMax;
    if(Number(min.value||0)>catalogMax)min.value=0;
    if(Number(min.value||0)>Number(max.value||catalogMax))min.value=max.value;
    const minLabel=document.getElementById("minPriceValue"),maxLabel=document.getElementById("maxPriceValue");
    if(minLabel)minLabel.textContent=`৳${Number(min.value||0).toLocaleString("en-BD")}`;
    if(maxLabel)maxLabel.textContent=`৳${Number(max.value||catalogMax).toLocaleString("en-BD")}`;
    min.dispatchEvent(new Event("input",{bubbles:true}));
  };
  window.addEventListener("nls:central-catalog-ready",sync);
  window.addEventListener("nextlevel:products-updated",sync);
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",sync,{once:true});else sync();
})();
