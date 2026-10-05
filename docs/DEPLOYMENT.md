# DataArena — Deployment Guide

> **Locked stack (free tier):** GitHub + **Supabase** (database) + **Render** (API) + **Vercel** (frontend)

We use **Supabase for PostgreSQL only**. Auth, API logic, and cookies stay in **NestJS** — you do **not** need Supabase Auth.

**Your repo:** https://github.com/himan1009/dataArena

---

## Architecture

```
Browser → Vercel (apps/web)
              ↓ API_URL
          Render (apps/api)
              ↓ DATABASE_URL
          Supabase (PostgreSQL)
```

---

## Step 1 — Supabase (database) ~5 min

1. Go to [supabase.com](https://supabase.com) → sign up (GitHub login is fine).
2. **New project** → name `dataarena` → set a **strong database password** (save it).
3. Pick a region close to you (e.g. **Southeast Asia**).
4. Wait until the project is ready.
5. Open **Project Settings → Database → Connection string**.
6. Choose **URI** tab and **Direct connection** (port `5432`).
7. Copy the string and replace `[YOUR-PASSWORD]` with your DB password.

Example shape:

```text
postgresql://postgres.xxxxx:YOUR_PASSWORD@db.xxxxx.supabase.co:5432/postgres
```

8. Add SSL if not present:

```text
?sslmode=require
```

**Important:** Use **Direct connection** (not Transaction pooler) for Render + Prisma migrations. One `DATABASE_URL` is enough.

Save this — you paste it into Render as `DATABASE_URL`.

---

## Step 2 — Render (API) first ~10 min

### Option A — Blueprint

1. Push `render.yaml` (if not on GitHub yet):
   ```bash
   git add render.yaml docs/DEPLOYMENT.md
   git commit -m "Add Render deploy config (Supabase)"
   git push
   ```
2. [render.com](https://render.com) → **New → Blueprint** → repo `himan1009/dataArena`.
3. Fill secret env vars when prompted (see table below).
4. Deploy.

### Option B — Manual web service

1. [render.com](https://render.com) → **New → Web Service** → `himan1009/dataArena`.
2. Settings:

| Field | Value |
|--------|--------|
| Name | `dataarena-api` |
| Region | Singapore (or nearest) |
| Branch | `main` |
| Root Directory | *(leave empty — repo root)* |
| Runtime | Node |
| Build Command | `NPM_CONFIG_PRODUCTION=false npm install && npm run prisma:generate --workspace=api && npm run build --workspace=api` |
| Start Command | `cd apps/api && npx prisma migrate deploy && npm run start:prod` |
| Instance type | Free |

3. **Environment variables:**

| Key | Value |
|-----|--------|
| `DATABASE_URL` | Supabase **Direct** connection string (Step 1) |
| `NODE_ENV` | `production` |
| `PORT` | `4000` |
| `FRONTEND_URL` | `https://PLACEHOLDER.vercel.app` *(update after Vercel)* |
| `JWT_ACCESS_SECRET` | `openssl rand -base64 32` |
| `JWT_REFRESH_SECRET` | `openssl rand -base64 32` (run again) |
| `JWT_ACCESS_EXPIRES_IN` | `15m` |
| `JWT_REFRESH_EXPIRES_IN` | `7d` |
| `COOKIE_SECURE` | `true` |

4. **Create Web Service** → wait for **Live** → copy URL, e.g.  
   `https://dataarena-api.onrender.com`

**Test:** open `https://YOUR-API.onrender.com/api/v1/standards` — expect JSON (first load may be slow on free tier).

**Health (keep Render + DB warm):**

| Endpoint | Purpose |
|----------|---------|
| `GET /api/v1/health/live` | Fast liveness (no DB) |
| `GET /api/v1/health/ready` | Runs `SELECT 1` on Postgres — **use for keep-alive** |

Example: `https://YOUR-API.onrender.com/api/v1/health/ready` → `{"status":"ok",...}` when API and database are up.

---

## Keep-alive (every ~8 minutes)

Render **free** web services sleep after ~**15 minutes** with **no incoming traffic**. The API can ping its own public URL on a timer so Render sees traffic and stays awake (and `SELECT 1` keeps the DB connection warm).

### A — Render env (recommended, no GitHub / no paid cron)

On your **Render Web Service** → **Environment**:

| Variable | Value |
|----------|--------|
| `KEEPALIVE_ENABLED` | `true` |
| `KEEPALIVE_INTERVAL_MINUTES` | `8` (optional; default 8) |

You do **not** need to set `KEEPALIVE_URL` on Render — Render sets **`RENDER_EXTERNAL_URL`** for you; the app calls  
`{RENDER_EXTERNAL_URL}/api/v1/health/ready`.

If you created the service manually (not Blueprint), add those two vars and **Redeploy**.

After deploy, open the health URL once (or wait for the first self-ping). While the process is running, pings repeat every 8 minutes.

> If the service is **fully asleep** (zero traffic for 15+ min), the process is stopped and timers do not run. One visit (or UptimeRobot) wakes it; then self keep-alive holds it awake.

`render.yaml` in this repo already sets `KEEPALIVE_ENABLED=true` for Blueprint deploys.

**Avoid triple pings:** If Render self keep-alive is on, you do **not** need Vercel cron and GitHub Actions at the same time (optional backup only).

### B — GitHub Actions (backup, free)

1. Push the repo so `.github/workflows/api-keepalive.yml` is on GitHub.
2. GitHub repo → **Settings → Secrets and variables → Actions** → **New repository secret**
3. Name: `API_KEEPALIVE_URL`  
   Value: `https://YOUR-API.onrender.com/api/v1/health/ready`
4. **Actions** tab → open **API keep-alive** → **Run workflow** once to test.

Schedule: every 8 minutes (UTC). GitHub may delay a few minutes on busy days.

If the secret is missing, the workflow skips quietly (for local-only clones).

### C — UptimeRobot (backup, free, no code)

1. [uptimerobot.com](https://uptimerobot.com) → **Add monitor**
2. Type: **HTTP(s)**
3. URL: `https://YOUR-API.onrender.com/api/v1/health/ready`
4. Monitoring interval: **5 minutes** (free tier)

### D — Vercel Cron (optional)

`apps/web/vercel.json` calls `/api/cron/keepalive` every 8 minutes. That route uses `API_URL` to hit Render.

1. Vercel → **Environment Variables** → `CRON_SECRET` (random string) and existing `API_URL`
2. Redeploy the frontend.

Vercel may limit cron frequency on **Hobby**; if it does not run every 8 minutes, use **A** or **B**.

---

## Step 3 — Vercel (frontend) ~5 min

1. [vercel.com](https://vercel.com) → **New Project** → `himan1009/dataArena`.
2. **Root Directory:** `apps/web`
3. Environment variable:

```env
API_URL=https://dataarena-api.onrender.com
```

4. Deploy → copy site URL, e.g. `https://dataarena.vercel.app`

---

## Step 4 — Link frontend ↔ API

1. **Render** → Environment → set `FRONTEND_URL` to your exact Vercel URL (no trailing `/`).
2. **Redeploy** the API.

---

## Step 5 — Create admin

1. `https://YOUR-VERCEL-URL/register`
2. First registered user becomes **ADMIN**.

---

## Free tier expectations

| Service | What to expect |
|---------|----------------|
| **Supabase** | Free Postgres; project pauses after inactivity (wake on connect) |
| **Render** | API sleeps ~15 min idle; cold start 30–60 sec |
| **Vercel** | Good free tier for Next.js |

---

## Checklist

- [ ] Supabase project + **Direct** `DATABASE_URL`
- [ ] Render API deployed (green)
- [ ] Vercel frontend deployed
- [ ] `API_URL` on Vercel = Render URL
- [ ] `FRONTEND_URL` on Render = Vercel URL + API redeploy
- [ ] First user registered (admin)
- [ ] Keep-alive: `KEEPALIVE_ENABLED=true` on Render API (or GitHub / UptimeRobot backup)

---

## Troubleshooting

### Prisma P3009 — failed migration stuck

If a deploy failed mid-migration, Supabase keeps a failed row in `_prisma_migrations`. New deploys will not proceed until you clear it.

**Supabase → SQL Editor → New query → Run:**

```sql
DELETE FROM "_prisma_migrations"
WHERE migration_name = '20260721220000_fix_article_column_names';
```

Then **Redeploy** on Render. The fixed idempotent migration will run and succeed.

**Alternative (fresh empty project):** Supabase → Project Settings → Database → **Reset database**, then redeploy Render (all migrations run from scratch).

---

| Problem | Fix |
|---------|-----|
| `prisma migrate` failed | Use **Direct** connection (5432), not pooler (6543) |
| Build failed: `nest: not found` | Root Directory = **empty** (repo root). Build: `NPM_CONFIG_PRODUCTION=false npm install && npm run prisma:generate --workspace=api && npm run build --workspace=api` |
| `P3009` failed migrations | See below — clear failed row in Supabase, then redeploy |
| `MODULE_NOT_FOUND` / `node dist/main` | Push latest code (`tsconfig.build.json` fix). Rebuild on Render |
| `password authentication failed` | Reset DB password in Supabase → update `DATABASE_URL` |
| Can't reach database | Wake Supabase project (open dashboard) |
| Register/login fails | Wake Render API; check `API_URL` on Vercel |
| CORS | `FRONTEND_URL` must match Vercel URL exactly |

---

## Local development

Docker Postgres still works locally. See [SETUP_AND_RUN.md](./SETUP_AND_RUN.md).

To point local API at Supabase, set `DATABASE_URL` in `apps/api/.env` to your Supabase Direct URI.
