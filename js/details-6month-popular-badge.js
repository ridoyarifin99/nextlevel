"use strict";
/* NEXT LEVEL SUBS — mark every 6-month plan as Most Popular. */
(function(){
  if(window.__NLS6MonthPopularBadge) return;
  window.__NLS6MonthPopularBadge = true;

  const style = document.createElement("style");
  style.textContent = ".nls-most-popular-badge{position:absolute;top:10px;right:10px;z-index:3;display:inline-flex;align-items:center;padding:5px 10px;border-radius:999px;background:linear-gradient(135deg,#f59e0b,#ef4444);color:#fff;font-size:11px;font-weight:800;line-height:1;letter-spacing:.02em;box-shadow:0 4px 12px rgba(239,68,68,.22);pointer-events:none}.plan-card{position:relative}";
  document.head.appendChild(style);

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
