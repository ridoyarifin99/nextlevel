"use strict";
window.SUPABASE_URL="https://zrptkmjdltqdjzrpogyo.supabase.co";
window.SUPABASE_ANON_KEY="sb_publishable_KcWSkkO1L4z0U6UUfZijyw_KIJ_d5m7";
window.supabaseClient=window.supabase.createClient(window.SUPABASE_URL,window.SUPABASE_ANON_KEY,{auth:{detectSessionInUrl:true,persistSession:true,autoRefreshToken:true}});
(function(){
  const path=window.location.pathname,isDetailsPage=/\/details\.html$/i.test(path)||/\/product\//i.test(path);
  document.querySelectorAll('link[rel="stylesheet"][href*="input.css"]').forEach(link=>link.remove());
  if(/^https?:\/\/localhost(?::\d+)?/i.test(String(window.AUTH_API_BASE||"")))delete window.AUTH_API_BASE;
  const load=(selector,src,dataKey)=>{if(document.querySelector(selector))return;const script=document.createElement("script");script.src=src;script.async=false;script.dataset[dataKey]="true";document.head.appendChild(script)};
  load('script[data-nextlevel-central-catalog]','/js/central-catalog.js?v=20260912-3','nextlevelCentralCatalog');
  load('script[data-nextlevel-central-live-sync]','/js/central-live-sync.js?v=20260912-1','nextlevelCentralLiveSync');
  load('script[data-nextlevel-mobile-navigation]','/js/mobile-navigation-system.js?v=20260910-1','nextlevelMobileNavigation');
  load('script[data-nextlevel-navigation-fix]','/js/iframe-navigation-fix.js?v=20260906-1','nextlevelNavigationFix');
  load('script[data-nextlevel-cart-fix]','/js/cart-responsive-fix.js?v=20260907-3','nextlevelCartFix');
  load('script[data-nextlevel-mobile-viewport-fix]','/js/mobile-viewport-fix.js?v=20260907-2','nextlevelMobileViewportFix');
  load('script[data-nextlevel-mobile-bottom-nav]','/js/profile.js?v=20260908-2','nextlevelProfileSystem');
  load('script[data-nextlevel-desktop-profile-nav]','/js/desktop-profile-nav.js?v=20260907-1','nextlevelDesktopProfileNav');
  load('script[data-nextlevel-notifications-system]','/js/notifications-system.js?v=20260908-5','nextlevelNotificationsSystem');
  load('script[data-nextlevel-product-catalog-runtime]','/js/product-catalog-runtime.js?v=20260910-6','nextlevelProductCatalogRuntime');
  if(/\/(index|)$/.test(path)||/^\/$/.test(path))load('script[data-nextlevel-index-central-sync]','/js/index-central-sync.js?v=20260910-1','nextlevelIndexCentralSync');
  if(/\/(index|)$/.test(path)||/^\/$/.test(path)||isDetailsPage)load('script[data-nextlevel-mobile-fab-position-fix]','/js/mobile-fab-position-fix.js?v=20260912-1','nextlevelMobileFabPositionFix');
  if(/\/dashboard\.html$/i.test(path)){load('script[data-nextlevel-dashboard-central-sync]','/js/dashboard-central-sync.js?v=20260912-3','nextlevelDashboardCentralSync');load('script[data-nextlevel-dashboard-buttons-responsive]','/js/dashboard-buttons-responsive.js?v=20260908-2','nextlevelDashboardButtonsResponsive');}
  if(isDetailsPage){
    load('script[data-nextlevel-details-navigation-fix]','/js/details-navigation-fix.js?v=20260911-1','nextlevelDetailsNavigationFix');
    load('script[data-nextlevel-reviews-system-v3]','/js/reviews-system-v3.js?v=20260911-3','nextlevelReviewsSystemV3');
    load('script[data-nextlevel-product-media-details]','/js/product-media-details-bridge.js?v=20260912-1','nextlevelProductMediaDetails');
    load('script[data-nextlevel-details-central-logo]','/js/details-central-logo-sync.js?v=20260912-1','nextlevelDetailsCentralLogo');
    load('script[data-nextlevel-details-plan-fix]','/js/details-plan-selection-fix.js?v=20260912-1','nextlevelDetailsPlanFix');
    load('script[data-nextlevel-details-related-cards-fix]','/js/details-related-cards-fix.js?v=20260912-1','nextlevelDetailsRelatedCardsFix');
    load('script[data-nextlevel-details-premium-polish]','/js/details-premium-polish.js?v=20260911-1','nextlevelDetailsPremiumPolish');
    load('script[data-nextlevel-details-premium-finish]','/js/details-premium-finish.js?v=20260911-1','nextlevelDetailsPremiumFinish');
  }
  if(/\/admin-orders\.html$/i.test(path)){load('script[data-nextlevel-admin-reviews-inline]','/js/admin-reviews-inline.js?v=20260907-2','nextlevelAdminReviewsInline');load('script[data-nextlevel-admin-product-management-link]','/js/admin-product-management-link.js?v=20260909-1','nextlevelAdminProductManagementLink');load('script[data-nextlevel-admin-orders-design]','/js/admin-orders-design.js?v=20260909-1','nextlevelAdminOrdersDesign');load('script[data-nextlevel-admin-orders-central-runtime]','/js/admin-orders-central-runtime.js?v=20260912-3','nextlevelAdminOrdersCentralRuntime');}
  if(/\/admin-products\.html$/i.test(path)){load('script[data-nextlevel-admin-product-media-system]','/js/admin-product-media-system.js?v=20260910-2','nextlevelAdminProductMediaSystem');load('script[data-nextlevel-admin-product-category-system]','/js/admin-product-category-system.js?v=20260910-1','nextlevelAdminProductCategorySystem');load('script[data-nextlevel-promo-management]','/js/promo-management.js?v=20260910-4','nextlevelPromoManagement');load('script[data-nextlevel-legacy-details-import]','/js/legacy-details-import.js?v=20260910-4','nextlevelLegacyDetailsImport');}
  if(/\/checkout\.html$/i.test(path)){
    load('script[data-nextlevel-checkout-central-media-sync]','/js/checkout-central-media-sync.js?v=20260912-1','nextlevelCheckoutCentralMediaSync');
    load('script[data-nextlevel-promo-checkout]','/js/promo-checkout.js?v=20260910-2','nextlevelPromoCheckout');
    setTimeout(()=>load('script[data-nextlevel-checkout-central-guard]','/js/checkout-central-order-guard.js?v=20260912-3','nextlevelCheckoutCentralGuard'),0);
  }
  load('script[data-nextlevel-product-display-sync]','/js/product-display-sync.js?v=20260912-1','nextlevelProductDisplaySync');
})();
// Final Details premium presentation layer activated for production.
