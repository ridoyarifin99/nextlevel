"use strict";
/* NEXT LEVEL SUBS — single authoritative storefront projection. */
(function () {
  if (window.__NLSIndexCentralAuthoritative) return;
  window.__NLSIndexCentralAuthoritative = true;

  const norm = v => String(v ?? "").trim().toLowerCase();
  const esc = v => String(v ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\"/g, "&quot;").replace(/'/g, "&#039;");
  const CATEGORIES = {
    "best-selling": "bestSellingContainer",
    "popular-streaming": "popularStreamingContainer",
    "music-streaming": "musicStreamingContainer",
    "cloud-storage": "cloudStorageContainer",
    "vpn": "vpnContainer",
    "aiDesign": "aiDesignContainer",
    "combo": "comboContainer",
    "education": "educationContainer",
    "adult": "adultContainer"
  };

  /* Never expose legacy/placeholder cards while the central catalog is loading. */
  Object.values(CATEGORIES).forEach(id => {
    const el = document.getElementById(id);
    if (el) el.setAttribute("data-nls-central-pending", "1");
  });

  function categoriesOf(p) {
    const out = [];
    if (Array.isArray(p?.categories)) out.push(...p.categories);
    if (Array.isArray(p?.extra_data?.categories)) out.push(...p.extra_data.categories);
    if (p?.product_categories?.slug) out.push(p.product_categories.slug);
    if (Array.isArray(p?.product_categories)) out.push(...p.product_categories.map(x => x?.slug || x?.name));
    return [...new Set(out.map(norm).filter(Boolean))];
  }

  function plansOf(p) {
    return Array.isArray(p?.product_plans) ? p.product_plans.filter(x => x && x.is_available !== false) : [];
  }

  /* Match the central API schema: availability is controlled by is_available.
     A product is allowed to render even if it currently has no plan; buying then
     remains unavailable until Product Central supplies an available plan. */
  function validProduct(p) {
    return !!p && p.is_available !== false && p.is_archived !== true &&
      !!String(p.slug ?? "").trim() && !!String(p.name ?? "").trim();
  }

  function planOf(p) { return plansOf(p)[0] || null; }
  function priceOf(p) { const x = planOf(p); return Number(x?.price ?? p?.price ?? 0); }
  function durationOf(p) { return String(planOf(p)?.duration ?? p?.duration ?? "month"); }
  function imageOf(p) { return p?.logo || p?.product_logo || p?.image || p?.image_url || ""; }
  function signature(p) { return JSON.stringify({ id:p.id, slug:p.slug, name:p.name, image:imageOf(p), description:p.description, price:priceOf(p), duration:durationOf(p), categories:categoriesOf(p) }); }

  function makeCard(p) {
    const card = document.createElement("div");
    card.className = "subscription-card";
    card.dataset.productId = p.id || "";
    card.dataset.productSlug = p.slug || "";
    card.dataset.centralAuthoritative = "1";
    card.dataset.centralSignature = signature(p);
    const image = imageOf(p), name = p.name, description = p.description || "";
    const price = priceOf(p), duration = durationOf(p), cats = categoriesOf(p);
    const best = cats.includes("best-selling") || !!p.is_featured;
    const combo = cats.includes("combo");
    const media = image
      ? `<img src="${esc(image)}" alt="${esc(name)} logo" class="product-image" loading="lazy" decoding="async">`
      : `<i class="${esc(p.icon || "fas fa-play-circle")} product-icon" aria-hidden="true"></i>`;
    card.innerHTML = `${best ? '<span class="best-seller-badge">BEST SELLER</span>' : ''}${combo ? '<span class="combo-badge">COMBO</span>' : ''}<a href="/product/${encodeURIComponent(p.slug)}" class="card-link" aria-label="View ${esc(name)}"><div class="product-image-container">${media}</div><div class="p-3 sm:p-4"><h3 class="font-bold text-base sm:text-lg leading-tight mb-1">${esc(name)}</h3><p class="text-xs text-gray-500 mb-3 line-clamp-2" style="display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;">${esc(description)}</p><div class="flex justify-between items-center mb-3"><div><span class="text-lg sm:text-xl font-bold" data-product-price="1">৳${price.toLocaleString("en-BD")}</span><span class="text-xs text-gray-500">/${esc(duration)}</span></div></div><div class="flex flex-col gap-2"><button type="button" class="w-full py-1.5 sm:py-2 rounded-lg font-medium text-white text-sm btn-primary" data-central-add-cart="1">Add to Cart</button><span class="nls-btn-details text-sm">See Details <i class="fa-solid fa-arrow-right-long"></i></span></div></div></a>`;
    card.querySelector("[data-central-add-cart]")?.addEventListener("click", e => {
      e.preventDefault(); e.stopPropagation(); window.NLSCentralAddToCart?.(p.slug);
    });
    return card;
  }

  function decorate(card, p) {
    card.dataset.productId = p.id || "";
    card.dataset.productSlug = p.slug || "";
    card.dataset.centralSignature = signature(p);
    const img = card.querySelector("img"), image = imageOf(p);
    if (img && image) { img.src = image; img.removeAttribute("srcset"); img.alt = `${p.name} logo`; }
    const title = card.querySelector("[data-product-name],.product-name,.subscription-name,.product-title,.subscription-title,h3,h4");
    if (title) title.textContent = p.name;
    const desc = card.querySelector("p"); if (desc) desc.textContent = p.description || "";
    const price = card.querySelector("[data-product-price],.product-price,.subscription-price");
    if (price && !price.dataset.nlsManualPrice) price.textContent = `৳${priceOf(p).toLocaleString("en-BD")}`;
    const link = card.querySelector("a.card-link"); if (link) link.href = `/product/${encodeURIComponent(p.slug)}`;
    const duration = [...card.querySelectorAll("span")].find(x => /^\//.test(x.textContent.trim()));
    if (duration) duration.textContent = `/${durationOf(p)}`;
  }

  function renderCatalog() {
    const catalog = window.NLSCentralCatalog?.products;
    if (!Array.isArray(catalog)) return false;
    const products = catalog.filter(validProduct);
    Object.entries(CATEGORIES).forEach(([category, id]) => {
      const container = document.getElementById(id); if (!container) return;
      const list = products.filter(p => categoriesOf(p).includes(category) || (category === "best-selling" && p.is_featured));
      const existing = [...container.querySelectorAll(":scope > .subscription-card")];
      const managed = existing.filter(x => x.dataset.centralAuthoritative === "1");
      const reusable = new Map();
      managed.forEach(card => { reusable.set(String(card.dataset.productId || ""), card); reusable.set(norm(card.dataset.productSlug || ""), card); });
      const fragment = document.createDocumentFragment();
      list.forEach((p, index) => {
        let card = reusable.get(String(p.id || "")) || reusable.get(norm(p.slug));
        if (!card) card = makeCard(p); else decorate(card, p);
        card.dataset.centralAuthoritative = "1"; card.style.order = String(index); fragment.appendChild(card);
      });
      container.replaceChildren(fragment);
      if (!list.length) {
        const empty = document.createElement("p");
        empty.className = "text-gray-500 text-center col-span-full text-sm py-4";
        empty.textContent = "No subscriptions available in this category";
        container.appendChild(empty);
      }
      container.removeAttribute("data-nls-central-pending");
      container.dataset.nlsCentralCount = String(list.length);
      if (window.AOS?.refreshHard) window.AOS.refreshHard();
      else if (window.AOS?.refresh) window.AOS.refresh();
    });
    return true;
  }

  function syncCart() {
    try {
      const catalog = (window.NLSCentralCatalog?.products || []).filter(validProduct);
      const bySlug = new Map(catalog.map(p => [norm(p.slug), p]));
      const raw = JSON.parse(localStorage.getItem("streamHubCart") || "[]"); if (!Array.isArray(raw)) return;
      const next = raw.map(item => {
        const p = bySlug.get(norm(item.slug || item.product_slug)); if (!p) return null;
        const plan = plansOf(p).find(x => String(x.id) === String(item.selectedPlan?.id)) || plansOf(p).find(x => norm(x.duration) === norm(item.duration)) || planOf(p);
        if (!plan) return null;
        return { ...item, name:p.name, slug:p.slug, product_slug:p.slug, image:imageOf(p), logo:p.logo || p.product_logo || imageOf(p), product_logo:p.logo || p.product_logo || imageOf(p), price:Number(plan.price ?? p.price ?? 0), duration:plan.duration || item.duration, selectedPlan:{...plan, price:Number(plan.price || 0)} };
      }).filter(Boolean);
      localStorage.setItem("streamHubCart", JSON.stringify(next));
      window.dispatchEvent(new CustomEvent("nextlevel:checkout-cart-updated", { detail:{ cart:next } }));
      if (typeof window.updateCartUI === "function") window.updateCartUI();
    } catch {}
  }

  function addToCart(slug) {
    const p = window.NLSCentralCatalog?.getBySlug?.(slug) || window.NLSCentralCatalog?.products?.find(x => norm(x.slug) === norm(slug));
    if (!validProduct(p)) return;
    let cart = []; try { cart = JSON.parse(localStorage.getItem("streamHubCart") || "[]"); if (!Array.isArray(cart)) cart = []; } catch {}
    const plan = planOf(p); if (!plan) return;
    const found = cart.find(i => norm(i.slug || i.product_slug) === norm(p.slug));
    if (found) found.quantity = Number(found.quantity || 0) + 1;
    else cart.push({ name:p.name, slug:p.slug, product_slug:p.slug, image:imageOf(p), logo:p.logo || p.product_logo || imageOf(p), product_logo:p.logo || p.product_logo || imageOf(p), price:Number(plan.price ?? p.price ?? 0), duration:plan.duration || "month", selectedPlan:{...plan,price:Number(plan.price || 0)}, quantity:1 });
    localStorage.setItem("streamHubCart", JSON.stringify(cart));
    window.dispatchEvent(new CustomEvent("nextlevel:checkout-cart-updated", { detail:{ cart } }));
    if (typeof window.updateCartUI === "function") window.updateCartUI();
  }

  window.NLSCentralAddToCart = addToCart; window.addToCart = addToCart;
  let applying = false;
  function apply() { if (applying || !Array.isArray(window.NLSCentralCatalog?.products)) return; applying = true; try { renderCatalog(); syncCart(); } finally { applying = false; } }
  function boot() {
    window.addEventListener("nls:central-catalog-ready", apply);
    window.addEventListener("nextlevel:products-updated", apply);
    apply(); setInterval(apply, 15000);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot, { once:true }); else boot();
})();
