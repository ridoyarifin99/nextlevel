"use strict";
/* NEXT LEVEL SUBS — Details navigation parity with index.html. */
(() => {
  if (!/\/details\.html$/i.test(location.pathname) && !/\/product\//i.test(location.pathname)) return;
  const TOP_LINKS='.nls-nav a,.nls-drawer-nav a,.nls-logo-link,.nls-drawer-logo';
  const topNavigate=el=>{if(!el)return;const href=el.getAttribute('href');if(!href||href.startsWith('#')||href.startsWith('javascript:'))return;el.setAttribute('target','_top');el.setAttribute('rel','noopener')};
  function setup(){
    document.querySelectorAll(TOP_LINKS).forEach(topNavigate);
    const more=document.getElementById('navMoreBtn'),menu=document.getElementById('navMoreMenu'),chev=document.getElementById('navMoreChevron'),container=document.getElementById('navMoreContainer');
    if(more&&!more.dataset.nlsBound){more.dataset.nlsBound='1';more.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();const open=menu?.classList.toggle('active');more.setAttribute('aria-expanded',String(!!open));if(chev)chev.style.transform=open?'rotate(180deg)':''});document.addEventListener('click',e=>{if(container&&!container.contains(e.target)){menu?.classList.remove('active');more.setAttribute('aria-expanded','false');if(chev)chev.style.transform=''}})}
    const btn=document.getElementById('mobileMenuBtn'),drawer=document.getElementById('mobileDrawer'),overlay=document.getElementById('mobileMenuOverlay'),close=document.getElementById('closeDrawerBtn');
    const toggle=open=>{drawer?.classList.toggle('open',open);overlay?.classList.toggle('active',open);btn?.classList.toggle('active',open);document.body.classList.toggle('menu-open',open)};
    if(btn&&!btn.dataset.nlsBound){btn.dataset.nlsBound='1';btn.addEventListener('click',()=>toggle(!drawer?.classList.contains('open')));overlay?.addEventListener('click',()=>toggle(false));close?.addEventListener('click',()=>toggle(false));document.querySelectorAll('.nls-drawer-nav a').forEach(a=>a.addEventListener('click',()=>toggle(false)))}
    const header=document.getElementById('nlsHeader'),scroll=()=>header?.classList.toggle('scrolled',window.scrollY>12);if(!window.__nlsDetailsNavScroll){window.__nlsDetailsNavScroll=true;window.addEventListener('scroll',scroll,{passive:true});scroll()}
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',setup,{once:true});else setup();
  new MutationObserver(setup).observe(document.body,{childList:true,subtree:true});
})();
