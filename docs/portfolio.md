# Portfolio Page CMS System

## Overview

The Portfolio Page is a fully CMS-driven public page with project showcase, category filtering, and an admin dashboard for managing both page sections and individual projects. Features permission-based access control and SEO integration.

---

## Page Structure

### Public Sections (in order)

| # | Section Key | Component | Description |
|---|-------------|-----------|-------------|
| 1 | `hero` | PortfolioHero | Full-width hero with title, subtitle, background image |
| 2 | `categories_filter` | CategoryFilter | Filter buttons (All, Web Design, Graphic Design, etc.) |
| 3 | `projects_grid` | ProjectsGrid | Filterable project card grid with hover overlays |
| 4 | `testimonials` | PortfolioTestimonials | Client feedback cards with ratings |
| 5 | `contact_cta` | PortfolioCta | "Start Your Project" call-to-action |

---

## Module Structure

```
src/modules/portfolio/
├── types.ts              # TypeScript interfaces for all sections + projects
├── validations.ts        # Zod schemas for form validation
├── actions.ts            # Server actions for admin updates
├── index.ts              # Barrel exports
├── components/
│   ├── index.ts
│   ├── main.tsx          # PortfolioContent with dynamic imports
│   ├── hero.tsx
│   ├── filter.tsx
│   ├── grid.tsx
│   ├── project-card.tsx
│   ├── testimonials.tsx
│   └── cta.tsx
└── data/
    ├── index.ts
    ├── queries.ts        # getPortfolioPageData(), getPortfolioProjects(), etc.
    ├── mutations.ts      # create/update/delete projects, upsert sections
    └── defaults.ts       # defaultSeo, defaultPortfolioContent
```

---

## Prisma Models

### PortfolioPage (sections)

```prisma
model PortfolioPage {
  id        String   @id @default(cuid())
  section   String   @unique
  title     String?
  content   Json
  sortOrder Int      @default(0)
  isActive  Boolean  @default(true)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([sortOrder])
}
```

### PortfolioProject (individual projects)

```prisma
model PortfolioProject {
  id          String   @id @default(cuid())
  title       String
  slug        String   @unique
  description String?
  category    String
  image       String
  liveUrl     String?
  githubUrl   String?
  isFeatured  Boolean  @default(false)
  isActive    Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@index([category])
  @@index([isFeatured])
  @@index([isActive])
}
```

---

## Lazy Loading Strategy

| Section | Strategy | Reason |
|---------|----------|--------|
| Hero | Direct SSR import | Above-the-fold, LCP-critical |
| Category Filter | `next/dynamic` + SectionSkeleton | SEO content below fold |
| Projects Grid | `next/dynamic` + SectionSkeleton | SEO content below fold |
| Testimonials | `next/dynamic` + SectionSkeleton | SEO content below fold |
| Contact CTA | `next/dynamic` + SectionSkeleton | SEO content below fold |

---

## API Routes

### Public API

**GET `/api/portfolio`**
- Returns all active sections + projects
- Cached with `revalidate = 60` (ISR)
- No authentication required

**Response:**
```json
{
  "success": true,
  "data": {
    "sections": {
      "hero": { "title": "...", "subtitle": "...", "backgroundImage": "..." },
      "categories_filter": { "title": "...", "categories": [...] },
      ...
    },
    "projects": [
      {
        "id": "...",
        "title": "...",
        "slug": "...",
        "category": "Web Development",
        "image": "...",
        "liveUrl": "...",
        "githubUrl": "...",
        "isFeatured": true,
        "isActive": true
      }
    ]
  }
}
```

### Admin API

**GET `/api/admin/portfolio`**
- Returns all sections + all projects (including inactive)
- Requires `requirePermission("MANAGE_PORTFOLIO")`

**POST `/api/admin/portfolio`**
- Upserts a page section
- Body: `{ "section": "hero", "content": { ... } }`
- Requires `requirePermission("MANAGE_PORTFOLIO")`

**POST `/api/admin/portfolio/project`**
- Creates a new project
- Body: `{ "title": "...", "slug": "...", "category": "...", ... }`
- Requires `requirePermission("MANAGE_PORTFOLIO")`

