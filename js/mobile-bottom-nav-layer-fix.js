(function () {
    "use strict";

    const styleId = "nls-mobile-bottom-nav-layer-fix";
    if (document.getElementById(styleId)) return;

    const style = document.createElement("style");
    style.id = styleId;
    style.textContent = `
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

        #nls-mobile-bottom-nav .nls-bn-slider { z-index: 0 !important; }
        #nls-mobile-bottom-nav .nls-bn-item { position: relative !important; z-index: 1 !important; pointer-events: auto !important; }

        /* Desktop authenticated account: large profile picture beside username. */
        #userAccountArea {
            align-items: center !important;
            gap: 9px !important;
        }
        #userAccountArea .nls-account-icon {
            width: 42px !important;
            height: 42px !important;
            min-width: 42px !important;
            border-radius: 50% !important;
            overflow: hidden !important;
            display: inline-flex !important;
            align-items: center !important;
            justify-content: center !important;
            background: linear-gradient(135deg,#6a11cb,#2575fc) !important;
            color: #fff !important;
        }
        #userAccountArea .nls-account-icon img {
            width: 100% !important;
            height: 100% !important;
            object-fit: cover !important;
            display: block !important;
        }

        /* Preserve the artwork's 16:9 proportions. */
        .mega-grid .mg-main, .mega-grid .mg-small { aspect-ratio: 16 / 9 !important; }
        .mega-grid .mg-main img, .mega-grid .mg-small img {
            display: block !important;
            width: 100% !important;
            height: 100% !important;
            max-width: none !important;
            max-height: none !important;
            object-fit: contain !important;
            object-position: center center !important;
            aspect-ratio: auto !important;
        }

        @media (max-width: 1024px) { body { padding-bottom: 100px !important; } }
        @media (max-width: 430px) {
            #nls-mobile-bottom-nav { left: 8px !important; right: 8px !important; height: 68px !important; border-radius: 21px !important; }
        }
        @media (min-width: 1025px) { #nls-mobile-bottom-nav { display: none !important; } }
    `;
    document.head.appendChild(style);
})();