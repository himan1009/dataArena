# DataArena Web (`apps/web`)

Next.js 16 frontend for DataArena.

## Stack

- Next.js 16 (App Router), React 19, TypeScript
- Tailwind CSS v4, shadcn/ui, Framer Motion
- TipTap rich text editor, react-markdown

## Local development

From the **monorepo root**, see [docs/SETUP_AND_RUN.md](../../docs/SETUP_AND_RUN.md).

Quick start (with API + Docker already running):

```bash
cd apps/web
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment

Copy `.env.example` to `.env.local`:

```env
NEXT_PUBLIC_API_URL="http://localhost:4000"
```

Server-side fetches also accept `API_URL` (used in production on Vercel).

## Key routes

| Route | Description |
|-------|-------------|
| `/` | Landing page |
| `/login`, `/register` | Auth |
| `/dashboard` | Post-login home |
| `/notes` | Public notes browser |
| `/write` | Author workspace |
| `/write/standards` | Writing standards (editors) |
| `/admin` | Admin CMS |
| `/admin/standards` | Writing standards editor |
| `/admin/inbox` | Contact & bug reports |

## API proxy

Browser requests go to Next.js API routes (`/api/auth/*`, `/api/notes/*`, etc.) which proxy to the Nest backend. This keeps httpOnly auth cookies on the frontend origin.

## Deploy

See [docs/DEPLOYMENT.md](../../docs/DEPLOYMENT.md) — recommended: **Vercel** with `API_URL` pointing to the Render API.