**PUT `/api/admin/portfolio/project?id={id}`**
- Updates an existing project
- Body: Full project data
- Requires `requirePermission("MANAGE_PORTFOLIO")`

**DELETE `/api/admin/portfolio/project?id={id}`**
- Deletes a project
- Requires `requirePermission("MANAGE_PORTFOLIO")`

---

## Admin Dashboard

**Route:** `/admin/dashboard/portfolio`

### Tabs:

1. **Page Sections** (with sub-tabs)
   - Hero: title, subtitle, background image
   - Categories: title, category list (comma-separated)
   - Projects Grid: title, subtitle
   - Testimonials: title, subtitle
   - Contact CTA: heading, subheading, CTA text, CTA link

2. **Projects Manager**
   - Grid view of all projects with image, title, category
   - Add Project dialog (title, slug, category, description, image, URLs)
   - Edit Project dialog (same fields)
   - Delete Project (with confirmation)
   - Toggle Featured (star icon)
   - Toggle Active (eye icon)

3. **SEO**
   - Meta title
   - Meta description
   - Keywords (comma-separated)
   - OG Image
   - No Index toggle

---

## SEO Integration

### Seo Model

Uses the `Seo` table with `page = "portfolio"` as the unique key.

### Resolution Chain

1. Database row for `page = "portfolio"`
2. Falls back to `defaultSeo` in `src/modules/portfolio/data/defaults.ts`
3. Falls back to site-wide constants

### Usage

```typescript
export async function generateMetadata(): Promise<Metadata> {
  const seo = await getPortfolioSeo();
  return resolveSeo(seo, defaultSeo.title ?? undefined);
}
```

---

## Permission System

### Required Permission

```typescript
requirePermission("MANAGE_PORTFOLIO")
```

### Access Rules
- **SUPER_ADMIN**: Full access (bypasses permission check)
- **ADMIN**: Requires explicit `MANAGE_PORTFOLIO` permission
- **No permission**: Returns 403 Forbidden

---

## Workflow

### For Admins

1. Log in to `/admin/login`
2. Navigate to Portfolio Manager in the dashboard
3. Edit page sections in the "Page Sections" tab
4. Manage projects in "Projects Manager":
   - Click "Add Project" to create
   - Click "Edit" to modify
   - Toggle featured/active status
   - Delete with confirmation
5. Configure SEO in the "SEO" tab
6. View live site at `/portfolio`

### For Developers

1. Modify types in `types.ts`
2. Update Zod schemas in `validations.ts`
3. Update defaults in `defaults.ts`
4. Add/modify components in `components/`
5. Update actions in `actions.ts`
6. Add API endpoints as needed

---

## Postman Testing

### Test Public API

```
GET http://localhost:3000/api/portfolio
Expected: 200 OK with sections and projects
```

### Test Admin API (Authenticated)

```
GET http://localhost:3000/api/admin/portfolio
Headers: Cookie: next-auth.session-token=...
Expected: 200 OK

POST http://localhost:3000/api/admin/portfolio/project
Headers: Cookie: next-auth.session-token=...
Body:
{
  "title": "Test Project",
  "slug": "test-project",
  "description": "A test project",
  "category": "Web Development",
  "image": "",
  "liveUrl": "https://example.com",
  "githubUrl": "https://github.com/example/test",
  "isFeatured": false,
  "isActive": true
}
Expected: 200 OK with created project
```

### Test Unauthorized

```
POST http://localhost:3000/api/admin/portfolio/project
Expected: 401 Unauthorized (no session)
```

### Test Forbidden (No MANAGE_PORTFOLIO)

```
GET http://localhost:3000/api/admin/portfolio
Headers: Cookie: next-auth.session-token=<admin-without-permission>
Expected: 403 Forbidden
```

---

## Image Upload

All images use the `ImageUpload` component.
- Stored in `/uploads/images/` with unique filenames
- DB stores filename only
- Served via `GET /api/uploads/[filename]`
- `SafeImage` resolves filenames to URLs

---

## Rendering Strategy

- **Public page**: ISR with `revalidate = 60`
- **Admin page**: Client-side rendering (CSR)
- **Hero**: Eager SSR
- **Other sections**: Code-split with `next/dynamic` + SSR preserved
- **Filtering**: Client-side state management
