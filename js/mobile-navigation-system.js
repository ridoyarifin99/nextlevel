"use strict";

/* NEXT LEVEL SUBS — Single navigation owner.
 * Owns mobile top/header visibility, mobile bottom navigation, safe-area layout,
 * active state, account state, notification badge, and scroll behavior.
 * No other navigation script should manipulate these responsibilities.
 */
(() => {
  if (window.__NLSMobileNavigationSystem) return;
  window.__NLSMobileNavigationSystem = true;

  const MOBILE_MAX = 1024;
  const NAV_ID = "nls-mobile-bottom-nav";
  const STYLE_ID = "nls-mobile-navigation-system";
  const TOP_ZONE = 4;
  const REVEAL_DISTANCE = 6;
  const MIN_DELTA = 2;
  let lastY = 0;
  let hidden = false;
  let upDistance = 0;
  let raf = 0;
  let applying = false;
  let accountTimer = 0;

  const mobile = () => window.innerWidth <= MOBILE_MAX;
  const path = () => window.location.pathname.replace(/\/+$/, "").toLowerCase() || "/";
  const offers = () => path().includes("best-selling") || path().includes("offer");
  const headers = () => {
    const selectors = ["#nlsHeader","header.nls-header","header.checkout-header","header.dashboard-header",".dashboard-header","header[data-nextlevel-header]"];
    const seen = new Set(), out = [];
    selectors.forEach(s => document.querySelectorAll(s).forEach(el => { if (!seen.has(el)) { seen.add(el); out.push(el); } }));
    if (!out.length) document.querySelectorAll("body > header").forEach(el => out.push(el));
    return out;
  };
  const scrollSource = () => {
    try { if (window.top !== window.self && window.parent && typeof window.parent.scrollY === "number") return window.parent; } catch (_) {}
    return window;
  };
  const scrollY = () => { const s=scrollSource(); try{return Math.max(0,s.scrollY||s.pageYOffset||s.document.documentElement.scrollTop||s.document.body?.scrollTop||0)}catch(_){return Math.max(0,window.scrollY||document.documentElement.scrollTop||0)} };
  const initials = name => { const p=String(name||"User").trim().split(/\s+/).filter(Boolean); return (p.length>1?p[0][0]+p[p.length-1][0]:(p[0]?.[0]||"U")).toUpperCase().slice(0,2); };

  function styles(){
    if(document.getElementById(STYLE_ID)) return;
    const s=document.createElement("style"); s.id=STYLE_ID; s.textContent=`
      :root{--nls-safe-top:env(safe-area-inset-top,0px);--nls-safe-bottom:env(safe-area-inset-bottom,0px)}
      html{width:100%;max-width:100%;-webkit-text-size-adjust:100%;text-size-adjust:100%;overflow-x:clip}
      body{width:100%;max-width:100%;min-width:0;min-height:100dvh;margin:0;overflow-x:clip}
      img,video,canvas,svg,iframe{max-width:100%}
      input,textarea,select,button{max-width:100%}
      #nlsHeader,header.nls-header,header.checkout-header,header.dashboard-header,.dashboard-header,header[data-nextlevel-header]{transition:transform 280ms cubic-bezier(.16,1,.3,1),opacity 180ms ease,visibility 0s linear 280ms!important;will-change:transform,opacity}
      #${NAV_ID}{position:fixed;left:10px;right:10px;bottom:max(10px,var(--nls-safe-bottom));z-index:50;display:none;height:70px;padding:7px;margin:0;border:1px solid rgba(226,232,240,.82);border-radius:22px;background:rgba(255,255,255,.94);backdrop-filter:blur(24px) saturate(180%);-webkit-backdrop-filter:blur(24px) saturate(180%);box-shadow:0 18px 55px rgba(15,23,42,.22),0 3px 12px rgba(106,17,203,.12);isolation:isolate;overflow:visible;opacity:1;transform:none;visibility:visible;pointer-events:auto;transition:transform 280ms cubic-bezier(.16,1,.3,1),opacity 180ms ease,visibility 0s linear 280ms}
      #${NAV_ID}.nls-scroll-hidden{transform:translate3d(0,calc(100% + 24px),0)!important;opacity:0!important;visibility:hidden!important;pointer-events:none!important}
      #${NAV_ID} .track{position:relative;width:100%;height:100%;display:grid;grid-template-columns:repeat(5,minmax(0,1fr));align-items:stretch}
      #${NAV_ID} .slider{position:absolute;z-index:0;top:0;bottom:0;left:0;width:20%;border-radius:17px;background:linear-gradient(135deg,#6a11cb,#2575fc);box-shadow:0 8px 22px rgba(106,17,203,.24);transition:transform .45s cubic-bezier(.16,1,.3,1);pointer-events:none}
      #${NAV_ID} .item{position:relative;z-index:1;min-width:0;height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:3px;padding:5px 3px;border:0;border-radius:17px;background:transparent;color:#64748b;font:inherit;text-decoration:none;cursor:pointer;-webkit-tap-highlight-color:transparent;transition:color .25s ease,transform .2s ease}
      #${NAV_ID} .item i,#${NAV_ID} .avatar{width:23px;height:23px;display:flex;align-items:center;justify-content:center;font-size:18px;line-height:1}
      #${NAV_ID} .label{max-width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:10px;line-height:1.1;font-weight:700}
      #${NAV_ID} .item.active{color:#fff}.item.active i,.item.active .avatar{transform:translateY(-1px) scale(1.08)}
      #${NAV_ID} .item:active{transform:scale(.92)}
      #${NAV_ID} .badge{position:absolute;top:4px;right:calc(50% - 20px);min-width:15px;height:15px;padding:0 4px;display:none;align-items:center;justify-content:center;border-radius:999px;background:#ef4444;color:#fff;font-size:8px;font-weight:800;line-height:1;border:2px solid #fff}
      #${NAV_ID} .avatar{overflow:hidden;border-radius:50%;background:linear-gradient(135deg,#6a11cb,#2575fc);color:#fff;border:2px solid rgba(255,255,255,.75)}
      #${NAV_ID} .avatar img{width:100%;height:100%;object-fit:cover;display:block}
      @media(max-width:1024px){html{scroll-padding-bottom:92px}.nls-header{padding-top:var(--nls-safe-top)}#loginLink,#userAccountArea{display:none!important}#${NAV_ID}{display:block!important;visibility:visible!important}}
      @media(min-width:1025px){.nls-header{padding-top:0}#${NAV_ID}{display:none!important}}
      @media(max-width:430px){#${NAV_ID}{left:8px;right:8px;height:68px;border-radius:21px}}
      @media(prefers-reduced-motion:reduce){#${NAV_ID},#${NAV_ID} .slider,#${NAV_ID} .item,#${NAV_ID} .item i,#${NAV_ID} .avatar{transition-duration:.01ms!important}}
    `; document.head.appendChild(s);
  }

  async function accountData(){
    let user=null; try{user=(await window.supabaseClient?.auth?.getUser())?.data?.user||null}catch(_){ }
    if(!user)return {user:null,avatarUrl:"",name:"User"};
    const m=user.user_metadata||{}; let avatarUrl=m.avatar_url||m.picture||m.photo_url||"",name=m.full_name||m.name||user.email||"User";
    try{const r=await window.supabaseClient.from("profiles").select("avatar_url,full_name").eq("id",user.id).maybeSingle();if(r.data?.avatar_url)avatarUrl=r.data.avatar_url;if(r.data?.full_name)name=r.data.full_name}catch(_){ }
    return {user,avatarUrl,name};
  }
  window.NLSAccountSystem={getAccountData:accountData};

  function create(){
    let nav=document.getElementById(NAV_ID); if(nav)return nav;
    nav=document.createElement("nav");nav.id=NAV_ID;nav.setAttribute("aria-label","Mobile navigation");
    nav.innerHTML=`<div class="track"><div class="slider" aria-hidden="true"></div><a class="item" data-nav="home" href="/" aria-label="Home"><i class="fa-solid fa-house"></i><span class="label">Home</span></a><a class="item" data-nav="whatsapp" href="https://wa.me/8801644490566" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp"><i class="fa-brands fa-whatsapp"></i><span class="label">WhatsApp</span></a><a class="item" data-nav="offers" href="/best-selling" aria-label="Offers"><i class="fa-solid fa-gift"></i><span class="label">Offers</span></a><a class="item" data-nav="notifications" href="#notifications" aria-label="Notifications"><i class="fa-solid fa-bell"></i><span class="label">Notifications</span><span class="badge"></span></a><a class="item" data-nav="account" href="/login.html?redirect=/dashboard.html" aria-label="Account"><span class="avatar"><i class="fa-solid fa-user"></i></span><span class="label">Account</span></a></div>`;
    document.body.appendChild(nav); return nav;
  }
  function active(){
    const nav=document.getElementById(NAV_ID);if(!nav)return;const p=path();let key="home";
    if(/dashboard|account|login|register|forgot-password|reset-password|email-verification|profile-settings/.test(p))key="account";else if(p.includes("notification"))key="notifications";else if(offers())key="offers";
    const items=[...nav.querySelectorAll(".item")],a=nav.querySelector(`[data-nav="${key}"]`),slider=nav.querySelector(".slider");items.forEach(x=>x.classList.toggle("active",x===a));if(a&&slider)slider.style.transform=`translateX(${items.indexOf(a)*100}%)`;
  }
  async function account(){
    const nav=document.getElementById(NAV_ID);if(!nav)return;const a=nav.querySelector('[data-nav="account"]'),av=nav.querySelector(".avatar");if(!a||!av)return;
    const d=await accountData();if(!d.user){a.href="/login.html?redirect=/dashboard.html";a.setAttribute("aria-label","Account — Login");av.innerHTML='<i class="fa-solid fa-user"></i>';return}
    a.href="/dashboard.html";a.setAttribute("aria-label",`Account — ${String(d.name||"User").replace(/"/g,"")}`);av.innerHTML=d.avatarUrl?`<img src="${String(d.avatarUrl).replace(/"/g,"&quot;")}" alt="Profile picture">`:`<span style="font-size:9px;font-weight:800">${initials(d.name)}</span>`;
  }
  function notificationCount(n){const b=document.querySelector(`#${NAV_ID} .badge`);if(!b)return;const x=Math.max(0,Number(n)||0);b.textContent=x>99?"99+":String(x);b.style.display=x?"flex":"none";b.setAttribute("aria-hidden",x?"false":"true")}
  window.NLSMobileNotifications={setCount:notificationCount,getCount:()=>{const b=document.querySelector(`#${NAV_ID} .badge`);return b&&b.style.display!=="none"?Number(b.textContent)||0:0}};

  function apply(shouldHide){
    hidden=!!shouldHide;const hs=headers(),nav=document.getElementById(NAV_ID);applying=true;try{hs.forEach(h=>{h.classList.toggle("nls-scroll-hidden",hidden);h.style.setProperty("transform",hidden?"translate3d(0,-110%,0)":"translate3d(0,0,0)","important");h.style.setProperty("opacity",hidden?"0":"1","important");h.style.setProperty("visibility",hidden?"hidden":"visible","important");h.style.setProperty("pointer-events",hidden?"none":"auto","important")});if(nav){if(mobile()){nav.classList.toggle("nls-scroll-hidden",hidden);nav.style.setProperty("z-index","50","important")}else{nav.classList.remove("nls-scroll-hidden")}}}finally{applying=false}}
  function update(){raf=0;const y=scrollY(),d=y-lastY;if(y<=TOP_ZONE){upDistance=0;apply(false);lastY=y;return}if(Math.abs(d)<MIN_DELTA){lastY=y;return}if(d>0){upDistance=0;if(!hidden)apply(true)}else{upDistance+=Math.abs(d);if(upDistance>=REVEAL_DISTANCE){upDistance=0;if(hidden)apply(false)}}lastY=y}
  function scroll(){if(raf)return;raf=requestAnimationFrame(update)}
  function reset(){lastY=scrollY();upDistance=0;styles();if(lastY<=TOP_ZONE)apply(false);else apply(hidden)}

  function init(){
    const meta=document.querySelector('meta[name="viewport"]')||document.head.appendChild(Object.assign(document.createElement("meta"),{name:"viewport"}));meta.setAttribute("content","width=device-width, initial-scale=1, viewport-fit=cover");styles();create();active();account();lastY=scrollY();apply(false);
    const source=scrollSource();source.addEventListener("scroll",scroll,{passive:true});window.addEventListener("scroll",scroll,{passive:true});window.addEventListener("resize",reset,{passive:true});window.addEventListener("orientationchange",()=>setTimeout(reset,80),{passive:true});window.addEventListener("popstate",()=>{active();account()});window.addEventListener("pageshow",()=>{active();account()});
    if(window.supabaseClient?.auth?.onAuthStateChange)window.supabaseClient.auth.onAuthStateChange(()=>{clearTimeout(accountTimer);accountTimer=setTimeout(()=>account(),50)});
  }
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init,{once:true});else init();
})();
