"use strict";
(() => {
  const db=()=>window.supabaseClient,$=id=>document.getElementById(id);
  const toast=(message,bad=false)=>{const host=$("toast");if(!host)return;const x=document.createElement("div");x.className=`toast ${bad?"error":"success"}`;x.textContent=message;host.appendChild(x);setTimeout(()=>x.remove(),3500)};
  const busy=(on,msg)=>{const box=$("busy"),text=$("busyText");if(box)box.hidden=!on;if(text)text.textContent=msg||"Working…"};
  async function migrate(){
    if(!confirm("Import the existing details.js galleries into the centralized product media library? Existing gallery media will be left unchanged."))return;
    busy(true,"Reading legacy detail media…");
    try{
      const legacyRes=await fetch("/api/legacy-product-media",{cache:"no-store"});if(!legacyRes.ok)throw Error("Legacy media API failed.");
      const legacy=(await legacyRes.json()).products||[];const map=new Map(legacy.map(x=>[String(x.slug).toLowerCase(),x]));
      const {data:products,error}=await db().from("products").select("id,slug,name");if(error)throw error;
      let added=0,skipped=0;
      for(let i=0;i<products.length;i++){
        const p=products[i],old=map.get(String(p.slug).toLowerCase());busy(true,`Migrating ${i+1}/${products.length}: ${p.name}`);if(!old){skipped++;continue}
        const existing=await db().from("product_media").select("id").eq("product_id",p.id).eq("role","gallery");if(existing.error)throw existing.error;if(existing.data?.length){skipped++;continue}
        const rows=(old.images||[]).map((url,index)=>({product_id:p.id,role:"gallery",url,alt_text:`${p.name} ${index+1}`,display_order:index,is_active:true,metadata:{source:"legacy_details_js"}}));
        if(rows.length){const r=await db().from("product_media").insert(rows);if(r.error)throw r.error;added+=rows.length}
      }
      busy(false);toast(`Legacy media migration complete: ${added} gallery images added; ${skipped} products skipped.`);
    }catch(e){busy(false);console.error(e);toast(e?.message||"Legacy media migration failed.",true)}
  }
  function boot(){
    const actions=document.querySelector(".headin .actions");if(!actions||$("migrateLegacyMedia"))return;
    const b=document.createElement("button");b.id="migrateLegacyMedia";b.className="btn";b.textContent="Import Legacy Galleries";b.title="Move existing details.js gallery images into product_media";b.onclick=migrate;actions.insertBefore(b,$("addProduct"));
  }
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",boot,{once:true});else boot();
})();
