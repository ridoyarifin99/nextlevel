(function () {
  "use strict";

  const STYLE_ID = "nls-desktop-profile-nav-fix";

  function injectStyles() {
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = `
      @media (min-width:1025px) {
        #userAccountArea.nls-account-link {
          display: inline-flex !important;
          align-items: center;
          gap: 8px;
          max-width: 220px;
          min-width: 0;
          padding: 7px 12px 7px 8px;
          border-radius: 12px;
          color: #475569;
          font-size: .85rem;
          font-weight: 700;
          transition: all .3s cubic-bezier(.4,0,.2,1);
        }
        #userAccountArea.nls-account-link:hover {
          color: #6a11cb;
          background: rgba(106,17,203,.08);
          transform: translateY(-1px);
        }
        #userAccountArea .nls-desktop-profile-avatar {
          width: 34px;
          height: 34px;
          min-width: 34px;
          border-radius: 50%;
          overflow: hidden;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          background: linear-gradient(135deg,#6a11cb,#2575fc);
          border: 2px solid rgba(255,255,255,.95);
          box-shadow: 0 5px 14px rgba(15,23,42,.16);
          font-size: 11px;
          font-weight: 800;
          line-height: 1;
          flex: 0 0 auto;
        }
        #userAccountArea .nls-desktop-profile-avatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }
        #userAccountArea .nls-desktop-profile-name {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          max-width: 150px;
        }
      }
    `;
    document.head.appendChild(style);
  }

  function initials(name) {
    const parts = String(name || "User").trim().split(/\s+/).filter(Boolean);
    return (parts.length > 1 ? parts[0][0] + parts[parts.length - 1][0] : (parts[0]?.[0] || "U")).toUpperCase().slice(0, 2);
  }

  function escape(value) {
    return String(value ?? "").replace(/[&<>\"']/g, c => ({
      "&":"&amp;", "<":"&lt;", ">":"&gt;", "\"":"&quot;", "'":"&#39;"
    }[c]));
  }

  function ensureElement() {
    const login = document.getElementById("loginLink");
    if (!login) return null;

    let account = document.getElementById("userAccountArea");
    if (!account) {
      account = document.createElement("a");
      account.id = "userAccountArea";
      account.className = "nls-account-link nls-user-link";
      account.href = "/dashboard.html";
      account.setAttribute("aria-label", "Open dashboard");
      account.style.display = "none";
      account.innerHTML = '<span class="nls-desktop-profile-avatar"><i class="fa-solid fa-user"></i></span><span id="navUserName" class="nls-auth-text nls-desktop-profile-name">User</span>';
      login.parentNode.insertBefore(account, login.nextSibling);
    } else if (!account.querySelector(".nls-desktop-profile-avatar")) {
      const oldIcon = account.querySelector(".nls-account-icon");
      const avatar = document.createElement("span");
      avatar.className = "nls-desktop-profile-avatar";
      if (oldIcon) oldIcon.replaceWith(avatar);
      else account.insertAdjacentHTML("afterbegin", '<span class="nls-desktop-profile-avatar"><i class="fa-solid fa-user"></i></span>');
    }

    if (!account.querySelector("#navUserName")) {
      const name = document.createElement("span");
      name.id = "navUserName";
      name.className = "nls-auth-text nls-desktop-profile-name";
      name.textContent = "User";
      account.appendChild(name);
    }
    return account;
  }

  async function sync() {
    const account = ensureElement();
    if (!account || !window.supabaseClient) return;

    let user = null;
    try {
      const result = await window.supabaseClient.auth.getUser();
      user = result?.data?.user || null;
    } catch (_) {}

    const login = document.getElementById("loginLink");
    if (!user) {
      account.style.display = "none";
      if (login) login.style.display = "inline-flex";
      return;
    }

    if (login) login.style.display = "none";
    account.style.display = "inline-flex";
    account.href = "/dashboard.html";

    const metadata = user.user_metadata || {};
    let name = metadata.full_name || metadata.name || metadata.username || user.email || "User";
    let avatarUrl = metadata.avatar_url || metadata.picture || metadata.photo_url || "";

    try {
      const result = await window.supabaseClient
        .from("profiles")
        .select("avatar_url,full_name")
        .eq("id", user.id)
        .maybeSingle();
      if (result.data?.full_name) name = result.data.full_name;
      if (result.data?.avatar_url) avatarUrl = result.data.avatar_url;
    } catch (_) {}

    const avatar = account.querySelector(".nls-desktop-profile-avatar");
    const nameEl = account.querySelector("#navUserName");
    if (nameEl) nameEl.textContent = name;
    if (avatar) {
      avatar.innerHTML = avatarUrl
        ? `<img src="${escape(avatarUrl)}" alt="Profile picture">`
        : `<span>${escape(initials(name))}</span>`;
    }
  }

  function init() {
    injectStyles();
    ensureElement();
    sync();

    if (window.supabaseClient?.auth?.onAuthStateChange) {
      window.supabaseClient.auth.onAuthStateChange(() => {
        window.setTimeout(sync, 0);
      });
    }

    window.addEventListener("pageshow", () => window.setTimeout(sync, 0));
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
