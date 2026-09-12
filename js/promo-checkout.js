"use strict";
(() => {
  if (window.__NLSPromoCheckoutLoaded) return;
  window.__NLSPromoCheckoutLoaded = true;
  const db = window.supabaseClient;
  if (!db) return;
  const CART_KEY = "streamHubCart", PROMO_KEY = "nls:applied-promo";
  let applied = null, busy = false, lastSig = "";
  const cart = () => { try { const v = JSON.parse(localStorage.getItem(CART_KEY) || "[]"); return Array.isArray(v) ? v : []; } catch { return []; } };
  const price = x => Number(x?.selectedPlan?.price ?? x?.price ?? 0);
  const qty = x => Math.max(1, Number(x?.quantity || 1));
  const subtotal = () => cart().reduce((s,x) => s + price(x) * qty(x), 0);
  const money = v => Number(v || 0).toLocaleString("en-BD", {minimumFractionDigits:2, maximumFractionDigits:2});
  const sig = () => JSON.stringify(cart().map(x => [x.product_id || x.productId || x.product_slug || x.slug || x.name, x.selectedPlan?.id || x.plan_id || x.planId || x.duration, price(x), qty(x)]));
  const promoItems = () => cart().map(x => ({ product_slug:x.product_slug || x.slug || x.productSlug || null, product_id:x.product_id || x.productId || null, plan_id:x.selectedPlan?.id || x.plan_id || x.planId || null, quantity:qty(x) }));
  const ids = () => ({ input:document.getElementById("promoCode") || document.getElementById("nlsPromoInput"), button:document.getElementById("applyPromo") || document.getElementById("nlsPromoApply"), message:document.getElementById("nlsPromoMessage") });
  const msg = (text,ok) => { const e=ids().message; if(e){e.textContent=text;e.style.color=ok?"#166534":"#b91c1c";} };
  const setLegacy = (code,discount) => { try { window.eval(`discountAmount=${Number(discount||0)};appliedPromoCode=${JSON.stringify(code||"")}`); } catch {} };
  const render = () => { const d=document.getElementById("discount"),t=document.getElementById("total"),disc=Number(applied?.discount_amount||0); if(d)d.textContent=`-৳${money(disc)}`; if(t)t.textContent=`৳${money(Math.max(0,subtotal()+subtotal()*0.0185-disc))}`; };
  const save = () => applied?.code ? localStorage.setItem(PROMO_KEY,JSON.stringify({code:applied.code})) : localStorage.removeItem(PROMO_KEY);
  const clear = text => { applied=null; setLegacy("",0); save(); render(); if(text)msg(text,false); document.dispatchEvent(new CustomEvent("nextlevel:promo-cleared")); };
  async function validate(code){
    if(subtotal()<=0) throw new Error("Add a product before applying a promo.");
    const central=await db.rpc("validate_promo_cart",{p_code:code,p_items:promoItems()});
    if(!central.error){ if(!central.data?.valid) throw new Error(central.data?.message||"Invalid or expired promo code."); return central.data; }
    const a=cart(), legacy=await db.rpc("validate_promo_code",{p_code:code,p_subtotal:subtotal(),p_product_id:a.length===1?(a[0].product_id||a[0].productId||null):null,p_plan_id:a.length===1?(a[0].selectedPlan?.id||a[0].plan_id||a[0].planId||null):null});
    if(legacy.error) throw legacy.error; if(!legacy.data?.valid) throw new Error(legacy.data?.message||"Invalid or expired promo code."); return legacy.data;
  }
  async function apply(){
    if(busy)return; const input=ids().input,code=input?.value.trim().toUpperCase(); if(!code)return msg("Enter a promo code.",false);
    busy=true; try{ applied=await validate(code); lastSig=sig(); setLegacy(applied.code||code,applied.discount_amount); save(); render(); msg(`${applied.message||"Promo code applied."} You save ৳${money(applied.discount_amount)}.`,true); document.dispatchEvent(new CustomEvent("nextlevel:promo-applied",{detail:applied})); }
    catch(e){clear(e?.message||"Unable to validate promo code.");} finally{busy=false;}
  }
  function wire(){const {button,input}=ids(); if(!button||button.dataset.nlsCentralPromo)return; if(input)input.addEventListener("input",()=>{if(applied)clear();}); button.dataset.nlsCentralPromo="1"; button.addEventListener("click",e=>{e.preventDefault();e.stopImmediatePropagation();apply();},true); if(input)input.addEventListener("keydown",e=>{if(e.key==="Enter"){e.preventDefault();apply();}});}
  function restore(){try{const s=JSON.parse(localStorage.getItem(PROMO_KEY)||"null"),i=ids().input;if(s?.code&&i){i.value=s.code;setTimeout(apply,50);}}catch{}}
  function patchOrders(){if(db.__nlsPromoOrdersPatched)return;db.__nlsPromoOrdersPatched=true;const from=db.from.bind(db);db.from=function(table){const b=from(table);if(table!=="orders"||b.__nlsPromoBuilder)return b;b.__nlsPromoBuilder=true;const ins=b.insert.bind(b);b.insert=(values,...args)=>{const code=applied?.code||(()=>{try{return JSON.parse(localStorage.getItem(PROMO_KEY)||"null")?.code||null}catch{return null}})();if(!code)return ins(values,...args);const add=v=>({...v,promo_code:v?.promo_code||code});return ins(Array.isArray(values)?values.map(add):add(values),...args);};return b;};}
  function watch(){setInterval(async()=>{const s=sig();if(s===lastSig)return;lastSig=s;if(!applied?.code)return;try{applied=await validate(applied.code);setLegacy(applied.code,applied.discount_amount);save();render();document.dispatchEvent(new CustomEvent("nextlevel:promo-applied",{detail:applied}));}catch(e){clear(e?.message||"Promo code is no longer valid for this cart.");}},1000);}
  function boot(){patchOrders();wire();restore();watch();setTimeout(wire,500);setTimeout(wire,1500);}
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",boot,{once:true});else boot();
})();
