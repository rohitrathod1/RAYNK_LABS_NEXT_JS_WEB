# SEO Dashboard System - Documentation

## Overview

The SEO Dashboard System provides a complete content management system for per-page SEO metadata. It allows admin users to control SEO settings for all public pages.

## SEO Pages Supported

- Home
- About
- Services
- Portfolio
- Blog
- Team
- Contact

## Prisma Model

```prisma
model Seo {
  id            String   @id @default(cuid())
  page          String   @unique       // "home", "about", "services", etc.
  title         String?                // meta title (shown in browser tab + Google)
  description   String?                // meta description
  keywords      String?                // comma-separated keywords
  ogTitle       String?                // OG title for social sharing
  ogDescription String?                // OG description for social sharing
  ogImage       String?                // OG image (bare filename or full URL)
  twitterCard   String   @default("summary_large_image")
  canonicalUrl  String?
  robots        String   @default("index,follow")
  noIndex       Boolean  @default(false)

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([page])
}
```

## Module Structure

```
src/modules/seo/
├── index.ts           # Exports components and types
├── types.ts           # TypeScript interfaces
├── validations.ts     # Zod validation schemas
├── data/
│   ├── index.ts       # Re-exports
│   ├── queries.ts    # Database queries
│   └── mutations.ts  # Database mutations
└── components/
    ├── index.ts       # Component exports
    ├── SeoTabPanel.tsx  # SEO form panel
    ├── SeoPreview.tsx   # Google preview simulation
    └── SeoGuide.tsx    # SEO help guide
```

## API Routes

### Public API

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/seo?page=home` | Get SEO data for a page |

### Admin API

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/seo` | List all SEO records (requires MANAGE_SEO) |
| GET | `/api/admin/seo/[page]` | Get SEO for specific page |
| PUT | `/api/admin/seo/[page]` | Update SEO for specific page |
| DELETE | `/api/admin/seo/[page]` | Delete SEO record |

## SEO Dashboard Page

**Route**: `/admin/dashboard/seo`

**Features**:
1. **Page Selector** - Dropdown to select which page to edit
2. **SEO Fields**:
   - Meta Title (max 70 chars)
   - Meta Description (max 180 chars)
   - Keywords (comma-separated)
   - OG Title
   - OG Description
   - OG Image upload
   - Canonical URL
   - Robots directive
3. **Google Preview** - Live preview of how the page appears in search results
4. **Save Button** - Save SEO changes

## Page Integration

All public pages must use `resolveSeo()` from `@/lib/seo`:

```typescript
import { resolveSeo } from "@/lib/seo";
import { getSeoByPage } from "@/modules/seo/data/queries";

export async function generateMetadata({ params }: { params: { slug?: string } }): Promise<Metadata> {
  const seo = await getSeoByPage("page_name");
  return resolveSeo(seo);
}
```

### Pages with SEO Integration:
- ✅ / (Home)
- ✅ /about
- ✅ /services
- ✅ /portfolio
- ✅ /blog
- ✅ /team
- ✅ /contact

## Permission System

- All admin SEO routes require `MANAGE_SEO` permission
- SUPER_ADMIN has full access
- Permission check: `requirePermission("MANAGE_SEO")`

## UI Features

### SEO Tab Panel (SeoTabPanel)
- Form fields with validation
- Live Google search preview
- Copy buttons for URLs and titles
- Image upload for OG image
- Twitter card type selector

### SEO Preview (SeoPreview)
- Simulates Google search result
- Shows title (blue link style)
- Shows URL
- Shows description

### SEO Guide (SeoGuide)
- Tips for writing good meta titles
- Tips for writing good meta descriptions
- Keyword best practices

## Workflow

1. **Admin Login** - Admin logs in with MANAGE_SEO permission
2. **Navigate to SEO Dashboard** - Go to `/admin/dashboard/seo`
3. **Select Page** - Choose which page to edit from the dropdown
4. **Edit SEO Fields** - Update meta title, description, keywords, etc.
5. **Preview** - See live Google search preview
6. **Save** - Click save to store changes
7. **Verify** - Check public page metadata

## Build Verification

After all changes, run:
```bash
npm run build
npm run lint
```

### Known Issues:
- Build may fail with "Server Functions cannot be called during initial render" error in `_not-found` page
- This is a pre-existing issue unrelated to the SEO module
- The SEO module itself compiles and type-checks successfully

## Postman Testing

### Test Public API
```
GET http://localhost:3000/api/seo?page=home
```

### Test Admin APIs (requires auth token)
```
GET http://localhost:3000/api/admin/seo
GET http://localhost:3000/api/admin/seo/home
PUT http://localhost:3000/api/admin/seo/home
Body: {
  "title": "Updated Title",
  "description": "Updated description",
  "keywords": "keyword1, keyword2"
}
DELETE http://localhost:3000/api/admin/seo/home
```
