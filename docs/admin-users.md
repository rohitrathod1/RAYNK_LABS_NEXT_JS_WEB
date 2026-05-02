# Admin Users & RBAC System

## Overview

A complete Role-Based Access Control (RBAC) system for the RaYnk Labs admin panel. All access is permission-based (DB-driven), with SUPER_ADMIN having full bypass.

---

## Database Schema

### Models

#### Admin (existing, extended)

```prisma
model Admin {
  id          String           @id @default(cuid())
  name        String
  email       String           @unique
  password    String
  role        AdminRole        @default(ADMIN)
  status      AdminStatus      @default(PENDING)
  permissions UserPermission[]
  // ... other fields
}
```

#### Permission

```prisma
model Permission {
  id          String           @id @default(cuid())
  name        String           @unique
  description String?
  users       UserPermission[]
}
```

#### UserPermission (junction table)

```prisma
model UserPermission {
  id           String     @id @default(cuid())
  userId       String
  permissionId String
  user         Admin      @relation(fields: [userId], references: [id], onDelete: Cascade)
  permission   Permission @relation(fields: [permissionId], references: [id], onDelete: Cascade)

  @@unique([userId, permissionId])
}
```

### Enums

```prisma
enum AdminRole {
  ADMIN
  SUPER_ADMIN
}

enum AdminStatus {
  PENDING
  APPROVED
  REJECTED
  SUSPENDED
}
```

---

## Available Permissions

| Permission           | Description                        |
|---------------------|------------------------------------|
| EDIT_HOME           | Edit home page content             |
| EDIT_ABOUT          | Edit about page content            |
| MANAGE_SERVICES     | Manage services section            |
| MANAGE_PORTFOLIO    | Manage portfolio/projects          |
| MANAGE_BLOG         | Manage blog posts                  |
| MANAGE_TEAM         | Manage team members                |
| MANAGE_CONTACT      | Manage contact forms               |
| MANAGE_NAVBAR       | Manage navigation bar              |
| MANAGE_FOOTER       | Manage footer content              |
| MANAGE_SEO          | Manage SEO settings                |
| MANAGE_USERS        | Manage admin users and permissions |

---

## File Structure

```
src/
├── modules/rbac/
│   ├── constants.ts              # Permission constants & descriptions
│   ├── queries.ts                # getUserPermissions, getAllPermissions, getAdminsWithPermissions
│   ├── mutations.ts              # createAdmin, updateAdmin, deleteAdmin, assignPermissions
│   ├── actions.ts                # Server actions (getPermissionsAction, assignPermissionsAction, etc.)
│   ├── data/
│   │   ├── queries.ts            # Re-exports from queries.ts
│   │   └── mutations.ts          # Re-exports from mutations.ts
│   └── index.ts                  # Re-exports all
├── middleware/
│   └── permission.ts             # checkPermission(), requirePermission()
├── lib/
│   └── require-admin.ts          # requireAdmin(), UnauthorizedError, ForbiddenError
├── app/api/admin/
│   ├── users/
│   │   ├── route.ts              # GET (list), POST (create) — requires MANAGE_USERS
│   │   ├── [id]/
│   │   │   └── route.ts          # PUT (update), DELETE — requires MANAGE_USERS
│   │   └── permissions/
│   │       └── route.ts          # POST (assign permissions) — requires MANAGE_USERS
│   ├── permissions/
│   │   └── route.ts              # GET (list all permissions) — requires MANAGE_USERS
│   ├── home/
│   │   └── route.ts              # GET/POST home sections — requires EDIT_HOME
│   └── seo/
│       ├── route.ts              # GET all SEO — requires MANAGE_SEO
│       └── [page]/
│           └── route.ts          # GET/PUT/DELETE per-page SEO — requires MANAGE_SEO
└── app/admin/(dashboard)/
    └── users/
        └── page.tsx              # User management UI
```

---

## Permission System

### Core Rule

**NEVER** use role-based checks like `if (role === "ADMIN")`.
**ALWAYS** use `requirePermission("PERMISSION_NAME")`.

### SUPER_ADMIN Bypass

SUPER_ADMIN automatically passes all permission checks — no explicit permission assignment needed.

### Usage in API Routes

```typescript
import { requirePermission } from "@/middleware/permission";

export async function GET() {
  await requirePermission("MANAGE_BLOG");
  // ... proceed
}
```

### Usage in Server Actions

```typescript
import { requirePermission } from "@/middleware/permission";

export async function someAction() {
  await requirePermission("EDIT_HOME");
  // ... proceed
}
```

### Permission Check Functions

#### `checkPermission(session, permission): Promise<boolean>`

Returns `true` if the user has the permission (or is SUPER_ADMIN), `false` otherwise.
Useful for conditional UI rendering.

#### `requirePermission(permission): Promise<Session>`

Throws `UnauthorizedError` (401) if not logged in, or `ForbiddenError` (403) if lacking permission.
SUPER_ADMIN bypasses the check entirely.
Use in all API routes and server actions.

---

## API Routes

