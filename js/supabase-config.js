"use strict";

/*
============================================================
NEXT LEVEL SUBS
SUPABASE CLIENT CONFIGURATION
============================================================
*/

window.SUPABASE_URL =
    "https://zrptkmjdltqdjzrpogyo.supabase.co";

window.SUPABASE_ANON_KEY =
    "sb_publishable_KcWSkkO1L4z0U6UUfZijyw_KIJ_d5m7";


/*
============================================================
CREATE SUPABASE CLIENT
============================================================
*/

window.supabaseClient =
    window.supabase.createClient(
        window.SUPABASE_URL,
        window.SUPABASE_ANON_KEY,
        {
            auth: {
                detectSessionInUrl: true,
                persistSession: true,
                autoRefreshToken: true
            }
        }
    );


/* Load shared UI fixes, mobile navigation and profile system. */
(function () {
    if (!document.querySelector('script[data-nextlevel-cart-fix]')) {
        const script = document.createElement('script');
        script.src = '/js/cart-responsive-fix.js';
        script.defer = true;
        script.dataset.nextlevelCartFix = 'true';
        document.head.appendChild(script);
    }

    if (!document.querySelector('script[data-nextlevel-navigation-fix]')) {
        const script = document.createElement('script');
        script.src = '/js/iframe-navigation-fix.js';
        script.defer = true;
        script.dataset.nextlevelNavigationFix = 'true';
        document.head.appendChild(script);
    }

    if (!document.querySelector('script[data-nextlevel-mobile-bottom-nav]')) {
        const script = document.createElement('script');
        script.src = '/js/mobile-bottom-nav.js';
        script.defer = true;
        script.dataset.nextlevelMobileBottomNav = 'true';
        document.head.appendChild(script);
    }

    if (!document.querySelector('script[data-nextlevel-mobile-bottom-nav-layer-fix]')) {
        const script = document.createElement('script');
        script.src = '/js/mobile-bottom-nav-layer-fix.js';
        script.defer = true;
        script.dataset.nextlevelMobileBottomNavLayerFix = 'true';
        document.head.appendChild(script);
    }

    if (!document.querySelector('script[data-nextlevel-profile-system]')) {
        const script = document.createElement('script');
        script.src = '/js/profile.js';
        script.defer = true;
        script.dataset.nextlevelProfileSystem = 'true';
        document.head.appendChild(script);
    }
})();
