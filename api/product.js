"use strict";

/*
============================================================
NEXT LEVEL SUBS
PRODUCTION HYBRID PRODUCT SEO HANDLER
============================================================

DATA SOURCES
------------------------------------------------------------
/js/details.js
    → Full product data
    → name
    → description
    → images
    → categories
    → pricing
    → features
    → reviews
    → FAQ
    → etc.

/api/seo-content.js
    → SEO title
    → meta description
    → intro
    → SEO sections

THIS FILE
------------------------------------------------------------
Combines both sources and generates:

/product/netflix-premium
/product/spotify-premium
/product/hbo-max
...

FEATURES
------------------------------------------------------------
✓ Clean product URLs
✓ Server-rendered SEO
✓ Product-specific SEO title
✓ Product-specific meta description
✓ Canonical URL
✓ Open Graph
✓ WhatsApp/Facebook preview metadata
✓ Twitter/X metadata
✓ Product JSON-LD
✓ Breadcrumb JSON-LD
✓ WebPage JSON-LD
✓ Organization JSON-LD
✓ Pricing / plans from details.js
✓ Features from details.js
✓ Server-rendered product information
✓ Related product internal links
✓ Existing details.html UI inside iframe
✓ Product navigation
✓ Home navigation
✓ Back navigation
✓ Proper 404
✓ Proper 405
✓ GET + HEAD support
✓ Caching headers

IMPORTANT
------------------------------------------------------------
details.html is NOT rewritten.

============================================================
*/

// ============================================================
// IMPORT PRODUCT DATABASE
// ============================================================
//
// details.js must contain:
//
// window.products = products;
//
// if (typeof module !== "undefined" && module.exports) {
//     module.exports = products;
// }
//
// ============================================================

const products = require("../js/details.js");

// ============================================================
// IMPORT SEO DATABASE
// ============================================================
//
// seo-content.js ends with:
//
// module.exports = seoContent;
//
// ============================================================

const seoContent = require("./seo-content.js");

// ============================================================
// SITE CONFIG
// ============================================================

const SITE = {

    name: "NEXT LEVEL SUBS",

    domain:
        "https://www.nextlevelsubs.com",

    defaultDescription:
        "Premium subscriptions, streaming services, VPNs, AI tools, cloud storage and more from NEXT LEVEL SUBS.",

    locale:
        "en_US",

    language:
        "en",

    logo:
        "/assets/logo.png"

};

// ============================================================
// SLUG ALIASES
// ============================================================

const slugAliases = {

    "netflix":
        "netflix-premium",

    "duolingo":
        "doulingo",

    "youtube-premium-nonrenewable":
        "youtube-premium-non-renewable"

};

// ============================================================
// HTML ESCAPE
// ============================================================

function escapeHTML(value) {

    return String(
        value == null ? "" : value
    )
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

// ============================================================
// SAFE JSON
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
// GENERATE SLUG
// ============================================================

function generateSlug(value) {

    return String(value || "")
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
}

// ============================================================
// GET PRODUCT CATEGORY
// ============================================================
//
// details.js uses:
//
// categories: ["best-selling", "popular-streaming"]
//
// Some older product structures may use:
//
// category: "Streaming"
//
// This function supports both.
// ============================================================

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

        const categories =
            product.categories
                .filter(Boolean)
                .map(function (category) {

                    return String(category)
                        .trim();

                });

        if (categories.length) {

            return categories
                .map(function (category) {

                    return category
                        .replace(/-/g, " ")
                        .replace(/\b\w/g, function (letter) {
                            return letter.toUpperCase();
                        });

                })
                .join(", ");
        }
    }

    return "Digital Services";
}

// ============================================================
// BUILD PRODUCT INDEX
// ============================================================

function buildProductIndex() {

    const index =
        Object.create(null);

    Object.keys(products || {})
        .forEach(function (key) {

            const product =
                products[key];

            const lowerKey =
                String(key)
                    .toLowerCase();

            index[lowerKey] =
                key;

            if (
                product &&
                product.name
            ) {

                const generated =
                    generateSlug(
                        product.name
                    );

                if (generated) {

                    index[generated] =
                        key;
                }
            }

        });

    Object.keys(slugAliases)
        .forEach(function (alias) {

            const target =
                slugAliases[alias];

            if (products[target]) {

                index[
                    alias.toLowerCase()
                ] = target;
            }

        });

    return index;
}

