"use strict";
(() => {
  if (window.__NLSAdminCategorySystem) return;
  window.__NLSAdminCategorySystem = true;
  const db = () => window.supabaseClient;
  const keepActive = async () => {
    try {
      const {data,error} = await db().from("product_categories").select("id").eq("is_active",true).order("display_order").order("name");
      if (error) throw error;
      const ids = new Set((data || []).map(x => String(x.id)));
      ["pCategory","categoryFilter"].forEach(id => {
        const el = document.getElementById(id); if (!el) return;
        [...el.options].forEach(o => { if (o.value && o.value !== "all" && !ids.has(String(o.value))) o.remove(); });
      });
    } catch (e) { console.warn("NEXT LEVEL SUBS: category visibility sync failed", e); }
  };
  const boot = () => { keepActive(); const p = document.getElementById("pCategory"); const f = document.getElementById("categoryFilter"); if (!p && !f) return; const root = document.querySelector("#productModal") || document.body; new MutationObserver(() => keepActive()).observe(root,{childList:true,subtree:true}); };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded",boot,{once:true}); else boot();
})();
