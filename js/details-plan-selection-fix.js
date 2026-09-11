"use strict";
/* Keep details-page plan selection valid even when a product has fewer than three plans. */
(function(){
  const apply=()=>{
    const root=document.getElementById("productDetails");
    if(!root)return;
    const cards=[...root.querySelectorAll(".plan-card")];
    if(!cards.length)return;
    if(!cards.some(c=>c.classList.contains("selected")))cards[0].click();
  };
  const boot=()=>{
    const root=document.getElementById("productDetails");
    if(!root||root.dataset.nlsPlanFix==="1")return;
    root.dataset.nlsPlanFix="1";
    new MutationObserver(()=>requestAnimationFrame(apply)).observe(root,{childList:true,subtree:true});
    setTimeout(apply,500);
    setTimeout(apply,1500);
  };
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",boot,{once:true});else boot();
})();
