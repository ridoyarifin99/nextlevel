"use strict";
window.SUPABASE_URL="https://zrptkmjdltqdjzrpogyo.supabase.co";
window.SUPABASE_ANON_KEY="sb_publishable_KcWSkkO1L4z0U6UUfZijyw_KIJ_d5m7";
window.supabaseClient=window.supabase.createClient(window.SUPABASE_URL,window.SUPABASE_ANON_KEY,{auth:{detectSessionInUrl:true,persistSession:true,autoRefreshToken:true}});
(function(){
  const path=window.location.pathname,isDetailsPage=/\/details\.html$/i.test(path)||/\/product\//i.test(path);
  document.querySelectorAll('link[rel="stylesheet"][href*="input.css"]').forEach(link=>link.remove());
  if(/^https?:\/\/localhost(?::\d+)?/i.test(String(window.AUTH_API_BASE||"")))delete window.AUTH_API_BASE;
  const load=(selector,src,dataKey)=>{if(document.querySelector(selector))return;const script=document.createElement("script");script.src=src;script.async=false;document.head.appendChild(script);script.dataset[dataKey]="true"};
  load('script[data-nextlevel-mobile-navigation]','/js/mobile-navigation-system.js?v=20260910-1','nextlevelMobileNavigation');
  load('script[data-nextlevel-navigation-fix]','/js/iframe-navigation-fix.js?v=20260906-1','nextlevelNavigationFix');
  load('script[data-nextlevel-cart-fix]','/js/cart-responsive-fix.js?v=20260907-3','nextlevelCartFix');
  load('script[data-nextlevel-mobile-viewport-fix]','/js/mobile-viewport-fix.js?v=20260907-2','nextlevelMobileViewportFix');
  load('script[data-nextlevel-mobile-bottom-nav]','/js/profile.js?v=20260908-2','nextlevelProfileSystem');
  load('script[data-nextlevel-desktop-profile-nav]','/js/desktop-profile-nav.js?v=20260907-1','nextlevelDesktopProfileNav');
  load('script[data-nextlevel-notifications-system]','/js/notifications-system.js?v=20260908-5','nextlevelNotificationsSystem');
  load('script[data-nextlevel-product-catalog-runtime]','/js/product-catalog-runtime.js?v=20260910-5','nextlevelProductCatalogRuntime');
  if(/\/dashboard\.html$/i.test(path))load('script[data-nextlevel-dashboard-buttons-responsive]','/js/dashboard-buttons-responsive.js?v=20260908-2','nextlevelDashboardButtonsResponsive');
  if(isDetailsPage){
    load('script[data-nextlevel-details-fix]','/js/details-page-fix.js?v=20260910-2','nextlevelDetailsFix');
    load('script[data-nextlevel-details-premium-content]','/js/details-premium-content.js?v=20260910-2','nextlevelDetailsPremiumContent');
    load('script[data-nextlevel-reviews-system]','/js/reviews-system.js?v=20260910-1','nextlevelReviewsSystem');
    load('script[data-nextlevel-product-media-details]','/js/product-media-details-bridge.js?v=20260910-1','nextlevelProductMediaDetails');
  }
  if(/\/admin-orders\.html$/i.test(path)){
    load('script[data-nextlevel-admin-reviews-inline]','/js/admin-reviews-inline.js?v=20260907-2','nextlevelAdminReviewsInline');
    load('script[data-nextlevel-admin-product-management-link]','/js/admin-product-management-link.js?v=20260909-1','nextlevelAdminProductManagementLink');
    load('script[data-nextlevel-admin-orders-design]','/js/admin-orders-design.js?v=20260909-1','nextlevelAdminOrdersDesign');
    load('script[data-nextlevel-admin-orders-central-runtime]','/js/admin-orders-central-runtime.js?v=20260910-1','nextlevelAdminOrdersCentralRuntime');
  }
  if(/\/admin-products\.html$/i.test(path)){
    load('script[data-nextlevel-admin-product-media-system]','/js/admin-product-media-system.js?v=20260910-2','nextlevelAdminProductMediaSystem');
    load('script[data-nextlevel-admin-product-category-system]','/js/admin-product-category-system.js?v=20260910-1','nextlevelAdminProductCategorySystem');
    load('script[data-nextlevel-promo-management]','/js/promo-management.js?v=20260910-4','nextlevelPromoManagement');
    load('script[data-nextlevel-legacy-details-import]','/js/legacy-details-import.js?v=20260910-3','nextlevelLegacyDetailsImport');
  }
  if(/\/checkout\.html$/i.test(path)){
    load('script[data-nextlevel-promo-checkout]','/js/promo-checkout.js?v=20260910-2','nextlevelPromoCheckout');
  }
  load('script[data-nextlevel-product-display-sync]','/js/product-display-sync.js?v=20260909-1','nextlevelProductDisplaySync');
})();
