"use strict";
(() => {
  if (window.__NLSPromoCheckoutLoaded) return;
  window.__NLSPromoCheckoutLoaded = true;

  const db = window.supabaseClient;
  if (!db) return;

  const CART_KEY = "streamHubCart";
  const PROMO_KEY = "nls:applied-promo";
  let applied = null;
  let busy = false;
  let lastCartSignature = "";

  const cart = () => {
    try {
      const value = JSON.parse(localStorage.getItem(CART_KEY) || "[]");
      return Array.isArray(value) ? value : [];
    } catch {
      return [];
    }
  };

  const itemPrice = item => Number(item?.selectedPlan?.price ?? item?.price ?? 0);
  const qty = item => Math.max(1, Number(item?.quantity || 1));
  const subtotal = () => cart().reduce((sum, item) => sum + itemPrice(item) * qty(item), 0);
  const tax = () => cart().reduce((sum, item) => sum + itemPrice(item) * qty(item) * 0.0185, 0);
  const money = value => Number(value || 0).toLocaleString("en-BD", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const cartSignature = () => JSON.stringify(cart().map(item => [
    item.product_id || item.productId || item.slug || item.product_slug || item.name,
    item.selectedPlan?.id || item.plan_id || item.planId || item.selectedPlan?.name || item.duration,
    itemPrice(item),
    qty(item)
  ]));

  function ids() {
    return {
      input: document.getElementById("promoCode") || document.getElementById("nlsPromoInput"),
      button: document.getElementById("applyPromo") || document.getElementById("nlsPromoApply"),
      message: document.getElementById("nlsPromoMessage")
    };
  }

  function message(text, ok) {
    const element = ids().message;
    if (element) {
      element.textContent = text;
      element.style.color = ok ? "#166534" : "#b91c1c";
    }
  }

  function render() {
    const discount = Number(applied?.discount_amount || 0);
    const discountElement = document.getElementById("discount");
    const totalElement = document.getElementById("total");
    if (discountElement) discountElement.textContent = `-৳${money(discount)}`;
    if (totalElement) totalElement.textContent = `৳${money(Math.max(0, subtotal() + tax() - discount))}`;
  }

  function save() {
    if (applied?.code) localStorage.setItem(PROMO_KEY, JSON.stringify({ code: applied.code }));
    else localStorage.removeItem(PROMO_KEY);
  }

  function clear(text) {
    applied = null;
    save();
    render();
    if (text) message(text, false);
    document.dispatchEvent(new CustomEvent("nextlevel:promo-cleared"));
  }

  function singleProductId() {
    const items = cart();
    if (items.length !== 1) return null;
    return items[0].product_id || items[0].productId || null;
  }

  function singlePlanId() {
    const items = cart();
    if (items.length !== 1) return null;
    return items[0].selectedPlan?.id || items[0].plan_id || items[0].planId || null;
  }

  async function validate(code) {
    const total = subtotal();
    if (total <= 0) throw new Error("Add a product before applying a promo.");
    const { data, error } = await db.rpc("validate_promo_code", {
      p_code: code,
      p_subtotal: total,
      p_product_id: singleProductId(),
      p_plan_id: singlePlanId()
    });
    if (error) throw error;
    if (!data?.valid) throw new Error(data?.message || "Invalid or expired promo code.");
    return data;
  }

  async function apply() {
    if (busy) return;
    const input = ids().input;
    const code = input?.value.trim().toUpperCase();
    if (!code) return message("Enter a promo code.", false);

    busy = true;
    try {
      applied = await validate(code);
      lastCartSignature = cartSignature();
      save();
      render();
      message(`${applied.message} You save ৳${money(applied.discount_amount)}.`, true);
      document.dispatchEvent(new CustomEvent("nextlevel:promo-applied", { detail: applied }));
    } catch (error) {
      clear(error?.message || "Unable to validate promo code.");
    } finally {
      busy = false;
    }
  }

  function wire() {
    const { button, input } = ids();
    if (!button || button.dataset.nlsCentralPromo) return;
    if (input) input.addEventListener("input", () => { if (applied) clear(); });
    button.dataset.nlsCentralPromo = "1";
    button.addEventListener("click", event => {
      event.preventDefault();
      event.stopImmediatePropagation();
      apply();
    }, true);
  }

  function restore() {
    try {
      const saved = JSON.parse(localStorage.getItem(PROMO_KEY) || "null");
      if (!saved?.code) return;
      const input = ids().input;
      if (input) input.value = saved.code;
      setTimeout(() => apply(), 50);
    } catch {}
  }

  function patchCatalogOrderItems() {
    if (db.__nlsCatalogOrderItemsPatched) return;
    db.__nlsCatalogOrderItemsPatched = true;
    const originalFrom = db.from.bind(db);
    db.from = function(table) {
      const builder = originalFrom(table);
      if (table !== "order_items" || builder.__nlsCatalogOrderItemsBuilder) return builder;
      builder.__nlsCatalogOrderItemsBuilder = true;
      const originalInsert = builder.insert.bind(builder);
      builder.insert = function(values, ...args) {
        const items = cart();
        const rows = Array.isArray(values) ? values : [values];
        const patched = rows.map((row, index) => {
          const source = items[index] || items.find(item => String(item?.name || "") === String(row?.product_name || ""));
          if (!source) return row;
          return {
            ...row,
            product_slug: row?.product_slug || source.product_slug || source.slug || null,
            plan_duration: row?.plan_duration || source.selectedPlan?.duration || source.duration || source.selectedPlan?.name || null
          };
        });
        return originalInsert(Array.isArray(values) ? patched : patched[0], ...args);
      };
      return builder;
    };
  }

  function patchCatalogOrderInsert() {
    if (db.__nlsCatalogOrderPatched) return;
    db.__nlsCatalogOrderPatched = true;
    const originalFrom = db.from.bind(db);
    db.from = function(table) {
      const builder = originalFrom(table);
      if (table !== "orders" || builder.__nlsCatalogOrderBuilder) return builder;
      builder.__nlsCatalogOrderBuilder = true;
      const originalInsert = builder.insert.bind(builder);
      builder.insert = function(values, ...args) {
        const code = applied?.code || (() => {
          try { return JSON.parse(localStorage.getItem(PROMO_KEY) || "null")?.code || null; } catch { return null; }
        })();
        if (!code) return originalInsert(values, ...args);
        const addCode = value => ({ ...value, promo_code: value?.promo_code || code });
        return originalInsert(Array.isArray(values) ? values.map(addCode) : addCode(values), ...args);
      };
      return builder;
    };
  }

  function watchCart() {
    setInterval(async () => {
      const signature = cartSignature();
      if (signature === lastCartSignature) return;
      lastCartSignature = signature;
      if (!applied) return;
      try {
        applied = await validate(applied.code);
        save();
        render();
      } catch (error) {
        clear(error?.message || "Promo code is no longer valid for this cart.");
      }
    }, 750);
  }

  function boot() {
    patchCatalogOrderInsert();
    patchCatalogOrderItems();
    wire();
    restore();
    watchCart();
    setTimeout(wire, 500);
    setTimeout(wire, 1500);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot, { once: true });
  else boot();
})();
