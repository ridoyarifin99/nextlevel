"use strict";

const SUPABASE_URL = process.env.SUPABASE_URL || "https://zrptkmjdltqdjzrpogyo.supabase.co";
const SUPABASE_KEY = process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_PUBLISHABLE_KEY || "sb_publishable_KcWSkkO1L4z0U6UUfZijyw_KIJ_d5m7";

async function query(table, select, params = {}) {
  const u = new URL(`${SUPABASE_URL}/rest/v1/${table}`);
  u.searchParams.set("select", select);
  Object.entries(params).forEach(([key, value]) => u.searchParams.set(key, String(value)));
  const r = await fetch(u, {
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
    },
  });
  if (!r.ok) throw Error(`${table} request failed (${r.status})`);
  return r.json();
}

module.exports = async function (req, res) {
  try {
    if (req.method !== "GET" && req.method !== "HEAD") {
      res.statusCode = 405;
      res.setHeader("Allow", "GET, HEAD");
      return res.end("Method Not Allowed");
    }

    // Avoid the old products -> plans -> media nested join. With a large catalog,
    // that join can multiply rows and intermittently hit Supabase/Vercel timeouts.
    // Fetch each small relation independently and assemble the canonical catalog here.
    const [products, plans, media] = await Promise.all([
      query(
        "products",
        "id,category_id,name,slug,description,image_url,icon,brand_color,currency,price,old_price,is_available,display_order,is_featured,badge,features,faq,keywords,seo_title,seo_description,seo_canonical,services,extra_data,is_archived,product_categories(id,name,slug)"
      ),
      query(
        "product_plans",
        "id,product_id,name,duration,price,old_price,currency,is_available,display_order,features,extra_data"
      ),
      query(
        "product_media",
        "id,product_id,role,url,storage_path,alt_text,title,service_name,display_order,is_active,metadata"
      ),
    ]);

    const plansByProduct = new Map();
    for (const plan of plans || []) {
      if (!plan?.product_id) continue;
      const list = plansByProduct.get(plan.product_id) || [];
      if (plan.is_available !== false) list.push(plan);
      plansByProduct.set(plan.product_id, list);
    }

    const mediaByProduct = new Map();
    for (const item of media || []) {
      if (!item?.product_id || item.is_active === false) continue;
      const list = mediaByProduct.get(item.product_id) || [];
      list.push(item);
      mediaByProduct.set(item.product_id, list);
    }

    const clean = (products || [])
      .filter(p => p.is_available && !p.is_archived)
      .map(p => {
        const productPlans = (plansByProduct.get(p.id) || [])
          .sort((a, b) => (a.display_order || 0) - (b.display_order || 0));
        const productMedia = (mediaByProduct.get(p.id) || [])
          .sort((a, b) => (a.display_order || 0) - (b.display_order || 0));
        return {
          ...p,
          product_plans: productPlans,
          product_media: productMedia,
        };
      })
      .sort((a, b) => (a.display_order || 0) - (b.display_order || 0))
      .map(p => ({
        ...p,
        url: `/product/${p.slug}`,
        canonicalUrl: p.seo_canonical || `https://www.nextlevelsubs.com/product/${p.slug}`,
        categories: p.product_categories ? [p.product_categories.slug] : [],
        media: {
          primary: p.product_media.filter(x => x.role === "primary").slice(0, 1),
          logo: p.product_media.filter(x => x.role === "logo").slice(0, 1),
          gallery: p.product_media.filter(x => x.role === "gallery"),
          service: p.product_media.filter(x => x.role === "service"),
        },
      }));

    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.setHeader("Cache-Control", "public, max-age=60, s-maxage=300, stale-while-revalidate=3600");
    if (req.method === "HEAD") return res.end();
    res.end(JSON.stringify({ products: clean }));
  } catch (e) {
    console.error(e);
    res.statusCode = 500;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ error: "Unable to load product catalog" }));
  }
};
