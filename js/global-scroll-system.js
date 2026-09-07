"use strict";

/*
 * Next Level Subs — Global scrolling system
 *
 * One consistent scroll model for every page:
 * - native document scrolling (no page-specific fake scrollers)
 * - smooth anchor scrolling with reduced-motion support
 * - mobile momentum/touch scrolling and safe bottom-nav spacing
 * - horizontal overflow protection
 * - stable scroll restoration after navigation
 * - safe modal scroll locking that restores the exact previous position
 * - nested panels can still scroll independently
 *
 * This file intentionally does NOT hide the mobile bottom navigation.
 */
(function () {
  if (window.__NLS_GLOBAL_SCROLL_SYSTEM__) return;
  window.__NLS_GLOBAL_SCROLL_SYSTEM__ = true;

  var STYLE_ID = "nls-global-scroll-system-style";
  var LOCK_CLASS = "nls-scroll-locked";
  var lockState = null;

  function injectStyles() {
    if (document.getElementById(STYLE_ID)) return;

    var style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = `
      :root {
        --nls-bottom-nav-space: 0px;
        --nls-scrollbar-size: 8px;
      }

      html {
        scroll-behavior: smooth;
        scroll-padding-top: var(--nls-scroll-top-offset, 0px);
        scroll-padding-bottom: var(--nls-bottom-nav-space);
        overscroll-behavior-x: none;
        overflow-x: clip;
        -webkit-text-size-adjust: 100%;
      }

      body {
        min-height: 100%;
        max-width: 100%;
        overflow-x: clip;
        -webkit-overflow-scrolling: touch;
        overscroll-behavior-x: none;
      }

      /* Keep the document as the primary scroller. */
      body:not(.${LOCK_CLASS}) {
        overflow-y: auto;
      }

      /* Never let fixed mobile navigation consume the last content row. */
      @media (max-width: 1023px) {
        :root { --nls-bottom-nav-space: calc(78px + env(safe-area-inset-bottom)); }

        body {
          padding-bottom: var(--nls-bottom-nav-space);
        }

        main, #main, .main-content, .page-content, .content-wrapper {
          scroll-margin-bottom: var(--nls-bottom-nav-space);
        }
      }

      /* Standard nested scroll surfaces. */
      [data-scroll-container],
      .scroll-container,
      .overflow-y-auto,
      .overflow-auto,
      .modal-body,
      .drawer-content,
      .cart-sidebar,
      .nls-drawer,
      .mobile-menu,
      .dropdown-menu {
        -webkit-overflow-scrolling: touch;
        overscroll-behavior: contain;
        touch-action: pan-y;
      }

      /* Do not create accidental horizontal page scrolling. */
      img, video, iframe, canvas, svg { max-width: 100%; }

      /* Preserve the visual scrollbar without changing layout width. */
      html::-webkit-scrollbar { width: var(--nls-scrollbar-size); height: var(--nls-scrollbar-size); }
      html::-webkit-scrollbar-track { background: transparent; }
      html::-webkit-scrollbar-thumb { border-radius: 999px; background: rgba(127,127,127,.38); border: 2px solid transparent; background-clip: padding-box; }
      html { scrollbar-width: thin; scrollbar-color: rgba(127,127,127,.45) transparent; }

      /* Modal lock is applied to the body while retaining the saved document offset. */
      body.${LOCK_CLASS} {
        position: fixed;
        left: 0;
        right: 0;
        width: 100%;
        overflow: hidden !important;
        overscroll-behavior: none;
      }

      @media (prefers-reduced-motion: reduce) {
        html { scroll-behavior: auto; }
        *, *::before, *::after { scroll-behavior: auto !important; }
      }
    `;
    document.head.appendChild(style);
  }

  function updateViewportVars() {
    var nav = document.getElementById("nls-mobile-bottom-nav");
    var navSpace = 0;

    if (nav && window.innerWidth <= 1023) {
      navSpace = Math.ceil(nav.getBoundingClientRect().height || 0);
      navSpace += 4;
    }

    document.documentElement.style.setProperty(
      "--nls-bottom-nav-space",
      navSpace > 0 ? navSpace + "px" : "calc(78px + env(safe-area-inset-bottom))"
    );

    var header = document.querySelector("header, .nls-header, #nlsHeader, .checkout-header");
    if (header) {
      var h = Math.ceil(header.getBoundingClientRect().height || 0);
      document.documentElement.style.setProperty("--nls-scroll-top-offset", h + "px");
    }
  }

  function setupAnchors() {
    document.addEventListener("click", function (event) {
      var target = event.target && event.target.closest ? event.target.closest('a[href^="#"]') : null;
      if (!target) return;

      var href = target.getAttribute("href");
      if (!href || href === "#") return;

      var id = href.slice(1);
      var destination = document.getElementById(id);
      if (!destination) return;

      event.preventDefault();
      destination.scrollIntoView({
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
        block: "start"
      });
      history.replaceState(null, "", href);
    }, { passive: false });
  }

  function setupScrollRestoration() {
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";

    var key = "nls-scroll:" + window.location.pathname + window.location.search;

    window.addEventListener("beforeunload", function () {
      try { sessionStorage.setItem(key, String(window.scrollY || 0)); } catch (_) {}
    });

    window.addEventListener("pageshow", function () {
      try {
        var saved = parseInt(sessionStorage.getItem(key) || "0", 10);
        if (saved > 0) requestAnimationFrame(function () { window.scrollTo(0, saved); });
      } catch (_) {}
    });
  }

  function lock() {
    if (lockState) return;
    var y = window.scrollY || window.pageYOffset || 0;
    lockState = { y: y };
    document.body.style.top = (-y) + "px";
    document.body.classList.add(LOCK_CLASS);
  }

  function unlock() {
    if (!lockState) return;
    var y = lockState.y;
    document.body.classList.remove(LOCK_CLASS);
    document.body.style.top = "";
    lockState = null;
    requestAnimationFrame(function () { window.scrollTo(0, y); });
  }

  function exposeScrollLockAPI() {
    window.NLSScroll = window.NLSScroll || {};
    window.NLSScroll.lock = lock;
    window.NLSScroll.unlock = unlock;
    window.NLSScroll.update = updateViewportVars;
  }

  function observeBottomNav() {
    var observer = new MutationObserver(updateViewportVars);
    observer.observe(document.documentElement, { childList: true, subtree: true });
    window.addEventListener("resize", updateViewportVars, { passive: true });
    if (window.visualViewport) window.visualViewport.addEventListener("resize", updateViewportVars, { passive: true });
  }

  function init() {
    injectStyles();
    exposeScrollLockAPI();
    setupAnchors();
    setupScrollRestoration();
    updateViewportVars();
    observeBottomNav();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, { once: true });
  else init();
})();
