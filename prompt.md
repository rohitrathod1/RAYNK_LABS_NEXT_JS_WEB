# RaYnk Labs — Master Development Prompt

> **READ THIS FILE FIRST before doing anything in this project.**
> This file controls ALL future development. Every rule here is mandatory.
> No exceptions. No shortcuts.

---

## 🧠 Project Context

| Property | Value |
|---|---|
| **Project** | RaYnk Labs Web Platform |
| **Purpose** | Student-led tech innovation lab — showcases services, projects, software, courses, team |
| **Framework** | Next.js 16 (App Router, Turbopack) |
| **Language** | TypeScript 5 (strict, zero `any`) |
| **Styling** | Tailwind CSS v4 (CSS-first, oklch color tokens) |
| **Database** | PostgreSQL (Neon) + Prisma ORM (multi-file schema) |
| **Auth** | NextAuth v5 (Credentials — email + password) |
| **Server State** | TanStack Query v5 |
| **UI State** | Redux Toolkit |
| **Uploads** | UploadThing |
| **UI Primitives** | shadcn/ui (New York, Radix) |
| **Animations** | Framer Motion |

---

## 🔥 Core Laws — NEVER BREAK

1. **Never create a page without explicit user instruction**
2. **Never create UI before the module exists**
3. **Every page triggers the full 7-step creation chain** (see Workflow)
4. **`src/app/` is routing ONLY** — no business logic, no direct DB calls
5. **All business logic lives in `src/modules/`**
6. **`src/components/` is shared only** — if 1 module uses it, it stays in the module
7. **`src/lib/` is infrastructure only** — zero domain logic
8. **Never modify `src/modules/_template/`** — copy it, never edit it
9. **Zero `any` types** — use `unknown` + type guard if needed
10. **Never skip `loading.tsx`** on pages that fetch data

---

## 📦 Module System

Every feature is a self-contained module in `src/modules/`.

### Module Structure (copy from `_template`)

```
src/modules/{feature}/
├── components/          # UI components for this feature ONLY
├── data/
│   ├── queries.ts       # TanStack Query hooks (client-side fetching)
│   └── mutations.ts     # Mutation helpers (used with useMutation)
├── actions.ts           # Server Actions — all CRUD for this feature
├── validations.ts       # Zod schemas — shared server + client
├── types.ts             # TypeScript types for this feature
├── index.ts             # Barrel export — the module's public API
└── README.md            # Module docs — fill in immediately
```

### Import Rule

```ts
// ✅ Always import from the barrel
import { getServices, ServiceCard } from "@/modules/services";

// ❌ Never import from module internals
import { getServices } from "@/modules/services/actions";
```

---

## 🗺️ Page Creation Workflow

When user says **"Create {X} page"** — execute ALL 7 steps without skipping.

### Step 1 — Create Module

```
src/modules/{x}/
├── components/
├── data/queries.ts
├── data/mutations.ts
├── actions.ts
├── validations.ts
├── types.ts
├── index.ts
└── README.md
```

### Step 2 — Add Prisma Schema

Create `prisma/schema/{x}.prisma`.

Every content model MUST have:
```prisma
model {X} {
  id        String   @id @default(cuid())
  isActive  Boolean  @default(true)
  order     Int      @default(0)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  seoId String? @unique
  seo   Seo?    @relation(fields: [seoId], references: [id])
}
```

Then run:
```bash
npm run db:generate
npm run db:push
```

### Step 3 — Create Public Page (Routing + Suspense Only)

```
src/app/(public)/{x}/
├── page.tsx          # Server component — thin wrapper only
├── loading.tsx       # Skeleton loader — MANDATORY
└── error.tsx         # Error boundary — MANDATORY
```

Page pattern:
```tsx
import type { Metadata } from "next";
import { Suspense } from "react";
import { resolveSeo } from "@/lib/seo";
import { get{X}Seo, {X}Main, {X}Skeleton } from "@/modules/{x}";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await get{X}Seo();
  return resolveSeo(seo, "{Page Title}");
}

export default async function {X}Page() {
  return (
    <Suspense fallback={<{X}Skeleton />}>
      <{X}Main />
    </Suspense>
  );
}
```

### Step 4 — Create API Routes

```
src/app/api/{x}/route.ts          # GET (public) + POST (admin)
src/app/api/{x}/[id]/route.ts     # GET + PUT + DELETE (admin)
```

### Step 5 — Create Admin Dashboard Page

```
src/app/admin/(dashboard)/{x}/
├── page.tsx
├── loading.tsx
└── error.tsx
```

### Step 6 — Create Documentation

```
docs/{x}.md   # use docs/_template.md as base — fill every section
```

### Step 7 — Update Sitemap

Add new route to `src/app/sitemap.ts`.

---

## 🏗️ Folder Rules

