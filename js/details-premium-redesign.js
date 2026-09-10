"use strict";
/* NEXT LEVEL SUBS — premium details-page UX layer. Keeps the central catalog and existing business logic intact. */
(function(){
  if(window.__NLSDetailsPremiumRedesign)return;
  window.__NLSDetailsPremiumRedesign=true;
  if(!/\/details\.html$/i.test(location.pathname)&&!/\/product\//i.test(location.pathname))return;

  const css=`
  :root{--nls-p1:#6a11cb;--nls-p2:#2575fc;--nls-ink:#111827;--nls-muted:#64748b;--nls-border:rgba(148,163,184,.18);--nls-glass:rgba(255,255,255,.78);--nls-radius:24px;--nls-ease:cubic-bezier(.16,1,.3,1)}
  body{background:radial-gradient(circle at 10% 0%,rgba(106,17,203,.08),transparent 32%),radial-gradient(circle at 90% 12%,rgba(37,117,252,.08),transparent 30%),#f7f9fc!important;color:var(--nls-ink)}
  body.nls-details-loading>*:not(#nlsPremiumLoader){opacity:.08!important;filter:blur(3px);pointer-events:none}
  #nlsPremiumLoader{position:fixed;inset:0;z-index:99999;display:grid;place-items:center;background:linear-gradient(135deg,#070713,#11152a);color:#fff;transition:opacity .55s var(--nls-ease),visibility .55s var(--nls-ease)}
  #nlsPremiumLoader.nls-loaded{opacity:0;visibility:hidden;pointer-events:none}
  .nls-loader-card{width:min(420px,88vw);padding:34px 30px;border:1px solid rgba(255,255,255,.13);border-radius:28px;background:rgba(255,255,255,.07);backdrop-filter:blur(24px);box-shadow:0 30px 100px rgba(0,0,0,.35);text-align:center}
  .nls-loader-logo{width:62px;height:62px;object-fit:contain;margin:0 auto 18px;animation:nlsLogoPulse 1.8s ease-in-out infinite}
  .nls-loader-spinner{width:42px;height:42px;margin:20px auto;border:3px solid rgba(255,255,255,.16);border-top-color:#fff;border-right-color:#8b5cf6;border-radius:50%;animation:nlsSpin .8s linear infinite}
  .nls-loader-title{font-weight:800;font-size:20px;letter-spacing:-.02em}.nls-loader-status{margin-top:6px;color:rgba(255,255,255,.62);font-size:13px}.nls-loader-track{height:4px;margin-top:22px;background:rgba(255,255,255,.12);border-radius:99px;overflow:hidden}.nls-loader-progress{height:100%;width:8%;background:linear-gradient(90deg,#6a11cb,#2575fc,#22d3ee);border-radius:inherit;transition:width .35s ease}
  @keyframes nlsSpin{to{transform:rotate(360deg)}}@keyframes nlsLogoPulse{0%,100%{transform:scale(1);filter:drop-shadow(0 0 0 transparent)}50%{transform:scale(1.08);filter:drop-shadow(0 10px 28px rgba(106,17,203,.45))}}

  main, .details-main, .product-details-main, #productDetails, #detailsPage{position:relative}
  .nls-premium-container{width:min(1420px,calc(100% - 32px));margin:0 auto}
  .nls-premium-breadcrumb{display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin:22px auto 10px;color:#64748b;font-size:13px}.nls-premium-breadcrumb a{color:#64748b;text-decoration:none}.nls-premium-breadcrumb a:hover{color:var(--nls-p1)}
  .gallery-container{border-radius:28px!important;border:1px solid rgba(255,255,255,.65);box-shadow:0 28px 70px -24px rgba(45,31,90,.25)!important;background:#fff;isolation:isolate}
  .gallery-container:before{content:"";position:absolute;inset:-2px;border-radius:30px;background:linear-gradient(135deg,rgba(106,17,203,.35),rgba(37,117,252,.18),transparent 60%);z-index:-1;opacity:.55}
  .gallery-slide img{transition:transform .8s var(--nls-ease),filter .4s ease}.gallery-slide:hover img{transform:scale(1.025)}
  .gallery-thumbnail{border-radius:14px!important;overflow:hidden;background:#fff;box-shadow:0 8px 22px rgba(15,23,42,.06)}
  .gallery-nav{width:48px!important;height:48px!important;border:1px solid rgba(255,255,255,.7)!important;box-shadow:0 10px 30px rgba(15,23,42,.16)!important}

  .plan-card{border:1px solid rgba(148,163,184,.2)!important;border-radius:20px!important;box-shadow:0 10px 30px rgba(15,23,42,.05)!important;transform:none!important;background:linear-gradient(180deg,#fff,#fbfcff)!important}
  .plan-card:hover{transform:translateY(-6px)!important;border-color:rgba(106,17,203,.35)!important;box-shadow:0 20px 42px rgba(106,17,203,.12)!important}
  .plan-card.selected{border:2px solid transparent!important;background:linear-gradient(#fff,#fff) padding-box,linear-gradient(135deg,#6a11cb,#2575fc) border-box!important;box-shadow:0 22px 48px rgba(106,17,203,.16)!important}
  .plan-card.selected:after{content:"✓ Selected";position:absolute;right:14px;top:12px;padding:4px 9px;border-radius:99px;background:linear-gradient(135deg,#6a11cb,#2575fc);color:#fff;font-size:10px;font-weight:800;letter-spacing:.02em;box-shadow:0 6px 16px rgba(106,17,203,.24)}
  .popular-badge{box-shadow:0 8px 22px rgba(255,71,87,.3)!important}

  .feature-item{border:1px solid transparent;border-radius:14px;transition:transform .35s var(--nls-ease),background .35s ease,border-color .35s ease!important}.feature-item:hover{transform:translateX(7px)!important;background:rgba(106,17,203,.055)!important;border-color:rgba(106,17,203,.12)}
  .tab-button{padding:15px 20px!important;border-radius:14px 14px 0 0}.tab-button.active{background:linear-gradient(180deg,rgba(106,17,203,.07),transparent)}

  .btn-primary,.btn-whatsapp,.cart-checkout-btn{min-height:48px;border-radius:14px!important;font-weight:750!important;letter-spacing:.01em}.btn-primary:focus-visible,.btn-whatsapp:focus-visible,.cart-checkout-btn:focus-visible,.plan-card:focus-visible{outline:3px solid rgba(37,117,252,.28);outline-offset:3px}
  button:not(:disabled),a.nls-nav-link,.nls-account-link,.nls-cart-btn,.gallery-nav,.gallery-thumbnail,.tab-button{cursor:pointer}
  .nls-ripple{position:absolute;border-radius:50%;pointer-events:none;background:rgba(255,255,255,.42);transform:scale(0);animation:nlsRipple .65s ease-out}.btn-primary,.btn-whatsapp,.cart-checkout-btn{isolation:isolate}.btn-primary>* ,.btn-whatsapp>*{position:relative;z-index:1}@keyframes nlsRipple{to{transform:scale(5);opacity:0}}

  .nls-reveal{opacity:0;transform:translateY(28px) scale(.985);transition:opacity .75s var(--nls-ease),transform .75s var(--nls-ease)}.nls-reveal.nls-visible{opacity:1;transform:none}.nls-reveal[data-nls-delay="1"]{transition-delay:.08s}.nls-reveal[data-nls-delay="2"]{transition-delay:.16s}.nls-reveal[data-nls-delay="3"]{transition-delay:.24s}
  .nls-section-glass{background:var(--nls-glass)!important;border:1px solid var(--nls-border)!important;border-radius:26px!important;box-shadow:0 20px 60px rgba(15,23,42,.055)!important;backdrop-filter:blur(18px);-webkit-backdrop-filter:blur(18px)}
  .nls-section-glass h2,.nls-section-glass h3{letter-spacing:-.035em}

  .nls-sticky-buy{position:fixed;left:50%;bottom:18px;z-index:900;transform:translate(-50%,30px);opacity:0;visibility:hidden;width:min(720px,calc(100% - 24px));padding:10px;display:flex;align-items:center;gap:10px;border:1px solid rgba(255,255,255,.55);border-radius:18px;background:rgba(255,255,255,.84);backdrop-filter:blur(20px) saturate(160%);box-shadow:0 22px 60px rgba(15,23,42,.2);transition:.45s var(--nls-ease)}
  .nls-sticky-buy.nls-show{transform:translate(-50%,0);opacity:1;visibility:visible}.nls-sticky-buy-info{min-width:0;flex:1}.nls-sticky-buy-name{font-weight:800;font-size:13px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.nls-sticky-buy-price{font-weight:800;font-size:14px;background:linear-gradient(90deg,#6a11cb,#2575fc);-webkit-background-clip:text;background-clip:text;color:transparent}.nls-sticky-buy button{border:0;color:#fff;background:linear-gradient(135deg,#6a11cb,#2575fc);border-radius:12px;padding:12px 18px;font-weight:800;cursor:pointer;box-shadow:0 8px 20px rgba(106,17,203,.28);white-space:nowrap}.nls-sticky-buy button:active{transform:scale(.97)}
  .nls-progress{position:fixed;top:0;left:0;width:100%;height:3px;z-index:2000;pointer-events:none}.nls-progress span{display:block;height:100%;width:0;background:linear-gradient(90deg,#6a11cb,#2575fc,#22d3ee);box-shadow:0 0 14px rgba(37,117,252,.55);transition:width .08s linear}
  .nls-top-btn{position:fixed;right:22px;bottom:22px;width:46px;height:46px;border:1px solid rgba(255,255,255,.6);border-radius:50%;background:rgba(255,255,255,.8);backdrop-filter:blur(14px);color:#6a11cb;box-shadow:0 12px 30px rgba(15,23,42,.15);z-index:880;opacity:0;visibility:hidden;transform:translateY(12px);transition:.35s var(--nls-ease);cursor:pointer}.nls-top-btn.nls-show{opacity:1;visibility:visible;transform:none}.nls-top-btn:hover{transform:translateY(-3px)}
  .nls-lightbox{position:fixed;inset:0;background:rgba(2,6,23,.86);backdrop-filter:blur(12px);z-index:3000;display:grid;place-items:center;opacity:0;visibility:hidden;transition:.35s ease}.nls-lightbox.open{opacity:1;visibility:visible}.nls-lightbox img{max-width:min(94vw,1200px);max-height:88vh;object-fit:contain;border-radius:18px;box-shadow:0 30px 100px rgba(0,0,0,.45);transform:scale(.95);transition:.4s var(--nls-ease)}.nls-lightbox.open img{transform:scale(1)}.nls-lightbox-close{position:absolute;right:22px;top:20px;width:44px;height:44px;border:1px solid rgba(255,255,255,.2);border-radius:50%;background:rgba(255,255,255,.1);color:#fff;font-size:20px;cursor:pointer}
  .subscription-card{border-radius:20px!important;border:1px solid rgba(148,163,184,.16)!important;box-shadow:0 12px 30px rgba(15,23,42,.06)!important;overflow:hidden;transition:transform .4s var(--nls-ease),box-shadow .4s var(--nls-ease),border-color .4s ease!important}.subscription-card:hover{transform:translateY(-7px)!important;box-shadow:0 24px 50px rgba(106,17,203,.13)!important;border-color:rgba(106,17,203,.2)!important}
  .faq-item{border:1px solid rgba(148,163,184,.16)!important;border-radius:16px!important;overflow:hidden;background:rgba(255,255,255,.72)!important;transition:.3s ease}.faq-item:hover{border-color:rgba(106,17,203,.25)!important}.faq-question{cursor:pointer}
  .nls-page-leaving{opacity:0;transform:translateY(8px);transition:opacity .2s ease,transform .2s ease}.nls-page-enter{animation:nlsPageIn .7s var(--nls-ease) both}@keyframes nlsPageIn{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:none}}
  @media(max-width:768px){.nls-premium-container{width:min(100% - 20px,1420px)}.nls-sticky-buy{bottom:10px}.nls-sticky-buy button{padding:11px 14px}.nls-top-btn{right:14px;bottom:76px}.gallery-container{border-radius:20px!important}.nls-section-glass{border-radius:20px!important}.plan-card.selected:after{font-size:9px;right:9px;top:9px}}
  @media(prefers-reduced-motion:reduce){*,*::before,*::after{scroll-behavior:auto!important;animation-duration:.01ms!important;animation-iteration-count:1!important;transition-duration:.01ms!important}.nls-reveal{opacity:1;transform:none}}
  `;

  function injectStyle(){if(document.getElementById('nlsPremiumRedesignStyle'))return;const s=document.createElement('style');s.id='nlsPremiumRedesignStyle';s.textContent=css;(document.head||document.documentElement).appendChild(s)}
  function loader(){
    injectStyle();
    const start=()=>{
      if(document.body.classList.contains('nls-details-loading'))return;
      document.body.classList.add('nls-details-loading');
      const el=document.createElement('div');el.id='nlsPremiumLoader';el.innerHTML='<div class="nls-loader-card"><img class="nls-loader-logo" src="/images/next_level.png" alt="Next Level Subs"><div class="nls-loader-title">Preparing your experience</div><div class="nls-loader-status" id="nlsLoaderStatus">Loading product details…</div><div class="nls-loader-spinner"></div><div class="nls-loader-track"><div class="nls-loader-progress" id="nlsLoaderProgress"></div></div></div>';
      document.body.prepend(el);
      let progress=8;const p=document.getElementById('nlsLoaderProgress');const status=document.getElementById('nlsLoaderStatus');
      const timer=setInterval(()=>{progress=Math.min(progress+(progress<65?7:2),92);if(p)p.style.width=progress+'%';if(status&&progress>35)status.textContent='Syncing plans, features & availability…'},260);
      const finish=()=>{clearInterval(timer);if(p)p.style.width='100%';if(status)status.textContent='Ready';setTimeout(()=>{el.classList.add('nls-loaded');document.body.classList.remove('nls-details-loading');document.body.classList.add('nls-page-enter');setTimeout(()=>el.remove(),650)},220)};
      window.addEventListener('nls:central-catalog-ready',()=>setTimeout(finish,120),{once:true});
      window.addEventListener('nextlevel:products-updated',()=>setTimeout(finish,120),{once:true});
      window.addEventListener('load',()=>setTimeout(finish,350),{once:true});
      setTimeout(finish,6500);
    };
    if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
  }

  function progressAndTop(){
    const bar=document.createElement('div');bar.className='nls-progress';bar.innerHTML='<span></span>';document.body.appendChild(bar);const fill=bar.firstElementChild;
    const top=document.createElement('button');top.className='nls-top-btn';top.type='button';top.setAttribute('aria-label','Back to top');top.innerHTML='<i class="fa-solid fa-arrow-up"></i>';document.body.appendChild(top);
    const update=()=>{const h=document.documentElement.scrollHeight-innerHeight;fill.style.width=(h>0?Math.min(100,scrollY/h*100):0)+'%';top.classList.toggle('nls-show',scrollY>500)};
    addEventListener('scroll',update,{passive:true});top.addEventListener('click',()=>scrollTo({top:0,behavior:'smooth'}));update();
  }

  function reveal(){
    const selectors=['main>section','.details-section','.product-section','.gallery-container','.plan-card','.feature-item','.subscription-card','.faq-item'];
    const seen=new Set();document.querySelectorAll(selectors.join(',')).forEach((el,i)=>{if(seen.has(el))return;seen.add(el);if(!el.classList.contains('nls-reveal')){el.classList.add('nls-reveal');el.dataset.nlsDelay=String(i%4)}});
    const io=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('nls-visible');io.unobserve(e.target)}}),{threshold:.08,rootMargin:'0px 0px -40px'});seen.forEach(el=>io.observe(el));
  }

  function stickyBuy(){
    const box=document.createElement('div');box.className='nls-sticky-buy';box.innerHTML='<div class="nls-sticky-buy-info"><div class="nls-sticky-buy-name">Product</div><div class="nls-sticky-buy-price">Select a plan</div></div><button type="button"><i class="fa-solid fa-bolt"></i> Buy Now</button>';document.body.appendChild(box);
    const name=box.querySelector('.nls-sticky-buy-name'),price=box.querySelector('.nls-sticky-buy-price'),btn=box.querySelector('button');
    const read=()=>{
      const p=window.__NLS_CENTRAL_PRODUCT__||window.NLSCentralCatalog?.products?.find(x=>location.pathname.toLowerCase().includes(String(x.slug||'').toLowerCase()));
      const title=document.querySelector('h1,.product-title,[data-product-title]');const n=(p?.name||title?.textContent||'Product').trim();if(name)name.textContent=n;
      const selected=document.querySelector('.plan-card.selected,[data-plan].selected,[data-plan-id].selected');const amount=selected?.querySelector('[data-price],.price,.plan-price');if(price)price.textContent=amount?.textContent?.trim()||'Choose a plan';
    };
    btn.addEventListener('click',()=>{if(typeof window.buyNow==='function'){window.buyNow()}else{const b=[...document.querySelectorAll('button,a')].find(x=>/buy\s*now|order\s*now|continue/i.test(x.textContent||''));if(b)b.click();else location.href='/checkout.html'}});
    const observer=new MutationObserver(read);observer.observe(document.body,{subtree:true,childList:true,characterData:true,attributes:true});
    addEventListener('scroll',()=>box.classList.toggle('nls-show',scrollY>520),{passive:true});read();setTimeout(read,800);setTimeout(read,2000);
  }

  function lightbox(){
    const lb=document.createElement('div');lb.className='nls-lightbox';lb.innerHTML='<button class="nls-lightbox-close" aria-label="Close"><i class="fa-solid fa-xmark"></i></button><img alt="Product preview">';document.body.appendChild(lb);const img=lb.querySelector('img');
    const close=()=>lb.classList.remove('open');lb.querySelector('.nls-lightbox-close').addEventListener('click',close);lb.addEventListener('click',e=>{if(e.target===lb)close()});addEventListener('keydown',e=>{if(e.key==='Escape')close()});
    document.addEventListener('click',e=>{const image=e.target.closest('.gallery-slide img,.gallery-container .gallery-slider img');if(!image)return;img.src=image.currentSrc||image.src;img.alt=image.alt||'Product preview';lb.classList.add('open')});
  }

  function interactions(){
    document.addEventListener('click',e=>{const b=e.target.closest('button,.btn-primary,.btn-whatsapp,.cart-checkout-btn');if(!b||b.disabled)return;const r=b.getBoundingClientRect(),size=Math.max(r.width,r.height);const x=e.clientX-r.left-size/2,y=e.clientY-r.top-size/2;const s=document.createElement('span');s.className='nls-ripple';s.style.cssText=`width:${size}px;height:${size}px;left:${x}px;top:${y}px`;b.style.position='relative';b.appendChild(s);setTimeout(()=>s.remove(),700)});
    document.querySelectorAll('.plan-card').forEach(card=>{card.setAttribute('tabindex','0');card.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();card.click()}})});
    document.addEventListener('click',e=>{const a=e.target.closest('a[href]');if(!a)return;const href=a.getAttribute('href')||'';if(href.startsWith('#')||href.startsWith('javascript:')||a.target==='_blank'||href.startsWith('mailto:')||href.startsWith('tel:'))return;if(new URL(a.href,location.href).origin!==location.origin)return;e.preventDefault();document.body.classList.add('nls-page-leaving');setTimeout(()=>location.href=a.href,180)});
  }

  function init(){
    injectStyle();loader();progressAndTop();reveal();stickyBuy();lightbox();interactions();
    setTimeout(reveal,900);setTimeout(reveal,2200);
    window.addEventListener('nls:central-catalog-ready',()=>{setTimeout(reveal,100);setTimeout(()=>document.body.classList.add('nls-page-enter'),200)});
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
