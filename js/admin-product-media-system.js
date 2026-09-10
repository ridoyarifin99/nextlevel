"use strict";
(() => {
  if (window.__NLSProductMediaSystem) return;
  window.__NLSProductMediaSystem = true;

  const BUCKET = "product-media";
  const MAX = 10 * 1024 * 1024;
  const TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml"]);
  const db = () => window.supabaseClient;
  const $ = id => document.getElementById(id);
  const esc = v => String(v ?? "").replace(/[&<>\"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]));
  const slugify = v => String(v || "product").toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "product";
  const label = role => ({primary:"Primary / Card Image",logo:"Product Logo",gallery:"Details Gallery",service:"Service / Component Image"}[role] || role);
  let current = [];

  function toast(message, bad = false) {
    const host = $("toast"); if (!host) return;
    const x = document.createElement("div"); x.className = `toast ${bad ? "error" : "success"}`; x.textContent = message;
    host.appendChild(x); setTimeout(() => x.remove(), 4000);
  }

  function normalize(list) {
    return (Array.isArray(list) ? list : []).map(x => ({
      id: x.id || null, role: x.role || "gallery", url: x.url || "", storage_path: x.storage_path || "",
      alt_text: x.alt_text || "", title: x.title || "", service_name: x.service_name || "",
      display_order: Number(x.display_order || 0), is_active: x.is_active !== false, metadata: x.metadata || {},
      __tmp: x.__tmp || null
    }));
  }
  function itemKey(x) { if (x.id) return `id:${x.id}`; if (!x.__tmp) x.__tmp = crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2); return `tmp:${x.__tmp}`; }
  function make(role, data = {}) { return normalize([{...data, role}])[0]; }

  function styles() {
    if ($("nls-product-media-system-styles")) return;
    const s = document.createElement("style"); s.id = "nls-product-media-system-styles";
    s.textContent = `
      .nls-media-box{grid-column:1/-1;border:1px solid #e5e7eb;border-radius:14px;padding:14px;background:#fafbff}
      .nls-media-head{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:10px}.nls-media-head h3{margin:0;font-size:14px}.nls-media-head p{margin:3px 0 0;color:#6b7280;font-size:11px}
      .nls-media-group{border:1px solid #e5e7eb;border-radius:11px;background:#fff;padding:10px;margin-top:9px}.nls-media-title{font-size:11px;font-weight:900;color:#374151;margin-bottom:8px}
      .nls-media-row{display:grid;grid-template-columns:72px minmax(0,1fr) auto;gap:9px;align-items:center;margin-top:8px}.nls-media-thumb{width:72px;height:58px;border:1px solid #e5e7eb;border-radius:9px;object-fit:contain;background:#f8fafc;padding:4px}
      .nls-media-fields{display:grid;grid-template-columns:1fr 1fr;gap:7px}.nls-media-fields input{min-width:0;border:1px solid #dbe0e7;border-radius:8px;padding:8px;font-size:11px}
      .nls-media-actions{display:flex;gap:5px;flex-wrap:wrap}.nls-media-actions button,.nls-media-upload{border:1px solid #dbe0e7;background:#fff;border-radius:8px;padding:7px 9px;font-size:10px;font-weight:800;cursor:pointer}.nls-media-actions .remove{color:#b91c1c;border-color:#fecaca}
      .nls-media-upload{display:inline-flex;align-items:center;gap:5px;color:#374151}.nls-media-upload input{display:none}.nls-media-add{margin-top:9px}.nls-media-empty{font-size:11px;color:#9ca3af;padding:8px 0}
      @media(max-width:700px){.nls-media-row{grid-template-columns:58px minmax(0,1fr)}.nls-media-thumb{width:58px;height:50px}.nls-media-actions{grid-column:2}.nls-media-fields{grid-template-columns:1fr}}
    `;
    document.head.appendChild(s);
  }

  function mount() {
    styles();
    if ($("nlsProductMedia")) return;
    const image = $("pImage");
    const field = image?.closest(".field") || image?.parentElement;
    const host = document.createElement("div"); host.id = "nlsProductMedia"; host.className = "nls-media-box";
    host.innerHTML = `<div class="nls-media-head"><div><h3>Product Media Library</h3><p>Central media for card image, logo, details gallery and service/component images.</p></div></div>
      <div class="nls-media-group"><div class="nls-media-title">Primary / Card Image</div><div id="nlsPrimaryMedia"></div></div>
      <div class="nls-media-group"><div class="nls-media-title">Product Logo</div><div id="nlsLogoMedia"></div></div>
      <div class="nls-media-group"><div class="nls-media-title">Details Gallery</div><div id="nlsGalleryMedia"></div><button type="button" class="btn nls-media-add" data-media-add="gallery">+ Add Gallery Image</button></div>
      <div class="nls-media-group"><div class="nls-media-title">Service / Component Images</div><div id="nlsServiceMedia"></div><button type="button" class="btn nls-media-add" data-media-add="service">+ Add Service Image</button></div>`;
    (field?.parentElement || $("plans")?.parentElement)?.appendChild(host);

    host.addEventListener("click", e => {
      const add = e.target.closest("[data-media-add]");
      if (add) { current.push(make(add.dataset.mediaAdd)); render(); return; }
      const remove = e.target.closest("[data-media-remove]");
      if (remove) { const row = remove.closest("[data-media-key]"), key = row?.dataset.mediaKey; current = current.filter(x => itemKey(x) !== key); render(); }
    });
    host.addEventListener("input", e => {
      const row = e.target.closest("[data-media-key]"); if (!row) return;
      const item = current.find(x => itemKey(x) === row.dataset.mediaKey); if (!item || !e.target.dataset.mediaField) return;
      item[e.target.dataset.mediaField] = e.target.value;
      if (e.target.dataset.mediaField === "url") { const img = row.querySelector(".nls-media-thumb"); if (img) img.src = item.url || "/images/logo.png"; }
      if (item.role === "primary" && e.target.dataset.mediaField === "url") syncPrimary();
    });
    host.addEventListener("change", async e => {
      const input = e.target.closest("input[type=file][data-media-file]"); if (!input || !input.files?.[0]) return;
      const row = input.closest("[data-media-key]"), item = current.find(x => itemKey(x) === row?.dataset.mediaKey); if (!item) return;
      await upload(item, input.files[0]); input.value = "";
    });
  }

  function row(item) {
    const key = itemKey(item);
    const service = item.role === "service" ? `<input data-media-field="service_name" placeholder="Service name" value="${esc(item.service_name)}">` : "";
    return `<div class="nls-media-row" data-media-key="${esc(key)}"><img class="nls-media-thumb" src="${esc(item.url || "/images/logo.png")}" alt="">
      <div class="nls-media-fields">${service}<input data-media-field="title" placeholder="Title (optional)" value="${esc(item.title)}"><input data-media-field="alt_text" placeholder="Alt text" value="${esc(item.alt_text)}"><input data-media-field="url" placeholder="Public image URL" value="${esc(item.url)}"></div>
      <div class="nls-media-actions"><label class="nls-media-upload">Upload<input type="file" data-media-file accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"></label><button type="button" class="remove" data-media-remove>Remove</button></div></div>`;
  }

  function render() {
    if (!$("nlsProductMedia")) return;
    if (!current.some(x => x.role === "primary")) current.unshift(make("primary"));
    if (!current.some(x => x.role === "logo")) current.push(make("logo"));
    $("nlsPrimaryMedia").innerHTML = row(current.find(x => x.role === "primary"));
    $("nlsLogoMedia").innerHTML = row(current.find(x => x.role === "logo"));
    const gallery = current.filter(x => x.role === "gallery"), service = current.filter(x => x.role === "service");
    $("nlsGalleryMedia").innerHTML = gallery.length ? gallery.map(row).join("") : '<div class="nls-media-empty">No gallery images yet.</div>';
    $("nlsServiceMedia").innerHTML = service.length ? service.map(row).join("") : '<div class="nls-media-empty">No service/component images yet.</div>';
  }

  function syncPrimary() { const primary = current.find(x => x.role === "primary"); if (primary?.url && $("pImage")) $("pImage").value = primary.url; }

  async function upload(item, file) {
    if (!TYPES.has(file.type) || file.size > MAX) { toast("Use a supported image up to 10MB.", true); return; }
    const slug = slugify($("pSlug")?.value || $("pName")?.value), ext = (file.name.split(".").pop() || "webp").toLowerCase().replace(/[^a-z0-9]/g, "") || "webp";
    const path = `products/${slug}/${item.role}/${Date.now()}-${crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2)}.${ext}`;
    try {
      const { error } = await db().storage.from(BUCKET).upload(path, file, { upsert: false, contentType: file.type, cacheControl: "31536000" }); if (error) throw error;
      const { data } = db().storage.from(BUCKET).getPublicUrl(path); item.url = data.publicUrl; item.storage_path = path; item.is_active = true; syncPrimary(); render(); toast(`${label(item.role)} uploaded.`);
    } catch (e) { console.error(e); toast(e?.message || "Image upload failed", true); }
  }

  async function open(product) {
    mount();
    if (!product?.id) { current = [make("primary", {url: $("pImage")?.value || ""}), make("logo")]; render(); return; }
    const r = await db().from("product_media").select("*").eq("product_id", product.id).order("role").order("display_order").order("created_at");
    if (r.error) throw r.error;
    current = normalize(r.data || []);
    if (!current.some(x => x.role === "primary")) current.unshift(make("primary", {url: product.image_url || "", alt_text: product.name || ""}));
    if (!current.some(x => x.role === "logo")) current.push(make("logo"));
    render();
  }

  function collect() {
    syncPrimary();
    return current.filter(x => x.is_active !== false && x.url).map((x, i) => ({
      id: x.id || null, product_id: null, role: x.role, url: x.url, storage_path: x.storage_path || null,
      alt_text: x.alt_text || null, title: x.title || null, service_name: x.service_name || null,
      display_order: x.role === "gallery" || x.role === "service" ? i : 0, is_active: true, metadata: x.metadata || {}
    }));
  }

  async function save(productId) {
    if (!productId) return;
    const rows = collect().map(x => ({...x, product_id: productId, id: x.id || (crypto.randomUUID ? crypto.randomUUID() : null)})).filter(x => x.id);
    const existing = await db().from("product_media").select("id,storage_path").eq("product_id", productId); if (existing.error) throw existing.error;
    const keep = new Set(rows.map(x => x.id));
    const removed = (existing.data || []).filter(x => !keep.has(x.id));
    if (removed.length) {
      const d = await db().from("product_media").delete().in("id", removed.map(x => x.id)); if (d.error) throw d.error;
      const paths = removed.map(x => x.storage_path).filter(Boolean);
      if (paths.length) { const s = await db().storage.from(BUCKET).remove(paths); if (s.error) console.warn("Product media storage cleanup failed", s.error); }
    }
    if (rows.length) { const u = await db().from("product_media").upsert(rows, {onConflict:"id"}); if (u.error) throw u.error; }
    try { localStorage.setItem("nls:central-catalog-changed", String(Date.now())); } catch (e) {}
    window.dispatchEvent(new CustomEvent("nls:central-catalog-changed"));
  }

  window.NextLevelProductMedia = { mount, open, collect, save, roleLabel: label };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", mount, {once:true}); else mount();
})();
