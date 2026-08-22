// ============================================================
// NEXT LEVEL SUBS
// PRODUCT SEO / OPEN GRAPH / SOCIAL PREVIEW HANDLER
// ============================================================
//
// CLEAN PRODUCT URL:
//
// https://nextlevelsubs.com/product/netflix-premium
// https://nextlevelsubs.com/product/hbo-max
// https://nextlevelsubs.com/product/spotify-premium
//
// IMPORTANT:
// Use /product/ everywhere.
// NEVER use /products/.
//
// The actual existing product UI remains:
//
// /details.html?name=Netflix%20Premium
//
// But visitors/crawlers see:
//
// /product/netflix-premium
//
// Related products inside details.html are automatically
// converted to /product/{slug} at the TOP browser level.
//
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
// The slug is the public URL slug.
//
// Example:
//
// "netflix-premium":
//     name: "Netflix Premium"
//
// Public URL:
// /product/netflix-premium
//
// Existing details page:
// /details.html?name=Netflix%20Premium
//
// ============================================================

const products = {

    // =========================================================
    // STREAMING
    // =========================================================

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


    // =========================================================
    // MUSIC
    // =========================================================

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


    // =========================================================
    // CLOUD STORAGE
    // =========================================================

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


    // =========================================================
    // VPN
    // =========================================================

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


    // =========================================================
    // AI & DESIGN
    // =========================================================

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


    // =========================================================
    // COMBOS
    // =========================================================

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


    // =========================================================
    // EDUCATION
    // =========================================================

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


    // =========================================================
    // ADULT
    // =========================================================

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


    // =========================================================
    // OTHER
    // =========================================================

    "truecaller-gold": {
        name: "True Caller Gold",
        description: "Premium caller identification and protection",
        image: "/assets/cards/truecaller.avif",
        category: "Productivity"
    }
};


// ============================================================
// BUILD INTERNAL DETAILS PAGE URL
// ============================================================
//
// We generate this automatically from the product name.
//
// This means you no longer need:
//
// page: "/details.html?name=..."
//
// for every product.
//
// ============================================================

function getDetailsURL(product) {

    return "/details.html?name=" +
        encodeURIComponent(product.name);

}


// ============================================================
// HELPERS
// ============================================================

