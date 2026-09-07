"use strict";

/* Expose the current details.js product to the existing-UI review adapter. */
(() => {
  const path = window.location.pathname;
  if (!/\/details\.html$/i.test(path) && !/\/product\//i.test(path)) return;

  const slugify = v => String(v || "").normalize("NFKD").toLowerCase().trim()
    .replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

  const routeProduct = () => {
    const match = location.pathname.match(/\/product\/([^/?#]+)/i);
    if (match) return decodeURIComponent(match[1]);
    const params = new URLSearchParams(location.search);
    return params.get("name") || params.get("slug") || params.get("product") || "";
  };

  const sync = () => {
    try {
      const name = routeProduct();
      const list = Array.isArray(window.products) ? window.products : [];
      const p = list.find(x => String(x.name || "").toLowerCase() === String(name).toLowerCase())
        || list.find(x => slugify(x.name) === slugify(name))
        || list.find(x => slugify(x.slug) === slugify(name));
      if (p) window.currentProduct = p;
    } catch (_) {}
  };

  let tries = 0;
  const timer = setInterval(() => {
    sync();
    if (++tries > 100 || window.currentProduct) clearInterval(timer);
  }, 50);
  window.addEventListener("popstate", () => setTimeout(sync, 50));
})();