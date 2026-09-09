"use strict";
/* Central catalog bridge: DB is authoritative; legacy products.js remains a safe first-paint fallback. */
(function(){
  const KEY="nls:product-catalog:v1";
  const RELOADED="nls:product-catalog:reloaded";
  const sleep=ms=>new Promise(r=>setTimeout(r,ms));
  const normalize=list=>(Array.isArray(list)?list:[]).map(p=>({slug:p.slug,name:p.name,price:Number(p.price||0),old_price:p.old_price==null?null:Number(p.old_price),image:p.image||p.image_url||"",category:p.category||p.product_categories?.slug||"",available:p.is_available!==false}));
  const sig=list=>JSON.stringify(normalize(list));
  const apply=list=>{if(!Array.isArray(window.NextLevelSubs?.subscriptions))return false;const target=window.NextLevelSubs.subscriptions;const mapped=list.map(p=>({...p,image:p.image_url||p.image||"",categories:p.product_categories?[p.product_categories.slug]:p.categories||[],duration:p.product_plans?.[0]?.duration||p.duration||"month",price:Number(p.price||p.product_plans?.[0]?.price||0),pricing:(p.product_plans||[]).map(x=>({duration:x.duration,price:Number(x.price||0),old_price:x.old_price,currency:x.currency||p.currency||"BDT"}))}));target.splice(0,target.length,...mapped);window.products=target;window.NextLevelSubs.getProductBySlug=slug=>target.find(p=>p.slug===slug)||null;window.dispatchEvent(new CustomEvent("nextlevel:products-updated",{detail:{products:target}}));return true};
  async function run(){for(let i=0;i<80;i++){if(window.NextLevelSubs?.subscriptions)break;await sleep(50)}if(!window.NextLevelSubs?.subscriptions)return;let cached=null;try{cached=JSON.parse(localStorage.getItem(KEY)||"null")}catch{}if(Array.isArray(cached)&&cached.length)apply(cached);const before=sig(window.NextLevelSubs.subscriptions);try{const r=await fetch("/api/products",{cache:"no-store"});if(!r.ok)throw Error("Catalog API "+r.status);const body=await r.json();const fresh=body.products||[];localStorage.setItem(KEY,JSON.stringify(fresh));apply(fresh);const changed=before!==sig(fresh);if(changed&&!sessionStorage.getItem(RELOADED)){sessionStorage.setItem(RELOADED,"1");location.reload()}else if(!changed)sessionStorage.removeItem(RELOADED)}catch(e){console.warn("NEXT LEVEL SUBS: centralized catalog unavailable; using cached/static catalog",e)}}
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",run,{once:true});else run();
})();
