# DataArena API (`apps/api`)

NestJS backend for DataArena.

## Stack

- NestJS 11, Prisma 7, PostgreSQL
- JWT auth with httpOnly cookies + rotating refresh tokens
- class-validator DTOs, Helmet, rate limiting

## Local development

From the **monorepo root**, see [docs/SETUP_AND_RUN.md](../../docs/SETUP_AND_RUN.md).

Quick start (with Docker Postgres running):

```bash
cd apps/api
cp .env.example .env
npx prisma migrate deploy
npm run start:dev
```

API listens on [http://localhost:4000](http://localhost:4000) with prefix `/api/v1`.

## Environment

See `.env.example` for all variables. Required:

- `DATABASE_URL` — PostgreSQL connection string
- `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET` — min 32 chars
- `FRONTEND_URL` — e.g. `http://localhost:3000`

## Scripts

| Command | Description |
|---------|-------------|
| `npm run start:dev` | Dev server with watch |
| `npm run build` | Compile to `dist/` |
| `npm run start:prod` | Run production build |
| `npx prisma migrate deploy` | Apply migrations |
| `npm run db:seed` | Seed demo data |

## Deploy

See [docs/DEPLOYMENT.md](../../docs/DEPLOYMENT.md) — recommended: **Render** with **Neon** PostgreSQL.

Start command:

```bash
npx prisma migrate deploy && npm run start:prod
```
