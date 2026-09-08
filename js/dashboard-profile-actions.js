(function () {
  "use strict";

  if (window.__NLSDashboardProfileActionsLoaded) return;
  window.__NLSDashboardProfileActionsLoaded = true;

  function ensureEditProfileButton() {
    if (!/\/dashboard\.html$/i.test(window.location.pathname)) return;

    const actions = document.querySelector(".welcome-actions");
    if (!actions) return;
    if (document.getElementById("nlsEditProfileButton")) return;

    const button = document.createElement("a");
    button.id = "nlsEditProfileButton";
    button.href = "/profile-settings.html";
    button.className = "btn-outline-premium nls-edit-profile-btn";
    button.innerHTML = '<i class="fas fa-user-pen"></i><span>Edit Profile</span>';
    button.setAttribute("aria-label", "Edit profile");
    actions.insertBefore(button, actions.firstChild);
  }

  function boot() {
    ensureEditProfileButton();

    const observer = new MutationObserver(ensureEditProfileButton);
    observer.observe(document.body, { childList: true, subtree: true });

    window.setTimeout(ensureEditProfileButton, 250);
    window.setTimeout(ensureEditProfileButton, 1000);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot, { once: true });
  } else {
    boot();
  }
})();
