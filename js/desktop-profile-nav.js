(function () {
  "use strict";

  if (window.__NLSDesktopProfileNavLoaded) return;
  window.__NLSDesktopProfileNavLoaded = true;

  const escape = (value) => String(value ?? "").replace(/[&<>\"']/g, c => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#39;"
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
      @media (min-width:1025px) {
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
          text-decoration:none;
        }
        .nls-desktop-profile-nav:hover {
          color:#6a11cb;
          background:#fff;
          border-color:rgba(106,17,203,.2);
          transform:translateY(-1px);
          box-shadow:0 8px 20px rgba(106,17,203,.1);
        }
        .nls-desktop-profile-avatar {
          width:34px;
          height:34px;
          min-width:34px;
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
          flex:0 0 auto;
        }
        .nls-desktop-profile-avatar img { width:100%; height:100%; display:block; object-fit:cover; }
        .nls-desktop-profile-name { max-width:130px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }

        /* Main site header: profile lives beside Login/Cart in the right side. */
        .nls-right #nlsDesktopProfileNav { display:inline-flex !important; }
        .nls-right #loginLink.nls-login-hidden { display:none !important; }
      }
      @media (max-width:1024px) { .nls-desktop-profile-nav { display:none !important; } }
    `;
    document.head.appendChild(style);
  }

  function renderMainHeader(user, profile) {
    const right = document.querySelector(".nls-right");
    const login = document.getElementById("loginLink");
    if (!right || !login) return false;

    const name = profile.full_name || user?.user_metadata?.full_name || user?.user_metadata?.name || user?.email || "Account";
    const avatarUrl = profile.avatar_url || providerAvatar(user);

    let link = document.getElementById("nlsDesktopProfileNav");
    if (!link) {
      link = document.createElement("a");
      link.id = "nlsDesktopProfileNav";
      link.href = "/dashboard.html";
      link.className = "nls-desktop-profile-nav";
      link.setAttribute("aria-label", "Open dashboard");
      right.insertBefore(link, login);
    }

    const safe = avatarUrl ? escape(avatarUrl) : "";
    link.innerHTML = `
      <span class="nls-desktop-profile-avatar">
        ${safe ? `<img src="${safe}" alt="Profile picture">` : escape(initials(name))}
      </span>
      <span class="nls-desktop-profile-name">${escape(name)}</span>
    `;
    login.classList.add("nls-login-hidden");
    return true;
  }

  function renderDashboardHeader(user, profile) {
    const nav = document.querySelector(".desktop-nav");
    if (!nav) return false;

    const name = profile.full_name || user?.user_metadata?.full_name || user?.user_metadata?.name || user?.email || "Account";
    const avatarUrl = profile.avatar_url || providerAvatar(user);

    let link = document.getElementById("nlsDesktopProfileNav");
    if (!link) {
      link = document.createElement("a");
      link.id = "nlsDesktopProfileNav";
      link.href = "/dashboard.html";
      link.className = "nls-desktop-profile-nav";
      link.setAttribute("aria-label", "My account");
      const logout = nav.querySelector("#logoutButton, .logout-btn, [data-logout]");
      if (logout) nav.insertBefore(link, logout);
      else nav.appendChild(link);
    }

    const safe = avatarUrl ? escape(avatarUrl) : "";
    link.innerHTML = `
      <span class="nls-desktop-profile-avatar">
        ${safe ? `<img src="${safe}" alt="Profile picture">` : escape(initials(name))}
      </span>
      <span class="nls-desktop-profile-name">${escape(name)}</span>
    `;
    return true;
  }

  async function init() {
    if (!window.supabaseClient) return;
    injectStyles();

    try {
      const { data } = await window.supabaseClient.auth.getUser();
      if (!data?.user) {
        document.getElementById("nlsDesktopProfileNav")?.remove();
        document.getElementById("loginLink")?.classList.remove("nls-login-hidden");
        return;
      }

      const profile = await getProfile(data.user);
      renderMainHeader(data.user, profile);
      renderDashboardHeader(data.user, profile);

      window.supabaseClient.auth.onAuthStateChange(async (event, session) => {
        if (event === "SIGNED_OUT" || !session?.user) {
          document.getElementById("nlsDesktopProfileNav")?.remove();
          document.getElementById("loginLink")?.classList.remove("nls-login-hidden");
          return;
        }
        const nextProfile = await getProfile(session.user);
        renderMainHeader(session.user, nextProfile);
        renderDashboardHeader(session.user, nextProfile);
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
