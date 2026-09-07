(function () {
  "use strict";

  if (window.__NLSMobileViewportFixLoaded) return;
  window.__NLSMobileViewportFixLoaded = true;

  const MOBILE_MAX = 1024;
  const STYLE_ID = "nls-mobile-viewport-fix";

  function ensureViewportMeta() {
    let meta = document.querySelector('meta[name="viewport"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.name = "viewport";
      document.head.appendChild(meta);
    }
    meta.setAttribute("content", "width=device-width, initial-scale=1, viewport-fit=cover");
  }

  function injectStyles() {
    if (document.getElementById(STYLE_ID)) return;

    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = `
      :root {
        --nls-viewport-width: 100vw;
        --nls-viewport-height: 100dvh;
        --nls-safe-top: env(safe-area-inset-top, 0px);
        --nls-safe-right: env(safe-area-inset-right, 0px);
        --nls-safe-bottom: env(safe-area-inset-bottom, 0px);
        --nls-safe-left: env(safe-area-inset-left, 0px);
      }

      html {
        width: 100%;
        max-width: 100%;
        min-height: 100%;
        -webkit-text-size-adjust: 100%;
        text-size-adjust: 100%;
        overflow-x: clip;
      }

      body {
        width: 100%;
        max-width: 100%;
        min-width: 0;
        min-height: 100vh;
        min-height: 100svh;
        min-height: 100dvh;
        margin: 0;
        overflow-x: clip;
      }

      img, video, canvas, svg, iframe {
        max-width: 100%;
      }

      input, textarea, select, button {
        max-width: 100%;
      }

      @media (max-width: ${MOBILE_MAX}px) {
        html, body {
          width: 100%;
          max-width: 100%;
          min-width: 0;
        }

        /* Prevent fixed-width children from creating a horizontal viewport. */
        body > *, main, header, footer, section, article, aside, nav,
        .nls-container, .dashboard-wrapper, .header-inner {
          max-width: 100%;
        }

        /* Account for iPhone/Android browser safe areas without changing the
           visual layout on devices that do not have a safe-area inset. */
        .nls-header {
          padding-top: var(--nls-safe-top);
        }

        /* Fixed mobile bottom navigation stays above the home indicator. */
        #nls-mobile-bottom-nav {
          bottom: max(10px, var(--nls-safe-bottom));
        }

        /* Use dynamic viewport height for full-height mobile panels/modals. */
        .nls-drawer,
        .mobile-menu,
        [data-mobile-full-height],
        .mobile-full-height {
          max-height: calc(100dvh - var(--nls-safe-top) - var(--nls-safe-bottom));
        }

        /* Prevent long unbroken strings from widening the page. */
        body, body * {
          overflow-wrap: break-word;
        }
      }

      @media (min-width: ${MOBILE_MAX + 1}px) {
        .nls-header {
          padding-top: 0;
        }
      }
    `;
    document.head.appendChild(style);
  }

  function updateVisualViewportVars() {
    if (!window.visualViewport) return;
    const vv = window.visualViewport;
    document.documentElement.style.setProperty("--nls-viewport-width", `${vv.width}px`);
    document.documentElement.style.setProperty("--nls-viewport-height", `${vv.height}px`);
  }

  function init() {
    ensureViewportMeta();
    injectStyles();
    updateVisualViewportVars();

    if (window.visualViewport) {
      window.visualViewport.addEventListener("resize", updateVisualViewportVars, { passive: true });
      window.visualViewport.addEventListener("scroll", updateVisualViewportVars, { passive: true });
    }
    window.addEventListener("resize", updateVisualViewportVars, { passive: true });
    window.addEventListener("orientationchange", function () {
      setTimeout(updateVisualViewportVars, 80);
    }, { passive: true });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
