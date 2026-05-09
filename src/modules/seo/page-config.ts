export interface SeoPageConfig {
  slug: string;
  title: string;
  seoEnabled: true;
  publicPath: string;
}

export const SEO_PAGE_KEY_PATTERN = /^[a-z0-9]+(?:[/:_-][a-z0-9]+)*$/;

export const SEO_PAGE_CONFIG = [
  { slug: "home", title: "Home", seoEnabled: true, publicPath: "/" },
  { slug: "about", title: "About", seoEnabled: true, publicPath: "/about" },
  { slug: "services", title: "Services", seoEnabled: true, publicPath: "/services" },
  { slug: "portfolio", title: "Portfolio", seoEnabled: true, publicPath: "/portfolio" },
  { slug: "team", title: "Team", seoEnabled: true, publicPath: "/team" },
  { slug: "blog", title: "Blog", seoEnabled: true, publicPath: "/blog" },
  { slug: "contact", title: "Contact", seoEnabled: true, publicPath: "/contact" },
] satisfies SeoPageConfig[];

export function normalizeSeoPageKey(page: string) {
  return page.trim().toLowerCase().replace(/^\/+|\/+$/g, "");
}

export function isValidSeoPageKey(page: string) {
  return SEO_PAGE_KEY_PATTERN.test(normalizeSeoPageKey(page));
}

export function formatSeoPageLabel(page: string) {
  const configured = SEO_PAGE_CONFIG.find((item) => item.slug === page);
  if (configured) return configured.title;

  return page
    .replace(/[:/_-]+/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export function getSeoPublicPath(page: string) {
  const configured = SEO_PAGE_CONFIG.find((item) => item.slug === page);
  if (configured) return configured.publicPath;
  if (page === "home") return "/";
  if (page.includes(":")) {
    const [prefix, slug] = page.split(":");
    return `/${prefix}/${slug}`;
  }
  return `/${page.replace(/-/g, "/")}`;
}
