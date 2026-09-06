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
            /* =========================================================
               NEXT LEVEL SUBS — MOBILE NAVIGATION SYSTEM
               Compact / premium / touch-friendly / scroll aware
               ========================================================= */

            /* Mobile top navigation */
            @media(max-width:1024px){
                #loginLink,#userAccountArea{display:none!important}
                .nls-header{
                    position:sticky!important;
                    top:0!important;
                    z-index:1000!important;
                    height:auto!important;
                    background:rgba(255,255,255,.86)!important;
                    backdrop-filter:blur(22px) saturate(180%)!important;
                    -webkit-backdrop-filter:blur(22px) saturate(180%)!important;
                    border-bottom:1px solid rgba(148,163,184,.16)!important;
                    box-shadow:0 5px 24px rgba(15,23,42,.08)!important;
                    transition:transform .38s cubic-bezier(.16,1,.3,1),box-shadow .28s ease,opacity .28s ease!important;
                    will-change:transform;
                }
                .nls-header.nls-scroll-hidden{
                    transform:translateY(-110%)!important;
                    opacity:0!important;
                    pointer-events:none!important;
                }
                .nls-container{
                    height:58px!important;
                    min-height:58px!important;
                    padding:0 10px!important;
                    gap:7px!important;
                }
                .nls-left{gap:5px!important;min-width:0!important;flex:1 1 auto!important}
                .nls-hamburger{
                    display:flex!important;
                    flex:0 0 36px!important;
                    width:36px!important;
                    height:36px!important;
                    border-radius:11px!important;
                    align-items:center!important;
                    justify-content:center!important;
                }
                .nls-hamburger span{left:7px!important;width:22px!important;height:2.5px!important}
                .nls-hamburger span:nth-child(1){top:10px!important}
                .nls-hamburger span:nth-child(2){top:17px!important;width:17px!important}
                .nls-hamburger span:nth-child(3){top:24px!important}
                .nls-logo-link{gap:0!important;min-width:0!important}
                .nls-logo-img{height:34px!important;width:auto!important}
                .nls-logo-text-container{display:none!important}
                .nls-nav{display:none!important}
                .nls-right{gap:5px!important;flex:0 0 auto!important}
                .nls-search-desktop{display:none!important}
                .nls-icon-btn,.nls-cart-btn{
                    height:36px!important;
                    min-height:36px!important;
                    border-radius:11px!important;
                    border:1px solid rgba(148,163,184,.18)!important;
                    background:rgba(255,255,255,.72)!important;
                    box-shadow:0 3px 12px rgba(15,23,42,.06)!important;
                    display:inline-flex!important;
                    align-items:center!important;
                    justify-content:center!important;
                    gap:6px!important;
                    padding:0 10px!important;
                    transition:transform .2s ease,background .2s ease,box-shadow .2s ease!important;
                }
                .nls-icon-btn:active,.nls-cart-btn:active{transform:scale(.94)!important}
                .nls-icon-btn i,.nls-cart-btn i{font-size:15px!important}
                .nls-mobile-action-text{font-size:10px!important;font-weight:750!important;letter-spacing:-.01em!important;color:#334155!important;line-height:1!important}
                .nls-cart-btn{position:relative!important}
                .nls-cart-text{font-size:10px!important;font-weight:750!important}
                .nls-cart-btn .cart-badge{top:-4px!important;right:-4px!important;min-width:15px!important;height:15px!important;font-size:8px!important;border:2px solid #fff!important}
                .nls-mobile-search-panel{padding:7px 10px 9px!important}
                .nls-mobile-search-box{height:40px!important;border-radius:13px!important}
            }

            @media(max-width:430px){
                .nls-container{height:55px!important;min-height:55px!important;padding:0 8px!important}
                .nls-hamburger{flex-basis:34px!important;width:34px!important;height:34px!important}
                .nls-logo-img{height:32px!important}
                .nls-icon-btn,.nls-cart-btn{height:34px!important;min-height:34px!important;width:34px!important;padding:0!important;border-radius:10px!important}
                .nls-mobile-action-text{display:none!important}
                .nls-cart-text{display:none!important}
            }

            /* Compact premium bottom navigation */
            #${NAV_ID}{
                --nls-bn-primary:#6a11cb;
                --nls-bn-secondary:#2575fc;
                --nls-bn-text:#64748b;
                --nls-bn-active:#fff;
                position:fixed;
                left:9px;
                right:9px;
                bottom:max(8px,env(safe-area-inset-bottom));
                z-index:2147483647;
                display:none;
                height:62px;
                padding:5px;
                margin:0;
                border:1px solid rgba(226,232,240,.72);
                border-radius:19px;
                background:rgba(255,255,255,.88);
                backdrop-filter:blur(24px) saturate(190%);
                -webkit-backdrop-filter:blur(24px) saturate(190%);
                box-shadow:0 14px 40px rgba(15,23,42,.16),0 3px 12px rgba(106,17,203,.09);
                isolation:isolate;
                overflow:visible;
                opacity:1;
                transform:translateY(0);
                visibility:visible;
                pointer-events:auto;
                transition:transform .38s cubic-bezier(.16,1,.3,1),opacity .28s ease;
                will-change:transform,opacity;
            }
            #${NAV_ID}.nls-scroll-hidden{
                transform:translateY(calc(100% + 22px))!important;
                opacity:0!important;
                pointer-events:none!important;
            }
            #${NAV_ID} .nls-bn-track{
                position:relative;
                width:100%;
                height:100%;
                display:grid;
                grid-template-columns:repeat(5,minmax(0,1fr));
                align-items:stretch;
            }
            #${NAV_ID} .nls-bn-slider{
                position:absolute;
                z-index:0;
                top:0;
                bottom:0;
                left:0;
                width:20%;
                border-radius:14px;
                background:linear-gradient(135deg,var(--nls-bn-primary),var(--nls-bn-secondary));
                box-shadow:0 6px 18px rgba(106,17,203,.20);
                transform:translateX(0);
                transition:transform .48s cubic-bezier(.16,1,.3,1);
                pointer-events:none;
            }
            #${NAV_ID} .nls-bn-item{
                position:relative;
                z-index:1;
                min-width:0;
                height:100%;
                display:flex;
                flex-direction:column;
                align-items:center;
                justify-content:center;
                gap:2px;
                padding:3px 2px;
                border:0;
                border-radius:14px;
                background:transparent;
                color:var(--nls-bn-text);
                font:inherit;
                text-decoration:none;
                cursor:pointer;
                -webkit-tap-highlight-color:transparent;
                transition:color .3s ease,transform .3s cubic-bezier(.16,1,.3,1);
            }
            #${NAV_ID} .nls-bn-item i,#${NAV_ID} .nls-bn-item .nls-bn-avatar{
                width:21px;
                height:21px;
                display:flex;
                align-items:center;
                justify-content:center;
                font-size:16px;
                line-height:1;
                transition:transform .4s cubic-bezier(.16,1,.3,1),filter .3s ease;
            }
            #${NAV_ID} .nls-bn-label{
                max-width:100%;
                overflow:hidden;
                text-overflow:ellipsis;
                white-space:nowrap;
                font-size:9px;
                line-height:1;
                font-weight:750;
                letter-spacing:-.01em;
                transition:transform .3s ease;
            }
            #${NAV_ID} .nls-bn-item.active{color:#fff}
            #${NAV_ID} .nls-bn-item.active i,#${NAV_ID} .nls-bn-item.active .nls-bn-avatar{
                transform:translateY(-1px) scale(1.06);
                filter:drop-shadow(0 2px 6px rgba(0,0,0,.18));
            }
            #${NAV_ID} .nls-bn-item.active .nls-bn-label{transform:translateY(-1px)}
            #${NAV_ID} .nls-bn-item:active{transform:scale(.92)}
            #${NAV_ID} .nls-bn-item:focus-visible{outline:2px solid rgba(37,117,252,.45);outline-offset:-2px}
            #${NAV_ID} .nls-bn-badge{
                position:absolute;
                top:2px;
                right:calc(50% - 18px);
                min-width:14px;
                height:14px;
                padding:0 3px;
                display:none;
                align-items:center;
                justify-content:center;
                border-radius:999px;
                background:#ef4444;
                color:#fff;
                font-size:7px;
                font-weight:800;
                line-height:1;
                border:2px solid rgba(255,255,255,.9);
                box-shadow:0 3px 8px rgba(239,68,68,.24);
            }
            #${NAV_ID} .nls-bn-item[data-bn="whatsapp"] i{color:#25D366}
            #${NAV_ID} .nls-bn-item.active[data-bn="whatsapp"] i{color:#fff}
            #${NAV_ID} .nls-bn-item[data-bn="notifications"] i{color:#6a11cb}
            #${NAV_ID} .nls-bn-item.active[data-bn="notifications"] i{color:#fff}
            #${NAV_ID} .nls-bn-avatar{
                overflow:hidden;
                border-radius:50%;
                background:linear-gradient(135deg,#6a11cb,#2575fc);
                color:#fff;
                border:1.5px solid rgba(255,255,255,.82);
            }
            #${NAV_ID} .nls-bn-avatar img{width:100%;height:100%;object-fit:cover;display:block}

            @media(max-width:1024px){
                body{padding-bottom:88px!important}
                #${NAV_ID}{display:block!important;visibility:visible!important;bottom:max(8px,env(safe-area-inset-bottom))!important}
            }
            @media(max-width:430px){
                #${NAV_ID}{left:7px;right:7px;height:58px;padding:4px;border-radius:18px}
                #${NAV_ID} .nls-bn-slider,#${NAV_ID} .nls-bn-item{border-radius:13px}
                #${NAV_ID} .nls-bn-item i,#${NAV_ID} .nls-bn-item .nls-bn-avatar{width:20px;height:20px;font-size:15px}
                #${NAV_ID} .nls-bn-label{font-size:8.5px}
                #${NAV_ID} .nls-bn-badge{right:calc(50% - 17px);top:1px}
                body{padding-bottom:82px!important}
            }
            @media(min-width:1025px){
                #${NAV_ID}{display:none!important}
                .nls-header.nls-scroll-hidden{transform:none!important;opacity:1!important}
            }
            @media(prefers-reduced-motion:reduce){
                #${NAV_ID},#${NAV_ID} .nls-bn-slider,#${NAV_ID} .nls-bn-item,#${NAV_ID} .nls-bn-item i,#${NAV_ID} .nls-bn-item .nls-bn-avatar,#${NAV_ID} .nls-bn-item .nls-bn-label,.nls-header{transition-duration:.01ms!important}
            }
        `;
        document.head.appendChild(style);
    }

    function getCurrentPath(){return window.location.pathname.replace(/\/+$/,'').toLowerCase()||'/';}
    function isOffers(){const p=getCurrentPath();return p.includes('best-selling')||p.includes('offer');}
    function getInitials(name){const parts=String(name||'User').trim().split(/\s+/).filter(Boolean);return (parts.length>1?parts[0][0]+parts[parts.length-1][0]:(parts[0]?.[0]||'U')).toUpperCase().slice(0,2);}

    async function getAccountData(){
        let user=null;
        try{const r=await window.supabaseClient?.auth?.getUser();user=r?.data?.user||null;}catch(_){ }
        if(!user)return {user:null,avatarUrl:'',name:'User'};
        const m=user.user_metadata||{};
        let avatarUrl=m.avatar_url||m.picture||m.photo_url||'';
        let name=m.full_name||m.name||user.email||'User';
        try{const r=await window.supabaseClient.from('profiles').select('avatar_url,full_name').eq('id',user.id).maybeSingle();if(r.data?.avatar_url)avatarUrl=r.data.avatar_url;if(r.data?.full_name)name=r.data.full_name;}catch(_){ }
        return {user,avatarUrl,name};
    }

    window.NLSAccountSystem={getAccountData};

    function enhanceMobileTopNav(){
        const search=document.getElementById('mobileSearchToggle');
        const cart=document.getElementById('cartBtn');
        if(search&&!search.querySelector('.nls-mobile-action-text')){
            const label=document.createElement('span');
            label.className='nls-mobile-action-text';
            label.textContent='Search';
            search.appendChild(label);
        }
        if(cart){
            const existing=cart.querySelector('.nls-cart-text');
            if(existing)existing.textContent='Cart';
        }
    }

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
        const data=await getAccountData();
        if(!data.user){account.href='/login.html?redirect=/dashboard.html';account.setAttribute('aria-label','Account — Login');avatar.innerHTML='<i class="fa-solid fa-user"></i>';return;}
        account.href='/dashboard.html';
        account.setAttribute('aria-label',`Account — ${String(data.name||'User').replace(/"/g,'')}`);
        if(data.avatarUrl)avatar.innerHTML=`<img src="${String(data.avatarUrl).replace(/"/g,'&quot;')}" alt="Profile picture">`;else avatar.innerHTML=`<span style="font-size:9px;font-weight:800">${getInitials(data.name)}</span>`;
    }

    function setupScrollBehavior(nav){
        if(window.__NLSNavScrollBound)return;
        window.__NLSNavScrollBound=true;
        const header=document.getElementById('nlsHeader');
        let lastY=Math.max(0,window.scrollY||0), ticking=false;
        const update=()=>{
            ticking=false;
            if(window.innerWidth>1024){nav.classList.remove('nls-scroll-hidden');if(header)header.classList.remove('nls-scroll-hidden');return;}
            const y=Math.max(0,window.scrollY||0),delta=y-lastY;
            if(y<=12){nav.classList.remove('nls-scroll-hidden');if(header)header.classList.remove('nls-scroll-hidden');}
            else if(delta>6){nav.classList.add('nls-scroll-hidden');if(header)header.classList.add('nls-scroll-hidden');}
            else if(delta<-6){nav.classList.remove('nls-scroll-hidden');if(header)header.classList.remove('nls-scroll-hidden');}
            lastY=y;
        };
        window.addEventListener('scroll',()=>{if(!ticking){ticking=true;requestAnimationFrame(update)}},{passive:true});
        window.addEventListener('resize',update,{passive:true});
        update();
    }

    function init(){
        if(!document.body)return;
        injectStyles();
        enhanceMobileTopNav();
        const nav=createNav();
        setActive(nav);
        updateAccountButton(nav);
        setupScrollBehavior(nav);
        window.NLSMobileNotifications={setCount:setNotificationCount,getCount:()=>{const b=nav.querySelector('[data-bn="notifications"] .nls-bn-badge');return b&&b.style.display!=='none'?Number(b.textContent)||0:0;}};
        window.addEventListener('popstate',()=>setActive(nav));
        window.addEventListener('pageshow',()=>{setActive(nav);updateAccountButton(nav);enhanceMobileTopNav()});
        if(window.supabaseClient?.auth?.onAuthStateChange)window.supabaseClient.auth.onAuthStateChange(()=>updateAccountButton(nav));
    }
    if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
