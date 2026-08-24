// ============================================================
// NEXT LEVEL SUBS — PRODUCTION HYBRID PRODUCT SEO HANDLER
// ============================================================
// Deploy as: /api/product.js
// Required Vercel rewrite:
//   /product/:slug  -> /api/product?slug=:slug
//
// Provides:
// - Server-rendered, crawlable product HTML
// - Product + Breadcrumb + Organization + WebSite JSON-LD
// - Bangladesh-focused SEO
// - Canonical + hreflang + Open Graph + Twitter
// - Real offers only when actual numeric price data exists
// - Crawlable related-product links
// - Existing details.html UI inside an iframe
// - Navigation from details.html back to clean /product/:slug URLs
// - Clean handling of /api/product?slug=... and /product/:slug
// - Proper 404/405 responses and cache headers
// ============================================================

"use strict";

const SITE = {
  name: "NEXT LEVEL SUBS",
  domain: "https://www.nextlevelsubs.com",
  locale: "en_BD",
  language: "en-BD",
  currency: "BDT",
  country: "BD",
  description:
    "Premium subscriptions, streaming services, VPNs, AI tools, cloud storage and digital services in Bangladesh.",
  logo: "https://www.nextlevelsubs.com/assets/logo.png"
};

// ============================================================
// PRODUCT DATABASE
// ============================================================

