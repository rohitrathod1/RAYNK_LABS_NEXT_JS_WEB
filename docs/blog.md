# Blog CMS System

## Overview

The Blog system is a complete content management platform with public listing/detail pages, an admin dashboard featuring a TipTap rich text editor, SEO integration, and permission-based access control.

---

## Page Structure

### Public Pages

| Route | Description |
|-------|-------------|
| `/blog` | Blog listing page with grid of published articles |
| `/blog/[slug]` | Individual blog post detail page |

### Admin Page

| Route | Description |
|-------|-------------|
| `/admin/dashboard/blogs` | Full blog management dashboard |

---

## Module Structure

```
src/modules/blog/
├── types.ts              # TypeScript interfaces
├── validations.ts        # Zod schemas for form validation
├── actions.ts            # Server actions for admin updates
├── index.ts              # Barrel exports
├── components/
│   ├── index.ts
│   ├── main.tsx          # BlogContent with dynamic imports
│   ├── blog-card.tsx     # Individual blog card for listing
│   ├── blog-list.tsx     # Blog listing grid section
│   ├── blog-detail.tsx   # Full blog post detail view
│   └── editor.tsx        # TipTap rich text editor
└── data/
    ├── index.ts
    ├── queries.ts        # getPublishedBlogs(), getBlogBySlug(), etc.
    ├── mutations.ts      # create/update/delete blog posts
    └── defaults.ts       # defaultSeo, defaultBlogContent
```

---

## Prisma Models

### BlogPost

```prisma
model BlogPost {
  id              String   @id @default(cuid())
  title           String
  slug            String   @unique
  excerpt         String?
  content         String   @db.Text
  coverImage      String?
  author          String
  tags            String[]
  isPublished     Boolean  @default(false)
  metaTitle       String?
  metaDescription String?
  publishedAt     DateTime?
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  @@index([slug])
  @@index([isPublished])
  @@index([publishedAt])
  @@index([createdAt])
}
```

### BlogPage (sections)

```prisma
model BlogPage {
  id        String   @id @default(cuid())
  section   String   @unique       // "hero" | "blog_list"
  title     String?
  content   Json
  sortOrder Int      @default(0)
  isActive  Boolean  @default(true)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([sortOrder])
}
```

---

## Lazy Loading Strategy

| Component | Strategy | Reason |
|-----------|----------|--------|
| Blog Hero | Eager SSR | Above-the-fold, LCP-critical |
| Blog List | `next/dynamic` + SectionSkeleton | SEO content below fold |
| Blog Detail | Direct SSR | SEO-critical content |
| TipTap Editor | `next/dynamic({ ssr: false })` | Heavy component, browser-only |

---

## API Routes

### Public API

**GET `/api/blog`**
- Returns all published blog posts
- Cached with `revalidate = 60` (ISR)

**GET `/api/blog/[slug]`**
- Returns a single published post by slug
- Cached with `revalidate = 60` (ISR)
- Returns 404 if not found or not published

### Admin API

**GET `/api/admin/blog`**
- Returns all sections + all posts (including drafts)
- Requires `requirePermission("MANAGE_BLOG")`

**POST `/api/admin/blog`**
- Creates a new blog post or upserts a section
- For posts: body includes title, slug, excerpt, content, coverImage, author, tags (comma-separated), isPublished, metaTitle, metaDescription
- For sections: body includes `section` key and `content` object
- Requires `requirePermission("MANAGE_BLOG")`

**PUT `/api/admin/blog?id={id}`**
- Updates an existing blog post
- Body: Full post data
- Requires `requirePermission("MANAGE_BLOG")`

**DELETE `/api/admin/blog?id={id}`**
- Deletes a blog post
- Requires `requirePermission("MANAGE_BLOG")`

---

## Admin Dashboard

**Route:** `/admin/dashboard/blogs`

### Tabs:

1. **Posts**
   - List of all posts with title, author, date, status (Published/Draft)
   - "New Post" button opens creation dialog
   - Per-post actions:
     - Toggle publish/unpublish (eye icon)
     - Edit (pencil icon)
     - Delete (trash icon)

2. **Page Sections** (with sub-tabs)
   - Hero: title, subtitle, background image
   - Blog List: title, subtitle

