# RaYnk Labs — Architecture Explanation

> Complete technical reference. Read to understand WHY the project is structured this way.
> Update this file when architectural decisions change.

---

## 1. Project Overview

RaYnk Labs is a **dual-purpose platform**:

- **Public site** — Marketing and showcase for a student-led innovation lab. Visitors browse services, projects, courses, software, and team.
- **Admin CMS** — Dashboard for lab members to manage all public content, internal tasks, requests, and settings.

All public content is **database-driven** — admins update everything through the UI, no code changes needed.

---

## 2. Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| Framework | Next.js 16 (App Router) | Full-stack React, RSC, Server Actions |
| Language | TypeScript 5 strict | End-to-end type safety |
| Styling | Tailwind CSS v4 | CSS-first config, oklch design tokens |
| UI Primitives | Radix UI + shadcn/ui | Accessible, unstyled components |
| Animations | Framer Motion | Scroll reveals, page transitions |
| Database | PostgreSQL (Neon) | Relational, serverless-friendly |
| ORM | Prisma v7 | Type-safe queries, multi-file schema |
| Auth | NextAuth v5 | JWT sessions, Credentials provider |
| Server State | TanStack Query v5 | Caching, background refetch |
| UI State | Redux Toolkit v2 | Mobile nav, modals, sidebar toggles |
| Forms | React Hook Form + Zod | Performant, runtime-validated |
| Uploads | UploadThing | Type-safe CDN file uploads |
| Toasts | Sonner | Notification system |
| Theme | next-themes | SSR-safe dark/light mode |
| Rate Limiting | Upstash Redis | IP-based sliding window (prod) |

---

## 3. Folder Structure

```
RAYNK_LABS_NEXT_JS_WEB/
│
├── prisma/
│   ├── schema/
│   │   ├── base.prisma       # generator + datasource ONLY
│   │   ├── auth.prisma       # Admin model
│   │   ├── seo.prisma        # SEO model
│   │   └── {feature}.prisma  # one per feature, created with page
│   └── seed.ts
│
├── public/                   # Static assets
├── src/
│   ├── app/                  # ROUTING ONLY — no logic here
│   │   ├── (public)/         # Public marketing pages + layout
│   │   ├── admin/
│   │   │   ├── (dashboard)/  # Protected admin dashboard
│   │   │   └── login/        # Login page
│   │   ├── api/              # REST API endpoints
│   │   ├── layout.tsx        # Root layout (providers, fonts, toaster)
│   │   ├── globals.css       # Tailwind + design tokens
│   │   ├── robots.ts         # Dynamic robots.txt
│   │   ├── sitemap.ts        # Dynamic sitemap.xml
│   │   └── not-found.tsx     # 404 page
│   │
│   ├── modules/              # ALL BUSINESS LOGIC — one folder per feature
│   │   ├── _template/        # Copy this to create any module
│   │   └── {feature}/        # Created per page (7-step workflow)
│   │
│   ├── components/           # SHARED UI — used by 2+ modules
│   │   ├── ui/               # shadcn/ui primitives
│   │   ├── common/           # PageHeader, EmptyState, Skeleton
│   │   ├── admin/            # Sidebar, DataTable, FormModal
│   │   ├── layout/           # Navbar, Footer
│   │   ├── motion/           # ScrollReveal, FadeIn, StaggerChildren
│   │   └── features/         # Cross-feature components
│   │
│   ├── lib/                  # INFRASTRUCTURE — zero domain logic
│   │   ├── db.ts             # Prisma singleton
│   │   ├── auth.ts           # NextAuth full config (Node)
│   │   ├── auth.config.ts    # NextAuth edge-safe config
│   │   ├── require-admin.ts  # Auth guard for actions + routes
│   │   ├── seo.ts            # resolveSeo() for metadata
│   │   ├── utils.ts          # cn() utility
│   │   ├── constants.ts      # SITE_NAME, ITEMS_PER_PAGE, etc.
│   │   ├── formatters.ts     # formatDate, slugify, truncate
│   │   ├── action-response.ts # ok() / fail() typed wrappers
│   │   ├── errors.ts         # Custom error classes
│   │   ├── animation-variants.ts # Framer Motion presets
│   │   ├── rate-limit.ts     # Upstash Redis (prod)
│   │   ├── rate-limit-local.ts # In-memory (dev/middleware)
│   │   └── uploadthing.ts    # UploadThing file router
│   │
│   ├── hooks/                # Custom React hooks (client)
│   ├── store/                # Redux (UI state only)
│   │   ├── index.ts
│   │   ├── provider.tsx
│   │   └── slices/ui.slice.ts
│   ├── providers/            # Context providers
│   │   ├── index.ts          # Composite Providers component
│   │   ├── query-provider.tsx
│   │   ├── session-provider.tsx
│   │   └── theme-provider.tsx
│   ├── types/                # Global TypeScript
│   │   ├── next-auth.d.ts
│   │   └── global.d.ts
│   └── middleware.ts         # Edge: rate limit + CSRF + auth
│
├── docs/                     # Per-page documentation
│   └── _template.md
├── prompt.md                 # 🔥 Master dev rules (READ FIRST)
├── EXPLAIN.md                # This file
├── README.md                 # Setup guide
└── .env.example
```

