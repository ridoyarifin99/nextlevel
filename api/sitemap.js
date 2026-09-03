"use strict";

const fs = require("fs");
const path = require("path");
const vm = require("vm");

const SITE = "https://www.nextlevelsubs.com";

function slugify(value) {
    return String(value == null ? "" : value)
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
}

function escapeXML(value) {
    return String(value == null ? "" : value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/\"/g, "&quot;")
        .replace(/'/g, "&apos;");
}

function loadProducts() {
    const source = fs.readFileSync(path.join(__dirname, "..", "js", "details.js"), "utf8");
    const marker = source.indexOf("const products");
    if (marker < 0) throw new Error("Product catalog declaration not found in js/details.js");

    const start = source.indexOf("[", marker);
    if (start < 0) throw new Error("Product catalog array not found in js/details.js");

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
            if (c === "*" && n === "/") {
                blockComment = false;
                i++;
            }
            continue;
        }
        if (quote) {
            if (escaped) {
                escaped = false;
                continue;
            }
            if (c === "\\") {
                escaped = true;
                continue;
            }
            if (c === quote) quote = null;
            continue;
        }
        if (c === "'" || c === '"' || c === "`") {
            quote = c;
            continue;
        }
        if (c === "/" && n === "/") {
            lineComment = true;
            i++;
            continue;
        }
        if (c === "/" && n === "*") {
            blockComment = true;
            i++;
            continue;
        }
        if (c === "[") depth++;
        else if (c === "]") {
            depth--;
            if (depth === 0) {
                end = i + 1;
                break;
            }
        }
    }

    if (end < 0) throw new Error("Could not find end of product catalog array");

    const products = vm.runInNewContext("(" + source.slice(start, end) + ")", Object.create(null), { timeout: 3000 });
    if (!Array.isArray(products)) throw new Error("Extracted product catalog is not an array");
    return products;
}

function buildURLs() {
    const urls = new Set([
        "/",
        "/best-selling",
        "/streaming",
        "/music",
        "/storage",
        "/vpn",
        "/aiDesign",
        "/combos",
        "/education",
        "/adult"
    ]);

    for (const product of loadProducts()) {
        if (!product || typeof product !== "object" || !product.name) continue;
        const slug = slugify(product.slug || product.name);
        if (slug) urls.add(`/product/${slug}`);
    }

    return [...urls];
}

module.exports = function handler(req, res) {
    if (req.method !== "GET" && req.method !== "HEAD") {
        res.statusCode = 405;
        res.setHeader("Allow", "GET, HEAD");
        return res.end("Method Not Allowed");
    }

    try {
        const urls = buildURLs();
        const body = urls.map(url => `  <url><loc>${escapeXML(SITE + url)}</loc></url>`).join("\n");
        const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`;

        res.statusCode = 200;
        res.setHeader("Content-Type", "application/xml; charset=utf-8");
        res.setHeader("Cache-Control", "public, max-age=300, s-maxage=3600, stale-while-revalidate=86400");
        res.setHeader("X-Content-Type-Options", "nosniff");
        if (req.method === "HEAD") return res.end();
        return res.end(xml);
    } catch (error) {
        console.error("SITEMAP GENERATION ERROR:", error && error.stack ? error.stack : error);
        res.statusCode = 500;
        res.setHeader("Content-Type", "application/xml; charset=utf-8");
        return res.end("<?xml version=\"1.0\" encoding=\"UTF-8\"?><error>sitemap generation failed</error>");
    }
};
