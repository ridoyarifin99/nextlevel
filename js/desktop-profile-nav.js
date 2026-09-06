(function () {
  "use strict";

  if (window.__NLSDesktopProfileNavLoaded) return;
  window.__NLSDesktopProfileNavLoaded = true;

  const escape = (value) => String(value ?? "").replace(/[&<>\"']/g, c => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "\"": "&quot;",
    "'": "&#39;"
  }[c]));

  const initials = (name) => {
    const parts = String(name || "User").trim().split(/\s+/).filter(Boolean);
    return (parts.length > 1 ? parts[0][0] + parts[parts.length - 1][0] : (parts[0]?.[0] || "U"))
      .toUpperCase().slice(0, 2);
  };

  const providerAvatar = (user) => {
    const m = user?.user_metadata || {};
    return m.avatar_url || m.picture || m.photo_url || "";
  };

  async function getProfile(user) {
    if (!user || !window.supabaseClient) return {};
    const { data } = await window.supabaseClient
      .from("profiles")
      .select("avatar_url,full_name,phone,email")
      .eq("id", user.id)
      .maybeSingle();
    return data || {};
  }

  function injectStyles() {
    if (document.getElementById("nls-desktop-profile-nav-styles")) return;
    const style = document.createElement("style");
    style.id = "nls-desktop-profile-nav-styles";
    style.textContent = `
      .nls-desktop-profile-nav {
        display:inline-flex;
        align-items:center;
        gap:9px;
        min-height:42px;
        padding:5px 11px 5px 6px;
        border-radius:12px;
        color:#334155;
        background:rgba(255,255,255,.72);
        border:1px solid rgba(226,232,240,.9);
        font-size:.84rem;
        font-weight:700;
        transition:all .3s cubic-bezier(.4,0,.2,1);
        white-space:nowrap;
      }
      .nls-desktop-profile-nav:hover {
        color:#6a11cb;
        background:#fff;
        border-color:rgba(106,17,203,.2);
        transform:translateY(-1px);
        box-shadow:0 8px 20px rgba(106,17,203,.1);
      }
      .nls-desktop-profile-avatar {
        width:32px;
        height:32px;
        min-width:32px;
        border-radius:50%;
        overflow:hidden;
        display:inline-flex;
        align-items:center;
        justify-content:center;
        color:#fff;
        background:linear-gradient(135deg,#6a11cb,#2575fc);
        border:2px solid rgba(255,255,255,.95);
        box-shadow:0 4px 12px rgba(15,23,42,.16);
        font-size:10px;
        font-weight:800;
        line-height:1;
      }
      .nls-desktop-profile-avatar img {
        width:100%;
        height:100%;
        display:block;
        object-fit:cover;
      }
      .nls-desktop-profile-name {
        max-width:130px;
        overflow:hidden;
        text-overflow:ellipsis;
      }
      @media (min-width:1025px) {
        .nls-desktop-profile-nav { display:inline-flex !important; }
      }
      @media (max-width:1024px) {
        .nls-desktop-profile-nav { display:none !important; }
      }
    `;
    document.head.appendChild(style);
  }

  function render(user, profile) {
    const nav = document.querySelector(".desktop-nav");
    if (!nav) return;

    const name = profile.full_name || user?.user_metadata?.full_name || user?.user_metadata?.name || user?.email || "Account";
    const avatarUrl = profile.avatar_url || providerAvatar(user);

    let link = document.getElementById("nlsDesktopProfileNav");
    if (!link) {
      link = document.createElement("a");
      link.id = "nlsDesktopProfileNav";
      link.href = "/dashboard.html";
      link.className = "nls-desktop-profile-nav";
      link.setAttribute("aria-label", "My account");

      const logout = nav.querySelector("#logoutButton, .logout-btn, [data-logout], button[type='button']");
      if (logout) nav.insertBefore(link, logout);
      else nav.appendChild(link);
    }

    const safe = avatarUrl ? escape(avatarUrl) : "";
    link.innerHTML = `
      <span class="nls-desktop-profile-avatar">
        ${safe ? `<img src="${safe}" alt="Profile picture">` : escape(initials(name))}
      </span>
      <span class="nls-desktop-profile-name">${escape(name)}</span>
      <i class="fas fa-chevron-down" style="font-size:.65rem;opacity:.55"></i>
    `;
  }

  async function init() {
    if (!window.supabaseClient) return;
    try {
      const { data } = await window.supabaseClient.auth.getUser();
      if (!data?.user) return;
      const profile = await getProfile(data.user);
      injectStyles();
      render(data.user, profile);

      window.supabaseClient.auth.onAuthStateChange(async (event, session) => {
        if (event === "SIGNED_OUT" || !session?.user) {
          document.getElementById("nlsDesktopProfileNav")?.remove();
          return;
        }
        const nextProfile = await getProfile(session.user);
        render(session.user, nextProfile);
      });
    } catch (error) {
      console.warn("Desktop profile navigation could not initialize:", error);
    }
  }

  function boot() {
    if (!window.supabaseClient) {
      setTimeout(boot, 100);
      return;
    }
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, { once:true });
    else init();
  }

  boot();
})();
