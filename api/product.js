// ============================================================
// NEXT LEVEL SUBS
// PRODUCTION HYBRID PRODUCT SEO HANDLER
// ============================================================
//
// Clean product URLs:
//
// https://www.nextlevelsubs.com/product/netflix-premium
// https://www.nextlevelsubs.com/product/spotify-premium
// https://www.nextlevelsubs.com/product/hbo-max
//
// PURPOSE
// ------------------------------------------------------------
// 1. Server-rendered SEO HTML
// 2. Product-specific title / description
// 3. Canonical URL
// 4. Open Graph / WhatsApp / Facebook metadata
// 5. Twitter/X metadata
// 6. Product JSON-LD
// 7. Breadcrumb JSON-LD
// 8. WebPage JSON-LD
// 9. Organization JSON-LD
// 10. Crawlable product content outside iframe
// 11. Existing details.html product UI
// 12. Related product internal links
// 13. Product navigation controller
// 14. Proper 404 / 405 handling
//
// IMPORTANT
// ------------------------------------------------------------
// details.html does NOT need to be rewritten.
//
// The SEO content is generated directly by this server handler.
// The iframe remains responsible for your existing product UI.
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
// PRODUCT DATABASE
// ============================================================

const products = {

    // ========================================================
    // STREAMING
    // ========================================================

    "netflix-premium": {
        name: "Netflix Premium",
        description: "Watch unlimited movies and TV shows",
        image: "/assets/cards/netflix.webp",
        category: "Streaming"
    },

    "amazon-prime-video": {
        name: "Amazon Prime Video",
        description: "Thousands of movies and TV shows",
        image: "/assets/cards/Prime_Video.png",
        category: "Streaming"
    },

    "hbo-max": {
        name: "HBO Max",
        description: "HBO, Warner Bros., DC, Max Originals",
        image: "/assets/cards/hbomax.jpg",
        category: "Streaming"
    },

    "crunchy-roll-mega": {
        name: "Crunchy Roll Mega",
        description: "Anime. Streaming. Community",
        image: "/assets/cards/crunchy.png",
        category: "Streaming"
    },

    "netflix-for-tv": {
        name: "Netflix For TV",
        description: "Watch unlimited movies and TV shows",
        image: "/assets/cards/netflixfortv.webp",
        category: "Streaming"
    },

    "chorki-premium": {
        name: "Chorki Premium",
        description: "Bengali. Bold. Streaming",
        image: "/assets/cards/chorki.webp",
        category: "Streaming"
    },

    "hoichoi-premium": {
        name: "Hoichoi Premium",
        description: "Unlimited Bangla Entertainment",
        image: "/assets/cards/hoichoi.png",
        category: "Streaming"
    },

    "bongo": {
        name: "Bongo",
        description: "Unlimited Bangla Entertainment",
        image: "/assets/cards/bongo.png",
        category: "Streaming"
    },

    "disney-plus": {
        name: "Disney+",
        description:
            "Premium movies, series and exclusive Disney content",
        image: "/assets/cards/disney.jpg",
        category: "Streaming"
    },

    "hulu": {
        name: "Hulu",
        description: "Next-day TV and original content",
        image: "/assets/cards/hulu.svg",
        category: "Streaming"
    },

    "apple-tv-plus": {
        name: "Apple TV+",
        description: "Original shows and movies",
        image: "/assets/cards/apple_tv.jpg",
        category: "Streaming"
    },

    "paramount-plus": {
        name: "Paramount+",
        description:
            "Movies, live sports, and exclusive originals",
        image: "/assets/cards/paramount.webp",
        category: "Streaming"
    },

    "peacock": {
        name: "Peacock",
        description: "NBCUniversal content and live sports",
        image: "/assets/cards/Peacock.avif",
        category: "Streaming"
    },

    "youtube-premium": {
        name: "YouTube Premium",
        description: "Ad-free videos and YouTube Music",
        image: "/assets/cards/youtube.webp",
        category: "Streaming"
    },

    "youtube-premium-non-renewable": {
        name: "Youtube Premium Non-Renewable",
        description: "Ad-free videos and music",
        image: "/assets/cards/youtube.webp",
        category: "Streaming"
    },

    "discovery-plus": {
        name: "Discovery+",
        description: "Documentaries, Reality, Entertainment",
        image: "/assets/cards/discovery.webp",
        category: "Streaming"
    },

    "shudder-premium": {
        name: "Shudder Premium",
        description: "Horror, Thriller, Suspense",
        image: "/assets/cards/shudder.jpg",
        category: "Streaming"
    },

    "prime-video-full": {
        name: "Prime Video Full",
        description: "Movies, Series, Originals",
        image: "/assets/cards/primefull.webp",
        category: "Streaming"
    },

    "amc-plus": {
        name: "AMC+",
        description: "Horror, Thriller, Suspense",
        image: "/assets/cards/amc+.webp",
        category: "Streaming"
    },

    "fubo-tv": {
        name: "Fubo TV",
        description: "Sports, Live, Entertainment",
        image: "/assets/cards/fuboTV.webp",
        category: "Streaming"
    },

    "ullu-pro": {
        name: "Ullu Pro",
        description: "Adult, Web, Series",
        image: "/assets/cards/ullu.png",
        category: "Streaming"
    },

    "sling-tv": {
        name: "Sling TV",
        description: "Live, Channels, Streaming",
        image: "/assets/cards/slingtv.png",
        category: "Streaming"
    },

    // ========================================================
    // MUSIC
    // ========================================================

    "spotify-premium": {
        name: "Spotify Premium",
        description: "Ad-free music and podcasts",
        image: "/assets/cards/spotify.jpg",
        category: "Music"
    },

    "amazon-music-unlimited": {
        name: "Amazon Music Unlimited",
        description: "High-quality music and podcasts",
        image: "/assets/cards/amazon-music-unlimited.jpeg",
        category: "Music"
    },

    "apple-music": {
        name: "Apple Music",
        description: "Stream over 75 million songs",
        image: "/assets/cards/apple_music.jpg",
        category: "Music"
    },

    "tidal": {
        name: "Tidal",
        description: "High-fidelity music streaming",
        image: "/assets/cards/tidal.svg",
        category: "Music"
    },

    "pandora-premium": {
        name: "Pandora Premium",
        description: "Personalized music and podcasts",
        image: "/assets/cards/pandora.svg",
        category: "Music"
    },

    "soundcloud-go-plus": {
        name: "SoundCloud Go+",
        description: "Ad-free music and offline listening",
        image: "/assets/cards/sound_cloud.svg",
        category: "Music"
    },

    "deezer-hifi": {
        name: "Deezer HiFi",
        description: "High-quality audio streaming",
        image: "/assets/cards/deezer.svg",
        category: "Music"
    },

    // ========================================================
    // CLOUD STORAGE
    // ========================================================

    "microsoft-onedrive": {
        name: "Microsoft OneDrive",
        description: "1TB cloud storage with Office apps",
        image: "/assets/cards/onedrive.svg",
        category: "Cloud Storage"
    },

    "dropbox-plus": {
        name: "Dropbox Plus",
        description: "2TB secure cloud storage",
        image: "/assets/cards/Dropbox_(service)-Logo.wine.svg",
        category: "Cloud Storage"
    },

    "google-drive": {
        name: "Google Drive",
        description: "1TB cloud storage",
        image: "/assets/cards/Google_Drive-Logo.wine.svg",
        category: "Cloud Storage"
    },

    "icloud-plus": {
        name: "iCloud+",
        description: "50GB cloud storage for Apple users",
        image: "/assets/cards/icloud+webp.webp",
        category: "Cloud Storage"
    },

    "amazon-drive": {
        name: "Amazon Drive",
        description: "100GB cloud storage",
        image: "/assets/cards/amazon_drive.png",
        category: "Cloud Storage"
    },

    // ========================================================
    // VPN
    // ========================================================

    "expressvpn": {
        name: "ExpressVPN",
        description: "High-speed, secure VPN service",
        image: "/assets/cards/expressVPN.png",
        category: "VPN"
    },

    "nordvpn": {
        name: "NordVPN",
        description: "Advanced security with double VPN",
        image: "/assets/cards/nordvpn.webp",
        category: "VPN"
    },

    "surfshark": {
        name: "Surfshark",
        description: "Unlimited devices and connections",
        image: "/assets/cards/surfsharkvpn.webp",
        category: "VPN"
    },

    "cyberghost": {
        name: "CyberGhost",
        description:
            "User-friendly VPN with 45-day guarantee",
        image: "/assets/cards/cyberghost.png",
        category: "VPN"
    },

    "ipvanish": {
        name: "IPVanish",
        description: "Fast connections with no logs",
        image: "/assets/cards/ipvanish.webp",
        category: "VPN"
    },

    "private-internet-access": {
        name: "Private Internet Access",
        description: "Highly customizable VPN",
        image: "/assets/cards/pia.png",
        category: "VPN"
    },

    "hotspot-shield": {
        name: "Hotspot Shield",
        description: "Patented VPN technology",
        image: "/assets/cards/Hotspot-Shield-vpn.webp",
        category: "VPN"
    },

    "vypr-vpn": {
        name: "Vypr VPN",
        description: "Secure and private VPN service",
        image: "/assets/cards/vyprvpn.webp",
        category: "VPN"
    },

    // ========================================================
    // AI & DESIGN
    // ========================================================

    "canva-pro": {
        name: "Canva Pro",
        description:
            "Canva Pro: Where Ideas Turn into Stunning Designs—Fast!",
        image: "/assets/cards/canva.png",
        category: "AI & Design"
    },

    "photoroom-pro": {
        name: "Photoroom Pro",
        description:
            "Professional AI-powered photo editing and design tools",
        image: "/assets/cards/photoroom.jpg",
        category: "AI & Design"
    },

    "picsart-premium": {
        name: "Picsart Premium",
        description:
            "Creative photo and video editing tools",
        image: "/assets/cards/picsart.png",
        category: "AI & Design"
    },

    "photoroom-max": {
        name: "Photoroom Max",
        description:
            "Advanced AI photo editing and creative tools",
        image: "/assets/cards/photoroom.jpg",
        category: "AI & Design"
    },

    "blackbox-ai-chatgpt5": {
        name: "Black Box Ai (CHAT-GPT5)",
        description:
            "AI-powered coding and development assistant",
        image: "/assets/cards/blackboxai.jpg",
        category: "AI & Design"
    },

    "gemini-ai": {
        name: "Gemini Ai",
        description: "Google's advanced AI assistant",
        image: "/assets/cards/gemini.png",
        category: "AI & Design"
    },

    "chat-gpt": {
        name: "Chat GPT",
        description:
            "Advanced AI assistant for writing, research and productivity",
        image: "/assets/cards/chatgpt.jpg",
        category: "AI & Design"
    },

    "perplexity-chatgpt5": {
        name: "Perplexity (ChatGPT-5)",
        description:
            "AI-powered search and research assistant",
        image: "/assets/cards/Perplexity.svg",
        category: "AI & Design"
    },

    "remini-ai": {
        name: "Remini Ai",
        description:
            "AI-powered photo enhancement and restoration",
        image: "/assets/cards/remini.avif",
        category: "AI & Design"
    },

    // ========================================================
    // COMBOS
    // ========================================================

    "netflix-prime-video": {
        name: "Netflix + Prime Video",
        description:
            "Get both streaming services at a discount",
        image: "/assets/cards/Netflix-vs-Amazon.jpg",
        category: "Combo"
    },

    "netflix-hbo-max": {
        name: "Netflix + HBO Max",
        description:
            "Premium content from both platforms",
        image: "/assets/cards/netflix+hbomax.webp",
        category: "Combo"
    },

    "prime-video-hbo-max": {
        name: "Prime Video + HBO Max",
        description:
            "Premium content from both platforms",
        image: "/assets/cards/prime+hbo.webp",
        category: "Combo"
    },

    "hbo-max-surfshark-vpn": {
        name: "HBO Max + Surfshark VPN",
        description:
            "Stream securely with VPN protection",
        image: "/assets/cards/hbo+surfshark.webp",
        category: "Combo"
    },

    "spotify-youtube-premium": {
        name: "Spotify + YouTube Premium",
        description:
            "Ad-free music and videos",
        image: "/assets/cards/spotify+youtube.webp",
        category: "Combo"
    },

    "disney-hbo-max": {
        name: "Disney + HBO Max",
        description:
            "Disney+ and HBO Max premium entertainment",
        image: "/assets/cards/disney+nordVPN.webp",
        category: "Combo"
    },

    "disney-nord-vpn": {
        name: "Disney + Nord VPN",
        description:
            "Disney+ entertainment with NordVPN protection",
        image: "/assets/cards/disney+nordVPN.webp",
        category: "Combo"
    },

    "music-storage": {
        name: "Music & Storage",
        description:
            "Amazon Music HD and 1TB OneDrive storage",
        image: "/assets/cards/amazon+onedrive.png",
        category: "Combo"
    },

    "security-bundle": {
        name: "Security Bundle",
        description:
            "ExpressVPN and 1TB OneDrive cloud storage",
        image: "/assets/cards/expressvpn+onedrive.webp",
        category: "Combo"
    },

    "ultimate-entertainment": {
        name: "Ultimate Entertainment",
        description:
            "Netflix, HBO Max, and ExpressVPN",
        image: "/assets/cards/netflix_expressvpn_hbomax.webp",
        category: "Combo"
    },

    // ========================================================
    // EDUCATION
    // ========================================================

    "doulingo": {
        name: "Doulingo",
        description:
            "Learn languages with interactive lessons",
        image: "/assets/cards/doulingo.png",
        category: "Education"
    },

    "skillshare": {
        name: "Skillshare",
        description:
            "Access thousands of online creative courses",
        image: "/assets/cards/skill_share.png",
        category: "Education"
    },

    "linkedin-premium": {
        name: "LinkedIn Premium",
        description:
            "Professional development and career tools",
        image: "/assets/cards/LinkedIn.png",
        category: "Education"
    },

    "numerade": {
        name: "Numerade",
        description:
            "Learn with step-by-step educational video solutions",
        image: "/assets/cards/Numerade.jpg",
        category: "Education"
    },

    "grammarly-pro": {
        name: "Grammarly Pro",
        description:
            "Advanced writing, grammar and productivity tools",
        image: "/assets/cards/grammarly.png",
        category: "Education"
    },

    // ========================================================
    // ADULT
    // ========================================================

    "digital-playground": {
        name: "Digital Playground",
        description:
            "Exclusive premium content from creators",
        image: "/assets/cards/DigitalPlayground-logo.png",
        category: "Adult"
    },

    "pornhub-premium": {
        name: "Pornhub Premium",
        description:
            "Ad-free premium adult entertainment",
        image: "/assets/cards/pornhub.webp",
        category: "Adult"
    },

    "brazzers": {
        name: "Brazzers",
        description: "Premium adult content",
        image: "/assets/cards/brazzers.webp",
        category: "Adult"
    },

    "spice-vids": {
        name: "Spice Vids",
        description:
            "Premium adult streaming platform",
        image: "/assets/cards/spicevids.webp",
        category: "Adult"
    },

    "reality-kings": {
        name: "Reality Kings",
        description:
            "Premium reality adult content",
        image: "/assets/cards/realitykings.webp",
        category: "Adult"
    },

    "bang-bros": {
        name: "Bang Bros",
        description:
            "High-quality, exclusive adult entertainment",
        image: "/assets/cards/bangbros.webp",
        category: "Adult"
    },

    "babes-com": {
        name: "Babes.com",
        description:
            "High-quality, exclusive adult video content",
        image: "/assets/cards/babes.webp",
        category: "Adult"
    },

    // ========================================================
    // PRODUCTIVITY
    // ========================================================

    "truecaller-gold": {
        name: "True Caller Gold",
        description:
            "Premium caller identification and protection",
        image: "/assets/cards/truecaller.avif",
        category: "Productivity"
    }
};

