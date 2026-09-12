"use strict";

const fs = require("fs");
const path = require("path");
const SITE = "https://www.nextlevelsubs.com";

const CATEGORIES = {
  "best-selling": {
    name: "Best Selling Subscriptions",
    title: "Best Selling Premium Subscriptions in Bangladesh | Next Level Subs",
    description: "Shop the best-selling premium subscriptions in Bangladesh. Compare plans and pricing for popular streaming, music, VPN, AI and digital services at Next Level Subs."
  },
  streaming: {
    name: "Streaming Subscriptions",
    title: "Streaming Subscriptions in Bangladesh | Netflix, Prime Video & More",
    description: "Buy streaming subscriptions in Bangladesh with clear plans and pricing. Explore Netflix, Prime Video, Disney+, HBO Max and other premium streaming services at Next Level Subs."
  },
  music: {
    name: "Music Subscriptions",
    title: "Music Premium Subscriptions in Bangladesh | Spotify, Apple Music & More",
    description: "Find premium music subscriptions in Bangladesh. Compare Spotify, Apple Music, TIDAL, Deezer and other music services with plans and pricing at Next Level Subs."
  },
  storage: {
    name: "Cloud Storage",
    title: "Cloud Storage Subscriptions in Bangladesh | Google Drive, iCloud & More",
    description: "Get cloud storage subscriptions in Bangladesh. Compare Google Drive, iCloud+, Dropbox and other storage plans and pricing at Next Level Subs."
  },
  vpn: {
    name: "VPN Subscriptions",
    title: "VPN Subscriptions in Bangladesh | Premium VPN Plans & Pricing",
    description: "Compare premium VPN subscriptions in Bangladesh. Explore secure VPN plans, pricing and service options from Next Level Subs."
  },
  aiDesign: {
    name: "AI & Design Subscriptions",
    title: "AI & Design Subscriptions in Bangladesh | Premium Plans",
    description: "Explore premium AI and design subscriptions in Bangladesh. Compare available plans, features and pricing at Next Level Subs."
  },
  combos: {
    name: "Subscription Combos",
    title: "Premium Subscription Combos in Bangladesh | Next Level Subs",
    description: "Save with premium subscription combos in Bangladesh. Explore bundled digital services, plans and pricing at Next Level Subs."
  },
  education: {
    name: "Education Subscriptions",
    title: "Education Subscriptions in Bangladesh | Premium Learning Plans",
    description: "Explore education and learning subscriptions in Bangladesh. Compare premium plans, features and pricing at Next Level Subs."
  },
  adult: {
    name: "Adult 18+ Subscriptions",
    title: "Adult 18+ Subscriptions | Next Level Subs",
    description: "Browse age-restricted 18+ digital subscription options available from Next Level Subs."
  }
};

const esc = (value) => String(value ?? "").replace(/[&<>\"']/g, (c) => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#039;"
}[c]));
const abs = (value) => { try { return new URL(value, SITE).href; } catch { return ""; } };
const safeJson = (value) => JSON.stringify(value).replace(/</g, "\\u003c").replace(/>/g, "\\u003e").replace(/&/g, "\\u0026");

async function getProducts() {
  const response = await fetch(`${SITE}/api/products`, { headers: { accept: "application/json" }, cache: "no-store" });
  if (!response.ok) throw new Error(`Catalog API ${response.status}`);
  const body = await response.json();
  return Array.isArray(body.products) ? body.products : [];
}

function belongs(product, slug) {
  const cats = Array.isArray(product?.categories) ? product.categories : [];
  const legacy = product?.extra_data?.homepage_categories || product?.extra_data?.legacy_categories;
  const values = [...cats.map((x) => typeof x === "string" ? x : (x?.slug || x?.name)), ...(Array.isArray(legacy) ? legacy : [])]
    .filter(Boolean).map((x) => String(x).toLowerCase());
  if (slug === "best-selling") return values.includes("best-selling") || product?.is_featured === true;
  return values.includes(slug.toLowerCase());
}

