"use strict";

/* Next Level Subs — premium UX polish for the existing Reviews tab. */
(() => {
  const path = window.location.pathname;
  if (!/\/details\.html$/i.test(path) && !/\/product\//i.test(path)) return;

  const STYLE_ID = "nls-review-ux-polish";

  function addStyles() {
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = `
      /* Keep Reviews identical to Description / Features / FAQ tab behavior. */
      .tab-button[data-nls-review-tab]::after { transition: width .3s ease; }
      .tab-button:focus-visible { outline: 3px solid rgba(106,17,203,.20); outline-offset: 3px; }

      /* Premium review summary surface. */
      #tabContent .nls-premium-reviews > :first-child {
        position: relative;
        overflow: hidden;
        border-radius: 20px;
      }
      #tabContent .nls-premium-review-header {
        border: 1px solid rgba(106,17,203,.12);
        background: linear-gradient(135deg, rgba(106,17,203,.055), rgba(37,117,252,.035) 55%, rgba(255,255,255,.98));
        box-shadow: 0 12px 32px rgba(15,23,42,.055);
      }
      #tabContent .nls-premium-review-header::after {
        content: "";
        position: absolute;
        width: 180px; height: 180px;
        right: -90px; top: -100px;
        border-radius: 50%;
        background: radial-gradient(circle, rgba(106,17,203,.13), transparent 68%);
        pointer-events: none;
      }

      /* Write/Edit button: premium micro-interaction without changing the page language. */
      #tabContent #nlsWriteReview {
        position: relative;
        isolation: isolate;
        overflow: hidden;
        min-height: 44px;
        border-radius: 12px !important;
        transition: transform .3s cubic-bezier(.16,1,.3,1), box-shadow .3s ease, filter .3s ease;
      }
      #tabContent #nlsWriteReview::before {
        content: "";
        position: absolute;
        inset: 0 auto 0 -75%;
        width: 45%;
        transform: skewX(-18deg);
        background: linear-gradient(90deg, transparent, rgba(255,255,255,.30), transparent);
        transition: left .65s cubic-bezier(.16,1,.3,1);
        pointer-events: none;
      }
      #tabContent #nlsWriteReview:hover { transform: translateY(-2px); box-shadow: 0 10px 24px rgba(106,17,203,.18); }
      #tabContent #nlsWriteReview:hover::before { left: 130%; }
      #tabContent #nlsWriteReview:active { transform: translateY(0) scale(.985); }
      #tabContent #nlsWriteReview:focus-visible { outline: 3px solid rgba(106,17,203,.20); outline-offset: 3px; }

      /* Review cards: clear hierarchy, depth, and touch-friendly targets. */
      #tabContent [data-review-id] {
        border: 1px solid rgba(226,232,240,.92) !important;
        border-radius: 18px !important;
        padding: 18px !important;
        background: rgba(255,255,255,.98);
        box-shadow: 0 5px 18px rgba(15,23,42,.035);
        transition: transform .25s cubic-bezier(.16,1,.3,1), box-shadow .25s ease, border-color .25s ease;
      }
      #tabContent [data-review-id]:hover {
        transform: translateY(-2px);
        border-color: rgba(106,17,203,.16) !important;
        box-shadow: 0 14px 30px rgba(15,23,42,.075);
      }
      #tabContent [data-review-id] [data-reply],
      #tabContent [data-review-id] [data-edit] {
        min-height: 36px;
        border-radius: 9px;
        padding: 6px 9px;
        transition: background .2s ease, color .2s ease, transform .2s ease;
      }
      #tabContent [data-review-id] [data-reply]:hover,
      #tabContent [data-review-id] [data-edit]:hover {
        background: #f5f3ff;
        color: #6d28d9;
        transform: translateY(-1px);
      }
      #tabContent .nls-existing-verified {
        border: 1px solid #bbf7d0;
        box-shadow: 0 2px 7px rgba(16,185,129,.08);
      }

      /* Media becomes a clean gallery instead of loose thumbnails. */
      #tabContent .nls-existing-media-grid { gap: 10px !important; }
      #tabContent .nls-existing-media-grid img,
      #tabContent .nls-existing-media-grid video {
        width: 96px !important;
        height: 78px !important;
        border-radius: 12px !important;
        border: 1px solid #e5e7eb !important;
        box-shadow: 0 4px 12px rgba(15,23,42,.07);
        transition: transform .22s ease, box-shadow .22s ease;
      }
      #tabContent .nls-existing-media-grid img:hover,
      #tabContent .nls-existing-media-grid video:hover { transform: scale(1.045); box-shadow: 0 10px 22px rgba(15,23,42,.14); }

      /* Composer: clearer structure and premium focus state. */
      #tabContent .nls-existing-review-form {
        position: relative;
        overflow: hidden;
        border-radius: 18px !important;
        border: 1px solid rgba(106,17,203,.14) !important;
        background: linear-gradient(135deg,#fff,#faf8ff) !important;
        box-shadow: 0 14px 35px rgba(79,70,229,.075) !important;
      }
      #tabContent .nls-existing-review-form::before {
        content: "";
        position: absolute;
        top: 0; left: 0; right: 0; height: 2px;
        background: linear-gradient(90deg,var(--primary-color,#6a11cb),var(--secondary-color,#2575fc));
      }
      #tabContent .nls-existing-rating-picker button {
        transition: transform .18s cubic-bezier(.16,1,.3,1), color .18s ease, filter .18s ease;
      }
      #tabContent .nls-existing-rating-picker button:hover { transform: translateY(-3px) scale(1.10); filter: drop-shadow(0 4px 7px rgba(250,204,21,.22)); }
      #tabContent .nls-existing-upload { transition: background .2s ease, border-color .2s ease, transform .2s ease; }
      #tabContent .nls-existing-upload:hover { transform: translateY(-1px); }
      #tabContent #nlsExistingSubmit { transition: transform .2s ease, box-shadow .2s ease, filter .2s ease; }
      #tabContent #nlsExistingSubmit:hover { transform: translateY(-2px); box-shadow: 0 11px 24px rgba(79,70,229,.22); filter: saturate(1.07); }
      #tabContent #nlsExistingSubmit:active { transform: scale(.985); }

      /* Replies stay visually subordinate to the main review. */
      #tabContent .nls-existing-replies { border-left-color: #ede9fe !important; }
      #tabContent .nls-existing-reply { border: 1px solid #eef2f7; background: linear-gradient(135deg,#fafaff,#f8fafc) !important; }
      #tabContent .nls-existing-reply-box input { min-height: 42px; border-radius: 12px !important; transition: border-color .2s, box-shadow .2s; }
      #tabContent .nls-existing-reply-box input:focus { border-color: #8b5cf6 !important; box-shadow: 0 0 0 4px rgba(139,92,246,.10) !important; }
      #tabContent .nls-existing-reply-box button { min-height: 42px; border-radius: 12px !important; }

      @media (max-width: 640px) {
        #tabContent [data-review-id] { padding: 14px !important; border-radius: 15px !important; }
        #tabContent .nls-existing-media-grid img,
        #tabContent .nls-existing-media-grid video { width: 78px !important; height: 64px !important; }
        #tabContent #nlsWriteReview { width: 100%; justify-content: center; }
      }

      @media (prefers-reduced-motion: reduce) {
        #tabContent #nlsWriteReview,
        #tabContent #nlsWriteReview::before,
        #tabContent [data-review-id],
        #tabContent .nls-existing-rating-picker button,
        #tabContent .nls-existing-submit { transition-duration: .01ms !important; }
      }
    `;
    document.head.appendChild(style);
  }

  function markReviewTab() {
    document.querySelectorAll(".tab-button").forEach(button => {
      if (/\breviews?\b/i.test(button.textContent || "")) button.setAttribute("data-nls-review-tab", "true");
    });
  }

  function syncReviewTab(tab) {
    if (tab !== "reviews") return;
    document.querySelectorAll(".tab-button").forEach(button => {
      button.classList.toggle("active", /\breviews?\b/i.test(button.textContent || ""));
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
