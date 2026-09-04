(function () {
  'use strict';

  function install() {
    if (window.__nlsExpiryLockInstalled) return true;
    if (typeof window.openSubscriptionModal !== 'function') return false;

    var original = window.openSubscriptionModal;
    window.openSubscriptionModal = function (subscription) {
      original(subscription);

      var expiry = subscription && (subscription.subscription_expiry || subscription.expiry || subscription.subscriptionExpiry);
      if (!expiry) return;
      var expiryDate = new Date(expiry);
      if (Number.isNaN(expiryDate.getTime()) || expiryDate >= new Date()) return;

      var body = document.getElementById('nlsModalBody');
      if (!body) return;

      var sections = body.querySelectorAll('.nls-detail-section');
      for (var i = 0; i < sections.length; i++) {
        var title = sections[i].querySelector('.nls-detail-section-title');
        if (!title || title.textContent.indexOf('Account Credentials') === -1) continue;

        sections[i].innerHTML = `
          <div class="nls-detail-section-title"><i class="fas fa-lock"></i> Account Credentials</div>
          <div style="padding:16px;border:1px solid #fecaca;background:#fef2f2;border-radius:12px;color:#991b1b;">
            <div style="font-weight:800;font-size:14px;">Your subscription has expired.</div>
            <div style="margin-top:5px;font-size:12px;line-height:1.55;">Login credentials are locked after the subscription expiry date.</div>
            <a href="index.html" style="display:inline-flex;align-items:center;gap:7px;margin-top:12px;padding:10px 14px;border-radius:10px;background:#dc2626;color:#fff;text-decoration:none;font-size:12px;font-weight:800;">
              <i class="fas fa-rotate"></i> Renew Subscription
            </a>
          </div>`;
        break;
      }

      window.__nlsExpiryLockInstalled = true;
    };

    return true;
  }

  var attempts = 0;
  var timer = setInterval(function () {
    attempts += 1;
    if (install() || attempts >= 100) clearInterval(timer);
  }, 100);
})();
