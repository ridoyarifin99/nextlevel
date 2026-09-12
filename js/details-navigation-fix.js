"use strict";
/* NEXT LEVEL SUBS — Details navigation parity with index.html. */
(() => {
  if (!/\/details\.html$/i.test(location.pathname) && !/\/product\//i.test(location.pathname)) return;
  const TOP_LINKS='.nls-nav a,.nls-drawer-nav a,.nls-logo-link,.nls-drawer-logo';
  const mobile=()=>window.innerWidth<=1024;
  let lastY=window.scrollY||0,upDistance=0,hidden=false,raf=0;

  const topNavigate=el=>{if(!el)return;const href=el.getAttribute('href');if(!href||href.startsWith('#')||href.startsWith('javascript:'))return;el.setAttribute('target','_top');el.setAttribute('rel','noopener')};
  const header=()=>document.getElementById('nlsHeader');
  const applyMobile=hide=>{
    const h=header(); if(!h||!mobile())return;
    hidden=!!hide;
    h.classList.toggle('nls-scroll-hidden',hidden);
    h.style.setProperty('transform',hidden?'translate3d(0,-110%,0)':'translate3d(0,0,0)','important');
    h.style.setProperty('opacity',hidden?'0':'1','important');
    h.style.setProperty('visibility',hidden?'hidden':'visible','important');
    h.style.setProperty('pointer-events',hidden?'none':'auto','important');
    if(hidden)document.getElementById('searchDropdown')?.classList.remove('active');
  };
  const updateScroll=()=>{
    raf=0;
    if(!mobile()){hidden=false;upDistance=0;lastY=window.scrollY||0;return;}
    const y=Math.max(0,window.scrollY||document.documentElement.scrollTop||0),d=y-lastY;
    if(y<=6){upDistance=0;applyMobile(false);lastY=y;return;}
    if(Math.abs(d)<2){lastY=y;return;}
    if(d>0){upDistance=0;if(!hidden)applyMobile(true)}
    else {upDistance+=Math.abs(d);if(hidden&&upDistance>=6){upDistance=0;applyMobile(false)}}
    lastY=y;
  };
  const onScroll=()=>{if(!raf)raf=requestAnimationFrame(updateScroll)};

  function setup(){
    document.querySelectorAll(TOP_LINKS).forEach(topNavigate);
    const more=document.getElementById('navMoreBtn'),menu=document.getElementById('navMoreMenu'),chev=document.getElementById('navMoreChevron'),container=document.getElementById('navMoreContainer');
    if(more&&!more.dataset.nlsBound){
      more.dataset.nlsBound='1';
      more.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();const open=menu?.classList.toggle('active');more.setAttribute('aria-expanded',String(!!open));if(chev)chev.style.transform=open?'rotate(180deg)':''});
      document.addEventListener('click',e=>{if(container&&!container.contains(e.target)){menu?.classList.remove('active');more.setAttribute('aria-expanded','false');if(chev)chev.style.transform=''}});
    }
    const btn=document.getElementById('mobileMenuBtn'),drawer=document.getElementById('mobileDrawer'),overlay=document.getElementById('mobileMenuOverlay'),close=document.getElementById('closeDrawerBtn');
    const toggle=open=>{drawer?.classList.toggle('open',open);overlay?.classList.toggle('active',open);btn?.classList.toggle('active',open);document.body.classList.toggle('menu-open',open);if(open)applyMobile(false)};
    if(btn&&!btn.dataset.nlsBound){btn.dataset.nlsBound='1';btn.addEventListener('click',()=>toggle(!drawer?.classList.contains('open')));overlay?.addEventListener('click',()=>toggle(false));close?.addEventListener('click',()=>toggle(false));document.querySelectorAll('.nls-drawer-nav a').forEach(a=>a.addEventListener('click',()=>toggle(false)))}
    const h=header();
    if(h&&!h.dataset.nlsDetailsScrollBound){h.dataset.nlsDetailsScrollBound='1';window.addEventListener('scroll',onScroll,{passive:true});window.addEventListener('resize',()=>{lastY=window.scrollY||0;upDistance=0;if(!mobile())applyMobile(false)},{passive:true});lastY=window.scrollY||0;updateScroll();}
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',setup,{once:true});else setup();
})();
