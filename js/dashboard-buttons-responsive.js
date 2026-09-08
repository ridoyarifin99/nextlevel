(function () {
  "use strict";
  if (window.__NLSDashboardButtonsResponsiveLoaded) return;
  window.__NLSDashboardButtonsResponsiveLoaded = true;

  if (!/\/dashboard\.html$/i.test(window.location.pathname)) return;

  function apply() {
    if (document.getElementById("nls-dashboard-buttons-responsive")) return;
    const style = document.createElement("style");
    style.id = "nls-dashboard-buttons-responsive";
    style.textContent = `
      @media (max-width: 1024px) {
        .welcome-actions {
          gap: 8px;
          flex-wrap: wrap;
          align-items: center;
        }
        .welcome-actions .btn-premium,
        .welcome-actions .btn-outline-premium,
        .welcome-actions .nls-edit-profile-btn {
          min-height: 42px;
          height: 42px;
          padding: 0 14px;
          gap: 7px;
          font-size: .8rem;
          line-height: 1;
          white-space: nowrap;
          flex: 0 1 auto;
          width: auto !important;
          min-width: 0;
          max-width: 100%;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .welcome-actions .btn-premium span,
        .welcome-actions .btn-outline-premium span,
        .welcome-actions .nls-edit-profile-btn span {
          min-width: 0;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .welcome-actions .btn-premium i,
        .welcome-actions .btn-outline-premium i,
        .welcome-actions .nls-edit-profile-btn i {
          flex: 0 0 auto;
        }
      }

      @media (max-width: 640px) {
        .welcome-content { gap: 18px; }
        .welcome-actions {
          width: 100%;
          justify-content: flex-start;
          gap: 8px;
        }
        .welcome-actions .btn-premium,
        .welcome-actions .btn-outline-premium,
        .welcome-actions .nls-edit-profile-btn {
          min-height: 40px;
          height: 40px;
          padding: 0 12px;
          gap: 6px;
          font-size: .76rem;
        }
      }

      @media (max-width: 380px) {
        .welcome-actions { gap: 6px; }
        .welcome-actions .btn-premium,
        .welcome-actions .btn-outline-premium,
        .welcome-actions .nls-edit-profile-btn {
          min-height: 38px;
          height: 38px;
          padding: 0 10px;
          gap: 5px;
          font-size: .72rem;
        }
      }
    `;
    document.head.appendChild(style);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", apply, { once: true });
  } else {
    apply();
  }
})();
