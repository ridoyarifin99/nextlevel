"use strict";
(() => {
  const BUCKET="product-media",MAX=10*1024*1024;
  const db=()=>window.supabaseClient,$=id=>document.getElementById(id);
  const toast=(message,bad=false)=>{const host=$("toast");if(!host)return;const x=document.createElement("div");x.className=`toast ${bad?"error":"success"}`;x.textContent=message;host.appendChild(x);setTimeout(()=>x.remove(),6000)};
  const setProgress=text=>{const b=$("nlsMediaMigrationProgress");if(b)b.textContent=text};
  const mimeExt=m=>({"image/jpeg":"jpg","image/png":"png","image/webp":"webp","image/gif":"gif","image/svg+xml":"svg"}[m]||"webp");
  const isStorageUrl=u=>String(u||"").includes("/storage/v1/object/public/product-media/");
  const sourceUrl=u=>{try{return new URL(String(u||""),location.origin).href}catch(_){return""}};
  const cache=new Map();
  async function uploadUrl(url,slug,role,index){
    if(!url||isStorageUrl(url))return null;
    const source=sourceUrl(url);if(!source)return null;
    const key=`${source}|${slug}|${role}|${index}`;if(cache.has(key))return cache.get(key);
    const promise=(async()=>{
      const res=await fetch(source,{cache:"no-store"});
      if(!res.ok)throw Error(`Source image returned ${res.status}: ${url}`);
      const blob=await res.blob();if(blob.size>MAX)throw Error(`Image is larger than 10MB: ${url}`);
      const mime=blob.type||"image/webp";if(!mime.startsWith("image/"))throw Error(`Not an image: ${url}`);
      const ext=mimeExt(mime),safeIndex=String(index+1).padStart(2,"0"),path=`products/${slug}/${role}/${safeIndex}.${ext}`;
      const {error}=await db().storage.from(BUCKET).upload(path,blob,{upsert:true,contentType:mime,cacheControl:"31536000"});if(error)throw error;
      const {data}=db().storage.from(BUCKET).getPublicUrl(path);return{url:data.publicUrl,storage_path:path};
    })();cache.set(key,promise);return promise;
  }
  async function listAll(prefix){
    const out=[];async function walk(folder){let offset=0;for(;;){const {data,error}=await db().storage.from(BUCKET).list(folder,{limit:100,offset,sortBy:{column:"name",order:"asc"}});if(error)throw error;const items=data||[];for(const item of items){const name=item?.name;if(!name)continue;const path=folder?`${folder}/${name}`:name;if(item.id)out.push(path);else await walk(path)}if(items.length<100)break;offset+=items.length}}await walk(prefix);return out;
  }
  async function clearProductStorage(slug){const paths=await listAll(`products/${slug}`);for(let i=0;i<paths.length;i+=100){const {error}=await db().storage.from(BUCKET).remove(paths.slice(i,i+100));if(error)throw error}return paths.length}
  async function clearProductRows(productId){const {error}=await db().from("product_media").delete().eq("product_id",productId);if(error)throw error}
  async function insertMedia(productId,rows){if(!rows.length)return;const {error}=await db().from("product_media").insert(rows);if(error)throw error}
  async function safeUpload(url,slug,role,index){try{return await uploadUrl(url,slug,role,index)}catch(e){console.warn(`Media source skipped: ${url}`,e);return null}}
  async function run(){
    if(!confirm("REPAIR all product images? Existing centralized media for each product will be rebuilt from the original website catalog. Previously duplicated primary/logo/gallery records will be removed first."))return;
    const button=$("uploadAllProductMedia");if(button)button.disabled=true;cache.clear();
    try{
      const legacyRes=await fetch("/api/legacy-product-media",{cache:"no-store"});if(!legacyRes.ok)throw Error("Could not read legacy product media.");
      const legacy=(await legacyRes.json()).products||[],legacyMap=new Map(legacy.map(x=>[String(x.slug).toLowerCase(),x]));
      const {data:products,error}=await db().from("products").select("id,slug,name,image_url").order("display_order");if(error)throw error;
      let uploaded=0,failed=0,removedFiles=0;
      for(let i=0;i<products.length;i++){
        const p=products[i],slug=String(p.slug||p.name||"product").toLowerCase().trim().replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"")||"product",old=legacyMap.get(String(p.slug).toLowerCase())||{},status=`${i+1}/${products.length} — ${p.name}`;setProgress(`Repairing ${status}`);
        try{
          // IMPORTANT: never use products.image_url as a migration source because it may already be a bad Storage URL.
          const sourcePrimary=old.image||"",sourceLogo=old.logo||"";
          const gallerySources=Array.isArray(old.images)?old.images.filter(Boolean):[];
          const serviceSources=Array.isArray(old.serviceImages)?old.serviceImages.filter(x=>x?.url):[];
          await clearProductRows(p.id);removedFiles+=await clearProductStorage(slug);
          const rows=[];
          if(sourcePrimary){const primary=await safeUpload(sourcePrimary,slug,"primary",0);if(primary)rows.push({product_id:p.id,role:"primary",url:primary.url,storage_path:primary.storage_path,alt_text:p.name,display_order:0,is_active:true,metadata:{source:"legacy_catalog_repair"}})}
          if(sourceLogo&&sourceLogo!==sourcePrimary){const logo=await safeUpload(sourceLogo,slug,"logo",0);if(logo)rows.push({product_id:p.id,role:"logo",url:logo.url,storage_path:logo.storage_path,alt_text:`${p.name} logo`,display_order:0,is_active:true,metadata:{source:"legacy_catalog_repair"}})}
          for(let j=0;j<gallerySources.length;j++){const u=gallerySources[j];if(u===sourcePrimary||u===sourceLogo)continue;const gallery=await safeUpload(u,slug,"gallery",j);if(gallery)rows.push({product_id:p.id,role:"gallery",url:gallery.url,storage_path:gallery.storage_path,alt_text:`${p.name} ${j+1}`,display_order:j,is_active:true,metadata:{source:"legacy_catalog_repair"}})}
          for(let j=0;j<serviceSources.length;j++){const item=serviceSources[j];if(item.url===sourcePrimary||item.url===sourceLogo)continue;const service=await safeUpload(item.url,slug,"service",j);if(service)rows.push({product_id:p.id,role:"service",url:service.url,storage_path:service.storage_path,service_name:item.name||item.service_name||"",title:item.title||"",alt_text:item.alt||item.alt_text||p.name,display_order:j,is_active:true,metadata:{source:"legacy_catalog_repair"}})}
          await insertMedia(p.id,rows);
          const primaryRow=rows.find(x=>x.role==="primary");if(primaryRow){const r=await db().from("products").update({image_url:primaryRow.url}).eq("id",p.id);if(r.error)throw r.error}
          uploaded+=rows.length;
        }catch(e){failed++;console.error("Media repair failed for",p.slug,e);toast(`${p.name}: ${e?.message||"repair failed"}`,true)}
      }
      setProgress(`Complete — ${uploaded} media records rebuilt, ${removedFiles} old storage files removed${failed?`; ${failed} products need attention`:""}.`);toast(`Product media repair complete. ${uploaded} media records rebuilt${failed?` with ${failed} product errors`:""}.`,failed>0);
    }catch(e){console.error(e);setProgress("Repair failed.");toast(e?.message||"Product media repair failed.",true)}finally{if(button)button.disabled=false}
  }
  function boot(){const actions=document.querySelector(".headin .actions");if(!actions||$("uploadAllProductMedia"))return;const button=document.createElement("button");button.id="uploadAllProductMedia";button.className="btn";button.type="button";button.innerHTML='<i class="fas fa-cloud-arrow-up"></i> Repair & Upload All Images';button.title="Rebuild centralized product media from the original website catalog";button.onclick=run;const status=document.createElement("span");status.id="nlsMediaMigrationProgress";status.style.cssText="display:inline-flex;align-items:center;max-width:360px;color:#64748b;font-size:11px;font-weight:700";actions.insertBefore(button,actions.firstChild);actions.insertBefore(status,button.nextSibling)}
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",boot,{once:true});else boot();
})();