// ============================================================
// SLUG ALIASES
// ============================================================

const slugAliases = {

    "netflix": "netflix-premium",

    "duolingo": "doulingo",

    "youtube-premium-nonrenewable":
        "youtube-premium-non-renewable"
};

// ============================================================
// SEO CONTENT OVERRIDES
// ============================================================
//
// Product-specific SEO content.
//
// IMPORTANT:
// Do not add claims that are not actually true for your offer.
//
// ============================================================

const seoContent = {

    "hbo-max": {
        intro:
            "Get an HBO Max subscription from NEXT LEVEL SUBS and access HBO, Warner Bros., DC, Max Originals and more premium entertainment.",

        sections: [
            {
                heading: "HBO Max Subscription",
                paragraphs: [
                    "HBO Max brings together premium entertainment from HBO, Warner Bros., DC and Max Originals in one streaming service.",
                    "NEXT LEVEL SUBS offers HBO Max subscription options for customers looking for convenient access to premium streaming entertainment."
                ]
            },
            {
                heading: "What can you watch on HBO Max?",
                paragraphs: [
                    "HBO Max features HBO programming, Warner Bros. movies and series, DC content and Max Original productions.",
                    "The available catalog can change over time as the streaming service adds new movies, series and original programming."
                ]
            },
            {
                heading: "Why choose an HBO Max subscription?",
                paragraphs: [
                    "An HBO Max subscription gives you access to a wide range of premium movies, series and original entertainment from one streaming platform.",
                    "Choose the subscription option available on NEXT LEVEL SUBS that best matches your needs."
                ]
            },
            {
                heading: "HBO Max Subscription from NEXT LEVEL SUBS",
                paragraphs: [
                    "Browse the available HBO Max subscription option, select your preferred plan and continue through the existing checkout process on NEXT LEVEL SUBS.",
                    "For the current price and plan availability, use the product options displayed on this page."
                ]
            }
        ]
    }

};

