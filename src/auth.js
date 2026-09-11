"use strict";

/* Next Level Subs — legacy compatibility entry point.
 * This file is retained because older pages still include it.
 * Authentication itself is owned by /js/auth.js.
 */
(function () {
  function fixProductionAssets() {
    var icon = document.querySelector('link[rel="icon"]');
    if (icon) {
      icon.href = "/images/next_level.png";
      icon.type = "image/png";
    }
  }

  function init() {
    /* Never load a removed/missing legacy navbar script. */
    fixProductionAssets();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
