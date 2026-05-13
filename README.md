# Once Humans

Once Humans is a Next.js prototype for a living museum and social space around human-made things and human stories.

## Development

```bash
npm.cmd install
npm.cmd run dev
```

Open `http://localhost:3000`.

Create `.env.local` from `.env.example`:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

## Production Launch

The project is not production-ready until local-only prototype state is replaced with Supabase persistence for profiles, uploads, posts, chats, saved chats, and submissions.

Start here:

- [Web launch runbook](docs/LAUNCH.md)
- [App store path](docs/APP_STORE.md)
- [Production Supabase baseline](supabase-production-schema.sql)

## Checks

```bash
npm.cmd run lint
npm.cmd run build
```

## Current Stack

- Next.js
- React
- Supabase Auth/Storage/Postgres
- Vercel target deployment
- PWA first, Capacitor wrapper later for app stores
