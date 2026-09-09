"use strict";

/*
 * NEXT LEVEL SUBS — Product Display Sync
 *
 * Keeps the existing order/component system intact, but makes the
 * component's custom name, price and logo the visible product values
 * in admin-orders.html and dashboard.html.
 */
(function () {
    const path = String(window.location.pathname || "").toLowerCase();
    const isAdminOrders = /\/admin-orders\.html$/.test(path);
    const isDashboard = /\/dashboard\.html$/.test(path);
    if (!isAdminOrders && !isDashboard) return;

    const waitForDom = (fn) => {
        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", fn, { once: true });
        } else {
            fn();
        }
    };

    const safeNumber = (value, fallback = 0) => {
        const n = Number(value);
        return Number.isFinite(n) ? n : fallback;
    };

    const money = (value) => safeNumber(value).toLocaleString("en-BD", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });

    const clean = (value) => String(value ?? "").trim();

    const firstText = (...values) => {
        for (const value of values) {
            const text = clean(value);
            if (text) return text;
        }
        return "";
    };

    async function getCurrentUser() {
        try {
            const result = await window.supabaseClient?.auth?.getUser();
            return result?.data?.user || null;
        } catch (error) {
            console.warn("Product display sync: unable to get current user", error);
            return null;
        }
    }

    async function loadDashboardData(user) {
        if (!user || !window.supabaseClient) return [];

        const { data, error } = await window.supabaseClient
            .from("orders")
            .select(`
                id, created_at,
                order_items (
                    id, product_name, product_slug, product_image, plan_duration, price, quantity,
                    order_item_components (
                        id, order_item_id, component_name, component_slug, component_image,
                        custom_name, service_name, plan_duration, quantity, slot_number,
                        component_price, delivery_status, subscription_email,
                        subscription_password, delivery_note, subscription_start,
                        subscription_expiry, created_at, updated_at
                    )
                )
            `)
            .eq("user_id", user.id)
            .order("created_at", { ascending: false });

        if (error) throw error;
        return Array.isArray(data) ? data : [];
    }

    function dashboardSubscriptions(orders) {
        const subs = [];

        orders.forEach(order => {
            (Array.isArray(order.order_items) ? order.order_items : []).forEach(item => {
                const fallbackName = firstText(item.product_name, item.name, "Subscription");
                const components = Array.isArray(item.order_item_components)
                    ? item.order_item_components
                    : [];

                components.forEach((component) => {
                    subs.push({
                        component,
                        item,
                        product_name: firstText(
                            component.component_name,
                            component.custom_name,
                            component.service_name,
                            fallbackName
                        ),
                        product_image: firstText(
                            component.component_image,
                            item.product_image
                        ),
                        price: component.component_price !== null && component.component_price !== undefined
                            ? safeNumber(component.component_price)
                            : safeNumber(item.price)
                    });
                });
            });
        });

        return subs;
    }

    function applyDashboardCards(subscriptions) {
        const cards = Array.from(document.querySelectorAll(".subscription-card"));
        if (!cards.length) return;

        cards.forEach(card => {
            const index = safeNumber(card.dataset.subscriptionIndex, -1);
            if (index < 0 || !subscriptions[index]) return;

            const sub = subscriptions[index];
            const name = firstText(sub.product_name);
            const image = firstText(sub.product_image);
            const price = safeNumber(sub.price);

            const title = card.querySelector("h3, .subscription-title, .product-name");
            if (title && name && title.textContent !== name) title.textContent = name;

            if (image) {
                const img = card.querySelector("img");
                if (img && img.src !== new URL(image, window.location.href).href) {
                    img.src = image;
                    img.removeAttribute("srcset");
                }
            }

            const priceText = `৳${money(price)}`;
            let priceEl = card.querySelector("[data-custom-subscription-price]");
            if (!priceEl) {
                priceEl = document.createElement("div");
                priceEl.dataset.customSubscriptionPrice = "true";
                priceEl.style.cssText = "margin-top:8px;font-size:1rem;font-weight:800;color:#6a11cb;";

                const anchor = card.querySelector("h3, .subscription-title, .product-name") || card.firstElementChild;
                if (anchor?.parentElement) {
                    anchor.parentElement.appendChild(priceEl);
                } else {
                    card.appendChild(priceEl);
                }
            }

            if (priceEl.textContent !== priceText) priceEl.textContent = priceText;
        });
    }

    async function syncDashboard() {
        try {
            const user = await getCurrentUser();
            if (!user) return;
            const orders = await loadDashboardData(user);
            applyDashboardCards(dashboardSubscriptions(orders));
        } catch (error) {
            console.warn("Product display sync: dashboard update skipped", error);
        }
    }

    async function loadAdminData() {
        if (!window.supabaseClient) return [];

        const { data: orders, error: orderError } = await window.supabaseClient
            .from("orders")
            .select("id, order_number, created_at")
            .order("created_at", { ascending: false });
        if (orderError) throw orderError;

        const orderIds = (orders || []).map(order => order.id).filter(Boolean);
        if (!orderIds.length) return [];

        const { data: items, error: itemError } = await window.supabaseClient
            .from("order_items")
            .select("id, order_id, product_name, product_slug, product_image, plan_duration, price, quantity")
            .in("order_id", orderIds);
        if (itemError) throw itemError;

        const itemIds = (items || []).map(item => item.id).filter(Boolean);
        let components = [];
        if (itemIds.length) {
            const result = await window.supabaseClient
                .from("order_item_components")
                .select("id, order_item_id, component_name, component_slug, component_image, custom_name, service_name, plan_duration, quantity, slot_number, component_price")
                .in("order_item_id", itemIds)
                .order("slot_number", { ascending: true });
            if (result.error) throw result.error;
            components = result.data || [];
        }

        const componentMap = Object.create(null);
        components.forEach(component => {
            (componentMap[component.order_item_id] ||= []).push(component);
        });

        const itemMap = Object.create(null);
        (items || []).forEach(item => {
            itemMap[item.order_id] ||= [];
            itemMap[item.order_id].push({
                ...item,
                order_item_components: componentMap[item.id] || []
            });
        });

        return (orders || []).map(order => ({
            ...order,
            order_items: itemMap[order.id] || []
        }));
    }

    function orderNumberFromCard(card) {
        const value = clean(card.querySelector(".order-no")?.textContent);
        return value.replace(/^#/, "").trim();
    }

    function applyAdminProducts(orders) {
        const cards = Array.from(document.querySelectorAll("#ordersContainer > .card"));
        if (!cards.length) return;

        const byOrderNumber = new Map();
        orders.forEach(order => {
            if (order.order_number != null) {
                byOrderNumber.set(clean(order.order_number), order);
            }
            if (order.id != null) {
                byOrderNumber.set(clean(order.id), order);
            }
        });

        cards.forEach(card => {
            const order = byOrderNumber.get(orderNumberFromCard(card));
            if (!order) return;

            const productEls = Array.from(card.querySelectorAll(":scope > .order-body .section .product"));
            const items = Array.isArray(order.order_items) ? order.order_items : [];

            items.forEach((item, index) => {
                const productEl = productEls[index];
                if (!productEl) return;

                const components = Array.isArray(item.order_item_components)
                    ? item.order_item_components
                    : [];
                const primary = components[0] || {};

                const name = firstText(
                    primary.component_name,
                    primary.custom_name,
                    primary.service_name,
                    item.product_name
                );
                const image = firstText(
                    primary.component_image,
                    item.product_image
                );
                const unitPrice = primary.component_price !== null && primary.component_price !== undefined
                    ? safeNumber(primary.component_price)
                    : safeNumber(item.price);
                const quantity = primary.component_price !== null && primary.component_price !== undefined
                    ? safeNumber(primary.quantity, safeNumber(item.quantity, 1))
                    : safeNumber(item.quantity, 1);
                const plan = firstText(primary.plan_duration, item.plan_duration, "Standard");

                const nameEl = productEl.querySelector(".product-name");
                if (nameEl && name && nameEl.textContent !== name) nameEl.textContent = name;

                const imageEl = productEl.querySelector(".product-img");
                if (imageEl && image) {
                    const resolvedImage = new URL(image, window.location.href).href;
                    if (imageEl.src !== resolvedImage) {
                        imageEl.src = image;
                        imageEl.removeAttribute("srcset");
                    }
                }

                const tags = productEl.querySelectorAll(".tag");
                const planText = `Plan: ${plan}`;
                const qtyText = `Qty: ${quantity}`;
                const unitText = `Unit: ৳${money(unitPrice)}`;
                if (tags[0] && tags[0].textContent !== planText) tags[0].textContent = planText;
                if (tags[1] && tags[1].textContent !== qtyText) tags[1].textContent = qtyText;
                if (tags[2] && tags[2].textContent !== unitText) tags[2].textContent = unitText;

                const totalText = `৳${money(unitPrice * quantity)}`;
                const totalEl = productEl.querySelector(".product-price");
                if (totalEl && totalEl.textContent !== totalText) totalEl.textContent = totalText;
            });
        });
    }

    let adminSyncTimer = null;
    let adminSyncInFlight = false;

    async function syncAdmin() {
        if (adminSyncInFlight) return;
        adminSyncInFlight = true;
        try {
            const orders = await loadAdminData();
            applyAdminProducts(orders);
        } catch (error) {
            console.warn("Product display sync: admin update skipped", error);
        } finally {
            adminSyncInFlight = false;
        }
    }

    function scheduleAdminSync() {
        clearTimeout(adminSyncTimer);
        adminSyncTimer = setTimeout(syncAdmin, 350);
    }

    waitForDom(() => {
        if (isDashboard) {
            syncDashboard();
            const observer = new MutationObserver(() => {
                clearTimeout(window.__nlsProductSyncTimer);
                window.__nlsProductSyncTimer = setTimeout(syncDashboard, 250);
            });
            const target = document.getElementById("subscriptionsContainer") || document.body;
            observer.observe(target, { childList: true, subtree: true });
        }

        if (isAdminOrders) {
            scheduleAdminSync();
            const observer = new MutationObserver(scheduleAdminSync);
            const target = document.getElementById("ordersContainer") || document.body;
            observer.observe(target, { childList: true, subtree: true });
        }
    });
})();
