// ============================================================
// NEXT LEVEL SUBS
// PRODUCT SEO / OPEN GRAPH / SOCIAL PREVIEW HANDLER
// ============================================================
//
// Clean URLs:
//
// https://www.nextlevelsubs.com/product/netflix-premium
// https://www.nextlevelsubs.com/product/hbo-max
// https://www.nextlevelsubs.com/product/spotify-premium
//
// Social crawlers receive SEO + OG metadata.
// Normal visitors see the existing details.html product page.
//
// IMPORTANT:
// The product page uses details.html inside an iframe.
// This version also controls iframe navigation so that
// Return/Home/history.back() navigates the TOP browser window.
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

const products = {

    // =========================================================
    // STREAMING
    // =========================================================

    "netflix-premium": {
        name: "Netflix Premium",
        description: "Watch unlimited movies and TV shows",
        image: "/assets/cards/netflix.webp",
        page: "/details.html?name=Netflix%20Premium",
        category: "Streaming"
    },

    "amazon-prime-video": {
        name: "Amazon Prime Video",
        description: "Thousands of movies and TV shows",
        image: "/assets/cards/prime_video.svg",
        page: "/details.html?name=Amazon%20Prime%20Video",
        category: "Streaming"
    },

    "hbo-max": {
        name: "HBO Max",
        description: "HBO, Warner Bros., DC, Max Originals",
        image: "/assets/cards/max.png",
        page: "/details.html?name=HBO%20Max",
        category: "Streaming"
    },

    "crunchy-roll-mega": {
        name: "Crunchy Roll Mega",
        description: "Anime. Streaming. Community",
        image: "/assets/cards/crunchy.png",
        page: "/details.html?name=Crunchy%20Roll%20Mega",
        category: "Streaming"
    },

    "netflix-for-tv": {
        name: "Netflix For TV",
        description: "Watch unlimited movies and TV shows",
        image: "/assets/cards/netflixfortv.webp",
        page: "/details.html?name=Netflix%20For%20TV",
        category: "Streaming"
    },

    "chorki-premium": {
        name: "Chorki Premium",
        description: "Bengali. Bold. Streaming",
        image: "/assets/cards/chorki.webp",
        page: "/details.html?name=Chorki%20Premium",
        category: "Streaming"
    },

    "hoichoi-premium": {
        name: "Hoichoi Premium",
        description: "Unlimited Bangla Entertainment",
        image: "/assets/cards/hoichoi.png",
        page: "/details.html?name=Hoichoi%20Premium",
        category: "Streaming"
    },

    "bongo": {
        name: "Bongo",
        description: "Unlimited Bangla Entertainment",
        image: "/assets/cards/bongo.png",
        page: "/details.html?name=Bongo",
        category: "Streaming"
    },

    "disney-plus": {
        name: "Disney+",
        description: "Premium movies, series and exclusive Disney content",
        image: "/assets/cards/disney.jpg",
        page: "/details.html?name=Disney%2B",
        category: "Streaming"
    },

    "hulu": {
        name: "Hulu",
        description: "Next-day TV and original content",
        image: "/assets/cards/hulu.svg",
        page: "/details.html?name=Hulu",
        category: "Streaming"
    },

    "apple-tv-plus": {
        name: "Apple TV+",
        description: "Original shows and movies",
        image: "/assets/cards/apple_tv.jpg",
        page: "/details.html?name=Apple%20TV%2B",
        category: "Streaming"
    },

    "paramount-plus": {
        name: "Paramount+",
        description: "Movies, live sports, and exclusive originals",
        image: "/assets/cards/paramount.webp",
        page: "/details.html?name=Paramount%2B",
        category: "Streaming"
    },

    "peacock": {
        name: "Peacock",
        description: "NBCUniversal content and live sports",
        image: "/assets/cards/Peacock.avif",
        page: "/details.html?name=Peacock",
        category: "Streaming"
    },

    "youtube-premium": {
        name: "YouTube Premium",
        description: "Ad-free videos and YouTube Music",
        image: "/assets/cards/youtube.webp",
        page: "/details.html?name=YouTube%20Premium",
        category: "Streaming"
    },

    "youtube-premium-non-renewable": {
        name: "Youtube Premium Non-Renewable",
        description: "Ad-free videos and music",
        image: "/assets/cards/youtube.webp",
        page: "/details.html?name=Youtube%20Premium%20Non-Renewable",
        category: "Streaming"
    },

    "discovery-plus": {
        name: "Discovery+",
        description: "Documentaries, Reality, Entertainment",
        image: "/assets/cards/discovery.webp",
        page: "/details.html?name=Discovery%2B",
        category: "Streaming"
    },

    "shudder-premium": {
        name: "Shudder Premium",
        description: "Horror, Thriller, Suspense",
        image: "/assets/cards/shudder.jpg",
        page: "/details.html?name=Shudder%20Premium",
        category: "Streaming"
    },

    "prime-video-full": {
        name: "Prime Video Full",
        description: "Movies, Series, Originals",
        image: "/assets/cards/primefull.webp",
        page: "/details.html?name=Prime%20Video%20Full",
        category: "Streaming"
    },

    "amc-plus": {
        name: "AMC+",
        description: "Horror, Thriller, Suspense",
        image: "/assets/cards/amc+.webp",
        page: "/details.html?name=AMC%2B",
        category: "Streaming"
    },

    "fubo-tv": {
        name: "Fubo TV",
        description: "Sports, Live, Entertainment",
        image: "/assets/cards/fuboTV.webp",
        page: "/details.html?name=Fubo%20TV",
        category: "Streaming"
    },

    "ullu-pro": {
        name: "Ullu Pro",
        description: "Adult, Web, Series",
        image: "/assets/cards/ullu.png",
        page: "/details.html?name=Ullu%20Pro",
        category: "Streaming"
    },

    "sling-tv": {
        name: "Sling TV",
        description: "Live, Channels, Streaming",
        image: "/assets/cards/slingtv.png",
        page: "/details.html?name=Sling%20TV",
        category: "Streaming"
    },


    // =========================================================
    // MUSIC
    // =========================================================

    "spotify-premium": {
        name: "Spotify Premium",
        description: "Ad-free music and podcasts",
        image: "/assets/cards/spotify.jpg",
        page: "/details.html?name=Spotify%20Premium",
        category: "Music"
    },

    "amazon-music-unlimited": {
        name: "Amazon Music Unlimited",
        description: "High-quality music and podcasts",
        image: "/assets/cards/amazon-music-unlimited.jpeg",
        page: "/details.html?name=Amazon%20Music%20Unlimited",
        category: "Music"
    },

    "apple-music": {
        name: "Apple Music",
        description: "Stream over 75 million songs",
        image: "/assets/cards/apple_music.jpg",
        page: "/details.html?name=Apple%20Music",
        category: "Music"
    },

    "tidal": {
        name: "Tidal",
        description: "High-fidelity music streaming",
        image: "/assets/cards/tidal.svg",
        page: "/details.html?name=Tidal",
        category: "Music"
    },

    "pandora-premium": {
        name: "Pandora Premium",
        description: "Personalized music and podcasts",
        image: "/assets/cards/pandora.svg",
        page: "/details.html?name=Pandora%20Premium",
        category: "Music"
    },

    "soundcloud-go-plus": {
        name: "SoundCloud Go+",
        description: "Ad-free music and offline listening",
        image: "/assets/cards/sound_cloud.svg",
        page: "/details.html?name=SoundCloud%20Go%2B",
        category: "Music"
    },

    "deezer-hifi": {
        name: "Deezer HiFi",
        description: "High-quality audio streaming",
        image: "/assets/cards/deezer.svg",
        page: "/details.html?name=Deezer%20HiFi",
        category: "Music"
    },


    // =========================================================
    // CLOUD STORAGE
    // =========================================================

    "microsoft-onedrive": {
        name: "Microsoft OneDrive",
        description: "1TB cloud storage with Office apps",
        image: "/assets/details/onedrive/1.webp",
        page: "/details.html?name=Microsoft%20OneDrive",
        category: "Cloud Storage"
    },

    "dropbox-plus": {
        name: "Dropbox Plus",
        description: "2TB secure cloud storage",
        image: "/assets/cards/Dropbox_(service)-Logo.wine.svg",
        page: "/details.html?name=Dropbox%20Plus",
        category: "Cloud Storage"
    },

    "google-drive": {
        name: "Google Drive",
        description: "1TB cloud storage",
        image: "/assets/cards/Google_Drive-Logo.wine.svg",
        page: "/details.html?name=Google%20Drive",
        category: "Cloud Storage"
    },

    "icloud-plus": {
        name: "iCloud+",
        description: "50GB cloud storage for Apple users",
        image: "/assets/cards/icloud+webp.webp",
        page: "/details.html?name=iCloud%2B",
        category: "Cloud Storage"
    },

    "amazon-drive": {
        name: "Amazon Drive",
        description: "100GB cloud storage",
        image: "/assets/cards/amazon_drive.png",
        page: "/details.html?name=Amazon%20Drive",
        category: "Cloud Storage"
    },


    // =========================================================
    // VPN
    // =========================================================

    "expressvpn": {
        name: "ExpressVPN",
        description: "High-speed, secure VPN service",
        image: "/assets/cards/expressVPN.png",
        page: "/details.html?name=ExpressVPN",
        category: "VPN"
    },

    "nordvpn": {
        name: "NordVPN",
        description: "Advanced security with double VPN",
        image: "/assets/cards/nordvpn.webp",
        page: "/details.html?name=NordVPN",
        category: "VPN"
    },

    "surfshark": {
        name: "Surfshark",
        description: "Unlimited devices and connections",
        image: "/assets/cards/surfsharkvpn.webp",
        page: "/details.html?name=Surfshark",
        category: "VPN"
    },

    "cyberghost": {
        name: "CyberGhost",
        description: "User-friendly VPN with 45-day guarantee",
        image: "/assets/cards/cyberghost.png",
        page: "/details.html?name=CyberGhost",
        category: "VPN"
    },

    "ipvanish": {
        name: "IPVanish",
        description: "Fast connections with no logs",
        image: "/assets/cards/ipvanish.webp",
        page: "/details.html?name=IPVanish",
        category: "VPN"
    },

    "private-internet-access": {
        name: "Private Internet Access",
        description: "Highly customizable VPN",
        image: "/assets/cards/pia.png",
        page: "/details.html?name=Private%20Internet%20Access",
        category: "VPN"
    },

    "hotspot-shield": {
        name: "Hotspot Shield",
        description: "Patented VPN technology",
        image: "/assets/cards/Hotspot-Shield-vpn.webp",
        page: "/details.html?name=Hotspot%20Shield",
        category: "VPN"
    },

    "vypr-vpn": {
        name: "Vypr VPN",
        description: "Secure and private VPN service",
        image: "/assets/cards/vyprvpn.webp",
        page: "/details.html?name=Vypr%20VPN",
        category: "VPN"
    },


    // =========================================================
    // AI & DESIGN
    // =========================================================

    "canva-pro": {
        name: "Canva Pro",
        description: "Canva Pro: Where Ideas Turn into Stunning Designs—Fast!",
        image: "/assets/cards/canva.png",
        page: "/details.html?name=Canva%20Pro",
        category: "AI & Design"
    },

    "photoroom-pro": {
        name: "Photoroom Pro",
        description: "Professional AI-powered photo editing and design tools",
        image: "/assets/cards/photoroom.jpg",
        page: "/details.html?name=Photoroom%20Pro",
        category: "AI & Design"
    },

    "picsart-premium": {
        name: "Picsart Premium",
        description: "Creative photo and video editing tools",
        image: "/assets/cards/picsart.png",
        page: "/details.html?name=Picsart%20Premium",
        category: "AI & Design"
    },

    "photoroom-max": {
        name: "Photoroom Max",
        description: "Advanced AI photo editing and creative tools",
        image: "/assets/cards/photoroom.jpg",
        page: "/details.html?name=Photoroom%20Max",
        category: "AI & Design"
    },

    "blackbox-ai-chatgpt5": {
        name: "Black Box Ai (CHAT-GPT5)",
        description: "AI-powered coding and development assistant",
        image: "/assets/cards/blackboxai.jpg",
        page: "/details.html?name=Black%20Box%20Ai%28CHAT-GPT5%29",
        category: "AI & Design"
    },

    "gemini-ai": {
        name: "Gemini Ai",
        description: "Google's advanced AI assistant",
        image: "/assets/cards/gemini.png",
        page: "/details.html?name=Gemini%20Ai",
        category: "AI & Design"
    },

    "chat-gpt": {
        name: "Chat GPT",
        description: "Advanced AI assistant for writing, research and productivity",
        image: "/assets/cards/chatgpt.jpg",
        page: "/details.html?name=Chat%20GPT",
        category: "AI & Design"
    },

    "perplexity-chatgpt5": {
        name: "Perplexity (ChatGPT-5)",
        description: "AI-powered search and research assistant",
        image: "/assets/cards/Perplexity.svg",
        page: "/details.html?name=perplexity%20%28ChatGPT-5%29",
        category: "AI & Design"
    },

    "remini-ai": {
        name: "Remini Ai",
        description: "AI-powered photo enhancement and restoration",
        image: "/assets/cards/remini.avif",
        page: "/details.html?name=Remini%20Ai",
        category: "AI & Design"
    },


    // =========================================================
    // COMBOS
    // =========================================================

    "netflix-prime-video": {
        name: "Netflix + Prime Video",
        description: "Get both streaming services at a discount",
        image: "/assets/cards/Netflix-vs-Amazon.jpg",
        page: "/details.html?name=Netflix%20%2B%20Prime%20Video",
        category: "Combo"
    },

    "netflix-hbo-max": {
        name: "Netflix + HBO Max",
        description: "Premium content from both platforms",
        image: "/assets/cards/netflix+hbomax.webp",
        page: "/details.html?name=Netflix%20%2B%20HBO%20Max",
        category: "Combo"
    },

    "prime-video-hbo-max": {
        name: "Prime Video + HBO Max",
        description: "Premium content from both platforms",
        image: "/assets/cards/prime+hbo.webp",
        page: "/details.html?name=Prime%20Video%20%2B%20HBO%20Max",
        category: "Combo"
    },

    "hbo-max-surfshark-vpn": {
        name: "HBO Max + Surfshark VPN",
        description: "Stream securely with VPN protection",
        image: "/assets/cards/hbo+surfshark.webp",
        page: "/details.html?name=HBO%20Max%20%2B%20Surfshark%20VPN",
        category: "Combo"
    },

    "spotify-youtube-premium": {
        name: "Spotify + YouTube Premium",
        description: "Ad-free music and videos",
        image: "/assets/cards/spotify+youtube.webp",
        page: "/details.html?name=Spotify%20%2B%20YouTube%20Premium",
        category: "Combo"
    },

    "disney-hbo-max": {
        name: "Disney + HBO Max",
        description: "Disney+ and HBO Max premium entertainment",
        image: "/assets/cards/disney+nordVPN.webp",
        page: "/details.html?name=Disney%20%2B%20HBO%20Max",
        category: "Combo"
    },

    "disney-nord-vpn": {
        name: "Disney + Nord VPN",
        description: "Disney+ entertainment with NordVPN protection",
        image: "/assets/cards/disney+nordVPN.webp",
        page: "/details.html?name=Disney%20%2B%20Nord%20VPN",
        category: "Combo"
    },

    "music-storage": {
        name: "Music & Storage",
        description: "Amazon Music HD and 1TB OneDrive storage",
        image: "/assets/cards/amazon+onedrive.png",
        page: "/details.html?name=Music%20%26%20Storage",
        category: "Combo"
    },

    "security-bundle": {
        name: "Security Bundle",
        description: "ExpressVPN and 1TB OneDrive cloud storage",
        image: "/assets/cards/expressvpn+onedrive.webp",
        page: "/details.html?name=Security%20Bundle",
        category: "Combo"
    },

    "ultimate-entertainment": {
        name: "Ultimate Entertainment",
        description: "Netflix, HBO Max, and ExpressVPN",
        image: "/assets/cards/netflix_expressvpn_hbomax.webp",
        page: "/details.html?name=Ultimate%20Entertainment",
        category: "Combo"
    },


    // =========================================================
    // EDUCATION
    // =========================================================

    "doulingo": {
        name: "Doulingo",
        description: "Learn languages with interactive lessons",
        image: "/assets/cards/doulingo.png",
        page: "/details.html?name=Doulingo",
        category: "Education"
    },

    "skillshare": {
        name: "Skillshare",
        description: "Access thousands of online creative courses",
        image: "/assets/cards/skill_share.png",
        page: "/details.html?name=Skillshare",
        category: "Education"
    },

    "linkedin-premium": {
        name: "LinkedIn Premium",
        description: "Professional development and career tools",
        image: "/assets/cards/LinkedIn.png",
        page: "/details.html?name=LinkedIn%20Premium",
        category: "Education"
    },

    "numerade": {
        name: "Numerade",
        description: "Learn with step-by-step educational video solutions",
        image: "/assets/cards/Numerade.jpg",
        page: "/details.html?name=Numerade",
        category: "Education"
    },

    "grammarly-pro": {
        name: "Grammarly Pro",
        description: "Advanced writing, grammar and productivity tools",
        image: "/assets/cards/grammarly.png",
        page: "/details.html?name=Grammarly%20Pro",
        category: "Education"
    },


    // =========================================================
    // ADULT
    // =========================================================

    "digital-playground": {
        name: "Digital Playground",
        description: "Exclusive premium content from creators",
        image: "/assets/cards/DigitalPlayground-logo.png",
        page: "/details.html?name=Digital%20Playground",
        category: "Adult"
    },

    "pornhub-premium": {
        name: "Pornhub Premium",
        description: "Ad-free premium adult entertainment",
        image: "/assets/cards/pornhub.webp",
        page: "/details.html?name=Pornhub%20Premium",
        category: "Adult"
    },

    "brazzers": {
        name: "Brazzers",
        description: "Premium adult content",
        image: "/assets/cards/brazzers.webp",
        page: "/details.html?name=Brazzers",
        category: "Adult"
    },

    "spice-vids": {
        name: "Spice Vids",
        description: "Premium adult streaming platform",
        image: "/assets/cards/spicevids.webp",
        page: "/details.html?name=Spice%20Vids",
        category: "Adult"
    },

    "reality-kings": {
        name: "Reality Kings",
        description: "Premium reality adult content",
        image: "/assets/cards/realitykings.webp",
        page: "/details.html?name=Reality%20Kings",
        category: "Adult"
    },

    "bang-bros": {
        name: "Bang Bros",
        description: "High-quality, exclusive adult entertainment",
        image: "/assets/cards/bangbros.webp",
        page: "/details.html?name=Bang%20Bros",
        category: "Adult"
    },

    "babes-com": {
        name: "Babes.com",
        description: "High-quality, exclusive adult video content",
        image: "/assets/cards/babes.webp",
        page: "/details.html?name=Babes.com",
        category: "Adult"
    },


    // =========================================================
    // OTHER
    // =========================================================

    "truecaller-gold": {
        name: "True Caller Gold",
        description: "Premium caller identification and protection",
        image: "/assets/cards/truecaller.avif",
        page: "/details.html?name=True%20Caller%20Gold",
        category: "Productivity"
    }
};


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

    /*
     * SVG images are not reliable for all social crawlers.
     * Use logo.png as fallback.
     */

    if (/\.svg(\?|#|$)/i.test(image)) {
        return "/assets/logo.png";
    }

    return image;
}


