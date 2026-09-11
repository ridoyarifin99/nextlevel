"use strict";

/* NEXT LEVEL SUBS — Admin Orders Central Catalog Bridge */
(function () {
    if (!/\/admin-orders\.html$/i.test(window.location.pathname)) return;
    if (window.__NLSAdminOrdersCentralRuntime) return;
    window.__NLSAdminOrdersCentralRuntime = true;

    const db = window.supabaseClient;
    if (!db) return;
    const clean = value => String(value ?? "").trim();
    const norm = value => clean(value).toLowerCase();
    const slug = value => norm(value).replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
    const money = value => Number(value || 0).toLocaleString("en-BD", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    const primaryImage = product => {
        const media = Array.isArray(product?.product_media) ? product.product_media : [];
        const primary = media.find(x => x?.is_active !== false && x?.role === "primary" && x?.url);
        const logo = media.find(x => x?.is_active !== false && x?.role === "logo" && x?.url);
        return clean(primary?.url) || clean(product?.image_url) || clean(logo?.url) || clean(product?.image) || "";
    };

    let catalog = [];
    let itemMap = new Map();
    let syncing = false;
    let timer = null;

    function buildMaps(products) {
        catalog = Array.isArray(products) ? products : [];
        return {
            byId: new Map(catalog.map(p => [clean(p.id), p]).filter(([id]) => id)),
            bySlug: new Map(catalog.map(p => [norm(p.slug), p]).filter(([v]) => v)),
            byName: new Map(catalog.map(p => [norm(p.name), p]).filter(([v]) => v))
        };
    }

    function matchProduct(item, maps) {
        const id = clean(item?.product_id || item?.productId);
        const itemSlug = norm(item?.product_slug || item?.slug);
        const name = norm(item?.product_name || item?.name);
        return maps.byId.get(id) || maps.bySlug.get(itemSlug) || maps.byName.get(name) || catalog.find(p => slug(p.name) === slug(name)) || null;
    }

    async function loadCatalog() {
        const response = await fetch("/api/products?_nls_admin_orders_live=" + Date.now(), { cache: "no-store" });
        if (!response.ok) throw new Error(`Catalog API ${response.status}`);
        const body = await response.json();
        return body?.products || [];
    }

    async function loadOrderItemIdentity() {
        const { data, error } = await db.from("order_items").select("id, product_id, product_name, product_slug, product_image, plan_duration").not("id", "is", null);
        if (error) throw error;
        itemMap = new Map((data || []).map(item => [clean(item.id), item]));
    }

    function currentPlan(product, item) {
        const plans = Array.isArray(product?.product_plans) ? product.product_plans.filter(x => x?.is_available !== false) : [];
        const duration = norm(item?.plan_duration);
        return plans.find(x => duration && (norm(x.duration) === duration || norm(x.name) === duration)) || plans[0] || null;
    }

    function patchProductElement(productEl, item, product) {
        if (!productEl || !product) return;
        const name = clean(product.name) || clean(item.product_name) || "Product";
        const image = primaryImage(product) || clean(item.product_image);
        const plan = currentPlan(product, item);

        const nameEl = productEl.querySelector(".product-name");
        if (nameEl && nameEl.textContent !== name) nameEl.textContent = name;

        const imageEl = productEl.querySelector(".product-img");
        if (imageEl && image) {
            const resolved = new URL(image, window.location.href).href;
            if (imageEl.src !== resolved) { imageEl.src = image; imageEl.removeAttribute("srcset"); }
        }

        let badge = productEl.querySelector("[data-nls-central-product]");
        if (!badge) {
            badge = document.createElement("span");
            badge.dataset.nlsCentralProduct = "true";
            badge.className = "tag";
            productEl.querySelector(".tags")?.appendChild(badge);
        }
        badge.textContent = "Central Catalog";

        if (plan) {
            let planBadge = productEl.querySelector("[data-nls-current-catalog-plan]");
            if (!planBadge) {
                planBadge = document.createElement("span");
                planBadge.dataset.nlsCurrentCatalogPlan = "true";
                planBadge.className = "tag";
                productEl.querySelector(".tags")?.appendChild(planBadge);
            }
            planBadge.textContent = `Live Plan: ${clean(plan.name || plan.duration || "Standard")}`;
            planBadge.title = "Live plan from Central Product Management";

            let priceBadge = productEl.querySelector("[data-nls-current-catalog-price]");
            if (!priceBadge) {
                priceBadge = document.createElement("span");
                priceBadge.dataset.nlsCurrentCatalogPrice = "true";
                priceBadge.className = "tag";
                productEl.querySelector(".tags")?.appendChild(priceBadge);
            }
            priceBadge.textContent = `Current: ৳${money(plan.price)}`;
            priceBadge.title = "Live price from Central Product Management";
        }
    }

    function itemIdFromProduct(productEl) {
        const button = Array.from(productEl.querySelectorAll("button[onclick*='openComponent']"))[0];
        if (!button) return "";
        const value = String(button.getAttribute("onclick") || "");
        const match = value.match(/openComponent\(\s*['\"][^'\"]*['\"]\s*,\s*['\"]([^'\"]+)['\"]/i);
        return clean(match?.[1]);
    }

    function apply() {
        if (!catalog.length) return;
        const maps = buildMaps(catalog);
        document.querySelectorAll("#ordersContainer .product").forEach(productEl => {
            const id = itemIdFromProduct(productEl);
            const item = itemMap.get(id);
            let product = item ? matchProduct(item, maps) : null;
            if (!product) {
                const visibleName = clean(productEl.querySelector(".product-name")?.textContent);
                product = maps.byName.get(norm(visibleName)) || catalog.find(p => slug(p.name) === slug(visibleName)) || null;
            }
            if (product) patchProductElement(productEl, item || { product_name: product.name }, product);
        });
    }

    async function sync() {
        if (syncing) return;
        syncing = true;
        try {
            const [products] = await Promise.all([loadCatalog(), loadOrderItemIdentity()]);
            buildMaps(products);
            apply();
        } catch (error) {
            console.warn("NEXT LEVEL SUBS: admin-orders central catalog sync skipped", error);
        } finally { syncing = false; }
    }

    function schedule() { clearTimeout(timer); timer = setTimeout(sync, 150); }

    function boot() {
        sync();
        const target = document.getElementById("ordersContainer") || document.body;
        let queued = false;
        new MutationObserver(() => {
            if (queued) return;
            queued = true;
            requestAnimationFrame(() => { queued = false; schedule(); });
        }).observe(target, { childList: true, subtree: true });
        window.addEventListener("nextlevel:products-updated", schedule);
        window.addEventListener("nls:central-catalog-ready", schedule);
        window.addEventListener("nextlevel:central-live-updated", schedule);
        /* Low-frequency safety net only; catalog events are the primary path. */
        setInterval(sync, 10000);
    }
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot, { once: true }); else boot();
})();
