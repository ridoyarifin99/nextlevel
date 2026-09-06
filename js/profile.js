(function () {
  "use strict";

  if (window.__NLSProfileLoaded) return;
  window.__NLSProfileLoaded = true;

  const BUCKET = "avatars";
  const MAX_SIZE = 5 * 1024 * 1024;
  const TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

  function escape(value) {
    return String(value ?? "").replace(/[&<>'\"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'\"':"&quot;"}[c]));
  }

  function initials(name) {
    const parts = String(name || "User").trim().split(/\s+/).filter(Boolean);
    return (parts.length > 1 ? parts[0][0] + parts[parts.length - 1][0] : (parts[0]?.[0] || "U")).toUpperCase().slice(0, 2);
  }

  function providerAvatar(user) {
    const m = user?.user_metadata || {};
    return m.avatar_url || m.picture || m.photo_url || "";
  }

  async function getProfile(user) {
    if (!user || !window.supabaseClient) return {};
    const { data } = await window.supabaseClient.from("profiles").select("avatar_url,full_name,phone,email").eq("id", user.id).maybeSingle();
    return data || {};
  }

  function renderDashboardAvatar(url, name) {
    const title = document.getElementById("customerName");
    if (!title) return;

    title.classList.add("nls-dashboard-name-with-avatar");
    let avatar = title.querySelector(".nls-dashboard-profile-avatar");
    if (!avatar) {
      avatar = document.createElement("span");
      avatar.className = "nls-dashboard-profile-avatar";
      title.insertBefore(avatar, title.firstChild);
    }

    const safe = url ? escape(url) : "";
    avatar.innerHTML = safe
      ? `<img src="${safe}" alt="Profile picture">`
      : `<span>${escape(initials(name))}</span>`;
  }

  function applyAvatar(url, name) {
    const safe = url ? escape(url) : "";

    /* Top navbar profile avatar is intentionally removed. */
    document.querySelectorAll("[data-nls-profile-avatar], .nls-profile-avatar").forEach(el => {
      if (safe) {
        el.innerHTML = `<img src="${safe}" alt="Profile picture">`;
        el.classList.add("nls-has-avatar");
      } else {
        el.innerHTML = `<span class="nls-avatar-initials">${escape(initials(name))}</span>`;
        el.classList.remove("nls-has-avatar");
      }
    });

    /* Large profile picture beside the dashboard welcome name. */
    renderDashboardAvatar(url, name);

    /* Mobile/tablet bottom navigation Account avatar. */
    const bottom = document.querySelector("#nls-mobile-bottom-nav .nls-bn-avatar");
    if (bottom) {
      if (safe) bottom.innerHTML = `<img src="${safe}" alt="Profile picture">`;
      else bottom.innerHTML = `<span>${escape(initials(name))}</span>`;
    }
  }

  async function syncUI() {
    if (!window.supabaseClient) return;
    const { data } = await window.supabaseClient.auth.getUser();
    const user = data?.user;
    if (!user) return;
    const profile = await getProfile(user);
    const name = profile.full_name || user.user_metadata?.full_name || user.user_metadata?.name || user.email || "User";
    const avatar = profile.avatar_url || providerAvatar(user);
    applyAvatar(avatar, name);
    document.querySelectorAll("[data-user-name]").forEach(el => el.textContent = name);
    document.querySelectorAll("[data-user-email]").forEach(el => el.textContent = user.email || "");

    if (window.location.pathname.toLowerCase().includes("dashboard")) addDashboardProfileButton();
  }

  function addDashboardProfileButton() {
    const actions = document.querySelector(".welcome-actions");
    if (!actions || document.getElementById("nlsEditProfileButton")) return;
    const btn = document.createElement("a");
    btn.id = "nlsEditProfileButton";
    btn.href = "/profile-settings.html";
    btn.className = "btn-outline-premium nls-edit-profile-btn";
    btn.innerHTML = '<i class="fas fa-user-pen"></i><span>Edit Profile</span>';
    actions.appendChild(btn);
  }

  function injectGlobalStyles() {
    if (document.getElementById("nls-profile-global-styles")) return;
    const style = document.createElement("style");
    style.id = "nls-profile-global-styles";
    style.textContent = `
      /* Desktop dashboard welcome profile picture. */
      #customerName.nls-dashboard-name-with-avatar{display:flex;align-items:center;gap:18px;}
      #customerName .nls-dashboard-profile-avatar{width:84px;height:84px;min-width:84px;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;overflow:hidden;background:linear-gradient(135deg,#6a11cb,#2575fc);color:#fff;border:4px solid rgba(255,255,255,.9);box-shadow:0 12px 30px rgba(15,23,42,.22),0 0 0 1px rgba(255,255,255,.18);font-size:24px;font-weight:800;line-height:1;}
      #customerName .nls-dashboard-profile-avatar img{width:100%;height:100%;display:block;object-fit:cover;}
      #customerName .nls-dashboard-profile-avatar span{display:inline-flex;align-items:center;justify-content:center;width:100%;height:100%;}
      .nls-avatar-initials{font-size:10px;font-weight:800;line-height:1}
      .nls-edit-profile-btn{margin-left:0;}
      @media(max-width:640px){
        .nls-edit-profile-btn{width:100%;}
        #customerName.nls-dashboard-name-with-avatar{gap:12px;}
        #customerName .nls-dashboard-profile-avatar{width:64px;height:64px;min-width:64px;border-width:3px;font-size:18px;}
      }
    `;
    document.head.appendChild(style);
  }

  async function uploadAvatar(file, user) {
    if (!file) throw new Error("Please choose an image.");
    if (!TYPES.includes(file.type)) throw new Error("Please use JPG, PNG, WEBP or GIF.");
    if (file.size > MAX_SIZE) throw new Error("Profile picture must be 5 MB or smaller.");

    const ext = (file.name.split(".").pop() || "jpg").toLowerCase().replace(/[^a-z0-9]/g, "") || "jpg";
    const path = `${user.id}/avatar-${Date.now()}.${ext}`;
    const { error: uploadError } = await window.supabaseClient.storage.from(BUCKET).upload(path, file, { contentType: file.type, cacheControl: "3600", upsert: false });
    if (uploadError) throw uploadError;

    const { data: publicData } = window.supabaseClient.storage.from(BUCKET).getPublicUrl(path);
    const avatarUrl = publicData?.publicUrl;
    if (!avatarUrl) throw new Error("Could not create profile image URL.");

    const { error: profileError } = await window.supabaseClient.from("profiles").update({ avatar_url: avatarUrl, updated_at: new Date().toISOString() }).eq("id", user.id);
    if (profileError) {
      await window.supabaseClient.storage.from(BUCKET).remove([path]);
      throw profileError;
    }
    return avatarUrl;
  }

  function oldStoragePath(url, userId) {
    if (!url || !userId || !url.includes(`/storage/v1/object/public/${BUCKET}/`)) return null;
    const marker = `/storage/v1/object/public/${BUCKET}/`;
    const path = decodeURIComponent(url.split(marker)[1] || "");
    return path.startsWith(`${userId}/`) ? path : null;
  }

  async function removeAvatar(user, currentUrl) {
    const path = oldStoragePath(currentUrl, user.id);
    if (path) await window.supabaseClient.storage.from(BUCKET).remove([path]);
    const { error } = await window.supabaseClient.from("profiles").update({ avatar_url: null, updated_at: new Date().toISOString() }).eq("id", user.id);
    if (error) throw error;
    return null;
  }

  async function initSettingsPage() {
    const root = document.getElementById("profileSettingsApp");
    if (!root) return;
    const { data, error } = await window.supabaseClient.auth.getUser();
    if (error || !data?.user) { window.location.replace("/login.html?redirect=/profile-settings.html"); return; }
    const user = data.user;
    const profile = await getProfile(user);
    const name = profile.full_name || user.user_metadata?.full_name || user.user_metadata?.name || user.email || "User";
    let avatarUrl = profile.avatar_url || providerAvatar(user) || "";

    root.innerHTML = `
      <section class="nls-profile-card">
        <div class="nls-profile-cover"></div>
        <div class="nls-profile-content">
          <div class="nls-profile-photo-wrap">
            <div id="profileAvatarPreview" class="nls-profile-photo">${avatarUrl ? `<img src="${escape(avatarUrl)}" alt="Profile picture">` : `<span>${escape(initials(name))}</span>`}</div>
            <label class="nls-photo-button" for="profileAvatarInput" title="Change profile picture"><i class="fas fa-camera"></i></label>
            <input id="profileAvatarInput" type="file" accept="image/jpeg,image/png,image/webp,image/gif" hidden>
          </div>
          <div class="nls-profile-heading"><span class="nls-profile-eyebrow">Your account</span><h1>${escape(name)}</h1><p>${escape(user.email || "")}</p></div>
          <div id="profileMessage" class="nls-profile-message" role="status"></div>
          <form id="profileForm" class="nls-profile-form">
            <label>Full name<input id="profileFullName" type="text" maxlength="80" value="${escape(profile.full_name || name)}" autocomplete="name"></label>
            <label>Phone number<input id="profilePhone" type="tel" maxlength="30" value="${escape(profile.phone || "")}" autocomplete="tel"></label>
            <div class="nls-profile-actions"><button class="nls-primary" id="saveProfile" type="submit"><i class="fas fa-check"></i> Save changes</button><a class="nls-secondary" href="/dashboard.html"><i class="fas fa-arrow-left"></i> Dashboard</a></div>
          </form>
          <div class="nls-avatar-actions"><button id="removeAvatar" type="button" class="nls-danger"><i class="fas fa-trash"></i> Remove profile picture</button><small>JPG, PNG, WEBP or GIF • Maximum 5 MB</small></div>
        </div>
      </section>`;

    const preview = document.getElementById("profileAvatarPreview");
    const input = document.getElementById("profileAvatarInput");
    const message = document.getElementById("profileMessage");
    const setMessage = (text, ok = false) => { message.textContent = text; message.className = `nls-profile-message ${ok ? "success" : "error"}`; };

    input.addEventListener("change", async () => {
      const file = input.files?.[0]; if (!file) return;
      if (!TYPES.includes(file.type) || file.size > MAX_SIZE) { setMessage(file.size > MAX_SIZE ? "Image is larger than 5 MB." : "Use JPG, PNG, WEBP or GIF."); input.value = ""; return; }
      preview.innerHTML = `<img src="${URL.createObjectURL(file)}" alt="Profile picture preview">`;
      try { setMessage("Uploading profile picture…"); avatarUrl = await uploadAvatar(file, user); setMessage("Profile picture updated successfully.", true); await syncUI(); }
      catch (e) { console.error(e); setMessage(e.message || "Upload failed. Please try again."); }
      input.value = "";
    });

    document.getElementById("removeAvatar").addEventListener("click", async () => {
      if (!avatarUrl) { setMessage("You do not have a custom profile picture."); return; }
      try { setMessage("Removing profile picture…"); await removeAvatar(user, avatarUrl); avatarUrl = ""; preview.innerHTML = `<span>${escape(initials(document.getElementById("profileFullName").value || name))}</span>`; setMessage("Profile picture removed.", true); await syncUI(); }
      catch (e) { console.error(e); setMessage(e.message || "Could not remove the picture."); }
    });

    document.getElementById("profileForm").addEventListener("submit", async e => {
      e.preventDefault();
      const btn = document.getElementById("saveProfile");
      const fullName = document.getElementById("profileFullName").value.trim();
      const phone = document.getElementById("profilePhone").value.trim();
      if (!fullName) { setMessage("Please enter your name."); return; }
      btn.disabled = true; btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving…';
      try {
        const { error: updateError } = await window.supabaseClient.from("profiles").update({ full_name: fullName, phone, updated_at: new Date().toISOString() }).eq("id", user.id);
        if (updateError) throw updateError;
        setMessage("Profile saved successfully.", true); await syncUI();
      } catch (e) { console.error(e); setMessage(e.message || "Could not save your profile."); }
      finally { btn.disabled = false; btn.innerHTML = '<i class="fas fa-check"></i> Save changes'; }
    });
  }

  function injectSettingsStyles() {
    if (!document.getElementById("nls-profile-settings-styles")) {
      const s = document.createElement("style"); s.id = "nls-profile-settings-styles"; s.textContent = `
        .nls-profile-card{max-width:760px;margin:40px auto;background:rgba(255,255,255,.84);border:1px solid rgba(226,232,240,.8);border-radius:28px;box-shadow:0 24px 70px rgba(15,23,42,.12);overflow:hidden;backdrop-filter:blur(18px)}
        .nls-profile-cover{height:150px;background:linear-gradient(135deg,#4a0699,#6a11cb 48%,#2575fc);position:relative}.nls-profile-cover:after{content:"";position:absolute;width:280px;height:280px;border-radius:50%;right:-70px;top:-180px;background:rgba(255,255,255,.16)}
        .nls-profile-content{padding:0 34px 34px}.nls-profile-photo-wrap{position:relative;width:128px;height:128px;margin:-64px 0 16px}.nls-profile-photo{width:128px;height:128px;border-radius:50%;display:flex;align-items:center;justify-content:center;overflow:hidden;background:linear-gradient(135deg,#6a11cb,#2575fc);color:#fff;border:6px solid #fff;box-shadow:0 12px 30px rgba(15,23,42,.2);font-size:32px;font-weight:800}.nls-profile-photo img{width:100%;height:100%;object-fit:cover}.nls-photo-button{position:absolute;right:1px;bottom:5px;width:38px;height:38px;border-radius:50%;display:flex;align-items:center;justify-content:center;background:#fff;color:#6a11cb;border:1px solid #e2e8f0;box-shadow:0 7px 18px rgba(15,23,42,.15);cursor:pointer;transition:.25s}.nls-photo-button:hover{transform:scale(1.08)}
        .nls-profile-eyebrow{display:inline-block;padding:5px 10px;border-radius:999px;background:#f3e8ff;color:#6a11cb;font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:.05em}.nls-profile-heading h1{margin:10px 0 4px;font-size:clamp(1.5rem,4vw,2rem);color:#172033}.nls-profile-heading p{margin:0;color:#64748b}.nls-profile-message{min-height:22px;margin-top:18px;font-size:.85rem;font-weight:700}.nls-profile-message.success{color:#15803d}.nls-profile-message.error{color:#dc2626}.nls-profile-form{display:grid;gap:16px;margin-top:8px}.nls-profile-form label{display:grid;gap:7px;color:#475569;font-size:.78rem;font-weight:700}.nls-profile-form input{height:48px;padding:0 14px;border:1px solid #e2e8f0;border-radius:12px;background:#fff;color:#172033;font:inherit;outline:none;transition:.25s}.nls-profile-form input:focus{border-color:#6a11cb;box-shadow:0 0 0 4px rgba(106,17,203,.1)}.nls-profile-actions{display:flex;gap:10px;flex-wrap:wrap;margin-top:4px}.nls-primary,.nls-secondary,.nls-danger{min-height:46px;padding:0 18px;border-radius:12px;display:inline-flex;align-items:center;justify-content:center;gap:8px;font:inherit;font-weight:700;text-decoration:none;cursor:pointer}.nls-primary{border:0;color:#fff;background:linear-gradient(135deg,#6a11cb,#2575fc);box-shadow:0 10px 24px rgba(106,17,203,.2)}.nls-primary:disabled{opacity:.65;cursor:not-allowed}.nls-secondary{border:1px solid #e2e8f0;background:#fff;color:#334155}.nls-danger{margin-top:22px;border:1px solid #fecaca;background:#fff;color:#dc2626}.nls-avatar-actions{display:flex;align-items:center;gap:12px;flex-wrap:wrap}.nls-avatar-actions small{color:#94a3b8}.nls-avatar-actions .nls-danger{margin-top:0}
        @media(max-width:640px){.nls-profile-card{margin:18px 12px 30px;border-radius:22px}.nls-profile-cover{height:120px}.nls-profile-content{padding:0 18px 24px}.nls-profile-photo-wrap,.nls-profile-photo{width:104px;height:104px}.nls-profile-photo-wrap{margin-top:-52px}.nls-profile-photo{border-width:5px}.nls-profile-actions>*{flex:1 1 100%}.nls-avatar-actions{align-items:stretch}.nls-avatar-actions .nls-danger{width:100%}}
      `; document.head.appendChild(s);
    }
  }

  async function init() {
    injectGlobalStyles();
    if (document.getElementById("profileSettingsApp")) injectSettingsStyles();
    await syncUI();
    if (document.getElementById("profileSettingsApp")) await initSettingsPage();
    if (window.supabaseClient?.auth?.onAuthStateChange) window.supabaseClient.auth.onAuthStateChange(() => syncUI());
    window.addEventListener("nextlevelauthchange", () => syncUI());
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, { once: true });
  else init();

  window.NextLevelProfile = { sync: syncUI, uploadAvatar, removeAvatar };
})();