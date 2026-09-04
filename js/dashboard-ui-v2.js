/* Next Level Subs — completed customer dashboard UI */
(function () {
  'use strict';
  var installed = false, latestSubs = [], countdownTimer = null;

  function has(v){return v!==null&&v!==undefined&&String(v).trim()!=='';}
  function esc(v){return String(v==null?'':v).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#039;');}
  function expiry(s){return s&&(s.subscription_expiry||s.expiry||'');}
  function expired(s){var v=expiry(s);if(!has(v))return false;var d=new Date(v);return !Number.isNaN(d.getTime())&&d.getTime()<=Date.now();}
  function days(s){var v=expiry(s);if(!has(v))return null;var t=new Date(v).getTime();return Number.isNaN(t)?null:Math.ceil((t-Date.now())/86400000);}
  function date(v){if(!has(v))return '—';var d=new Date(v);return Number.isNaN(d.getTime())?esc(v):d.toLocaleDateString('en-GB',{day:'2-digit',month:'short',year:'numeric'});}
  function money(v){var n=Number(v);return Number.isFinite(n)?'৳'+n.toLocaleString('en-BD',{maximumFractionDigits:2}):'—';}
  function name(s){return s.product_name||s.service_name||s.component_name||'Subscription';}
  function img(s){return s.product_image||s.component_image||'';}
  function plan(s){return s.plan_duration||s.plan||'Standard';}
  function active(s){var st=String(s.status||'').toLowerCase();return !expired(s)&&(st==='active'||st==='delivered');}

  function styles(){
    if(document.getElementById('nlsDashboardV2Styles'))return;
    var x=document.createElement('style');x.id='nlsDashboardV2Styles';x.textContent=`
      .nls-v2-toolbar{display:flex;align-items:center;gap:8px;flex-wrap:wrap;padding:14px 20px;border-bottom:1px solid #eef0f4;background:#fbfcff}
      .nls-v2-filter,.nls-v2-refresh{border:1px solid #e5e7eb;background:#fff;color:#4b5563;border-radius:10px;padding:8px 12px;font-size:12px;font-weight:750;cursor:pointer;transition:.2s}
      .nls-v2-filter.active,.nls-v2-filter:hover,.nls-v2-refresh:hover{color:#6a11cb;border-color:#d8b4fe;background:#faf5ff}
      .nls-v2-refresh{margin-left:auto}.nls-v2-refresh:disabled{opacity:.6;cursor:wait}
      .nls-v2-card{position:relative;overflow:hidden;border:1px solid #e8eaf0;border-radius:18px;background:#fff;box-shadow:0 5px 18px rgba(15,23,42,.045);transition:.25s;cursor:pointer}
      .nls-v2-card:hover{transform:translateY(-3px);box-shadow:0 12px 28px rgba(15,23,42,.09);border-color:#ddd6fe}
      .nls-v2-card.expired{background:linear-gradient(145deg,#fff,#fff8f8);border-color:#fecaca}.nls-v2-accent{height:4px;background:linear-gradient(90deg,#6a11cb,#2575fc)}.nls-v2-card.expired .nls-v2-accent{background:linear-gradient(90deg,#ef4444,#f97316)}
      .nls-v2-body{padding:17px}.nls-v2-head{display:flex;align-items:flex-start;justify-content:space-between;gap:10px}.nls-v2-product{display:flex;align-items:center;gap:11px;min-width:0}
      .nls-v2-img{width:50px;height:50px;flex:0 0 50px;border-radius:13px;object-fit:cover;border:1px solid #e5e7eb;background:#f5f3ff}.nls-v2-fallback{display:flex;align-items:center;justify-content:center;color:#6a11cb;font-size:18px}
      .nls-v2-name{margin:0;color:#18212f;font-size:15px;font-weight:800;line-height:1.25;word-break:break-word}.nls-v2-plan{margin-top:3px;color:#9ca3af;font-size:11px;font-weight:650}
      .nls-v2-meta{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:15px}.nls-v2-meta>div{padding:9px 10px;border-radius:10px;background:#f8fafc}.nls-v2-label{display:block;color:#9ca3af;font-size:9px;font-weight:800;text-transform:uppercase}.nls-v2-value{display:block;margin-top:3px;color:#374151;font-size:11px;font-weight:750}
      .nls-v2-count{margin-top:11px;padding:9px 10px;border-radius:10px;background:#f5f3ff;color:#5b21b6;font-size:11px;font-weight:800;display:flex;justify-content:space-between;gap:8px}.nls-v2-count.soon{background:#fffbeb;color:#b45309}.nls-v2-count.expired{background:#fef2f2;color:#b91c1c}
      .nls-v2-footer{display:flex;align-items:center;justify-content:space-between;gap:8px;margin-top:12px}.nls-v2-view{color:#6a11cb;font-size:11px;font-weight:800}.nls-v2-renew{display:inline-flex;align-items:center;gap:6px;padding:8px 10px;border-radius:9px;background:#dc2626;color:#fff;font-size:10px;font-weight:800;text-decoration:none}.nls-v2-renew:hover{background:#b91c1c}
      .nls-v2-empty{padding:36px 20px;text-align:center;color:#9ca3af;font-size:12px}.nls-v2-expired-note{margin:0 13px 13px;padding:12px;border:1px solid #fecaca;border-radius:12px;background:#fff5f5;color:#991b1b;font-size:11px;font-weight:700}
      .nls-v2-lock{padding:14px;border:1px solid #fecaca;background:#fef2f2;border-radius:12px;color:#991b1b}.nls-v2-lock strong{font-size:13px}.nls-v2-lock p{margin:5px 0 0;font-size:11px;line-height:1.55}.nls-v2-lock a{display:inline-flex;margin-top:10px;padding:8px 11px;border-radius:9px;background:#dc2626;color:#fff;text-decoration:none;font-size:10px;font-weight:800}
      .nls-v2-expired-stat .stat-icon{color:#dc2626;background:#fef2f2}
      @media(max-width:640px){.nls-v2-toolbar{padding:11px 13px}.nls-v2-refresh{margin-left:0}.nls-v2-meta{grid-template-columns:1fr}.nls-v2-body{padding:15px}}
    `;document.head.appendChild(x);
  }

  function addExpiredStat(){
    var grid=document.querySelector('.stats-grid');if(!grid||document.getElementById('expiredSubscriptionCount'))return;
    var c=document.createElement('div');c.className='stat-card dashboard-item nls-v2-expired-stat';c.innerHTML='<div class="stat-content"><div><p class="stat-label">Expired Subscriptions</p><p id="expiredSubscriptionCount" class="stat-value">0</p></div><div class="stat-icon"><i class="fas fa-lock"></i></div></div>';grid.appendChild(c);
  }

  function toolbar(){
    var host=document.getElementById('subscriptionsContainer');if(!host||document.getElementById('nlsDashboardV2Toolbar'))return;
    var t=document.createElement('div');t.id='nlsDashboardV2Toolbar';t.className='nls-v2-toolbar';t.innerHTML='<button class="nls-v2-filter active" data-filter="all">All</button><button class="nls-v2-filter" data-filter="active">Active</button><button class="nls-v2-filter" data-filter="soon">Expiring Soon</button><button class="nls-v2-filter" data-filter="expired">Expired</button><button class="nls-v2-refresh" id="nlsV2Refresh"><i class="fas fa-rotate"></i> Refresh</button>';
    host.parentNode.insertBefore(t,host);
    t.querySelectorAll('.nls-v2-filter').forEach(function(b){b.addEventListener('click',function(){t.querySelectorAll('.nls-v2-filter').forEach(function(z){z.classList.remove('active')});b.classList.add('active');render(b.dataset.filter);});});
    document.getElementById('nlsV2Refresh').addEventListener('click',function(){window.location.reload();});
  }

  function updateStats(subs){var a=0,e=0;subs.forEach(function(s){if(expired(s))e++;else if(active(s))a++;});var ae=document.getElementById('activeSubscriptionCount'),ee=document.getElementById('expiredSubscriptionCount');if(ae)ae.textContent=a;if(ee)ee.textContent=e;}

  function render(filter){
    var host=document.getElementById('subscriptionsContainer');if(!host)return;var subs=latestSubs.slice();
    var list=subs.filter(function(s){var ex=expired(s),d=days(s);if(filter==='expired')return ex;if(filter==='soon')return !ex&&d!==null&&d<=7;if(filter==='active')return active(s);return true;});
    updateStats(subs);
    if(!list.length){host.innerHTML='<div class="nls-v2-empty"><i class="fas fa-filter"></i><br><br>No subscriptions match this filter.</div>';return;}
    host.innerHTML='<div class="subscription-list">'+list.map(function(s){
      var ex=expired(s),d=days(s),soon=!ex&&d!==null&&d<=7,n=name(s),im=img(s),p=plan(s),st=s.subscription_start||'',pr=s.component_price??s.price;
      var count=ex?'Subscription expired':d===null?'Expiry date not set':d===0?'Expires today':d===1?'1 day remaining':d+' days remaining';
      return '<article class="nls-v2-card '+(ex?'expired':'')+'" tabindex="0" role="button" data-nls-v2-id="'+esc(s.id||'')+'"><div class="nls-v2-accent"></div><div class="nls-v2-body"><div class="nls-v2-head"><div class="nls-v2-product">'+(im?'<img class="nls-v2-img" src="'+esc(im)+'" alt="'+esc(n)+'" loading="lazy" onerror="this.style.display=\'none\'">':'<div class="nls-v2-img nls-v2-fallback"><i class="fas fa-tv"></i></div>')+'<div><h3 class="nls-v2-name">'+esc(n)+'</h3><div class="nls-v2-plan">'+esc(p)+'</div></div></div><span class="status-badge '+(ex?'status-expired':'status-active')+'">'+(ex?'Expired':'Active')+'</span></div><div class="nls-v2-meta"><div><span class="nls-v2-label">Started</span><span class="nls-v2-value">'+date(st)+'</span></div><div><span class="nls-v2-label">Expires</span><span class="nls-v2-value">'+date(expiry(s))+'</span></div></div><div class="nls-v2-count '+(ex?'expired':soon?'soon':'')+'"><span><i class="fas fa-clock"></i> '+esc(count)+'</span><span>'+money(pr)+'</span></div><div class="nls-v2-footer"><span class="nls-v2-view"><i class="fas fa-arrow-right"></i> View details</span>'+(ex?'<a class="nls-v2-renew" href="index.html" onclick="event.stopPropagation()"><i class="fas fa-rotate"></i> Renew</a>':'')+'</div></div></article>';
    }).join('')+'</div>';
    host.querySelectorAll('.nls-v2-card').forEach(function(card){var id=card.dataset.nlsV2Id,s=list.find(function(x){return String(x.id||'')===String(id)});if(!s)return;card.addEventListener('click',function(){window.openSubscriptionModal(s)});card.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();window.openSubscriptionModal(s)}});});
  }

  function wrapRender(){
    if(window.__nlsV2RenderWrapped||typeof window.renderSubscriptions!=='function')return;
    var original=window.renderSubscriptions;
    window.renderSubscriptions=function(subs){latestSubs=Array.isArray(subs)?subs:[];toolbar();render('all');};
    window.__nlsV2RenderWrapped=true;
  }

  function wrapModal(){
    if(window.__nlsV2ModalWrapped||typeof window.openSubscriptionModal!=='function')return;
    var original=window.openSubscriptionModal;
    window.openSubscriptionModal=function(sub){
      var ex=expired(sub);original(sub);if(!ex)return;
      var body=document.getElementById('nlsModalBody');if(!body)return;
      var sections=body.querySelectorAll('.nls-detail-section');
      for(var i=0;i<sections.length;i++){
        var title=sections[i].querySelector('.nls-detail-section-title');
        if(title&&title.textContent.toLowerCase().indexOf('account credentials')!==-1){
          sections[i].innerHTML='<div class="nls-detail-section-title"><i class="fas fa-lock"></i> Account Credentials</div><div style="padding:15px"><div class="nls-v2-lock"><strong><i class="fas fa-shield-halved"></i> Credentials locked</strong><p>This subscription expired on '+esc(date(expiry(sub)))+'. Login credentials are hidden after expiry.</p><a href="index.html"><i class="fas fa-rotate"></i> Renew Subscription</a></div></div>';break;
        }
      }
    };window.__nlsV2ModalWrapped=true;
  }

  function tick(){var filter=(document.querySelector('.nls-v2-filter.active')||{}).dataset?.filter||'all';render(filter);}
  function install(){
    if(installed)return true;
    if(typeof window.renderSubscriptions!=='function'||typeof window.openSubscriptionModal!=='function')return false;
    installed=true;styles();addExpiredStat();wrapRender();wrapModal();
    if(Array.isArray(latestSubs)&&latestSubs.length)render('all');
    countdownTimer=setInterval(tick,60000);return true;
  }
  var tries=0;var timer=setInterval(function(){tries++;wrapRender();wrapModal();if(install()||tries>200)clearInterval(timer);},100);
})();