function escapeHTML(value) {

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


function safeJSON(value) {

    return JSON.stringify(value)
        .replace(/</g, "\\u003c")
        .replace(/>/g, "\\u003e")
        .replace(/&/g, "\\u0026");

}


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
// SOCIAL IMAGE
// ============================================================

function getSocialImage(product) {

    const image = product.image || "";

    // SVG is not reliable for every social crawler.
    if (/\.svg(\?|#|$)/i.test(image)) {
        return "/assets/logo.png";
    }

    return image;

}


// ============================================================
// NORMALIZE PRODUCT NAME
// ============================================================
//
// Used when details.html contains:
//
// /details.html?name=Netflix%20Premium
//
// or:
//
// /details.html?name=Netflix+Premium
//
// or encoded variations.
//
// ============================================================

function normalizeProductName(value) {

    if (!value) {
        return "";
    }

    let result = String(value).trim();

    try {
        result = decodeURIComponent(result);
    } catch (_) {}

    // URLSearchParams converts "+" to space already,
    // but this also handles raw values safely.
    result = result.replace(/\+/g, " ");

    return result
        .replace(/\s+/g, " ")
        .trim()
        .toLowerCase();

}


// ============================================================
// GET SLUG FROM PRODUCT NAME
// ============================================================

function findSlugByProductName(name) {

    const normalized = normalizeProductName(name);

    if (!normalized) {
        return "";
    }

    for (const slug of Object.keys(products)) {

        const product = products[slug];

        if (
            normalizeProductName(product.name) === normalized
        ) {
            return slug;
        }

    }

    return "";

}


// ============================================================
// GET PRODUCT SLUG
// ============================================================

function getProductSlug(req) {

    // --------------------------------------------------------
    // API QUERY
    //
    // /api/product?slug=netflix-premium
    // --------------------------------------------------------

    if (
        req.query &&
        typeof req.query.slug === "string" &&
        req.query.slug.trim()
    ) {

        try {

            return decodeURIComponent(req.query.slug)
                .trim()
                .toLowerCase();

        } catch (_) {

            return req.query.slug
                .trim()
                .toLowerCase();

        }

    }


    // --------------------------------------------------------
    // CLEAN URL
    //
    // /product/netflix-premium
    //
    // IMPORTANT:
    // Singular "product" only.
    // --------------------------------------------------------

    const rawURL = req.url || "";

    const pathname = rawURL.split("?")[0];

    const match = pathname.match(
        /^\/product\/([^/]+)\/?$/
    );

    if (!match || !match[1]) {
        return "";
    }

    try {

        return decodeURIComponent(match[1])
            .trim()
            .toLowerCase();

    } catch (_) {

        return match[1]
            .trim()
            .toLowerCase();

    }

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

    return res.end(`
<!DOCTYPE html>
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

</html>
`);

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

    const product = products[slug];

    if (!product) {
        return send404(res);
    }


    // ========================================================
    // URLS
    // ========================================================

    const productURL =
        `${SITE.domain}/product/${encodeURIComponent(slug)}`;

    const imageURL =
        absoluteURL(getSocialImage(product));

    const detailsURL =
        absoluteURL(getDetailsURL(product));


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
                "item": SITE.domain
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
         JSON-LD
         ===================================================== -->

    <script type="application/ld+json">
${safeJSON(productSchema)}
    </script>

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
        src="${escapeHTML(detailsURL)}"
        title="${escapeHTML(product.name)}"
        loading="eager"
        allow="fullscreen"
    ></iframe>


    <!-- =====================================================
         NOSCRIPT FALLBACK
         ===================================================== -->

    <noscript>

        <div class="fallback">

            <a href="${escapeHTML(detailsURL)}">

                Continue to ${escapeHTML(product.name)}

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
        // CONFIGURATION
        // ====================================================

        const SITE_HOME =
            "${escapeHTML(SITE.domain)}/";

        const PRODUCT_PREFIX =
            "/product/";

        const CURRENT_SLUG =
            "${escapeHTML(slug)}";

        const frame =
            document.getElementById("productFrame");


        if (!frame) {
            return;
        }


        // ====================================================
        // PRODUCT NAME -> SLUG DATABASE
        // ====================================================

        const PRODUCT_MAP = ${safeJSON(
            Object.keys(products).reduce((map, key) => {

                map[normalizeProductName(products[key].name)] = key;

                return map;

            }, {})
        )};


        // ====================================================
        // NORMALIZE NAME
        // ====================================================

        function normalizeName(value) {

            if (!value) {
                return "";
            }

            let result = String(value).trim();

            try {
                result = decodeURIComponent(result);
            } catch (_) {}

            result = result.replace(/\\+/g, " ");

            return result
                .replace(/\\s+/g, " ")
                .trim()
                .toLowerCase();

        }


        // ====================================================
        // FIND PRODUCT SLUG
        // ====================================================

        function slugFromName(name) {

            const normalized =
                normalizeName(name);

            return PRODUCT_MAP[normalized] || "";

        }


        // ====================================================
        // GO HOME
        // ====================================================

        function goHome() {

            window.top.location.href = SITE_HOME;

        }


        // ====================================================
        // GO TO PRODUCT
        // ====================================================

        function goToProduct(slug) {

            if (!slug) {
                return false;
            }

            const target =
                PRODUCT_PREFIX +
                encodeURIComponent(slug);

            // Always navigate the TOP browser window.
            window.top.location.href = target;

            return true;

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
                    url.origin === window.location.origin &&
                    (
                        url.pathname === "/" ||
                        url.pathname === "/index.html"
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
        // EXTRACT PRODUCT NAME FROM URL
        // ====================================================
        //
        // Supports:
        //
        // details.html?name=Netflix%20Premium
        //
        // details.html?name=Netflix+Premium
        //
        // ====================================================

        function getProductNameFromURL(href) {

            if (!href) {
                return "";
            }

            try {

                const url =
                    new URL(
                        href,
                        frame.contentWindow.location.href
                    );

                const pathname =
                    url.pathname.toLowerCase();

                if (
                    !pathname.endsWith("/details.html") &&
                    !pathname.endsWith("/details")
                ) {
                    return "";
                }

                const name =
                    url.searchParams.get("name");

                return name || "";

            } catch (_) {

                return "";

            }

        }


        // ====================================================
        // EXTRACT SLUG FROM DETAILS URL
        // ====================================================

        function getSlugFromDetailsURL(href) {

            const productName =
                getProductNameFromURL(href);

            if (!productName) {
                return "";
            }

            return slugFromName(productName);

        }


        // ====================================================
        // HANDLE PRODUCT LINK
        // ====================================================

        function handleProductLink(event, link) {

            if (!link) {
                return false;
            }

            const href =
                link.getAttribute("href");

            if (!href) {
                return false;
            }


            // -----------------------------------------------
            // HOME
            // -----------------------------------------------

            if (isHomeLink(href)) {

                event.preventDefault();
                event.stopPropagation();

                goHome();

                return true;

            }


            // -----------------------------------------------
            // HASH
            // -----------------------------------------------

            if (
                href.startsWith("#") ||
                href.startsWith("javascript:")
            ) {
                return false;
            }


            // -----------------------------------------------
            // DETAILS PRODUCT URL
            // -----------------------------------------------

            const relatedSlug =
                getSlugFromDetailsURL(href);


            if (relatedSlug) {

                event.preventDefault();
                event.stopPropagation();

                goToProduct(relatedSlug);

                return true;

            }


            // -----------------------------------------------
            // ALREADY CLEAN PRODUCT URL
            // -----------------------------------------------

            try {

                const url =
                    new URL(
                        href,
                        frame.contentWindow.location.href
                    );

                if (
                    url.origin === window.location.origin &&
                    /^\/product\/[^/]+\/?$/i.test(
                        url.pathname
                    )
                ) {

                    const targetSlug =
                        url.pathname
                            .replace(/^\/product\//i, "")
                            .replace(/\/$/, "")
                            .trim()
                            .toLowerCase();

                    if (
                        targetSlug &&
                        products[targetSlug]
                    ) {

                        event.preventDefault();
                        event.stopPropagation();

                        goToProduct(targetSlug);

                        return true;

                    }

                }

            } catch (_) {}


            // -----------------------------------------------
            // HISTORY BACK IN LINK
            // -----------------------------------------------

            const normalizedHref =
                href.toLowerCase();

            if (
                normalizedHref.includes("history.back") ||
                normalizedHref.includes("history.go(-1)")
            ) {

                event.preventDefault();
                event.stopPropagation();

                goHome();

                return true;

            }


            return false;

        }


        // ====================================================
        // HANDLE IFRAME LOAD
        // ====================================================

        frame.addEventListener(
            "load",
            function () {

                try {

                    const frameWindow =
                        frame.contentWindow;

                    const frameDocument =
                        frameWindow.document;


                    // ==========================================
                    // HISTORY BACK
                    // ==========================================

                    const originalBack =
                        frameWindow.history.back.bind(
                            frameWindow.history
                        );

                    frameWindow.history.back =
                        function () {

                            goHome();

                        };


                    // ==========================================
                    // HISTORY GO
                    // ==========================================

                    const originalGo =
                        frameWindow.history.go.bind(
                            frameWindow.history
                        );

                    frameWindow.history.go =
                        function (delta) {

                            if (
                                typeof delta === "number" &&
                                delta < 0
                            ) {

                                goHome();

                                return;

                            }

                            return originalGo(delta);

                        };


                    // ==========================================
                    // HISTORY POPSTATE
                    // ==========================================

                    frameWindow.addEventListener(
                        "popstate",
                        function () {

                            goHome();

                        }
                    );


                    // ==========================================
                    // CAPTURE ALL LINK CLICKS
                    // ==========================================
                    //
                    // This is the IMPORTANT FIX.
                    //
                    // Related subscriptions normally use:
                    //
                    // details.html?name=HBO%20Max
                    //
                    // We intercept that link and instead
                    // navigate the TOP window to:
                    //
                    // /product/hbo-max
                    //
                    // ==========================================

                    frameDocument.addEventListener(
                        "click",
                        function (event) {

                            const link =
                                event.target.closest("a");

                            if (!link) {
                                return;
                            }

                            handleProductLink(
                                event,
                                link
                            );

                        },
                        true
                    );


                    // ==========================================
                    // HANDLE BUTTONS
                    // ==========================================

                    frameDocument.addEventListener(
                        "click",
                        function (event) {

                            const element =
                                event.target.closest(
                                    "button, [role='button']"
                                );

                            if (!element) {
                                return;
                            }


                            const text =
                                (
                                    element.innerText ||
                                    element.textContent ||
                                    ""
                                )
                                .trim()
                                .toLowerCase();


                            // ----------------------------------
                            // BACK / HOME BUTTON
                            // ----------------------------------

                            if (

                                text === "back" ||

                                text.includes("back to") ||

                                text.includes("return to") ||

                                text.includes("return home") ||

                                text.includes("go home") ||

                                text === "home"

                            ) {

                                event.preventDefault();
                                event.stopPropagation();

                                goHome();

                                return;

                            }


                            // ----------------------------------
                            // PRODUCT BUTTONS
                            //
                            // If a button contains:
                            //
                            // data-product-name="HBO Max"
                            //
                            // or:
                            //
                            // data-product="hbo-max"
                            //
                            // it will also work.
                            // ----------------------------------

                            const dataSlug =
                                element.getAttribute(
                                    "data-product"
                                );

                            const dataName =
                                element.getAttribute(
                                    "data-product-name"
                                );


                            if (
                                dataSlug &&
                                products[dataSlug]
                            ) {

                                event.preventDefault();
                                event.stopPropagation();

                                goToProduct(
                                    dataSlug
                                );

                                return;

                            }


                            if (dataName) {

                                const slug =
                                    slugFromName(
                                        dataName
                                    );

                                if (slug) {

                                    event.preventDefault();
                                    event.stopPropagation();

                                    goToProduct(slug);

                                    return;

                                }

                            }

                        },
                        true
                    );


                    // ==========================================
                    // INTERCEPT WINDOW LOCATION ASSIGNMENT
                    // ==========================================
                    //
                    // We cannot directly override every browser
                    // navigation API, but we can monitor URL
                    // changes inside the iframe.
                    //
                    // If details.html changes from one product
                    // to another, update the top URL.
                    //
                    // ==========================================

                    let lastFrameURL =
                        frameWindow.location.href;


                    function checkFrameNavigation() {

                        try {

                            const currentURL =
                                frameWindow.location.href;


                            if (
                                currentURL === lastFrameURL
                            ) {
                                return;
                            }


                            lastFrameURL =
                                currentURL;


                            const nextSlug =
                                getSlugFromDetailsURL(
                                    currentURL
                                );


                            if (
                                nextSlug &&
                                nextSlug !== CURRENT_SLUG
                            ) {

                                goToProduct(
                                    nextSlug
                                );

                            }

                        } catch (_) {}

                    }


                    // Check periodically because some
                    // product systems use location changes
                    // instead of normal anchor clicks.

                    const navigationWatcher =
                        window.setInterval(
                            checkFrameNavigation,
                            250
                        );


                    // Stop watcher if this page is unloaded.

                    window.addEventListener(
                        "beforeunload",
                        function () {

                            clearInterval(
                                navigationWatcher
                            );

                        }
                    );


                    // ==========================================
                    // MUTATION OBSERVER
                    // ==========================================
                    //
                    // Related subscriptions may be injected
                    // dynamically after page load.
                    //
                    // Delegated click handling already catches
                    // them, but this observer helps ensure the
                    // page remains under our navigation control.
                    // ==========================================

                    const observer =
                        new MutationObserver(
                            function () {

                                // Intentionally empty.
                                //
                                // Click delegation works for
                                // dynamically created elements.

                            }
                        );


                    observer.observe(
                        frameDocument.documentElement,
                        {
                            childList: true,
                            subtree: true
                        }
                    );


                    window.addEventListener(
                        "beforeunload",
                        function () {

                            observer.disconnect();

                        }
                    );


                    console.log(
                        "NEXT LEVEL SUBS product navigation controller loaded:",
                        "${escapeHTML(product.name)}"
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
        // TOP-LEVEL PRODUCT HISTORY
        // ====================================================

        if (
            window.history &&
            window.history.replaceState
        ) {

            window.history.replaceState(
                {
                    productSlug: CURRENT_SLUG
                },
                document.title,
                window.location.href
            );

        }


    })();

    </script>


</body>

</html>`;

    return res.end(html);

};