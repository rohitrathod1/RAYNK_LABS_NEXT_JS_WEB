# RaYnk Labs — Master Build System

> **This file is your master instruction set.** Share this with Claude Code at the start of every session.
> When you say "create the home page" or "create the about page", the exact 13-step system below runs in full.
> No partial pages. No skipping steps. No shortcuts.

---

## Quick Reference

- **Architecture:** See `EXPLAIN.md` for full tech stack, folder structure, and system details
- **Admin Styling:** Follow the existing admin dashboard at `src/app/admin/(dashboard)/layout.tsx` — sidebar, topbar, card-grid, forms, tables
- **Source of truth for admin UI patterns:** The existing `/admin` page and admin layout inside this project

---

## Project Context

**What:** Build raynklabs.com — a student-led tech innovation lab platform with a full CMS-powered admin dashboard, services showcase, project portfolio, blog, team, careers, and community.

**Core Principle:** Every feature is a self-contained module. The admin can manage the ENTIRE website from the dashboard — zero code changes needed for content updates.

---

## Tech Stack (Confirmed)

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16+ (App Router, TypeScript 5, Turbopack) |
| Database | PostgreSQL (Neon) + Prisma ORM v7 (native `pg` adapter) |
| Auth | NextAuth v5 (JWT strategy, Credentials + env fallback) |
| UI | shadcn/ui (New York) + Tailwind CSS v4 (oklch color tokens) |
| Validation | Zod + React Hook Form (@hookform/resolvers) |
| File Uploads | Custom `/api/upload` + Sharp (resize → WebP, EXIF strip) |
| Rate Limiting | In-memory fixed-window (`src/lib/rate-limit-local.ts`) — zero external deps |
| Animations | Framer Motion |
| UI State | Redux Toolkit (modals, sidebar, theme) |
| Server State | TanStack React Query v5 |
| Notifications | Sonner (toasts) |
| Icons | Lucide React |
| Theme | next-themes (dark/light, class strategy) |
| Formatting | Prettier + prettier-plugin-tailwindcss |

### NOT in this project

- ~~UploadThing~~ — replaced by custom `/api/upload` route with Sharp
- ~~Upstash Redis~~ — replaced by in-memory rate limiter (`src/lib/rate-limit-local.ts`)
- ~~Sentry~~ — not needed at this stage
- ~~TipTap~~ — plain textarea for blog content (upgrade later if needed)

---

## Architecture: Feature-Module Based

```
src/
  app/           # THIN pages — routing + imports from modules only
  modules/       # FEATURE MODULES — all business logic lives here
  components/    # SHARED components (used across 2+ modules)
  lib/           # INFRASTRUCTURE (db, auth, utils, constants, rate-limit)
  store/         # Redux Toolkit (UI state only)
  hooks/         # Shared hooks (use-intersection, use-media-query, etc.)
  providers/     # React context providers
  middleware.ts  # Edge auth + rate limiting
```

### Module Structure (every module follows this exactly)

```
src/modules/{feature}/
  |-- components/
  |   |-- {Section1}.tsx
  |   |-- {Section2}.tsx
  |   |-- main.tsx              # Arranges all sections with lazy loading
  |   |-- index.ts              # Barrel export for components
  |-- actions.ts                # Server actions — the ONLY write path from client
  |-- validations.ts            # Zod schemas (reused in actions + API routes)
  |-- types.ts                  # TypeScript interfaces matching DB/JSON structure
  |-- data/
  |   |-- queries.ts            # DB read operations (used by Server Components)
  |   |-- mutations.ts          # DB write operations (called only from actions)
  |   |-- defaults.ts           # Default content + defaultSeo fallback
  |-- index.ts                  # Module barrel export
```

### Module Rules

```
RULE 1: A module ONLY imports from @/lib/* and @/components/* (shared infra)
RULE 2: A module CAN import from another module's index.ts (barrel only, not internal files)
RULE 3: A module NEVER imports from another module's internal files (actions, data, types)
RULE 4: If a component is used in 2+ modules → move it to @/components/common/
RULE 5: Every folder has an index.ts barrel export
RULE 6: /app pages are THIN — only import from modules, add metadata, return JSX
RULE 7: NEVER put business logic in /app pages
```

---

## How to Create ANY Page (Master Workflow — 13 Steps)

When I say **"create the {page} page"**, produce ALL of the following in order.
**Non-negotiable — every step, every time.**

---

### Step 1 — Prisma Model

Create `prisma/schema/{page}.prisma`.

**Naming rules (mandatory):**
- One table per page/feature — NEVER a generic shared table for multiple pages
- Table name = page name (e.g. `HomePage`, `AboutPage`, `ServicesPage`)
- All sections of a page are rows inside that table (stored as JSON in `content` column)
- Sub-features needing their own table use page name as prefix — e.g. `ProjectItem` for projects CRUD
- Site-wide features get their own feature-named table — e.g. `NavbarSetting`, `FooterSetting`

**Standard CMS page model:**
```prisma
model AboutPage {
  id        String   @id @default(cuid())
  section   String   @unique       // "hero", "story", "team", "values", etc.
  title     String?
  content   Json                   // Flexible JSON for any section structure
  sortOrder Int      @default(0)
  isActive  Boolean  @default(true)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([sortOrder])
}
```

**`Seo` model already exists** in `prisma/schema/seo.prisma`:
```prisma
model Seo {
  id          String   @id @default(cuid())
  page        String   @unique        // "home", "about", "services", "projects", etc.
  title       String
  description String?
  keywords    String[]
  ogImage     String?
  noIndex     Boolean  @default(false)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

After creating/modifying any schema file:
```bash
npm run db:generate
npm run db:push
```

---

### Step 2 — Module Types

Create `src/modules/{page}/types.ts`.

Define:
- Interface per section (matching the JSON structure stored in `content` column)
- Full page data interface combining all sections
- Import shared types from `@/lib/seo` if needed

Example:
```ts
// src/modules/about/types.ts
export interface HeroSection {
  heading: string;
  subheading: string;
  backgroundImage: string;
}

