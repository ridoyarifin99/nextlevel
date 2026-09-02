"use strict";

/*
============================================================
NEXT LEVEL SUBS
PRODUCTION PRODUCT SEO HANDLER
============================================================
*/

const productsData = require("../js/details.js");
const seoContent = require("./seo-content.js");

/* ============================================================
   SITE CONFIG
============================================================ */

const SITE = {
    name: "NEXT LEVEL SUBS",
    domain: "https://www.nextlevelsubs.com",
    language: "en",
    locale: "en_US",
    logo: "/images/logo.png",
    defaultDescription:
        "Premium subscriptions, streaming services, VPNs, AI tools, cloud storage and more from NEXT LEVEL SUBS."
};

/* ============================================================
   NORMALIZE PRODUCT DATA
============================================================ */

function normalizeProducts(value) {
    if (Array.isArray(value)) {
        const map = Object.create(null);

        value.forEach(function (product) {
            if (!product || !product.name) {
                return;
            }

            const slug = generateSlug(product.name);

            if (slug && !map[slug]) {
                map[slug] = product;
            }
        });

        return map;
    }

    if (value && typeof value === "object") {
        return value;
    }

    return Object.create(null);
}

const products = normalizeProducts(productsData);

/* ============================================================
   SLUG ALIASES
============================================================ */

const slugAliases = {
    netflix: "netflix-premium",
    duolingo: "doulingo",
    "youtube-premium-nonrenewable":
        "youtube-premium-non-renewable"
};

/* ============================================================
   SLUG GENERATOR
============================================================ */

function generateSlug(value) {
    return String(value || "")
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
}

/* ============================================================
   PRODUCT INDEX
============================================================ */

function buildProductIndex() {
    const index = Object.create(null);

    Object.keys(products).forEach(function (key) {
        const product = products[key];

        if (!product) {
            return;
        }

        const normalizedKey = String(key)
            .trim()
            .toLowerCase();

        index[normalizedKey] = key;

        if (product.name) {
            const generated = generateSlug(product.name);

            if (generated) {
                index[generated] = key;
            }
        }

        if (product.slug) {
            const productSlug = generateSlug(product.slug);

            if (productSlug) {
                index[productSlug] = key;
            }
        }
    });

    Object.keys(slugAliases).forEach(function (alias) {
        const target = slugAliases[alias];

        if (products[target]) {
            index[alias] = target;
        }
    });

    return index;
}

const productIndex = buildProductIndex();

/* ============================================================
   RESOLVE PRODUCT
============================================================ */

function resolveProductKey(value) {
    if (typeof value !== "string") {
        return "";
    }

    let slug = value.trim();

    try {
        slug = decodeURIComponent(slug);
    } catch (_) {}

    slug = slug
        .trim()
        .toLowerCase()
        .replace(/^\/+|\/+$/g, "");

    if (products[slug]) {
        return slug;
    }

    if (productIndex[slug]) {
        return productIndex[slug];
    }

    const generated = generateSlug(slug);

    if (productIndex[generated]) {
        return productIndex[generated];
    }

    return "";
}

/* ============================================================
   GET REQUESTED SLUG
============================================================ */

function getProductSlug(req) {
    if (
        req.query &&
        typeof req.query.slug === "string" &&
        req.query.slug.trim()
    ) {
        return resolveProductKey(req.query.slug);
    }

    const pathname = String(req.url || "")
        .split("?")[0];

    const match = pathname.match(
        /^\/product\/([^/]+)\/?$/i
    );

    if (match && match[1]) {
        return resolveProductKey(match[1]);
    }

    return "";
}

/* ============================================================
   HTML ESCAPE
============================================================ */

