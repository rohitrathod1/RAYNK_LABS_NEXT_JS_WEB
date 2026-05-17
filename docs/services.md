# Services Page

## Overview

The Services page keeps the existing module structure but upgrades the public experience into a more premium, conversion-focused flow.

### Public sections

1. Hero
2. Interactive category filters and service cards
3. Why choose us
4. Process timeline
5. Premium CTA with dual actions
6. Service inquiry modal

## Updated Component Structure

### Server-first composition

- `src/app/services/page.tsx`
  - resolves SEO
  - fetches CMS data
  - renders the Services module
- `src/modules/services/components/main.tsx`
  - keeps the hero loaded first
  - lazy loads the interactive below-fold experience via `next/dynamic`

### Public components

- `hero.tsx`
  - animated mesh-like background treatment
  - mouse-responsive glow and logo parallax
  - staggered heading, subtitle, and CTA motion
- `experience.tsx`
  - client-side interaction shell for the services page
  - owns inquiry modal state
- `categories.tsx`
  - category pill filtering
  - hands selected service into the modal
- `services-grid.tsx`
  - premium cards
  - stagger reveal and hover lift/glow behavior
  - replaces `Learn More` with `Get Service`
- `process.tsx`
  - timeline-like process cards with connector treatment
- `cta.tsx`
  - dual CTA section with trust indicators
- `service-inquiry-dialog.tsx`
  - Radix Dialog + Framer Motion inquiry modal

## Animation Strategy

Shared motion variants live in:

- `src/lib/animation-variants.ts`

Added presets:

- `heroStagger`
- `heroItem`
- `cardReveal`
- `timelineReveal`

The Services page uses these for:

- hero staggered content reveal
- category/service card entrance
- modal open transition
- process card reveal
- CTA panel appearance

No heavy particle or canvas libraries are used.

## Service Inquiry Modal Workflow

### Trigger sources

The modal opens from:

- each service card `Get Service` button
- final CTA primary button
- final CTA secondary button

### Auto-filled service behavior

Clicking a service card sets `serviceName` automatically before the modal opens.

Examples:

- `SEO Optimization` card -> `serviceName = SEO Optimization`
- CTA primary -> `serviceName = Project Inquiry`
- CTA secondary -> `serviceName = Strategy Consultation`

### Form fields

- Full Name
- Email
- Contact Number
- Company Name
- Service Name
- Budget Range
- Project Timeline
- Project Description

### UX behavior

- floating labels
- dark glassmorphism dialog surface
- loading button state
- modal closes after successful submit
- Sonner success toast

## Submission System

The Services inquiry flow reuses the shared `Submission` model and shared submissions admin dashboard.

### Storage model

File:

- `prisma/schema/submission.prisma`

Current submission storage for service inquiries uses:

- `type = "service"`
- `name`
- `email`
- `phone`
- `company`
- `service`
- `message`
- `status`
- `sourcePage`
- `metadata.budget`
- `metadata.timeline`
- `metadata.serviceName`
- `createdAt`

This preserves the existing shared submissions pipeline while capturing service-specific context cleanly.

## API Flow

### UI -> API -> DB -> Admin

Flow:

`UI -> /api/submissions -> Prisma -> admin submissions dashboard`

### Public submission route

File:

- `src/app/api/submissions/route.ts`

Responsibilities:

- Zod validation
- input sanitization
- honeypot spam check (`website`)
- rate limiting with `checkLimit()`
- submission persistence
- filtering by search/type/status/service for admin reads

### Security

The route applies:

- request validation with Zod
- sanitized string storage
- fixed-window rate limiting
- no direct DB calls from UI

## Admin Dashboard Integration

### Services editor

File:

- `src/app/admin/(dashboard)/services/page.tsx`

The services admin page now supports editing:

- hero content
- category list
- services list
- process steps
- final CTA
  - primary CTA text
  - secondary CTA text
  - primary service label
  - secondary service label
  - trust indicators
- SEO

### Shared submissions dashboard

File:

- `src/app/admin/(dashboard)/submissions/page.tsx`

Updated capabilities:

- search by name/email/message
- filter by type
- filter by service
- status badge
- detail modal with service, budget, and timeline
- mark read/unread
- delete action
- export CSV/Excel

## SEO Updates

File:

- `src/modules/services/data/defaults.ts`

Updates include:

- stronger services metadata
- canonical URL uses `SITE_URL`
- more relevant service-oriented keywords
- structured data updated for services listing

## Notes

- Hero remains the first-class top section and is not lazy loaded.
- The interactive below-fold experience is lazy loaded with `next/dynamic`.
- Service icons are resolved through `src/modules/services/components/shared/icon.tsx`.
- The current services page keeps its original information architecture while improving interaction, depth, and conversion flow.
