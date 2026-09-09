-- NEXT LEVEL SUBS — Review interactions
-- Like/reaction support for product reviews and replies.

create extension if not exists pgcrypto;

create table if not exists public.review_reactions (
  id uuid primary key default gen_random_uuid(),
  review_id uuid references public.product_reviews(id) on delete cascade,
  reply_id uuid references public.review_replies(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  reaction_type text not null default 'like' check (reaction_type in ('like')),
  created_at timestamptz not null default now(),
  constraint review_reaction_target_check check ((review_id is not null) <> (reply_id is not null)),
  constraint review_reaction_unique_review unique (review_id,user_id,reaction_type),
  constraint review_reaction_unique_reply unique (reply_id,user_id,reaction_type)
);

create index if not exists review_reactions_review_idx on public.review_reactions(review_id,created_at);
create index if not exists review_reactions_reply_idx on public.review_reactions(reply_id,created_at);

alter table public.review_reactions enable row level security;

drop policy if exists review_reactions_public_read on public.review_reactions;
create policy review_reactions_public_read on public.review_reactions for select using (true);

drop policy if exists review_reactions_auth_insert on public.review_reactions;
create policy review_reactions_auth_insert on public.review_reactions for insert to authenticated with check (auth.uid()=user_id);

drop policy if exists review_reactions_auth_delete on public.review_reactions;
create policy review_reactions_auth_delete on public.review_reactions for delete to authenticated using (auth.uid()=user_id);
