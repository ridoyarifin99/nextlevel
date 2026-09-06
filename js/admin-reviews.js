"use strict";
(() => {
  const supabase = window.supabaseClient;
  let status = "all";
  let rows = [];
  const $ = id => document.getElementById(id);
  const esc = v => String(v ?? "").replace(/[&<>\"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#039;"}[c]));
  const stars = n => "★★★★★".split("").map((s,i)=>`<span style="opacity:${i < Number(n) ? 1 : .2}">${s}</span>`).join("");
  const msg = (text, bad=false) => $("msg").innerHTML = `<div class="card" style="color:${bad?'#b91c1c':'#047857'}">${esc(text)}</div>`;

  async function requireAdmin(){
    const {data:{user}} = await supabase.auth.getUser();
    if(!user){ location.href="/login.html?redirect=/admin-reviews.html"; return false; }
    const {data:p,error} = await supabase.from("profiles").select("role").eq("id",user.id).maybeSingle();
    if(error || String(p?.role||'').toLowerCase() !== 'admin'){ document.body.innerHTML='<main class="wrap"><div class="card"><h1>Access denied</h1><p>You must be an administrator to access review moderation.</p><a class="btn" href="/">Back to Store</a></div></main>'; return false; }
    return true;
  }

  async function load(){
    $("list").textContent="Loading reviews…";
    let q=supabase.from("product_reviews").select("id,product_slug,user_id,author_name,rating,review_text,created_at,status,verified_purchase,review_media(id,media_type,public_url,mime_type),review_replies(id,author_name,reply_text,created_at,status)").order("created_at",{ascending:false});
    if(status !== "all") q=q.eq("status",status);
    const {data,error}=await q;
    if(error){msg(error.message,true);return;}
    rows=data||[]; render();
  }

  function render(){
    const counts={all:rows.length,pending:0,approved:0,rejected:0};
    // counts are calculated from a separate full query below; filtered list remains status-scoped.
    $("stats").innerHTML=`<div class="stat"><b>${counts.all}</b>Showing</div><div class="stat"><b>🛡️</b>Moderation</div><div class="stat"><b>📷</b>Media enabled</div><div class="stat"><b>💬</b>Replies enabled</div>`;
    if(!rows.length){$("list").innerHTML='<div class="card">No reviews found for this filter.</div>';return;}
    $("list").innerHTML=rows.map(r=>{const media=(r.review_media||[]).map(m=>m.media_type==='video'?`<video controls src="${esc(m.public_url)}"></video>`:`<img src="${esc(m.public_url)}" alt="Review media">`).join("");const replies=(r.review_replies||[]).map(x=>`<div style="margin-top:8px;padding:9px;background:#f8fafc;border-radius:10px"><b>${esc(x.author_name||'User')}</b> <span class="meta">${esc(x.status||'')}</span><div>${esc(x.reply_text)}</div></div>`).join("");return `<article class="card"><div class="head"><div><b>${esc(r.author_name||'Customer')}</b><div class="meta">${esc(r.product_slug)} · ${new Date(r.created_at).toLocaleString('en-BD')}</div></div><div class="stars">${stars(r.rating)}</div></div><div class="meta" style="margin-top:6px">Status: <b>${esc(r.status||'pending')}</b>${r.verified_purchase?' · ✓ Verified purchase':''}</div><div class="text">${esc(r.review_text||'(media-only review)')}</div>${media?`<div class="media">${media}</div>`:''}<div class="actions">${r.status!=='approved'?`<button class="btn green" data-act="approved" data-id="${r.id}">Approve</button>`:''}${r.status!=='rejected'?`<button class="btn red" data-act="rejected" data-id="${r.id}">Reject</button>`:''}<button class="btn gray" data-delete="${r.id}">Delete</button></div>${replies?`<div style="margin-top:15px"><b>Replies</b>${replies}</div>`:''}</article>`}).join("");
    document.querySelectorAll('[data-act]').forEach(b=>b.onclick=()=>moderate(b.dataset.id,b.dataset.act));
    document.querySelectorAll('[data-delete]').forEach(b=>b.onclick=()=>removeReview(b.dataset.delete));
  }
  async function moderate(id,next){const {error}=await supabase.from('product_reviews').update({status:next}).eq('id',id);if(error)msg(error.message,true);else{msg(`Review ${next}.`);load();}}
  async function removeReview(id){if(!confirm('Delete this review and its replies? This cannot be undone.'))return;const {error}=await supabase.from('product_reviews').delete().eq('id',id);if(error)msg(error.message,true);else{msg('Review deleted.');load();}}
  document.querySelectorAll('.tab').forEach(b=>b.onclick=()=>{document.querySelectorAll('.tab').forEach(x=>x.classList.remove('active'));b.classList.add('active');status=b.dataset.status;load();});
  (async()=>{if(await requireAdmin()) await load();})();
})();
