"use strict";

window.SUPABASE_URL = "https://zrptkmjdltqdjzrpogyo.supabase.co";
window.SUPABASE_ANON_KEY = "sb_publishable_KcWSkkO1L4z0U6UUfZijyw_KIJ_d5m7";

window.supabaseClient = window.supabase.createClient(window.SUPABASE_URL, window.SUPABASE_ANON_KEY, {
    auth: { detectSessionInUrl: true, persistSession: true, autoRefreshToken: true }
});

(function () {
    const path = window.location.pathname;
    const isDetailsPage = /\/details\.html$/i.test(path) || /\/product\//i.test(path);

    const load = (selector, src, dataKey) => {
        if (document.querySelector(selector)) return;
        const script = document.createElement("script");
        script.src = src;
        script.async = false;
        script.dataset[dataKey] = "true";
        document.head.appendChild(script);
    };

    if (isDetailsPage) load('script[data-nextlevel-details-navbar-scroll]', '/js/details-navbar-scroll-fix.js?v=20260908-1', 'nextlevelDetailsNavbarScroll');
    else load('script[data-nextlevel-navbar-scroll]', '/js/navbar-scroll.js?v=20260908-6', 'nextlevelNavbarScroll');

    load('script[data-nextlevel-cart-fix]', '/js/cart-responsive-fix.js?v=20260907-3', 'nextlevelCartFix');
    load('script[data-nextlevel-mobile-viewport-fix]', '/js/mobile-viewport-fix.js?v=20260907-2', 'nextlevelMobileViewportFix');
    load('script[data-nextlevel-mobile-nav-interaction]', '/js/mobile-nav-interaction.js?v=20260908-2', 'nextlevelMobileNavInteraction');
    load('script[data-nextlevel-navigation-fix]', '/js/iframe-navigation-fix.js?v=20260906-1', 'nextlevelNavigationFix');
    load('script[data-nextlevel-mobile-bottom-nav]', '/js/mobile-bottom-nav.js?v=20260907-2', 'nextlevelMobileBottomNav');
    load('script[data-nextlevel-profile-system]', '/js/profile.js?v=20260908-2', 'nextlevelProfileSystem');
    load('script[data-nextlevel-desktop-profile-nav]', '/js/desktop-profile-nav.js?v=20260907-1', 'nextlevelDesktopProfileNav');
    load('script[data-nextlevel-notifications-system]', '/js/notifications-system.js?v=20260908-5', 'nextlevelNotificationsSystem');
    load('script[data-nextlevel-product-catalog-runtime]', '/js/product-catalog-runtime.js?v=20260910-1', 'nextlevelProductCatalogRuntime');

    if (/\/dashboard\.html$/i.test(path)) load('script[data-nextlevel-dashboard-buttons-responsive]', '/js/dashboard-buttons-responsive.js?v=20260908-2', 'nextlevelDashboardButtonsResponsive');

    if (isDetailsPage) {
        load('script[data-nextlevel-details-fix]', '/js/details-page-fix.js?v=20260907-4', 'nextlevelDetailsFix');
        load('script[data-nextlevel-legacy-review-cleanup]', '/js/details-review-cleanup.js?v=20260907-2', 'nextlevelLegacyReviewCleanup');
        load('script[data-nextlevel-reviews-product-bridge]', '/js/reviews-product-bridge.js?v=20260907-2', 'nextlevelReviewsProductBridge');
        load('script[data-nextlevel-existing-ui-reviews]', '/js/reviews-existing-ui.js?v=20260910-1', 'nextlevelExistingUiReviews');
        load('script[data-nextlevel-premium-review-ui]', '/js/reviews-premium-ui.js?v=20260907-1', 'nextlevelPremiumReviewUi');
        load('script[data-nextlevel-review-ux-polish]', '/js/reviews-ux-polish.js?v=20260908-1', 'nextlevelReviewUxPolish');
        load('script[data-nextlevel-reply-media]', '/js/reviews-reply-media.js?v=20260908-1', 'nextlevelReplyMedia');
        load('script[data-nextlevel-details-tabs-ux]', '/js/details-tabs-ux-fix.js?v=20260910-1', 'nextlevelDetailsTabsUx');
        load('script[data-nextlevel-reviews-avatar-fix]', '/js/reviews-avatar-fix.js?v=20260910-2', 'nextlevelReviewsAvatarFix');
        load('script[data-nextlevel-product-media-details]', '/js/product-media-details-bridge.js?v=20260910-1', 'nextlevelProductMediaDetails');
    }

    if (/\/admin-orders\.html$/i.test(path)) {
        load('script[data-nextlevel-admin-reviews-inline]', '/js/admin-reviews-inline.js?v=20260907-2', 'nextlevelAdminReviewsInline');
        load('script[data-nextlevel-admin-product-management-link]', '/js/admin-product-management-link.js?v=20260909-1', 'nextlevelAdminProductManagementLink');
        load('script[data-nextlevel-admin-orders-design]', '/js/admin-orders-design.js?v=20260909-1', 'nextlevelAdminOrdersDesign');
    }

    if (/\/admin-products\.html$/i.test(path)) {
        load('script[data-nextlevel-admin-product-media]', '/js/admin-product-media.js?v=20260910-2', 'nextlevelAdminProductMedia');
    }

    load('script[data-nextlevel-product-display-sync]', '/js/product-display-sync.js?v=20260909-1', 'nextlevelProductDisplaySync');
})();
