# Contact Page CMS - Documentation

## Overview

The Contact module powers the public `/contact` page, the Contact CMS editor, public inquiry handling, map embedding, FAQ content, and the shared submissions dashboard integration.

The latest refactor keeps the existing CMS/data model and upgrades the experience layer into a more premium, conversion-focused communication hub.

## Updated Public Experience

### 1. Hero architecture
- File: `src/modules/contact/components/hero.tsx`
- Cinematic hero with:
  - animated mesh glow
  - floating blur layers
  - mouse-follow spotlight
  - parallax logo background
  - staggered badge / title / subtitle / CTA motion
- Exports `HeroSectionSkeleton`

### 2. Contact form interaction system
- File: `src/modules/contact/components/contact-experience.tsx`
- Form is now a premium glass panel with:
  - floating labels
  - animated focus states
  - hover spotlight layer
  - stronger submit button treatment
  - success / error toast feedback
- Public submission path now uses the API route directly:
  - `UI -> /api/contact -> DB -> /admin/dashboard/submissions`

### 3. Contact cards redesign
- Contact info cards now use:
  - glassmorphism shells
  - icon glow containers
  - hover lift / border glow
  - click-to-copy interaction
- Location, phone, email, and timing use exact Lucide icons

### 4. FAQ animation system
- FAQ is rendered as an animated accordion
- Includes:
  - stagger reveal
  - active glow state
  - rotating chevron
  - animated expand / collapse

### 5. Google Maps integration
- The map now uses the requested location:
  - `Akal University`
  - Google Maps URL: `https://maps.app.goo.gl/B1obe57EuZzM1c3i8`
- Files:
  - `src/modules/contact/constants.ts`
  - `src/modules/contact/components/contact-experience.tsx`
- Includes:
  - premium rounded map shell
  - supporting location detail cards below the map
  - `Open in Google Maps` CTA

### 6. Social links architecture
- Social links are defined in `src/modules/contact/constants.ts`
- Branded icon rendering is handled in `contact-experience.tsx`
- Current branded pills:
  - GitHub
  - LinkedIn
  - Instagram
  - YouTube
  - Website

### 7. CTA redesign
- Final CTA rebuilt as a cinematic collaboration panel with:
  - animated mesh feel
  - layered lighting
  - dual CTA buttons
  - premium hover motion
- Primary CTA: `Start Your Project`
- Secondary CTA: `Schedule a Call`

## Data Model

### Contact page content
- File: `prisma/schema/contact.prisma`

```prisma
model ContactPage {
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

model ContactInquiry {
  id        String   @id @default(cuid())
  name      String
  email     String
  phone     String?
  subject   String?
  message   String   @db.Text
  isRead    Boolean  @default(false)
  createdAt DateTime @default(now())

  @@index([isRead, createdAt(sort: Desc)])
}
```

### Shared submissions storage
- Contact form also creates a shared `Submission` entry
- Stored in the shared submissions dashboard for filtering, exporting, and review
- Metadata includes:
  - budget
  - timeline
  - serviceName

## API Flow

### Public content route
- File: `src/app/api/contact/route.ts`
- `GET /api/contact`
- Returns active contact page sections

### Public inquiry route
- File: `src/app/api/contact/route.ts`
- `POST /api/contact`
- Features:
  - Zod validation
  - input sanitization
  - honeypot protection (`website` field)
  - local rate limiting via `checkLimit`
  - writes to both `ContactInquiry` and shared `Submission`

## Admin Dashboard Integration

### Contact CMS editor
- Route: `/admin/dashboard/contact`
- Existing editor remains intact for:
  - hero
  - contact info
  - contact form
  - map
  - FAQ
  - CTA
  - SEO

### Shared submissions dashboard
- Route: `/admin/dashboard/submissions`
- Contact form entries appear there automatically
- Admin features already available:
  - search / filter
  - read / unread toggle
  - detail modal
  - delete action
  - service filter

## Animation Strategy

### Shared motion system
- Contact page reuses shared presets from:
  - `src/lib/animation-variants.ts`
- Public contact page uses:
  - `blurReveal`
  - `fadeIn`
  - `cardReveal`
  - `staggerContainer`
  - `staggerItem`

### Performance rules followed
- Hero stays direct-loaded
- Below-fold sections lazy-load through:
  - `src/modules/contact/components/lazy-contact-sections.tsx`
- Route loading now uses section-matched skeletons:
  - `HeroSectionSkeleton`
  - `ContactExperienceSkeleton`

## SEO Updates

- File: `src/modules/contact/data/defaults.ts`
- Updated default metadata for a more premium positioning
- Canonical URL remains `/contact`
- Stronger title / description / keyword defaults

## Files Updated

### Contact module
- `src/modules/contact/components/hero.tsx`
- `src/modules/contact/components/contact-experience.tsx`
- `src/modules/contact/components/lazy-contact-sections.tsx`
- `src/modules/contact/components/index.ts`
- `src/modules/contact/types.ts`
- `src/modules/contact/validations.ts`
- `src/modules/contact/constants.ts`
- `src/modules/contact/data/defaults.ts`

### Route + API
- `src/app/contact/loading.tsx`
- `src/app/api/contact/route.ts`

## Verification

Commands executed successfully:

```bash
node_modules/typescript/bin/tsc --noEmit
npm run lint
npm run build
```

## Final Notes

- The refactor preserves the current Contact CMS structure.
- The page now feels more like a premium SaaS contact hub instead of a static contact page.
- Contact submissions continue to flow into `/admin/dashboard/submissions`, so admin review stays centralized.
