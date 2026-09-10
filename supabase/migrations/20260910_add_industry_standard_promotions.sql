create table if not exists public.promo_codes (
  id uuid primary key default gen_random_uuid(),
  code text not null,
  description text,
  discount_type text not null check (discount_type in ('percentage','fixed')),
  discount_value numeric(12,2) not null check (discount_value >= 0),
  max_discount numeric(12,2),
  min_subtotal numeric(12,2) not null default 0 check (min_subtotal >= 0),
  product_id uuid references public.products(id) on delete cascade,
  plan_id uuid references public.product_plans(id) on delete cascade,
  starts_at timestamptz,
  expires_at timestamptz,
  usage_limit integer check (usage_limit is null or usage_limit > 0),
  per_user_limit integer check (per_user_limit is null or per_user_limit > 0),
  first_order_only boolean not null default false,
  is_active boolean not null default true,
  priority integer not null default 0,
  metadata jsonb not null default '{}'::jsonb,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (max_discount is null or max_discount >= 0),
  check (expires_at is null or starts_at is null or expires_at > starts_at),
  check (discount_type <> 'percentage' or discount_value <= 100),
  check (plan_id is null or product_id is not null)
);

create table if not exists public.promo_redemptions (
  id uuid primary key default gen_random_uuid(),
  promo_id uuid not null references public.promo_codes(id) on delete restrict,
  order_id uuid not null unique references public.orders(id) on delete restrict,
  user_id uuid references auth.users(id) on delete set null,
  code text not null,
  discount_amount numeric(12,2) not null default 0,
  subtotal numeric(12,2) not null default 0,
  created_at timestamptz not null default now()
);

create unique index if not exists promo_codes_code_lower_idx on public.promo_codes(lower(code));
create index if not exists promo_codes_product_idx on public.promo_codes(product_id, plan_id, is_active);
create index if not exists promo_codes_window_idx on public.promo_codes(starts_at, expires_at, is_active);
create index if not exists promo_redemptions_promo_idx on public.promo_redemptions(promo_id, created_at);
create index if not exists promo_redemptions_user_idx on public.promo_redemptions(user_id, promo_id, created_at);

create or replace function public.touch_promo_updated_at() returns trigger language plpgsql as $$ begin new.updated_at=now(); return new; end; $$;
drop trigger if exists promo_codes_updated_at on public.promo_codes;
create trigger promo_codes_updated_at before update on public.promo_codes for each row execute function public.touch_promo_updated_at();

alter table public.promo_codes enable row level security;
alter table public.promo_redemptions enable row level security;
revoke select on public.promo_codes from anon;
grant select on public.promo_codes to authenticated;
grant insert, update, delete on public.promo_codes to authenticated;
grant select on public.promo_redemptions to authenticated;

create policy promo_codes_public_read on public.promo_codes for select to authenticated using (is_active=true and (starts_at is null or starts_at <= now()) and (expires_at is null or expires_at > now()));
create policy promo_codes_admin_read on public.promo_codes for select to authenticated using (exists(select 1 from public.product_admins a where a.user_id=auth.uid()));
create policy promo_codes_admin_insert on public.promo_codes for insert to authenticated with check (exists(select 1 from public.product_admins a where a.user_id=auth.uid()));
create policy promo_codes_admin_update on public.promo_codes for update to authenticated using (exists(select 1 from public.product_admins a where a.user_id=auth.uid())) with check (exists(select 1 from public.product_admins a where a.user_id=auth.uid()));
create policy promo_codes_admin_delete on public.promo_codes for delete to authenticated using (exists(select 1 from public.product_admins a where a.user_id=auth.uid()));
create policy promo_redemptions_user_read on public.promo_redemptions for select to authenticated using (user_id=auth.uid());
create policy promo_redemptions_admin_read on public.promo_redemptions for select to authenticated using (exists(select 1 from public.product_admins a where a.user_id=auth.uid()));

