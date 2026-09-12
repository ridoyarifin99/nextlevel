"use strict";
/* NEXT LEVEL SUBS — mark every 6-month plan as Most Popular. */
(function(){
  if(window.__NLS6MonthPopularBadge) return;
  window.__NLS6MonthPopularBadge = true;

  const isSixMonth = card => {
    const text = String(card?.textContent || "").replace(/\s+/g, " ").trim().toLowerCase();
    return /\b6\s*(?:month|months|mo)\b/.test(text) || /\b6\s*[-/]\s*(?:month|months|mo)\b/.test(text);
  };

  const apply = () => {
    document.querySelectorAll("#productDetails .plan-card, .plan-card").forEach(card => {
      const existing = card.querySelector("[data-nls-most-popular]");
      if (!isSixMonth(card)) {
        existing?.remove();
        return;
      }
      if (existing) return;
      const badge = document.createElement("span");
      badge.dataset.nlsMostPopular = "1";
      badge.className = "nls-most-popular-badge";
      badge.textContent = "Most Popular";
      badge.setAttribute("aria-label", "Most Popular 6-month plan");
      card.style.position = card.style.position || "relative";
      card.insertBefore(badge, card.firstChild);
    });
  };

  const boot = () => {
    apply();
    const root = document.getElementById("productDetails") || document.body;
    new MutationObserver(() => requestAnimationFrame(apply)).observe(root, {childList:true, subtree:true});
    setTimeout(apply, 500);
    setTimeout(apply, 1500);
  };

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot, {once:true});
  else boot();
})();
