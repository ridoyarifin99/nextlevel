"use strict";
(function(){
  if(window.__NLSCentralSearchRuntimeV3)return;
  window.__NLSCentralSearchRuntimeV3=true;
  const $=id=>document.getElementById(id),norm=v=>String(v??"").trim().toLowerCase();
  const esc=v=>String(v??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/\"/g,"&quot;").replace(/'/g,"&#039;");
  const products=()=>Array.isArray(window.NLSCentralCatalog?.products)?window.NLSCentralCatalog.products.filter(p=>p&&p.is_available!==false&&p.is_archived!==true):[];
  const image=p=>p?.logo||p?.product_logo||p?.image||p?.image_url||"";
  const price=p=>{const plans=Array.isArray(p?.product_plans)?p.product_plans.filter(x=>x&&x.is_available!==false):[];return Number(plans[0]?.price??p?.price??0)};
  const categories=p=>Array.isArray(p?.categories)?p.categories:[];
  const inputs=[$("searchInput"),$("mobileSearchInput")].filter(Boolean),drop=$("searchDropdown"),results=$("searchResults"),empty=$("noSearchResults"),clearDesktop=$("clearSearchDesktop"),clearMobile=$("clearSearchMobile");
  if(!inputs.length||!drop||!results)return;
  let lastTerm="",timer=0;
  const highlight=(text,q)=>{const value=esc(text),safe=String(q).replace(/[.*+?^${}()|[\]\\]/g,"\\$&");return safe?value.replace(new RegExp(`(${safe})`,"gi"),"<span class=\"search-highlight\">$1</span>"):value};
  const close=()=>{drop.classList.remove("active");drop.classList.remove("nls-search-ui-positioned");};
  function render(q){
    const term=norm(q);lastTerm=term;
    if(!term){results.innerHTML="";empty?.classList.add("hidden");close();return;}
    const list=products().filter(p=>norm(p.name).includes(term)||norm(p.description).includes(term)||categories(p).some(c=>norm(c).includes(term)));
    results.innerHTML="";empty?.classList.toggle("hidden",list.length>0);
    list.forEach(p=>{
      const row=document.createElement("div");row.className="search-dropdown-item";
      const src=image(p);
      row.innerHTML=`<div class="sdi-img">${src?`<img src="${esc(src)}" alt="${esc(p.name)}" loading="lazy" decoding="async">`:'<i class="fas fa-play-circle"></i>'}</div><div class="sdi-info"><h4>${highlight(p.name,term)}</h4><p>${highlight(p.description||"",term)}</p></div><div class="sdi-action"><span class="sdi-price">৳${price(p).toLocaleString("en-BD")}</span><button type="button" class="sdi-add-btn">Add</button></div>`;
      row.querySelector(".sdi-add-btn")?.addEventListener("click",e=>{e.stopPropagation();window.NLSCentralAddToCart?.(p.slug);close()});
      row.addEventListener("click",e=>{if(!e.target.closest(".sdi-add-btn"))location.href=`/product/${encodeURIComponent(p.slug)}`});
      results.appendChild(row);
    });
    drop.classList.add("active");
    window.dispatchEvent(new CustomEvent("nls:search-dropdown-updated"));
  }
  function input(e){
    e.stopImmediatePropagation();const value=e.target.value;
    inputs.forEach(x=>{if(x!==e.target)x.value=value});
    clearDesktop?.classList.toggle("visible",!!value);clearMobile?.classList.toggle("visible",!!value);
    clearTimeout(timer);timer=setTimeout(()=>{
      if(!products().length){const once=()=>{window.removeEventListener("nls:central-catalog-ready",once);if(lastTerm)render(lastTerm)};window.addEventListener("nls:central-catalog-ready",once,{once:true});return}
      render(value);
    },60);
  }
  inputs.forEach(i=>i.addEventListener("focus",e=>{if(e.target.value)render(e.target.value)},{passive:true}));
  inputs.forEach(i=>i.addEventListener("input",input,true));
  clearDesktop?.addEventListener("click",()=>{inputs.forEach(x=>x.value="");results.innerHTML="";close()},true);
  clearMobile?.addEventListener("click",()=>{inputs.forEach(x=>x.value="");results.innerHTML="";close()},true);
  document.addEventListener("click",e=>{if(drop.classList.contains("active")&&!drop.contains(e.target)&&!inputs.includes(e.target)&&!$("mobileSearchToggle")?.contains(e.target))close()},true);
  window.addEventListener("nls:central-catalog-ready",()=>{if(lastTerm)render(lastTerm)});
  window.addEventListener("nextlevel:products-updated",()=>{if(lastTerm)render(lastTerm)});
})();