const productIndex =
    buildProductIndex();

// ============================================================
// RESOLVE PRODUCT KEY
// ============================================================

function resolveProductKey(value) {

    if (typeof value !== "string") {
        return "";
    }

    let decoded =
        value.trim();

    try {

        decoded =
            decodeURIComponent(decoded);

    } catch (_) {}

    decoded =
        decoded
            .trim()
            .toLowerCase()
            .replace(/^\/+|\/+$/g, "");

    if (products[decoded]) {
        return decoded;
    }

    if (productIndex[decoded]) {
        return productIndex[decoded];
    }

    const generated =
        generateSlug(decoded);

    return (
        productIndex[generated] ||
        ""
    );
}

// ============================================================
// GET PRODUCT SLUG
// ============================================================

function getProductSlug(req) {

    // --------------------------------------------------------
    // API QUERY
    //
    // /api/product?slug=hbo-max
    // --------------------------------------------------------

    if (
        req.query &&
        typeof req.query.slug === "string" &&
        req.query.slug.trim()
    ) {

        const resolved =
            resolveProductKey(
                req.query.slug
            );

        if (resolved) {
            return resolved;
        }
    }

    // --------------------------------------------------------
    // CLEAN PRODUCT URL
    //
    // /product/hbo-max
    // --------------------------------------------------------

    const rawURL =
        req.url || "";

    const pathname =
        rawURL.split("?")[0];

    const match =
        pathname.match(
            /^\/product\/([^/]+)\/?$/i
        );

    if (
        !match ||
        !match[1]
    ) {

        return "";
    }

    return resolveProductKey(
        match[1]
    );
}

// ============================================================
// ABSOLUTE URL
// ============================================================

function absoluteURL(value) {

    if (!value) {

        return (
            SITE.domain +
            SITE.logo
        );
    }

    if (
        /^https?:\/\//i.test(value)
    ) {

        return value;
    }

    return (
        SITE.domain +
        (
            value.startsWith("/")
                ? ""
                : "/"
        ) +
        value
    );
}

// ============================================================
// GET PRODUCT IMAGE
// ============================================================

function getProductImage(product) {

    let image =
        product &&
        product.image
            ? product.image
            : SITE.logo;

    /*
     * SVG social previews can be unreliable.
     * Use site logo as fallback.
     */

    if (
        /\.svg(\?|#|$)/i.test(image)
    ) {

        image =
            SITE.logo;
    }

    return absoluteURL(image);
}

// ============================================================
// GET SEO DATA
// ============================================================

function getSEOData(
    slug,
    product
) {

    const customSEO =
        seoContent &&
        seoContent[slug];

    if (customSEO) {

        return {

            title:
                customSEO.title ||
                `${product.name} Subscription | ${SITE.name}`,

            description:
                customSEO.description ||
                `${product.description}. Get ${product.name} subscription from ${SITE.name}.`,

            intro:
                customSEO.intro ||
                `Get ${product.name} subscription from ${SITE.name}. ${product.description}.`,

            sections:
                Array.isArray(
                    customSEO.sections
                )
                    ? customSEO.sections
                    : []

        };
    }

    /*
     * Safe fallback if a product does not
     * yet have custom SEO content.
     */

    return {

        title:
            `${product.name} Subscription | ${SITE.name}`,

        description:
            `${product.description}. Get ${product.name} subscription from ${SITE.name}.`,

        intro:
            `Get ${product.name} subscription from ${SITE.name}. ${product.description}.`,

        sections: [

            {

                heading:
                    `${product.name} Subscription`,

                paragraphs: [

                    `${product.name} is available from ${SITE.name} as a premium ${getProductCategory(product).toLowerCase()} service.`,

                    product.description

                ]

            },

            {

                heading:
                    `Why choose ${product.name}?`,

                paragraphs: [

                    `Explore the available ${product.name} subscription options and choose the plan that fits your needs.`,

                    `Current pricing, plans and availability are shown on this product page.`

                ]

            }

        ]

    };
}

// ============================================================
// GET PRICING
// ============================================================

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

            return {

                duration:
                    String(plan.duration),

                price:
                    Number(plan.price),

                currency:
                    plan.currency ||
                    "BDT",

                popular:
                    Boolean(plan.popular),

                discount:
                    plan.discount ||
                    ""

            };

        });
}

