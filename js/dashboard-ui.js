/* Next Level Subs — customer dashboard UI completion layer */
(function () {
  'use strict';

  var installed = false;
  var countdownTimer = null;

  function ready() {
    return typeof window.renderSubscriptions === 'function' &&
      typeof window.buildSubscriptionsFromOrders === 'function' &&
      document.getElementById('subscriptionsContainer');
  }

  function esc(value) {
    if (value === null || value === undefined) return '';
    return String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
  }

  function has(value) { return value !== null && value !== undefined && String(value).trim() !== ''; }
  function expired(date) {
    if (!has(date)) return false;
    var d = new Date(date);
    return !Number.isNaN(d.getTime()) && d.getTime() <= Date.now();
  }
  function daysLeft(date) {
    if (!has(date)) return null;
    var d = new Date(date).getTime();
    if (Number.isNaN(d)) return null;
    return Math.ceil((d - Date.now()) / 86400000);
  }
  function formatDate(value) {
    if (!has(value)) return '—';
    var d = new Date(value);
    if (Number.isNaN(d.getTime())) return esc(value);
    return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  }
  function formatMoney(value) {
    if (!has(value)) return '—';
    var n = Number(value);
    return Number.isFinite(n) ? '৳' + n.toLocaleString('en-BD', { maximumFractionDigits: 2 }) : esc(value);
  }
  function statusClass(status) {
    var s = String(status || '').toLowerCase();
    if (s === 'active' || s === 'delivered') return 'status-active';
    if (s === 'expired') return 'status-expired';
    if (s === 'pending') return 'status-pending';
    return 'status-processing';
  }
  function relatedOrder(sub) {
    var orders = Array.isArray(window.currentOrders) ? window.currentOrders : [];
    return orders.find(function (o) { return String(o.id) === String(sub.order_id); }) || null;
  }
  function nameOf(sub) { return sub.product_name || sub.service_name || sub.component_name || 'Subscription'; }
  function imageOf(sub) { return sub.product_image || sub.component_image || ''; }
  function expiryOf(sub) { return sub.subscription_expiry || sub.expiry || ''; }
  function startOf(sub) { return sub.subscription_start || sub.start_date || ''; }
  function planOf(sub) { return sub.plan_duration || sub.plan || 'Standard'; }

  function ensureStyles() {
    if (document.getElementById('nlsDashboardUiStyles')) return;
    var style = document.createElement('style');
    style.id = 'nlsDashboardUiStyles';
    style.textContent = `
      .nls-dashboard-toolbar{display:flex;align-items:center;gap:8px;flex-wrap:wrap;padding:14px 20px;border-bottom:1px solid #eef0f4;background:#fbfcff}
      .nls-filter{border:1px solid #e5e7eb;background:#fff;color:#4b5563;border-radius:10px;padding:8px 12px;font-size:12px;font-weight:700;cursor:pointer;transition:.2s}
      .nls-filter.active,.nls-filter:hover{color:#6a11cb;border-color:#d8b4fe;background:#faf5ff}
      .nls-refresh{margin-left:auto;border:1px solid #e5e7eb;background:#fff;color:#4b5563;border-radius:10px;padding:8px 12px;font-size:12px;font-weight:700;cursor:pointer}
      .nls-refresh:hover{color:#6a11cb;background:#faf5ff}
      .nls-sub-card{position:relative;overflow:hidden;border:1px solid #e8eaf0;border-radius:18px;background:#fff;box-shadow:0 5px 18px rgba(15,23,42,.045);transition:.25s;cursor:pointer}
      .nls-sub-card:hover{transform:translateY(-3px);box-shadow:0 12px 28px rgba(15,23,42,.09);border-color:#ddd6fe}
      .nls-sub-card.expired{background:linear-gradient(145deg,#fff,#fff8f8);border-color:#fecaca}
      .nls-sub-accent{height:4px;background:linear-gradient(90deg,#6a11cb,#2575fc)}
      .nls-sub-card.expired .nls-sub-accent{background:linear-gradient(90deg,#ef4444,#f97316)}
      .nls-sub-body{padding:17px}
      .nls-sub-head{display:flex;align-items:flex-start;justify-content:space-between;gap:10px}
      .nls-sub-product{display:flex;align-items:center;gap:11px;min-width:0}
      .nls-sub-img{width:48px;height:48px;flex:0 0 48px;border-radius:13px;object-fit:cover;border:1px solid #e5e7eb;background:#f5f3ff}
      .nls-sub-img-fallback{display:flex;align-items:center;justify-content:center;color:#6a11cb;font-size:18px}
      .nls-sub-name{margin:0;color:#18212f;font-size:15px;font-weight:800;line-height:1.25;word-break:break-word}
      .nls-sub-plan{margin-top:3px;color:#9ca3af;font-size:11px;font-weight:650}
      .nls-sub-meta{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:15px}
      .nls-sub-meta-item{padding:9px 10px;border-radius:10px;background:#f8fafc}
      .nls-sub-meta-label{display:block;color:#9ca3af;font-size:9px;font-weight:800;text-transform:uppercase;letter-spacing:.04em}
      .nls-sub-meta-value{display:block;margin-top:3px;color:#374151;font-size:11px;font-weight:750}
      .nls-sub-countdown{margin-top:11px;padding:9px 10px;border-radius:10px;background:#f5f3ff;color:#5b21b6;font-size:11px;font-weight:800;display:flex;align-items:center;justify-content:space-between;gap:8px}
      .nls-sub-countdown.expired{background:#fef2f2;color:#b91c1c}
      .nls-sub-countdown.soon{background:#fffbeb;color:#b45309}
      .nls-sub-footer{display:flex;align-items:center;justify-content:space-between;gap:8px;margin-top:12px}
      .nls-sub-view{color:#6a11cb;font-size:11px;font-weight:800}
      .nls-renew{display:inline-flex;align-items:center;gap:6px;padding:8px 10px;border-radius:9px;background:#dc2626;color:#fff;font-size:10px;font-weight:800;text-decoration:none}
      .nls-renew:hover{background:#b91c1c}
      .nls-expired-banner{margin:0 13px 13px;padding:13px;border:1px solid #fecaca;border-radius:13px;background:#fff5f5;display:flex;align-items:center;gap:10px;color:#991b1b}
      .nls-expired-banner i{font-size:17px}
      .nls-expired-banner strong{display:block;font-size:12px}.nls-expired-banner span{display:block;margin-top:2px;font-size:10px;color:#b91c1c}
      .nls-empty-filter{padding:34px 20px;text-align:center;color:#9ca3af;font-size:12px}
      .nls-lock{padding:14px;border:1px solid #fecaca;background:#fef2f2;border-radius:12px;color:#991b1b}
      .nls-lock-title{font-size:13px;font-weight:800}.nls-lock-text{margin-top:4px;font-size:11px;line-height:1.55}
      .nls-lock-btn{display:inline-flex;margin-top:10px;padding:8px 11px;border-radius:9px;background:#dc2626;color:#fff;text-decoration:none;font-size:10px;font-weight:800}
      .nls-stat-expired .stat-icon{color:#dc2626;background:#fef2f2}
      @media(max-width:640px){.nls-dashboard-toolbar{padding:11px 13px}.nls-refresh{margin-left:0}.nls-sub-meta{grid-template-columns:1fr}.nls-sub-body{padding:15px}}
    `;
    document.head.appendChild(style);
  }

  function addExpiredStat() {
    var grid = document.querySelector('.stats-grid');
    if (!grid || document.getElementById('expiredSubscriptionCount')) return;
    var card = document.createElement('div');
    card.className = 'stat-card dashboard-item nls-stat-expired';
    card.innerHTML = '<div class="stat-content"><div><p class="stat-label">Expired Subscriptions</p><p id="expiredSubscriptionCount" class="stat-value">0</p></div><div class="stat-icon"><i class="fas fa-lock"></i></div></div>';
    grid.appendChild(card);
  }

  function installToolbar() {
    var container = document.getElementById('subscriptionsContainer');
    if (!container || document.getElementById('nlsDashboardToolbar')) return;
    var toolbar = document.createElement('div');
    toolbar.id = 'nlsDashboardToolbar';
    toolbar.className = 'nls-dashboard-toolbar';
    toolbar.innerHTML = `
      <button type="button" class="nls-filter active" data-filter="all">All</button>
      <button type="button" class="nls-filter" data-filter="active">Active</button>
      <button type="button" class="nls-filter" data-filter="soon">Expiring Soon</button>
      <button type="button" class="nls-filter" data-filter="expired">Expired</button>
      <button type="button" class="nls-refresh" id="nlsDashboardRefresh"><i class="fas fa-rotate"></i> Refresh</button>
    `;
    container.parentNode.insertBefore(toolbar, container);
    toolbar.querySelectorAll('.nls-filter').forEach(function (btn) {
      btn.addEventListener('click', function () {
        toolbar.querySelectorAll('.nls-filter').forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        renderEnhanced(btn.dataset.filter || 'all');
      });
    });
    document.getElementById('nlsDashboardRefresh').addEventListener('click', async function () {
      if (!window.currentUser || typeof window.loadOrders !== 'function') return;
      var button = this;
      button.disabled = true;
      button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Refreshing';
      try { await window.loadOrders(window.currentUser); window.buildSubscriptionsFromOrders(); }
      catch (e) { console.warn('Dashboard refresh failed:', e); }
      finally { button.disabled = false; button.innerHTML = '<i class="fas fa-rotate"></i> Refresh'; }
    });
  }

  function renderEnhanced(filter) {
    var container = document.getElementById('subscriptionsContainer');
    var subs = Array.isArray(window.currentSubscriptions) ? window.currentSubscriptions : [];
    if (!container) return;

    if (!subs.length) {
      if (typeof window.renderEmptySubscriptions === 'function') window.renderEmptySubscriptions();
      return;
    }

    var filtered = subs.filter(function (s) {
      var exp = expiryOf(s);
      var isExp = expired(exp) || String(s.status || '').toLowerCase() === 'expired';
      var left = daysLeft(exp);
      var isSoon = !isExp && left !== null && left <= 7;
      var isActive = !isExp && (String(s.status || '').toLowerCase() === 'active' || String(s.status || '').toLowerCase() === 'delivered');
      if (filter === 'expired') return isExp;
      if (filter === 'soon') return isSoon;
      if (filter === 'active') return isActive;
      return true;
    });

    if (!filtered.length) {
      container.innerHTML = '<div class="nls-empty-filter"><i class="fas fa-filter"></i><br><br>No subscriptions match this filter.</div>';
      updateStats(subs);
      return;
    }

    container.innerHTML = '<div class="subscription-list">' + filtered.map(function (s) {
      var exp = expiryOf(s);
      var isExp = expired(exp) || String(s.status || '').toLowerCase() === 'expired';
      var left = daysLeft(exp);
      var soon = !isExp && left !== null && left <= 7;
      var img = imageOf(s);
      var name = nameOf(s);
      var plan = planOf(s);
      var start = startOf(s);
      var price = s.component_price !== undefined && s.component_price !== null ? s.component_price : s.price;
      var renewHref = 'index.html';
      var countdownText = isExp ? 'Subscription expired' : (left === null ? 'Expiry date not set' : (left === 0 ? 'Expires today' : left + (left === 1 ? ' day remaining' : ' days remaining')));
      var cardClass = 'nls-sub-card' + (isExp ? ' expired' : '');
      var countClass = 'nls-sub-countdown' + (isExp ? ' expired' : (soon ? ' soon' : ''));
      return '<article class="' + cardClass + '" tabindex="0" role="button" data-nls-id="' + esc(s.id || '') + '">' +
        '<div class="nls-sub-accent"></div><div class="nls-sub-body">' +
          '<div class="nls-sub-head"><div class="nls-sub-product">' +
            (img ? '<img class="nls-sub-img" src="' + esc(img) + '" alt="' + esc(name) + '" loading="lazy" onerror="this.style.display=\'none\'">' : '<div class="nls-sub-img nls-sub-img-fallback"><i class="fas fa-tv"></i></div>') +
            '<div><h3 class="nls-sub-name">' + esc(name) + '</h3><div class="nls-sub-plan">' + esc(plan) + '</div></div>' +
          '</div><span class="status-badge ' + statusClass(isExp ? 'expired' : 'active') + '">' + (isExp ? 'Expired' : 'Active') + '</span></div>' +
          '<div class="nls-sub-meta"><div class="nls-sub-meta-item"><span class="nls-sub-meta-label">Started</span><span class="nls-sub-meta-value">' + formatDate(start) + '</span></div><div class="nls-sub-meta-item"><span class="nls-sub-meta-label">Expires</span><span class="nls-sub-meta-value">' + formatDate(exp) + '</span></div></div>' +
          '<div class="' + countClass + '"><span><i class="fas fa-clock"></i> ' + esc(countdownText) + '</span><span>' + formatMoney(price) + '</span></div>' +
          '<div class="nls-sub-footer"><span class="nls-sub-view"><i class="fas fa-arrow-right"></i> View details</span>' + (isExp ? '<a class="nls-renew" href="' + renewHref + '" onclick="event.stopPropagation()"><i class="fas fa-rotate"></i> Renew</a>' : '') + '</div>' +
        '</div></article>';
    }).join('') + '</div>';

    container.querySelectorAll('.nls-sub-card').forEach(function (card) {
      var id = card.dataset.nlsId;
      var sub = subs.find(function (s) { return String(s.id || '') === String(id); });
      if (!sub) return;
      card.addEventListener('click', function () { window.openSubscriptionModal(sub); });
      card.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); window.openSubscriptionModal(sub); } });
    });
    updateStats(subs);
  }

  function updateStats(subs) {
    var active = 0, exp = 0;
    subs.forEach(function (s) {
      var isExp = expired(expiryOf(s)) || String(s.status || '').toLowerCase() === 'expired';
      if (isExp) exp++; else if (String(s.status || '').toLowerCase() === 'active' || String(s.status || '').toLowerCase() === 'delivered') active++;
    });
    var activeEl = document.getElementById('activeSubscriptionCount');
    var expiredEl = document.getElementById('expiredSubscriptionCount');
    if (activeEl) activeEl.textContent = active;
    if (expiredEl) expiredEl.textContent = exp;
  }

  function lockCredentialsInModal() {
    if (typeof window.openSubscriptionModal !== 'function' || window.__nlsDashboardModalWrapped) return;
    var original = window.openSubscriptionModal;
    window.openSubscriptionModal = function (subscription) {
      var isExp = expired(expiryOf(subscription)) || String(subscription && subscription.status || '').toLowerCase() === 'expired';
      if (isExp) {
        var modal = document.getElementById('subscriptionDetailModal');
        if (!modal) return original(subscription);
        var body = document.getElementById('nlsModalBody');
        original(subscription);
        body = document.getElementById('nlsModalBody');
        if (!body) return;
        var sections = body.querySelectorAll('.nls-detail-section');
        for (var i = 0; i < sections.length; i++) {
          var title = sections[i].querySelector('.nls-detail-section-title');
          if (title && title.textContent.toLowerCase().indexOf('account credentials') !== -1) {
            sections[i].innerHTML = '<div class="nls-detail-section-title"><i class="fas fa-lock"></i> Account Credentials</div><div style="padding:15px"><div class="nls-lock"><div class="nls-lock-title"><i class="fas fa-shield-halved"></i> Credentials locked</div><div class="nls-lock-text">This subscription expired on ' + esc(formatDate(expiryOf(subscription))) + '. Login credentials are hidden for your security.</div><a class="nls-lock-btn" href="index.html"><i class="fas fa-rotate"></i> Renew Subscription</a></div></div>';
            break;
          }
        }
        return;
      }
      original(subscription);
    };
    window.__nlsDashboardModalWrapped = true;
  }

  function patchBuilder() {
    if (window.__nlsDashboardBuilderPatched || typeof window.buildSubscriptionsFromOrders !== 'function') return;
    var original = window.buildSubscriptionsFromOrders;
    window.buildSubscriptionsFromOrders = function () {
      original();
      if (Array.isArray(window.currentSubscriptions)) {
        window.currentSubscriptions.forEach(function (sub) {
          var order = relatedOrder(sub);
          if (order && has(order.transaction_id)) sub.transaction_id = order.transaction_id;
          if (expired(expiryOf(sub))) sub.status = 'expired';
        });
      }
      renderEnhanced('all');
    };
    window.__nlsDashboardBuilderPatched = true;
  }

  function tick() {
    var cards = document.querySelectorAll('.nls-sub-card');
    cards.forEach(function (card) {
      var id = card.dataset.nlsId;
      var sub = (window.currentSubscriptions || []).find(function (s) { return String(s.id || '') === String(id); });
      if (!sub) return;
      var left = daysLeft(expiryOf(sub));
      var exp = expired(expiryOf(sub));
      var box = card.querySelector('.nls-sub-countdown');
      if (!box) return;
      box.classList.toggle('expired', exp);
      box.classList.toggle('soon', !exp && left !== null && left <= 7);
      var span = box.querySelector('span');
      if (span) span.innerHTML = '<i class="fas fa-clock"></i> ' + esc(exp ? 'Subscription expired' : (left === null ? 'Expiry date not set' : (left === 0 ? 'Expires today' : left + (left === 1 ? ' day remaining' : ' days remaining'))));
    });
    updateStats(Array.isArray(window.currentSubscriptions) ? window.currentSubscriptions : []);
  }

  function install() {
    if (installed || !ready()) return false;
    installed = true;
    ensureStyles();
    addExpiredStat();
    installToolbar();
    patchBuilder();
    lockCredentialsInModal();
    renderEnhanced('all');
    if (countdownTimer) clearInterval(countdownTimer);
    countdownTimer = setInterval(tick, 60000);
    return true;
  }

  var attempts = 0;
  var timer = setInterval(function () {
    attempts++;
    if (install() || attempts >= 200) clearInterval(timer);
  }, 100);
})();
