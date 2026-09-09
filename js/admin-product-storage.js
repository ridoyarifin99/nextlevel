"use strict";
(() => {
  const BUCKET = "product-media";
  const MAX = 10 * 1024 * 1024;
  const TYPES = new Set(["image/jpeg","image/png","image/webp","image/gif","image/svg+xml"]);
  const db = () => window.supabaseClient;
  const $ = id => document.getElementById(id);

  function slugify(v){return String(v||"").toLowerCase().trim().replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"")||"product";}
  function toast(message,bad=false){
    const host=$("toast");
    if(!host){alert(message);return;}
    const x=document.createElement("div");x.className=`toast ${bad?"error":"success"}`;x.textContent=message;host.appendChild(x);setTimeout(()=>x.remove(),3500);
  }

  function install(){
    const image=$("pImage");
    if(!image || image.dataset.storageReady==="1") return;
    image.dataset.storageReady="1";

    const field=image.closest(".field") || image.parentElement;
    const box=document.createElement("div");
    box.className="nls-storage-uploader";
    box.innerHTML=`<div class="nls-storage-row"><label class="nls-storage-button"><i class="fas fa-cloud-arrow-up"></i> Upload to Supabase Storage<input id="pImageFile" type="file" accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"></label><span id="pImageStatus" class="nls-storage-status">Stored images use your Supabase Storage quota.</span></div><img id="pImagePreview" class="nls-storage-preview" alt="Product image preview" hidden>`;
    field.appendChild(box);

    const style=document.createElement("style");
    style.textContent=`.nls-storage-uploader{margin-top:7px}.nls-storage-row{display:flex;align-items:center;gap:8px;flex-wrap:wrap}.nls-storage-button{display:inline-flex;align-items:center;gap:7px;padding:9px 12px;border:1px dashed #a78bfa;border-radius:10px;background:#faf7ff;color:#6d28d9;font-size:12px;font-weight:800;cursor:pointer}.nls-storage-button input{display:none}.nls-storage-status{font-size:10px;color:#6b7280}.nls-storage-preview{margin-top:9px;width:58px;height:58px;object-fit:contain;border:1px solid #e5e7eb;border-radius:10px;background:#fff;padding:5px}`;
    document.head.appendChild(style);

    const file=$("pImageFile"), status=$("pImageStatus"), preview=$("pImagePreview");
    const showPreview=()=>{const url=image.value.trim();if(url){preview.src=url;preview.hidden=false}else preview.hidden=true;};
    image.addEventListener("input",showPreview);showPreview();

    file.addEventListener("change",async()=>{
      const f=file.files?.[0];if(!f)return;
      if(!TYPES.has(f.type)||f.size>MAX){toast("Use a supported image up to 10MB.",true);file.value="";return;}
      const client=db();if(!client){toast("Supabase client is unavailable.",true);return;}
      const slug=slugify($("pSlug")?.value || $("pName")?.value);
      const ext=(f.name.split(".").pop()||"webp").toLowerCase().replace(/[^a-z0-9]/g,"")||"webp";
      const path=`products/${slug}/${Date.now()}-${crypto.randomUUID?.()||Math.random().toString(36).slice(2)}.${ext}`;
      status.textContent="Uploading…";file.disabled=true;
      try{
        const {error}=await client.storage.from(BUCKET).upload(path,f,{upsert:false,contentType:f.type,cacheControl:"31536000"});
        if(error)throw error;
        const {data}=client.storage.from(BUCKET).getPublicUrl(path);
        if(!data?.publicUrl)throw new Error("Could not create the public image URL.");
        image.value=data.publicUrl;image.dispatchEvent(new Event("input",{bubbles:true}));
        status.textContent="Uploaded ✓ — Save Product to use this image.";
        toast("Product image uploaded to Supabase Storage.");
      }catch(e){console.error(e);status.textContent="Upload failed";toast(e?.message||"Image upload failed.",true);}
      finally{file.disabled=false;file.value="";}
    });
  }

  function boot(){
    install();
    const modal=$("productModal");
    if(modal&&!modal.dataset.storageObserver){
      modal.dataset.storageObserver="1";
      new MutationObserver(install).observe(modal,{childList:true,subtree:true});
    }
  }
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",boot,{once:true});else boot();
})();
