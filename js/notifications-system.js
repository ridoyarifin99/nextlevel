(function () {
  "use strict";
  if (window.__NLSNotificationsLoaded) return;
  window.__NLSNotificationsLoaded = true;

  const STYLE_ID = "nls-notification-system-styles";
  const PANEL_ID = "nlsNotificationsPanel";
  let userId = null;
  let channel = null;
  let observer = null;
  let authTimer = null;

  const esc = value => String(value ?? "").replace(/[&<>'\"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'\"':"&quot;"}[c]));
  const icon = type => ({
    order_received:"fa-bag-shopping", payment_submitted:"fa-receipt", payment_status:"fa-credit-card",
    payment_approved:"fa-circle-check", payment_rejected:"fa-circle-exclamation", order_processing:"fa-gears",
    order_delivered:"fa-box-open", order_cancelled:"fa-ban", order_status:"fa-truck-fast", component_status:"fa-box",
    subscription_active:"fa-circle-play", subscription_renewed:"fa-rotate", subscription_expired:"fa-calendar-xmark",
    subscription_status:"fa-id-card", review_reply:"fa-comment-dots"
  }[type] || "fa-bell");

  function injectStyles() {
    if (document.getElementById(STYLE_ID)) return;
    const s = document.createElement("style"); s.id = STYLE_ID;
    s.textContent = `
      #${PANEL_ID}-backdrop{position:fixed;inset:0;background:rgba(15,23,42,.42);backdrop-filter:blur(5px);-webkit-backdrop-filter:blur(5px);opacity:0;visibility:hidden;pointer-events:none;transition:all .25s ease;z-index:119}
      #${PANEL_ID}{position:fixed;top:82px;right:18px;width:min(440px,calc(100vw - 28px));max-height:min(680px,calc(100vh - 110px));display:flex;flex-direction:column;background:rgba(255,255,255,.98);border:1px solid rgba(226,232,240,.9);border-radius:22px;box-shadow:0 25px 80px rgba(15,23,42,.25);overflow:hidden;opacity:0;visibility:hidden;pointer-events:none;transform:translateY(-12px) scale(.97);transition:all .3s cubic-bezier(.16,1,.3,1);z-index:120}
      body.nls-notifications-open #${PANEL_ID}-backdrop{opacity:1;visibility:visible;pointer-events:auto}
      body.nls-notifications-open #${PANEL_ID}{opacity:1;visibility:visible;pointer-events:auto;transform:translateY(0) scale(1)}
      .nls-notif-head{padding:18px 18px 14px;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid #eef2f7;background:linear-gradient(135deg,rgba(106,17,203,.07),rgba(37,117,252,.05))}
      .nls-notif-head h3{margin:0;color:#172033;font-size:1.05rem;font-weight:800}.nls-notif-head p{margin:3px 0 0;color:#64748b;font-size:.72rem}
      .nls-notif-actions{display:flex;gap:6px}.nls-notif-actions button{border:0;background:transparent;color:#64748b;cursor:pointer;border-radius:9px;padding:7px}.nls-notif-actions button:hover{background:#f1f5f9;color:#6a11cb}
      .nls-notif-list{overflow:auto;padding:8px}.nls-notif-item{display:grid;grid-template-columns:40px 1fr;gap:11px;padding:13px 10px;border-radius:15px;transition:.2s;cursor:pointer}.nls-notif-item:hover{background:#f8fafc}.nls-notif-item.unread{background:linear-gradient(135deg,rgba(106,17,203,.07),rgba(37,117,252,.04))}.nls-notif-icon{width:40px;height:40px;border-radius:13px;display:flex;align-items:center;justify-content:center;background:linear-gradient(135deg,#6a11cb,#2575fc);color:#fff;box-shadow:0 7px 18px rgba(106,17,203,.18)}.nls-notif-title{font-size:.84rem;font-weight:800;color:#172033}.nls-notif-message{margin-top:4px;color:#64748b;font-size:.76rem;line-height:1.45}.nls-notif-time{margin-top:6px;color:#94a3b8;font-size:.68rem}.nls-notif-dot{width:7px;height:7px;background:#ef4444;border-radius:50%;display:inline-block;margin-left:5px;vertical-align:middle}.nls-notif-empty{text-align:center;padding:55px 20px;color:#94a3b8}.nls-notif-empty i{font-size:2rem;margin-bottom:10px;color:#cbd5e1}.nls-notif-footer{padding:11px 14px;border-top:1px solid #eef2f7;text-align:center}.nls-notif-footer button{border:0;background:none;color:#6a11cb;font-size:.78rem;font-weight:800;cursor:pointer}
      #nls-desktop-notification-btn{position:relative;display:inline-flex;align-items:center;justify-content:center;width:42px;height:42px;border:0;border-radius:11px;background:transparent;color:#475569;cursor:pointer;transition:.25s;font-size:17px}#nls-desktop-notification-btn:hover{background:rgba(106,17,203,.08);color:#6a11cb;transform:translateY(-1px)}#nls-desktop-notification-btn .nls-desktop-notif-badge{position:absolute;top:3px;right:2px;min-width:16px;height:16px;padding:0 4px;border-radius:99px;background:#ef4444;color:#fff;font-size:8px;font-weight:800;display:none;align-items:center;justify-content:center;border:2px solid #fff}
      @media(max-width:1024px){#${PANEL_ID}{top:auto;bottom:94px;right:8px;left:8px;width:auto;max-height:min(72vh,620px);border-radius:22px;transform:translateY(18px) scale(.98)}body.nls-notifications-open #${PANEL_ID}{transform:translateY(0) scale(1)}#nls-desktop-notification-btn{display:none!important}}
      @media(prefers-reduced-motion:reduce){#${PANEL_ID},#${PANEL_ID}-backdrop{transition-duration:.01ms}}
    `; document.head.appendChild(s);
  }

  function ensurePanel(){
    if(document.getElementById(PANEL_ID)) return;
    const backdrop=document.createElement("div"); backdrop.id=PANEL_ID+"-backdrop";
    const panel=document.createElement("section"); panel.id=PANEL_ID; panel.setAttribute("role","dialog"); panel.setAttribute("aria-label","Notifications");
    panel.innerHTML=`<div class="nls-notif-head"><div><h3>Notifications</h3><p id="nlsNotifSubtitle">Your latest account updates</p></div><div class="nls-notif-actions"><button type="button" id="nlsMarkAllRead" title="Mark all as read"><i class="fa-solid fa-check-double"></i></button><button type="button" id="nlsCloseNotifications" title="Close"><i class="fa-solid fa-xmark"></i></button></div></div><div class="nls-notif-list" id="nlsNotifList"><div class="nls-notif-empty"><i class="fa-regular fa-bell"></i><div>Loading notifications…</div></div></div><div class="nls-notif-footer"><button type="button" id="nlsClearNotifications">Mark all as read</button></div>`;
    document.body.append(backdrop,panel);
    backdrop.addEventListener("click",closePanel); panel.querySelector("#nlsCloseNotifications").addEventListener("click",closePanel);
    panel.querySelector("#nlsMarkAllRead").addEventListener("click",markAllRead); panel.querySelector("#nlsClearNotifications").addEventListener("click",markAllRead);
  }

  function setCount(n){
    const count=Math.max(0,Number(n)||0);
    window.NLSMobileNotifications?.setCount(count);
    const b=document.querySelector(".nls-desktop-notif-badge"); if(b){b.textContent=count>99?"99+":String(count);b.style.display=count?"flex":"none";}
  }

  function formatTime(date){const d=new Date(date),diff=Math.max(0,Date.now()-d.getTime()),m=Math.floor(diff/60000);if(m<1)return "Just now";if(m<60)return `${m}m ago`;const h=Math.floor(m/60);if(h<24)return `${h}h ago`;const days=Math.floor(h/24);if(days<7)return `${days}d ago`;return d.toLocaleDateString(undefined,{day:"numeric",month:"short",year:"numeric"});}

  async function syncExpiry(){
    if(!userId||!window.supabaseClient)return;
    try { await window.supabaseClient.rpc("sync_expired_subscriptions",{p_user_id:userId}); } catch(e) { console.warn("NEXT LEVEL SUBS expiry sync:",e); }
  }

  async function loadNotifications(){
    if(!userId||!window.supabaseClient)return;
    const {data,error}=await window.supabaseClient.from("notifications").select("id,type,title,message,link,metadata,is_read,created_at,event_key").eq("user_id",userId).order("created_at",{ascending:false}).limit(100);
    if(error){console.warn("NEXT LEVEL SUBS notifications:",error);return;}
    /* Defensive client-side dedupe for legacy rows created before event_key existed. */
    const seen=new Set();
    const unique=(data||[]).filter(n=>{const k=n.event_key||`${n.type}|${n.title}|${n.message}|${n.created_at}`;if(seen.has(k))return false;seen.add(k);return true;});
    render(unique);
  }

  function render(items){
    const list=document.getElementById("nlsNotifList"); if(!list)return;
    const unread=items.filter(x=>!x.is_read).length; setCount(unread);
    const sub=document.getElementById("nlsNotifSubtitle"); if(sub)sub.textContent=unread?`${unread} unread notification${unread===1?"":"s"}`:"You're all caught up";
    if(!items.length){list.innerHTML=`<div class="nls-notif-empty"><i class="fa-regular fa-bell"></i><div>No notifications yet</div><small>Orders, payments, subscriptions and review replies will appear here.</small></div>`;return;}
    list.innerHTML=items.map(n=>`<article class="nls-notif-item ${n.is_read?"":"unread"}" data-notification-id="${esc(n.id)}" data-link="${esc(n.link||"")}"><div class="nls-notif-icon"><i class="fa-solid ${icon(n.type)}"></i></div><div><div class="nls-notif-title">${esc(n.title)}${n.is_read?"":"<span class=\"nls-notif-dot\"></span>"}</div><div class="nls-notif-message">${esc(n.message)}</div><div class="nls-notif-time">${formatTime(n.created_at)}</div></div></article>`).join("");
    list.querySelectorAll(".nls-notif-item").forEach(item=>item.addEventListener("click",async()=>{const id=item.dataset.notificationId;await window.supabaseClient.from("notifications").update({is_read:true}).eq("id",id).eq("user_id",userId);const link=item.dataset.link;if(link&&link!=="#")window.location.href=link;else loadNotifications();}));
  }

  async function markAllRead(){if(!userId||!window.supabaseClient)return;await window.supabaseClient.from("notifications").update({is_read:true}).eq("user_id",userId).eq("is_read",false);await loadNotifications();}
  function openPanel(){ensurePanel();document.body.classList.add("nls-notifications-open");loadNotifications();}
  function closePanel(){document.body.classList.remove("nls-notifications-open");}

  function addDesktopButton(){
    if(window.innerWidth<1025||document.getElementById("nls-desktop-notification-btn"))return;
    const cart=document.getElementById("cartBtn"); if(!cart?.parentElement)return;
    const b=document.createElement("button"); b.id="nls-desktop-notification-btn";b.type="button";b.setAttribute("aria-label","Notifications");b.innerHTML='<i class="fa-solid fa-bell"></i><span class="nls-desktop-notif-badge"></span>';b.addEventListener("click",openPanel);cart.parentElement.insertBefore(b,cart);
  }

  function bindMobile(){
    const nav=document.getElementById("nls-mobile-bottom-nav");const b=nav?.querySelector('[data-bn="notifications"]');
    if(!b||b.dataset.notificationsBound==="true"||!userId)return;
    b.dataset.notificationsBound="true"; b.addEventListener("click",e=>{e.preventDefault();openPanel();});
  }

  function subscribe(){
    if(!userId||!window.supabaseClient)return;
    if(channel)window.supabaseClient.removeChannel(channel);
    channel=window.supabaseClient.channel("nls-user-notifications-"+userId)
      .on("postgres_changes",{event:"INSERT",schema:"public",table:"notifications",filter:"user_id=eq."+userId},()=>loadNotifications())
      .on("postgres_changes",{event:"UPDATE",schema:"public",table:"notifications",filter:"user_id=eq."+userId},()=>loadNotifications())
      .subscribe();
  }

  async function auth(){
    try{const {data}=await window.supabaseClient.auth.getUser();userId=data?.user?.id||null;}catch(_){userId=null;}
    if(!userId){setCount(0);if(channel){window.supabaseClient.removeChannel(channel);channel=null;}return;}
    ensurePanel();addDesktopButton();bindMobile();await syncExpiry();await loadNotifications();subscribe();
  }

  function boot(){
    injectStyles();ensurePanel();
    document.addEventListener("click",e=>{if(e.target.closest('a[href="#notifications"]')){e.preventDefault();openPanel();}});
    document.addEventListener("keydown",e=>{if(e.key==="Escape")closePanel();});
    if(observer)observer.disconnect();observer=new MutationObserver(()=>{addDesktopButton();bindMobile();});observer.observe(document.body,{childList:true,subtree:true});
    window.supabaseClient.auth.onAuthStateChange(()=>{clearTimeout(authTimer);authTimer=setTimeout(auth,100);});
    auth();
  }
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",boot,{once:true});else boot();
})();
