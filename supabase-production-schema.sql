-- Once Humans Supabase production starter schema.
-- Paste this into Supabase SQL Editor and run it once.
-- It creates account-tied persistence for profiles, posts, chats, joined chats,
-- page submissions, and uploaded media.

create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text not null unique,
  display_name text,
  human_type text not null default 'human',
  description text not null default 'Share a short bio, a mood, or the work you are bringing into the world.',
  profile_image_path text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.content_pages (
  id text primary key,
  slug text not null unique,
  section text not null check (section in ('once', 'humans')),
  title text not null,
  category text not null,
  subcategory text not null,
  description text,
  status text not null default 'approved' check (status in ('approved', 'pending', 'rejected')),
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.page_submissions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  section text not null check (section in ('once', 'humans')),
  category text not null,
  subcategory text not null,
  title text not null,
  description text,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  reviewed_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.profile_posts (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  body text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.page_posts (
  id uuid primary key default gen_random_uuid(),
  page_id text not null references public.content_pages(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  body text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.media_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  page_id text references public.content_pages(id) on delete cascade,
  profile_id uuid references public.profiles(id) on delete cascade,
  storage_bucket text not null default 'once-humans-media',
  storage_path text not null,
  media_type text not null check (media_type in ('image', 'video')),
  created_at timestamptz not null default now(),
  check (
    (page_id is not null and profile_id is null) or
    (page_id is null and profile_id is not null)
  )
);

create table if not exists public.chat_rooms (
  id text primary key,
  kind text not null check (kind in ('page', 'profile', 'post')),
  section text not null check (section in ('once', 'humans')),
  title text not null,
  eyebrow text,
  href text not null,
  page_id text references public.content_pages(id) on delete cascade,
  profile_id uuid references public.profiles(id) on delete cascade,
  profile_post_id uuid references public.profile_posts(id) on delete cascade,
  page_post_id uuid references public.page_posts(id) on delete cascade,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.chat_messages (
  id uuid primary key default gen_random_uuid(),
  room_id text not null references public.chat_rooms(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  body text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.joined_chat_rooms (
  user_id uuid not null references auth.users(id) on delete cascade,
  room_id text not null references public.chat_rooms(id) on delete cascade,
  unread_count integer not null default 0,
  joined_at timestamptz not null default now(),
  primary key (user_id, room_id)
);

create index if not exists profiles_username_idx on public.profiles(username);
create index if not exists content_pages_browse_idx on public.content_pages(section, category, subcategory, status);
create index if not exists profile_posts_profile_idx on public.profile_posts(profile_id, created_at desc);
create index if not exists page_posts_page_idx on public.page_posts(page_id, created_at desc);
create index if not exists media_items_page_idx on public.media_items(page_id, created_at desc);
create index if not exists media_items_profile_idx on public.media_items(profile_id, created_at desc);
create index if not exists chat_messages_room_idx on public.chat_messages(room_id, created_at);
create index if not exists joined_chat_rooms_user_idx on public.joined_chat_rooms(user_id, joined_at desc);

drop trigger if exists set_profiles_updated_at on public.profiles;
create trigger set_profiles_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

drop trigger if exists set_content_pages_updated_at on public.content_pages;
create trigger set_content_pages_updated_at
before update on public.content_pages
for each row execute function public.set_updated_at();

drop trigger if exists set_profile_posts_updated_at on public.profile_posts;
create trigger set_profile_posts_updated_at
before update on public.profile_posts
for each row execute function public.set_updated_at();

drop trigger if exists set_page_posts_updated_at on public.page_posts;
create trigger set_page_posts_updated_at
before update on public.page_posts
for each row execute function public.set_updated_at();

drop trigger if exists set_chat_rooms_updated_at on public.chat_rooms;
create trigger set_chat_rooms_updated_at
before update on public.chat_rooms
for each row execute function public.set_updated_at();

alter table public.profiles enable row level security;
alter table public.content_pages enable row level security;
alter table public.page_submissions enable row level security;
alter table public.profile_posts enable row level security;
alter table public.page_posts enable row level security;
alter table public.media_items enable row level security;
alter table public.chat_rooms enable row level security;
alter table public.chat_messages enable row level security;
alter table public.joined_chat_rooms enable row level security;

drop policy if exists "Profiles are public" on public.profiles;
create policy "Profiles are public"
on public.profiles for select
using (true);

drop policy if exists "Users insert own profile" on public.profiles;
create policy "Users insert own profile"
on public.profiles for insert
with check (auth.uid() = id);

drop policy if exists "Users update own profile" on public.profiles;
create policy "Users update own profile"
on public.profiles for update
using (auth.uid() = id)
with check (auth.uid() = id);

drop policy if exists "Approved pages are public" on public.content_pages;
create policy "Approved pages are public"
on public.content_pages for select
using (status = 'approved');

drop policy if exists "Users create pending pages" on public.content_pages;
create policy "Users create pending pages"
on public.content_pages for insert
with check (auth.uid() = created_by and status = 'pending');

drop policy if exists "Users read own submissions" on public.page_submissions;
create policy "Users read own submissions"
on public.page_submissions for select
using (auth.uid() = user_id);

drop policy if exists "Users create own submissions" on public.page_submissions;
create policy "Users create own submissions"
on public.page_submissions for insert
with check (auth.uid() = user_id and status = 'pending');

drop policy if exists "Profile posts are public" on public.profile_posts;
create policy "Profile posts are public"
on public.profile_posts for select
using (true);

drop policy if exists "Users create own profile posts" on public.profile_posts;
create policy "Users create own profile posts"
on public.profile_posts for insert
with check (auth.uid() = user_id);

drop policy if exists "Users update own profile posts" on public.profile_posts;
create policy "Users update own profile posts"
on public.profile_posts for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "Users delete own profile posts" on public.profile_posts;
create policy "Users delete own profile posts"
on public.profile_posts for delete
using (auth.uid() = user_id);

drop policy if exists "Page posts are public" on public.page_posts;
create policy "Page posts are public"
on public.page_posts for select
using (true);

drop policy if exists "Users create own page posts" on public.page_posts;
create policy "Users create own page posts"
on public.page_posts for insert
with check (auth.uid() = user_id);

drop policy if exists "Users update own page posts" on public.page_posts;
create policy "Users update own page posts"
on public.page_posts for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "Users delete own page posts" on public.page_posts;
create policy "Users delete own page posts"
on public.page_posts for delete
using (auth.uid() = user_id);

drop policy if exists "Media is public" on public.media_items;
create policy "Media is public"
on public.media_items for select
using (true);

drop policy if exists "Users insert own media" on public.media_items;
create policy "Users insert own media"
on public.media_items for insert
with check (auth.uid() = user_id);

drop policy if exists "Users delete own media" on public.media_items;
create policy "Users delete own media"
on public.media_items for delete
using (auth.uid() = user_id);

drop policy if exists "Chat rooms are public" on public.chat_rooms;
create policy "Chat rooms are public"
on public.chat_rooms for select
using (true);

drop policy if exists "Signed in users create chat rooms" on public.chat_rooms;
create policy "Signed in users create chat rooms"
on public.chat_rooms for insert
with check (auth.uid() = created_by);

drop policy if exists "Chat messages are public" on public.chat_messages;
create policy "Chat messages are public"
on public.chat_messages for select
using (true);

drop policy if exists "Signed in users send chat messages" on public.chat_messages;
create policy "Signed in users send chat messages"
on public.chat_messages for insert
with check (auth.uid() = user_id);

drop policy if exists "Users read own joined chats" on public.joined_chat_rooms;
create policy "Users read own joined chats"
on public.joined_chat_rooms for select
using (auth.uid() = user_id);

drop policy if exists "Users join own chats" on public.joined_chat_rooms;
create policy "Users join own chats"
on public.joined_chat_rooms for insert
with check (auth.uid() = user_id);

drop policy if exists "Users update own joined chats" on public.joined_chat_rooms;
create policy "Users update own joined chats"
on public.joined_chat_rooms for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "Users leave own joined chats" on public.joined_chat_rooms;
create policy "Users leave own joined chats"
on public.joined_chat_rooms for delete
using (auth.uid() = user_id);

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'once-humans-media',
  'once-humans-media',
  true,
  52428800,
  array[
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/gif',
    'video/mp4',
    'video/webm',
    'video/quicktime'
  ]
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Public once humans media read" on storage.objects;
create policy "Public once humans media read"
on storage.objects for select
using (bucket_id = 'once-humans-media');

drop policy if exists "Users upload own once humans media" on storage.objects;
create policy "Users upload own once humans media"
on storage.objects for insert
with check (
  bucket_id = 'once-humans-media' and
  auth.role() = 'authenticated' and
  auth.uid()::text = (storage.foldername(name))[1]
);

drop policy if exists "Users update own once humans media" on storage.objects;
create policy "Users update own once humans media"
on storage.objects for update
using (
  bucket_id = 'once-humans-media' and
  auth.uid()::text = (storage.foldername(name))[1]
)
with check (
  bucket_id = 'once-humans-media' and
  auth.uid()::text = (storage.foldername(name))[1]
);

drop policy if exists "Users delete own once humans media" on storage.objects;
create policy "Users delete own once humans media"
on storage.objects for delete
using (
  bucket_id = 'once-humans-media' and
  auth.uid()::text = (storage.foldername(name))[1]
);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  base_username text;
  next_username text;
  suffix integer := 0;
begin
  base_username := lower(regexp_replace(coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1), 'human'), '[^a-z0-9]+', '-', 'g'));
  base_username := trim(both '-' from base_username);

  if base_username = '' then
    base_username := 'human';
  end if;

  next_username := base_username;

  while exists (select 1 from public.profiles where username = next_username) loop
    suffix := suffix + 1;
    next_username := base_username || '-' || suffix::text;
  end loop;

  insert into public.profiles (id, username, display_name, human_type)
  values (
    new.id,
    next_username,
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1), 'human'),
    coalesce(new.raw_user_meta_data->>'human_type', 'human')
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();
