(function () {
    "use strict";

    if (window.__NLSMobileBottomNavLoaded) return;
    window.__NLSMobileBottomNavLoaded = true;

    const STYLE_ID = "nls-mobile-bottom-nav-styles";
    const NAV_ID = "nls-mobile-bottom-nav";

    function injectStyles() {
        if (document.getElementById(STYLE_ID)) return;
        const style = document.createElement("style");
        style.id = STYLE_ID;
        style.textContent = `
            #${NAV_ID}{--nls-bn-primary:#6a11cb;--nls-bn-secondary:#2575fc;--nls-bn-text:#64748b;--nls-bn-active:#fff;position:fixed;left:10px;right:10px;bottom:max(10px,env(safe-area-inset-bottom));z-index:2147483647;display:none;height:70px;padding:7px;margin:0;border:1px solid rgba(226,232,240,.82);border-radius:22px;background:rgba(255,255,255,.94);backdrop-filter:blur(24px) saturate(180%);-webkit-backdrop-filter:blur(24px) saturate(180%);box-shadow:0 18px 55px rgba(15,23,42,.22),0 3px 12px rgba(106,17,203,.12);isolation:isolate;overflow:visible;opacity:1;transform:none;visibility:visible;pointer-events:auto;transition:transform .38s cubic-bezier(.16,1,.3,1),opacity .28s ease}
            #${NAV_ID}.nls-scroll-hidden{transform:translateY(calc(100% + 24px))!important;opacity:0!important;pointer-events:none!important}
            .nls-header{transition:transform .38s cubic-bezier(.16,1,.3,1),box-shadow .3s ease!important}
            .nls-header.nls-scroll-hidden{transform:translateY(-110%)!important}
            #userAccountArea{display:none!important}
            #loginLink .nls-account-icon{display:none!important}
            #${NAV_ID} .nls-bn-track{position:relative;width:100%;height:100%;display:grid;grid-template-columns:repeat(5,minmax(0,1fr));align-items:stretch}
            #${NAV_ID} .nls-bn-slider{position:absolute;z-index:0;top:0;bottom:0;left:0;width:20%;border-radius:17px;background:linear-gradient(135deg,var(--nls-bn-primary),var(--nls-bn-secondary));box-shadow:0 8px 22px rgba(106,17,203,.24);transform:translateX(0);transition:transform .5s cubic-bezier(.16,1,.3,1);pointer-events:none}
            #${NAV_ID} .nls-bn-item{position:relative;z-index:1;min-width:0;height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:3px;padding:5px 3px;border:0;border-radius:17px;background:transparent;color:var(--nls-bn-text);font:inherit;text-decoration:none;cursor:pointer;-webkit-tap-highlight-color:transparent;transition:color .35s ease,transform .35s cubic-bezier(.16,1,.3,1)}
            #${NAV_ID} .nls-bn-item i,#${NAV_ID} .nls-bn-item .nls-bn-avatar{width:23px;height:23px;display:flex;align-items:center;justify-content:center;font-size:18px;line-height:1;transition:transform .45s cubic-bezier(.16,1,.3,1),filter .35s ease}
            #${NAV_ID} .nls-bn-label{max-width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:10px;line-height:1.1;font-weight:700;transition:transform .35s ease}
            #${NAV_ID} .nls-bn-item.active{color:#fff}
            #${NAV_ID} .nls-bn-item.active i,#${NAV_ID} .nls-bn-item.active .nls-bn-avatar{transform:translateY(-1px) scale(1.08);filter:drop-shadow(0 3px 7px rgba(0,0,0,.18))}
            #${NAV_ID} .nls-bn-item.active .nls-bn-label{transform:translateY(-1px)}
            #${NAV_ID} .nls-bn-item:active{transform:scale(.92)}
            #${NAV_ID} .nls-bn-item:focus-visible{outline:2px solid rgba(37,117,252,.55);outline-offset:-2px}
            #${NAV_ID} .nls-bn-badge{position:absolute;top:4px;right:calc(50% - 20px);min-width:15px;height:15px;padding:0 4px;display:none;align-items:center;justify-content:center;border-radius:999px;background:#ef4444;color:#fff;font-size:8px;font-weight:800;line-height:1;border:2px solid rgba(255,255,255,.9);box-shadow:0 4px 10px rgba(239,68,68,.28)}
            #${NAV_ID} .nls-bn-item[data-bn="whatsapp"] i{color:#25D366}
            #${NAV_ID} .nls-bn-item.active[data-bn="whatsapp"] i{color:#fff}
            #${NAV_ID} .nls-bn-item[data-bn="notifications"] i{color:#6a11cb}
            #${NAV_ID} .nls-bn-item.active[data-bn="notifications"] i{color:#fff}
            #${NAV_ID} .nls-bn-avatar{overflow:hidden;border-radius:50%;background:linear-gradient(135deg,#6a11cb,#2575fc);color:#fff;border:2px solid rgba(255,255,255,.75)}
            #${NAV_ID} .nls-bn-avatar img{width:100%;height:100%;object-fit:cover;display:block}
            @media(max-width:1024px){body{padding-bottom:100px!important}#${NAV_ID}{display:block!important;visibility:visible!important;bottom:max(10px,env(safe-area-inset-bottom))!important}}
            @media(max-width:430px){#${NAV_ID}{left:8px;right:8px;height:68px;border-radius:21px}}
            @media(min-width:1025px){#${NAV_ID}{display:none!important}.nls-header.nls-scroll-hidden{transform:none!important}}
            @media(prefers-reduced-motion:reduce){#${NAV_ID},#${NAV_ID} .nls-bn-slider,#${NAV_ID} .nls-bn-item,#${NAV_ID} .nls-bn-item i,#${NAV_ID} .nls-bn-item .nls-bn-avatar,#${NAV_ID} .nls-bn-item .nls-bn-label,.nls-header{transition-duration:.01ms!important}}
        `;
        document.head.appendChild(style);
    }

    function removeTopProfileUI(){
        document.getElementById("userAccountArea")?.remove();
        document.querySelector("#loginLink .nls-account-icon")?.remove();
    }

    function getCurrentPath(){return window.location.pathname.replace(/\/+$/,'').toLowerCase()||'/';}
    function isOffers(){const p=getCurrentPath();return p.includes('best-selling')||p.includes('offer');}
    function getInitials(name){const parts=String(name||'User').trim().split(/\s+/).filter(Boolean);return (parts.length>1?parts[0][0]+parts[parts.length-1][0]:(parts[0]?.[0]||'U')).toUpperCase().slice(0,2);}

    function createNav(){
        if(document.getElementById(NAV_ID))return document.getElementById(NAV_ID);
        const nav=document.createElement('nav');nav.id=NAV_ID;nav.setAttribute('aria-label','Mobile navigation');
        nav.innerHTML=`<div class="nls-bn-track"><div class="nls-bn-slider" aria-hidden="true"></div><a class="nls-bn-item" data-bn="home" href="/" aria-label="Home"><i class="fa-solid fa-house"></i><span class="nls-bn-label">Home</span></a><a class="nls-bn-item" data-bn="whatsapp" href="https://wa.me/8801644490566" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp"><i class="fa-brands fa-whatsapp"></i><span class="nls-bn-label">WhatsApp</span></a><a class="nls-bn-item" data-bn="offers" href="/best-selling" aria-label="Offers"><i class="fa-solid fa-gift"></i><span class="nls-bn-label">Offers</span></a><a class="nls-bn-item" data-bn="notifications" href="#notifications" aria-label="Notifications"><i class="fa-solid fa-bell"></i><span class="nls-bn-label">Notifications</span><span class="nls-bn-badge" aria-hidden="true"></span></a><a class="nls-bn-item" data-bn="account" href="/login.html?redirect=/dashboard.html" aria-label="Account"><span class="nls-bn-avatar"><i class="fa-solid fa-user"></i></span><span class="nls-bn-label">Account</span></a></div>`;
        document.body.appendChild(nav);
        return nav;
    }

    function setActive(nav){
        const items=[...nav.querySelectorAll('.nls-bn-item')],slider=nav.querySelector('.nls-bn-slider'),p=getCurrentPath();let key='home';
        if(p.includes('dashboard')||p.includes('account')||p.includes('login')||p.includes('register')||p.includes('forgot-password')||p.includes('reset-password')||p.includes('email-verification')||p.includes('profile-settings'))key='account';
        else if(p.includes('notification'))key='notifications';
        else if(isOffers())key='offers';
        const active=nav.querySelector(`[data-bn="${key}"]`);items.forEach(x=>x.classList.toggle('active',x===active));if(active&&slider)slider.style.transform=`translateX(${items.indexOf(active)*100}%)`;
    }

    function setNotificationCount(count){
        const nav=document.getElementById(NAV_ID),badge=nav?.querySelector('[data-bn="notifications"] .nls-bn-badge');
        if(!badge)return;
        const n=Math.max(0,Number(count)||0);
        badge.textContent=n>99?'99+':String(n);
        badge.style.display=n>0?'flex':'none';
        badge.setAttribute('aria-hidden',n>0?'false':'true');
    }

    async function updateAccountButton(nav){
        const account=nav.querySelector('[data-bn="account"]'),avatar=nav.querySelector('.nls-bn-avatar');if(!account||!avatar)return;
        let user=null;try{const r=await window.supabaseClient?.auth?.getUser();user=r?.data?.user||null;}catch(_){ }
        if(!user){account.href='/login.html?redirect=/dashboard.html';avatar.innerHTML='<i class="fa-solid fa-user"></i>';return;}
        account.href='/dashboard.html';const m=user.user_metadata||{};let avatarUrl=m.avatar_url||m.picture||m.photo_url||'';let profileName=m.full_name||m.name||user.email||'User';
        try{const r=await window.supabaseClient.from('profiles').select('avatar_url,full_name').eq('id',user.id).maybeSingle();if(r.data?.avatar_url)avatarUrl=r.data.avatar_url;if(r.data?.full_name)profileName=r.data.full_name;}catch(_){ }
        if(avatarUrl)avatar.innerHTML=`<img src="${String(avatarUrl).replace(/"/g,'&quot;')}" alt="Profile picture">`;else avatar.innerHTML=`<span style="font-size:9px;font-weight:800">${getInitials(profileName)}</span>`;
    }

    function setupScrollBehavior(nav){
        const header=document.getElementById('nlsHeader');
        if(!header || window.__NLSNavScrollBound)return;
        window.__NLSNavScrollBound=true;
        let lastY=Math.max(0,window.scrollY||0), ticking=false;
        const update=()=>{
            ticking=false;
            if(window.innerWidth>1024){header.classList.remove('nls-scroll-hidden');nav.classList.remove('nls-scroll-hidden');return;}
            const y=Math.max(0,window.scrollY||0), delta=y-lastY;
            if(y<=12){header.classList.remove('nls-scroll-hidden');nav.classList.remove('nls-scroll-hidden');}
            else if(delta>6){header.classList.add('nls-scroll-hidden');nav.classList.add('nls-scroll-hidden');}
            else if(delta<-6){header.classList.remove('nls-scroll-hidden');nav.classList.remove('nls-scroll-hidden');}
            lastY=y;
        };
        window.addEventListener('scroll',()=>{if(!ticking){ticking=true;requestAnimationFrame(update)}},{passive:true});
        window.addEventListener('resize',update,{passive:true});
        update();
    }

    function init(){
        if(!document.body)return;
        injectStyles();
        removeTopProfileUI();
        const nav=createNav();
        setActive(nav);
        updateAccountButton(nav);
        setupScrollBehavior(nav);
        window.NLSMobileNotifications={setCount:setNotificationCount,getCount:()=>{const b=nav.querySelector('[data-bn="notifications"] .nls-bn-badge');return b&&b.style.display!=='none'?Number(b.textContent)||0:0;}};
        window.addEventListener('popstate',()=>setActive(nav));
        window.addEventListener('pageshow',()=>{removeTopProfileUI();setActive(nav);updateAccountButton(nav)});
        if(window.supabaseClient?.auth?.onAuthStateChange)window.supabaseClient.auth.onAuthStateChange(()=>updateAccountButton(nav));
    }
    if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();