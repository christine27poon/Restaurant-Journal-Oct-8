-- Table Notes: initial schema. Every user-owned table has row-level security keyed to auth.uid().

create type public.rating_t as enum ('loved', 'fine', 'not_for_me');
create type public.feeling_t as enum ('energized', 'satisfied', 'comfortable', 'sleepy', 'still_hungry');
create type public.health_tag_t as enum ('light', 'veggie_forward', 'protein_rich', 'fresh', 'comforting', 'indulgent');
create type public.wishlist_status_t as enum ('want', 'visited');
create type public.place_source_t as enum ('seed', 'custom');

create function public.set_updated_at() returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end
$$;

-- profiles ---------------------------------------------------------------
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text not null check (char_length(display_name) between 1 and 60),
  preferences jsonb not null default '{"show_health_tags": true, "default_price_tier": null, "home_city": null}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger profiles_set_updated_at before update on public.profiles
  for each row execute function public.set_updated_at();

-- places: user_id NULL = shared catalog (read-only for everyone); otherwise a user's custom place.
create table public.places (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users (id) on delete cascade default auth.uid(),
  name text not null check (char_length(name) between 1 and 120),
  neighborhood text,
  city text not null default 'Bay Area',
  address text,
  cuisine text,
  price_tier smallint check (price_tier between 1 and 4),
  lat double precision,
  lng double precision,
  source public.place_source_t not null default 'custom',
  created_at timestamptz not null default now()
);
create index places_user_id_idx on public.places (user_id);

create table public.visits (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade default auth.uid(),
  place_id uuid not null references public.places (id) on delete cascade,
  visited_at timestamptz not null default now(),
  photo_url text,
  dish_name text check (char_length(dish_name) <= 120),
  rating public.rating_t not null,
  would_go_back boolean,
  price_tier smallint check (price_tier between 1 and 4),
  health_tags public.health_tag_t[] not null default '{}',
  feeling public.feeling_t,
  note text check (char_length(note) <= 1000),
  story text check (char_length(story) <= 2000),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index visits_user_visited_idx on public.visits (user_id, visited_at desc);
create index visits_place_idx on public.visits (place_id);
create trigger visits_set_updated_at before update on public.visits
  for each row execute function public.set_updated_at();

create table public.wishlist_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade default auth.uid(),
  place_id uuid not null references public.places (id) on delete cascade,
  note text check (char_length(note) <= 200),
  status public.wishlist_status_t not null default 'want',
  visited_at timestamptz,
  created_at timestamptz not null default now()
);
create unique index wishlist_one_want_per_place on public.wishlist_items (user_id, place_id) where status = 'want';
create index wishlist_user_idx on public.wishlist_items (user_id, created_at desc);
create index wishlist_place_idx on public.wishlist_items (place_id);

create table public.place_lists (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade default auth.uid(),
  name text not null check (char_length(name) between 1 and 80),
  description text check (char_length(description) <= 300),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index place_lists_user_idx on public.place_lists (user_id, updated_at desc);
create trigger place_lists_set_updated_at before update on public.place_lists
  for each row execute function public.set_updated_at();

create table public.place_list_items (
  id uuid primary key default gen_random_uuid(),
  list_id uuid not null references public.place_lists (id) on delete cascade,
  place_id uuid not null references public.places (id) on delete cascade,
  position integer not null default 0,
  created_at timestamptz not null default now(),
  unique (list_id, place_id)
);
create index place_list_items_place_idx on public.place_list_items (place_id);

-- Bump a list's updated_at when its places change.
create function public.touch_place_list() returns trigger
language plpgsql
set search_path = ''
as $$
begin
  update public.place_lists set updated_at = now() where id = coalesce(new.list_id, old.list_id);
  return null;
end
$$;
create trigger place_list_items_touch after insert or delete on public.place_list_items
  for each row execute function public.touch_place_list();

-- New auth user -> profile row -------------------------------------------
create function public.handle_new_user() returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, display_name)
  values (
    new.id,
    left(coalesce(nullif(trim(new.raw_user_meta_data ->> 'display_name'), ''), nullif(split_part(new.email, '@', 1), ''), 'Friend'), 60)
  );
  return new;
end
$$;
revoke execute on function public.handle_new_user() from public, anon, authenticated;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

