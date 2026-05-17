# About Page

## Overview

The About page keeps the existing module architecture and now focuses on five upgraded public surfaces:

1. Hero
2. Story timeline
3. Premium stats band
4. Core team cards
5. Collaboration CTA with inquiry form

The page still resolves SEO through the shared SEO module and still loads CMS content from `aboutPage` rows.

## Public Components

- `src/modules/about/components/hero-section.tsx`
  - Removes the breadcrumb from the hero.
  - Adds lightweight motion, glow layers, and mouse-parallax watermark treatment.
- `src/modules/about/components/story.tsx`
  - Uses animated split layout with grayscale image and sequential timeline reveals.
- `src/modules/about/components/stats.tsx`
  - Replaces the flat blue strip with dark glass metric cards.
- `src/modules/about/components/team.tsx`
  - Adds richer cards with bio, skill tags, and stronger social/portfolio actions.
- `src/modules/about/components/collaboration.tsx`
  - Replaces the old social CTA with a submissions-backed inquiry form.

## Data Model

### About CMS sections

The About module now expects these section payloads from `aboutPage`:

- `hero`
- `story`
- `mission`
- `why_choose_us`
- `core_team`
- `collaboration_cta`

`social_links` is still supported in the data layer for backward compatibility, but it is no longer rendered on the public About page.

### Submission storage

The collaboration form reuses the shared Prisma `Submission` model in `prisma/schema/submission.prisma`.

Relevant fields for About inquiries:

- `type`
- `name`
- `email`
- `company`
- `subject`
- `message`
- `sourcePage`
- `status`
- `metadata`
- `createdAt`

Inquiry types used by the About page:

- `work_with_us`
- `join_team`
- `feedback`
- `partnership`
- `project_inquiry`

## Validation and Security

### Client validation

`src/modules/about/validations.ts`

- `aboutInquirySchema`
- `collaborationCtaSchema`
- richer `teamMemberSchema` with bio, skills, LinkedIn, GitHub, X, and portfolio fields

### API validation

`src/app/api/submissions/route.ts`

- Zod request validation
- basic sanitization for text fields
- metadata key limiting
- honeypot field: `website`
- fixed-window rate limiting using `checkLimit()` from `src/lib/rate-limit-local.ts`

## Admin Editing

### About editor

`src/app/admin/(dashboard)/about/page.tsx`

Editable tabs now include:

- Hero
- Story
- Mission
- Why Choose Us
- Core Team
- Collaboration CTA
- SEO

### Submissions dashboard

`/admin/dashboard/submissions`

Current capabilities:

- search
- filter by type
- read/unread state toggle
- detail modal
- delete submission
- export CSV / Excel

The About page form automatically writes into this shared dashboard.

## SEO

`src/modules/about/data/defaults.ts`

Updates:

- refreshed title/description/keywords
- removed `BreadcrumbList` structured data
- canonical still points to `/about`

## Notes

- Below-fold About sections remain lazy-loaded through `lazy-sections.tsx`.
- Motion stays lightweight and uses Framer Motion only.
- Local SVG assets under `public/about/` replace the broken placeholder images for the story and team sections.
