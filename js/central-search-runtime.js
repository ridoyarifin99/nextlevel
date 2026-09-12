"use strict";
(function(){
  if(window.__NLSCentralSearchRuntimeV2)return;
  window.__NLSCentralSearchRuntimeV2=true;
  const $=id=>document.getElementById(id),norm=v=>String(v??"").trim().toLowerCase();
  const esc=v=>String(v??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/\"/g,"&quot;").replace(/'/g,"&#039;");
  const products=()=>Array.isArray(window.NLSCentralCatalog?.products)?window.NLSCentralCatalog.products.filter(p=>p&&p.is_available!==false&&p.is_archived!==true):[];
  const image=p=>p?.logo||p?.product_logo||p?.image||p?.image_url||"";
  const price=p=>{const plans=Array.isArray(p?.product_plans)?p.product_plans.filter(x=>x&&x.is_available!==false):[];return Number(plans[0]?.price??p?.price??0)};
  const categories=p=>Array.isArray(p?.categories)?p.categories:[];
  const inputs=[$("searchInput"),$("mobileSearchInput")].filter(Boolean),drop=$("searchDropdown"),results=$("searchResults"),empty=$("noSearchResults"),clearDesktop=$("clearSearchDesktop"),clearMobile=$("clearSearchMobile"),desktopWrap=$("desktopSearchWrapper"),mobileWrap=$("mobileSearchWrapper"),mobilePanel=$("mobileSearchPanel");
  if(!inputs.length||!drop||!results)return;
  let lastTerm="",timer=0,activeInput=null,raf=0;
  const mobile=()=>window.innerWidth<=1024;
  const anchor=()=>activeInput||(mobile()?$("mobileSearchInput"):$("searchInput"));
  const position=()=>{
    if(!drop.classList.contains("active"))return;
    const input=anchor();if(!input)return;
    const wrap=mobile()?mobileWrap:desktopWrap;
    const r=(wrap||input).getBoundingClientRect();
    const gap=7,margin=10;
    const width=Math.min(Math.max(r.width,260),window.innerWidth-margin*2);
    const left=Math.max(margin,Math.min(r.left,window.innerWidth-width-margin));
    const top=Math.max(8,r.bottom+gap);
    drop.style.setProperty("position","fixed","important");
    drop.style.setProperty("left",`${left}px`,"important");
    drop.style.setProperty("top",`${top}px`,"important");
    drop.style.setProperty("width",`${width}px`,"important");
    drop.style.setProperty("max-width",`calc(100vw - ${margin*2}px)`,"important");
    drop.style.setProperty("max-height",`min(62vh,520px)`,"important");
    drop.style.setProperty("overflow-y","auto","important");
    drop.style.setProperty("z-index","2147483000","important");
    drop.style.setProperty("box-sizing","border-box","important");
    drop.style.setProperty("border-radius","16px","important");
    drop.style.setProperty("background","rgba(255,255,255,.98)","important");
    drop.style.setProperty("box-shadow","0 18px 55px rgba(15,23,42,.18),0 4px 16px rgba(106,17,203,.10)","important");
  };
  const schedulePosition=()=>{if(raf)return;raf=requestAnimationFrame(()=>{raf=0;position()})};
  const setOpen=open=>{drop.classList.toggle("active",open);if(open){schedulePosition()}else{drop.style.removeProperty("left");drop.style.removeProperty("top");drop.style.removeProperty("width")}};
  function highlight(text,q){const value=esc(text),safe=String(q).replace(/[.*+?^${}()|[\]\\]/g,"\\$&");return safe?value.replace(new RegExp(`(${safe})`,"gi),"<span class=\"search-highlight\">$1</span>"):value;}
  function render(q){
    const term=norm(q);lastTerm=term;
    if(!term){results.innerHTML="";empty?.classList.add("hidden");setOpen(false);return;}
    const list=products().filter(p=>norm(p.name).includes(term)||norm(p.description).includes(term)||categories(p).some(c=>norm(c).includes(term)));
    results.innerHTML="";empty?.classList.toggle("hidden",list.length>0);
    list.forEach(p=>{
      const row=document.createElement("div");row.className="search-dropdown-item";
      const src=image(p);
      row.innerHTML=`<div class="sdi-img">${src?`<img src="${esc(src)}" alt="${esc(p.name)}" loading="lazy" decoding="async">`:'<i class="fas fa-play-circle"></i>'}</div><div class="sdi-info"><h4>${highlight(p.name,term)}</h4><p>${highlight(p.description||"",term)}</p></div><div class="sdi-action"><span class="sdi-price">৳${price(p).toLocaleString("en-BD")}</span><button type="button" class="sdi-add-btn">Add</button></div>`;
      row.querySelector(".sdi-add-btn")?.addEventListener("click",e=>{e.stopPropagation();window.NLSCentralAddToCart?.(p.slug);setOpen(false)});
      row.addEventListener("click",e=>{if(e.target.closest(".sdi-add-btn"))return;location.href=`/product/${encodeURIComponent(p.slug)}`;});
      results.appendChild(row);
    });
    setOpen(true);
  }
  function input(e){
    e.stopImmediatePropagation();activeInput=e.target;const value=e.target.value;
    inputs.forEach(x=>{if(x!==e.target)x.value=value});
    clearDesktop?.classList.toggle("visible",!!value);clearMobile?.classList.toggle("visible",!!value);
    if(value&&mobile())mobilePanel?.classList.add("active");
    clearTimeout(timer);timer=setTimeout(()=>{if(!products().length){const once=()=>{window.removeEventListener("nls:central-catalog-ready",once);if(lastTerm)render(lastTerm)};window.addEventListener("nls:central-catalog-ready",once,{once:true});return}render(value)},60);
  }
  inputs.forEach(i=>i.addEventListener("focus",e=>{activeInput=e.target;if(e.target.value)render(e.target.value);schedulePosition()},{passive:true}));
  inputs.forEach(i=>i.addEventListener("input",input,true));
  clearDesktop?.addEventListener("click",()=>{inputs.forEach(x=>x.value="");results.innerHTML="";setOpen(false)},true);
  clearMobile?.addEventListener("click",()=>{inputs.forEach(x=>x.value="");results.innerHTML="";setOpen(false)},true);
  document.addEventListener("click",e=>{if(drop.classList.contains("active")&&!drop.contains(e.target)&&!inputs.some(x=>x===e.target)&&!$("mobileSearchToggle")?.contains(e.target))setOpen(false)},true);
  window.addEventListener("resize",schedulePosition,{passive:true});
  window.addEventListener("orientationchange",()=>setTimeout(schedulePosition,60),{passive:true});
  window.addEventListener("scroll",()=>{if(drop.classList.contains("active"))schedulePosition()},{passive:true});
  window.addEventListener("nls:central-catalog-ready",()=>{if(lastTerm)render(lastTerm)});
  window.addEventListener("nextlevel:products-updated",()=>{if(lastTerm)render(lastTerm)});
})();
