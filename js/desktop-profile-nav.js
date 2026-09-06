(function () {
  "use strict";
  if (window.__NLSDesktopProfileNavLoaded) return;
  window.__NLSDesktopProfileNavLoaded = true;

  const initials = name => {
    const p = String(name || "User").trim().split(/\s+/).filter(Boolean);
    return (p.length > 1 ? p[0][0] + p[p.length - 1][0] : (p[0]?.[0] || "U")).toUpperCase().slice(0, 2);
  };

  async function getAccountData() {
    try {
      const { data: auth } = await window.supabaseClient.auth.getUser();
      const user = auth?.user || null;
      if (!user) return { user: null, name: "User", avatarUrl: "" };
      const m = user.user_metadata || {};
      let name = m.full_name || m.name || m.username || user.email?.split("@")[0] || "User";
      let avatarUrl = m.avatar_url || m.picture || m.photo_url || "";
      try {
        const { data } = await window.supabaseClient.from("profiles").select("avatar_url,full_name").eq("id", user.id).maybeSingle();
        if (data?.full_name) name = data.full_name;
        if (data?.avatar_url) avatarUrl = data.avatar_url;
      } catch (_) {}
      return { user, name, avatarUrl };
    } catch (_) { return { user: null, name: "User", avatarUrl: "" }; }
  }

  function styles() {
    if (document.getElementById("nls-account-dropdown-styles")) return;
    const s = document.createElement("style");
    s.id = "nls-account-dropdown-styles";
    s.textContent = `
      @media (min-width:1025px) {
        /* IMPORTANT: this is the existing index.html #loginLink. No second account button. */
        #loginLink.nls-account-link{position:relative;display:inline-flex!important;align-items:center;gap:8px;padding:9px 14px;border-radius:10px;color:#334155;background:transparent;font-size:.85rem;font-weight:600;transition:all .3s cubic-bezier(.16,1,.3,1);cursor:pointer;text-decoration:none;white-space:nowrap}
        #loginLink.nls-account-link:hover,#loginLink.nls-account-link:focus-visible{color:#6a11cb;background:rgba(106,17,203,.08);transform:translateY(-2px);outline:none}
        #loginLink .nls-account-icon{display:inline-flex!important;align-items:center;justify-content:center;width:24px;height:24px;margin:0;font-size:20px;color:inherit}
        #loginLink .nls-account-avatar{width:24px;height:24px;min-width:24px;border-radius:50%;overflow:hidden;display:inline-flex;align-items:center;justify-content:center;color:#fff;background:linear-gradient(135deg,#6a11cb,#2575fc);border:1.5px solid rgba(255,255,255,.95);box-shadow:0 3px 8px rgba(15,23,42,.14);font-size:8px;font-weight:800}
        #loginLink .nls-account-avatar img{width:100%;height:100%;display:block;object-fit:cover}
        #loginLink .nls-account-chevron{font-size:10px;transition:transform .3s ease}
        #loginLink:hover .nls-account-chevron,#loginLink:focus-within .nls-account-chevron{transform:rotate(180deg)}
        #nlsAccountDropdown{position:absolute;top:calc(100% + 6px);right:0;min-width:190px;padding:6px;border:1px solid rgba(226,232,240,.9);border-radius:14px;background:rgba(255,255,255,.96);backdrop-filter:blur(20px) saturate(180%);-webkit-backdrop-filter:blur(20px) saturate(180%);box-shadow:0 18px 45px rgba(15,23,42,.14);opacity:0;visibility:hidden;pointer-events:none;transform:translateY(-6px) scale(.98);transform-origin:top right;transition:all .25s cubic-bezier(.16,1,.3,1);z-index:2147483000}
        #loginLink:hover #nlsAccountDropdown,#loginLink:focus-within #nlsAccountDropdown{opacity:1;visibility:visible;pointer-events:auto;transform:translateY(0) scale(1)}
        #nlsAccountDropdown a,#nlsAccountDropdown button{width:100%;display:flex;align-items:center;gap:10px;padding:10px 12px;border:0;border-radius:9px;background:transparent;color:#475569;font:inherit;font-size:.84rem;font-weight:600;text-align:left;text-decoration:none;cursor:pointer;transition:all .3s cubic-bezier(.4,0,.2,1)}
        #nlsAccountDropdown a:hover,#nlsAccountDropdown button:hover{color:#6a11cb;background:rgba(106,17,203,.08);transform:translateY(-1px)}
        #nlsAccountDropdown .nls-dropdown-logout{color:#dc2626}#nlsAccountDropdown .nls-dropdown-logout:hover{color:#dc2626;background:rgba(220,38,38,.08)}
      }
      @media(max-width:1024px){#nlsAccountDropdown{display:none!important}}
    `;
    document.head.appendChild(s);
  }

  function render(data) {
    const account = document.getElementById("loginLink");
    if (!account) return;

    if (!data?.user) {
      account.href = "/login.html?redirect=/";
      account.setAttribute("aria-label", "Login");
      account.innerHTML = '<i class="fa-solid fa-circle-user nls-account-icon"></i><span class="nls-auth-text">Login</span>';
      account.onclick = function () { window.location.href = "/login.html?redirect=/"; return false; };
      account.style.display = "inline-flex";
      document.getElementById("nlsAccountDropdown")?.remove();
      return;
    }

    const name = data.name || data.user.email || "User";
    const avatar = data.avatarUrl || "";
    account.href = "/dashboard.html";
    account.setAttribute("aria-label", "Account menu");
    account.onclick = function (event) {
      if (event.target.closest("#nlsAccountDropdown")) return;
      window.location.href = "/dashboard.html";
      return false;
    };
    account.innerHTML = avatar
      ? `<span class="nls-account-avatar"><img src="${String(avatar).replace(/&/g,'&amp;').replace(/\"/g,'&quot;')}" alt="Profile picture"></span>`
      : `<span class="nls-account-avatar">${initials(name)}</span>`;
    account.insertAdjacentHTML("beforeend", `<span class="nls-auth-text nls-desktop-auth-name"></span><i class="fa-solid fa-chevron-down nls-account-chevron" aria-hidden="true"></i>`);
    account.querySelector(".nls-desktop-auth-name").textContent = name;

    document.getElementById("nlsAccountDropdown")?.remove();
    const dropdown = document.createElement("div");
    dropdown.id = "nlsAccountDropdown";
    dropdown.innerHTML = '<a href="/dashboard.html"><i class="fa-solid fa-gauge-high"></i><span>Dashboard</span></a><button type="button" class="nls-dropdown-logout"><i class="fa-solid fa-right-from-bracket"></i><span>Logout</span></button>';
    account.appendChild(dropdown);
    dropdown.addEventListener("click", e => e.stopPropagation());
    dropdown.querySelector(".nls-dropdown-logout").addEventListener("click", async e => {
      e.preventDefault();
      try { await window.NextLevelAuth.logout(); }
      finally { window.location.href = "/"; }
    });
    account.style.display = "inline-flex";
  }

  async function init() {
    if (!window.supabaseClient) return;
    styles();
    render(await getAccountData());
    window.supabaseClient.auth.onAuthStateChange(async () => render(await getAccountData()));
  }

  function boot() {
    if (!window.supabaseClient) { setTimeout(boot,100); return; }
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded",init,{once:true}); else init();
  }
  boot();
})();
