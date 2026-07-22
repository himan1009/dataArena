# DataArena — Deployment Guide (Free Tier)

> Deploy the full stack with **Vercel** (frontend) + **Render** (API) + **Neon** (PostgreSQL).

---

## Stack

| Layer | Technology | Host |
|-------|------------|------|
| Frontend | Next.js 16, React 19 | Vercel |
| Backend | NestJS, Prisma | Render |
| Database | PostgreSQL | Neon |
| Redis | Prepared in Docker | **Not required yet** (unused in API) |

---

## Architecture

```
Browser → Vercel (apps/web)
              ↓ API_URL (server-side)
          Render (apps/api)
              ↓ DATABASE_URL
          Neon PostgreSQL
```

The browser only talks to the Next.js domain. Next.js API routes (`/api/auth/*`, `/api/notes/*`, etc.) proxy to the Nest API so auth cookies stay on one origin.

---

## 1. Database — Neon

1. Create a project at [neon.tech](https://neon.tech)
2. Copy the connection string (include `?sslmode=require`)

---

## 2. API — Render

**New Web Service** → connect GitHub repo

| Setting | Value |
|---------|--------|
| Root directory | `apps/api` |
| Build | `npm install && npx prisma generate && npm run build` |
| Start | `npx prisma migrate deploy && npm run start:prod` |

**Environment variables:**

```env
DATABASE_URL=postgresql://...?sslmode=require
NODE_ENV=production
PORT=4000
FRONTEND_URL=https://YOUR-APP.vercel.app
JWT_ACCESS_SECRET=<openssl rand -base64 32>
JWT_REFRESH_SECRET=<openssl rand -base64 32>
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
COOKIE_SECURE=true
```

Note: `COOKIE_SECURE` defaults to on when `NODE_ENV=production`.

---

## 3. Frontend — Vercel

**New Project** → import repo

| Setting | Value |
|---------|--------|
| Root directory | `apps/web` |
| Framework | Next.js |

**Environment variable:**

```env
API_URL=https://YOUR-API.onrender.com
```

After deploy, set `FRONTEND_URL` on Render to your Vercel URL and redeploy the API.

---

## 4. First admin user

Open `https://YOUR-APP.vercel.app/register` — the **first registered user** becomes `ADMIN`.

---

## Render for both frontend and API?

Yes, you can host both on Render. Vercel is recommended for Next.js because of faster cold starts and better Next.js integration. Render free tier sleeps after inactivity on both services.

---

## Production checklist

- [ ] Strong JWT secrets (not dev defaults)
- [ ] `COOKIE_SECURE=true` (or `NODE_ENV=production`)
- [ ] `FRONTEND_URL` matches Vercel URL exactly
- [ ] `API_URL` set on Vercel
- [ ] Migrations applied (`prisma migrate deploy` on API start)
- [ ] Never commit `.env` files

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| Login works then fails after ~15 min | Ensure `API_URL` is set on Vercel; auth refresh proxies through `/api/auth/refresh` |
| CORS error | `FRONTEND_URL` on API must match browser origin |
| Database error | Check `DATABASE_URL` and run migrations |
| Slow first request | Render free tier cold start — wait or upgrade |

See also [SETUP_AND_RUN.md](./SETUP_AND_RUN.md) for local development.