-- Row-level security -------------------------------------------------------
alter table public.profiles enable row level security;
alter table public.places enable row level security;
alter table public.visits enable row level security;
alter table public.wishlist_items enable row level security;
alter table public.place_lists enable row level security;
alter table public.place_list_items enable row level security;

create policy "profiles: read own" on public.profiles for select to authenticated
  using (id = (select auth.uid()));
create policy "profiles: insert own" on public.profiles for insert to authenticated
  with check (id = (select auth.uid()));
create policy "profiles: update own" on public.profiles for update to authenticated
  using (id = (select auth.uid())) with check (id = (select auth.uid()));

create policy "places: read catalog and own" on public.places for select to authenticated
  using (user_id is null or user_id = (select auth.uid()));
create policy "places: insert own custom" on public.places for insert to authenticated
  with check (user_id = (select auth.uid()) and source = 'custom');
create policy "places: update own" on public.places for update to authenticated
  using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()) and source = 'custom');
create policy "places: delete own" on public.places for delete to authenticated
  using (user_id = (select auth.uid()));

-- The exists() checks stop a row from pointing at a place the user can't see.
create policy "visits: read own" on public.visits for select to authenticated
  using (user_id = (select auth.uid()));
create policy "visits: insert own" on public.visits for insert to authenticated
  with check (user_id = (select auth.uid()) and exists (select 1 from public.places p where p.id = place_id));
create policy "visits: update own" on public.visits for update to authenticated
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()) and exists (select 1 from public.places p where p.id = place_id));
create policy "visits: delete own" on public.visits for delete to authenticated
  using (user_id = (select auth.uid()));

create policy "wishlist: read own" on public.wishlist_items for select to authenticated
  using (user_id = (select auth.uid()));
create policy "wishlist: insert own" on public.wishlist_items for insert to authenticated
  with check (user_id = (select auth.uid()) and exists (select 1 from public.places p where p.id = place_id));
create policy "wishlist: update own" on public.wishlist_items for update to authenticated
  using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));
create policy "wishlist: delete own" on public.wishlist_items for delete to authenticated
  using (user_id = (select auth.uid()));

create policy "lists: read own" on public.place_lists for select to authenticated
  using (user_id = (select auth.uid()));
create policy "lists: insert own" on public.place_lists for insert to authenticated
  with check (user_id = (select auth.uid()));
create policy "lists: update own" on public.place_lists for update to authenticated
  using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));
create policy "lists: delete own" on public.place_lists for delete to authenticated
  using (user_id = (select auth.uid()));

create policy "list items: read own" on public.place_list_items for select to authenticated
  using (exists (select 1 from public.place_lists l where l.id = list_id and l.user_id = (select auth.uid())));
create policy "list items: insert own" on public.place_list_items for insert to authenticated
  with check (
    exists (select 1 from public.place_lists l where l.id = list_id and l.user_id = (select auth.uid()))
    and exists (select 1 from public.places p where p.id = place_id)
  );
create policy "list items: update own" on public.place_list_items for update to authenticated
  using (exists (select 1 from public.place_lists l where l.id = list_id and l.user_id = (select auth.uid())))
  with check (exists (select 1 from public.place_lists l where l.id = list_id and l.user_id = (select auth.uid())));
create policy "list items: delete own" on public.place_list_items for delete to authenticated
  using (exists (select 1 from public.place_lists l where l.id = list_id and l.user_id = (select auth.uid())));

-- Photos: private bucket, one folder per user ------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('visit-photos', 'visit-photos', false, 5242880, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do nothing;

create policy "photos: read own folder" on storage.objects for select to authenticated
  using (bucket_id = 'visit-photos' and (storage.foldername(name))[1] = (select auth.uid())::text);
create policy "photos: upload to own folder" on storage.objects for insert to authenticated
  with check (bucket_id = 'visit-photos' and (storage.foldername(name))[1] = (select auth.uid())::text);
create policy "photos: update own folder" on storage.objects for update to authenticated
  using (bucket_id = 'visit-photos' and (storage.foldername(name))[1] = (select auth.uid())::text);
create policy "photos: delete own folder" on storage.objects for delete to authenticated
  using (bucket_id = 'visit-photos' and (storage.foldername(name))[1] = (select auth.uid())::text);