// ============================================================
// DEFAULT SEO CONTENT
// ============================================================

function getSEOContent(slug, product) {

    if (seoContent[slug]) {
        return seoContent[slug];
    }

    return {
        intro:
            `Get ${product.name} subscription from NEXT LEVEL SUBS. ${product.description}.`,

        sections: [
            {
                heading: `${product.name} Subscription`,
                paragraphs: [
                    `${product.name} is available from NEXT LEVEL SUBS as a premium ${String(product.category || "digital").toLowerCase()} service.`,
                    `${product.description}.`
                ]
            },
            {
                heading: `Why choose ${product.name}?`,
                paragraphs: [
                    `Explore the available ${product.name} subscription option and choose the plan that fits your needs.`,
                    `Current plan details and availability are shown on this product page.`
                ]
            },
            {
                heading: `${product.name} from NEXT LEVEL SUBS`,
                paragraphs: [
                    `View the available ${product.name} subscription options below and continue through the existing checkout experience.`
                ]
            }
        ]
    };
}

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

        const generated =
            generateSlug(products[key].name);

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

const productIndex =
    buildProductIndex();

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

    const generated =
        generateSlug(decoded);

    return productIndex[generated] || "";
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
            resolveProductKey(req.query.slug);

        if (resolved) {
            return resolved;
        }
    }

    // --------------------------------------------------------
    // CLEAN URL
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

    if (!match || !match[1]) {
        return "";
    }

    return resolveProductKey(match[1]);
}

