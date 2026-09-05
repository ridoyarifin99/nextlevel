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
            /* =====================================================
               NEXT LEVEL SUBS — MOBILE / TABLET BOTTOM NAV
               Dedicated mobile navigation. Never shown on desktop.
            ===================================================== */
            #${NAV_ID} {
                --nls-bn-primary: #6a11cb;
                --nls-bn-secondary: #2575fc;
                --nls-bn-text: #64748b;
                --nls-bn-active: #ffffff;
                position: fixed;
                left: 10px;
                right: 10px;
                bottom: max(10px, env(safe-area-inset-bottom));
                z-index: 2147483000;
                display: none;
                height: 70px;
                padding: 7px;
                border: 1px solid rgba(226, 232, 240, .82);
                border-radius: 22px;
                background: rgba(255, 255, 255, .82);
                backdrop-filter: blur(24px) saturate(180%);
                -webkit-backdrop-filter: blur(24px) saturate(180%);
                box-shadow: 0 18px 55px rgba(15, 23, 42, .18), 0 3px 12px rgba(106, 17, 203, .08);
                isolation: isolate;
                overflow: visible;
                transform: translateY(120%);
                opacity: 0;
                transition: transform .65s cubic-bezier(.16, 1, .3, 1), opacity .45s ease;
            }

            #${NAV_ID}.nls-bn-ready {
                transform: translateY(0);
                opacity: 1;
            }

            #${NAV_ID} .nls-bn-track {
                position: relative;
                width: 100%;
                height: 100%;
                display: grid;
                grid-template-columns: repeat(4, minmax(0, 1fr));
                align-items: stretch;
            }

            #${NAV_ID} .nls-bn-slider {
                position: absolute;
                z-index: -1;
                top: 0;
                bottom: 0;
                left: 0;
                width: 25%;
                border-radius: 17px;
                background: linear-gradient(135deg, var(--nls-bn-primary), var(--nls-bn-secondary));
                box-shadow: 0 8px 22px rgba(106, 17, 203, .24);
                transform: translateX(0);
                transition: transform .5s cubic-bezier(.16, 1, .3, 1), width .35s ease;
                pointer-events: none;
            }

            #${NAV_ID} .nls-bn-item {
                position: relative;
                min-width: 0;
                height: 100%;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                gap: 3px;
                padding: 5px 3px;
                border: 0;
                border-radius: 17px;
                background: transparent;
                color: var(--nls-bn-text);
                font: inherit;
                text-decoration: none;
                cursor: pointer;
                -webkit-tap-highlight-color: transparent;
                transition: color .35s ease, transform .35s cubic-bezier(.16, 1, .3, 1);
            }

            #${NAV_ID} .nls-bn-item i,
            #${NAV_ID} .nls-bn-item .nls-bn-avatar {
                width: 23px;
                height: 23px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 18px;
                line-height: 1;
                transition: transform .45s cubic-bezier(.16, 1, .3, 1), filter .35s ease;
            }

            #${NAV_ID} .nls-bn-label {
                max-width: 100%;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                font-size: 10px;
                line-height: 1.1;
                font-weight: 700;
                letter-spacing: -.01em;
                transition: transform .35s ease;
            }

            #${NAV_ID} .nls-bn-item.active {
                color: var(--nls-bn-active);
            }

            #${NAV_ID} .nls-bn-item.active i,
            #${NAV_ID} .nls-bn-item.active .nls-bn-avatar {
                transform: translateY(-1px) scale(1.08);
                filter: drop-shadow(0 3px 7px rgba(0, 0, 0, .18));
            }

            #${NAV_ID} .nls-bn-item.active .nls-bn-label {
                transform: translateY(-1px);
            }

            #${NAV_ID} .nls-bn-item:active {
                transform: scale(.92);
            }

            #${NAV_ID} .nls-bn-item:focus-visible {
                outline: 2px solid rgba(37, 117, 252, .55);
                outline-offset: -2px;
            }

            #${NAV_ID} .nls-bn-badge {
                position: absolute;
                top: 4px;
                right: calc(50% - 20px);
                min-width: 15px;
                height: 15px;
                padding: 0 4px;
                display: none;
                align-items: center;
                justify-content: center;
                border-radius: 999px;
                background: #ef4444;
                color: #fff;
                font-size: 8px;
                font-weight: 800;
                line-height: 1;
                border: 2px solid rgba(255,255,255,.9);
                box-shadow: 0 4px 10px rgba(239, 68, 68, .28);
            }

            #${NAV_ID} .nls-bn-item[data-bn="whatsapp"] i {
                color: #25D366;
            }

            #${NAV_ID} .nls-bn-item.active[data-bn="whatsapp"] i {
                color: #fff;
            }

            #${NAV_ID} .nls-bn-avatar {
                overflow: hidden;
                border-radius: 50%;
                background: linear-gradient(135deg, #6a11cb, #2575fc);
                color: #fff;
                border: 2px solid rgba(255,255,255,.75);
            }

            #${NAV_ID} .nls-bn-avatar img {
                width: 100%;
                height: 100%;
                object-fit: cover;
                display: block;
            }

            @media (max-width: 1024px) {
                body {
                    padding-bottom: 92px !important;
                }

                #${NAV_ID} {
                    display: block;
                }
            }

            @media (max-width: 430px) {
                #${NAV_ID} {
                    left: 8px;
                    right: 8px;
                    height: 68px;
                    border-radius: 21px;
                }

                #${NAV_ID} .nls-bn-label {
                    font-size: 9.5px;
                }
            }

            @media (min-width: 1025px) {
                #${NAV_ID} {
                    display: none !important;
                }
            }

            @media (prefers-reduced-motion: reduce) {
                #${NAV_ID},
                #${NAV_ID} .nls-bn-slider,
                #${NAV_ID} .nls-bn-item,
                #${NAV_ID} .nls-bn-item i,
                #${NAV_ID} .nls-bn-item .nls-bn-avatar,
                #${NAV_ID} .nls-bn-item .nls-bn-label {
                    transition-duration: .01ms !important;
                    animation-duration: .01ms !important;
                }
            }
        `;
        document.head.appendChild(style);
    }

    function getCurrentPath() {
        return window.location.pathname.replace(/\\/+$/, "").toLowerCase() || "/";
    }

    function isHome() {
        const path = getCurrentPath();
        return path === "/" || path.endsWith("/index.html");
    }

    function isOffers() {
        const path = getCurrentPath();
        return path.includes("best-selling") || path.includes("offer");
    }

    function getInitials(name) {
        const clean = String(name || "User").trim();
        if (!clean) return "U";
        const parts = clean.split(/\\s+/).filter(Boolean);
        return (parts.length > 1 ? parts[0][0] + parts[parts.length - 1][0] : parts[0][0]).toUpperCase().slice(0, 2);
    }

    function createNav() {
        if (document.getElementById(NAV_ID)) return document.getElementById(NAV_ID);

        const nav = document.createElement("nav");
        nav.id = NAV_ID;
        nav.setAttribute("aria-label", "Mobile navigation");
        nav.innerHTML = `
            <div class="nls-bn-track">
                <div class="nls-bn-slider" aria-hidden="true"></div>

                <a class="nls-bn-item" data-bn="home" href="/" aria-label="Home">
                    <i class="fa-solid fa-house"></i>
                    <span class="nls-bn-label">Home</span>
                </a>

                <a class="nls-bn-item" data-bn="whatsapp" href="https://wa.me/8801644490566" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
                    <i class="fa-brands fa-whatsapp"></i>
                    <span class="nls-bn-label">WhatsApp</span>
                </a>

                <a class="nls-bn-item" data-bn="offers" href="/best-selling" aria-label="Offers">
                    <i class="fa-solid fa-gift"></i>
                    <span class="nls-bn-label">Offers</span>
                    <span class="nls-bn-badge" aria-hidden="true">NEW</span>
                </a>

                <a class="nls-bn-item" data-bn="account" href="/login.html?redirect=/dashboard.html" aria-label="Account">
                    <span class="nls-bn-avatar"><i class="fa-solid fa-user"></i></span>
                    <span class="nls-bn-label">Account</span>
                </a>
            </div>
        `;

        document.body.appendChild(nav);
        return nav;
    }

    function setActive(nav) {
        const items = [...nav.querySelectorAll(".nls-bn-item")];
        const slider = nav.querySelector(".nls-bn-slider");
        const path = getCurrentPath();
        let activeKey = "home";

        if (path.includes("dashboard") || path.includes("account") || path.includes("login") || path.includes("register") || path.includes("forgot-password") || path.includes("reset-password") || path.includes("email-verification")) {
            activeKey = "account";
        } else if (isOffers()) {
            activeKey = "offers";
        } else if (path.includes("checkout") || path.includes("cart")) {
            activeKey = "home";
        }

        const active = nav.querySelector(`[data-bn="${activeKey}"]`);
        items.forEach(item => item.classList.toggle("active", item === active));

        if (active && slider) {
            const index = items.indexOf(active);
            slider.style.transform = `translateX(${index * 100}%)`;
        }
    }

    async function updateAccountButton(nav) {
        const account = nav.querySelector('[data-bn="account"]');
        const avatar = nav.querySelector(".nls-bn-avatar");
        if (!account || !avatar) return;

        let user = null;
        try {
            if (window.supabaseClient?.auth?.getUser) {
                const result = await window.supabaseClient.auth.getUser();
                user = result?.data?.user || null;
            }
        } catch (_) {}

        if (!user) {
            account.href = "/login.html?redirect=/dashboard.html";
            avatar.innerHTML = '<i class="fa-solid fa-user"></i>';
            return;
        }

        account.href = "/dashboard.html";
        const metadata = user.user_metadata || {};
        const avatarUrl = metadata.avatar_url || metadata.picture || metadata.photo_url || "";
        const name = metadata.full_name || metadata.name || user.email || "User";

        if (avatarUrl) {
            avatar.innerHTML = `<img src="${String(avatarUrl).replace(/"/g, "&quot;")}" alt="">`;
            return;
        }

        avatar.textContent = getInitials(name);
        avatar.style.fontSize = "9px";
        avatar.style.fontWeight = "800";
    }

    function init() {
        if (!document.body) return;
        injectStyles();
        const nav = createNav();
        setActive(nav);
        updateAccountButton(nav);

        requestAnimationFrame(() => {
            requestAnimationFrame(() => nav.classList.add("nls-bn-ready"));
        });

        window.addEventListener("popstate", () => setActive(nav));
        window.addEventListener("pageshow", () => {
            setActive(nav);
            updateAccountButton(nav);
        });

        if (window.supabaseClient?.auth?.onAuthStateChange) {
            window.supabaseClient.auth.onAuthStateChange(() => updateAccountButton(nav));
        }
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init, { once: true });
    } else {
        init();
    }
})();