const products = {
  // STREAMING
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

  // MUSIC
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

  // CLOUD STORAGE
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

  // VPN
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

  // AI & DESIGN
  "canva-pro": {
    name: "Canva Pro",
    description: "Professional design tools and premium content",
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
    description:
      "Advanced AI assistant for writing, research and productivity",
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

  // COMBOS
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

  // EDUCATION
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

  // ADULT
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

  // PRODUCTIVITY
  "truecaller-gold": {
    name: "True Caller Gold",
    description:
      "Premium caller identification and protection",
    image: "/assets/cards/truecaller.avif",
    category: "Productivity"
  }
};

const slugAliases = {
  netflix: "netflix-premium",
  duolingo: "doulingo",
  "youtube-premium-nonrenewable":
    "youtube-premium-non-renewable"
};

// ============================================================
// SEO OVERRIDES
// ============================================================

const seoOverrides = {
  "hbo-max": {
    title:
      "HBO Max Subscription in Bangladesh | Buy HBO Max BD",
    description:
      "Buy an HBO Max subscription in Bangladesh from NEXT LEVEL SUBS. View available plans, subscription options and current product details for Bangladesh customers.",
    intro:
      "Looking for an HBO Max subscription in Bangladesh? Explore the available HBO Max subscription options from NEXT LEVEL SUBS, including the current plans and product details shown below.",
    terms: [
      "HBO Max subscription Bangladesh",
      "HBO Max subscription BD",
      "buy HBO Max Bangladesh",
      "HBO Max price Bangladesh",
      "HBO Max BD"
    ],
    features: [
      "HBO and Max entertainment",
      "Warner Bros. and DC content",
      "Max Originals",
      "Available subscription options",
      "Bangladesh customer support"
    ],
    faq: [
      [
        "Where can I buy an HBO Max subscription in Bangladesh?",
        "You can view the available HBO Max subscription option on the NEXT LEVEL SUBS product page and select the plan currently offered."
      ],
      [
        "How much is HBO Max in Bangladesh?",
        "The current price is shown on the product page and can vary by the available plan or subscription duration."
      ],
      [
        "Can I buy HBO Max from Bangladesh?",
        "NEXT LEVEL SUBS provides an HBO Max subscription product page for customers in Bangladesh. Availability and plan details are shown on the page."
      ]
    ]
  },

  "netflix-premium": {
    title:
      "Netflix Premium Subscription in Bangladesh | Buy Netflix BD",
    description:
      "Buy a Netflix Premium subscription in Bangladesh from NEXT LEVEL SUBS. View available Netflix plans, subscription options and current product details.",
    intro:
      "Looking for a Netflix Premium subscription in Bangladesh? Explore the available Netflix subscription options from NEXT LEVEL SUBS and view the current product details below.",
    terms: [
      "Netflix subscription Bangladesh",
      "Netflix subscription BD",
      "buy Netflix Bangladesh",
      "Netflix price Bangladesh",
      "Netflix BD"
    ]
  },

  "spotify-premium": {
    title:
      "Spotify Premium Subscription in Bangladesh | Buy Spotify BD",
    description:
      "Buy a Spotify Premium subscription in Bangladesh from NEXT LEVEL SUBS. View available Spotify subscription options and current product details.",
    intro:
      "Looking for Spotify Premium in Bangladesh? Explore the Spotify Premium subscription option from NEXT LEVEL SUBS and view the current product details below.",
    terms: [
      "Spotify Premium Bangladesh",
      "Spotify subscription BD",
      "buy Spotify Premium Bangladesh",
      "Spotify price Bangladesh",
      "Spotify BD"
    ]
  },

  "amazon-prime-video": {
    title:
      "Amazon Prime Video Subscription in Bangladesh | Buy Prime Video BD",
    description:
      "Buy an Amazon Prime Video subscription in Bangladesh from NEXT LEVEL SUBS. View available Prime Video subscription options and current product details.",
    intro:
      "Looking for an Amazon Prime Video subscription in Bangladesh? Explore the available Prime Video option from NEXT LEVEL SUBS and view the current product details below.",
    terms: [
      "Amazon Prime Video Bangladesh",
      "Prime Video subscription BD",
      "buy Prime Video Bangladesh",
      "Prime Video price Bangladesh",
      "Amazon Prime Video BD"
    ]
  }
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

function safeJSON(value) {
  return JSON.stringify(value)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029");
}

function generateSlug(value) {
  return String(value || "")
    .normalize("NFKD")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function buildProductIndex() {
  const index = Object.create(null);

  Object.keys(products).forEach(function (key) {
    index[key.toLowerCase()] = key;

    const generated = generateSlug(products[key].name);

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

const productIndex = buildProductIndex();

function resolveProductKey(value) {
  if (typeof value !== "string") return "";

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

  return productIndex[generateSlug(decoded)] || "";
}

function getProductSlug(req) {
  if (
    req.query &&
    typeof req.query.slug === "string" &&
    req.query.slug.trim()
  ) {
    return resolveProductKey(req.query.slug);
  }

  const pathname = String(req.url || "").split("?")[0];

  const match = pathname.match(
    /^\/product\/([^/]+)\/?$/i
  );

  return match && match[1]
    ? resolveProductKey(match[1])
    : "";
}

function buildSEO(slug, product) {
  const override = seoOverrides[slug] || {};

  const name = product.name;

  const title =
    override.title ||
    product.seoTitle ||
    `${name} Subscription in Bangladesh | Buy ${name} BD`;

  const description =
    override.description ||
    product.seoDescription ||
    `Buy ${name} subscription in Bangladesh from NEXT LEVEL SUBS. View available ${name} plans, subscription options and current product details.`;

  const intro =
    override.intro ||
    product.seoIntro ||
    `Looking for a ${name} subscription in Bangladesh? Explore the available ${name} subscription options from NEXT LEVEL SUBS and view the current product details below.`;

  const terms =
    override.terms ||
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
      "Digital delivery",
      "Online ordering"
    ];

  const faq =
    override.faq ||
    product.faq ||
    [
      [
        `Where can I buy ${name} in Bangladesh?`,
        `You can view the available ${name} subscription option on the NEXT LEVEL SUBS product page.`
      ],
      [
        `How much is ${name} in Bangladesh?`,
        `The current price is shown on the product page and depends on the available plan or subscription duration.`
      ]
    ];

  return {
    slug,
    name,
    category: product.category || "Digital Services",
    title,
    description,
    intro,
    terms,
    features,
    faq
  };
}

function getImageURL(product) {
  let image = product.image || "/assets/logo.png";

  // Social crawlers generally handle JPG/PNG/WebP more consistently
  // than SVG. Use the site logo as a safe fallback.
  if (/\.svg(?:\?|#|$)/i.test(image)) {
    image = "/assets/logo.png";
  }

  return /^https?:\/\//i.test(image)
    ? image
    : `${SITE.domain}${image.startsWith("/") ? "" : "/"}${image}`;
}

function getRelatedProducts(currentSlug, product) {
  const same = Object.keys(products).filter(function (slug) {
    return (
      slug !== currentSlug &&
      products[slug].category === product.category
    );
  });

  const other = Object.keys(products).filter(function (slug) {
    return (
      slug !== currentSlug &&
      same.indexOf(slug) === -1
    );
  });

  return same.concat(other).slice(0, 8);
}

function buildSchemas(
  seo,
  product,
  productURL,
  imageURL
) {
  const graph = [
    {
      "@type": "Organization",
      "@id": `${SITE.domain}/#organization`,
      name: SITE.name,
      url: `${SITE.domain}/`,
      logo: {
        "@type": "ImageObject",
        url: SITE.logo
      }
    },

    {
      "@type": "WebSite",
      "@id": `${SITE.domain}/#website`,
      name: SITE.name,
      url: `${SITE.domain}/`,
      inLanguage: SITE.language,
      publisher: {
        "@id": `${SITE.domain}/#organization`
      }
    },

    {
      "@type": "BreadcrumbList",
      "@id": `${productURL}#breadcrumb`,
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: `${SITE.domain}/`
        },
        {
          "@type": "ListItem",
          position: 2,
          name: seo.category,
          item: `${SITE.domain}/`
        },
        {
          "@type": "ListItem",
          position: 3,
          name: seo.name,
          item: productURL
        }
      ]
    },

    {
      "@type": "Product",
      "@id": `${productURL}#product`,
      name: seo.name,
      description: seo.description,
      image: [imageURL],
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
    }
  ];

  const productSchema = graph[3];

  // IMPORTANT:
  // Do NOT create fake Product offers.
  // Only add offers when the product object actually contains
  // a valid numeric price.
  if (
    typeof product.price === "number" &&
    Number.isFinite(product.price) &&
    product.price > 0
  ) {
    productSchema.offers = {
      "@type": "Offer",
      url: productURL,
      priceCurrency:
        product.currency || SITE.currency,
      price: product.price,
      availability:
        product.availability ||
        "https://schema.org/InStock",

      seller: {
        "@type": "Organization",
        name: SITE.name,
        url: SITE.domain
      }
    };
  }

  return {
    "@context": "https://schema.org",
    "@graph": graph
  };
}

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

  return res.end(`<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="robots" content="noindex, nofollow">
<title>Product Not Found | ${escapeHTML(
    SITE.name
  )}</title>
</head>

<body>
<main>
<h1>Product Not Found</h1>

<p>
The requested product could not be found.
</p>

<a href="${escapeHTML(
    SITE.domain
  )}/">
Return to ${escapeHTML(SITE.name)}
</a>

</main>
</body>
</html>`);
}

// ============================================================
// HANDLER
// ============================================================

module.exports = function handler(req, res) {
  // ----------------------------------------------------------
  // METHOD
  // ----------------------------------------------------------

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

  // ----------------------------------------------------------
  // RESOLVE PRODUCT
  // ----------------------------------------------------------

  const slug = getProductSlug(req);

  if (!slug || !products[slug]) {
    return send404(res);
  }

  const product = products[slug];

  // ----------------------------------------------------------
  // API REQUEST
  // ----------------------------------------------------------

  const pathname = String(req.url || "")
    .split("?")[0];

  const isAPIRequest =
    pathname === "/api/product" ||
    pathname === "/api/product/";

  const productURL =
    `${SITE.domain}/product/${encodeURIComponent(slug)}`;

  // /api/product?slug=netflix-premium
  // →
  // /product/netflix-premium
  if (
    isAPIRequest &&
    req.query &&
    req.query.slug
  ) {
    res.statusCode = 308;

    res.setHeader(
      "Location",
      productURL
    );

    res.setHeader(
      "Cache-Control",
      "public, max-age=300, s-maxage=3600"
    );

    return res.end();
  }

  // ----------------------------------------------------------
  // SEO
  // ----------------------------------------------------------

  const seo = buildSEO(
    slug,
    product
  );

  const imageURL =
    getImageURL(product);

  const destinationURL =
    `${SITE.domain}/details.html?name=${encodeURIComponent(
      product.name
    )}`;

  const relatedProducts =
    getRelatedProducts(
      slug,
      product
    );

  const schemas =
    buildSchemas(
      seo,
      product,
      productURL,
      imageURL
    );

  // ----------------------------------------------------------
  // PRODUCT MAP FOR CLIENT NAVIGATION
  // ----------------------------------------------------------

  const productMap =
    Object.keys(products).reduce(
      function (map, key) {
        map[key] = {
          name: products[key].name
        };

        return map;
      },
      {}
    );

  // ----------------------------------------------------------
  // HEADERS
  // ----------------------------------------------------------

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

  // ----------------------------------------------------------
  // HEAD
  // ----------------------------------------------------------

  if (req.method === "HEAD") {
    return res.end();
  }

  // ----------------------------------------------------------
  // RELATED PRODUCTS
  // ----------------------------------------------------------

  const relatedHTML =
    relatedProducts
      .map(function (relatedSlug) {
        const related =
          products[relatedSlug];

        const href =
          `${SITE.domain}/product/${encodeURIComponent(
            relatedSlug
          )}`;

        return `
<a
  href="${escapeHTML(href)}"
  class="related-product"
>
  ${escapeHTML(related.name)}
</a>`;
      })
      .join("");

  // ----------------------------------------------------------
  // FAQ
  // ----------------------------------------------------------

  const faqHTML =
    seo.faq
      .map(function (item) {
        return `
<details>
  <summary>
    ${escapeHTML(item[0])}
  </summary>

  <p>
    ${escapeHTML(item[1])}
  </p>
</details>`;
      })
      .join("");

  // ----------------------------------------------------------
  // FEATURES
  // ----------------------------------------------------------

  const featureHTML =
    seo.features
      .map(function (feature) {
        return `
<li>
  ${escapeHTML(feature)}
</li>`;
      })
      .join("");

  // ----------------------------------------------------------
  // SEARCH TERMS
  // ----------------------------------------------------------

  const keywordHTML =
    seo.terms
      .map(function (term) {
        return `
<span class="search-term">
  ${escapeHTML(term)}
</span>`;
      })
      .join("");

  // ==========================================================
  // HTML
  // ==========================================================

  const html = `<!doctype html>

<html lang="en-BD">

<head>

<meta charset="UTF-8">

<meta
  name="viewport"
  content="width=device-width, initial-scale=1"
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
  hreflang="en-BD"
  href="${escapeHTML(productURL)}"
>

<link
  rel="alternate"
  hreflang="x-default"
  href="${escapeHTML(productURL)}"
>

<!-- ========================================================
     OPEN GRAPH
     ======================================================== -->

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

<!-- ========================================================
     TWITTER
     ======================================================== -->

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

<!-- ========================================================
     STRUCTURED DATA
     ======================================================== -->

<script type="application/ld+json">${safeJSON(
    schemas
  )}</script>

<style>

html,
body {
  margin: 0;
  padding: 0;
  background: #ffffff;
  color: #111827;

  font-family:
    system-ui,
    -apple-system,
    BlinkMacSystemFont,
    "Segoe UI",
    sans-serif;
}

.seo-content {
  max-width: 1100px;
  margin: auto;
  padding: 28px 20px 20px;
}

h1 {
  font-size: clamp(28px, 4vw, 42px);
  line-height: 1.15;
  margin: 0 0 14px;
}

h2 {
  font-size: 23px;
  margin: 0 0 12px;
}

.seo-intro,
p {
  line-height: 1.7;
}

.seo-section {
  margin-top: 26px;
}

.seo-features {
  padding-left: 22px;
}

.seo-features li {
  margin: 7px 0;
  line-height: 1.6;
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

.related-product {
  display: block;

  padding: 14px;

  border:
    1px solid #e5e7eb;

  border-radius: 10px;

  color: #111827;

  text-decoration: none;

  font-weight: 600;
}

.related-product:hover {
  background: #f9fafb;
}

.search-terms {
  margin-top: 18px;
}

.search-term {
  display: inline-block;

  margin:
    4px 6px
    4px 0;

  padding:
    5px 8px;

  border-radius: 6px;

  background: #f3f4f6;

  font-size: 13px;
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

  .product-frame {
    min-height: 900px;
  }

}

</style>

</head>

<body>

<main>

<section
  class="seo-content"
  aria-labelledby="product-title"
>

<h1 id="product-title">
${escapeHTML(seo.name)}
Subscription in Bangladesh
</h1>

<p class="seo-intro">
${escapeHTML(seo.intro)}
</p>

<section class="seo-section">

<h2>
${escapeHTML(seo.name)}
Subscription
</h2>

<p>
NEXT LEVEL SUBS provides information about the available
${escapeHTML(seo.name)}
subscription option for customers in Bangladesh.
Review the current plan, price and product details below
before ordering.
</p>

</section>

<section class="seo-section">

<h2>
${escapeHTML(seo.name)}
Features
</h2>

<ul class="seo-features">
${featureHTML}
</ul>

</section>

<section class="seo-section">

<h2>
${escapeHTML(seo.name)}
in Bangladesh
</h2>

<p>
This page is intended for customers searching for
${escapeHTML(seo.name)}
subscription information in Bangladesh, including searches
for ${escapeHTML(seo.name)}
BD and ${escapeHTML(seo.name)}
price in Bangladesh.
</p>

</section>

<section
  class="seo-section search-terms"
  aria-label="Related search terms"
>

<h2>
Related Search Terms
</h2>

${keywordHTML}

</section>

<section class="seo-section seo-faq">

<h2>
Frequently Asked Questions
</h2>

${faqHTML}

</section>

<section class="seo-section">

<h2>
Related Subscriptions
</h2>

<nav
  class="related-products"
  aria-label="Related products"
>

${relatedHTML}

</nav>

</section>

</section>

<!-- ========================================================
     EXISTING PRODUCT UI
     ======================================================== -->

<iframe
  id="productFrame"
  class="product-frame"
  src="${escapeHTML(destinationURL)}"
  title="${escapeHTML(seo.name)}"
  loading="eager"
  allow="fullscreen"
></iframe>

</main>

<script>

(function () {

"use strict";

var HOME =
  ${safeJSON(`${SITE.domain}/`)};

var BASE =
  HOME + "product/";

var CURRENT =
  ${safeJSON(slug)};

var FRAME =
  document.getElementById("productFrame");

var MAP =
  ${safeJSON(productMap)};

if (!FRAME) {
  return;
}

function slugify(value) {

  return String(value || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

}

function goHome() {

  if (
    window.top !== window.self
  ) {

    window.top.location.href =
      HOME;

  } else if (
    location.href !== HOME
  ) {

    location.href =
      HOME;

  }

}

function goProduct(slug) {

  if (
    !slug ||
    !MAP[slug] ||
    slug === CURRENT
  ) {

    return;

  }

  window.top.location.href =
    BASE +
    encodeURIComponent(slug);

}

function findByName(value) {

  if (!value) {
    return "";
  }

  var name =
    String(value)
      .trim()
      .toLowerCase();

  try {

    name =
      decodeURIComponent(name);

  } catch (e) {}

  for (
    var key in MAP
  ) {

    if (
      Object.prototype
        .hasOwnProperty
        .call(MAP, key)
    ) {

      if (
        String(MAP[key].name || "")
          .trim()
          .toLowerCase() ===
        name
      ) {

        return key;

      }

    }

  }

  var generated =
    slugify(name);

  return MAP[generated]
    ? generated
    : "";

}

function inspect(url) {

  try {

    var parsed =
      new URL(
        url,
        location.href
      );

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

    var match =
      pathname.match(
        /^\/product\/([^/]+)\/?$/i
      );

    if (match) {

      var productSlug =
        decodeURIComponent(
          match[1]
        ).toLowerCase();

      if (
        MAP[productSlug] &&
        productSlug !== CURRENT
      ) {

        goProduct(
          productSlug
        );

      }

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

      var found =
        findByName(name);

      if (
        found &&
        found !== CURRENT
      ) {

        goProduct(found);

      }

    }

  } catch (e) {}

}

window.addEventListener(
  "message",
  function (event) {

    var data =
      event.data || {};

    if (
      data.type ===
      "NLS_GO_HOME"
    ) {

      goHome();

      return;

    }

    if (
      data.type ===
      "NLS_NAVIGATE_PRODUCT"
    ) {

      var slug =
        data.productSlug &&
        MAP[data.productSlug]
          ? data.productSlug
          : findByName(
              data.productSlug ||
              data.productName
            );

      if (slug) {
        goProduct(slug);
      }

    }

  }
);

FRAME.addEventListener(
  "load",
  function () {

    try {

      var doc =
        FRAME.contentWindow.document;

      doc.addEventListener(
        "click",
        function (event) {

          var target =
            event.target;

          var anchor =
            target &&
            target.closest
              ? target.closest("a")
              : null;

          if (anchor) {

            var href =
              anchor.getAttribute(
                "href"
              ) || "";

            try {

              var parsed =
                new URL(
                  href,
                  FRAME
                    .contentWindow
                    .location
                    .href
                );

              var pathname =
                parsed.pathname
                  .toLowerCase();

              if (
                pathname === "/" ||
                pathname === "/index.html"
              ) {

                event.preventDefault();

                goHome();

                return;

              }

              var match =
                pathname.match(
                  /^\/product\/([^/]+)\/?$/i
                );

              if (match) {

                var productSlug =
                  decodeURIComponent(
                    match[1]
                  ).toLowerCase();

                if (
                  MAP[productSlug]
                ) {

                  event.preventDefault();

                  goProduct(
                    productSlug
                  );

                  return;

                }

              }

              var name =
                parsed.searchParams.get(
                  "name"
                );

              if (name) {

                var found =
                  findByName(name);

                if (found) {

                  event.preventDefault();

                  goProduct(found);

                  return;

                }

              }

            } catch (error) {}

          }

          var button =
            target &&
            target.closest
              ? target.closest(
                  "button,[role='button'],.back-btn,.home-btn"
                )
              : null;

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
                "return home"
              ) !== -1 ||
              text.indexOf(
                "go home"
              ) !== -1
            ) {

              event.preventDefault();

              goHome();

            }

          }

        },
        true
      );

    } catch (error) {}

  }
);

setTimeout(
  function () {

    try {

      inspect(
        FRAME
          .contentWindow
          .location
          .href
      );

    } catch (e) {}

  },
  800
);

setInterval(
  function () {

    try {

      inspect(
        FRAME
          .contentWindow
          .location
          .href
      );

    } catch (e) {}

  },
  1000
);

})();

</script>

</body>

</html>`;

  return res.end(html);
};