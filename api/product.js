// ============================================================
// NEXT LEVEL SUBS
// PRODUCT SEO / OPEN GRAPH / SOCIAL PREVIEW HANDLER
// ============================================================
//
// CLEAN PRODUCT URLS:
//
// https://www.nextlevelsubs.com/products/netflix-premium
// https://www.nextlevelsubs.com/products/hbo-max
// https://www.nextlevelsubs.com/products/spotify-premium
//
// API:
//
// https://www.nextlevelsubs.com/api/product?slug=netflix-premium
//
// IMPORTANT:
//
// This server-side page displays your existing details.html
// inside an iframe.
//
// Normal visitors:
//     /products/netflix-premium
//              ↓
//     details.html?name=Netflix%20Premium
//
// Social crawlers:
//     Receive real SEO / OG / Twitter metadata.
//
// Related products:
//     Clicking a related product changes the TOP browser URL
//     to /products/{slug}.
//
// ============================================================


"use strict";


// ============================================================
// SITE CONFIGURATION
// ============================================================

const SITE = {
    name: "NEXT LEVEL SUBS",

    domain: "https://www.nextlevelsubs.com",

    defaultDescription:
        "Premium subscriptions, streaming services, VPNs, AI tools, cloud storage and more from NEXT LEVEL SUBS.",

    locale: "en_US"
};


