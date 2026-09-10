"use strict";
(() => {
  const RAW_URL = "https://raw.githubusercontent.com/ridoyarifin99/nextlevel/1e21a3c73c4c1d7589626906c9b3d1c8a60dc269/js/details.js";
  const db = () => window.supabaseClient;
  const $ = id => document.getElementById(id);
  const uuid = () => (crypto && crypto.randomUUID ? crypto.randomUUID() : ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g,c=>(c^crypto.getRandomValues(new Uint8Array(1))[0]&15>>c/4).toString(16)));
  const slugify = v => String(v || "").toLowerCase().trim().replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"");
  const busy = (on,msg="Working…") => { const b=$("busy"),t=$("busyText"); if(b)b.hidden=!on; if(t)t.textContent=msg; };
  const toast = (message,bad=false) => { const host=$("toast"); if(!host){alert(message);return;} const x=document.createElement("div"); x.className=`toast ${bad?"error":"success"}`; x.textContent=message; host.appendChild(x); setTimeout(()=>x.remove(),5000); };
  const categoryMap = {"popular-streaming":"streaming","best-selling":"streaming","music-streaming":"music","cloud-storage":"cloud-storage",vpn:"vpn-security",aiDesign:"ai-productivity",combo:"bundles-combos",combos:"bundles-combos",education:"education",adult:"adult-entertainment"};
  const canonicalImage = u => String(u||"").replace(/^\.\//, "/");
  const normalizePlan = (x,i) => ({name:x.name||x.duration||`Plan ${i+1}`,duration:x.duration||"Standard",price:Number(x.price||0),old_price:x.old_price==null?null:Number(x.old_price),currency:x.currency==="৳"?"BDT":(x.currency||"BDT"),is_available:x.is_available!==false,display_order:i,features:[],extra_data:{popular:!!x.popular,discount:x.discount||null,legacy_plan:true}});
  async function loadLegacy(){
    const r=await fetch(RAW_URL,{cache:"no-store"});
    if(!r.ok) throw Error(`Could not load legacy details.js (${r.status}).`);
    const src=await r.text();
    const start=src.indexOf("const products =");
    if(start<0) throw Error("Legacy product array was not found.");
    const arrayStart=src.indexOf("[",start);
    const end=src.indexOf("];",arrayStart);
    if(arrayStart<0||end<0) throw Error("Legacy product array could not be parsed.");
    const legacy=new Function(`return ${src.slice(arrayStart,end+1)};`)();
    if(!Array.isArray(legacy)||!legacy.length) throw Error("Legacy details.js did not contain a product catalog.");
    return legacy;
  }
  async function importLegacyDetails(){
    const client=db();
    if(!client) throw Error("Supabase client unavailable.");
    const {data:{user}}=await client.auth.getUser();
    if(!user) throw Error("Sign in first.");
    const a=await client.from("product_admins").select("user_id").eq("user_id",user.id).maybeSingle();
    if(a.error) throw a.error;
    if(!a.data) throw Error("This account is not a product administrator.");
    const legacy=await loadLegacy();
    if(!confirm(`Import ${legacy.length} products from the original details.js into Central Product Management?\n\nThis copies descriptions, all plans/prices, features, FAQ, ratings/review metadata and all gallery images. Existing order history is not changed.`)) return;
    busy(true,"Loading central categories…");
    const cr=await client.from("product_categories").select("id,slug");
    if(cr.error) throw cr.error;
    const cats=Object.fromEntries((cr.data||[]).map(x=>[x.slug,x.id]));
    const results=[];
    for(let i=0;i<legacy.length;i++){
      const p=legacy[i]||{};
      const slug=slugify(p.slug||p.name);
      if(!slug||!p.name) continue;
      const oldCats=Array.isArray(p.categories)?p.categories:[];
      const categorySlug=oldCats.map(x=>categoryMap[x]).find(Boolean)||"other-digital-services";
      const plans=Array.isArray(p.pricing)&&p.pricing.length?p.pricing.map(normalizePlan):[normalizePlan({duration:p.duration,price:p.price,currency:p.currency||"BDT"},0)];
      const basePrice=Number(plans[0]?.price??p.price??0);
      const media=[canonicalImage(p.image),...(Array.isArray(p.images)?p.images.map(canonicalImage):[])].filter(Boolean);
      const extra={...(p.extra_data||{}),legacy_source:"js/details.js",legacy_commit:"1e21a3c73c4c1d7589626906c9b3d1c8a60dc269",legacy_rating:p.rating??null,legacy_review_count:p.reviews??null,legacy_customer_reviews:Array.isArray(p.customerReviews)?p.customerReviews:[],legacy_categories:oldCats,legacy_icon:p.icon||null,legacy_color:p.color||null};
      busy(true,`Migrating ${i+1}/${legacy.length}: ${p.name}`);
      const payload={category_id:cats[categorySlug]||null,name:p.name,slug,description:p.description||"",image_url:media[0]||"",icon:p.icon||"",brand_color:p.color||"",currency:plans[0]?.currency||"BDT",price:basePrice,old_price:null,is_available:true,display_order:i,is_featured:oldCats.includes("best-selling"),badge:null,features:Array.isArray(p.features)?p.features:[],faq:Array.isArray(p.faq)?p.faq:[],keywords:[],seo_title:null,seo_description:null,seo_canonical:`https://www.nextlevelsubs.com/product/${slug}`,services:Array.isArray(p.services)?p.services:[],extra_data:extra,is_archived:false};
      const pr=await client.from("products").upsert(payload,{onConflict:"slug"}).select("id").single();
      if(pr.error) throw pr.error;
      const productId=pr.data.id;
      const existing=await client.from("product_plans").select("id,display_order").eq("product_id",productId).order("display_order");
      if(existing.error) throw existing.error;
      const oldPlans=existing.data||[];
      const rows=plans.map((x,j)=>({...x,product_id:productId,id:oldPlans[j]?.id||uuid()}));
      const keep=rows.map(x=>x.id).filter(Boolean);
      const removable=oldPlans.map(x=>x.id).filter(id=>!keep.includes(id));
      if(removable.length){
        const promo=await client.from("promo_codes").select("plan_id").in("plan_id",removable);
        if(promo.error) throw promo.error;
        const protectedIds=new Set((promo.data||[]).map(x=>x.plan_id));
        const deletable=removable.filter(id=>!protectedIds.has(id));
        if(deletable.length){const d=await client.from("product_plans").delete().in("id",deletable);if(d.error)throw d.error;}
      }
      for(const row of rows){const r=await client.from("product_plans").upsert(row,{onConflict:"id"});if(r.error)throw r.error;}
      const mr=await client.from("product_media").select("id,url,role").eq("product_id",productId);
      if(mr.error) throw mr.error;
      const oldMedia=mr.data||[];
      const desired=media.map((url,j)=>({url,role:j===0?"primary":"gallery",display_order:j,alt_text:p.name,title:p.name,is_active:true,metadata:{source:"legacy_details_migration",legacy_commit:"1e21a3c73c4c1d7589626906c9b3d1c8a60dc269"}}));
      const mediaRows=desired.map((x,j)=>({...x,product_id:productId,id:oldMedia[j]?.id||uuid()}));
      const keepMedia=mediaRows.map(x=>x.id).filter(Boolean);
      const delMedia=oldMedia.map(x=>x.id).filter(id=>!keepMedia.includes(id));
      if(delMedia.length){const d=await client.from("product_media").delete().in("id",delMedia);if(d.error)throw d.error;}
      if(mediaRows.length){const m=await client.from("product_media").upsert(mediaRows,{onConflict:"id"});if(m.error)throw m.error;}
      results.push({name:p.name,plans:plans.length,media:media.length,features:(p.features||[]).length,faq:(p.faq||[]).length});
    }
    busy(false);
    toast(`Legacy details migration complete: ${results.length} products imported into Central Product Management.`);
    window.dispatchEvent(new CustomEvent("nls:catalog-migrated",{detail:results}));
  }
  window.NextLevelLegacyDetailsImport=importLegacyDetails;
  addEventListener("DOMContentLoaded",()=>{
    const b=$("importLegacy");
    if(!b) return;
    b.textContent="Import Details.js Data";
    b.title="One-time migration of the original details.js catalog into Supabase Central Product Management";
    // Capture the click before the legacy admin-products.js onclick handler can run.
    b.addEventListener("click",e=>{
      e.preventDefault();
      e.stopImmediatePropagation();
      importLegacyDetails().catch(err=>{busy(false);toast(err.message||String(err),true);});
    },true);
  });
})();
