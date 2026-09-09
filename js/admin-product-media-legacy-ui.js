"use strict";
(() => {
  function hideLegacyField() {
    const input = document.getElementById("pImage");
    const field = input?.closest(".field");
    if (field) field.style.display = "none";
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", hideLegacyField, {once:true}); else hideLegacyField();
})();
