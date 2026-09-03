"use strict";

const fs = require("fs");
const path = require("path");

const SITE = "https://www.nextlevelsubs.com";

function slugify(value) {
  return String(value || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function getSlug(req) {
  const q = req && req.query && typeof req.query.slug === "string" ? req.query.slug : "";
  if (q) return slugify(q);

  const url = String((req && req.url) || "").split("?")[0];
  const match = url.match(/^\/(?:product|products)\/([^/]+)\/?$/i);
  return match ? slugify(match[1]) : "";
}

function escapeHTML(value) {
  return String(value == null ? "" : value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

module.exports = function handler(req, res) {
  try {
    if (req.method !== "GET" && req.method !== "HEAD") {
      res.statusCode = 405;
      res.setHeader("Allow", "GET, HEAD");
      return res.end("Method Not Allowed");
    }

    // IMPORTANT: Do not evaluate js/details.js inside a Vercel Function.
    // The old implementation used vm + a large JavaScript catalog at runtime,
    // which could make the product route fail with FUNCTION_INVOCATION_FAILED.
    // details.html already loads the catalog client-side and resolves the slug
    // from /product/:slug, so the server only needs to return the document.
    const detailsPath = path.join(__dirname, "..", "details.html");
    let html = fs.readFileSync(detailsPath, "utf8");

    // Keep all relative assets rooted at the production site when this document
    // is rendered through /product/:slug.
    html = html.replace(/<head>/i, '<head>\n  <base href="/">');

    const slug = getSlug(req);
    const canonical = slug ? `${SITE}/product/${encodeURIComponent(slug)}` : `${SITE}/product/`;
    const genericTitle = slug
      ? `${slug.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase())} | Next Level Subs`
      : "Product Details | Next Level Subs";

    html = html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${escapeHTML(genericTitle)}</title>`);
    html = html.replace(/<link rel="canonical"[^>]*>/i, `<link rel="canonical" href="${escapeHTML(canonical)}">`);
    html = html.replace(/<meta property="og:url"[^>]*>/i, `<meta property="og:url" content="${escapeHTML(canonical)}">`);

    res.statusCode = 200;
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.setHeader("Cache-Control", "public, max-age=60, s-maxage=300, stale-while-revalidate=3600");
    res.setHeader("X-Content-Type-Options", "nosniff");

    if (req.method === "HEAD") return res.end();
    return res.end(html);
  } catch (error) {
    console.error("PRODUCT VIEW ERROR:", error && error.stack ? error.stack : error);
    res.statusCode = 500;
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    return res.end("Internal Server Error");
  }
};
