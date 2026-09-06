(function () {
  "use strict";

  if (window.__NLSDesktopProfileNavLoaded) return;
  window.__NLSDesktopProfileNavLoaded = true;

  function getSupabase() { return window.supabaseClient || null; }

  function getInitials(name) {
    const parts = String(name || "User").trim().split(/\s+/).filter(Boolean);
    return (parts.length > 1 ? parts[0][0] + parts[parts.length - 1][0] : (parts[0]?.[0] || "U"))
      .toUpperCase().slice(0, 2);
  }

  async function getProfile(user) {
    const sb = getSupabase();
    if (!user || !sb) return {};
    try {
      const { data } = await sb.from("profiles")
        .select("avatar_url,full_name,phone,email")
        .eq("id", user.id)
        .maybeSingle();
      return data || {};
    } catch (_) { return {}; }
  }

  function injectStyles() {
    if (document.getElementById("nls-desktop-profile-nav-styles")) return;
    const style = document.createElement("style");
    style.id = "nls-desktop-profile-nav-styles";
    style.textContent = `
      @media (min-width:1025px) {
        /* Use the exact visual language of the dashboard's existing nav buttons. */
        .nls-desktop-profile-nav {
          display:inline-flex !important;
          align-items:center;
          justify-content:center;
          gap:8px;
          padding:9px 14px;
          min-height:40px;
          border:0;
          border-radius:10px;
          color:#475569;
          background:transparent;
          font-size:.85rem;
          font-weight:600;
          line-height:1;
          transition:all .3s cubic-bezier(.4,0,.2,1);
          white-space:nowrap;
          text-decoration:none;
          cursor:pointer;
        }
        .nls-desktop-profile-nav:hover,
        .nls-desktop-profile-nav:focus-visible {
          color:#6a11cb;
          background:rgba(106,17,203,.08);
          transform:translateY(-1px);
          outline:none;
        }
        .nls-desktop-profile-avatar {
          width:24px;
          height:24px;
          min-width:24px;
          border-radius:50%;
          overflow:hidden;
          display:inline-flex;
          align-items:center;
          justify-content:center;
          color:#fff;
          background:linear-gradient(135deg,#6a11cb,#2575fc);
          border:1.5px solid rgba(255,255,255,.95);
          box-shadow:0 3px 8px rgba(15,23,42,.14);
          font-size:8px;
          font-weight:800;
          line-height:1;
          flex:0 0 auto;
        }
        .nls-desktop-profile-avatar img { width:100%; height:100%; display:block; object-fit:cover; }
        .nls-desktop-profile-name { max-width:130px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
        .nls-right #nlsDesktopProfileNav { display:inline-flex !important; }
        .nls-right #loginLink.nls-login-hidden { display:none !important; }
      }
      @media (max-width:1024px) { .nls-desktop-profile-nav { display:none !important; } }
    `;
    document.head.appendChild(style);
  }

  function removeOldAddedProfile() {
    /* The mobile navigation must never create a second desktop profile button. */
    document.querySelectorAll(".nls-desktop-profile-wrap").forEach(el => el.remove());
  }

  function renderMainHeader(user, profile) {
    const right = document.querySelector(".nls-right");
    const login = document.getElementById("loginLink");
    if (!right || !login) return;

    let link = document.getElementById("nlsDesktopProfileNav");
    if (!link) {
      link = document.createElement("a");
      link.id = "nlsDesktopProfileNav";
      link.href = "/dashboard.html";
      link.className = "nls-desktop-profile-nav";
      right.insertBefore(link, login);
    }

    const meta = user.user_metadata || {};
    const name = profile.full_name || meta.full_name || meta.name || user.email || "Account";
    const avatarUrl = profile.avatar_url || meta.avatar_url || meta.picture || meta.photo_url || "";
    link.setAttribute("aria-label", `Open dashboard for ${name}`);
    link.innerHTML = avatarUrl
      ? `<span class="nls-desktop-profile-avatar"><img src="${String(avatarUrl).replace(/&/g,'&amp;').replace(/\"/g,'&quot;')}" alt="Profile picture"></span><span class="nls-desktop-profile-name"></span>`
      : `<span class="nls-desktop-profile-avatar">${getInitials(name)}</span><span class="nls-desktop-profile-name"></span>`;
    link.querySelector(".nls-desktop-profile-name").textContent = name;
    login.classList.add("nls-login-hidden");
  }

  function renderDashboardHeader(user, profile) {
    const nav = document.querySelector(".desktop-nav");
    if (!nav) return;

    /* Do not add another profile button when the dashboard already has its native one. */
    const existingNative = nav.querySelector("[data-profile], #profileButton, .profile-btn, .account-btn, .user-profile");
    const link = document.getElementById("nlsDesktopProfileNav");
    if (existingNative) {
      if (link && link.closest(".desktop-nav")) link.remove();
      return;
    }

    /* Keep dashboard's existing navigation unchanged. */
  }

  async function render(user) {
    injectStyles();
    removeOldAddedProfile();
    if (!user) {
      document.getElementById("nlsDesktopProfileNav")?.remove();
      document.getElementById("loginLink")?.classList.remove("nls-login-hidden");
      return;
    }
    const profile = await getProfile(user);
    renderMainHeader(user, profile);
    renderDashboardHeader(user, profile);
  }

  async function init() {
    const sb = getSupabase();
    if (!sb) return;
    try {
      const { data } = await sb.auth.getUser();
      await render(data?.user || null);
      sb.auth.onAuthStateChange(async (event, session) => {
        await render(session?.user || null);
      });
    } catch (error) {
      console.warn("Desktop profile navigation could not initialize:", error);
    }
  }

  function boot() {
    if (!getSupabase()) { setTimeout(boot, 100); return; }
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, { once:true });
    else init();
  }

  boot();
})();