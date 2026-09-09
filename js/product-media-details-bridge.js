"use strict";
(() => {
  const $ = id => document.getElementById(id);
  const esc = v => String(v ?? "").replace(/[&<>\"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]));
  const slugify = v => String(v || "").toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  let lastSignature = "";

  function currentProduct() {
    const all = window.NextLevelSubs?.subscriptions || [];
    const m = location.pathname.match(/\/product\/([^\/]+)/);
    const id = decodeURIComponent(m?.[1] || new URLSearchParams(location.search).get("name") || "");
    return all.find(p => p.slug === id || slugify(p.name) === id || p.name === id) || null;
  }

  function apply() {
    const root = $("productDetails");
    const p = currentProduct();
    if (!root || !p) return;
    const logo = p.logo || "";
    if (logo) {
      const logoImg = root.querySelector("img.w-16.h-16.rounded-xl");
      if (logoImg && logoImg.src !== logo) {
        logoImg.src = logo;
        logoImg.alt = `${p.name} logo`;
      }
    }

    const service = Array.isArray(p.serviceImages) ? p.serviceImages.filter(x => x?.url) : [];
    const old = root.querySelector("[data-central-product-service-media]");
    if (!service.length) { old?.remove(); return; }
    const signature = `${p.slug}|${service.map(x => `${x.url}|${x.name}`).join(";")}`;
    if (old && lastSignature === signature) return;
    old?.remove();

    const keyHeading = [...root.querySelectorAll("h3")].find(x => x.textContent.trim() === "Key Features:");
    const anchor = keyHeading?.parentElement;
    if (!anchor) return;
    const section = document.createElement("div");
    section.setAttribute("data-central-product-service-media", "true");
    section.className = "mt-6";
    section.innerHTML = `<h3 class="text-lg font-semibold mb-3">Included Services</h3><div class="grid grid-cols-2 sm:grid-cols-3 gap-3">${service.map((x,i) => `<div class="rounded-xl border border-gray-200 bg-white p-3 flex items-center gap-3 shadow-sm" data-aos="fade-up" data-aos-delay="${i*60}"><img src="${esc(x.url)}" alt="${esc(x.alt || x.name || p.name)}" class="w-12 h-12 rounded-lg object-contain bg-gray-50 border border-gray-100 p-1"><div class="min-w-0"><div class="font-semibold text-sm text-gray-800 truncate">${esc(x.name || x.title || "Included service")}</div><div class="text-xs text-gray-500">Included with this product</div></div></div>`).join("")}</div>`;
    anchor.parentElement?.insertBefore(section, anchor.nextSibling);
    lastSignature = signature;
    if (typeof AOS !== "undefined") AOS.refresh();
  }

  function boot() {
    const root = $("productDetails");
    if (!root || root.dataset.centralMediaBridge === "1") return;
    root.dataset.centralMediaBridge = "1";
    new MutationObserver(() => requestAnimationFrame(apply)).observe(root, {childList:true, subtree:true});
    window.addEventListener("nextlevel:products-updated", apply);
    setTimeout(apply, 700);
    setTimeout(apply, 1500);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot, {once:true}); else boot();
})();
