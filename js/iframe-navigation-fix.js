/* ============================================================
   TOP-LEVEL NAVIGATION FIX FOR DETAILS/SEO IFRAME
   The public /product/:slug route is served by api/product.js,
   which embeds details.html in an iframe. Internal links inside
   that iframe must navigate the top-level browser URL, otherwise
   only the iframe URL changes while the address bar stays on the
   old /product/:slug route.
============================================================ */
(function () {
    "use strict";

    function handleInternalNavigation(event) {
        // This handler is primarily for details.html when it is
        // rendered inside the SEO product iframe.
        if (window.top === window.self) return;

        const target = event.target instanceof Element
            ? event.target
            : null;
        if (!target) return;

        // Do not hijack cart/add-to-cart controls that live inside
        // an anchor on the related-product cards.
        if (target.closest("button, [data-add-cart], input, select, textarea")) {
            return;
        }

        const link = target.closest("a[href]");
        if (!link) return;

        const rawHref = link.getAttribute("href");
        if (!rawHref || rawHref.startsWith("#")) return;
        if (/^(?:mailto:|tel:|javascript:|data:)/i.test(rawHref)) return;
        if (link.target && link.target !== "_self") return;

        let url;
        try {
            url = new URL(rawHref, window.location.href);
        } catch (_) {
            return;
        }

        // Only take over same-origin site navigation. External links
        // keep their normal browser behavior.
        if (url.origin !== window.location.origin) return;

        event.preventDefault();
        event.stopPropagation();
        if (typeof event.stopImmediatePropagation === "function") {
            event.stopImmediatePropagation();
        }

        window.top.location.assign(url.href);
    }

    // Capture phase runs before the existing details-page click
    // handlers, including the old nav handler that prepended an
    // extra slash to already-absolute paths.
    document.addEventListener("click", handleInternalNavigation, true);
})();