3. **SEO**
   - Meta title
   - Meta description
   - Keywords (comma-separated)
   - OG Image
   - No Index toggle

### Create/Edit Post Dialog

Fields:
- Title *
- Slug * (auto-formatted to lowercase kebab-case)
- Author *
- Excerpt (short summary for card view)
- Cover Image (via ImageUpload)
- Tags (comma-separated)
- Content * (TipTap rich text editor with bold, italic, headings, lists, quotes, code, links, images, undo/redo)
- Meta Title (custom SEO title)
- Meta Description (custom SEO description)
- Publish toggle

---

## TipTap Editor Features

The rich text editor includes:
- **Text formatting**: Bold, Italic, Inline Code
- **Headings**: H1, H2, H3
- **Lists**: Bullet list, Ordered list
- **Block elements**: Blockquote
- **Media**: Image insertion via URL
- **Links**: Link insertion with URL input
- **History**: Undo, Redo
- **Typography**: Auto-conversion of typographic characters
- **Placeholder**: Empty state hint

---

## SEO Integration

### Blog Listing Page

Uses the `Seo` table with `page = "blog"` as the unique key.

```typescript
export async function generateMetadata(): Promise<Metadata> {
  const seo = await getBlogSeo();
  return resolveSeo(seo, defaultSeo.title ?? undefined);
}
```

### Blog Detail Page

Uses per-post SEO fields with fallback chain:

1. Post's `metaTitle` / `metaDescription`
2. Post's `title` / `excerpt`
3. Blog-level SEO from `Seo` table
4. Site-wide defaults

```typescript
export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogBySlug(slug);
  // Falls back to post.title, post.excerpt, blog SEO, site defaults
}
```

---

## Permission System

### Required Permission

```typescript
requirePermission("MANAGE_BLOG")
```

### Access Rules
- **SUPER_ADMIN**: Full access (bypasses permission check)
- **ADMIN**: Requires explicit `MANAGE_BLOG` permission
- **No permission**: Returns 403 Forbidden

### Permission Flow
1. Admin accesses `/admin/dashboard/blogs`
2. API calls `/api/admin/blog` with session cookie
3. `requirePermission("MANAGE_BLOG")` validates session and permission
4. Server actions also validate before mutations

---

## Workflow

### For Content Authors

1. Log in to `/admin/login`
2. Navigate to Blog Manager in the dashboard
3. Click "New Post" to create an article
4. Fill in all fields and write content using TipTap editor
5. Toggle "Publish immediately" to make it live
6. Click "Create" to save
7. Edit existing posts using the pencil icon
8. Configure SEO for the blog listing in the "SEO" tab

### For Developers

1. Modify types in `types.ts`
2. Update Zod schemas in `validations.ts`
3. Update defaults in `defaults.ts`
4. Add/modify components in `components/`
5. Update actions in `actions.ts`
6. Extend TipTap editor with new extensions as needed

---

## Postman Testing

### Test Public API

```
GET http://localhost:3000/api/blog
Expected: 200 OK with array of published posts

GET http://localhost:3000/api/blog/{slug}
Expected: 200 OK with single post
```

### Test Admin API (Authenticated)

```
GET http://localhost:3000/api/admin/blog
Headers: Cookie: next-auth.session-token=...
Expected: 200 OK with sections and all posts

POST http://localhost:3000/api/admin/blog
Headers: Cookie: next-auth.session-token=...
Body:
{
  "title": "My First Post",
  "slug": "my-first-post",
  "excerpt": "A brief summary",
  "content": "<p>Hello world</p>",
  "author": "John Doe",
  "tags": "Web Dev, React",
  "isPublished": true,
  "metaTitle": "My First Post | RaYnk Labs",
  "metaDescription": "An amazing blog post about..."
}
Expected: 200 OK with created post
```

### Test Unauthorized

```
POST http://localhost:3000/api/admin/blog
Expected: 401 Unauthorized
```

### Test Forbidden (No MANAGE_BLOG)

```
GET http://localhost:3000/api/admin/blog
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

- **Public pages**: ISR with `revalidate = 60`
- **Admin page**: Client-side rendering (CSR)
- **TipTap Editor**: `ssr: false` dynamic import (browser-only)
- **Blog listing**: Code-split with `next/dynamic`
- **Blog detail**: Direct SSR for SEO
