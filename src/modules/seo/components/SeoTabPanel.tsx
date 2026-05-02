"use client";

import Link from "next/link";

interface SeoTabPanelProps {
  page: string;
  pageLabel?: string;
}

export function SeoTabPanel({ page, pageLabel }: SeoTabPanelProps) {
  return (
    <div className="rounded-lg border bg-muted/20 p-4 text-sm text-muted-foreground">
      <p>
        SEO editing for {pageLabel ?? page} now lives in the exact SEO Settings form.
      </p>
      <Link href={`/admin/seo?focus=${encodeURIComponent(page)}`} className="mt-2 inline-flex text-primary hover:underline">
        Open SEO Settings
      </Link>
    </div>
  );
}
