"use strict";

/* Next Level Subs — review tab UX polish.
 * Keeps the existing Reviews UI and synchronizes its behavior with the
 * Description / Features / FAQ tab interaction.
 */
(() => {
  const path = window.location.pathname;
  if (!/\/details\.html$/i.test(path) && !/\/product\//i.test(path)) return;

  const STYLE_ID = "nls-review-ux-polish";

  function addStyles() {
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = `
      /* The Reviews tab must look and animate exactly like every other tab. */
      .tab-button[data-nls-review-tab],
      .tab-button:not([data-nls-review-tab]) { transition: var(--transition, all .3s cubic-bezier(.16,1,.3,1)); }

      /* Keep the existing tab-button underline system authoritative. */
      .tab-button[data-nls-review-tab]::after { transition: width .3s ease; }

      /* Review action button: premium, but visually consistent with the page. */
      #tabContent #nlsWriteReview {
        position: relative;
        isolation: isolate;
        overflow: hidden;
        min-height: 44px;
        border-radius: 12px !important;
        transition: transform .3s cubic-bezier(.16,1,.3,1), box-shadow .3s ease, filter .3s ease, background .3s ease;
      }
      #tabContent #nlsWriteReview::before {
        content: "";
        position: absolute;
        inset: 0 auto 0 -75%;
        width: 45%;
        transform: skewX(-18deg);
        background: linear-gradient(90deg, transparent, rgba(255,255,255,.28), transparent);
        transition: left .65s cubic-bezier(.16,1,.3,1);
        pointer-events: none;
      }
      #tabContent #nlsWriteReview:hover { transform: translateY(-2px); box-shadow: 0 10px 24px rgba(106,17,203,.18); }
      #tabContent #nlsWriteReview:hover::before { left: 130%; }
      #tabContent #nlsWriteReview:active { transform: translateY(0) scale(.985); }
      #tabContent #nlsWriteReview:focus-visible,
      .tab-button:focus-visible { outline: 3px solid rgba(106,17,203,.22); outline-offset: 3px; }

      /* Composer hierarchy and clearer states. */
      #tabContent .nls-existing-review-form { position: relative; overflow: hidden; }
      #tabContent .nls-existing-review-form::before {
        content: "";
        position: absolute;
        top: 0; left: 0; right: 0; height: 2px;
        background: linear-gradient(90deg, var(--primary-color,#6a11cb), var(--secondary-color,#2575fc));
        opacity: .8;
      }
      #tabContent .nls-existing-review-text { transition: border-color .2s ease, box-shadow .2s ease, background .2s ease; }
      #tabContent .nls-existing-review-text:focus { background: #fff; }
      #tabContent .nls-existing-submit-loading { pointer-events: none; opacity: .72; }

      @media (prefers-reduced-motion: reduce) {
        #tabContent #nlsWriteReview,
        #tabContent #nlsWriteReview::before,
        #tabContent .nls-existing-review-text { transition-duration: .01ms !important; }
      }
    `;
    document.head.appendChild(style);
  }

  function markReviewTab() {
    document.querySelectorAll(".tab-button").forEach(button => {
      const isReviews = /\breviews?\b/i.test(button.textContent || "");
      if (isReviews) button.setAttribute("data-nls-review-tab", "true");
    });
  }

  function syncReviewTab(tab) {
    if (tab !== "reviews") return;
    document.querySelectorAll(".tab-button").forEach(button => {
      const isReviews = /\breviews?\b/i.test(button.textContent || "");
      button.classList.toggle("active", isReviews);
    });
  }

  function patchSwitchTab() {
    if (window.__nlsReviewUxSwitchPatched || typeof window.switchTab !== "function") return;
    const original = window.switchTab;
    window.switchTab = function(tab) {
      syncReviewTab(tab);
      return original.apply(this, arguments);
    };
    window.__nlsReviewUxSwitchPatched = true;
  }

  function boot() {
    addStyles();
    markReviewTab();
    patchSwitchTab();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot, { once: true });
  else boot();

  const observer = new MutationObserver(() => {
    markReviewTab();
    patchSwitchTab();
  });
  if (document.body) observer.observe(document.body, { childList: true, subtree: true });
})();
