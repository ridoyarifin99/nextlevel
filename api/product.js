// ============================================================
// NEXT LEVEL SUBS
// PRODUCTION HYBRID PRODUCT SEO HANDLER
// ============================================================
//
// URL:
//   https://www.nextlevelsubs.com/product/hbo-max
//
// PURPOSE:
//   1. Server-rendered SEO HTML
//   2. Product structured data
//   3. Breadcrumb structured data
//   4. Organization / WebSite structured data
//   5. Bangladesh-focused product SEO
//   6. Open Graph / Twitter
//   7. Canonical URLs
//   8. Crawlable internal links
//   9. Existing details.html customer UI
//  10. Product navigation preservation
//
// IMPORTANT:
//   details.html DOES NOT need to be rewritten for this handler.
//
// ============================================================

"use strict";

// ============================================================
// SITE CONFIG
// ============================================================

const SITE = {
    name: "NEXT LEVEL SUBS",
    domain: "https://www.nextlevelsubs.com",
    locale: "en_BD",
    language: "en-BD",

    description:
        "Premium subscriptions, streaming services, VPNs, AI tools, cloud storage and digital services in Bangladesh.",

    currency: "BDT",

    country: "BD",

    logo:
        "https://www.nextlevelsubs.com/assets/logo.png"
};

