# Once Humans Web Launch Runbook

## Production Web Checklist

1. Create or choose the production Supabase project.
2. Run `supabase-production-schema.sql` in the Supabase SQL editor.
3. In Supabase Auth, configure:
   - Site URL: the production domain.
   - Redirect URLs: production domain, Vercel preview domains as needed, and local dev.
   - Custom SMTP provider to avoid default email rate limits.
4. In Supabase Storage, confirm the `page-media` bucket exists and accepts the allowed media types.
5. In Vercel, import the Git repository and set:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
6. Attach the custom domain in Vercel and update DNS as instructed by Vercel.
7. Run a Vercel preview smoke test before promoting to production.

## Feature Readiness Before Public Launch

The app still contains prototype localStorage flows. Before a real social launch, replace those flows with Supabase reads/writes:

- Profiles: username, human type, description, and profile image.
- Gallery media: upload files to Supabase Storage and persist records in `page_media`.
- Posts: persist in `posts`.
- Live chat: persist messages in `live_chat_messages`.
- Joined chats: persist in `saved_chat_rooms`.
- Page submissions: persist in `page_submissions` and expose an admin review path.

## Smoke Test

Run locally and in Vercel preview:

```bash
npm.cmd run lint
npm.cmd run build
```

Then verify:

- Signup, login, logout, and protected actions.
- Browse Once/Humans entries.
- Search opens full entry pages.
- Profile page editing and media uploads.
- Gallery upload previews and production upload persistence.
- Posts and general chat persistence across refreshes, browsers, and devices.
- Signed-out users are redirected before chat, save chat, post, upload, or submit actions.

## Production Notes

- Do not use Supabase default email sending for launch; configure custom SMTP.
- Add Terms, Privacy Policy, and moderation/reporting before store review or public social traffic.
- Keep Vercel preview deployments available for testing migrations before production.
