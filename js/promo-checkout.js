"use strict";
(() => {
  if(window.__NLSPromoCheckoutLoaded)return;window.__NLSPromoCheckoutLoaded=true;
  const db=window.supabaseClient;if(!db)return;
  const CART_KEY="streamHubCart",KEY="nls:applied-promo";let applied=null,busy=false;
  const cart=()=>{try{const x=JSON.parse(localStorage.getItem(CART_KEY)||"[]");return Array.isArray(x)?x:[]}catch{return[]}};
  const subtotal=()=>cart().reduce((s,x)=>s+Number(x.price??x.selectedPlan?.price??0)*Math.max(1,Number(x.quantity||1)),0);
  const productId=()=>{const a=cart();return a.length===1?(a[0].product_id||a[0].productId||null):null};
  const planId=()=>{const a=cart();return a.length===1?(a[0].selectedPlan?.id||a[0].plan_id||a[0].planId||null):null};
  const money=v=>Number(v||0).toLocaleString("en-BD",{minimumFractionDigits:2,maximumFractionDigits:2});
  const setLegacy=(code,discount)=>{try{window.eval(`discountAmount=${Number(discount||0)};appliedPromoCode=${JSON.stringify(code||"")}`)}catch(e){console.warn("Promo checkout bridge failed",e)}};
  function ids(){return{input:document.getElementById("promoCode")||document.getElementById("nlsPromoInput"),button:document.getElementById("applyPromo")||document.getElementById("nlsPromoApply"),message:document.getElementById("nlsPromoMessage")}};
  function message(text,ok){const x=ids().message;if(x){x.textContent=text;x.style.color=ok?"#166534":"#b91c1c"}}
  function render(){const d=document.getElementById("discount");const t=document.getElementById("total");if(d)d.textContent=`-৳${money(applied?.discount_amount||0)}`;if(t){const sub=subtotal();let tax=0;cart().forEach(i=>{const p=Number(i.price??i.selectedPlan?.price??0)*Math.max(1,Number(i.quantity||1));tax+=p*.0185});t.textContent=`৳${money(Math.max(0,sub+tax-Number(applied?.discount_amount||0)))}`}}
  function save(){if(applied)localStorage.setItem(KEY,JSON.stringify({code:applied.code}));else localStorage.removeItem(KEY)}
  function clear(text){applied=null;setLegacy("",0);save();render();if(text)message(text,false);document.dispatchEvent(new CustomEvent("nextlevel:promo-cleared"))}
  async function apply(){if(busy)return;const {input}=ids(),code=input?.value.trim().toUpperCase();if(!code)return message("Enter a promo code.",false);const sub=subtotal();if(sub<=0)return message("Add a product before applying a promo.",false);busy=true;const {data,error}=await db.rpc("validate_promo_code",{p_code:code,p_subtotal:sub,p_product_id:productId(),p_plan_id:planId()});busy=false;if(error)return clear(error.message);if(!data?.valid)return clear(data?.message||"Invalid or expired promo code.");applied=data;setLegacy(data.code,data.discount_amount);save();render();message(`${data.message} You save ৳${money(data.discount_amount)}.`,true);document.dispatchEvent(new CustomEvent("nextlevel:promo-applied",{detail:data}))}
  function wire(){const {button,input}=ids();if(!button||button.dataset.nlsCentralPromo)return;if(input)input.addEventListener("input",()=>{if(applied)clear()});button.dataset.nlsCentralPromo="1";button.addEventListener("click",e=>{e.preventDefault();e.stopImmediatePropagation();apply()},true)}
  function restore(){try{const x=JSON.parse(localStorage.getItem(KEY)||"null");if(x?.code){const {input}=ids();if(input)input.value=x.code;setTimeout(apply,50)}}catch{}}
  function watch(){let sig="";setInterval(()=>{const n=JSON.stringify(cart().map(x=>[x.product_id||x.productId,x.plan_id||x.planId,x.selectedPlan?.id,x.price,x.quantity]));if(n!==sig){sig=n;if(applied)apply()}},1000)}
  function patchOrderInsert(){if(db.__nlsPromoPatched)return;db.__nlsPromoPatched=true;const original=db.from.bind(db);db.from=function(table){const b=original(table);if(table!=="orders"||b.__nlsPromoBuilder)return b;b.__nlsPromoBuilder=true;const ins=b.insert.bind(b);b.insert=function(values,...args){const code=applied?.code||(()=>{try{return JSON.parse(localStorage.getItem(KEY)||"null")?.code||null}catch{return null}})();if(!code)return ins(values,...args);const add=v=>({...v,promo_code:v?.promo_code||code});return ins(Array.isArray(values)?values.map(add):add(values),...args)};return b}}
  function boot(){patchOrderInsert();wire();restore();watch();setTimeout(wire,500);setTimeout(wire,1500)}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
