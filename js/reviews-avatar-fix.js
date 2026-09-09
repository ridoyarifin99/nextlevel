"use strict";

/* Next Level Subs — safe review avatar rendering.
 * Prevents malformed inline onerror markup from leaking quote/greater-than
 * characters into the review layout, and provides a clean initial fallback.
 */
(() => {
  const AVATAR_SELECTOR = ".nls-review-avatar";
  const ARTIFACT_RE = /^\s*[\"'`>]+\s*$/;

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
      if (ARTIFACT_RE.test(node.nodeValue || "")) node.remove();
    });
  }

  function repair(root = document) {
    root.querySelectorAll?.(AVATAR_SELECTOR).forEach(avatar => {
      const parent = avatar.parentElement;
      cleanParent(parent);
      if (avatar.tagName !== "IMG") return;
      if (avatar.dataset.nlsAvatarSafe === "1") return;
      avatar.dataset.nlsAvatarSafe = "1";
      avatar.removeAttribute("onerror");
      avatar.addEventListener("error", () => fallbackFor(avatar), { once: true });
      if (avatar.complete && avatar.naturalWidth === 0) fallbackFor(avatar);
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