// ============================================================
// FORMAT PRICE
// ============================================================

function formatPrice(
    price,
    currency
) {

    const numericPrice =
        Number(price);

    if (
        !Number.isFinite(numericPrice)
    ) {

        return "";
    }

    const formatted =
        numericPrice.toLocaleString(
            "en-BD"
        );

    if (
        String(currency)
            .toUpperCase() === "BDT"
    ) {

        return `৳${formatted}`;
    }

    return (
        `${formatted} ${escapeHTML(currency || "")}`
    );
}

// ============================================================
// BUILD PRICING HTML
// ============================================================

function buildPricingHTML(product) {

    const pricing =
        getPricing(product);

    if (!pricing.length) {

        return "";
    }

    return `

        <section class="product-pricing">

            <h2>
                ${escapeHTML(product.name)}
                Plans &amp; Prices
            </h2>

            <div class="pricing-list">

                ${pricing
                    .map(function (plan) {

                        return `

                            <article class="pricing-plan">

                                <h3>
                                    ${escapeHTML(plan.duration)}
                                </h3>

                                <p>
                                    <strong>
                                        ${formatPrice(
                                            plan.price,
                                            plan.currency
                                        )}
                                    </strong>
                                </p>

                                ${
                                    plan.popular
                                        ? `
                                            <p>
                                                Popular plan
                                            </p>
                                          `
                                        : ""
                                }

                                ${
                                    plan.discount
                                        ? `
                                            <p>
                                                ${escapeHTML(
                                                    plan.discount
                                                )}
                                            </p>
                                          `
                                        : ""
                                }

                            </article>

                        `;

                    })
                    .join("")}

            </div>

        </section>

    `;
}

// ============================================================
// BUILD FEATURES HTML
// ============================================================

function buildFeaturesHTML(product) {

    if (
        !product ||
        !Array.isArray(product.features) ||
        !product.features.length
    ) {

        return "";
    }

    return `

        <section class="product-features">

            <h2>
                ${escapeHTML(product.name)}
                Features
            </h2>

            <ul>

                ${product.features
                    .filter(Boolean)
                    .map(function (feature) {

                        return `
                            <li>
                                ${escapeHTML(feature)}
                            </li>
                        `;

                    })
                    .join("")}

            </ul>

        </section>

    `;
}

// ============================================================
// BUILD REVIEWS HTML
// ============================================================

function buildReviewsHTML(product) {

    if (
        !product ||
        !Array.isArray(product.customerReviews) ||
        !product.customerReviews.length
    ) {

        return "";
    }

    return `

        <section class="customer-reviews">

            <h2>
                Customer Reviews
            </h2>

            ${product.customerReviews
                .slice(0, 10)
                .map(function (review) {

                    return `

                        <article class="customer-review">

                            <h3>
                                ${escapeHTML(
                                    review.name ||
                                    "Customer"
                                )}
                            </h3>

                            ${
                                review.rating != null
                                    ? `
                                        <p>
                                            Rating:
                                            ${escapeHTML(
                                                review.rating
                                            )}/5
                                        </p>
                                      `
                                    : ""
                            }

                            ${
                                review.date
                                    ? `
                                        <p>
                                            ${escapeHTML(
                                                review.date
                                            )}
                                        </p>
                                      `
                                    : ""
                            }

                            ${
                                review.comment
                                    ? `
                                        <p>
                                            ${escapeHTML(
                                                review.comment
                                            )}
                                        </p>
                                      `
                                    : ""
                            }

                        </article>

                    `;

                })
                .join("")}

        </section>

    `;
}

// ============================================================
// BUILD FAQ HTML
// ============================================================

