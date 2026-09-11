"use strict";
/* NEXT LEVEL SUBS — index.html product-card bridge. Central catalog is authoritative. */
(function(){
  if(window.__NLSIndexCentralSync)return;
  window.__NLSIndexCentralSync=true;

  const norm=v=>String(v||"").trim().toLowerCase();
  const slugify=v=>norm(v).replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"");
  const getSlugFromHref=href=>{
    try{
      const u=new URL(href,location.origin);
      const q=u.searchParams.get("slug")||u.searchParams.get("product")||u.searchParams.get("product_slug")||u.searchParams.get("name");
      if(q)return q;
      const m=u.pathname.match(/\/product\/([^/?#]+)/i); if(m)return decodeURIComponent(m[1]);
      const d=u.pathname.match(/details\.html$/i);
      if(d)return u.searchParams.get("id")||u.searchParams.get("product_id")||"";
    }catch{}
    return "";
  };
  const productForAnchor=a=>{
    const c=window.NLSCentralCatalog;if(!c?.products?.length)return null;
    const slug=getSlugFromHref(a.getAttribute("href")||"");
    if(slug){const p=c.getBySlug(slug)||c.products.find(x=>slugify(x.slug)===slugify(slug)||slugify(x.name)===slugify(slug));if(p)return p;}
    const card=a.closest("article,.product-card,.subscription-card,[data-product-slug],[data-product-id]");
    const key=card?.dataset?.productSlug||card?.dataset?.productId||"";
    if(key){const p=c.getBySlug(key)||c.getById(key)||c.products.find(x=>slugify(x.slug)===slugify(key)||slugify(x.name)===slugify(key));if(p)return p;}
    return null;
  };
  const cardFor=a=>a.closest("article,.product-card,.subscription-card,[data-product-card]")||a.parentElement?.closest("div");
  const setText=(el,value)=>{if(el&&String(el.textContent)!==String(value))el.textContent=value;};
  const syncCard=(card,p)=>{
    if(!card||!p)return;
    card.dataset.productSlug=p.slug||""; card.dataset.productId=p.id||"";
    const name=p.name||"";
    const nameEls=card.querySelectorAll("[data-product-name],.product-name,.subscription-name,.product-title,.subscription-title,h3,h4");
    if(nameEls.length)setText(nameEls[0],name);
    const image=p.logo||p.image||"";
    if(image){
      const img=card.querySelector("img");
      if(img){img.src=image;img.removeAttribute("srcset");img.alt=name+" logo";}
    }
    const plan=p.product_plans?.[0];
    const price=plan?.price??p.price;
    if(price!=null){
      card.querySelectorAll("[data-product-price],.product-price,.subscription-price,[class*='price']").forEach(el=>{
        if(!el.dataset.nlsManualPrice) setText(el,`৳${Number(price||0).toLocaleString("en-BD")}`);
      });
    }
  };
  const pruneDeletedCards=()=>{
    const c=window.NLSCentralCatalog;if(!c?.products?.length)return;
    const knownIds=new Set(c.products.map(p=>String(p.id||"")));
    const knownSlugs=new Set(c.products.flatMap(p=>[norm(p.slug),slugify(p.slug),slugify(p.name)].filter(Boolean)));
    const isKnown=p=>p&&((p.id&&knownIds.has(String(p.id)))||knownSlugs.has(norm(p.slug))||knownSlugs.has(slugify(p.slug))||knownSlugs.has(slugify(p.name)));
    const candidates=new Set();
    document.querySelectorAll("[data-product-slug],[data-product-id]").forEach(el=>{
      const card=el.closest("article,.product-card,.subscription-card,[data-product-card]")||el;
      if(card)candidates.add(card);
    });
    document.querySelectorAll('a[href*="details.html"],a[href*="/product/"]').forEach(a=>{
      const card=a.closest("article,.product-card,.subscription-card,[data-product-card]")||a.parentElement?.closest("div");
      if(!card)return;
      const hrefKey=getSlugFromHref(a.getAttribute("href")||"");
      if(!hrefKey)return;
      const p=c.products.find(x=>norm(x.slug)===norm(hrefKey)||slugify(x.slug)===slugify(hrefKey)||slugify(x.name)===slugify(hrefKey)||String(x.id||"")===String(hrefKey));
      if(!isKnown(p))candidates.add(card);
    });
    candidates.forEach(card=>{
      const id=String(card.dataset?.productId||"");
      const slug=norm(card.dataset?.productSlug||"");
      if((id&&!knownIds.has(id))||(slug&&!knownSlugs.has(slug)&&!knownSlugs.has(slugify(slug))))card.remove();
      else if(!id&&!slug){
        const a=card.querySelector('a[href*="details.html"],a[href*="/product/"]');
        if(a){const key=getSlugFromHref(a.getAttribute("href")||"");const p=c.products.find(x=>String(x.id||"")===String(key)||norm(x.slug)===norm(key)||slugify(x.slug)===slugify(key)||slugify(x.name)===slugify(key));if(!isKnown(p))card.remove();}
      }
    });
  };
  const apply=()=>{
    const c=window.NLSCentralCatalog;if(!c?.products?.length)return;
    pruneDeletedCards();
    document.querySelectorAll("a[href]").forEach(a=>{const p=productForAnchor(a);if(p)syncCard(cardFor(a),p);});
    document.querySelectorAll("[data-product-slug],[data-product-id]").forEach(card=>{const p=c.getBySlug(card.dataset.productSlug)||c.getById(card.dataset.productId);if(p)syncCard(card,p);});
  };
  const boot=()=>{
    apply();
    window.addEventListener("nls:central-catalog-ready",apply);
    window.addEventListener("nextlevel:products-updated",apply);
    new MutationObserver(()=>requestAnimationFrame(apply)).observe(document.body,{childList:true,subtree:true});
    setInterval(apply,5000);
  };
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",boot,{once:true});else boot();
})();
