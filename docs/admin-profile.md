# Admin Profile

Route: `/admin/profile`

Permission: authenticated admin account.

## UI

- Shows admin avatar, name, email, role, status, and profile details.
- Editable fields include name, bio, profile image, and social links.
- Profile image uses the shared upload flow and safe image rendering.

## API

- `GET /api/admin/profile` - fetch current admin profile.
- `POST /api/admin/profile` - update current admin profile.

The profile API requires a valid admin session.
