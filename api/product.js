"use strict";

// NEXT LEVEL SUBS — PRODUCT SEO HANDLER
// Optimized around the existing product catalog.
// Keeps /product/{slug}, details.html UI, OG/Twitter metadata,
// canonical URLs, Product/Breadcrumb/WebPage/Organization JSON-LD,
// related-product links and product navigation.

const SITE = {
  name: "NEXT LEVEL SUBS",
  domain: "https://www.nextlevelsubs.com",
  language: "en",
  locale: "en_US"
};

// -----------------------------------------------------------------------------
// ACTUAL PRODUCT CATALOG
// -----------------------------------------------------------------------------
const products = {
  "netflix-premium":["Netflix Premium","Watch movies and TV shows","/assets/cards/netflix.webp","Streaming"],
  "amazon-prime-video":["Amazon Prime Video","Movies and TV shows","/assets/cards/Prime_Video.png","Streaming"],
  "hbo-max":["HBO Max","HBO, Warner Bros., DC and Max Originals","/assets/cards/hbomax.jpg","Streaming"],
  "crunchy-roll-mega":["Crunchy Roll Mega","Anime streaming and community","/assets/cards/crunchy.png","Streaming"],
  "netflix-for-tv":["Netflix For TV","Watch movies and TV shows on supported TV devices","/assets/cards/netflixfortv.webp","Streaming"],
  "chorki-premium":["Chorki Premium","Bangla streaming entertainment","/assets/cards/chorki.webp","Streaming"],
  "hoichoi-premium":["Hoichoi Premium","Bangla movies, series and entertainment","/assets/cards/hoichoi.png","Streaming"],
  "bongo":["Bongo","Bangla entertainment streaming","/assets/cards/bongo.png","Streaming"],
  "disney-plus":["Disney+","Disney movies, series and originals","/assets/cards/disney.jpg","Streaming"],
  "hulu":["Hulu","TV shows and original content","/assets/cards/hulu.svg","Streaming"],
  "apple-tv-plus":["Apple TV+","Apple original shows and movies","/assets/cards/apple_tv.jpg","Streaming"],
  "paramount-plus":["Paramount+","Movies, series, sports and originals","/assets/cards/paramount.webp","Streaming"],
  "peacock":["Peacock","NBCUniversal entertainment and sports","/assets/cards/Peacock.avif","Streaming"],
  "youtube-premium":["YouTube Premium","Ad-free YouTube and YouTube Music","/assets/cards/youtube.webp","Streaming"],
  "youtube-premium-non-renewable":["YouTube Premium Non-Renewable","Ad-free videos and music","/assets/cards/youtube.webp","Streaming"],
  "discovery-plus":["Discovery+","Documentaries, reality and entertainment","/assets/cards/discovery.webp","Streaming"],
  "shudder-premium":["Shudder Premium","Horror, thriller and suspense streaming","/assets/cards/shudder.jpg","Streaming"],
  "prime-video-full":["Prime Video Full","Movies, series and originals","/assets/cards/primefull.webp","Streaming"],
  "amc-plus":["AMC+","Horror, thriller and premium entertainment","/assets/cards/amc+.webp","Streaming"],
  "fubo-tv":["Fubo TV","Live TV, sports and entertainment","/assets/cards/fuboTV.webp","Streaming"],
  "ullu-pro":["Ullu Pro","Adult web series and streaming","/assets/cards/ullu.png","Streaming"],
  "sling-tv":["Sling TV","Live channels and streaming","/assets/cards/slingtv.png","Streaming"],

  "spotify-premium":["Spotify Premium","Ad-free music and podcasts","/assets/cards/spotify.jpg","Music"],
  "amazon-music-unlimited":["Amazon Music Unlimited","Music and podcasts","/assets/cards/amazon-music-unlimited.jpeg","Music"],
  "apple-music":["Apple Music","Music streaming and playlists","/assets/cards/apple_music.jpg","Music"],
  "tidal":["Tidal","High-quality music streaming","/assets/cards/tidal.svg","Music"],
  "pandora-premium":["Pandora Premium","Personalized music and podcasts","/assets/cards/pandora.svg","Music"],
  "soundcloud-go-plus":["SoundCloud Go+","Ad-free music and offline listening","/assets/cards/sound_cloud.svg","Music"],
  "deezer-hifi":["Deezer HiFi","High-quality audio streaming","/assets/cards/deezer.svg","Music"],

  "microsoft-onedrive":["Microsoft OneDrive","Cloud storage and Microsoft productivity tools","/assets/cards/onedrive.svg","Cloud Storage"],
  "dropbox-plus":["Dropbox Plus","Secure cloud storage","/assets/cards/Dropbox_(service)-Logo.wine.svg","Cloud Storage"],
  "google-drive":["Google Drive","Cloud storage for files and documents","/assets/cards/Google_Drive-Logo.wine.svg","Cloud Storage"],
  "icloud-plus":["iCloud+","iCloud storage for Apple users","/assets/cards/icloud+webp.webp","Cloud Storage"],
  "amazon-drive":["Amazon Drive","Cloud storage","/assets/cards/amazon_drive.png","Cloud Storage"],

  "expressvpn":["ExpressVPN","VPN service for privacy and secure connections","/assets/cards/expressVPN.png","VPN"],
  "nordvpn":["NordVPN","VPN service with advanced security features","/assets/cards/nordvpn.webp","VPN"],
  "surfshark":["Surfshark","VPN service with multi-device support","/assets/cards/surfsharkvpn.webp","VPN"],
  "cyberghost":["CyberGhost","VPN service with privacy and security tools","/assets/cards/cyberghost.png","VPN"],
  "ipvanish":["IPVanish","VPN service with fast connections","/assets/cards/ipvanish.webp","VPN"],
  "private-internet-access":["Private Internet Access","Customizable VPN service","/assets/cards/pia.png","VPN"],
  "hotspot-shield":["Hotspot Shield","VPN service with secure connections","/assets/cards/Hotspot-Shield-vpn.webp","VPN"],
  "vypr-vpn":["Vypr VPN","Private and secure VPN service","/assets/cards/vyprvpn.webp","VPN"],

  "canva-pro":["Canva Pro","Design tools, templates and creative features","/assets/cards/canva.png","AI & Design"],
  "photoroom-pro":["Photoroom Pro","AI photo editing and design tools","/assets/cards/photoroom.jpg","AI & Design"],
  "picsart-premium":["Picsart Premium","Photo and video editing tools","/assets/cards/picsart.png","AI & Design"],
  "photoroom-max":["Photoroom Max","Advanced AI photo editing tools","/assets/cards/photoroom.jpg","AI & Design"],
  "blackbox-ai-chatgpt5":["Black Box Ai (CHAT-GPT5)","AI-powered coding and development tools","/assets/cards/blackboxai.jpg","AI & Design"],
  "gemini-ai":["Gemini AI","Google AI assistant","/assets/cards/gemini.png","AI & Design"],
  "chat-gpt":["Chat GPT","AI assistant for writing, research and productivity","/assets/cards/chatgpt.jpg","AI & Design"],
  "perplexity-chatgpt5":["Perplexity (ChatGPT-5)","AI-powered search and research assistant","/assets/cards/Perplexity.svg","AI & Design"],
  "remini-ai":["Remini AI","AI photo enhancement and restoration","/assets/cards/remini.avif","AI & Design"],

  "netflix-prime-video":["Netflix + Prime Video","Two streaming services in one bundle","/assets/cards/Netflix-vs-Amazon.jpg","Combo"],
  "netflix-hbo-max":["Netflix + HBO Max","Two premium streaming services in one bundle","/assets/cards/netflix+hbomax.webp","Combo"],
  "prime-video-hbo-max":["Prime Video + HBO Max","Two premium streaming services in one bundle","/assets/cards/prime+hbo.webp","Combo"],
  "hbo-max-surfshark-vpn":["HBO Max + Surfshark VPN","Streaming and VPN service bundle","/assets/cards/hbo+surfshark.webp","Combo"],
  "spotify-youtube-premium":["Spotify + YouTube Premium","Music and video subscription bundle","/assets/cards/spotify+youtube.webp","Combo"],
  "disney-hbo-max":["Disney + HBO Max","Disney+ and HBO Max entertainment bundle","/assets/cards/disney+nordVPN.webp","Combo"],
  "disney-nord-vpn":["Disney + Nord VPN","Disney+ and NordVPN bundle","/assets/cards/disney+nordVPN.webp","Combo"],
  "music-storage":["Music & Storage","Music service and cloud storage bundle","/assets/cards/amazon+onedrive.png","Combo"],
  "security-bundle":["Security Bundle","VPN and cloud storage bundle","/assets/cards/expressvpn+onedrive.webp","Combo"],
  "ultimate-entertainment":["Ultimate Entertainment","Netflix, HBO Max and ExpressVPN bundle","/assets/cards/netflix_expressvpn_hbomax.webp","Combo"],

  "doulingo":["Doulingo","Interactive language learning","/assets/cards/doulingo.png","Education"],
  "skillshare":["Skillshare","Online creative courses","/assets/cards/skill_share.png","Education"],
  "linkedin-premium":["LinkedIn Premium","Career and professional development tools","/assets/cards/LinkedIn.png","Education"],
  "numerade":["Numerade","Step-by-step educational video solutions","/assets/cards/Numerade.jpg","Education"],
  "grammarly-pro":["Grammarly Pro","Writing, grammar and productivity tools","/assets/cards/grammarly.png","Education"],

  "digital-playground":["Digital Playground","Premium adult content","/assets/cards/DigitalPlayground-logo.png","Adult"],
  "pornhub-premium":["Pornhub Premium","Premium adult entertainment","/assets/cards/pornhub.webp","Adult"],
  "brazzers":["Brazzers","Premium adult content","/assets/cards/brazzers.webp","Adult"],
  "spice-vids":["Spice Vids","Premium adult streaming","/assets/cards/spicevids.webp","Adult"],
  "reality-kings":["Reality Kings","Premium adult content","/assets/cards/realitykings.webp","Adult"],
  "bang-bros":["Bang Bros","Premium adult entertainment","/assets/cards/bangbros.webp","Adult"],
  "babes-com":["Babes.com","Premium adult video content","/assets/cards/babes.webp","Adult"],

  "truecaller-gold":["True Caller Gold","Caller identification and protection tools","/assets/cards/truecaller.avif","Productivity"]
};

