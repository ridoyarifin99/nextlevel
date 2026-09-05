(function () {
    "use strict";

    const styleId = "nls-mobile-bottom-nav-layer-fix";
    if (document.getElementById(styleId)) return;

    const style = document.createElement("style");
    style.id = styleId;
    style.textContent = `
        #nls-mobile-bottom-nav .nls-bn-slider { z-index: 0 !important; }
        #nls-mobile-bottom-nav .nls-bn-item { z-index: 1; }
    `;
    document.head.appendChild(style);
})();
