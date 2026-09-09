"use strict";

(function () {
    if (!/\/admin-orders\.html$/i.test(window.location.pathname)) return;

    const style = document.createElement("style");
    style.dataset.nextlevelAdminOrdersDesign = "true";
    style.textContent = `
        .header { box-shadow: 0 1px 0 rgba(15,23,42,.04), 0 8px 28px rgba(15,23,42,.04); }
        .header-inner { min-height: 82px; }
        .brand { min-width: 0; }
        .brand-icon { flex: 0 0 44px; }
        .brand-title { letter-spacing: -.02em; }
        .header-actions { display:flex; align-items:center; justify-content:flex-end; gap:8px; flex:0 0 auto; }
        .header-actions > a,
        .header-actions > button,
        .header-actions .icon-btn,
        .header-actions .nav-btn {
            box-sizing:border-box; width:42px; min-width:42px; height:42px; min-height:42px;
            margin:0; padding:0; border:1px solid #dbe3f0; border-radius:12px;
            display:inline-flex; align-items:center; justify-content:center; align-self:center;
            flex:0 0 42px; line-height:1; vertical-align:middle; font-size:14px;
        }
        .header-actions .icon-btn,
        .header-actions .nav-btn {
            background:linear-gradient(180deg,#fff,#f8fafc); color:#334155;
            text-decoration:none; box-shadow:0 3px 10px rgba(15,23,42,.04); transition:.18s ease;
        }
        .header-actions .icon-btn:hover,
        .header-actions .nav-btn:hover { transform:translateY(-1px); border-color:#bfdbfe; color:#2563eb; box-shadow:0 7px 18px rgba(37,99,235,.10); }
        .header-actions #adminProductManagementLink { background:linear-gradient(135deg,#2563eb,#4f46e5); border-color:transparent; color:#fff; }
        .header-actions #adminProductManagementLink:hover { color:#fff; box-shadow:0 8px 20px rgba(79,70,229,.22); }
        .header-actions .nav-btn span { display:none; }

        .page { padding-top: 34px; }
        .page-title { display:flex; align-items:flex-end; justify-content:space-between; gap:18px; }
        .page-title h1 { font-size: clamp(30px,4vw,42px); }
        .page-title p { max-width: 700px; }
        .stats { gap: 18px; margin-top: 24px; }
        .stat { position:relative; overflow:hidden; padding:20px; transition:transform .18s ease,box-shadow .18s ease,border-color .18s ease; }
        .stat::after { content:""; position:absolute; width:90px; height:90px; right:-38px; top:-38px; border-radius:50%; background:rgba(37,99,235,.045); }
        .stat:hover { transform:translateY(-2px); box-shadow:0 16px 40px rgba(15,23,42,.09); border-color:#d8e3f3; }
        .stat-icon { position:relative; z-index:1; width:44px; height:44px; }
        .stat-value { letter-spacing:-.025em; }

        .toolbar { align-items:center; padding:14px; gap:9px; position:sticky; top:82px; z-index:40; backdrop-filter:blur(14px); background:rgba(255,255,255,.92); }
        .search input, .select { transition:border-color .18s ease,box-shadow .18s ease; }
        .search input:focus, .select:focus, .field input:focus, .field select:focus, .field textarea:focus { border-color:#93c5fd; box-shadow:0 0 0 3px rgba(59,130,246,.10); }
        .toolbar .btn { min-height:44px; }

        #ordersContainer { gap:20px; }
        .card { border-radius:20px; box-shadow:0 10px 32px rgba(15,23,42,.055); transition:box-shadow .18s ease,border-color .18s ease; }
        .card:hover { border-color:#d8e3f3; box-shadow:0 15px 42px rgba(15,23,42,.075); }
        .order-head { padding:20px 22px; background:linear-gradient(180deg,#fff,#fbfdff); }
        .order-no { font-size:15px; letter-spacing:.01em; }
        .order-body { padding:22px; }
        .info { padding:16px; background:linear-gradient(180deg,#fbfdff,#f8fafc); }
        .info h3 { display:flex; align-items:center; gap:7px; }
        .section-title { display:flex; align-items:center; gap:7px; margin-bottom:11px; }
        .product { border-radius:15px; background:#fff; }
        .product-main { padding:15px; }
        .product-img { width:54px; height:54px; border-radius:12px; padding:5px; }
        .product-name { font-size:14px; }
        .tag { border:1px solid #e5e7eb; background:#f8fafc; }
        .components { padding:0 14px 14px; }
        .component { border-radius:13px; padding:12px; background:linear-gradient(135deg,#f8fbff,#fff); }
        .component-actions .btn { border-radius:9px; }
        .totals { margin-top:20px; }
        .total-box { border:1px solid #e7edf5; background:linear-gradient(180deg,#f8fafc,#f1f5f9); }
        .grand { font-size:19px; }
        .actions .btn { min-height:42px; }

        .modal { padding:14px; }
        .modal-card { width:min(100%,800px); border:1px solid rgba(255,255,255,.6); }
        .modal-head { position:sticky; top:0; z-index:2; background:rgba(255,255,255,.96); backdrop-filter:blur(12px); }
        .modal-foot { position:sticky; bottom:0; z-index:2; background:rgba(255,255,255,.96); backdrop-filter:blur(12px); }
        .field label { letter-spacing:.01em; }
        .hint { border-radius:12px; }

        @media (max-width: 900px) {
            .toolbar { top:0; }
            .page-title { align-items:flex-start; flex-direction:column; }
            .stats { gap:12px; }
        }
        @media (max-width: 680px) {
            .header-inner { min-height:70px; }
            .brand-subtitle { display:none; }
            .brand-title { font-size:13px; }
            .header-actions { gap:6px; }
            .header-actions > a,
            .header-actions > button,
            .header-actions .icon-btn,
            .header-actions .nav-btn { width:42px; min-width:42px; height:42px; min-height:42px; flex-basis:42px; }
            .toolbar { position:relative; padding:11px; }
            .page { padding-top:22px; }
            .order-head { padding:16px; }
            .order-body { padding:14px; }
            .info { padding:13px; }
            .product-main { flex-wrap:wrap; }
            .product-price { margin-left:auto; }
            .component-line { flex-direction:column; }
            .component-actions { width:100%; justify-content:flex-start; }
            .component-actions .btn { flex:1 1 auto; }
            .actions .btn { flex:1 1 100%; }
            .modal { padding:8px; }
            .modal-card { border-radius:16px; max-height:calc(100vh - 16px); }
            .modal-body { padding:14px; }
        }
    `;
    document.head.appendChild(style);
})();
