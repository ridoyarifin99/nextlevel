"use strict";
/* NEXT LEVEL SUBS — responsive navbar search presentation/focus fix. */
(() => {
  if (window.__NLSNavbarSearchUIFix) return;
  window.__NLSNavbarSearchUIFix = true;

  const STYLE_ID = "nls-navbar-search-ui-fix";
  const mobile = () => window.innerWidth <= 1024;
  const $ = id => document.getElementById(id);
  let raf = 0;

  function installStyles() {
    if (document.getElementById(STYLE_ID)) return;
    const s = document.createElement("style");
    s.id = STYLE_ID;
    s.textContent = `
      #searchDropdown.nls-search-ui-positioned{
        position:fixed!important;
        z-index:1200!important;
        margin:0!important;
        overflow:hidden!important;
        max-height:min(68vh,560px)!important;
        overflow-y:auto!important;
        overscroll-behavior:contain;
        -webkit-overflow-scrolling:touch;
        border:1px solid rgba(226,232,240,.95)!important;
        border-radius:14px!important;
        background:rgba(255,255,255,.98)!important;
        box-shadow:0 18px 48px rgba(15,23,42,.18),0 4px 14px rgba(106,17,203,.10)!important;
      }
      #searchDropdown.nls-search-ui-positioned .search-dropdown-item{
        display:grid!important;
        grid-template-columns:48px minmax(0,1fr) auto!important;
        align-items:center!important;
        gap:12px!important;
        min-height:72px!important;
        padding:10px 12px!important;
        border-bottom:1px solid #eef2f7!important;
        cursor:pointer;
      }
      #searchDropdown.nls-search-ui-positioned .search-dropdown-item:last-child{border-bottom:0!important}
      #searchDropdown.nls-search-ui-positioned .sdi-img{width:48px!important;height:48px!important;display:flex!important;align-items:center!important;justify-content:center!important;border-radius:10px!important;overflow:hidden!important;background:#f8fafc!important;flex:none!important}
      #searchDropdown.nls-search-ui-positioned .sdi-img img{width:100%!important;height:100%!important;object-fit:contain!important;padding:5px!important}
      #searchDropdown.nls-search-ui-positioned .sdi-info{min-width:0!important;overflow:hidden!important}
      #searchDropdown.nls-search-ui-positioned .sdi-info h4{margin:0!important;font-size:14px!important;font-weight:750!important;line-height:1.25!important;color:#172033!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important}
      #searchDropdown.nls-search-ui-positioned .sdi-info p{margin:4px 0 0!important;font-size:11px!important;line-height:1.35!important;color:#64748b!important;display:-webkit-box!important;-webkit-line-clamp:2!important;-webkit-box-orient:vertical!important;overflow:hidden!important}
      #searchDropdown.nls-search-ui-positioned .sdi-action{display:flex!important;align-items:center!important;gap:8px!important;white-space:nowrap!important}
      #searchDropdown.nls-search-ui-positioned .sdi-price{font-size:12px!important;font-weight:800!important;color:#5b21b6!important}
      #searchDropdown.nls-search-ui-positioned .sdi-add-btn{border:0!important;border-radius:8px!important;padding:7px 10px!important;background:linear-gradient(135deg,#6a11cb,#2575fc)!important;color:#fff!important;font-size:11px!important;font-weight:800!important;cursor:pointer!important}
      #searchDropdown.nls-search-ui-positioned .sdi-add-btn:active{transform:scale(.96)}
      #searchDropdown.nls-search-ui-positioned .search-highlight{font-weight:800!important;color:#6a11cb!important;background:rgba(106,17,203,.08)!important;border-radius:3px!important}
      @media(max-width:1024px){
        #searchDropdown.nls-search-ui-positioned{left:10px!important;right:10px!important;width:auto!important;max-width:none!important;max-height:min(62vh,500px)!important;border-radius:16px!important}
        #searchDropdown.nls-search-ui-positioned .search-dropdown-item{grid-template-columns:44px minmax(0,1fr)!important;min-height:68px!important;padding:9px 10px!important;gap:10px!important}
        #searchDropdown.nls-search-ui-positioned .sdi-img{width:44px!important;height:44px!important}
        #searchDropdown.nls-search-ui-positioned .sdi-action{grid-column:2!important;justify-content:flex-start!important;margin-top:-4px!important}
        #searchDropdown.nls-search-ui-positioned .sdi-price{font-size:11px!important}
        #searchDropdown.nls-search-ui-positioned .sdi-add-btn{padding:6px 9px!important}
      }
      @media(max-width:430px){
        #searchDropdown.nls-search-ui-positioned{left:8px!important;right:8px!important;max-height:58vh!important}
      }
      @media(prefers-reduced-motion:reduce){#searchDropdown.nls-search-ui-positioned .sdi-add-btn{transition:none!important}}
    `;
    document.head.appendChild(s);
  }

  function anchor() {
    const mobileInput = $("mobileSearchInput");
    const desktopInput = $("searchInput");
    if (mobile() && mobileInput && $("mobileSearchPanel")?.classList.contains("active")) return $("mobileSearchWrapper") || mobileInput;
    return $("desktopSearchWrapper") || desktopInput || mobileInput;
  }

  function position() {
    raf = 0;
    const drop = $("searchDropdown"), a = anchor();
    if (!drop || !a || !drop.classList.contains("active")) return;
    const r = a.getBoundingClientRect();
    if (mobile()) {
      const top = Math.max(4, Math.round(r.bottom + 8));
      drop.style.top = `${top}px`;
      drop.style.left = "";
      drop.style.width = "";
    } else {
      const width = Math.max(360, Math.min(520, Math.round(Math.max(r.width, 420))));
      const right = Math.min(window.innerWidth - 12, r.right);
      const left = Math.max(12, right - width);
      drop.style.top = `${Math.round(r.bottom + 8)}px`;
      drop.style.left = `${Math.round(left)}px`;
      drop.style.width = `${Math.round(Math.min(width, window.innerWidth - 24))}px`;
    }
    drop.classList.add("nls-search-ui-positioned");
  }

  function schedule() { if (!raf) raf = requestAnimationFrame(position); }
  function closeOnHeaderHide() {
    const drop = $("searchDropdown"), header = $("nlsHeader");
    if (drop?.classList.contains("active") && header?.classList.contains("nls-scroll-hidden")) drop.classList.remove("active");
  }

  function boot() {
    installStyles();
    const drop = $("searchDropdown");
    if (!drop) return;
    const observer = new MutationObserver(() => { if (drop.classList.contains("active")) schedule(); });
    observer.observe(drop, {attributes:true, attributeFilter:["class"]});
    window.addEventListener("resize", schedule, {passive:true});
    window.addEventListener("orientationchange", () => setTimeout(schedule, 80), {passive:true});
    window.addEventListener("scroll", () => { closeOnHeaderHide(); schedule(); }, {passive:true});
    document.addEventListener("focusin", e => { if (e.target?.id === "searchInput" || e.target?.id === "mobileSearchInput") setTimeout(schedule, 0); });
    window.addEventListener("nls:central-catalog-ready", schedule);
    window.addEventListener("nextlevel:products-updated", schedule);
    setTimeout(schedule, 250);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot, {once:true});
  else boot();
})();