// ============================================================
// ABSOLUTE URL
// ============================================================

function absoluteURL(value) {

    if (!value) {
        return `${SITE.domain}/assets/logo.png`;
    }

    if (/^https?:\/\//i.test(value)) {
        return value;
    }

    return (
        SITE.domain +
        (value.startsWith("/") ? "" : "/") +
        value
    );
}

// ============================================================
// GET PRODUCT IMAGE
// ============================================================

function getProductImage(product) {

    let image =
        product.image || "/assets/logo.png";

    // SVG social previews can be unreliable.
// Use site logo as a fallback.
    if (/\.svg(\?|#|$)/i.test(image)) {
        image = "/assets/logo.png";
    }

    return absoluteURL(image);
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

    return res.end(`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0"
    >
    <title>Product Not Found | ${escapeHTML(SITE.name)}</title>
    <meta
        name="robots"
        content="noindex, nofollow"
    >
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
</html>`);
}

// ============================================================
// BUILD RELATED PRODUCTS
// ============================================================

function getRelatedProducts(currentSlug, currentProduct) {

    const result = [];

    Object.keys(products).forEach(function (key) {

        if (key === currentSlug) {
            return;
        }

        const product =
            products[key];

        if (
            product.category ===
            currentProduct.category
        ) {

            result.push({
                slug: key,
                name: product.name
            });
        }
    });

    // Limit internal links.
    return result.slice(0, 8);
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

    return {

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
            product.category,

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
                    product.category
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
// MAIN HANDLER
// ============================================================

module.exports = function handler(req, res) {

    // ========================================================
    // GET / HEAD ONLY
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
    // FIND PRODUCT
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
    // EXISTING DETAILS PAGE
    // ========================================================

    const destinationURL =
        `${SITE.domain}/details.html?name=${encodeURIComponent(product.name)}`;

    // ========================================================
    // IMAGE
    // ========================================================

    const imageURL =
        getProductImage(product);

    // ========================================================
    // SEO TEXT
    // ========================================================

    const seo =
        getSEOContent(
            slug,
            product
        );

    const title =
        `${product.name} Subscription | ${SITE.name}`;

    const description =
        `${product.description}. Get ${product.name} subscription from ${SITE.name}.`;

    const imageAlt =
        `${product.name} - ${SITE.name}`;

    // ========================================================
    // RELATED PRODUCTS
    // ========================================================

    const relatedProducts =
        getRelatedProducts(
            slug,
            product
        );

    // ========================================================
    // STRUCTURED DATA
    // ========================================================

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
        "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
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
    // SERVER-RENDERED SEO SECTIONS
    // ========================================================

    const sectionHTML =
        seo.sections
            .map(function (section) {

                const paragraphs =
                    section.paragraphs
                        .map(function (paragraph) {

                            return `
                                <p>
                                    ${escapeHTML(paragraph)}
                                </p>
                            `;

                        })
                        .join("");

                return `
                    <section class="seo-section">
                        <h2>
                            ${escapeHTML(section.heading)}
                        </h2>

                        ${paragraphs}
                    </section>
                `;

            })
            .join("");

    // ========================================================
    // RELATED PRODUCT LINKS
    // ========================================================

    const relatedHTML =
        relatedProducts.length
            ? `
                <section class="related-products">

                    <h2>
                        More ${escapeHTML(product.category)}
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
                                            ${escapeHTML(related.name)}
                                        </a>
                                    </li>
                                `;

                            })
                            .join("")}
                    </ul>

                </section>
            `
            : "";

    // ========================================================
    // HTML
    // ========================================================

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
            clip: rect(0 0 0 0);
            clip-path: inset(50%);
            white-space: normal;
        }

        /*
         * IMPORTANT:
         * The SEO content is visually hidden from the normal
         * product UI but remains part of the server-rendered
         * HTML.
         *
         * The iframe remains the visible product interface.
         */

        .seo-content a {
            color: inherit;
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

    <!-- =====================================================
         SERVER-RENDERED SEO CONTENT
         ===================================================== -->

    <main
        class="seo-content"
        aria-label="${escapeHTML(product.name)}"
    >

        <!-- Breadcrumb -->
        <nav aria-label="Breadcrumb">

            <ol>

                <li>
                    <a href="${escapeHTML(SITE.domain)}/">
                        Home
                    </a>
                </li>

                <li>
                    ${escapeHTML(product.category)}
                </li>

                <li>
                    ${escapeHTML(product.name)}
                </li>

            </ol>

        </nav>

        <!-- Product heading -->

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
                    ${escapeHTML(product.category)}
                </a>
            </p>

            ${sectionHTML}

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
            document.getElementById("productFrame");

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
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/^-+|-+$/g, "");
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

        function goToProduct(targetSlug) {

            if (!targetSlug) {
                return;
            }

            targetSlug =
                String(targetSlug)
                    .trim()
                    .toLowerCase();

            if (!PRODUCT_MAP[targetSlug]) {
                return;
            }

            if (targetSlug === CURRENT_SLUG) {
                return;
            }

            var targetURL =
                PRODUCT_BASE +
                encodeURIComponent(targetSlug);

            window.top.location.href =
                targetURL;
        }

        // ====================================================
        // FIND SLUG FROM PRODUCT NAME
        // ====================================================

        function findSlugFromName(name) {

            if (!name) {
                return "";
            }

            var decoded =
                String(name);

            try {
                decoded =
                    decodeURIComponent(decoded);
            } catch (_) {}

            decoded =
                decoded
                    .trim()
                    .toLowerCase();

            // Exact name
            for (var key in PRODUCT_MAP) {

                if (
                    !Object.prototype.hasOwnProperty
                        .call(PRODUCT_MAP, key)
                ) {
                    continue;
                }

                var productName =
                    String(
                        PRODUCT_MAP[key].name || ""
                    )
                    .trim()
                    .toLowerCase();

                if (
                    productName === decoded
                ) {
                    return key;
                }
            }

            // Generated slug
            var generated =
                generateSlug(decoded);

            if (PRODUCT_MAP[generated]) {
                return generated;
            }

            return "";
        }

        // ====================================================
        // FIND SLUG FROM URL
        // ====================================================

        function findSlugFromURL(url) {

            if (!url) {
                return "";
            }

            try {

                var parsed =
                    new URL(
                        url,
                        window.location.origin
                    );

                // /product/{slug}
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
                        PRODUCT_MAP[directSlug]
                    ) {
                        return directSlug;
                    }
                }

                // details.html?name=Product
                if (
                    parsed.pathname
                        .toLowerCase()
                        .indexOf("details.html") !== -1
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

                // HOME
                if (
                    event.data.type ===
                    "NLS_GO_HOME"
                ) {

                    goHome();
                    return;
                }

                // PRODUCT
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
                    frameWin.location.href || "";

                if (!href) {
                    return;
                }

                var parsed =
                    new URL(href);

                var pathname =
                    parsed.pathname.toLowerCase();

                // HOME
                if (
                    pathname === "/" ||
                    pathname === "/index.html"
                ) {

                    goHome();
                    return;
                }

                // DETAILS PAGE
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
                            targetSlug !== CURRENT_SLUG
                        ) {

                            goToProduct(
                                targetSlug
                            );
                        }
                    }
                }

                // PRODUCT URL
                var detectedSlug =
                    findSlugFromURL(href);

                if (
                    detectedSlug &&
                    detectedSlug !== CURRENT_SLUG
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

                    // ========================================
                    // HISTORY BACK
                    // ========================================

                    try {

                        frameWin.history.back =
                            function () {
                                goHome();
                            };

                    } catch (_) {}

                    // ========================================
                    // HISTORY GO
                    // ========================================

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

                    // ========================================
                    // CLICK INTERCEPTION
                    // ========================================

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
                                target.closest("a");

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

                                    // HOME
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

                                    // PRODUCT URL
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

                                    // details.html?name=
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
                                    text.indexOf("back to") !== -1 ||
                                    text.indexOf("return to") !== -1 ||
                                    text.indexOf("return home") !== -1 ||
                                    text.indexOf("go home") !== -1
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