function buildFAQHTML(product) {

    if (
        !product ||
        !Array.isArray(product.faq) ||
        !product.faq.length
    ) {

        return "";
    }

    return `

        <section class="product-faq">

            <h2>
                Frequently Asked Questions
            </h2>

            ${product.faq
                .map(function (item) {

                    if (!item) {
                        return "";
                    }

                    return `

                        <details>

                            <summary>
                                ${escapeHTML(
                                    item.question ||
                                    ""
                                )}
                            </summary>

                            <p>
                                ${escapeHTML(
                                    item.answer ||
                                    ""
                                )}
                            </p>

                        </details>

                    `;

                })
                .join("")}

        </section>

    `;
}

// ============================================================
// BUILD SEO SECTIONS
// ============================================================

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
                Array.isArray(
                    section.paragraphs
                )
                    ? section.paragraphs
                    : [];

            return `

                <section class="seo-section">

                    <h2>
                        ${escapeHTML(
                            section.heading ||
                            ""
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

// ============================================================
// BUILD RELATED PRODUCTS
// ============================================================

function getRelatedProducts(
    currentSlug,
    currentProduct
) {

    const result = [];

    const currentCategory =
        getProductCategory(
            currentProduct
        );

    Object.keys(products || {})
        .forEach(function (key) {

            if (
                key === currentSlug
            ) {

                return;
            }

            const product =
                products[key];

            if (!product) {
                return;
            }

            const category =
                getProductCategory(
                    product
                );

            if (
                category ===
                currentCategory
            ) {

                result.push({

                    slug:
                        key,

                    name:
                        product.name

                });
            }

        });

    return result.slice(0, 8);
}

// ============================================================
// BUILD RELATED HTML
// ============================================================

function buildRelatedHTML(
    relatedProducts,
    category
) {

    if (
        !relatedProducts.length
    ) {

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
                    .map(function (related) {

                        return `

                            <li>

                                <a
                                    href="${escapeHTML(
                                        `${SITE.domain}/product/${encodeURIComponent(related.slug)}`
                                    )}"
                                >
                                    ${escapeHTML(
                                        related.name
                                    )}
                                </a>

                            </li>

                        `;

                    })
                    .join("")}

            </ul>

        </section>

    `;
}

// ============================================================
// PRODUCT JSON-LD
// ============================================================

function buildProductSchema(
    product,
    productURL,
    imageURL,
    description
) {

    const pricing =
        getPricing(product);

    const schema = {

        "@context":
            "https://schema.org",

        "@type":
            "Product",

        "@id":
            `${productURL}#product`,

        "name":
            product.name,

        "description":
            description,

        "image": [
            imageURL
        ],

        "url":
            productURL,

        "category":
            getProductCategory(product),

        "brand": {

            "@type":
                "Brand",

            "name":
                SITE.name

        },

        "seller": {

            "@type":
                "Organization",

            "name":
                SITE.name,

            "url":
                SITE.domain

        }

    };

    /*
     * Add aggregate rating only when
     * the product actually has rating data.
     */

    if (
        product.rating != null &&
        product.reviews != null
    ) {

        const rating =
            Number(product.rating);

        const reviews =
            Number(product.reviews);

        if (
            Number.isFinite(rating) &&
            Number.isFinite(reviews) &&
            reviews > 0
        ) {

            schema.aggregateRating = {

                "@type":
                    "AggregateRating",

                "ratingValue":
                    rating,

                "reviewCount":
                    reviews

            };
        }
    }

    /*
     * Add offers automatically from pricing.
     */

    if (pricing.length) {

        const offers =
            pricing.map(function (plan) {

                return {

                    "@type":
                        "Offer",

                    "url":
                        productURL,

                    "priceCurrency":
                        plan.currency,

                    "price":
                        plan.price,

                    "name":
                        `${product.name} - ${plan.duration}`,

                    "availability":
                        "https://schema.org/InStock",

                    "seller": {

                        "@type":
                            "Organization",

                        "name":
                            SITE.name

                    }

                };

            });

        schema.offers =
            offers.length === 1
                ? offers[0]
                : offers;
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

        "@context":
            "https://schema.org",

        "@type":
            "BreadcrumbList",

        "itemListElement": [

            {

                "@type":
                    "ListItem",

                "position":
                    1,

                "name":
                    "Home",

                "item":
                    `${SITE.domain}/`

            },

            {

                "@type":
                    "ListItem",

                "position":
                    2,

                "name":
                    getProductCategory(product)

            },

            {

                "@type":
                    "ListItem",

                "position":
                    3,

                "name":
                    product.name,

                "item":
                    productURL

            }

        ]

    };
}

