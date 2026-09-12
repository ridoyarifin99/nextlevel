"use strict";

const SUPABASE_URL = process.env.SUPABASE_URL || "https://zrptkmjdltqdjzrpogyo.supabase.co";
const SUPABASE_KEY = process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_PUBLISHABLE_KEY || "sb_publishable_KcWSkkO1L4z0U6UUfZijyw_KIJ_d5m7";

async function query(table, select, params = {}) {
  const u = new URL(`${SUPABASE_URL}/rest/v1/${table}`);
  u.searchParams.set("select", select);
  Object.entries(params).forEach(([key, value]) => u.searchParams.set(key, String(value)));

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 8000);
  try {
    const r = await fetch(u, {
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
      },
      signal: controller.signal,
    });
    if (!r.ok) throw Error(`${table} request failed (${r.status})`);
    return r.json();
  } finally {
    clearTimeout(timer);
  }
}

async function optionalQuery(table, select, params = []) {
  try {
    return await query(table, select, params);
  } catch (e) {
    console.warn(`Central products API: optional ${table} query unavailable:`, e?.message || e);
    return [];
  }
}

module.exports = async function (req, res) {
  try {
    if (req.method !== "GET" && req.method !== "HEAD") {
      res.statusCode = 405;
      res.setHeader("Allow", "GET, HEAD");
      return res.end("Method Not Allowed");
    }

    /*
     * The products table is the required source for the storefront.
     * Plans/media/categories are enrichments: a slow optional table must
     * never turn the entire homepage catalog into a 500 response.
     */
    const products = await query(
      "products",
      "id,category_id,name,slug,description,image_url,icon,brand_color,currency,price,old_price,is_available,display_order,is_featured,is_archived"
    );

    const availableProducts = (products || [])
      .filter(p => p.is_available === true && p.is_archived !== true);

    const ids = availableProducts.map(p => p.id).filter(Boolean);
    const idFilter = ids.length ? `in.(${ids.join(",")})` : "in.(-1)";

    const [plans, media, categories] = await Promise.all([
      optionalQuery(
        "product_plans",
        "id,product_id,name,duration,price,old_price,currency,is_available,display_order",
        { product_id: idFilter }
      ),
      optionalQuery(
        "product_media",
        "id,product_id,role,url,alt_text,title,service_name,display_order,is_active",
        { product_id: idFilter }
      ),
      optionalQuery(
        "product_categories",
        "id,name,slug"
      ),
    ]);

    const categoriesById = new Map((categories || []).map(c => [c.id, c]));
    const plansByProduct = new Map();
    for (const plan of plans || []) {
      if (!plan?.product_id || plan.is_available === false) continue;
      const list = plansByProduct.get(plan.product_id) || [];
      list.push(plan);
      plansByProduct.set(plan.product_id, list);
    }

    const mediaByProduct = new Map();
    for (const item of media || []) {
      if (!item?.product_id || item.is_active === false) continue;
      const list = mediaByProduct.get(item.product_id) || [];
      list.push(item);
      mediaByProduct.set(item.product_id, list);
    }

    const clean = availableProducts
      .map(p => {
        const productPlans = (plansByProduct.get(p.id) || [])
          .sort((a, b) => (a.display_order || 0) - (b.display_order || 0));
        const productMedia = (mediaByProduct.get(p.id) || [])
          .sort((a, b) => (a.display_order || 0) - (b.display_order || 0));
        const category = categoriesById.get(p.category_id) || null;
        return {
          ...p,
          product_categories: category,
          product_plans: productPlans,
          product_media: productMedia,
        };
      })
      .sort((a, b) => (a.display_order || 0) - (b.display_order || 0))
      .map(p => ({
        ...p,
        url: `/product/${p.slug}`,
        canonicalUrl: `https://www.nextlevelsubs.com/product/${p.slug}`,
        categories: p.product_categories?.slug ? [p.product_categories.slug] : [],
        media: {
          primary: p.product_media.filter(x => x.role === "primary").slice(0, 1),
          logo: p.product_media.filter(x => x.role === "logo").slice(0, 1),
          gallery: p.product_media.filter(x => x.role === "gallery"),
          service: p.product_media.filter(x => x.role === "service"),
        },
      }));

    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.setHeader("Cache-Control", "no-store, max-age=0");
    if (req.method === "HEAD") return res.end();
    res.end(JSON.stringify({ products: clean }));
  } catch (e) {
    console.error("Central products API failed:", e);
    res.statusCode = 500;
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.setHeader("Cache-Control", "no-store, max-age=0");
    res.end(JSON.stringify({ error: "Unable to load product catalog" }));
  }
};
