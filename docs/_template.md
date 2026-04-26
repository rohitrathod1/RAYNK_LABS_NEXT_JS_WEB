# {Page Name} — Documentation

> Replace all `{placeholders}`. Delete this line before saving.

---

## Overview

| Property | Value |
|---|---|
| **Route** | `/{route}` |
| **Module** | `src/modules/{module}/` |
| **Public Page** | `src/app/(public)/{route}/page.tsx` |
| **Admin Page** | `src/app/admin/(dashboard)/{route}/page.tsx` |
| **Prisma Schema** | `prisma/schema/{module}.prisma` |
| **Created** | {YYYY-MM-DD} |

---

## Purpose

{One paragraph — what this page does and why it exists.}

---

## UI Structure

### Public Page (`/{route}`)

```
{Page Name}
├── PageHeader
├── {Section 1}
│   └── {component — what it renders}
└── {Section 2}
    └── {component — what it renders}
```

### Admin Page (`/admin/{route}`)

```
Admin {Page Name}
├── Header + "Add New" button
├── DataTable (columns: {col1}, {col2}, actions: edit/delete)
└── FormModal
    └── Fields: {field1}, {field2}, ...
```

---

## Data Model

```prisma
model {ModelName} {
  id        String   @id @default(cuid())
  // {field}  {Type}
  isActive  Boolean  @default(true)
  order     Int      @default(0)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  seoId String? @unique
  seo   Seo?    @relation(fields: [seoId], references: [id])
}
```

---

## API Endpoints

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| `GET` | `/api/{route}` | None | List all active |
| `GET` | `/api/{route}/[id]` | None | Get single |
| `POST` | `/api/{route}` | Admin | Create |
| `PUT` | `/api/{route}/[id]` | Admin | Update |
| `DELETE` | `/api/{route}/[id]` | Admin | Delete |

**Request body (POST/PUT):**
```json
{ "field1": "value", "field2": "value" }
```

**Response:**
```json
{ "success": true, "data": { "id": "...", "field1": "..." } }
```

---

## Server Actions

| Action | Description |
|--------|-------------|
| `create{X}` | Create item — validates, saves, revalidates path |
| `update{X}` | Update item — validates, saves, revalidates path |
| `delete{X}` | Soft delete — sets `isActive: false` |
| `reorder{X}` | Update display order |

---

## Validations

Defined in `src/modules/{module}/validations.ts`.

| Schema | Fields |
|--------|--------|
| `{x}CreateSchema` | {required fields} |
| `{x}UpdateSchema` | {all fields optional} |

---

## SEO

| Property | Source |
|---|---|
| Title | DB `seo.title` or fallback `{Default Title}` |
| Description | DB `seo.description` or `SITE_DESCRIPTION` |
| OG Image | DB `seo.ogImage` or `/og-image.png` |
| Sitemap | `/{route}` added to `src/app/sitemap.ts` |

---

## Data Flow

```
Public (SSR):
  page.tsx → get{X}() → prisma.{model}.findMany() → render

Admin (CSR):
  AdminPanel → useQuery("/api/{route}") → DataTable
  Form submit → create{X}() server action → revalidatePath
```

---

## Admin Workflow

1. Navigate to `/admin/{route}`
2. View all items in DataTable
3. **Add New** → FormModal → fill fields → submit
4. **Edit** row → FormModal pre-filled → submit
5. **Delete** row → confirm dialog → soft delete

---

## Notes

- {Any edge cases or implementation notes}
