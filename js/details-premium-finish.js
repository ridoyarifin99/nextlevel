"use strict";
(() => {
  if (!/\/details\.html$/i.test(location.pathname) && !/\/product\//i.test(location.pathname)) return;
  if (window.__NLSDetailsPremiumFinish) return;
  window.__NLSDetailsPremiumFinish = true;

  const STYLE_ID = "nls-details-premium-finish";
  const css = `
    /* Final premium Details pass — presentation only; central catalog and existing markup remain authoritative. */
    #productDetails{position:relative}
    #productDetails > *{transition:filter .35s ease,transform .45s cubic-bezier(.16,1,.3,1)}

    /* Product hero surfaces */
    #productDetails .bg-white,
    #productDetails [class*="bg-white"]{
      border-color:rgba(226,232,240,.72)!important;
      box-shadow:0 14px 45px rgba(15,23,42,.055)!important;
    }
    #productDetails img{transition:transform .55s cubic-bezier(.16,1,.3,1),filter .35s ease}
    #productDetails img:hover{transform:scale(1.025);filter:saturate(1.04)}

    /* Premium tab rail */
    main .mt-12.bg-white.rounded-2xl.shadow-md.overflow-hidden{
      border-radius:24px!important;
      border:1px solid rgba(226,232,240,.8)!important;
      box-shadow:0 20px 60px rgba(15,23,42,.075),0 4px 16px rgba(106,17,203,.035)!important;
      overflow:hidden!important;
    }
    main .mt-12.bg-white.rounded-2xl.shadow-md.overflow-hidden > .border-b{
      padding:6px!important;
      background:linear-gradient(180deg,rgba(248,250,252,.92),rgba(255,255,255,.96))!important;
    }
    main .mt-12.bg-white.rounded-2xl.shadow-md.overflow-hidden > .border-b > div{
      gap:4px!important;
      padding:0!important;
      scrollbar-width:none;
    }
    main .mt-12.bg-white.rounded-2xl.shadow-md.overflow-hidden > .border-b > div::-webkit-scrollbar{display:none}
    #tabContent{animation:nlsTabContentIn .45s cubic-bezier(.16,1,.3,1) both}
    @keyframes nlsTabContentIn{from{opacity:0;transform:translateY(7px)}to{opacity:1;transform:none}}

    /* Premium pricing table treatment */
    #productDetails table{isolation:isolate}
    #productDetails table thead th:first-child{border-top-left-radius:19px}
    #productDetails table thead th:last-child{border-top-right-radius:19px}
    #productDetails table tbody tr:last-child td:first-child{border-bottom-left-radius:19px}
    #productDetails table tbody tr:last-child td:last-child{border-bottom-right-radius:19px}
    #productDetails table tbody tr{position:relative}
    #productDetails table tbody tr:hover td:first-child{box-shadow:inset 3px 0 0 rgba(106,17,203,.65)}
    #productDetails table tbody tr:focus-within td{background:rgba(106,17,203,.045)!important}
    #productDetails table td:last-child{white-space:nowrap}
    #productDetails table td .price,
    #productDetails table td [class*="price"]{font-size:1.05em!important}

    /* Badges and status labels */
    #productDetails .badge,
    #productDetails [class*="badge"]{transition:transform .3s cubic-bezier(.16,1,.3,1),box-shadow .3s ease}
    #productDetails .badge:hover,
    #productDetails [class*="badge"]:hover{transform:translateY(-1px);box-shadow:0 6px 16px rgba(106,17,203,.12)}

    /* Keyboard accessibility */
    #productDetails button:focus-visible,
    #productDetails a:focus-visible,
    .mt-12 button.tab-button:focus-visible{
      outline:3px solid rgba(37,117,252,.28)!important;
      outline-offset:3px!important;
    }

    /* Mobile premium behavior */
    @media(max-width:800px){
      main .mt-12.bg-white.rounded-2xl.shadow-md.overflow-hidden{border-radius:18px!important}
      main .mt-12.bg-white.rounded-2xl.shadow-md.overflow-hidden > .border-b{padding:5px!important}
      #tabContent{padding-top:2px}
    }
    @media(max-width:520px){
      #productDetails table{box-shadow:0 12px 32px rgba(15,23,42,.055)!important}
      #productDetails img:hover{transform:none}
    }
    @media(prefers-reduced-motion:reduce){
      #productDetails *, #tabContent{animation-duration:.001ms!important;transition-duration:.001ms!important}
    }
  `;

  function inject(){
    if(document.getElementById(STYLE_ID)) return;
    const style=document.createElement("style");
    style.id=STYLE_ID;
    style.textContent=css;
    document.head.appendChild(style);
  }

  let lastTabHTML="";
  function refreshTabAnimation(){
    const content=document.getElementById("tabContent");
    if(!content) return;
    const html=content.innerHTML;
    if(html===lastTabHTML) return;
    lastTabHTML=html;
    content.style.animation="none";
    void content.offsetWidth;
    content.style.animation="";
  }

  function polish(){
    inject();
    refreshTabAnimation();
  }

  function start(){
    polish();
    let queued=false;
    const observer=new MutationObserver(()=>{
      if(queued) return;
      queued=true;
      requestAnimationFrame(()=>{queued=false;polish();});
    });
    observer.observe(document.body,{childList:true,subtree:true});
    document.addEventListener("click",event=>{
      if(event.target.closest(".tab-button,.tab-btn")){
        lastTabHTML="";
        requestAnimationFrame(polish);
      }
    },true);
    window.addEventListener("nls:central-catalog-ready",polish);
    window.addEventListener("nextlevel:products-updated",polish);
  }

  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",start,{once:true});
  else start();
})();
