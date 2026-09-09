"use strict";
(() => {
  const BUCKET="product-media",MAX=10*1024*1024;
  const db=()=>window.supabaseClient,$=id=>document.getElementById(id);
  const esc=v=>String(v??"").replace(/[&<>\"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]));
  const slugify=v=>String(v||"product").toLowerCase().trim().replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"")||"product";
  const toast=(message,bad=false)=>{const host=$("toast");if(!host)return;const x=document.createElement("div");x.className=`toast ${bad?"error":"success"}`;x.textContent=message;host.appendChild(x);setTimeout(()=>x.remove(),5000)};
  const setProgress=(text)=>{const b=$("nlsMediaMigrationProgress");if(b)b.textContent=text};
  const mimeExt=m=>({"image/jpeg":"jpg","image/png":"png","image/webp":"webp","image/gif":"gif","image/svg+xml":"svg"}[m]||"webp");
  const isStorageUrl=u=>String(u||"").includes("/storage/v1/object/public/product-media/");
  const sourceUrl=u=>{try{return new URL(String(u||""),location.origin).href}catch(_){return""}};
  const cache=new Map();
  async function uploadUrl(url,slug,role,index){
    if(!url||isStorageUrl(url))return{url,storage_path:null,changed:false};
    const source=sourceUrl(url);if(!source)return{url,storage_path:null,changed:false};
    if(cache.has(source))return cache.get(source);
    const promise=(async()=>{
      const res=await fetch(source,{cache:"no-store"});if(!res.ok)throw Error(`Source image returned ${res.status}: ${url}`);
      const blob=await res.blob();if(blob.size>MAX)throw Error(`Image is larger than 10MB: ${url}`);
      const mime=blob.type||"image/webp";if(!mime.startsWith("image/"))throw Error(`Not an image: ${url}`);
      const ext=mimeExt(mime),safeIndex=String(index+1).padStart(2,"0"),path=`products/${slug}/${role}/${safeIndex}.${ext}`;
      const {error}=await db().storage.from(BUCKET).upload(path,blob,{upsert:true,contentType:mime,cacheControl:"31536000"});if(error)throw error;
      const {data}=db().storage.from(BUCKET).getPublicUrl(path);return{url:data.publicUrl,storage_path:path,changed:true};
    })();cache.set(source,promise);return promise;
  }
  async function upsertMedia(productId,rows){
    if(!rows.length)return;
    const {data:existing,error}=await db().from("product_media").select("id,role,display_order,url").eq("product_id",productId).order("display_order");if(error)throw error;
    const used=new Set();
    for(const row of rows){
      const same=(existing||[]).find(x=>!used.has(x.id)&&x.role===row.role&&Number(x.display_order||0)===Number(row.display_order||0));
      const payload={product_id:productId,role:row.role,url:row.url,storage_path:row.storage_path||null,alt_text:row.alt_text||null,title:row.title||null,service_name:row.service_name||null,display_order:Number(row.display_order||0),is_active:true,metadata:{...(row.metadata||{}),source:"supabase_storage_migration"}};
      if(same){used.add(same.id);const r=await db().from("product_media").update(payload).eq("id",same.id);if(r.error)throw r.error}else{const r=await db().from("product_media").insert(payload);if(r.error)throw r.error}
    }
  }
  async function run(){
    if(!confirm("Upload ALL current product images (primary, logos, details galleries and service images) from the website repository into Supabase Storage and update the centralized catalog? This can take a few minutes."))return;
    const button=$("uploadAllProductMedia");if(button)button.disabled=true;cache.clear();
    try{
      const legacyRes=await fetch("/api/legacy-product-media",{cache:"no-store"});if(!legacyRes.ok)throw Error("Could not read legacy product media.");
      const legacy=(await legacyRes.json()).products||[],legacyMap=new Map(legacy.map(x=>[String(x.slug).toLowerCase(),x]));
      const {data:products,error}=await db().from("products").select("id,slug,name,image_url").order("display_order");if(error)throw error;
      let uploaded=0,skipped=0,failed=0;
      for(let i=0;i<products.length;i++){
        const p=products[i],slug=slugify(p.slug||p.name),old=legacyMap.get(String(p.slug).toLowerCase())||{},status=`${i+1}/${products.length} — ${p.name}`;setProgress(`Uploading ${status}`);
        try{
          const {data:existing,error:e}=await db().from("product_media").select("id,role,url,storage_path,alt_text,title,service_name,display_order,is_active,metadata").eq("product_id",p.id).order("role").order("display_order");if(e)throw e;
          const byRole={primary:[],logo:[],gallery:[],service:[]};(existing||[]).forEach(x=>{if(byRole[x.role])byRole[x.role].push(x)});
          const primarySource=byRole.primary[0]?.url||p.image_url||"",logoSource=byRole.logo[0]?.url||p.image_url||"",gallerySources=byRole.gallery.length?byRole.gallery.map(x=>x.url).filter(Boolean):(old.images||[]),serviceSources=byRole.service.length?byRole.service.map(x=>({url:x.url,name:x.service_name,title:x.title,alt:x.alt_text})).filter(x=>x.url):(old.serviceImages||[]);
          const primary=primarySource?await uploadUrl(primarySource,slug,"primary",0):null;
          const logo=logoSource?await uploadUrl(logoSource,slug,"logo",0):null;
          const galleries=[];for(let j=0;j<gallerySources.length;j++){const x=gallerySources[j];galleries.push(await uploadUrl(typeof x==="string"?x:x.url,slug,"gallery",j))}
          const services=[];for(let j=0;j<serviceSources.length;j++){const x=serviceSources[j]||{};services.push({...await uploadUrl(x.url,slug,"service",j),service_name:x.name||x.service_name||"",title:x.title||"",alt_text:x.alt||x.alt_text||p.name})}
          const rows=[];
          if(primary?.url)rows.push({role:"primary",url:primary.url,storage_path:primary.storage_path,alt_text:p.name,display_order:0});
          if(logo?.url)rows.push({role:"logo",url:logo.url,storage_path:logo.storage_path,alt_text:`${p.name} logo`,display_order:0});
          galleries.forEach((x,j)=>x?.url&&rows.push({role:"gallery",url:x.url,storage_path:x.storage_path,alt_text:`${p.name} ${j+1}`,display_order:j}));
          services.forEach((x,j)=>x?.url&&rows.push({role:"service",url:x.url,storage_path:x.storage_path,service_name:x.service_name,title:x.title,alt_text:x.alt_text,display_order:j}));
          await upsertMedia(p.id,rows);
          if(primary?.url&&primary.url!==p.image_url){const r=await db().from("products").update({image_url:primary.url}).eq("id",p.id);if(r.error)throw r.error}
          uploaded+=rows.filter(x=>isStorageUrl(x.url)).length;skipped+=rows.filter(x=>!isStorageUrl(x.url)).length;
        }catch(e){failed++;console.error("Media migration failed for",p.slug,e);toast(`${p.name}: ${e?.message||"migration failed"}`,true)}
      }
      setProgress(`Complete — ${uploaded} media records now use Supabase Storage${failed?`; ${failed} products had errors`:""}.`);toast(`Product media migration complete. ${uploaded} centralized media records are on Supabase Storage.` ,failed>0);
    }catch(e){console.error(e);setProgress("Migration failed.");toast(e?.message||"Product media migration failed.",true)}finally{if(button)button.disabled=false}
  }
  function boot(){
    const actions=document.querySelector(".headin .actions");if(!actions||$("uploadAllProductMedia"))return;
    const button=document.createElement("button");button.id="uploadAllProductMedia";button.className="btn";button.type="button";button.innerHTML='<i class="fas fa-cloud-arrow-up"></i> Upload All Images';button.title="Upload current product media to Supabase Storage";button.onclick=run;
    const status=document.createElement("span");status.id="nlsMediaMigrationProgress";status.style.cssText="display:inline-flex;align-items:center;max-width:320px;color:#64748b;font-size:11px;font-weight:700";actions.insertBefore(button,actions.firstChild);actions.insertBefore(status,button.nextSibling);
  }
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",boot,{once:true});else boot();
})();
