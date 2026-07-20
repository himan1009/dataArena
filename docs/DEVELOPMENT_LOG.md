# DataArena — Development Log

> **Purpose:** A versioned history of everything built on this project.  
> **Rule:** Never delete old versions. Always append a new version when work is completed.

---

## Version 0.1 — Product Vision Defined

**Date:** Initial planning  
**Status:** Complete

### What happened
- Original product documentation created: `DataArena_Product_Documentation_v1.md`
- Defined vision: AI-powered learning platform for Data Engineers
- Defined core principles: Learn, Practice, Build, Revise, Interview, Create, Grow
- Defined V1/V2/V3 roadmap, tech stack, modules, and release strategy

### Deliverables
- Product requirements document (now in `docs/DataArena_Product_Documentation_v1.md`)

### Notes
- This version is the source of truth for product goals
- No code was written yet

---

## Version 0.4.1 — Setup & Run Documentation

**Date:** March 2026  
**Status:** Complete

### What was built
- Created `docs/SETUP_AND_RUN.md` — comprehensive setup and run guide
- Covers: prerequisites, first-time setup, 3-terminal workflow, daily start, troubleshooting, cheat sheet
- Updated `docs/README.md` and root `README.md` with links to the new guide

### Bug fix (same period)
- Fixed Prisma 7 compatibility with NestJS (PostgreSQL adapter)
- Improved frontend error messages when API is unreachable

---

## Version 0.2 — Monorepo & Landing Page

**Date:** March 2026  
**Status:** Complete

### What was built

#### Project scaffold
- Created monorepo root with npm workspaces
- Created `apps/web` — Next.js 16 app (React 19, TypeScript, Tailwind CSS v4)
- Initialized shadcn/ui (Button, Badge, Card components)
- Installed Framer Motion and Lucide React icons
- Added dark theme with cyan/blue brand colors

#### Landing page (`/`)
- Navbar with navigation links and auth CTAs
- Hero section with gradient headline and CTA buttons
- Features section (6 feature cards)
- Principles section (7 core principles)
- Roadmap section (phased build plan)
- CTA section and footer

#### Placeholder auth pages
- `/login` — placeholder page (disabled form)
- `/register` — placeholder page (disabled form)

#### Files created
```
dataArena/
├── package.json
├── .gitignore
├── apps/web/
│   ├── src/app/page.tsx
│   ├── src/app/layout.tsx
│   ├── src/app/login/page.tsx
│   ├── src/app/register/page.tsx
│   ├── src/components/landing/   (navbar, hero, features, principles, roadmap, cta, footer)
│   └── src/components/ui/        (button, badge, card)
└── README.md
```

### Bug fixes (same version)
- Fixed Base UI Button warning: replaced `Button render={<Link />}` with `Link` + `buttonVariants` for navigation links

### How to run (at this version)
```bash
cd apps/web && npm install && npm run dev
# Open http://localhost:3000
```

---

## Version 0.3 — Authentication System

**Date:** March 2026  
**Status:** Complete

### What was built

#### Infrastructure
- `docker-compose.yml` — PostgreSQL 16 + Redis 7
- Environment files: `apps/api/.env.example`, `apps/web/.env.example`

#### Backend (`apps/api`)
- NestJS 11 API server on port 4000
- Prisma ORM with PostgreSQL
- Database models: `User`, `RefreshToken`
- Auth module with full email/password flow

