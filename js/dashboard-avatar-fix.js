(function () {
  "use strict";

  if (window.__NLSDashboardAvatarFixLoaded) return;
  window.__NLSDashboardAvatarFixLoaded = true;

  const MAX_WAIT = 15000;
  const started = Date.now();
  let state = { url: "", name: "Customer" };
  let observer = null;
  let rendering = false;

  function escapeHtml(value) {
    return String(value ?? "").replace(/[&<>'"]/g, c => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", "\"": "&quot;"
    }[c]));
  }

  function initials(name) {
    const parts = String(name || "Customer").trim().split(/\s+/).filter(Boolean);
    if (!parts.length) return "CU";
    return (parts.length > 1 ? parts[0][0] + parts[parts.length - 1][0] : parts[0][0]).toUpperCase().slice(0, 2);
  }

  function getTitle() {
    return document.getElementById("customerName");
  }

  function render(url, name) {
    const title = getTitle();
    if (!title || rendering) return;
    rendering = true;
    state = { url: url || "", name: name || "Customer" };

    title.classList.add("nls-dashboard-name-with-avatar");
    let avatar = title.querySelector(".nls-dashboard-profile-avatar");
    if (!avatar) {
      avatar = document.createElement("span");
      avatar.className = "nls-dashboard-profile-avatar";
      avatar.setAttribute("aria-hidden", "true");
      title.insertBefore(avatar, title.firstChild);
    }

    avatar.innerHTML = state.url
      ? `<img src="${escapeHtml(state.url)}" alt="Profile picture">`
      : `<span>${escapeHtml(initials(state.name))}</span>`;

    if (!observer) {
      observer = new MutationObserver(() => {
        const current = getTitle();
        if (!current || rendering) return;
        if (!current.querySelector(".nls-dashboard-profile-avatar")) {
          render(state.url, state.name);
        }
      });
      observer.observe(title, { childList: true });
    }

    rendering = false;
  }

  function injectStyles() {
    if (document.getElementById("nls-dashboard-avatar-fix-styles")) return;
    const style = document.createElement("style");
    style.id = "nls-dashboard-avatar-fix-styles";
    style.textContent = `
      #customerName.nls-dashboard-name-with-avatar{display:flex;align-items:center;gap:16px;min-width:0;}
      #customerName .nls-dashboard-profile-avatar{width:76px;height:76px;min-width:76px;flex:0 0 76px;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;overflow:hidden;background:linear-gradient(135deg,#6a11cb,#2575fc);color:#fff;border:3px solid rgba(255,255,255,.95);box-shadow:0 10px 26px rgba(15,23,42,.22),0 0 0 1px rgba(255,255,255,.2);font-size:21px;font-weight:800;line-height:1;}
      #customerName .nls-dashboard-profile-avatar img{width:100%;height:100%;display:block;object-fit:cover;}
      #customerName .nls-dashboard-profile-avatar span{display:inline-flex;align-items:center;justify-content:center;width:100%;height:100%;}
      @media(max-width:640px){#customerName.nls-dashboard-name-with-avatar{gap:12px;align-items:center;}#customerName .nls-dashboard-profile-avatar{width:58px;height:58px;min-width:58px;flex-basis:58px;font-size:17px;}}
    `;
    document.head.appendChild(style);
  }

  async function sync() {
    const title = getTitle();
    if (!title || !window.supabaseClient) return false;

    try {
      const { data } = await window.supabaseClient.auth.getUser();
      const user = data?.user;
      if (!user) return false;

      const { data: profile } = await window.supabaseClient
        .from("profiles")
        .select("avatar_url,full_name,name,email")
        .eq("id", user.id)
        .maybeSingle();

      const name = profile?.full_name || profile?.name || user.user_metadata?.full_name || user.user_metadata?.name || user.email || "Customer";
      const url = profile?.avatar_url || user.user_metadata?.avatar_url || user.user_metadata?.picture || user.user_metadata?.photo_url || "";
      render(url, name);
      return true;
    } catch (error) {
      console.warn("NEXT LEVEL SUBS: Dashboard avatar sync failed:", error);
      return false;
    }
  }

  function start() {
    injectStyles();
    sync();

    const timer = setInterval(async () => {
      const title = getTitle();
      if (title) await sync();
      if (Date.now() - started >= MAX_WAIT) clearInterval(timer);
    }, 750);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start, { once: true });
  else start();
})();