// ============================================================
// PRODUCT DATABASE
// ============================================================
//
// IMPORTANT:
// Do NOT put details.html URLs here anymore.
//
// The destination URL is automatically generated from
// the product name.
//
// This prevents many "Product Not Found" problems caused
// by manually encoded names.
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
        image: "/assets/cards/max.png",
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
        description: "Premium movies, series and exclusive Disney content",
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
        description: "Movies, live sports, and exclusive originals",
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
        description: "User-friendly VPN with 45-day guarantee",
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
        description: "Canva Pro: Where Ideas Turn into Stunning Designs—Fast!",
        image: "/assets/cards/canva.png",
        category: "AI & Design"
    },

    "photoroom-pro": {
        name: "Photoroom Pro",
        description: "Professional AI-powered photo editing and design tools",
        image: "/assets/cards/photoroom.jpg",
        category: "AI & Design"
    },

    "picsart-premium": {
        name: "Picsart Premium",
        description: "Creative photo and video editing tools",
        image: "/assets/cards/picsart.png",
        category: "AI & Design"
    },

    "photoroom-max": {
        name: "Photoroom Max",
        description: "Advanced AI photo editing and creative tools",
        image: "/assets/cards/photoroom.jpg",
        category: "AI & Design"
    },

    "blackbox-ai-chatgpt5": {
        name: "Black Box Ai (CHAT-GPT5)",
        description: "AI-powered coding and development assistant",
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
        description: "Advanced AI assistant for writing, research and productivity",
        image: "/assets/cards/chatgpt.jpg",
        category: "AI & Design"
    },

    "perplexity-chatgpt5": {
        name: "Perplexity (ChatGPT-5)",
        description: "AI-powered search and research assistant",
        image: "/assets/cards/Perplexity.svg",
        category: "AI & Design"
    },

    "remini-ai": {
        name: "Remini Ai",
        description: "AI-powered photo enhancement and restoration",
        image: "/assets/cards/remini.avif",
        category: "AI & Design"
    },


    // ========================================================
    // COMBOS
    // ========================================================

    "netflix-prime-video": {
        name: "Netflix + Prime Video",
        description: "Get both streaming services at a discount",
        image: "/assets/cards/Netflix-vs-Amazon.jpg",
        category: "Combo"
    },

    "netflix-hbo-max": {
        name: "Netflix + HBO Max",
        description: "Premium content from both platforms",
        image: "/assets/cards/netflix+hbomax.webp",
        category: "Combo"
    },

    "prime-video-hbo-max": {
        name: "Prime Video + HBO Max",
        description: "Premium content from both platforms",
        image: "/assets/cards/prime+hbo.webp",
        category: "Combo"
    },

    "hbo-max-surfshark-vpn": {
        name: "HBO Max + Surfshark VPN",
        description: "Stream securely with VPN protection",
        image: "/assets/cards/hbo+surfshark.webp",
        category: "Combo"
    },

    "spotify-youtube-premium": {
        name: "Spotify + YouTube Premium",
        description: "Ad-free music and videos",
        image: "/assets/cards/spotify+youtube.webp",
        category: "Combo"
    },

    "disney-hbo-max": {
        name: "Disney + HBO Max",
        description: "Disney+ and HBO Max premium entertainment",
        image: "/assets/cards/disney+nordVPN.webp",
        category: "Combo"
    },

    "disney-nord-vpn": {
        name: "Disney + Nord VPN",
        description: "Disney+ entertainment with NordVPN protection",
        image: "/assets/cards/disney+nordVPN.webp",
        category: "Combo"
    },

    "music-storage": {
        name: "Music & Storage",
        description: "Amazon Music HD and 1TB OneDrive storage",
        image: "/assets/cards/amazon+onedrive.png",
        category: "Combo"
    },

    "security-bundle": {
        name: "Security Bundle",
        description: "ExpressVPN and 1TB OneDrive cloud storage",
        image: "/assets/cards/expressvpn+onedrive.webp",
        category: "Combo"
    },

    "ultimate-entertainment": {
        name: "Ultimate Entertainment",
        description: "Netflix, HBO Max, and ExpressVPN",
        image: "/assets/cards/netflix_expressvpn_hbomax.webp",
        category: "Combo"
    },


    // ========================================================
    // EDUCATION
    // ========================================================

    "doulingo": {
        name: "Doulingo",
        description: "Learn languages with interactive lessons",
        image: "/assets/cards/doulingo.png",
        category: "Education"
    },

    "skillshare": {
        name: "Skillshare",
        description: "Access thousands of online creative courses",
        image: "/assets/cards/skill_share.png",
        category: "Education"
    },

    "linkedin-premium": {
        name: "LinkedIn Premium",
        description: "Professional development and career tools",
        image: "/assets/cards/LinkedIn.png",
        category: "Education"
    },

    "numerade": {
        name: "Numerade",
        description: "Learn with step-by-step educational video solutions",
        image: "/assets/cards/Numerade.jpg",
        category: "Education"
    },

    "grammarly-pro": {
        name: "Grammarly Pro",
        description: "Advanced writing, grammar and productivity tools",
        image: "/assets/cards/grammarly.png",
        category: "Education"
    },


    // ========================================================
    // ADULT
    // ========================================================

    "digital-playground": {
        name: "Digital Playground",
        description: "Exclusive premium content from creators",
        image: "/assets/cards/DigitalPlayground-logo.png",
        category: "Adult"
    },

    "pornhub-premium": {
        name: "Pornhub Premium",
        description: "Ad-free premium adult entertainment",
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
        description: "Premium adult streaming platform",
        image: "/assets/cards/spicevids.webp",
        category: "Adult"
    },

    "reality-kings": {
        name: "Reality Kings",
        description: "Premium reality adult content",
        image: "/assets/cards/realitykings.webp",
        category: "Adult"
    },

    "bang-bros": {
        name: "Bang Bros",
        description: "High-quality, exclusive adult entertainment",
        image: "/assets/cards/bangbros.webp",
        category: "Adult"
    },

    "babes-com": {
        name: "Babes.com",
        description: "High-quality, exclusive adult video content",
        image: "/assets/cards/babes.webp",
        category: "Adult"
    },


    // ========================================================
    // OTHER / PRODUCTIVITY
    // ========================================================

    "truecaller-gold": {
        name: "True Caller Gold",
        description: "Premium caller identification and protection",
        image: "/assets/cards/truecaller.avif",
        category: "Productivity"
    }
};


// ============================================================
// OPTIONAL SLUG ALIASES
// ============================================================
//
// These allow older URLs to continue working.
//
// Example:
// /product/netflix-premium
// /products/netflix-premium
//
// Both resolve to the same product.
//
// ============================================================

const slugAliases = {

    // Old singular route compatibility
    "netflix": "netflix-premium",

    // Common spelling variants
    "duolingo": "doulingo",

    // Common capitalization/format variants
    "youtube-premium-nonrenewable": "youtube-premium-non-renewable"
};


// ============================================================
// HELPERS
// ============================================================

