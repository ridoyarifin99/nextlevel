"use strict";
(() => {
  const db = window.supabaseClient;
  const $ = id => document.getElementById(id);
  const esc = v => String(v ?? "").replace(/[&<>\"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]));
  const slugify = v => String(v || "").toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  const parseJSON = (id, fallback) => { const v = $(id).value.trim(); if (!v) return fallback; try { return JSON.parse(v); } catch { throw new Error(`${id} contains invalid JSON.`); } };
  const money = (v, c = "BDT") => `${c === "BDT" ? "৳" : c + " "}${Number(v || 0).toLocaleString("en-BD", {minimumFractionDigits:2, maximumFractionDigits:2})}`;
  const S = {products: [], categories: [], editing: null};

  const toast = (message, bad = false) => {
    const x = document.createElement("div"); x.className = `toast ${bad ? "error" : "success"}`; x.textContent = message; $("toast").appendChild(x); setTimeout(() => x.remove(), 3500);
  };
  const busy = (on, msg = "Working…") => { $("busy").hidden = !on; $("busyText").textContent = msg; };
  const modal = (id, on) => $(id).classList.toggle("show", on);

  async function admin() {
    const {data:{user}} = await db.auth.getUser();
    if (!user) throw Error("Sign in first.");
    const r = await db.from("product_admins").select("user_id").eq("user_id", user.id).maybeSingle();
    if (r.error) throw r.error;
    if (!r.data) throw Error("This account is not a product administrator.");
  }

  async function categories() {
    const r = await db.from("product_categories").select("*").order("display_order").order("name");
    if (r.error) throw r.error;
    S.categories = r.data || [];
    $("pCategory").innerHTML = S.categories.map(c => `<option value="${c.id}">${esc(c.name)}</option>`).join("");
    $("categoryFilter").innerHTML = '<option value="all">All categories</option>' + S.categories.map(c => `<option value="${c.id}">${esc(c.name)}</option>`).join("");
  }

  async function products() {
    const r = await db.from("products").select("*,product_categories(id,name,slug),product_plans(*),product_media(*)").order("display_order").order("created_at");
    if (r.error) throw r.error;
    S.products = r.data || [];
    render();
    $("statProducts").textContent = S.products.length;
    $("statAvailable").textContent = S.products.filter(p => p.is_available && !p.is_archived).length;
    $("statFeatured").textContent = S.products.filter(p => p.is_featured && !p.is_archived).length;
    $("statPlans").textContent = S.products.reduce((n,p) => n + (p.product_plans?.length || 0), 0);
  }

  function render() {
    const q = $("search").value.toLowerCase(), cat = $("categoryFilter").value, st = $("statusFilter").value;
    const a = S.products.filter(p => {
      const t = `${p.name} ${p.slug} ${p.description || ""} ${p.product_categories?.name || ""}`.toLowerCase();
      if (q && !t.includes(q)) return false;
      if (cat !== "all" && p.category_id !== cat) return false;
      if (st === "available" && (!p.is_available || p.is_archived)) return false;
      if (st === "unavailable" && (p.is_available && !p.is_archived)) return false;
      if (st === "featured" && !p.is_featured) return false;
      return true;
    });
    $("count").textContent = `${a.length} product${a.length === 1 ? "" : "s"}`;
    $("grid").innerHTML = a.length ? a.map(p => {
      const plans = (p.product_plans || []).sort((x,y) => x.display_order - y.display_order);
      const media = (p.product_media || []).filter(x => x.is_active !== false);
      const gallery = media.filter(x => x.role === "gallery").length;
      const service = media.filter(x => x.role === "service").length;
      const primary = media.find(x => x.role === "primary")?.url || p.image_url || "/images/logo.png";
      return `<article class="card"><div class="top"><img src="${esc(primary)}" alt="${esc(p.name)}" onerror="this.src='/images/logo.png'"><div><div class="title"><h3>${esc(p.name)}</h3><span class="pill ${p.is_available && !p.is_archived ? "ok" : "off"}">${p.is_archived ? "Archived" : p.is_available ? "Available" : "Unavailable"}</span></div><div class="meta">${esc(p.product_categories?.name || "Uncategorized")} · /${esc(p.slug)}</div><p>${esc(p.description || "No description")}</p></div></div><div class="prices">${plans.length ? plans.map(x => `${esc(x.duration)}: ${money(x.price,x.currency)}`).join(" · ") : money(p.price,p.currency)}${p.old_price != null ? ` <del>${money(p.old_price,p.currency)}</del>` : ""}</div><div class="tags">${p.is_featured ? '<span>Featured</span>' : ''}${p.badge ? `<span>${esc(p.badge)}</span>` : ''}<span>${plans.length} plans</span><span>${gallery} gallery</span><span>${service} service media</span></div><div class="actions"><button class="btn primary" data-edit="${p.id}">Edit</button><button class="btn" data-copy="${p.id}">Duplicate</button><button class="btn danger" data-del="${p.id}">Delete</button></div></article>`;
    }).join("") : '<div class="empty">No products found.</div>';
  }

  function planRow(p = {}) {
    return `<div class="plan" data-id="${esc(p.id || "")}"><input class="pn" placeholder="Plan name" value="${esc(p.name || "Standard")}"><input class="pd" placeholder="1 month" value="${esc(p.duration || "")}"><input class="pp" type="number" step="0.01" min="0" placeholder="Price" value="${p.price ?? ""}"><input class="po" type="number" step="0.01" min="0" placeholder="Old price" value="${p.old_price ?? ""}"><input class="pc" placeholder="BDT" value="${esc(p.currency || "BDT")}"><label><input class="pa" type="checkbox" ${p.is_available !== false ? "checked" : ""}> Available</label><button type="button" class="remove">×</button></div>`;
  }

  async function openEditor(p = null) {
    S.editing = p;
    $("title").textContent = p ? `Edit: ${p.name}` : "Add Product";
    const set = (id,v) => $(id).value = v ?? "";
    set("pId",p?.id); set("pName",p?.name); set("pSlug",p?.slug); set("pDescription",p?.description); set("pImage",p?.image_url); set("pIcon",p?.icon); set("pColor",p?.brand_color); set("pCurrency",p?.currency || "BDT"); set("pPrice",p?.price ?? 0); set("pOld",p?.old_price); set("pOrder",p?.display_order ?? S.products.length); set("pBadge",p?.badge); set("pSeoTitle",p?.seo_title); set("pSeoDescription",p?.seo_description); set("pCanonical",p?.seo_canonical); set("pKeywords",(p?.keywords || []).join(", "));
    $("pAvailable").checked = p?.is_available !== false; $("pFeatured").checked = !!p?.is_featured; $("pArchived").checked = !!p?.is_archived; $("pCategory").value = p?.category_id || S.categories[0]?.id || "";
    $("pFeatures").value = JSON.stringify(p?.features || [], null, 2); $("pFaq").value = JSON.stringify(p?.faq || [], null, 2); $("pServices").value = JSON.stringify(p?.services || [], null, 2); $("pExtra").value = JSON.stringify(p?.extra_data || {}, null, 2);
    $("plans").innerHTML = (p?.product_plans || []).sort((a,b) => a.display_order - b.display_order).map(planRow).join("");
    modal("productModal", true);
    if (window.NextLevelProductMedia) await window.NextLevelProductMedia.open(p);
  }

  async function save() {
    const name = $("pName").value.trim();
    if (!name) throw Error("Product name is required.");
    const slug = slugify($("pSlug").value || name);
    if (!slug) throw Error("Valid slug required.");
    const payload = {
      category_id: $("pCategory").value || null,
      name, slug,
      description: $("pDescription").value.trim(),
      image_url: $("pImage").value.trim(),
      icon: $("pIcon").value.trim(),
      brand_color: $("pColor").value.trim(),
      currency: $("pCurrency").value.trim() || "BDT",
      price: Number($("pPrice").value || 0),
      old_price: $("pOld").value === "" ? null : Number($("pOld").value),
      is_available: $("pAvailable").checked,
      display_order: Number($("pOrder").value || 0),
      is_featured: $("pFeatured").checked,
      badge: $("pBadge").value.trim() || null,
      features: parseJSON("pFeatures", []),
      faq: parseJSON("pFaq", []),
      keywords: $("pKeywords").value.split(",").map(x => x.trim()).filter(Boolean),
      seo_title: $("pSeoTitle").value.trim() || null,
      seo_description: $("pSeoDescription").value.trim() || null,
      seo_canonical: $("pCanonical").value.trim() || null,
      services: parseJSON("pServices", []),
      extra_data: parseJSON("pExtra", {}),
      is_archived: $("pArchived").checked
    };
    busy(true,"Saving product…");
    let r;
    if (S.editing) {
      r = await db.from("products").update(payload).eq("id", S.editing.id).select("id,slug").single();
      if (r.error) throw r.error;
      if (S.editing.slug !== slug) {
        const alias = await db.from("product_slug_aliases").upsert({product_id:S.editing.id,slug:S.editing.slug},{onConflict:"slug"});
        if (alias.error) throw alias.error;
      }
    } else {
      r = await db.from("products").insert(payload).select("id").single();
      if (r.error) throw r.error;
    }

    const old = (S.editing?.product_plans || []).map(x => x.id).filter(Boolean);
    const rows = [...$("plans").querySelectorAll(".plan")].map((x,i) => ({
      id:x.dataset.id || undefined,
      product_id:r.data.id,
      name:x.querySelector(".pn").value.trim() || "Standard",
      duration:x.querySelector(".pd").value.trim() || "Standard",
      price:Number(x.querySelector(".pp").value || 0),
      old_price:x.querySelector(".po").value === "" ? null : Number(x.querySelector(".po").value),
      currency:x.querySelector(".pc").value.trim() || payload.currency,
      is_available:x.querySelector(".pa").checked,
      display_order:i,
      features:[], extra_data:{}
    }));
    const keep = rows.map(x => x.id).filter(Boolean);
    const del = old.filter(id => !keep.includes(id));
    if (del.length) { const d = await db.from("product_plans").delete().in("id",del); if (d.error) throw d.error; }
    if (rows.length) { const u = await db.from("product_plans").upsert(rows,{onConflict:"id"}); if (u.error) throw u.error; }

    if (window.NextLevelProductMedia) await window.NextLevelProductMedia.save(r.data.id);
    modal("productModal",false);
    await products();
    busy(false);
    toast("Product and media saved as the central source of truth.");
  }

  async function duplicate(id) {
    const p = S.products.find(x => x.id === id); if (!p) return;
    let slug = `${p.slug}-copy`, n = 2; while (S.products.some(x => x.slug === slug)) slug = `${p.slug}-copy-${n++}`;
    const copy = {...p,id:undefined,slug,name:`${p.name} Copy`,display_order:S.products.length,is_featured:false};
    delete copy.product_categories; delete copy.product_plans; delete copy.product_media; delete copy.created_at; delete copy.updated_at;
    const r = await db.from("products").insert(copy).select("id").single(); if (r.error) throw r.error;
    const plans = (p.product_plans || []).map((x,i) => ({product_id:r.data.id,name:x.name,duration:x.duration,price:x.price,old_price:x.old_price,currency:x.currency,is_available:x.is_available,display_order:i,features:x.features||[],extra_data:x.extra_data||{}}));
    if (plans.length) { const q = await db.from("product_plans").insert(plans); if (q.error) throw q.error; }
    const media = (p.product_media || []).filter(x => x.is_active !== false).map(x => ({product_id:r.data.id,role:x.role,url:x.url,storage_path:x.storage_path||null,alt_text:x.alt_text||null,title:x.title||null,service_name:x.service_name||null,display_order:x.display_order||0,is_active:true,metadata:x.metadata||{}}));
    if (media.length) { const m = await db.from("product_media").insert(media); if (m.error) throw m.error; }
    await products(); toast("Product duplicated with its media library.");
  }

  async function remove(id) {
    const p = S.products.find(x => x.id === id); if (!p || !confirm(`Delete “${p.name}”? Historical orders are not changed.`)) return;
    const r = await db.from("products").delete().eq("id",id); if (r.error) throw r.error;
    await products(); toast("Product deleted.");
  }

  async function importLegacy() {
    const a = window.NextLevelSubs?.subscriptions || [];
    if (!a.length) throw Error("Legacy catalog not loaded.");
    if (!confirm(`Import ${a.length} existing products into the database?`)) return;
    const map = {"popular-streaming":"streaming","best-selling":"streaming","music-streaming":"music","cloud-storage":"cloud-storage",vpn:"vpn-security",aiDesign:"ai-productivity",combo:"bundles-combos",education:"education",adult:"adult-entertainment"};
    const cats = Object.fromEntries(S.categories.map(c => [c.slug,c.id]));
    busy(true,"Importing legacy catalog…");
    for (let i=0;i<a.length;i++) {
      const p=a[i], old=p.categories||[], cs=map[old.find(x=>map[x])]||"other-digital-services";
      const pay={category_id:cats[cs]||null,name:p.name,slug:slugify(p.slug||p.name),description:p.description||"",image_url:p.image||"",icon:p.icon||"",brand_color:p.color||"",currency:"BDT",price:Number(p.price||0),old_price:null,is_available:true,display_order:i,is_featured:old.includes("best-selling"),badge:null,features:p.features||[],faq:p.faq||[],keywords:[],seo_title:null,seo_description:null,seo_canonical:null,services:p.services||[],extra_data:{legacy_categories:old,service_icons:p.serviceIcons||[],service_colors:p.serviceColors||[]},is_archived:false};
      const r=await db.from("products").upsert(pay,{onConflict:"slug"}).select("id").single(); if(r.error) throw r.error;
      const ex=await db.from("product_plans").select("id").eq("product_id",r.data.id).limit(1); if(ex.error) throw ex.error;
      if(!ex.data?.length){const q=await db.from("product_plans").insert({product_id:r.data.id,name:"Standard",duration:p.duration||"Standard",price:Number(p.price||0),currency:"BDT",is_available:true,display_order:0,features:[],extra_data:{}});if(q.error)throw q.error;}
      const pm=await db.from("product_media").select("id").eq("product_id",r.data.id).eq("role","primary").limit(1); if(pm.error) throw pm.error;
      if(!pm.data?.length && p.image){const q=await db.from("product_media").insert({product_id:r.data.id,role:"primary",url:p.image,alt_text:p.name,display_order:0,metadata:{source:"legacy_import"}});if(q.error)throw q.error;}
      busy(true,`Importing ${i+1}/${a.length}: ${p.name}`);
    }
    await products(); busy(false); toast("Legacy catalog imported.");
  }

  function catList(){ $("categoryList").innerHTML=S.categories.map(c=>`<div class="cat"><div><b>${esc(c.name)}</b><small>${esc(c.slug)}</small></div><div><button class="btn" data-ce="${c.id}">Edit</button><button class="btn danger" data-cd="${c.id}">Delete</button></div></div>`).join(""); }
  function catOpen(c={}){ $("cId").value=c.id||""; $("cName").value=c.name||""; $("cSlug").value=c.slug||""; $("cDesc").value=c.description||""; $("cOrder").value=c.display_order??0; $("cActive").checked=c.is_active!==false; modal("categoryModal",true); }
  async function catSave(){ const name=$("cName").value.trim(); if(!name)throw Error("Category name required."); const p={name,slug:slugify($("cSlug").value||name),description:$("cDesc").value.trim(),display_order:Number($("cOrder").value||0),is_active:$("cActive").checked}; const id=$("cId").value, r=id?await db.from("product_categories").update(p).eq("id",id):await db.from("product_categories").insert(p); if(r.error)throw r.error; modal("categoryModal",false); await categories(); catList(); toast("Category saved."); }

  async function init(){
    if(!db)throw Error("Supabase client unavailable.");
    await admin(); await categories(); await products();
    $("loading").hidden=true; $("app").hidden=false;
    ["search","categoryFilter","statusFilter"].forEach(id=>$(id).addEventListener("input",render));
    $("addProduct").onclick=()=>openEditor().catch(e=>toast(e.message,true));
    $("importLegacy").onclick=()=>importLegacy().catch(e=>{busy(false);toast(e.message,true)});
    $("refresh").onclick=async()=>{await categories();await products();toast("Catalog refreshed.");};
    $("manageCategories").onclick=()=>{catList();modal("categoryModal",true);};
    $("newCategory").onclick=()=>catOpen();
    $("saveCategory").onclick=()=>catSave().catch(e=>toast(e.message,true));
    $("saveProduct").onclick=()=>save().catch(e=>{busy(false);toast(e.message,true)});
    $("addPlan").onclick=()=>$("plans").insertAdjacentHTML("beforeend",planRow());
    $("plans").onclick=e=>{if(e.target.closest(".remove"))e.target.closest(".plan").remove();};
    $("grid").onclick=e=>{const b=e.target.closest("button");if(!b)return;(async()=>{if(b.dataset.edit)await openEditor(S.products.find(p=>p.id===b.dataset.edit));if(b.dataset.copy)await duplicate(b.dataset.copy);if(b.dataset.del)await remove(b.dataset.del);})().catch(x=>toast(x.message,true));};
    $("categoryList").onclick=e=>{const b=e.target.closest("button");if(!b)return;if(b.dataset.ce)catOpen(S.categories.find(c=>c.id===b.dataset.ce));if(b.dataset.cd){const c=S.categories.find(x=>x.id===b.dataset.cd);if(c&&confirm(`Delete ${c.name}? Products become uncategorized.`))db.from("product_categories").delete().eq("id",c.id).then(()=>categories().then(catList)).catch(x=>toast(x.message,true));}};
    document.addEventListener("click",e=>{const b=e.target.closest("[data-close]");if(b)modal(b.dataset.close,false);if(e.target.classList.contains("modal"))modal(e.target.id,false);});
  }
  addEventListener("DOMContentLoaded",()=>init().catch(e=>{$("loading").innerHTML=`<div class="error"><h2>Product manager unavailable</h2><p>${esc(e.message||e)}</p><p>Run <b>supabase/product-management.sql</b> and ensure your user is in <b>product_admins</b>.</p></div>`;}));
})();
