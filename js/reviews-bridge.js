"use strict";

/* details.js keeps its product catalog in a global lexical binding.
 * Expose it on window after the DOM is ready so the separately loaded
 * review module can resolve the current product reliably. */
if (/\/details\.html$/i.test(window.location.pathname)) {
  document.addEventListener("DOMContentLoaded", () => {
    try {
      if (typeof products !== "undefined" && Array.isArray(products)) {
        window.products = products;
      }
    } catch (_) {}
  }, { once: true });
}
