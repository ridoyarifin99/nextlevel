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

/* Load shared UI fixes, navigation and profile systems. */
(function () {
    const loadSharedScript = (selector, src, dataKey) => {
        if (document.querySelector(selector)) return;
        const script = document.createElement('script');
        script.src = src;
        script.async = false;
        script.dataset[dataKey] = 'true';
        document.head.appendChild(script);
    };

    loadSharedScript(
        'script[data-nextlevel-cart-fix]',
        '/js/cart-responsive-fix.js?v=20260906-1',
        'nextlevelCartFix'
    );

    loadSharedScript(
        'script[data-nextlevel-navigation-fix]',
        '/js/iframe-navigation-fix.js?v=20260906-1',
        'nextlevelNavigationFix'
    );

    loadSharedScript(
        'script[data-nextlevel-mobile-bottom-nav]',
        '/js/mobile-bottom-nav.js?v=20260906-6',
        'nextlevelMobileBottomNav'
    );

    loadSharedScript(
        'script[data-nextlevel-mobile-bottom-nav-layer-fix]',
        '/js/mobile-bottom-nav-layer-fix.js?v=20260906-3',
        'nextlevelMobileBottomNavLayerFix'
    );

    loadSharedScript(
        'script[data-nextlevel-profile-system]',
        '/js/profile.js?v=20260906-3',
        'nextlevelProfileSystem'
    );

    loadSharedScript(
        'script[data-nextlevel-desktop-profile-nav]',
        '/js/desktop-profile-nav.js?v=20260906-3',
        'nextlevelDesktopProfileNav'
    );
})();
