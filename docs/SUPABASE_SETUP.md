# Supabase Setup For Once Humans

This gets the backend ready for account-tied profile data, posts, chats, joined chats, submissions, and uploads.

## 1. Run The Schema

1. Open Supabase.
2. Choose the Once Humans project.
3. Go to `SQL Editor`.
4. Open `supabase-production-schema.sql` from this repo.
5. Paste the whole file into Supabase.
6. Click `Run`.

The script creates:

- `profiles`
- `content_pages`
- `page_submissions`
- `profile_posts`
- `page_posts`
- `media_items`
- `chat_rooms`
- `chat_messages`
- `joined_chat_rooms`
- `once-humans-media` storage bucket
- Row Level Security policies
- A signup trigger that creates a profile row for each new auth user

## 2. Confirm Auth Settings

In Supabase:

`Authentication` -> `URL Configuration`

Set `Site URL`:

```text
https://oncehumans.com
```

Add redirect URLs:

```text
https://oncehumans.com/**
https://www.oncehumans.com/**
http://localhost:3000/**
```

## 3. Confirm Vercel Environment Variables

In Vercel, add these to the Once Humans project:

```text
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
```

Use the Supabase project URL and the publishable/anon key. Do not use the secret key in the browser app.

After changing variables, redeploy Vercel.

## 4. Upload Path Rule

The storage policy expects uploaded files to live under a folder named after the signed-in user id:

```text
{user_id}/profile/avatar.png
{user_id}/gallery/{file_id}.jpg
{user_id}/pages/{page_id}/{file_id}.mp4
```

When the app code is moved from `localStorage` to Supabase Storage, it should upload files using that path shape.

## 5. App Code Migration Order

Recommended order:

1. Profile row read/write:
   - `profiles.human_type`
   - `profiles.description`
   - `profiles.profile_image_path`
2. Profile posts:
   - `profile_posts`
3. Chat rooms and messages:
   - `chat_rooms`
   - `chat_messages`
   - `joined_chat_rooms`
4. Gallery uploads:
   - `once-humans-media`
   - `media_items`
5. Page submissions:
   - `page_submissions`
6. Seeded pages:
   - optionally migrate `lib/content.ts` entries into `content_pages`

## 6. Important Prototype Note

Right now the app still uses `localStorage` for most social/profile state. Running this schema prepares Supabase, but the app code still needs to be updated to read/write these tables.
