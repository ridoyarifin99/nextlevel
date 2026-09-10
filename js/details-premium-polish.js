"use strict";
(() => {
  if (!/\/details\.html$/i.test(location.pathname) && !/\/product\//i.test(location.pathname)) return;
  if (window.__NLSDetailsPremiumPolish) return;
  window.__NLSDetailsPremiumPolish = true;

  const STYLE_ID = "nls-details-premium-polish";
  const ROOT_SELECTORS = ["#productDetails", ".product-details", ".details-container", "main", "body"];
  const escText = value => String(value || "").replace(/\s+/g, " ").trim().toLowerCase();

  function injectStyles() {
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = `
      :root{
        --nls-premium-primary:#6a11cb;
        --nls-premium-secondary:#2575fc;
        --nls-premium-ink:#111827;
        --nls-premium-muted:#64748b;
        --nls-premium-line:rgba(226,232,240,.86);
        --nls-premium-glass:rgba(255,255,255,.84);
        --nls-premium-ease:cubic-bezier(.16,1,.3,1);
      }

      /* ===== Product tabs ===== */
      #productDetails .tab-button,
      #productDetails .tab-btn,
      .product-details .tab-button,
      .product-details .tab-btn,
      .details-container .tab-button,
      .details-container .tab-btn{
        position:relative!important;
        isolation:isolate;
        min-height:50px;
        padding:12px 18px!important;
        border:1px solid transparent!important;
        border-radius:14px!important;
        background:transparent!important;
        color:#64748b!important;
        font-weight:800!important;
        letter-spacing:-.01em;
        transition:color .35s var(--nls-premium-ease),transform .35s var(--nls-premium-ease),box-shadow .35s var(--nls-premium-ease),background .35s var(--nls-premium-ease),border-color .35s var(--nls-premium-ease)!important;
        overflow:hidden;
      }
      #productDetails .tab-button::before,
      #productDetails .tab-btn::before,
      .product-details .tab-button::before,
      .product-details .tab-btn::before,
      .details-container .tab-button::before,
      .details-container .tab-btn::before{
        content:"";
        position:absolute;
        inset:0;
        z-index:-2;
        border-radius:inherit;
        background:linear-gradient(135deg,rgba(106,17,203,.10),rgba(37,117,252,.08));
        opacity:0;
        transform:scale(.92);
        transition:opacity .35s var(--nls-premium-ease),transform .35s var(--nls-premium-ease);
      }
      #productDetails .tab-button::after,
      #productDetails .tab-btn::after,
      .product-details .tab-button::after,
      .product-details .tab-btn::after,
      .details-container .tab-button::after,
      .details-container .tab-btn::after{
        content:"";
        position:absolute;
        left:18%;right:18%;bottom:2px;height:3px;
        border-radius:99px;
        background:linear-gradient(90deg,var(--nls-premium-primary),var(--nls-premium-secondary));
        box-shadow:0 3px 12px rgba(106,17,203,.28);
        transform:scaleX(0);
        transform-origin:center;
        opacity:0;
        transition:transform .42s var(--nls-premium-ease),opacity .3s ease;
      }
      #productDetails .tab-button:hover,
      #productDetails .tab-btn:hover,
      .product-details .tab-button:hover,
      .product-details .tab-btn:hover,
      .details-container .tab-button:hover,
      .details-container .tab-btn:hover{
        color:var(--nls-premium-primary)!important;
        transform:translateY(-2px);
      }
      #productDetails .tab-button:hover::before,
      #productDetails .tab-btn:hover::before,
      .product-details .tab-button:hover::before,
      .product-details .tab-btn:hover::before,
      .details-container .tab-button:hover::before,
      .details-container .tab-btn:hover::before{opacity:1;transform:scale(1)}
      #productDetails .tab-button.active,
      #productDetails .tab-btn.active,
      .product-details .tab-button.active,
      .product-details .tab-btn.active,
      .details-container .tab-button.active,
      .details-container .tab-btn.active{
        color:var(--nls-premium-primary)!important;
        background:linear-gradient(135deg,rgba(106,17,203,.09),rgba(37,117,252,.07))!important;
        border-color:rgba(124,58,237,.13)!important;
        box-shadow:0 8px 24px rgba(76,29,149,.08),inset 0 1px rgba(255,255,255,.85);
        transform:translateY(-1px);
      }
      #productDetails .tab-button.active::before,
      #productDetails .tab-btn.active::before,
      .product-details .tab-button.active::before,
      .product-details .tab-btn.active::before,
      .details-container .tab-button.active::before,
      .details-container .tab-btn.active::before{opacity:1;transform:scale(1)}
      #productDetails .tab-button.active::after,
      #productDetails .tab-btn.active::after,
      .product-details .tab-button.active::after,
      .product-details .tab-btn.active::after,
      .details-container .tab-button.active::after,
      .details-container .tab-btn.active::after{opacity:1;transform:scaleX(1)}

      /* ===== Buttons ===== */
      #productDetails button:not(.tab-button):not(.tab-btn),
      .product-details button:not(.tab-button):not(.tab-btn),
      .details-container button:not(.tab-button):not(.tab-btn){
        transition:transform .28s var(--nls-premium-ease),box-shadow .28s var(--nls-premium-ease),filter .28s ease,background .28s ease!important;
      }
      #productDetails button:not(.tab-button):not(.tab-btn):hover,
      .product-details button:not(.tab-button):not(.tab-btn):hover,
      .details-container button:not(.tab-button):not(.tab-btn):hover{transform:translateY(-2px)}
      #productDetails button:not(.tab-button):not(.tab-btn):active,
      .product-details button:not(.tab-button):not(.tab-btn):active,
      .details-container button:not(.tab-button):not(.tab-btn):active{transform:translateY(0) scale(.98)}
      .nls-premium-cta{
        position:relative!important;overflow:hidden!important;
        box-shadow:0 10px 24px rgba(106,17,203,.20)!important;
      }
      .nls-premium-cta::before{
        content:"";position:absolute;top:-80%;left:-35%;width:25%;height:260%;
        transform:rotate(22deg) translateX(-180%);
        background:linear-gradient(90deg,transparent,rgba(255,255,255,.42),transparent);
        transition:transform .8s var(--nls-premium-ease);
        pointer-events:none;
      }
      .nls-premium-cta:hover::before{transform:rotate(22deg) translateX(620%)}

      /* ===== Pricing / plan tables ===== */
      #productDetails table,
      .product-details table,
      .details-container table{
        width:100%!important;
        border-collapse:separate!important;
        border-spacing:0!important;
        overflow:hidden!important;
        border:1px solid var(--nls-premium-line)!important;
        border-radius:20px!important;
        background:rgba(255,255,255,.92)!important;
        box-shadow:0 18px 50px rgba(15,23,42,.07),0 2px 8px rgba(106,17,203,.035)!important;
        position:relative;
      }
      #productDetails table thead,
      .product-details table thead,
      .details-container table thead{position:relative;z-index:1}
      #productDetails table th,
      .product-details table th,
      .details-container table th{
        position:relative;
        padding:15px 16px!important;
        background:linear-gradient(135deg,#faf9ff,#f4f7ff)!important;
        color:#334155!important;
        border-bottom:1px solid rgba(226,232,240,.9)!important;
        font-size:12px!important;
        font-weight:900!important;
        letter-spacing:.045em;
        text-transform:uppercase;
        white-space:nowrap;
      }
      #productDetails table td,
      .product-details table td,
      .details-container table td{
        padding:15px 16px!important;
        color:#475569!important;
        background:rgba(255,255,255,.72)!important;
        border-bottom:1px solid #f0f2f6!important;
        font-size:13px!important;
        vertical-align:middle!important;
        transition:background .28s ease,color .28s ease,transform .28s var(--nls-premium-ease)!important;
      }
      #productDetails table tbody tr,
      .product-details table tbody tr,
      .details-container table tbody tr{transition:transform .28s var(--nls-premium-ease),box-shadow .28s ease!important}
      #productDetails table tbody tr:hover,
      .product-details table tbody tr:hover,
      .details-container table tbody tr:hover{transform:translateY(-1px)!important}
      #productDetails table tbody tr:hover td,
      .product-details table tbody tr:hover td,
      .details-container table tbody tr:hover td{background:linear-gradient(90deg,rgba(106,17,203,.035),rgba(37,117,252,.025))!important;color:#334155!important}
      #productDetails table tbody tr:last-child td,
      .product-details table tbody tr:last-child td,
      .details-container table tbody tr:last-child td{border-bottom:0!important}
      #productDetails table tbody tr,
      .product-details table tbody tr,
      .details-container table tbody tr{animation:nlsPremiumRowIn .55s var(--nls-premium-ease) both}
      @keyframes nlsPremiumRowIn{from{opacity:0;transform:translateY(9px)}to{opacity:1;transform:none}}
      #productDetails table tbody tr:nth-child(2),.product-details table tbody tr:nth-child(2),.details-container table tbody tr:nth-child(2){animation-delay:.035s}
      #productDetails table tbody tr:nth-child(3),.product-details table tbody tr:nth-child(3),.details-container table tbody tr:nth-child(3){animation-delay:.07s}
      #productDetails table tbody tr:nth-child(4),.product-details table tbody tr:nth-child(4),.details-container table tbody tr:nth-child(4){animation-delay:.105s}
      #productDetails table tbody tr:nth-child(5),.product-details table tbody tr:nth-child(5),.details-container table tbody tr:nth-child(5){animation-delay:.14s}
      #productDetails table tbody tr:nth-child(6),.product-details table tbody tr:nth-child(6),.details-container table tbody tr:nth-child(6){animation-delay:.175s}
      #productDetails table a,
      .product-details table a,
      .details-container table a{color:var(--nls-premium-primary);font-weight:800;text-decoration:none;transition:color .2s ease}
      #productDetails table a:hover,.product-details table a:hover,.details-container table a:hover{color:var(--nls-premium-secondary)}

      /* Make common plan-price cells visually premium without changing their content. */
      #productDetails table td .price,
      #productDetails table td [class*="price"],
      .product-details table td .price,
      .product-details table td [class*="price"],
      .details-container table td .price,
      .details-container table td [class*="price"]{font-weight:900;color:#111827;letter-spacing:-.02em}
      #productDetails table td strong,.product-details table td strong,.details-container table td strong{color:#1e293b;font-weight:850}

      /* ===== Product sections ===== */
      #productDetails > section,
      .product-details > section,
      .details-container > section{
        animation:nlsSectionIn .6s var(--nls-premium-ease) both;
      }
      @keyframes nlsSectionIn{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:none}}

      /* ===== Hide unnecessary Key Features block ===== */
      .nls-key-features-removed{display:none!important}

      @media(max-width:800px){
        #productDetails table,.product-details table,.details-container table{display:block;overflow-x:auto;-webkit-overflow-scrolling:touch;border-radius:16px!important}
        #productDetails table th,#productDetails table td,.product-details table th,.product-details table td,.details-container table th,.details-container table td{padding:12px 13px!important}
        #productDetails .tab-button,#productDetails .tab-btn,.product-details .tab-button,.product-details .tab-btn,.details-container .tab-button,.details-container .tab-btn{min-height:46px;padding:10px 12px!important;border-radius:12px!important;font-size:12px!important}
      }
      @media(max-width:520px){
        #productDetails .tab-button,#productDetails .tab-btn,.product-details .tab-button,.product-details .tab-btn,.details-container .tab-button,.details-container .tab-btn{padding:9px 8px!important;font-size:11px!important}
        #productDetails table th,#productDetails table td,.product-details table th,.product-details table td,.details-container table th,.details-container table td{font-size:12px!important;padding:11px 10px!important}
      }
      @media(prefers-reduced-motion:reduce){
        #productDetails *, .product-details *, .details-container *{animation-duration:.001ms!important;animation-iteration-count:1!important;transition-duration:.001ms!important;scroll-behavior:auto!important}
      }
    `;
    document.head.appendChild(style);
  }

  function removeKeyFeatures() {
    const roots = ROOT_SELECTORS.map(s => document.querySelector(s)).filter(Boolean);
    const candidates = roots.flatMap(root => [...root.querySelectorAll("h1,h2,h3,h4,h5,h6,strong,b,p,div")]);
    candidates.forEach(el => {
      if (el.dataset.nlsKeyFeaturesChecked) return;
      const text = escText(el.textContent);
      if (text !== "key features" && !/^key features\s*:?$/.test(text)) return;
      el.dataset.nlsKeyFeaturesChecked = "1";
      let block = el;
      for (let i=0;i<4 && block.parentElement;i++) {
        const parent = block.parentElement;
        const childCount = parent.children.length;
        if (childCount <= 8 && (parent.querySelectorAll("li").length || parent.querySelectorAll("svg,i").length || parent.querySelectorAll("[class*='feature']").length)) {
          block = parent;
          break;
        }
        block = parent;
      }
      block.classList.add("nls-key-features-removed");
    });
  }

  function enhanceCtas() {
    const roots = ROOT_SELECTORS.map(s => document.querySelector(s)).filter(Boolean);
    roots.forEach(root => {
      root.querySelectorAll("button,a").forEach(el => {
        if (el.classList.contains("tab-button") || el.classList.contains("tab-btn")) return;
        const text = escText(el.textContent);
        if (/add to cart|buy now|order now|subscribe|choose plan|select plan|purchase/.test(text)) el.classList.add("nls-premium-cta");
      });
    });
  }

  function polish() {
    injectStyles();
    removeKeyFeatures();
    enhanceCtas();
  }

  function start() {
    polish();
    let queued = false;
    const observer = new MutationObserver(() => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(() => { queued = false; polish(); });
    });
    observer.observe(document.body, {childList:true,subtree:true});
    window.addEventListener("nls:central-catalog-ready", polish);
    window.addEventListener("nextlevel:products-updated", polish);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start, {once:true});
  else start();
})();