export interface StorySection {
  title: string;
  body: string;
  image: string;
  founded: string;
}

export interface TeamMember {
  name: string;
  role: string;
  avatar: string;
  bio: string;
}

export interface TeamSection {
  title: string;
  members: TeamMember[];
}

export interface AboutPageData {
  hero: HeroSection;
  story: StorySection;
  team: TeamSection;
}
```

---

### Step 3 — Validations

Create `src/modules/{page}/validations.ts`.

Rules:
- Every schema validates ALL inputs — no raw/unvalidated data ever enters the DB
- Reuse the same Zod schemas in both server actions AND API route handlers
- Use `.min(1)` on required strings, `.optional().default("")` on optional fields

Example:
```ts
// src/modules/about/validations.ts
import { z } from "zod";

export const heroSchema = z.object({
  heading: z.string().min(1, "Heading required"),
  subheading: z.string().min(1),
  backgroundImage: z.string().min(1),
});

export const storySchema = z.object({
  title: z.string().min(1),
  body: z.string().min(1),
  image: z.string().min(1),
  founded: z.string().min(1),
});

export const teamMemberSchema = z.object({
  name: z.string().min(1),
  role: z.string().min(1),
  avatar: z.string().optional().default(""),
  bio: z.string().optional().default(""),
});

export const teamSchema = z.object({
  title: z.string().min(1),
  members: z.array(teamMemberSchema),
});
```

---

### Step 4 — Data Layer

#### `data/queries.ts` — read-only DB operations
Used by Server Components and GET API routes. Never called from client components.

```ts
// src/modules/about/data/queries.ts
import { db } from "@/lib/db";

export async function getAboutPageData() {
  const sections = await db.aboutPage.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
  });
  const data: Record<string, unknown> = {};
  for (const s of sections) data[s.section] = s.content;
  return data;
}

export async function getAboutSection(section: string) {
  return db.aboutPage.findUnique({ where: { section } });
}

export async function getAboutSeo() {
  return db.seo.findUnique({ where: { page: "about" } });
}
```

#### `data/mutations.ts` — write DB operations
Called only from server actions — never directly from client.

```ts
// src/modules/about/data/mutations.ts
import { db } from "@/lib/db";

export async function upsertAboutSection(section: string, content: unknown) {
  return db.aboutPage.upsert({
    where: { section },
    update: { content: content as never, updatedAt: new Date() },
    create: { section, content: content as never },
  });
}
```

#### `data/defaults.ts` — fallback content + default SEO
Every module must have a strong built-in SEO fallback.

```ts
// src/modules/about/data/defaults.ts
import type { PageSEO } from "@/lib/seo";

export const defaultSeo: PageSEO = {
  title: "About RaYnk Labs | Student-Led Tech Innovation Lab",
  description: "Learn about RaYnk Labs — a student-driven tech lab building software, services, and communities that matter.",
  keywords: ["raynk labs", "student tech lab", "tech innovation", "software development"],
  ogImage: "/api/uploads/og-about.png",
  noIndex: false,
};

export const defaultAboutContent = {
  hero: {
    heading: "Who We Are",
    subheading: "A student-led lab turning ideas into impact.",
    backgroundImage: "placeholder.png",
  },
  story: {
    title: "Our Story",
    body: "RaYnk Labs was founded by students who wanted to build things that matter.",
    image: "placeholder.png",
    founded: "2023",
  },
  team: { title: "Meet the Team", members: [] },
};
```

---

### Step 5 — Server Actions

Create `src/modules/{page}/actions.ts`.

**Rules — all mandatory:**
- Add `"use server"` directive at top
- Call `requireAdmin()` as the FIRST thing in every mutation action
- Validate all input with Zod — throw on invalid
- Call `revalidatePath()` after every successful DB write
- Return `ActionResponse` via `ok()` / `fail()` helpers from `@/lib/action-response`

```ts
// src/modules/about/actions.ts
"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/require-admin";
import { ok, fail } from "@/lib/action-response";
import { getErrorMessage } from "@/lib/errors";
import { heroSchema, storySchema, teamSchema } from "./validations";
import { upsertAboutSection } from "./data/mutations";
import { db } from "@/lib/db";
import { z } from "zod";

export async function updateAboutHero(raw: unknown) {
  try {
    await requireAdmin();
    const data = heroSchema.parse(raw);
    await upsertAboutSection("hero", data);
    revalidatePath("/about");
    revalidatePath("/admin/about");
    return ok(null);
  } catch (err) {
    return fail(getErrorMessage(err));
  }
}

export async function updateAboutStory(raw: unknown) {
  try {
    await requireAdmin();
    const data = storySchema.parse(raw);
    await upsertAboutSection("story", data);
    revalidatePath("/about");
    revalidatePath("/admin/about");
    return ok(null);
  } catch (err) {
    return fail(getErrorMessage(err));
  }
}

