// ============================================================
// NEXT LEVEL SUBS
// CLEAN PRODUCT URL MIDDLEWARE
// ============================================================
//
// Public URL:
//
// https://www.nextlevelsubs.com/product/netflix-premium
//
// Normal visitors:
//   /product/netflix-premium
//       ↓ internal rewrite
//   /details.html?name=Netflix%20Premium
//
// Social crawlers:
//   /product/netflix-premium
//       ↓ internal rewrite
//   /api/product?slug=netflix-premium
//
// The browser URL NEVER changes.
// ============================================================

import { NextResponse } from "next/server";

// ============================================================
// PRODUCT NAME MAP
// ============================================================

const products = {

  "netflix-premium": "Netflix Premium",
  "amazon-prime-video": "Amazon Prime Video",
  "hbo-max": "HBO Max",
  "crunchy-roll-mega": "Crunchy Roll Mega",
  "netflix-for-tv": "Netflix For TV",
  "chorki-premium": "Chorki Premium",
  "hoichoi-premium": "Hoichoi Premium",
  "bongo": "Bongo",
  "disney-plus": "Disney+",
  "hulu": "Hulu",
  "apple-tv-plus": "Apple TV+",
  "paramount-plus": "Paramount+",
  "peacock": "Peacock",
  "youtube-premium": "YouTube Premium",
  "youtube-premium-non-renewable": "Youtube Premium Non-Renewable",
  "discovery-plus": "Discovery+",
  "shudder-premium": "Shudder Premium",
  "prime-video-full": "Prime Video Full",
  "amc-plus": "AMC+",
  "fubo-tv": "Fubo TV",
  "ullu-pro": "Ullu Pro",
  "sling-tv": "Sling TV",

  "spotify-premium": "Spotify Premium",
  "amazon-music-unlimited": "Amazon Music Unlimited",
  "apple-music": "Apple Music",
  "tidal": "Tidal",
  "pandora-premium": "Pandora Premium",
  "soundcloud-go-plus": "SoundCloud Go+",
  "deezer-hifi": "Deezer HiFi",

  "microsoft-onedrive": "Microsoft OneDrive",
  "dropbox-plus": "Dropbox Plus",
  "google-drive": "Google Drive",
  "icloud-plus": "iCloud+",
  "amazon-drive": "Amazon Drive",

  "expressvpn": "ExpressVPN",
  "nordvpn": "NordVPN",
  "surfshark": "Surfshark",
  "cyberghost": "CyberGhost",
  "ipvanish": "IPVanish",
  "private-internet-access": "Private Internet Access",
  "hotspot-shield": "Hotspot Shield",
  "vypr-vpn": "Vypr VPN",

  "canva-pro": "Canva Pro",
  "photoroom-pro": "Photoroom Pro",
  "picsart-premium": "Picsart Premium",
  "photoroom-max": "Photoroom Max",
  "blackbox-ai-chatgpt5": "Black Box Ai (CHAT-GPT5)",
  "gemini-ai": "Gemini Ai",
  "chat-gpt": "Chat GPT",
  "perplexity-chatgpt5": "Perplexity (ChatGPT-5)",
  "remini-ai": "Remini Ai",

  "netflix-prime-video": "Netflix + Prime Video",
  "netflix-hbo-max": "Netflix + HBO Max",
  "prime-video-hbo-max": "Prime Video + HBO Max",
  "hbo-max-surfshark-vpn": "HBO Max + Surfshark VPN",
  "spotify-youtube-premium": "Spotify + YouTube Premium",
  "disney-hbo-max": "Disney + HBO Max",
  "disney-nord-vpn": "Disney + Nord VPN",
  "music-storage": "Music & Storage",
  "security-bundle": "Security Bundle",
  "ultimate-entertainment": "Ultimate Entertainment",

  "doulingo": "Doulingo",
  "skillshare": "Skillshare",
  "linkedin-premium": "LinkedIn Premium",
  "numerade": "Numerade",
  "grammarly-pro": "Grammarly Pro",

  "digital-playground": "Digital Playground",
  "pornhub-premium": "Pornhub Premium",
  "brazzers": "Brazzers",
  "spice-vids": "Spice Vids",
  "reality-kings": "Reality Kings",
  "bang-bros": "Bang Bros",
  "babes-com": "Babes.com",

  "truecaller-gold": "True Caller Gold"
};

// ============================================================
// SOCIAL CRAWLERS
// ============================================================

function isSocialCrawler(userAgent) {

  if (!userAgent) {
    return false;
  }

  const ua = userAgent.toLowerCase();

  const crawlers = [
    "facebookexternalhit",
    "facebot",
    "facebookcatalog",
    "whatsapp",
    "twitterbot",
    "linkedinbot",
    "pinterest",
    "slackbot",
    "discordbot",
    "telegrambot",
    "skypeuripreview",
    "google-inspectiontool",
    "googlebot",
    "bingbot",
    "yandexbot",
    "duckduckbot",
    "applebot",
    "embedly",
    "quora link preview",
    "redditbot"
  ];

  return crawlers.some(bot => ua.includes(bot));
}

// ============================================================
// MIDDLEWARE
// ============================================================

export function middleware(request) {

  const url = request.nextUrl;

  // Only process:
  //
  // /product/example
  //
  if (!url.pathname.startsWith("/product/")) {
    return NextResponse.next();
  }

  // Extract slug
  const slug = url.pathname
    .replace(/^\/product\//, "")
    .replace(/\/$/, "")
    .toLowerCase();

  // Validate product
  const productName = products[slug];

  if (!productName) {
    return NextResponse.next();
  }

  // ----------------------------------------------------------
  // SOCIAL MEDIA / SEARCH CRAWLER
  // ----------------------------------------------------------

  if (
    isSocialCrawler(
      request.headers.get("user-agent") || ""
    )
  ) {

    const apiURL = new URL(
      "/api/product",
      request.url
    );

    apiURL.searchParams.set(
      "slug",
      slug
    );

    return NextResponse.rewrite(apiURL);
  }

  // ----------------------------------------------------------
  // NORMAL HUMAN VISITOR
  // ----------------------------------------------------------

  const detailsURL = new URL(
    "/details.html",
    request.url
  );

  detailsURL.searchParams.set(
    "name",
    productName
  );

  // IMPORTANT:
  //
  // This is an INTERNAL REWRITE.
  //
  // The browser remains:
  //
  // /product/netflix-premium
  //
  // It does NOT become:
  //
  // /details.html?name=Netflix%20Premium
  //

  return NextResponse.rewrite(detailsURL);
}

// ============================================================
// MATCHER
// ============================================================

export const config = {
  matcher: [
    "/product/:path*"
  ]
};