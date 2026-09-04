/* ============================================================
   RESPONSIVE CART DRAWER VIEWPORT FIX
   Applies only when the existing cart drawer is present.
============================================================ */
(function () {
    "use strict";

    function installCartDrawerFix() {
        if (!document.body) return;

        if (!document.getElementById("nls-cart-viewport-fix")) {
            const style = document.createElement("style");
            style.id = "nls-cart-viewport-fix";
            style.textContent = `
                @media (max-width: 1024px) {
                    .nls-cart-drawer-responsive {
                        height: 100dvh !important;
                        max-height: 100dvh !important;
                        min-height: 0 !important;
                        overflow-y: auto !important;
                        overflow-x: hidden !important;
                        -webkit-overflow-scrolling: touch !important;
                        overscroll-behavior: contain !important;
                        box-sizing: border-box !important;
                    }
                }

                @media (max-width: 640px) {
                    .nls-cart-drawer-responsive {
                        width: 100vw !important;
                        max-width: 100vw !important;
                        right: 0 !important;
                        left: auto !important;
                    }
                }

                @supports not (height: 100dvh) {
                    @media (max-width: 1024px) {
                        .nls-cart-drawer-responsive {
                            height: 100vh !important;
                            max-height: 100vh !important;
                        }
                    }
                }
            `;
            document.head.appendChild(style);
        }

        const candidates = Array.from(
            document.querySelectorAll("h1,h2,h3,h4,h5,h6,[role='heading'],button,div,span")
        );
        const heading = candidates.find(function (el) {
            const text = (el.textContent || "").replace(/\s+/g, " ").trim();
            return text === "Your Cart" || /^Your Cart\s+\d+$/.test(text);
        });

        if (!heading) return;

        let drawer = heading.parentElement;
        while (drawer && drawer !== document.body) {
            const cs = window.getComputedStyle(drawer);
            const rect = drawer.getBoundingClientRect();
            const looksLikeDrawer =
                (cs.position === "fixed" || cs.position === "absolute") &&
                rect.width >= Math.min(window.innerWidth * 0.45, 360) &&
                rect.height >= window.innerHeight * 0.45;

            if (looksLikeDrawer) break;
            drawer = drawer.parentElement;
        }

        if (!drawer || drawer === document.body) return;
        drawer.classList.add("nls-cart-drawer-responsive");
    }

    function run() {
        installCartDrawerFix();
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", run, { once: true });
    } else {
        run();
    }

    const observer = new MutationObserver(function () {
        installCartDrawerFix();
    });
    observer.observe(document.documentElement, { childList: true, subtree: true });
})();
