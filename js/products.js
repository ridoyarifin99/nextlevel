"use strict";

/* ============================================================
   NEXT LEVEL SUBS — PRODUCT CATALOG
   /js/products.js
============================================================ */


/* ============================================================
   PRODUCT SLUG
============================================================ */

function productSlug(name) {
    return String(name || "")
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
}

/* ============================================================
   ENRICH PRODUCT (Adds SEO URL fields automatically)
============================================================ */

function enrichProduct(product) {
    const slug = product.slug || productSlug(product.name);

    return {
        ...product,
        slug,
        url: `/product/${slug}`,
        canonicalUrl: `https://www.nextlevelsubs.com/product/${slug}`,
        seoApiUrl: `/api/product?slug=${encodeURIComponent(slug)}`
    };
}

/* ============================================================
   YOUR PRODUCT CATALOG (With full Details, Pricing, FAQ)
============================================================ */

const rawSubscriptions = [
    {
        name: "Netflix Premium",
        description: "Watch unlimited movies and TV shows",
        icon: "fab fa-netflix",
        color: "#E50914",
        image: "./assets/details/netflix/netflix.webp",
        images: [
            "/assets/details/netflix/netflix1.webp",
            "/assets/details/netflix/netflix2.webp",
            "/assets/details/netflix/netflix3.webp"
        ],
        categories: ["best-selling", "popular-streaming"],
        rating: 4.7,
        reviews: 15420,
        pricing: [
            { duration: "1 Month", price: 379, currency: "BDT", popular: false, discount: "Save 30 Taka" },
            { duration: "3 Months", price: 1099, currency: "BDT", popular: false, discount: "Save 38 Taka" },
            { duration: "6 Months", price: 2199, currency: "BDT", popular: true, discount: "Save 75 Taka" },
            { duration: "1 Year", price: 4299, currency: "BDT", popular: false, discount: "Save 249 Taka" }
        ],
        features: [
            "Single screen", "Renewable", "Watch on PC/Laptop/Mobile/Tablet", "Can't be use on TV",
            "Profile pin locked", "3 device login limit", "4K Ultra HD streaming", "Watch on multiple devices",
            "Download for offline viewing", "Ad-free experience", "Exclusive content", "New releases added regularly"
        ],
        faq: [
            { question: "How many devices can I use with Netflix Premium?", answer: "Netflix Premium allows you to watch on 4 screens simultaneously at the same time." },
            { question: "What video quality does Netflix Premium offer?", answer: "Netflix Premium offers Ultra HD (4K) and HDR streaming quality for supported content." },
            { question: "Can I download content for offline viewing?", answer: "Yes, Netflix Premium allows you to download movies and TV shows to watch offline on your mobile device." },
            { question: "Is there a contract or commitment?", answer: "No, Netflix is a month-to-month service with no contracts or commitments. You can cancel anytime." }
        ]
    },
    {
        name: "Amazon Prime Video",
        description: "Thousands of movies and TV shows",
        icon: "fab fa-amazon",
        color: "#FF9900",
        image: "./assets/cards/prime_video.svg",
        images: [
            "./assets/details/primevideo/prime1.webp",
            "./assets/details/primevideo/prime2.webp",
            "./assets/details/primevideo/3.webp"
        ],
        categories: ["best-selling", "popular-streaming"],
        rating: 4.5,
        reviews: 12350,
        pricing: [
            { duration: "1 Month", price: 129, currency: "BDT", popular: false },
            { duration: "3 Months", price: 329, currency: "BDT", popular: false, discount: "Save 58 Taka" },
            { duration: "6 Months", price: 499, currency: "BDT", popular: true, discount: "Save 275 Taka" },
            { duration: "1 Year", price: 799, currency: "BDT", popular: false, discount: "Save 749 Taka" }
        ],
        features: [
            "Single screen", "Non-Renewable", "Watch on PC/Laptop/Mobile/Tablet/TV/anywhere", "Profile pin locked",
            "3 device login limit", "4K Ultra HD streaming", "Prime Originals and exclusives", "Watch on multiple devices",
            "Download for offline viewing", "Ad-free experience", "Included with Amazon Prime", "Exclusive content", "New releases added regularly"
        ],
        faq: [
            { question: "Is Amazon Prime Video included with Amazon Prime?", answer: "Yes, Amazon Prime Video is included with your Amazon Prime membership at no additional cost." },
            { question: "How many devices can I stream on simultaneously?", answer: "You can stream on up to 3 devices simultaneously with the same Amazon account." },
            { question: "Can I download videos for offline viewing?", answer: "Yes, you can download select titles to mobile devices for offline viewing." },
            { question: "What is the video quality of Prime Video?", answer: "Prime Video offers up to 4K Ultra HD quality for supported titles and devices." }
        ]
    },
    {
        name: "HBO Max",
        description: "HBO, Warner Bros., DC, Max Originals",
        icon: "fas fa-tv",
        color: "#6a19ff",
        image: "./assets/cards/hbo_max.svg",
        images: [
            "./assets/details/hbomax/1.webp",
            "./assets/details/hbomax/2.webp",
            "./assets/details/hbomax/3.webp"
        ],
        categories: ["best-selling", "popular-streaming"],
        rating: 4.6,
        reviews: 9870,
        pricing: [
            { duration: "1 Month", price: 199, currency: "BDT", popular: false },
            { duration: "3 Months", price: 459, currency: "BDT", popular: false, discount: "Save 298 Taka" },
            { duration: "6 Months", price: 729, currency: "BDT", popular: true, discount: "Save 795 Taka" },
            { duration: "1 Year", price: 999, currency: "BDT", popular: false, discount: "Save 1739 Taka" }
        ],
        features: [
            "Renewable", "VPN not required", "Single screen", "Pin locked profile",
            "Watch on PC/Laptop/Mobile/Tablet", "Upto 3 device login limit", "Warner Bros. movies same day as theaters",
            "HBO Originals and exclusives", "4K Ultra HD streaming", "Watch on multiple devices", "Download for offline viewing", "Ad-free experience"
        ],
        faq: [
            { question: "Do I need a VPN to access HBO Max?", answer: "Yes, a VPN is required to access HBO Max content from certain regions." },
            { question: "How many devices can I use with HBO Max?", answer: "You can stream on up to 3 devices simultaneously with the same HBO Max account." },
            { question: "What content is available on HBO Max?", answer: "HBO Max includes all of HBO, plus Warner Bros. movies, Max Originals, and select content from other brands." },
            { question: "Can I download content for offline viewing?", answer: "Yes, HBO Max allows you to download content to watch offline on your mobile devices." }
        ]
    },
    {
        name: "Spotify Premium",
        description: "Ad-free music and podcasts",
        icon: "fab fa-spotify",
        color: "#1DB954",
        image: "./assets/details/spotify/1.webp",
        images: [
            "./assets/details/spotify/1.webp",
            "./assets/details/spotify/2.webp",
            "./assets/details/spotify/3.webp"
        ],
        categories: ["best-selling", "music-streaming"],
        rating: 4.8,
        reviews: 18760,
        pricing: [
            { duration: "1 Month", price: 229, currency: "BDT", popular: false },
            { duration: "3 Months", price: 699, currency: "BDT", popular: false, discount: "Save 48 Taka" },
            { duration: "6 Months", price: 1299, currency: "BDT", popular: true, discount: "Save 75 Taka" },
            { duration: "1 Year", price: 2599, currency: "BDT", popular: false, discount: "Save 149 Taka" }
        ],
        features: [
            "Renewable", "No VPN required", "Single screen", "Personal email activation",
            "Use in PC/Laptop/Mobile/Tablet", "Upto 3 device login limit", "1 device streaming limit",
            "Ad-free music listening", "Download for offline listening", "High-quality audio", "Unlimited skips", "Play any song", "Personalized playlists"
        ],
        faq: [
            { question: "What audio quality does Spotify Premium offer?", answer: "Spotify Premium offers high-quality audio streaming at up to 320kbps." },
            { question: "How many songs can I download for offline listening?", answer: "You can download up to 10,000 songs on up to 5 different devices for offline listening." },
            { question: "Can I use Spotify Premium on multiple devices?", answer: "Yes, you can use Spotify Premium on multiple devices, but you can only stream on one device at a time." },
            { question: "What's the difference between Spotify Free and Premium?", answer: "Spotify Premium offers ad-free listening, offline downloads, unlimited skips, and higher audio quality compared to the free tier." }
        ]
    }
    // ... [ADD OR PASTE THE REST OF YOUR PRODUCTS HERE USING THE SAME FORMAT] ...
    // Make sure each product has: images [], pricing [], features [], and faq [] arrays.
];

/* ============================================================
   BUILD FINAL PRODUCT LIST
============================================================ */

const subscriptions = rawSubscriptions.map(enrichProduct);

/* ============================================================
   GLOBAL ACCESS
============================================================ */

// 1. For Frontend UI (Browser environment like details.html)
if (typeof window !== 'undefined') {
    window.products = subscriptions;
    window.NextLevelSubs = {
        subscriptions: subscriptions,
        productSlug: productSlug,
        enrichProduct: enrichProduct,
        getProductBySlug: function(slug) {
            return subscriptions.find(p => p.slug === slug) || null;
        }
    };
}

// 2. For Backend SEO Handler (Node.js environment)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        products: subscriptions,
        productSlug: productSlug,
        enrichProduct: enrichProduct
    };
}