# RaYnk Labs — Web Platform

Full-stack web platform for the RaYnk Labs student innovation lab.
Public showcase + admin CMS built on Next.js 16, Prisma, and PostgreSQL.

---

## Tech Stack

| | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS v4 |
| Database | PostgreSQL (Neon) + Prisma |
| Auth | NextAuth v5 |
| State | Redux Toolkit + TanStack Query |
| Uploads | UploadThing |
| UI | Radix UI + shadcn/ui |

---

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.example .env.local
# Fill in all values in .env.local

# 3. Set up database
npm run db:generate
npm run db:push
npm run db:seed

# 4. Start dev server
npm run dev
```

- Public site → http://localhost:3000
- Admin panel → http://localhost:3000/admin/login

---

## Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Dev server (Turbopack) |
| `npm run build` | Production build |
| `npm run lint` | ESLint |
| `npm run format` | Prettier |
| `npm run db:generate` | Regenerate Prisma client |
| `npm run db:push` | Sync schema to DB (dev) |
| `npm run db:seed` | Seed initial data |
| `npm run db:studio` | Prisma Studio (visual DB) |

---

## Folder Structure

```
src/
├── app/         → Routing only
├── modules/     → Business logic (one folder per feature)
├── components/  → Shared UI
├── lib/         → Infrastructure (db, auth, utils)
├── hooks/       → Custom React hooks
├── store/       → Redux (UI state)
├── providers/   → Context providers
└── types/       → Global TypeScript
```

---

## Key Files

| File | Purpose |
|------|---------|
| [prompt.md](prompt.md) | **READ FIRST** — all development rules |
| [EXPLAIN.md](EXPLAIN.md) | Full architecture explanation |
| [docs/](docs/) | Per-page documentation |
| `.env.example` | Environment variable template |

---

## Adding a New Page

Every new page follows the **7-step workflow** in [prompt.md](prompt.md):
Module → Prisma Schema → Public Page → API Routes → Admin Page → Docs → Sitemap.
