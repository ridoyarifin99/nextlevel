"use strict";

// Vercel Node serverless handler for /product/:slug.
// IMPORTANT: details.js is already a CommonJS data module. Do not execute it
// inside a VM/browser sandbox; that was the source of the previous fragile
// server-side loading path.
const productsSource = require("../js/details.js");
const seoContentSource = require("./seo-content.js");

const SITE = {
    name: "NEXT LEVEL SUBS",
    domain: "https://www.nextlevelsubs.com",
    language: "en",
    locale: "en_US",
    logo: "/assets/logo.png"
};

const slugAliases = {
    netflix: "netflix-premium",
    duolingo: "doulingo",
    "youtube-premium-nonrenewable": "youtube-premium-non-renewable"
};

function slugify(value) {
    return String(value == null ? "" : value)
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
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function safeJSON(value) {
    try {
        return JSON.stringify(value == null ? null : value)
            .replace(/</g, "\\u003c")
            .replace(/>/g, "\\u003e")
            .replace(/&/g, "\\u0026")
            .replace(/\u2028/g, "\\u2028")
            .replace(/\u2029/g, "\\u2029");
    } catch (_) {
        return "null";
    }
}

function normalizeProducts(source) {
    const list = Array.isArray(source)
        ? source
        : source && typeof source === "object"
            ? Object.keys(source).map((key) => source[key])
            : [];

    const map = Object.create(null);
    for (const product of list) {
        if (!product || typeof product !== "object" || !product.name) continue;
        const key = slugify(product.slug || product.name);
        if (key && !map[key]) map[key] = product;
    }
    return map;
}

const products = normalizeProducts(productsSource);
const seoContent = seoContentSource && typeof seoContentSource === "object"
    ? seoContentSource
    : Object.create(null);

function resolveSlug(value) {
    if (typeof value !== "string") return "";

    let slug = value.trim();
    try { slug = decodeURIComponent(slug); } catch (_) {}
    slug = slugify(slug);

    if (products[slug]) return slug;

    const alias = slugAliases[slug];
    if (alias && products[alias]) return alias;

    for (const key of Object.keys(products)) {
        if (slugify(products[key].name) === slug) return key;
    }

    return "";
}

function getSlug(req) {
    const querySlug = req && req.query && typeof req.query.slug === "string"
        ? req.query.slug
        : "";
    const fromQuery = resolveSlug(querySlug);
    if (fromQuery) return fromQuery;

    const pathname = String(req && req.url ? req.url : "").split("?")[0];
    const match = pathname.match(/^\/(?:product|products)\/([^/]+)\/?$/i);
    return match ? resolveSlug(match[1]) : "";
}

function absoluteURL(value) {
    if (!value) return SITE.domain + SITE.logo;
    const text = String(value).trim();
    if (/^https?:\/\//i.test(text)) return text;
    const clean = text.replace(/^\.\//, "/");
    return SITE.domain + (clean.startsWith("/") ? "" : "/") + clean;
}

function categoryOf(product) {
    if (product && typeof product.category === "string" && product.category.trim()) {
        return product.category.trim();
    }
    if (product && Array.isArray(product.categories) && product.categories.length) {
        return product.categories
            .filter(Boolean)
            .map((x) => String(x).replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()))
            .join(", ");
    }
    return "Digital Services";
}

function pricingOf(product) {
    if (!product || !Array.isArray(product.pricing)) return [];
    return product.pricing
        .filter((p) => p && p.duration && p.price != null)
        .map((p) => ({
            duration: String(p.duration),
            price: Number(p.price),
            currency: p.currency || "BDT",
            popular: !!p.popular,
            discount: p.discount || ""
        }))
        .filter((p) => Number.isFinite(p.price));
}

function seoOf(slug, product) {
    const custom = seoContent[slug];
    if (custom && typeof custom === "object") {
        return {
            title: custom.title || `${product.name} Subscription | ${SITE.name}`,
            description: custom.description || `${product.description || "Premium subscription service"}. Get ${product.name} from ${SITE.name}.`,
            intro: custom.intro || `Get ${product.name} from ${SITE.name}.`,
            sections: Array.isArray(custom.sections) ? custom.sections : []
        };
    }
    return {
        title: `${product.name} Subscription | ${SITE.name}`,
        description: `${product.description || "Premium subscription service"}. Get ${product.name} from ${SITE.name}.`,
        intro: `Get ${product.name} from ${SITE.name}. ${product.description || "Premium subscription service."}`,
        sections: []
    };
}

function schemaProduct(product, url, image, description) {
    const schema = {
        "@context": "https://schema.org",
        "@type": "Product",
        "@id": url + "#product",
        name: product.name,
        description,
        image: [image],
        url,
        category: categoryOf(product),
        brand: { "@type": "Brand", name: SITE.name },
        seller: { "@type": "Organization", name: SITE.name, url: SITE.domain }
    };

    const rating = Number(product.rating);
    const reviews = Number(product.reviews);
    if (Number.isFinite(rating) && Number.isFinite(reviews) && reviews > 0) {
        schema.aggregateRating = {
            "@type": "AggregateRating",
            ratingValue: rating,
            reviewCount: reviews
        };
    }

    const pricing = pricingOf(product);
    if (pricing.length) {
        schema.offers = pricing.map((p) => ({
            "@type": "Offer",
            url,
            priceCurrency: p.currency,
            price: p.price,
            name: `${product.name} - ${p.duration}`,
            availability: "https://schema.org/InStock",
            seller: { "@type": "Organization", name: SITE.name }
        }));
    }

    return schema;
}

function seoSections(seo) {
    if (!Array.isArray(seo.sections)) return "";
    return seo.sections.map((section) => {
        if (!section || typeof section !== "object") return "";
        const paragraphs = Array.isArray(section.paragraphs) ? section.paragraphs : [];
        return `<section><h2>${escapeHTML(section.heading || "")}</h2>${paragraphs.map((p) => `<p>${escapeHTML(p)}</p>`).join("")}</section>`;
    }).join("");
}

function pricingHTML(product) {
    return pricingOf(product).map((p) => {
        const price = p.currency === "BDT"
            ? `৳${escapeHTML(p.price)}`
            : `${escapeHTML(p.price)} ${escapeHTML(p.currency)}`;
        const discount = p.discount ? ` — ${escapeHTML(p.discount)}` : "";
        return `<li><strong>${escapeHTML(p.duration)}</strong>: ${price}${discount}</li>`;
    }).join("");
}

function featuresHTML(product) {
    if (!Array.isArray(product.features)) return "";
    const items = product.features.filter(Boolean).map((x) => `<li>${escapeHTML(x)}</li>`).join("");
    return `<section><h2>${escapeHTML(product.name)} Features</h2><ul>${items}</ul></section>`;
}

function faqHTML(product) {
    if (!Array.isArray(product.faq)) return "";
    const items = product.faq.filter(Boolean).map((x) =>
        `<details><summary>${escapeHTML(x.question || "")}</summary><p>${escapeHTML(x.answer || "")}</p></details>`
    ).join("");
    return `<section><h2>Frequently Asked Questions</h2>${items}</section>`;
}

function relatedHTML(currentSlug, product) {
    const currentCategory = categoryOf(product);
    const items = [];

    for (const key of Object.keys(products)) {
        if (key === currentSlug) continue;
        const p = products[key];
        if (p && categoryOf(p) === currentCategory) {
            items.push({ slug: key, name: p.name });
        }
        if (items.length >= 8) break;
    }

    if (!items.length) return "";
    return `<section><h2>More ${escapeHTML(currentCategory)} Subscriptions</h2><ul>${items.map((x) =>
        `<li><a href="${SITE.domain}/product/${encodeURIComponent(x.slug)}">${escapeHTML(x.name)}</a></li>`
    ).join("")}</ul></section>`;
}

function notFound(res) {
    res.statusCode = 404;
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.setHeader("X-Robots-Tag", "noindex, nofollow");
    return res.end(`<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Product Not Found | ${escapeHTML(SITE.name)}</title></head><body><h1>Product Not Found</h1><p>The requested product could not be found.</p><a href="${SITE.domain}/">Return home</a></body></html>`);
}

module.exports = function handler(req, res) {
    try {
        if (!req || !res) throw new Error("Invalid Vercel request/response objects");

        if (req.method !== "GET" && req.method !== "HEAD") {
            res.statusCode = 405;
            res.setHeader("Allow", "GET, HEAD");
            return res.end("Method Not Allowed");
        }

        const slug = getSlug(req);
        const product = slug ? products[slug] : null;
        if (!product) return notFound(res);

        const url = `${SITE.domain}/product/${encodeURIComponent(slug)}`;
        const destination = `${SITE.domain}/details.html?name=${encodeURIComponent(product.name)}`;
        const image = absoluteURL(product.image || SITE.logo);
        const seo = seoOf(slug, product);
        const description = seo.description || `${product.name} subscription from ${SITE.name}.`;
        const category = categoryOf(product);

        res.statusCode = 200;
        res.setHeader("Content-Type", "text/html; charset=utf-8");
        res.setHeader("Content-Language", SITE.language);
        res.setHeader("X-Content-Type-Options", "nosniff");
        res.setHeader("X-Robots-Tag", "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1");
        res.setHeader("Cache-Control", "public, max-age=300, s-maxage=3600, stale-while-revalidate=86400");

        if (req.method === "HEAD") return res.end();

        const productSchema = schemaProduct(product, url, image, description);
        const breadcrumbSchema = {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
                { "@type": "ListItem", position: 1, name: "Home", item: SITE.domain + "/" },
                { "@type": "ListItem", position: 2, name: category, item: SITE.domain + "/" },
                { "@type": "ListItem", position: 3, name: product.name, item: url }
            ]
        };

        const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escapeHTML(seo.title)}</title>
<meta name="description" content="${escapeHTML(description)}">
<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1">
<link rel="canonical" href="${escapeHTML(url)}">
<meta property="og:type" content="product">
<meta property="og:site_name" content="${escapeHTML(SITE.name)}">
<meta property="og:title" content="${escapeHTML(seo.title)}">
<meta property="og:description" content="${escapeHTML(description)}">
<meta property="og:url" content="${escapeHTML(url)}">
<meta property="og:image" content="${escapeHTML(image)}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${escapeHTML(seo.title)}">
<meta name="twitter:description" content="${escapeHTML(description)}">
<meta name="twitter:image" content="${escapeHTML(image)}">
<script type="application/ld+json">${safeJSON(productSchema)}</script>
<script type="application/ld+json">${safeJSON(breadcrumbSchema)}</script>
<style>
html,body{margin:0;padding:0;width:100%;min-height:100%;font-family:Arial,Helvetica,sans-serif;background:#fff;color:#111}
.seo{max-width:1100px;margin:0 auto;padding:24px;box-sizing:border-box}
.seo nav{font-size:14px;margin-bottom:18px}.seo article{line-height:1.65}.seo h1{font-size:32px;margin:0 0 12px}.seo h2{font-size:22px;margin-top:28px}.seo img{max-width:100%;height:auto;display:block;margin:18px 0;border-radius:12px}.seo li{margin:6px 0}.seo details{margin:10px 0}.seo summary{cursor:pointer;font-weight:700}
iframe{display:block;width:100%;height:100vh;border:0;margin:0;padding:0}
</style>
</head>
<body>
<main class="seo" aria-label="${escapeHTML(product.name)}">
<nav><a href="${SITE.domain}/">Home</a> / ${escapeHTML(category)} / ${escapeHTML(product.name)}</nav>
<article><h1>${escapeHTML(product.name)} Subscription</h1><p>${escapeHTML(seo.intro)}</p><img src="${escapeHTML(image)}" alt="${escapeHTML(product.name)}" width="1200" height="630">${seoSections(seo)}<section><h2>Plans &amp; Prices</h2><ul>${pricingHTML(product)}</ul></section>${featuresHTML(product)}${faqHTML(product)}${relatedHTML(slug, product)}</article>
</main>
<iframe src="${escapeHTML(destination)}" title="${escapeHTML(product.name)}" loading="eager" allow="fullscreen"></iframe>
</body>
</html>`;

        return res.end(html);
    } catch (error) {
        console.error("NEXT LEVEL SUBS product function error:", error && error.stack ? error.stack : error);
        try {
            res.statusCode = 500;
            res.setHeader("Content-Type", "application/json; charset=utf-8");
            return res.end(JSON.stringify({
                error: "Internal Server Error",
                message: error && error.message ? error.message : "Unknown error"
            }));
        } catch (_) {
            return res.end();
        }
    }
};
