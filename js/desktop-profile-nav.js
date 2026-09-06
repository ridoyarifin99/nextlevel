(function () {
  "use strict";

  if (window.__NLSDesktopProfileNavLoaded) return;
  window.__NLSDesktopProfileNavLoaded = true;

  function initials(name) {
    const parts = String(name || "User").trim().split(/\s+/).filter(Boolean);
    return (parts.length > 1 ? parts[0][0] + parts[parts.length - 1][0] : (parts[0]?.[0] || "U"))
      .toUpperCase().slice(0, 2);
  }

  async function getProfile(user) {
    if (!user || !window.supabaseClient) return {};
    try {
      const { data } = await window.supabaseClient.from("profiles")
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
        /* The existing nls-account-link remains the actual profile button. */
        .nls-right #userAccountArea {
          position:relative;
          display:inline-flex !important;
          align-items:center;
          gap:8px;
        }
        .nls-right #userAccountArea .nls-account-icon {
          display:inline-block !important;
        }
        .nls-right .nls-profile-dropdown {
          position:absolute;
          top:calc(100% + 7px);
          right:0;
          min-width:190px;
          padding:6px;
          border:1px solid rgba(226,232,240,.9);
          border-radius:12px;
          background:rgba(255,255,255,.97);
          backdrop-filter:blur(20px) saturate(180%);
          -webkit-backdrop-filter:blur(20px) saturate(180%);
          box-shadow:0 14px 35px rgba(15,23,42,.14);
          opacity:0;
          visibility:hidden;
          pointer-events:none;
          transform:translateY(-5px) scale(.98);
          transform-origin:top right;
          transition:opacity .2s cubic-bezier(.4,0,.2,1),transform .2s cubic-bezier(.4,0,.2,1),visibility .2s;
          z-index:10001;
        }
        .nls-right #userAccountArea:hover .nls-profile-dropdown,
        .nls-right #userAccountArea:focus-within .nls-profile-dropdown {
          opacity:1;
          visibility:visible;
          pointer-events:auto;
          transform:translateY(0) scale(1);
        }
        .nls-right .nls-profile-dropdown::before {
          content:"";
          position:absolute;
          top:-8px;
          right:0;
          left:0;
          height:8px;
        }
        .nls-right .nls-profile-dropdown a,
        .nls-right .nls-profile-dropdown button {
          width:100%;
          display:flex;
          align-items:center;
          gap:10px;
          min-height:38px;
          padding:8px 10px;
          border:0;
          border-radius:9px;
          background:transparent;
          color:#475569;
          font:600 .84rem Inter,system-ui,-apple-system,sans-serif;
          text-decoration:none;
          cursor:pointer;
          text-align:left;
          transition:all .3s cubic-bezier(.4,0,.2,1);
        }
        .nls-right .nls-profile-dropdown a:hover,
        .nls-right .nls-profile-dropdown button:hover {
          color:#6a11cb;
          background:rgba(106,17,203,.08);
          transform:translateY(-1px);
        }
        .nls-right .nls-profile-dropdown .nls-profile-logout:hover {
          color:#dc2626;
          background:rgba(220,38,38,.07);
        }
        .nls-right .nls-profile-dropdown i { width:16px; text-align:center; }
        .nls-right #loginLink.nls-login-hidden { display:none !important; }

        /* Dashboard header uses the same existing nav-link animation/design. */
        .desktop-nav #userAccountArea .nls-profile-dropdown {
          position:absolute;
          top:calc(100% + 7px);
          right:0;
        }
      }
      @media (max-width:1024px) { .nls-profile-dropdown { display:none !important; } }
    `;
    document.head.appendChild(style);
  }

  function removeNewProfileButton() {
    document.getElementById("nlsDesktopProfileNav")?.remove();
    document.querySelectorAll(".nls-desktop-profile-wrap").forEach(el => el.remove());
  }

  function ensureDropdown(user) {
    const button = document.getElementById("userAccountArea");
    if (!button) return;

    removeNewProfileButton();

    let menu = button.querySelector(".nls-profile-dropdown");
    if (!menu) {
      menu = document.createElement("span");
      menu.className = "nls-profile-dropdown";
      menu.setAttribute("role", "menu");
      menu.innerHTML = `
        <a href="/dashboard.html" role="menuitem">
          <i class="fa-solid fa-gauge-high"></i><span>Dashboard</span>
        </a>
        <button type="button" class="nls-profile-logout" role="menuitem">
          <i class="fa-solid fa-right-from-bracket"></i><span>Logout</span>
        </button>
      `;
      button.appendChild(menu);

      menu.querySelector(".nls-profile-logout")?.addEventListener("click", async (event) => {
        event.preventDefault();
        event.stopPropagation();
        try {
          if (window.NextLevelAuth?.logout) await window.NextLevelAuth.logout();
          else if (window.supabaseClient?.auth?.signOut) await window.supabaseClient.auth.signOut();
        } finally {
          window.location.href = "/";
        }
      });
    }

    /* Preserve auth.js control of visibility and the original nls-account-link. */
    button.setAttribute("aria-haspopup", "true");
    button.setAttribute("aria-expanded", "false");
  }

  async function render(user) {
    injectStyles();
    removeNewProfileButton();

    const button = document.getElementById("userAccountArea");
    const login = document.getElementById("loginLink");
    if (!user) {
      button?.querySelector(".nls-profile-dropdown")?.remove();
      button?.style.removeProperty("display");
      login?.classList.remove("nls-login-hidden");
      return;
    }

    const profile = await getProfile(user);
    const meta = user.user_metadata || {};
    const name = profile.full_name || meta.full_name || meta.name || user.email || "User";
    const avatarUrl = profile.avatar_url || meta.avatar_url || meta.picture || meta.photo_url || "";

    if (button) {
      /* Keep the original button classes/id and only replace its visual contents. */
      const existingMenu = button.querySelector(".nls-profile-dropdown");
      button.innerHTML = avatarUrl
        ? `<img src="${String(avatarUrl).replace(/&/g,'&amp;').replace(/\"/g,'&quot;')}" alt="Profile picture" class="nls-account-avatar">`
        : `<span class="nls-account-initials">${initials(name)}</span>`;
      if (existingMenu) button.appendChild(existingMenu);
      else ensureDropdown(user);
      button.href = "/dashboard.html";
      button.setAttribute("aria-label", `Account: ${name}`);
    }
    login?.classList.add("nls-login-hidden");

    const avatarStyle = document.getElementById("nls-existing-account-avatar-style") || document.createElement("style");
    avatarStyle.id = "nls-existing-account-avatar-style";
    avatarStyle.textContent = `
      @media (min-width:1025px) {
        #userAccountArea .nls-account-avatar,
        #userAccountArea .nls-account-initials {
          width:30px;height:30px;min-width:30px;border-radius:50%;
          display:inline-flex;align-items:center;justify-content:center;
          object-fit:cover;overflow:hidden;
          background:linear-gradient(135deg,#6a11cb,#2575fc);
          color:#fff;font-size:10px;font-weight:800;line-height:1;
          border:2px solid rgba(255,255,255,.95);
          box-shadow:0 3px 8px rgba(15,23,42,.14);
        }
        #userAccountArea:hover .nls-account-avatar,
        #userAccountArea:hover .nls-account-initials { transform:scale(1.04); }
        #userAccountArea .nls-profile-dropdown { display:block; }
      }
    `;
    if (!avatarStyle.parentNode) document.head.appendChild(avatarStyle);
  }

  async function init() {
    if (!window.supabaseClient) return;
    injectStyles();
    try {
      const { data } = await window.supabaseClient.auth.getUser();
      await render(data?.user || null);
      window.supabaseClient.auth.onAuthStateChange(async (event, session) => {
        await render(session?.user || null);
      });
    } catch (error) {
      console.warn("Desktop account dropdown could not initialize:", error);
    }
  }

  function boot() {
    if (!window.supabaseClient) { setTimeout(boot, 100); return; }
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, { once:true });
    else init();
  }

  boot();
})();