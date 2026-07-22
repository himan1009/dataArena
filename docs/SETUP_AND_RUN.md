# DataArena — Setup & Run Guide

> **Purpose:** Step-by-step instructions for anyone setting up and running DataArena locally.  
> **Audience:** Developers, contributors, and anyone cloning this project.

---

## Table of Contents

1. [What You Are Running](#1-what-you-are-running)
2. [Prerequisites](#2-prerequisites)
3. [First Time Setup](#3-first-time-setup)
4. [How Many Terminals to Open](#4-how-many-terminals-to-open)
5. [Every Time You Start the App](#5-every-time-you-start-the-app)
6. [Verify Everything Works](#6-verify-everything-works)
7. [How to Stop](#7-how-to-stop)
8. [Project URLs](#8-project-urls)
9. [Environment Files](#9-environment-files)
10. [Troubleshooting](#10-troubleshooting)
11. [Quick Reference Cheat Sheet](#11-quick-reference-cheat-sheet)
12. [Production Deployment](#12-production-deployment)

---

## 1. What You Are Running

DataArena is a **monorepo** with multiple services that work together:

```
┌─────────────────────────────────────────────────────────────┐
│                        YOUR MACHINE                          │
│                                                              │
│  Terminal 3          Terminal 2          Terminal 1        │
│  ┌──────────┐        ┌──────────┐        ┌──────────────┐   │
│  │ Frontend │───────►│ Backend  │───────►│  PostgreSQL  │   │
│  │ Next.js  │        │ NestJS   │        │  + Redis     │   │
│  │ :3000    │        │ :4000    │        │  (Docker)    │   │
│  └──────────┘        └──────────┘        └──────────────┘   │
│       ▲                     ▲                    ▲           │
│       │                     │                    │           │
│   Browser opens         API handles          Database       │
│   localhost:3000        auth, users          stores data      │
└─────────────────────────────────────────────────────────────┘
```

| Service | Technology | Port | Where it runs |
|---------|-----------|------|---------------|
| **Frontend** | Next.js (React) | `3000` | `apps/web` — run with `npm run dev` |
| **Backend API** | NestJS | `4000` | `apps/api` — run with `npm run start:dev` |
| **PostgreSQL** | Database | `5432` | Docker container — stores users, tokens, future content |
| **Redis** | Cache (future use) | `6379` | Docker container — prepared for caching & queues |

> **Important:** PostgreSQL and Redis are **not installed on your system directly**. They run inside **Docker containers** defined in `docker-compose.yml`.

---

## 2. Prerequisites

Install these **before** starting:

### Required software

| Software | Minimum version | Check command | Install |
|----------|----------------|---------------|---------|
| **Node.js** | 20+ | `node -v` | [nodejs.org](https://nodejs.org/) |
| **npm** | 10+ | `npm -v` | Comes with Node.js |
| **Docker** | Latest | `docker -v` | [docker.com](https://www.docker.com/products/docker-desktop/) |
| **Docker Compose** | Latest | `docker compose version` | Comes with Docker Desktop |

### Verify prerequisites

Open a terminal and run:

```bash
node -v    # Should show v20.x.x or higher
npm -v     # Should show 10.x.x or higher
docker -v  # Should show Docker version
```

If Docker is not running, start **Docker Desktop** before proceeding.

---

## 3. First Time Setup

> Run these steps **once** when you clone or download the project for the first time.

### Step 1 — Go to the project folder

```bash
cd path/to/dataArena
```

Replace `path/to/dataArena` with your actual project path.  
Example: `cd ~/Desktop/dataArena`

---

### Step 2 — Start the database (PostgreSQL + Redis)

```bash
docker compose up -d
```

**What this does:**
- Downloads PostgreSQL and Redis Docker images (first time only — may take a few minutes)
- Starts two containers: `dataarena-postgres` and `dataarena-redis`
- `-d` means run in the background (detached mode)

**Verify it worked:**
```bash
docker compose ps
```

You should see both containers with status `running`:

```
NAME                 STATUS
dataarena-postgres   running
dataarena-redis      running
```

---

### Step 3 — Install dependencies

Run from the **project root**:

```bash
npm install
```

Then install dependencies for each app:

```bash
cd apps/api && npm install
cd ../web && npm install
cd ../..
```

**What this does:**
- Installs all Node.js packages for the monorepo, API, and frontend

---

### Step 4 — Create environment files

From the **project root**:

```bash
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env.local
```

**What this does:**
- Creates local config files with database URLs, JWT secrets, and API URLs
- These files are **not committed to git** (they contain local settings)

---

### Step 5 — Run database migrations

```bash
cd apps/api
npx prisma migrate deploy
```

**What this does:**
- Creates database tables (`users`, `refresh_tokens`) in PostgreSQL
- Only needs to run once (or when new migrations are added)

**Expected output:**
```
Applying migration `20260320120000_init_auth`
All migrations have been successfully applied.
```

---

### Step 6 — First run (see Section 5)

After first-time setup, follow [Every Time You Start the App](#5-every-time-you-start-the-app) to launch all services.

---

## 4. How Many Terminals to Open

You need **3 separate terminal windows/tabs** every time you run DataArena:

```
┌─────────────────────────────────────────────────────────┐
│  TERMINAL 1          TERMINAL 2          TERMINAL 3    │
│  ───────────         ───────────         ───────────    │
│  Database            Backend API         Frontend       │
│  (Docker)            (NestJS)            (Next.js)      │
│                                                         │
│  docker compose      npm run start:dev   npm run dev    │
│  up -d               (in apps/api)       (in apps/web)  │
│                                                         │
│  Run once per        Keep running        Keep running   │
│  session             (don't close)       (don't close)  │
└─────────────────────────────────────────────────────────┘
```

| Terminal | Folder | Command | When to close |
|----------|--------|---------|---------------|
| **1** | Project root | `docker compose up -d` | After it finishes (runs in background) |
| **2** | `apps/api` | `npm run start:dev` | When you're done working (Ctrl+C) |
| **3** | `apps/web` | `npm run dev` | When you're done working (Ctrl+C) |

> **Tip:** Terminals 2 and 3 must stay open while you use the app. Closing them stops the API or frontend.

---

## 5. Every Time You Start the App

### Terminal 1 — Start database

```bash
cd path/to/dataArena
docker compose up -d
```

Wait for:
```
✔ Container dataarena-postgres Running
✔ Container dataarena-redis    Running
```

You can close this terminal after — Docker runs in the background.

---

### Terminal 2 — Start backend API

```bash
cd path/to/dataArena/apps/api
npm run start:dev
```

**Wait until you see:**
```
[Nest] LOG [NestApplication] Nest application successfully started
```

> **Do not close this terminal.** The API must keep running.

If you see errors instead, check [Troubleshooting](#10-troubleshooting).

---

### Terminal 3 — Start frontend

```bash
cd path/to/dataArena/apps/web
npm run dev
```

**Wait until you see:**
```
▲ Next.js 16.x.x
- Local: http://localhost:3000
✓ Ready
```

> **Do not close this terminal.** The frontend must keep running.

---

### Open the app

Go to **http://localhost:3000** in your browser.

---

## 6. Verify Everything Works

### Checklist

| Step | Action | Expected result |
|------|--------|-----------------|
| 1 | Open http://localhost:3000 | Landing page loads |
| 2 | Click **Get started** or go to `/register` | Registration form appears |
| 3 | Create account (password min 8 chars) | Redirected to `/dashboard` |
| 4 | Click **Log out** | Redirected to `/login` |
| 5 | Log in with same credentials | Back on `/dashboard` |

### Quick health checks (optional)

**Check API is running:**
```bash
curl http://localhost:4000/api/v1/auth/me
```
Expected: `401 Unauthorized` (means API is up — just not logged in)

**Check database is running:**
```bash
docker compose ps
```
Expected: Both containers `running`

---

## 7. How to Stop

### Stop frontend and API
In **Terminal 2** and **Terminal 3**, press:
```
Ctrl + C
```

### Stop database (optional)
```bash
cd path/to/dataArena
docker compose down
```

> **Note:** `docker compose down` stops containers but **keeps your data**. Your registered users and data remain safe.

### Stop and delete all data (careful!)
```bash
docker compose down -v
```
Only use this if you want to completely reset the database.

---

## 8. Project URLs

| URL | Description | Auth required |
|-----|-------------|---------------|
| http://localhost:3000 | Landing page | No |
| http://localhost:3000/register | Create account | No |
| http://localhost:3000/login | Log in | No |
| http://localhost:3000/dashboard | User dashboard | Yes |
| http://localhost:4000/api/v1 | Backend API base | — |

### API auth endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/v1/auth/register` | POST | Create account |
| `/api/v1/auth/login` | POST | Log in |
| `/api/v1/auth/logout` | POST | Log out |
| `/api/v1/auth/refresh` | POST | Refresh session |
| `/api/v1/auth/me` | GET | Get current user |

> The frontend uses `/api/auth/*` routes that proxy to the backend so cookies work correctly on port 3000.

---

## 9. Environment Files

### `apps/api/.env` (Backend)

```env
DATABASE_URL="postgresql://dataarena:dataarena_dev@localhost:5432/dataarena?schema=public"
REDIS_URL="redis://localhost:6379"
PORT=4000
FRONTEND_URL="http://localhost:3000"
JWT_ACCESS_SECRET="change-me-access-secret-min-32-chars-long"
JWT_REFRESH_SECRET="change-me-refresh-secret-min-32-chars-long"
```

### `apps/web/.env.local` (Frontend)

```env
NEXT_PUBLIC_API_URL="http://localhost:4000"
```

> Copy from `.env.example` files if these don't exist. Never commit real `.env` files to git.

### Database credentials (Docker)

| Setting | Value |
|---------|-------|
| Host | `localhost` |
| Port | `5432` |
| Database | `dataarena` |
| Username | `dataarena` |
| Password | `dataarena_dev` |

---

## 10. Troubleshooting

### "Request failed" on register/login

**Cause:** Backend API is not running on port 4000.

**Fix:**
1. Open Terminal 2
2. Run `cd apps/api && npm run start:dev`
3. Wait for `Nest application successfully started`
4. Try again

---

### API crashes with Prisma / module errors

**Fix:**
```bash
cd apps/api
npx prisma generate
npm run build
npm run start:dev
```

---

### `docker compose` command not found

**Cause:** Docker is not installed or not running.

**Fix:**
1. Install [Docker Desktop](https://www.docker.com/products/docker-desktop/)
2. Start Docker Desktop
3. Try again

---

### Database connection error

**Fix:**
```bash
# Start database
docker compose up -d

# Re-run migrations
cd apps/api
npx prisma migrate deploy

# Restart API
npm run start:dev
```

---

### Port already in use

**Error:** `EADDRINUSE: address already in use :::3000` or `:::4000`

**Fix:** Another app is using that port. Either:
- Stop the other app, or
- Kill the process: `lsof -i :3000` then `kill -9 <PID>`

---

### Login works but dashboard redirects to login

**Cause:** Cookies not being set properly.

**Fix:**
1. Make sure you're accessing `http://localhost:3000` (not `127.0.0.1` or another port)
2. Make sure both API and frontend are running
3. Clear browser cookies for localhost and try again

---

### First registered user

The **first user to register** automatically gets the `ADMIN` role. All subsequent users get `USER` role.

---

## 11. Quick Reference Cheat Sheet

### First time (run once)

```bash
cd path/to/dataArena
docker compose up -d
npm install && cd apps/api && npm install && cd ../web && npm install && cd ../..
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env.local
cd apps/api && npx prisma migrate deploy
```

### Every day (3 terminals)

**Terminal 1:**
```bash
cd path/to/dataArena && docker compose up -d
```

**Terminal 2:**
```bash
cd path/to/dataArena/apps/api && npm run start:dev
```

**Terminal 3:**
```bash
cd path/to/dataArena/apps/web && npm run dev
```

### Stop

```bash
# Terminals 2 & 3: Ctrl + C

# Stop database:
cd path/to/dataArena && docker compose down
```

### Open app

**http://localhost:3000**

---

## 12. Production Deployment

For deploying to production (Vercel + Render + Neon free tier), see **[DEPLOYMENT.md](./DEPLOYMENT.md)**.

---

*Last updated: July 2026 — Version 0.6.3*
