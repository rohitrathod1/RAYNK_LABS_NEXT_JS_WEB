# Home Page — Documentation

## 1. PAGE OVERVIEW

- **Page name:** Home
- **Public route:** `/`
- **Admin route:** `/admin/dashboard/home`
- **Prisma model:** `HomePage`
- **Sections:** hero, mission, featured-products, health-benefits, testimonials, cta
- **SEO:** `Seo` table, `page = "home"`

---

## 2. UI STRUCTURE

| Section | What the user sees |
|---|---|
| **hero** | Full-screen section — badge, large heading, subheading, primary + secondary CTA buttons, optional background image |
| **mission** | Two-column layout — text + stats grid on left, image on right |
| **featured-products** | Section heading + subtitle + 3-column product card grid (image, badge, name, description, link) |
| **health-benefits** | Section heading + subtitle + 2×3 icon + title + description benefit grid |
| **testimonials** | Section heading + subtitle + 3-column testimonial card grid (star rating, quote, avatar, name, role) |
| **cta** | Full-width primary-colored banner — heading, subheading, single CTA button, optional background image |

---

## 3. API DOCUMENTATION

### `GET /api/home`
Public endpoint. ISR cached (revalidate = 60s).

**Response:**
```json
{
  "success": true,
  "data": {
    "hero": { "heading": "...", "subheading": "...", "ctaText": "...", "ctaHref": "...", "secondaryCtaText": "...", "secondaryCtaHref": "...", "backgroundImage": "filename.webp", "badgeText": "..." },
    "mission": { "title": "...", "body": "...", "image": "filename.webp", "stats": [{ "label": "...", "value": "..." }] },
    "featured-products": { "title": "...", "subtitle": "...", "products": [{ "name": "...", "description": "...", "image": "...", "href": "...", "badge": "..." }] },
    "health-benefits": { "title": "...", "subtitle": "...", "benefits": [{ "title": "...", "description": "...", "icon": "Rocket" }] },
    "testimonials": { "title": "...", "subtitle": "...", "testimonials": [{ "name": "...", "role": "...", "avatar": "...", "quote": "...", "rating": 5 }] },
    "cta": { "heading": "...", "subheading": "...", "ctaText": "...", "ctaHref": "...", "backgroundImage": "..." }
  }
}
```

### `GET /api/admin/home`
Admin only (ADMIN or SUPER_ADMIN role required). Returns same structure but includes inactive sections.

### `POST /api/admin/home`
Admin only.

**Request body:**
```json
{
  "section": "hero",
  "content": { "heading": "...", "subheading": "...", "ctaText": "...", "ctaHref": "..." }
}
```

**Response:**
```json
{ "success": true, "data": { "id": "...", "section": "hero", "content": {...} } }
```

---

## 4. WORKFLOW

```
Admin edits form in /admin/dashboard/home
  → Clicks "Save Changes"
  → Server action (updateHomeHero, etc.) called
  → requireAdmin() checked
  → Zod validates input
  → upsertHomeSection() writes to DB
  → revalidatePath("/") + revalidatePath("/admin/dashboard/home")
  → ISR invalidated → next request rebuilds page
  → User sees change within 60s
```

---

## 5. DATA STRUCTURE

### `hero` section
```ts
{
  heading: string;
  subheading: string;
  ctaText: string;
  ctaHref: string;
  secondaryCtaText: string;
  secondaryCtaHref: string;
  backgroundImage: string;   // bare filename
  badgeText: string;
}
```

### `mission` section
```ts
{
  title: string;
  body: string;
  image: string;             // bare filename
  stats: { label: string; value: string }[];
}
```

### `featured-products` section
```ts
{
  title: string;
  subtitle: string;
  products: {
    name: string;
    description: string;
    image: string;           // bare filename
    href: string;
    badge: string;
  }[];
}
```

### `health-benefits` section
```ts
{
  title: string;
  subtitle: string;
  benefits: {
    title: string;
    description: string;
    icon: string;            // Lucide icon name (e.g. "Rocket", "Star", "Code")
  }[];
}
```

### `testimonials` section
```ts
{
  title: string;
  subtitle: string;
  testimonials: {
    name: string;
    role: string;
    avatar: string;          // bare filename
    quote: string;
    rating: number;          // 1–5
  }[];
}
```

### `cta` section
```ts
{
  heading: string;
  subheading: string;
  ctaText: string;
  ctaHref: string;
  backgroundImage: string;   // bare filename
}
```

---

## 6. IMAGE HANDLING

- All images stored as **bare filenames** in DB (e.g. `"1714049200-hero.webp"`)
- Upload via `POST /api/upload` (multipart/form-data, key = `"file"`)
- Sharp processes: resize max 1600×1600, re-encode WebP, strip EXIF
- Served via `GET /api/uploads/[filename]` with `Cache-Control: public, max-age=86400, s-maxage=604800`
- Fallback: `GET /api/uploads/placeholder.png`
- Components use `<SafeImage src={filename} />` — auto-resolves to API URL, retries on fail, shows placeholder on error

---

## 7. SEO

- **Storage:** `Seo` table, `page = "home"`
- **Fields:** title, description, keywords (string), ogImage (bare filename or URL), noIndex
- **Fallback chain:**
  1. DB row (admin-controlled via SEO tab)
  2. `defaultSeo` in `src/modules/home/data/defaults.ts`
  3. Site-wide fallback in `src/lib/seo.ts`
- **Used in:** `src/app/(public)/home/page-content.tsx` → `generateMetadata()` → `resolveSeo()`

---

## 8. POSTMAN TESTING

1. **Login:** `POST /api/auth/callback/credentials` with `{ email, password }` — capture `next-auth.session-token` cookie
2. **Public data:** `GET /api/home` — no auth required
3. **Admin data:** `GET /api/admin/home` — requires session cookie
4. **Update hero:** `POST /api/admin/home` with body `{ "section": "hero", "content": { "heading": "New heading", "subheading": "...", "ctaText": "...", "ctaHref": "/" } }`
5. **Verify:** `GET /api/home` — confirm changes reflected

---

## 9. UPDATE LOG

[2026-04-26] — Initial home page created with 6 sections: hero, mission, featured-products, health-benefits, testimonials, cta. Full admin CMS + public ISR page + API routes.
