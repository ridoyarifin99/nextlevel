"use strict";
(()=>{
  const path=window.location.pathname;
  if(!/\/details\.html$/i.test(path)&&!/\/product\//i.test(path))return;
  const esc=v=>String(v??"").replace(/[&<>\"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]));
  const iconForFeature=(text,i)=>{const s=String(text||"").toLowerCase();if(/4k|hd|quality|video|audio/.test(s))return"fa-tv";if(/device|screen|pc|mobile|tablet|laptop/.test(s))return"fa-mobile-screen-button";if(/download|offline/.test(s))return"fa-download";if(/renew/.test(s))return"fa-rotate";if(/vpn|security|secure|privacy|pin|locked/.test(s))return"fa-shield-halved";if(/ad-free|ads/.test(s))return"fa-ban";if(/support|warranty/.test(s))return"fa-headset";if(/content|original|exclusive|movie|show/.test(s))return"fa-clapperboard";return["fa-circle-check","fa-sparkles","fa-bolt","fa-star","fa-gem"][i%5]};
  function styles(){
    if(document.getElementById("nls-premium-content-styles"))return;
    const s=document.createElement("style");s.id="nls-premium-content-styles";s.textContent=`
      /* Complete responsive Details tabs shell */
      .nls-premium-tabs-shell{position:relative!important;border:1px solid rgba(226,232,240,.82)!important;border-radius:24px!important;background:rgba(255,255,255,.88)!important;box-shadow:0 18px 55px rgba(15,23,42,.07),0 2px 8px rgba(106,17,203,.035)!important;overflow:hidden!important;isolation:isolate}
      .nls-premium-tabs-shell>.nls-premium-tab-nav{position:relative;background:linear-gradient(180deg,rgba(248,250,252,.96),rgba(255,255,255,.9));border-bottom:1px solid #e9eaf0;overflow:hidden}
      .nls-premium-tab-list{display:grid!important;grid-template-columns:repeat(4,minmax(0,1fr));gap:0!important;width:100%;padding:0!important}
      .nls-premium-tabs-shell .tab-button{position:relative!important;display:flex!important;align-items:center!important;justify-content:center!important;gap:8px!important;min-width:0!important;height:62px!important;padding:0 12px!important;border:0!important;background:transparent!important;color:#64748b!important;font-size:14px!important;font-weight:800!important;white-space:nowrap!important;transition:color .28s cubic-bezier(.16,1,.3,1),background .28s,transform .28s!important}
      .nls-premium-tabs-shell .tab-button::before{content:"";position:absolute;inset:8px 6px;border-radius:14px;background:linear-gradient(135deg,rgba(106,17,203,.075),rgba(37,117,252,.055));opacity:0;transform:scale(.94);transition:opacity .28s,transform .28s;z-index:-1}
      .nls-premium-tabs-shell .tab-button::after{content:"";position:absolute!important;left:18%!important;right:18%!important;bottom:0!important;width:auto!important;height:3px!important;border-radius:999px 999px 0 0!important;background:linear-gradient(90deg,#6a11cb,#2575fc)!important;transform:none!important;opacity:0!important;transition:opacity .28s,transform .28s!important}
      .nls-premium-tabs-shell .tab-button:hover{color:#6d28d9!important;transform:translateY(-1px)!important}
      .nls-premium-tabs-shell .tab-button:hover::before{opacity:1;transform:scale(1)}
      .nls-premium-tabs-shell .tab-button.active{color:#6d28d9!important}
      .nls-premium-tabs-shell .tab-button.active::before{opacity:1;transform:scale(1)}
      .nls-premium-tabs-shell .tab-button.active::after{opacity:1!important}
      .nls-premium-tabs-shell>.nls-premium-tab-body{padding:28px!important;min-width:0!important}
      .nls-premium-tab{animation:nlsPremiumIn .5s cubic-bezier(.16,1,.3,1) both;min-width:0}
      @keyframes nlsPremiumIn{from{opacity:0;transform:translateY(12px);filter:blur(2px)}to{opacity:1;transform:none;filter:none}}
      .nls-premium-overview{position:relative;overflow:hidden;border:1px solid rgba(124,58,237,.12);border-radius:22px;padding:28px;background:radial-gradient(circle at 100% 0,rgba(37,117,252,.10),transparent 34%),radial-gradient(circle at 0 100%,rgba(106,17,203,.10),transparent 36%),linear-gradient(145deg,#fff,#faf9ff);box-shadow:0 20px 55px rgba(76,29,149,.08)}
      .nls-premium-overview:before{content:"";position:absolute;width:180px;height:180px;border-radius:50%;right:-80px;top:-90px;background:linear-gradient(135deg,rgba(106,17,203,.14),rgba(37,117,252,.02));filter:blur(2px);pointer-events:none}
      .nls-premium-eyebrow{display:inline-flex;align-items:center;justify-content:center;gap:7px;padding:6px 10px;border-radius:999px;background:rgba(106,17,203,.08);color:#6d28d9;font-size:11px;font-weight:900;letter-spacing:.08em;text-transform:uppercase;white-space:nowrap}
      .nls-premium-overview h3{margin:15px 0 9px;font-size:24px;line-height:1.2;color:#111827;font-weight:900;letter-spacing:-.025em;overflow-wrap:anywhere}
      .nls-premium-overview p{margin:0;max-width:850px;color:#475569;font-size:15px;line-height:1.9;overflow-wrap:anywhere}
      .nls-premium-meta{display:flex;gap:8px;flex-wrap:wrap;margin-top:20px}.nls-premium-meta span{display:inline-flex;align-items:center;gap:6px;padding:8px 11px;border:1px solid #e9e4f7;border-radius:11px;background:rgba(255,255,255,.72);color:#64748b;font-size:11px;font-weight:800}
      .nls-feature-head,.nls-faq-head{display:flex;align-items:end;justify-content:space-between;gap:15px;margin-bottom:16px;min-width:0}.nls-feature-head>div,.nls-faq-head>div{min-width:0}.nls-feature-head h3,.nls-faq-head h3{margin:0;color:#111827;font-size:23px;font-weight:900;letter-spacing:-.025em;overflow-wrap:anywhere}.nls-feature-head p,.nls-faq-head p{margin:5px 0 0;color:#64748b;font-size:13px;line-height:1.55}
      .nls-feature-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}
      .nls-feature-card{position:relative;display:flex;gap:13px;align-items:flex-start;min-width:0;padding:17px;border:1px solid #e9e7f1;border-radius:17px;background:linear-gradient(145deg,#fff,#fbfaff);box-shadow:0 8px 25px rgba(15,23,42,.045);opacity:0;transform:translateY(14px);animation:nlsFeatureIn .55s cubic-bezier(.16,1,.3,1) forwards;transition:transform .3s cubic-bezier(.16,1,.3,1),box-shadow .3s,border-color .3s}
      @keyframes nlsFeatureIn{to{opacity:1;transform:none}}
      .nls-feature-card:after{content:"";position:absolute;inset:0;border-radius:inherit;background:linear-gradient(120deg,rgba(106,17,203,.08),transparent 45%,rgba(37,117,252,.06));opacity:0;transition:opacity .3s;pointer-events:none}.nls-feature-card:hover{transform:translateY(-4px);border-color:#ddd2f8;box-shadow:0 18px 38px rgba(76,29,149,.11)}.nls-feature-card:hover:after{opacity:1}
      .nls-feature-icon{position:relative;z-index:1;flex:0 0 40px;width:40px;height:40px;display:grid;place-items:center;border-radius:13px;background:linear-gradient(135deg,#ede9fe,#dbeafe);color:#6d28d9;box-shadow:0 7px 16px rgba(109,40,217,.10)}
      .nls-feature-index{position:absolute;right:12px;top:10px;font-size:10px;font-weight:900;color:#c4b5fd}.nls-feature-card strong{position:relative;z-index:1;color:#334155;font-size:14px;line-height:1.55;font-weight:750;overflow-wrap:anywhere;padding-right:18px}
      .nls-faq-wrap{display:grid;gap:10px}.nls-faq-item{overflow:hidden;border:1px solid #e8e7ee;border-radius:17px;background:#fff;box-shadow:0 6px 22px rgba(15,23,42,.035);transition:box-shadow .3s,border-color .3s,transform .3s}.nls-faq-item.open{border-color:#ddd2f8;box-shadow:0 14px 35px rgba(76,29,149,.09);transform:translateY(-1px)}
      .nls-faq-q{width:100%;display:flex;align-items:center;gap:12px;text-align:left;border:0;background:transparent;padding:18px 19px;cursor:pointer;color:#1f2937;font-weight:850;font-size:14px;line-height:1.45}.nls-faq-num{width:28px;height:28px;display:grid;place-items:center;border-radius:9px;background:#f3e8ff;color:#7c3aed;font-size:10px;font-weight:900;flex:0 0 28px}.nls-faq-chevron{margin-left:auto;width:30px;height:30px;border-radius:50%;display:grid;place-items:center;background:#f8fafc;color:#64748b;transition:transform .35s,background .35s,color .35s;flex:0 0 30px}.nls-faq-item.open .nls-faq-chevron{transform:rotate(180deg);background:#ede9fe;color:#6d28d9}.nls-faq-a{display:grid;grid-template-rows:0fr;transition:grid-template-rows .42s cubic-bezier(.16,1,.3,1)}.nls-faq-item.open .nls-faq-a{grid-template-rows:1fr}.nls-faq-a>div{overflow:hidden}.nls-faq-answer{padding:0 19px 18px 59px;color:#64748b;font-size:13px;line-height:1.85;overflow-wrap:anywhere}
      .nls-faq-search{position:relative;max-width:290px;flex:1;min-width:0}.nls-faq-search input{width:100%;border:1px solid #e2e0e8;border-radius:12px;padding:10px 12px 10px 36px;outline:0;font-size:12px;background:#fff;transition:.25s}.nls-faq-search input:focus{border-color:#a78bfa;box-shadow:0 0 0 4px rgba(139,92,246,.08)}.nls-faq-search i{position:absolute;left:13px;top:50%;transform:translateY(-50%);color:#94a3b8;font-size:12px}.nls-faq-empty{text-align:center;padding:35px 15px;border:1px dashed #ddd6fe;border-radius:17px;color:#64748b;background:#faf9ff}

      /* Keep the Reviews tab inside the same responsive design system. */
      .nls-premium-tabs-shell #tabContent{min-width:0;max-width:100%;overflow-wrap:anywhere}
      .nls-premium-tabs-shell #tabContent img,.nls-premium-tabs-shell #tabContent video{max-width:100%;height:auto}
      .nls-premium-tabs-shell #tabContent button,.nls-premium-tabs-shell #tabContent input,.nls-premium-tabs-shell #tabContent textarea{max-width:100%}
      .nls-premium-tabs-shell .nls-review-card,.nls-premium-tabs-shell .review-card{max-width:100%;min-width:0;overflow:hidden}
      .nls-premium-tabs-shell .nls-review-actions,.nls-premium-tabs-shell .review-actions{display:flex;flex-wrap:wrap;gap:8px;align-items:center;min-width:0}
      .nls-premium-tabs-shell [class*="review"]{max-width:100%}
      .nls-premium-tabs-shell .nls-existing-reply{max-width:100%;min-width:0;overflow-wrap:anywhere}

      @media(max-width:900px){
        .nls-premium-tabs-shell{border-radius:20px!important}.nls-premium-tabs-shell>.nls-premium-tab-body{padding:20px!important}.nls-premium-tabs-shell .tab-button{height:58px!important;font-size:13px!important;padding:0 8px!important}.nls-premium-tabs-shell .tab-button::before{inset:7px 4px}.nls-premium-tabs-shell .tab-button::after{left:15%!important;right:15%!important}.nls-feature-grid{grid-template-columns:1fr}.nls-premium-overview{padding:22px;border-radius:20px}.nls-premium-overview h3{font-size:21px}
      }
      @media(max-width:600px){
        .nls-premium-tabs-shell{border-radius:17px!important;margin-left:-1px;margin-right:-1px}.nls-premium-tabs-shell>.nls-premium-tab-body{padding:14px!important}.nls-premium-tabs-shell>.nls-premium-tab-nav{overflow:visible}.nls-premium-tab-list{grid-template-columns:repeat(4,minmax(0,1fr))!important}.nls-premium-tabs-shell .tab-button{height:52px!important;gap:4px!important;font-size:11px!important;font-weight:850!important;padding:0 3px!important}.nls-premium-tabs-shell .tab-button::before{inset:6px 2px;border-radius:10px}.nls-premium-tabs-shell .tab-button::after{height:2px!important;left:18%!important;right:18%!important}.nls-premium-tabs-shell .tab-button i{font-size:11px}.nls-premium-overview{padding:18px;border-radius:17px}.nls-premium-overview h3{font-size:19px}.nls-premium-overview p{font-size:13px;line-height:1.75}.nls-premium-meta{gap:6px;margin-top:15px}.nls-premium-meta span{padding:7px 8px;font-size:10px}.nls-premium-eyebrow{font-size:9px;padding:5px 8px}.nls-feature-head,.nls-faq-head{align-items:stretch;flex-direction:column;gap:11px}.nls-feature-head h3,.nls-faq-head h3{font-size:19px}.nls-feature-head p,.nls-faq-head p{font-size:12px}.nls-feature-grid{gap:9px}.nls-feature-card{padding:13px;gap:10px;border-radius:14px}.nls-feature-icon{width:34px;height:34px;flex-basis:34px;border-radius:10px}.nls-feature-card strong{font-size:12px;line-height:1.5}.nls-feature-index{right:9px;top:8px;font-size:9px}.nls-faq-search{max-width:none}.nls-faq-q{padding:13px 12px;gap:8px;font-size:12px}.nls-faq-num{width:24px;height:24px;flex-basis:24px;border-radius:7px;font-size:9px}.nls-faq-chevron{width:26px;height:26px;flex-basis:26px}.nls-faq-answer{padding:0 12px 14px 44px;font-size:12px;line-height:1.7}
        .nls-premium-tabs-shell .nls-review-actions,.nls-premium-tabs-shell .review-actions{gap:5px}.nls-premium-tabs-shell .nls-review-actions button,.nls-premium-tabs-shell .review-actions button{min-height:32px;font-size:11px!important;padding:6px 8px!important}.nls-premium-tabs-shell .nls-existing-reply{margin-left:0!important}
      }
      @media(max-width:380px){
        .nls-premium-tabs-shell>.nls-premium-tab-body{padding:10px!important}.nls-premium-tabs-shell .tab-button{height:48px!important;font-size:10px!important}.nls-premium-tabs-shell .tab-button i{font-size:10px}.nls-premium-overview{padding:15px}.nls-premium-meta span{font-size:9px;padding:6px 7px}.nls-feature-card{padding:11px}.nls-feature-icon{width:31px;height:31px;flex-basis:31px}.nls-feature-card strong{font-size:11px}.nls-faq-q{font-size:11px;padding:11px 10px}.nls-faq-answer{padding-left:40px;font-size:11px}
      }
      @media(prefers-reduced-motion:reduce){.nls-premium-tab,.nls-feature-card{animation:none;opacity:1;transform:none}.nls-faq-a,.nls-faq-chevron,.nls-premium-tabs-shell .tab-button,.nls-feature-card{transition:none}}
    `;document.head.appendChild(s);
  }
  function setupShell(){
    const box=document.getElementById("tabContent");if(!box)return;
    const shell=box.closest(".mt-12.bg-white")||box.parentElement?.parentElement;
    if(!shell)return;
    shell.classList.add("nls-premium-tabs-shell");
    const nav=shell.querySelector(".border-b");
    const list=nav?.querySelector(":scope > div");
    const body=box.parentElement;
    if(nav)nav.classList.add("nls-premium-tab-nav");
    if(list)list.classList.add("nls-premium-tab-list");
    if(body)body.classList.add("nls-premium-tab-body");
    shell.querySelectorAll(".tab-button").forEach(btn=>{if(!btn.querySelector("i")){const t=btn.textContent.trim().toLowerCase();const map={description:"fa-align-left",features:"fa-sparkles",reviews:"fa-star",faq:"fa-circle-question"};if(map[t])btn.insertAdjacentHTML("afterbegin",`<i class="fas ${map[t]}" aria-hidden="true"></i>`)}});
  }
  function removeKeyFeatures(){
    const root=document.getElementById("productDetails");if(!root)return;
    root.querySelectorAll("h3").forEach(h=>{if(h.textContent.trim().toLowerCase()==="key features:"){const block=h.closest(".mb-6")||h.parentElement;if(block)block.remove();}});
  }
  function premiumDescription(){
    const p=window.currentProduct||{},d=String(p.description||"").trim(),planCount=Array.isArray(p.pricing)?p.pricing.length:0;
    return `<section class="nls-premium-tab nls-premium-overview"><span class="nls-premium-eyebrow"><i class="fas fa-sparkles"></i> Product Overview</span><h3>${esc(p.name||"This subscription")}</h3><p>${esc(d||"Premium digital service with straightforward access and support from Next Level Subs.")}</p><div class="nls-premium-meta"><span><i class="fas fa-shield-halved"></i> Secure ordering</span>${planCount?`<span><i class="fas fa-layer-group"></i> ${planCount} plan${planCount===1?"":"s"}</span>`:""}<span><i class="fas fa-headset"></i> Customer support</span></div></section>`;
  }
  function premiumFeatures(){
    const features=Array.isArray(window.currentProduct?.features)?window.currentProduct.features.filter(Boolean):[];
    if(!features.length)return `<section class="nls-premium-tab nls-faq-empty"><i class="fas fa-sparkles text-2xl"></i><div class="font-bold mt-2">No features listed yet.</div><div class="text-sm mt-1">Product features will appear here when they are added.</div></section>`;
    return `<section class="nls-premium-tab"><div class="nls-feature-head"><div><h3>Everything Included</h3><p>Explore the features included with ${esc(window.currentProduct?.name||"this product")}.</p></div><span class="nls-premium-eyebrow">${features.length} Features</span></div><div class="nls-feature-grid">${features.map((f,i)=>`<article class="nls-feature-card" style="animation-delay:${Math.min(i*55,700)}ms"><span class="nls-feature-icon"><i class="fas ${iconForFeature(f,i)}"></i></span><span><strong>${esc(f)}</strong></span><span class="nls-feature-index">${String(i+1).padStart(2,"0")}</span></article>`).join("")}</div></section>`;
  }
  function premiumFaq(){
    const faq=Array.isArray(window.currentProduct?.faq)?window.currentProduct.faq.filter(x=>x?.question):[];
    if(!faq.length)return `<section class="nls-premium-tab nls-faq-empty"><i class="fas fa-circle-question text-2xl"></i><div class="font-bold mt-2">No FAQs available</div><div class="text-sm mt-1">Questions will appear here when the product FAQ is configured.</div></section>`;
    return `<section class="nls-premium-tab"><div class="nls-faq-head"><div><h3>Frequently Asked Questions</h3><p>Quick answers before you place your order.</p></div><label class="nls-faq-search"><i class="fas fa-search"></i><input type="search" placeholder="Search questions…" aria-label="Search FAQs" data-faq-search></label></div><div class="nls-faq-wrap" data-faq-list>${faq.map((x,i)=>`<article class="nls-faq-item" data-faq-item data-question="${esc(`${x.question} ${x.answer||""}`.toLowerCase())}"><button type="button" class="nls-faq-q" data-faq-toggle><span class="nls-faq-num">${String(i+1).padStart(2,"0")}</span><span>${esc(x.question)}</span><span class="nls-faq-chevron"><i class="fas fa-chevron-down"></i></span></button><div class="nls-faq-a"><div><div class="nls-faq-answer">${esc(x.answer||"")}</div></div></div></article>`).join("")}</div><div class="nls-faq-empty" data-faq-empty hidden>No matching questions found.</div></section>`;
  }
  function enhanceTab(tab){
    const box=document.getElementById("tabContent");if(!box||!window.currentProduct)return;
    setupShell();
    if(tab==="description")box.innerHTML=premiumDescription();
    else if(tab==="features")box.innerHTML=premiumFeatures();
    else if(tab==="faq")box.innerHTML=premiumFaq();
    else return;
    box.querySelectorAll("[data-faq-toggle]").forEach(btn=>btn.addEventListener("click",()=>{const item=btn.closest("[data-faq-item]");if(!item)return;const open=item.classList.contains("open");box.querySelectorAll("[data-faq-item].open").forEach(x=>x.classList.remove("open"));if(!open)item.classList.add("open")}));
    box.querySelector("[data-faq-search]")?.addEventListener("input",e=>{const q=e.target.value.trim().toLowerCase();let shown=0;box.querySelectorAll("[data-faq-item]").forEach(item=>{const yes=!q||item.dataset.question.includes(q);item.hidden=!yes;if(yes)shown++});const empty=box.querySelector("[data-faq-empty]");if(empty)empty.hidden=shown!==0});
    if(typeof AOS!=="undefined")AOS.refresh();
  }
  function install(){
    styles();setupShell();removeKeyFeatures();
    const root=document.getElementById("productDetails");if(root&&!root.dataset.nlsKeyFeatureObserver){root.dataset.nlsKeyFeatureObserver="1";new MutationObserver(removeKeyFeatures).observe(root,{childList:true,subtree:true})}
    if(typeof window.switchTab!=="function"){setTimeout(install,80);return}
    if(window.switchTab.__nlsPremium)return;
    const original=window.switchTab;const wrapped=function(tab){const result=original.apply(this,arguments);setTimeout(()=>enhanceTab(tab),0);return result};wrapped.__nlsPremium=true;window.switchTab=wrapped;window.__nlsEnhanceDetailsTab=enhanceTab;
    setTimeout(()=>{setupShell();const active=document.querySelector(".tab-button.active")?.textContent?.trim().toLowerCase();enhanceTab(active?.startsWith("feature")?"features":active?.startsWith("review")?"reviews":active?.startsWith("faq")?"faq":"description")},150);
  }
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",install,{once:true});else install();
})();
