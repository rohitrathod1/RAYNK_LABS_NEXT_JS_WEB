import { cache } from 'react';
import { db } from '@/lib/db';
import type { SeoMeta } from '@prisma/client';

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