create or replace function public.validate_promo_code(p_code text,p_subtotal numeric,p_product_id uuid default null,p_plan_id uuid default null)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare v_promo public.promo_codes; v_user uuid:=auth.uid(); v_discount numeric(12,2):=0; v_used integer:=0; v_has_order boolean:=false;
begin
 if nullif(trim(p_code),'') is null then return jsonb_build_object('valid',false,'message','Promo code is required.'); end if;
 select * into v_promo from public.promo_codes where lower(code)=lower(trim(p_code)) and is_active=true and (starts_at is null or starts_at<=now()) and (expires_at is null or expires_at>now()) order by priority desc,created_at desc limit 1;
 if v_promo.id is null then return jsonb_build_object('valid',false,'message','Invalid or expired promo code.'); end if;
 if coalesce(p_subtotal,0)<coalesce(v_promo.min_subtotal,0) then return jsonb_build_object('valid',false,'message',format('Minimum order subtotal is %s.',v_promo.min_subtotal)); end if;
 if v_promo.product_id is not null and v_promo.product_id<>p_product_id then return jsonb_build_object('valid',false,'message','This promo code does not apply to the selected product.'); end if;
 if v_promo.plan_id is not null and v_promo.plan_id<>p_plan_id then return jsonb_build_object('valid',false,'message','This promo code does not apply to the selected plan.'); end if;
 if v_promo.usage_limit is not null then select count(*) into v_used from public.promo_redemptions where promo_id=v_promo.id; if v_used>=v_promo.usage_limit then return jsonb_build_object('valid',false,'message','This promo code has reached its usage limit.'); end if; end if;
 if v_user is not null and v_promo.per_user_limit is not null then select count(*) into v_used from public.promo_redemptions where promo_id=v_promo.id and user_id=v_user; if v_used>=v_promo.per_user_limit then return jsonb_build_object('valid',false,'message','You have already used this promo code the maximum number of times.'); end if; end if;
 if v_promo.first_order_only then if v_user is null then return jsonb_build_object('valid',false,'message','Sign in to use this first-order promo.'); end if; select exists(select 1 from public.orders where user_id=v_user and order_status<>'cancelled') into v_has_order; if v_has_order then return jsonb_build_object('valid',false,'message','This promo is available only on your first order.'); end if; end if;
 if v_promo.discount_type='percentage' then v_discount:=round(coalesce(p_subtotal,0)*v_promo.discount_value/100,2); if v_promo.max_discount is not null then v_discount:=least(v_discount,v_promo.max_discount); end if; else v_discount:=v_promo.discount_value; end if;
 v_discount:=greatest(0,least(v_discount,coalesce(p_subtotal,0)));
 return jsonb_build_object('valid',true,'promo_id',v_promo.id,'code',v_promo.code,'discount_type',v_promo.discount_type,'discount_value',v_promo.discount_value,'discount_amount',v_discount,'message','Promo code applied.');
end;$$;
revoke execute on function public.validate_promo_code(text,numeric,uuid,uuid) from public;
grant execute on function public.validate_promo_code(text,numeric,uuid,uuid) to anon,authenticated;

