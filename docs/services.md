# Services Page CMS - Documentation

## Overview
The Services Page CMS provides a complete content management system for the services section of RaYnk Labs website. It includes public UI, admin dashboard, API routes, and SEO integration.

## Page Structure

### Sections
1. **Hero** - Main banner with title, subtitle, and background image
2. **Categories** - Filter tabs for service categories (Website Design, SEO, Graphic Design)
3. **Services List** - Grid of service cards with icons, titles, descriptions, and CTAs
4. **Why Choose** - Benefits/points highlighting why choose our services
5. **Process** - Step-by-step process (Plan → Design → Develop → Launch)
6. **Contact CTA** - Call-to-action section with "Get Service" button

## File Structure

```
src/
├── modules/services/
│   ├── types.ts              # TypeScript interfaces
│   ├── validations.ts        # Zod validation schemas
│   ├── actions.ts            # Server actions for admin
│   ├── data/
│   │   ├── queries.ts       # Database queries
│   │   ├── mutations.ts     # Database mutations
│   │   └── defaults.ts      # Default content
│   └── components/
│       ├── hero.tsx          # Hero section component
│       ├── categories.tsx    # Categories filter component
│       ├── services-grid.tsx # Services grid component
│       ├── why.tsx           # Why choose section
│       ├── process.tsx       # Process steps component
│       ├── cta.tsx           # Contact CTA component
│       └── main.tsx          # Main client component
├── app/
│   ├── services/
│   │   └── page.tsx         # Public services page
│   ├── api/
│   │   ├── services/
│   │   │   └── route.ts     # Public API endpoint
│   │   └── admin/
│   │       └── services/
│   │           └── route.ts  # Admin API endpoint
│   └── admin/
│       └── (dashboard)/
│           └── services/
│               └── page.tsx  # Admin dashboard page
└── prisma/
    └── schema/
        └── services.prisma   # Prisma model
```

## API Endpoints

### Public API
- **GET** `/api/services` - Fetch all active services page sections
  - Returns: `{ success: boolean, data: Record<string, unknown> }`
  - Cached for 60 seconds

### Admin API (Requires MANAGE_SERVICES permission)
- **GET** `/api/admin/services` - Fetch all sections for editing
- **POST** `/api/admin/services` - Update a section
  - Body: `{ section: string, content: unknown }`
  - Sections: hero, categories, services_list, why_choose_service, process, contact_cta

## Database Model

```prisma
model ServicesPage {
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

## Permissions

- **MANAGE_SERVICES** - Required to access admin services page and API
- **SUPER_ADMIN** - Full access to all operations

## SEO Integration

The services page integrates with the existing SEO system:
- SEO data stored in `Seo` table with `page: "services"`
- Managed via the "seo" tab in admin dashboard
- Fields: metaTitle, metaDescription, keywords, ogImage, noIndex

## Workflow

1. Admin logs in with MANAGE_SERVICES permission
2. Navigate to `/admin/services`
3. Select section tab (hero, categories, services_list, etc.)
4. Edit content in the form
5. Click "Save Changes"
6. Public page at `/services` reflects changes

## Postman Testing

### Test Public API
```
GET http://localhost:3000/api/services
```

### Test Admin API (requires authentication)
```
GET http://localhost:3000/api/admin/services
Headers:
  Cookie: (session cookie)

POST http://localhost:3000/api/admin/services
Headers:
  Cookie: (session cookie)
  Content-Type: application/json
Body:
{
  "section": "hero",
  "content": {
    "title": "Our Services",
    "subtitle": "Test subtitle",
    "backgroundImage": "test.png"
  }
}
```

## Notes
- All components use dynamic imports (lazy loading) for performance
- Images handled via ImageUpload component
- Default content provided in `defaults.ts`
- Follows existing home page CMS patterns
