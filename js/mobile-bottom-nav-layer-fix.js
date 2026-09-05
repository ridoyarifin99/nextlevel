(function () {
    "use strict";

    const styleId = "nls-mobile-bottom-nav-layer-fix";
    if (document.getElementById(styleId)) return;

    const style = document.createElement("style");
    style.id = styleId;
    style.textContent = `
        /* =========================================================
           MOBILE BOTTOM NAV — HARD VISIBILITY/LAYER FIX
           ========================================================= */
        #nls-mobile-bottom-nav {
            position: fixed !important;
            left: 10px !important;
            right: 10px !important;
            bottom: max(10px, env(safe-area-inset-bottom)) !important;
            z-index: 2147483647 !important;
            display: block !important;
            visibility: visible !important;
            opacity: 1 !important;
            transform: none !important;
            pointer-events: auto !important;
            margin: 0 !important;
        }

        #nls-mobile-bottom-nav.nls-scroll-hidden {
            transform: translateY(calc(100% + 24px)) !important;
            opacity: 0 !important;
            pointer-events: none !important;
        }

        #nls-mobile-bottom-nav .nls-bn-slider {
            z-index: 0 !important;
        }

        #nls-mobile-bottom-nav .nls-bn-item {
            position: relative !important;
            z-index: 1 !important;
            pointer-events: auto !important;
        }

        /* =========================================================
           BANNER IMAGE RATIO FIX
           Preserve the artwork's original proportions. No stretch
           and no forced crop on narrow/mobile screens.
           ========================================================= */
        .mega-grid .mg-main {
            aspect-ratio: 16 / 9 !important;
        }

        .mega-grid .mg-small {
            aspect-ratio: 16 / 9 !important;
        }

        .mega-grid .mg-main img,
        .mega-grid .mg-small img {
            display: block !important;
            width: 100% !important;
            height: 100% !important;
            max-width: none !important;
            max-height: none !important;
            object-fit: contain !important;
            object-position: center center !important;
            aspect-ratio: auto !important;
        }

        @media (max-width: 1024px) {
            body {
                padding-bottom: 100px !important;
            }
        }

        @media (max-width: 430px) {
            #nls-mobile-bottom-nav {
                left: 8px !important;
                right: 8px !important;
                height: 68px !important;
                border-radius: 21px !important;
            }
        }

        @media (min-width: 1025px) {
            #nls-mobile-bottom-nav {
                display: none !important;
            }
        }
    `;
    document.head.appendChild(style);
})();