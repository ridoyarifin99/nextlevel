"use strict";
(() => {
  const path=window.location.pathname;
  if(!/\/details\.html$/i.test(path)&&!/\/product\//i.test(path))return;
  const db=()=>window.supabaseClient;
  const esc=v=>String(v??"").replace(/[&<>\"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]));
  let busy=false;
  const getUser=async()=>{try{return(await db().auth.getUser()).data?.user||null}catch(_){return null}};
  function injectStyles(){if(document.getElementById("nls-facebook-review-styles"))return;const s=document.createElement("style");s.id="nls-facebook-review-styles";s.textContent=`
    .nls-fb-action{border:0;background:transparent;padding:5px 7px;border-radius:8px;color:#64748b;font-size:12px;font-weight:800;cursor:pointer;transition:background .2s,color .2s,transform .2s;display:inline-flex;align-items:center;gap:5px}.nls-fb-action:hover{background:#f3f4f6;color:#4c1d95}.nls-fb-action.liked{color:#6d28d9;background:#f3e8ff}.nls-fb-action .count{font-size:11px;color:#94a3b8}.nls-fb-reply-actions{display:flex;gap:3px;margin-top:4px}.nls-existing-reply{transition:background .2s}.nls-existing-reply:hover{background:#f1f5f9}.nls-fb-reaction-pop{position:fixed;z-index:10080;padding:8px 11px;border-radius:999px;background:#111827;color:#fff;font-size:11px;box-shadow:0 10px 30px rgba(0,0,0,.2);animation:nlsFbPop .25s ease both}@keyframes nlsFbPop{from{opacity:0;transform:scale(.8) translateY(4px)}to{opacity:1;transform:none}}`;document.head.appendChild(s)}
  async function reactionState(reviewIds,replyIds,userId){
    const out={reviews:{},replies:{}};
    if(reviewIds.length){const {data}=await db().from("review_reactions").select("review_id,user_id").in("review_id",reviewIds);(data||[]).forEach(x=>{const a=out.reviews[x.review_id] ||= {count:0,liked:false};a.count++;if(x.user_id===userId)a.liked=true})}
    if(replyIds.length){const {data}=await db().from("review_reactions").select("reply_id,user_id").in("reply_id",replyIds);(data||[]).forEach(x=>{const a=out.replies[x.reply_id] ||= {count:0,liked:false};a.count++;if(x.user_id===userId)a.liked=true})}
    return out;
  }
  function button(target,type,id,state){const s=state||{count:0,liked:false};return `<button type="button" class="nls-fb-action ${s.liked?"liked":""}" data-fb-like data-fb-type="${type}" data-fb-id="${esc(id)}" aria-label="${s.liked?"Unlike":"Like"}"><i class="${s.liked?"fas":"far"} fa-thumbs-up"></i><span>Like</span>${s.count?`<span class="count">${s.count}</span>`:""}</button>`}
  function reactionToast(x){const el=document.createElement("div");el.className="nls-fb-reaction-pop";el.textContent=x;document.body.appendChild(el);const r=el.getBoundingClientRect();el.style.left=`${Math.max(8,Math.min(innerWidth-r.width-8,innerWidth/2-r.width/2))}px`;el.style.top=`${Math.max(12,innerHeight/2-70)}px`;setTimeout(()=>el.remove(),900)}
  async function toggle(type,id,buttonEl){
    const user=await getUser();if(!user){reactionToast("Please log in to like this comment");return}if(busy)return;busy=true;buttonEl.disabled=true;
    try{
      const column=type==="review"?"review_id":"reply_id";
      const {data:existing,error:qerr}=await db().from("review_reactions").select("id").eq(column,id).eq("user_id",user.id).eq("reaction_type","like").maybeSingle();if(qerr)throw qerr;
      if(existing){const {error}=await db().from("review_reactions").delete().eq("id",existing.id);if(error)throw error}else{const payload={user_id:user.id,reaction_type:"like"};payload[column]=id;const {error}=await db().from("review_reactions").insert(payload);if(error)throw error}
      await decorate();
    }catch(e){console.error(e);reactionToast(e?.message||"Unable to update reaction")}
    finally{busy=false;buttonEl.disabled=false}
  }
  async function decorate(){
    const cards=[...document.querySelectorAll("#tabContent .nls-review-card[data-review-id]")];if(!cards.length)return;
    const reviewIds=cards.map(x=>x.dataset.reviewId),replyEls=[...document.querySelectorAll("#tabContent .nls-existing-reply")];
    const replyIds=[];
    replyEls.forEach((el,i)=>{if(!el.dataset.fbReplyId){const card=el.closest(".nls-review-card"),replies=window.__nlsReviewRepliesByCard?.[card?.dataset.reviewId]||[];const index=[...card.querySelectorAll(".nls-existing-reply")].indexOf(el);if(replies[index]?.id)el.dataset.fbReplyId=replies[index].id}if(el.dataset.fbReplyId)replyIds.push(el.dataset.fbReplyId)});
    const user=await getUser(),state=await reactionState(reviewIds,replyIds,user?.id);
    cards.forEach(card=>{const id=card.dataset.reviewId,actions=card.querySelector(".nls-review-actions");if(!actions)return;let like=actions.querySelector("[data-fb-like]");const html=button("review","review",id,state.reviews[id]);if(like)like.outerHTML=html;else actions.insertAdjacentHTML("afterbegin",html)});
    replyEls.forEach(el=>{const id=el.dataset.fbReplyId;if(!id||el.querySelector("[data-fb-like]"))return;const actions=document.createElement("div");actions.className="nls-fb-reply-actions";actions.innerHTML=button("reply","reply",id,state.replies[id]);el.appendChild(actions)});
    document.querySelectorAll("[data-fb-like]").forEach(btn=>{if(btn.dataset.bound)return;btn.dataset.bound="1";btn.addEventListener("click",()=>toggle(btn.dataset.fbType,btn.dataset.fbId,btn))});
  }
  function install(){
    injectStyles();
    if(typeof window.switchTab!=="function"){setTimeout(install,80);return}
    if(window.switchTab.__nlsFacebook)return;
    const original=window.switchTab;const wrapped=function(tab){const result=original.apply(this,arguments);if(tab==="reviews")setTimeout(decorate,180);return result};wrapped.__nlsFacebook=true;window.switchTab=wrapped;
    const observer=new MutationObserver(()=>{if(document.querySelector("#tabContent .nls-review-card"))setTimeout(decorate,30)});const box=document.getElementById("tabContent");if(box)observer.observe(box,{childList:true,subtree:true});
    setTimeout(()=>{if(document.querySelector("#tabContent .nls-review-card"))decorate()},500);
  }
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",install,{once:true});else install();
})();
