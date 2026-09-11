"use strict";
(function(){
  if(window.__NLSCheckoutCentralGuard)return;
  window.__NLSCheckoutCentralGuard=true;

  const CART_KEY="streamHubCart";
  const waitFor=(fn,timeout=10000)=>new Promise((resolve,reject)=>{const start=Date.now();const tick=()=>{if(fn())return resolve(true);if(Date.now()-start>timeout)return reject(new Error("Checkout initialization timed out."));setTimeout(tick,50)};tick()});
  const getCart=()=>{try{const v=JSON.parse(localStorage.getItem(CART_KEY)||"[]");return Array.isArray(v)?v:[]}catch{return[]}};
  const saveCart=cart=>localStorage.setItem(CART_KEY,JSON.stringify(cart));
  const money=n=>Number(n||0);

  async function refreshCatalog(){
    if(typeof window.NLSCentralCatalogRefresh==="function"){
      await window.NLSCentralCatalogRefresh();
    }else if(!window.NLSCentralCatalog?.products?.length){
      const r=await fetch("/api/products?_nls_checkout="+Date.now(),{cache:"no-store"});
      if(!r.ok)throw new Error("Unable to refresh the product catalog.");
      const b=await r.json();
      if(Array.isArray(b.products))window.NLSCentralCatalog={products:b.products};
    }
  }

  async function canonicalizeCart(){
    await refreshCatalog();
    const products=window.NLSCentralCatalog?.products||[];
    const bySlug=new Map(products.map(p=>[String(p.slug||"").toLowerCase(),p]));
    const cart=getCart();
    if(!cart.length)throw new Error("Your cart is empty.");
    const next=cart.map(item=>{
      const p=bySlug.get(String(item.slug||item.product_slug||"").toLowerCase());
      if(!p||p.is_available===false||p.is_archived)throw new Error(`${item.name||"This product"} is no longer available.`);
      const wantedId=String(item.selectedPlan?.id||"");
      const wantedDuration=String(item.selectedPlan?.duration||item.duration||"").toLowerCase();
      const plan=(p.product_plans||[]).find(x=>String(x.id||"")===wantedId&&x.is_available!==false)
        ||(p.product_plans||[]).find(x=>String(x.duration||x.name||"").toLowerCase()===wantedDuration&&x.is_available!==false)
        ||(p.product_plans||[])[0];
      if(!plan||plan.is_available===false)throw new Error(`${p.name} has no available plan for the selected option.`);
      return {...item,name:p.name,slug:p.slug,product_slug:p.slug,image:p.image||p.image_url||item.image,selectedPlan:{...plan,price:money(plan.price),currency:plan.currency||p.currency||"BDT"},price:money(plan.price),duration:plan.duration||plan.name};
    });
    saveCart(next);
    window.dispatchEvent(new CustomEvent("nextlevel:checkout-cart-updated",{detail:{cart:next}}));
    return next;
  }

  async function submitCanonically(original){
    const cart=await canonicalizeCart();
    const sessionResult=await window.supabaseClient.auth.getSession();
    const user=sessionResult?.data?.session?.user;
    if(!user) return original();

    const get=id=>(document.getElementById(id)?.value||"").trim();
    const items=cart.map(item=>({product_slug:item.slug||item.product_slug,plan_id:item.selectedPlan?.id,quantity:Math.max(1,Number(item.quantity||1))}));
    if(items.some(x=>!x.product_slug||!x.plan_id))throw new Error("One or more cart items could not be matched to the current catalog. Please return to the product page and add them again.");

    const promo=(document.getElementById("promoCode")?.value||"").trim().toUpperCase();
    const paymentMethod=document.querySelector(".payment-method.selected")?.dataset.method||"bkash";
    const {data,error}=await window.supabaseClient.rpc("place_order_from_catalog",{
      p_customer_name:`${get("firstName")} ${get("lastName")}`.trim(),
      p_email:get("email").toLowerCase(),
      p_phone:get("phone"),
      p_address:get("address"),
      p_notes:get("notes"),
      p_payment_method:paymentMethod,
      p_payment_reference:get("paymentReference"),
      p_payment_sender_number:get("paymentSenderNumber"),
      p_promo_code:promo||null,
      p_items:items
    });
    if(error)throw error;
    const result=Array.isArray(data)?data[0]:data;
    if(!result?.id)throw new Error("The order was not created.");
    localStorage.removeItem(CART_KEY);
    localStorage.removeItem("pendingCheckoutOrder");
    document.getElementById("successMessage").textContent=`Order ${result.order_number} has been submitted successfully. Your payment is pending verification. Once verified, your subscription/account details will appear in your dashboard.`;
    document.getElementById("successModal")?.classList.remove("hidden");
    document.getElementById("successModal")?.setAttribute("aria-hidden","false");
    document.body.style.overflow="hidden";
    if(typeof window.triggerConfetti==="function")window.triggerConfetti();
    const btn=document.getElementById("placeOrderBtn");
    if(btn){btn.disabled=true;btn.innerHTML=`<span class="place-order-content"><i class="fas fa-check mr-2"></i> Order Submitted</span>`;}
    return result;
  }

  function install(){
    if(typeof window.executeOrderSubmission!=="function")return false;
    if(window.executeOrderSubmission.__nlsCentralWrapped)return true;
    const original=window.executeOrderSubmission;
    const wrapped=async function(){
      try{return await submitCanonically(original)}
      catch(error){
        console.error("CENTRAL CHECKOUT VALIDATION FAILED:",error);
        alert(error?.message||"Unable to validate the current catalog. Please refresh and try again.");
        const btn=document.getElementById("placeOrderBtn");
        if(btn){btn.disabled=false;btn.innerHTML=`<span class="place-order-content"><i class="fas fa-lock"></i><span>Place Order</span></span>`;}
        throw error;
      }
    };
    wrapped.__nlsCentralWrapped=true;
    window.executeOrderSubmission=wrapped;
    return true;
  }

  const start=Date.now();
  const timer=setInterval(()=>{if(install()||Date.now()-start>10000)clearInterval(timer)},50);
})();
