"use strict";

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

const slugAliases = {
    netflix: "netflix-premium",
    duolingo: "doulingo",
    "youtube-premium-nonrenewable": "youtube-premium-non-renewable"
};

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

function makeSandbox() {
    const noop = function () {};
    const element = function () {
        return {
            style: {},
            classList: { add: noop, remove: noop, toggle: noop, contains: () => false },
            addEventListener: noop,
            removeEventListener: noop,
            appendChild: noop,
            setAttribute: noop,
            getAttribute: () => null,
            querySelector: () => null,
            querySelectorAll: () => [],
            closest: () => null,
            innerHTML: "",
            textContent: ""
        };
    };

    const document = {
        createElement: element,
        getElementById: () => null,
        querySelector: () => null,
        querySelectorAll: () => [],
        addEventListener: noop,
        removeEventListener: noop,
        body: element(),
        documentElement: element()
    };

    const window = {
        document,
        location: { href: "", pathname: "/", search: "", origin: SITE.domain },
        addEventListener: noop,
        removeEventListener: noop,
        setTimeout,
        clearTimeout,
        setInterval,
        clearInterval,
        localStorage: { getItem: () => null, setItem: noop, removeItem: noop },
        sessionStorage: { getItem: () => null, setItem: noop, removeItem: noop }
    };

    return {
        window,
        document,
        localStorage: window.localStorage,
        sessionStorage: window.sessionStorage,
        console,
        AOS: { init: noop, refresh: noop },
        setTimeout,
        clearTimeout,
        setInterval,
        clearInterval
    };
}

function loadProducts() {
    try {
        const filePath = path.resolve(__dirname, "../js/details.js");
        if (!fs.existsSync(filePath)) {
            console.error("NEXT LEVEL SUBS: details.js not found:", filePath);
            return Object.create(null);
        }

        const source = fs.readFileSync(filePath, "utf8");
        const sandbox = makeSandbox();
        vm.createContext(sandbox);

        // details.js declares `const products = [...]` and does not reliably
        // expose that lexical binding on the VM global object. Returning it
        // from the same VM script avoids the previous empty-product bug.
        const result = vm.runInContext(
            "(function(){\n" + source + "\n;return typeof products !== 'undefined' ? products : (typeof rawSubs !== 'undefined' ? rawSubs : null);\n})()",
            sandbox,
            { timeout: 3000, displayErrors: true }
        );

        let list = result;
        if (!Array.isArray(list) && list && typeof list === "object") {
            list = Object.keys(list).map((key) => list[key]);
        }
        if (!Array.isArray(list)) {
            throw new Error("details.js did not produce a products array");
        }

        const map = Object.create(null);
        for (const product of list) {
            if (!product || !product.name) continue;
            const key = slugify(product.slug || product.name);
            if (key && !map[key]) map[key] = product;
        }

        return map;
    } catch (error) {
        console.error("NEXT LEVEL SUBS: product data load failed:", error && error.stack ? error.stack : error);
        return Object.create(null);
    }
}

function loadSEOContent() {
    try {
        const value = require("./seo-content.js");
        return value && typeof value === "object" ? value : Object.create(null);
    } catch (error) {
        console.warn("NEXT LEVEL SUBS: SEO content unavailable:", error && error.message ? error.message : error);
        return Object.create(null);
    }
}

const products = loadProducts();
const seoContent = loadSEOContent();

function resolveSlug(value) {
    if (typeof value !== "string") return "";
    let slug = value.trim();
    try { slug = decodeURIComponent(slug); } catch (_) {}
    slug = slugify(slug);

    if (products[slug]) return slug;
    if (slugAliases[slug] && products[slugAliases[slug]]) return slugAliases[slug];

    for (const key of Object.keys(products)) {
        if (slugify(products[key].name) === slug) return key;
    }
    return "";
}

function getSlug(req) {
    const querySlug = req && req.query && typeof req.query.slug === "string" ? req.query.slug : "";
    const fromQuery = resolveSlug(querySlug);
    if (fromQuery) return fromQuery;

    const pathname = String((req && req.url) || "").split("?")[0];
    const match = pathname.match(/^\/product\/([^/]+)\/?$/i);
    return match ? resolveSlug(match[1]) : "";
}