export async function updateAboutSeo(raw: unknown) {
  try {
    await requireAdmin();
    const seoSchema = z.object({
      title: z.string().min(1),
      description: z.string().optional(),
      keywords: z.array(z.string()).optional().default([]),
      ogImage: z.string().optional(),
      noIndex: z.boolean().optional().default(false),
    });
    const data = seoSchema.parse(raw);
    await db.seo.upsert({
      where: { page: "about" },
      update: { ...data, updatedAt: new Date() },
      create: { page: "about", ...data },
    });
    revalidatePath("/about");
    return ok(null);
  } catch (err) {
    return fail(getErrorMessage(err));
  }
}
```

---

### Step 6 — Component System

Create individual section components and `main.tsx` that arranges them.

#### Performance rule (mandatory)

| Section type | Strategy | Why |
|---|---|---|
| Hero / above-the-fold | Direct SSR import (no `dynamic`, no `<LazyOnView>`) | LCP — must render on first paint |
| SEO content below fold (story, values, mission) | `next/dynamic` + framer-motion `whileInView` | Crawlers see content. JS splits. UX reveal on scroll. |
| Non-SEO widget (carousel, map, video embed) | `next/dynamic({ ssr: false })` + `<LazyOnView>` | No SEO need. Skip SSR + skip mount until visible. |
| Admin tab content | `next/dynamic` only | No SEO. Lazy on tab click. |

**Hydration rule:** NEVER wrap SSR-rendered content in `<LazyOnView>`. The server sends the children's HTML; `<LazyOnView>` initial client state is `visible=false` → hydration mismatch. Use framer-motion `whileInView` for SSR sections instead.

#### `main.tsx` template
```tsx
// src/modules/about/components/main.tsx
import dynamic from "next/dynamic";
import { HeroSection } from "./hero-section";                  // EAGER — no dynamic
import { SectionSkeleton } from "@/components/common/section-skeleton";
import type { AboutPageData } from "../types";

// Lazy — code-splits JS, preserves SSR for SEO content
const StorySection  = dynamic(() => import("./story-section").then(m => m.StorySection),  { loading: () => <SectionSkeleton /> });
const TeamSection   = dynamic(() => import("./team-section").then(m => m.TeamSection),    { loading: () => <SectionSkeleton /> });
const ValuesSection = dynamic(() => import("./values-section").then(m => m.ValuesSection),{ loading: () => <SectionSkeleton /> });

export function AboutPageContent({ data }: { data: AboutPageData }) {
  return (
    <main className="flex flex-col">
      <HeroSection data={data.hero} />
      <StorySection data={data.story} />
      <TeamSection data={data.team} />
      <ValuesSection />
    </main>
  );
}
```

#### Reveal-on-scroll pattern (SEO-safe — no LazyOnView)
```tsx
// src/modules/about/components/story-section.tsx
"use client";
import { motion } from "framer-motion";
import { slideUp, staggerContainer } from "@/lib/animation-variants";
import type { StorySection as StorySectionType } from "../types";

export function StorySection({ data }: { data: StorySectionType }) {
  return (
    <section className="section-padding">
      <motion.div
        className="section-container"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.25 }}
      >
        <motion.h2 variants={slideUp} className="text-3xl font-bold">{data.title}</motion.h2>
        <motion.p variants={slideUp} className="mt-4 text-muted-foreground">{data.body}</motion.p>
      </motion.div>
    </section>
  );
}
```

Animation rules:
- `viewport={{ once: true, amount: 0.25 }}` — animate once at 25% visible, never re-animate on scroll-up
- One `motion.div` parent per section with `staggerChildren` — not one `<motion.*>` per DOM node
- **Never animate the hero.** LCP must not wait for JS or animation.
- Respect `prefers-reduced-motion` — return no-op variants when `useReducedMotion()` is true

#### `<LazyOnView>` wrapper (for non-SEO client-only widgets)
```tsx
// src/components/common/lazy-on-view.tsx
"use client";
import { useRef, useState, useEffect } from "react";
import type React from "react";

export function LazyOnView({
  children,
  rootMargin = "200px",
}: {
  children: React.ReactNode;
  rootMargin?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!ref.current) return;
    const io = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); io.disconnect(); } },
      { rootMargin },
    );
    io.observe(ref.current);
    return () => io.disconnect();
  }, [rootMargin]);

  return <div ref={ref} className="min-h-[1px]">{visible ? children : null}</div>;
}
```

---

### Step 7 — Public Page

Create `src/app/(public)/{page}/page.tsx` and `loading.tsx`.

**`page.tsx` is THIN — zero business logic:**
```tsx
// src/app/(public)/about/page.tsx
import { AboutPageContent } from "@/modules/about";
import { getAboutPageData, getAboutSeo } from "@/modules/about/data/queries";
import { defaultSeo } from "@/modules/about/data/defaults";
import { resolveSeo } from "@/lib/seo";
import type { Metadata } from "next";

export const revalidate = 60; // ISR — revalidate every 60 seconds

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getAboutSeo();
  return resolveSeo(seo, defaultSeo.title);
}

export default async function AboutPage() {
  const data = await getAboutPageData();
  return <AboutPageContent data={JSON.parse(JSON.stringify(data))} />;
}
```

**Home page exception** — home serves `/` so it lives at:
- `src/app/(public)/home/page-content.tsx` — server component + metadata
- `src/app/page.tsx` — root route re-export (2 lines):
```tsx
export { default } from "./(public)/home/page-content";
export { generateMetadata } from "./(public)/home/page-content";
```

---

### Step 8 — Admin Dashboard Page

Create `src/app/admin/(dashboard)/{page}/page.tsx` — full CMS editor.

Rules:
- Follow EXACT admin styling already in this project
- Tab list **MUST end with a `"SEO"` tab** (after all content section tabs) — mandatory for every CMS page
- Fetch existing data via `fetch("/api/admin/{page}")` on mount
- Save via server action
- Show `Loader2 animate-spin` during save/load
- Sonner `toast.success` / `toast.error` on result
- Confirm all destructive actions

**Standard admin CMS page structure:**
```tsx
"use client";