---

## 4. Module System

Every feature is a **self-contained module**. The app router just calls into modules — it owns zero logic.

**Why?** Without modules, as the codebase grows, logic scatters across `pages/`, `hooks/`, and `utils/`. With modules, delete `src/modules/services/` and the services feature is completely gone.

### Inside a Module

| File | Contains |
|------|----------|
| `actions.ts` | Server Actions — all CRUD. Always starts with `requireAdmin()`. Always validates with Zod. Always calls `revalidatePath()`. |
| `validations.ts` | Zod schemas — same schema validates both server and client, no duplication. |
| `types.ts` | TypeScript interfaces for this feature only. |
| `data/queries.ts` | TanStack Query hooks for admin panel real-time data. |
| `data/mutations.ts` | Mutation helpers for `useMutation` calls. |
| `index.ts` | Public contract — only what consumers need is exported. |

---

## 5. Data Flow

### Public Page (SSR)

```
Browser → Next.js RSC page
    → Server Action / Direct Prisma query
    → Neon PostgreSQL
    → Render HTML
    → Stream to browser (zero client JS for read-only content)
```

Public pages use ISR: `next: { revalidate: 60 }` — static HTML, refreshed every 60 seconds.

### Admin Dashboard (Client + TanStack Query)

```
Client Component mounts
    → useQuery("/api/services")
    → fetch to Next.js Route Handler (JWT cookie auto-sent)
    → requireAdmin() check → DB query → JSON
    → TanStack Query caches response
    → Re-renders UI
```

### Admin Mutation (Server Action)

```
Form submit → Server Action called directly
    → requireAdmin()
    → Zod validation
    → Prisma mutation
    → revalidatePath() (clears ISR cache)
    → Response → TanStack Query invalidates
    → UI refetches fresh data
```

---

## 6. API Design

### Convention

```
GET    /api/{resource}          Public — list all
POST   /api/{resource}          Admin — create
GET    /api/{resource}/[id]     Public — get one
PUT    /api/{resource}/[id]     Admin — update
DELETE /api/{resource}/[id]     Admin — delete
```

### Response Envelope

```ts
// Success
{ success: true, data: T }
{ success: true, data: T, meta: { total, page, perPage } }

// Error
{ success: false, error: string }
{ success: false, error: string, issues: Record<string, string[]> }
```

---

## 7. Auth System (Three Layers)

### Layer 1 — Edge Middleware

Runs at Vercel edge before request hits the server.
- Validates JWT from `auth_session` cookie
- Redirects unauthenticated from `/admin/*` to `/admin/login`
- Returns 401 JSON for unauthenticated API calls
- Rate limits by IP (in-memory dev, Upstash prod)
- CSRF origin check on mutations

