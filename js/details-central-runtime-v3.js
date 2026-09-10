"use strict";
(() => {
  if (window.__NLSDetailsV3) return;
  window.__NLSDetailsV3 = true;

  const boot = () => {
    const p = window.__NLS_CENTRAL_PRODUCT__;
    const root = document.getElementById("productDetails");
    if (!p || !root) return;

    const esc=v=>String(v??"").replace(/[&<>\"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#039;"}[c]));
    const money=(v,c="BDT")=>`${c==="BDT"?"৳":c+" "}${Number(v||0).toLocaleString("en-BD")}`;
    const media=(role)=>Array.isArray(p.product_media)?p.product_media.filter(x=>x&&x.is_active!==false&&x.role===role).sort((a,b)=>(a.display_order||0)-(b.display_order||0)):[];
    const primary=media("primary")[0]?.url||p.image_url||p.image||"";
    const images=[primary,...media("gallery").map(x=>x.url)].filter(Boolean).filter((x,i,a)=>a.indexOf(x)===i);
    const plans=(p.product_plans||[]).filter(x=>x&&x.is_available!==false).sort((a,b)=>(a.display_order||0)-(b.display_order||0));
    const features=Array.isArray(p.features)?p.features:[];
    const rating=Number(p.rating||5);
    const reviews=Number(p.reviews||0);
    let selected=0,slide=0;

    const style=document.createElement("style");
    style.textContent=`
      .nls-v3{display:grid;grid-template-columns:minmax(0,1.05fr) minmax(0,.95fr);gap:28px;align-items:start}
      .nls-v3-card{background:#fff;border:1px solid #e8eaf0;border-radius:24px;box-shadow:0 18px 55px rgba(31,35,55,.08);overflow:hidden}
      .nls-v3-gallery{background:linear-gradient(145deg,#f7f4ff,#f8fbff);padding:18px}
      .nls-v3-main-image{width:100%;height:430px;object-fit:contain;background:#fff;border-radius:20px}
      .nls-v3-thumbs{display:flex;gap:10px;overflow:auto;padding-top:12px}
      .nls-v3-thumb{width:68px;height:68px;object-fit:cover;border-radius:13px;border:2px solid transparent;background:#fff;cursor:pointer;flex:0 0 auto}
      .nls-v3-thumb.active{border-color:#6a11cb;box-shadow:0 5px 18px rgba(106,17,203,.18)}
      .nls-v3-info{padding:28px}
      .nls-v3-brand{display:flex;gap:16px;align-items:center;margin-bottom:18px}
      .nls-v3-logo{width:64px;height:64px;border-radius:18px;object-fit:contain;background:#fff;border:1px solid #eee;box-shadow:0 8px 25px rgba(0,0,0,.07);padding:7px}
      .nls-v3-title{font-size:clamp(1.65rem,3vw,2.35rem);line-height:1.1;font-weight:800;margin:0;background:linear-gradient(100deg,#6a11cb,#2575fc);-webkit-background-clip:text;background-clip:text;color:transparent}
      .nls-v3-rating{font-size:.9rem;color:#64748b;margin-top:7px}.nls-v3-rating i{color:#f59e0b}
      .nls-v3-desc{font-size:1rem;line-height:1.7;color:#64748b;margin:18px 0 22px}
      .nls-v3-label{font-weight:800;color:#172033;font-size:1rem;margin:0 0 11px}
      .nls-v3-plans{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}
      .nls-v3-plan{position:relative;padding:15px;border:1.5px solid #e6e8ef;border-radius:16px;background:#fff;cursor:pointer;transition:.2s ease}
      .nls-v3-plan:hover{transform:translateY(-2px);border-color:#a78bfa}.nls-v3-plan.active{border-color:#6a11cb;background:linear-gradient(145deg,#faf7ff,#f5f9ff);box-shadow:0 8px 25px rgba(106,17,203,.12)}
      .nls-v3-plan-name{font-size:.88rem;color:#64748b;font-weight:700}.nls-v3-price{font-size:1.35rem;font-weight:850;color:#151a2b;margin-top:4px}.nls-v3-old{font-size:.72rem;color:#94a3b8;text-decoration:line-through}.nls-v3-pop{position:absolute;top:-9px;right:10px;background:#6a11cb;color:#fff;font-size:.58rem;font-weight:800;padding:4px 7px;border-radius:999px}
      .nls-v3-actions{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:22px}.nls-v3-btn{border:0;border-radius:14px;padding:13px 14px;font-weight:800;color:#fff;cursor:pointer}.nls-v3-cart{background:linear-gradient(100deg,#6a11cb,#2575fc)}.nls-v3-buy{background:#25d366}.nls-v3-trust{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-top:18px}.nls-v3-trust div{font-size:.72rem;color:#64748b;text-align:center;background:#f8fafc;border-radius:12px;padding:10px 5px}.nls-v3-trust i{display:block;font-size:1rem;color:#6a11cb;margin-bottom:4px}
      .nls-v3-section{margin-top:26px}.nls-v3-section-title{font-size:1.3rem;font-weight:850;color:#172033;margin:0 0 13px}.nls-v3-features{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:9px}.nls-v3-feature{display:flex;gap:9px;align-items:flex-start;padding:12px 13px;background:#f8fafc;border:1px solid #eef0f5;border-radius:13px;color:#475569;font-size:.9rem}.nls-v3-feature i{color:#22c55e;margin-top:3px}.nls-v3-tabs{display:flex;gap:7px;overflow:auto;border-bottom:1px solid #e5e7eb;margin-bottom:18px}.nls-v3-tab{border:0;background:none;padding:11px 14px;font-weight:750;color:#64748b;cursor:pointer;border-bottom:2px solid transparent;white-space:nowrap}.nls-v3-tab.active{color:#6a11cb;border-color:#6a11cb}.nls-v3-tab-content{line-height:1.75;color:#475569}.nls-v3-faq{border:1px solid #e7e9ef;border-radius:13px;padding:15px;margin-bottom:9px}.nls-v3-faq b{color:#172033}.nls-v3-empty{color:#64748b;padding:20px;background:#f8fafc;border-radius:14px}
      @media(max-width:900px){.nls-v3{grid-template-columns:1fr}.nls-v3-main-image{height:360px}}
      @media(max-width:640px){.nls-v3-info{padding:19px}.nls-v3-gallery{padding:12px}.nls-v3-main-image{height:300px}.nls-v3-features{grid-template-columns:1fr}.nls-v3-actions{grid-template-columns:1fr}.nls-v3-trust{grid-template-columns:1fr 1fr 1fr}.nls-v3-plan{padding:12px}}
    `;
    document.head.appendChild(style);

    const stars=()=>Array.from({length:5},(_,i)=>`<i class="${i+1<=Math.round(rating)?"fas":"far"} fa-star"></i>`).join("");
    const render=()=>{
      const image=images[slide]||primary;
      root.innerHTML=`<div class="nls-v3">
        <div class="nls-v3-card nls-v3-gallery"><img id="nlsV3MainImage" class="nls-v3-main-image" src="${esc(image)}" alt="${esc(p.name)}"><div class="nls-v3-thumbs">${images.map((u,i)=>`<img class="nls-v3-thumb ${i===slide?"active":""}" src="${esc(u)}" alt="${esc(p.name)} ${i+1}" data-gallery="${i}">`).join("")}</div></div>
        <div class="nls-v3-card nls-v3-info">
          <div class="nls-v3-brand"><img class="nls-v3-logo" src="${esc(primary)}" alt="${esc(p.name)}"><div><h1 class="nls-v3-title">${esc(p.name)}</h1><div class="nls-v3-rating">${stars()} <b>${rating.toFixed(1)}</b> · ${reviews.toLocaleString()} reviews</div></div></div>
          <div class="nls-v3-desc">${esc(p.description||"Premium subscription with instant delivery and support.")}</div>
          <div class="nls-v3-label">Choose your plan</div>
          <div class="nls-v3-plans">${plans.map((pl,i)=>`<div class="nls-v3-plan ${i===selected?"active":""}" data-plan="${i}">${pl.is_popular||pl.popular?'<span class="nls-v3-pop">POPULAR</span>':''}<div class="nls-v3-plan-name">${esc(pl.duration||pl.name||"Plan")}</div><div class="nls-v3-price">${money(pl.price,pl.currency||p.currency||"BDT")}</div>${pl.old_price!=null?`<div class="nls-v3-old">${money(pl.old_price,pl.currency||p.currency||"BDT")}</div>`:""}</div>`).join("")}</div>
          <div class="nls-v3-actions"><button class="nls-v3-btn nls-v3-cart" id="nlsV3Cart"><i class="fa-solid fa-cart-shopping"></i> Add to Cart</button><button class="nls-v3-btn nls-v3-buy" id="nlsV3Buy"><i class="fa-brands fa-whatsapp"></i> Buy Now</button></div>
          <div class="nls-v3-trust"><div><i class="fa-solid fa-bolt"></i>Instant Delivery</div><div><i class="fa-solid fa-shield-halved"></i>Secure Payment</div><div><i class="fa-solid fa-headset"></i>24/7 Support</div></div>
        </div>
      </div>
      <div class="nls-v3-card nls-v3-info nls-v3-section"><h2 class="nls-v3-section-title">What you get</h2><div class="nls-v3-features">${features.map(f=>`<div class="nls-v3-feature"><i class="fa-solid fa-circle-check"></i><span>${esc(typeof f==="string"?f:f?.text||f?.name||"")}</span></div>`).join("")}</div></div>
      <div class="nls-v3-card nls-v3-info nls-v3-section"><div class="nls-v3-tabs"><button class="nls-v3-tab active" data-tab="description">Description</button><button class="nls-v3-tab" data-tab="features">Features</button><button class="nls-v3-tab" data-tab="faq">FAQ</button><button class="nls-v3-tab" data-tab="reviews">Reviews</button></div><div id="nlsV3TabContent" class="nls-v3-tab-content"></div></div>`;
      root.querySelectorAll("[data-gallery]").forEach(x=>x.onclick=()=>{slide=Number(x.dataset.gallery)||0;render()});
      root.querySelectorAll("[data-plan]").forEach(x=>x.onclick=()=>{selected=Number(x.dataset.plan)||0;render()});
      root.querySelector("#nlsV3Cart").onclick=addToCart;
      root.querySelector("#nlsV3Buy").onclick=buyNow;
      root.querySelectorAll("[data-tab]").forEach(x=>x.onclick=()=>tab(x.dataset.tab));
      tab("description");
    };
    const selectedPlan=()=>plans[selected]||plans[0]||{price:p.price||0,currency:p.currency||"BDT",duration:"Standard"};
    const save=()=>{const pl=selectedPlan();let cart=[];try{cart=JSON.parse(localStorage.getItem("streamHubCart")||"[]")}catch{}if(!Array.isArray(cart))cart=[];const item={...p,product_id:p.id,selectedPlan:{...pl,product_id:p.id},plan_id:pl.id||null,price:pl.price,quantity:1,image:primary};const i=cart.findIndex(x=>x.product_id===p.id);if(i>=0)cart[i]=item;else cart.push(item);localStorage.setItem("streamHubCart",JSON.stringify(cart));window.dispatchEvent(new Event("cartUpdated"));return item};
    const addToCart=()=>{save();const m=document.getElementById("successModal");if(m)m.classList.remove("hidden")};
    const buyNow=()=>{save();location.href="/checkout.html"};
    const tab=name=>{const out=root.querySelector("#nlsV3TabContent");root.querySelectorAll("[data-tab]").forEach(x=>x.classList.toggle("active",x.dataset.tab===name));if(name==="description")out.innerHTML=`<p>${esc(p.description||"No description available.")}</p>`;else if(name==="features")out.innerHTML=`<div class="nls-v3-features">${features.map(f=>`<div class="nls-v3-feature"><i class="fa-solid fa-circle-check"></i><span>${esc(typeof f==="string"?f:f?.text||f?.name||"")}</span></div>`).join("")}</div>`;else if(name==="faq")out.innerHTML=(p.faq||[]).length?(p.faq||[]).map(f=>`<div class="nls-v3-faq"><b>${esc(f.question||"")}</b><div>${esc(f.answer||"")}</div></div>`).join(""):"<div class=\"nls-v3-empty\">No FAQs available for this product.</div>";else out.innerHTML="<div class=\"nls-v3-empty\">Customer reviews will appear here as they are published.</div>"};

    document.title=`${p.name} Subscription | NEXT LEVEL SUBS`;
    const crumb=document.getElementById("breadcrumbProduct");if(crumb)crumb.textContent=p.name;
    render();
  };
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",boot,{once:true});else boot();
})();