module.exports = async function handler(req, res) {
  try {
    if (req.method !== "GET" && req.method !== "HEAD") { res.statusCode = 405; return res.end("Method Not Allowed"); }
    const slug = String(req.query?.category || "").trim();
    const meta = CATEGORIES[slug];
    if (!meta) { res.statusCode = 404; res.setHeader("X-Robots-Tag", "noindex, nofollow"); return res.end("Not Found"); }

    let html = fs.readFileSync(path.join(__dirname, "..", "index.html"), "utf8");
    const canonical = `${SITE}/${slug}`;
    let products = [];
    try { products = (await getProducts()).filter((p) => belongs(p, slug) && p?.is_available !== false && p?.is_archived !== true); } catch (error) { console.warn("CATEGORY SEO: catalog unavailable", error?.message || error); }

    const itemList = products.slice(0, 100).map((p, index) => {
      const url = `${SITE}/product/${encodeURIComponent(p.slug || "")}`;
      const image = abs(p.image_url || p.icon || "/images/logo.png");
      return { "@type": "ListItem", position: index + 1, url, name: p.name, image };
    });

    const graph = [
      { "@type": "Organization", "@id": `${SITE}/#organization`, name: "Next Level Subs", url: `${SITE}/`, logo: `${SITE}/images/logo.png`, sameAs: ["https://www.facebook.com/nextlevelestoresubs", "https://wa.me/8801644490566"] },
      { "@type": "WebSite", "@id": `${SITE}/#website`, name: "Next Level Subs", url: `${SITE}/`, publisher: { "@id": `${SITE}/#organization` }, inLanguage: "en-BD" },
      { "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` }, { "@type": "ListItem", position: 2, name: meta.name, item: canonical }] },
      { "@type": "CollectionPage", "@id": `${canonical}#webpage`, url: canonical, name: meta.title, description: meta.description, isPartOf: { "@id": `${SITE}/#website` }, breadcrumb: { "@id": `${canonical}#breadcrumb` }, mainEntity: { "@type": "ItemList", numberOfItems: itemList.length, itemListElement: itemList } }
    ];
    graph[2]["@id"] = `${canonical}#breadcrumb`;
    graph[3].mainEntity.itemListElement = itemList;

    html = html
      .replace(/<base[^>]*>/i, "")
      .replace(/<title>[\s\S]*?<\/title>/i, `<title>${esc(meta.title)}</title>`)
      .replace(/<meta name="description"[^>]*>/i, `<meta name="description" content="${esc(meta.description)}">`)
      .replace(/<link rel="canonical"[^>]*>/i, `<link rel="canonical" href="${esc(canonical)}">`)
      .replace(/<meta property="og:title"[^>]*>/i, `<meta property="og:title" content="${esc(meta.title)}">`)
      .replace(/<meta property="og:description"[^>]*>/i, `<meta property="og:description" content="${esc(meta.description)}">`)
      .replace(/<meta property="og:url"[^>]*>/i, `<meta property="og:url" content="${esc(canonical)}">`)
      .replace(/<meta property="og:type"[^>]*>/i, `<meta property="og:type" content="website">`)
      .replace(/<meta name="twitter:title"[^>]*>/i, `<meta name="twitter:title" content="${esc(meta.title)}">`)
      .replace(/<meta name="twitter:description"[^>]*>/i, `<meta name="twitter:description" content="${esc(meta.description)}">`)
      .replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/gi, "")
      .replace(/<\/head>/i, `<script type="application/ld+json">${safeJson({ "@context": "https://schema.org", "@graph": graph })}</script></head>`);

    res.statusCode = 200;
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.setHeader("Content-Language", "en-BD");
    res.setHeader("X-Robots-Tag", "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1");
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("Cache-Control", "no-store, max-age=0");
    if (req.method === "HEAD") return res.end();
    return res.end(html);
  } catch (error) {
    console.error("CATEGORY SEO ERROR:", error?.stack || error);
    res.statusCode = 500;
    return res.end("Internal Server Error");
  }
};
