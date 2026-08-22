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
// Normal visitors see the existing details.html product page
// while the browser URL remains clean.
//
// IMPORTANT:
// Product names/images/descriptions below are synchronized with
// the rawSubscriptions list used by your website.
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
// PRODUCT SLUG GENERATOR
// ============================================================
//
// This matches the slug logic used by your frontend:
//
// productSlug("Netflix Premium")
// → netflix-premium
//
// productSlug("Black Box Ai(CHAT-GPT5)")
// → black-box-ai-chat-gpt5
//
// productSlug("perplexity (ChatGPT-5)")
// → perplexity-chatgpt-5
//
// ============================================================

function productSlug(name) {
    return String(name)
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
}


// ============================================================
// PRODUCT DATABASE
// ============================================================
//
// This uses the SAME product names as rawSubscriptions.
// The slug and details.html URL are generated automatically.
//
// Format:
//
// [name, description, image, category]
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

    // NOTE:
    // This is intentionally a separate product entry because
    // your rawSubscriptions contains Amazon Music Unlimited
    // twice with different prices/durations.
    //
    // The URL slug must remain unique.
    //
    // Both entries therefore resolve to the same product name
    // and same clean URL, which is consistent with your current
    // product naming system.

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
// BUILD PRODUCT DATABASE
// ============================================================
//
// Instead of manually maintaining:
//
// slug
// name
// image
// page
//
// we generate them from the SAME product name.
//
// This prevents:
//     /product/netflix-premium
//     /product/black-box-ai-chat-gpt5
//     /product/perplexity-chatgpt-5
//
// from becoming mismatched with details.html.
//
// ============================================================

const products = {};

for (const [name, description, image, category] of rawProducts) {

    const slug = productSlug(name);

    products[slug] = {
        name,
        description,
        image,
        category,
        page: `/details.html?name=${encodeURIComponent(name)}`
    };
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
//
// SVG is unreliable for some social crawlers.
//
// If the product image is SVG, use logo.png as fallback.
//
// ============================================================

function getSocialImage(product) {

    const image = product.image || "";

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

    <title>Product Not Found | NEXT LEVEL SUBS</title>

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
// MAIN FUNCTION
// ============================================================

module.exports = function handler(req, res) {

    // --------------------------------------------------------
    // GET / HEAD only
    // --------------------------------------------------------

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


    // --------------------------------------------------------
    // PRODUCT
    // --------------------------------------------------------

    const slug = getProductSlug(req);

    const product = products[slug];

    if (!product) {
        return send404(res);
    }


    // --------------------------------------------------------
    // URLs
    // --------------------------------------------------------

    const productURL =
        `${SITE.domain}/product/${encodeURIComponent(slug)}`;

    const imageURL =
        absoluteURL(getSocialImage(product));

    const destinationURL =
        absoluteURL(product.page);


    // --------------------------------------------------------
    // SEO
    // --------------------------------------------------------

    const title =
        `${product.name} Subscription | NEXT LEVEL SUBS`;

    const description =
        `${product.description}. Get ${product.name} subscription from NEXT LEVEL SUBS.`;

    const imageAlt =
        `${product.name} - NEXT LEVEL SUBS`;


    // --------------------------------------------------------
    // JSON-LD PRODUCT
    // --------------------------------------------------------

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


    // --------------------------------------------------------
    // BREADCRUMB
    // --------------------------------------------------------

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


    // --------------------------------------------------------
    // HEADERS
    // --------------------------------------------------------

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


    // --------------------------------------------------------
    // HEAD
    // --------------------------------------------------------

    if (req.method === "HEAD") {
        return res.end();
    }


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
         BASIC PAGE STYLE
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

    <!--
        Existing product detail page.

        The iframe keeps the existing details.html
        implementation while the browser remains on:

        /product/product-slug
    -->

<iframe
    id="productFrame"
    src="${escapeHTML(destinationURL)}"
    title="${escapeHTML(product.name)}"
    loading="eager"
></iframe>

<script>
(function () {
    const frame = document.getElementById("productFrame");

    if (!frame) return;

    // Prevent the iframe page from creating an unwanted
    // navigation state in the parent page.
    frame.addEventListener("load", function () {
        try {
            const frameDoc = frame.contentDocument;

            if (!frameDoc) return;

            frameDoc.addEventListener("click", function (event) {
                const link = event.target.closest("a");

                if (!link) return;

                const href = link.getAttribute("href");

                if (!href) return;

                // If the user clicks the homepage/return link
                // inside details.html, navigate the parent window.
                if (
                    href === "/" ||
                    href === "/index.html" ||
                    href === "index.html"
                ) {
                    event.preventDefault();
                    window.location.href = "/";
                }
            });
        } catch (error) {
            console.warn("Product navigation bridge unavailable.");
        }
    });
})();
</script>


    <noscript>

        <div class="fallback">

            <a href="${escapeHTML(destinationURL)}">
                Continue to ${escapeHTML(product.name)}
            </a>

        </div>

    </noscript>


</body>

</html>
`;

    return res.end(html);
};