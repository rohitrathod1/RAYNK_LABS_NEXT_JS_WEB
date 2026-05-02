# Admin Users

Route: `/admin/users`

Permission: `MANAGE_USERS`

## UI

- Admin list displays role, status, and exact DB permission badges.
- Clicking a row opens Admin Details.
- Edit modal pre-selects saved permissions from the database.
- Saving permissions sends permission names to the backend.

## API

- `GET /api/admin/users` - fetch admins with permissions.
- `POST /api/admin/users` - create admin.
- `PUT /api/admin/users/[id]` - update admin.
- `DELETE /api/admin/users/[id]` - delete admin.
- `GET /api/admin/permissions` - list permission records.
- `POST /api/admin/users/permissions` - replace user permissions.

All routes require `MANAGE_USERS`.
