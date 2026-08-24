// ============================================================
// NEXT LEVEL SUBS
// HYBRID PRODUCT SEO / OPEN GRAPH / SOCIAL PREVIEW HANDLER
// ============================================================
//
// URL:
// https://www.nextlevelsubs.com/product/hbo-max
//
// Architecture:
//
//   /product/{slug}
//          |
//          +-- Server-rendered SEO HTML
//          |
//          +-- Product JSON-LD
//          +-- Breadcrumb JSON-LD
//          +-- FAQ JSON-LD
//          +-- Open Graph
//          +-- Twitter/X
//          |
//          +-- iframe -> details.html
//
// IMPORTANT:
// The iframe remains responsible for the existing interactive
// product UI.
//
// The outer page now contains real crawlable product content.
// This makes the page substantially stronger for SEO while
// preserving the existing product interface.
//
// ============================================================

"use strict";

// ============================================================
// SITE CONFIG
// ============================================================

const SITE = {
    name: "NEXT LEVEL SUBS",
    domain: "https://www.nextlevelsubs.com",
    defaultDescription:
        "Premium subscriptions, streaming services, VPNs, AI tools, cloud storage and more from NEXT LEVEL SUBS.",
    locale: "en_US",
    language: "en"
};

// ============================================================
// HTML ESCAPE
// ============================================================

