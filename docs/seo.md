# SEO Admin Page

## Overview

The SEO admin page lets authorized admins manage page-level metadata for public pages. It uses the exact `SeoPage` Prisma model and stores title, description, keywords, OG image, and canonical URL per unique page key.

## Prisma Model

```prisma
model SeoPage {
  id              String   @id @default(cuid())
  page            String   @unique
  metaTitle       String
  metaDescription String
  keywords        String[]
  ogImage         String?
  canonicalUrl    String?
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
}
```

## API Routes

Public fetch:

```http
GET /api/seo?page=home
```

Returns the SEO record for the requested page.

Admin list and page fetch:

```http
GET /api/admin/seo
GET /api/admin/seo?page=home
```

Admin create/update:

```http
POST /api/admin/seo
Content-Type: application/json

{
  "page": "home",
  "metaTitle": "RaYnk Labs",
  "metaDescription": "Digital services and innovation lab.",
  "keywords": "raynk labs, web design, seo",
  "ogImage": "image.webp",
  "canonicalUrl": "https://raynklabs.com"
}
```

Compatibility routes:

```http
GET /api/admin/seo/[page]
PUT /api/admin/seo/[page]
DELETE /api/admin/seo/[page]
```

All admin SEO routes call `requirePermission("MANAGE_SEO")`.

## Admin UI

Route:

```text
/admin/seo
```

The UI is a responsive three-column layout on desktop:

- Left: page selector
- Center: `react-hook-form` SEO form
- Right: API status and live SEO preview

On mobile it stacks into a single column.

Editable fields:

- Meta Title
- Meta Description
- Keywords
- OG Image upload
- Canonical URL

The form validates in real time and saves through `POST /api/admin/seo`.

## Data Flow

1. Admin selects a page key.
2. UI fetches `GET /api/admin/seo?page=<page>`.
3. Admin edits form fields.
4. UI posts the payload to `POST /api/admin/seo`.
5. API validates data and upserts `SeoPage`.
6. Public pages read `SeoPage` through `getSeoData(pageName)`.
7. `resolveSeo()` converts the DB row into Next metadata.

## Public SEO Integration

Use `getSeoData()` and `resolveSeo()` in public page metadata functions:

```ts
import type { Metadata } from "next";
import { getSeoData, resolveSeo } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const seoData = await getSeoData("home");
  return resolveSeo(seoData, "Fallback Title");
}
```

`resolveSeo()` sets:

- `title`
- `description`
- `keywords`
- canonical URL
- Open Graph image
- Twitter image/card data
- robots defaults

## Admin Usage

1. Log in as `SUPER_ADMIN` or an admin with `MANAGE_SEO`.
2. Open `/admin/seo`.
3. Select the page from the left panel.
4. Fill metadata fields.
5. Upload or select an OG image.
6. Click `Save Changes`.
7. Refresh the public page and inspect metadata.

## Build Check

Run:

```bash
npm run build
npm run lint
```

In this environment, commands are run through the direct Node binary when `npm` is unavailable.
