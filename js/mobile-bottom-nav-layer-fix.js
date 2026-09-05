(function () {
    "use strict";

    const styleId = "nls-mobile-bottom-nav-layer-fix";
    if (document.getElementById(styleId)) return;

    const style = document.createElement("style");
    style.id = styleId;
    style.textContent = `
        /* Hard override: the mobile bottom nav must always stay above page UI. */
        #nls-mobile-bottom-nav {
            position: fixed !important;
            left: 10px !important;
            right: 10px !important;
            bottom: max(10px, env(safe-area-inset-bottom)) !important;
            z-index: 2147483647 !important;
            pointer-events: auto !important;
        }

        #nls-mobile-bottom-nav .nls-bn-slider {
            z-index: 0 !important;
        }

        #nls-mobile-bottom-nav .nls-bn-item {
            z-index: 1 !important;
            pointer-events: auto !important;
        }

        /* If the ready animation is interrupted, never leave the navigation invisible. */
        @media (max-width: 1024px) {
            #nls-mobile-bottom-nav {
                display: block !important;
                visibility: visible !important;
            }
        }

        @media (min-width: 1025px) {
            #nls-mobile-bottom-nav {
                display: none !important;
            }
        }

        @media (max-width: 430px) {
            #nls-mobile-bottom-nav {
                left: 8px !important;
                right: 8px !important;
            }
        }
    `;
    document.head.appendChild(style);
})();