// ============================================================
// WEBPAGE JSON-LD
// ============================================================

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

        "url":
            productURL,

        "name":
            `${product.name} Subscription | ${SITE.name}`,

        "description":
            description,

        "inLanguage":
            SITE.language,

        "isPartOf": {

            "@type":
                "WebSite",

            "name":
                SITE.name,

            "url":
                `${SITE.domain}/`

        },

        "about": {

            "@type":
                "Product",

            "name":
                product.name

        }

    };
}

// ============================================================
// ORGANIZATION JSON-LD
// ============================================================

function buildOrganizationSchema() {

    return {

        "@context":
            "https://schema.org",

        "@type":
            "Organization",

        "name":
            SITE.name,

        "url":
            `${SITE.domain}/`

    };
}

// ============================================================
// FAQ JSON-LD
// ============================================================

function buildFAQSchema(product) {

    if (
        !product ||
        !Array.isArray(product.faq) ||
        !product.faq.length
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

                    "name":
                        item.question,

                    "acceptedAnswer": {

                        "@type":
                            "Answer",

                        "text":
                            item.answer

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

        "mainEntity":
            questions

    };
}

// ============================================================
// SEND 404
// ============================================================

function send404(res) {

    res.statusCode =
        404;

    res.setHeader(
        "Content-Type",
        "text/html; charset=utf-8"
    );

    res.setHeader(
        "X-Robots-Tag",
        "noindex, nofollow"
    );

    return res.end(`<!DOCTYPE html>

<html lang="en">

<head>

    <meta charset="UTF-8">

    <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0"
    >

    <title>
        Product Not Found | ${escapeHTML(SITE.name)}
    </title>

    <meta
        name="robots"
        content="noindex, nofollow"
    >

</head>

<body>

    <main>

        <h1>
            Product Not Found
        </h1>

        <p>
            The requested product could not be found.
        </p>

        <p>

            <a
                href="${escapeHTML(SITE.domain)}/"
            >
                Return to
                ${escapeHTML(SITE.name)}
            </a>

        </p>

    </main>

</body>

</html>`);
}

// ============================================================
// MAIN HANDLER
// ============================================================

module.exports =
    function handler(req, res) {

        // ====================================================
        // GET / HEAD ONLY
        // ====================================================

        if (
            req.method !== "GET" &&
            req.method !== "HEAD"
        ) {

            res.statusCode =
                405;

            res.setHeader(
                "Allow",
                "GET, HEAD"
            );

            return res.end(
                "Method Not Allowed"
            );
        }

        // ====================================================
        // FIND PRODUCT
        // ====================================================

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

        // ====================================================
        // PRODUCT URL
        // ====================================================

        const productURL =
            `${SITE.domain}/product/${encodeURIComponent(slug)}`;

        // ====================================================
        // EXISTING DETAILS PAGE
        // ====================================================

        const destinationURL =
            `${SITE.domain}/details.html?name=${encodeURIComponent(product.name)}`;

        // ====================================================
        // IMAGE
        // ====================================================

        const imageURL =
            getProductImage(
                product
            );

        // ====================================================
        // SEO
        // ====================================================

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
            `${product.description}. Get ${product.name} subscription from ${SITE.name}.`;

        const imageAlt =
            `${product.name} - ${SITE.name}`;

        // ====================================================
        // CATEGORY
        // ====================================================

        const category =
            getProductCategory(
                product
            );

        // ====================================================
        // RELATED PRODUCTS
        // ====================================================

        const relatedProducts =
            getRelatedProducts(
                slug,
                product
            );

        // ====================================================
        // STRUCTURED DATA
        // ====================================================

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
            buildFAQSchema(
                product
            );

        // ====================================================
        // RESPONSE HEADERS
        // ====================================================

        res.statusCode =
            200;

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

        // ====================================================
        // HEAD
        // ====================================================

        if (
            req.method === "HEAD"
        ) {

            return res.end();
        }

        // ====================================================
        // PRODUCT MAP
        // ====================================================
        //
        // Used by the iframe navigation controller.
        //
        // ====================================================

        const productMap =
            Object.keys(products)
                .reduce(
                    function (map, key) {

                        map[key] = {

                            name:
                                products[key].name

                        };

                        return map;

                    },
                    {}
                );

        // ====================================================
        // SEO CONTENT
        // ====================================================

        const sectionHTML =
            buildSEOSections(
                seo
            );

        // ====================================================
        // PRICING
        // ====================================================

        const pricingHTML =
            buildPricingHTML(
                product
            );

        // ====================================================
        // FEATURES
        // ====================================================

        const featuresHTML =
            buildFeaturesHTML(
                product
            );

        // ====================================================
        // REVIEWS
        // ====================================================

        const reviewsHTML =
            buildReviewsHTML(
                product
            );

        // ====================================================
        // FAQ
        // ====================================================

        const faqHTML =
            buildFAQHTML(
                product
            );

        // ====================================================
        // RELATED
        // ====================================================

        const relatedHTML =
            buildRelatedHTML(
                relatedProducts,
                category
            );

        // ====================================================
        // HTML
        // ====================================================

        const html = `<!DOCTYPE html>

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
        content="${escapeHTML(imageAlt)}"
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

    <!-- =====================================================
         WEBPAGE JSON-LD
         ===================================================== -->

    <script type="application/ld+json">
${safeJSON(webPageSchema)}
    </script>

    <!-- =====================================================
         ORGANIZATION JSON-LD
         ===================================================== -->

    <script type="application/ld+json">
${safeJSON(organizationSchema)}
    </script>

    ${
        faqSchema
            ? `
                <!-- =================================================
                     FAQ JSON-LD
                     ================================================= -->

                <script type="application/ld+json">
${safeJSON(faqSchema)}
                </script>
              `
            : ""
    }

    <!-- =====================================================
         PAGE STYLE
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

            color: #111111;
        }

        .seo-content {

            position: absolute;

            width: 1px;
            height: 1px;

            overflow: hidden;

            clip: rect(
                0 0 0 0
            );

            clip-path:
                inset(50%);

            white-space:
                normal;
        }

        .seo-content a {

            color:
                inherit;
        }

        .product-frame {

            display:
                block;

            width:
                100%;

            height:
                100vh;

            min-height:
                700px;

            border:
                0;
        }

        @media (max-width: 768px) {

            .product-frame {

                min-height:
                    100vh;
            }

        }

    </style>

</head>

<body>

    <!-- =====================================================
         SERVER-RENDERED SEO CONTENT
         ===================================================== -->

    <main
        class="seo-content"
        aria-label="${escapeHTML(product.name)}"
    >

        <!-- Breadcrumb -->

        <nav
            aria-label="Breadcrumb"
        >

            <ol>

                <li>

                    <a
                        href="${escapeHTML(SITE.domain)}/"
                    >
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

        <!-- Product -->

        <article>

            <header>

                <h1>

                    ${escapeHTML(product.name)}
                    Subscription

                </h1>

                <p>

                    ${escapeHTML(seo.intro)}

                </p>

            </header>

            <!-- Product image -->

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

            <!-- Product category -->

            <p>

                Category:

                <a
                    href="${escapeHTML(SITE.domain)}/"
                >
                    ${escapeHTML(category)}
                </a>

            </p>

            <!-- SEO sections -->

            ${sectionHTML}

            <!-- Pricing -->

            ${pricingHTML}

            <!-- Features -->

            ${featuresHTML}

            <!-- Reviews -->

            ${reviewsHTML}

            <!-- FAQ -->

            ${faqHTML}

            <!-- Related products -->

            ${relatedHTML}

        </article>

    </main>

    <!-- =====================================================
         EXISTING PRODUCT UI
         ===================================================== -->

    <iframe
        id="productFrame"
        class="product-frame"
        src="${escapeHTML(destinationURL)}"
        title="${escapeHTML(product.name)}"
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
            ${safeJSON(`${SITE.domain}/`)};

        var PRODUCT_BASE =
            SITE_HOME + "product/";

        var CURRENT_SLUG =
            ${safeJSON(slug)};

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
                    "");
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

            var targetURL =
                PRODUCT_BASE +
                encodeURIComponent(
                    targetSlug
                );

            window.top.location.href =
                targetURL;
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

            // ------------------------------------------------
            // Exact product name
            // ------------------------------------------------

            for (
                var key in PRODUCT_MAP
            ) {

                if (
                    !Object.prototype.hasOwnProperty
                        .call(
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

            // ------------------------------------------------
            // Generated slug
            // ------------------------------------------------

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

                // --------------------------------------------
                // /product/{slug}
                // --------------------------------------------

                var match =
                    parsed.pathname.match(
                        /^\\/product\\/([^/]+)\\/?$/i
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

                // --------------------------------------------
                // details.html?name=Product
                // --------------------------------------------

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

                // ------------------------------------------------
                // HOME
                // ------------------------------------------------

                if (
                    event.data.type ===
                    "NLS_GO_HOME"
                ) {

                    goHome();

                    return;
                }

                // ------------------------------------------------
                // PRODUCT
                // ------------------------------------------------

                if (
                    event.data.type ===
                    "NLS_NAVIGATE_PRODUCT"
                ) {

                    var targetSlug =
                        "";

                    // --------------------------------------------
                    // productSlug
                    // --------------------------------------------

                    if (
                        event.data.productSlug
                    ) {

                        targetSlug =
                            findSlugFromName(
                                event.data.productSlug
                            );

                        if (
                            PRODUCT_MAP[
                                event.data.productSlug
                            ]
                        ) {

                            targetSlug =
                                event.data.productSlug;
                        }
                    }

                    // --------------------------------------------
                    // productName
                    // --------------------------------------------

                    if (
                        !targetSlug &&
                        event.data.productName
                    ) {

                        targetSlug =
                            findSlugFromName(
                                event.data.productName
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

                // ------------------------------------------------
                // HOME
                // ------------------------------------------------

                if (
                    pathname === "/" ||
                    pathname === "/index.html"
                ) {

                    goHome();

                    return;
                }

                // ------------------------------------------------
                // DETAILS PAGE
                // ------------------------------------------------

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

                // ------------------------------------------------
                // PRODUCT URL
                // ------------------------------------------------

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

                    // =========================================
                    // HISTORY BACK
                    // =========================================

                    try {

                        frameWin.history.back =
                            function () {

                                goHome();

                            };

                    } catch (_) {}

                    // =========================================
                    // HISTORY GO
                    // =========================================

                    try {

                        frameWin.history.go =
                            function (delta) {

                                if (
                                    typeof delta ===
                                        "number" &&
                                    delta < 0
                                ) {

                                    goHome();

                                    return;
                                }

                            };

                    } catch (_) {}

                    // =========================================
                    // CLICK INTERCEPTION
                    // =========================================

                    frameDoc.addEventListener(
                        "click",
                        function (event) {

                            var target =
                                event.target;

                            if (!target) {
                                return;
                            }

                            // =================================
                            // LINKS
                            // =================================

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

                                // ---------------------------------
                                // HOME
                                // ---------------------------------

                                if (
                                    lower === "/" ||
                                    lower === "/index.html" ||
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
                                            frameWin.location.href
                                        );

                                    // -----------------------------
                                    // HOME
                                    // -----------------------------

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

                                    // -----------------------------
                                    // PRODUCT URL
                                    // -----------------------------

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

                                    // -----------------------------
                                    // details.html?name=
                                    // -----------------------------

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

                            // =================================
                            // BUTTONS
                            // =================================

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
            700
        );

    })();

    </script>

</body>

</html>`;

    return res.end(html);
};