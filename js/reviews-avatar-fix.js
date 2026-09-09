"use strict";

/* Next Level Subs — repair legacy review avatar fallback markup.
 * The existing review renderer previously emitted escaped quotes inside an
 * HTML onerror attribute. Browsers can parse those quotes as real attribute
 * delimiters, leaving stray text such as `">` or the fallback initial beside
 * the avatar. This patch repairs the already-rendered DOM and installs a safe
 * error handler for future avatar failures.
 */
(() => {
  const AVATAR_SELECTOR = ".nls-review-avatar";

  function fallbackFor(img) {
    if (!img || !img.parentNode) return;
    const name = img.getAttribute("alt") || "Customer";
    const initial = Array.from(name.trim())[0]?.toUpperCase() || "C";
    const fallback = document.createElement("div");
    fallback.className = "nls-review-avatar nls-review-avatar-fallback";
    fallback.setAttribute("aria-label", name);
    fallback.textContent = initial;
    img.replaceWith(fallback);
  }

  function cleanParent(parent) {
    if (!parent) return;
    [...parent.childNodes].forEach(node => {
      if (node.nodeType !== Node.TEXT_NODE) return;
      const text = node.nodeValue || "";
      if (!text.trim()) return;
      if (/^\s*">\s*$/.test(text) || /^\s*>\s*$/.test(text) || /^\s*[A-Za-z]\s*$/.test(text)) {
        node.remove();
      }
    });
  }

  function repair(root = document) {
    root.querySelectorAll?.(".nls-review-author, .nls-existing-reply").forEach(parent => {
      cleanParent(parent);
      const image = parent.querySelector(":scope > .nls-review-avatar");
      if (image?.tagName === "IMG") {
        parent.querySelectorAll(":scope > .nls-review-avatar-fallback").forEach(node => node.remove());
      }
    });

    root.querySelectorAll?.(AVATAR_SELECTOR).forEach(avatar => {
      const parent = avatar.parentElement;
      if (avatar.tagName !== "IMG") return;
      if (avatar.dataset.nlsAvatarSafe === "1") return;

      avatar.dataset.nlsAvatarSafe = "1";
      avatar.removeAttribute("onerror");
      avatar.addEventListener("error", () => fallbackFor(avatar), { once: true });

      if (avatar.complete && avatar.naturalWidth === 0) fallbackFor(avatar);
      cleanParent(parent);
    });
  }

  function boot() {
    repair(document);
    const target = document.getElementById("tabContent") || document.body;
    if (!target || target.dataset.nlsAvatarObserver === "1") return;
    target.dataset.nlsAvatarObserver = "1";
    new MutationObserver(() => repair(target)).observe(target, { childList: true, subtree: true });
    let attempts = 0;
    const timer = setInterval(() => {
      repair(target);
      if (++attempts >= 100) clearInterval(timer);
    }, 50);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot, { once: true });
  else boot();
})();
