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
                /*
                Detect authentication information returned
                in the URL after email confirmation.
                */
                detectSessionInUrl: true,

                /*
                Keep the authentication session between
                page loads.
                */
                persistSession: true,

                /*
                Automatically refresh expired sessions.
                */
                autoRefreshToken: true
            }
        }
    );


/* Load the shared cart viewport fix on pages that use the cart drawer. */
(function () {
    if (!document.querySelector('script[data-nextlevel-cart-fix]')) {
        const script = document.createElement('script');
        script.src = './js/cart-responsive-fix.js';
        script.defer = true;
        script.dataset.nextlevelCartFix = 'true';
        document.head.appendChild(script);
    }

    if (!document.querySelector('script[data-nextlevel-navigation-fix]')) {
        const script = document.createElement('script');
        script.src = './js/iframe-navigation-fix.js';
        script.defer = true;
        script.dataset.nextlevelNavigationFix = 'true';
        document.head.appendChild(script);
    }
})();
