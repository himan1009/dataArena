# DataArena

AI-powered learning and practice platform for Data Engineers.

## Current Status

**Phase 1 — Foundation (in progress)**

- [x] Landing page
- [x] Authentication (register, login, logout, refresh, profile)
- [x] Post-login app shell (sidebar, dashboard, settings)
- [x] Notes & topics (public reading, categories, articles)
- [x] Author workflow (write, submit, review, edit requests)
- [x] Admin CMS (categories, topics, articles, users, inbox)
- [x] Writing standards (viewer + admin editor with live preview)
- [x] Contact & bug report forms
- [ ] Search (Meilisearch — planned)

## Tech Stack

- **Frontend:** Next.js, React, TypeScript, Tailwind CSS, shadcn/ui
- **Backend:** NestJS, Prisma, PostgreSQL
- **Infra (local):** Docker Compose for PostgreSQL + Redis (Redis reserved for future use)

## Project Structure

```
dataArena/
├── apps/
│   ├── web/                 # Next.js frontend (port 3000)
│   └── api/                 # NestJS backend (port 4000)
├── docs/                    # All project documentation
├── docker-compose.yml       # PostgreSQL + Redis
└── README.md
```

## Documentation

> **New to the project?** Start with **[docs/SETUP_AND_RUN.md](./docs/SETUP_AND_RUN.md)** for detailed setup and run instructions.

All docs are in the [`docs/`](./docs/) folder:

| File | What it contains |
|------|------------------|
| [docs/SETUP_AND_RUN.md](./docs/SETUP_AND_RUN.md) | **Detailed setup & run guide** (first time + daily start) |
| [docs/DEPLOYMENT.md](./docs/DEPLOYMENT.md) | **Production deployment** (Vercel + Render + Neon free tier) |
| [docs/DEVELOPMENT_LOG.md](./docs/DEVELOPMENT_LOG.md) | Versioned history of everything built (updated after each milestone) |
| [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md) | Full product, technical, and functional architecture |
| [docs/DataArena_Product_Documentation_v1.md](./docs/DataArena_Product_Documentation_v1.md) | Your original product vision document |

## Prerequisites

- Node.js 20+ (`node -v`)
- npm 10+ (`npm -v`)
- Docker & Docker Compose (`docker -v`)

PostgreSQL and Redis run via **Docker** — you do not need to install them separately on your machine.

---

## How to Run

### First time setup (run once)

Open a terminal and run these commands **in order**:

```bash
cd /home/himanshu-kumar/Desktop/dataArena
```

```bash
docker compose up -d
```

```bash
npm install
cd apps/api && npm install
cd ../web && npm install
```

```bash
cd /home/himanshu-kumar/Desktop/dataArena
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env.local
```

```bash
cd apps/api
npx prisma migrate deploy
```

---

### Every time you start the app

You need **3 terminals**:

#### Terminal 1 — Database (PostgreSQL + Redis)

```bash
cd /home/himanshu-kumar/Desktop/dataArena
docker compose up -d
```

#### Terminal 2 — Backend API

```bash
cd /home/himanshu-kumar/Desktop/dataArena/apps/api
npm run start:dev
```

Wait until you see the API started message.

#### Terminal 3 — Frontend

```bash
cd /home/himanshu-kumar/Desktop/dataArena/apps/web
npm run dev
```

Wait until you see:

```
Ready on http://localhost:3000
```

---

### Quick copy-paste (daily start)

**Terminal 1**
```bash
cd /home/himanshu-kumar/Desktop/dataArena && docker compose up -d
```

**Terminal 2**
```bash
cd /home/himanshu-kumar/Desktop/dataArena/apps/api && npm run start:dev
```

**Terminal 3**
```bash
cd /home/himanshu-kumar/Desktop/dataArena/apps/web && npm run dev
```

---

### Open in browser

| URL | Page |
|-----|------|
| http://localhost:3000 | Landing page |
| http://localhost:3000/register | Create account |
| http://localhost:3000/login | Log in |
| http://localhost:3000/dashboard | Dashboard (after login) |

---

### What runs where

| Service | Folder / Source | Port |
|---------|-----------------|------|
| **Frontend** | `apps/web` | 3000 |
| **Backend API** | `apps/api` | 4000 |
| **PostgreSQL** | Docker (`dataarena-postgres`) | 5432 |
| **Redis** | Docker (`dataarena-redis`) | 6379 |

---

### Stop everything

- **Frontend / API:** Press `Ctrl + C` in terminals 2 and 3
- **Database:**

```bash
cd /home/himanshu-kumar/Desktop/dataArena
docker compose down
```

---

### Troubleshooting

| Problem | Fix |
|---------|-----|
| Docker error | Start Docker Desktop / Docker daemon |
| Database connection error | Run `docker compose up -d`, then `cd apps/api && npx prisma migrate deploy` |
| Login / register not working | Make sure **both** API (port 4000) and frontend (port 3000) are running |
| Port already in use | Stop the other app using that port |

---

## Auth endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/v1/auth/register` | POST | Create account |
| `/api/v1/auth/login` | POST | Log in |
| `/api/v1/auth/logout` | POST | Log out (requires auth) |
| `/api/v1/auth/refresh` | POST | Refresh tokens |
| `/api/v1/auth/me` | GET | Get current user |

Frontend proxies auth through `/api/auth/*` so cookies work on `localhost:3000`.

## Security features

- bcrypt password hashing (12 rounds)
- JWT access tokens + rotating refresh tokens
- httpOnly cookies (not accessible via JavaScript)
- Rate limiting on auth endpoints
- Helmet security headers
- CORS restricted to frontend origin
- Input validation (class-validator + Zod)

## First user

The **first registered user** automatically becomes `ADMIN`.

## Next steps

1. Notes & topics (markdown content)
2. Search (Meilisearch)
3. Email verification

See [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md) for the full blueprint and [docs/DEVELOPMENT_LOG.md](./docs/DEVELOPMENT_LOG.md) for versioned build history.
