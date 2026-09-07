(function(){
  "use strict";
  if(window.__NLSDetailsNavbarFixLoaded)return;
  window.__NLSDetailsNavbarFixLoaded=true;
  /* Details.html has legacy runtime code that can compete with the global
     navbar controller. This page-specific controller becomes the sole owner
     of visibility for the details header and mobile bottom nav. */
  window.__NLSNavScrollBound=true;
  var header=null,bottom=null,lastY=0,hidden=false,up=0,ticking=false;
  var MOBILE=1024,TOP=4,MIN=2,REVEAL=8;
  function source(){
    try{if(window.top!==window.self&&window.parent&&typeof window.parent.scrollY==='number')return window.parent;}catch(e){}
    return window;
  }
  function y(){var s=source();try{return Math.max(0,s.scrollY||s.pageYOffset||s.document.documentElement.scrollTop||s.document.body.scrollTop||0)}catch(e){return Math.max(0,window.scrollY||window.pageYOffset||document.documentElement.scrollTop||0)}}
  function find(){header=document.getElementById('nlsHeader')||document.querySelector('header.nls-header');bottom=document.getElementById('nls-mobile-bottom-nav')}
  function css(){if(document.getElementById('nls-details-nav-fix-style'))return;var s=document.createElement('style');s.id='nls-details-nav-fix-style';s.textContent='#nlsHeader,.nls-header{will-change:transform,opacity!important;transition:transform 280ms cubic-bezier(.16,1,.3,1),opacity 180ms ease,visibility 0s linear 280ms!important}#nls-mobile-bottom-nav{will-change:transform,opacity!important;transition:transform 280ms cubic-bezier(.16,1,.3,1),opacity 180ms ease,visibility 0s linear 280ms!important}';(document.head||document.documentElement).appendChild(s)}
  function apply(){find();var h=hidden,top=h?'translate3d(0,-110%,0)':'translate3d(0,0,0)',bot=h?'translate3d(0,calc(100% + 24px),0)':'translate3d(0,0,0)';if(header){header.classList.toggle('nls-scroll-hidden',h);header.style.setProperty('transform',top,'important');header.style.setProperty('opacity',h?'0':'1','important');header.style.setProperty('visibility',h?'hidden':'visible','important');header.style.setProperty('pointer-events',h?'none':'auto','important')}if(bottom&&window.innerWidth<=MOBILE){bottom.classList.toggle('nls-scroll-hidden',h);bottom.style.setProperty('transform',bot,'important');bottom.style.setProperty('opacity',h?'0':'1','important');bottom.style.setProperty('visibility',h?'hidden':'visible','important');bottom.style.setProperty('pointer-events',h?'none':'auto','important');bottom.style.setProperty('z-index','50','important')}}
  function update(){ticking=false;var cur=y(),d=cur-lastY;if(cur<=TOP){hidden=false;up=0;apply();lastY=cur;return}if(Math.abs(d)<MIN){lastY=cur;return}if(d>0){up=0;if(!hidden){hidden=true;apply()}}else{up+=Math.abs(d);if(up>=REVEAL){up=0;if(hidden){hidden=false;apply()}}}lastY=cur}
  function scroll(){if(ticking)return;ticking=true;(window.requestAnimationFrame||function(f){return setTimeout(f,0)})(update)}
  function reset(){find();lastY=y();up=0;apply()}
  function init(){css();find();hidden=false;lastY=y();apply();var s=source();s.addEventListener('scroll',scroll,{passive:true});window.addEventListener('scroll',scroll,{passive:true});document.addEventListener('scroll',scroll,{passive:true,capture:true});window.addEventListener('resize',reset,{passive:true});window.addEventListener('pageshow',reset,{passive:true});var obs=new MutationObserver(function(ms){var relevant=ms.some(function(m){return m.type==='childList'||(m.type==='attributes'&&(m.attributeName==='class'||m.attributeName==='style')&&(m.target===header||m.target===bottom||(m.target.closest&&m.target.closest('#nlsHeader,.nls-header,#nls-mobile-bottom-nav'))))});if(relevant){setTimeout(function(){apply()},0)}});obs.observe(document.body,{childList:true,subtree:true,attributes:true,attributeFilter:['class','style']});window.__NLSDetailsNavbarController={reset:reset,show:function(){hidden=false;up=0;apply()},hide:function(){hidden=true;up=0;apply()}}}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