// ============================================================
// PRODUCT DATABASE
// ============================================================
//
// Keep your existing product database here.
//
// The important change is that every product can now optionally
// contain SEO-specific information.
//
// You can gradually add:
//   price
//   duration
//   features
//   seoTitle
//   seoDescription
//   seoIntro
//   keywords
//   faq
//
// Products without those fields automatically receive sensible
// SEO enrichment from the central system below.
//
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
        image: "/assets/cards/prime_video.svg",
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
        description:
            "NBCUniversal content and live sports",
        image: "/assets/cards/Peacock.avif",
        category: "Streaming"
    },

    "youtube-premium": {
        name: "YouTube Premium",
        description:
            "Ad-free videos and YouTube Music",
        image: "/assets/cards/youtube.webp",
        category: "Streaming"
    },

    "youtube-premium-non-renewable": {
        name: "Youtube Premium Non-Renewable",
        description:
            "Ad-free videos and music",
        image: "/assets/cards/youtube.webp",
        category: "Streaming"
    },

    "discovery-plus": {
        name: "Discovery+",
        description:
            "Documentaries, Reality, Entertainment",
        image: "/assets/cards/discovery.webp",
        category: "Streaming"
    },

    "shudder-premium": {
        name: "Shudder Premium",
        description:
            "Horror, Thriller, Suspense",
        image: "/assets/cards/shudder.jpg",
        category: "Streaming"
    },

    "prime-video-full": {
        name: "Prime Video Full",
        description:
            "Movies, Series, Originals",
        image: "/assets/cards/primefull.webp",
        category: "Streaming"
    },

    "amc-plus": {
        name: "AMC+",
        description:
            "Horror, Thriller, Suspense",
        image: "/assets/cards/amc+.webp",
        category: "Streaming"
    },

    "fubo-tv": {
        name: "Fubo TV",
        description:
            "Sports, Live, Entertainment",
        image: "/assets/cards/fuboTV.webp",
        category: "Streaming"
    },

    "ullu-pro": {
        name: "Ullu Pro",
        description:
            "Adult, Web, Series",
        image: "/assets/cards/ullu.png",
        category: "Streaming"
    },

    "sling-tv": {
        name: "Sling TV",
        description:
            "Live, Channels, Streaming",
        image: "/assets/cards/slingtv.png",
        category: "Streaming"
    },

    // ========================================================
    // MUSIC
    // ========================================================

    "spotify-premium": {
        name: "Spotify Premium",
        description:
            "Ad-free music and podcasts",
        image: "/assets/cards/spotify.jpg",
        category: "Music"
    },

    "amazon-music-unlimited": {
        name: "Amazon Music Unlimited",
        description:
            "High-quality music and podcasts",
        image: "/assets/cards/amazon-music-unlimited.jpeg",
        category: "Music"
    },

    "apple-music": {
        name: "Apple Music",
        description:
            "Stream over 75 million songs",
        image: "/assets/cards/apple_music.jpg",
        category: "Music"
    },

    "tidal": {
        name: "Tidal",
        description:
            "High-fidelity music streaming",
        image: "/assets/cards/tidal.svg",
        category: "Music"
    },

    "pandora-premium": {
        name: "Pandora Premium",
        description:
            "Personalized music and podcasts",
        image: "/assets/cards/pandora.svg",
        category: "Music"
    },

    "soundcloud-go-plus": {
        name: "SoundCloud Go+",
        description:
            "Ad-free music and offline listening",
        image: "/assets/cards/sound_cloud.svg",
        category: "Music"
    },

    "deezer-hifi": {
        name: "Deezer HiFi",
        description:
            "High-quality audio streaming",
        image: "/assets/cards/deezer.svg",
        category: "Music"
    },

    // ========================================================
    // CLOUD STORAGE
    // ========================================================

    "microsoft-onedrive": {
        name: "Microsoft OneDrive",
        description:
            "1TB cloud storage with Office apps",
        image: "/assets/cards/onedrive.svg",
        category: "Cloud Storage"
    },

    "dropbox-plus": {
        name: "Dropbox Plus",
        description:
            "2TB secure cloud storage",
        image: "/assets/cards/Dropbox_(service)-Logo.wine.svg",
        category: "Cloud Storage"
    },

    "google-drive": {
        name: "Google Drive",
        description:
            "1TB cloud storage",
        image: "/assets/cards/Google_Drive-Logo.wine.svg",
        category: "Cloud Storage"
    },

    "icloud-plus": {
        name: "iCloud+",
        description:
            "50GB cloud storage for Apple users",
        image: "/assets/cards/icloud+webp.webp",
        category: "Cloud Storage"
    },

    "amazon-drive": {
        name: "Amazon Drive",
        description:
            "100GB cloud storage",
        image: "/assets/cards/amazon_drive.png",
        category: "Cloud Storage"
    },

    // ========================================================
    // VPN
    // ========================================================

    "expressvpn": {
        name: "ExpressVPN",
        description:
            "High-speed, secure VPN service",
        image: "/assets/cards/expressVPN.png",
        category: "VPN"
    },

    "nordvpn": {
        name: "NordVPN",
        description:
            "Advanced security with double VPN",
        image: "/assets/cards/nordvpn.webp",
        category: "VPN"
    },

    "surfshark": {
        name: "Surfshark",
        description:
            "Unlimited devices and connections",
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
        description:
            "Fast connections with no logs",
        image: "/assets/cards/ipvanish.webp",
        category: "VPN"
    },

    "private-internet-access": {
        name: "Private Internet Access",
        description:
            "Highly customizable VPN",
        image: "/assets/cards/pia.png",
        category: "VPN"
    },

    "hotspot-shield": {
        name: "Hotspot Shield",
        description:
            "Patented VPN technology",
        image: "/assets/cards/Hotspot-Shield-vpn.webp",
        category: "VPN"
    },

    "vypr-vpn": {
        name: "Vypr VPN",
        description:
            "Secure and private VPN service",
        image: "/assets/cards/vyprvpn.webp",
        category: "VPN"
    },

    // ========================================================
    // AI & DESIGN
    // ========================================================

    "canva-pro": {
        name: "Canva Pro",
        description:
            "Professional design tools and premium content",
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
        description:
            "Google's advanced AI assistant",
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
        description:
            "Premium adult content",
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
// SPECIAL PRODUCT SEO
// ============================================================
//
// These are the products where we can give stronger,
// product-specific search intent instead of generic templates.
//
// ============================================================

const seoOverrides = {

    "hbo-max": {
        seoTitle:
            "HBO Max Subscription in Bangladesh | Buy HBO Max BD",

        seoDescription:
            "Buy HBO Max subscription in Bangladesh from NEXT LEVEL SUBS. Explore HBO Max plans, pricing and subscription options for customers in Bangladesh.",

        intro:
            "Looking for an HBO Max subscription in Bangladesh? NEXT LEVEL SUBS provides HBO Max subscription options for customers in Bangladesh, with flexible plans and support.",

        searchTerms: [
            "HBO Max subscription Bangladesh",
            "HBO Max subscription BD",
            "buy HBO Max Bangladesh",
            "HBO Max price in Bangladesh",
            "HBO Max BD"
        ],

        features: [
            "Access HBO Max entertainment",
            "Watch HBO and Max Originals",
            "Enjoy Warner Bros. and DC content",
            "Flexible subscription options",
            "Bangladesh customer support"
        ],

        faq: [
            {
                q: "Where can I buy an HBO Max subscription in Bangladesh?",
                a: "You can purchase an HBO Max subscription through NEXT LEVEL SUBS and choose the available subscription option shown on the product page."
            },
            {
                q: "How much does HBO Max cost in Bangladesh?",
                a: "The current HBO Max price is displayed on the product page and may vary depending on the selected subscription duration or plan."
            },
            {
                q: "Can I buy HBO Max from Bangladesh?",
                a: "Yes. NEXT LEVEL SUBS offers HBO Max subscription options for customers in Bangladesh."
            }
        ]
    },

    "netflix-premium": {
        seoTitle:
            "Netflix Premium Subscription in Bangladesh | Buy Netflix BD",

        seoDescription:
            "Buy Netflix Premium subscription in Bangladesh from NEXT LEVEL SUBS. Compare available Netflix plans and subscription options for customers in Bangladesh.",

        intro:
            "Looking for a Netflix Premium subscription in Bangladesh? NEXT LEVEL SUBS offers Netflix subscription options for customers in Bangladesh.",

        searchTerms: [
            "Netflix subscription Bangladesh",
            "Netflix subscription BD",
            "buy Netflix Bangladesh",
            "Netflix price Bangladesh",
            "Netflix BD"
        ]
    },

    "spotify-premium": {
        seoTitle:
            "Spotify Premium Subscription in Bangladesh | Buy Spotify BD",

        seoDescription:
            "Buy Spotify Premium subscription in Bangladesh from NEXT LEVEL SUBS. Explore available Spotify subscription options and plans for Bangladesh.",

        intro:
            "Looking for Spotify Premium in Bangladesh? NEXT LEVEL SUBS provides Spotify Premium subscription options for customers in Bangladesh.",

        searchTerms: [
            "Spotify Premium Bangladesh",
            "Spotify subscription BD",
            "buy Spotify Premium Bangladesh",
            "Spotify price Bangladesh",
            "Spotify BD"
        ]
    },

    "amazon-prime-video": {
        seoTitle:
            "Amazon Prime Video Subscription in Bangladesh | Buy Prime Video BD",

        seoDescription:
            "Buy Amazon Prime Video subscription in Bangladesh from NEXT LEVEL SUBS. Explore available Prime Video subscription options for Bangladesh.",

        intro:
            "Looking for an Amazon Prime Video subscription in Bangladesh? NEXT LEVEL SUBS offers Prime Video subscription options for customers in Bangladesh.",

        searchTerms: [
            "Amazon Prime Video Bangladesh",
            "Prime Video subscription BD",
            "buy Prime Video Bangladesh",
            "Prime Video price Bangladesh",
            "Amazon Prime Video BD"
        ]
    }
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
// JSON-LD SAFE SERIALIZER
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

        const target =
            slugAliases[alias];

        if (products[target]) {
            index[alias.toLowerCase()] = target;
        }
    });

    return index;
}

