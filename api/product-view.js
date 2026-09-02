"use strict";

const fs = require("fs");
const path = require("path");
const vm = require("vm");
const seoContent = require("./seo-content");

const SITE = "https://www.nextlevelsubs.com";

function slugify(value) {
  return String(value || "")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function escapeHTML(value) {
  return String(value == null ? "" : value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function loadProducts() {
  const file = path.join(__dirname, "..", "js", "details.js");
  let source = fs.readFileSync(file, "utf8").replace(/,\s*,/g, ",");
  const marker = source.indexOf("const products");
  if (marker < 0) throw new Error("products declaration not found");
  const start = source.indexOf("[", marker);
  if (start < 0) throw new Error("products array not found");

  let depth = 0, quote = null, escaped = false, lineComment = false, blockComment = false, end = -1;
  for (let i = start; i < source.length; i++) {
    const c = source[i], n = source[i + 1];
    if (lineComment) { if (c === "\n") lineComment = false; continue; }
    if (blockComment) { if (c === "*" && n === "/") { blockComment = false; i++; } continue; }
    if (quote) {
      if (escaped) { escaped = false; continue; }
      if (c === "\\") { escaped = true; continue; }
      if (c === quote) quote = null;
      continue;
    }
    if (c === "'" || c === '"' || c === "`") { quote = c; continue; }
    if (c === "/" && n === "/") { lineComment = true; i++; continue; }
    if (c === "/" && n === "*") { blockComment = true; i++; continue; }
    if (c === "[") depth++;
    if (c === "]") { depth--; if (depth === 0) { end = i + 1; break; } }
  }
  if (end < 0) throw new Error("products array did not close");
  const list = vm.runInNewContext("(" + source.slice(start, end) + ")", {}, { timeout: 3000 });
  if (!Array.isArray(list)) throw new Error("products is not an array");
  return list;
}

let products = [], loadError = null;
try { products = loadProducts(); } catch (error) { loadError = error; }

function findProduct(slug) {
  const wanted = slugify(slug);
  const aliases = {
    netflix: "netflix-premium",
    "youtube-premium-nonrenewable": "youtube-premium-non-renewable"
  };
  const key = aliases[wanted] || wanted;
  return products.find((p) => slugify(p.slug || p.name) === key || slugify(p.name) === key);
}

function cleanCandidate(value) {
  if (Array.isArray(value)) value = value.join("/");
  return typeof value === "string" ? value.trim() : "";
}

function getSlug(req) {
  const query = req && req.query ? req.query : {};
  for (const candidate of [query.slug, query.name, query.product]) {
    const value = cleanCandidate(candidate);
    if (value) return value;
  }
  const rawUrl = String((req && (req.originalUrl || req.url)) || "");
  const queryMatch = rawUrl.match(/[?&](?:slug|name|product)=([^&#]+)/i);
  if (queryMatch) {
    try { return decodeURIComponent(queryMatch[1]); } catch (_) { return queryMatch[1]; }
  }
  const cleanPath = rawUrl.split("?")[0].split("#")[0];
  const match = cleanPath.match(/^\/(?:product|products)\/(.+?)\/?$/i);
  if (match) {
    try { return decodeURIComponent(match[1]); } catch (_) { return match[1]; }
  }
  return "";
}

function getSeoEntry(product, canonicalSlug) {
  if (!seoContent || typeof seoContent !== "object") return null;
  const aliases = { duolingo: "doulingo" };
  const candidates = [
    canonicalSlug,
    slugify(product && product.slug),
    slugify(product && product.name),
    aliases[canonicalSlug]
  ].filter(Boolean);

  for (const key of candidates) {
    if (seoContent[key] && typeof seoContent[key] === "object") return seoContent[key];
  }
  return null;
}

const RELATED_CARD_CSS = `
[id*="related"], [class*="related"] { width: 100%; }
[id*="related"] [class*="grid"], [class*="related"] [class*="grid"] { align-items: stretch; }
[id*="related"] .subscription-card, [class*="related"] .subscription-card,
[id*="related"] [class*="product-card"], [class*="related"] [class*="product-card"],
[id*="related"] [class*="card"]:not(.review-card), [class*="related"] [class*="card"]:not(.review-card) {
  width: 100%; height: 100%; min-height: 0; display: flex; flex-direction: column; overflow: hidden;
  border-radius: 1rem; background: #fff; box-shadow: 0 10px 25px rgba(15, 23, 42, .08);
  transition: transform .3s cubic-bezier(.16,1,.3,1), box-shadow .3s cubic-bezier(.16,1,.3,1);
}
[id*="related"] .subscription-card:hover, [class*="related"] .subscription-card:hover,
[id*="related"] [class*="product-card"]:hover, [class*="related"] [class*="product-card"]:hover,
[id*="related"] [class*="card"]:not(.review-card):hover, [class*="related"] [class*="card"]:not(.review-card):hover {
  transform: translateY(-8px); box-shadow: 0 0 15px 10px rgba(106, 17, 203, .15);
}
[id*="related"] img, [class*="related"] img { max-width: 100%; }
[id*="related"] .subscription-card > *, [class*="related"] .subscription-card > *,
[id*="related"] [class*="product-card"] > *, [class*="related"] [class*="product-card"] > * { flex-shrink: 0; }
[id*="related"] .subscription-card > :last-child, [class*="related"] .subscription-card > :last-child,
[id*="related"] [class*="product-card"] > :last-child, [class*="related"] [class*="product-card"] > :last-child { margin-top: auto; }
@media (min-width: 1024px) { [id*="related"] [class*="grid"], [class*="related"] [class*="grid"] { grid-template-columns: repeat(4, minmax(0,1fr)); } }
@media (min-width: 640px) and (max-width: 1023px) { [id*="related"] [class*="grid"], [class*="related"] [class*="grid"] { grid-template-columns: repeat(2, minmax(0,1fr)); } }
@media (max-width: 639px) { [id*="related"] [class*="grid"], [class*="related"] [class*="grid"] { grid-template-columns: repeat(2, minmax(0,1fr)); gap: .75rem; } }
`;

module.exports = function handler(req, res) {
  try {
    if (req.method !== "GET" && req.method !== "HEAD") {
      res.statusCode = 405;
      res.setHeader("Allow", "GET, HEAD");
      return res.end("Method Not Allowed");
    }

    if (loadError) throw loadError;

    const requestedSlug = getSlug(req);
    const product = findProduct(requestedSlug);

    if (!product) {
      res.statusCode = 404;
      res.setHeader("Content-Type", "text/html; charset=utf-8");
      res.setHeader("X-Robots-Tag", "noindex, nofollow");
      return res.end(`<!doctype html><html><head><meta charset="utf-8"><title>Product Not Found | Next Level Subs</title></head><body><h1>Product Not Found</h1><p>Requested product: ${escapeHTML(requestedSlug || "(empty slug)")}</p><p><a href="/">Return home</a></p></body></html>`);
    }

    const canonicalSlug = slugify(product.slug || product.name);
    const canonical = SITE + "/product/" + canonicalSlug;
    const seo = getSeoEntry(product, canonicalSlug);
    const seoDescription = seo && typeof seo.description === "string" ? seo.description.trim() : "";
    const description = seoDescription || product.description || `Get ${product.name} subscription from NEXT LEVEL SUBS in Bangladesh.`;
    const title = seo && typeof seo.title === "string" && seo.title.trim()
      ? seo.title.trim()
      : `${product.name} Subscription | NEXT LEVEL SUBS`;

    const image = String(product.image || "/images/next_level.png").replace(/^\.\//, "/");
    const imageURL = /^https?:\/\//i.test(image)
      ? image
      : SITE + (image.startsWith("/") ? image : "/" + image);

    const pricing = Array.isArray(product.pricing)
      ? product.pricing.filter((item) => Number.isFinite(Number(item && item.price)))
      : [];
    const prices = pricing.map((item) => Number(item.price));
    const priceCurrency = String((pricing[0] && pricing[0].currency) || "BDT").toUpperCase();

    // Google Product structured data: expose every real plan as an Offer.
    // Each Offer points to the canonical product URL instead of an invalid
    // placeholder such as /product/0.
    const offerList = pricing.map((item) => ({
      "@type": "Offer",
      url: canonical,
      priceCurrency: String(item.currency || priceCurrency).toUpperCase(),
      price: Number(item.price),
      name: `${product.name} - ${String(item.duration || "Plan")}`,
      availability: "https://schema.org/InStock",
      seller: {
        "@type": "Organization",
        name: "NEXT LEVEL SUBS",
        url: SITE
      },
      shippingDetails: {
        "@type": "OfferShippingDetails",
        shippingRate: {
          "@type": "MonetaryAmount",
          value: 0,
          currency: String(item.currency || priceCurrency).toUpperCase()
        },
        shippingDestination: {
          "@type": "DefinedRegion",
          addressCountry: "BD"
        },
        deliveryTime: {
          "@type": "ShippingDeliveryTime",
          handlingTime: {
            "@type": "QuantitativeValue",
            minValue: 10,
            maxValue: 30,
            unitCode: "MIN"
          }
        }
      }
    }));

    const ratingValue = Number(product.rating);
    const ratingCount = Number(product.reviews);
    const aggregateRating = Number.isFinite(ratingValue) && ratingValue > 0 &&
      Number.isFinite(ratingCount) && ratingCount > 0
      ? {
          "@type": "AggregateRating",
          ratingValue,
          ratingCount,
          reviewCount: ratingCount,
          bestRating: 5,
          worstRating: 1
        }
      : null;

    let html = fs.readFileSync(path.join(__dirname, "..", "details.html"), "utf8");
    html = html.replace(/<head>/i, '<head>\n  <base href="/">');
    html = html.replace(
      /<script\s+src=["']\/js\/details\.js["']\s*><\/script>/i,
      '<script src="/api/details-script"></script>'
    );

    const productBootstrap = `<script>window.__NLS_PRODUCT_SLUG__=${JSON.stringify(canonicalSlug)};window.__NLS_PRODUCT_NAME__=${JSON.stringify(product.name)};</script>`;
    html = html.replace(/<body>/i, productBootstrap + "\n<body>");
    html = html.replace(
      /<\/head>/i,
      `<style id="nls-related-card-style">${RELATED_CARD_CSS}</style>\n</head>`
    );

    const schema = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Product",
      name: product.name,
      description,
      image: [imageURL],
      url: canonical,
      brand: { "@type": "Brand", name: "NEXT LEVEL SUBS" },
      seller: { "@type": "Organization", name: "NEXT LEVEL SUBS", url: SITE },
      ...(offerList.length ? { offers: offerList } : {}),
      ...(aggregateRating ? { aggregateRating } : {})
    }).replace(/</g, "\\u003c");

    html = html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${escapeHTML(title)}</title>`);
    html = html.replace(/<meta name="description"[^>]*>/i, `<meta name="description" content="${escapeHTML(description)}">`);
    html = html.replace(/<meta name="robots"[^>]*>/i, '<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1">');
    html = html.replace(/<link rel="canonical"[^>]*>/i, `<link rel="canonical" href="${escapeHTML(canonical)}">`);
    html = html.replace(/<meta property="og:title"[^>]*>/i, `<meta property="og:title" content="${escapeHTML(title)}">`);
    html = html.replace(/<meta property="og:description"[^>]*>/i, `<meta property="og:description" content="${escapeHTML(description)}">`);
    html = html.replace(/<meta property="og:image"[^>]*>/i, `<meta property="og:image" content="${escapeHTML(imageURL)}">`);
    html = html.replace(/<meta property="og:url"[^>]*>/i, `<meta property="og:url" content="${escapeHTML(canonical)}">`);
    html = html.replace(/<\/head>/i, `<script type="application/ld+json">${schema}</script>\n</head>`);

    res.statusCode = 200;
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.setHeader("Cache-Control", "no-store, max-age=0, must-revalidate");
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("X-Robots-Tag", "index, follow, max-image-preview:large");

    if (req.method === "HEAD") return res.end();
    return res.end(html);
  } catch (error) {
    console.error("PRODUCT VIEW ERROR:", error && error.stack ? error.stack : error);
    res.statusCode = 500;
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    return res.end("Internal Server Error");
  }
};
