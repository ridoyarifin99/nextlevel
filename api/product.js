// ============================================================
// NEXT LEVEL SUBS
// PRODUCTION HYBRID PRODUCT SEO HANDLER
// ============================================================
//
// Canonical product URLs:
//
// https://www.nextlevelsubs.com/product/netflix-premium
// https://www.nextlevelsubs.com/product/spotify-premium
// https://www.nextlevelsubs.com/product/hbo-max
//
// ARCHITECTURE
// ------------------------------------------------------------
// 1. Server-render real SEO/product content.
// 2. Generate title + description + canonical.
// 3. Generate Open Graph / Twitter metadata.
// 4. Generate Product JSON-LD.
// 5. Generate BreadcrumbList JSON-LD.
// 6. Generate Organization + WebSite JSON-LD.
// 7. Generate crawlable internal product links.
// 8. Keep existing details.html as shopping UI.
// 9. Preserve /product/{slug} in browser.
// 10. Handle all products through one production handler.
//
// IMPORTANT
// ------------------------------------------------------------
// This file intentionally does NOT depend on details.html
// for the primary SEO content.
//
// details.html remains the customer-facing interface.
// The product wrapper is now a real HTML page first.
//
// ============================================================

"use strict";

// ============================================================
// SITE CONFIGURATION
// ============================================================

