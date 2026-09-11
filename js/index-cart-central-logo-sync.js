"use strict";
/* NEXT LEVEL SUBS — index cart always renders the authoritative central product logo. */
(() => {
  if (window.__NLSIndexCartCentralLogoSync) return;
  window.__NLSIndexCartCentralLogoSync = true;

  const norm = v => String(v || "").trim().toLowerCase();
  const getCatalog = () => window.NLSCentralCatalog?.products || [];

  const findProduct = (item) => {
    const catalog = getCatalog();
    if (!catalog.length) return null;
    const slug = norm(item?.slug || item?.product_slug);
    const name = norm(item?.name);
    return catalog.find(p => slug && norm(p.slug) === slug)
      || catalog.find(p => name && norm(p.name) === name)
      || null;
  };

  const sync = () => {
    const catalog = getCatalog();
    if (!catalog.length) return;

    document.querySelectorAll(".cart-item").forEach(row => {
      const nameEl = row.querySelector(".cart-item-name");
      const img = row.querySelector(".cart-item-img");
      if (!nameEl || !img || img.tagName !== "IMG") return;

      const name = norm(nameEl.textContent);
      const p = catalog.find(x => norm(x.name) === name);
      const logo = p?.logo || p?.product_logo || "";
      if (!logo) return;

      if (img.getAttribute("src") !== logo) img.src = logo;
      img.removeAttribute("srcset");
      img.alt = `${p.name || nameEl.textContent} logo`;
    });
  };

  const boot = () => {
    sync();
    window.addEventListener("nls:central-catalog-ready", sync);
    window.addEventListener("nextlevel:products-updated", sync);
    window.addEventListener("nextlevel:checkout-cart-updated", sync);

    new MutationObserver(() => requestAnimationFrame(sync))
      .observe(document.body, { childList: true, subtree: true });

    setInterval(sync, 1000);
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot, { once: true });
  } else {
    boot();
  }
})();
