"use strict";

const SITE = "https://www.nextlevelsubs.com";
const CATEGORY_URLS = [
  "/best-selling",
  "/streaming",
  "/music",
  "/storage",
  "/vpn",
  "/aiDesign",
  "/combos",
  "/education",
  "/adult"
];

function slugify(value) {
  return String(value == null ? "" : value)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function escapeXML(value) {
  return String(value == null ? "" : value).replace(/[&<>\"']/g, (c) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "\"": "&quot;",
    "'": "&apos;"
  }[c]));
}

async function loadCentralizedProducts() {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 7000);
  try {
    const response = await fetch(`${SITE}/api/products`, {
      headers: { accept: "application/json" },
      cache: "no-store",
      signal: controller.signal
    });
    if (!response.ok) throw new Error(`Catalog API ${response.status}`);
    const body = await response.json();
    if (!Array.isArray(body.products)) throw new Error("Catalog API returned no products array");
    return body.products;
  } finally {
    clearTimeout(timer);
  }
}

async function buildURLs() {
  const urls = new Set(["/", ...CATEGORY_URLS]);
  const products = await loadCentralizedProducts();

  for (const product of products) {
    if (!product || product.is_archived === true || product.is_available === false) continue;
    const slug = slugify(product.slug || product.name);
    if (slug) urls.add(`/product/${slug}`);
  }

  return [...urls];
}

module.exports = async function handler(req, res) {
  if (req.method !== "GET" && req.method !== "HEAD") {
    res.statusCode = 405;
    res.setHeader("Allow", "GET, HEAD");
    return res.end("Method Not Allowed");
  }

  try {
    const urls = await buildURLs();
    const body = urls.map((url) => `  <url><loc>${escapeXML(SITE + url)}</loc></url>`).join("\n");
    const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`;

    res.statusCode = 200;
    res.setHeader("Content-Type", "application/xml; charset=utf-8");
    res.setHeader("Cache-Control", "public, max-age=300, s-maxage=3600, stale-while-revalidate=86400");
    res.setHeader("X-Content-Type-Options", "nosniff");
    if (req.method === "HEAD") return res.end();
    return res.end(xml);
  } catch (error) {
    console.error("SITEMAP GENERATION ERROR:", error && error.stack ? error.stack : error);
    res.statusCode = 503;
    res.setHeader("Content-Type", "application/xml; charset=utf-8");
    res.setHeader("Retry-After", "300");
    return res.end("<?xml version=\"1.0\" encoding=\"UTF-8\"?><error>sitemap temporarily unavailable</error>");
  }
};
