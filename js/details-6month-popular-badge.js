"use strict";
/* NEXT LEVEL SUBS — reliably mark every 6-month plan as Most Popular. */
(function(){
  if(window.__NLS6MonthPopularBadgeV2)return;
  window.__NLS6MonthPopularBadgeV2=true;

  const STYLE_ID="nls-most-popular-badge-style-v2";
  const installStyle=()=>{
    if(document.getElementById(STYLE_ID))return;
    const style=document.createElement("style");
    style.id=STYLE_ID;
    style.textContent=`
      .nls-most-popular-badge{position:absolute!important;top:9px!important;right:9px!important;z-index:20!important;display:inline-flex!important;align-items:center!important;justify-content:center!important;min-height:22px!important;padding:5px 10px!important;border-radius:999px!important;background:linear-gradient(135deg,#f59e0b,#ef4444)!important;color:#fff!important;font:800 11px/1 Inter,system-ui,sans-serif!important;letter-spacing:.02em!important;white-space:nowrap!important;box-shadow:0 4px 12px rgba(239,68,68,.22)!important;pointer-events:none!important;visibility:visible!important;opacity:1!important}
      .plan-card{position:relative!important}
      @media(max-width:520px){.nls-most-popular-badge{top:7px!important;right:7px!important;padding:4px 8px!important;font-size:10px!important}}
    `;
    document.head.appendChild(style);
  };
  const norm=v=>String(v??"").replace(/\s+/g," ").trim().toLowerCase();
  const isSixMonth=card=>{
    if(!card)return false;
    const values=[card.getAttribute("data-duration"),card.getAttribute("data-plan-duration"),card.dataset?.duration,card.dataset?.planDuration,card.querySelector("[data-duration]")?.getAttribute("data-duration"),card.textContent];
    return values.some(v=>{const t=norm(v);return /(^|\D)6\s*(?:month|months|mo)\b/.test(t)||/\b6\s*[-/]\s*(?:month|months|mo)\b/.test(t)});
  };
  const cards=()=>[...document.querySelectorAll("#productDetails .plan-card, .plan-card, #productDetails [data-plan-card]")];
  const apply=()=>{
    const list=cards();
    list.forEach(card=>{
      const old=card.querySelector("[data-nls-most-popular]");
      if(!isSixMonth(card)){old?.remove();return;}
      if(old)return;
      const badge=document.createElement("span");
      badge.dataset.nlsMostPopular="1";
      badge.className="nls-most-popular-badge";
      badge.textContent="Most Popular";
      badge.setAttribute("aria-label","Most Popular 6-month plan");
      card.style.position="relative";
      card.insertBefore(badge,card.firstChild);
    });
  };
  const boot=()=>{
    installStyle();
    apply();
    const root=document.getElementById("productDetails")||document.body;
    if(!root.dataset.nlsPopularObserver){
      root.dataset.nlsPopularObserver="1";
      new MutationObserver(()=>requestAnimationFrame(apply)).observe(root,{childList:true,subtree:true});
    }
    window.addEventListener("nls:central-catalog-ready",apply);
    window.addEventListener("nextlevel:products-updated",apply);
    [150,500,1000,2000,3500].forEach(ms=>setTimeout(apply,ms));
  };
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",boot,{once:true});else boot();
})();
