# Admin SEO

Route: `/admin/seo`

Permission: `MANAGE_SEO`

## UI

- Dashboard cards show total pages, indexed pages, and no-index pages.
- Page cards show meta title, meta description, and robots/index status.
- Actions: edit, preview public page, delete.
- Add Page SEO opens a modal and creates a new page SEO record.
- If the API returns no rows or fails, the UI shows fallback SEO rows for core pages.

## API

- `GET /api/seo?page=home` - public SEO fetch.
- `GET /api/admin/seo` - list all SEO records.
- `GET /api/admin/seo?page=home` - fetch one record.
- `POST /api/admin/seo` - create/update SEO.
- `PUT /api/admin/seo/[page]` - compatibility update route.
- `DELETE /api/admin/seo` - delete SEO record by `{ page }`.
- `DELETE /api/admin/seo/[page]` - compatibility delete route.

## Data

Uses `SeoPage` with `page`, `metaTitle`, `metaDescription`, `keywords`, `ogImage`, `canonicalUrl`, and `isIndexed`.
