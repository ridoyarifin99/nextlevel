"use strict";
/* NEXT LEVEL SUBS — consistent Buy Now icon on the product details page. */
(() => {
  if (window.__NLSDetailsBuyNowIcon) return;
  window.__NLSDetailsBuyNowIcon = true;

  const addIcon = () => {
    document.querySelectorAll("button, a").forEach((el) => {
      if (el.dataset.nlsBuyNowIcon === "1") return;
      const text = String(el.textContent || "").replace(/\s+/g, " ").trim();
      if (text !== "Buy Now") return;

      const icon = document.createElement("i");
      icon.className = "fa-solid fa-cart-shopping";
      icon.setAttribute("aria-hidden", "true");
      icon.style.marginRight = "0.5rem";
      el.insertBefore(icon, el.firstChild);
      el.dataset.nlsBuyNowIcon = "1";
    });
  };

  const boot = () => {
    addIcon();
    new MutationObserver(() => requestAnimationFrame(addIcon))
      .observe(document.body, { childList: true, subtree: true });
    window.addEventListener("nextlevel:products-updated", addIcon);
    window.addEventListener("nls:central-catalog-ready", addIcon);
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot, { once: true });
  } else {
    boot();
  }
})();