| Folder | Rule |
|--------|------|
| `src/app/` | Routing ONLY — `page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`, `route.ts` |
| `src/modules/` | All business logic — one folder per feature |
| `src/components/ui/` | shadcn/ui primitives only |
| `src/components/common/` | Generic shared UI (PageHeader, EmptyState, Skeleton) |
| `src/components/admin/` | Admin-only shared (Sidebar, DataTable, FormModal) |
| `src/components/layout/` | Navbar, Footer |
| `src/components/motion/` | Animation wrappers (ScrollReveal, FadeIn) |
| `src/lib/` | Infrastructure only — DB, auth, utils, seo, formatters |
| `src/hooks/` | Custom React hooks — client-side only |
| `src/store/` | Redux — UI state only (nav, modals, toggles) |
| `src/providers/` | Context providers — wrap once in root layout |
| `src/types/` | Global TypeScript — NextAuth extensions, global.d.ts |

---

## 🔐 Security Rules

```ts
// First line of EVERY admin server action or mutation endpoint:
await requireAdmin();
// Super admin only:
await requireAdmin("SUPER_ADMIN");

// Validate ALL inputs before touching the database:
const parsed = schema.safeParse(input);
if (!parsed.success) return fail("Validation failed", parsed.error.flatten().fieldErrors);

// Never select passwords:
const admin = await prisma.admin.findUnique({
  where: { id },
  select: { id: true, name: true, email: true, role: true },
});
```

---

## 🗄️ Prisma Rules

- One `.prisma` file per feature: `prisma/schema/{feature}.prisma`
- `prisma/schema/base.prisma` — generator + datasource ONLY
- `prisma/schema/auth.prisma` — Admin model ONLY
- `prisma/schema/seo.prisma` — Seo model ONLY
- Always run `npm run db:generate` after schema changes

| Field | Type | Required On |
|-------|------|-------------|
| `id` | `String @id @default(cuid())` | ALL models |
| `isActive` | `Boolean @default(true)` | All content |
| `order` | `Int @default(0)` | Sortable content |
| `createdAt` | `DateTime @default(now())` | ALL models |
| `updatedAt` | `DateTime @updatedAt` | ALL models |

---

## 🔍 SEO Rules — Every Public Page

1. `generateMetadata()` or static `metadata` export in page file
2. `Seo` DB record linked via `seoId`
3. OG image — dynamic or fallback `/og-image.png`
4. Entry in `src/app/sitemap.ts`

```ts
export async function generateMetadata(): Promise<Metadata> {
  const seo = await get{X}Seo(); // fetches from DB
  return resolveSeo(seo, "{Fallback Title}");
}
```

---

## ⚡ Performance Rules

| Rule | How |
|------|-----|
| Server Components first | Add `"use client"` only when hooks/events needed |
| Lazy load below-fold | `React.lazy` + `<Suspense fallback={<Skeleton />}>` |
| Images | Always `next/image` with explicit `width` + `height` |
| Public API caching | `fetch(url, { next: { revalidate: 60 } })` |
| Admin queries | TanStack Query `staleTime: 30_000` |
| No N+1 queries | Use Prisma `include` or `Promise.all` |

---

## 🔄 Server Actions vs API Routes

| Use | Pattern |
|-----|---------|
| Admin form mutations | Server Action in `modules/{x}/actions.ts` |
| Public data reading (SSR) | Direct Prisma inside server component or action |
| External webhooks | API Route |
| Client-side admin fetching | API Route (called by TanStack Query) |

Server Action template:
```ts
"use server";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/require-admin";
import { prisma } from "@/lib/db";
import { ok, fail } from "@/lib/action-response";
import type { ActionResponse } from "@/lib/action-response";

export async function create{X}(formData: FormData): Promise<ActionResponse<{X}>> {
  await requireAdmin();
  const parsed = {x}CreateSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return fail("Validation failed", parsed.error.flatten().fieldErrors);
  const item = await prisma.{x}.create({ data: parsed.data });
  revalidatePath("/{x}");
  revalidatePath("/admin/{x}");
  return ok(item, "{X} created");
}
```

---

## 🚨 Anti-Patterns — NEVER DO

| Wrong | Right |
|-------|-------|
| `useEffect` + `fetch` | TanStack Query `useQuery` or Server Component |
| Server data in Redux | Redux = UI state; TanStack = server data |
| Business logic in `app/` | Move to `src/modules/{x}/actions.ts` |
| Inline Zod schemas | Always in `modules/{x}/validations.ts` |
| Direct Prisma in `app/` pages | Use server action from module |
| Hardcoded public content | All content is DB-driven via CMS |
| `any` type | Use `unknown` + type guard |
| Missing `loading.tsx` | Every data-fetching page needs one |

---

## 📝 Documentation Rules

| Trigger | Create |
|---------|--------|
| New page | `docs/{page}.md` using `docs/_template.md` |
| New module | `src/modules/{x}/README.md` — fill immediately |
| New API endpoint | Document in `docs/{page}.md` → API section |
| Architecture change | Update `EXPLAIN.md` |
| New env variable | Add to `.env.example` immediately |

---

## 📋 Pre-Task Checklist

Before any feature:
- [ ] Module already in `src/modules/`?
- [ ] Prisma schema in `prisma/schema/`?
- [ ] CMS-managed or static?
- [ ] Needs public page + admin page?
- [ ] Needs SEO metadata?

---

## 📁 Module Registry

> Update when modules are created.

| Module | Status | Public Page | Admin Page | Schema |
|--------|--------|-------------|------------|--------|
| `_template` | Base | — | — | — |