// -----------------------------------------------------------------------------
// SEO DATA — one explicit search intent per product.
// Bangladesh is used for mainstream commercial subscription pages; adult pages
// intentionally use a neutral title. Do not add claims that your actual offer
// does not provide.
// -----------------------------------------------------------------------------
const seo = {
  "netflix-premium":["Netflix Premium Bangladesh","Netflix subscription Bangladesh","Netflix Premium price Bangladesh"],
  "amazon-prime-video":["Amazon Prime Video Bangladesh","Prime Video subscription Bangladesh","Amazon Prime Video price Bangladesh"],
  "hbo-max":["HBO Max Bangladesh","HBO Max subscription Bangladesh","HBO Max price Bangladesh"],
  "crunchy-roll-mega":["Crunchyroll Premium Bangladesh","Crunchyroll subscription Bangladesh","Crunchyroll price Bangladesh"],
  "netflix-for-tv":["Netflix for TV Bangladesh","Netflix TV subscription Bangladesh","Netflix Premium for TV"],
  "chorki-premium":["Chorki Premium Bangladesh","Chorki subscription Bangladesh","Chorki Premium price"],
  "hoichoi-premium":["Hoichoi Premium Bangladesh","Hoichoi subscription Bangladesh","Hoichoi Premium price"],
  "bongo":["Bongo Bangladesh","Bongo subscription Bangladesh","Bongo Premium price"],
  "disney-plus":["Disney Plus Bangladesh","Disney Plus subscription Bangladesh","Disney Plus price Bangladesh"],
  "hulu":["Hulu Bangladesh","Hulu subscription Bangladesh","Hulu price"],
  "apple-tv-plus":["Apple TV Plus Bangladesh","Apple TV Plus subscription Bangladesh","Apple TV Plus price"],
  "paramount-plus":["Paramount Plus Bangladesh","Paramount Plus subscription Bangladesh","Paramount Plus price"],
  "peacock":["Peacock Premium Bangladesh","Peacock subscription Bangladesh","Peacock price"],
  "youtube-premium":["YouTube Premium Bangladesh","YouTube Premium subscription Bangladesh","YouTube Premium price Bangladesh"],
  "youtube-premium-non-renewable":["YouTube Premium non-renewable Bangladesh","YouTube Premium non-renewable subscription","YouTube Premium non-renewable price"],
  "discovery-plus":["Discovery Plus Bangladesh","Discovery Plus subscription Bangladesh","Discovery Plus price"],
  "shudder-premium":["Shudder Premium Bangladesh","Shudder subscription Bangladesh","Shudder Premium price"],
  "prime-video-full":["Prime Video Full Bangladesh","Prime Video Full subscription","Prime Video Full price"],
  "amc-plus":["AMC Plus Bangladesh","AMC Plus subscription Bangladesh","AMC Plus price"],
  "fubo-tv":["Fubo TV Bangladesh","Fubo TV subscription Bangladesh","Fubo TV price"],
  "ullu-pro":["Ullu Pro Bangladesh","Ullu subscription Bangladesh","Ullu Pro price"],
  "sling-tv":["Sling TV Bangladesh","Sling TV subscription Bangladesh","Sling TV price"],

  "spotify-premium":["Spotify Premium Bangladesh","Spotify subscription Bangladesh","Spotify Premium price Bangladesh"],
  "amazon-music-unlimited":["Amazon Music Unlimited Bangladesh","Amazon Music subscription Bangladesh","Amazon Music Unlimited price"],
  "apple-music":["Apple Music Bangladesh","Apple Music subscription Bangladesh","Apple Music price Bangladesh"],
  "tidal":["Tidal Premium Bangladesh","Tidal subscription Bangladesh","Tidal price Bangladesh"],
  "pandora-premium":["Pandora Premium Bangladesh","Pandora subscription Bangladesh","Pandora Premium price"],
  "soundcloud-go-plus":["SoundCloud Go Plus Bangladesh","SoundCloud subscription Bangladesh","SoundCloud Go Plus price"],
  "deezer-hifi":["Deezer HiFi Bangladesh","Deezer subscription Bangladesh","Deezer HiFi price"],

  "microsoft-onedrive":["OneDrive Bangladesh","OneDrive subscription Bangladesh","OneDrive cloud storage Bangladesh"],
  "dropbox-plus":["Dropbox Plus Bangladesh","Dropbox subscription Bangladesh","Dropbox Plus price"],
  "google-drive":["Google Drive storage Bangladesh","Google Drive subscription Bangladesh","Google cloud storage Bangladesh"],
  "icloud-plus":["iCloud Plus Bangladesh","iCloud storage Bangladesh","iCloud+ subscription Bangladesh"],
  "amazon-drive":["Amazon Drive Bangladesh","Amazon Drive storage","Amazon cloud storage"],

  "expressvpn":["ExpressVPN Bangladesh","ExpressVPN subscription Bangladesh","ExpressVPN price Bangladesh"],
  "nordvpn":["NordVPN Bangladesh","NordVPN subscription Bangladesh","NordVPN price Bangladesh"],
  "surfshark":["Surfshark Bangladesh","Surfshark subscription Bangladesh","Surfshark price Bangladesh"],
  "cyberghost":["CyberGhost VPN Bangladesh","CyberGhost subscription Bangladesh","CyberGhost price Bangladesh"],
  "ipvanish":["IPVanish Bangladesh","IPVanish subscription Bangladesh","IPVanish price Bangladesh"],
  "private-internet-access":["Private Internet Access Bangladesh","PIA VPN subscription Bangladesh","PIA VPN price Bangladesh"],
  "hotspot-shield":["Hotspot Shield Bangladesh","Hotspot Shield subscription Bangladesh","Hotspot Shield price"],
  "vypr-vpn":["VyprVPN Bangladesh","VyprVPN subscription Bangladesh","VyprVPN price"],

  "canva-pro":["Canva Pro Bangladesh","Canva Pro subscription Bangladesh","Canva Pro price Bangladesh"],
  "photoroom-pro":["Photoroom Pro Bangladesh","Photoroom subscription Bangladesh","Photoroom Pro price"],
  "picsart-premium":["Picsart Premium Bangladesh","Picsart subscription Bangladesh","Picsart Premium price"],
  "photoroom-max":["Photoroom Max Bangladesh","Photoroom Max subscription","Photoroom Max price"],
  "blackbox-ai-chatgpt5":["Blackbox AI Bangladesh","Blackbox AI subscription Bangladesh","Blackbox AI price"],
  "gemini-ai":["Google Gemini Bangladesh","Gemini AI subscription Bangladesh","Gemini price Bangladesh"],
  "chat-gpt":["ChatGPT Plus Bangladesh","ChatGPT subscription Bangladesh","ChatGPT Plus price Bangladesh"],
  "perplexity-chatgpt5":["Perplexity Pro Bangladesh","Perplexity subscription Bangladesh","Perplexity Pro price"],
  "remini-ai":["Remini Pro Bangladesh","Remini AI subscription Bangladesh","Remini Pro price"],

  "netflix-prime-video":["Netflix Prime Video combo Bangladesh","Netflix Prime Video bundle Bangladesh","Netflix Prime Video package"],
  "netflix-hbo-max":["Netflix HBO Max combo Bangladesh","Netflix HBO Max bundle Bangladesh","Netflix HBO Max package"],
  "prime-video-hbo-max":["Prime Video HBO Max combo Bangladesh","Prime Video HBO Max bundle Bangladesh","Prime Video HBO Max package"],
  "hbo-max-surfshark-vpn":["HBO Max Surfshark combo Bangladesh","HBO Max VPN bundle Bangladesh","HBO Max Surfshark package"],
  "spotify-youtube-premium":["Spotify YouTube Premium combo Bangladesh","Spotify YouTube Premium bundle","Spotify YouTube Premium package"],
  "disney-hbo-max":["Disney Plus HBO Max combo Bangladesh","Disney HBO Max bundle Bangladesh","Disney HBO Max package"],
  "disney-nord-vpn":["Disney NordVPN combo Bangladesh","Disney VPN bundle Bangladesh","Disney NordVPN package"],
  "music-storage":["music storage bundle Bangladesh","music cloud storage bundle","Amazon Music OneDrive bundle"],
  "security-bundle":["VPN cloud storage bundle Bangladesh","security subscription bundle Bangladesh","ExpressVPN OneDrive bundle"],
  "ultimate-entertainment":["streaming bundle Bangladesh","Netflix HBO Max VPN bundle","ultimate entertainment bundle Bangladesh"],

  "doulingo":["Duolingo Super Bangladesh","Duolingo subscription Bangladesh","Duolingo price Bangladesh"],
  "skillshare":["Skillshare Bangladesh","Skillshare subscription Bangladesh","Skillshare price Bangladesh"],
  "linkedin-premium":["LinkedIn Premium Bangladesh","LinkedIn Premium subscription Bangladesh","LinkedIn Premium price"],
  "numerade":["Numerade Bangladesh","Numerade subscription Bangladesh","Numerade price"],
  "grammarly-pro":["Grammarly Premium Bangladesh","Grammarly Pro subscription Bangladesh","Grammarly price Bangladesh"],

  "digital-playground":["Digital Playground subscription","Digital Playground premium","Digital Playground membership"],
  "pornhub-premium":["Pornhub Premium subscription","Pornhub Premium membership","Pornhub Premium price"],
  "brazzers":["Brazzers subscription","Brazzers membership","Brazzers price"],
  "spice-vids":["Spice Vids subscription","Spice Vids membership","Spice Vids price"],
  "reality-kings":["Reality Kings subscription","Reality Kings membership","Reality Kings price"],
  "bang-bros":["Bang Bros subscription","Bang Bros membership","Bang Bros price"],
  "babes-com":["Babes.com subscription","Babes.com membership","Babes.com price"],

  "truecaller-gold":["Truecaller Premium Bangladesh","Truecaller Gold Bangladesh","Truecaller subscription Bangladesh"]
};

