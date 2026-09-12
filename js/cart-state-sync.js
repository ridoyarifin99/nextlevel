"use strict";
/* NEXT LEVEL SUBS — single client-side cart-count synchronizer.
 * The cart is intentionally persisted in localStorage so normal page navigation
 * (including the mobile bottom-nav Home link) never resets the visible count.
 */
(() => {
  if (window.__NLSCartStateSync) return;
  window.__NLSCartStateSync = true;

  const CART_KEY = "streamHubCart";
  let lastSignature = "";
  let raf = 0;

  function readCart() {
    try {
      const raw = localStorage.getItem(CART_KEY);
      const value = JSON.parse(raw || "[]");
      return Array.isArray(value) ? value : [];
    } catch (_) {
      return [];
    }
  }

  function getCount(cart) {
    return cart.reduce((total, item) => {
      const quantity = Number(item?.quantity);
      return total + (Number.isFinite(quantity) && quantity > 0 ? Math.max(1, Math.floor(quantity)) : 1);
    }, 0);
  }

  function render(force = false) {
    const cart = readCart();
    const count = getCount(cart);
    const signature = `${count}:${cart.length}`;
    if (!force && signature === lastSignature) return;
    lastSignature = signature;

    document.querySelectorAll("#cartCount, [data-cart-count], .cart-count-badge").forEach(el => {
      el.textContent = String(count);
      el.setAttribute("aria-label", `Cart: ${count} item${count === 1 ? "" : "s"}`);
      el.classList.toggle("hidden", false);
    });

    document.querySelectorAll(".cart-badge").forEach(el => {
      el.textContent = String(count);
      el.setAttribute("aria-hidden", count ? "false" : "true");
    });

    window.NLSCartState = { items: cart, count };
    window.dispatchEvent(new CustomEvent("nextlevel:cart-state-updated", { detail: { cart, count } }));
  }

  function scheduleRender(force = false) {
    if (raf) return;
    raf = requestAnimationFrame(() => {
      raf = 0;
      render(force);
    });
  }

  function init() {
    render(true);

    window.addEventListener("storage", event => {
      if (!event.key || event.key === CART_KEY) scheduleRender(true);
    });
    window.addEventListener("pageshow", () => scheduleRender(true));
    window.addEventListener("focus", () => scheduleRender(true));
    window.addEventListener("nextlevel:checkout-cart-updated", () => scheduleRender(true));
    window.addEventListener("nextlevel:cart-updated", () => scheduleRender(true));
    window.addEventListener("nextlevel:products-updated", () => scheduleRender(true));

    const originalSetItem = Storage.prototype.setItem;
    const originalRemoveItem = Storage.prototype.removeItem;
    if (!Storage.prototype.__nlsCartPatched) {
      Storage.prototype.__nlsCartPatched = true;
      Storage.prototype.setItem = function(key, value) {
        const result = originalSetItem.apply(this, arguments);
        if (key === CART_KEY) scheduleRender(true);
        return result;
      };
      Storage.prototype.removeItem = function(key) {
        const result = originalRemoveItem.apply(this, arguments);
        if (key === CART_KEY) scheduleRender(true);
        return result;
      };
    }

    setInterval(() => scheduleRender(false), 3000);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, { once: true });
  else init();
})();
