-- Once Humans production persistence baseline.
-- Run this in the Supabase SQL editor after reviewing names against the active project.

create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text not null unique,
  display_name text,
  human_type text,
  description text,
  profile_image_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.content_pages (
  id uuid primary key default gen_random_uuid(),
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

create table if not exists public.page_media (
  id uuid primary key default gen_random_uuid(),
  page_id uuid references public.content_pages(id) on delete cascade,
  profile_id uuid references public.profiles(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  storage_path text not null,
  media_type text not null check (media_type in ('image', 'video')),
  created_at timestamptz not null default now(),
  check ((page_id is not null and profile_id is null) or (page_id is null and profile_id is not null))
);

create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  page_id uuid references public.content_pages(id) on delete cascade,
  profile_id uuid references public.profiles(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  body text not null,
  created_at timestamptz not null default now(),
  check ((page_id is not null and profile_id is null) or (page_id is null and profile_id is not null))
);

create table if not exists public.live_chat_messages (
  id uuid primary key default gen_random_uuid(),
  room_id text not null,
  user_id uuid not null references auth.users(id) on delete cascade,
  body text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.saved_chat_rooms (
  user_id uuid not null references auth.users(id) on delete cascade,
  room_id text not null,
  title text not null,
  section text not null check (section in ('once', 'humans')),
  href text not null,
  unread_count integer not null default 0,
  saved_at timestamptz not null default now(),
  primary key (user_id, room_id)
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
  created_at timestamptz not null default now(),
  reviewed_at timestamptz
);

create index if not exists content_pages_browse_idx on public.content_pages(section, category, subcategory, status);
create index if not exists live_chat_messages_room_idx on public.live_chat_messages(room_id, created_at);
create index if not exists posts_page_idx on public.posts(page_id, created_at);
create index if not exists posts_profile_idx on public.posts(profile_id, created_at);

alter table public.profiles enable row level security;
alter table public.content_pages enable row level security;
alter table public.page_media enable row level security;
alter table public.posts enable row level security;
alter table public.live_chat_messages enable row level security;
alter table public.saved_chat_rooms enable row level security;
alter table public.page_submissions enable row level security;

create policy "Profiles are public" on public.profiles for select using (true);
create policy "Users update own profile" on public.profiles for update using (auth.uid() = id);
create policy "Users insert own profile" on public.profiles for insert with check (auth.uid() = id);

create policy "Approved pages are public" on public.content_pages for select using (status = 'approved');
create policy "Users create pending pages" on public.content_pages for insert with check (auth.uid() = created_by and status = 'pending');

create policy "Media is public" on public.page_media for select using (true);
create policy "Users insert own media" on public.page_media for insert with check (auth.uid() = user_id);
create policy "Users delete own media" on public.page_media for delete using (auth.uid() = user_id);

create policy "Posts are public" on public.posts for select using (true);
create policy "Signed in users create own posts" on public.posts for insert with check (auth.uid() = user_id);
create policy "Users delete own posts" on public.posts for delete using (auth.uid() = user_id);

create policy "Room messages are readable" on public.live_chat_messages for select using (true);
create policy "Signed in users send messages" on public.live_chat_messages for insert with check (auth.uid() = user_id);

create policy "Users read own saved chats" on public.saved_chat_rooms for select using (auth.uid() = user_id);
create policy "Users manage own saved chats" on public.saved_chat_rooms for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Users read own submissions" on public.page_submissions for select using (auth.uid() = user_id);
create policy "Users create own submissions" on public.page_submissions for insert with check (auth.uid() = user_id and status = 'pending');

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'page-media',
  'page-media',
  true,
  52428800,
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'video/mp4', 'video/webm', 'video/quicktime']
)
on conflict (id) do nothing;

create policy "Public media read" on storage.objects for select using (bucket_id = 'page-media');
create policy "Signed in media upload" on storage.objects for insert with check (bucket_id = 'page-media' and auth.role() = 'authenticated');
create policy "Users update own media objects" on storage.objects for update using (bucket_id = 'page-media' and auth.uid()::text = owner);
create policy "Users delete own media objects" on storage.objects for delete using (bucket_id = 'page-media' and auth.uid()::text = owner);