### GET `/api/admin/users`

Returns all admins with their permissions.

**Requires:** `MANAGE_USERS` permission

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "clxxx...",
      "name": "John Doe",
      "email": "john@raynklabs.com",
      "role": "ADMIN",
      "status": "APPROVED",
      "permissions": ["EDIT_HOME", "MANAGE_BLOG"],
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

### POST `/api/admin/users`

Creates a new admin.

**Requires:** `MANAGE_USERS` permission

**Body:**
```json
{
  "name": "John Doe",
  "email": "john@raynklabs.com",
  "password": "secure-password"
}
```

### PUT `/api/admin/users/[id]`

Updates an admin.

**Requires:** `MANAGE_USERS` permission

**Body:**
```json
{
  "name": "John Updated",
  "email": "john@raynklabs.com",
  "password": "new-password",
  "status": "APPROVED"
}
```

Password is optional — only update if provided.

### DELETE `/api/admin/users/[id]`

Deletes an admin.

**Requires:** `MANAGE_USERS` permission

**Restrictions:**
- Cannot delete SUPER_ADMIN
- Cannot delete yourself

### POST `/api/admin/users/permissions`

Assigns permissions to an admin.

**Requires:** `MANAGE_USERS` permission

**Body:**
```json
{
  "userId": "clxxx...",
  "permissions": ["EDIT_HOME", "MANAGE_BLOG", "MANAGE_SEO"]
}
```

This replaces all existing permissions (not additive).

### GET `/api/admin/permissions`

Returns all available permissions.

**Requires:** `MANAGE_USERS` permission

### GET/POST `/api/admin/home`

Admin CRUD for home page sections.

**Requires:** `EDIT_HOME` permission

### GET/PUT/DELETE `/api/admin/seo/[page]`

Per-page SEO management.

**Requires:** `MANAGE_SEO` permission

---

## Server Actions

All home page server actions in `src/modules/home/actions.ts` use `requirePermission("EDIT_HOME")`:

- `updateHomeHero()`
- `updateHomeMission()`
- `updateHomeFeaturedProducts()`
- `updateHomeHealthBenefits()`
- `updateHomeTestimonials()`
- `updateHomeCta()`
- `updateHomeSeo()`

### RBAC Server Actions (`src/modules/rbac/actions.ts`)

- `getPermissionsAction()` — Get all available permissions
- `getAdminsAction()` — Get all admins with permissions
- `getUserPermissionsAction(userId)` — Get permissions for a specific user
- `assignPermissionsAction(userId, permissionNames)` — Assign permissions to a user

---

## UI Flow

### User Management Page (`/admin/users`)

1. **Table View**: Lists all admins with avatar, name, email, role badge, permission tags, status toggle, and actions
2. **Search**: Filter by name or email
3. **Add Admin**: Opens modal with name, email, password, and permission checkboxes
4. **Edit Admin**: Opens modal with pre-filled data, status toggle, and permission checkboxes
5. **View Admin**: Opens modal showing full admin details
6. **Delete Admin**: Confirmation prompt, then delete (restricted for SUPER_ADMIN and self)
7. **Status Toggle**: Switch between APPROVED and SUSPENDED

### Permission Checkboxes

Each permission is displayed as a checkbox with:
- Permission name (human-readable, underscores replaced with spaces)
- Description below the name
- Visual feedback when checked (border highlight + background tint)

### Role Badges

- **SUPER_ADMIN**: Purple badge with shield icon
- **ADMIN**: Blue badge with shield icon

### Status Toggle

- Green toggle = APPROVED (active)
- Gray toggle = SUSPENDED (disabled)

---

## Seeding

Run `npm run db:seed` to:
1. Create all 11 permissions
2. Grant all permissions to the SUPER_ADMIN
3. Create the SUPER_ADMIN account (from env vars)

Run `npm run db:seed:reset` to reset and re-seed.

---

## Security Notes

1. **Passwords are never returned** in API responses
2. **SUPER_ADMIN cannot be deleted** via API
3. **Admins cannot delete themselves**
4. **Admins cannot disable themselves** via status toggle
5. **All admin APIs use `requirePermission()`** — not role-based checks
6. **SUPER_ADMIN bypasses all permission checks**
7. **Passwords are hashed with bcrypt (cost 12)**
8. **Middleware enforces auth + role at edge level** before requests reach route handlers
9. **Rate limiting** protects auth endpoints (5/15min) and admin mutations (60/min)
10. **CSRF origin check** on all API mutations

---

## Permission Mapping

| Route/Action                    | Required Permission |
|--------------------------------|---------------------|
| `/api/admin/users` (all)       | MANAGE_USERS        |
| `/api/admin/permissions`       | MANAGE_USERS        |
| `/api/admin/users/permissions` | MANAGE_USERS        |
| `/api/admin/home` (GET/POST)   | EDIT_HOME           |
| Home server actions            | EDIT_HOME           |
| `/api/admin/seo/*`             | MANAGE_SEO          |
| `/api/upload`                  | Any admin role      |