function escapeHTML(value) {
    return String(value == null ? "" : value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

// ============================================================
// SAFE JSON-LD
// ============================================================

function safeJSON(value) {
    return JSON.stringify(value)
        .replace(/</g, "\\u003c")
        .replace(/>/g, "\\u003e")
        .replace(/&/g, "\\u0026")
        .replace(/\u2028/g, "\\u2028")
        .replace(/\u2029/g, "\\u2029");
}

// ============================================================
// SLUG GENERATOR
// ============================================================

function generateSlug(value) {
    return String(value || "")
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
}

// ============================================================
// BUILD PRODUCT INDEX
// ============================================================

function buildProductIndex() {
    const index = Object.create(null);

    Object.keys(products).forEach(function (key) {
        index[key.toLowerCase()] = key;

        const generated = generateSlug(
            products[key].name
        );

        if (generated) {
            index[generated] = key;
        }
    });

    Object.keys(slugAliases).forEach(function (alias) {
        const target = slugAliases[alias];

        if (products[target]) {
            index[alias.toLowerCase()] = target;
        }
    });

    return index;
}

const productIndex = buildProductIndex();

// ============================================================
// RESOLVE PRODUCT KEY
// ============================================================

function resolveProductKey(value) {
    if (typeof value !== "string") {
        return "";
    }

    let decoded = value.trim();

    try {
        decoded = decodeURIComponent(decoded);
    } catch (_) {}

    decoded = decoded
        .trim()
        .toLowerCase()
        .replace(/^\/+|\/+$/g, "");

    if (products[decoded]) {
        return decoded;
    }

    if (productIndex[decoded]) {
        return productIndex[decoded];
    }

    const generated = generateSlug(decoded);

    return productIndex[generated] || "";
}

// ============================================================
// GET PRODUCT SLUG
// ============================================================

function getProductSlug(req) {

    // --------------------------------------------------------
    // API QUERY
    // /api/product?slug=hbo-max
    // --------------------------------------------------------

    if (
        req.query &&
        typeof req.query.slug === "string" &&
        req.query.slug.trim()
    ) {
        const resolved = resolveProductKey(
            req.query.slug
        );

        if (resolved) {
            return resolved;
        }
    }

    // --------------------------------------------------------
    // CLEAN URL
    // /product/hbo-max
    // --------------------------------------------------------

    const rawURL = req.url || "";

    const pathname = rawURL.split("?")[0];

    const match = pathname.match(
        /^\/product\/([^/]+)\/?$/i
    );

    if (!match || !match[1]) {
        return "";
    }

    return resolveProductKey(match[1]);
}

// ============================================================
// BUILD ABSOLUTE URL
// ============================================================

function absoluteURL(path) {

    if (!path) {
        return `${SITE.domain}/assets/logo.png`;
    }

    if (/^https?:\/\//i.test(path)) {
        return path;
    }

    return (
        SITE.domain +
        (path.startsWith("/") ? "" : "/") +
        path
    );
}

// ============================================================
// CLEAN TEXT
// ============================================================

function cleanText(value) {
    return String(value || "")
        .replace(/\s+/g, " ")
        .trim();
}

// ============================================================
// GET PRODUCT SEO DATA
// ============================================================

function getSEOData(product, slug) {

    const name =
        cleanText(product.name) || "Product";

    const baseDescription =
        cleanText(product.description);

    const seo =
        product.seo || {};

    const title =
        cleanText(product.seoTitle) ||
        `${name} Subscription | NEXT LEVEL SUBS`;

    const description =
        cleanText(product.seoDescription) ||
        (
            baseDescription
                ? `${baseDescription} Get ${name} subscription from NEXT LEVEL SUBS.`
                : `Get ${name} subscription from NEXT LEVEL SUBS.`
        );

    const intro =
        cleanText(seo.intro) ||
        (
            baseDescription
                ? `Get ${name} subscription from NEXT LEVEL SUBS. ${baseDescription}.`
                : `Get ${name} subscription from NEXT LEVEL SUBS.`
        );

    const heading =
        cleanText(seo.heading) ||
        `${name} Subscription`;

    const content =
        cleanText(seo.content) ||
        (
            baseDescription
                ? `${name} offers premium entertainment and features. ${baseDescription}. Choose a subscription plan from NEXT LEVEL SUBS.`
                : `Choose a ${name} subscription from NEXT LEVEL SUBS and enjoy premium features and content.`
        );

    const features =
        Array.isArray(seo.features)
            ? seo.features
                .map(cleanText)
                .filter(Boolean)
            : [];

    const faqs =
        Array.isArray(seo.faqs)
            ? seo.faqs
                .filter(function (faq) {
                    return (
                        faq &&
                        cleanText(faq.question) &&
                        cleanText(faq.answer)
                    );
                })
                .map(function (faq) {
                    return {
                        question:
                            cleanText(faq.question),
                        answer:
                            cleanText(faq.answer)
                    };
                })
            : [];

    return {
        name,
        title,
        description,
        heading,
        intro,
        content,
        features,
        faqs,
        slug
    };
}

// ============================================================
// PRODUCT OFFER SCHEMA
// ============================================================
//
// Supports optional:
//
// product.price
// product.currency
// product.availability
//
// We intentionally do NOT invent prices.
//
// ============================================================

function buildOfferSchema(
    product,
    productURL
) {

    const price =
        product.price != null
            ? String(product.price)
            : "";

    const currency =
        cleanText(
            product.currency || "BDT"
        );

    if (!price) {
        return null;
    }

    const offer = {
        "@type": "Offer",
        "url": productURL,
        "priceCurrency": currency,
        "price": price,
        "availability":
            product.availability ||
            "https://schema.org/InStock"
    };

    return offer;
}

// ============================================================
// PRODUCT JSON-LD
// ============================================================

function buildProductSchema(
    product,
    seo,
    productURL,
    imageURL
) {

    const schema = {
        "@context": "https://schema.org",
        "@type": "Product",
        "name": seo.name,
        "description": seo.description,
        "image": [imageURL],
        "url": productURL,
        "category":
            cleanText(product.category) ||
            "Subscription"
    };

    // --------------------------------------------------------
    // Brand
    // --------------------------------------------------------

    schema.brand = {
        "@type": "Brand",
        "name": seo.name
    };

    // --------------------------------------------------------
    // Seller
    // --------------------------------------------------------

    schema.offers = undefined;

    const offer =
        buildOfferSchema(
            product,
            productURL
        );

    if (offer) {
        schema.offers = offer;
    }

    return schema;
}

// ============================================================
// BREADCRUMB JSON-LD
// ============================================================

function buildBreadcrumbSchema(
    product,
    productURL
) {

    return {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [

            {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": `${SITE.domain}/`
            },

            {
                "@type": "ListItem",
                "position": 2,
                "name":
                    cleanText(product.category) ||
                    "Products",
                "item":
                    `${SITE.domain}/`
            },

            {
                "@type": "ListItem",
                "position": 3,
                "name": cleanText(product.name),
                "item": productURL
            }

        ]
    };
}

// ============================================================
// FAQ JSON-LD
// ============================================================

function buildFAQSchema(faqs) {

    if (!Array.isArray(faqs) || !faqs.length) {
        return null;
    }

    return {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity":
            faqs.map(function (faq) {

                return {
                    "@type": "Question",
                    "name": faq.question,
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": faq.answer
                    }
                };

            })
    };
}

// ============================================================
// SEND 404
// ============================================================

function send404(res) {

    res.statusCode = 404;

    res.setHeader(
        "Content-Type",
        "text/html; charset=utf-8"
    );

    res.setHeader(
        "X-Robots-Tag",
        "noindex, nofollow"
    );

    return res.end(`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0"
    >
    <title>Product Not Found | NEXT LEVEL SUBS</title>
    <meta
        name="robots"
        content="noindex, nofollow"
    >
</head>

<body>

    <h1>Product Not Found</h1>

    <p>
        The requested product could not be found.
    </p>

    <p>
        <a href="${escapeHTML(SITE.domain)}/">
            Return to NEXT LEVEL SUBS
        </a>
    </p>

</body>
</html>
`);
}

// ============================================================
// MAIN HANDLER
// ============================================================

module.exports = function handler(req, res) {

    // ========================================================
    // METHOD CHECK
    // ========================================================

    if (
        req.method !== "GET" &&
        req.method !== "HEAD"
    ) {

        res.statusCode = 405;

        res.setHeader(
            "Allow",
            "GET, HEAD"
        );

        return res.end(
            "Method Not Allowed"
        );
    }

    // ========================================================
    // RESOLVE PRODUCT
    // ========================================================

    const slug =
        getProductSlug(req);

    if (
        !slug ||
        !products[slug]
    ) {
        return send404(res);
    }

    const product =
        products[slug];

    // ========================================================
    // PRODUCT URL
    // ========================================================

    const productURL =
        `${SITE.domain}/product/${encodeURIComponent(slug)}`;

    // ========================================================
    // DETAILS PAGE
    // ========================================================

    const destinationURL =
        `${SITE.domain}/details.html?name=${encodeURIComponent(product.name)}`;

    // ========================================================
    // IMAGE
    // ========================================================

    let imageURL =
        absoluteURL(
            product.image || "/assets/logo.png"
        );

    // SVG social images can have inconsistent support.
    // Use the main logo as fallback.

    if (
        /\.svg(\?|#|$)/i.test(imageURL)
    ) {
        imageURL =
            `${SITE.domain}/assets/logo.png`;
    }

    // ========================================================
    // SEO DATA
    // ========================================================

    const seo =
        getSEOData(
            product,
            slug
        );

    // ========================================================
    // SCHEMAS
    // ========================================================

    const productSchema =
        buildProductSchema(
            product,
            seo,
            productURL,
            imageURL
        );

    const breadcrumbSchema =
        buildBreadcrumbSchema(
            product,
            productURL
        );

    const faqSchema =
        buildFAQSchema(
            seo.faqs
        );

    // ========================================================
    // RESPONSE HEADERS
    // ========================================================

    res.statusCode = 200;

    res.setHeader(
        "Content-Type",
        "text/html; charset=utf-8"
    );

    res.setHeader(
        "Content-Language",
        SITE.language
    );

    res.setHeader(
        "X-Content-Type-Options",
        "nosniff"
    );

    res.setHeader(
        "X-Robots-Tag",
        "index, follow, max-image-preview:large"
    );

    res.setHeader(
        "Cache-Control",
        "public, max-age=300, s-maxage=3600, stale-while-revalidate=86400"
    );

    // ========================================================
    // HEAD
    // ========================================================

    if (req.method === "HEAD") {
        return res.end();
    }

    // ========================================================
    // PRODUCT MAP
    // ========================================================

    const productMap =
        Object.keys(products).reduce(
            function (map, key) {

                map[key] = {
                    name:
                        products[key].name
                };

                return map;

            },
            {}
        );

    // ========================================================
    // FEATURES HTML
    // ========================================================

    const featuresHTML =
        seo.features.length
            ? `
<section class="seo-section">
    <h2>${escapeHTML(seo.name)} Features</h2>

    <ul>
        ${seo.features.map(function (feature) {
            return `
                <li>
                    ${escapeHTML(feature)}
                </li>
            `;
        }).join("")}
    </ul>
</section>
`
            : "";

    // ========================================================
    // FAQ HTML
    // ========================================================

    const faqHTML =
        seo.faqs.length
            ? `
<section class="seo-section seo-faq">
    <h2>Frequently Asked Questions</h2>

    ${seo.faqs.map(function (faq) {
        return `
        <article class="faq-item">

            <h3>
                ${escapeHTML(faq.question)}
            </h3>

            <p>
                ${escapeHTML(faq.answer)}
            </p>

        </article>
        `;
    }).join("")}

</section>
`
            : "";

    // ========================================================
    // SEO CONTENT
    // ========================================================

    const seoContentHTML = `

<main
    id="seoProductContent"
    class="seo-product-content"
>

    <div class="seo-container">

        <nav
            class="seo-breadcrumbs"
            aria-label="Breadcrumb"
        >

            <a href="/">
                Home
            </a>

            <span aria-hidden="true">
                /
            </span>

            <span>
                ${escapeHTML(
                    product.category || "Products"
                )}
            </span>

            <span aria-hidden="true">
                /
            </span>

            <span>
                ${escapeHTML(seo.name)}
            </span>

        </nav>

        <article>

            <header>

                <h1>
                    ${escapeHTML(seo.heading)}
                </h1>

                <p class="seo-intro">
                    ${escapeHTML(seo.intro)}
                </p>

            </header>

            <section class="seo-section">

                <h2>
                    ${escapeHTML(
                        seo.name
                    )} Subscription
                </h2>

                <p>
                    ${escapeHTML(
                        seo.content
                    )}
                </p>

            </section>

            ${featuresHTML}

            ${faqHTML}

        </article>

    </div>

</main>
`;

    // ========================================================
    // FULL HTML
    // ========================================================

    const html = `
<!DOCTYPE html>

<html lang="${escapeHTML(SITE.language)}">

<head>

    <meta charset="UTF-8">

    <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0"
    >

    <!-- =====================================================
         PRIMARY SEO
         ===================================================== -->

    <title>
        ${escapeHTML(seo.title)}
    </title>

    <meta
        name="description"
        content="${escapeHTML(seo.description)}"
    >

    <meta
        name="robots"
        content="index, follow, max-image-preview:large"
    >

    <link
        rel="canonical"
        href="${escapeHTML(productURL)}"
    >

    <!-- =====================================================
         OPEN GRAPH
         ===================================================== -->

    <meta
        property="og:type"
        content="product"
    >

    <meta
        property="og:site_name"
        content="${escapeHTML(SITE.name)}"
    >

    <meta
        property="og:locale"
        content="${escapeHTML(SITE.locale)}"
    >

    <meta
        property="og:title"
        content="${escapeHTML(seo.title)}"
    >

    <meta
        property="og:description"
        content="${escapeHTML(seo.description)}"
    >

    <meta
        property="og:url"
        content="${escapeHTML(productURL)}"
    >

    <meta
        property="og:image"
        content="${escapeHTML(imageURL)}"
    >

    <meta
        property="og:image:secure_url"
        content="${escapeHTML(imageURL)}"
    >

    <meta
        property="og:image:type"
        content="image/jpeg"
    >

    <meta
        property="og:image:width"
        content="1200"
    >

    <meta
        property="og:image:height"
        content="630"
    >

    <meta
        property="og:image:alt"
        content="${escapeHTML(
            seo.name
        )} - NEXT LEVEL SUBS"
    >

    <!-- =====================================================
         TWITTER / X
         ===================================================== -->

    <meta
        name="twitter:card"
        content="summary_large_image"
    >

    <meta
        name="twitter:title"
        content="${escapeHTML(seo.title)}"
    >

    <meta
        name="twitter:description"
        content="${escapeHTML(seo.description)}"
    >

    <meta
        name="twitter:image"
        content="${escapeHTML(imageURL)}"
    >

    <meta
        name="twitter:image:alt"
        content="${escapeHTML(
            seo.name
        )} - NEXT LEVEL SUBS"
    >

    <!-- =====================================================
         PRODUCT JSON-LD
         ===================================================== -->

    <script type="application/ld+json">
${safeJSON(productSchema)}
    </script>

    <!-- =====================================================
         BREADCRUMB JSON-LD
         ===================================================== -->

    <script type="application/ld+json">
${safeJSON(breadcrumbSchema)}
    </script>

    ${
        faqSchema
            ? `
    <!-- =====================================================
         FAQ JSON-LD
         ===================================================== -->

    <script type="application/ld+json">
${safeJSON(faqSchema)}
    </script>
`
            : ""
    }

    <!-- =====================================================
         SEO CONTENT STYLE
         ===================================================== -->

    <style>

        html,
        body {
            margin: 0;
            padding: 0;
            width: 100%;
            min-height: 100%;
            background: #ffffff;
        }

        body {
            font-family:
                Arial,
                Helvetica,
                sans-serif;
            color: #171717;
        }

        .seo-product-content {
            width: 100%;
            box-sizing: border-box;
            background: #ffffff;
        }

        .seo-container {
            width: min(
                1100px,
                calc(100% - 40px)
            );

            margin: 0 auto;

            padding:
                24px
                0
                40px;
        }

        .seo-breadcrumbs {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;

            margin-bottom: 24px;

            font-size: 14px;
            line-height: 1.5;

            color: #666666;
        }

        .seo-breadcrumbs a {
            color: inherit;
            text-decoration: none;
        }

        .seo-breadcrumbs a:hover {
            text-decoration: underline;
        }

        .seo-container h1 {
            margin: 0 0 16px;

            font-size:
                clamp(
                    30px,
                    5vw,
                    46px
                );

            line-height: 1.15;

            color: #111111;
        }

        .seo-intro {
            max-width: 850px;

            margin: 0 0 28px;

            font-size: 18px;
            line-height: 1.75;

            color: #444444;
        }

        .seo-section {
            max-width: 850px;

            margin-top: 30px;
        }

        .seo-section h2 {
            margin:
                0 0 12px;

            font-size: 26px;
            line-height: 1.3;

            color: #111111;
        }

        .seo-section h3 {
            margin:
                0 0 8px;

            font-size: 18px;
            line-height: 1.4;

            color: #111111;
        }

        .seo-section p {
            margin:
                0 0 16px;

            font-size: 16px;
            line-height: 1.75;

            color: #444444;
        }

        .seo-section ul {
            margin:
                0 0 16px;

            padding-left: 22px;
        }

        .seo-section li {
            margin-bottom: 9px;

            font-size: 16px;
            line-height: 1.6;

            color: #444444;
        }

        .faq-item {
            margin-bottom: 24px;
        }

        /*
         * Visually keep the SEO section useful but compact.
         * The actual interactive product interface is below.
         */

        #productFrame {
            display: block;

            width: 100%;

            min-height: 1000px;

            border: 0;

            margin: 0;

            padding: 0;
        }

        @media (max-width: 600px) {

            .seo-container {
                width:
                    calc(100% - 28px);

                padding-top: 18px;
            }

            .seo-intro {
                font-size: 16px;
            }

            .seo-section p,
            .seo-section li {
                font-size: 15px;
            }

        }

    </style>

</head>

<body>

    <!-- =====================================================
         SERVER-RENDERED SEO CONTENT

         IMPORTANT:
         This is outside the iframe.

         Search engines can directly see this content.
         ===================================================== -->

    ${seoContentHTML}

    <!-- =====================================================
         EXISTING PRODUCT UI

         Your existing details.html remains untouched.
         ===================================================== -->

    <iframe
        id="productFrame"
        src="${escapeHTML(destinationURL)}"
        title="${escapeHTML(
            seo.name
        )}"
        loading="eager"
        allow="fullscreen"
    ></iframe>

    <!-- =====================================================
         PRODUCT NAVIGATION CONTROLLER
         ===================================================== -->

    <script>

    (function () {

        "use strict";

        // ====================================================
        // CONSTANTS
        // ====================================================

        var SITE_HOME =
            "${escapeHTML(SITE.domain)}/";

        var PRODUCT_BASE =
            SITE_HOME + "product/";

        var CURRENT_SLUG =
            "${escapeHTML(slug)}";

        var CURRENT_PRODUCT_NAME =
            ${safeJSON(product.name)};

        var frame =
            document.getElementById(
                "productFrame"
            );

        if (!frame) {
            return;
        }

        // ====================================================
        // PRODUCT MAP
        // ====================================================

        var PRODUCT_MAP =
            ${safeJSON(productMap)};

        // ====================================================
        // GENERATE SLUG
        // ====================================================

        function generateSlug(value) {

            return String(value || "")
                .toLowerCase()
                .trim()
                .replace(
                    /[^a-z0-9]+/g,
                    "-"
                )
                .replace(
                    /^-+|-+$/g,
                    ""
                );
        }

        // ====================================================
        // HOME
        // ====================================================

        function goHome() {

            window.top.location.href =
                SITE_HOME;
        }

        // ====================================================
        // PRODUCT NAVIGATION
        // ====================================================

        function goToProduct(
            targetSlug
        ) {

            if (!targetSlug) {
                return;
            }

            targetSlug =
                String(targetSlug)
                    .trim()
                    .toLowerCase();

            if (
                !PRODUCT_MAP[targetSlug]
            ) {
                return;
            }

            if (
                targetSlug ===
                CURRENT_SLUG
            ) {
                return;
            }

            window.top.location.href =
                PRODUCT_BASE +
                encodeURIComponent(
                    targetSlug
                );
        }

        // ====================================================
        // FIND SLUG FROM PRODUCT NAME
        // ====================================================

        function findSlugFromName(
            name
        ) {

            if (!name) {
                return "";
            }

            var decoded =
                String(name);

            try {
                decoded =
                    decodeURIComponent(
                        decoded
                    );
            } catch (_) {}

            decoded =
                decoded
                    .trim()
                    .toLowerCase();

            for (
                var key in PRODUCT_MAP
            ) {

                if (
                    !Object.prototype
                        .hasOwnProperty
                        .call(
                            PRODUCT_MAP,
                            key
                        )
                ) {
                    continue;
                }

                var productName =
                    String(
                        PRODUCT_MAP[key]
                            .name || ""
                    )
                        .trim()
                        .toLowerCase();

                if (
                    productName ===
                    decoded
                ) {
                    return key;
                }
            }

            var generated =
                generateSlug(
                    decoded
                );

            if (
                PRODUCT_MAP[generated]
            ) {
                return generated;
            }

            return "";
        }

        // ====================================================
        // FIND SLUG FROM URL
        // ====================================================

        function findSlugFromURL(
            url
        ) {

            if (!url) {
                return "";
            }

            try {

                var parsed =
                    new URL(
                        url,
                        window.location.origin
                    );

                var match =
                    parsed.pathname.match(
                        /^\/product\/([^/]+)\/?$/i
                    );

                if (
                    match &&
                    match[1]
                ) {

                    var directSlug =
                        decodeURIComponent(
                            match[1]
                        )
                            .trim()
                            .toLowerCase();

                    if (
                        PRODUCT_MAP[
                            directSlug
                        ]
                    ) {
                        return directSlug;
                    }
                }

                if (
                    parsed.pathname
                        .toLowerCase()
                        .indexOf(
                            "details.html"
                        ) !== -1
                ) {

                    var name =
                        parsed.searchParams.get(
                            "name"
                        );

                    if (name) {
                        return findSlugFromName(
                            name
                        );
                    }
                }

            } catch (_) {}

            return "";
        }

        // ====================================================
        // POSTMESSAGE
        // ====================================================

        window.addEventListener(
            "message",
            function (event) {

                if (!event.data) {
                    return;
                }

                // --------------------------------------------
                // HOME
                // --------------------------------------------

                if (
                    event.data.type ===
                    "NLS_GO_HOME"
                ) {

                    goHome();

                    return;
                }

                // --------------------------------------------
                // PRODUCT
                // --------------------------------------------

                if (
                    event.data.type ===
                    "NLS_NAVIGATE_PRODUCT"
                ) {

                    var targetSlug = "";

                    if (
                        event.data.productSlug
                    ) {

                        targetSlug =
                            findSlugFromName(
                                event.data
                                    .productSlug
                            );

                        if (
                            PRODUCT_MAP[
                                event.data
                                    .productSlug
                            ]
                        ) {

                            targetSlug =
                                event.data
                                    .productSlug;
                        }
                    }

                    if (
                        !targetSlug &&
                        event.data.productName
                    ) {

                        targetSlug =
                            findSlugFromName(
                                event.data
                                    .productName
                            );
                    }

                    if (targetSlug) {

                        goToProduct(
                            targetSlug
                        );
                    }
                }

            }
        );

        // ====================================================
        // POLL IFRAME LOCATION
        // ====================================================

        function pollFrameLocation() {

            try {

                var frameWin =
                    frame.contentWindow;

                if (
                    !frameWin ||
                    !frameWin.location
                ) {
                    return;
                }

                var href =
                    frameWin.location.href ||
                    "";

                if (!href) {
                    return;
                }

                var parsed =
                    new URL(href);

                var pathname =
                    parsed.pathname
                        .toLowerCase();

                // --------------------------------------------
                // HOME
                // --------------------------------------------

                if (
                    pathname === "/" ||
                    pathname ===
                        "/index.html"
                ) {

                    goHome();

                    return;
                }

                // --------------------------------------------
                // DETAILS
                // --------------------------------------------

                if (
                    pathname.indexOf(
                        "/details.html"
                    ) !== -1
                ) {

                    var name =
                        parsed.searchParams.get(
                            "name"
                        );

                    if (name) {

                        var targetSlug =
                            findSlugFromName(
                                name
                            );

                        if (
                            targetSlug &&
                            targetSlug !==
                                CURRENT_SLUG
                        ) {

                            goToProduct(
                                targetSlug
                            );
                        }
                    }
                }

                // --------------------------------------------
                // PRODUCT URL
                // --------------------------------------------

                var detectedSlug =
                    findSlugFromURL(
                        href
                    );

                if (
                    detectedSlug &&
                    detectedSlug !==
                        CURRENT_SLUG
                ) {

                    goToProduct(
                        detectedSlug
                    );
                }

            } catch (_) {}
        }

        // ====================================================
        // POLLING
        // ====================================================

        setInterval(
            pollFrameLocation,
            500
        );

        // ====================================================
        // IFRAME LOAD
        // ====================================================

        frame.addEventListener(
            "load",
            function () {

                try {

                    var frameWin =
                        frame.contentWindow;

                    var frameDoc =
                        frameWin.document;

                    // ----------------------------------------
                    // CLICK INTERCEPTION
                    // ----------------------------------------

                    frameDoc.addEventListener(
                        "click",
                        function (event) {

                            var target =
                                event.target;

                            if (!target) {
                                return;
                            }

                            // --------------------------------
                            // LINK
                            // --------------------------------

                            var link =
                                target.closest(
                                    "a"
                                );

                            if (link) {

                                var href =
                                    link.getAttribute(
                                        "href"
                                    ) || "";

                                var lower =
                                    href
                                        .toLowerCase()
                                        .trim();

                                // HOME

                                if (
                                    lower ===
                                        "/" ||
                                    lower ===
                                        "/index.html" ||
                                    lower.indexOf(
                                        "index.html"
                                    ) !== -1
                                ) {

                                    event.preventDefault();
                                    event.stopPropagation();

                                    goHome();

                                    return;
                                }

                                try {

                                    var url =
                                        new URL(
                                            href,
                                            frameWin
                                                .location
                                                .href
                                        );

                                    // HOME

                                    if (
                                        url.pathname ===
                                            "/" ||
                                        url.pathname
                                            .toLowerCase()
                                            .indexOf(
                                                "index.html"
                                            ) !== -1
                                    ) {

                                        event.preventDefault();
                                        event.stopPropagation();

                                        goHome();

                                        return;
                                    }

                                    // PRODUCT

                                    var matchedSlug =
                                        findSlugFromURL(
                                            url.href
                                        );

                                    if (
                                        matchedSlug &&
                                        matchedSlug !==
                                            CURRENT_SLUG
                                    ) {

                                        event.preventDefault();
                                        event.stopPropagation();

                                        goToProduct(
                                            matchedSlug
                                        );

                                        return;
                                    }

                                    // DETAILS

                                    var name =
                                        url.searchParams.get(
                                            "name"
                                        );

                                    if (name) {

                                        var nameSlug =
                                            findSlugFromName(
                                                name
                                            );

                                        if (
                                            nameSlug &&
                                            nameSlug !==
                                                CURRENT_SLUG
                                        ) {

                                            event.preventDefault();
                                            event.stopPropagation();

                                            goToProduct(
                                                nameSlug
                                            );

                                            return;
                                        }
                                    }

                                } catch (_) {}
                            }

                            // --------------------------------
                            // BUTTONS
                            // --------------------------------

                            var button =
                                target.closest(
                                    "button, [role='button'], .back-btn, .home-btn"
                                );

                            if (button) {

                                var text =
                                    (
                                        button.innerText ||
                                        button.textContent ||
                                        ""
                                    )
                                        .trim()
                                        .toLowerCase();

                                if (
                                    text === "home" ||
                                    text === "back" ||
                                    text.indexOf(
                                        "back to"
                                    ) !== -1 ||
                                    text.indexOf(
                                        "return to"
                                    ) !== -1 ||
                                    text.indexOf(
                                        "return home"
                                    ) !== -1 ||
                                    text.indexOf(
                                        "go home"
                                    ) !== -1
                                ) {

                                    event.preventDefault();
                                    event.stopPropagation();

                                    goHome();

                                    return;
                                }
                            }

                        },
                        true
                    );

                } catch (error) {

                    console.warn(
                        "NEXT LEVEL SUBS iframe controller:",
                        error
                    );
                }

            }
        );

        // ====================================================
        // INITIAL HISTORY STATE
        // ====================================================

        try {

            if (
                window.history &&
                window.history.replaceState
            ) {

                window.history.replaceState(
                    {
                        productSlug:
                            CURRENT_SLUG
                    },
                    document.title,
                    window.location.href
                );
            }

        } catch (_) {}

        // ====================================================
        // INITIAL CHECK
        // ====================================================

        setTimeout(
            pollFrameLocation,
            800
        );

    })();

    </script>

</body>

</html>
`;

    return res.end(html);
};