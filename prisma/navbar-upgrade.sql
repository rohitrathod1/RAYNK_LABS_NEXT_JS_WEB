-- One-time production database upgrade for the Navbar CMS fields.
-- Run this once before deploying code that reads hasDropdown/openInNewTab.

ALTER TABLE "NavLink"
  ADD COLUMN IF NOT EXISTS "hasDropdown" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS "openInNewTab" BOOLEAN NOT NULL DEFAULT false;

ALTER TABLE "NavSubLink"
  ADD COLUMN IF NOT EXISTS "openInNewTab" BOOLEAN NOT NULL DEFAULT false;

UPDATE "NavLink" n
SET "hasDropdown" = true
WHERE EXISTS (
  SELECT 1
  FROM "NavSubLink" s
  WHERE s."navLinkId" = n."id"
);

