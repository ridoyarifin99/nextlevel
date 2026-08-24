// ============================================================
// NEXT LEVEL SUBS
// PRODUCTION HYBRID PRODUCT SEO HANDLER
// ============================================================
//
// FILE:
//   /api/product.js
//
// PRIMARY PRODUCT URL:
//   https://www.nextlevelsubs.com/product/hbo-max
//
// API URL:
//   https://www.nextlevelsubs.com/api/product?slug=hbo-max
//
// PURPOSE:
//   - Server-rendered product SEO pages
//   - Unique title / description / H1 per product
//   - Product JSON-LD
//   - Breadcrumb JSON-LD
//   - Organization JSON-LD
//   - WebSite JSON-LD
//   - Bangladesh-focused search intent
//   - Open Graph / Twitter
//   - Canonical URLs
//   - Internal product linking
//   - Existing details.html customer UI preservation
//   - No iframe
//   - No fake prices / ratings / reviews
//   - Alias handling
//   - Proper 404 handling
//
// IMPORTANT:
//   Your existing details.html does NOT need to be rewritten
//   for this handler.
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
    country: "BD",
    currency: "BDT",

    description:
        "Premium subscriptions, streaming services, VPNs, AI tools, cloud storage, education and digital services in Bangladesh.",

    logo:
        "https://www.nextlevelsubs.com/assets/logo.png"
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
        brand: "Netflix",
        description:
            "Watch unlimited movies and TV shows.",
        image: "/assets/cards/netflix.webp",
        category: "Streaming"
    },

    "amazon-prime-video": {
        name: "Amazon Prime Video",
        brand: "Amazon Prime Video",
        description:
            "Thousands of movies and TV shows.",
        image: "/assets/cards/prime_video.svg",
        category: "Streaming"
    },

    "hbo-max": {
        name: "HBO Max",
        brand: "HBO Max",
        description:
            "HBO, Warner Bros., DC and Max Originals.",
        image: "/assets/cards/hbomax.jpg",
        category: "Streaming"
    },

    "crunchy-roll-mega": {
        name: "Crunchy Roll Mega",
        brand: "Crunchyroll",
        description:
            "Anime streaming and community access.",
        image: "/assets/cards/crunchy.png",
        category: "Streaming"
    },

    "netflix-for-tv": {
        name: "Netflix For TV",
        brand: "Netflix",
        description:
            "Watch movies and TV shows on supported TV devices.",
        image: "/assets/cards/netflixfortv.webp",
        category: "Streaming"
    },

    "chorki-premium": {
        name: "Chorki Premium",
        brand: "Chorki",
        description:
            "Bangla entertainment and streaming content.",
        image: "/assets/cards/chorki.webp",
        category: "Streaming"
    },

    "hoichoi-premium": {
        name: "Hoichoi Premium",
        brand: "Hoichoi",
        description:
            "Bangla movies, series and entertainment.",
        image: "/assets/cards/hoichoi.png",
        category: "Streaming"
    },

    "bongo": {
        name: "Bongo",
        brand: "Bongo",
        description:
            "Bangla movies, shows and entertainment.",
        image: "/assets/cards/bongo.png",
        category: "Streaming"
    },

    "disney-plus": {
        name: "Disney+",
        brand: "Disney+",
        description:
            "Premium movies, series and Disney entertainment.",
        image: "/assets/cards/disney.jpg",
        category: "Streaming"
    },

    "hulu": {
        name: "Hulu",
        brand: "Hulu",
        description:
            "TV shows, original content and entertainment.",
        image: "/assets/cards/hulu.svg",
        category: "Streaming"
    },

    "apple-tv-plus": {
        name: "Apple TV+",
        brand: "Apple TV+",
        description:
            "Apple Original shows and movies.",
        image: "/assets/cards/apple_tv.jpg",
        category: "Streaming"
    },

    "paramount-plus": {
        name: "Paramount+",
        brand: "Paramount+",
        description:
            "Movies, live sports and exclusive originals.",
        image: "/assets/cards/paramount.webp",
        category: "Streaming"
    },

    "peacock": {
        name: "Peacock",
        brand: "Peacock",
        description:
            "NBCUniversal entertainment and live sports.",
        image: "/assets/cards/Peacock.avif",
        category: "Streaming"
    },

    "youtube-premium": {
        name: "YouTube Premium",
        brand: "YouTube",
        description:
            "Ad-free videos and YouTube Music.",
        image: "/assets/cards/youtube.webp",
        category: "Streaming"
    },

    "youtube-premium-non-renewable": {
        name: "YouTube Premium Non-Renewable",
        brand: "YouTube",
        description:
            "Ad-free YouTube videos and music without automatic renewal.",
        image: "/assets/cards/youtube.webp",
        category: "Streaming"
    },

    "discovery-plus": {
        name: "Discovery+",
        brand: "Discovery+",
        description:
            "Documentaries, reality shows and entertainment.",
        image: "/assets/cards/discovery.webp",
        category: "Streaming"
    },

    "shudder-premium": {
        name: "Shudder Premium",
        brand: "Shudder",
        description:
            "Horror, thriller and suspense entertainment.",
        image: "/assets/cards/shudder.jpg",
        category: "Streaming"
    },

    "prime-video-full": {
        name: "Prime Video Full",
        brand: "Amazon Prime Video",
        description:
            "Movies, series and originals.",
        image: "/assets/cards/primefull.webp",
        category: "Streaming"
    },

    "amc-plus": {
        name: "AMC+",
        brand: "AMC+",
        description:
            "Premium movies, series and entertainment.",
        image: "/assets/cards/amc+.webp",
        category: "Streaming"
    },

    "fubo-tv": {
        name: "Fubo TV",
        brand: "Fubo",
        description:
            "Sports, live TV and entertainment.",
        image: "/assets/cards/fuboTV.webp",
        category: "Streaming"
    },

    "ullu-pro": {
        name: "Ullu Pro",
        brand: "Ullu",
        description:
            "Premium web series and entertainment.",
        image: "/assets/cards/ullu.png",
        category: "Streaming"
    },

    "sling-tv": {
        name: "Sling TV",
        brand: "Sling TV",
        description:
            "Live channels and streaming entertainment.",
        image: "/assets/cards/slingtv.png",
        category: "Streaming"
    },

    // ========================================================
    // MUSIC
    // ========================================================

    "spotify-premium": {
        name: "Spotify Premium",
        brand: "Spotify",
        description:
            "Ad-free music and podcasts.",
        image: "/assets/cards/spotify.jpg",
        category: "Music"
    },

    "amazon-music-unlimited": {
        name: "Amazon Music Unlimited",
        brand: "Amazon Music",
        description:
            "High-quality music and podcasts.",
        image: "/assets/cards/amazon-music-unlimited.jpeg",
        category: "Music"
    },

    "apple-music": {
        name: "Apple Music",
        brand: "Apple Music",
        description:
            "Stream millions of songs and music content.",
        image: "/assets/cards/apple_music.jpg",
        category: "Music"
    },

    "tidal": {
        name: "Tidal",
        brand: "Tidal",
        description:
            "High-fidelity music streaming.",
        image: "/assets/cards/tidal.svg",
        category: "Music"
    },

    "pandora-premium": {
        name: "Pandora Premium",
        brand: "Pandora",
        description:
            "Personalized music and podcasts.",
        image: "/assets/cards/pandora.svg",
        category: "Music"
    },

    "soundcloud-go-plus": {
        name: "SoundCloud Go+",
        brand: "SoundCloud",
        description:
            "Ad-free music and offline listening.",
        image: "/assets/cards/sound_cloud.svg",
        category: "Music"
    },

    "deezer-hifi": {
        name: "Deezer HiFi",
        brand: "Deezer",
        description:
            "High-quality audio streaming.",
        image: "/assets/cards/deezer.svg",
        category: "Music"
    },

    // ========================================================
    // CLOUD STORAGE
    // ========================================================

    "microsoft-onedrive": {
        name: "Microsoft OneDrive",
        brand: "Microsoft OneDrive",
        description:
            "Cloud storage with Microsoft productivity tools.",
        image: "/assets/cards/onedrive.svg",
        category: "Cloud Storage"
    },

    "dropbox-plus": {
        name: "Dropbox Plus",
        brand: "Dropbox",
        description:
            "Secure cloud storage and file management.",
        image: "/assets/cards/Dropbox_(service)-Logo.wine.svg",
        category: "Cloud Storage"
    },

    "google-drive": {
        name: "Google Drive",
        brand: "Google Drive",
        description:
            "Cloud storage for files and documents.",
        image: "/assets/cards/Google_Drive-Logo.wine.svg",
        category: "Cloud Storage"
    },

    "icloud-plus": {
        name: "iCloud+",
        brand: "Apple iCloud",
        description:
            "Cloud storage and privacy features for Apple users.",
        image: "/assets/cards/icloud+webp.webp",
        category: "Cloud Storage"
    },

    "amazon-drive": {
        name: "Amazon Drive",
        brand: "Amazon",
        description:
            "Cloud storage for files and photos.",
        image: "/assets/cards/amazon_drive.png",
        category: "Cloud Storage"
    },

    // ========================================================
    // VPN
    // ========================================================

    "expressvpn": {
        name: "ExpressVPN",
        brand: "ExpressVPN",
        description:
            "High-speed VPN and internet privacy service.",
        image: "/assets/cards/expressVPN.png",
        category: "VPN"
    },

    "nordvpn": {
        name: "NordVPN",
        brand: "NordVPN",
        description:
            "VPN service with advanced online security features.",
        image: "/assets/cards/nordvpn.webp",
        category: "VPN"
    },

    "surfshark": {
        name: "Surfshark",
        brand: "Surfshark",
        description:
            "VPN service with support for multiple devices.",
        image: "/assets/cards/surfsharkvpn.webp",
        category: "VPN"
    },

    "cyberghost": {
        name: "CyberGhost",
        brand: "CyberGhost",
        description:
            "User-friendly VPN service.",
        image: "/assets/cards/cyberghost.png",
        category: "VPN"
    },

    "ipvanish": {
        name: "IPVanish",
        brand: "IPVanish",
        description:
            "VPN service designed for fast connections and privacy.",
        image: "/assets/cards/ipvanish.webp",
        category: "VPN"
    },

    "private-internet-access": {
        name: "Private Internet Access",
        brand: "Private Internet Access",
        description:
            "Customizable VPN and privacy service.",
        image: "/assets/cards/pia.png",
        category: "VPN"
    },

    "hotspot-shield": {
        name: "Hotspot Shield",
        brand: "Hotspot Shield",
        description:
            "VPN service for online privacy and security.",
        image: "/assets/cards/Hotspot-Shield-vpn.webp",
        category: "VPN"
    },

    "vypr-vpn": {
        name: "Vypr VPN",
        brand: "VyprVPN",
        description:
            "Secure VPN service for private browsing.",
        image: "/assets/cards/vyprvpn.webp",
        category: "VPN"
    },

    // ========================================================
    // AI & DESIGN
    // ========================================================

    "canva-pro": {
        name: "Canva Pro",
        brand: "Canva",
        description:
            "Professional design tools and premium content.",
        image: "/assets/cards/canva.png",
        category: "AI & Design"
    },

    "photoroom-pro": {
        name: "Photoroom Pro",
        brand: "Photoroom",
        description:
            "AI-powered photo editing and design tools.",
        image: "/assets/cards/photoroom.jpg",
        category: "AI & Design"
    },

    "picsart-premium": {
        name: "Picsart Premium",
        brand: "Picsart",
        description:
            "Creative photo and video editing tools.",
        image: "/assets/cards/picsart.png",
        category: "AI & Design"
    },

    "photoroom-max": {
        name: "Photoroom Max",
        brand: "Photoroom",
        description:
            "Advanced AI photo editing and creative tools.",
        image: "/assets/cards/photoroom.jpg",
        category: "AI & Design"
    },

    "blackbox-ai-chatgpt5": {
        name: "Black Box AI (ChatGPT-5)",
        brand: "Blackbox AI",
        description:
            "AI-powered coding and development assistant.",
        image: "/assets/cards/blackboxai.jpg",
        category: "AI & Design"
    },

    "gemini-ai": {
        name: "Gemini AI",
        brand: "Google Gemini",
        description:
            "Google's AI assistant for productivity and research.",
        image: "/assets/cards/gemini.png",
        category: "AI & Design"
    },

    "chat-gpt": {
        name: "ChatGPT",
        brand: "OpenAI",
        description:
            "AI assistant for writing, research and productivity.",
        image: "/assets/cards/chatgpt.jpg",
        category: "AI & Design"
    },

    "perplexity-chatgpt5": {
        name: "Perplexity (ChatGPT-5)",
        brand: "Perplexity",
        description:
            "AI-powered search and research assistant.",
        image: "/assets/cards/Perplexity.svg",
        category: "AI & Design"
    },

    "remini-ai": {
        name: "Remini AI",
        brand: "Remini",
        description:
            "AI-powered photo enhancement and restoration.",
        image: "/assets/cards/remini.avif",
        category: "AI & Design"
    },

    // ========================================================
    // COMBOS
    // ========================================================

    "netflix-prime-video": {
        name: "Netflix + Prime Video",
        description:
            "Netflix and Prime Video streaming bundle.",
        image: "/assets/cards/Netflix-vs-Amazon.jpg",
        category: "Combo"
    },

    "netflix-hbo-max": {
        name: "Netflix + HBO Max",
        description:
            "Netflix and HBO Max entertainment bundle.",
        image: "/assets/cards/netflix+hbomax.webp",
        category: "Combo"
    },

    "prime-video-hbo-max": {
        name: "Prime Video + HBO Max",
        description:
            "Prime Video and HBO Max entertainment bundle.",
        image: "/assets/cards/prime+hbo.webp",
        category: "Combo"
    },

    "hbo-max-surfshark-vpn": {
        name: "HBO Max + Surfshark VPN",
        description:
            "HBO Max entertainment with Surfshark VPN.",
        image: "/assets/cards/hbo+surfshark.webp",
        category: "Combo"
    },

    "spotify-youtube-premium": {
        name: "Spotify + YouTube Premium",
        description:
            "Ad-free music and video subscription bundle.",
        image: "/assets/cards/spotify+youtube.webp",
        category: "Combo"
    },

    "disney-hbo-max": {
        name: "Disney + HBO Max",
        description:
            "Disney+ and HBO Max entertainment bundle.",
        image: "/assets/cards/disney+nordVPN.webp",
        category: "Combo"
    },

    "disney-nord-vpn": {
        name: "Disney + Nord VPN",
        description:
            "Disney+ entertainment with NordVPN.",
        image: "/assets/cards/disney+nordVPN.webp",
        category: "Combo"
    },

    "music-storage": {
        name: "Music & Storage",
        description:
            "Amazon Music and OneDrive storage bundle.",
        image: "/assets/cards/amazon+onedrive.png",
        category: "Combo"
    },

    "security-bundle": {
        name: "Security Bundle",
        description:
            "ExpressVPN and OneDrive cloud storage bundle.",
        image: "/assets/cards/expressvpn+onedrive.webp",
        category: "Combo"
    },

    "ultimate-entertainment": {
        name: "Ultimate Entertainment",
        description:
            "Netflix, HBO Max and ExpressVPN bundle.",
        image: "/assets/cards/netflix_expressvpn_hbomax.webp",
        category: "Combo"
    },

    // ========================================================
    // EDUCATION
    // ========================================================

    "doulingo": {
        name: "Duolingo",
        brand: "Duolingo",
        description:
            "Learn languages with interactive lessons.",
        image: "/assets/cards/doulingo.png",
        category: "Education"
    },

    "skillshare": {
        name: "Skillshare",
        brand: "Skillshare",
        description:
            "Online creative courses and learning.",
        image: "/assets/cards/skill_share.png",
        category: "Education"
    },

    "linkedin-premium": {
        name: "LinkedIn Premium",
        brand: "LinkedIn",
        description:
            "Professional development and career tools.",
        image: "/assets/cards/LinkedIn.png",
        category: "Education"
    },

    "numerade": {
        name: "Numerade",
        brand: "Numerade",
        description:
            "Step-by-step educational video solutions.",
        image: "/assets/cards/Numerade.jpg",
        category: "Education"
    },

    "grammarly-pro": {
        name: "Grammarly Pro",
        brand: "Grammarly",
        description:
            "Advanced writing and productivity tools.",
        image: "/assets/cards/grammarly.png",
        category: "Education"
    },

    // ========================================================
    // ADULT
    // ========================================================

    "digital-playground": {
        name: "Digital Playground",
        description:
            "Premium creator content.",
        image: "/assets/cards/DigitalPlayground-logo.png",
        category: "Adult"
    },

    "pornhub-premium": {
        name: "Pornhub Premium",
        description:
            "Premium adult entertainment subscription.",
        image: "/assets/cards/pornhub.webp",
        category: "Adult"
    },

    "brazzers": {
        name: "Brazzers",
        description:
            "Premium adult entertainment subscription.",
        image: "/assets/cards/brazzers.webp",
        category: "Adult"
    },

    "spice-vids": {
        name: "Spice Vids",
        description:
            "Premium adult streaming subscription.",
        image: "/assets/cards/spicevids.webp",
        category: "Adult"
    },

    "reality-kings": {
        name: "Reality Kings",
        description:
            "Premium adult entertainment subscription.",
        image: "/assets/cards/realitykings.webp",
        category: "Adult"
    },

    "bang-bros": {
        name: "Bang Bros",
        description:
            "Premium adult entertainment subscription.",
        image: "/assets/cards/bangbros.webp",
        category: "Adult"
    },

    "babes-com": {
        name: "Babes.com",
        description:
            "Premium adult video subscription.",
        image: "/assets/cards/babes.webp",
        category: "Adult"
    },

    // ========================================================
    // PRODUCTIVITY
    // ========================================================

    "truecaller-gold": {
        name: "Truecaller Gold",
        brand: "Truecaller",
        description:
            "Premium caller identification and protection.",
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
// PRODUCT-SPECIFIC SEO
// ============================================================

const seoOverrides = {

    "hbo-max": {
        title:
            "HBO Max Subscription in Bangladesh | Buy HBO Max BD",
        description:
            "Buy HBO Max subscription in Bangladesh from NEXT LEVEL SUBS. Explore available HBO Max plans and subscription options in BD.",
        intro:
            "Looking for an HBO Max subscription in Bangladesh? Explore the available HBO Max subscription options from NEXT LEVEL SUBS, including current plans and ordering information.",
        features: [
            "HBO and Max entertainment",
            "Warner Bros. content",
            "DC entertainment",
            "Max Originals",
            "Flexible subscription options"
        ],
        faq: [
            {
                q:
                    "Where can I buy an HBO Max subscription in Bangladesh?",
                a:
                    "You can view the available HBO Max subscription options and ordering information on this NEXT LEVEL SUBS product page."
            },
            {
                q:
                    "How much is HBO Max in Bangladesh?",
                a:
                    "The current price depends on the subscription option selected. Check the available plans on the product/order page for the latest price."
            },
            {
                q:
                    "Can I buy HBO Max from Bangladesh?",
                a:
                    "Yes. NEXT LEVEL SUBS provides HBO Max subscription options for customers in Bangladesh."
            }
        ]
    },

    "netflix-premium": {
        title:
            "Netflix Premium Subscription in Bangladesh | Buy Netflix BD",
        description:
            "Buy Netflix Premium subscription in Bangladesh from NEXT LEVEL SUBS. Explore Netflix subscription plans, options and current pricing in BD.",
        intro:
            "Looking for a Netflix Premium subscription in Bangladesh? Explore the available Netflix subscription options from NEXT LEVEL SUBS and choose the plan that suits you.",
        features: [
            "Netflix Premium access",
            "Movies and TV shows",
            "Flexible subscription options",
            "Digital delivery",
            "Bangladesh customer support"
        ]
    },

    "spotify-premium": {
        title:
            "Spotify Premium Subscription in Bangladesh | Buy Spotify BD",
        description:
            "Buy Spotify Premium subscription in Bangladesh from NEXT LEVEL SUBS. Explore Spotify Premium options and current subscription plans in BD.",
        intro:
            "Looking for Spotify Premium in Bangladesh? Explore the available Spotify Premium subscription options from NEXT LEVEL SUBS.",
        features: [
            "Ad-free music",
            "Podcasts",
            "Premium listening features",
            "Flexible subscription options",
            "Bangladesh customer support"
        ]
    },

    "amazon-prime-video": {
        title:
            "Amazon Prime Video Subscription in Bangladesh | Buy Prime Video BD",
        description:
            "Buy Amazon Prime Video subscription in Bangladesh from NEXT LEVEL SUBS. Explore available Prime Video subscription options and plans in BD.",
        intro:
            "Looking for an Amazon Prime Video subscription in Bangladesh? Explore the available Prime Video subscription options from NEXT LEVEL SUBS.",
        features: [
            "Prime Video movies",
            "TV shows and series",
            "Amazon Originals",
            "Flexible subscription options",
            "Bangladesh customer support"
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
        .normalize("NFKD")
        .replace(/[\u0300-\u036f]/g, "")
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

    Object.keys(products).forEach(function (slug) {
        index[slug] = slug;

        const generated =
            generateSlug(products[slug].name);

        if (generated) {
            index[generated] = slug;
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
// RESOLVE PRODUCT
// ============================================================

function resolveProductKey(value) {
    if (typeof value !== "string") {
        return "";
    }

    let decoded = value.trim();

    try {
        decoded = decodeURIComponent(decoded);
    } catch (error) {
        // Ignore invalid URI encoding.
    }

    decoded = decoded
        .trim()
        .replace(/^\/+|\/+$/g, "")
        .toLowerCase();

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
// GET REQUEST PATH
// ============================================================

function getPathname(req) {
    const raw =
        typeof req.url === "string"
            ? req.url
            : "";

    const questionIndex =
        raw.indexOf("?");

    if (questionIndex === -1) {
        return raw || "/";
    }

    return raw.slice(0, questionIndex) || "/";
}

// ============================================================
// GET PRODUCT REQUEST INFORMATION
// ============================================================

function getProductRequest(req) {
    const pathname = getPathname(req);

    // --------------------------------------------------------
    // /product/{slug}
    // --------------------------------------------------------

    const productMatch =
        pathname.match(
            /^\/product\/([^/]+)\/?$/i
        );

    if (productMatch && productMatch[1]) {
        const requested =
            productMatch[1];

        const resolved =
            resolveProductKey(requested);

        return {
            source: "pretty",
            requested,
            slug: resolved,
            pathname
        };
    }

    // --------------------------------------------------------
    // /api/product?slug={slug}
    // --------------------------------------------------------

    if (
        req.query &&
        typeof req.query.slug === "string" &&
        req.query.slug.trim()
    ) {
        const requested =
            req.query.slug.trim();

        return {
            source: "api",
            requested,
            slug: resolveProductKey(requested),
            pathname
        };
    }

    // --------------------------------------------------------
    // Raw query fallback
    // --------------------------------------------------------

    try {
        const parsed =
            new URL(
                req.url || "",
                SITE.domain
            );

        const querySlug =
            parsed.searchParams.get("slug");

        if (querySlug) {
            return {
                source: "api",
                requested: querySlug,
                slug: resolveProductKey(querySlug),
                pathname
            };
        }
    } catch (error) {
        // Ignore malformed URL.
    }

    return {
        source: "unknown",
        requested: "",
        slug: "",
        pathname
    };
}

// ============================================================
// ABSOLUTE IMAGE URL
// ============================================================

function getImageURL(product) {
    let image =
        product.image ||
        "/assets/logo.png";

    // Prefer raster image for social previews.
    if (
        /\.svg(?:\?|#|$)/i.test(image)
    ) {
        image = "/assets/logo.png";
    }

    if (!/^https?:\/\//i.test(image)) {
        image =
            SITE.domain +
            (
                image.startsWith("/")
                    ? ""
                    : "/"
            ) +
            image;
    }

    return image;
}

// ============================================================
// PRODUCT SEO BUILDER
// ============================================================

function buildSEOProduct(slug, product) {
    const override =
        seoOverrides[slug] || {};

    const name =
        product.name;

    const category =
        product.category ||
        "Digital Services";

    const title =
        override.title ||
        product.seoTitle ||
        `${name} Subscription in Bangladesh | Buy ${name} BD`;

    const description =
        override.description ||
        product.seoDescription ||
        `Buy ${name} subscription in Bangladesh from NEXT LEVEL SUBS. Explore available ${name} subscription options, plans and ordering information in BD.`;

    const intro =
        override.intro ||
        product.seoIntro ||
        `Looking for a ${name} subscription in Bangladesh? Explore the available ${name} subscription options from NEXT LEVEL SUBS and choose the option that suits you.`;

    const features =
        override.features ||
        product.features ||
        [
            `${name} subscription options`,
            "Flexible subscription options",
            "Digital delivery",
            "Bangladesh customer support"
        ];

    const faq =
        override.faq ||
        product.faq ||
        [
            {
                q:
                    `Where can I buy ${name} in Bangladesh?`,
                a:
                    `You can view the available ${name} subscription options on this NEXT LEVEL SUBS product page.`
            },
            {
                q:
                    `How much is ${name} in Bangladesh?`,
                a:
                    `The current price depends on the available subscription option. Check the product/order page for the latest price.`
            }
        ];

    return {
        slug,
        name,
        brand:
            product.brand ||
            name,
        category,
        title,
        description,
        intro,
        features,
        faq
    };
}

// ============================================================
// RELATED PRODUCTS
// ============================================================

function getRelatedProducts(currentSlug, product) {
    const category =
        product.category;

    const sameCategory =
        Object.keys(products)
            .filter(function (slug) {
                return (
                    slug !== currentSlug &&
                    products[slug].category === category
                );
            });

    const selected =
        sameCategory.slice(0, 8);

    if (selected.length >= 6) {
        return selected;
    }

    const remaining =
        Object.keys(products)
            .filter(function (slug) {
                return (
                    slug !== currentSlug &&
                    selected.indexOf(slug) === -1
                );
            })
            .slice(
                0,
                8 - selected.length
            );

    return selected.concat(remaining);
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

        "@id":
            `${productURL}#product`,

        name:
            seo.name,

        description:
            seo.description,

        image: [
            imageURL
        ],

        url:
            productURL,

        category:
            seo.category,

        brand: {
            "@type": "Brand",
            name:
                seo.brand
        },

        seller: {
            "@type": "Organization",
            name:
                SITE.name,
            url:
                SITE.domain
        }
    };

    // --------------------------------------------------------
    // Only add Offer when real numeric price exists.
    // --------------------------------------------------------

    if (
        typeof product.price === "number" &&
        Number.isFinite(product.price) &&
        product.price > 0
    ) {
        schema.offers = {
            "@type": "Offer",

            url:
                productURL,

            priceCurrency:
                product.currency ||
                SITE.currency,

            price:
                product.price,

            availability:
                product.availability ||
                "https://schema.org/InStock",

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

        "@id":
            `${SITE.domain}/#organization`,

        name:
            SITE.name,

        url:
            `${SITE.domain}/`,

        logo: {
            "@type":
                "ImageObject",

            url:
                SITE.logo
        }
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

        "@id":
            `${SITE.domain}/#website`,

        name:
            SITE.name,

        url:
            `${SITE.domain}/`,

        inLanguage:
            SITE.language
    };
}

// ============================================================
// FAQ SCHEMA
// ============================================================

function buildFAQSchema(faq) {
    return {
        "@context":
            "https://schema.org",

        "@type":
            "FAQPage",

        mainEntity:
            faq.map(function (item) {
                return {
                    "@type":
                        "Question",

                    name:
                        item.q,

                    acceptedAnswer: {
                        "@type":
                            "Answer",

                        text:
                            item.a
                    }
                };
            })
    };
}

// ============================================================
// 301 REDIRECT
// ============================================================

function redirect301(res, location) {
    res.statusCode = 301;

    res.setHeader(
        "Location",
        location
    );

    res.setHeader(
        "Cache-Control",
        "public, max-age=86400"
    );

    return res.end();
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
<html lang="en-BD">
<head>
<meta charset="UTF-8">
<meta name="robots" content="noindex, nofollow">
<title>Product Not Found | ${escapeHTML(SITE.name)}</title>
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

        res.setHeader(
            "Content-Type",
            "text/plain; charset=utf-8"
        );

        return res.end(
            "Method Not Allowed"
        );
    }

    // ========================================================
    // REQUEST
    // ========================================================

    const request =
        getProductRequest(req);

    // ========================================================
    // PRODUCT NOT FOUND
    // ========================================================

    if (
        !request.slug ||
        !products[request.slug]
    ) {
        return send404(res);
    }

    const slug =
        request.slug;

    const product =
        products[slug];

    // ========================================================
    // CANONICALIZE ALIASES
    // ========================================================

    if (
        request.source === "pretty" &&
        request.requested.toLowerCase() !== slug
    ) {
        return redirect301(
            res,
            `${SITE.domain}/product/${encodeURIComponent(slug)}`
        );
    }

    // ========================================================
    // SEO DATA
    // ========================================================

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

    const faqSchema =
        buildFAQSchema(
            seo.faq
        );

    // ========================================================
    // RELATED PRODUCTS
    // ========================================================

    const relatedProducts =
        getRelatedProducts(
            slug,
            product
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
        SITE.language
    );

    res.setHeader(
        "X-Content-Type-Options",
        "nosniff"
    );

    res.setHeader(
        "Referrer-Policy",
        "strict-origin-when-cross-origin"
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
    // HEAD REQUEST
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

<title>
${escapeHTML(seo.title)}
</title>

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

<!-- ======================================================
     OPEN GRAPH
     ====================================================== -->

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

<!-- ======================================================
     TWITTER
     ====================================================== -->

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

<!-- ======================================================
     PRODUCT JSON-LD
     ====================================================== -->

<script type="application/ld+json">
${safeJSON(productSchema)}
</script>

<!-- ======================================================
     BREADCRUMB JSON-LD
     ====================================================== -->

<script type="application/ld+json">
${safeJSON(breadcrumbSchema)}
</script>

<!-- ======================================================
     ORGANIZATION JSON-LD
     ====================================================== -->

<script type="application/ld+json">
${safeJSON(organizationSchema)}
</script>

<!-- ======================================================
     WEBSITE JSON-LD
     ====================================================== -->

<script type="application/ld+json">
${safeJSON(websiteSchema)}
</script>

<!-- ======================================================
     FAQ JSON-LD
     ====================================================== -->

<script type="application/ld+json">
${safeJSON(faqSchema)}
</script>

<!-- ======================================================
     PAGE CSS
     ====================================================== -->

<style>

* {
    box-sizing: border-box;
}

html {
    scroll-behavior: smooth;
}

body {
    margin: 0;
    padding: 0;
    width: 100%;
    min-height: 100vh;

    font-family:
        system-ui,
        -apple-system,
        BlinkMacSystemFont,
        "Segoe UI",
        sans-serif;

    color: #111827;
    background: #ffffff;
}

main {
    width: 100%;
}

.seo-container {
    width: 100%;
    max-width: 1100px;

    margin: 0 auto;

    padding:
        30px 20px 60px;
}

.breadcrumbs {
    margin-bottom: 22px;

    font-size: 14px;
    line-height: 1.5;

    color: #6b7280;
}

.breadcrumbs a {
    color: #374151;
    text-decoration: none;
}

.breadcrumbs a:hover {
    text-decoration: underline;
}

.product-hero {
    margin-bottom: 30px;
}

.product-hero h1 {
    margin: 0 0 16px;

    font-size:
        clamp(30px, 5vw, 48px);

    line-height: 1.12;
    letter-spacing: -0.02em;
}

.product-intro {
    max-width: 820px;

    margin: 0;

    font-size: 18px;
    line-height: 1.75;

    color: #374151;
}

.action-box {
    margin:
        28px 0 36px;

    padding: 24px;

    border:
        1px solid #e5e7eb;

    border-radius: 14px;

    background:
        #f9fafb;
}

.action-box h2 {
    margin:
        0 0 8px;

    font-size: 22px;
}

.action-box p {
    margin:
        0 0 18px;

    line-height: 1.7;
}

.buy-button {
    display: inline-block;

    padding:
        13px 22px;

    border-radius: 9px;

    background: #111827;
    color: #ffffff;

    text-decoration: none;

    font-weight: 700;
}

.buy-button:hover {
    opacity: 0.9;
}

.seo-section {
    margin-top: 34px;
}

.seo-section h2 {
    margin:
        0 0 14px;

    font-size: 26px;
    line-height: 1.3;
}

.seo-section p {
    max-width: 900px;

    margin:
        0 0 14px;

    line-height: 1.75;
}

.features {
    margin:
        0;

    padding-left: 22px;
}

.features li {
    margin:
        8px 0;

    line-height: 1.65;
}

.faq {
    margin-top: 12px;
}

.faq details {
    padding:
        15px 0;

    border-bottom:
        1px solid #e5e7eb;
}

.faq summary {
    cursor: pointer;

    font-weight: 700;

    line-height: 1.5;
}

.faq p {
    margin:
        12px 0 0;

    color: #4b5563;
}

.related-products {
    display: grid;

    grid-template-columns:
        repeat(
            auto-fit,
            minmax(190px, 1fr)
        );

    gap: 12px;

    margin-top: 15px;
}

.related-products a {
    display: block;

    padding: 15px;

    border:
        1px solid #e5e7eb;

    border-radius: 10px;

    color: #111827;

    text-decoration: none;

    font-weight: 650;

    background: #ffffff;
}

.related-products a:hover {
    text-decoration: underline;
}

.footer-note {
    margin-top: 45px;

    padding-top: 20px;

    border-top:
        1px solid #e5e7eb;

    color: #6b7280;

    font-size: 14px;
    line-height: 1.7;
}

@media (max-width: 700px) {

    .seo-container {
        padding:
            22px 16px 45px;
    }

    .product-hero h1 {
        font-size: 32px;
    }

    .product-intro {
        font-size: 16px;
    }

    .action-box {
        padding: 20px;
    }

    .seo-section h2 {
        font-size: 23px;
    }
}

</style>

</head>

<body>

<main>

<div class="seo-container">

    <!-- ==================================================
         BREADCRUMBS
         ================================================== -->

    <nav
        class="breadcrumbs"
        aria-label="Breadcrumb"
    >

        <a
            href="${escapeHTML(SITE.domain)}/"
        >
            Home
        </a>

        <span aria-hidden="true">
            &nbsp;/&nbsp;
        </span>

        <span>
            ${escapeHTML(seo.category)}
        </span>

        <span aria-hidden="true">
            &nbsp;/&nbsp;
        </span>

        <span>
            ${escapeHTML(seo.name)}
        </span>

    </nav>

    <!-- ==================================================
         PRODUCT HERO
         ================================================== -->

    <header class="product-hero">

        <h1>
            ${escapeHTML(seo.name)}
            Subscription in Bangladesh
        </h1>

        <p class="product-intro">
            ${escapeHTML(seo.intro)}
        </p>

    </header>

    <!-- ==================================================
         PRODUCT DESCRIPTION
         ================================================== -->

    <section
        class="seo-section"
        aria-labelledby="product-description"
    >

        <h2 id="product-description">
            ${escapeHTML(seo.name)} Subscription
        </h2>

        <p>
            NEXT LEVEL SUBS provides
            ${escapeHTML(seo.name)}
            subscription options for customers in
            Bangladesh. You can review the available
            subscription information and continue to the
            product ordering page when you are ready.
        </p>

    </section>

    <!-- ==================================================
         CUSTOMER ACTION
         ================================================== -->

    <section
        class="action-box"
        aria-labelledby="order-heading"
    >

        <h2 id="order-heading">
            View ${escapeHTML(seo.name)} Plans
        </h2>

        <p>
            See the current subscription options,
            duration and pricing before placing your order.
        </p>

        <a
            class="buy-button"
            href="${escapeHTML(destinationURL)}"
        >
            View Plans &amp; Buy
        </a>

    </section>

    <!-- ==================================================
         FEATURES
         ================================================== -->

    <section
        class="seo-section"
        aria-labelledby="features-heading"
    >

        <h2 id="features-heading">
            ${escapeHTML(seo.name)} Features
        </h2>

        <ul class="features">

            ${seo.features
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

    <!-- ==================================================
         BANGLADESH SECTION
         ================================================== -->

    <section
        class="seo-section"
        aria-labelledby="bangladesh-heading"
    >

        <h2 id="bangladesh-heading">
            ${escapeHTML(seo.name)} in Bangladesh
        </h2>

        <p>
            If you are looking for
            ${escapeHTML(seo.name)}
            in Bangladesh or searching for
            ${escapeHTML(seo.name)} BD,
            this page provides information about the
            subscription options available from
            NEXT LEVEL SUBS.
        </p>

    </section>

    <!-- ==================================================
         FAQ
         ================================================== -->

    <section
        class="seo-section"
        aria-labelledby="faq-heading"
    >

        <h2 id="faq-heading">
            Frequently Asked Questions
        </h2>

        <div class="faq">

            ${seo.faq
                .map(function (item) {
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
                })
                .join("")}

        </div>

    </section>

    <!-- ==================================================
         RELATED PRODUCTS
         ================================================== -->

    <section
        class="seo-section"
        aria-labelledby="related-heading"
    >

        <h2 id="related-heading">
            Related Subscriptions
        </h2>

        <nav
            class="related-products"
            aria-label="Related subscriptions"
        >

            ${relatedProducts
                .map(function (relatedSlug) {

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
                })
                .join("")}

        </nav>

    </section>

    <!-- ==================================================
         FOOTER
         ================================================== -->

    <p class="footer-note">

        NEXT LEVEL SUBS provides digital subscription
        products and services for customers in Bangladesh.
        Product availability, pricing and subscription
        terms can change, so please check the product
        ordering page for the latest information.

    </p>

</div>

</main>

</body>

</html>
`;

    return res.end(html);
};