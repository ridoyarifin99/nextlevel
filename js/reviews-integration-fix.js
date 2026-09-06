"use strict";

/*
 * Next Level Subs — single review-tab integration
 *
 * The product page historically contained a static customer-review panel.
 * The Supabase review system is now the single source of truth. This file
 * keeps the existing Reviews tab, hides the legacy panel, and places the
 * Supabase review UI in the tab-content area.
 */
(() => {
  if (!/\/details\.html$/i.test(window.location.pathname)) return;

  const LEGACY_REVIEW_ID = "f20q1p";
  let wired = false;

  const textOf = el => (el?.textContent || "").replace(/\s+/g, " ").trim();

  function hideLegacyPanel() {
    const legacy = document.getElementById(LEGACY_REVIEW_ID);
    if (legacy) {
      legacy.hidden = true;
      legacy.setAttribute("aria-hidden", "true");
      legacy.style.setProperty("display", "none", "important");
    }
  }

  function findReviewTab() {
    const candidates = document.querySelectorAll(
      'button, a, [role="tab"], [data-tab], [data-target], [onclick]'
    );
    return Array.from(candidates).find(el => {
      const text = textOf(el).toLowerCase();
      return text === "reviews" || text.startsWith("reviews ") || text.includes("reviews (");
    }) || null;
  }

  function placeSupabaseReviews() {
    const section = document.getElementById("nlsReviews");
    const legacy = document.getElementById(LEGACY_REVIEW_ID);
    if (!section) return;

    hideLegacyPanel();

    if (legacy?.parentElement && section.parentElement !== legacy.parentElement) {
      legacy.parentElement.insertBefore(section, legacy);
    }

    section.dataset.singleReviewSystem = "true";
  }

  function openReviews(event) {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
      if (typeof event.stopImmediatePropagation === "function") event.stopImmediatePropagation();
    }

    hideLegacyPanel();
    placeSupabaseReviews();

    const section = document.getElementById("nlsReviews");
    if (section) {
      section.hidden = false;
      section.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }

    /* reviews.js may still be waiting for details.js/product data. */
    let tries = 0;
    const timer = setInterval(() => {
      tries += 1;
      hideLegacyPanel();
      placeSupabaseReviews();
      const target = document.getElementById("nlsReviews");
      if (target || tries >= 40) {
        clearInterval(timer);
        if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 100);
  }

  function wire() {
    hideLegacyPanel();
    placeSupabaseReviews();

    const tab = findReviewTab();
    if (tab && tab.dataset.nlsReviewTabWired !== "true") {
      tab.dataset.nlsReviewTabWired = "true";
      tab.addEventListener("click", openReviews, true);
      wired = true;
    }
  }

  /* Capture phase wins over the old inline/tab handler. */
  document.addEventListener("click", event => {
    const tab = event.target?.closest?.('button, a, [role="tab"], [data-tab], [data-target], [onclick]');
    if (!tab) return;
    const text = textOf(tab).toLowerCase();
    if (text === "reviews" || text.startsWith("reviews ") || text.includes("reviews (")) {
      openReviews(event);
    }
  }, true);

  const observer = new MutationObserver(() => {
    hideLegacyPanel();
    placeSupabaseReviews();
    if (!wired) wire();
  });

  function start() {
    wire();
    observer.observe(document.body, { childList: true, subtree: true });
    setTimeout(wire, 250);
    setTimeout(wire, 1000);
    setTimeout(wire, 2500);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start, { once: true });
  else start();
})();
