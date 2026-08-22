// ============================================================
// NEXT LEVEL SUBS
// PRODUCT SEO / OPEN GRAPH / SOCIAL PREVIEW HANDLER
// ============================================================

"use strict";

const SITE = {
    name: "NEXT LEVEL SUBS",
    domain: "https://www.nextlevelsubs.com",
    defaultDescription: "Premium subscriptions, streaming services, VPNs, AI tools, cloud storage and more from NEXT LEVEL SUBS.",
    locale: "en_US"
};

const products = {
    // STREAMING
    "netflix-premium": { name: "Netflix Premium", description: "Watch unlimited movies and TV shows", image: "/assets/cards/netflix.webp", category: "Streaming" },
    "amazon-prime-video": { name: "Amazon Prime Video", description: "Thousands of movies and TV shows", image: "/assets/cards/prime_video.svg", category: "Streaming" },
    "hbo-max": { name: "HBO Max", description: "HBO, Warner Bros., DC, Max Originals", image: "/assets/cards/max.png", category: "Streaming" },
    "crunchy-roll-mega": { name: "Crunchy Roll Mega", description: "Anime. Streaming. Community", image: "/assets/cards/crunchy.png", category: "Streaming" },
    "netflix-for-tv": { name: "Netflix For TV", description: "Watch unlimited movies and TV shows", image: "/assets/cards/netflixfortv.webp", category: "Streaming" },
    "chorki-premium": { name: "Chorki Premium", description: "Bengali. Bold. Streaming", image: "/assets/cards/chorki.webp", category: "Streaming" },
    "hoichoi-premium": { name: "Hoichoi Premium", description: "Unlimited Bangla Entertainment", image: "/assets/cards/hoichoi.png", category: "Streaming" },
    "bongo": { name: "Bongo", description: "Unlimited Bangla Entertainment", image: "/assets/cards/bongo.png", category: "Streaming" },
    "disney-plus": { name: "Disney+", description: "Premium movies, series and exclusive Disney content", image: "/assets/cards/disney.jpg", category: "Streaming" },
    "hulu": { name: "Hulu", description: "Next-day TV and original content", image: "/assets/cards/hulu.svg", category: "Streaming" },
    "apple-tv-plus": { name: "Apple TV+", description: "Original shows and movies", image: "/assets/cards/apple_tv.jpg", category: "Streaming" },
    "paramount-plus": { name: "Paramount+", description: "Movies, live sports, and exclusive originals", image: "/assets/cards/paramount.webp", category: "Streaming" },
    "peacock": { name: "Peacock", description: "NBCUniversal content and live sports", image: "/assets/cards/Peacock.avif", category: "Streaming" },
    "youtube-premium": { name: "YouTube Premium", description: "Ad-free videos and YouTube Music", image: "/assets/cards/youtube.webp", category: "Streaming" },
    "youtube-premium-non-renewable": { name: "Youtube Premium Non-Renewable", description: "Ad-free videos and music", image: "/assets/cards/youtube.webp", category: "Streaming" },
    "discovery-plus": { name: "Discovery+", description: "Documentaries, Reality, Entertainment", image: "/assets/cards/discovery.webp", category: "Streaming" },
    "shudder-premium": { name: "Shudder Premium", description: "Horror, Thriller, Suspense", image: "/assets/cards/shudder.jpg", category: "Streaming" },
    "prime-video-full": { name: "Prime Video Full", description: "Movies, Series, Originals", image: "/assets/cards/primefull.webp", category: "Streaming" },
    "amc-plus": { name: "AMC+", description: "Horror, Thriller, Suspense", image: "/assets/cards/amc+.webp", category: "Streaming" },
    "fubo-tv": { name: "Fubo TV", description: "Sports, Live, Entertainment", image: "/assets/cards/fuboTV.webp", category: "Streaming" },
    "ullu-pro": { name: "Ullu Pro", description: "Adult, Web, Series", image: "/assets/cards/ullu.png", category: "Streaming" },
    "sling-tv": { name: "Sling TV", description: "Live, Channels, Streaming", image: "/assets/cards/slingtv.png", category: "Streaming" },

    // MUSIC
    "spotify-premium": { name: "Spotify Premium", description: "Ad-free music and podcasts", image: "/assets/cards/spotify.jpg", category: "Music" },
    "amazon-music-unlimited": { name: "Amazon Music Unlimited", description: "High-quality music and podcasts", image: "/assets/cards/amazon-music-unlimited.jpeg", category: "Music" },
    "apple-music": { name: "Apple Music", description: "Stream over 75 million songs", image: "/assets/cards/apple_music.jpg", category: "Music" },
    "tidal": { name: "Tidal", description: "High-fidelity music streaming", image: "/assets/cards/tidal.svg", category: "Music" },
    "pandora-premium": { name: "Pandora Premium", description: "Personalized music and podcasts", image: "/assets/cards/pandora.svg", category: "Music" },
    "soundcloud-go-plus": { name: "SoundCloud Go+", description: "Ad-free music and offline listening", image: "/assets/cards/sound_cloud.svg", category: "Music" },
    "deezer-hifi": { name: "Deezer HiFi", description: "High-quality audio streaming", image: "/assets/cards/deezer.svg", category: "Music" },

    // CLOUD STORAGE
    "microsoft-onedrive": { name: "Microsoft OneDrive", description: "1TB cloud storage with Office apps", image: "/assets/cards/onedrive.svg", category: "Cloud Storage" },
    "dropbox-plus": { name: "Dropbox Plus", description: "2TB secure cloud storage", image: "/assets/cards/Dropbox_(service)-Logo.wine.svg", category: "Cloud Storage" },
    "google-drive": { name: "Google Drive", description: "1TB cloud storage", image: "/assets/cards/Google_Drive-Logo.wine.svg", category: "Cloud Storage" },
    "icloud-plus": { name: "iCloud+", description: "50GB cloud storage for Apple users", image: "/assets/cards/icloud+webp.webp", category: "Cloud Storage" },
    "amazon-drive": { name: "Amazon Drive", description: "100GB cloud storage", image: "/assets/cards/amazon_drive.png", category: "Cloud Storage" },

    // VPN
    "expressvpn": { name: "ExpressVPN", description: "High-speed, secure VPN service", image: "/assets/cards/expressVPN.png", category: "VPN" },
    "nordvpn": { name: "NordVPN", description: "Advanced security with double VPN", image: "/assets/cards/nordvpn.webp", category: "VPN" },
    "surfshark": { name: "Surfshark", description: "Unlimited devices and connections", image: "/assets/cards/surfsharkvpn.webp", category: "VPN" },
    "cyberghost": { name: "CyberGhost", description: "User-friendly VPN with 45-day guarantee", image: "/assets/cards/cyberghost.png", category: "VPN" },
    "ipvanish": { name: "IPVanish", description: "Fast connections with no logs", image: "/assets/cards/ipvanish.webp", category: "VPN" },
    "private-internet-access": { name: "Private Internet Access", description: "Highly customizable VPN", image: "/assets/cards/pia.png", category: "VPN" },
    "hotspot-shield": { name: "Hotspot Shield", description: "Patented VPN technology", image: "/assets/cards/Hotspot-Shield-vpn.webp", category: "VPN" },
    "vypr-vpn": { name: "Vypr VPN", description: "Secure and private VPN service", image: "/assets/cards/vyprvpn.webp", category: "VPN" },

    // AI & DESIGN
    "canva-pro": { name: "Canva Pro", description: "Canva Pro: Where Ideas Turn into Stunning Designs—Fast!", image: "/assets/cards/canva.png", category: "AI & Design" },
    "photoroom-pro": { name: "Photoroom Pro", description: "Professional AI-powered photo editing and design tools", image: "/assets/cards/photoroom.jpg", category: "AI & Design" },
    "picsart-premium": { name: "Picsart Premium", description: "Creative photo and video editing tools", image: "/assets/cards/picsart.png", category: "AI & Design" },
    "photoroom-max": { name: "Photoroom Max", description: "Advanced AI photo editing and creative tools", image: "/assets/cards/photoroom.jpg", category: "AI & Design" },
    "blackbox-ai-chatgpt5": { name: "Black Box Ai (CHAT-GPT5)", description: "AI-powered coding and development assistant", image: "/assets/cards/blackboxai.jpg", category: "AI & Design" },
    "gemini-ai": { name: "Gemini Ai", description: "Google's advanced AI assistant", image: "/assets/cards/gemini.png", category: "AI & Design" },
    "chat-gpt": { name: "Chat GPT", description: "Advanced AI assistant for writing, research and productivity", image: "/assets/cards/chatgpt.jpg", category: "AI & Design" },
    "perplexity-chatgpt5": { name: "Perplexity (ChatGPT-5)", description: "AI-powered search and research assistant", image: "/assets/cards/Perplexity.svg", category: "AI & Design" },
    "remini-ai": { name: "Remini Ai", description: "AI-powered photo enhancement and restoration", image: "/assets/cards/remini.avif", category: "AI & Design" },

    // COMBOS
    "netflix-prime-video": { name: "Netflix + Prime Video", description: "Get both streaming services at a discount", image: "/assets/cards/Netflix-vs-Amazon.jpg", category: "Combo" },
    "netflix-hbo-max": { name: "Netflix + HBO Max", description: "Premium content from both platforms", image: "/assets/cards/netflix+hbomax.webp", category: "Combo" },
    "prime-video-hbo-max": { name: "Prime Video + HBO Max", description: "Premium content from both platforms", image: "/assets/cards/prime+hbo.webp", category: "Combo" },
    "hbo-max-surfshark-vpn": { name: "HBO Max + Surfshark VPN", description: "Stream securely with VPN protection", image: "/assets/cards/hbo+surfshark.webp", category: "Combo" },
    "spotify-youtube-premium": { name: "Spotify + YouTube Premium", description: "Ad-free music and videos", image: "/assets/cards/spotify+youtube.webp", category: "Combo" },
    "disney-hbo-max": { name: "Disney + HBO Max", description: "Disney+ and HBO Max premium entertainment", image: "/assets/cards/disney+nordVPN.webp", category: "Combo" },
    "disney-nord-vpn": { name: "Disney + Nord VPN", description: "Disney+ entertainment with NordVPN protection", image: "/assets/cards/disney+nordVPN.webp", category: "Combo" },
    "music-storage": { name: "Music & Storage", description: "Amazon Music HD and 1TB OneDrive storage", image: "/assets/cards/amazon+onedrive.png", category: "Combo" },
    "security-bundle": { name: "Security Bundle", description: "ExpressVPN and 1TB OneDrive cloud storage", image: "/assets/cards/expressvpn+onedrive.webp", category: "Combo" },
    "ultimate-entertainment": { name: "Ultimate Entertainment", description: "Netflix, HBO Max, and ExpressVPN", image: "/assets/cards/netflix_expressvpn_hbomax.webp", category: "Combo" },

    // EDUCATION
    "doulingo": { name: "Doulingo", description: "Learn languages with interactive lessons", image: "/assets/cards/doulingo.png", category: "Education" },
    "skillshare": { name: "Skillshare", description: "Access thousands of online creative courses", image: "/assets/cards/skill_share.png", category: "Education" },
    "linkedin-premium": { name: "LinkedIn Premium", description: "Professional development and career tools", image: "/assets/cards/LinkedIn.png", category: "Education" },
    "numerade": { name: "Numerade", description: "Learn with step-by-step educational video solutions", image: "/assets/cards/Numerade.jpg", category: "Education" },
    "grammarly-pro": { name: "Grammarly Pro", description: "Advanced writing, grammar and productivity tools", image: "/assets/cards/grammarly.png", category: "Education" },

    // ADULT
    "digital-playground": { name: "Digital Playground", description: "Exclusive premium content from creators", image: "/assets/cards/DigitalPlayground-logo.png", category: "Adult" },
    "pornhub-premium": { name: "Pornhub Premium", description: "Ad-free premium adult entertainment", image: "/assets/cards/pornhub.webp", category: "Adult" },
    "brazzers": { name: "Brazzers", description: "Premium adult content", image: "/assets/cards/brazzers.webp", category: "Adult" },
    "spice-vids": { name: "Spice Vids", description: "Premium adult streaming platform", image: "/assets/cards/spicevids.webp", category: "Adult" },
    "reality-kings": { name: "Reality Kings", description: "Premium reality adult content", image: "/assets/cards/realitykings.webp", category: "Adult" },
    "bang-bros": { name: "Bang Bros", description: "High-quality, exclusive adult entertainment", image: "/assets/cards/bangbros.webp", category: "Adult" },
    "babes-com": { name: "Babes.com", description: "High-quality, exclusive adult video content", image: "/assets/cards/babes.webp", category: "Adult" },

    // PRODUCTIVITY
    "truecaller-gold": { name: "True Caller Gold", description: "Premium caller identification and protection", image: "/assets/cards/truecaller.avif", category: "Productivity" }
};

