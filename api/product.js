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
// Existing product page:
//
// /details.html?name=Netflix%20Premium
//
// IMPORTANT:
//
// 1. Product slugs are generated automatically.
// 2. Product names remain synchronized with rawProducts.
// 3. Existing details.html continues to be used.
// 4. Browser Back / Forward works.
// 5. Product-to-product navigation updates the clean URL.
// 6. No duplicate slug database is required.
// 7. Adding a new product automatically creates its slug.
// ============================================================


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
// PRODUCT SLUG GENERATOR
// ============================================================
//
// Examples:
//
// Netflix Premium
// → netflix-premium
//
// Black Box Ai(CHAT-GPT5)
// → black-box-ai-chat-gpt5
//
// perplexity (ChatGPT-5)
// → perplexity-chatgpt-5
//
// Disney+
// → disney
//
// AMC+
// → amc
//
// ============================================================

function productSlug(name) {

    return String(name)
        .normalize("NFKD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
}


// ============================================================
// PRODUCT DATABASE
// ============================================================
//
// IMPORTANT:
//
// Keep adding products here normally.
//
// DO NOT add slug manually.
//
// Example:
//
// [
//     "Disney+ Premium",
//     "Premium Disney streaming",
//     "/assets/cards/disney-premium.webp",
//     "Streaming"
// ]
//
// Automatically becomes:
//
// /product/disney-premium
//
// ============================================================

const rawProducts = [

    // ========================================================
    // BEST-SELLING SUBSCRIPTIONS
    // ========================================================

    [
        "Netflix Premium",
        "Watch unlimited movies and TV shows",
        "/assets/cards/netflix.webp",
        "Streaming"
    ],

    [
        "Amazon Prime Video",
        "Thousands of movies and TV shows",
        "/assets/cards/prime_video.svg",
        "Streaming"
    ],

    [
        "HBO Max",
        "HBO, Warner Bros., DC, Max Originals",
        "/assets/cards/hbo_max.svg",
        "Streaming"
    ],

    [
        "Crunchy Roll Mega",
        "Anime. Streaming. Community",
        "/assets/cards/crunchy.png",
        "Streaming"
    ],

    [
        "Netflix For TV",
        "Watch unlimited movies and TV shows",
        "/assets/cards/netflixfortv.webp",
        "Streaming"
    ],

    [
        "Chorki Premium",
        "Bengali. Bold. Streaming",
        "/assets/cards/chorki.webp",
        "Streaming"
    ],

    [
        "Hoichoi Premium",
        "Unlimited Bangla Entertainment",
        "/assets/cards/hoichoi.png",
        "Streaming"
    ],

    [
        "Bongo",
        "Unlimited Bangla Entertainment",
        "/assets/cards/bongo.png",
        "Streaming"
    ],

    [
        "Spotify Premium",
        "Ad-free music and podcasts",
        "/assets/cards/spotify.jpg",
        "Music"
    ],

    [
        "Amazon Music Unlimited",
        "HIFI quality music and podcasts",
        "/assets/cards/amazon-music-unlimited.jpeg",
        "Music"
    ],

    [
        "Youtube Premium Non-Renewable",
        "Add free videos and music",
        "/assets/cards/youtube.webp",
        "Streaming"
    ],

    [
        "Microsoft OneDrive",
        "1TB cloud storage with Office apps",
        "/assets/cards/onedrive.svg",
        "Cloud Storage"
    ],

    [
        "True Caller Gold",
        "Add free videos and music",
        "/assets/cards/truecaller.avif",
        "Productivity"
    ],


    // ========================================================
    // POPULAR STREAMING SUBSCRIPTIONS
    // ========================================================

    [
        "Disney+",
        "Premium content and Warner Bros. movies",
        "/assets/cards/disney.jpg",
        "Streaming"
    ],

    [
        "Hulu",
        "Next-day TV and original content",
        "/assets/cards/hulu.svg",
        "Streaming"
    ],

    [
        "Apple TV+",
        "Original shows and movies",
        "/assets/cards/apple_tv.jpg",
        "Streaming"
    ],

    [
        "Paramount+",
        "Movies, live sports, and exclusive originals",
        "/assets/cards/paramount.webp",
        "Streaming"
    ],

    [
        "Peacock",
        "NBCUniversal content and live sports",
        "/assets/cards/Peacock.avif",
        "Streaming"
    ],

    [
        "YouTube Premium",
        "Ad-free videos and YouTube Music",
        "/assets/cards/youtube.webp",
        "Streaming"
    ],

    [
        "Discovery+",
        "Documentaries, Reality, Entertainment",
        "/assets/cards/discovery.webp",
        "Streaming"
    ],

    [
        "Shudder Premium",
        "Horror, Thriller, Suspense",
        "/assets/cards/shudder.jpg",
        "Streaming"
    ],

    [
        "Prime Video Full",
        "Movies, Series, Originals",
        "/assets/cards/primefull.webp",
        "Streaming"
    ],

    [
        "AMC+",
        "Horror, Thriller, Suspense",
        "/assets/cards/amc+.webp",
        "Streaming"
    ],

    [
        "Fubo TV",
        "Sports, Live, Entertainment",
        "/assets/cards/fuboTV.webp",
        "Streaming"
    ],

    [
        "Ullu Pro",
        "Adult, Web, Series",
        "/assets/cards/ullu.png",
        "Streaming"
    ],

    [
        "Sling TV",
        "Live, Channels, Streaming",
        "/assets/cards/slingtv.png",
        "Streaming"
    ],


    // ========================================================
    // MUSIC STREAMING
    // ========================================================

    [
        "Apple Music",
        "Stream over 75 million songs",
        "/assets/cards/apple_music.jpg",
        "Music"
    ],

    [
        "Tidal",
        "High-fidelity music streaming",
        "/assets/cards/tidal.svg",
        "Music"
    ],

    [
        "Pandora Premium",
        "Personalized music and podcasts",
        "/assets/cards/pandora.svg",
        "Music"
    ],

    [
        "SoundCloud Go+",
        "Ad-free music and offline listening",
        "/assets/cards/sound_cloud.svg",
        "Music"
    ],

    [
        "Deezer HiFi",
        "High-quality audio streaming",
        "/assets/cards/deezer.svg",
        "Music"
    ],

    [
        "Amazon Music Unlimited",
        "High-quality audio streaming",
        "/assets/cards/amazon-music-unlimited.jpeg",
        "Music"
    ],


    // ========================================================
    // CLOUD STORAGE
    // ========================================================

    [
        "Dropbox Plus",
        "2TB secure cloud storage",
        "/assets/cards/Dropbox_(service)-Logo.wine.svg",
        "Cloud Storage"
    ],

    [
        "Google Drive",
        "1 TB cloud storage",
        "/assets/cards/Google_Drive-Logo.wine.svg",
        "Cloud Storage"
    ],

    [
        "iCloud+",
        "50GB cloud storage for Apple users",
        "/assets/cards/icloud+webp.webp",
        "Cloud Storage"
    ],

    [
        "Amazon Drive",
        "100GB cloud storage",
        "/assets/cards/amazon_drive.png",
        "Cloud Storage"
    ],


    // ========================================================
    // VPN
    // ========================================================

    [
        "ExpressVPN",
        "High-speed, secure VPN service",
        "/assets/cards/expressVPN.png",
        "VPN"
    ],

    [
        "NordVPN",
        "Advanced security with double VPN",
        "/assets/cards/nordvpn.webp",
        "VPN"
    ],

    [
        "Surfshark",
        "Unlimited devices and connections",
        "/assets/cards/surfsharkvpn.webp",
        "VPN"
    ],

    [
        "CyberGhost",
        "User-friendly VPN with 45-day guarantee",
        "/assets/cards/cyberghost.png",
        "VPN"
    ],

    [
        "IPVanish",
        "Fast connections with no logs",
        "/assets/cards/ipvanish.webp",
        "VPN"
    ],

    [
        "Private Internet Access",
        "Highly customizable VPN",
        "/assets/cards/pia.png",
        "VPN"
    ],

    [
        "Hotspot Shield",
        "Patented VPN technology",
        "/assets/cards/Hotspot-Shield-vpn.webp",
        "VPN"
    ],

    [
        "Vypr VPN",
        "Patented VPN technology",
        "/assets/cards/vyprvpn.webp",
        "VPN"
    ],


    // ========================================================
    // AI & DESIGN
    // ========================================================

    [
        "Canva Pro",
        "Canva Pro: Where Ideas Turn into Stunning Designs—Fast!",
        "/assets/cards/canva.png",
        "AI & Design"
    ],

    [
        "Photoroom Pro",
        "Advanced security with double VPN",
        "/assets/cards/photoroom.jpg",
        "AI & Design"
    ],

    [
        "Picsart Premium",
        "Unlimited devices and connections",
        "/assets/cards/picsart.png",
        "AI & Design"
    ],

    [
        "Photoroom Max",
        "User-friendly VPN with 45-day guarantee",
        "/assets/cards/photoroom.jpg",
        "AI & Design"
    ],

    [
        "Black Box Ai(CHAT-GPT5)",
        "Fast connections with no logs",
        "/assets/cards/blackboxai.jpg",
        "AI & Design"
    ],

    [
        "Gemini Ai",
        "Highly customizable VPN",
        "/assets/cards/gemini.png",
        "AI & Design"
    ],

    [
        "Chat GPT",
        "Patented VPN technology",
        "/assets/cards/chatgpt.jpg",
        "AI & Design"
    ],

    [
        "perplexity (ChatGPT-5)",
        "Patented VPN technology",
        "/assets/cards/Perplexity.svg",
        "AI & Design"
    ],

    [
        "Remini Ai",
        "Patented VPN technology",
        "/assets/cards/remini.avif",
        "AI & Design"
    ],


    // ========================================================
    // COMBO SUBSCRIPTIONS
    // ========================================================

    [
        "Netflix + Prime Video",
        "Get both streaming services at a discount",
        "/assets/cards/Netflix-vs-Amazon.jpg",
        "Combo"
    ],

    [
        "Netflix + HBO Max",
        "Premium content from both platforms",
        "/assets/cards/netflix+hbomax.webp",
        "Combo"
    ],

    [
        "Prime Video + HBO Max",
        "Premium content from both platforms",
        "/assets/cards/prime+hbo.webp",
        "Combo"
    ],

    [
        "HBO Max + Surfshark VPN",
        "Stream securely with VPN protection",
        "/assets/cards/hbo+surfshark.webp",
        "Combo"
    ],

    [
        "Spotify + YouTube Premium",
        "Ad-free music and videos",
        "/assets/cards/spotify+youtube.webp",
        "Combo"
    ],

    [
        "Disney + HBO Max",
        "Disney, HBO Max",
        "/assets/cards/disney+nordVPN.webp",
        "Combo"
    ],

    [
        "Disney + Nord VPN",
        "Netflix, Hulu, and Disney+ bundle",
        "/assets/cards/disney+nordVPN.webp",
        "Combo"
    ],

    [
        "Music & Storage",
        "Amazon music HD and 1TB one drive storage",
        "/assets/cards/amazon+onedrive.png",
        "Combo"
    ],

    [
        "Security Bundle",
        "ExpressVPN and 1TB one drive cloud storage",
        "/assets/cards/expressvpn+onedrive.webp",
        "Combo"
    ],

    [
        "Ultimate Entertainment",
        "Netflix, HBO Max, and ExpressVPN",
        "/assets/cards/netflix_expressvpn_hbomax.webp",
        "Combo"
    ],


    // ========================================================
    // EDUCATION
    // ========================================================

    [
        "Doulingo",
        "Learn from the world's best instructors",
        "/assets/cards/doulingo.png",
        "Education"
    ],

    [
        "Skillshare",
        "Access thousands of courses",
        "/assets/cards/skill_share.png",
        "Education"
    ],

    [
        "LinkedIn Premium",
        "Professional development courses",
        "/assets/cards/LinkedIn.png",
        "Education"
    ],

    [
        "Numerade",
        "Wide range of online courses",
        "/assets/cards/Numerade.jpg",
        "Education"
    ],

    [
        "Grammarly Pro",
        "Free learning resources",
        "/assets/cards/grammarly.png",
        "Education"
    ],


    // ========================================================
    // ADULT 18+
    // ========================================================

    [
        "Digital Playground",
        "Exclusive content from creators",
        "/assets/cards/DigitalPlayground-logo.png",
        "Adult"
    ],

    [
        "Pornhub Premium",
        "Ad-free adult entertainment",
        "/assets/cards/pornhub.webp",
        "Adult"
    ],

    [
        "Brazzers",
        "Premium adult content",
        "/assets/cards/brazzers.webp",
        "Adult"
    ],

    [
        "Spice Vids",
        "Adult streaming platform",
        "/assets/cards/spicevids.webp",
        "Adult"
    ],

    [
        "Reality Kings",
        "Reality adult content",
        "/assets/cards/realitykings.webp",
        "Adult"
    ],

    [
        "Bang Bros",
        "High-quality, exclusive adult entertainment",
        "/assets/cards/bangbros.webp",
        "Adult"
    ],

    [
        "Babes.com",
        "High-quality, exclusive adult video content",
        "/assets/cards/babes.webp",
        "Adult"
    ]

];


// ============================================================
// BUILD PRODUCT DATABASE AUTOMATICALLY
// ============================================================

const products = {};

for (const [name, description, image, category] of rawProducts) {

    const slug = productSlug(name);

    if (!slug) {
        console.warn(
            "Product skipped because it generated an empty slug:",
            name
        );

        continue;
    }

    if (products[slug]) {

        console.warn(
            `Duplicate product slug "${slug}". ` +
            `Product "${name}" conflicts with "${products[slug].name}".`
        );

        continue;
    }

    products[slug] = {
        slug,
        name,
        description,
        image,
        category,
        page:
            `/details.html?name=${encodeURIComponent(name)}`
    };
}


// ============================================================
// HTML ESCAPE
// ============================================================

function escapeHTML(value) {

    return String(value)
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
// ABSOLUTE URL
// ============================================================

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

    // SVG is not ideal for WhatsApp/Facebook previews.
    if (/\.svg(?:\?|#|$)/i.test(image)) {
        return "/assets/logo.png";
    }

    return image;
}


// ============================================================
// IMAGE MIME TYPE
// ============================================================

function getImageMimeType(imageURL) {

    const cleanURL = String(imageURL)
        .split("?")[0]
        .split("#")[0]
        .toLowerCase();

    if (
        cleanURL.endsWith(".jpg") ||
        cleanURL.endsWith(".jpeg")
    ) {
        return "image/jpeg";
    }

    if (cleanURL.endsWith(".webp")) {
        return "image/webp";
    }

    if (cleanURL.endsWith(".gif")) {
        return "image/gif";
    }

    return "image/png";
}


// ============================================================
// GET PRODUCT SLUG
// ============================================================

function getProductSlug(req) {

    // --------------------------------------------------------
    // API:
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
    // CLEAN URL:
    //
    // /product/netflix-premium
    // --------------------------------------------------------

    const rawURL =
        req.url || "";

    const pathname =
        rawURL.split("?")[0];

    const match =
        pathname.match(
            /^\/product\/([^/]+)\/?$/
        );

    if (
        !match ||
        !match[1]
    ) {
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

    <style>

        body {
            margin: 0;
            padding: 40px;
            font-family: Arial, sans-serif;
            background: #ffffff;
            color: #111111;
        }

        a {
            color: #111111;
        }

    </style>

</head>

<body>

    <h1>Product Not Found</h1>

    <p>
        The requested product could not be found.
    </p>

    <p>

        <a href="${escapeHTML(SITE.domain)}">
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
    // FIND PRODUCT
    // ========================================================

    const slug =
        getProductSlug(req);

    const product =
        products[slug];


    if (!product) {
        return send404(res);
    }


    // ========================================================
    // URLS
    // ========================================================

    const productURL =
        `${SITE.domain}/product/${encodeURIComponent(slug)}`;

    const imageURL =
        absoluteURL(
            getSocialImage(product)
        );

    const destinationURL =
        absoluteURL(product.page);

    const imageMimeType =
        getImageMimeType(imageURL);


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
    // PRODUCT JSON-LD
    // ========================================================

    const productSchema = {

        "@context":
            "https://schema.org",

        "@type":
            "Product",

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


    // ========================================================
    // BREADCRUMB JSON-LD
    // ========================================================

    const breadcrumbSchema = {

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
                    SITE.domain

            },

            {

                "@type":
                    "ListItem",

                "position":
                    2,

                "name":
                    product.category,

                "item":
                    SITE.domain

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
    // HEAD REQUEST
    // ========================================================

    if (req.method === "HEAD") {
        return res.end();
    }


    // ========================================================
    // CLIENT PRODUCT MAP
    // ========================================================

    const clientProductMap =
        Object.fromEntries(

            Object.entries(products)
                .map(
                    ([slugValue, productData]) => [

                        slugValue,

                        {
                            slug:
                                slugValue,

                            name:
                                productData.name,

                            page:
                                productData.page

                        }

                    ]
                )
        );


    // ========================================================
    // HTML
    // ========================================================

    const html = `
<!DOCTYPE html>

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
        content="${escapeHTML(imageMimeType)}"
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


<!-- =======================================================
     EXISTING DETAILS PAGE
     ======================================================= -->

<iframe
    id="productFrame"
    src="${escapeHTML(destinationURL)}"
    title="${escapeHTML(product.name)}"
    loading="eager"
></iframe>


<!-- =======================================================
     NAVIGATION / HISTORY BRIDGE
     ======================================================= -->

<script>

(function () {

    "use strict";


    // ========================================================
    // IFRAME
    // ========================================================

    const frame =
        document.getElementById(
            "productFrame"
        );


    if (!frame) {
        return;
    }


    // ========================================================
    // PRODUCT MAP
    // ========================================================

    const productMap =
        ${safeJSON(clientProductMap)};


    // ========================================================
    // CURRENT PRODUCT
    // ========================================================

    let currentSlug =
        ${safeJSON(slug)};


    // ========================================================
    // FLAG
    // ========================================================

    let loadingFromHistory =
        false;


    // ========================================================
    // GET SLUG FROM details.html URL
    // ========================================================

    function getSlugFromDetailsURL(url) {

        try {

            const parsedURL =
                new URL(
                    url,
                    window.location.origin
                );


            const pathname =
                parsedURL.pathname.toLowerCase();


            if (
                !pathname.endsWith(
                    "/details.html"
                )
            ) {

                return null;
            }


            const name =
                parsedURL.searchParams.get(
                    "name"
                );


            if (!name) {
                return null;
            }


            const normalizedName =
                name
                    .trim()
                    .toLowerCase();


            for (
                const [
                    slugValue,
                    productData
                ]
                of Object.entries(productMap)
            ) {

                if (
                    productData.name
                        .trim()
                        .toLowerCase() ===
                    normalizedName
                ) {

                    return slugValue;
                }

            }


            return null;

        } catch {

            return null;
        }

    }


    // ========================================================
    // GET SLUG FROM PARENT URL
    // ========================================================

    function getSlugFromParentURL() {

        const pathname =
            window.location.pathname;


        const match =
            pathname.match(
                /^\/product\/([^/]+)\/?$/
            );


        if (
            !match ||
            !match[1]
        ) {

            return null;
        }


        try {

            return decodeURIComponent(
                match[1]
            )
                .trim()
                .toLowerCase();

        } catch {

            return match[1]
                .trim()
                .toLowerCase();
        }

    }


    // ========================================================
    // UPDATE CLEAN URL
    // ========================================================

    function updateProductURL(
        newSlug,
        push
    ) {

        if (
            !newSlug ||
            !productMap[newSlug]
        ) {

            return;
        }


        const newURL =
            "/product/" +
            encodeURIComponent(
                newSlug
            );


        const currentURL =
            window.location.pathname;


        if (
            currentURL === newURL
        ) {

            currentSlug =
                newSlug;

            return;
        }


        currentSlug =
            newSlug;


        const state = {

            productSlug:
                newSlug

        };


        if (push) {

            window.history.pushState(
                state,
                "",
                newURL
            );

        } else {

            window.history.replaceState(
                state,
                "",
                newURL
            );
        }

    }


    // ========================================================
    // LOAD PRODUCT
    // ========================================================

    function loadProduct(
        newSlug
    ) {

        const product =
            productMap[newSlug];


        if (!product) {
            return;
        }


        loadingFromHistory =
            true;


        frame.src =
            product.page;
    }


    // ========================================================
    // NAVIGATE TO PRODUCT
    // ========================================================

    function navigateToProduct(
        newSlug
    ) {

        if (
            !newSlug ||
            !productMap[newSlug]
        ) {

            return;
        }


        if (
            newSlug === currentSlug
        ) {

            return;
        }


        updateProductURL(
            newSlug,
            true
        );


        loadProduct(
            newSlug
        );

    }


    // ========================================================
    // INSTALL NAVIGATION BRIDGE
    // ========================================================

    function installNavigationBridge() {

        try {

            const frameDoc =
                frame.contentDocument;


            if (!frameDoc) {
                return;
            }


            if (
                frameDoc.documentElement
                    .dataset
                    .nextLevelNavigationInstalled ===
                "true"
            ) {

                return;
            }


            frameDoc.documentElement
                .dataset
                .nextLevelNavigationInstalled =
                "true";


            frameDoc.addEventListener(
                "click",
                function (event) {

                    const target =
                        event.target;


                    if (
                        !target ||
                        typeof target.closest !==
                            "function"
                    ) {

                        return;
                    }


                    const link =
                        target.closest(
                            "a"
                        );


                    if (!link) {
                        return;
                    }


                    const href =
                        link.getAttribute(
                            "href"
                        );


                    if (!href) {
                        return;
                    }


                    // ==================================================
                    // HOME
                    // ==================================================

                    if (
                        href === "/" ||
                        href === "/index.html" ||
                        href === "index.html"
                    ) {

                        event.preventDefault();
                        event.stopPropagation();


                        window.location.href =
                            "/";


                        return;
                    }


                    // ==================================================
                    // DETAILS.HTML PRODUCT LINK
                    // ==================================================

                    const detailsSlug =
                        getSlugFromDetailsURL(
                            href
                        );


                    if (detailsSlug) {

                        event.preventDefault();
                        event.stopPropagation();


                        navigateToProduct(
                            detailsSlug
                        );


                        return;
                    }


                    // ==================================================
                    // CLEAN PRODUCT LINK
                    // ==================================================

                    try {

                        const parsedURL =
                            new URL(
                                href,
                                window.location.origin
                            );


                        if (
                            parsedURL.origin !==
                            window.location.origin
                        ) {

                            return;
                        }


                        const productMatch =
                            parsedURL.pathname.match(
                                /^\/product\/([^/]+)\/?$/
                            );


                        if (
                            !productMatch ||
                            !productMatch[1]
                        ) {

                            return;
                        }


                        const targetSlug =
                            decodeURIComponent(
                                productMatch[1]
                            )
                                .trim()
                                .toLowerCase();


                        if (
                            !productMap[targetSlug]
                        ) {

                            return;
                        }


                        event.preventDefault();
                        event.stopPropagation();


                        navigateToProduct(
                            targetSlug
                        );


                    } catch {

                        // Ignore invalid URLs.
                    }

                },
                true
            );

        } catch (error) {

            console.warn(
                "Navigation bridge unavailable:",
                error
            );
        }

    }


    // ========================================================
    // IFRAME LOAD
    // ========================================================

    frame.addEventListener(
        "load",
        function () {

            installNavigationBridge();


            // ------------------------------------------------
            // Product was loaded because of Back / Forward.
            // ------------------------------------------------

            if (
                loadingFromHistory
            ) {

                loadingFromHistory =
                    false;

                return;
            }


            // ------------------------------------------------
            // Detect direct navigation inside details.html.
            // ------------------------------------------------

            try {

                const frameURL =
                    frame.contentWindow
                        .location
                        .href;


                const detectedSlug =
                    getSlugFromDetailsURL(
                        frameURL
                    );


                if (
                    detectedSlug &&
                    detectedSlug !==
                        currentSlug
                ) {

                    updateProductURL(
                        detectedSlug,
                        true
                    );
                }

            } catch {

                // Ignore iframe URL errors.
            }

        }
    );


    // ========================================================
    // BROWSER BACK / FORWARD
    // ========================================================

    window.addEventListener(
        "popstate",
        function (event) {

            let targetSlug =
                null;


            // ------------------------------------------------
            // History state
            // ------------------------------------------------

            if (
                event.state &&
                typeof event.state.productSlug ===
                    "string"
            ) {

                targetSlug =
                    event.state.productSlug;
            }


            // ------------------------------------------------
            // URL fallback
            // ------------------------------------------------

            if (!targetSlug) {

                targetSlug =
                    getSlugFromParentURL();
            }


            // ------------------------------------------------
            // Browser left product route.
            // Let browser continue normally.
            // ------------------------------------------------

            if (
                !targetSlug ||
                !productMap[targetSlug]
            ) {

                return;
            }


            // ------------------------------------------------
            // Load previous/next product.
            // Do NOT push another history entry.
            // ------------------------------------------------

            currentSlug =
                targetSlug;


            loadProduct(
                targetSlug
            );

        }
    );


    // ========================================================
    // INITIAL HISTORY STATE
    // ========================================================

    window.history.replaceState(
        {
            productSlug:
                currentSlug
        },
        "",
        "/product/" +
            encodeURIComponent(
                currentSlug
            )
    );

})();

</script>


<!-- =======================================================
     NOSCRIPT FALLBACK
     ======================================================= -->

<noscript>

    <div class="fallback">

        <a
            href="${escapeHTML(destinationURL)}"
        >

            Continue to
            ${escapeHTML(product.name)}

        </a>

    </div>

</noscript>


</body>

</html>
`;


    // ========================================================
    // SEND RESPONSE
    // ========================================================

    return res.end(html);
};