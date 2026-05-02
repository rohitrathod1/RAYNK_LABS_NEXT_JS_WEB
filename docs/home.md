# Home Page CMS System

## Overview

The Home Page is a fully CMS-driven public page with an admin dashboard for content management. It features 8 editable sections, SEO integration, and permission-based access control.

---

## Page Structure

### Public Sections (in order)

| # | Section Key | Component | Description |
|---|-------------|-----------|-------------|
| 1 | `hero` | HeroSection | Full-screen hero with heading, subtitle, dual CTA buttons, background image |
| 2 | `initiatives` | InitiativesSection | 4-card grid with icons, titles, descriptions |
| 3 | `services` | ServicesSection | 3x3 grid of service cards with icons |
| 4 | `why_digital` | WhyDigitalSection | Split layout: image left, text + bullet points right |
| 5 | `portfolio_preview` | PortfolioSection | Project grid with hover effects, tags, and links |
| 6 | `testimonials` | TestimonialsSection | Client feedback cards with star ratings and avatars |
| 7 | `why_choose_us` | WhyChooseSection | 6-point grid with icons highlighting value propositions |
| 8 | `contact_cta` | CtaSection | Final call-to-action with heading and button |

---

## Module Structure

```
src/modules/home/
├── types.ts              # TypeScript interfaces for all sections
├── validations.ts        # Zod schemas for form validation
├── actions.ts            # Server actions for admin updates
├── index.ts              # Barrel exports
├── components/
│   ├── index.ts
│   ├── main.tsx          # HomePageContent with dynamic imports
│   ├── hero-section.tsx
│   ├── initiatives-section.tsx
│   ├── services-section.tsx
│   ├── why-digital-section.tsx
│   ├── portfolio-section.tsx
│   ├── testimonials-section.tsx
│   ├── why-choose-section.tsx
│   └── cta-section.tsx
└── data/
    ├── index.ts
    ├── queries.ts        # getHomePageData(), getHomeSection(), getHomeSeo()
    ├── mutations.ts      # upsertHomeSection()
    └── defaults.ts       # defaultSeo, defaultHomeContent
```

---

## Lazy Loading Strategy

Following prompt.md Section 24:

| Section | Strategy | Reason |
|---------|----------|--------|
| Hero | Direct SSR import | LCP-critical, above-the-fold |
| Initiatives | `next/dynamic` + SectionSkeleton | SEO content below fold |
| Services | `next/dynamic` + SectionSkeleton | SEO content below fold |
| Why Digital | `next/dynamic` + SectionSkeleton | SEO content below fold |
| Portfolio | `next/dynamic` + SectionSkeleton | SEO content below fold |
| Testimonials | `next/dynamic` + SectionSkeleton | SEO content below fold |
| Why Choose Us | `next/dynamic` + SectionSkeleton | SEO content below fold |
| Contact CTA | `next/dynamic` + SectionSkeleton | SEO content below fold |

All sections use framer-motion `whileInView` for reveal-on-scroll animations.

---

## API Routes

### Public API

**GET `/api/home`**
- Returns all active home page sections as a JSON object keyed by section name
- Cached with `revalidate = 60` (ISR)
- No authentication required

**Response:**
```json
{
  "success": true,
  "data": {
    "hero": { "heading": "...", "subtitle": "...", ... },
    "initiatives": { "title": "...", "cards": [...] },
    ...
  }
}
```

### Admin API

**GET `/api/admin/home`**
- Returns all sections (including inactive) for admin editing
- Requires `requirePermission("EDIT_HOME")`
- SUPER_ADMIN has full access

**POST `/api/admin/home`**
- Upserts a single section
- Request body: `{ "section": "hero", "content": { ... } }`
- Validates content against Zod schema for the specified section
- Requires `requirePermission("EDIT_HOME")`

---

## Admin Dashboard

**Route:** `/admin/dashboard/home`

**Tabs:**
1. Hero - heading, subtitle, primary/secondary CTAs, background image
2. Initiatives - title, subtitle, 4 cards (icon, title, description)
3. Services - title, subtitle, 9 services (icon, title, description)
4. Why Digital - title, subtitle, image, bullet points
5. Portfolio - title, subtitle, items (title, description, image, href, tags)
6. Testimonials - title, subtitle, testimonials (name, role, avatar, quote, rating)
7. Why Choose Us - title, subtitle, points (icon, title, description)
8. Contact CTA - heading, subheading, CTA text, CTA link
9. SEO - meta title, meta description, keywords, OG image, noIndex toggle

