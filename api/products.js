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
      headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` },
      signal: controller.signal,
    });
    if (!r.ok) throw Error(`${table} request failed (${r.status})`);
    return r.json();
  } finally {
    clearTimeout(timer);
  }
}

async function optionalQuery(table, select, params = {}) {
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

    /* Product Central is the complete source for storefront + product detail data. */
    const products = await query(
      "products",
      "id,category_id,name,slug,description,image_url,icon,brand_color,currency,price,old_price,is_available,display_order,is_featured,badge,features,faq,keywords,seo_title,seo_description,seo_canonical,services,extra_data,is_archived"
    );
    const availableProducts = (products || []).filter(p => p.is_available === true && p.is_archived !== true);
    const ids = availableProducts.map(p => p.id).filter(Boolean);
    const idFilter = ids.length ? `in.(${ids.join(",")})` : "in.(-1)";

    const [plans, media, categories] = await Promise.all([
      optionalQuery(
        "product_plans",
        "id,product_id,name,duration,price,old_price,currency,is_available,display_order,features,extra_data",
        { product_id: idFilter }
      ),
      optionalQuery(
        "product_media",
        "id,product_id,role,url,alt_text,title,service_name,display_order,is_active,metadata",
        { product_id: idFilter }
      ),
      optionalQuery("product_categories", "id,name,slug,description,display_order,is_active"),
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
        const productPlans = (plansByProduct.get(p.id) || []).sort((a, b) => (a.display_order || 0) - (b.display_order || 0));
        const productMedia = (mediaByProduct.get(p.id) || []).sort((a, b) => (a.display_order || 0) - (b.display_order || 0));
        const category = categoriesById.get(p.category_id) || null;
        const extra = p.extra_data && typeof p.extra_data === "object" ? p.extra_data : {};
        const configuredCategories = Array.isArray(extra.homepage_categories)
          ? extra.homepage_categories
          : Array.isArray(extra.legacy_categories)
            ? extra.legacy_categories
            : [];
        const categorySlugs = [...new Set([
          category?.slug,
          ...configuredCategories
        ].map(x => String(x || "").trim().toLowerCase()).filter(Boolean))];
        const legacyReviews = Array.isArray(extra.legacy_customer_reviews) ? extra.legacy_customer_reviews : [];
        return {
          ...p,
          product_categories: category,
          product_plans: productPlans,
          product_media: productMedia,
          categories: categorySlugs,
          images: productMedia.filter(x => x.role === "gallery").map(x => x.url).filter(Boolean),
          rating: Number(extra.legacy_rating || 0) || null,
          reviews: Number(extra.legacy_review_count || 0) || 0,
          customerReviews: legacyReviews,
          url: `/product/${p.slug}`,
          canonicalUrl: `https://www.nextlevelsubs.com/product/${p.slug}`,
          media: {
            primary: productMedia.filter(x => x.role === "primary").slice(0, 1),
            logo: productMedia.filter(x => x.role === "logo").slice(0, 1),
            gallery: productMedia.filter(x => x.role === "gallery"),
            service: productMedia.filter(x => x.role === "service"),
          },
        };
      })
      .sort((a, b) => (a.display_order || 0) - (b.display_order || 0));

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
