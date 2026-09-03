"use strict";

/*
 * Vercel product SEO handler.
 *
 * Do NOT require js/details.js at module scope. That browser-oriented file is
 * also used as the client data source and a top-level require can make the
 * entire Vercel function fail before the handler/catch block runs.
 *
 * We first try CommonJS, then safely extract only the `products` array from
 * details.js. The fallback never executes the browser/UI part of details.js.
 */
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const SITE = {
    name: "NEXT LEVEL SUBS",
    domain: "https://www.nextlevelsubs.com",
    language: "en",
    locale: "en_US",
    logo: "/assets/logo.png"
};

const aliases = {
    netflix: "netflix-premium",
    duolingo: "doulingo",
    "youtube-premium-nonrenewable": "youtube-premium-non-renewable"
};

function slugify(value) {
    return String(value == null ? "" : value).toLowerCase().trim()
        .replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

function escapeHTML(value) {
    return String(value == null ? "" : value)
        .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
        .replace(/\"/g, "&quot;").replace(/'/g, "&#039;");
}

function safeJSON(value) {
    try {
        return JSON.stringify(value == null ? null : value)
            .replace(/</g, "\\u003c").replace(/>/g, "\\u003e")
            .replace(/&/g, "\\u0026").replace(/\u2028/g, "\\u2028")
            .replace(/\u2029/g, "\\u2029");
    } catch (_) { return "null"; }
}

function loadProducts() {
    const file = path.join(__dirname, "..", "js", "details.js");
    let source = fs.readFileSync(file, "utf8");

    try {
        const loaded = require(file);
        if (Array.isArray(loaded) && loaded.length) return loaded;
        if (loaded && Array.isArray(loaded.products) && loaded.products.length) return loaded.products;
    } catch (error) {
        console.warn("details.js CommonJS load failed; using data-only fallback:", error && error.message);
    }

    // Extract only: const products = [ ... ];
    const marker = source.indexOf("const products");
    if (marker < 0) throw new Error("Product catalog declaration not found in js/details.js");
    const start = source.indexOf("[", marker);
    if (start < 0) throw new Error("Product catalog array not found in js/details.js");

    let depth = 0, quote = null, escaped = false, lineComment = false, blockComment = false;
    let end = -1;
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
        else if (c === "]") {
            depth--;
            if (depth === 0) { end = i + 1; break; }
        }
    }
    if (end < 0) throw new Error("Could not find end of product catalog array");

    const arraySource = source.slice(start, end);
    const products = vm.runInNewContext("(" + arraySource + ")", Object.create(null), { timeout: 3000 });
    if (!Array.isArray(products)) throw new Error("Extracted product catalog is not an array");
    return products;
}

function buildProductMap(list) {
    const map = Object.create(null);
    for (const p of list) {
        if (!p || typeof p !== "object" || !p.name) continue;
        const key = slugify(p.slug || p.name);
        if (key) map[key] = p;
    }
    return map;
}

let products;
let productLoadError;
try {
    products = buildProductMap(loadProducts());
} catch (error) {
    productLoadError = error;
    products = Object.create(null);
    console.error("PRODUCT CATALOG LOAD ERROR:", error && error.stack ? error.stack : error);
}

let seoContent = Object.create(null);
try {
    const seo = require(path.join(__dirname, "seo-content.js"));
    seoContent = seo && typeof seo === "object" ? seo : Object.create(null);
} catch (error) {
    console.warn("SEO content load failed:", error && error.message);
}

function resolveSlug(value) {
    if (typeof value !== "string") return "";
    let slug = value.trim();
    try { slug = decodeURIComponent(slug); } catch (_) {}
    slug = slugify(slug);
    if (products[slug]) return slug;
    if (aliases[slug] && products[aliases[slug]]) return aliases[slug];
    for (const key of Object.keys(products)) {
        if (slugify(products[key].name) === slug) return key;
    }
    return "";
}

function getSlug(req) {
    const q = req && req.query && typeof req.query.slug === "string" ? req.query.slug : "";
    const resolved = resolveSlug(q);
    if (resolved) return resolved;
    const pathname = String(req && req.url || "").split("?")[0];
    const m = pathname.match(/^\/(?:product|products)\/([^/]+)\/?$/i);
    return m ? resolveSlug(m[1]) : "";
}

function absoluteURL(value) {
    if (!value) return SITE.domain + SITE.logo;
    const v = String(value).trim();
    if (/^https?:\/\//i.test(v)) return v;
    return SITE.domain + "/" + v.replace(/^\.\//, "").replace(/^\//, "");
}

function categoryOf(p) {
    if (p && typeof p.category === "string" && p.category.trim()) return p.category.trim();
    if (p && Array.isArray(p.categories)) return p.categories.filter(Boolean).map(x => String(x).replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase())).join(", ");
    return "Digital Services";
}

function pricingOf(p) {
    return p && Array.isArray(p.pricing) ? p.pricing.filter(x => x && x.duration && x.price != null).map(x => ({
        duration: String(x.duration), price: Number(x.price), currency: x.currency || "BDT", popular: !!x.popular, discount: x.discount || ""
    })).filter(x => Number.isFinite(x.price)) : [];
}

function seoOf(slug, p) {
    const x = seoContent[slug];
    return x && typeof x === "object" ? {
        title: x.title || `${p.name} Subscription | ${SITE.name}`,
        description: x.description || `${p.description || "Premium subscription service"}. Get ${p.name} from ${SITE.name}.`,
        intro: x.intro || `Get ${p.name} from ${SITE.name}.`,
        sections: Array.isArray(x.sections) ? x.sections : []
    } : {
        title: `${p.name} Subscription | ${SITE.name}`,
        description: `${p.description || "Premium subscription service"}. Get ${p.name} from ${SITE.name}.`,
        intro: `Get ${p.name} from ${SITE.name}. ${p.description || "Premium subscription service."}`,
        sections: []
    };
}

function schemaProduct(p, url, image, description) {
    const s = { "@context":"https://schema.org", "@type":"Product", "@id":url+"#product", name:p.name, description, image:[image], url, category:categoryOf(p), brand:{"@type":"Brand",name:SITE.name}, seller:{"@type":"Organization",name:SITE.name,url:SITE.domain} };
    const rating = Number(p.rating), reviews = Number(p.reviews);
    if (Number.isFinite(rating) && Number.isFinite(reviews) && reviews > 0) s.aggregateRating = {"@type":"AggregateRating",ratingValue:rating,reviewCount:reviews};
    const pricing = pricingOf(p);
    if (pricing.length) s.offers = pricing.map(x => ({"@type":"Offer",url,priceCurrency:x.currency,price:x.price,name:`${p.name} - ${x.duration}`,availability:"https://schema.org/InStock",seller:{"@type":"Organization",name:SITE.name}}));
    return s;
}

function sectionsHTML(sections) {
    return (Array.isArray(sections) ? sections : []).map(s => {
        if (!s || typeof s !== "object") return "";
        const ps = Array.isArray(s.paragraphs) ? s.paragraphs : [];
        return `<section><h2>${escapeHTML(s.heading || "")}</h2>${ps.map(x => `<p>${escapeHTML(x)}</p>`).join("")}</section>`;
    }).join("");
}

function pricingHTML(p) {
    return pricingOf(p).map(x => `<li><strong>${escapeHTML(x.duration)}</strong>: ${x.currency === "BDT" ? `৳${escapeHTML(x.price)}` : `${escapeHTML(x.price)} ${escapeHTML(x.currency)}`}${x.discount ? ` — ${escapeHTML(x.discount)}` : ""}</li>`).join("");
}

function featuresHTML(p) {
    if (!Array.isArray(p.features)) return "";
    return `<section><h2>${escapeHTML(p.name)} Features</h2><ul>${p.features.filter(Boolean).map(x => `<li>${escapeHTML(x)}</li>`).join("")}</ul></section>`;
}

function faqHTML(p) {
    if (!Array.isArray(p.faq)) return "";
    return `<section><h2>Frequently Asked Questions</h2>${p.faq.filter(Boolean).map(x => `<details><summary>${escapeHTML(x.question || "")}</summary><p>${escapeHTML(x.answer || "")}</p></details>`).join("")}</section>`;
}

function relatedHTML(current, p) {
    const cat = categoryOf(p), out = [];
    for (const key of Object.keys(products)) {
        if (key === current) continue;
        if (categoryOf(products[key]) === cat) out.push({slug:key,name:products[key].name});
        if (out.length >= 8) break;
    }
    return out.length ? `<section><h2>More ${escapeHTML(cat)} Subscriptions</h2><ul>${out.map(x => `<li><a href="${SITE.domain}/product/${encodeURIComponent(x.slug)}">${escapeHTML(x.name)}</a></li>`).join("")}</ul></section>` : "";
}

function notFound(res) {
    res.statusCode = 404;
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.setHeader("X-Robots-Tag", "noindex, nofollow");
    return res.end(`<!doctype html><html><head><meta charset="utf-8"><title>Product Not Found</title></head><body><h1>Product Not Found</h1><a href="${SITE.domain}/">Return home</a></body></html>`);
}

module.exports = function handler(req, res) {
    try {
        if (!req || !res) throw new Error("Invalid Vercel request/response objects");
        if (req.method !== "GET" && req.method !== "HEAD") { res.statusCode=405; res.setHeader("Allow","GET, HEAD"); return res.end("Method Not Allowed"); }
        if (productLoadError && Object.keys(products).length === 0) throw productLoadError;

        const slug = getSlug(req), p = slug ? products[slug] : null;
        if (!p) return notFound(res);

        const url = `${SITE.domain}/product/${encodeURIComponent(slug)}`;
        const destination = `${SITE.domain}/details.html?name=${encodeURIComponent(p.name)}`;
        const image = absoluteURL(p.image || SITE.logo);
        const seo = seoOf(slug,p), description = seo.description || `${p.name} subscription from ${SITE.name}.`, category = categoryOf(p);

        res.statusCode=200;
        res.setHeader("Content-Type","text/html; charset=utf-8");
        res.setHeader("Content-Language",SITE.language);
        res.setHeader("X-Content-Type-Options","nosniff");
        res.setHeader("X-Robots-Tag","index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1");
        res.setHeader("Cache-Control","public, max-age=300, s-maxage=3600, stale-while-revalidate=86400");
        if (req.method === "HEAD") return res.end();

        const productSchema = schemaProduct(p,url,image,description);
        const breadcrumbSchema = {"@context":"https://schema.org","@type":"BreadcrumbList",itemListElement:[
            {"@type":"ListItem",position:1,name:"Home",item:SITE.domain+"/"},
            {"@type":"ListItem",position:2,name:category,item:SITE.domain+"/"},
            {"@type":"ListItem",position:3,name:p.name,item:url}
        ]};

        const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${escapeHTML(seo.title)}</title><meta name="description" content="${escapeHTML(description)}"><meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"><link rel="canonical" href="${escapeHTML(url)}">
<meta property="og:type" content="product"><meta property="og:site_name" content="${escapeHTML(SITE.name)}"><meta property="og:title" content="${escapeHTML(seo.title)}"><meta property="og:description" content="${escapeHTML(description)}"><meta property="og:url" content="${escapeHTML(url)}"><meta property="og:image" content="${escapeHTML(image)}">
<meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${escapeHTML(seo.title)}"><meta name="twitter:description" content="${escapeHTML(description)}"><meta name="twitter:image" content="${escapeHTML(image)}">
<script type="application/ld+json">${safeJSON(productSchema)}</script><script type="application/ld+json">${safeJSON(breadcrumbSchema)}</script>
<style>html,body{margin:0;padding:0;font-family:Arial,Helvetica,sans-serif;color:#111;background:#fff}.seo{max-width:1100px;margin:auto;padding:24px;box-sizing:border-box;line-height:1.65}.seo h1{font-size:32px}.seo img{max-width:100%;height:auto;border-radius:12px}.seo li{margin:6px 0}iframe{display:block;width:100%;height:100vh;border:0}</style></head><body>
<main class="seo"><nav><a href="${SITE.domain}/">Home</a> / ${escapeHTML(category)} / ${escapeHTML(p.name)}</nav><article><h1>${escapeHTML(p.name)} Subscription</h1><p>${escapeHTML(seo.intro)}</p><img src="${escapeHTML(image)}" alt="${escapeHTML(p.name)}" width="1200" height="630">${sectionsHTML(seo.sections)}<section><h2>Plans &amp; Prices</h2><ul>${pricingHTML(p)}</ul></section>${featuresHTML(p)}${faqHTML(p)}${relatedHTML(slug,p)}</article></main>
<iframe src="${escapeHTML(destination)}" title="${escapeHTML(p.name)}" loading="eager" allow="fullscreen"></iframe></body></html>`;
        return res.end(html);
    } catch (error) {
        console.error("NEXT LEVEL SUBS product function error:", error && error.stack ? error.stack : error);
        res.statusCode=500;
        res.setHeader("Content-Type","application/json; charset=utf-8");
        return res.end(JSON.stringify({error:"Internal Server Error",message:error && error.message ? error.message : "Unknown error"}));
    }
};