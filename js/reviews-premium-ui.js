"use strict";

/*
 * Next Level Subs — premium polish for the EXISTING Reviews tab.
 * Enhances the existing DOM only; it does not create a second review system.
 */
(() => {
  if (!/\/details\.html$/i.test(window.location.pathname)) return;
  if (!window.supabaseClient) return;

  const supabase = window.supabaseClient;
  const styleId = "nls-premium-review-ui";
  const profileCache = new Map();
  let enhanceTimer = null;

  function addStyles() {
    if (document.getElementById(styleId)) return;
    const style = document.createElement("style");
    style.id = styleId;
    style.textContent = `
      #tabContent .nls-premium-reviews{animation:nlsReviewIn .45s cubic-bezier(.22,1,.36,1) both}
      @keyframes nlsReviewIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}
      #tabContent .nls-premium-review-header{position:relative;overflow:hidden;border:1px solid rgba(124,58,237,.13);border-radius:22px;padding:22px;background:linear-gradient(135deg,rgba(124,58,237,.07),rgba(59,130,246,.045) 52%,rgba(255,255,255,.98));box-shadow:0 12px 35px rgba(15,23,42,.07)}
      #tabContent .nls-premium-review-header:before{content:"";position:absolute;width:170px;height:170px;border-radius:50%;right:-70px;top:-90px;background:radial-gradient(circle,rgba(124,58,237,.16),transparent 68%);pointer-events:none}
      #tabContent .nls-premium-title{font-size:clamp(1.15rem,2vw,1.45rem);font-weight:800;letter-spacing:-.025em;color:#111827}
      #tabContent .nls-premium-average{font-weight:800;color:#111827}
      #tabContent .nls-premium-rating-stars{letter-spacing:1px;filter:drop-shadow(0 2px 5px rgba(250,204,21,.22))}
      #tabContent #nlsWriteReview{position:relative;isolation:isolate;overflow:hidden;border:0!important;min-height:44px;padding:0 18px!important;border-radius:13px!important;background:linear-gradient(135deg,#7c3aed,#4f46e5)!important;color:#fff!important;box-shadow:0 9px 22px rgba(79,70,229,.25);transition:transform .22s cubic-bezier(.22,1,.36,1),box-shadow .22s ease,filter .22s ease}
      #tabContent #nlsWriteReview:before{content:"";position:absolute;inset:-2px auto -2px -55%;width:42%;transform:skewX(-18deg);background:linear-gradient(90deg,transparent,rgba(255,255,255,.38),transparent);transition:left .65s ease;z-index:-1}
      #tabContent #nlsWriteReview:hover{transform:translateY(-2px) scale(1.015);box-shadow:0 13px 28px rgba(79,70,229,.34);filter:saturate(1.08)}
      #tabContent #nlsWriteReview:hover:before{left:120%}
      #tabContent #nlsWriteReview:active{transform:translateY(0) scale(.985);box-shadow:0 6px 15px rgba(79,70,229,.25)}
      #tabContent .nls-premium-bars{padding:14px 16px;border-radius:16px;background:rgba(255,255,255,.72);border:1px solid rgba(226,232,240,.9);backdrop-filter:blur(8px)}
      #tabContent .nls-premium-bar{height:7px!important;border-radius:999px!important;background:#eef2f7!important;overflow:hidden}
      #tabContent .nls-premium-bar>div{height:100%;border-radius:inherit;background:linear-gradient(90deg,#f59e0b,#facc15)!important;transition:width .8s cubic-bezier(.22,1,.36,1)}
      #tabContent [data-review-id]{position:relative;border:1px solid #edf0f5!important;border-radius:18px!important;padding:18px!important;background:rgba(255,255,255,.98);box-shadow:0 5px 20px rgba(15,23,42,.045);transition:transform .25s cubic-bezier(.22,1,.36,1),box-shadow .25s ease,border-color .25s ease;animation:nlsCardIn .5s cubic-bezier(.22,1,.36,1) both}
      @keyframes nlsCardIn{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:none}}
      #tabContent [data-review-id]:hover{transform:translateY(-3px);box-shadow:0 14px 32px rgba(15,23,42,.09);border-color:rgba(124,58,237,.18)!important}
      #tabContent [data-review-id] .w-10.h-10.rounded-full{width:46px!important;height:46px!important;margin-right:12px!important;background:linear-gradient(135deg,#ede9fe,#dbeafe)!important;box-shadow:0 4px 12px rgba(79,70,229,.13);overflow:hidden}
      #tabContent [data-review-id] .nls-review-avatar{width:100%;height:100%;object-fit:cover;display:block}
      #tabContent [data-review-id] h4{font-weight:750!important;letter-spacing:-.01em}
      #tabContent [data-review-id] .text-yellow-400{color:#f59e0b!important}
      #tabContent [data-review-id] [data-reply],[data-review-id] [data-edit]{border-radius:9px;padding:6px 9px;transition:background .2s,color .2s,transform .2s}
      #tabContent [data-review-id] [data-reply]:hover,#tabContent [data-review-id] [data-edit]:hover{background:#f5f3ff;color:#6d28d9;transform:translateY(-1px)}
      #tabContent .nls-existing-verified{margin-left:7px!important;border:1px solid #bbf7d0;background:linear-gradient(135deg,#ecfdf5,#f0fdf4)!important;box-shadow:0 2px 7px rgba(16,185,129,.09)}
      #tabContent .nls-existing-media-grid{gap:10px!important}
      #tabContent .nls-existing-media-grid img,#tabContent .nls-existing-media-grid video{width:96px!important;height:78px!important;border-radius:12px!important;border:1px solid #e5e7eb!important;box-shadow:0 4px 12px rgba(15,23,42,.08);transition:transform .22s ease,box-shadow .22s ease}
      #tabContent .nls-existing-media-grid img:hover,#tabContent .nls-existing-media-grid video:hover{transform:scale(1.045);box-shadow:0 10px 22px rgba(15,23,42,.15)}
      #tabContent .nls-existing-replies{border-left:2px solid #ede9fe!important}
      #tabContent .nls-existing-reply{border:1px solid #eef2f7;background:linear-gradient(135deg,#fafaff,#f8fafc)!important;transition:transform .2s ease}
      #tabContent .nls-existing-reply-box input{height:42px;border-radius:12px!important;background:#fff;transition:border-color .2s,box-shadow .2s}
      #tabContent .nls-existing-reply-box input:focus{border-color:#8b5cf6!important;box-shadow:0 0 0 4px rgba(139,92,246,.10)!important}
      #tabContent .nls-existing-reply-box button{min-height:42px;border-radius:12px!important;background:linear-gradient(135deg,#f3e8ff,#ede9fe)!important;transition:transform .2s,box-shadow .2s,filter .2s}
      #tabContent .nls-existing-reply-box button:hover{transform:translateY(-1px);box-shadow:0 7px 16px rgba(124,58,237,.13);filter:saturate(1.08)}
      #tabContent .nls-existing-review-form{border:1px solid rgba(124,58,237,.16)!important;border-radius:18px!important;background:linear-gradient(135deg,#fff,#faf8ff)!important;box-shadow:0 14px 35px rgba(79,70,229,.09)!important;animation:nlsReviewIn .4s cubic-bezier(.22,1,.36,1) both}
      #tabContent .nls-existing-rating-picker button{font-size:31px!important;line-height:1;transition:transform .18s cubic-bezier(.22,1,.36,1),color .18s,filter .18s}
      #tabContent .nls-existing-rating-picker button:hover{transform:translateY(-3px) scale(1.12);filter:drop-shadow(0 4px 7px rgba(250,204,21,.25))}
      #tabContent .nls-existing-rating-picker button.active{color:#f59e0b!important;text-shadow:0 3px 10px rgba(245,158,11,.18)}
      #tabContent .nls-existing-upload{min-height:42px;box-sizing:border-box;border:1px dashed #c4b5fd!important;border-radius:12px!important;background:#faf5ff;transition:background .2s,border-color .2s,transform .2s}
      #tabContent .nls-existing-upload:hover{background:#f5f3ff;border-color:#8b5cf6!important;transform:translateY(-1px)}
      #tabContent #nlsExistingSubmit{min-height:42px;position:relative;overflow:hidden;border:0;box-shadow:0 8px 20px rgba(79,70,229,.2);transition:transform .2s,box-shadow .2s,filter .2s}
      #tabContent #nlsExistingSubmit:hover{transform:translateY(-2px);box-shadow:0 12px 25px rgba(79,70,229,.28);filter:saturate(1.08)}
      #tabContent #nlsExistingSubmit:active{transform:scale(.98)}
      #tabContent .nls-premium-count{display:inline-flex;align-items:center;justify-content:center;min-width:27px;height:27px;padding:0 8px;border-radius:999px;background:#f5f3ff;color:#6d28d9;font-size:12px;font-weight:800}
      @media(max-width:640px){
        #tabContent .nls-premium-review-header{padding:17px;border-radius:18px}
        #tabContent #nlsWriteReview{width:100%;justify-content:center}
        #tabContent [data-review-id]{padding:14px!important;border-radius:15px!important}
        #tabContent .nls-existing-media-grid img,#tabContent .nls-existing-media-grid video{width:78px!important;height:64px!important}
      }
      @media(prefers-reduced-motion:reduce){#tabContent .nls-premium-reviews,#tabContent [data-review-id],#tabContent .nls-existing-review-form{animation:none!important}#tabContent *{scroll-behavior:auto!important;transition-duration:.01ms!important}}
    `;
    document.head.appendChild(style);
  }

  async function applyProfile(card) {
    const reviewId = card?.dataset?.reviewId;
    if (!reviewId || card.dataset.nlsProfileApplied === "true") return;
    card.dataset.nlsProfileApplied = "true";
    try {
      let row = profileCache.get(reviewId);
      if (!row) {
        const { data } = await supabase.from("product_reviews").select("user_id,author_name").eq("id", reviewId).maybeSingle();
        row = data || null;
        profileCache.set(reviewId, row);
      }
      if (!row?.user_id) return;
      const { data: profile } = await supabase.from("profiles").select("avatar_url,full_name").eq("id", row.user_id).maybeSingle();
      const avatar = profile?.avatar_url;
      const target = card.querySelector(".w-10.h-10.rounded-full");
      if (!target || !avatar) return;
      const img = document.createElement("img");
      img.className = "nls-review-avatar";
      img.src = avatar;
      img.alt = `${profile.full_name || row.author_name || "Customer"} profile picture`;
      img.loading = "lazy";
      img.referrerPolicy = "no-referrer";
      img.onerror = () => img.remove();
      target.innerHTML = "";
      target.appendChild(img);
    } catch (e) {
      console.warn("Review profile image unavailable", e);
    }
  }

  function decorate() {
    addStyles();
    const tab = document.getElementById("tabContent");
    if (!tab || !tab.querySelector("[data-review-id]")) return;
    const root = tab.querySelector(".space-y-6") || tab.firstElementChild;
    if (root) root.classList.add("nls-premium-reviews");
    const header = root?.firstElementChild;
    if (header && !header.classList.contains("nls-premium-review-header")) {
      header.classList.add("nls-premium-review-header");
      const title = header.querySelector("h3");
      if (title) title.classList.add("nls-premium-title");
      const stars = header.querySelector(".text-yellow-400");
      if (stars) stars.classList.add("nls-premium-rating-stars");
      const bars = header.querySelector(".grid.grid-cols-1");
      if (bars) {
        bars.classList.add("nls-premium-bars");
        bars.querySelectorAll(".h-2").forEach(x => x.classList.add("nls-premium-bar"));
      }
    }
    tab.querySelectorAll("[data-review-id]").forEach((card, i) => {
      card.style.animationDelay = `${Math.min(i * 45, 300)}ms`;
      applyProfile(card);
    });
  }

  function schedule() {
    clearTimeout(enhanceTimer);
    enhanceTimer = setTimeout(decorate, 30);
  }

  addStyles();
  const observer = new MutationObserver(schedule);
  const start = () => {
    if (document.body) observer.observe(document.body, { childList: true, subtree: true });
    schedule();
  };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start, { once: true });
  else start();
})();
