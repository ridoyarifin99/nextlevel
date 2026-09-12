"use strict";
/* Compatibility bridge only. Product data lives in Product Central/Supabase. */
(function () {
  if (window.__NLSDetailsCentralBridge) return;
  window.__NLSDetailsCentralBridge = true;
  const publish = () => {
    const list = window.NLSCentralCatalog?.products;
    if (Array.isArray(list)) window.products = list;
  };
  publish();
  window.addEventListener("nls:central-catalog-ready", publish);
  window.addEventListener("nextlevel:products-updated", publish);
})();