create or replace function public.recalculate_catalog_order_totals(p_order_id uuid)
returns void language plpgsql security definer set search_path = '' as $$
declare v_order public.orders; v_subtotal numeric(12,2):=0; v_discount numeric(12,2):=0; v_total numeric(12,2):=0; v_promo public.promo_codes; v_product_id uuid; v_plan_id uuid; v_discount_calc numeric(12,2):=0; v_existing_redemption boolean:=false;
begin
 select * into v_order from public.orders where id=p_order_id for update; if v_order.id is null then return; end if;
 select coalesce(sum(price*greatest(quantity,1)),0) into v_subtotal from public.order_items where order_id=p_order_id;
 if nullif(trim(v_order.promo_code),'') is not null then
  select * into v_promo from public.promo_codes where lower(code)=lower(trim(v_order.promo_code)) and is_active=true and (starts_at is null or starts_at<=now()) and (expires_at is null or expires_at>now()) order by priority desc,created_at desc limit 1;
  if v_promo.id is null then v_order.promo_code:=null;
  else
   select p.id into v_product_id from public.products p where p.slug=(select oi.product_slug from public.order_items oi where oi.order_id=p_order_id order by oi.created_at limit 1) limit 1;
   if v_promo.product_id is not null and v_promo.product_id is distinct from v_product_id then v_promo:=null; end if;
   if v_promo.id is not null and v_promo.min_subtotal>v_subtotal then v_promo:=null; end if;
   if v_promo.id is not null and v_promo.plan_id is not null then select pp.id into v_plan_id from public.product_plans pp where pp.product_id=v_product_id and (pp.duration=v_order.plan or lower(pp.name)=lower(v_order.plan)) limit 1; if v_plan_id is distinct from v_promo.plan_id then v_promo:=null; end if; end if;
   if v_promo.id is not null and v_promo.usage_limit is not null and (select count(*) from public.promo_redemptions r where r.promo_id=v_promo.id)>=v_promo.usage_limit then v_promo:=null; end if;
   if v_promo.id is not null and v_order.user_id is not null and v_promo.per_user_limit is not null and (select count(*) from public.promo_redemptions r where r.promo_id=v_promo.id and r.user_id=v_order.user_id)>=v_promo.per_user_limit then v_promo:=null; end if;
   if v_promo.id is not null and v_promo.first_order_only and exists(select 1 from public.orders o where o.user_id=v_order.user_id and o.id<>p_order_id and o.order_status<>'cancelled') then v_promo:=null; end if;
   if v_promo.id is null then v_order.promo_code:=null; else if v_promo.discount_type='percentage' then v_discount_calc:=round(v_subtotal*v_promo.discount_value/100,2); if v_promo.max_discount is not null then v_discount_calc:=least(v_discount_calc,v_promo.max_discount); end if; else v_discount_calc:=v_promo.discount_value; end if; v_discount:=greatest(0,least(v_discount_calc,v_subtotal)); end if;
  end if;
 end if;
 v_total:=greatest(0,v_subtotal+coalesce(v_order.tax,0)-v_discount);
 update public.orders set subtotal=v_subtotal,original_total=v_subtotal,discount=v_discount,total=v_total,amount=v_total,promo_code=v_order.promo_code,updated_at=now() where id=p_order_id;
 if v_promo.id is not null and v_discount>0 then select exists(select 1 from public.promo_redemptions where order_id=p_order_id) into v_existing_redemption; if not v_existing_redemption then insert into public.promo_redemptions(promo_id,order_id,user_id,code,discount_amount,subtotal) values(v_promo.id,p_order_id,v_order.user_id,v_promo.code,v_discount,v_subtotal); end if; end if;
end;$$;
revoke execute on function public.recalculate_catalog_order_totals(uuid) from public;
create or replace function public.recalculate_catalog_order_totals_trigger() returns trigger language plpgsql security definer set search_path = '' as $$ begin perform public.recalculate_catalog_order_totals(coalesce(NEW.order_id,OLD.order_id)); return coalesce(NEW,OLD); end;$$;
revoke execute on function public.recalculate_catalog_order_totals_trigger() from public;
drop trigger if exists trg_recalculate_catalog_order_totals on public.order_items;
create trigger trg_recalculate_catalog_order_totals after insert or update or delete on public.order_items for each row execute function public.recalculate_catalog_order_totals_trigger();
create or replace function public.prepare_catalog_order_insert() returns trigger language plpgsql security definer set search_path = '' as $$ begin if public.is_admin() then return NEW; end if; NEW.tax:=0; NEW.discount:=0; NEW.total:=0; NEW.original_total:=0; NEW.amount:=0; NEW.paid_amount:=coalesce(NEW.paid_amount,0); if nullif(trim(NEW.promo_code),'') is not null then NEW.promo_code:=upper(trim(NEW.promo_code)); end if; return NEW; end;$$;
revoke execute on function public.prepare_catalog_order_insert() from public;
drop trigger if exists trg_prepare_catalog_order_insert on public.orders;
create trigger trg_prepare_catalog_order_insert before insert on public.orders for each row execute function public.prepare_catalog_order_insert();