function absoluteURL(value) {
    if (!value) return SITE.domain + SITE.logo;
    if (/^https?:\/\//i.test(String(value))) return String(value);
    return SITE.domain + (String(value).startsWith("/") ? "" : "/") + String(value);
}

function categoryOf(product) {
    if (product && typeof product.category === "string" && product.category.trim()) {
        return product.category.trim();
    }
    if (product && Array.isArray(product.categories) && product.categories.length) {
        return product.categories.filter(Boolean).map((x) => String(x).replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())).join(", ");
    }
    return "Digital Services";
}

function pricingOf(product) {
    if (!product || !Array.isArray(product.pricing)) return [];
    return product.pricing.filter((p) => p && p.duration && p.price != null).map((p) => ({
        duration: String(p.duration),
        price: Number(p.price),
        currency: p.currency || "BDT",
        popular: !!p.popular,
        discount: p.discount || ""
    })).filter((p) => Number.isFinite(p.price));
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
        schema.aggregateRating = { "@type": "AggregateRating", ratingValue: rating, reviewCount: reviews };
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
        if (!section) return "";
        const paragraphs = Array.isArray(section.paragraphs) ? section.paragraphs : [];
        return `<section><h2>${escapeHTML(section.heading || "")}</h2>${paragraphs.map((p) => `<p>${escapeHTML(p)}</p>`).join("")}</section>`;
    }).join("");
}

function pricingHTML(product) {
    return pricingOf(product).map((p) => `<li><strong>${escapeHTML(p.duration)}</strong>: ${p.currency === "BDT" ? "৳" : ""}${escapeHTML(p.price)} ${p.currency !== "BDT" ? escapeHTML(p.currency) : ""}${p.discount ? ` — ${escapeHTML(p.discount)}` : ""}</li>`).join("");
}

function featuresHTML(product) {
    if (!Array.isArray(product.features)) return "";
    return `<section><h2>${escapeHTML(product.name)} Features</h2><ul>${product.features.filter(Boolean).map((x) => `<li>${escapeHTML(x)}</li>`).join("")}</ul></section>`;
}

function faqHTML(product) {
    if (!Array.isArray(product.faq)) return "";
    return `<section><h2>Frequently Asked Questions</h2>${product.faq.filter(Boolean).map((x) => `<details><summary>${escapeHTML(x.question || "")}</summary><p>${escapeHTML(x.answer || "")}</p></details>`).join("")}</section>`;
}

function relatedHTML(currentSlug, product) {
    const currentCategory = categoryOf(product);
    const items = [];
    for (const key of Object.keys(products)) {
        if (key === currentSlug) continue;
        const p = products[key];
        if (p && categoryOf(p) === currentCategory) items.push({ slug: key, name: p.name });
        if (items.length >= 8) break;
    }
    if (!items.length) return "";
    return `<section><h2>More ${escapeHTML(currentCategory)} Subscriptions</h2><ul>${items.map((x) => `<li><a href="${SITE.domain}/product/${encodeURIComponent(x.slug)}">${escapeHTML(x.name)}</a></li>`).join("")}</ul></section>`;
}

function notFound(res) {
    res.statusCode = 404;
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.setHeader("X-Robots-Tag", "noindex, nofollow");
    return res.end(`<!doctype html><html><head><meta charset="utf-8"><title>Product Not Found | ${escapeHTML(SITE.name)}</title></head><body><h1>Product Not Found</h1><p>The requested product could not be found.</p><a href="${SITE.domain}/">Return home</a></body></html>`);
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

        res.statusCode = 200;
        res.setHeader("Content-Type", "text/html; charset=utf-8");
        res.setHeader("Content-Language", SITE.language);
        res.setHeader("X-Content-Type-Options", "nosniff");
        res.setHeader("X-Robots-Tag", "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1");
        res.setHeader("Cache-Control", "public, max-age=300, s-maxage=3600, stale-while-revalidate=86400");
        if (req.method === "HEAD") return res.end();

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
<style>html,body{margin:0;padding:0;width:100%;min-height:100%;font-family:Arial,Helvetica,sans-serif} .seo{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);clip-path:inset(50%)} iframe{display:block;width:100%;height:100vh;min-height:700px;border:0}</style>
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
            return res.end(JSON.stringify({ error: "Internal Server Error", message: error && error.message ? error.message : "Unknown error" }));
        } catch (_) {
            return res.end();
        }
    }
};
