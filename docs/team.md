# Team Page CMS - Documentation

## Overview

The Team module powers the public `/team` page, the Team CMS editor, SEO defaults, and the join-team application workflow. The public page now emphasizes premium motion, department filtering, profile previews, and a hiring / collaboration dialog that stores submissions in the shared `Submission` system.

## Updated Public Experience

### 1. Hero architecture
- File: `src/modules/team/components/hero.tsx`
- Client-side hero with lightweight motion only
- Animated gradient mesh, moving glow, grid texture, and parallax logo treatment
- Staggered badge, heading, body, and CTA animation
- Exports `HeroSectionSkeleton` for route loading

### 2. Team showcase system
- File: `src/modules/team/components/team-showcase.tsx`
- Handles:
  - intro / culture section
  - featured leadership cards
  - department filter pills
  - full team grid
  - metrics section
  - values grid
  - join-team CTA
  - profile preview modal
- Exports `TeamShowcaseSkeleton`

### 3. Lazy loading strategy
- File: `src/modules/team/components/lazy-team-sections.tsx`
- Below-fold content is lazy-loaded with `next/dynamic` and `LazyOnView`
- Hero stays first-rendered
- Route loading UI now uses section-matched skeletons in `src/app/(public)/team/loading.tsx`

## Team Card Architecture

### Data source
- Team members come from `TeamMember` records synced from admin profiles
- Query layer: `src/modules/team/data/queries.ts`
- Derived fields added at query time:
  - `department`
  - `expertiseTags`

### Card UX
- Premium glass card shell
- Hover lift + border glow + image zoom
- Fallback avatar treatment when no valid image exists
- Social actions for LinkedIn, GitHub, portfolio, email, phone, and YouTube
- Profile modal with bio, tags, and link actions

## Filtering System

### Department filter flow
- Department list is generated dynamically from live team data
- `All` plus derived departments
- Filtering is client-side for smooth transitions
- Uses `AnimatePresence` and motion layout for card updates

## Join Team Dialog System

### Component
- File: `src/modules/team/components/team-application-dialog.tsx`
- Triggered from the final CTA section
- Uses:
  - Radix `Dialog`
  - `react-hook-form`
  - Zod validation via `teamApplicationSchema`
  - Sonner success / error toasts

### Required form fields
- Full Name
- Email
- Phone Number
- Role Interested In
- Experience Level
- Portfolio URL
- Resume Upload
- Message

### UX details
- Glassmorphism dialog surface
- Floating labels
- Upload state for resume
- Disabled submit during upload / submit
- Success toast on completion

## Submission Workflow

### Flow
`UI -> /api/team-resume -> /api/submissions -> DB -> admin/dashboard/submissions`

### Resume upload route
- File: `src/app/api/team-resume/route.ts`
- Public route with strict validation
- Accepts:
  - PDF
  - DOC
  - DOCX
- Max file size: 6 MB
- Stores files in `uploads/resumes`
- Rate limited using `checkLimit`

### Resume file serving route
- File: `src/app/api/resumes/[filename]/route.ts`
- Streams uploaded resume files safely
- Prevents path traversal

### Submission API
- File: `src/app/api/submissions/route.ts`
- Extended to support team application metadata:
  - `roleInterestedIn`
  - `experienceLevel`
  - `portfolioUrl`
  - `resumeUrl`
- Security protections:
  - Zod parsing
  - input sanitization
  - honeypot field
  - rate limit

## Database Schema

### Team page content
- File: `prisma/schema/team.prisma`

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

model TeamMember {
  id           String @id @default(cuid())
  userId       String? @unique
  user         Admin?  @relation(fields: [userId], references: [id], onDelete: Cascade)
  displayName  String
  role         String
  bio          String? @db.Text
  avatar       String?
  githubUrl    String?
  linkedinUrl  String?
  instagramUrl String?
  youtubeUrl   String?
  isVisible    Boolean @default(true)
  isFeatured   Boolean @default(false)
  sortOrder    Int     @default(0)
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt

  @@index([sortOrder])
}
```

### Shared submission storage
- File: `prisma/schema/submission.prisma`
- Team applications use the shared `Submission` model with:
  - `type = "join_team"`
  - primary fields in normal columns
  - resume / experience / portfolio metadata stored in `metadata`

## Admin Dashboard Integration

### Team page CMS
- Route: `/admin/dashboard/team`
- Existing editor still controls:
  - hero
  - intro
  - founders
  - team section
  - values
  - CTA
  - team members
  - SEO

### Submissions dashboard
- Route: `/admin/dashboard/submissions`
- Team applications appear alongside other website submissions
- Supports:
  - type filtering (`join_team`)
  - search
  - read / unread toggle
  - detail modal
  - delete action
  - resume link display

## SEO Updates

### Default SEO
- File: `src/modules/team/data/defaults.ts`
- Updated meta copy for startup-style positioning
- Canonical remains `/team`
- Stronger title, description, and keyword defaults

### Page metadata
- Public route continues to use SEO fallback + CMS override pattern
- Admin SEO controls remain permission-protected with `MANAGE_TEAM`

## Permission Model

### Team editor
- Team admin APIs and actions remain protected with `requirePermission("MANAGE_TEAM")`

### Submissions viewer
- Submission listing / moderation remains protected with `requirePermission("MANAGE_SUBMISSIONS")`

## Files Updated

### Core Team module
- `src/modules/team/components/hero.tsx`
- `src/modules/team/components/team-showcase.tsx`
- `src/modules/team/components/team-application-dialog.tsx`
- `src/modules/team/components/lazy-team-sections.tsx`
- `src/modules/team/components/index.ts`
- `src/modules/team/types.ts`
- `src/modules/team/validations.ts`
- `src/modules/team/data/defaults.ts`
- `src/modules/team/data/queries.ts`

### Public route
- `src/app/(public)/team/loading.tsx`

### Submission pipeline
- `src/app/api/team-resume/route.ts`
- `src/app/api/resumes/[filename]/route.ts`
- `src/app/api/submissions/route.ts`
- `src/app/admin/(dashboard)/submissions/page.tsx`

## Verification

Commands executed successfully:

```bash
npm run lint
npm run build
node_modules/typescript/bin/tsc --noEmit
```

## Final Notes

- No whole-site redesign was done.
- Existing Team CMS structure was preserved.
- The join-team workflow uses the already-established submissions admin area instead of creating a second review surface.
- The public Team page is now more cinematic, responsive, and interactive while staying inside the project architecture.