const slugAliases = {
    "netflix": "netflix-premium",
    "duolingo": "doulingo",
    "youtube-premium-nonrenewable": "youtube-premium-non-renewable"
};

function escapeHTML(value) {
    return String(value == null ? "" : value)
        .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}

function safeJSON(value) {
    return JSON.stringify(value)
        .replace(/</g, "\\u003c").replace(/>/g, "\\u003e").replace(/&/g, "\\u0026")
        .replace(/\u2028/g, "\\u2028").replace(/\u2029/g, "\\u2029");
}

function buildProductIndex() {
    const index = Object.create(null);
    Object.keys(products).forEach((key) => {
        index[key.toLowerCase()] = key;
        const generated = String(products[key].name || "").toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
        if (generated) index[generated] = key;
    });
    Object.keys(slugAliases).forEach((alias) => {
        const target = slugAliases[alias];
        if (products[target]) index[alias.toLowerCase()] = target;
    });
    return index;
}

const productIndex = buildProductIndex();

function resolveProductKey(value) {
    if (typeof value !== "string") return "";
    let decoded = value.trim();
    try { decoded = decodeURIComponent(decoded); } catch (_) {}
    decoded = decoded.trim().toLowerCase().replace(/^\/+|\/+$/g, "");

    if (products[decoded]) return decoded;
    if (productIndex[decoded]) return productIndex[decoded];

    const generated = String(decoded).toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
    return productIndex[generated] || "";
}

