"use strict";

/*
 * Next Level Subs — product reviews
 * Loaded only on details.html through supabase-config.js.
 */
(() => {
  if (!/\/details\.html$/i.test(window.location.pathname)) return;
  if (!window.supabaseClient) return;

  const supabase = window.supabaseClient;
  const BUCKET = "review-media";
  const MAX_FILES = 6;
  const MAX_IMAGE = 6 * 1024 * 1024;
  const MAX_VIDEO = 6 * 1024 * 1024;
  const ALLOWED = new Set([
    "image/jpeg", "image/png", "image/webp", "image/gif",
    "video/mp4", "video/webm", "video/quicktime"
  ]);

  const esc = value => String(value ?? "")
    .replace(/&/g, "&amp;").replace(/</g, "&lt;")
    .replace(/>/g, "&gt;").replace(/\"/g, "&quot;")
    .replace(/'/g, "&#039;");

  const slugify = value => String(value || "")
    .normalize("NFKD").toLowerCase().trim()
    .replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

  const stars = rating => {
    const n = Math.max(0, Math.min(5, Number(rating) || 0));
    return Array.from({ length: 5 }, (_, i) =>
      `<span class="nls-review-star ${i < Math.round(n) ? "is-on" : ""}">★</span>`
    ).join("");
  };

  const mediaType = file => file.type.startsWith("video/") ? "video" : "image";
  const formatDate = value => {
    try { return new Intl.DateTimeFormat("en-BD", { dateStyle: "medium" }).format(new Date(value)); }
    catch (_) { return ""; }
  };

  let product = null;
  let currentUser = null;
  let selectedRating = 0;
  let selectedFiles = [];
  let editingReviewId = null;

  function currentProductName() {
    return new URLSearchParams(window.location.search).get("name") || "";
  }

  async function waitForProduct() {
    for (let i = 0; i < 80; i++) {
      try {
        if (Array.isArray(window.products)) {
          const name = currentProductName();
          const list = window.products;
          const found = list.find(p => String(p.name || "").toLowerCase() === String(name).toLowerCase())
            || list.find(p => slugify(p.name) === slugify(name));
          if (found) return found;
        }
      } catch (_) {}
      await new Promise(r => setTimeout(r, 150));
    }
    return { name: currentProductName(), slug: slugify(currentProductName()) };
  }

  async function getUser() {
    try {
      const { data } = await supabase.auth.getUser();
      return data?.user || null;
    } catch (_) { return null; }
  }

  async function getProfile(userId) {
    if (!userId) return null;
    const { data } = await supabase.from("profiles").select("full_name,avatar_url").eq("id", userId).maybeSingle();
    return data || null;
  }

  async function isVerifiedPurchase(userId, productSlug) {
    if (!userId || !productSlug) return false;
    const { data: orders } = await supabase.from("orders")
      .select("id,order_status,payment_status")
      .eq("user_id", userId);
    if (!orders?.length) return false;
    const ids = orders.map(o => o.id);
    const { data: items } = await supabase.from("order_items")
      .select("order_id,product_slug")
      .in("order_id", ids)
      .eq("product_slug", productSlug);
    return !!items?.some(item => {
      const order = orders.find(o => o.id === item.order_id);
      const payment = String(order?.payment_status || "").toLowerCase();
      const status = String(order?.order_status || "").toLowerCase();
      return ["paid", "completed", "success", "successful", "verified"].includes(payment)
        || ["completed", "delivered", "processing", "active"].includes(status);
    });
  }

  function injectStyles() {
    if (document.getElementById("nls-review-styles")) return;
    const style = document.createElement("style");
    style.id = "nls-review-styles";
    style.textContent = `
      #nlsReviews{max-width:1180px;margin:42px auto 70px;padding:0 18px;color:#172033}
      .nls-review-head{display:flex;align-items:flex-end;justify-content:space-between;gap:20px;margin-bottom:22px}
      .nls-review-head h2{margin:0;font-size:clamp(24px,3vw,34px);font-weight:800}
      .nls-review-head p{margin:6px 0 0;color:#64748b}
      .nls-review-summary{display:grid;grid-template-columns:210px 1fr;gap:22px;background:#fff;border:1px solid #e8edf5;border-radius:22px;padding:24px;box-shadow:0 12px 35px rgba(15,23,42,.06);margin-bottom:24px}
      .nls-review-average{text-align:center;border-right:1px solid #edf1f7;padding-right:22px}
      .nls-review-average strong{display:block;font-size:46px;line-height:1;font-weight:900}
      .nls-review-stars{margin:9px 0 5px;white-space:nowrap}.nls-review-star{color:#cbd5e1;font-size:19px}.nls-review-star.is-on{color:#f59e0b}
      .nls-review-average small{color:#64748b}.nls-review-bars{display:flex;flex-direction:column;gap:8px;justify-content:center}
      .nls-review-bar{display:grid;grid-template-columns:32px 1fr 38px;align-items:center;gap:9px;font-size:13px;color:#64748b}.nls-review-track{height:8px;background:#edf2f7;border-radius:99px;overflow:hidden}.nls-review-fill{height:100%;background:linear-gradient(90deg,#f59e0b,#fbbf24);border-radius:99px}
      .nls-review-write{background:linear-gradient(135deg,#fff,#f8faff);border:1px solid #e5eaf3;border-radius:22px;padding:24px;margin-bottom:24px}
      .nls-review-write h3{margin:0 0 16px;font-size:20px}.nls-review-login{padding:15px;border-radius:14px;background:#f1f5f9;color:#475569}.nls-review-login a{font-weight:800;color:#5b21b6;text-decoration:none}
      .nls-rating-picker{display:flex;gap:5px;margin:5px 0 15px}.nls-rating-picker button{border:0;background:none;padding:0;font-size:32px;cursor:pointer;color:#cbd5e1;transition:.2s}.nls-rating-picker button:hover,.nls-rating-picker button.active{color:#f59e0b;transform:translateY(-1px)}
      .nls-review-text{width:100%;min-height:110px;resize:vertical;border:1px solid #dbe3ee;border-radius:14px;padding:13px 15px;outline:none;font:inherit;box-sizing:border-box}.nls-review-text:focus{border-color:#8b5cf6;box-shadow:0 0 0 3px rgba(139,92,246,.10)}
      .nls-review-media-row{display:flex;gap:10px;flex-wrap:wrap;margin:13px 0}.nls-media-preview{position:relative;width:86px;height:86px;border-radius:12px;overflow:hidden;border:1px solid #e2e8f0;background:#f8fafc}.nls-media-preview img,.nls-media-preview video{width:100%;height:100%;object-fit:cover}.nls-media-preview .video-mark{position:absolute;inset:0;display:grid;place-items:center;color:#fff;background:rgba(15,23,42,.25);font-size:22px}.nls-media-remove{position:absolute;right:4px;top:4px;width:23px;height:23px;border:0;border-radius:50%;background:rgba(15,23,42,.75);color:#fff;cursor:pointer}
      .nls-media-label{display:inline-flex;align-items:center;gap:8px;padding:10px 14px;border:1px dashed #b8c3d4;border-radius:12px;cursor:pointer;color:#475569;font-weight:700}.nls-media-label:hover{border-color:#7c3aed;color:#6d28d9}.nls-media-label input{display:none}
      .nls-review-submit{border:0;border-radius:12px;padding:11px 18px;background:linear-gradient(135deg,#6d28d9,#2563eb);color:#fff;font-weight:800;cursor:pointer}.nls-review-submit:disabled{opacity:.55;cursor:not-allowed}.nls-review-cancel{border:1px solid #dbe3ee;background:#fff;border-radius:12px;padding:10px 16px;font-weight:700;cursor:pointer;margin-left:8px}
      .nls-review-list{display:flex;flex-direction:column;gap:16px}.nls-review-card{background:#fff;border:1px solid #e7edf5;border-radius:20px;padding:20px;box-shadow:0 8px 25px rgba(15,23,42,.045)}
      .nls-review-author{display:flex;align-items:center;gap:11px}.nls-review-avatar{width:42px;height:42px;border-radius:50%;object-fit:cover;background:#ede9fe;display:grid;place-items:center;color:#6d28d9;font-weight:900;flex:none}.nls-review-author strong{display:block}.nls-review-meta{font-size:12px;color:#94a3b8;margin-top:2px}.nls-verified{display:inline-flex;align-items:center;gap:4px;margin-left:7px;padding:2px 7px;border-radius:99px;background:#ecfdf5;color:#047857;font-size:11px;font-weight:800}.nls-review-body{margin:12px 0 12px;color:#334155;line-height:1.7;white-space:pre-wrap;overflow-wrap:anywhere}.nls-review-gallery{display:flex;gap:8px;flex-wrap:wrap;margin:10px 0 14px}.nls-review-gallery img,.nls-review-gallery video{width:110px;height:88px;border-radius:12px;object-fit:cover;border:1px solid #e5e7eb;background:#f8fafc;cursor:pointer}.nls-review-actions{display:flex;align-items:center;gap:14px;font-size:13px}.nls-review-action{border:0;background:none;padding:0;color:#64748b;font-weight:700;cursor:pointer}.nls-review-action:hover{color:#6d28d9}.nls-replies{margin:15px 0 0 42px;padding-left:16px;border-left:2px solid #eef2f7;display:flex;flex-direction:column;gap:11px}.nls-reply{background:#f8fafc;border-radius:14px;padding:12px 14px}.nls-reply-head{display:flex;align-items:center;gap:8px}.nls-reply-head strong{font-size:13px}.nls-reply-date{font-size:11px;color:#94a3b8}.nls-reply-text{margin:7px 0 0;color:#475569;line-height:1.55;white-space:pre-wrap}.nls-reply-gallery{display:flex;gap:7px;margin-top:8px;flex-wrap:wrap}.nls-reply-gallery img,.nls-reply-gallery video{width:76px;height:60px;border-radius:9px;object-fit:cover}.nls-reply-form{display:flex;gap:8px;margin:12px 0 0 42px}.nls-reply-form input{flex:1;min-width:0;border:1px solid #dbe3ee;border-radius:12px;padding:10px 12px;outline:none}.nls-reply-form button{border:0;border-radius:12px;padding:0 14px;background:#ede9fe;color:#6d28d9;font-weight:800;cursor:pointer}.nls-empty{padding:35px;text-align:center;background:#fff;border:1px dashed #dbe3ee;border-radius:18px;color:#64748b}.nls-review-loading{text-align:center;padding:28px;color:#64748b}.nls-review-error{padding:12px 14px;background:#fef2f2;color:#b91c1c;border-radius:12px;margin:10px 0}
      .nls-review-modal{position:fixed;inset:0;z-index:10050;background:rgba(15,23,42,.82);display:grid;place-items:center;padding:20px}.nls-review-modal img,.nls-review-modal video{max-width:min(1100px,95vw);max-height:90vh;border-radius:14px}.nls-review-modal button{position:fixed;top:18px;right:18px;border:0;background:#fff;color:#111827;width:42px;height:42px;border-radius:50%;font-size:20px;cursor:pointer}
      @media(max-width:700px){#nlsReviews{padding:0 12px;margin-top:30px}.nls-review-summary{grid-template-columns:1fr}.nls-review-average{border-right:0;border-bottom:1px solid #edf1f7;padding:0 0 18px}.nls-review-card,.nls-review-write{padding:16px}.nls-replies{margin-left:18px}.nls-reply-form{margin-left:18px}.nls-review-gallery img,.nls-review-gallery video{width:86px;height:72px}}
    `;
    document.head.appendChild(style);
  }

  function renderShell() {
    if (document.getElementById("nlsReviews")) return document.getElementById("nlsReviews");
    injectStyles();
    const section = document.createElement("section");
    section.id = "nlsReviews";
    section.innerHTML = `
      <div class="nls-review-head"><div><h2>Customer Reviews</h2><p>Real feedback from Next Level Subs customers.</p></div></div>
      <div id="nlsReviewSummary" class="nls-review-summary"></div>
      <div id="nlsReviewWrite"></div>
      <div id="nlsReviewList" class="nls-review-list"><div class="nls-review-loading">Loading reviews…</div></div>
    `;
    const footer = document.querySelector("footer");
    if (footer?.parentNode) footer.parentNode.insertBefore(section, footer); else document.body.appendChild(section);
    return section;
  }

  async function loadReviews() {
    const slug = product.slug || slugify(product.name);
    const { data, error } = await supabase.from("product_reviews")
      .select("id,product_slug,user_id,author_name,rating,review_text,created_at,updated_at,status,verified_purchase,review_media(id,media_type,public_url,storage_path,mime_type,sort_order,created_at),review_replies(id,review_id,user_id,admin_id,author_name,avatar_url,reply_text,created_at,status,review_media(id,media_type,public_url,storage_path,mime_type,sort_order,created_at))")
      .eq("product_slug", slug).order("created_at", { ascending: false });
    if (error) throw error;
    return data || [];
  }

  async function renderAll() {
    const list = document.getElementById("nlsReviewList");
    try {
      const reviews = await loadReviews();
      const approved = reviews.filter(r => r.status === "approved" || r.user_id === currentUser?.id);
      renderSummary(approved);
      await renderList(approved);
      renderWrite(approved);
    } catch (error) {
      console.error("Review load error:", error);
      list.innerHTML = `<div class="nls-review-error">Unable to load reviews right now. Please refresh the page.</div>`;
    }
  }

  function renderSummary(reviews) {
    const box = document.getElementById("nlsReviewSummary");
    const counts = [5,4,3,2,1].map(n => reviews.filter(r => Number(r.rating) === n).length);
    const total = reviews.length;
    const average = total ? reviews.reduce((s,r) => s + Number(r.rating || 0), 0) / total : 0;
    box.innerHTML = `
      <div class="nls-review-average"><strong>${average ? average.toFixed(1) : "0.0"}</strong><div class="nls-review-stars">${stars(average)}</div><small>${total} review${total === 1 ? "" : "s"}</small></div>
      <div class="nls-review-bars">${[5,4,3,2,1].map((n,i) => `<div class="nls-review-bar"><span>${n}★</span><div class="nls-review-track"><div class="nls-review-fill" style="width:${total ? (counts[i]/total)*100 : 0}%"></div></div><span>${counts[i]}</span></div>`).join("")}</div>
    `;
  }

  async function renderList(reviews) {
    const list = document.getElementById("nlsReviewList");
    if (!reviews.length) { list.innerHTML = `<div class="nls-empty">No reviews yet. Be the first to review this product.</div>`; return; }
    const profileIds = [...new Set(reviews.map(r => r.user_id).filter(Boolean))];
    let profiles = {};
    if (profileIds.length) {
      const { data } = await supabase.from("profiles").select("id,full_name,avatar_url").in("id", profileIds);
      (data || []).forEach(p => profiles[p.id] = p);
    }
    list.innerHTML = reviews.map(review => {
      const profile = profiles[review.user_id] || {};
      const name = review.author_name || profile.full_name || "Customer";
      const avatar = review.user_id && profile.avatar_url ? `<img class="nls-review-avatar" src="${esc(profile.avatar_url)}" alt="${esc(name)}">` : `<div class="nls-review-avatar">${esc(name.charAt(0).toUpperCase())}</div>`;
      const media = (review.review_media || []).sort((a,b) => a.sort_order - b.sort_order).map(renderMedia).join("");
      const replies = (review.review_replies || []).filter(x => x.status === "approved" || x.user_id === currentUser?.id).map(renderReply).join("");
      return `<article class="nls-review-card" data-review-id="${esc(review.id)}">
        <div class="nls-review-author">${avatar}<div><strong>${esc(name)}${review.verified_purchase ? `<span class="nls-verified"><i class="fa-solid fa-circle-check"></i> Verified Purchase</span>` : ""}</strong><div class="nls-review-meta">${stars(review.rating)} · ${esc(formatDate(review.created_at))}</div></div></div>
        ${review.review_text ? `<div class="nls-review-body">${esc(review.review_text)}</div>` : ""}
        ${media ? `<div class="nls-review-gallery">${media}</div>` : ""}
        <div class="nls-review-actions"><button class="nls-review-action" data-reply="${esc(review.id)}"><i class="fa-regular fa-comment"></i> Reply</button>${currentUser?.id === review.user_id ? `<button class="nls-review-action" data-edit-review="${esc(review.id)}"><i class="fa-regular fa-pen-to-square"></i> Edit</button>` : ""}</div>
        <div class="nls-replies" data-replies-for="${esc(review.id)}">${replies || ""}</div>
        <div class="nls-reply-form"><input data-reply-input="${esc(review.id)}" placeholder="Write a reply…" maxlength="1000"><button data-send-reply="${esc(review.id)}">Reply</button></div>
      </article>`;
    }).join("");

    list.querySelectorAll("[data-reply]").forEach(btn => btn.addEventListener("click", () => focusReply(btn.dataset.reply)));
    list.querySelectorAll("[data-send-reply]").forEach(btn => btn.addEventListener("click", () => submitReply(btn.dataset.sendReply)));
    list.querySelectorAll("[data-edit-review]").forEach(btn => btn.addEventListener("click", () => editReview(btn.dataset.editReview, reviews)));
    list.querySelectorAll("[data-media-url]").forEach(el => el.addEventListener("click", () => openMedia(el.dataset.mediaUrl, el.dataset.mediaType)));
  }

  function renderReply(reply) {
    const name = reply.author_name || (reply.admin_id ? "Next Level Subs" : "Customer");
    const media = (reply.review_media || []).sort((a,b) => a.sort_order - b.sort_order).map(renderMedia).join("");
    return `<div class="nls-reply"><div class="nls-reply-head"><strong>${esc(name)}</strong>${reply.admin_id ? `<span class="nls-verified">Admin</span>` : ""}<span class="nls-reply-date">${esc(formatDate(reply.created_at))}</span></div>${reply.reply_text ? `<div class="nls-reply-text">${esc(reply.reply_text)}</div>` : ""}${media ? `<div class="nls-reply-gallery">${media}</div>` : ""}</div>`;
  }

  function renderMedia(item) {
    const url = esc(item.public_url);
    if (item.media_type === "video") return `<video data-media-url="${url}" data-media-type="video" controls preload="metadata"><source src="${url}" type="${esc(item.mime_type || "video/mp4")}"></video>`;
    return `<img data-media-url="${url}" data-media-type="image" src="${url}" alt="Customer review photo" loading="lazy">`;
  }

  function renderWrite(reviews) {
    const box = document.getElementById("nlsReviewWrite");
    if (!currentUser) {
      box.innerHTML = `<div class="nls-review-write"><h3>Share your experience</h3><div class="nls-review-login">Please <a href="/login.html?redirect=${encodeURIComponent(location.pathname + location.search)}">log in</a> to write a review or reply.</div></div>`;
      return;
    }
    const existing = reviews.find(r => r.user_id === currentUser.id);
    if (existing && !editingReviewId) {
      box.innerHTML = `<div class="nls-review-write"><h3>Your review</h3><p style="color:#64748b;margin:0 0 12px">You already reviewed this product. You can edit your review below.</p><button class="nls-review-submit" id="nlsStartEdit">Edit my review</button></div>`;
      document.getElementById("nlsStartEdit").addEventListener("click", () => editReview(existing.id, reviews));
      return;
    }
    box.innerHTML = `<div class="nls-review-write"><h3>${editingReviewId ? "Edit your review" : "Write a review"}</h3><div class="nls-rating-picker" aria-label="Choose rating">${[1,2,3,4,5].map(n => `<button type="button" data-rating="${n}" aria-label="${n} star">★</button>`).join("")}</div><textarea id="nlsReviewText" class="nls-review-text" maxlength="3000" placeholder="Tell others about your experience…"></textarea><div id="nlsReviewMedia" class="nls-review-media-row"></div><label class="nls-media-label"><i class="fa-solid fa-camera"></i> Add photos/videos<input id="nlsReviewFiles" type="file" accept="image/jpeg,image/png,image/webp,image/gif,video/mp4,video/webm,video/quicktime" multiple></label><div style="margin-top:15px"><button id="nlsSubmitReview" class="nls-review-submit">${editingReviewId ? "Update review" : "Publish review"}</button>${editingReviewId ? `<button id="nlsCancelEdit" class="nls-review-cancel">Cancel</button>` : ""}</div><div id="nlsReviewFormError"></div></div>`;
    if (editingReviewId) {
      const existing = reviews.find(r => r.id === editingReviewId);
      if (existing) {
        selectedRating = Number(existing.rating) || 0;
        document.getElementById("nlsReviewText").value = existing.review_text || "";
      }
    } else selectedRating = 0;
    updateRatingButtons();
    document.querySelectorAll("[data-rating]").forEach(b => b.addEventListener("click", () => { selectedRating = Number(b.dataset.rating); updateRatingButtons(); }));
    document.getElementById("nlsReviewFiles").addEventListener("change", e => addFiles([...e.target.files]));
    document.getElementById("nlsSubmitReview").addEventListener("click", submitReview);
    document.getElementById("nlsCancelEdit")?.addEventListener("click", () => { editingReviewId = null; selectedFiles = []; renderAll(); });
  }

  function updateRatingButtons() { document.querySelectorAll("[data-rating]").forEach(b => b.classList.toggle("active", Number(b.dataset.rating) <= selectedRating)); }

  function addFiles(files) {
    const error = document.getElementById("nlsReviewFormError");
    const next = [...selectedFiles];
    for (const file of files) {
      if (next.length >= MAX_FILES) { error.innerHTML = `<div class="nls-review-error">You can attach up to ${MAX_FILES} files.</div>`; break; }
      if (!ALLOWED.has(file.type)) { error.innerHTML = `<div class="nls-review-error">Unsupported file type: ${esc(file.name)}</div>`; continue; }
      const max = file.type.startsWith("video/") ? MAX_VIDEO : MAX_IMAGE;
      if (file.size > max) { error.innerHTML = `<div class="nls-review-error">${esc(file.name)} is too large. Maximum is 6 MB per file.</div>`; continue; }
      next.push(file);
    }
    selectedFiles = next;
    renderSelectedFiles();
  }

  function renderSelectedFiles() {
    const box = document.getElementById("nlsReviewMedia"); if (!box) return;
    box.innerHTML = selectedFiles.map((file,i) => {
      const url = URL.createObjectURL(file);
      return `<div class="nls-media-preview">${file.type.startsWith("video/") ? `<video src="${url}" muted></video><span class="video-mark">▶</span>` : `<img src="${url}" alt="Preview">`}<button class="nls-media-remove" type="button" data-remove-media="${i}">×</button></div>`;
    }).join("");
    box.querySelectorAll("[data-remove-media]").forEach(b => b.addEventListener("click", () => { selectedFiles.splice(Number(b.dataset.removeMedia),1); renderSelectedFiles(); }));
  }

  async function uploadMedia(files, ownerType, ownerId) {
    const rows = [];
    for (let i=0; i<files.length; i++) {
      const file = files[i];
      const safe = file.name.toLowerCase().replace(/[^a-z0-9._-]+/g,"-").slice(-80);
      const path = `${currentUser.id}/${ownerType}/${ownerId}/${crypto.randomUUID()}-${safe}`;
      const { error } = await supabase.storage.from(BUCKET).upload(path, file, { contentType:file.type, cacheControl:"31536000", upsert:false });
      if (error) throw error;
      const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
      rows.push({
        ...(ownerType === "review" ? { review_id: ownerId } : { reply_id: ownerId }),
        user_id: currentUser.id, media_type: mediaType(file), storage_path:path,
        public_url:data.publicUrl, mime_type:file.type, file_size:file.size, sort_order:i
      });
    }
    if (rows.length) {
      const { error } = await supabase.from("review_media").insert(rows);
      if (error) throw error;
    }
  }

  async function submitReview() {
    const btn = document.getElementById("nlsSubmitReview");
    const errorBox = document.getElementById("nlsReviewFormError");
    const text = document.getElementById("nlsReviewText")?.value.trim() || "";
    errorBox.innerHTML = "";
    if (!selectedRating) { errorBox.innerHTML = `<div class="nls-review-error">Please choose a star rating.</div>`; return; }
    if (!text && !selectedFiles.length) { errorBox.innerHTML = `<div class="nls-review-error">Please write something or attach a photo/video.</div>`; return; }
    btn.disabled = true; btn.textContent = "Publishing…";
    try {
      const profile = await getProfile(currentUser.id);
      const verified = await isVerifiedPurchase(currentUser.id, product.slug || slugify(product.name));
      const payload = { product_slug:product.slug || slugify(product.name), user_id:currentUser.id, author_name:profile?.full_name || currentUser.user_metadata?.full_name || currentUser.email?.split("@")[0] || "Customer", rating:selectedRating, review_text:text, verified_purchase:verified, status:"approved" };
      let reviewId = editingReviewId;
      if (editingReviewId) {
        const { error } = await supabase.from("product_reviews").update(payload).eq("id", editingReviewId).eq("user_id", currentUser.id);
        if (error) throw error;
      } else {
        const { data, error } = await supabase.from("product_reviews").insert(payload).select("id").single();
        if (error) throw error; reviewId = data.id;
      }
      if (selectedFiles.length) await uploadMedia(selectedFiles, "review", reviewId);
      editingReviewId = null; selectedFiles = []; selectedRating = 0;
      await renderAll();
    } catch (e) {
      console.error(e); errorBox.innerHTML = `<div class="nls-review-error">${esc(e.message || "Could not save your review.")}</div>`;
      btn.disabled = false; btn.textContent = editingReviewId ? "Update review" : "Publish review";
    }
  }

  async function submitReply(reviewId) {
    if (!currentUser) { window.location.href = "/login.html?redirect=" + encodeURIComponent(location.pathname + location.search); return; }
    const input = document.querySelector(`[data-reply-input="${CSS.escape(reviewId)}"]`);
    const text = input?.value.trim() || "";
    if (!text) return;
    const profile = await getProfile(currentUser.id);
    const { data, error } = await supabase.from("review_replies").insert({ review_id:reviewId, user_id:currentUser.id, author_name:profile?.full_name || currentUser.user_metadata?.full_name || currentUser.email?.split("@")[0] || "Customer", avatar_url:profile?.avatar_url || null, reply_text:text, status:"approved" }).select("id").single();
    if (error) { console.error(error); alert("Could not post reply. Please try again."); return; }
    input.value = "";
    await renderAll();
  }

  function focusReply(id) { const input = document.querySelector(`[data-reply-input="${CSS.escape(id)}"]`); input?.focus(); input?.scrollIntoView({ behavior:"smooth", block:"center" }); }

  function editReview(id, reviews) {
    const review = reviews.find(r => r.id === id); if (!review) return;
    editingReviewId = id; selectedFiles = []; selectedRating = Number(review.rating) || 0; renderWrite(reviews); document.getElementById("nlsReviewText")?.scrollIntoView({behavior:"smooth",block:"center"});
  }

  function openMedia(url,type) {
    const modal = document.createElement("div"); modal.className="nls-review-modal";
    modal.innerHTML = `<button aria-label="Close">×</button>${type === "video" ? `<video src="${esc(url)}" controls autoplay></video>` : `<img src="${esc(url)}" alt="Customer review media">`}`;
    modal.addEventListener("click", e => { if (e.target === modal || e.target.tagName === "BUTTON") modal.remove(); });
    document.body.appendChild(modal);
  }

  async function init() {
    product = await waitForProduct();
    product.slug = product.slug || slugify(product.name);
    renderShell();
    currentUser = await getUser();
    await renderAll();
    supabase.auth.onAuthStateChange(async () => { currentUser = await getUser(); await renderAll(); });
  }

  document.addEventListener("DOMContentLoaded", init, { once:true });
})();
