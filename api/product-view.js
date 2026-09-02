"use strict";

const fs = require("fs");
const path = require("path");
const vm = require("vm");

const SITE = "https://www.nextlevelsubs.com";

function slugify(value) {
  return String(value || "")
    .toLowerCase()
    .trim()
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
  let source = fs.readFileSync(file, "utf8");
  source = source.replace(/,\s*,/g, ",");

  const marker = source.indexOf("const products");
  if (marker < 0) throw new Error("products declaration not found");
  const start = source.indexOf("[", marker);
  if (start < 0) throw new Error("products array not found");

  let depth = 0;
  let quote = null;
  let escaped = false;
  let lineComment = false;
  let blockComment = false;
  let end = -1;

  for (let i = start; i < source.length; i++) {
    const c = source[i];
    const n = source[i + 1];
    if (lineComment) {
      if (c === "\n") lineComment = false;
      continue;
    }
    if (blockComment) {
      if (c === "*" && n === "/") { blockComment = false; i++; }
      continue;
    }
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
    if (c === "]") {
      depth--;
      if (depth === 0) { end = i + 1; break; }
    }
  }

  if (end < 0) throw new Error("products array did not close");
  const list = vm.runInNewContext("(" + source.slice(start, end) + ")", {}, { timeout: 3000 });
  if (!Array.isArray(list)) throw new Error("products is not an array");
  return list;
}

let products = [];
let loadError = null;
try { products = loadProducts(); }
catch (error) { loadError = error; }

function findProduct(slug) {
  const wanted = slugify(slug);
  const aliases = {
    netflix: "netflix-premium",
    "youtube-premium-nonrenewable": "youtube-premium-non-renewable"
  };
  const key = aliases[wanted] || wanted;
  return products.find((p) => slugify(p.slug || p.name) === key || slugify(p.name) === key);
}

function getSlug(req) {
  const query = req && req.query ? req.query.slug : "";
  if (Array.isArray(query) && query.length) return query.join("/");
  if (typeof query === "string" && query.trim()) return query;

  const rawUrl = String((req && (req.originalUrl || req.url)) || "");
  const cleanPath = rawUrl.split("?")[0].split("#")[0];
  const match = cleanPath.match(/^\/(?:product|products)\/(.+?)\/?$/i);
  return match ? decodeURIComponent(match[1]) : "";
}

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
      return res.end("<!doctype html><html><head><meta charset=\"utf-8\"><title>Product Not Found | Next Level Subs</title></head><body><h1>Product Not Found</h1><p>Requested product: " + escapeHTML(requestedSlug || "(empty slug)") + "</p><p><a href=\"/\">Return home</a></p></body></html>");
    }

    const canonicalSlug = slugify(product.slug || product.name);
    const canonical = SITE + "/product/" + canonicalSlug;
    const image = String(product.image || "/images/next_level.png").replace(/^\.\//, "/");
    const imageURL = /^https?:\/\//i.test(image) ? image : SITE + (image.startsWith("/") ? image : "/" + image);
    const description = product.description || `Get ${product.name} subscription from NEXT LEVEL SUBS in Bangladesh.`;
    const title = `${product.name} Subscription | NEXT LEVEL SUBS`;

    let html = fs.readFileSync(path.join(__dirname, "..", "details.html"), "utf8");
    html = html.replace(/<head>/i, '<head>\n  <base href="/">');
    html = html.replace(/<script\s+src=["']\/js\/details\.js["']\s*><\/script>/i, '<script src="/api/details-script"></script>');

    const schema = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Product",
      name: product.name,
      description,
      image: [imageURL],
      url: canonical,
      brand: { "@type": "Brand", name: "NEXT LEVEL SUBS" },
      seller: { "@type": "Organization", name: "NEXT LEVEL SUBS", url: SITE }
    }).replace(/</g, "\\u003c");

    html = html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${escapeHTML(title)}</title>`);
    html = html.replace(/<meta name="description"[^>]*>/i, `<meta name="description" content="${escapeHTML(description)}">`);
    html = html.replace(/<meta name="robots"[^>]*>/i, '<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1">');
    html = html.replace(/<link rel="canonical"[^>]*>/i, `<link rel="canonical" href="${escapeHTML(canonical)}">`);
    html = html.replace(/<meta property="og:title"[^>]*>/i, `<meta property="og:title" content="${escapeHTML(title)}">`);
    html = html.replace(/<meta property="og:description"[^>]*>/i, `<meta property="og:description" content="${escapeHTML(description)}">`);
    html = html.replace(/<meta property="og:image"[^>]*>/i, `<meta property="og:image" content="${escapeHTML(imageURL)}">`);
    html = html.replace(/<meta property="og:url"[^>]*>/i, `<meta property="og:url" content="${escapeHTML(canonical)}">`);
    html = html.replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/i, `<script type="application/ld+json">${schema}</script>`);

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