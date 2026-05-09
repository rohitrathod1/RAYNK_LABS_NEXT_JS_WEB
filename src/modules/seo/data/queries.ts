import { cache } from 'react';
import { db } from '@/lib/db';
import type { SeoMeta } from '@prisma/client';
import { SEO_PAGE_CONFIG, formatSeoPageLabel, normalizeSeoPageKey } from '../page-config';

export interface SeoManagedPageRow {
  id: string;
  page: string;
  label: string;
  metaTitle: string;
  metaDescription: string | null;
  robots: string;
  updatedAt: Date;
  configured: boolean;
}

/**
 * Request-scoped memoization: `resolveSeo()` and `getStructuredData()` both
 * look up the same SeoMeta row for a given page. React's `cache()` dedupes
 * within a single render pass — second call is free.
 */
export const getSeoByPage = cache(
  async (page: string): Promise<SeoMeta | null> => {
    return db.seoMeta.findUnique({ where: { page } });
  },
);

export async function getAllSeo(): Promise<SeoMeta[]> {
  return db.seoMeta.findMany({ orderBy: { page: 'asc' } });
}

export async function getAllSeoManagedPages(): Promise<SeoManagedPageRow[]> {
  const rows = await db.seoMeta.findMany({ orderBy: { page: 'asc' } });
  const byPage = new Map(rows.map((row) => [normalizeSeoPageKey(row.page), row]));
  const pages = new Set<string>([
    ...SEO_PAGE_CONFIG.map((page) => page.slug),
    ...rows.map((row) => normalizeSeoPageKey(row.page)),
  ]);

  return [...pages].sort((a, b) => a.localeCompare(b)).map((page) => {
    const row = byPage.get(page);
    return {
      id: row?.id ?? `configured:${page}`,
      page,
      label: formatSeoPageLabel(page),
      metaTitle: row?.metaTitle ?? formatSeoPageLabel(page),
      metaDescription: row?.metaDescription ?? null,
      robots: row?.robots ?? 'index,follow',
      updatedAt: row?.updatedAt ?? new Date(0),
      configured: SEO_PAGE_CONFIG.some((item) => item.slug === page),
    };
  });
}