Each tab has a "Save Changes" button that calls the corresponding server action.

---

## SEO Integration

### Seo Model

Uses the `Seo` table with `page = "home"` as the unique key.

### Fields
- `title` - Meta title
- `description` - Meta description
- `keywords` - Comma-separated keywords
- `ogImage` - Open Graph image URL
- `noIndex` - Boolean to exclude from search engines

### Resolution Chain

1. Database row for `page = "home"`
2. Falls back to `defaultSeo` in `src/modules/home/data/defaults.ts`
3. Falls back to site-wide constants (`SITE_NAME`, `SITE_DESCRIPTION`)

### Usage

```typescript
export async function generateMetadata(): Promise<Metadata> {
  const seo = await getHomeSeo();
  return resolveSeo(seo, defaultSeo.title ?? undefined);
}
```

---

## Permission System

### Required Permission

```typescript
requirePermission("EDIT_HOME")
```

### Access Rules
- **SUPER_ADMIN**: Full access (bypasses permission check)
- **ADMIN**: Requires explicit `EDIT_HOME` permission in `UserPermission` table
- **No permission**: Returns 403 Forbidden

### Permission Flow
1. Admin navigates to `/admin/dashboard/home`
2. API calls `/api/admin/home` with session cookie
3. `requirePermission("EDIT_HOME")` validates:
   - Session exists
   - User role is ADMIN or SUPER_ADMIN
   - If ADMIN, checks `UserPermission` table for `EDIT_HOME`
4. If valid, returns data; otherwise throws 401/403

---

## Prisma Model

```prisma
model HomePage {
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

### Section Keys
- `hero`
- `initiatives`
- `services`
- `why_digital`
- `portfolio_preview`
- `testimonials`
- `why_choose_us`
- `contact_cta`

---

## Workflow

### For Admins

1. Log in to `/admin/login`
2. Navigate to Home Editor in the dashboard sidebar
3. Select a tab (Hero, Initiatives, Services, etc.)
4. Edit fields, upload images via ImageUpload component
5. Click "Save Changes" to persist
6. Switch to SEO tab to configure meta tags
7. View live site to verify changes

### For Developers

1. Modify section types in `types.ts`
2. Update Zod schemas in `validations.ts`
3. Update default content in `defaults.ts`
4. Add/modify components in `components/`
5. Update `main.tsx` dynamic imports if adding sections
6. Add server action in `actions.ts` for new sections
7. Update admin page tabs and form fields

---

## Postman Testing

### Test Public API

```
GET http://localhost:3000/api/home
Expected: 200 OK with section data
```

### Test Admin API (Authenticated)

```
GET http://localhost:3000/api/admin/home
Headers: Cookie: next-auth.session-token=...
Expected: 200 OK with all section data

POST http://localhost:3000/api/admin/home
Headers: Cookie: next-auth.session-token=...
Body:
{
  "section": "hero",
  "content": {
    "heading": "Test Heading",
    "subtitle": "Test subtitle",
    "ctaPrimaryText": "Get Started",
    "ctaPrimaryHref": "/contact",
    "ctaSecondaryText": "Learn More",
    "ctaSecondaryHref": "/about",
    "backgroundImage": ""
  }
}
Expected: 200 OK with saved data
```

### Test Unauthorized Access

```
GET http://localhost:3000/api/admin/home
Expected: 401 Unauthorized (no session)

POST http://localhost:3000/api/admin/home
Body: { "section": "hero", "content": {...} }
Expected: 401 Unauthorized (no session)
```

### Test Forbidden Access (ADMIN without EDIT_HOME)

```
GET http://localhost:3000/api/admin/home
Headers: Cookie: next-auth.session-token=<admin-without-permission>
Expected: 403 Forbidden
```

---

## Image Upload

All images use the `ImageUpload` component from `@/components/common/image-upload`.
- Images are uploaded via `POST /api/upload`
- Stored in `/uploads/images/` with unique filenames
- DB stores only the filename (not full path)
- Served via `GET /api/uploads/[filename]`
- `SafeImage` component resolves filenames to URLs on the frontend

---

## Rendering Strategy

- **Public page**: ISR with `revalidate = 60`
- **Admin page**: Client-side rendering (CSR)
- **Hero section**: Eager SSR (no dynamic import)
- **All other sections**: Code-split with `next/dynamic` + SSR preserved for SEO
- **Animations**: Framer Motion `whileInView` for scroll-triggered reveals
