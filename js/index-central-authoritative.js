"use strict";
/* NEXT LEVEL SUBS — canonical storefront projection for / and category rewrites. */
(function(){
  if(window.__NLSIndexCentralAuthoritative)return;
  window.__NLSIndexCentralAuthoritative=true;

  const norm=v=>String(v??"").trim().toLowerCase();
  const slugify=v=>norm(v).replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"");
  const esc=v=>String(v??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/\"/g,"&quot;").replace(/'/g,"&#039;");
  const escA=esc;
  const CATEGORY_IDS={"best-selling":"bestSellingContainer","popular-streaming":"popularStreamingContainer","music-streaming":"musicStreamingContainer","cloud-storage":"cloudStorageContainer","vpn":"vpnContainer","aiDesign":"aiDesignContainer","combo":"comboContainer","education":"educationContainer","adult":"adultContainer"};

  function categoriesOf(p){
    const values=[];
    if(Array.isArray(p?.categories))values.push(...p.categories);
    if(Array.isArray(p?.extra_data?.categories))values.push(...p.extra_data.categories);
    if(p?.product_categories?.slug)values.push(p.product_categories.slug);
    return [...new Set(values.map(norm).filter(Boolean))];
  }
  function priceOf(p){const plan=(p?.product_plans||[]).find(x=>x&&x.is_available!==false)||p?.product_plans?.[0];return Number(plan?.price??p?.price??0)}
  function durationOf(p){const plan=(p?.product_plans||[]).find(x=>x&&x.is_available!==false)||p?.product_plans?.[0];return plan?.duration||"month"}
  function imageOf(p){return p?.logo||p?.product_logo||p?.image||p?.image_url||""}
  function productForCard(card,catalog){
    const id=card?.dataset?.productId,slug=card?.dataset?.productSlug;
    if(id){const p=catalog.find(x=>String(x.id)===String(id));if(p)return p;}
    if(slug){const p=catalog.find(x=>norm(x.slug)===norm(slug)||slugify(x.slug)===slugify(slug));if(p)return p;}
    const a=card?.querySelector?.('a[href]');
    if(a){try{const u=new URL(a.getAttribute("href"),location.origin);const key=u.searchParams.get("slug")||u.searchParams.get("name")||u.pathname.match(/\/product\/([^/?#]+)/i)?.[1];if(key){const p=catalog.find(x=>norm(x.slug)===norm(key)||slugify(x.slug)===slugify(key)||slugify(x.name)===slugify(key));if(p)return p;}}catch{}}
    const title=card?.querySelector?.("h3,h4,.product-name,.subscription-name,.product-title,.subscription-title")?.textContent;
    if(title){const p=catalog.find(x=>norm(x.name)===norm(title));if(p)return p;}
    return null;
  }
  function decorateCard(card,p){
    if(!card||!p)return;
    card.dataset.productId=p.id||"";card.dataset.productSlug=p.slug||"";
    const image=imageOf(p),name=p.name||"",price=priceOf(p),duration=durationOf(p);
    const img=card.querySelector("img");if(img&&image){img.src=image;img.removeAttribute("srcset");img.alt=name+" logo";}
    const title=card.querySelector("h3,h4,.product-name,.subscription-name,.product-title,.subscription-title");if(title)title.textContent=name;
    const desc=card.querySelector("p");if(desc&&p.description!=null)desc.textContent=p.description;
    card.querySelectorAll("[data-product-price],.product-price,.subscription-price").forEach(el=>{if(!el.dataset.nlsManualPrice)el.textContent=`৳${price.toLocaleString("en-BD")}`});
    const priceText=[...card.querySelectorAll("span,div")].find(el=>/^৳[\d,]+$/.test(el.textContent.trim()));if(priceText)priceText.textContent=`৳${price.toLocaleString("en-BD")}`;
    const dur=[...card.querySelectorAll("span")].find(el=>/^\//.test(el.textContent.trim()));if(dur)dur.textContent=`/${duration}`;
    const link=card.querySelector("a.card-link,a[href]");if(link&&p.slug)link.href=`/product/${encodeURIComponent(p.slug)}`;
  }
  function makeCard(p){
    const card=document.createElement("div");card.className="subscription-card";card.dataset.productId=p.id||"";card.dataset.productSlug=p.slug||"";card.setAttribute("data-aos","fade-up");
    const image=imageOf(p),name=p.name||"",description=p.description||"",price=priceOf(p),duration=durationOf(p),cats=categoriesOf(p),combo=cats.includes("combo"),best=cats.includes("best-selling")||!!p.is_featured;
    const iH=image?`<img src="${escA(image)}" alt="${escA(name)} logo" class="product-image" loading="lazy" decoding="async">`:`<i class="${escA(p.icon||"fas fa-play-circle")} product-icon"></i>`;
    const b=best?'<span class="best-seller-badge">BEST SELLER</span>':'';
    const cb=combo?'<span class="combo-badge">COMBO</span>':'';
    let services="";
    if(combo&&Array.isArray(p.services)){services='<div class="combo-services mt-2">'+p.services.map((s,i)=>`<div class="flex items-center"><div class="combo-service-icon mr-1"><i class="${escA(p.serviceIcons?.[i]||"fas fa-circle")}" style="color:${escA(p.serviceColors?.[i]||p.color||"")};font-size:12px;"></i></div><span class="text-xs">${esc(s)}</span></div>`).join("")+"</div>";}
    card.innerHTML=`${b}${cb}<a href="/product/${encodeURIComponent(p.slug||"")}" class="card-link" aria-label="View ${escA(name)}"><div class="product-image-container">${iH}</div><div class="p-3 sm:p-4"><h3 class="font-bold text-base sm:text-lg leading-tight mb-1">${esc(name)}</h3><p class="text-xs text-gray-500 mb-3 line-clamp-2" style="display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;">${esc(description)}</p>${services}<div class="flex justify-between items-center mb-3"><div><span class="text-lg sm:text-xl font-bold">৳${price.toLocaleString("en-BD")}</span><span class="text-xs text-gray-500">/${esc(duration)}</span></div></div><div class="flex flex-col gap-2"><button type="button" class="w-full py-1.5 sm:py-2 rounded-lg font-medium text-white text-sm btn-primary" data-central-add-cart="1">Add to Cart</button><span class="nls-btn-details text-sm">See Details <i class="fa-solid fa-arrow-right-long"></i></span></div></div></a>`;
    card.querySelector('[data-central-add-cart]')?.addEventListener("click",e=>{e.preventDefault();e.stopPropagation();window.NLSCentralAddToCart?.(p.slug);});
    return card;
  }
  function renderCatalog(){
    const c=window.NLSCentralCatalog;if(!c?.products)return false;
    const catalog=c.products;
    Object.entries(CATEGORY_IDS).forEach(([cat,id])=>{
      const container=document.getElementById(id);if(!container)return;
      const products=catalog.filter(p=>categoriesOf(p).includes(cat)||(cat==="best-selling"&&p.is_featured));
      const existing=[...container.querySelectorAll(":scope > .subscription-card")];
      const byId=new Map(existing.map(card=>[String(card.dataset.productId||""),card]));
      const bySlug=new Map(existing.map(card=>[norm(card.dataset.productSlug||""),card]));
      const used=new Set();
      products.forEach((p,idx)=>{
        let card=byId.get(String(p.id))||bySlug.get(norm(p.slug));
        if(!card){card=makeCard(p);}else decorateCard(card,p);
        card.dataset.centralAuthoritative="1";card.style.order=String(idx);container.appendChild(card);used.add(card);
      });
      existing.forEach(card=>{if(!used.has(card))card.remove();});
      if(!products.length){container.innerHTML='<p class="text-gray-500 text-center col-span-full text-sm py-4">No subscriptions available in this category</p>';}
    });
    return true;
  }
  function syncCart(){
    try{
      const raw=localStorage.getItem("streamHubCart");if(!raw)return;
      const cart=JSON.parse(raw);if(!Array.isArray(cart))return;
      const catalog=window.NLSCentralCatalog?.products||[];const bySlug=new Map(catalog.map(p=>[norm(p.slug),p]));
      const next=cart.map(i=>{const p=bySlug.get(norm(i.slug||i.product_slug));if(!p)return null;const plan=p.product_plans?.find(x=>String(x.id)===String(i.selectedPlan?.id))||p.product_plans?.find(x=>norm(x.duration)===norm(i.duration))||p.product_plans?.[0];if(!plan)return null;return {...i,name:p.name,slug:p.slug,product_slug:p.slug,image:p.image,logo:p.logo,product_logo:p.logo,price:Number(plan.price??p.price??0),duration:plan.duration||i.duration,selectedPlan:{...plan,price:Number(plan.price||0)}}}).filter(Boolean);
      localStorage.setItem("streamHubCart",JSON.stringify(next));
      window.dispatchEvent(new CustomEvent("nextlevel:checkout-cart-updated",{detail:{cart:next}}));
      if(typeof window.updateCartUI==="function")window.updateCartUI();
    }catch{}
  }
  function addToCart(slug){const c=window.NLSCentralCatalog,p=c?.getBySlug?.(slug)||c?.products?.find(x=>norm(x.slug)===norm(slug));if(!p)return;let cart=[];try{cart=JSON.parse(localStorage.getItem("streamHubCart")||"[]");if(!Array.isArray(cart))cart=[];}catch{cart=[];}const plan=p.product_plans?.[0];const found=cart.find(i=>norm(i.slug)===norm(p.slug));if(found)found.quantity=Number(found.quantity||0)+1;else cart.push({name:p.name,slug:p.slug,product_slug:p.slug,image:p.image,logo:p.logo,product_logo:p.logo,price:Number(plan?.price??p.price??0),duration:plan?.duration||"month",selectedPlan:plan?{...plan,price:Number(plan.price||0)}:undefined,quantity:1});localStorage.setItem("streamHubCart",JSON.stringify(cart));window.dispatchEvent(new CustomEvent("nextlevel:checkout-cart-updated",{detail:{cart}}));if(typeof window.updateCartUI==="function")window.updateCartUI();}
  window.NLSCentralAddToCart=addToCart;
  window.addToCart=(slug)=>addToCart(slug);

  let applying=false;
  function apply(){if(applying)return;applying=true;try{syncCart();renderCatalog();}finally{applying=false;}}
  function boot(){apply();window.addEventListener("nls:central-catalog-ready",apply);window.addEventListener("nextlevel:products-updated",apply);new MutationObserver(()=>{if(window.NLSCentralCatalog?.products?.length)requestAnimationFrame(apply)}).observe(document.body,{childList:true,subtree:true});setInterval(apply,5000);}
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",boot,{once:true});else boot();
})();
