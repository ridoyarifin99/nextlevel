-- NEXT LEVEL SUBS — Central Product Management
-- Run this once in Supabase SQL Editor.

create extension if not exists pgcrypto;

create table if not exists public.product_categories (
  id uuid primary key default gen_random_uuid(), name text not null unique, slug text not null unique,
  description text, display_order integer not null default 0, is_active boolean not null default true,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(), category_id uuid references public.product_categories(id) on delete set null,
  name text not null, slug text not null unique, description text, image_url text, icon text, brand_color text,
  currency text not null default 'BDT', price numeric(12,2) not null default 0, old_price numeric(12,2),
  is_available boolean not null default true, display_order integer not null default 0, is_featured boolean not null default false,
  badge text, features jsonb not null default '[]'::jsonb, faq jsonb not null default '[]'::jsonb,
  keywords jsonb not null default '[]'::jsonb, seo_title text, seo_description text, seo_canonical text,
  services jsonb not null default '[]'::jsonb, extra_data jsonb not null default '{}'::jsonb,
  is_archived boolean not null default false, created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table if not exists public.product_plans (
  id uuid primary key default gen_random_uuid(), product_id uuid not null references public.products(id) on delete cascade,
  name text not null default 'Standard', duration text not null, price numeric(12,2) not null default 0, old_price numeric(12,2),
  currency text not null default 'BDT', is_available boolean not null default true, display_order integer not null default 0,
  features jsonb not null default '[]'::jsonb, extra_data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table if not exists public.product_slug_aliases (
  id uuid primary key default gen_random_uuid(), product_id uuid not null references public.products(id) on delete cascade,
  slug text not null unique, created_at timestamptz not null default now()
);
create table if not exists public.product_admins (user_id uuid primary key references auth.users(id) on delete cascade, created_at timestamptz not null default now());

create table if not exists public.product_media (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  role text not null check (role in ('primary','logo','gallery','service')),
  url text not null,
  storage_path text,
  alt_text text,
  title text,
  service_name text,
  display_order integer not null default 0,
  is_active boolean not null default true,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists products_category_idx on public.products(category_id);
create index if not exists products_order_idx on public.products(display_order);
create index if not exists products_available_idx on public.products(is_available, is_archived);
create index if not exists product_plans_product_idx on public.product_plans(product_id, display_order);
create index if not exists product_alias_slug_idx on public.product_slug_aliases(slug);
create index if not exists product_media_product_role_order_idx on public.product_media(product_id, role, display_order, created_at);
create index if not exists product_media_service_name_idx on public.product_media(product_id, service_name);
create unique index if not exists product_media_one_primary_idx on public.product_media(product_id, role) where role='primary' and is_active=true;
create unique index if not exists product_media_one_logo_idx on public.product_media(product_id, role) where role='logo' and is_active=true;

create or replace function public.touch_product_updated_at() returns trigger language plpgsql as $$ begin new.updated_at=now(); return new; end; $$;
create or replace function public.touch_product_media_updated_at() returns trigger language plpgsql security definer set search_path=public as $$ begin new.updated_at=now(); return new; end; $$;
drop trigger if exists product_categories_updated_at on public.product_categories;
create trigger product_categories_updated_at before update on public.product_categories for each row execute function public.touch_product_updated_at();
drop trigger if exists products_updated_at on public.products;
create trigger products_updated_at before update on public.products for each row execute function public.touch_product_updated_at();
drop trigger if exists product_plans_updated_at on public.product_plans;
create trigger product_plans_updated_at before update on public.product_plans for each row execute function public.touch_product_updated_at();
drop trigger if exists trg_product_media_updated_at on public.product_media;
create trigger trg_product_media_updated_at before update on public.product_media for each row execute function public.touch_product_media_updated_at();

insert into public.product_categories (name,slug,description,display_order) values
('Streaming','streaming','Movies, TV, live and on-demand entertainment.',10),('Music','music','Music and audio streaming services.',20),('VPN & Security','vpn-security','VPN, privacy and security services.',30),('AI & Productivity','ai-productivity','AI, productivity and creative tools.',40),('Cloud Storage','cloud-storage','Cloud storage and backup services.',50),('Software & Apps','software-apps','Software, utilities and premium apps.',60),('Education','education','Learning, courses and education services.',70),('Gaming','gaming','Gaming subscriptions and services.',80),('Bundles & Combos','bundles-combos','Multi-service bundles and combo offers.',90),('Social & Communication','social-communication','Communication and social utility services.',100),('Adult Entertainment','adult-entertainment','Age-restricted entertainment services.',110),('Other Digital Services','other-digital-services','Digital services that do not fit another category.',999)
on conflict (slug) do update set name=excluded.name,description=excluded.description,updated_at=now();

alter table public.product_categories enable row level security;
alter table public.products enable row level security;
alter table public.product_plans enable row level security;
alter table public.product_slug_aliases enable row level security;
alter table public.product_admins enable row level security;
alter table public.product_media enable row level security;

drop policy if exists product_categories_public_read on public.product_categories;
create policy product_categories_public_read on public.product_categories for select using (is_active=true);
drop policy if exists products_public_read on public.products;
create policy products_public_read on public.products for select using (is_available=true and is_archived=false);
drop policy if exists plans_public_read on public.product_plans;
create policy plans_public_read on public.product_plans for select using (is_available=true and exists(select 1 from public.products p where p.id=product_plans.product_id and p.is_available=true and p.is_archived=false));
drop policy if exists aliases_public_read on public.product_slug_aliases;
create policy aliases_public_read on public.product_slug_aliases for select using (true);
drop policy if exists product_admins_self_read on public.product_admins;
create policy product_admins_self_read on public.product_admins for select using (auth.uid()=user_id);
drop policy if exists product_media_public_read on public.product_media;
create policy product_media_public_read on public.product_media for select to public using (is_active=true);

drop policy if exists product_categories_admin_read on public.product_categories;
create policy product_categories_admin_read on public.product_categories for select using (exists(select 1 from public.product_admins a where a.user_id=auth.uid()));
drop policy if exists products_admin_read on public.products;
create policy products_admin_read on public.products for select using (exists(select 1 from public.product_admins a where a.user_id=auth.uid()));
drop policy if exists plans_admin_read on public.product_plans;
create policy plans_admin_read on public.product_plans for select using (exists(select 1 from public.product_admins a where a.user_id=auth.uid()));
drop policy if exists aliases_admin_read on public.product_slug_aliases;
create policy aliases_admin_read on public.product_slug_aliases for select using (exists(select 1 from public.product_admins a where a.user_id=auth.uid()));
drop policy if exists product_media_admin_insert on public.product_media;
create policy product_media_admin_insert on public.product_media for insert to authenticated with check (exists(select 1 from public.product_admins a where a.user_id=auth.uid()));
drop policy if exists product_media_admin_update on public.product_media;
create policy product_media_admin_update on public.product_media for update to authenticated using (exists(select 1 from public.product_admins a where a.user_id=auth.uid())) with check (exists(select 1 from public.product_admins a where a.user_id=auth.uid()));
drop policy if exists product_media_admin_delete on public.product_media;
create policy product_media_admin_delete on public.product_media for delete to authenticated using (exists(select 1 from public.product_admins a where a.user_id=auth.uid()));

drop policy if exists product_categories_admin_insert on public.product_categories;
create policy product_categories_admin_insert on public.product_categories for insert with check (exists(select 1 from public.product_admins a where a.user_id=auth.uid()));
drop policy if exists product_categories_admin_update on public.product_categories;
create policy product_categories_admin_update on public.product_categories for update using (exists(select 1 from public.product_admins a where a.user_id=auth.uid())) with check (exists(select 1 from public.product_admins a where a.user_id=auth.uid()));
drop policy if exists product_categories_admin_delete on public.product_categories;
create policy product_categories_admin_delete on public.product_categories for delete using (exists(select 1 from public.product_admins a where a.user_id=auth.uid()));
drop policy if exists products_admin_insert on public.products;
create policy products_admin_insert on public.products for insert with check (exists(select 1 from public.product_admins a where a.user_id=auth.uid()));
drop policy if exists products_admin_update on public.products;
create policy products_admin_update on public.products for update using (exists(select 1 from public.product_admins a where a.user_id=auth.uid())) with check (exists(select 1 from public.product_admins a where a.user_id=auth.uid()));
drop policy if exists products_admin_delete on public.products;
create policy products_admin_delete on public.products for delete using (exists(select 1 from public.product_admins a where a.user_id=auth.uid()));
drop policy if exists plans_admin_insert on public.product_plans;
create policy plans_admin_insert on public.product_plans for insert with check (exists(select 1 from public.product_admins a where a.user_id=auth.uid()));
drop policy if exists plans_admin_update on public.product_plans;
create policy plans_admin_update on public.product_plans for update using (exists(select 1 from public.product_admins a where a.user_id=auth.uid())) with check (exists(select 1 from public.product_admins a where a.user_id=auth.uid()));
drop policy if exists plans_admin_delete on public.product_plans;
create policy plans_admin_delete on public.product_plans for delete using (exists(select 1 from public.product_admins a where a.user_id=auth.uid()));
drop policy if exists aliases_admin_insert on public.product_slug_aliases;
create policy aliases_admin_insert on public.product_slug_aliases for insert with check (exists(select 1 from public.product_admins a where a.user_id=auth.uid()));
drop policy if exists aliases_admin_delete on public.product_slug_aliases;
create policy aliases_admin_delete on public.product_slug_aliases for delete using (exists(select 1 from public.product_admins a where a.user_id=auth.uid()));

-- Existing catalog primary images are mirrored into the structured media table during the migration.
insert into public.product_media (product_id,role,url,alt_text,display_order,metadata)
select p.id,'primary',p.image_url,p.name,0,jsonb_build_object('source','legacy_image_url') from public.products p
where coalesce(trim(p.image_url),'')<>'' and not exists(select 1 from public.product_media m where m.product_id=p.id and m.role='primary');
insert into public.product_media (product_id,role,url,alt_text,display_order,metadata)
select p.id,'logo',p.image_url,p.name||' logo',0,jsonb_build_object('source','legacy_image_url') from public.products p
where coalesce(trim(p.image_url),'')<>'' and not exists(select 1 from public.product_media m where m.product_id=p.id and m.role='logo');

-- Add your authenticated admin once after running this script:
-- insert into public.product_admins (user_id) values ('YOUR-SUPABASE-AUTH-USER-UUID');
