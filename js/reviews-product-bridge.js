"use strict";

/* Expose the current details.js product to the existing-UI review adapter. */
(() => {
  if (!/\/details\.html$/i.test(window.location.pathname)) return;
  const slugify = v => String(v || "").normalize("NFKD").toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  const sync = () => {
    try {
      const name = new URLSearchParams(location.search).get("name") || "";
      const list = Array.isArray(window.products) ? window.products : [];
      const p = list.find(x => String(x.name || "").toLowerCase() === String(name).toLowerCase()) || list.find(x => slugify(x.name) === slugify(name));
      if (p) window.currentProduct = p;
    } catch (_) {}
  };
  let tries = 0;
  const timer = setInterval(() => { sync(); if (++tries > 100 || window.currentProduct) clearInterval(timer); }, 50);
  window.addEventListener("popstate", () => setTimeout(sync, 50));
})();
