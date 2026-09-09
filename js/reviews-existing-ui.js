"use strict";

/* Next Level Subs — existing Reviews tab integration.
 * Editing is intentionally INLINE: the user's original review card becomes the
 * editor. No second/extra review box is created for editing.
 */
(() => {
  const path = window.location.pathname;
  if (!/\/details\.html$/i.test(path) && !/\/product\//i.test(path)) return;
  if (!window.supabaseClient) return;

  const supabase = window.supabaseClient;
  const MAX_FILES = 6;
  const MAX_SIZE = 6 * 1024 * 1024;
  const ALLOWED = new Set(["image/jpeg","image/png","image/webp","image/gif","video/mp4","video/webm","video/quicktime"]);
  const esc = v => String(v ?? "").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/\"/g,"&quot;").replace(/'/g,"&#039;");
  const slugify = v => String(v || "").normalize("NFKD").toLowerCase().trim().replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"");
  const dateText = value => { try { return new Intl.DateTimeFormat("en-BD",{dateStyle:"medium"}).format(new Date(value)); } catch (_) { return ""; } };
  const stars = rating => { const n=Math.max(0,Math.min(5,Number(rating)||0)); return Array.from({length:5},(_,i)=>`<i class="${i<Math.round(n)?"fas":"far"} fa-star"></i>`).join(""); };

  let selectedRating = 0;
  let newFiles = [];
  let editingId = null;
  let reviewsCache = [];
  let initialized = false;
  const objectUrls = new Set();

  function productName() {
    if (window.currentProduct?.name) return window.currentProduct.name;
    const q = new URLSearchParams(location.search).get("name");
    if (q) return q;
    const m = location.pathname.match(/\/product\/([^/?#]+)/i);
    return m ? decodeURIComponent(m[1]) : "";
  }
  const productSlug = () => slugify(productName());
  async function getUser(){ try{return (await supabase.auth.getUser()).data?.user||null;}catch(_){return null;} }

  async function profilesByIds(ids){
    const unique=[...new Set(ids.filter(Boolean))];
    if(!unique.length)return {};
    try{
      const {data}=await supabase.from("profiles").select("id,full_name,avatar_url").in("id",unique);
      return Object.fromEntries((data||[]).map(p=>[p.id,p]));
    }catch(_){return {};}
  }
  async function profile(userId){ const map=await profilesByIds([userId]); return map[userId]||null; }

  async function verifiedPurchase(userId){
    if(!userId||!productSlug())return false;
    try{
      const {data:orders}=await supabase.from("orders").select("id,order_status,payment_status").eq("user_id",userId);
      if(!orders?.length)return false;
      const ids=orders.map(o=>o.id);
      const {data:items}=await supabase.from("order_items").select("order_id,product_slug").in("order_id",ids).eq("product_slug",productSlug());
      return !!items?.some(item=>{const o=orders.find(x=>x.id===item.order_id);const p=String(o?.payment_status||"").toLowerCase();const s=String(o?.order_status||"").toLowerCase();return ["paid","completed","success","successful","verified"].includes(p)||["completed","delivered","processing","active"].includes(s);});
    }catch(_){return false;}
  }

  async function load(){
    const {data,error}=await supabase.from("product_reviews").select("id,product_slug,user_id,author_name,rating,review_text,created_at,updated_at,status,verified_purchase,review_media(id,media_type,public_url,storage_path,mime_type,sort_order,created_at),review_replies(id,review_id,user_id,admin_id,author_name,avatar_url,reply_text,created_at,status,review_media(id,media_type,public_url,storage_path,mime_type,sort_order,created_at))").eq("product_slug",productSlug()).order("created_at",{ascending:false});
    if(error)throw error; return data||[];
  }

  function ensureStyles(){
    if(document.getElementById("nls-existing-review-styles"))return;
    const s=document.createElement("style");s.id="nls-existing-review-styles";s.textContent=`
      .nls-review-card{position:relative;border:1px solid #e9eaf0;border-radius:18px;padding:18px;background:linear-gradient(180deg,#fff 0%,#fcfcff 100%);box-shadow:0 7px 24px rgba(15,23,42,.045);transition:transform .25s ease,box-shadow .25s ease,border-color .25s ease}
      .nls-review-card:hover{transform:translateY(-1px);box-shadow:0 12px 30px rgba(15,23,42,.07);border-color:#e2daf4}
      .nls-review-header-row{display:flex;align-items:flex-start;justify-content:space-between;gap:14px;margin-bottom:13px}
      .nls-review-author{display:flex;align-items:center;gap:11px;min-width:0;flex:1}
      .nls-review-author-info{min-width:0}
      .nls-review-author-name{display:flex;align-items:center;gap:6px;flex-wrap:wrap;line-height:1.25}
      .nls-review-date{flex:0 0 auto;font-size:12px;color:#94a3b8;white-space:nowrap;padding-top:2px}
      .nls-review-avatar{width:44px;height:44px;border-radius:50%;object-fit:cover;display:block;flex:0 0 44px;border:2px solid #fff;box-shadow:0 2px 9px rgba(15,23,42,.12);background:linear-gradient(135deg,#ede9fe,#dbeafe)}
      .nls-review-avatar-fallback{display:flex;align-items:center;justify-content:center;font-weight:800;color:#5b21b6}
      .nls-review-body{font-size:14px;color:#475569;line-height:1.75;overflow-wrap:anywhere}
      .nls-review-actions{display:flex;align-items:center;gap:14px;margin-top:14px;padding-top:12px;border-top:1px solid #f1f3f7}
      .nls-review-action{border:0;background:transparent;padding:4px 0;color:#64748b;font-size:13px;font-weight:700;cursor:pointer;transition:color .2s,transform .2s}
      .nls-review-action:hover{color:#6d28d9;transform:translateY(-1px)}
      .nls-existing-review-form{border:1px solid #e6e8ef;border-radius:16px;padding:18px;background:#fff;margin-top:18px;box-shadow:0 8px 24px rgba(15,23,42,.055)}
      .nls-existing-rating-picker{display:flex;gap:5px;margin:8px 0 14px}.nls-existing-rating-picker button{border:0;background:none;padding:0 2px;font-size:28px;color:#cbd5e1;cursor:pointer;transition:transform .18s ease,color .18s ease}.nls-existing-rating-picker button:hover{transform:scale(1.12)}.nls-existing-rating-picker button.active{color:#f59e0b}
      .nls-existing-review-text{width:100%;min-height:110px;border:1px solid #dbe0e8;border-radius:12px;padding:12px 13px;resize:vertical;box-sizing:border-box;outline:none;font:inherit;transition:.2s}.nls-existing-review-text:focus{border-color:var(--primary-color,#6a11cb);box-shadow:0 0 0 4px rgba(106,17,203,.08)}
      .nls-existing-media-row{display:flex;gap:9px;flex-wrap:wrap;margin:12px 0}.nls-existing-media-preview{position:relative;width:82px;height:82px;border-radius:12px;overflow:hidden;border:1px solid #e4e7ec;background:#f8fafc;box-shadow:0 3px 10px rgba(15,23,42,.06)}.nls-existing-media-preview img,.nls-existing-media-preview video{width:100%;height:100%;object-fit:cover}.nls-existing-media-preview button{position:absolute;right:4px;top:4px;width:23px;height:23px;border:0;border-radius:50%;background:rgba(15,23,42,.78);color:#fff;cursor:pointer;font-size:16px;line-height:22px;padding:0}.nls-existing-media-preview button:hover{background:#dc2626}
      .nls-existing-upload{display:inline-flex;align-items:center;gap:7px;padding:9px 12px;border:1px dashed #bfc7d4;border-radius:10px;cursor:pointer;color:#475569;font-size:13px;font-weight:700;background:#fafbfc;transition:.2s}.nls-existing-upload:hover{border-color:#8b5cf6;color:#6d28d9;background:#faf7ff}.nls-existing-upload input{display:none}
      .nls-existing-error{margin-top:10px;padding:9px 11px;border-radius:10px;background:#fef2f2;color:#b91c1c;font-size:13px}.nls-existing-success{margin-top:10px;padding:9px 11px;border-radius:10px;background:#ecfdf5;color:#047857;font-size:13px}
      .nls-existing-media-grid{display:flex;gap:9px;flex-wrap:wrap;margin-top:12px}.nls-existing-media-grid img,.nls-existing-media-grid video{width:96px;height:78px;object-fit:cover;border-radius:11px;border:1px solid #e5e7eb;cursor:pointer;box-shadow:0 2px 8px rgba(15,23,42,.05);transition:transform .2s ease,box-shadow .2s ease}.nls-existing-media-grid img:hover,.nls-existing-media-grid video:hover{transform:translateY(-2px);box-shadow:0 7px 15px rgba(15,23,42,.12)}
      .nls-existing-verified{display:inline-flex;align-items:center;gap:4px;margin-left:0;font-size:10px;font-weight:800;color:#047857;background:#ecfdf5;padding:3px 7px;border-radius:99px;white-space:nowrap}
      .nls-existing-reply-box{display:flex;gap:8px;margin:14px 0 0;padding-top:12px;border-top:1px solid #f1f3f7}.nls-existing-reply-box input{flex:1;min-width:0;border:1px solid #dbe0e8;border-radius:10px;padding:9px 11px;outline:none}.nls-existing-reply-box input:focus{border-color:#8b5cf6;box-shadow:0 0 0 3px rgba(139,92,246,.08)}.nls-existing-reply-box button{border:0;border-radius:10px;padding:9px 13px;background:#f3e8ff;color:#6d28d9;font-weight:800;cursor:pointer}
      .nls-existing-replies{margin:12px 0 0;padding:0 0 0 14px;border-left:2px solid #ede9fe}.nls-existing-reply{background:#f8fafc;border-radius:11px;padding:10px 12px;margin-top:8px}.nls-existing-reply:first-child{margin-top:0}
      .nls-inline-edit{margin-top:14px;padding-top:14px;border-top:1px solid #eef0f4}.nls-inline-edit-actions{display:flex;gap:8px;flex-wrap:wrap;margin-top:12px}.nls-inline-edit-actions button{transition:.2s}.nls-inline-edit-save{background:linear-gradient(135deg,#6a11cb,#2575fc);color:#fff;border:0;border-radius:10px;padding:9px 15px;font-weight:800}.nls-inline-edit-cancel{background:#fff;color:#475569;border:1px solid #dbe0e8;border-radius:10px;padding:9px 15px;font-weight:700}
      .nls-existing-viewer{position:fixed;inset:0;z-index:10060;background:rgba(15,23,42,.88);backdrop-filter:blur(8px);display:flex;align-items:center;justify-content:center;padding:20px}.nls-existing-viewer img,.nls-existing-viewer video{max-width:94vw;max-height:90vh;border-radius:14px;box-shadow:0 20px 70px rgba(0,0,0,.35)}.nls-existing-viewer button{position:fixed;top:16px;right:16px;width:42px;height:42px;border:0;border-radius:50%;background:#fff;cursor:pointer;font-size:21px}
      @media(max-width:640px){.nls-review-card{padding:15px;border-radius:15px}.nls-review-header-row{gap:8px}.nls-review-date{font-size:11px}.nls-review-avatar{width:40px;height:40px;flex-basis:40px}.nls-review-actions{gap:12px}.nls-existing-reply-box{margin-left:0}.nls-existing-media-grid img,.nls-existing-media-grid video{width:78px;height:64px}.nls-existing-media-preview{width:74px;height:74px}.nls-existing-replies{padding-left:11px}}
      @media(max-width:430px){.nls-review-header-row{flex-direction:column}.nls-review-date{padding-top:0}.nls-review-author{width:100%}.nls-review-author-name{gap:5px}.nls-existing-reply-box{flex-direction:column}.nls-existing-reply-box button{width:100%}}
      @media(prefers-reduced-motion:reduce){.nls-review-card,.nls-existing-rating-picker button,.nls-existing-media-grid img,.nls-existing-media-grid video,.nls-review-action{transition:none}}
    `;document.head.appendChild(s);
  }

  function showMessage(text,error=false,scope=document){ const box=scope.querySelector?.("[data-review-message]")||document.getElementById("nlsExistingFormMessage"); if(box)box.innerHTML=`<div class="${error?"nls-existing-error":"nls-existing-success"}">${esc(text)}</div>`; }
  function cleanupUrls(){ objectUrls.forEach(u=>URL.revokeObjectURL(u));objectUrls.clear(); }
  function clearEdit(){ cleanupUrls();newFiles=[];editingId=null;selectedRating=0; }

  function newFilePreview(files){
    const all=files||[];return all.map((file,i)=>{const url=URL.createObjectURL(file);objectUrls.add(url);const media=file.type.startsWith("video/")?`<video src="${url}" muted></video>`:`<img src="${url}" alt="New review media preview">`;return `<div class="nls-existing-media-preview"><span style="position:absolute;left:5px;bottom:5px;z-index:2;background:rgba(15,23,42,.72);color:#fff;border-radius:6px;padding:2px 5px;font-size:9px;font-weight:700">NEW</span>${media}<button type="button" data-new-remove="${i}" aria-label="Remove new media">×</button></div>`;}).join("");
  }
  function existingEditMedia(media){return (media||[]).slice().sort((a,b)=>Number(a.sort_order||0)-Number(b.sort_order||0)).map(m=>`<div class="nls-existing-media-preview" data-existing-media-id="${esc(m.id)}">${m.media_type==="video"?`<video src="${esc(m.public_url)}" muted preload="metadata"></video>`:`<img src="${esc(m.public_url)}" alt="Your review media">`}<button type="button" data-existing-remove="${esc(m.id)}" aria-label="Remove media">×</button></div>`).join("");}

  function inlineEditor(review){
    editingId=review.id;selectedRating=Number(review.rating)||0;newFiles=[];cleanupUrls();
    const card=document.querySelector(`[data-review-id="${CSS.escape(review.id)}"]`);if(!card)return;
    card.innerHTML=`<div class="flex items-center justify-between gap-3"><div><h4 class="font-semibold text-lg">Edit Your Review</h4><p class="text-xs text-gray-500 mt-1">Update your rating, text, photos or videos right here.</p></div><span class="text-xs text-gray-500">${esc(dateText(review.created_at))}</span></div>
      <div class="nls-inline-edit"><div class="text-sm font-semibold text-gray-700">Your rating</div><div class="nls-existing-rating-picker" data-edit-rating>${[1,2,3,4,5].map(n=>`<button type="button" class="${n<=selectedRating?"active":""}" data-edit-rate="${n}" aria-label="${n} star">★</button>`).join("")}</div>
      <textarea class="nls-existing-review-text" data-edit-text maxlength="2000" placeholder="Share your experience...">${esc(review.review_text)}</textarea>
      <div class="text-sm font-semibold text-gray-700 mt-4">Photos & videos</div>
      <div class="text-xs text-gray-500 mt-1">Remove old media with ×, or add new media below. Maximum 6 total.</div>
      <div class="nls-existing-media-row" data-edit-media>${existingEditMedia(review.review_media)}${newFilePreview(newFiles)}</div>
      <label class="nls-existing-upload"><i class="fas fa-camera"></i> Add photos/videos<input type="file" data-edit-files accept="image/jpeg,image/png,image/webp,image/gif,video/mp4,video/webm,video/quicktime" multiple></label>
      <div class="nls-inline-edit-actions"><button type="button" class="nls-inline-edit-save" data-edit-save>Save Changes</button><button type="button" class="nls-inline-edit-cancel" data-edit-cancel>Cancel</button></div><div data-review-message></div></div>`;
    card.querySelectorAll("[data-edit-rate]").forEach(b=>b.onclick=()=>{selectedRating=Number(b.dataset.editRate);card.querySelectorAll("[data-edit-rate]").forEach(x=>x.classList.toggle("active",Number(x.dataset.editRate)<=selectedRating));});
    card.querySelector("[data-edit-files]")?.addEventListener("change",e=>{const incoming=Array.from(e.target.files||[]);const displayed=card.querySelectorAll("[data-existing-media-id]").length;const bad=incoming.find(f=>!ALLOWED.has(f.type)||f.size>MAX_SIZE);if(bad){showMessage("Each file must be an allowed image/video and 6MB or smaller.",true,card);e.target.value="";return;}if(displayed+newFiles.length+incoming.length>MAX_FILES){showMessage("You can keep up to 6 photos/videos on a review.",true,card);return;}newFiles.push(...incoming);renderInlineNew(card);e.target.value="";});
    card.querySelectorAll("[data-existing-remove]").forEach(b=>b.onclick=()=>removeExistingPreview(card,b.dataset.existingRemove));
    card.querySelector("[data-edit-save]")?.addEventListener("click",()=>saveInlineEdit(review,card));
    card.querySelector("[data-edit-cancel]")?.addEventListener("click",()=>{clearEdit();renderReviews();});
  }
  function renderInlineNew(card){const box=card.querySelector("[data-edit-media]");if(!box)return;box.querySelectorAll("[data-new-preview]").forEach(x=>x.remove());const html=newFilePreview(newFiles);if(html)box.insertAdjacentHTML("beforeend",html);box.querySelectorAll("[data-new-remove]").forEach(b=>b.onclick=()=>{newFiles.splice(Number(b.dataset.newRemove),1);renderInlineNew(card);});}
  function removeExistingPreview(card,id){card.querySelector(`[data-existing-media-id="${CSS.escape(id)}"]`)?.remove();}

  async function deleteMedia(media){
    if(!media?.id)return;
    if(media.storage_path){const {error}=await supabase.storage.from("review-media").remove([media.storage_path]);if(error)throw error;}
    const {error}=await supabase.from("review_media").delete().eq("id",media.id);if(error)throw error;
  }

  async function saveInlineEdit(review,card){
    const user=await getUser();if(!user||user.id!==review.user_id)return;
    const text=card.querySelector("[data-edit-text]")?.value.trim()||"";
    if(!selectedRating){showMessage("Please select a star rating.",true,card);return;}if(!text){showMessage("Please write your review.",true,card);return;}
    const save=card.querySelector("[data-edit-save]");if(save){save.disabled=true;save.textContent="Saving…";}
    try{
      const p=await profile(user.id);const payload={author_name:p?.full_name||user.user_metadata?.full_name||user.email?.split("@")[0]||"Customer",rating:selectedRating,review_text:text,updated_at:new Date().toISOString()};
      const {error}=await supabase.from("product_reviews").update(payload).eq("id",review.id).eq("user_id",user.id);if(error)throw error;
      const keptIds=[...card.querySelectorAll("[data-existing-media-id]")].map(x=>x.dataset.existingMediaId);const original=review.review_media||[];const removed=original.filter(m=>!keptIds.includes(String(m.id)));
      for(const media of removed)await deleteMedia(media);
      const offset=keptIds.length;for(let i=0;i<newFiles.length;i++)await uploadMedia(newFiles[i],review.id,user.id,null,offset+i);
      clearEdit();await renderReviews();
    }catch(error){console.error(error);showMessage(error?.message||"Unable to update your review.",true,card);if(save){save.disabled=false;save.textContent="Save Changes";}}
  }

  async function uploadMedia(file,reviewId,userId,replyId,index){
    const ext=(file.name.split(".").pop()||"bin").toLowerCase();const folder=replyId?`replies/${replyId}`:`reviews/${reviewId}`;const storagePath=`${folder}/${userId}-${Date.now()}-${index}.${ext}`;
    const {error}=await supabase.storage.from("review-media").upload(storagePath,file,{upsert:false,contentType:file.type});if(error)throw error;
    const {data}=supabase.storage.from("review-media").getPublicUrl(storagePath);const row={review_id:reviewId,reply_id:replyId||null,user_id:userId,media_type:file.type.startsWith("video/")?"video":"image",storage_path:storagePath,public_url:data.publicUrl,mime_type:file.type,file_size:file.size,sort_order:index};
    const {error:dbError}=await supabase.from("review_media").insert(row);if(dbError){await supabase.storage.from("review-media").remove([storagePath]).catch(()=>{});throw dbError;}
  }

  function mediaMarkup(media){const list=(media||[]).slice().sort((a,b)=>Number(a.sort_order||0)-Number(b.sort_order||0));if(!list.length)return "";return `<div class="nls-existing-media-grid">${list.map(m=>m.media_type==="video"?`<video src="${esc(m.public_url)}" muted preload="metadata" data-review-media="video" data-src="${esc(m.public_url)}"></video>`:`<img src="${esc(m.public_url)}" alt="Review media" loading="lazy" data-review-media="image" data-src="${esc(m.public_url)}">`).join("")}</div>`;}
  function avatarMarkup(profileData,name){const initial=esc((name||"C").charAt(0).toUpperCase());return profileData?.avatar_url?`<img class="nls-review-avatar" src="${esc(profileData.avatar_url)}" alt="${esc(name||"Customer")}" loading="lazy" onerror="this.outerHTML='<div class=\"nls-review-avatar nls-review-avatar-fallback\">${initial}</div>'">`:`<div class="nls-review-avatar nls-review-avatar-fallback">${initial}</div>`;}
  function replyMarkup(replies,profileMap){const visible=(replies||[]).filter(r=>r.status!=="rejected");if(!visible.length)return "";return `<div class="nls-existing-replies">${visible.map(r=>`<div class="nls-existing-reply"><div class="flex items-center gap-2">${avatarMarkup(profileMap[r.user_id]||{avatar_url:r.avatar_url},r.author_name||"Customer")}<div><strong class="text-sm">${esc(r.author_name||"Customer")}</strong><small class="block text-gray-400">${dateText(r.created_at)}</small></div></div><p class="text-sm text-gray-700 mt-2 whitespace-pre-wrap">${esc(r.reply_text)}</p>${mediaMarkup(r.review_media)}</div>`).join("")}</div>`;}

  async function renderReviews(){
    const tab=document.getElementById("tabContent");if(!tab||!window.currentProduct)return;ensureStyles();
    const user=await getUser();
    try{
      reviewsCache=await load();const ids=[];reviewsCache.forEach(r=>{ids.push(r.user_id);(r.review_replies||[]).forEach(x=>ids.push(x.user_id));});const profileMap=await profilesByIds(ids);
      const visible=reviewsCache.filter(r=>r.status!=="rejected"||r.user_id===user?.id);const total=visible.length;const average=total?visible.reduce((s,r)=>s+Number(r.rating||0),0)/total:Number(window.currentProduct.rating||0);const myReview=user?visible.find(r=>r.user_id===user.id):null;const counts=[5,4,3,2,1].map(n=>visible.filter(r=>Number(r.rating)===n).length);
      const header=`<div class="space-y-6"><div class="flex items-center justify-between gap-3 flex-wrap"><div><h3 class="text-xl font-semibold">Customer Reviews</h3><div class="flex items-center mt-1"><div class="flex text-yellow-400 text-xl">${stars(average)}</div><span class="ml-2 text-gray-600">${total?average.toFixed(1):"No ratings yet"} ${total?`out of 5 (${total} review${total===1?"":"s"})`:""}</span></div></div><button id="nlsWriteReview" class="btn-primary px-4 py-2 rounded-lg">${myReview?"Edit Your Review":"Write a Review"}</button></div><div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-2 text-sm">${[5,4,3,2,1].map((n,i)=>`<div class="flex items-center gap-2"><span>${n}★</span><div class="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden"><div class="h-full bg-yellow-400" style="width:${total?counts[i]/total*100:0}%"></div></div><span class="text-gray-500">${counts[i]}</span></div>`).join("")}</div><div id="nlsExistingComposer"></div></div>`;
      const cards=visible.length?visible.map((r,i)=>`<div class="nls-review-card" data-review-id="${esc(r.id)}" data-aos="fade-up" data-aos-delay="${i*60}"><div class="nls-review-header-row"><div class="nls-review-author">${avatarMarkup(profileMap[r.user_id],r.author_name||"Customer")}<div class="nls-review-author-info"><div class="nls-review-author-name"><h4 class="font-semibold m-0">${esc(r.author_name||"Customer")}</h4>${r.verified_purchase?`<span class="nls-existing-verified"><i class="fas fa-check-circle"></i> Verified Purchase</span>`:""}</div><div class="flex text-yellow-400 text-sm mt-1">${stars(r.rating)}</div></div></div><span class="nls-review-date">${esc(dateText(r.created_at))}</span></div><p class="nls-review-body">${esc(r.review_text)}</p>${mediaMarkup(r.review_media)}<div class="nls-review-actions"><button type="button" class="nls-review-action" data-reply="${esc(r.id)}"><i class="far fa-comment-dots mr-1"></i> Reply</button>${user?.id===r.user_id?`<button type="button" class="nls-review-action" data-edit="${esc(r.id)}"><i class="far fa-pen-to-square mr-1"></i> Edit</button>`:""}</div>${replyMarkup(r.review_replies,profileMap)}<div class="nls-existing-reply-box"><input type="text" maxlength="1000" placeholder="Write a reply…" data-reply-input="${esc(r.id)}"><button type="button" data-send-reply="${esc(r.id)}">Reply</button></div></div>`).join(""):`<div class="text-center py-8"><i class="fas fa-comments text-4xl text-gray-300 mb-4"></i><p class="text-gray-600">No reviews yet. Be the first to review this product!</p></div>`;
      tab.innerHTML=header+`<div class="space-y-4">${cards}</div></div>`;
      document.getElementById("nlsWriteReview")?.addEventListener("click",async()=>{const latest=await getUser();if(!latest){document.getElementById("nlsExistingComposer").innerHTML=`<div class="mt-4 p-4 rounded-lg bg-gray-50 border border-gray-200">Please log in to write a review.</div>`;return;}if(myReview){const card=document.querySelector(`[data-review-id="${CSS.escape(myReview.id)}"]`);if(card)inlineEditor(myReview);return;}renderNewComposer(document.getElementById("nlsExistingComposer"),latest);document.getElementById("nlsExistingComposer")?.scrollIntoView({behavior:"smooth",block:"nearest"});});
      tab.querySelectorAll("[data-edit]").forEach(btn=>btn.onclick=()=>{const review=reviewsCache.find(r=>r.id===btn.dataset.edit);if(review)inlineEditor(review);});
      tab.querySelectorAll("[data-send-reply]").forEach(btn=>btn.onclick=()=>sendReply(btn.dataset.sendReply));tab.querySelectorAll("[data-review-media]").forEach(el=>el.onclick=()=>openViewer(el.dataset.src,el.dataset.reviewMedia));tab.querySelectorAll("[data-reply]").forEach(btn=>btn.onclick=()=>document.querySelector(`[data-reply-input="${CSS.escape(btn.dataset.reply)}"]`)?.focus());
      if(typeof AOS!=="undefined")AOS.refresh();
    }catch(error){console.error("Supabase review error",error);tab.innerHTML=`<div class="text-center py-8"><i class="fas fa-exclamation-circle text-4xl text-red-300 mb-4"></i><p class="text-gray-600">Unable to load reviews right now. Please refresh the page.</p></div>`;}
  }

  function renderNewComposer(container,user){selectedRating=0;newFiles=[];cleanupUrls();container.innerHTML=`<div class="nls-existing-review-form"><div class="flex items-center justify-between gap-3 mb-2"><h4 class="font-semibold">Write a Review</h4><span class="text-xs text-gray-500">${esc(user?.email||"")}</span></div><div class="text-sm text-gray-600">Your rating</div><div class="nls-existing-rating-picker" data-new-rating>${[1,2,3,4,5].map(n=>`<button type="button" data-new-rate="${n}" aria-label="${n} star">★</button>`).join("")}</div><textarea data-new-text class="nls-existing-review-text" maxlength="2000" placeholder="Share your experience..."></textarea><div class="flex flex-wrap items-center gap-2 mt-3"><label class="nls-existing-upload"><i class="fas fa-camera"></i> Add photos/videos<input type="file" data-new-files accept="image/jpeg,image/png,image/webp,image/gif,video/mp4,video/webm,video/quicktime" multiple></label><button type="button" data-new-submit class="btn-primary px-4 py-2 rounded-lg font-semibold">Submit Review</button><button type="button" data-new-cancel class="px-4 py-2 rounded-lg border border-gray-300 font-semibold">Cancel</button></div><div class="nls-existing-media-row" data-new-media></div><div class="text-xs text-gray-500 mt-2">Up to 6 photos/videos, max 6MB each.</div><div data-review-message></div></div>`;
    container.querySelectorAll("[data-new-rate]").forEach(b=>b.onclick=()=>{selectedRating=Number(b.dataset.newRate);container.querySelectorAll("[data-new-rate]").forEach(x=>x.classList.toggle("active",Number(x.dataset.newRate)<=selectedRating));});
    container.querySelector("[data-new-files]")?.addEventListener("change",e=>{const incoming=Array.from(e.target.files||[]);const bad=incoming.find(f=>!ALLOWED.has(f.type)||f.size>MAX_SIZE);if(bad){showMessage("Each file must be an allowed image/video and 6MB or smaller.",true,container);return;}if(newFiles.length+incoming.length>MAX_FILES){showMessage("You can attach up to 6 files.",true,container);return;}newFiles.push(...incoming);const box=container.querySelector("[data-new-media]");box.innerHTML=newFilePreview(newFiles);box.querySelectorAll("[data-new-remove]").forEach(b=>b.onclick=()=>{newFiles.splice(Number(b.dataset.newRemove),1);box.innerHTML=newFilePreview(newFiles);box.querySelectorAll("[data-new-remove]").forEach(x=>{x.onclick=()=>{newFiles.splice(Number(x.dataset.newRemove),1);box.innerHTML=newFilePreview(newFiles);};});});e.target.value="";});
    container.querySelector("[data-new-submit]")?.addEventListener("click",()=>saveNewReview(container));container.querySelector("[data-new-cancel]")?.addEventListener("click",()=>{clearEdit();renderReviews();});
  }
  async function saveNewReview(container){const user=await getUser();if(!user)return;const text=container.querySelector("[data-new-text]")?.value.trim()||"";if(!selectedRating){showMessage("Please select a star rating.",true,container);return;}if(!text){showMessage("Please write your review.",true,container);return;}const btn=container.querySelector("[data-new-submit]");if(btn){btn.disabled=true;btn.textContent="Saving…";}try{const p=await profile(user.id);const verified=await verifiedPurchase(user.id);const {data,error}=await supabase.from("product_reviews").insert({product_slug:productSlug(),user_id:user.id,author_name:p?.full_name||user.user_metadata?.full_name||user.email?.split("@")[0]||"Customer",rating:selectedRating,review_text:text,verified_purchase:verified,status:"approved",updated_at:new Date().toISOString()}).select("id").single();if(error)throw error;for(let i=0;i<newFiles.length;i++)await uploadMedia(newFiles[i],data.id,user.id,null,i);clearEdit();await renderReviews();}catch(error){console.error(error);showMessage(error?.message||"Unable to save your review.",true,container);if(btn){btn.disabled=false;btn.textContent="Submit Review";}}}

  async function sendReply(reviewId){const user=await getUser();if(!user){alert("Please log in to reply.");return;}const input=document.querySelector(`[data-reply-input="${CSS.escape(reviewId)}"]`);const text=input?.value.trim();if(!text)return;const p=await profile(user.id);const {error}=await supabase.from("review_replies").insert({review_id:reviewId,user_id:user.id,author_name:p?.full_name||user.email?.split("@")[0]||"Customer",avatar_url:p?.avatar_url||null,reply_text:text,status:"approved"});if(error){alert(error.message||"Unable to reply.");return;}await renderReviews();}
  function openViewer(src,type){const wrap=document.createElement("div");wrap.className="nls-existing-viewer";wrap.innerHTML=`<button type="button" aria-label="Close">×</button>${type==="video"?`<video src="${esc(src)}" controls autoplay></video>`:`<img src="${esc(src)}" alt="Review media">`}`;wrap.querySelector("button").onclick=()=>wrap.remove();wrap.onclick=e=>{if(e.target===wrap)wrap.remove();};document.body.appendChild(wrap);}
  function install(){if(initialized)return;if(typeof window.switchTab!=="function"){setTimeout(install,50);return;}initialized=true;const original=window.switchTab;window.switchTab=function(tab){if(tab==="reviews")return renderReviews();return original.apply(this,arguments);};}
  const boot=()=>{ensureStyles();install();};if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",boot,{once:true});else boot();
})();
