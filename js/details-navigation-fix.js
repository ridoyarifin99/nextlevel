"use strict";
/* Details-only navigation helpers. Mobile header scroll visibility is owned exclusively by mobile-navigation-system.js. */
(() => {
  if (!/\/details\.html$/i.test(location.pathname) && !/\/product\//i.test(location.pathname)) return;
  const TOP_LINKS='.nls-nav a,.nls-drawer-nav a,.nls-logo-link,.nls-drawer-logo';
  const setup=()=>{
    document.querySelectorAll(TOP_LINKS).forEach(el=>{
      const href=el.getAttribute('href');
      if(href&&!href.startsWith('#')&&!href.startsWith('javascript:')){
        el.setAttribute('target','_top');
        el.setAttribute('rel','noopener');
      }
    });
    const more=document.getElementById('navMoreBtn'),menu=document.getElementById('navMoreMenu'),chev=document.getElementById('navMoreChevron'),container=document.getElementById('navMoreContainer');
    if(more&&!more.dataset.nlsDetailsMoreBound){
      more.dataset.nlsDetailsMoreBound='1';
      more.addEventListener('click',e=>{
        e.preventDefault();e.stopPropagation();
        const open=menu?.classList.toggle('active');
        more.setAttribute('aria-expanded',String(!!open));
        if(chev)chev.style.transform=open?'rotate(180deg)':'';
      });
      document.addEventListener('click',e=>{
        if(container&&!container.contains(e.target)){
          menu?.classList.remove('active');more.setAttribute('aria-expanded','false');if(chev)chev.style.transform='';
        }
      });
    }
    const btn=document.getElementById('mobileMenuBtn'),drawer=document.getElementById('mobileDrawer'),overlay=document.getElementById('mobileMenuOverlay'),close=document.getElementById('closeDrawerBtn');
    if(btn&&!btn.dataset.nlsDetailsDrawerBound){
      btn.dataset.nlsDetailsDrawerBound='1';
      const toggle=open=>{
        drawer?.classList.toggle('open',open);overlay?.classList.toggle('active',open);btn?.classList.toggle('active',open);document.body.classList.toggle('menu-open',open);
        if(open){
          const h=document.getElementById('nlsHeader');h?.classList.remove('nls-scroll-hidden');
          h?.style.removeProperty('transform');h?.style.removeProperty('opacity');h?.style.removeProperty('visibility');h?.style.removeProperty('pointer-events');
        }
      };
      btn.addEventListener('click',()=>toggle(!drawer?.classList.contains('open')));
      overlay?.addEventListener('click',()=>toggle(false));close?.addEventListener('click',()=>toggle(false));
      document.querySelectorAll('.nls-drawer-nav a').forEach(a=>a.addEventListener('click',()=>toggle(false)));
    }
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',setup,{once:true});else setup();
})();
