"use strict";
/* NEXT LEVEL SUBS — Reviews integration fix.
 * Keeps the existing review UI/CRUD intact; fixes Details-page product resolution
 * and the legacy tab class mismatch without replacing the old Details design.
 */
(() => {
  if (!/\/details\.html$/i.test(location.pathname) && !/\/product\//i.test(location.pathname)) return;

  const slugify = v => String(v || "")
    .normalize("NFKD").toLowerCase().trim()
    .replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

  function resolveProduct() {
    const catalog = window.NLSCentralCatalog;
    const params = new URLSearchParams(location.search);
    const raw = params.get("slug") || params.get("name") || params.get("product") || "";
    if (!catalog?.products?.length) return false;

    let product = window.currentProduct;
    if (!product && raw) {
      product = catalog.getBySlug?.(raw)
        || catalog.getByName?.(raw)
        || catalog.products.find(p => p.slug === raw)
        || catalog.products.find(p => slugify(p.name) === slugify(raw));
    }
    if (product) {
      window.currentProduct = product;
      return true;
    }
    return false;
  }

  function markReviewTab(target) {
    const tab = target?.closest?.("button, a, [role=\"tab\"], .tab-button, .tab-btn, [data-tab], [data-tab-name]");
    if (!tab) return false;
    const text = String(tab.textContent || "").replace(/\s+/g, " ").trim();
    const isReview = /\breviews?\b/i.test(text) || /\breview/i.test(String(tab.dataset?.tab || "")) || /\breview/i.test(String(tab.dataset?.tabName || ""));
    if (!isReview) return false;

    document.querySelectorAll(".tab-button.active, .tab-btn.active").forEach(el => {
      if (el !== tab) el.classList.remove("active");
    });
    tab.classList.add("tab-button", "active");
    return true;
  }

  function boot() {
    resolveProduct();

    let tries = 0;
    const timer = setInterval(() => {
      if (resolveProduct() || ++tries >= 100) clearInterval(timer);
    }, 100);

    document.addEventListener("click", e => {
      const target = e.target?.closest?.("button, a, [role=\"tab\"], .tab-button, .tab-btn, [data-tab], [data-tab-name]");
      if (!target) return;
      if (!markReviewTab(target)) return;
      setTimeout(resolveProduct, 0);
      setTimeout(() => markReviewTab(target), 25);
      setTimeout(() => markReviewTab(target), 120);
    }, true);

    window.addEventListener("nls:central-catalog-ready", resolveProduct);
    window.addEventListener("nextlevel:products-updated", resolveProduct);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot, { once: true });
  } else {
    boot();
  }
})();