**API endpoints (`/api/v1/auth/*`):**
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/auth/register` | POST | Create account |
| `/auth/login` | POST | Log in |
| `/auth/logout` | POST | Log out (protected) |
| `/auth/refresh` | POST | Refresh tokens |
| `/auth/me` | GET | Get current user (protected) |

**Security implemented:**
- bcrypt password hashing (12 rounds)
- JWT access tokens (15 min) + refresh tokens (7 days)
- httpOnly secure cookies
- Refresh token rotation (old token revoked on refresh)
- Rate limiting via `@nestjs/throttler`
- Helmet security headers
- CORS restricted to frontend origin
- Input validation (class-validator on API, Zod on frontend)
- First registered user auto-assigned `ADMIN` role

#### Frontend (`apps/web`)
- Real login form with validation (`/login`)
- Real register form with password confirmation (`/register`)
- Protected dashboard page (`/dashboard`)
- Logout button component
- Auth middleware (redirects unauthenticated users)
- Next.js API route proxies (`/api/auth/*`) — solves cross-port cookie issue between :3000 and :4000

#### Files created
```
dataArena/
├── docker-compose.yml
├── apps/
│   ├── api/
│   │   ├── prisma/schema.prisma
│   │   ├── prisma/migrations/
│   │   ├── src/auth/          (controller, service, dto, guards, strategies)
│   │   ├── src/prisma/        (prisma module + service)
│   │   ├── src/app.module.ts
│   │   └── src/main.ts
│   └── web/
│       ├── src/app/dashboard/page.tsx
│       ├── src/app/api/auth/  (login, register, logout, refresh, me proxies)
│       ├── src/components/auth/ (login-form, register-form, logout-button)
│       ├── src/lib/api.ts
│       ├── src/lib/auth-schemas.ts
│       ├── src/lib/proxy.ts
│       └── src/middleware.ts
```

### How to run (at this version)
```bash
# Terminal 1
docker compose up -d

# Terminal 2
cd apps/api && npx prisma migrate deploy && npm run start:dev

# Terminal 3
cd apps/web && npm run dev
```

### Known limitations (to address in future versions)
- Email verification not implemented yet
- Password reset / forgot password not implemented yet
- OAuth (Google/GitHub) not implemented yet
- Redis configured in Docker but not yet used in API logic
- No automated tests for auth flow yet

---

## Version 0.4 — Documentation Organization

**Date:** March 2026  
**Status:** Complete

### What was built
- Created `docs/` folder for all project documentation
- Moved `DataArena_Product_Documentation_v1.md` → `docs/`
- Created `docs/DEVELOPMENT_LOG.md` (this file)
- Created `docs/ARCHITECTURE.md` (full architecture reference)
- Created `docs/README.md` (documentation index)

---

## Version 0.5 — Post-Login App Shell & Interior Architecture

**Date:** March 2026  
**Status:** Complete

### What was built

#### Authenticated app layout (`(app)` route group)
- Shared layout with sidebar + header for all logged-in pages
- Centralized auth via `lib/auth-server.ts` (`getCurrentUser`, `requireUser`)
- Navigation config in `config/app-navigation.ts`

#### App shell components
- `AppSidebar` — navigation with Learn + Account sections, user info, mobile support
- `AppHeader` — page title (auto from route), user dropdown, logout
- `AppShell` — desktop sidebar + responsive mobile sheet menu
- `ComingSoon` — reusable placeholder for upcoming modules

#### Pages (all protected)
| Route | Status |
|-------|--------|
| `/dashboard` | Overview with stats, quick actions, roadmap |
| `/notes` | Knowledge Engine hub with category placeholders |
| `/practice` | Coming soon placeholder |
| `/search` | Coming soon placeholder |
| `/bookmarks` | Coming soon placeholder |
| `/copilot` | Coming soon placeholder |
| `/settings` | Profile info (name, email, role) |
| `/admin` | Admin-only coming soon (ADMIN role) |

#### Middleware
- Extended to protect all app routes (`/notes`, `/practice`, `/search`, etc.)
- Redirects unauthenticated users to `/login` with `?from=` param

#### Files created
```
apps/web/src/
├── app/(app)/
│   ├── layout.tsx
│   ├── dashboard/page.tsx
│   ├── notes/page.tsx
│   ├── practice/page.tsx
│   ├── search/page.tsx
│   ├── bookmarks/page.tsx
│   ├── copilot/page.tsx
│   ├── settings/page.tsx
│   └── admin/page.tsx
├── components/app/
│   ├── app-shell.tsx
│   ├── app-sidebar.tsx
│   ├── app-header.tsx
│   ├── coming-soon.tsx
│   └── use-page-meta.ts
├── config/app-navigation.ts
└── lib/auth-server.ts
```

---

## Version 0.5.1 — Full UI Revamp (Modern Minimalist)

**Date:** March 2026  
**Status:** Complete

### What changed
- New design system: glass panels, gradient text, mesh backgrounds, refined dark palette
- Shared components: `MeshBackground`, `Logo`, `AuthLayout`, utility classes in `globals.css`
- **Landing page** — cleaner hero, pill principles, glass feature cards, refined CTA
- **Auth pages** — split-screen layout with branding panel (desktop)
- **App interior** — revamped sidebar, header, dashboard, notes, settings, coming-soon pages
- Consistent cyan/teal accent, subtle grid background, hover glow effects

---

## Version 0.5.2 — UI Polish & Alignment Pass

**Date:** July 2026  
**Status:** Complete

### What changed
- Added shared layout primitives: `PageContainer`, `Section`, `SectionHeader`, `PageHeader`, `IconBox`
- Refined `globals.css` utilities: `.glass-panel-hover`, `.surface-input`, `.nav-active`
- **Landing** — bento-style features grid, stats strip in hero, improved section spacing
- **Auth** — split-screen branding panel with feature highlights, glass form card
- **App shell** — fixed sidebar width, active nav indicator, user card in sidebar footer
- **Dashboard** — stat cards with accent icons, quick-action grid, roadmap section
- **Notes / Settings / Coming soon** — consistent headers, aligned cards, step indicators
- Build verified: `npm run build` passes

---

## Version 0.6 — Notes & Topics

**Date:** July 2026  
**Status:** Complete

### What was built

#### Database
- Prisma models: `Category`, `Topic`, `Article`
- Migration: `20260720120000_notes_content`
- Seed script with 4 categories, sample topics, and markdown articles

#### API (`apps/api`)
- `NotesModule` with JWT-protected read endpoints
- Admin CRUD endpoints (ADMIN role only)
- `RolesGuard` + `@Roles('ADMIN')` decorator

#### Frontend (`apps/web`)
- Notes browsing: `/notes` → category → topic → article
- Markdown article reader with prev/next navigation
- API proxy: `/api/notes/*`
- Admin CMS page for creating categories, topics, and articles

### API endpoints
- `GET /notes/categories`
- `GET /notes/categories/:slug`
- `GET /notes/categories/:slug/topics/:topicSlug`
- `GET /notes/categories/:slug/topics/:topicSlug/articles/:articleSlug`
- `POST/PATCH/DELETE /notes/admin/*` (admin only)

### Setup required
```bash
cd apps/api && npx prisma migrate deploy && npm run db:seed
cd apps/web && npm install
```

---

## Version 0.6.1 — Author Workflow & Review System

**Date:** July 2026  
**Status:** Complete

### What was built
- **EDITOR role** for content authors
- Article workflow: `DRAFT → SUBMITTED → PUBLISHED` (or `CHANGES_REQUESTED` / `REJECTED`)
- Author workspace at `/write` with markdown editor + live preview
- Admin review queue at `/admin/reviews` (approve, request changes, reject)
- LinkedIn profile on user account → shown in article credit section
- 10 open topics seeded for authors to pick and write on
- Dummy editor accounts and one submitted article for review demo

### Demo accounts
- `priya@dataarena.dev` / `password123` (EDITOR)
- `rahul@dataarena.dev` / `password123` (EDITOR)
- `ananya@dataarena.dev` / `password123` (EDITOR)

### Setup
```bash
cd apps/api && npx prisma migrate deploy && npm run db:seed
```

---

## Version 0.6.2 — Admin User Management & Permanent Author Credits

**Date:** July 2026  
**Status:** Complete

### What was built
- **Admin user management** at `/admin/users`
  - Promote users to `EDITOR` for contributor work
  - Demote back to `USER` when their job is done
  - Deactivate / reactivate accounts (blocks login, revokes sessions)
- **Permanent author attribution** on published articles
  - Name + LinkedIn snapshot saved at publish time
  - Credits remain on live articles even after deactivation
- Auth guards reject login and JWT validation for deactivated users
- Migration backfills snapshots for existing published articles

### API endpoints
- `GET /admin/users` — list users with role, status, published article count
- `PATCH /admin/users/:id/role` — assign `USER` or `EDITOR` (not `ADMIN`)
- `PATCH /admin/users/:id/status` — activate / deactivate user

### Setup
```bash
cd apps/api && npx prisma migrate deploy
```

---

### Version 0.7 — Search
- Meilisearch integration
- Unified search across notes and topics

### Version 0.7 — Bookmarks & Progress
- Bookmark topics/articles
- Reading progress tracking

### Version 0.8 — AI Copilot
- AI provider abstraction layer
- Contextual side assistant on content pages

### Version 0.9 — Practice Engines
- SQL practice sandbox
- Python for Data Engineers exercises
- PySpark practice environment

### Version 1.0 — V1 Release
- Full V1 feature set per product documentation
- Admin CMS panel
- Production deployment (Vercel + Railway)

---

## Changelog Summary

| Version | Focus | Status |
|---------|-------|--------|
| 0.1 | Product vision | Done |
| 0.2 | Landing page + monorepo | Done |
| 0.3 | Authentication | Done |
| 0.4.1 | Setup documentation + Prisma fix | Done |
| 0.5 | Post-login app shell & interior | Done |
| 0.5.1 | Full UI revamp (modern minimalist) | Done |
| 0.5.2 | UI polish & alignment pass | Done |
| 0.6 | Notes & topics (database) | Done |
| 0.6.1 | Author workflow & review system | Done |
| 0.6.2 | Admin user management & permanent credits | Done |
| 0.7 | Search | Planned |
| 0.8 | Bookmarks & progress | Planned |
| 0.9 | AI copilot | Planned |
| 1.0 | V1 release | Planned |