// ============================================================
// GET PRODUCT SLUG
// ============================================================

function getProductSlug(req) {

    // --------------------------------------------------------
    // Direct API:
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

        } catch {

            return req.query.slug
                .trim()
                .toLowerCase();

        }
    }


    // --------------------------------------------------------
    // Clean URL:
    //
    // /product/netflix-premium
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

    } catch {

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

    const destinationURL =
        absoluteURL(product.page);


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

            <a
                href="${escapeHTML(destinationURL)}"
            >
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


        const SITE_HOME = "${escapeHTML(SITE.domain)}/";

        const frame =
            document.getElementById("productFrame");


        if (!frame) {
            return;
        }


        // ====================================================
        // NAVIGATE TOP WINDOW
        // ====================================================

        function goHome() {

            window.top.location.href = SITE_HOME;

        }


        // ====================================================
        // CHECK IF LINK IS HOME
        // ====================================================

        function isHomeLink(href) {

            if (!href) {
                return false;
            }


            try {

                const url =
                    new URL(
                        href,
                        window.location.origin
                    );


                return (
                    url.origin === window.location.origin &&
                    (
                        url.pathname === "/" ||
                        url.pathname === "/index.html"
                    )
                );

            } catch {

                return (
                    href === "/" ||
                    href === "/index.html"
                );

            }
        }


        // ====================================================
        // HANDLE IFRAME LOAD
        // ====================================================

        frame.addEventListener("load", function () {

            try {

                const frameWindow =
                    frame.contentWindow;

                const frameDocument =
                    frameWindow.document;


                // =================================================
                // FORCE HISTORY BACK TO MAIN WEBSITE HOME
                // =================================================

                const originalBack =
                    frameWindow.history.back.bind(
                        frameWindow.history
                    );


                frameWindow.history.back = function () {

                    /*
                     * Your product page is being displayed
                     * inside this iframe.
                     *
                     * Therefore history.back() inside
                     * details.html should return to the
                     * actual website homepage.
                     */

                    goHome();

                };


                // =================================================
                // HANDLE history.go(-1)
                // =================================================

                const originalGo =
                    frameWindow.history.go.bind(
                        frameWindow.history
                    );


                frameWindow.history.go = function (delta) {

                    if (
                        typeof delta === "number" &&
                        delta < 0
                    ) {

                        goHome();

                        return;
                    }


                    return originalGo(delta);

                };


                // =================================================
                // HANDLE ALL LINKS
                // =================================================

                frameDocument.addEventListener(
                    "click",
                    function (event) {

                        const link =
                            event.target.closest("a");


                        if (!link) {
                            return;
                        }


                        const href =
                            link.getAttribute("href");


                        if (!href) {
                            return;
                        }


                        // -----------------------------------------
                        // HOME LINK
                        // -----------------------------------------

                        if (isHomeLink(href)) {

                            event.preventDefault();
                            event.stopPropagation();

                            goHome();

                            return;
                        }


                        // -----------------------------------------
                        // HASH / JAVASCRIPT LINKS
                        // -----------------------------------------

                        if (
                            href.startsWith("#") ||
                            href.startsWith("javascript:")
                        ) {

                            return;
                        }


                        // -----------------------------------------
                        // DETAILS PAGE BACK LINKS
                        // -----------------------------------------

                        const normalized =
                            href.toLowerCase();


                        if (
                            normalized.includes("history.back") ||
                            normalized.includes("history.go(-1)")
                        ) {

                            event.preventDefault();
                            event.stopPropagation();

                            goHome();

                            return;
                        }

                    },
                    true
                );


                // =================================================
                // HANDLE BUTTONS THAT CALL history.back()
                // =================================================

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


                        /*
                         * Catch common product-page
                         * Back / Return buttons.
                         */

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

                        }

                    },
                    true
                );


                // =================================================
                // HANDLE POPSTATE
                // =================================================

                frameWindow.addEventListener(
                    "popstate",
                    function () {

                        goHome();

                    }
                );


                // =================================================
                // HANDLE BEFOREUNLOAD NAVIGATION
                // =================================================

                /*
                 * We deliberately do NOT override normal
                 * iframe navigation here because details.html
                 * may need its own internal functionality.
                 */

                console.log(
                    "NEXT LEVEL SUBS product navigation controller loaded:",
                    "${escapeHTML(product.name)}"
                );


            } catch (error) {

                /*
                 * Same-origin is expected because both pages
                 * are hosted on nextlevelsubs.com.
                 */

                console.warn(
                    "Product iframe navigation controller:",
                    error
                );

            }

        });


        // ====================================================
        // TOP-LEVEL PRODUCT PAGE HISTORY
        // ====================================================

        /*
         * This creates a clean history entry for the product.
         *
         * Example:
         *
         * Home
         *   ↓
         * /product/netflix-premium
         *
         * Browser Back therefore returns to Home.
         */

        if (
            window.history &&
            window.history.replaceState
        ) {

            window.history.replaceState(
                {
                    productSlug: "${escapeHTML(slug)}"
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