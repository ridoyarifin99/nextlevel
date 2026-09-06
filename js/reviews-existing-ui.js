"use strict";

/*
 * Next Level Subs — Supabase reviews using the EXISTING details.html review UI.
 * No standalone/new review section is created.
 */
(() => {
  if (!/\/details\.html$/i.test(window.location.pathname)) return;
  if (!window.supabaseClient) return;

  const supabase = window.supabaseClient;
  const MAX_FILES = 6;
  const MAX_SIZE = 6 * 1024 * 1024;
  const ALLOWED = new Set([
    "image/jpeg", "image/png", "image/webp", "image/gif",
    "video/mp4", "video/webm", "video/quicktime"
  ]);

  const esc = v => String(v ?? "")
    .replace(/&/g, "&amp;").replace(/</g, "&lt;")
    .replace(/>/g, "&gt;").replace(/\"/g, "&quot;")
    .replace(/'/g, "&#039;");

  const slugify = v => String(v || "").normalize("NFKD").toLowerCase().trim()
    .replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

  const stars = rating => {
    const n = Math.max(0, Math.min(5, Number(rating) || 0));
    return Array.from({ length: 5 }, (_, i) =>
      `<i class="${i < Math.round(n) ? "fas" : "far"} fa-star"></i>`
    ).join("");
  };

  const dateText = value => {
    try { return new Intl.DateTimeFormat("en-BD", { dateStyle: "medium" }).format(new Date(value)); }
    catch (_) { return ""; }
  };

  let selectedRating = 0;
  let selectedFiles = [];
  let editingId = null;
  let reviewsCache = [];
  let originalSwitchTab = null;
  let initialized = false;

  function productName() {
    return window.currentProduct?.name || new URLSearchParams(location.search).get("name") || "";
  }

  function productSlug() {
    return slugify(productName());
  }

  async function getUser() {
    try { return (await supabase.auth.getUser()).data?.user || null; }
    catch (_) { return null; }
  }

  async function profile(userId) {
    if (!userId) return null;
    try {
      const { data } = await supabase.from("profiles")
        .select("full_name,avatar_url").eq("id", userId).maybeSingle();
      return data || null;
    } catch (_) { return null; }
  }

  async function verifiedPurchase(userId) {
    if (!userId || !productSlug()) return false;
    try {
      const { data: orders } = await supabase.from("orders")
        .select("id,order_status,payment_status").eq("user_id", userId);
      if (!orders?.length) return false;
      const ids = orders.map(o => o.id);
      const { data: items } = await supabase.from("order_items")
        .select("order_id,product_slug").in("order_id", ids).eq("product_slug", productSlug());
      return !!items?.some(item => {
        const o = orders.find(x => x.id === item.order_id);
        const p = String(o?.payment_status || "").toLowerCase();
        const s = String(o?.order_status || "").toLowerCase();
        return ["paid", "completed", "success", "successful", "verified"].includes(p)
          || ["completed", "delivered", "processing", "active"].includes(s);
      });
    } catch (_) { return false; }
  }

  async function load() {
    const { data, error } = await supabase.from("product_reviews")
      .select("id,product_slug,user_id,author_name,rating,review_text,created_at,updated_at,status,verified_purchase,review_media(id,media_type,public_url,storage_path,mime_type,sort_order,created_at),review_replies(id,review_id,user_id,admin_id,author_name,avatar_url,reply_text,created_at,status,review_media(id,media_type,public_url,storage_path,mime_type,sort_order,created_at))")
      .eq("product_slug", productSlug()).order("created_at", { ascending: false });
    if (error) throw error;
    return data || [];
  }

  function ensureStyles() {
    if (document.getElementById("nls-existing-review-styles")) return;
    const style = document.createElement("style");
    style.id = "nls-existing-review-styles";
    style.textContent = `
      .nls-existing-review-form{border:1px solid #e5e7eb;border-radius:14px;padding:18px;background:#fff;margin-top:18px}
      .nls-existing-rating-picker{display:flex;gap:4px;margin:8px 0 14px}
      .nls-existing-rating-picker button{border:0;background:none;padding:0 2px;font-size:27px;color:#d1d5db;cursor:pointer}
      .nls-existing-rating-picker button.active{color:#facc15}
      .nls-existing-review-text{width:100%;min-height:100px;border:1px solid #d1d5db;border-radius:10px;padding:11px 12px;resize:vertical;box-sizing:border-box;outline:none;font:inherit}
      .nls-existing-review-text:focus{border-color:var(--primary-color);box-shadow:0 0 0 3px rgba(106,17,203,.08)}
      .nls-existing-media-row{display:flex;gap:8px;flex-wrap:wrap;margin:10px 0}
      .nls-existing-media-preview{position:relative;width:72px;height:72px;border-radius:9px;overflow:hidden;border:1px solid #e5e7eb;background:#f8fafc}
      .nls-existing-media-preview img,.nls-existing-media-preview video{width:100%;height:100%;object-fit:cover}
      .nls-existing-media-preview button{position:absolute;right:3px;top:3px;width:20px;height:20px;border:0;border-radius:50%;background:rgba(0,0,0,.7);color:#fff;cursor:pointer;line-height:20px;padding:0}
      .nls-existing-upload{display:inline-flex;align-items:center;gap:7px;padding:8px 12px;border:1px dashed #cbd5e1;border-radius:9px;cursor:pointer;color:#64748b;font-size:13px;font-weight:600}
      .nls-existing-upload input{display:none}
      .nls-existing-error{margin-top:10px;padding:9px 11px;border-radius:9px;background:#fef2f2;color:#b91c1c;font-size:13px}
      .nls-existing-success{margin-top:10px;padding:9px 11px;border-radius:9px;background:#ecfdf5;color:#047857;font-size:13px}
      .nls-existing-media-grid{display:flex;gap:8px;flex-wrap:wrap;margin-top:10px}
      .nls-existing-media-grid img,.nls-existing-media-grid video{width:92px;height:74px;object-fit:cover;border-radius:9px;border:1px solid #e5e7eb;cursor:pointer}
      .nls-existing-verified{display:inline-flex;align-items:center;gap:4px;margin-left:6px;font-size:11px;font-weight:700;color:#047857;background:#ecfdf5;padding:2px 7px;border-radius:99px}
      .nls-existing-reply-box{display:flex;gap:7px;margin:12px 0 0 52px}
      .nls-existing-reply-box input{flex:1;min-width:0;border:1px solid #d1d5db;border-radius:9px;padding:8px 10px;outline:none}
      .nls-existing-reply-box button{border:0;border-radius:9px;padding:8px 12px;background:#f3e8ff;color:#6d28d9;font-weight:700;cursor:pointer}
      .nls-existing-replies{margin:12px 0 0 52px;border-left:2px solid #f1f5f9;padding-left:12px}
      .nls-existing-reply{background:#f8fafc;border-radius:10px;padding:9px 11px;margin-top:8px}
      .nls-existing-reply small{color:#94a3b8}
      .nls-existing-viewer{position:fixed;inset:0;z-index:10060;background:rgba(15,23,42,.86);display:flex;align-items:center;justify-content:center;padding:20px}
      .nls-existing-viewer img,.nls-existing-viewer video{max-width:94vw;max-height:90vh;border-radius:12px}
      .nls-existing-viewer button{position:fixed;top:16px;right:16px;width:40px;height:40px;border:0;border-radius:50%;background:#fff;cursor:pointer;font-size:20px}
      @media(max-width:640px){.nls-existing-reply-box,.nls-existing-replies{margin-left:15px}.nls-existing-media-grid img,.nls-existing-media-grid video{width:78px;height:64px}}
    `;
    document.head.appendChild(style);
  }

  function resetComposer() {
    selectedRating = 0;
    selectedFiles = [];
    editingId = null;
  }

  function renderFilePreview() {
    const box = document.getElementById("nlsExistingMediaPreview");
    if (!box) return;
    box.innerHTML = selectedFiles.map((file, i) => {
      const url = URL.createObjectURL(file);
      const media = file.type.startsWith("video/")
        ? `<video src="${url}" muted></video>`
        : `<img src="${url}" alt="Preview">`;
      return `<div class="nls-existing-media-preview">${media}<button type="button" data-remove-media="${i}">×</button></div>`;
    }).join("");
    box.querySelectorAll("[data-remove-media]").forEach(btn => btn.onclick = () => {
      selectedFiles.splice(Number(btn.dataset.removeMedia), 1); renderFilePreview();
    });
  }

  function composerMarkup(user, existing) {
    const rating = existing ? Number(existing.rating) : selectedRating;
    selectedRating = rating || 0;
    return `<div class="nls-existing-review-form" id="nlsExistingReviewForm">
      <div class="flex items-center justify-between gap-3 mb-2"><h4 class="font-semibold">${existing ? "Edit Your Review" : "Write a Review"}</h4><span class="text-xs text-gray-500">${esc(user?.email || "")}</span></div>
      <div class="text-sm text-gray-600">Your rating</div>
      <div class="nls-existing-rating-picker" id="nlsExistingRating">${[1,2,3,4,5].map(n => `<button type="button" class="${n <= rating ? "active" : ""}" data-rate="${n}" aria-label="${n} star">★</button>`).join("")}</div>
      <textarea id="nlsExistingReviewText" class="nls-existing-review-text" maxlength="2000" placeholder="Share your experience...">${esc(existing?.review_text || "")}</textarea>
      <div class="flex flex-wrap items-center gap-2 mt-3">
        <label class="nls-existing-upload"><i class="fas fa-camera"></i> Add photos/videos<input id="nlsExistingFiles" type="file" accept="image/jpeg,image/png,image/webp,image/gif,video/mp4,video/webm,video/quicktime" multiple></label>
        <button type="button" id="nlsExistingSubmit" class="btn-primary px-4 py-2 rounded-lg font-semibold">${existing ? "Update Review" : "Submit Review"}</button>
        ${existing ? `<button type="button" id="nlsExistingCancel" class="px-4 py-2 rounded-lg border border-gray-300 font-semibold">Cancel</button>` : ""}
      </div>
      <div id="nlsExistingMediaPreview" class="nls-existing-media-row"></div>
      <div class="text-xs text-gray-500 mt-2">Up to 6 photos/videos, max 6MB each.</div>
      <div id="nlsExistingFormMessage"></div>
    </div>`;
  }

  async function renderComposer(container, existing) {
    const user = await getUser();
    if (!user) {
      container.innerHTML = `<div class="mt-4 p-4 rounded-lg bg-gray-50 border border-gray-200"><p class="text-gray-600">Please log in to write a review.</p><a href="/login.html" class="inline-block mt-2 font-semibold" style="color:var(--primary-color)">Login to review</a></div>`;
      return;
    }
    container.innerHTML = composerMarkup(user, existing);
    const ratingBox = document.getElementById("nlsExistingRating");
    ratingBox?.querySelectorAll("[data-rate]").forEach(btn => btn.onclick = () => {
      selectedRating = Number(btn.dataset.rate);
      ratingBox.querySelectorAll("[data-rate]").forEach(b => b.classList.toggle("active", Number(b.dataset.rate) <= selectedRating));
    });
    document.getElementById("nlsExistingFiles")?.addEventListener("change", e => {
      const incoming = Array.from(e.target.files || []);
      const bad = incoming.find(f => !ALLOWED.has(f.type) || f.size > MAX_SIZE);
      if (bad) { showMessage("Each file must be an allowed image/video and 6MB or smaller.", true); return; }
      if (selectedFiles.length + incoming.length > MAX_FILES) { showMessage("You can attach up to 6 files.", true); return; }
      selectedFiles.push(...incoming); renderFilePreview();
    });
    document.getElementById("nlsExistingCancel")?.addEventListener("click", () => { resetComposer(); renderReviews(); });
    document.getElementById("nlsExistingSubmit")?.addEventListener("click", () => saveReview(existing));
    renderFilePreview();
  }

  function showMessage(text, error = false) {
    const box = document.getElementById("nlsExistingFormMessage");
    if (box) box.innerHTML = `<div class="${error ? "nls-existing-error" : "nls-existing-success"}">${esc(text)}</div>`;
  }

  async function saveReview(existing) {
    const user = await getUser();
    if (!user) return;
    const text = document.getElementById("nlsExistingReviewText")?.value.trim() || "";
    if (!selectedRating) { showMessage("Please select a star rating.", true); return; }
    if (!text) { showMessage("Please write your review.", true); return; }
    const submit = document.getElementById("nlsExistingSubmit");
    if (submit) { submit.disabled = true; submit.textContent = "Saving…"; }
    try {
      const p = await profile(user.id);
      const verified = await verifiedPurchase(user.id);
      const payload = {
        product_slug: productSlug(), user_id: user.id,
        author_name: p?.full_name || user.user_metadata?.full_name || user.email?.split("@")[0] || "Customer",
        rating: selectedRating, review_text: text, verified_purchase: verified, status: "approved",
        updated_at: new Date().toISOString()
      };
      let reviewId;
      if (existing) {
        const { error } = await supabase.from("product_reviews").update(payload).eq("id", existing.id).eq("user_id", user.id);
        if (error) throw error;
        reviewId = existing.id;
      } else {
        const { data, error } = await supabase.from("product_reviews").insert(payload).select("id").single();
        if (error) throw error;
        reviewId = data.id;
      }
      for (let i = 0; i < selectedFiles.length; i++) await uploadMedia(selectedFiles[i], reviewId, user.id, null, i);
      resetComposer();
      await renderReviews();
    } catch (error) {
      console.error(error);
      showMessage(error?.message || "Unable to save your review.", true);
      if (submit) { submit.disabled = false; submit.textContent = existing ? "Update Review" : "Submit Review"; }
    }
  }

  async function uploadMedia(file, reviewId, userId, replyId, index) {
    const ext = (file.name.split(".").pop() || "bin").toLowerCase();
    const folder = replyId ? `replies/${replyId}` : `reviews/${reviewId}`;
    const path = `${folder}/${userId}-${Date.now()}-${index}.${ext}`;
    const { error } = await supabase.storage.from("review-media").upload(path, file, { upsert: false, contentType: file.type });
    if (error) throw error;
    const { data } = supabase.storage.from("review-media").getPublicUrl(path);
    const row = {
      review_id: reviewId, reply_id: replyId || null, user_id: userId,
      media_type: file.type.startsWith("video/") ? "video" : "image",
      storage_path: path, public_url: data.publicUrl, mime_type: file.type,
      file_size: file.size, sort_order: index
    };
    const { error: dbError } = await supabase.from("review_media").insert(row);
    if (dbError) throw dbError;
  }

  function mediaMarkup(media) {
    const list = (media || []).slice().sort((a,b) => Number(a.sort_order || 0) - Number(b.sort_order || 0));
    if (!list.length) return "";
    return `<div class="nls-existing-media-grid">${list.map(m => m.media_type === "video"
      ? `<video src="${esc(m.public_url)}" muted preload="metadata" data-review-media="video" data-src="${esc(m.public_url)}"></video>`
      : `<img src="${esc(m.public_url)}" alt="Review media" loading="lazy" data-review-media="image" data-src="${esc(m.public_url)}">`).join("")}</div>`;
  }

  function replyMarkup(replies) {
    return (replies || []).filter(r => r.status !== "rejected").map(r => `<div class="nls-existing-reply">
      <div class="flex items-center justify-between gap-2"><strong class="text-sm">${esc(r.author_name || "Customer")}</strong><small>${dateText(r.created_at)}</small></div>
      <p class="text-sm text-gray-700 mt-1">${esc(r.reply_text)}</p>${mediaMarkup(r.review_media)}
    </div>`).join("");
  }

  async function renderReviews() {
    const tab = document.getElementById("tabContent");
    if (!tab || !window.currentProduct) return;
    ensureStyles();
    const user = await getUser();
    try {
      reviewsCache = await load();
      const visible = reviewsCache.filter(r => r.status !== "rejected" || r.user_id === user?.id);
      const total = visible.length;
      const average = total ? visible.reduce((s,r) => s + Number(r.rating || 0), 0) / total : Number(window.currentProduct.rating || 0);
      const myReview = user ? visible.find(r => r.user_id === user.id) : null;
      const counts = [5,4,3,2,1].map(n => visible.filter(r => Number(r.rating) === n).length);

      const header = `<div class="space-y-6"><div class="flex items-center justify-between gap-3 flex-wrap"><div><h3 class="text-xl font-semibold">Customer Reviews</h3><div class="flex items-center mt-1"><div class="flex text-yellow-400 text-xl">${stars(average)}</div><span class="ml-2 text-gray-600">${total ? average.toFixed(1) : "No ratings yet"} ${total ? `out of 5 (${total} review${total === 1 ? "" : "s"})` : ""}</span></div></div><button id="nlsWriteReview" class="btn-primary px-4 py-2 rounded-lg">${myReview ? "Edit Your Review" : "Write a Review"}</button></div>
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-2 text-sm">${[5,4,3,2,1].map((n,i)=>`<div class="flex items-center gap-2"><span>${n}★</span><div class="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden"><div class="h-full bg-yellow-400" style="width:${total ? counts[i]/total*100 : 0}%"></div></div><span class="text-gray-500">${counts[i]}</span></div>`).join("")}</div>
        <div id="nlsExistingComposer"></div>`;

      const cards = visible.length ? visible.map((r, i) => `<div class="border-b border-gray-200 pb-4" data-review-id="${esc(r.id)}" data-aos="fade-up" data-aos-delay="${i*60}">
        <div class="flex items-center justify-between mb-2 gap-3"><div class="flex items-center"><div class="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center mr-3 flex-shrink-0"><span class="font-semibold text-gray-700">${esc((r.author_name || "C").charAt(0).toUpperCase())}</span></div><div><h4 class="font-medium">${esc(r.author_name || "Customer")}${r.verified_purchase ? `<span class="nls-existing-verified"><i class="fas fa-check-circle"></i> Verified Purchase</span>` : ""}</h4><div class="flex text-yellow-400 text-sm">${stars(r.rating)}</div></div></div><span class="text-sm text-gray-500">${dateText(r.created_at)}</span></div>
        <p class="text-gray-700 whitespace-pre-wrap">${esc(r.review_text)}</p>${mediaMarkup(r.review_media)}
        <div class="flex items-center gap-4 mt-3"><button type="button" class="text-sm text-gray-500 hover:text-purple-600 font-medium" data-reply="${esc(r.id)}">Reply</button>${user?.id === r.user_id ? `<button type="button" class="text-sm text-gray-500 hover:text-purple-600 font-medium" data-edit="${esc(r.id)}">Edit</button>` : ""}</div>
        <div class="nls-existing-replies">${replyMarkup(r.review_replies)}</div>
        <div class="nls-existing-reply-box"><input type="text" maxlength="1000" placeholder="Write a reply…" data-reply-input="${esc(r.id)}"><button type="button" data-send-reply="${esc(r.id)}">Reply</button></div>
      </div>`).join("") : `<div class="text-center py-8"><i class="fas fa-comments text-4xl text-gray-300 mb-4"></i><p class="text-gray-600">No reviews yet. Be the first to review this product!</p></div>`;

      tab.innerHTML = header + `<div class="space-y-4">${cards}</div></div>`;
      document.getElementById("nlsWriteReview")?.addEventListener("click", async () => {
        const latestUser = await getUser();
        if (!latestUser) { document.getElementById("nlsExistingComposer").innerHTML = `<div class="mt-4 p-4 rounded-lg bg-gray-50 border border-gray-200">Please log in to write a review.</div>`; return; }
        await renderComposer(document.getElementById("nlsExistingComposer"), myReview);
        document.getElementById("nlsExistingComposer")?.scrollIntoView({ behavior: "smooth", block: "nearest" });
      });
      tab.querySelectorAll("[data-edit]").forEach(btn => btn.onclick = async () => renderComposer(document.getElementById("nlsExistingComposer"), reviewsCache.find(r => r.id === btn.dataset.edit)));
      tab.querySelectorAll("[data-send-reply]").forEach(btn => btn.onclick = () => sendReply(btn.dataset.sendReply));
      tab.querySelectorAll("[data-review-media]").forEach(el => el.onclick = () => openViewer(el.dataset.src, el.dataset.reviewMedia));
      tab.querySelectorAll("[data-reply]").forEach(btn => btn.onclick = () => document.querySelector(`[data-reply-input="${CSS.escape(btn.dataset.reply)}"]`)?.focus());
      if (typeof AOS !== "undefined") AOS.refresh();
    } catch (error) {
      console.error("Supabase review error", error);
      tab.innerHTML = `<div class="text-center py-8"><i class="fas fa-exclamation-circle text-4xl text-red-300 mb-4"></i><p class="text-gray-600">Unable to load reviews right now. Please refresh the page.</p></div>`;
    }
  }

  async function sendReply(reviewId) {
    const user = await getUser();
    if (!user) { alert("Please log in to reply."); return; }
    const input = document.querySelector(`[data-reply-input="${CSS.escape(reviewId)}"]`);
    const text = input?.value.trim();
    if (!text) return;
    const p = await profile(user.id);
    const { error } = await supabase.from("review_replies").insert({
      review_id: reviewId, user_id: user.id, author_name: p?.full_name || user.email?.split("@")[0] || "Customer",
      avatar_url: p?.avatar_url || null, reply_text: text, status: "approved"
    });
    if (error) { alert(error.message || "Unable to reply."); return; }
    await renderReviews();
  }

  function openViewer(src, type) {
    const wrap = document.createElement("div");
    wrap.className = "nls-existing-viewer";
    wrap.innerHTML = `<button type="button" aria-label="Close">×</button>${type === "video" ? `<video src="${esc(src)}" controls autoplay></video>` : `<img src="${esc(src)}" alt="Review media">`}`;
    wrap.querySelector("button").onclick = () => wrap.remove();
    wrap.onclick = e => { if (e.target === wrap) wrap.remove(); };
    document.body.appendChild(wrap);
  }

  function install() {
    if (initialized) return;
    if (typeof window.switchTab !== "function") { setTimeout(install, 50); return; }
    initialized = true;
    originalSwitchTab = window.switchTab;
    window.switchTab = function(tab) {
      if (tab === "reviews") return renderReviews();
      return originalSwitchTab.apply(this, arguments);
    };
    /* Keep the existing details.html tab UI; only replace its review data/content. */
    if (document.querySelector(".tab-button.active")?.textContent?.toLowerCase().includes("reviews")) renderReviews();
  }

  const boot = () => { ensureStyles(); install(); };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot, { once: true });
  else boot();
})();
