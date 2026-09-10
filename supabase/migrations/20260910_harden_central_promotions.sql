-- Central promotion hardening applied to production on 2026-09-10.
-- Keeps promo_codes as the single promotion source of truth.

create unique index if not exists promo_codes_code_ci_uidx on public.promo_codes (lower(trim(code)));
create index if not exists promo_codes_product_idx on public.promo_codes(product_id) where product_id is not null;
create index if not exists promo_codes_plan_idx on public.promo_codes(plan_id) where plan_id is not null;
create index if not exists promo_codes_active_dates_idx on public.promo_codes(is_active, starts_at, expires_at);
create index if not exists promo_redemptions_promo_idx on public.promo_redemptions(promo_id, created_at desc);
create index if not exists promo_redemptions_user_idx on public.promo_redemptions(promo_id, user_id, created_at desc);

-- The production database also contains the validated RPC implementations
-- for validate_promo_code() and recalculate_catalog_order_totals().
