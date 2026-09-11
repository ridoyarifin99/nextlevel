"use strict";
/* NEXT LEVEL SUBS — index cart always renders the authoritative central product logo. */
(() => {
  if (window.__NLSIndexCartCentralLogoSync) return;
  window.__NLSIndexCartCentralLogoSync = true;

  const norm = v => String(v || "").trim().toLowerCase();
  const getCatalog = () => window.NLSCentralCatalog?.products || [];

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

    let queued = false;
    new MutationObserver(() => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(() => { queued = false; sync(); });
    }).observe(document.body, { childList: true, subtree: true });

    /* Safety net only; event-driven sync is the primary path. */
    setInterval(sync, 5000);
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot, { once: true });
  } else {
    boot();
  }
})();