import { useState, useEffect } from "react";
import { Save, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { updateAboutHero, updateAboutStory, updateAboutSeo } from "@/modules/about/actions";

const TABS = ["hero", "story", "team", "values", "seo"] as const;
type Tab = typeof TABS[number];

export default function AboutPageManager() {
  const [activeTab, setActiveTab] = useState<Tab>("hero");
  const [formData, setFormData] = useState<Record<string, unknown>>({});
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    fetch("/api/admin/about")
      .then(r => r.json())
      .then(({ data }) => { setFormData(data ?? {}); setLoadingData(false); });
  }, []);

  async function handleSave() {
    setLoading(true);
    const actionMap: Record<Tab, (d: unknown) => Promise<unknown>> = {
      hero:   d => updateAboutHero(d),
      story:  d => updateAboutStory(d),
      team:   () => Promise.resolve(null),
      values: () => Promise.resolve(null),
      seo:    d => updateAboutSeo(d),
    };
    const result = await actionMap[activeTab]?.(formData[activeTab]) as { success?: boolean; error?: string } | null;
    if (result?.success) toast.success("Saved!");
    else toast.error(result?.error ?? "Failed to save");
    setLoading(false);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">About Page Manager</h1>
          <p className="text-muted-foreground mt-1">Manage all about page sections</p>
        </div>
        <button
          onClick={handleSave}
          disabled={loading}
          className="flex items-center gap-2 px-6 py-2 bg-primary hover:bg-primary/90 disabled:opacity-50 text-primary-foreground rounded-lg font-medium transition"
        >
          {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</> : <><Save className="w-4 h-4" /> Save Changes</>}
        </button>
      </div>

      <div className="border rounded-lg bg-card">
        <div className="flex overflow-x-auto border-b">
          {TABS.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-3 font-medium transition-colors capitalize ${
                activeTab === tab ? "border-b-2 border-primary text-primary" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="p-6 space-y-6">
          {loadingData
            ? <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>
            : null /* Render form fields for activeTab */}
        </div>
      </div>
    </div>
  );
}
```

#### Admin page patterns

**Pattern A: CMS Page Editor** (Home, About, Services, etc.)
- Tabbed form — one tab per section
- Each tab has fields matching the section JSON structure
- Image upload via `<ImageUpload>` from `@/components/common/image-upload`
- "Save Changes" button top-right AND bottom
- Last tab **always** = "SEO" with fields: title, description, keywords, ogImage, noIndex

**Pattern B: CRUD Manager** (Projects, Blog, Team Members, Job Listings)
- Header: Title + count badge + "Add New" button
- Filter row (category, status, search input)
- Card grid or DataTable for items
- Dialog or Sheet for create/edit forms
- Delete with confirmation dialog
- Toggle active/inactive from list view

**Pattern C: Read-Only Manager** (Contact Submissions, Newsletter Subscribers)
- DataTable with columns
- Read/unread status toggle
- Detail dialog on row click

---

### Step 9 — SEO System (Mandatory)

**Every public page MUST:**
1. Export `generateMetadata()` using `resolveSeo()` from `@/lib/seo`
2. Have a `defaultSeo` in `data/defaults.ts`
3. Be editable from the admin via an SEO tab

**Fallback chain at request time:**
```
1. DB row in Seo table for this page slug    → use if found (admin-controlled)
2. Module's defaultSeo in data/defaults.ts   → use if no DB row
3. Site-wide fallback in src/lib/seo.ts      → absolute last resort
```

**`resolveSeo()` is in `src/lib/seo.ts` (already built):**
```ts
import { resolveSeo } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getAboutSeo();            // returns Seo | null from DB
  return resolveSeo(seo, "About RaYnk Labs"); // fallbackTitle used when seo is null
}
```

**Pages EXCLUDED from SEO tab (not indexed):**
- `navbar`, `footer` — shared chrome, not standalone pages
- `/admin/**` — private pages
- `/api/**` — not pages
- `/admin/login` — auth page, noindex

---

### Step 10 — API Routes

Create two route files per feature:

#### Public GET (ISR cached)
```ts
// src/app/api/{page}/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const revalidate = 60;

export async function GET() {
  try {
    const sections = await db.aboutPage.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
    });
    const data: Record<string, unknown> = {};
    for (const s of sections) data[s.section] = s.content;
    return NextResponse.json({ success: true, data });
  } catch {
    return NextResponse.json({ success: false, error: "Failed to fetch" }, { status: 500 });
  }
}
```

#### Admin CRUD (auth-protected)
```ts
// src/app/api/admin/{page}/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { heroSchema } from "@/modules/about/validations";

async function assertAdmin() {
  const session = await auth();
  if (!session?.user || !["ADMIN", "SUPER_ADMIN"].includes(session.user.role)) {
    throw new Error("Unauthorized");
  }
}

export async function GET() {
  try {
    await assertAdmin();
    const sections = await db.aboutPage.findMany({ orderBy: { sortOrder: "asc" } });
    const data: Record<string, unknown> = {};
    for (const s of sections) data[s.section] = s.content;
    return NextResponse.json({ success: true, data });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Error";
    const status = msg === "Unauthorized" ? 401 : 500;
    return NextResponse.json({ success: false, error: msg }, { status });
  }
}

export async function POST(req: NextRequest) {
  try {
    await assertAdmin();
    const { section, content } = (await req.json()) as { section: string; content: unknown };
    // Use appropriate schema per section
    const validated = heroSchema.parse(content);
    const result = await db.aboutPage.upsert({
      where: { section },
      update: { content: validated as never },
      create: { section, content: validated as never },
    });
    return NextResponse.json({ success: true, data: result });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Error";
    const status = msg === "Unauthorized" ? 401 : 400;
    return NextResponse.json({ success: false, error: msg }, { status });
  }
}
```

---

### Step 11 — Add to Admin Sidebar

When building a new page, update `src/app/admin/(dashboard)/layout.tsx`:
1. Find the relevant section in `SIDEBAR`
2. Add `{ title: "Page Name", href: "/admin/{page}", icon: IconName }` to its `children`
3. Add the same entry to that section's hub page `SECTION_PAGES` array

---

### Step 12 — Documentation

Create `docs/{page}.md` — **one file per page, never multiple**.

Must include all 9 sections:

```markdown
## 1. PAGE OVERVIEW
- Page name, route, admin route, sections list

## 2. UI STRUCTURE
- What user sees on each section (based on design)

## 3. API DOCUMENTATION
- Public GET /api/{page} — exact response JSON
- Admin POST /api/admin/{page} — request body + response

## 4. WORKFLOW
Admin → API → DB → revalidatePath → ISR → User sees change

## 5. DATA STRUCTURE
JSON shape per section (field names + types)

## 6. IMAGE HANDLING
- Stored as bare filename in DB
- Served via GET /api/uploads/[filename]
- Upload via POST /api/upload (multipart/form-data)
- Fallback: /api/uploads/placeholder.png

## 7. SEO
- metaTitle, description, keywords, ogImage, noIndex
- Where stored: Seo table, page = "{page}"
- How used: generateMetadata → resolveSeo()

## 8. POSTMAN TESTING
1. Login via POST /api/auth/callback/credentials
2. GET /api/{page} — check public data
3. GET /api/admin/{page} — check admin data (with cookie)
4. POST /api/admin/{page} — update section

## 9. UPDATE LOG
[YYYY-MM-DD] — What changed
```

---

### Step 13 — Update Sitemap

Update `src/app/sitemap.ts`:

**Static page:**
```ts
{ url: `${SITE_URL}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
```

**Dynamic page** (add DB query + map):
```ts
const posts = await db.blogPost.findMany({
  where: { isPublished: true },
  select: { slug: true, updatedAt: true },
});
const blogRoutes = posts.map(p => ({
  url: `${SITE_URL}/blog/${p.slug}`,
  lastModified: p.updatedAt,
  changeFrequency: "weekly" as const,
  priority: 0.7,
}));
return [...staticRoutes, ...blogRoutes];
```

**Excluded from sitemap:** `/admin/**`, `/api/**`, `/admin/login`

---

## Image Handling

All images flow through the custom upload system — no external CDN required.

### Upload flow
```
Admin selects file in browser
  → POST /api/upload (multipart/form-data, key = "file")
  → Sharp: resize max 1600×1600, re-encode WebP, strip EXIF
  → Save to /uploads/images/{timestamp}-{name}.webp
  → Return { filename } (bare filename, not full URL)
  → DB stores bare filename string
  → Component: <SafeImage src={filename} />
  → SafeImage resolves bare filename → GET /api/uploads/[filename]
  → Served with Cache-Control: public, max-age=86400, s-maxage=604800
```

### Image components
```ts
import { SafeImage, isPlaceholderValue } from "@/components/common/safe-image";
import { ImageUpload, MultiImageUpload, toSrc, isPlaceholderOrEmpty } from "@/components/common/image-upload";
import { ImageWithFallback } from "@/components/common/image-with-fallback";
```

### Rules
- Always use `<SafeImage>` for DB-stored images — URL resolve, retry on fail, placeholder fallback, dev "MISSING" badge
- `priority` prop ONLY on hero images (LCP element)
- Never copy dynamic images to `/public` — always `/uploads/images/`
- Max upload: 10 MB | Allowed types: JPEG, PNG, WebP

---

## SEO Manager Module

Create `src/modules/seo/` once — reuse in every page editor.

```
src/modules/seo/
  |-- components/
  |   |-- SeoTabPanel.tsx     # Reusable admin tab: title, desc, keywords, ogImage, noIndex
  |   |-- index.ts
  |-- types.ts                # SeoFormData interface
  |-- validations.ts          # seoSchema (Zod)
  |-- actions.ts              # updateSeoMeta(page, data) server action
  |-- data/
  |   |-- queries.ts          # getSeoByPage(page), getAllSeoPages()
  |   |-- defaults.ts         # siteDefaultSeo (absolute fallback)
  |-- index.ts                # Barrel
```

`resolveSeo()` already lives in `src/lib/seo.ts` — import from there.

---

## Sitemap & Robots Rules

- **Single sitemap file:** `src/app/sitemap.ts`
- **Single robots file:** `src/app/robots.ts`
- Use `SITE_URL` from `@/lib/constants` — never hardcode the domain

**When a new public page is created:**
- Static → add to static routes array in `sitemap.ts`
- Dynamic (blog, projects) → add DB query and spread routes into the return array

**Excluded from sitemap:** `/admin/**`, `/api/**`, `/admin/login`

**Robots disallows:** `/admin/`, `/api/`

---

## Security Rules

```
RULE 1: requireAdmin() MUST be the first call in every mutation action and admin API handler
RULE 2: Validate ALL inputs with Zod — both in actions AND in API routes — no raw data
RULE 3: Middleware handles fast auth check using req.auth (NextAuth v5 JWT — no DB calls)
RULE 4: Middleware NEVER calls the database — JWT token check only
RULE 5: CSRF origin check is in middleware for all API mutations (non-auth routes)
RULE 6: Directory traversal protection is in /api/upload and /api/uploads/[filename]
RULE 7: Rate limits — auth: 5/15min | admin API: 60/min | upload: 10/min
```

---

## Data Flow

```
Admin edits content in browser
  → Server Action (requireAdmin → Zod validate → mutations.ts)
  → DB write via Prisma
  → revalidatePath("/public-route")
  → ISR cache invalidated
  → Next user request gets fresh data (within 60s)
```

```
Admin reads content
  → Client fetch to /api/admin/{page}
  → auth() → DB read via queries.ts
  → Form fields pre-populated
```

```
Public user visits page
  → Server Component reads DB via queries.ts
  → generateMetadata runs resolveSeo()
  → ISR serves cached HTML (60s TTL)
  → Only on revalidate does a new DB read happen
```

---

## All Pages to Build (in order)

### Public Pages (CMS-driven)

| # | Page | Route | Admin Route | Sections |
|---|------|-------|-------------|----------|
| 1 | **Home** | `/` | `/admin/home` | hero-slides, about-us, services-overview, projects-showcase, stats, testimonials, cta |
| 2 | **About** | `/about` | `/admin/about` | hero, story, mission/values, team, timeline |
| 3 | **Services** | `/services` | `/admin/services` | hero, service cards, process, tech-stack, cta |
| 4 | **Projects** | `/projects` | `/admin/projects` | hero, CRUD: project listing with tags/images/links |
| 5 | **Project Detail** | `/projects/[slug]` | (same CRUD) | gallery, description, tech-stack used, live URL, GitHub |
| 6 | **Blog** | `/blog` | `/admin/blog` | CRUD: posts, cover image, tags, publish toggle, SEO per post |
| 7 | **Blog Post** | `/blog/[slug]` | (same CRUD) | content, author, tags, related posts |
| 8 | **Team** | `/team` | `/admin/team` | hero, CRUD: member cards, role, bio, social links |
| 9 | **Careers** | `/careers` | `/admin/careers` | hero, CRUD: job listings; application form; admin views submissions |
| 10 | **Contact** | `/contact` | `/admin/contact` | contact form + info; admin views submissions |
| 11 | **Privacy Policy** | `/privacy-policy` | `/admin/settings` | CMS-managed legal content |
| 12 | **Terms** | `/terms` | `/admin/settings` | CMS-managed legal content |
| 13 | **Admin Login** | `/admin/login` | — | Admin credential form |

### Admin-Only Pages

| # | Page | Admin Route | Purpose |
|---|------|-------------|---------|
| 14 | **Dashboard Home** | `/admin` | Stats overview, quick links to all sections |
| 15 | **Navbar Manager** | `/admin/navbar` | Logo upload, nav links reorder/toggle |
| 16 | **Footer Manager** | `/admin/footer` | Logo, footer links, social links, copyright |
| 17 | **SEO Manager** | `/admin/seo` | Global table of all pages' SEO status + inline editor |
| 18 | **Site Settings** | `/admin/settings` | Key-value store (site name, contact email, social URLs) |
| 19 | **Media Library** | `/admin/uploads` | Browse + delete uploaded images from `/uploads/images/` |

---

## Module Barrel Export Pattern

Every `index.ts` exports ONLY what other modules or the app layer need.
Internal files (db mutations, raw queries) stay unexported.

```ts
// src/modules/about/index.ts
export * from "./types";
export * from "./validations";
export * from "./actions";
export { AboutPageContent } from "./components/main";
```

---

## Forbidden (Claude MUST NOT)

- Create a page without explicit instruction
- Skip any of the 13 steps — partial pages are not acceptable
- Put business logic in `/app/**` pages
- Call the database directly from a client component
- Import from another module's internal files — only from its barrel `index.ts`
- Create multiple documentation files for one page — one `docs/{page}.md` per page
- Skip SEO for any public page — every public page MUST have `generateMetadata`
- Skip `revalidatePath()` after any server action mutation
- Use `uploadthing`, `@upstash/ratelimit`, or `@upstash/redis` — they are NOT in this project
- Hardcode the domain anywhere — always use `SITE_URL` from `@/lib/constants`

---

## Environment Variables

```env
# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development

# Database (Neon PostgreSQL)
DATABASE_URL=postgresql://user:password@host/dbname?sslmode=require

# NextAuth v5
AUTH_SECRET=your-secret-here-minimum-32-characters
AUTH_URL=http://localhost:3000

# Admin Fallback (env-based super admin — works before DB seed)
ADMIN_EMAIL=admin@raynklabs.com
ADMIN_PASSWORD=your-secure-password
```

---

## NPM Scripts

```bash
npm run dev           # Start dev server with Turbopack
npm run build         # Production build
npm run lint          # ESLint check
npm run format        # Prettier format
npm run db:generate   # Generate Prisma client after schema changes
npm run db:push       # Push schema to DB (no migration file)
npm run db:seed       # Seed DB with default SEO + admin user
npm run db:studio     # Open Prisma Studio GUI
npm run analyze       # Bundle analyzer (ANALYZE=true)
```

---

## How the Admin Uses the Dashboard

1. **Log in** at `/admin/login` with email + password
2. **Dashboard home** — stats (pages active, projects count, blog posts, contact inquiries)
3. **Edit any page** — click sidebar link → tabbed CMS editor → edit fields → Save
4. **Edit Home Page example:**
   - Sidebar → Home
   - Switch tabs: Hero Slides, About Us, Services, Projects, Stats, Testimonials, CTA, SEO
   - Edit text, upload images (drag & drop), toggle sections active
   - Click "Save Changes" → saved to PostgreSQL → public page revalidates within 60s
5. **Add a Project:**
   - Sidebar → Projects → "Add Project"
   - Fill: title, slug, description, tech stack, images, live URL, GitHub URL
   - Save → appears on `/projects`
6. **View contact submissions:**
   - Sidebar → Contact → see all submissions in table
   - Click row → full detail dialog
7. **No code changes ever needed** — everything is database-driven

---

---

# Enforcement Layer — Mandatory

> This section makes the entire system strict.
> Every rule here is non-negotiable. No shortcuts. No partial builds.

---

## Output Format (Non-Negotiable)

Whenever I say **"Create {page}"**, you MUST return output in this EXACT order — no reordering, no omissions:

### 1. Prisma Schema
```
prisma/schema/{page}.prisma
```
- Full model — no partial, no placeholder fields
- Run `npm run db:generate && npm run db:push` after

### 2. Module Files
```
src/modules/{page}/
  types.ts
  validations.ts
  actions.ts
  data/queries.ts
  data/mutations.ts
  data/defaults.ts       ← MANDATORY — includes defaultSeo
  components/
    {Section}.tsx        ← one file per section
    main.tsx             ← arranges sections with lazy loading
    index.ts
  index.ts               ← barrel export
```

### 3. API Routes
```
src/app/api/{page}/route.ts               ← Public GET (ISR revalidate = 60)
src/app/api/admin/{page}/route.ts         ← Admin GET + POST (auth-protected)
src/app/api/admin/{page}/[id]/route.ts    ← Admin PATCH + DELETE (for CRUD pages)
```

### 4. Public Page
```
src/app/(public)/{page}/
  page.tsx       ← generateMetadata + thin server component
  loading.tsx    ← skeleton UI
  error.tsx      ← error boundary
```

### 5. Admin Dashboard Page
```
src/app/admin/(dashboard)/{page}/page.tsx
```
- Tabbed CMS editor
- Last tab MUST be "SEO"

### 6. Documentation
```
docs/{page}.md
```
- All 9 sections — no skipping

---

## Completeness Rule

If ANY of these deliverables is missing, the build is **FAILED**:

| Deliverable | Required |
|-------------|----------|
| Prisma schema file | ✅ |
| Module types + validations + actions | ✅ |
| data/queries.ts + mutations.ts + defaults.ts | ✅ |
| Section components + main.tsx | ✅ |
| Public API route | ✅ |
| Admin API route | ✅ |
| Public page.tsx with generateMetadata | ✅ |
| Admin dashboard page with SEO tab | ✅ |
| docs/{page}.md with all 9 sections | ✅ |
| Sitemap updated | ✅ |

**Missing any row = regenerate the full output from the beginning.**

---

## SEO Fallback Rule (Mandatory)

Every module MUST have `data/defaults.ts` exporting `defaultSeo`.

```ts
// data/defaults.ts (mandatory shape)
export const defaultSeo: PageSEO = {
  title: "...",
  description: "...",
  keywords: [...],
  ogImage: "/api/uploads/og-{page}.png",
  noIndex: false,
};
```

Rule: **No public page renders without SEO.** `generateMetadata` MUST call `resolveSeo(dbSeo, defaultSeo.title)`. If the DB row is missing, `defaultSeo` is used. The user never sees a page with empty `<title>`.

---

## Data Flow Rule (Strict)

**Always:**
```
UI (client) → Server Action or API Route → DB (via mutations.ts) → revalidatePath() → ISR → User
```

**Never:**
- Call `db.*` directly from a React component or `page.tsx`
- Skip the action/API layer for any write operation
- Skip `revalidatePath()` after any mutation

---

## API Response Standard

Every API route in this project MUST return this exact shape.

**Success:**
```json
{ "success": true, "data": { } }
```

**Success with pagination:**
```json
{ "success": true, "data": [ ], "meta": { "total": 0, "page": 1, "perPage": 20, "totalPages": 0, "hasNextPage": false, "hasPrevPage": false } }
```

**Error:**
```json
{ "success": false, "error": "Human-readable message" }
```

**Validation error:**
```json
{ "success": false, "error": "Validation failed", "issues": { "fieldName": ["error message"] } }
```

No custom formats. No inconsistent shapes. The `ApiResponse<T>` type in `src/types/global.d.ts` enforces this.

---

## Performance Enforcement

| Rule | Requirement |
|------|-------------|
| Hero section | Direct SSR import — no `dynamic()`, no `<LazyOnView>` |
| SEO content below fold | `next/dynamic` + framer-motion `whileInView` |
| Non-SEO widgets (carousels, maps) | `next/dynamic({ ssr: false })` + `<LazyOnView>` |
| All images | `<SafeImage>` or `<next/image>` — never `<img>` |
| Hero image only | `priority` prop — no other image gets it |
| `"use client"` | Only on leaf components that need interactivity — never on layout/page |
| Admin tab content | `next/dynamic` only — lazy on tab click |

---

## Security Enforcement

| Rule | Where enforced |
|------|----------------|
| `requireAdmin()` first call | Every server action + admin API handler |
| Zod validation before DB | Every action and API mutation — no raw input reaches DB |
| Auth check in middleware | `/admin/**` and `/api/admin/**` — JWT only, no DB call |
| CSRF origin check | Middleware — all non-auth API mutations |
| Directory traversal blocked | `/api/upload` and `/api/uploads/[filename]` |
| Rate limiting | auth: 5/15min · admin: 60/min · upload: 10/min |
| No sensitive data in responses | Never expose password hashes, tokens, or internal IDs unnecessarily |

---

## Module Strict Rules

```
✅ A module imports from:   @/lib/*   @/components/*   other modules' index.ts
❌ A module NEVER imports:  another module's internal files (actions, data/*, types)
✅ Shared component (2+ modules): move to @/components/common/
✅ Every folder has an index.ts barrel
✅ /app pages: only routing + module imports — zero business logic
```

---

## Documentation Strict Rule

One file per page: `docs/{page}.md`

Every file MUST include all 9 sections — Claude MUST NOT:
- Create multiple docs files for one page
- Skip the Workflow section
- Skip the UI Structure section
- Skip the SEO section
- Write incomplete API examples (must include exact JSON)
- Skip the Update Log section

---

## Self-Check Before Responding

Before returning any "Create {page}" output, verify:

- [ ] Prisma model created with all fields
- [ ] `data/defaults.ts` exists with `defaultSeo`
- [ ] All Zod schemas cover every input field
- [ ] Every server action calls `requireAdmin()` first
- [ ] Every server action calls `revalidatePath()` after mutation
- [ ] Every server action returns `ok()` or `fail()`
- [ ] `main.tsx` has Hero as direct import, rest as `next/dynamic`
- [ ] `page.tsx` has `generateMetadata` using `resolveSeo()`
- [ ] `page.tsx` has `export const revalidate = 60`
- [ ] Admin page has SEO tab as last tab
- [ ] All API routes return `{ success, data }` or `{ success, error }`
- [ ] `docs/{page}.md` has all 9 sections
- [ ] `sitemap.ts` is updated

**If any checkbox fails → fix before responding.**

---

---

# Final Execution Discipline — Mandatory

---

## Execution Order Lock (Strict)

Claude MUST execute steps in this EXACT order — no skipping, no reordering, no merging two steps into one:

| # | Step | Output |
|---|------|--------|
| 1 | **Prisma** | `prisma/schema/{page}.prisma` |
| 2 | **Types** | `src/modules/{page}/types.ts` |
| 3 | **Validations** | `src/modules/{page}/validations.ts` |
| 4 | **Data Layer** | `data/queries.ts` · `data/mutations.ts` · `data/defaults.ts` |
| 5 | **Actions** | `src/modules/{page}/actions.ts` |
| 6 | **Components** | Section files + `main.tsx` + `components/index.ts` |
| 7 | **Public Page** | `app/(public)/{page}/page.tsx` · `loading.tsx` · `error.tsx` |
| 8 | **API Routes** | `api/{page}/route.ts` · `api/admin/{page}/route.ts` |
| 9 | **Admin Page** | `app/admin/(dashboard)/{page}/page.tsx` |
| 10 | **Docs** | `docs/{page}.md` |

If this order is violated → restart generation from Step 1.

---

## Default Content Rule (Mandatory)

Every module's `data/defaults.ts` MUST export both:

```ts
// Required exports — both mandatory
export const defaultSeo: PageSEO = { ... };
export const default{Page}Content = { ... }; // all sections populated
```

**Why both are required:**
- `defaultSeo` → used by `generateMetadata` when DB has no SEO row for this page
- `default{Page}Content` → used to pre-populate the public page when DB has no content rows yet

Rules:
- No section renders `undefined` — every field has a hardcoded fallback string
- No placeholder text like `"Lorem ipsum"` in defaults — write real copy for RaYnk Labs
- Image fields default to `"placeholder.png"` (served as `/api/uploads/placeholder.png`)

---

## Admin Sync Rule (Strict)

After **any** successful DB mutation, the server action MUST call `revalidatePath` for both the public route AND the admin route:

```ts
revalidatePath("/about");                  // public page cache cleared
revalidatePath("/admin/about");            // admin page cache cleared
```

For pages that affect the root (home, navbar, footer):
```ts
revalidatePath("/");                       // home route
revalidatePath("/", "layout");             // clears layout-level cache (navbar/footer)
revalidatePath("/admin/home");
```

Missing `revalidatePath` = the admin saves but the public page never updates = **FAIL**.

---

## Lazy Loading Implementation (Strict)

In every `main.tsx`:

```ts
// ✅ Hero — direct import (SSR, no dynamic, no LazyOnView)
import { HeroSection } from "./hero-section";

// ✅ SEO content below fold — next/dynamic with ssr: true
// JS bundle splits per section. Crawlers still see HTML.
const StorySection = dynamic(
  () => import("./story-section").then(m => m.StorySection),
  { loading: () => <SectionSkeleton />, ssr: true },
);

// ✅ Non-SEO client widget — ssr: false + LazyOnView
// Skips SSR entirely. Mounts only when scrolled into view.
const TestimonialCarousel = dynamic(
  () => import("./testimonial-carousel").then(m => m.TestimonialCarousel),
  { loading: () => <SectionSkeleton />, ssr: false },
);
```

Forbidden patterns:
- `"use client"` on `main.tsx` or `page.tsx` — these are Server Components
- Wrapping SSR sections in `<LazyOnView>` — causes hydration mismatch
- Manual `setTimeout` / `IntersectionObserver` hacks to fake lazy loading
- Importing all section components eagerly without `dynamic()`

---

## Thin Route Rule (Critical)

Files inside `src/app/**` are routing shells only.

**Allowed in `page.tsx`:**
```ts
import { PageContent } from "@/modules/{page}";            // import module
import { getPageData, getPageSeo } from "@/modules/{page}/data/queries"; // call data
export async function generateMetadata() { ... }           // metadata
export default async function Page() {                     // return JSX
  const data = await getPageData();
  return <PageContent data={...} />;
}
```

**Forbidden in `page.tsx`:**
```ts
// ❌ DB call directly in page
const rows = await db.homePage.findMany(...);

// ❌ Business logic in page
const processed = rows.map(r => JSON.parse(r.content as string));

// ❌ Validation in page
const parsed = heroSchema.parse(formData);

// ❌ Mutation in page
await db.homePage.update(...);
```

Violation = move the logic to the correct layer (queries.ts, actions.ts, or the module) and re-run.

---

## System Guarantee

When all rules are applied correctly, the system guarantees:

| Guarantee | How enforced |
|-----------|-------------|
| Full CMS — admin controls every page | Every page has a tabbed admin editor + API routes |
| No broken pages on first deploy | `data/defaults.ts` provides content before DB is seeded |
| No missing SEO | `defaultSeo` + `resolveSeo()` + `generateMetadata` on every public page |
| Consistent API responses | `{ success, data }` / `{ success, error }` enforced by `ApiResponse<T>` type |
| No stale public pages after admin save | `revalidatePath()` called after every mutation |
| No performance regressions | Hero eager, below-fold lazy, `<SafeImage>` everywhere, no `<img>` |
| No security holes | `requireAdmin()` → Zod → DB — three-layer gate on every write |

**If any guarantee is broken → identify which rule was violated and regenerate the affected files from that step forward.**
