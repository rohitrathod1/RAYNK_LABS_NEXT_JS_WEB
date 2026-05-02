# Admin Team

Route: `/admin/team`

Permission: `MANAGE_TEAM`

## UI

- Team content and team member management use admin cards and modals.
- Team members support view/edit/delete actions.
- Image fields use the shared upload flow.

## API

- `GET /api/team` - public team content.
- `GET /api/admin/team` - admin team content.
- `POST /api/admin/team` - update team page sections.
- `POST /api/admin/team/member` - create team member.
- `PUT /api/admin/team/member` - update team member.
- `DELETE /api/admin/team/member` - remove team member.

All admin routes require `MANAGE_TEAM`.