function escapeHTML(value) {

    return String(value == null ? "" : value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


// ------------------------------------------------------------
// Safe JSON for JSON-LD
// ------------------------------------------------------------

function safeJSON(value) {

    return JSON.stringify(value)
        .replace(/</g, "\\u003c")
        .replace(/>/g, "\\u003e")
        .replace(/&/g, "\\u0026")
        .replace(/\u2028/g, "\\u2028")
        .replace(/\u2029/g, "\\u2029");
}


// ------------------------------------------------------------
// Absolute URL
// ------------------------------------------------------------

function absoluteURL(path) {

    if (!path) {
        return SITE.domain;
    }

    if (/^https?:\/\//i.test(path)) {
        return path;
    }

    return `${SITE.domain}${path.startsWith("/") ? "" : "/"}${path}`;
}


// ============================================================
// SLUG GENERATOR
// ============================================================
//
// This is the SAME logic used to identify related products.
//
// ============================================================

function productSlug(name) {

    return String(name || "")
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
}


// ============================================================
// BUILD PRODUCT INDEX
// ============================================================
//
// Allows lookup by:
//
// 1. Explicit database key
// 2. Product name converted to slug
//
// This is important because some product names contain:
//
// +
// &
// ()
// punctuation
// ============================================================

function buildProductIndex() {

    const index = Object.create(null);

    Object.keys(products).forEach(function (key) {

        const product = products[key];

        // Explicit key
        index[key.toLowerCase()] = key;

        // Generated slug from product name
        const generated = productSlug(product.name);

        if (generated) {
            index[generated] = key;
        }
    });

    // Aliases
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
// NORMALIZE SLUG
// ============================================================

function normalizeSlug(value) {

    if (typeof value !== "string") {
        return "";
    }

    let result = value.trim();

    if (!result) {
        return "";
    }

    // Decode repeatedly only when necessary
    try {
        result = decodeURIComponent(result);
    } catch (_) {
        // Keep original if malformed
    }

    result = result
        .trim()
        .toLowerCase();

    // Remove accidental leading/trailing slash
    result = result
        .replace(/^\/+|\/+$/g, "");

    return result;
}


// ============================================================
// RESOLVE PRODUCT KEY
// ============================================================

function resolveProductKey(value) {

    const normalized = normalizeSlug(value);

    if (!normalized) {
        return "";
    }

    // Direct key
    if (products[normalized]) {
        return normalized;
    }

    // Indexed key
    if (productIndex[normalized]) {
        return productIndex[normalized];
    }

    // Last fallback:
    // Compare generated slugs.
    const generated = productSlug(normalized);

    if (productIndex[generated]) {
        return productIndex[generated];
    }

    return "";
}


// ============================================================
// GET SLUG FROM REQUEST
// ============================================================
//
// Supports:
//
// /products/netflix-premium
// /product/netflix-premium
// /api/product?slug=netflix-premium
//
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

        const resolved = resolveProductKey(req.query.slug);

        if (resolved) {
            return resolved;
        }
    }


    // --------------------------------------------------------
    // REQUEST URL
    // --------------------------------------------------------

    const rawURL = req.url || "";

    const pathname = rawURL.split("?")[0];


    // --------------------------------------------------------
    // NEW CLEAN URL
    //
    // /products/netflix-premium
    // --------------------------------------------------------

    let match = pathname.match(
        /^\/products\/([^/]+)\/?$/
    );

    if (match && match[1]) {

        const resolved = resolveProductKey(match[1]);

        if (resolved) {
            return resolved;
        }
    }


    // --------------------------------------------------------
    // OLD URL
    //
    // /product/netflix-premium
    //
    // Kept for compatibility.
    // --------------------------------------------------------

    match = pathname.match(
        /^\/product\/([^/]+)\/?$/
    );

    if (match && match[1]) {

        const resolved = resolveProductKey(match[1]);

        if (resolved) {
            return resolved;
        }
    }


    return "";
}


// ============================================================
// FIND PRODUCT BY DETAILS.HTML NAME
// ============================================================
//
// This is used by the iframe controller.
//
// Example:
//
// details.html?name=Netflix%20%2B%20Prime%20Video
//
// becomes:
//
// /products/netflix-prime-video
//
// ============================================================

function findProductSlugByName(name) {

    if (!name || typeof name !== "string") {
        return "";
    }

    let decoded = name;

    try {
        decoded = decodeURIComponent(name);
    } catch (_) {
        // Keep original
    }

    decoded = decoded
        .trim()
        .toLowerCase();

    // Exact name comparison
    for (const key of Object.keys(products)) {

        const product = products[key];

        if (
            product.name
                .trim()
                .toLowerCase() === decoded
        ) {
            return key;
        }
    }

    // Slug comparison
    const generated = productSlug(decoded);

    return resolveProductKey(generated);
}


// ============================================================
// SOCIAL IMAGE
// ============================================================

function getSocialImage(product) {

    const image = product.image || "";

    // SVG images are not reliable for all social crawlers.
    // Use logo.png as fallback.
    if (/\.svg(\?|#|$)/i.test(image)) {
        return "/assets/logo.png";
    }

    return image;
}


// ============================================================
// 404
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

    <title>
        Product Not Found | NEXT LEVEL SUBS
    </title>

</head>

<body>

    <h1>
        Product Not Found
    </h1>

    <p>
        The requested product could not be found.
    </p>

    <p>
        <a href="${escapeHTML(SITE.domain)}/">
            Return to NEXT LEVEL SUBS
        </a>
    </p>

</body>

</html>`);
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

        return res.end("Method Not Allowed");
    }


    // ========================================================
    // FIND PRODUCT
    // ========================================================

    const slug = getProductSlug(req);

    if (!slug || !products[slug]) {
        return send404(res);
    }

    const product = products[slug];


    // ========================================================
    // URLS
    // ========================================================

    const productURL =
        `${SITE.domain}/products/${encodeURIComponent(slug)}`;


    const imageURL =
        absoluteURL(
            getSocialImage(product)
        );


    // --------------------------------------------------------
    // Existing details.html product page
    // --------------------------------------------------------

    const destinationURL =
        `${SITE.domain}/details.html?name=${encodeURIComponent(product.name)}`;


    // ========================================================
    // SEO
    // ========================================================

    const title =
        `${product.name} Subscription | NEXT LEVEL SUBS`;


    const description =
        `${product.description}. Get ${product.name} subscription from NEXT LEVEL SUBS.`;


    const imageAlt =
        `${product.name} - NEXT LEVEL SUBS`;


    // ========================================================
    // JSON-LD PRODUCT
    // ========================================================

    const productSchema = {

        "@context": "https://schema.org",

        "@type": "Product",

        "name": product.name,

        "description": description,

        "image": [
            imageURL
        ],

        "url": productURL,

        "category": product.category,

        "brand": {
            "@type": "Brand",
            "name": SITE.name
        },

        "seller": {
            "@type": "Organization",
            "name": SITE.name,
            "url": SITE.domain
        }
    };


    // ========================================================
    // BREADCRUMB
    // ========================================================

    const breadcrumbSchema = {

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
                "name": product.category
            },

            {
                "@type": "ListItem",
                "position": 3,
                "name": product.name,
                "item": productURL
            }
        ]
    };


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
        "en"
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
    // HTML
    // ========================================================

    const html = `<!DOCTYPE html>

<html lang="en">

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
        content="image/png"
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
         JSON-LD PRODUCT
         ===================================================== -->

    <script type="application/ld+json">
${safeJSON(productSchema)}
    </script>


    <!-- =====================================================
         JSON-LD BREADCRUMB
         ===================================================== -->

    <script type="application/ld+json">
${safeJSON(breadcrumbSchema)}
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

            height: 100%;

            overflow: hidden;

            background: #ffffff;
        }


        iframe {

            display: block;

            width: 100%;

            height: 100%;

            border: 0;
        }


        .fallback {

            position: fixed;

            inset: 0;

            display: flex;

            align-items: center;

            justify-content: center;

            font-family: Arial, sans-serif;

            background: #ffffff;

            z-index: 10;
        }


        .fallback a {

            color: #111111;

            text-decoration: none;
        }

    </style>

</head>


<body>


    <!-- =====================================================
         EXISTING PRODUCT DETAIL PAGE
         ===================================================== -->

    <iframe

        id="productFrame"

        src="${escapeHTML(destinationURL)}"

        title="${escapeHTML(product.name)}"

        loading="eager"

        allow="fullscreen"

    ></iframe>


    <!-- =====================================================
         NOSCRIPT FALLBACK
         ===================================================== -->

    <noscript>

        <div class="fallback">

            <a href="${escapeHTML(destinationURL)}">

                Continue to
                ${escapeHTML(product.name)}

            </a>

        </div>

    </noscript>


    <!-- =====================================================
         PRODUCT NAVIGATION CONTROLLER
         ===================================================== -->

    <script>

    (function () {

        "use strict";


        // ====================================================
        // CONFIG
        // ====================================================

        const SITE_HOME =
            "${escapeHTML(SITE.domain)}/";


        const CURRENT_SLUG =
            "${escapeHTML(slug)}";


        const CURRENT_PRODUCT_NAME =
            "${escapeHTML(product.name)}";


        const frame =
            document.getElementById("productFrame");


        if (!frame) {
            return;
        }


        // ====================================================
        // PRODUCT DATABASE FOR CLIENT NAVIGATION
        // ====================================================

        const PRODUCT_MAP = ${safeJSON(
            Object.keys(products).reduce(function (map, key) {

                map[key] = {
                    name: products[key].name
                };

                return map;

            }, {})
        )};


        // ====================================================
        // GO HOME
        // ====================================================

        function goHome() {

            window.top.location.href =
                SITE_HOME;
        }


        // ====================================================
        // GO TO PRODUCT
        // ====================================================

        function goToProduct(slug) {

            if (!slug) {
                return;
            }


            const cleanSlug =
                String(slug)
                    .trim()
                    .toLowerCase()
                    .replace(/^\\/+|\\/+$/g, "");


            if (!cleanSlug) {
                return;
            }


            // Already on this product
            if (cleanSlug === CURRENT_SLUG) {
                return;
            }


            const target =
                SITE_HOME +
                "products/" +
                encodeURIComponent(cleanSlug);


            // IMPORTANT:
            // Navigate the TOP window, not iframe.
            window.top.location.href =
                target;
        }


        // ====================================================
        // SLUGIFY
        // ====================================================

        function makeSlug(value) {

            return String(value || "")

                .toLowerCase()

                .trim()

                .replace(/[^a-z0-9]+/g, "-")

                .replace(/^-+|-+$/g, "");
        }


        // ====================================================
        // FIND PRODUCT FROM NAME
        // ====================================================

        function findProductFromName(name) {

            if (!name) {
                return "";
            }


            let decoded =
                String(name);


            try {

                decoded =
                    decodeURIComponent(decoded);

            } catch (_) {}


            decoded =
                decoded
                    .trim()
                    .toLowerCase();


            // Exact product-name match
            for (
                const slug
                of Object.keys(PRODUCT_MAP)
            ) {

                const product =
                    PRODUCT_MAP[slug];


                if (
                    product.name
                        .trim()
                        .toLowerCase() === decoded
                ) {

                    return slug;
                }
            }


            // Slug fallback
            const generated =
                makeSlug(decoded);


            if (
                PRODUCT_MAP[generated]
            ) {

                return generated;
            }


            return "";
        }


        // ====================================================
        // GET PRODUCT FROM HREF
        // ====================================================

        function getProductFromHref(href) {

            if (!href) {
                return "";
            }


            let url;


            try {

                url =
                    new URL(
                        href,
                        frame.contentWindow.location.href
                    );

            } catch (_) {

                return "";
            }


            // ------------------------------------------------
            // Already clean product URL
            //
            // /products/netflix-premium
            // ------------------------------------------------

            const cleanMatch =
                url.pathname.match(
                    /^\\/products\\/([^/]+)\\/?$/i
                );


            if (
                cleanMatch &&
                cleanMatch[1]
            ) {

                const slug =
                    decodeURIComponent(
                        cleanMatch[1]
                    )
                    .toLowerCase();


                if (PRODUCT_MAP[slug]) {
                    return slug;
                }
            }


            // ------------------------------------------------
            // Old product URL
            // ------------------------------------------------

            const oldMatch =
                url.pathname.match(
                    /^\\/product\\/([^/]+)\\/?$/i
                );


            if (
                oldMatch &&
                oldMatch[1]
            ) {

                const slug =
                    decodeURIComponent(
                        oldMatch[1]
                    )
                    .toLowerCase();


                if (PRODUCT_MAP[slug]) {
                    return slug;
                }
            }


            // ------------------------------------------------
            // details.html?name=PRODUCT
            // ------------------------------------------------

            const isDetailsPage =
                url.pathname
                    .toLowerCase()
                    .endsWith(
                        "/details.html"
                    );


            if (isDetailsPage) {

                const name =
                    url.searchParams.get(
                        "name"
                    );


                if (name) {

                    return findProductFromName(
                        name
                    );
                }
            }


            return "";
        }


        // ====================================================
        // CHECK HOME LINK
        // ====================================================

        function isHomeLink(href) {

            if (!href) {
                return false;
            }


            try {

                const url =
                    new URL(
                        href,
                        frame.contentWindow.location.href
                    );


                return (

                    url.origin ===
                    window.location.origin

                    &&

                    (
                        url.pathname === "/"

                        ||

                        url.pathname
                            .toLowerCase() ===
                            "/index.html"
                    )
                );

            } catch (_) {

                return (
                    href === "/" ||

                    href === "/index.html"
                );
            }
        }


        // ====================================================
        // HANDLE IFRAME
        // ====================================================

        frame.addEventListener(
            "load",
            function () {

                try {

                    const frameWindow =
                        frame.contentWindow;


                    const frameDocument =
                        frameWindow.document;


                    // =================================================
                    // FORCE HISTORY BACK
                    // =================================================

                    try {

                        frameWindow.history.back =
                            function () {

                                goHome();
                            };

                    } catch (_) {}


                    // =================================================
                    // FORCE HISTORY GO(-1)
                    // =================================================

                    try {

                        frameWindow.history.go =
                            function (delta) {

                                if (
                                    typeof delta ===
                                        "number"
                                    &&
                                    delta < 0
                                ) {

                                    goHome();

                                    return;
                                }
                            };

                    } catch (_) {}


                    // =================================================
                    // CLICK HANDLER
                    // =================================================

                    frameDocument.addEventListener(

                        "click",

                        function (event) {

                            let link =
                                event.target.closest(
                                    "a"
                                );


                            // =================================================
                            // LINK CLICK
                            // =================================================

                            if (link) {

                                const href =
                                    link.getAttribute(
                                        "href"
                                    );


                                if (!href) {
                                    return;
                                }


                                // -------------------------------------------------
                                // HOME
                                // -------------------------------------------------

                                if (
                                    isHomeLink(href)
                                ) {

                                    event.preventDefault();

                                    event.stopPropagation();

                                    goHome();

                                    return;
                                }


                                // -------------------------------------------------
                                // PRODUCT LINK
                                //
                                // This is the IMPORTANT fix.
                                //
                                // Related products normally link to:
                                //
                                // details.html?name=Netflix Premium
                                //
                                // Instead of allowing the iframe to navigate,
                                // we navigate the TOP browser window to:
                                //
                                // /products/netflix-premium
                                // -------------------------------------------------

                                const relatedSlug =
                                    getProductFromHref(
                                        href
                                    );


                                if (relatedSlug) {

                                    event.preventDefault();

                                    event.stopPropagation();

                                    goToProduct(
                                        relatedSlug
                                    );

                                    return;
                                }


                                // -------------------------------------------------
                                // JAVASCRIPT / HASH
                                // -------------------------------------------------

                                const lowerHref =
                                    href.toLowerCase();


                                if (
                                    lowerHref.startsWith(
                                        "#"
                                    )
                                    ||
                                    lowerHref.startsWith(
                                        "javascript:"
                                    )
                                ) {

                                    return;
                                }


                                // -------------------------------------------------
                                // history.back()
                                // -------------------------------------------------

                                if (
                                    lowerHref.includes(
                                        "history.back"
                                    )
                                    ||
                                    lowerHref.includes(
                                        "history.go(-1)"
                                    )
                                ) {

                                    event.preventDefault();

                                    event.stopPropagation();

                                    goHome();

                                    return;
                                }

                            }


                            // =================================================
                            // BUTTONS
                            // =================================================

                            const element =
                                event.target.closest(
                                    "button, [role='button']"
                                );


                            if (!element) {
                                return;
                            }


                            const text =
                                (
                                    element.innerText
                                    ||
                                    element.textContent
                                    ||
                                    ""
                                )
                                .trim()
                                .toLowerCase();


                            // -------------------------------------------------
                            // BACK / HOME BUTTONS
                            // -------------------------------------------------

                            if (

                                text === "back"

                                ||

                                text.includes(
                                    "back to"
                                )

                                ||

                                text.includes(
                                    "return to"
                                )

                                ||

                                text.includes(
                                    "return home"
                                )

                                ||

                                text.includes(
                                    "go home"
                                )

                                ||

                                text === "home"

                            ) {

                                event.preventDefault();

                                event.stopPropagation();

                                goHome();
                            }

                        },

                        true
                    );


                    // =================================================
                    // POPSTATE
                    // =================================================

                    frameWindow.addEventListener(

                        "popstate",

                        function () {

                            goHome();
                        }
                    );


                    // =================================================
                    // HASHCHANGE
                    // =================================================
                    //
                    // Do NOT send home for hash changes.
                    // They may be normal details.html functionality.
                    //

                    console.log(
                        "NEXT LEVEL SUBS product controller loaded:",
                        CURRENT_PRODUCT_NAME,
                        CURRENT_SLUG
                    );


                } catch (error) {

                    console.warn(
                        "NEXT LEVEL SUBS product iframe controller:",
                        error
                    );
                }

            }
        );


        // ====================================================
        // TOP-LEVEL HISTORY STATE
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


    })();

    </script>


</body>

</html>`;


    return res.end(html);
};