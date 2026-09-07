"use strict";

/* Next Level Subs — reply media + own-reply deletion enhancement.
 * Uses the existing Replies UI; does not create a second review/reply section.
 */
(() => {
  const path = window.location.pathname;
  if (!/\/details\.html$/i.test(path) && !/\/product\//i.test(path)) return;
  if (!window.supabaseClient) return;

  const supabase = window.supabaseClient;
  const MAX_FILES = 6;
  const MAX_SIZE = 6 * 1024 * 1024;
  const ALLOWED = new Set(["image/jpeg","image/png","image/webp","image/gif","video/mp4","video/webm","video/quicktime"]);
  const esc = v => String(v ?? "").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/\"/g,"&quot;").replace(/'/g,"&#039;");
  const objectUrls = new Set();
  const replyFiles = new Map();
  let observer = null;
  let busy = false;

  const getUser = async () => { try { return (await supabase.auth.getUser()).data?.user || null; } catch (_) { return null; } };

  function ensureStyles() {
    if (document.getElementById("nls-reply-media-styles")) return;
    const s = document.createElement("style");
    s.id = "nls-reply-media-styles";
    s.textContent = `
      .nls-reply-composer{display:flex;align-items:center;gap:8px;margin:14px 0 0 56px;padding:7px 8px 7px 11px;border:1px solid #e2e6ee;border-radius:14px;background:#fff;box-shadow:0 4px 16px rgba(15,23,42,.045);transition:border-color .2s ease,box-shadow .2s ease}
      .nls-reply-composer:focus-within{border-color:#a78bfa;box-shadow:0 0 0 4px rgba(139,92,246,.08)}
      .nls-reply-composer input[type=text]{flex:1;min-width:0;border:0;outline:0;background:transparent;padding:6px 2px;font:inherit}
      .nls-reply-media-add{width:36px;height:36px;border:1px solid #e5e7eb;border-radius:10px;background:#f8fafc;color:#64748b;display:inline-flex;align-items:center;justify-content:center;cursor:pointer;transition:.2s}
      .nls-reply-media-add:hover{background:#faf5ff;border-color:#c4b5fd;color:#7c3aed}
      .nls-reply-media-add input{display:none}
      .nls-reply-send{border:0;border-radius:10px;padding:9px 14px;background:linear-gradient(135deg,#6a11cb,#2575fc);color:#fff;font-weight:800;cursor:pointer;white-space:nowrap;transition:transform .18s ease,box-shadow .18s ease}
      .nls-reply-send:hover{transform:translateY(-1px);box-shadow:0 6px 15px rgba(106,17,203,.2)}
      .nls-reply-previews{display:flex;gap:7px;flex-wrap:wrap;margin:8px 0 0 56px}
      .nls-reply-preview{position:relative;width:62px;height:62px;border-radius:10px;overflow:hidden;border:1px solid #e2e5eb;background:#f8fafc;box-shadow:0 2px 8px rgba(15,23,42,.06)}
      .nls-reply-preview img,.nls-reply-preview video{width:100%;height:100%;object-fit:cover}
      .nls-reply-preview button{position:absolute;right:3px;top:3px;width:20px;height:20px;border:0;border-radius:50%;background:rgba(15,23,42,.8);color:#fff;cursor:pointer;line-height:18px;padding:0}
      .nls-reply-preview button:hover{background:#dc2626}
      .nls-reply-delete{border:0;background:transparent;color:#94a3b8;font-size:12px;font-weight:700;cursor:pointer;padding:2px 0;margin-left:8px}
      .nls-reply-delete:hover{color:#dc2626}
      .nls-reply-media-note{font-size:11px;color:#94a3b8;margin:5px 0 0 56px}
      @media(max-width:640px){.nls-reply-composer{margin-left:15px}.nls-reply-previews,.nls-reply-media-note{margin-left:15px}.nls-reply-composer{padding:6px}.nls-reply-send{padding:9px 11px}.nls-reply-media-add{width:34px;height:34px}}
    `;
    document.head.appendChild(s);
  }

  function validateFiles(files, current) {
    const incoming = Array.from(files || []);
    const bad = incoming.find(f => !ALLOWED.has(f.type) || f.size > MAX_SIZE);
    if (bad) return { error: "Each file must be an allowed image/video and 6MB or smaller." };
    if (current.length + incoming.length > MAX_FILES) return { error: "You can attach up to 6 photos/videos to a reply." };
    return { files: incoming };
  }

  function previewMarkup(files, replyId) {
    return (files || []).map((file, i) => {
      const url = URL.createObjectURL(file); objectUrls.add(url);
      const media = file.type.startsWith("video/") ? `<video src="${url}" muted></video>` : `<img src="${url}" alt="Reply media preview">`;
      return `<div class="nls-reply-preview">${media}<button type="button" data-reply-remove-file="${i}" data-reply-id="${esc(replyId)}" aria-label="Remove media">×</button></div>`;
    }).join("");
  }

  function message(el, text, error = false) {
    let box = el.querySelector("[data-reply-message]");
    if (!box) { box = document.createElement("div"); box.dataset.replyMessage = ""; el.appendChild(box); }
    box.innerHTML = `<div class="${error ? "nls-existing-error" : "nls-existing-success"}" style="margin:6px 0 0 56px">${esc(text)}</div>`;
    setTimeout(() => { if (box.isConnected) box.innerHTML = ""; }, 4500);
  }

  function mountComposer(box) {
    if (!box || box.dataset.nlsReplyEnhanced === "true") return;
    const input = box.querySelector("[data-reply-input]");
    const send = box.querySelector("[data-send-reply]");
    const reviewId = input?.dataset.replyInput || send?.dataset.sendReply;
    if (!reviewId) return;

    if (send) delete send.dataset.sendReply;
    box.dataset.nlsReplyEnhanced = "true";
    replyFiles.set(reviewId, []);
    box.className = "nls-reply-composer";
    box.innerHTML = `<label class="nls-reply-media-add" title="Add photos/videos"><i class="fas fa-paperclip"></i><input type="file" data-reply-files accept="image/jpeg,image/png,image/webp,image/gif,video/mp4,video/webm,video/quicktime" multiple></label><input type="text" maxlength="1000" placeholder="Write a reply…" data-nls-reply-input="${esc(reviewId)}"><button type="button" class="nls-reply-send" data-nls-send-reply="${esc(reviewId)}">Reply</button>`;
    const previews = document.createElement("div");
    previews.className = "nls-reply-previews";
    previews.dataset.replyPreviews = reviewId;
    box.after(previews);

    const fileInput = box.querySelector("[data-reply-files]");
    fileInput?.addEventListener("change", e => {
      const current = replyFiles.get(reviewId) || [];
      const result = validateFiles(e.target.files, current);
      if (result.error) { message(box.parentElement || box, result.error, true); e.target.value = ""; return; }
      current.push(...result.files); replyFiles.set(reviewId, current);
      previews.innerHTML = previewMarkup(current, reviewId);
      previews.querySelectorAll("[data-reply-remove-file]").forEach(btn => btn.onclick = () => {
        current.splice(Number(btn.dataset.replyRemoveFile), 1); replyFiles.set(reviewId, current); previews.innerHTML = previewMarkup(current, reviewId); bindPreviewRemovers(previews);
      });
      bindPreviewRemovers(previews); e.target.value = "";
    });
    box.querySelector("[data-nls-send-reply]")?.addEventListener("click", () => sendReplyWithMedia(reviewId, box, previews));
    box.querySelector("[data-nls-reply-input]")?.addEventListener("keydown", e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendReplyWithMedia(reviewId, box, previews); } });
  }

  function bindPreviewRemovers(previews) {
    previews.querySelectorAll("[data-reply-remove-file]").forEach(btn => btn.onclick = () => {
      const id = btn.dataset.replyId, files = replyFiles.get(id) || [];
      files.splice(Number(btn.dataset.replyRemoveFile), 1); replyFiles.set(id, files); previews.innerHTML = previewMarkup(files, id); bindPreviewRemovers(previews);
    });
  }

  async function uploadReplyMedia(file, replyId, userId, index) {
    const ext = (file.name.split(".").pop() || "bin").toLowerCase();
    const path = `replies/${replyId}/${userId}-${Date.now()}-${index}.${ext}`;
    const { error } = await supabase.storage.from("review-media").upload(path, file, { upsert: false, contentType: file.type });
    if (error) throw error;
    const { data } = supabase.storage.from("review-media").getPublicUrl(path);
    const { error: dbError } = await supabase.from("review_media").insert({
      review_id: null, reply_id: replyId, user_id: userId,
      media_type: file.type.startsWith("video/") ? "video" : "image",
      storage_path: path, public_url: data.publicUrl, mime_type: file.type,
      file_size: file.size, sort_order: index
    });
    if (dbError) { await supabase.storage.from("review-media").remove([path]).catch(() => {}); throw dbError; }
  }

  async function sendReplyWithMedia(reviewId, box, previews) {
    if (busy) return;
    const user = await getUser();
    if (!user) { message(box.parentElement || box, "Please log in to reply.", true); return; }
    const input = box.querySelector("[data-nls-reply-input]");
    const text = input?.value.trim() || "";
    const files = replyFiles.get(reviewId) || [];
    if (!text && !files.length) { message(box.parentElement || box, "Write a reply or add a photo/video first.", true); return; }
    busy = true;
    const btn = box.querySelector("[data-nls-send-reply]");
    if (btn) { btn.disabled = true; btn.textContent = "Sending…"; }
    try {
      const { data: p } = await supabase.from("profiles").select("full_name,avatar_url").eq("id", user.id).maybeSingle();
      const { data: reply, error } = await supabase.from("review_replies").insert({ review_id: reviewId, user_id: user.id, author_name: p?.full_name || user.email?.split("@")[0] || "Customer", avatar_url: p?.avatar_url || null, reply_text: text, status: "approved" }).select("id").single();
      if (error) throw error;
      for (let i = 0; i < files.length; i++) await uploadReplyMedia(files[i], reply.id, user.id, i);
      replyFiles.set(reviewId, []);
      objectUrls.forEach(u => URL.revokeObjectURL(u)); objectUrls.clear();
      if (typeof window.switchTab === "function") window.switchTab("reviews");
    } catch (error) {
      console.error("Reply media error", error);
      message(box.parentElement || box, error?.message || "Unable to send your reply.", true);
      if (btn) { btn.disabled = false; btn.textContent = "Reply"; }
    } finally { busy = false; }
  }

  async function addDeleteControls() {
    const user = await getUser();
    if (!user) return;
    const ids = [...document.querySelectorAll(".nls-existing-reply")].map(x => x.dataset.replyId).filter(Boolean);
    if (!ids.length) return;
    const { data: replies } = await supabase.from("review_replies").select("id,user_id").in("id", ids);
    (replies || []).filter(r => r.user_id === user.id).forEach(r => {
      const el = document.querySelector(`.nls-existing-reply[data-reply-id="${CSS.escape(r.id)}"]`);
      if (!el || el.querySelector("[data-delete-own-reply]")) return;
      const meta = el.querySelector(".nls-reply-meta") || el.firstElementChild;
      const del = document.createElement("button"); del.type="button"; del.className="nls-reply-delete"; del.dataset.deleteOwnReply=r.id; del.textContent="Delete"; del.title="Delete your reply";
      meta?.appendChild(del);
      del.addEventListener("click", () => deleteOwnReply(r.id));
    });
  }

  async function deleteOwnReply(replyId) {
    const user = await getUser(); if (!user) return;
    if (!confirm("Delete this reply? This cannot be undone.")) return;
    try {
      const { data: media } = await supabase.from("review_media").select("id,storage_path").eq("reply_id", replyId).eq("user_id", user.id);
      for (const m of media || []) {
        if (m.storage_path) await supabase.storage.from("review-media").remove([m.storage_path]);
        await supabase.from("review_media").delete().eq("id", m.id).eq("user_id", user.id);
      }
      const { error } = await supabase.from("review_replies").delete().eq("id", replyId).eq("user_id", user.id);
      if (error) throw error;
      if (typeof window.switchTab === "function") window.switchTab("reviews");
    } catch (error) { console.error(error); alert(error?.message || "Unable to delete your reply."); }
  }

  function markReplyIds() {
    document.querySelectorAll(".nls-existing-replies .nls-existing-reply").forEach(el => {
      if (el.dataset.replyId) return;
      const text = el.querySelector("p")?.textContent || "";
      const review = el.closest("[data-review-id]");
      const reviewId = review?.dataset.reviewId;
      if (!reviewId) return;
      /* The existing renderer does not expose reply IDs on the DOM. Resolve by matching
       * reply text + review id, then persist the ID on the element for controls. */
      resolveReplyId(el, reviewId, text);
    });
  }

  async function resolveReplyId(el, reviewId, text) {
    if (el.dataset.replyId) return;
    const { data } = await supabase.from("review_replies").select("id,user_id,reply_text,created_at").eq("review_id", reviewId).eq("reply_text", text).order("created_at", { ascending: false }).limit(5);
    const match = (data || []).find(r => r.reply_text === text);
    if (match) { el.dataset.replyId = match.id; await addDeleteControls(); }
  }

  function process() {
    ensureStyles();
    document.querySelectorAll(".nls-existing-reply-box").forEach(mountComposer);
    markReplyIds();
  }

  function boot() {
    ensureStyles();
    process();
    observer = new MutationObserver(() => { if (!busy) process(); });
    observer.observe(document.body, { childList: true, subtree: true });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot, { once: true }); else boot();
})();
