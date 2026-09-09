"use strict";

/* Next Level Subs — responsive rating distribution/table polish.
 * Keeps every rating row visible while preventing the review summary from
 * becoming excessively wide on phones, tablets, or narrow desktop layouts.
 */
(() => {
  if (!/\/details\.html$/i.test(window.location.pathname)) return;

  const STYLE_ID = "nls-review-responsive-table-fix";

  function addStyles() {
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = `
      /* Rating distribution: compact, fluid, and never horizontally overflowing. */
      #tabContent .nls-premium-bars {
        width: 100% !important;
        max-width: 100% !important;
        box-sizing: border-box !important;
        display: grid !important;
        grid-template-columns: repeat(5, minmax(0, 1fr)) !important;
        gap: 8px !important;
        padding: 10px !important;
        margin-top: 10px !important;
        overflow: hidden !important;
      }

      #tabContent .nls-premium-bars > * {
        min-width: 0 !important;
        width: 100% !important;
        box-sizing: border-box !important;
        display: grid !important;
        grid-template-columns: auto minmax(24px, 1fr) auto !important;
        align-items: center !important;
        gap: 6px !important;
        min-height: 30px !important;
        padding: 5px 7px !important;
        border: 1px solid #eef1f5 !important;
        border-radius: 9px !important;
        background: rgba(248,250,252,.72) !important;
        font-size: 11px !important;
        line-height: 1.1 !important;
        overflow: hidden !important;
      }

      #tabContent .nls-premium-bars > * > * {
        min-width: 0 !important;
      }

      #tabContent .nls-premium-bars .nls-premium-bar {
        width: 100% !important;
        min-width: 24px !important;
        height: 5px !important;
        margin: 0 !important;
      }

      #tabContent .nls-premium-bars .nls-premium-bar > div {
        min-width: 0 !important;
      }

      /* If the original row has no progress-bar element, keep its label/count compact. */
      #tabContent .nls-premium-bars > *:not(:has(.nls-premium-bar)) {
        grid-template-columns: minmax(0,1fr) auto !important;
      }

      #tabContent .nls-premium-bars > *:not(:has(.nls-premium-bar)) > :first-child {
        overflow: hidden !important;
        text-overflow: ellipsis !important;
        white-space: nowrap !important;
      }

      /* Tablet / narrow layouts: two columns keeps all five ratings readable. */
      @media (max-width: 900px) {
        #tabContent .nls-premium-bars {
          grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
          gap: 7px !important;
          padding: 9px !important;
        }
      }

      /* Phones: one compact row per rating, with no giant empty horizontal areas. */
      @media (max-width: 520px) {
        #tabContent .nls-premium-bars {
          grid-template-columns: 1fr !important;
          gap: 5px !important;
          padding: 7px !important;
          margin-top: 8px !important;
        }

        #tabContent .nls-premium-bars > * {
          grid-template-columns: 32px minmax(0, 1fr) 24px !important;
          min-height: 27px !important;
          padding: 4px 7px !important;
          border-radius: 8px !important;
          font-size: 11px !important;
        }

        #tabContent .nls-premium-bars > *:not(:has(.nls-premium-bar)) {
          grid-template-columns: minmax(0,1fr) 24px !important;
        }

        #tabContent .nls-premium-bars .nls-premium-bar {
          min-width: 30px !important;
          height: 4px !important;
        }
      }

      @media (max-width: 360px) {
        #tabContent .nls-premium-bars {
          padding: 6px !important;
          gap: 4px !important;
        }

        #tabContent .nls-premium-bars > * {
          min-height: 25px !important;
          padding: 3px 6px !important;
        }
      }

      @media (prefers-reduced-motion: reduce) {
        #tabContent .nls-premium-bars .nls-premium-bar > div {
          transition: none !important;
        }
      }
    `;
    document.head.appendChild(style);
  }

  function apply() {
    addStyles();
    const tab = document.getElementById("tabContent");
    if (!tab) return;
    const bars = tab.querySelector(".nls-premium-bars");
    if (!bars) return;

    /* Remove utility classes that force the original wide multi-column layout. */
    bars.classList.remove("grid-cols-1", "md:grid-cols-2", "lg:grid-cols-2", "xl:grid-cols-2");
    bars.setAttribute("data-nls-responsive-rating-table", "true");
  }

  function start() {
    addStyles();
    apply();
    const observer = new MutationObserver(() => {
      if (document.getElementById("tabContent")?.querySelector(".nls-premium-bars")) apply();
    });
    if (document.body) observer.observe(document.body, { childList: true, subtree: true });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start, { once: true });
  else start();
})();
