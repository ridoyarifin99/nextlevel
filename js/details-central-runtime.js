"use strict";
(() => {
  if (window.__NLSDetailsCentralRuntime) return;
  window.__NLSDetailsCentralRuntime = true;
  const p = window.__NLS_CENTRAL_PRODUCT__;
  if (!p) return;
  const media = role => (Array.isArray(p.product_media)?p.product_media:[]).filter(x=>x&&x.is_active!==false&&x.role===role).sort((a,b)=>(a.display_order||0)-(b.display_order||0));
  const primary = media('primary')[0]?.url || p.image_url || p.image || '';
  const logo = media('logo')[0]?.url || primary;
  const gallery = media('gallery').map(x=>x.url).filter(Boolean);
  const plans = (p.product_plans||[]).filter(x=>x.is_available!==false).sort((a,b)=>(a.display_order||0)-(b.display_order||0));
  const money = (v,c='BDT') => `${c==='BDT'?'৳':c+' '}${Number(v||0).toLocaleString('en-BD',{minimumFractionDigits:0,maximumFractionDigits:2})}`;
  const esc = v => String(v??'').replace(/[&<>\"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#039;'}[c]));
  const abs = u => {try{return new URL(u,location.origin).href}catch{return u}};
  function setImage(el,url,alt){if(!el||!url)return;el.removeAttribute('srcset');el.src=abs(url);el.alt=alt||p.name}
  function patchImages(){
    const imgs=[...document.querySelectorAll('#productDetails img, main img, article img')];
    if(primary){const candidates=imgs.filter(x=>/product|details|main|hero/i.test(`${x.className} ${x.alt||''}`));setImage(candidates[0]||imgs[0],primary,p.name);}
    if(logo){const logoEl=document.querySelector('#productDetails img.w-16.h-16.rounded-xl')||document.querySelector('#productDetails img');setImage(logoEl,logo,`${p.name} logo`)}
    if(gallery.length){const sig=gallery.join('|');if(document.body.dataset.nlsGallerySig!==sig){document.body.dataset.nlsGallerySig=sig;const thumbs=imgs.slice(1,1+gallery.length);gallery.forEach((u,i)=>setImage(thumbs[i],u,`${p.name} image ${i+1}`));}}
  }
  function patchText(){
    const roots=[...document.querySelectorAll('#productDetails h1, h1, [data-product-name], .product-title, .details-title')];
    const title=roots.find(x=>x.textContent.trim());if(title)title.textContent=p.name;
    const desc=p.description||'';if(desc){const el=document.querySelector('[data-product-description],.product-description,#productDescription');if(el)el.textContent=desc;}
    document.title=`${p.name} Subscription | NEXT LEVEL SUBS`;
    const canonical=document.querySelector('link[rel=canonical]');if(canonical)canonical.href=`${location.origin}/product/${encodeURIComponent(p.slug)}`;
  }
  function patchPlans(){
    if(!plans.length)return;
    const existing=[...document.querySelectorAll('#productDetails button, #productDetails [role="button"], #productDetails .plan-card, #productDetails .pricing-card')];
    const byDuration=new Map(plans.flatMap(x=>[[String(x.duration||'').toLowerCase(),x],[String(x.name||'').toLowerCase(),x]]));
    existing.forEach(el=>{const text=(el.textContent||'').replace(/\s+/g,' ').trim().toLowerCase();const plan=[...byDuration.entries()].find(([k])=>k&&text.includes(k))?.[1];if(!plan)return;const price=money(plan.price,plan.currency||p.currency||'BDT');let priceEl=el.querySelector('[data-price],.price,.plan-price,.pricing-price');if(!priceEl){const nodes=[...el.querySelectorAll('*')].filter(x=>/৳|bdt|\d/.test(x.textContent||''));priceEl=nodes[nodes.length-1]||null}if(priceEl)priceEl.textContent=price;el.dataset.centralPlanId=plan.id||'';});
    const section=[...document.querySelectorAll('h2,h3,h4')].find(x=>/select subscription plan|choose.*plan/i.test(x.textContent||''));
    if(section&&!document.querySelector('[data-central-plan-list]')){
      const wrap=document.createElement('div');wrap.dataset.centralPlanList='1';wrap.className='mt-4 grid grid-cols-2 md:grid-cols-4 gap-3';wrap.innerHTML=plans.map(x=>`<div class="rounded-xl border border-gray-200 bg-white p-4 text-center shadow-sm"><div class="text-sm font-semibold text-gray-700">${esc(x.duration||x.name)}</div><div class="text-xl font-extrabold text-purple-700 mt-1">${esc(money(x.price,x.currency||p.currency||'BDT'))}</div>${x.old_price!=null?`<div class="text-xs text-gray-400 line-through">${esc(money(x.old_price,x.currency||p.currency||'BDT'))}</div>`:''}</div>`).join('');section.parentElement?.insertBefore(wrap,section.nextSibling);
    }
  }
  function patchFeatures(){
    const features=Array.isArray(p.features)?p.features:[];if(!features.length)return;
    const heading=[...document.querySelectorAll('h2,h3,h4')].find(x=>/key features/i.test(x.textContent||''));if(!heading||heading.dataset.centralFeatures==='1')return;heading.dataset.centralFeatures='1';
    const old=heading.parentElement?.querySelector('ul');if(old)old.innerHTML=features.map(x=>`<li>${esc(typeof x==='string'?x:x?.text||x?.name||'')}</li>`).join('');
  }
  function apply(){patchImages();patchText();patchPlans();patchFeatures();}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',apply,{once:true});else apply();
  [300,900,1800,3000].forEach(ms=>setTimeout(apply,ms));
})();
