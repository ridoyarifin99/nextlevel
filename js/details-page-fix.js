(function () {
  "use strict";

  /* This file is intentionally scoped to product detail pages. */
  const isProductPage = /\/product\//i.test(window.location.pathname) || /details\.html$/i.test(window.location.pathname);
  if (!isProductPage || window.__NLSDetailsFixLoaded) return;
  window.__NLSDetailsFixLoaded = true;

  const SITE = "https://www.nextlevelsubs.com";

  function slugFromUrl() {
    const match = window.location.pathname.match(/\/product\/([^/?#]+)/i);
    if (match) return decodeURIComponent(match[1]);
    try {
      const params = new URLSearchParams(window.location.search);
      return params.get("slug") || params.get("product") || "";
    } catch (_) {
      return "";
    }
  }

  function titleize(slug) {
    return slug.replace(/[-_]+/g, " ").replace(/\b\w/g, c => c.toUpperCase()).trim();
  }

  function setMeta(name, content) {
    if (!content) return;
    let el = document.querySelector(`meta[name="${name}"]`);
    if (!el) {
      el = document.createElement("meta");
      el.setAttribute("name", name);
      document.head.appendChild(el);
    }
    el.setAttribute("content", content);
  }

  function setOg(property, content) {
    if (!content) return;
    let el = document.querySelector(`meta[property="${property}"]`);
    if (!el) {
      el = document.createElement("meta");
      el.setAttribute("property", property);
      document.head.appendChild(el);
    }
    el.setAttribute("content", content);
  }

  function fixSeo() {
    const slug = slugFromUrl();
    if (!slug) return;
    const fallbackName = titleize(slug);
    const heading = document.querySelector("h1, [data-product-name], .product-title, .details-title");
    const productName = (heading && heading.textContent.trim()) || fallbackName;
    const description = (document.querySelector('meta[name="description"]')?.content ||
      `Buy ${productName} subscription in Bangladesh from Next Level Subs. View plans, pricing, features and instant delivery options.`);
    const canonicalUrl = `${SITE}/product/${encodeURIComponent(slug)}`;

    document.title = `${productName} Subscription | NEXT LEVEL SUBS`;
    setMeta("description", description.slice(0, 160));
    setMeta("twitter:title", document.title);
    setMeta("twitter:description", description.slice(0, 200));
    setOg("og:title", document.title);
    setOg("og:description", description.slice(0, 200));
    setOg("og:url", canonicalUrl);

    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    canonical.href = canonicalUrl;
  }

  function fixRuntimeConfig() {
    if (window.AUTH_API_BASE && /localhost|127\.0\.0\.1/i.test(window.AUTH_API_BASE)) {
      window.AUTH_API_BASE = "";
    }
  }

  function normalizeUrl(value) {
    if (!value || typeof value !== "string") return value;
    let src = value.trim();
    if (!src) return src;
    if (/^https?:\/\//i.test(src) || src.startsWith("data:") || src.startsWith("blob:")) return src;
    src = src.replace(/^\.\//, "/");
    src = src.replace(/^\.\.\//, "/");
    src = src.replace(/\/assets\/assets\//g, "/assets/");
    if (src.includes("/assets/") && !src.startsWith("/assets/")) {
      src = "/assets/" + src.split("/assets/").pop();
    }
    return src;
  }

  function fixImages() {
    document.querySelectorAll("img, source").forEach(el => {
      ["src", "srcset"].forEach(attr => {
        const value = el.getAttribute(attr);
        if (!value) return;
        if (attr === "srcset") {
          const fixed = value.split(",").map(part => {
            const bits = part.trim().split(/\s+/);
            bits[0] = normalizeUrl(bits[0]);
            return bits.join(" ");
          }).join(", ");
          if (fixed !== value) el.setAttribute(attr, fixed);
        } else {
          const fixed = normalizeUrl(value);
          if (fixed !== value) el.setAttribute(attr, fixed);
        }
      });
    });
  }

  function fixFavoriteIds() {
    const icons = document.querySelectorAll("#favoriteIcon");
    icons.forEach((el, index) => {
      if (index > 0) el.id = `favoriteIcon-${index + 1}`;
    });
  }

  function fixInteractiveCards() {
    document.querySelectorAll("a").forEach(a => {
      const buttons = a.querySelectorAll("button");
      if (!buttons.length) return;
      buttons.forEach(button => {
        const replacement = document.createElement("span");
        replacement.className = button.className;
        replacement.innerHTML = button.innerHTML;
        [...button.attributes].forEach(attr => {
          if (attr.name !== "id" && attr.name !== "type") replacement.setAttribute(attr.name, attr.value);
        });
        a.replaceChild(replacement, button);
      });
    });
  }

  function fixBuyNowLabel() {
    const candidates = [...document.querySelectorAll("button, a")].filter(el =>
      /buy\s*now/i.test(el.textContent || "")
    );
    candidates.forEach(el => {
      const icon = el.querySelector("i");
      if (icon) {
        icon.classList.remove("fa-whatsapp", "fab", "fa-whatsapp-square");
        icon.classList.add("fa-solid", "fa-bag-shopping");
      }
      el.setAttribute("aria-label", "Buy now");
    });
  }

  function fixNetflixTvCopy() {
    const bodyText = document.body.textContent || "";
    if (!/Netflix\s+For\s+TV/i.test(bodyText)) return;
    const headings = [...document.querySelectorAll("h1,h2,h3,h4,p")];
    headings.forEach(el => {
      const text = el.textContent.trim();
      if (/Crunchyroll/i.test(text) && /Netflix|TV|subscription/i.test(bodyText)) {
        el.textContent = text.replace(/Crunchyroll/gi, "Netflix For TV");
      }
    });
  }

  function runFixes() {
    fixRuntimeConfig();
    fixSeo();
    fixImages();
    fixFavoriteIds();
    fixInteractiveCards();
    fixBuyNowLabel();
    fixNetflixTvCopy();
  }

  function init() {
    runFixes();
    let scheduled = false;
    const observer = new MutationObserver(() => {
      if (scheduled) return;
      scheduled = true;
      requestAnimationFrame(() => {
        scheduled = false;
        runFixes();
      });
    });
    observer.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ["src", "srcset"] });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