Uses `auth.config.ts` (edge-safe — no Prisma, no bcrypt).

### Layer 2 — Dashboard Layout

Server-side check in `app/admin/(dashboard)/layout.tsx`.
- Calls `auth()` for full session
- Verifies `ADMIN` or `SUPER_ADMIN` role
- Redirects if check fails

### Layer 3 — Per-Action Guard

Every server action and admin route handler:
```ts
const session = await requireAdmin(); // throws 401/403 if invalid
```

### Roles

| Role | Access |
|------|--------|
| `ADMIN` | Manage content, own tasks, submit requests |
| `SUPER_ADMIN` | All + approve admins + manage all requests |

---

## 8. SEO System

Every public page has **database-driven SEO**.

```prisma
model Seo {
  id          String  @id @default(cuid())
  page        String  @unique  // "home", "services", etc.
  title       String?
  description String?
  keywords    String?
  ogImage     String?
  noIndex     Boolean @default(false)
}
```

Usage in every page:
```ts
export async function generateMetadata(): Promise<Metadata> {
  const seo = await getPageSeo("services");
  return resolveSeo(seo, "Our Services"); // fallback title
}
```

Admin can override any page's title, description, OG image from the dashboard without touching code.

---

## 9. State Management

**Two systems, clear separation:**

| State Type | Tool | Examples |
|---|---|---|
| UI toggles | Redux Toolkit | `mobileNavOpen`, `activeModal`, `sidebarCollapsed` |
| Server data | TanStack Query | Services list, submissions, admin tasks |

**Rule:** Server data never goes in Redux. UI state never goes in TanStack Query.

---

## 10. Database Strategy

**Neon PostgreSQL** — serverless, scales to zero, no cold start penalty for DB connections.

**Prisma v7 with native pg adapter** — better connection pooling than default connector:
```ts
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
new PrismaClient({ adapter });
```

**Multi-file schema** — one `.prisma` file per feature:
- Clean git diffs (only changed feature schema)
- Easy to find models
- Logical separation

**Singleton pattern** — prevents connection pool exhaustion in dev HMR.

---

## 11. Upload System

**UploadThing** — files stored on CDN, not in the repo.

Flow:
```
Admin picks file → UploadThing React component
    → POST /api/uploadthing
    → Auth check in middleware callback
    → File uploaded to CDN
    → URL returned to client
    → URL saved to DB field
```

---

## 12. Performance

| Technique | Implementation |
|---|---|
| Server Components first | Default; `"use client"` only when needed |
| ISR | `next: { revalidate: 60 }` on public endpoints |
| Lazy loading | `React.lazy` + `<Suspense>` for below-fold sections |
| Image optimization | `next/image` always, explicit dimensions |
| Bundle size | `optimizePackageImports` in `next.config.ts` |
| Query caching | TanStack Query `staleTime: 30_000` |

---

## 13. Styling System

Tailwind CSS v4 — CSS-first, no `tailwind.config.ts`.

Design tokens via CSS variables in `globals.css` using oklch color space:
```css
:root {
  --primary: oklch(0.546 0.245 262.881);
  --background: oklch(0.985 0.002 286);
}
.dark {
  --primary: oklch(0.623 0.214 259.815);
  --background: oklch(0.141 0.005 285.823);
}
```

Always use semantic classes: `bg-background`, `text-foreground`, `border-border`.
Never hardcode: `bg-white`, `text-black`, `border-gray-200`.

---

## 14. Security

```
Client Request
    ↓ [1] Middleware: rate limit + CSRF + JWT
    ↓ [2] Layout: session verify + role check
    ↓ [3] Action/Route: requireAdmin() + Zod validation
    ↓ Prisma parameterized query
    ↓ Database
```

- HTTP-only JWT cookie (no localStorage)
- SameSite=Lax (CSRF protection)
- Zod validation on all inputs (no raw DB writes)
- Prisma ORM (no SQL injection possible)

---

*Update this document whenever architecture changes.*
