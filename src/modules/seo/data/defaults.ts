import { SITE_NAME, SITE_DESCRIPTION, SITE_URL } from '@/lib/constants';
import type { SeoData, SeoDefaults } from '../types';

/**
 * Brand-level fallback. Used when neither the DB row nor a module's
 * `defaultSeo` provides a value.
 */
export const siteDefaultSeo: Omit<SeoData, 'page'> = {
  metaTitle: `${SITE_NAME} — ${SITE_DESCRIPTION}`,
  metaDescription: SITE_DESCRIPTION,
  keywords: [
    'raynk labs',
    'digital solutions',
    'web development',
    'software development',
    'seo services',
    'graphic design',
  ],
  ogTitle: SITE_NAME,
  ogDescription: SITE_DESCRIPTION,
  ogImage: 'og-default.png',
  twitterCard: 'summary_large_image',
  canonicalUrl: SITE_URL,
  structuredData: [
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: SITE_NAME,
      url: SITE_URL,
      potentialAction: {
        '@type': 'SearchAction',
        target: `${SITE_URL}/blog?q={search_term_string}`,
        'query-input': 'required name=search_term_string',
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: SITE_NAME,
      url: SITE_URL,
      logo: `${SITE_URL}/logo.png`,
      sameAs: [
        'https://www.instagram.com/raynklabs',
        'https://www.linkedin.com/company/raynklabs',
      ],
    },
  ],
  robots: 'index,follow',
};

/**
 * Convenience helper to declare a page's defaults.
 *
 * Robots guide for future pages:
 *   - Public pages (home, products, about, blog) → 'index,follow'
 *   - Auth pages (login, register, forgot-password) → 'noindex,nofollow'
 *   - Commerce pages (cart, checkout, order-confirmation) → 'noindex,follow'
 *   - Admin pages → 'noindex,nofollow' (enforced at layout level)
 */
export function definePageSeo(overrides: SeoDefaults): SeoDefaults {
  return overrides;
}
