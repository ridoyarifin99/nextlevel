"use strict";

/* Next Level Subs — Details tabs / FAQ UX polish.
 * Keeps the existing product/review logic intact and only improves interaction.
 */
(() => {
  const path = window.location.pathname;
  if (!/\/details\.html$/i.test(path) && !/\/product\//i.test(path)) return;

  const prefersReduced = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
  const style = document.createElement("style");
  style.id = "nls-details-tabs-ux-fix";
  style.textContent = `
    .tab-button{position:relative;transition:color .28s cubic-bezier(.16,1,.3,1),transform .28s cubic-bezier(.16,1,.3,1),background-color .28s ease}
    .tab-button::after{transform:translateX(-50%) scaleX(0);transform-origin:center;transition:transform .3s cubic-bezier(.16,1,.3,1),width .3s cubic-bezier(.16,1,.3,1)}
    .tab-button.active::after{transform:translateX(-50%) scaleX(1)}
    .tab-button:active{transform:scale(.96)}
    .nls-tab-content-transition{opacity:0;transform:translateY(8px);transition:opacity .24s ease,transform .3s cubic-bezier(.16,1,.3,1)}
    .nls-tab-content-transition.nls-tab-content-visible{opacity:1;transform:translateY(0)}
    .nls-faq-item{border-color:#e7eaf0!important;box-shadow:0 2px 8px rgba(15,23,42,.025);transition:box-shadow .25s ease,border-color .25s ease,transform .25s ease}
    .nls-faq-item.nls-faq-open{border-color:rgba(106,17,203,.2)!important;box-shadow:0 8px 24px rgba(106,17,203,.07)}
    .nls-faq-question{transition:background-color .2s ease,color .2s ease}
    .nls-faq-question:hover{background:rgba(106,17,203,.035)!important}
    .nls-faq-answer{display:grid!important;grid-template-rows:0fr;padding:0!important;opacity:0;transition:grid-template-rows .35s cubic-bezier(.16,1,.3,1),opacity .25s ease,padding .35s ease}
    .nls-faq-answer>div{overflow:hidden;min-height:0}
    .nls-faq-item.nls-faq-open .nls-faq-answer{grid-template-rows:1fr;padding:0 1rem .85rem!important;opacity:1}
    .nls-faq-chevron{transition:transform .3s cubic-bezier(.16,1,.3,1),color .2s ease}
    .nls-faq-item.nls-faq-open .nls-faq-chevron{transform:rotate(180deg);color:var(--primary-color,#6a11cb)}
    .nls-review-cta{position:relative;overflow:hidden;transition:transform .25s cubic-bezier(.16,1,.3,1),box-shadow .25s ease,filter .2s ease}
    .nls-review-cta::after{content:"";position:absolute;inset:0;transform:translateX(-110%);background:linear-gradient(90deg,transparent,rgba(255,255,255,.22),transparent);transition:transform .55s ease;pointer-events:none}
    .nls-review-cta:hover{transform:translateY(-2px);filter:saturate(1.05)}
    .nls-review-cta:hover::after{transform:translateX(110%)}
    .nls-review-cta:active{transform:translateY(0) scale(.98)}
    @media(max-width:640px){.tab-button{padding-left:.7rem;padding-right:.7rem}.nls-faq-item.nls-faq-open .nls-faq-answer{padding-left:.85rem!important;padding-right:.85rem!important}}
    @media(prefers-reduced-motion:reduce){.tab-button,.nls-tab-content-transition,.nls-faq-item,.nls-faq-answer,.nls-faq-chevron,.nls-review-cta{transition:none!important}.nls-review-cta::after{display:none}}
  `;
  document.head.appendChild(style);

  function animateContent(){
    const content=document.getElementById("tabContent"); if(!content)return;
    content.classList.remove("nls-tab-content-visible"); content.classList.add("nls-tab-content-transition");
    if(prefersReduced){content.classList.add("nls-tab-content-visible");return;}
    requestAnimationFrame(()=>requestAnimationFrame(()=>content.classList.add("nls-tab-content-visible")));
  }

  function decorateFaq(){
    const content=document.getElementById("tabContent"); if(!content)return;
    content.querySelectorAll("button").forEach(button=>{
      const answer=button.nextElementSibling;
      const icon=button.querySelector("i.fa-chevron-down,.fa-chevron-down");
      if(!answer||!icon)return;
      if(button.dataset.nlsFaqEnhanced==="1")return;
      button.dataset.nlsFaqEnhanced="1";
      const item=button.parentElement;
      item.classList.add("nls-faq-item"); button.classList.add("nls-faq-question"); answer.classList.add("nls-faq-answer"); icon.classList.add("nls-faq-chevron");
      const inner=document.createElement("div"); while(answer.firstChild)inner.appendChild(answer.firstChild); answer.appendChild(inner); answer.classList.remove("hidden");
      button.onclick=e=>{
        e.preventDefault();
        const open=item.classList.contains("nls-faq-open");
        answer.classList.remove("hidden"); item.classList.toggle("nls-faq-open",!open); button.setAttribute("aria-expanded",String(!open));
      };
      button.setAttribute("aria-expanded","false");
    });
  }

  function decorateReviewCta(){
    const content=document.getElementById("tabContent"); if(!content)return;
    content.querySelectorAll("button").forEach(button=>{
      if(/write\s+a\s+review/i.test(button.textContent||"")){
        button.classList.add("nls-review-cta");
        if(!button.dataset.nlsReviewUx){
          button.dataset.nlsReviewUx="1";
          button.addEventListener("click",()=>setTimeout(()=>content.querySelector(".nls-existing-review-form,[data-review-form]")?.scrollIntoView({behavior:prefersReduced?"auto":"smooth",block:"nearest"}),80));
        }
      }
    });
  }

  let wrapped=false;
  function wrapTabFunctions(){
    if(typeof window.switchTab!=="function")return false;
    if(window.switchTab.__nlsUxWrapped)return true;
    const original=window.switchTab;
    const wrappedSwitch=function(tab){
      const content=document.getElementById("tabContent"); if(content)content.classList.remove("nls-tab-content-visible");
      original(tab); animateContent(); setTimeout(()=>{decorateFaq();decorateReviewCta();},20);
    };
    wrappedSwitch.__nlsUxWrapped=true; window.switchTab=wrappedSwitch; wrapped=true; return true;
  }

  let observer;
  function init(){
    if(wrapped||wrapTabFunctions()){
      const content=document.getElementById("tabContent");
      if(content&&!observer){observer=new MutationObserver(()=>{decorateFaq();decorateReviewCta();});observer.observe(content,{childList:true,subtree:true});}
      animateContent();decorateFaq();decorateReviewCta();return true;
    }
    return false;
  }

  let attempts=0;
  const timer=setInterval(()=>{attempts++;if(init()||attempts>100)clearInterval(timer);},50);
})();
