"use strict";
/* NEXT LEVEL SUBS — resilient 6-month Most Popular badge for dynamically rendered plans. */
(function(){
  if(window.__NLS6MonthPopularBadgeV3)return;
  window.__NLS6MonthPopularBadgeV3=true;
  const STYLE_ID="nls-most-popular-badge-style-v3";
  const norm=v=>String(v??"").replace(/\s+/g," ").trim().toLowerCase();
  const six=t=>{t=norm(t);return /(^|\D)6\s*(?:month|months|mo)\b/.test(t)||/\b6\s*[-/]\s*(?:month|months|mo)\b/.test(t)};
  const style=()=>{if(document.getElementById(STYLE_ID))return;const s=document.createElement("style");s.id=STYLE_ID;s.textContent=`
    .nls-most-popular-badge{position:absolute!important;top:8px!important;right:8px!important;z-index:2147483000!important;display:inline-flex!important;align-items:center!important;justify-content:center!important;min-height:23px!important;padding:5px 10px!important;border-radius:999px!important;background:linear-gradient(135deg,#f59e0b,#ef4444)!important;color:#fff!important;font:800 11px/1 Inter,system-ui,-apple-system,sans-serif!important;letter-spacing:.02em!important;white-space:nowrap!important;box-shadow:0 5px 14px rgba(239,68,68,.24)!important;pointer-events:none!important;visibility:visible!important;opacity:1!important}
    .nls-six-month-plan-card{position:relative!important;overflow:visible!important}
    @media(max-width:520px){.nls-most-popular-badge{top:6px!important;right:6px!important;padding:4px 8px!important;font-size:10px!important}}
  `;document.head.appendChild(s)};
  const root=()=>document.getElementById("productDetails")||document.body;
  const candidates=()=>[...root().querySelectorAll(".plan-card,[data-plan-card],[data-duration],[data-plan-duration],button,[role=button]")];
  const cardFor=el=>{
    if(!el)return null;
    if(el.matches(".plan-card,[data-plan-card]"))return el;
    let p=el;
    for(let i=0;i<5&&p&&p!==root();i++,p=p.parentElement){
      if(p.matches(".plan-card,[data-plan-card]"))return p;
      const cls=String(p.className||"").toLowerCase();
      if(/plan|pricing|subscription|duration/.test(cls)&&p.children.length<=20)return p;
    }
    return el.parentElement;
  };
  const apply=()=>{
    style();
    const r=root(), found=new Set();
    candidates().forEach(el=>{
      const attrs=[el.getAttribute("data-duration"),el.getAttribute("data-plan-duration"),el.dataset?.duration,el.dataset?.planDuration,el.textContent];
      if(!attrs.some(six))return;
      const card=cardFor(el);if(!card||card===r)return;
      found.add(card);
    });
    r.querySelectorAll("[data-nls-most-popular]").forEach(b=>{if(!found.has(b.parentElement))b.remove()});
    found.forEach(card=>{
      card.classList.add("nls-six-month-plan-card");
      if(card.querySelector("[data-nls-most-popular]"))return;
      const badge=document.createElement("span");badge.dataset.nlsMostPopular="1";badge.className="nls-most-popular-badge";badge.textContent="Most Popular";badge.setAttribute("aria-label","Most Popular 6-month plan");card.insertBefore(badge,card.firstChild);
    });
  };
  const boot=()=>{
    style();apply();
    const r=root();
    if(!r.dataset.nlsPopularObserver){r.dataset.nlsPopularObserver="1";new MutationObserver(()=>requestAnimationFrame(apply)).observe(r,{childList:true,subtree:true})}
    window.addEventListener("nls:central-catalog-ready",apply);window.addEventListener("nextlevel:products-updated",apply);
    [100,300,700,1200,2000,3500].forEach(ms=>setTimeout(apply,ms));
  };
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",boot,{once:true});else boot();
})();
