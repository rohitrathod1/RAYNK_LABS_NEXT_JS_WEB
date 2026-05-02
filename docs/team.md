# Team Page CMS - Documentation

## Overview

The Team Page CMS provides a complete content management system for the team page, including public UI showcase, admin dashboard for CRUD operations, API routes, SEO integration, and role-based access control.

## Page Structure

The team page consists of 6 sections:
1. **Hero** - Main banner with title, subtitle, and background image
2. **Intro** - Brief description of team culture
3. **Founders** - Highlight 1-2 founders with larger cards
4. **Team Members** - Grid layout of all team members
5. **Values** - 4-6 team values with icons
6. **Contact CTA** - Call-to-action section

## Public UI

### Components

| Component | File | Description |
|-----------|------|-------------|
| `TeamPageContent` | `main.tsx` | Main container that fetches and renders all sections |
| `HeroSection` | `hero.tsx` | Full-width hero banner with overlay |
| `IntroSection` | `intro.tsx` | Centered description text |
| `FoundersSection` | `founders.tsx` | Grid of founder cards with portfolio links |
| `TeamGrid` | `team-grid.tsx` | Responsive grid of team member cards |
| `TeamCard` | `team-card.tsx` | Individual team member card with social links |
| `ValuesSection` | `values.tsx` | Grid of value points with icons |
| `CtaSection` | `cta.tsx` | Call-to-action with button |

### Public Page Route

- **URL**: `/team`
- **File**: `src/app/(public)/team/page.tsx`
- **Content**: `src/app/(public)/team/page-content.tsx`

## Admin Dashboard

### Route

- **URL**: `/admin/dashboard/team`
- **File**: `src/app/admin/(dashboard)/team/page.tsx`

### Features

1. **Tabs Interface**:
   - Hero
   - Intro
   - Founders
   - Team Section
   - Values
   - CTA
   - Team Members (CRUD list)
   - SEO

2. **Team Member Management**:
   - Add new member (dialog form)
   - Edit existing member
   - Delete member (with confirmation)
   - Fields: name, role, bio, image, social links, portfolio, sort order, active status

3. **Image Upload**: Uses `ImageUpload` component for hero and founder images

## API Routes

### Public API

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/team` | Get all active sections and team members |

**Response**:
```json
{
  "success": true,
  "data": {
    "sections": { "hero": {...}, "intro": {...}, ... },
    "teamMembers": [...]
  }
}
```

### Admin API

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/team` | Get all sections and members (requires MANAGE_TEAM) |
| POST | `/api/admin/team` | Upsert section content (requires MANAGE_TEAM) |
| GET | `/api/admin/team/member` | List all members (requires MANAGE_TEAM) |
| POST | `/api/admin/team/member` | Create new member (requires MANAGE_TEAM) |
| PUT | `/api/admin/team/member?id=...` | Update member (requires MANAGE_TEAM) |
| DELETE | `/api/admin/team/member?id=...` | Delete member (requires MANAGE_TEAM) |

## Prisma Models

### TeamPage Model
```prisma
model TeamPage {
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

### TeamMember Model
```prisma
model TeamMember {
  id        String   @id @default(cuid())
  name      String
  role      String
  bio       String?
  image     String
  linkedin  String?
  twitter   String?
  github    String?
  portfolio String?
  isActive  Boolean  @default(true)
  sortOrder Int      @default(0)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([sortOrder])
}
```

## Module Structure

```
src/modules/team/
├── index.ts           # Exports all components and functions
├── types.ts           # TypeScript interfaces
├── validations.ts     # Zod validation schemas
├── actions.ts         # Server actions with permission checks
├── data/
│   ├── index.ts       # Re-exports
│   ├── queries.ts     # Database queries
│   ├── mutations.ts   # Database mutations
│   └── defaults.ts    # Default content and SEO
└── components/
    ├── index.ts       # Component exports
    ├── main.tsx       # Main page component
    ├── hero.tsx
    ├── intro.tsx
    ├── founders.tsx
    ├── team-grid.tsx
    ├── team-card.tsx
    ├── values.tsx
    └── cta.tsx
```

## SEO Integration

- Uses `resolveSeo` from `@/lib/seo`
- SEO data stored in `Seo` model with `page: "team"`
- Fields: title, description, keywords, ogImage, noIndex
- SEO tab available in admin dashboard

## Permission System

- All admin actions require `MANAGE_TEAM` permission
- SUPER_ADMIN has full access
- Permission check: `requirePermission("MANAGE_TEAM")`

## Default Content

Default content is defined in `src/modules/team/data/defaults.ts`:
- Hero: "Meet Our Team"
- Founders: Rohit Kumar (CEO), Priya Sharma (CTO)
- Values: Collaboration, Innovation, Integrity, Excellence, Continuous Learning
- CTA: "Join Our Team"

## Workflow

1. **View Public Page**: User visits `/team`
2. **Admin Login**: Admin logs in with MANAGE_TEAM permission
3. **Edit Content**: Admin navigates to `/admin/dashboard/team`
4. **Update Sections**: Use tabs to edit each section
5. **Manage Members**: Add/edit/delete team members
6. **SEO Settings**: Configure meta tags in SEO tab
7. **Save**: Changes are saved and page is revalidated

## Postman Testing

### Test Public API
```
GET http://localhost:3000/api/team
```

### Test Admin APIs (requires auth token)
```
GET http://localhost:3000/api/admin/team
POST http://localhost:3000/api/admin/team
Body: { "section": "hero", "content": { "title": "...", "subtitle": "...", "backgroundImage": "..." } }

GET http://localhost:3000/api/admin/team/member
POST http://localhost:3000/api/admin/team/member
Body: { "name": "...", "role": "...", "image": "..." }

PUT http://localhost:3000/api/admin/team/member?id=<member_id>
DELETE http://localhost:3000/api/admin/team/member?id=<member_id>
```

## Build Verification

After all changes, run:
```bash
npm run build
npm run lint
```

Ensure:
- No TypeScript errors
- No Prisma issues
- All API routes working
- Public page renders correctly
- Admin CRUD operations functional