const SITE = {
    name: "NEXT LEVEL SUBS",
    domain: "https://www.nextlevelsubs.com",
    locale: "en_US",
    language: "en",
    country: "BD",
    countryName: "Bangladesh",

    defaultDescription:
        "Premium subscriptions, streaming services, VPNs, AI tools, cloud storage and digital services from NEXT LEVEL SUBS in Bangladesh.",

    organizationDescription:
        "NEXT LEVEL SUBS provides digital subscriptions and premium online services for customers in Bangladesh."
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
        shortName: "Netflix",
        description:
            "Watch movies, TV shows, series and Netflix Originals with a Netflix Premium subscription.",
        image: "/assets/cards/netflix.webp",
        category: "Streaming",
        keywords: [
            "Netflix Premium subscription",
            "Netflix subscription Bangladesh",
            "Netflix Premium Bangladesh"
        ]
    },

    "amazon-prime-video": {
        name: "Amazon Prime Video",
        shortName: "Prime Video",
        description:
            "Stream movies, TV shows, Amazon Originals and exclusive entertainment with Prime Video.",
        image: "/assets/cards/prime_video.svg",
        category: "Streaming",
        keywords: [
            "Prime Video subscription",
            "Amazon Prime Video Bangladesh",
            "Prime Video subscription Bangladesh"
        ]
    },

    "hbo-max": {
        name: "HBO Max",
        shortName: "HBO Max",
        description:
            "Stream HBO, Warner Bros., DC, Max Originals, movies and premium entertainment with an HBO Max subscription.",
        image: "/assets/cards/hbomax.jpg",
        category: "Streaming",
        keywords: [
            "HBO Max subscription",
            "HBO Max Bangladesh",
            "HBO Max subscription Bangladesh",
            "Max subscription Bangladesh"
        ]
    },

    "crunchy-roll-mega": {
        name: "Crunchy Roll Mega",
        shortName: "Crunchyroll",
        description:
            "Watch anime, popular series and exclusive anime content with a Crunchy Roll Mega subscription.",
        image: "/assets/cards/crunchy.png",
        category: "Streaming",
        keywords: [
            "Crunchyroll subscription",
            "Crunchyroll Bangladesh",
            "anime subscription Bangladesh"
        ]
    },

    "netflix-for-tv": {
        name: "Netflix For TV",
        shortName: "Netflix For TV",
        description:
            "Enjoy Netflix movies and TV shows on compatible television devices with a Netflix For TV subscription.",
        image: "/assets/cards/netflixfortv.webp",
        category: "Streaming",
        keywords: [
            "Netflix for TV",
            "Netflix TV subscription",
            "Netflix TV Bangladesh"
        ]
    },

    "chorki-premium": {
        name: "Chorki Premium",
        shortName: "Chorki",
        description:
            "Watch Bangla movies, series, originals and entertainment with Chorki Premium.",
        image: "/assets/cards/chorki.webp",
        category: "Streaming",
        keywords: [
            "Chorki Premium",
            "Chorki subscription Bangladesh",
            "Chorki Premium Bangladesh"
        ]
    },

    "hoichoi-premium": {
        name: "Hoichoi Premium",
        shortName: "Hoichoi",
        description:
            "Enjoy Bangla movies, web series and original entertainment with Hoichoi Premium.",
        image: "/assets/cards/hoichoi.png",
        category: "Streaming",
        keywords: [
            "Hoichoi Premium",
            "Hoichoi subscription Bangladesh",
            "Hoichoi Premium Bangladesh"
        ]
    },

    "bongo": {
        name: "Bongo",
        shortName: "Bongo",
        description:
            "Watch Bangla movies, dramas, series and entertainment through Bongo.",
        image: "/assets/cards/bongo.png",
        category: "Streaming",
        keywords: [
            "Bongo subscription",
            "Bongo Bangladesh",
            "Bongo premium Bangladesh"
        ]
    },

    "disney-plus": {
        name: "Disney+",
        shortName: "Disney+",
        description:
            "Stream Disney movies, series and exclusive entertainment with Disney+.",
        image: "/assets/cards/disney.jpg",
        category: "Streaming",
        keywords: [
            "Disney Plus subscription",
            "Disney Plus Bangladesh",
            "Disney+ subscription Bangladesh"
        ]
    },

    "hulu": {
        name: "Hulu",
        shortName: "Hulu",
        description:
            "Watch TV shows, movies and Hulu Originals with a Hulu subscription.",
        image: "/assets/cards/hulu.svg",
        category: "Streaming",
        keywords: [
            "Hulu subscription",
            "Hulu Bangladesh",
            "Hulu subscription Bangladesh"
        ]
    },

    "apple-tv-plus": {
        name: "Apple TV+",
        shortName: "Apple TV+",
        description:
            "Watch Apple Original series, movies and exclusive entertainment with Apple TV+.",
        image: "/assets/cards/apple_tv.jpg",
        category: "Streaming",
        keywords: [
            "Apple TV Plus subscription",
            "Apple TV+ Bangladesh",
            "Apple TV Plus Bangladesh"
        ]
    },

    "paramount-plus": {
        name: "Paramount+",
        shortName: "Paramount+",
        description:
            "Stream movies, series, live sports and Paramount+ Originals.",
        image: "/assets/cards/paramount.webp",
        category: "Streaming",
        keywords: [
            "Paramount Plus subscription",
            "Paramount+ Bangladesh",
            "Paramount Plus Bangladesh"
        ]
    },

    "peacock": {
        name: "Peacock",
        shortName: "Peacock",
        description:
            "Stream NBCUniversal entertainment, movies, series and live sports with Peacock.",
        image: "/assets/cards/Peacock.avif",
        category: "Streaming",
        keywords: [
            "Peacock subscription",
            "Peacock Bangladesh",
            "Peacock subscription Bangladesh"
        ]
    },

    "youtube-premium": {
        name: "YouTube Premium",
        shortName: "YouTube Premium",
        description:
            "Enjoy ad-free YouTube videos, YouTube Music and premium viewing features.",
        image: "/assets/cards/youtube.webp",
        category: "Streaming",
        keywords: [
            "YouTube Premium subscription",
            "YouTube Premium Bangladesh",
            "YouTube Premium subscription Bangladesh"
        ]
    },

    "youtube-premium-non-renewable": {
        name: "YouTube Premium Non-Renewable",
        shortName: "YouTube Premium Non-Renewable",
        description:
            "Enjoy ad-free YouTube videos and music with a non-renewable YouTube Premium subscription.",
        image: "/assets/cards/youtube.webp",
        category: "Streaming",
        keywords: [
            "YouTube Premium non renewable",
            "YouTube Premium Bangladesh",
            "YouTube Premium subscription"
        ]
    },

    "discovery-plus": {
        name: "Discovery+",
        shortName: "Discovery+",
        description:
            "Watch documentaries, reality shows, lifestyle programming and entertainment with Discovery+.",
        image: "/assets/cards/discovery.webp",
        category: "Streaming",
        keywords: [
            "Discovery Plus subscription",
            "Discovery+ Bangladesh",
            "Discovery Plus Bangladesh"
        ]
    },

    "shudder-premium": {
        name: "Shudder Premium",
        shortName: "Shudder",
        description:
            "Stream horror, thriller and suspense movies and series with Shudder Premium.",
        image: "/assets/cards/shudder.jpg",
        category: "Streaming",
        keywords: [
            "Shudder Premium",
            "Shudder subscription Bangladesh",
            "Shudder Bangladesh"
        ]
    },

    "prime-video-full": {
        name: "Prime Video Full",
        shortName: "Prime Video Full",
        description:
            "Watch movies, series and Amazon Originals with Prime Video Full.",
        image: "/assets/cards/primefull.webp",
        category: "Streaming",
        keywords: [
            "Prime Video Full",
            "Prime Video subscription Bangladesh",
            "Amazon Prime Video Bangladesh"
        ]
    },

    "amc-plus": {
        name: "AMC+",
        shortName: "AMC+",
        description:
            "Stream AMC+ movies, series, horror, thriller and premium entertainment.",
        image: "/assets/cards/amc+.webp",
        category: "Streaming",
        keywords: [
            "AMC Plus subscription",
            "AMC+ Bangladesh",
            "AMC Plus Bangladesh"
        ]
    },

    "fubo-tv": {
        name: "Fubo TV",
        shortName: "FuboTV",
        description:
            "Watch live sports, television channels and entertainment with Fubo TV.",
        image: "/assets/cards/fuboTV.webp",
        category: "Streaming",
        keywords: [
            "Fubo TV subscription",
            "FuboTV Bangladesh",
            "Fubo subscription Bangladesh"
        ]
    },

    "ullu-pro": {
        name: "Ullu Pro",
        shortName: "Ullu Pro",
        description:
            "Access premium Ullu web series and entertainment with Ullu Pro.",
        image: "/assets/cards/ullu.png",
        category: "Streaming",
        keywords: [
            "Ullu Pro",
            "Ullu subscription Bangladesh",
            "Ullu Pro Bangladesh"
        ]
    },

    "sling-tv": {
        name: "Sling TV",
        shortName: "Sling TV",
        description:
            "Watch live television, channels and streaming entertainment with Sling TV.",
        image: "/assets/cards/slingtv.png",
        category: "Streaming",
        keywords: [
            "Sling TV subscription",
            "Sling TV Bangladesh",
            "Sling subscription Bangladesh"
        ]
    },

    // ========================================================
    // MUSIC
    // ========================================================

    "spotify-premium": {
        name: "Spotify Premium",
        shortName: "Spotify",
        description:
            "Listen to music and podcasts without ads and enjoy premium Spotify features.",
        image: "/assets/cards/spotify.jpg",
        category: "Music",
        keywords: [
            "Spotify Premium subscription",
            "Spotify Premium Bangladesh",
            "Spotify subscription Bangladesh"
        ]
    },

    "amazon-music-unlimited": {
        name: "Amazon Music Unlimited",
        shortName: "Amazon Music",
        description:
            "Stream high-quality music and podcasts with Amazon Music Unlimited.",
        image: "/assets/cards/amazon-music-unlimited.jpeg",
        category: "Music",
        keywords: [
            "Amazon Music Unlimited",
            "Amazon Music Bangladesh",
            "Amazon Music subscription Bangladesh"
        ]
    },

    "apple-music": {
        name: "Apple Music",
        shortName: "Apple Music",
        description:
            "Stream millions of songs, playlists and Apple Music content.",
        image: "/assets/cards/apple_music.jpg",
        category: "Music",
        keywords: [
            "Apple Music subscription",
            "Apple Music Bangladesh",
            "Apple Music subscription Bangladesh"
        ]
    },

    "tidal": {
        name: "Tidal",
        shortName: "Tidal",
        description:
            "Enjoy high-fidelity music streaming with Tidal.",
        image: "/assets/cards/tidal.svg",
        category: "Music",
        keywords: [
            "Tidal subscription",
            "Tidal Bangladesh",
            "Tidal subscription Bangladesh"
        ]
    },

    "pandora-premium": {
        name: "Pandora Premium",
        shortName: "Pandora Premium",
        description:
            "Enjoy personalized music and podcasts with Pandora Premium.",
        image: "/assets/cards/pandora.svg",
        category: "Music",
        keywords: [
            "Pandora Premium",
            "Pandora subscription Bangladesh",
            "Pandora Bangladesh"
        ]
    },

    "soundcloud-go-plus": {
        name: "SoundCloud Go+",
        shortName: "SoundCloud Go+",
        description:
            "Listen to music without ads and enjoy offline listening with SoundCloud Go+.",
        image: "/assets/cards/sound_cloud.svg",
        category: "Music",
        keywords: [
            "SoundCloud Go Plus",
            "SoundCloud subscription Bangladesh",
            "SoundCloud Go+ Bangladesh"
        ]
    },

    "deezer-hifi": {
        name: "Deezer HiFi",
        shortName: "Deezer HiFi",
        description:
            "Stream high-quality audio and music with Deezer HiFi.",
        image: "/assets/cards/deezer.svg",
        category: "Music",
        keywords: [
            "Deezer HiFi",
            "Deezer subscription Bangladesh",
            "Deezer Bangladesh"
        ]
    },

    // ========================================================
    // CLOUD STORAGE
    // ========================================================

    "microsoft-onedrive": {
        name: "Microsoft OneDrive",
        shortName: "OneDrive",
        description:
            "Get cloud storage and access to your files with Microsoft OneDrive.",
        image: "/assets/cards/onedrive.svg",
        category: "Cloud Storage",
        keywords: [
            "OneDrive subscription",
            "OneDrive Bangladesh",
            "OneDrive subscription Bangladesh"
        ]
    },

    "dropbox-plus": {
        name: "Dropbox Plus",
        shortName: "Dropbox Plus",
        description:
            "Store, sync and access your files securely with Dropbox Plus.",
        image: "/assets/cards/Dropbox_(service)-Logo.wine.svg",
        category: "Cloud Storage",
        keywords: [
            "Dropbox Plus",
            "Dropbox subscription Bangladesh",
            "Dropbox Plus Bangladesh"
        ]
    },

    "google-drive": {
        name: "Google Drive",
        shortName: "Google Drive",
        description:
            "Store and access files online with Google Drive cloud storage.",
        image: "/assets/cards/Google_Drive-Logo.wine.svg",
        category: "Cloud Storage",
        keywords: [
            "Google Drive storage",
            "Google Drive Bangladesh",
            "Google Drive subscription Bangladesh"
        ]
    },

    "icloud-plus": {
        name: "iCloud+",
        shortName: "iCloud+",
        description:
            "Get additional iCloud storage and premium iCloud features.",
        image: "/assets/cards/icloud+webp.webp",
        category: "Cloud Storage",
        keywords: [
            "iCloud Plus",
            "iCloud+ Bangladesh",
            "iCloud storage Bangladesh"
        ]
    },

    "amazon-drive": {
        name: "Amazon Drive",
        shortName: "Amazon Drive",
        description:
            "Store and access files online with Amazon Drive cloud storage.",
        image: "/assets/cards/amazon_drive.png",
        category: "Cloud Storage",
        keywords: [
            "Amazon Drive",
            "Amazon Drive Bangladesh",
            "Amazon cloud storage Bangladesh"
        ]
    },

    // ========================================================
    // VPN
    // ========================================================

    "expressvpn": {
        name: "ExpressVPN",
        shortName: "ExpressVPN",
        description:
            "Protect your internet connection and browse privately with ExpressVPN.",
        image: "/assets/cards/expressVPN.png",
        category: "VPN",
        keywords: [
            "ExpressVPN subscription",
            "ExpressVPN Bangladesh",
            "ExpressVPN subscription Bangladesh"
        ]
    },

    "nordvpn": {
        name: "NordVPN",
        shortName: "NordVPN",
        description:
            "Protect your connection and access advanced VPN security features with NordVPN.",
        image: "/assets/cards/nordvpn.webp",
        category: "VPN",
        keywords: [
            "NordVPN subscription",
            "NordVPN Bangladesh",
            "NordVPN subscription Bangladesh"
        ]
    },

    "surfshark": {
        name: "Surfshark",
        shortName: "Surfshark",
        description:
            "Protect multiple devices with Surfshark VPN and its privacy features.",
        image: "/assets/cards/surfsharkvpn.webp",
        category: "VPN",
        keywords: [
            "Surfshark subscription",
            "Surfshark Bangladesh",
            "Surfshark subscription Bangladesh"
        ]
    },

    "cyberghost": {
        name: "CyberGhost",
        shortName: "CyberGhost",
        description:
            "Use a user-friendly VPN service with CyberGhost.",
        image: "/assets/cards/cyberghost.png",
        category: "VPN",
        keywords: [
            "CyberGhost subscription",
            "CyberGhost Bangladesh",
            "CyberGhost VPN Bangladesh"
        ]
    },

    "ipvanish": {
        name: "IPVanish",
        shortName: "IPVanish",
        description:
            "Protect your internet connection with IPVanish VPN.",
        image: "/assets/cards/ipvanish.webp",
        category: "VPN",
        keywords: [
            "IPVanish subscription",
            "IPVanish Bangladesh",
            "IPVanish VPN Bangladesh"
        ]
    },

    "private-internet-access": {
        name: "Private Internet Access",
        shortName: "PIA VPN",
        description:
            "Use a customizable VPN service with Private Internet Access.",
        image: "/assets/cards/pia.png",
        category: "VPN",
        keywords: [
            "Private Internet Access subscription",
            "PIA VPN Bangladesh",
            "PIA VPN subscription Bangladesh"
        ]
    },

    "hotspot-shield": {
        name: "Hotspot Shield",
        shortName: "Hotspot Shield",
        description:
            "Protect your connection and browse privately with Hotspot Shield VPN.",
        image: "/assets/cards/Hotspot-Shield-vpn.webp",
        category: "VPN",
        keywords: [
            "Hotspot Shield subscription",
            "Hotspot Shield Bangladesh",
            "Hotspot Shield VPN Bangladesh"
        ]
    },

    "vypr-vpn": {
        name: "Vypr VPN",
        shortName: "VyprVPN",
        description:
            "Use secure VPN connections with Vypr VPN.",
        image: "/assets/cards/vyprvpn.webp",
        category: "VPN",
        keywords: [
            "VyprVPN subscription",
            "VyprVPN Bangladesh",
            "Vypr VPN Bangladesh"
        ]
    },

    // ========================================================
    // AI & DESIGN
    // ========================================================

    "canva-pro": {
        name: "Canva Pro",
        shortName: "Canva Pro",
        description:
            "Create professional designs, presentations, graphics and visual content with Canva Pro.",
        image: "/assets/cards/canva.png",
        category: "AI & Design",
        keywords: [
            "Canva Pro subscription",
            "Canva Pro Bangladesh",
            "Canva Pro subscription Bangladesh"
        ]
    },

    "photoroom-pro": {
        name: "Photoroom Pro",
        shortName: "Photoroom Pro",
        description:
            "Use professional AI-powered photo editing and design tools with Photoroom Pro.",
        image: "/assets/cards/photoroom.jpg",
        category: "AI & Design",
        keywords: [
            "Photoroom Pro",
            "Photoroom subscription Bangladesh",
            "Photoroom Pro Bangladesh"
        ]
    },

    "picsart-premium": {
        name: "Picsart Premium",
        shortName: "Picsart Premium",
        description:
            "Create and edit photos and videos with Picsart Premium.",
        image: "/assets/cards/picsart.png",
        category: "AI & Design",
        keywords: [
            "Picsart Premium",
            "Picsart subscription Bangladesh",
            "Picsart Premium Bangladesh"
        ]
    },

    "photoroom-max": {
        name: "Photoroom Max",
        shortName: "Photoroom Max",
        description:
            "Access advanced AI photo editing and creative tools with Photoroom Max.",
        image: "/assets/cards/photoroom.jpg",
        category: "AI & Design",
        keywords: [
            "Photoroom Max",
            "Photoroom Max Bangladesh",
            "Photoroom subscription Bangladesh"
        ]
    },

    "blackbox-ai-chatgpt5": {
        name: "Black Box Ai (CHAT-GPT5)",
        shortName: "BlackBox AI",
        description:
            "Use an AI-powered coding and development assistant with Black Box AI.",
        image: "/assets/cards/blackboxai.jpg",
        category: "AI & Design",
        keywords: [
            "BlackBox AI subscription",
            "BlackBox AI Bangladesh",
            "AI coding assistant Bangladesh"
        ]
    },

    "gemini-ai": {
        name: "Gemini Ai",
        shortName: "Gemini AI",
        description:
            "Use Google's AI assistant for research, writing, productivity and everyday tasks.",
        image: "/assets/cards/gemini.png",
        category: "AI & Design",
        keywords: [
            "Gemini AI subscription",
            "Gemini AI Bangladesh",
            "Gemini subscription Bangladesh"
        ]
    },

    "chat-gpt": {
        name: "Chat GPT",
        shortName: "ChatGPT",
        description:
            "Use an advanced AI assistant for writing, research, productivity and everyday tasks.",
        image: "/assets/cards/chatgpt.jpg",
        category: "AI & Design",
        keywords: [
            "ChatGPT subscription",
            "ChatGPT Bangladesh",
            "ChatGPT subscription Bangladesh"
        ]
    },

    "perplexity-chatgpt5": {
        name: "Perplexity (ChatGPT-5)",
        shortName: "Perplexity",
        description:
            "Use AI-powered search and research tools with Perplexity.",
        image: "/assets/cards/Perplexity.svg",
        category: "AI & Design",
        keywords: [
            "Perplexity subscription",
            "Perplexity Bangladesh",
            "Perplexity AI subscription Bangladesh"
        ]
    },

    "remini-ai": {
        name: "Remini Ai",
        shortName: "Remini AI",
        description:
            "Enhance and restore photos with AI-powered Remini tools.",
        image: "/assets/cards/remini.avif",
        category: "AI & Design",
        keywords: [
            "Remini AI subscription",
            "Remini Bangladesh",
            "Remini Pro Bangladesh"
        ]
    },

    // ========================================================
    // COMBOS
    // ========================================================

    "netflix-prime-video": {
        name: "Netflix + Prime Video",
        shortName: "Netflix + Prime Video",
        description:
            "Get Netflix and Prime Video together through a combined streaming package.",
        image: "/assets/cards/Netflix-vs-Amazon.jpg",
        category: "Combo",
        keywords: [
            "Netflix Prime Video combo",
            "Netflix Prime Video Bangladesh",
            "Netflix and Prime Video subscription"
        ]
    },

    "netflix-hbo-max": {
        name: "Netflix + HBO Max",
        shortName: "Netflix + HBO Max",
        description:
            "Get Netflix and HBO Max together through a combined premium entertainment package.",
        image: "/assets/cards/netflix+hbomax.webp",
        category: "Combo",
        keywords: [
            "Netflix HBO Max combo",
            "Netflix HBO Max Bangladesh",
            "Netflix and HBO Max subscription"
        ]
    },

    "prime-video-hbo-max": {
        name: "Prime Video + HBO Max",
        shortName: "Prime Video + HBO Max",
        description:
            "Combine Prime Video and HBO Max for premium streaming entertainment.",
        image: "/assets/cards/prime+hbo.webp",
        category: "Combo",
        keywords: [
            "Prime Video HBO Max combo",
            "Prime Video HBO Max Bangladesh",
            "Prime Video and HBO Max"
        ]
    },

    "hbo-max-surfshark-vpn": {
        name: "HBO Max + Surfshark VPN",
        shortName: "HBO Max + Surfshark VPN",
        description:
            "Combine HBO Max entertainment with Surfshark VPN protection.",
        image: "/assets/cards/hbo+surfshark.webp",
        category: "Combo",
        keywords: [
            "HBO Max Surfshark combo",
            "HBO Max VPN Bangladesh",
            "HBO Max Surfshark Bangladesh"
        ]
    },

    "spotify-youtube-premium": {
        name: "Spotify + YouTube Premium",
        shortName: "Spotify + YouTube Premium",
        description:
            "Combine Spotify Premium music with YouTube Premium ad-free entertainment.",
        image: "/assets/cards/spotify+youtube.webp",
        category: "Combo",
        keywords: [
            "Spotify YouTube Premium combo",
            "Spotify YouTube Premium Bangladesh",
            "Spotify and YouTube Premium"
        ]
    },

    "disney-hbo-max": {
        name: "Disney + HBO Max",
        shortName: "Disney + HBO Max",
        description:
            "Combine Disney+ and HBO Max premium entertainment.",
        image: "/assets/cards/disney+nordVPN.webp",
        category: "Combo",
        keywords: [
            "Disney HBO Max combo",
            "Disney HBO Max Bangladesh",
            "Disney and HBO Max subscription"
        ]
    },

    "disney-nord-vpn": {
        name: "Disney + Nord VPN",
        shortName: "Disney + NordVPN",
        description:
            "Combine Disney+ entertainment with NordVPN protection.",
        image: "/assets/cards/disney+nordVPN.webp",
        category: "Combo",
        keywords: [
            "Disney NordVPN combo",
            "Disney NordVPN Bangladesh",
            "Disney VPN subscription"
        ]
    },

    "music-storage": {
        name: "Music & Storage",
        shortName: "Music & Storage",
        description:
            "Combine music streaming with cloud storage in one package.",
        image: "/assets/cards/amazon+onedrive.png",
        category: "Combo",
        keywords: [
            "music storage combo",
            "music cloud storage Bangladesh",
            "Amazon Music OneDrive"
        ]
    },

    "security-bundle": {
        name: "Security Bundle",
        shortName: "Security Bundle",
        description:
            "Combine VPN protection with cloud storage through the Security Bundle.",
        image: "/assets/cards/expressvpn+onedrive.webp",
        category: "Combo",
        keywords: [
            "security bundle VPN storage",
            "VPN cloud storage Bangladesh",
            "ExpressVPN OneDrive bundle"
        ]
    },

    "ultimate-entertainment": {
        name: "Ultimate Entertainment",
        shortName: "Ultimate Entertainment",
        description:
            "Combine Netflix, HBO Max and ExpressVPN in one entertainment bundle.",
        image: "/assets/cards/netflix_expressvpn_hbomax.webp",
        category: "Combo",
        keywords: [
            "ultimate entertainment bundle",
            "Netflix HBO Max ExpressVPN",
            "streaming VPN bundle Bangladesh"
        ]
    },

    // ========================================================
    // EDUCATION
    // ========================================================

    "doulingo": {
        name: "Doulingo",
        shortName: "Duolingo",
        description:
            "Learn languages with interactive lessons and language-learning exercises.",
        image: "/assets/cards/doulingo.png",
        category: "Education",
        keywords: [
            "Duolingo subscription",
            "Duolingo Bangladesh",
            "Duolingo Premium Bangladesh"
        ]
    },

    "skillshare": {
        name: "Skillshare",
        shortName: "Skillshare",
        description:
            "Access thousands of online creative and professional courses with Skillshare.",
        image: "/assets/cards/skill_share.png",
        category: "Education",
        keywords: [
            "Skillshare subscription",
            "Skillshare Bangladesh",
            "Skillshare Premium Bangladesh"
        ]
    },

    "linkedin-premium": {
        name: "LinkedIn Premium",
        shortName: "LinkedIn Premium",
        description:
            "Access professional development, career tools and premium LinkedIn features.",
        image: "/assets/cards/LinkedIn.png",
        category: "Education",
        keywords: [
            "LinkedIn Premium subscription",
            "LinkedIn Premium Bangladesh",
            "LinkedIn Premium Bangladesh subscription"
        ]
    },

    "numerade": {
        name: "Numerade",
        shortName: "Numerade",
        description:
            "Learn through step-by-step educational video solutions with Numerade.",
        image: "/assets/cards/Numerade.jpg",
        category: "Education",
        keywords: [
            "Numerade subscription",
            "Numerade Bangladesh",
            "Numerade Premium Bangladesh"
        ]
    },

    "grammarly-pro": {
        name: "Grammarly Pro",
        shortName: "Grammarly Pro",
        description:
            "Improve writing, grammar and productivity with Grammarly Pro.",
        image: "/assets/cards/grammarly.png",
        category: "Education",
        keywords: [
            "Grammarly Pro subscription",
            "Grammarly Pro Bangladesh",
            "Grammarly subscription Bangladesh"
        ]
    },

    // ========================================================
    // ADULT
    // ========================================================

    "digital-playground": {
        name: "Digital Playground",
        shortName: "Digital Playground",
        description:
            "Access premium entertainment content from Digital Playground.",
        image: "/assets/cards/DigitalPlayground-logo.png",
        category: "Adult",
        keywords: [
            "Digital Playground subscription",
            "Digital Playground Bangladesh"
        ]
    },

    "pornhub-premium": {
        name: "Pornhub Premium",
        shortName: "Pornhub Premium",
        description:
            "Access premium adult entertainment with Pornhub Premium.",
        image: "/assets/cards/pornhub.webp",
        category: "Adult",
        keywords: [
            "Pornhub Premium subscription",
            "Pornhub Premium Bangladesh"
        ]
    },

    "brazzers": {
        name: "Brazzers",
        shortName: "Brazzers",
        description:
            "Access premium adult entertainment through a Brazzers subscription.",
        image: "/assets/cards/brazzers.webp",
        category: "Adult",
        keywords: [
            "Brazzers subscription",
            "Brazzers Bangladesh",
            "Brazzers Premium Bangladesh"
        ]
    },

    "spice-vids": {
        name: "Spice Vids",
        shortName: "Spice Vids",
        description:
            "Access premium adult streaming content with Spice Vids.",
        image: "/assets/cards/spicevids.webp",
        category: "Adult",
        keywords: [
            "Spice Vids subscription",
            "Spice Vids Bangladesh"
        ]
    },

    "reality-kings": {
        name: "Reality Kings",
        shortName: "Reality Kings",
        description:
            "Access premium adult entertainment through Reality Kings.",
        image: "/assets/cards/realitykings.webp",
        category: "Adult",
        keywords: [
            "Reality Kings subscription",
            "Reality Kings Bangladesh"
        ]
    },

    "bang-bros": {
        name: "Bang Bros",
        shortName: "Bang Bros",
        description:
            "Access premium adult entertainment through Bang Bros.",
        image: "/assets/cards/bangbros.webp",
        category: "Adult",
        keywords: [
            "Bang Bros subscription",
            "Bang Bros Bangladesh"
        ]
    },

    "babes-com": {
        name: "Babes.com",
        shortName: "Babes.com",
        description:
            "Access premium adult video entertainment through Babes.com.",
        image: "/assets/cards/babes.webp",
        category: "Adult",
        keywords: [
            "Babes.com subscription",
            "Babes.com Bangladesh"
        ]
    },

    // ========================================================
    // PRODUCTIVITY
    // ========================================================

    "truecaller-gold": {
        name: "True Caller Gold",
        shortName: "Truecaller Gold",
        description:
            "Access premium caller identification and protection features with Truecaller Gold.",
        image: "/assets/cards/truecaller.avif",
        category: "Productivity",
        keywords: [
            "Truecaller Gold subscription",
            "Truecaller Gold Bangladesh",
            "Truecaller Premium Bangladesh"
        ]
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
// PRODUCT INDEX
// ============================================================

function buildProductIndex() {
    const index = Object.create(null);

    Object.keys(products).forEach(function (key) {
        index[key.toLowerCase()] = key;

        const generated = generateSlug(
            products[key].name
        );

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

    const generated = generateSlug(decoded);

    return productIndex[generated] || "";
}

// ============================================================
// GET PRODUCT SLUG
// ============================================================

function getProductSlug(req) {

    // --------------------------------------------------------
    // /api/product?slug=hbo-max
    // --------------------------------------------------------

    if (
        req.query &&
        typeof req.query.slug === "string" &&
        req.query.slug.trim()
    ) {
        const resolved = resolveProductKey(
            req.query.slug
        );

        if (resolved) {
            return resolved;
        }
    }

    // --------------------------------------------------------
    // /product/hbo-max
    // --------------------------------------------------------

    const rawURL = req.url || "";
    const pathname = rawURL.split("?")[0];

    const match = pathname.match(
        /^\/product\/([^/]+)\/?$/i
    );

    if (!match || !match[1]) {
        return "";
    }

    return resolveProductKey(match[1]);
}

// ============================================================
// IMAGE URL
// ============================================================

function buildImageURL(product) {

    let imageURL =
        product.image || "/assets/logo.png";

    // SVG is less reliable for social previews.
    if (/\.svg(?:\?|#|$)/i.test(imageURL)) {
        imageURL = "/assets/logo.png";
    }

    if (!/^https?:\/\//i.test(imageURL)) {
        imageURL =
            SITE.domain +
            (imageURL.startsWith("/")
                ? ""
                : "/") +
            imageURL;
    }

    return imageURL;
}

// ============================================================
// CATEGORY SLUG
// ============================================================

function categorySlug(category) {
    return generateSlug(category);
}

// ============================================================
// PRODUCT URL
// ============================================================

function productURL(slug) {
    return (
        SITE.domain +
        "/product/" +
        encodeURIComponent(slug)
    );
}

// ============================================================
// PRODUCT TITLE
// ============================================================

function buildTitle(product) {
    return (
        product.name +
        " Subscription in Bangladesh | NEXT LEVEL SUBS"
    );
}

// ============================================================
// PRODUCT META DESCRIPTION
// ============================================================

function buildDescription(product) {

    return (
        product.description +
        " Buy or get " +
        product.name +
        " subscription from NEXT LEVEL SUBS in Bangladesh."
    );
}

// ============================================================
// PRODUCT INTRO
// ============================================================

function buildIntro(product) {

    return (
        "Looking for a " +
        product.name +
        " subscription in Bangladesh? " +
        product.description +
        " NEXT LEVEL SUBS offers digital subscription services with plans available through our online store."
    );
}

// ============================================================
// PRODUCT BENEFITS
// ============================================================

function getBenefits(product) {

    const category = product.category;

    if (category === "Streaming") {
        return [
            "Access premium streaming entertainment",
            "Choose an available subscription plan",
            "Use the service on supported devices",
            "Order online from Bangladesh"
        ];
    }

    if (category === "Music") {
        return [
            "Enjoy premium music and audio features",
            "Access supported premium features",
            "Choose an available subscription plan",
            "Order online from Bangladesh"
        ];
    }

    if (category === "VPN") {
        return [
            "Use a premium VPN service",
            "Protect your internet connection",
            "Access supported privacy features",
            "Order online from Bangladesh"
        ];
    }

    if (category === "Cloud Storage") {
        return [
            "Store and access files online",
            "Use supported cloud storage features",
            "Choose an available subscription plan",
            "Order online from Bangladesh"
        ];
    }

    if (category === "AI & Design") {
        return [
            "Access premium AI or creative tools",
            "Use supported productivity features",
            "Choose an available subscription plan",
            "Order online from Bangladesh"
        ];
    }

    if (category === "Education") {
        return [
            "Access premium learning or productivity tools",
            "Use supported educational features",
            "Choose an available subscription plan",
            "Order online from Bangladesh"
        ];
    }

    if (category === "Combo") {
        return [
            "Get multiple services in one package",
            "Choose an available bundle",
            "Use supported services",
            "Order online from Bangladesh"
        ];
    }

    if (category === "Productivity") {
        return [
            "Access premium productivity features",
            "Use supported service features",
            "Choose an available subscription plan",
            "Order online from Bangladesh"
        ];
    }

    return [
        "Access premium service features",
        "Choose an available subscription plan",
        "Use the service on supported devices",
        "Order online from Bangladesh"
    ];
}

// ============================================================
// RELATED PRODUCTS
// ============================================================

function getRelatedProducts(currentSlug, limit) {

    const current = products[currentSlug];

    if (!current) {
        return [];
    }

    const sameCategory = [];
    const otherProducts = [];

    Object.keys(products).forEach(function (slug) {

        if (slug === currentSlug) {
            return;
        }

        if (
            products[slug].category ===
            current.category
        ) {
            sameCategory.push(slug);
        } else {
            otherProducts.push(slug);
        }
    });

    return sameCategory
        .concat(otherProducts)
        .slice(0, limit || 8);
}

// ============================================================
// SEO TEXT
// ============================================================

function buildSEOKeywords(product) {

    const keywords =
        Array.isArray(product.keywords)
            ? product.keywords
            : [];

    return Array.from(
        new Set(
            keywords.concat([
                product.name,
                product.name + " subscription",
                product.name + " Bangladesh"
            ])
        )
    );
}

// ============================================================
// PRODUCT JSON-LD
// ============================================================

function buildProductSchema(
    product,
    slug,
    imageURL,
    description
) {

    return {
        "@context": "https://schema.org",
        "@type": "Product",

        "@id":
            productURL(slug) +
            "#product",

        name: product.name,

        description: description,

        image: [
            imageURL
        ],

        url: productURL(slug),

        category: product.category,

        brand: {
            "@type": "Brand",
            name: SITE.name
        },

        seller: {
            "@type": "Organization",
            name: SITE.name,
            url: SITE.domain
        }
    };
}

// ============================================================
// BREADCRUMB JSON-LD
// ============================================================

function buildBreadcrumbSchema(
    product,
    slug
) {

    const categoryURL =
        SITE.domain +
        "/#" +
        categorySlug(product.category);

    return {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",

        itemListElement: [

            {
                "@type": "ListItem",
                position: 1,
                name: "Home",
                item: SITE.domain + "/"
            },

            {
                "@type": "ListItem",
                position: 2,
                name: product.category,
                item: categoryURL
            },

            {
                "@type": "ListItem",
                position: 3,
                name: product.name,
                item: productURL(slug)
            }
        ]
    };
}

// ============================================================
// ORGANIZATION JSON-LD
// ============================================================

function buildOrganizationSchema() {

    return {
        "@context": "https://schema.org",
        "@type": "Organization",

        "@id":
            SITE.domain +
            "#organization",

        name: SITE.name,

        url: SITE.domain,

        description:
            SITE.organizationDescription
    };
}

// ============================================================
// WEBSITE JSON-LD
// ============================================================

function buildWebsiteSchema() {

    return {
        "@context": "https://schema.org",
        "@type": "WebSite",

        "@id":
            SITE.domain +
            "#website",

        name: SITE.name,

        url: SITE.domain,

        publisher: {
            "@id":
                SITE.domain +
                "#organization"
        }
    };
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

    res.setHeader(
        "Cache-Control",
        "no-store"
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
    <meta
        name="robots"
        content="noindex, nofollow"
    >
</head>

<body>

    <main>
        <h1>Product Not Found</h1>

        <p>
            The requested product could not be found.
        </p>

        <p>
            <a href="${escapeHTML(SITE.domain)}/">
                Return to NEXT LEVEL SUBS
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
    // METHODS
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

    // ========================================================
    // URLS
    // ========================================================

    const canonicalURL =
        productURL(slug);

    const destinationURL =
        SITE.domain +
        "/details.html?name=" +
        encodeURIComponent(
            product.name
        );

    // ========================================================
    // SEO
    // ========================================================

    const title =
        buildTitle(product);

    const description =
        buildDescription(product);

    const intro =
        buildIntro(product);

    const imageURL =
        buildImageURL(product);

    const imageAlt =
        product.name +
        " subscription - NEXT LEVEL SUBS";

    const benefits =
        getBenefits(product);

    const relatedSlugs =
        getRelatedProducts(
            slug,
            8
        );

    const keywords =
        buildSEOKeywords(product);

    // ========================================================
    // STRUCTURED DATA
    // ========================================================

    const productSchema =
        buildProductSchema(
            product,
            slug,
            imageURL,
            description
        );

    const breadcrumbSchema =
        buildBreadcrumbSchema(
            product,
            slug
        );

    const organizationSchema =
        buildOrganizationSchema();

    const websiteSchema =
        buildWebsiteSchema();

    // ========================================================
    // HEADERS
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
        "Referrer-Policy",
        "strict-origin-when-cross-origin"
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
    // PRODUCT MAP FOR FRONTEND
    // ========================================================

    const productMap =
        Object.keys(products).reduce(
            function (map, key) {

                map[key] = {
                    name:
                        products[key].name
                };

                return map;
            },
            {}
        );

    // ========================================================
    // RELATED PRODUCT HTML
    // ========================================================

    const relatedHTML =
        relatedSlugs
            .map(function (relatedSlug) {

                const related =
                    products[relatedSlug];

                return `
                    <li>
                        <a
                            href="${escapeHTML(
                                productURL(relatedSlug)
                            )}"
                        >
                            ${escapeHTML(
                                related.name
                            )}
                        </a>
                    </li>
                `;
            })
            .join("");

    // ========================================================
    // BENEFITS HTML
    // ========================================================

    const benefitsHTML =
        benefits
            .map(function (benefit) {

                return `
                    <li>
                        ${escapeHTML(benefit)}
                    </li>
                `;
            })
            .join("");

    // ========================================================
    // KEYWORD META
    // ========================================================
    //
    // Kept for compatibility.
    // Google does not use meta keywords for ranking.
    //
    // ========================================================

    const keywordMeta =
        keywords
            .slice(0, 12)
            .map(escapeHTML)
            .join(", ");

    // ========================================================
    // HTML
    // ========================================================

    const html = `
<!DOCTYPE html>

<html
    lang="en"
    dir="ltr"
>

<head>

    <meta charset="UTF-8">

    <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0"
    >

    <!-- =====================================================
         PRIMARY SEO
         ===================================================== -->

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

    <meta
        name="googlebot"
        content="index, follow, max-image-preview:large"
    >

    <meta
        name="keywords"
        content="${keywordMeta}"
    >

    <link
        rel="canonical"
        href="${escapeHTML(canonicalURL)}"
    >

    <link
        rel="alternate"
        hreflang="en"
        href="${escapeHTML(canonicalURL)}"
    >

    <link
        rel="alternate"
        hreflang="x-default"
        href="${escapeHTML(canonicalURL)}"
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
        content="${escapeHTML(canonicalURL)}"
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
        content="image/jpeg"
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
         SEO PAGE CSS
         ===================================================== -->

    <style>

        :root {
            color-scheme: light;
        }

        * {
            box-sizing: border-box;
        }

        html {
            margin: 0;
            padding: 0;
            scroll-behavior: smooth;
        }

        body {
            margin: 0;
            padding: 0;
            background: #ffffff;
            color: #111827;
            font-family:
                Arial,
                Helvetica,
                sans-serif;
            line-height: 1.65;
        }

        .seo-product-page {
            width: 100%;
            max-width: 1200px;
            margin: 0 auto;
            padding: 32px 20px;
        }

        .seo-breadcrumbs {
            font-size: 14px;
            margin-bottom: 24px;
        }

        .seo-breadcrumbs a {
            color: #2563eb;
            text-decoration: none;
        }

        .seo-breadcrumbs a:hover {
            text-decoration: underline;
        }

        .seo-product-header {
            display: grid;
            grid-template-columns:
                minmax(180px, 280px)
                minmax(0, 1fr);
            gap: 36px;
            align-items: center;
            margin-bottom: 36px;
        }

        .seo-product-image {
            width: 100%;
            max-width: 280px;
            max-height: 280px;
            object-fit: contain;
            display: block;
            margin: 0 auto;
        }

        .seo-product-header h1 {
            margin: 0 0 16px;
            font-size: clamp(30px, 5vw, 46px);
            line-height: 1.12;
        }

        .seo-product-lead {
            margin: 0;
            font-size: 18px;
            color: #4b5563;
        }

        .seo-section {
            margin: 38px 0;
        }

        .seo-section h2 {
            margin: 0 0 14px;
            font-size: 27px;
            line-height: 1.25;
        }

        .seo-section p {
            max-width: 850px;
        }

        .seo-benefits {
            padding-left: 24px;
        }

        .seo-benefits li {
            margin: 8px 0;
        }

        .seo-related {
            padding-left: 24px;
        }

        .seo-related li {
            margin: 7px 0;
        }

        .seo-related a {
            color: #2563eb;
            text-decoration: none;
        }

        .seo-related a:hover {
            text-decoration: underline;
        }

        .seo-category {
            display: inline-block;
            margin-top: 18px;
            padding: 6px 11px;
            border-radius: 999px;
            background: #f3f4f6;
            color: #374151;
            font-size: 13px;
        }

        .seo-shop-area {
            margin-top: 48px;
            border-top: 1px solid #e5e7eb;
            padding-top: 28px;
        }

        .seo-shop-area h2 {
            margin-bottom: 8px;
        }

        .product-frame {
            display: block;
            width: 100%;
            min-height: 900px;
            border: 0;
            margin-top: 20px;
            background: #ffffff;
        }

        @media (max-width: 700px) {

            .seo-product-page {
                padding: 22px 16px;
            }

            .seo-product-header {
                grid-template-columns: 1fr;
                gap: 22px;
            }

            .seo-product-image {
                max-width: 210px;
            }

            .seo-product-header h1 {
                font-size: 32px;
            }

            .seo-product-lead {
                font-size: 16px;
            }

            .product-frame {
                min-height: 850px;
            }
        }

    </style>

</head>

<body>

    <!-- =====================================================
         SERVER-RENDERED SEO CONTENT
         ===================================================== -->

    <main
        class="seo-product-page"
        id="product-content"
    >

        <!-- =================================================
             BREADCRUMBS
             ================================================= -->

        <nav
            class="seo-breadcrumbs"
            aria-label="Breadcrumb"
        >

            <a href="/">
                Home
            </a>

            <span aria-hidden="true">
                /
            </span>

            <span>
                ${escapeHTML(product.category)}
            </span>

            <span aria-hidden="true">
                /
            </span>

            <span>
                ${escapeHTML(product.name)}
            </span>

        </nav>

        <!-- =================================================
             PRODUCT HEADER
             ================================================= -->

        <header
            class="seo-product-header"
        >

            <div>

                <img
                    class="seo-product-image"
                    src="${escapeHTML(imageURL)}"
                    alt="${escapeHTML(imageAlt)}"
                    width="280"
                    height="280"
                    loading="eager"
                    decoding="async"
                >

            </div>

            <div>

                <h1>
                    ${escapeHTML(
                        product.name
                    )}
                    Subscription in Bangladesh
                </h1>

                <p class="seo-product-lead">
                    ${escapeHTML(intro)}
                </p>

                <span
                    class="seo-category"
                >
                    ${escapeHTML(
                        product.category
                    )}
                </span>

            </div>

        </header>

        <!-- =================================================
             PRODUCT DESCRIPTION
             ================================================= -->

        <section class="seo-section">

            <h2>
                ${escapeHTML(
                    product.name
                )} Subscription
            </h2>

            <p>
                ${escapeHTML(
                    product.description
                )}
                Choose from the available plans
                on NEXT LEVEL SUBS and complete
                your order online.
            </p>

            <p>
                This page is dedicated to
                ${escapeHTML(
                    product.name
                )}
                and provides information about
                the available subscription service
                and ordering options in Bangladesh.
            </p>

        </section>

        <!-- =================================================
             BENEFITS
             ================================================= -->

        <section class="seo-section">

            <h2>
                ${escapeHTML(
                    product.name
                )} Features
            </h2>

            <ul class="seo-benefits">

                ${benefitsHTML}

            </ul>

        </section>

        <!-- =================================================
             BANGLADESH SECTION
             ================================================= -->

        <section class="seo-section">

            <h2>
                ${escapeHTML(
                    product.name
                )} in Bangladesh
            </h2>

            <p>
                NEXT LEVEL SUBS provides
                ${escapeHTML(
                    product.name
                )}
                subscription options for customers
                in Bangladesh. You can review the
                available plans, select the option
                that fits your needs and continue
                through the online checkout process.
            </p>

        </section>

        <!-- =================================================
             RELATED PRODUCTS
             ================================================= -->

        <section class="seo-section">

            <h2>
                Related Subscriptions
            </h2>

            <ul class="seo-related">

                ${relatedHTML}

            </ul>

        </section>

        <!-- =================================================
             EXISTING SHOPPING UI
             ================================================= -->

        <section
            class="seo-shop-area"
            aria-label="Product ordering area"
        >

            <h2>
                Get ${escapeHTML(
                    product.name
                )}
            </h2>

            <p>
                Select an available plan below
                to continue with your order.
            </p>

            <iframe
                id="productFrame"
                class="product-frame"
                src="${escapeHTML(destinationURL)}"
                title="${escapeHTML(
                    product.name
                )} subscription ordering interface"
                loading="eager"
                allow="fullscreen"
            ></iframe>

        </section>

    </main>

    <!-- =====================================================
         PRODUCT NAVIGATION CONTROLLER
         ===================================================== -->

    <script>

    (function () {

        "use strict";

        // ====================================================
        // CONSTANTS
        // ====================================================

        var SITE_HOME =
            "${escapeHTML(SITE.domain)}/";

        var PRODUCT_BASE =
            SITE_HOME + "product/";

        var CURRENT_SLUG =
            "${escapeHTML(slug)}";

        var CURRENT_PRODUCT_NAME =
            ${safeJSON(product.name)};

        var PRODUCT_MAP =
            ${safeJSON(productMap)};

        var frame =
            document.getElementById(
                "productFrame"
            );

        if (!frame) {
            return;
        }

        // ====================================================
        // GENERATE SLUG
        // ====================================================

        function generateSlug(value) {

            return String(value || "")
                .toLowerCase()
                .trim()
                .replace(
                    /[^a-z0-9]+/g,
                    "-"
                )
                .replace(
                    /^-+|-+$/g,
                    "");
        }

        // ====================================================
        // HOME
        // ====================================================

        function goHome() {

            window.top.location.href =
                SITE_HOME;
        }

        // ====================================================
        // PRODUCT NAVIGATION
        // ====================================================

        function goToProduct(
            targetSlug
        ) {

            if (!targetSlug) {
                return;
            }

            targetSlug =
                String(targetSlug)
                    .trim()
                    .toLowerCase();

            if (
                !PRODUCT_MAP[
                    targetSlug
                ]
            ) {
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
                encodeURIComponent(
                    targetSlug
                );
        }

        // ====================================================
        // FIND SLUG FROM NAME
        // ====================================================

        function findSlugFromName(
            name
        ) {

            if (!name) {
                return "";
            }

            var decoded =
                String(name);

            try {
                decoded =
                    decodeURIComponent(
                        decoded
                    );
            } catch (_) {}

            decoded =
                decoded
                    .trim()
                    .toLowerCase();

            // Exact product name
            for (
                var key in PRODUCT_MAP
            ) {

                if (
                    !Object.prototype
                        .hasOwnProperty
                        .call(
                            PRODUCT_MAP,
                            key
                        )
                ) {
                    continue;
                }

                var productName =
                    String(
                        PRODUCT_MAP[key]
                            .name || ""
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

            // Generated slug
            var generated =
                generateSlug(
                    decoded
                );

            if (
                PRODUCT_MAP[
                    generated
                ]
            ) {
                return generated;
            }

            return "";
        }

        // ====================================================
        // FIND SLUG FROM URL
        // ====================================================

        function findSlugFromURL(
            url
        ) {

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
                        PRODUCT_MAP[
                            directSlug
                        ]
                    ) {
                        return directSlug;
                    }
                }

                if (
                    parsed.pathname
                        .toLowerCase()
                        .indexOf(
                            "details.html"
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

        // ====================================================
        // POSTMESSAGE
        // ====================================================

        window.addEventListener(
            "message",
            function (event) {

                if (!event.data) {
                    return;
                }

                // HOME
                if (
                    event.data.type ===
                    "NLS_GO_HOME"
                ) {

                    goHome();

                    return;
                }

                // PRODUCT
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

        // ====================================================
        // IFRAME LOCATION
        // ====================================================

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

                // HOME
                if (
                    pathname === "/" ||
                    pathname === "/index.html"
                ) {

                    goHome();

                    return;
                }

                // DETAILS
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

                // PRODUCT
                var detectedSlug =
                    findSlugFromURL(
                        href
                    );

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

        // ====================================================
        // POLLING
        // ====================================================

        setInterval(
            pollFrameLocation,
            500
        );

        // ====================================================
        // IFRAME LOAD
        // ====================================================

        frame.addEventListener(
            "load",
            function () {

                try {

                    var frameWin =
                        frame.contentWindow;

                    var frameDoc =
                        frameWin.document;

                    // ========================================
                    // CLICK INTERCEPTION
                    // ========================================

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

                                var lower =
                                    href
                                        .toLowerCase()
                                        .trim();

                                // HOME
                                if (
                                    lower === "/" ||
                                    lower === "/index.html" ||
                                    lower.indexOf(
                                        "index.html"
                                    ) !== -1
                                ) {

                                    event.preventDefault();
                                    event.stopPropagation();

                                    goHome();

                                    return;
                                }

                                try {

                                    var url =
                                        new URL(
                                            href,
                                            frameWin.location.href
                                        );

                                    // HOME
                                    if (
                                        url.pathname === "/" ||
                                        url.pathname
                                            .toLowerCase()
                                            .indexOf(
                                                "index.html"
                                            ) !== -1
                                    ) {

                                        event.preventDefault();
                                        event.stopPropagation();

                                        goHome();

                                        return;
                                    }

                                    // PRODUCT
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

                                    // DETAILS
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

                                            return;
                                        }
                                    }

                                } catch (_) {}
                            }

                            // =================================
                            // BUTTONS
                            // =================================

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

                                    return;
                                }
                            }

                        },
                        true
                    );

                } catch (error) {

                    console.warn(
                        "NEXT LEVEL SUBS product controller:",
                        error
                    );
                }
            }
        );

        // ====================================================
        // INITIAL CHECK
        // ====================================================

        setTimeout(
            pollFrameLocation,
            800
        );

    })();

    </script>

</body>

</html>
`;

    // ========================================================
    // SEND
    // ========================================================

    return res.end(html);
};