const aliases = {
  netflix:"netflix-premium",
  duolingo:"doulingo",
  "youtube-premium-nonrenewable":"youtube-premium-non-renewable"
};

function P(slug){const p=products[slug];return {name:p[0],description:p[1],image:p[2],category:p[3]};}
function esc(v){return String(v==null?"":v).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/\"/g,"&quot;").replace(/'/g,"&#039;");}
function json(v){return JSON.stringify(v).replace(/</g,"\\u003c").replace(/>/g,"\\u003e").replace(/&/g,"\\u0026").replace(/\u2028/g,"\\u2028").replace(/\u2029/g,"\\u2029");}
function slugify(v){return String(v||"").toLowerCase().trim().replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"");}
function imageURL(p){let x=p.image||"/assets/logo.png";if(/\.svg(\?|#|$)/i.test(x))x="/assets/logo.png";return /^https?:\/\//i.test(x)?x:SITE.domain+(x[0]===""?"":"/")+x.replace(/^\//,"");}
function resolve(v){if(typeof v!=="string")return"";let x=v.trim();try{x=decodeURIComponent(x)}catch(_){}x=x.replace(/^\/+|\/+$/g,"").toLowerCase();if(products[x])return x;if(aliases[x]&&products[aliases[x]])return aliases[x];for(const k of Object.keys(products))if(slugify(products[k][0])===x)return k;return"";}
function getSlug(req){if(req.query&&typeof req.query.slug==="string"){const s=resolve(req.query.slug);if(s)return s;}const m=(req.url||"").split("?")[0].match(/^\/product\/([^/]+)\/?$/i);return m?resolve(m[1]):"";}

function seoFor(slug,p){
  const k=seo[slug]||[p.name+" subscription Bangladesh",p.name+" subscription",p.name+" price Bangladesh"];
  const local = p.category==="Adult" ? "" : " in Bangladesh";
  const title = k[0].length<58 ? `${k[0]} | NEXT LEVEL SUBS` : `${p.name}${local} | NEXT LEVEL SUBS`;
  const desc = `Buy ${k[0].replace(/ Bangladesh$/i,"")} from NEXT LEVEL SUBS. View current plans, availability and subscription details on this product page.`;
  let intro = `Explore ${p.name}${local} from NEXT LEVEL SUBS. ${p.description}. View the current subscription options and availability before ordering.`;
  if(slug==="netflix-premium") intro="Explore Netflix Premium in Bangladesh from NEXT LEVEL SUBS. View the available plan options, current price and subscription details before ordering.";
  if(slug==="spotify-premium") intro="Explore Spotify Premium in Bangladesh from NEXT LEVEL SUBS. View the available subscription option, current price and plan details before ordering.";
  if(slug==="youtube-premium") intro="Explore YouTube Premium in Bangladesh from NEXT LEVEL SUBS. View the current subscription option, price and plan details before ordering.";
  if(slug==="canva-pro") intro="Explore Canva Pro in Bangladesh from NEXT LEVEL SUBS. View the current subscription option, price and plan details for Canva's premium design tools.";
  if(slug==="chat-gpt") intro="Explore the ChatGPT subscription offered by NEXT LEVEL SUBS. View the exact plan, current price and availability before ordering.";
  const sections=[
    {h:`${p.name} Subscription`,t:[`${p.name} is available from NEXT LEVEL SUBS as a ${p.category.toLowerCase()} subscription option. ${p.description}.`,`Check the product options on this page for the exact plan and current availability.`]},
    {h:`Why choose ${p.name}?`,t:[`A ${p.name} subscription is designed for customers who want access to the features and content associated with this service.`,`Compare the available option with your needs before placing an order.`]},
    {h:`${p.name} Price and Plans`,t:[`Current pricing, plan duration and availability can change. Use the live product options on this page as the source of truth for the offer currently available from NEXT LEVEL SUBS.`]},
    {h:`How to order ${p.name}`,t:[`Select the available plan, review the order details and continue through the existing NEXT LEVEL SUBS checkout process.`,`If you need help before ordering, use the contact option provided by NEXT LEVEL SUBS.`]}
  ];
  return {keywords:k,title,description:desc,intro,sections};
}

function related(slug,p){return Object.keys(products).filter(k=>k!==slug&&products[k][3]===p.category).slice(0,8).map(k=>({slug:k,name:products[k][0]}));}

function productSchema(p,url,img,desc){
  return {"@context":"https://schema.org","@type":"Product","@id":url+"#product",name:p.name,description:desc,image:[img],url,category:p.category,brand:{"@type":"Brand",name:SITE.name},seller:{"@type":"Organization",name:SITE.name,url:SITE.domain}};
}
function breadcrumbSchema(p,url){return {"@context":"https://schema.org","@type":"BreadcrumbList",itemListElement:[{"@type":"ListItem",position:1,name:"Home",item:SITE.domain+"/"},{"@type":"ListItem",position:2,name:p.category},{"@type":"ListItem",position:3,name:p.name,item:url}]};}
function webpageSchema(p,url,desc){return {"@context":"https://schema.org","@type":"WebPage","@id":url+"#webpage",url,name:p.name+" Subscription | "+SITE.name,description:desc,inLanguage:SITE.language,isPartOf:{"@type":"WebSite",name:SITE.name,url:SITE.domain+"/"},about:{"@type":"Product",name:p.name}};}
function organizationSchema(){return {"@context":"https://schema.org","@type":"Organization",name:SITE.name,url:SITE.domain+"/"};}

module.exports=function handler(req,res){
  if(req.method!=="GET"&&req.method!=="HEAD"){res.statusCode=405;res.setHeader("Allow","GET, HEAD");return res.end("Method Not Allowed");}
  const slug=getSlug(req), raw=slug&&products[slug];
  if(!raw){res.statusCode=404;res.setHeader("Content-Type","text/html; charset=utf-8");res.setHeader("X-Robots-Tag","noindex, nofollow");return res.end("<!doctype html><html lang=\"en\"><head><meta charset=\"utf-8\"><meta name=\"robots\" content=\"noindex,nofollow\"><title>Product Not Found | NEXT LEVEL SUBS</title></head><body><h1>Product Not Found</h1><p><a href=\"/\">Return to NEXT LEVEL SUBS</a></p></body></html>");}
  const p=P(slug), url=`${SITE.domain}/product/${encodeURIComponent(slug)}`, img=imageURL(p), s=seoFor(slug,p), rel=related(slug,p);
  const dest=`${SITE.domain}/details.html?name=${encodeURIComponent(p.name)}`;
  const sections=s.sections.map(x=>`<section><h2>${esc(x.h)}</h2>${x.t.map(y=>`<p>${esc(y)}</p>`).join("")}</section>`).join("");
  const relatedHTML=rel.length?`<section><h2>Related ${esc(p.category)} subscriptions</h2><ul>${rel.map(x=>`<li><a href=\"${SITE.domain}/product/${encodeURIComponent(x.slug)}\">${esc(x.name)}</a></li>`).join("")}</ul></section>`:"";
  const productMap=Object.keys(products).reduce((a,k)=>(a[k]={name:products[k][0]},a),{});
  const html=`<!doctype html><html lang=\"en\"><head><meta charset=\"utf-8\"><meta name=\"viewport\" content=\"width=device-width, initial-scale=1\"><title>${esc(s.title)}</title><meta name=\"description\" content=\"${esc(s.description)}\"><meta name=\"keywords\" content=\"${esc(s.keywords.join(", "))}\"><meta name=\"robots\" content=\"index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1\"><link rel=\"canonical\" href=\"${esc(url)}\"><meta name=\"author\" content=\"${esc(SITE.name)}\"><meta property=\"og:type\" content=\"product\"><meta property=\"og:site_name\" content=\"${esc(SITE.name)}\"><meta property=\"og:locale\" content=\"${SITE.locale}\"><meta property=\"og:title\" content=\"${esc(s.title)}\"><meta property=\"og:description\" content=\"${esc(s.description)}\"><meta property=\"og:url\" content=\"${esc(url)}\"><meta property=\"og:image\" content=\"${esc(img)}\"><meta property=\"og:image:alt\" content=\"${esc(p.name)} subscription\"><meta name=\"twitter:card\" content=\"summary_large_image\"><meta name=\"twitter:title\" content=\"${esc(s.title)}\"><meta name=\"twitter:description\" content=\"${esc(s.description)}\"><meta name=\"twitter:image\" content=\"${esc(img)}\"><link rel=\"preconnect\" href=\"${SITE.domain}\"><script type=\"application/ld+json\">${json(productSchema(p,url,img,s.description))}</script><script type=\"application/ld+json\">${json(breadcrumbSchema(p,url))}</script><script type=\"application/ld+json\">${json(webpageSchema(p,url,s.description))}</script><script type=\"application/ld+json\">${json(organizationSchema())}</script><style>html,body{margin:0;padding:0;font-family:Arial,Helvetica,sans-serif;color:#111;background:#fff}.product-frame{display:block;width:100%;height:100vh;min-height:700px;border:0}.seo-info{max-width:900px;margin:0 auto;padding:40px 20px 60px;line-height:1.7}.seo-info h1{font-size:2rem;line-height:1.2;margin:0 0 12px}.seo-info h2{font-size:1.35rem;margin-top:32px}.seo-info p{margin:10px 0}.seo-info figure{margin:20px 0}.seo-info img{max-width:100%;height:auto;border-radius:12px}.seo-info ul{padding-left:22px}.breadcrumb{font-size:.9rem;margin-bottom:20px}.breadcrumb a{color:inherit}.seo-keywords{font-size:.85rem;opacity:.75;margin-top:25px}@media(max-width:768px){.product-frame{min-height:100vh}.seo-info{padding:30px 16px 50px}.seo-info h1{font-size:1.65rem}}</style></head><body><iframe id=\"productFrame\" class=\"product-frame\" src=\"${esc(dest)}\" title=\"${esc(p.name)}\" loading=\"eager\" allow=\"fullscreen\"></iframe><main class=\"seo-info\"><nav class=\"breadcrumb\" aria-label=\"Breadcrumb\"><a href=\"/\">Home</a> › ${esc(p.category)} › ${esc(p.name)}</nav><article><header><h1>${esc(s.keywords[0])}</h1><p>${esc(s.intro)}</p></header><figure><img src=\"${esc(img)}\" alt=\"${esc(p.name)} subscription\" width=\"1200\" height=\"630\" loading=\"lazy\"><figcaption>${esc(p.name)} from ${esc(SITE.name)}</figcaption></figure>${sections}${relatedHTML}<p class=\"seo-keywords\">Related searches: ${esc(s.keywords.join(" • "))}</p></article></main><script>(function(){"use strict";var HOME=${json(SITE.domain+"/")},BASE=HOME+"product/",CURRENT=${json(slug)},MAP=${json(productMap)},frame=document.getElementById("productFrame");function goHome(){window.top.location.href=HOME}function byName(n){n=String(n||"").trim().toLowerCase();for(var k in MAP){if(MAP[k].name.toLowerCase()===n)return k}var g=n.replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"");return MAP[g]?g:""}function go(s){if(MAP[s]&&s!==CURRENT)window.top.location.href=BASE+encodeURIComponent(s)}function inspect(){try{var u=new URL(frame.contentWindow.location.href),m=u.pathname.match(/^\\/product\\/([^/]+)\\/?$/i);if(m&&MAP[decodeURIComponent(m[1]).toLowerCase()])return go(decodeURIComponent(m[1]).toLowerCase());if(/details\\.html/i.test(u.pathname)){var n=u.searchParams.get("name");if(n)go(byName(n));}if(u.pathname==="/"||/\\/index\\.html$/i.test(u.pathname))goHome()}catch(e){}}window.addEventListener("message",function(e){if(!e.data)return;if(e.data.type==="NLS_GO_HOME")return goHome();if(e.data.type==="NLS_NAVIGATE_PRODUCT")return go(e.data.productSlug&&MAP[e.data.productSlug]?e.data.productSlug:byName(e.data.productName||e.data.productSlug))});frame.addEventListener("load",function(){try{frame.contentWindow.document.addEventListener("click",function(e){var a=e.target.closest&&e.target.closest("a");if(!a)return;try{var u=new URL(a.href,frame.contentWindow.location.href),m=u.pathname.match(/^\\/product\\/([^/]+)\\/?$/i);if(m&&MAP[decodeURIComponent(m[1]).toLowerCase()]){e.preventDefault();e.stopPropagation();go(decodeURIComponent(m[1]).toLowerCase());return}if(/details\\.html/i.test(u.pathname)){var n=u.searchParams.get("name"),s=byName(n);if(s){e.preventDefault();e.stopPropagation();go(s)}}}catch(_){}},true)}catch(_){}});setInterval(inspect,700);setTimeout(inspect,700)})();</script></body></html>`;
  res.statusCode=200;res.setHeader("Content-Type","text/html; charset=utf-8");res.setHeader("Content-Language",SITE.language);res.setHeader("X-Content-Type-Options","nosniff");res.setHeader("X-Robots-Tag","index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1");res.setHeader("Cache-Control","public, max-age=300, s-maxage=3600, stale-while-revalidate=86400");if(req.method==="HEAD")return res.end();return res.end(html);
};