function getProductSlug(req) {
    if (req.query && typeof req.query.slug === "string" && req.query.slug.trim()) {
        const resolved = resolveProductKey(req.query.slug);
        if (resolved) return resolved;
    }
    const rawURL = req.url || "";
    const pathname = rawURL.split("?")[0];
    const match = pathname.match(/^\/product[s]?\/([^/]+)\/?$/i);
    return (match && match[1]) ? resolveProductKey(match[1]) : "";
}

function send404(res) {
    res.statusCode = 404;
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.setHeader("X-Robots-Tag", "noindex, nofollow");
    return res.end(`<!DOCTYPE html><html><head><title>Product Not Found</title></head><body><h1>Product Not Found</h1></body></html>`);
}

module.exports = function handler(req, res) {
    if (req.method !== "GET" && req.method !== "HEAD") {
        res.statusCode = 405;
        return res.end("Method Not Allowed");
    }

    const slug = getProductSlug(req);
    if (!slug || !products[slug]) return send404(res);

    const product = products[slug];
    const productURL = `${SITE.domain}/products/${encodeURIComponent(slug)}`;
    const destinationURL = `${SITE.domain}/details.html?name=${encodeURIComponent(product.name)}`;

    res.statusCode = 200;
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.setHeader("Cache-Control", "public, max-age=300, stale-while-revalidate=86400");

    if (req.method === "HEAD") return res.end();

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${escapeHTML(product.name)} Subscription | NEXT LEVEL SUBS</title>
    <link rel="canonical" href="${escapeHTML(productURL)}">
    <style>
        html, body { margin: 0; padding: 0; width: 100%; height: 100%; overflow: hidden; background: #fff; }
        iframe { display: block; width: 100%; height: 100%; border: 0; }
    </style>
</head>
<body>
    <iframe id="productFrame" src="${escapeHTML(destinationURL)}" title="${escapeHTML(product.name)}"></iframe>

    <script>
    (function () {
        "use strict";

        var SITE_HOME = "${escapeHTML(SITE.domain)}/";
        var CURRENT_SLUG = "${escapeHTML(slug)}";
        var frame = document.getElementById("productFrame");

        var PRODUCT_MAP = ${safeJSON(
            Object.keys(products).reduce((map, key) => {
                map[key] = { name: products[key].name };
                return map;
            }, {})
        )};

        function goHome() {
            window.top.location.href = SITE_HOME;
        }

        function goToProduct(targetSlug) {
            if (!targetSlug || targetSlug === CURRENT_SLUG) return;
            window.top.location.href = SITE_HOME + "products/" + encodeURIComponent(targetSlug);
        }

        function findSlugFromName(name) {
            if (!name) return "";
            var decoded = String(name);
            try { decoded = decodeURIComponent(decoded); } catch (_) {}
            decoded = decoded.trim().toLowerCase();

            for (var key in PRODUCT_MAP) {
                if (PRODUCT_MAP[key].name.trim().toLowerCase() === decoded) return key;
            }
            var generated = decoded.replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
            return PRODUCT_MAP[generated] ? generated : "";
        }

        // 1. LISTEN TO POSTMESSAGE FROM DETAILS.HTML
        window.addEventListener("message", function (event) {
            if (!event.data) return;
            if (event.data.type === "NLS_GO_HOME") {
                goHome();
                return;
            }
            if (event.data.type === "NLS_NAVIGATE_PRODUCT" && event.data.productName) {
                var targetSlug = findSlugFromName(event.data.productName);
                if (targetSlug) goToProduct(targetSlug);
            }
        });

        // 2. ACTIVE POLLING (Failsafe for dynamic JS navigation)
        function pollFrameLocation() {
            try {
                var frameWin = frame.contentWindow;
                if (!frameWin || !frameWin.location) return;

                var href = frameWin.location.href || "";
                if (!href) return;

                var url = new URL(href);
                var path = url.pathname.toLowerCase();

                // If iframe navigated to home or index.html
                if (path === "/" || path.indexOf("index.html") !== -1) {
                    goHome();
                    return;
                }

                // If iframe navigated to another details.html page
                if (path.indexOf("details.html") !== -1) {
                    var nameParam = url.searchParams.get("name");
                    if (nameParam) {
                        var targetSlug = findSlugFromName(nameParam);
                        if (targetSlug && targetSlug !== CURRENT_SLUG) {
                            goToProduct(targetSlug);
                        }
                    }
                }
            } catch (_) {}
        }

        setInterval(pollFrameLocation, 200);

        // 3. EVENT LISTENERS ON IFRAME DOM
        frame.addEventListener("load", function () {
            try {
                var frameWin = frame.contentWindow;
                var frameDoc = frameWin.document;

                // Override history.back inside the frame
                try {
                    frameWin.history.back = function () { goHome(); };
                    frameWin.history.go = function (delta) {
                        if (typeof delta === "number" && delta < 0) goHome();
                    };
                } catch (_) {}

                frameDoc.addEventListener("click", function (e) {
                    var a = e.target.closest("a");
                    if (a) {
                        var href = a.getAttribute("href") || "";
                        var lower = href.toLowerCase().trim();

                        if (lower === "/" || lower === "/index.html" || lower.indexOf("index.html") !== -1) {
                            e.preventDefault();
                            e.stopPropagation();
                            goHome();
                            return;
                        }

                        try {
                            var url = new URL(href, frameWin.location.href);
                            if (url.pathname === "/" || url.pathname.toLowerCase().indexOf("index.html") !== -1) {
                                e.preventDefault();
                                e.stopPropagation();
                                goHome();
                                return;
                            }

                            var name = url.searchParams.get("name");
                            if (name) {
                                var matchedSlug = findSlugFromName(name);
                                if (matchedSlug && matchedSlug !== CURRENT_SLUG) {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    goToProduct(matchedSlug);
                                    return;
                                }
                            }
                        } catch (_) {}
                    }

                    var btn = e.target.closest("button, [role='button'], .back-btn, .home-btn");
                    if (btn) {
                        var txt = (btn.innerText || btn.textContent || "").trim().toLowerCase();
                        if (txt === "home" || txt === "back" || txt.indexOf("back to") !== -1 || txt.indexOf("go home") !== -1) {
                            e.preventDefault();
                            e.stopPropagation();
                            goHome();
                        }
                    }
                }, true);

            } catch (err) {
                console.warn("Frame event listener fallback:", err);
            }
        });

    })();
    </script>
</body>
</html>`;

    return res.end(html);
};