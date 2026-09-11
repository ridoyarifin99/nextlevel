"use strict";
/*
 * Compatibility bridge only.
 * The former hardcoded product catalog was intentionally deleted.
 * This file contains NO product data. It only keeps legacy inline homepage
 * code from throwing while the central Supabase catalog becomes authoritative.
 */
(function () {
  const getCentral = () => Array.isArray(window.NLSCentralCatalog?.products)
    ? window.NLSCentralCatalog.products
    : [];

  window.raw = {
    map(mapper) {
      return getCentral().map(mapper);
    }
  };

  const publish = () => {
    const products = getCentral();
    if (!products.length) return;
    window.NextLevelSubs = {
      subs: products,
      getProductBySlug: slug => products.find(p => String(p.slug).toLowerCase() === String(slug).toLowerCase()) || null
    };
  };

  window.addEventListener("nls:central-catalog-ready", publish);
  window.addEventListener("nextlevel:products-updated", publish);
  publish();
})();
