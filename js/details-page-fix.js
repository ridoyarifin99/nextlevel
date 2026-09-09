"use strict";
(() => {
  if (!/\/details\.html$/i.test(location.pathname) && !/\/product\//i.test(location.pathname)) return;
  if (window.__NLSDetailsFixLoaded) return;
  window.__NLSDetailsFixLoaded = true;

  const SITE = "https://www.nextlevelsubs.com";
  const $ = (s, root = document) => root.querySelector(s);
  const slugFromUrl = () => {
    const m = location.pathname.match(/\/product\/([^/?#]+)/i);
    if (m) return decodeURIComponent(m[1]);
    try { const p = new URLSearchParams(location.search); return p.get("slug") || p.get("product") || ""; } catch { return ""; }
  };
  const titleize = s => String(s || "").replace(/[-_]+/g, " ").replace(/\b\w/g, c => c.toUpperCase()).trim();
  const setMeta = (name, content) => { if (!content) return; let el = $(`meta[name="${name}"]`); if (!el) { el = document.createElement("meta"); el.name = name; document.head.appendChild(el); } el.content = content; };
  const setOg = (property, content) => { if (!content) return; let el = $(`meta[property="${property}"]`); if (!el) { el = document.createElement("meta"); el.setAttribute("property", property); document.head.appendChild(el); } el.content = content; };

  function fixSeo() {
    const slug = slugFromUrl(); if (!slug) return;
    const heading = $("h1, [data-product-name], .product-title, .details-title");
    const productName = heading?.textContent.trim() || titleize(slug);
    const description = $("meta[name=description]")?.content || `Buy ${productName} subscription in Bangladesh from Next Level Subs. View plans, pricing, features and instant delivery options.`;
    const canonical = `${SITE}/product/${encodeURIComponent(slug)}`;
    document.title = `${productName} Subscription | NEXT LEVEL SUBS`;
    setMeta("description", description.slice(0, 160));
    setMeta("twitter:title", document.title);
    setMeta("twitter:description", description.slice(0, 200));
    setOg("og:title", document.title);
    setOg("og:description", description.slice(0, 200));
    setOg("og:url", canonical);
    let link = $("link[rel=canonical]"); if (!link) { link = document.createElement("link"); link.rel = "canonical"; document.head.appendChild(link); } link.href = canonical;
  }

  function fixRuntimeConfig() {
    if (window.AUTH_API_BASE && /localhost|127\.0\.0\.1/i.test(String(window.AUTH_API_BASE))) delete window.AUTH_API_BASE;
  }

  function normalizeUrl(value) {
    if (!value || typeof value !== "string") return value;
    let src = value.trim();
    if (!src || /^https?:\/\//i.test(src) || /^(data|blob):/i.test(src)) return src;
    src = src.replace(/^\.\//, "/").replace(/^\.\.\//, "/").replace(/\/assets\/assets\//g, "/assets/");
    if (src.includes("/assets/") && !src.startsWith("/assets/")) src = "/assets/" + src.split("/assets/").pop();
    return src;
  }

  function fixImages() {
    document.querySelectorAll("img,source").forEach(el => ["src","srcset"].forEach(attr => {
      const value = el.getAttribute(attr); if (!value) return;
      if (attr === "srcset") { const fixed = value.split(",").map(part => { const bits = part.trim().split(/\s+/); bits[0] = normalizeUrl(bits[0]); return bits.join(" "); }).join(", "); if (fixed !== value) el.setAttribute(attr, fixed); }
      else { const fixed = normalizeUrl(value); if (fixed !== value) el.setAttribute(attr, fixed); }
    }));
  }

  function fixFavoriteIds() {
    const icons = document.querySelectorAll("#favoriteIcon");
    icons.forEach((el, i) => { if (i > 0) el.id = `favoriteIcon-${i + 1}`; });
  }

  function fixBuyNowLabel() {
    document.querySelectorAll("button,a").forEach(el => {
      if (!/buy\s*now/i.test(el.textContent || "")) return;
      const icon = el.querySelector("i");
      if (icon) { icon.classList.remove("fa-whatsapp","fab","fa-whatsapp-square"); icon.classList.add("fa-solid","fa-bag-shopping"); }
      el.setAttribute("aria-label", "Buy now");
    });
  }

  function run() { fixRuntimeConfig(); fixSeo(); fixImages(); fixFavoriteIds(); fixBuyNowLabel(); }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", run, {once:true}); else run();
  [400, 1000, 2200].forEach(ms => setTimeout(run, ms));
})();
