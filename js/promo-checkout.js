"use strict";
(() => {
  if(window.__NLSPromoCheckoutLoaded)return;window.__NLSPromoCheckoutLoaded=true;
  const db=window.supabaseClient; if(!db)return;
  const CART_KEY="streamHubCart";
  let applied=null;
  const esc=v=>String(v??"").replace(/[&<>\"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]));
  const cart=()=>{try{const x=JSON.parse(localStorage.getItem(CART_KEY)||"[]");return Array.isArray(x)?x:[]}catch{return[]}};
  const subtotal=()=>cart().reduce((s,x)=>s+Number(x.price||x.selectedPlan?.price||0)*Math.max(1,Number(x.quantity||1)),0);
  const first=()=>cart()[0]||{};
  function productId(){return first().product_id||first().productId||null}
  function planId(){return first().selectedPlan?.id||first().plan_id||first().planId||null}
  function ensure(){
    if(document.getElementById("nlsPromoCheckout"))return;
    const host=[...document.querySelectorAll("*" )].find(x=>x.children.length===0&&/subtotal/i.test(x.textContent||""))?.parentElement||document.querySelector("form")||document.body;
    if(!host)return;
    const box=document.createElement("div");box.id="nlsPromoCheckout";box.style.cssText="margin:14px 0;padding:14px;border:1px solid #e2e8f0;border-radius:14px;background:#fff";
    box.innerHTML='<div style="font-weight:800;margin-bottom:8px">Promo code</div><div style="display:flex;gap:8px"><input id="nlsPromoInput" type="text" autocomplete="off" placeholder="Enter promo code" style="flex:1;padding:10px;border:1px solid #cbd5e1;border-radius:9px;text-transform:uppercase"><button id="nlsPromoApply" type="button" style="padding:10px 14px;border:0;border-radius:9px;background:#6a11cb;color:#fff;font-weight:800">Apply</button></div><div id="nlsPromoMessage" style="font-size:12px;margin-top:7px"></div>';
    host.insertAdjacentElement("afterend",box);document.getElementById("nlsPromoApply").onclick=apply;document.getElementById("nlsPromoInput").addEventListener("keydown",e=>{if(e.key==='Enter'){e.preventDefault();apply()}});
  }
  function show(message,ok){const el=document.getElementById("nlsPromoMessage");if(el){el.textContent=message;el.style.color=ok?"#166534":"#b91c1c"}}
  async function apply(){
    const input=document.getElementById("nlsPromoInput");const code=input?.value.trim();if(!code)return show("Enter a promo code.",false);
    const total=subtotal();if(total<=0)return show("Add a product before applying a promo.",false);
    const {data,error}=await db.rpc("validate_promo_code",{p_code:code,p_subtotal:total,p_product_id:productId(),p_plan_id:planId()});
    if(error)return show(error.message,false);if(!data?.valid){applied=null;localStorage.removeItem("nls:applied-promo");return show(data?.message||"Promo code could not be applied.",false)}
    applied=data;localStorage.setItem("nls:applied-promo",JSON.stringify({code:data.code,discount_amount:data.discount_amount,promo_id:data.promo_id}));show(`${data.message} You save ৳${Number(data.discount_amount||0).toLocaleString("en-BD",{minimumFractionDigits:2,maximumFractionDigits:2})}.`,true);document.dispatchEvent(new CustomEvent("nextlevel:promo-applied",{detail:data}));
  }
  function restore(){try{const x=JSON.parse(localStorage.getItem("nls:applied-promo")||"null");if(x?.code){const i=document.getElementById("nlsPromoInput");if(i)i.value=x.code;}}catch{}}
  function patchOrderInsert(){
    if(db.__nlsPromoPatched)return;db.__nlsPromoPatched=true;const original=db.from.bind(db);
    db.from=function(table){const builder=original(table);if(table!=="orders"||builder.__nlsPromoBuilder)return builder;builder.__nlsPromoBuilder=true;const insert=builder.insert.bind(builder);builder.insert=function(values,...args){const code=applied?.code||(()=>{try{return JSON.parse(localStorage.getItem("nls:applied-promo")||"null")?.code||null}catch{return null}})();if(!code)return insert(values,...args);const add=v=>({...v,promo_code:v?.promo_code||code});return insert(Array.isArray(values)?values.map(add):add(values),...args)};return builder};
  }
  function boot(){patchOrderInsert();ensure();restore();setTimeout(ensure,500);setTimeout(ensure,1500)}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
