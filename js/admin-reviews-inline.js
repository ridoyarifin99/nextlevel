"use strict";
(() => {
  const supabase = window.supabaseClient;
  if (!supabase || !/\/admin-orders\.html$/i.test(window.location.pathname)) return;

  const esc = v => String(v ?? "").replace(/[&<>\"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#039;"}[c]));
  const stars = n => "★★★★★".split("").map((s,i)=>`<span style="opacity:${i < Number(n) ? 1 : .18}">${s}</span>`).join("");
  let status = "all", rows = [], allRows = [];

  function inject(){
    if(document.getElementById("adminReviewsInline")) return;
    const style=document.createElement("style");
    style.textContent=`
      .reviews-nav{display:flex;gap:8px;align-items:center;margin-top:18px;flex-wrap:wrap}
      .reviews-nav .btn{position:relative}
      .reviews-nav .active{box-shadow:0 0 0 3px rgba(124,58,237,.12)}
      .review-badge{min-width:20px;height:20px;padding:0 6px;border-radius:999px;background:#ef4444;color:#fff;font-size:10px;display:inline-grid;place-items:center;margin-left:4px}
      #adminReviewsInline{display:none;margin-top:20px}
      #adminReviewsInline.show{display:block}
      .review-stats{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:12px;margin-bottom:14px}
      .review-stat{background:#fff;border:1px solid var(--border);border-radius:14px;padding:14px;box-shadow:var(--shadow)}
      .review-stat small{display:block;color:var(--muted);font-weight:700;font-size:11px}.review-stat b{display:block;font-size:22px;margin-top:5px}
      .review-tabs{display:flex;gap:7px;flex-wrap:wrap;margin-bottom:14px}
      .review-tab{border:1px solid var(--border);background:#fff;border-radius:10px;padding:9px 12px;font-size:12px;font-weight:800;cursor:pointer}.review-tab.active{background:#111827;color:#fff;border-color:#111827}
      .review-list{display:grid;gap:14px}.review-card{background:#fff;border:1px solid var(--border);border-radius:16px;padding:16px;box-shadow:var(--shadow)}
      .review-head{display:flex;justify-content:space-between;gap:12px;align-items:flex-start}.review-meta{color:var(--muted);font-size:11px;margin-top:4px}.review-stars{color:#f59e0b;font-size:16px;letter-spacing:1px}.review-text{margin-top:12px;line-height:1.65;font-size:13px;white-space:pre-wrap}.review-media{display:grid;grid-template-columns:repeat(auto-fill,minmax(130px,1fr));gap:8px;margin-top:12px}.review-media img,.review-media video{width:100%;height:130px;object-fit:cover;border-radius:10px;background:#111827}.review-actions{display:flex;gap:7px;flex-wrap:wrap;margin-top:14px;padding-top:12px;border-top:1px solid var(--border)}
      .review-replies{margin-top:12px;padding:12px;background:#f8fafc;border-radius:12px}.review-reply{padding:8px 0;border-bottom:1px solid #e5e7eb;font-size:12px}.review-reply:last-child{border-bottom:0}.review-status{display:inline-flex;padding:4px 7px;border-radius:999px;font-size:10px;font-weight:800;background:#f3f4f6}.review-status.pending{background:#fff7ed;color:#c2410c}.review-status.approved{background:#f0fdf4;color:#15803d}.review-status.rejected{background:#fef2f2;color:#b91c1c}.review-verified{color:#15803d;font-weight:800}.review-msg{margin-bottom:12px;padding:10px 12px;border-radius:10px;background:#f0fdf4;color:#166534;font-size:12px}.review-msg.error{background:#fef2f2;color:#991b1b}
      @media(max-width:900px){.review-stats{grid-template-columns:repeat(2,1fr)}}
    `;
    document.head.appendChild(style);

    const toolbar=document.querySelector(".toolbar");
    const nav=document.createElement("div"); nav.className="reviews-nav";
    nav.innerHTML=`<button id="reviewsToggle" class="btn btn-secondary"><i class="fas fa-star"></i> Reviews <span id="reviewPendingBadge" class="review-badge">0</span></button>`;
    toolbar?.insertAdjacentElement("afterend",nav);

    const section=document.createElement("section"); section.id="adminReviewsInline";
    section.innerHTML=`<div id="reviewMessage"></div><div class="review-stats"><div class="review-stat"><small>Total Reviews</small><b id="reviewTotal">0</b></div><div class="review-stat"><small>Pending</small><b id="reviewPending">0</b></div><div class="review-stat"><small>Approved</small><b id="reviewApproved">0</b></div><div class="review-stat"><small>Rejected</small><b id="reviewRejected">0</b></div><div class="review-stat"><small>Average Rating</small><b id="reviewAverage">0.0 ★</b></div></div><div class="review-tabs"><button class="review-tab active" data-review-status="all">All</button><button class="review-tab" data-review-status="pending">Pending</button><button class="review-tab" data-review-status="approved">Approved</button><button class="review-tab" data-review-status="rejected">Rejected</button></div><div id="inlineReviewList" class="review-list"></div>`;
    document.querySelector("main.page")?.appendChild(section);

    document.getElementById("reviewsToggle").onclick=()=>{section.classList.toggle("show");if(section.classList.contains("show")) load();};
    section.querySelectorAll("[data-review-status]").forEach(b=>b.onclick=()=>{section.querySelectorAll("[data-review-status]").forEach(x=>x.classList.remove("active"));b.classList.add("active");status=b.dataset.reviewStatus;render();});
  }

  function message(text,error=false){const el=document.getElementById("reviewMessage");if(!el)return;el.innerHTML=`<div class="review-msg${error?' error':''}">${esc(text)}</div>`;setTimeout(()=>{el.innerHTML=""},3500);}

  async function requireAdmin(){
    const {data:{user},error:userError}=await supabase.auth.getUser();
    if(userError || !user){message("Admin authentication is required.",true);return false;}
    const {data:p,error}=await supabase.from("profiles").select("role").eq("id",user.id).maybeSingle();
    if(error || String(p?.role||"").toLowerCase()!=="admin"){message("Access denied: administrator role required.",true);return false;}
    return true;
  }

  async function load(){
    const list=document.getElementById("inlineReviewList"); if(!list)return;
    list.innerHTML='<div class="empty">Loading reviews…</div>';
    if(!(await requireAdmin())) return;
    const {data,error}=await supabase.from("product_reviews").select("id,product_slug,user_id,author_name,rating,review_text,created_at,status,verified_purchase,review_media(id,media_type,public_url,mime_type),review_replies(id,author_name,reply_text,created_at,status)").order("created_at",{ascending:false});
    if(error){message(error.message,true);list.innerHTML='<div class="empty">Could not load reviews.</div>';return;}
    allRows=data||[];
    const counts={total:allRows.length,pending:0,approved:0,rejected:0};
    let ratingTotal=0,ratingCount=0;
    allRows.forEach(r=>{const s=String(r.status||"pending").toLowerCase();if(counts[s]!==undefined)counts[s]++;if(Number(r.rating)>0){ratingTotal+=Number(r.rating);ratingCount++;}});
    document.getElementById("reviewTotal").textContent=counts.total;
    document.getElementById("reviewPending").textContent=counts.pending;
    document.getElementById("reviewApproved").textContent=counts.approved;
    document.getElementById("reviewRejected").textContent=counts.rejected;
    document.getElementById("reviewAverage").textContent=(ratingCount?ratingTotal/ratingCount:0).toFixed(1)+" ★";
    document.getElementById("reviewPendingBadge").textContent=counts.pending;
    rows=allRows;
    render();
  }

  function render(){
    const list=document.getElementById("inlineReviewList");if(!list)return;
    const filtered=status==="all"?rows:rows.filter(r=>String(r.status||"pending").toLowerCase()===status);
    if(!filtered.length){list.innerHTML='<div class="empty">No reviews found for this filter.</div>';return;}
    list.innerHTML=filtered.map(r=>{
      const media=(r.review_media||[]).map(m=>m.media_type==="video"?`<video controls preload="metadata" src="${esc(m.public_url)}"></video>`:`<img loading="lazy" src="${esc(m.public_url)}" alt="Review media">`).join("");
      const replies=(r.review_replies||[]).map(x=>`<div class="review-reply"><b>${esc(x.author_name||"User")}</b> <span class="review-status">${esc(x.status||"approved")}</span><div>${esc(x.reply_text)}</div></div>`).join("");
      const st=String(r.status||"pending").toLowerCase();
      return `<article class="review-card"><div class="review-head"><div><b>${esc(r.author_name||"Customer")}</b><div class="review-meta">${esc(r.product_slug)} · ${esc(new Date(r.created_at).toLocaleString("en-BD"))}</div></div><div class="review-stars">${stars(r.rating)}</div></div><div class="review-meta" style="margin-top:8px"><span class="review-status ${esc(st)}">${esc(st)}</span>${r.verified_purchase?` <span class="review-verified">✓ Verified purchase</span>`:""}</div><div class="review-text">${esc(r.review_text||"(media-only review)")}</div>${media?`<div class="review-media">${media}</div>`:""}${replies?`<div class="review-replies"><b>Replies</b>${replies}</div>`:""}<div class="review-actions">${st!=="approved"?`<button class="btn btn-success" data-review-action="approved" data-review-id="${esc(r.id)}"><i class="fas fa-check"></i> Approve</button>`:""}${st!=="rejected"?`<button class="btn btn-danger" data-review-action="rejected" data-review-id="${esc(r.id)}"><i class="fas fa-ban"></i> Reject</button>`:""}<button class="btn btn-secondary" data-review-delete="${esc(r.id)}"><i class="fas fa-trash"></i> Delete</button></div></article>`;
    }).join("");
    list.querySelectorAll("[data-review-action]").forEach(b=>b.onclick=()=>moderate(b.dataset.reviewId,b.dataset.reviewAction));
    list.querySelectorAll("[data-review-delete]").forEach(b=>b.onclick=()=>removeReview(b.dataset.reviewDelete));
  }

  async function moderate(id,next){
    const {error}=await supabase.from("product_reviews").update({status:next}).eq("id",id);
    if(error)message(error.message,true);else{message(`Review ${next}.`);await load();}
  }
  async function removeReview(id){
    if(!confirm("Delete this review and its replies? This cannot be undone."))return;
    const {error}=await supabase.from("product_reviews").delete().eq("id",id);
    if(error)message(error.message,true);else{message("Review deleted.");await load();}
  }

  function boot(){inject();const toggle=document.getElementById("reviewsToggle");if(toggle) setTimeout(()=>{requireAdmin().catch(()=>{});},0);}
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",boot,{once:true});else boot();
})();
