# Navbar CMS System

## Overview
Dynamic navigation bar system with admin control for managing links, dropdowns, and hierarchy.

## Prisma Model
Location: `prisma/schema/navbar.prisma`

```prisma
model NavLink {
  id        String   @id @default(cuid())
  title     String
  href      String
  parentId  String?      // null = top-level, has value = child
  isVisible Boolean  @default(true)
  sortOrder Int      @default(0)

  parent    NavLink? @relation("NavHierarchy", fields: [parentId], references: [id])
  children  NavLink[] @relation("NavHierarchy")

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([parentId])
  @@index([sortOrder])
}
```

## Module Structure
Location: `src/modules/navbar/`

```
navbar/
├── types.ts        # TypeScript types
├── validations.ts  # Zod schemas
├── actions.ts      # Server actions
├── data/
│   ├── queries.ts  # Read operations
│   ├── mutations.ts # Write operations
│   └── index.ts
└── index.ts
```

## API Routes

### Public
- `GET /api/navbar` - Returns visible nav links with children

### Admin (requires MANAGE_NAVBAR permission)
- `GET /api/admin/navbar` - List all links (including hidden)
- `POST /api/admin/navbar` - Create new link
- `PUT /api/admin/navbar/[id]` - Update link
- `DELETE /api/admin/navbar/[id]` - Delete link (deletes children too)
- `POST /api/admin/navbar/reorder` - Reorder links

## Components
Location: `src/components/navbar/`

```
navbar/
├── navbar.tsx          # Main navbar (exact UI from NEXT_JS_WEB_JIVO.IN)
├── navbar-wrapper.tsx  # Server component wrapper (fetches data)
└── index.ts
```

## UI Features
- Fixed transparent header (becomes blurred on scroll)
- Horizontal desktop menu with hover dropdowns
- Mobile hamburger menu with accordion submenus
- Framer Motion animations
- Dropdown with silver background (#c0c0c0)
- Underline hover effects

## Admin Dashboard
Location: `src/app/admin/(dashboard)/navbar/page.tsx`

Features:
- Table view with parent/child hierarchy
- Add/Edit/Delete links
- Reorder with up/down arrows
- Toggle visibility
- Parent-child relationship management

## Usage
Navbar is automatically included in root layout via `NavbarWrapper` server component.

## Permissions
- `MANAGE_NAVBAR` - Required for all admin operations
- Super admins have automatic access