function escapeHTML(value) {
    return String(value == null ? "" : value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

/* ============================================================
   SAFE JSON
============================================================ */

function safeJSON(value) {
    return JSON.stringify(value)
        .replace(/</g, "\\u003c")
        .replace(/>/g, "\\u003e")
        .replace(/&/g, "\\u0026")
        .replace(/\u2028/g, "\\u2028")
        .replace(/\u2029/g, "\\u2029");
}

/* ============================================================
   ABSOLUTE URL
============================================================ */

function absoluteURL(value) {
    if (!value) {
        return SITE.domain + SITE.logo;
    }

    const stringValue = String(value).trim();

    if (/^https?:\/\//i.test(stringValue)) {
        return stringValue;
    }

    return (
        SITE.domain +
        (stringValue.startsWith("/") ? "" : "/") +
        stringValue
    );
}

/* ============================================================
   PRODUCT IMAGE
============================================================ */

function getProductImage(product) {
    const image =
        product && product.image
            ? product.image
            : SITE.logo;

    if (/\.svg(?:\?|#|$)/i.test(String(image))) {
        return SITE.domain + SITE.logo;
    }

    return absoluteURL(image);
}

/* ============================================================
   CATEGORY
============================================================ */

function getProductCategory(product) {
    if (!product) {
        return "Digital Services";
    }

    if (
        typeof product.category === "string" &&
        product.category.trim()
    ) {
        return product.category.trim();
    }

    if (
        Array.isArray(product.categories) &&
        product.categories.length
    ) {
        return product.categories
            .filter(Boolean)
            .map(function (category) {
                return String(category)
                    .replace(/-/g, " ")
                    .replace(/\b\w/g, function (letter) {
                        return letter.toUpperCase();
                    })
                    .trim();
            })
            .join(", ");
    }

    return "Digital Services";
}

/* ============================================================
   SEO DATA
============================================================ */

function getSEOData(slug, product) {
    const custom =
        seoContent &&
        seoContent[slug];

    const name =
        product.name || "Product";

    const productDescription =
        product.description ||
        SITE.defaultDescription;

    const fallback = {
        title:
            `${name} Subscription | ${SITE.name}`,

        description:
            `${productDescription}. Get ${name} subscription from ${SITE.name}.`,

        intro:
            `Get ${name} subscription from ${SITE.name}. ${productDescription}.`,

        sections: [
            {
                heading: `${name} Subscription`,
                paragraphs: [
                    `${name} is available from ${SITE.name} as a digital service.`,
                    productDescription
                ]
            },
            {
                heading: `Why choose ${name}?`,
                paragraphs: [
                    `Explore the available ${name} subscription options and choose the plan that fits your needs.`,
                    `Current pricing and availability are shown on this product page.`
                ]
            }
        ]
    };

    if (!custom) {
        return fallback;
    }

    return {
        title:
            custom.title ||
            fallback.title,

        description:
            custom.description ||
            fallback.description,

        intro:
            custom.intro ||
            fallback.intro,

        sections:
            Array.isArray(custom.sections)
                ? custom.sections
                : fallback.sections
    };
}

/* ============================================================
   PRICING
============================================================ */

function getPricing(product) {
    if (
        !product ||
        !Array.isArray(product.pricing)
    ) {
        return [];
    }

    return product.pricing
        .filter(function (plan) {
            return (
                plan &&
                plan.duration &&
                plan.price != null
            );
        })
        .map(function (plan) {
            const numericPrice =
                Number(plan.price);

            return {
                duration:
                    String(plan.duration),

                price:
                    Number.isFinite(numericPrice)
                        ? numericPrice
                        : 0,

                currency:
                    plan.currency || "BDT",

                popular:
                    Boolean(plan.popular),

                discount:
                    plan.discount
                        ? String(plan.discount)
                        : ""
            };
        });
}

/* ============================================================
   RELATED PRODUCTS
============================================================ */

function getRelatedProducts(
    currentKey,
    currentProduct
) {
    const result = [];

    const currentCategories =
        Array.isArray(currentProduct.categories)
            ? currentProduct.categories
            : [];

    Object.keys(products).forEach(function (key) {
        const product = products[key];

        if (!product || key === currentKey) {
            return;
        }

        const categories =
            Array.isArray(product.categories)
                ? product.categories
                : [];

        const related =
            currentCategories.some(function (category) {
                return categories.includes(category);
            });

        if (related) {
            result.push({
                slug: generateSlug(product.name),
                name: product.name
            });
        }
    });

    return result.slice(0, 8);
}

/* ============================================================
   RELATED HTML
============================================================ */

function buildRelatedHTML(
    relatedProducts,
    category
) {
    if (!relatedProducts.length) {
        return "";
    }

    return `
        <section class="related-products">
            <h2>
                More ${escapeHTML(category)}
                Subscriptions
            </h2>

            <ul>
                ${relatedProducts
                    .map(function (product) {
                        const url =
                            `${SITE.domain}/product/${encodeURIComponent(product.slug)}`;

                        return `
                            <li>
                                <a href="${escapeHTML(url)}">
                                    ${escapeHTML(product.name)}
                                </a>
                            </li>
                        `;
                    })
                    .join("")}
            </ul>
        </section>
    `;
}

/* ============================================================
   SEO SECTIONS
============================================================ */

function buildSEOSections(seo) {
    if (
        !seo ||
        !Array.isArray(seo.sections)
    ) {
        return "";
    }

    return seo.sections
        .map(function (section) {
            if (!section) {
                return "";
            }

            const paragraphs =
                Array.isArray(section.paragraphs)
                    ? section.paragraphs
                    : [];

            return `
                <section class="seo-section">
                    <h2>
                        ${escapeHTML(
                            section.heading || ""
                        )}
                    </h2>

                    ${paragraphs
                        .map(function (paragraph) {
                            return `
                                <p>
                                    ${escapeHTML(
                                        paragraph
                                    )}
                                </p>
                            `;
                        })
                        .join("")}
                </section>
            `;
        })
        .join("");
}

/* ============================================================
   PRODUCT SCHEMA
============================================================ */

function buildProductSchema(
    product,
    productURL,
    imageURL,
    description
) {
    const pricing =
        getPricing(product);

    const schema = {
        "@context": "https://schema.org",
        "@type": "Product",
        "@id": `${productURL}#product`,

        name:
            product.name,

        description:
            description,

        image:
            [imageURL],

        url:
            productURL,

        category:
            getProductCategory(product),

        brand: {
            "@type": "Brand",
            name:
                SITE.name
        },

        seller: {
            "@type": "Organization",
            name:
                SITE.name,

            url:
                SITE.domain
        }
    };

    const rating =
        Number(product.rating);

    const reviewCount =
        Number(product.reviews);

    if (
        Number.isFinite(rating) &&
        Number.isFinite(reviewCount) &&
        reviewCount > 0
    ) {
        schema.aggregateRating = {
            "@type":
                "AggregateRating",

            ratingValue:
                rating,

            reviewCount:
                reviewCount
        };
    }

    if (pricing.length) {
        schema.offers =
            pricing.map(function (plan) {
                return {
                    "@type": "Offer",

                    url:
                        productURL,

                    priceCurrency:
                        plan.currency,

                    price:
                        plan.price,

                    name:
                        `${product.name} - ${plan.duration}`,

                    availability:
                        "https://schema.org/InStock",

                    seller: {
                        "@type":
                            "Organization",

                        name:
                            SITE.name
                    }
                };
            });
    }

    return schema;
}

/* ============================================================
   BREADCRUMB SCHEMA
============================================================ */

function buildBreadcrumbSchema(
    product,
    productURL
) {
    return {
        "@context":
            "https://schema.org",

        "@type":
            "BreadcrumbList",

        itemListElement: [
            {
                "@type":
                    "ListItem",

                position:
                    1,

                name:
                    "Home",

                item:
                    `${SITE.domain}/`
            },
            {
                "@type":
                    "ListItem",

                position:
                    2,

                name:
                    getProductCategory(product),

                item:
                    `${SITE.domain}/`
            },
            {
                "@type":
                    "ListItem",

                position:
                    3,

                name:
                    product.name,

                item:
                    productURL
            }
        ]
    };
}

/* ============================================================
   WEBPAGE SCHEMA
============================================================ */

function buildWebPageSchema(
    product,
    productURL,
    description
) {
    return {
        "@context":
            "https://schema.org",

        "@type":
            "WebPage",

        "@id":
            `${productURL}#webpage`,

        url:
            productURL,

        name:
            `${product.name} Subscription | ${SITE.name}`,

        description:
            description,

        inLanguage:
            SITE.language,

        isPartOf: {
            "@type":
                "WebSite",

            name:
                SITE.name,

            url:
                `${SITE.domain}/`
        }
    };
}

/* ============================================================
   ORGANIZATION SCHEMA
============================================================ */

function buildOrganizationSchema() {
    return {
        "@context":
            "https://schema.org",

        "@type":
            "Organization",

        name:
            SITE.name,

        url:
            `${SITE.domain}/`,

        logo:
            `${SITE.domain}${SITE.logo}`
    };
}

/* ============================================================
   FAQ SCHEMA
============================================================ */

function buildFAQSchema(product) {
    if (
        !product ||
        !Array.isArray(product.faq)
    ) {
        return null;
    }

    const questions =
        product.faq
            .filter(function (item) {
                return (
                    item &&
                    item.question &&
                    item.answer
                );
            })
            .map(function (item) {
                return {
                    "@type":
                        "Question",

                    name:
                        String(item.question),

                    acceptedAnswer: {
                        "@type":
                            "Answer",

                        text:
                            String(item.answer)
                    }
                };
            });

    if (!questions.length) {
        return null;
    }

    return {
        "@context":
            "https://schema.org",

        "@type":
            "FAQPage",

        mainEntity:
            questions
    };
}

/* ============================================================
   404
============================================================ */

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
    <meta name="viewport"
          content="width=device-width, initial-scale=1.0">

    <title>
        Product Not Found | ${escapeHTML(SITE.name)}
    </title>

    <meta name="robots"
          content="noindex, nofollow">
</head>

<body>
    <main>
        <h1>Product Not Found</h1>

        <p>
            The requested product could not be found.
        </p>

        <p>
            <a href="${escapeHTML(SITE.domain)}/">
                Return to ${escapeHTML(SITE.name)}
            </a>
        </p>
    </main>
</body>
</html>
    `);
}

/* ============================================================
   MAIN HANDLER
============================================================ */

module.exports = function handler(req, res) {
    try {
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

        const slug =
            getProductSlug(req);

        if (!slug) {
            return send404(res);
        }

        const product =
            products[slug];

        if (!product) {
            return send404(res);
        }

        const productURL =
            `${SITE.domain}/product/${encodeURIComponent(slug)}`;

        const destinationURL =
            `${SITE.domain}/details.html?name=${encodeURIComponent(product.name)}`;

        const imageURL =
            getProductImage(product);

        const seo =
            getSEOData(
                slug,
                product
            );

        const title =
            seo.title ||
            `${product.name} Subscription | ${SITE.name}`;

        const description =
            seo.description ||
            `${product.description || SITE.defaultDescription}. Get ${product.name} subscription from ${SITE.name}.`;

        const category =
            getProductCategory(product);

        const imageAlt =
            `${product.name} - ${SITE.name}`;

        const relatedProducts =
            getRelatedProducts(
                slug,
                product
            );

        const productSchema =
            buildProductSchema(
                product,
                productURL,
                imageURL,
                description
            );

        const breadcrumbSchema =
            buildBreadcrumbSchema(
                product,
                productURL
            );

        const webPageSchema =
            buildWebPageSchema(
                product,
                productURL,
                description
            );

        const organizationSchema =
            buildOrganizationSchema();

        const faqSchema =
            buildFAQSchema(product);

        const sectionHTML =
            buildSEOSections(seo);

        const relatedHTML =
            buildRelatedHTML(
                relatedProducts,
                category
            );

        const productMap =
            Object.keys(products).reduce(
                function (map, key) {
                    const item =
                        products[key];

                    if (
                        item &&
                        item.name
                    ) {
                        map[
                            generateSlug(item.name)
                        ] = {
                            name:
                                item.name
                        };
                    }

                    return map;
                },
                {}
            );

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
            "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
        );

        res.setHeader(
            "Cache-Control",
            "public, max-age=300, s-maxage=3600, stale-while-revalidate=86400"
        );

        if (req.method === "HEAD") {
            return res.end();
        }

        const faqHTML =
            faqSchema
                ? `
                    <script type="application/ld+json">
                        ${safeJSON(faqSchema)}
                    </script>
                  `
                : "";

        const html = `
<!DOCTYPE html>
<html lang="${escapeHTML(SITE.language)}">
<head>

    <meta charset="UTF-8">

    <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0"
    >

    <title>
        ${escapeHTML(title)}
    </title>

    <meta
        name="description"
        content="${escapeHTML(description)}"
    >

    <meta
        name="robots"
        content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
    >

    <link
        rel="canonical"
        href="${escapeHTML(productURL)}"
    >

    <meta
        name="author"
        content="${escapeHTML(SITE.name)}"
    >

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
        content="${escapeHTML(title)}"
    >

    <meta
        property="og:description"
        content="${escapeHTML(description)}"
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
        property="og:image:alt"
        content="${escapeHTML(imageAlt)}"
    >

    <meta
        name="twitter:card"
        content="summary_large_image"
    >

    <meta
        name="twitter:title"
        content="${escapeHTML(title)}"
    >

    <meta
        name="twitter:description"
        content="${escapeHTML(description)}"
    >

    <meta
        name="twitter:image"
        content="${escapeHTML(imageURL)}"
    >

    <meta
        name="twitter:image:alt"
        content="${escapeHTML(imageAlt)}"
    >

    <script type="application/ld+json">
        ${safeJSON(productSchema)}
    </script>

    <script type="application/ld+json">
        ${safeJSON(breadcrumbSchema)}
    </script>

    <script type="application/ld+json">
        ${safeJSON(webPageSchema)}
    </script>

    <script type="application/ld+json">
        ${safeJSON(organizationSchema)}
    </script>

    ${faqHTML}

    <style>
        html,
        body {
            margin: 0;
            padding: 0;
            width: 100%;
            min-height: 100%;
            background: #fff;
        }

        body {
            font-family:
                Arial,
                Helvetica,
                sans-serif;
            color: #111;
        }

        .seo-content {
            position: absolute;
            width: 1px;
            height: 1px;
            overflow: hidden;
            clip: rect(0 0 0 0);
            clip-path: inset(50%);
            white-space: normal;
        }

        .product-frame {
            display: block;
            width: 100%;
            height: 100vh;
            min-height: 700px;
            border: 0;
        }

        @media (max-width: 768px) {
            .product-frame {
                min-height: 100vh;
            }
        }
    </style>

</head>

<body>

    <main
        class="seo-content"
        aria-label="${escapeHTML(product.name)}"
    >

        <nav aria-label="Breadcrumb">

            <ol>

                <li>
                    <a href="${escapeHTML(SITE.domain)}/">
                        Home
                    </a>
                </li>

                <li>
                    ${escapeHTML(category)}
                </li>

                <li>
                    ${escapeHTML(product.name)}
                </li>

            </ol>

        </nav>

        <article>

            <header>

                <h1>
                    ${escapeHTML(product.name)}
                    Subscription
                </h1>

                <p>
                    ${escapeHTML(seo.intro || description)}
                </p>

            </header>

            <figure>

                <img
                    src="${escapeHTML(imageURL)}"
                    alt="${escapeHTML(imageAlt)}"
                    width="1200"
                    height="630"
                    loading="eager"
                >

                <figcaption>
                    ${escapeHTML(product.name)}
                    subscription from
                    ${escapeHTML(SITE.name)}
                </figcaption>

            </figure>

            ${sectionHTML}

            ${relatedHTML}

        </article>

    </main>

    <iframe
        id="productFrame"
        class="product-frame"
        src="${escapeHTML(destinationURL)}"
        title="${escapeHTML(product.name)}"
        loading="eager"
        allow="fullscreen"
    ></iframe>

    <script>
    (function () {
        "use strict";

        var SITE_HOME =
            ${safeJSON(`${SITE.domain}/`)};

        var PRODUCT_BASE =
            SITE_HOME + "product/";

        var CURRENT_SLUG =
            ${safeJSON(slug)};

        var PRODUCT_MAP =
            ${safeJSON(productMap)};

        var frame =
            document.getElementById(
                "productFrame"
            );

        if (!frame) {
            return;
        }

        function goHome() {
            window.top.location.href =
                SITE_HOME;
        }

        function goToProduct(slug) {
            if (!slug) {
                return;
            }

            slug =
                String(slug)
                    .trim()
                    .toLowerCase();

            if (
                !PRODUCT_MAP[slug] ||
                slug === CURRENT_SLUG
            ) {
                return;
            }

            window.top.location.href =
                PRODUCT_BASE +
                encodeURIComponent(slug);
        }

        function findSlugFromName(name) {
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
                    !Object.prototype.hasOwnProperty.call(
                        PRODUCT_MAP,
                        key
                    )
                ) {
                    continue;
                }

                var productName =
                    String(
                        PRODUCT_MAP[key].name ||
                        ""
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

            return "";
        }

        window.addEventListener(
            "message",
            function (event) {
                if (!event.data) {
                    return;
                }

                if (
                    event.data.type ===
                    "NLS_GO_HOME"
                ) {
                    goHome();
                    return;
                }

                if (
                    event.data.type ===
                    "NLS_NAVIGATE_PRODUCT"
                ) {
                    var target = "";

                    if (
                        event.data.productSlug
                    ) {
                        target =
                            findSlugFromName(
                                event.data.productSlug
                            );
                    }

                    if (
                        !target &&
                        event.data.productName
                    ) {
                        target =
                            findSlugFromName(
                                event.data.productName
                            );
                    }

                    if (target) {
                        goToProduct(target);
                    }
                }
            }
        );

        /*
         * The iframe is same-origin, so we can monitor
         * its current URL and keep the browser URL aligned.
         */
        function pollFrameLocation() {
            try {
                var frameWindow =
                    frame.contentWindow;

                if (
                    !frameWindow ||
                    !frameWindow.location
                ) {
                    return;
                }

                var href =
                    frameWindow.location.href;

                if (!href) {
                    return;
                }

                var parsed =
                    new URL(href);

                var pathname =
                    parsed.pathname.toLowerCase();

                if (
                    pathname === "/" ||
                    pathname === "/index.html"
                ) {
                    goHome();
                    return;
                }

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
                        var slug =
                            findSlugFromName(
                                name
                            );

                        if (
                            slug &&
                            slug !== CURRENT_SLUG
                        ) {
                            goToProduct(slug);
                        }
                    }
                }
            } catch (_) {}
        }

        setInterval(
            pollFrameLocation,
            500
        );

        frame.addEventListener(
            "load",
            function () {
                try {
                    var frameWindow =
                        frame.contentWindow;

                    var frameDocument =
                        frameWindow.document;

                    frameDocument.addEventListener(
                        "click",
                        function (event) {
                            var target =
                                event.target;

                            if (!target) {
                                return;
                            }

                            var link =
                                target.closest(
                                    "a"
                                );

                            if (!link) {
                                return;
                            }

                            var href =
                                link.getAttribute(
                                    "href"
                                ) || "";

                            if (
                                href === "/" ||
                                href === "/index.html"
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
                                        frameWindow.location.href
                                    );

                                if (
                                    url.pathname === "/" ||
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

                                if (
                                    url.pathname
                                        .toLowerCase()
                                        .indexOf(
                                            "/product/"
                                        ) === 0
                                ) {
                                    var parts =
                                        url.pathname.split(
                                            "/"
                                        );

                                    var targetSlug =
                                        parts[2]
                                            ? decodeURIComponent(
                                                parts[2]
                                            )
                                            : "";

                                    targetSlug =
                                        targetSlug
                                            .trim()
                                            .toLowerCase();

                                    if (
                                        PRODUCT_MAP[
                                            targetSlug
                                        ]
                                    ) {
                                        event.preventDefault();
                                        event.stopPropagation();
                                        goToProduct(
                                            targetSlug
                                        );
                                    }
                                }

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
                                    }
                                }
                            } catch (_) {}
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

        setTimeout(
            pollFrameLocation,
            700
        );
    })();
    </script>

</body>
</html>
`;

        return res.end(html);

    } catch (error) {
        console.error(
            "NEXT LEVEL SUBS product function crashed:",
            error
        );

        res.statusCode = 500;

        res.setHeader(
            "Content-Type",
            "application/json; charset=utf-8"
        );

        return res.end(
            JSON.stringify({
                error:
                    "Internal Server Error"
            })
        );
    }
};