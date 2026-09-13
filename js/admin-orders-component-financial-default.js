"use strict";
(function(){
  if(!/\/admin-orders\.html$/i.test(window.location.pathname))return;
  if(window.__NLSAdminOrdersComponentFinancialDefault)return;
  window.__NLSAdminOrdersComponentFinancialDefault=true;
  const install=()=>{
    if(typeof window.openComponent!=="function"||window.openComponent.__nlsComponentFinancialWrapped)return false;
    const original=window.openComponent;
    const wrapped=function(orderId,itemId,componentId){
      const result=original.apply(this,arguments);
      if(!componentId){
        const price=document.getElementById("cPrice");
        const hint=document.getElementById("priceHint");
        if(price)price.value="0";
        if(hint)hint.innerHTML="New delivery components are fulfillment records by default. Their price is ৳0.00 unless you intentionally enter an additional charge. Any non-zero component charge is added once to the order subtotal, 1.85% tax, current total, and paid revenue for paid orders.";
      }
      return result;
    };
    wrapped.__nlsComponentFinancialWrapped=true;
    window.openComponent=wrapped;
    return true;
  };
  const started=Date.now();
  const timer=setInterval(()=>{if(install()||Date.now()-started>10000)clearInterval(timer)},50);
})();
