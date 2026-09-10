"use strict";
/* Details header logo follows the central media role=logo. */
(function(){
  const apply=()=>{const p=window.NLSCentralCatalog?.getBySlug?.(location.pathname.match(/\/product\/([^/]+)/)?.[1]||new URLSearchParams(location.search).get("name"));const root=document.getElementById("productDetails");if(!p||!root)return;const img=root.querySelector("img.w-16.h-16.rounded-xl");const logo=p.logo||p.image||"";if(img&&logo){img.src=logo;img.removeAttribute("srcset");img.alt=`${p.name} logo`;}};
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",apply,{once:true});else apply();window.addEventListener("nls:central-catalog-ready",apply);window.addEventListener("nextlevel:products-updated",apply);setTimeout(apply,500);setTimeout(apply,1500);
})();
