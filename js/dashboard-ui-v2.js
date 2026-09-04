/* Next Level Subs — dashboard UI enhancer (DOM-safe) */
(function () {
  'use strict';

  var initialized = false;
  var activeFilter = 'all';
  var observer = null;
  var timer = null;

  function readyHost() { return document.getElementById('subscriptionsContainer'); }
  function esc(v) { return String(v == null ? '' : v).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#039;'); }
  function text(el) { return el ? (el.textContent || '').replace(/\s+/g,' ').trim() : ''; }
  function isExpired(card) { return /\bexpired\b/i.test(text(card)); }

  // Product URLs use the same slug algorithm as /js/products.js.
  function productSlug(name) {
    return String(name || '')
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  function getRenewUrl(card) {
    var slug = card && card.dataset ? card.dataset.productSlug : '';
    if (!slug) {
      var title = card ? card.querySelector('.subscription-name') : null;
      slug = productSlug(text(title));
    }
    return slug ? '/product/' + encodeURIComponent(slug) : '/';
  }

  function expiryDate(card) {
    var raw = text(card);
    var m = raw.match(/\b(\d{1,2}\s+[A-Za-z]{3,9}\s+\d{4})\b/);
    if (!m) return null;
    var d = new Date(m[1]);
    return isNaN(d.getTime()) ? null : d;
  }

  function daysLeft(card) {
    var d = expiryDate(card);
    if (!d) return null;
    return Math.ceil((d.getTime() - Date.now()) / 86400000);
  }

  function injectStyles() {
    if (document.getElementById('nlsDashboardV2Styles')) return;
    var style = document.createElement('style');
    style.id = 'nlsDashboardV2Styles';
    style.textContent = `
      #nlsDashboardV2Toolbar{display:flex;align-items:center;gap:8px;flex-wrap:wrap;padding:13px 18px;border-bottom:1px solid #eef0f4;background:#fbfcff}
      .nls-v2-filter,.nls-v2-refresh{border:1px solid #e5e7eb;background:#fff;color:#4b5563;border-radius:10px;padding:8px 12px;font-size:12px;font-weight:800;cursor:pointer;transition:.2s}
      .nls-v2-filter:hover,.nls-v2-filter.active,.nls-v2-refresh:hover{color:#6a11cb;border-color:#d8b4fe;background:#faf5ff}
      .nls-v2-refresh{margin-left:auto}
      .nls-v2-enhanced-card{position:relative!important;overflow:hidden!important;border-radius:18px!important;border:1px solid #e8eaf0!important;background:#fff!important;box-shadow:0 6px 20px rgba(15,23,42,.055)!important;transition:transform .2s,box-shadow .2s,border-color .2s!important}
      .nls-v2-enhanced-card:hover{transform:translateY(-3px);box-shadow:0 12px 28px rgba(15,23,42,.09)!important;border-color:#ddd6fe!important}
      .nls-v2-enhanced-card.nls-v2-is-expired{border-color:#fecaca!important;background:linear-gradient(145deg,#fff,#fff8f8)!important}
      .nls-v2-enhanced-card.nls-v2-is-expired:before{content:"";display:block;height:4px;background:linear-gradient(90deg,#ef4444,#f97316)}
      .nls-v2-enhanced-card:not(.nls-v2-is-expired):before{content:"";display:block;height:4px;background:linear-gradient(90deg,#6a11cb,#2575fc)}
      .nls-v2-expiry-pill{display:inline-flex;align-items:center;gap:5px;margin:8px 0 0;padding:7px 10px;border-radius:9px;background:#f5f3ff;color:#5b21b6;font-size:10px;font-weight:850}
      .nls-v2-expiry-pill.soon{background:#fffbeb;color:#b45309}.nls-v2-expiry-pill.expired{background:#fef2f2;color:#b91c1c}
      .nls-v2-renew-banner{display:flex;align-items:center;justify-content:space-between;gap:10px;margin:10px 0 0;padding:10px 12px;border:1px solid #fecaca;border-radius:11px;background:#fff5f5;color:#991b1b;font-size:10px;font-weight:800}
      .nls-v2-renew-banner a{display:inline-flex;padding:7px 10px;border-radius:8px;background:#dc2626;color:#fff!important;text-decoration:none!important;white-space:nowrap}
      .nls-v2-modal-lock{padding:14px;border:1px solid #fecaca;border-radius:12px;background:#fef2f2;color:#991b1b}
      .nls-v2-modal-lock strong{font-size:13px}.nls-v2-modal-lock p{margin:5px 0 0;font-size:11px;line-height:1.55}.nls-v2-modal-lock a{display:inline-flex;margin-top:10px;padding:9px 12px;border-radius:9px;background:#dc2626;color:#fff!important;text-decoration:none!important;font-size:10px;font-weight:800}
      @media(max-width:700px){.nls-v2-refresh{margin-left:0}}
    `;
    document.head.appendChild(style);
  }

  function cards() {
    var host = readyHost();
    if (!host) return [];
    return Array.prototype.slice.call(host.querySelectorAll('.subscription-card:not(.nls-v2-processed)'));
  }

  function ensureToolbar() {
    var host = readyHost();
    if (!host || document.getElementById('nlsDashboardV2Toolbar')) return;
    var t = document.createElement('div');
    t.id = 'nlsDashboardV2Toolbar';
    t.innerHTML = '<button class="nls-v2-filter active" data-filter="all">All</button>' +
      '<button class="nls-v2-filter" data-filter="active">Active</button>' +
      '<button class="nls-v2-filter" data-filter="soon">Expiring Soon</button>' +
      '<button class="nls-v2-filter" data-filter="expired">Expired</button>' +
      '<button class="nls-v2-refresh" type="button"><i class="fas fa-rotate"></i> Refresh</button>';
    host.parentNode.insertBefore(t, host);
    t.addEventListener('click', function (e) {
      var b = e.target.closest('.nls-v2-filter');
      if (b) {
        activeFilter = b.dataset.filter;
        t.querySelectorAll('.nls-v2-filter').forEach(function(x){x.classList.toggle('active', x === b);});
        applyFilter();
      }
      if (e.target.closest('.nls-v2-refresh')) window.location.reload();
    });
  }

  function addCardEnhancements(card) {
    card.classList.add('nls-v2-processed','nls-v2-enhanced-card');
    var ex = isExpired(card);
    if (ex) card.classList.add('nls-v2-is-expired');
    var d = daysLeft(card);
    var existing = card.querySelector('.nls-v2-expiry-pill');
    if (!existing) {
      var pill = document.createElement('div');
      pill.className = 'nls-v2-expiry-pill ' + (ex ? 'expired' : (d !== null && d <= 7 ? 'soon' : ''));
      pill.innerHTML = ex ? '<i class="fas fa-lock"></i> Subscription expired' : (d === 0 ? '<i class="fas fa-clock"></i> Expires today' : d === 1 ? '<i class="fas fa-clock"></i> 1 day remaining' : d !== null ? '<i class="fas fa-clock"></i> ' + esc(d) + ' days remaining' : '<i class="fas fa-calendar"></i> Expiry date not set');
      card.appendChild(pill);
    }
    if (ex && !card.querySelector('.nls-v2-renew-banner')) {
      var banner = document.createElement('div');
      banner.className = 'nls-v2-renew-banner';
      banner.innerHTML = '<span><i class="fas fa-lock"></i> Credentials locked after expiry</span><a href="' + esc(getRenewUrl(card)) + '" onclick="event.stopPropagation()">Renew</a>';
      card.appendChild(banner);
    }
    card.addEventListener('click', function () {
      if (!ex) return;
      setTimeout(lockExpiredModal, 0);
      setTimeout(lockExpiredModal, 120);
    }, true);
  }

  function lockExpiredModal() {
    var body = document.getElementById('nlsModalBody');
    if (!body) return;
    var sections = body.querySelectorAll('.nls-detail-section');
    for (var i=0;i<sections.length;i++) {
      var title = sections[i].querySelector('.nls-detail-section-title');
      if (!title || !/Account Credentials/i.test(text(title))) continue;
      sections[i].innerHTML = '<div class="nls-detail-section-title"><i class="fas fa-lock"></i> Account Credentials</div><div style="padding:15px"><div class="nls-v2-modal-lock"><strong><i class="fas fa-shield-halved"></i> Credentials locked</strong><p>This subscription has expired. Login credentials are hidden after the subscription expiry date.</p><a href="' + esc(getRenewUrl(document.querySelector('.nls-v2-is-expired')) ) + '"><i class="fas fa-rotate"></i> Renew Subscription</a></div></div>';
      break;
    }
  }

  function applyFilter() {
    var host = readyHost(); if (!host) return;
    var all = Array.prototype.slice.call(host.querySelectorAll('.subscription-card'));
    all.forEach(function(card){
      var ex=isExpired(card), d=daysLeft(card), so=!ex&&d!==null&&d<=7;
      var show=activeFilter==='all'||(activeFilter==='expired'&&ex)||(activeFilter==='soon'&&so)||(activeFilter==='active'&&!ex&&!so);
      card.style.display=show?'':'none';
    });
  }

  function enhance() {
    if (!readyHost()) return false;
    injectStyles(); ensureToolbar();
    cards().forEach(addCardEnhancements);
    applyFilter();
    return true;
  }

  function start() {
    if (initialized) return;
    var host = readyHost(); if (!host) return;
    initialized = true;
    enhance();
    observer = new MutationObserver(function(){ enhance(); });
    observer.observe(host, {childList:true,subtree:true});
    timer = setInterval(enhance, 5000);
  }

  var attempts=0;
  var boot=setInterval(function(){
    attempts++;
    start();
    if(initialized||attempts>240)clearInterval(boot);
  },100);
})();
