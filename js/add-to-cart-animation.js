"use strict";
(function(){
  if(window.__NLSAddToCartAnimation)return;
  window.__NLSAddToCartAnimation=true;

  const esc=v=>String(v??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/\"/g,"&quot;").replace(/'/g,"&#039;");
  const norm=v=>String(v??"").trim().toLowerCase();
  const catalog=()=>Array.isArray(window.NLSCentralCatalog?.products)?window.NLSCentralCatalog.products:[];
  const productForSlug=slug=>catalog().find(p=>norm(p?.slug)===norm(slug));
  const imageFor=p=>p?.logo||p?.product_logo||p?.image||p?.image_url||"";

  function slugFromButton(btn){
    const el=btn.closest("[data-product-slug],[data-slug],[data-product]");
    if(el)return el.dataset.productSlug||el.dataset.slug||el.dataset.product||"";
    const href=btn.closest("a")?.getAttribute("href")||"";
    const m=href.match(/\/product\/([^/?#]+)/i);
    return m?decodeURIComponent(m[1]):"";
  }

  function productFromButton(btn){
    const slug=slugFromButton(btn);
    if(slug){const p=productForSlug(slug);if(p)return p;}
    const root=btn.closest(".subscription-card,.product-card,#productDetails,.product-details,.related-card")||document;
    const name=root.querySelector(".product-name,.card-title,h1,h2,h3,h4,[data-product-name]")?.textContent?.trim()||"";
    return catalog().find(p=>norm(p.name)===norm(name));
  }

  function sourceImage(btn,p){
    const root=btn.closest(".subscription-card,.product-card,#productDetails,.product-details,.related-card")||document;
    return root.querySelector("img[src]:not(.nls-logo-img)")?.src||imageFor(p);
  }

  function animate(btn,p){
    const target=document.getElementById("cartBtn")||document.querySelector(".nls-cart-btn,[aria-label*='Shopping cart' i]");
    if(!target)return;
    const src=sourceImage(btn,p);if(!src)return;
    const r=btn.getBoundingClientRect(),t=target.getBoundingClientRect();
    if(!r.width||!r.height||!t.width||!t.height)return;

    const layer=document.createElement("div");
    layer.className="nls-add-cart-fly-layer";
    const startSize=Math.min(92,Math.max(54,Math.min(r.width,r.height)));
    layer.innerHTML=`<div class="nls-add-cart-fly"><img src="${esc(src)}" alt=""><span>${esc(p?.name||"Added to cart")}</span></div>`;
    document.body.appendChild(layer);
    const fly=layer.firstElementChild;
    fly.style.left=`${r.left+r.width/2-startSize/2}px`;
    fly.style.top=`${r.top+r.height/2-startSize/2}px`;
    fly.style.width=`${startSize}px`;
    fly.style.height=`${startSize}px`;

    const endX=t.left+t.width/2-startSize*.22;
    const endY=t.top+t.height/2-startSize*.22;
    const dx=endX-(r.left+r.width/2-startSize/2),dy=endY-(r.top+r.height/2-startSize/2);
    requestAnimationFrame(()=>{
      fly.animate([
        {transform:"translate3d(0,0,0) scale(1)",opacity:1},
        {transform:`translate3d(${dx*.42}px,${dy*.42-70}px,0) scale(.82)`,opacity:.98,offset:.45},
        {transform:`translate3d(${dx}px,${dy}px,0) scale(.2)`,opacity:.15}
      ],{duration:760,easing:"cubic-bezier(.2,.75,.25,1)",fill:"forwards"}).finished.then(()=>{
        target.animate([{transform:"scale(1)"},{transform:"scale(1.12)"},{transform:"scale(1)"}],{duration:260,easing:"ease-out"});
        layer.remove();
      }).catch(()=>layer.remove());
    });
  }

  function injectStyle(){
    if(document.getElementById("nls-add-cart-animation-style"))return;
    const s=document.createElement("style");s.id="nls-add-cart-animation-style";s.textContent=`
      .nls-add-cart-fly-layer{position:fixed;inset:0;z-index:2147483000;pointer-events:none;overflow:visible}
      .nls-add-cart-fly{position:fixed;border-radius:18px;background:rgba(255,255,255,.96);box-shadow:0 14px 38px rgba(0,0,0,.22);padding:7px;display:flex;align-items:center;justify-content:center;will-change:transform,opacity;overflow:visible}
      .nls-add-cart-fly img{width:100%;height:100%;object-fit:contain;border-radius:12px;display:block}
      .nls-add-cart-fly span{position:absolute;left:50%;top:calc(100% + 8px);transform:translateX(-50%);white-space:nowrap;max-width:230px;overflow:hidden;text-overflow:ellipsis;padding:5px 10px;border-radius:999px;background:rgba(15,23,42,.92);color:#fff;font:700 11px/1.2 Inter,system-ui,sans-serif;box-shadow:0 5px 16px rgba(0,0,0,.18)}
      @media(prefers-reduced-motion:reduce){.nls-add-cart-fly{animation:none!important;transition:none!important}}
    `;document.head.appendChild(s);
  }

  function boot(){
    injectStyle();
    document.addEventListener("click",e=>{
      const btn=e.target.closest("button,a");if(!btn)return;
      const text=norm(btn.textContent).replace(/\s+/g," ");
      if(!/^(add to cart|buy now|add|buy)$/.test(text))return;
      if(btn.disabled||btn.getAttribute("aria-disabled")==="true")return;
      const p=productFromButton(btn);if(!p)return;
      requestAnimationFrame(()=>animate(btn,p));
    },true);
  }
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",boot,{once:true});else boot();
})();