const productIndex =
    buildProductIndex();

// ============================================================
// RESOLVE PRODUCT
// ============================================================

function resolveProductKey(value) {

    if (typeof value !== "string") {
        return "";
    }

    let decoded = value.trim();

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

    return productIndex[generated] || "";
}

// ============================================================
// GET PRODUCT SLUG
// ============================================================

function getProductSlug(req) {

    // --------------------------------------------------------
    // API QUERY
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
    // /product/{slug}
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
// SEO PRODUCT BUILDER
// ============================================================

function buildSEOProduct(slug, product) {

    const override =
        seoOverrides[slug] || {};

    const name =
        product.name;

    const category =
        product.category || "Digital Services";

    const generatedNameSlug =
        generateSlug(name);

    const defaultTitle =
        `${name} Subscription in Bangladesh | Buy ${name} BD`;

    const defaultDescription =
        `Buy ${name} subscription in Bangladesh from NEXT LEVEL SUBS. Explore available ${name} plans and subscription options for customers in Bangladesh.`;

    const title =
        override.seoTitle ||
        product.seoTitle ||
        defaultTitle;

    const description =
        override.seoDescription ||
        product.seoDescription ||
        defaultDescription;

    const intro =
        override.intro ||
        product.seoIntro ||
        `Looking for a ${name} subscription in Bangladesh? NEXT LEVEL SUBS provides ${name} subscription options for customers in Bangladesh.`;

    const searchTerms =
        override.searchTerms ||
        product.keywords ||
        [
            `${name} Bangladesh`,
            `${name} subscription Bangladesh`,
            `${name} subscription BD`,
            `buy ${name} Bangladesh`,
            `${name} price Bangladesh`,
            `${name} BD`
        ];

    const features =
        override.features ||
        product.features ||
        [
            `${name} subscription options`,
            "Flexible subscription plans",
            "Bangladesh customer support",
            "Fast digital delivery",
            "Secure ordering process"
        ];

    const faq =
        override.faq ||
        product.faq ||
        [
            {
                q: `Where can I buy ${name} in Bangladesh?`,
                a: `You can view the available ${name} subscription options on the NEXT LEVEL SUBS product page.`
            },
            {
                q: `How much does ${name} cost in Bangladesh?`,
                a: `The current ${name} price is displayed on the product page and depends on the available plan or subscription duration.`
            }
        ];

    return {
        slug,
        name,
        category,
        generatedNameSlug,
        title,
        description,
        intro,
        searchTerms,
        features,
        faq
    };
}

// ============================================================
// ABSOLUTE IMAGE URL
// ============================================================

function getImageURL(product) {

    let image =
        product.image ||
        "/assets/logo.png";

    // SVG is not ideal as a social preview image.
    if (/\.svg(\?|#|$)/i.test(image)) {
        image =
            "/assets/logo.png";
    }

    if (!/^https?:\/\//i.test(image)) {

        image =
            `${SITE.domain}${image.startsWith("/")
                ? ""
                : "/"}${image}`;
    }

    return image;
}

// ============================================================
// RELATED PRODUCTS
// ============================================================

function getRelatedProducts(currentSlug, product) {

    const currentCategory =
        product.category;

    const sameCategory =
        Object.keys(products)
            .filter(function (slug) {

                return (
                    slug !== currentSlug &&
                    products[slug].category ===
                        currentCategory
                );
            })
            .slice(0, 8);

    if (sameCategory.length >= 6) {
        return sameCategory;
    }

    const additional =
        Object.keys(products)
            .filter(function (slug) {

                return (
                    slug !== currentSlug &&
                    sameCategory.indexOf(slug) === -1
                );
            })
            .slice(
                0,
                8 - sameCategory.length
            );

    return sameCategory.concat(additional);
}

// ============================================================
// PRODUCT SCHEMA
// ============================================================

function buildProductSchema(
    seo,
    product,
    productURL,
    imageURL
) {

    const schema = {

        "@context": "https://schema.org",

        "@type": "Product",

        name: seo.name,

        description: seo.description,

        image: [
            imageURL
        ],

        url: productURL,

        category: seo.category,

        brand: {
            "@type": "Brand",
            name: seo.name
        },

        seller: {
            "@type": "Organization",
            name: SITE.name,
            url: SITE.domain
        }
    };

    // --------------------------------------------------------
    // ONLY ADD OFFER IF REAL PRODUCT DATA EXISTS
    // --------------------------------------------------------

    if (
        typeof product.price === "number" &&
        product.price > 0
    ) {

        schema.offers = {

            "@type": "Offer",

            priceCurrency:
                product.currency ||
                SITE.currency,

            price:
                product.price,

            availability:
                product.availability ||
                "https://schema.org/InStock",

            url:
                productURL,

            seller: {
                "@type":
                    "Organization",

                name:
                    SITE.name
            }
        };
    }

    return schema;
}

// ============================================================
// BREADCRUMB SCHEMA
// ============================================================

function buildBreadcrumbSchema(
    seo,
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
                    seo.category
            },

            {
                "@type":
                    "ListItem",

                position:
                    3,

                name:
                    seo.name,

                item:
                    productURL
            }
        ]
    };
}

// ============================================================
// ORGANIZATION SCHEMA
// ============================================================

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
            SITE.logo
    };
}

// ============================================================
// WEBSITE SCHEMA
// ============================================================

function buildWebsiteSchema() {

    return {

        "@context":
            "https://schema.org",

        "@type":
            "WebSite",

        name:
            SITE.name,

        url:
            `${SITE.domain}/`,

        inLanguage:
            SITE.language
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
<meta name="robots" content="noindex, nofollow">
<title>Product Not Found | ${escapeHTML(SITE.name)}</title>
</head>
<body>
<h1>Product Not Found</h1>
<p>The requested product could not be found.</p>
<p>
<a href="${escapeHTML(SITE.domain)}/">
Return to ${escapeHTML(SITE.name)}
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
    // METHOD
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
    // PRODUCT
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

    const seo =
        buildSEOProduct(
            slug,
            product
        );

    // ========================================================
    // URLS
    // ========================================================

    const productURL =
        `${SITE.domain}/product/${encodeURIComponent(slug)}`;

    const destinationURL =
        `${SITE.domain}/details.html?name=${encodeURIComponent(product.name)}`;

    const imageURL =
        getImageURL(product);

    // ========================================================
    // STRUCTURED DATA
    // ========================================================

    const productSchema =
        buildProductSchema(
            seo,
            product,
            productURL,
            imageURL
        );

    const breadcrumbSchema =
        buildBreadcrumbSchema(
            seo,
            productURL
        );

    const organizationSchema =
        buildOrganizationSchema();

    const websiteSchema =
        buildWebsiteSchema();

    // ========================================================
    // RELATED PRODUCTS
    // ========================================================

    const relatedProducts =
        getRelatedProducts(
            slug,
            product
        );

    // ========================================================
    // PRODUCT MAP
    // ========================================================

    const productMap =
        Object.keys(products)
            .reduce(
                function(map, key) {

                    map[key] = {
                        name:
                            products[key].name
                    };

                    return map;

                },
                {}
            );

    // ========================================================
    // HTTP HEADERS
    // ========================================================

    res.statusCode = 200;

    res.setHeader(
        "Content-Type",
        "text/html; charset=utf-8"
    );

    res.setHeader(
        "Content-Language",
        "en-BD"
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
    // HTML
    // ========================================================

    const html = `
<!DOCTYPE html>

<html lang="en-BD">

<head>

<meta charset="UTF-8">

<meta
    name="viewport"
    content="width=device-width, initial-scale=1.0"
>

<title>${escapeHTML(seo.title)}</title>

<meta
    name="description"
    content="${escapeHTML(seo.description)}"
>

<meta
    name="robots"
    content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
>

<link
    rel="canonical"
    href="${escapeHTML(productURL)}"
>

<link
    rel="alternate"
    hreflang="en-bd"
    href="${escapeHTML(productURL)}"
>

<link
    rel="alternate"
    hreflang="x-default"
    href="${escapeHTML(productURL)}"
>

<meta
    name="theme-color"
    content="#ffffff"
>

<!-- =====================================================
     OPEN GRAPH
     ===================================================== -->

<meta
    property="og:type"
    content="website"
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
        `${seo.name} subscription in Bangladesh`
    )}"
>

<!-- =====================================================
     TWITTER
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
     ORGANIZATION JSON-LD
     ===================================================== -->

<script type="application/ld+json">
${safeJSON(organizationSchema)}
</script>

<!-- =====================================================
     WEBSITE JSON-LD
     ===================================================== -->

<script type="application/ld+json">
${safeJSON(websiteSchema)}
</script>

<!-- =====================================================
     SEO PAGE STYLE
     ===================================================== -->

<style>

* {
    box-sizing: border-box;
}

html,
body {
    margin: 0;
    padding: 0;
    width: 100%;
    min-height: 100%;
    font-family:
        system-ui,
        -apple-system,
        BlinkMacSystemFont,
        "Segoe UI",
        sans-serif;
    color: #111827;
    background: #ffffff;
}

.seo-content {
    width: 100%;
    max-width: 1100px;
    margin: 0 auto;
    padding: 28px 20px 20px;
}

.seo-content h1 {
    margin: 0 0 14px;
    font-size: clamp(28px, 4vw, 42px);
    line-height: 1.15;
}

.seo-intro {
    margin: 0 0 20px;
    font-size: 17px;
    line-height: 1.7;
}

.seo-section {
    margin-top: 24px;
}

.seo-section h2 {
    margin: 0 0 12px;
    font-size: 23px;
}

.seo-section p {
    line-height: 1.7;
}

.seo-features {
    margin: 0;
    padding-left: 22px;
}

.seo-features li {
    margin: 7px 0;
    line-height: 1.6;
}

.seo-faq {
    margin-top: 12px;
}

.seo-faq details {
    border-bottom: 1px solid #e5e7eb;
    padding: 12px 0;
}

.seo-faq summary {
    cursor: pointer;
    font-weight: 600;
}

.related-products {
    display: grid;
    grid-template-columns:
        repeat(auto-fit, minmax(180px, 1fr));
    gap: 12px;
}

.related-products a {
    display: block;
    padding: 14px;
    border: 1px solid #e5e7eb;
    border-radius: 10px;
    color: #111827;
    text-decoration: none;
    font-weight: 600;
}

.related-products a:hover {
    text-decoration: underline;
}

.product-frame {
    display: block;
    width: 100%;
    min-height: 850px;
    border: 0;
}

@media (max-width: 700px) {

    .seo-content {
        padding:
            22px 16px 16px;
    }

    .seo-intro {
        font-size: 16px;
    }

    .product-frame {
        min-height: 900px;
    }
}

</style>

</head>

<body>

<!-- =====================================================
     SERVER-RENDERED SEO CONTENT
     ===================================================== -->

<main>

<section
    class="seo-content"
    aria-labelledby="product-title"
>

<h1 id="product-title">
    ${escapeHTML(seo.name)} Subscription in Bangladesh
</h1>

<p class="seo-intro">
    ${escapeHTML(seo.intro)}
</p>

<section class="seo-section">

<h2>
    ${escapeHTML(seo.name)} Subscription
</h2>

<p>
    NEXT LEVEL SUBS provides
    ${escapeHTML(seo.name)}
    subscription options for customers in Bangladesh.
    View the available plans and details below before
    placing your order.
</p>

</section>

<section class="seo-section">

<h2>
    ${escapeHTML(seo.name)} Features
</h2>

<ul class="seo-features">

${seo.features.map(function(feature) {

    return `
<li>
    ${escapeHTML(feature)}
</li>
`;

}).join("")}

</ul>

</section>

<section class="seo-section">

<h2>
    ${escapeHTML(seo.name)} in Bangladesh
</h2>

<p>
    If you are searching for
    ${escapeHTML(seo.name)}
    subscription in Bangladesh or
    ${escapeHTML(seo.name)} BD,
    this page contains the available subscription
    information from NEXT LEVEL SUBS.
</p>

</section>

<!-- =====================================================
     FAQ
     ===================================================== -->

<section
    class="seo-section"
    aria-labelledby="faq-heading"
>

<h2 id="faq-heading">
    Frequently Asked Questions
</h2>

<div class="seo-faq">

${seo.faq.map(function(item) {

    return `
<details>
    <summary>
        ${escapeHTML(item.q)}
    </summary>

    <p>
        ${escapeHTML(item.a)}
    </p>
</details>
`;

}).join("")}

</div>

</section>

<!-- =====================================================
     RELATED PRODUCTS
     ===================================================== -->

<section
    class="seo-section"
    aria-labelledby="related-heading"
>

<h2 id="related-heading">
    Related Subscriptions
</h2>

<nav
    class="related-products"
    aria-label="Related products"
>

${relatedProducts.map(function(relatedSlug) {

    const related =
        products[relatedSlug];

    return `
<a
    href="${escapeHTML(
        `${SITE.domain}/product/${encodeURIComponent(relatedSlug)}`
    )}"
>
    ${escapeHTML(related.name)}
</a>
`;

}).join("")}

</nav>

</section>

</section>

<!-- =====================================================
     EXISTING CUSTOMER PRODUCT UI
     ===================================================== -->

<iframe
    id="productFrame"
    class="product-frame"
    src="${escapeHTML(destinationURL)}"
    title="${escapeHTML(seo.name)}"
    loading="eager"
    allow="fullscreen"
></iframe>

</main>

<!-- =====================================================
     PRODUCT NAVIGATION CONTROLLER
     ===================================================== -->

<script>

(function () {

    "use strict";

    var SITE_HOME =
        ${safeJSON(`${SITE.domain}/`)};

    var PRODUCT_BASE =
        SITE_HOME + "product/";

    var CURRENT_SLUG =
        ${safeJSON(slug)};

    var frame =
        document.getElementById(
            "productFrame"
        );

    if (!frame) {
        return;
    }

    var PRODUCT_MAP =
        ${safeJSON(productMap)};

    // =====================================================
    // SLUG
    // =====================================================

    function generateSlug(value) {

        return String(value || "")
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-+|-+$/g, "");
    }

    // =====================================================
    // HOME
    // =====================================================

    function goHome() {

        if (
            window.top.location.href !==
            SITE_HOME
        ) {
            window.top.location.href =
                SITE_HOME;
        }
    }

    // =====================================================
    // PRODUCT
    // =====================================================

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

        if (
            targetSlug ===
            CURRENT_SLUG
        ) {
            return;
        }

        window.top.location.href =
            PRODUCT_BASE +
            encodeURIComponent(targetSlug);
    }

    // =====================================================
    // FIND SLUG FROM NAME
    // =====================================================

    function findSlugFromName(name) {

        if (!name) {
            return "";
        }

        var decoded =
            String(name)
                .trim()
                .toLowerCase();

        try {
            decoded =
                decodeURIComponent(decoded);
        } catch (_) {}

        for (
            var key in PRODUCT_MAP
        ) {

            if (
                !Object.prototype.hasOwnProperty
                    .call(PRODUCT_MAP, key)
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

        var generated =
            generateSlug(decoded);

        return PRODUCT_MAP[generated]
            ? generated
            : "";
    }

    // =====================================================
    // FIND SLUG FROM URL
    // =====================================================

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
                    PRODUCT_MAP[directSlug]
                ) {
                    return directSlug;
                }
            }

            if (
                parsed.pathname
                    .toLowerCase()
                    .indexOf(
                        "/details.html"
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

    // =====================================================
    // POSTMESSAGE
    // =====================================================

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

    // =====================================================
    // IFRAME LOCATION
    // =====================================================

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

            var detectedSlug =
                findSlugFromURL(href);

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

    // =====================================================
    // POLLING
    // =====================================================

    setInterval(
        pollFrameLocation,
        500
    );

    // =====================================================
    // IFRAME LOAD
    // =====================================================

    frame.addEventListener(
        "load",
        function () {

            try {

                var frameWin =
                    frame.contentWindow;

                var frameDoc =
                    frameWin.document;

                frameDoc.addEventListener(
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

                        if (link) {

                            var href =
                                link.getAttribute(
                                    "href"
                                ) || "";

                            try {

                                var url =
                                    new URL(
                                        href,
                                        frameWin.location.href
                                    );

                                var pathname =
                                    url.pathname
                                        .toLowerCase();

                                if (
                                    pathname === "/" ||
                                    pathname.indexOf(
                                        "index.html"
                                    ) !== -1
                                ) {

                                    event.preventDefault();
                                    event.stopPropagation();

                                    goHome();
                                    return;
                                }

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
                        }

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

    // =====================================================
    // INITIAL CHECK
    // =====================================================

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
};