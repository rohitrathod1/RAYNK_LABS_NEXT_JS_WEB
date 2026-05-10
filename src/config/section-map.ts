export type PageSectionKey = "home" | "about" | "services" | "portfolio" | "team" | "blog" | "contact";

export interface SectionMapItem {
  id: string;
  label: string;
  aliases?: string[];
}

export const SECTION_MAP: Record<PageSectionKey, SectionMapItem[]> = {
  home: [
    { id: "section1-home-hero", label: "Hero", aliases: ["hero"] },
    { id: "section2-home-initiatives", label: "Initiatives", aliases: ["initiatives"] },
    { id: "section3-home-services", label: "Services", aliases: ["services"] },
    { id: "section4-home-digital", label: "Why Digital", aliases: ["why-digital"] },
    { id: "section5-home-portfolio", label: "Portfolio", aliases: ["portfolio"] },
    { id: "section6-home-testimonials", label: "Testimonials", aliases: ["testimonials"] },
    { id: "section7-home-why-choose-us", label: "Why Choose Us", aliases: ["why-choose-us"] },
    { id: "section8-home-contact", label: "Contact", aliases: ["contact"] },
  ],
  about: [
    { id: "section1-about-hero", label: "Hero", aliases: ["hero"] },
    { id: "section2-about-story", label: "Story", aliases: ["story"] },
    { id: "section3-about-achievements", label: "Achievements", aliases: ["achievements"] },
    { id: "section4-about-mission", label: "Mission", aliases: ["mission", "vision"] },
    { id: "section5-about-why-choose-us", label: "Why Choose Us", aliases: ["why-choose-us"] },
    { id: "section6-about-team", label: "Team", aliases: ["team"] },
    { id: "section7-about-connect", label: "Connect", aliases: ["connect"] },
  ],
  services: [
    { id: "section1-services-hero", label: "Hero" },
    { id: "section2-services-grid", label: "Services Grid" },
    { id: "section3-services-benefits", label: "Benefits" },
    { id: "section4-services-work-process", label: "Work Process" },
    { id: "section5-services-contact-cta", label: "Contact CTA" },
  ],
  portfolio: [
    { id: "section1-portfolio-hero", label: "Hero", aliases: ["hero"] },
    { id: "section2-featured-projects", label: "Featured Projects", aliases: ["featured"] },
    { id: "section3-project-grid", label: "Project Grid", aliases: ["projects", "grid"] },
    { id: "section4-case-studies", label: "Case Studies", aliases: ["case-studies"] },
    { id: "section5-technologies", label: "Technologies", aliases: ["technologies"] },
    { id: "section6-testimonials", label: "Testimonials", aliases: ["testimonials"] },
    { id: "section7-contact-cta", label: "Contact CTA", aliases: ["contact", "cta"] },
  ],
  team: [
    { id: "section1-team-hero", label: "Hero", aliases: ["hero"] },
    { id: "section2-leadership", label: "Leadership", aliases: ["leadership", "founders"] },
    { id: "section3-team-grid", label: "Team Members", aliases: ["members", "team"] },
    { id: "section4-departments", label: "Departments", aliases: ["departments"] },
    { id: "section5-team-stats", label: "Team Stats", aliases: ["stats"] },
    { id: "section6-testimonials", label: "Testimonials", aliases: ["testimonials", "values"] },
    { id: "section7-join-team", label: "Join Team", aliases: ["join", "contact"] },
  ],
  blog: [
    { id: "section1-blog-hero", label: "Hero", aliases: ["hero"] },
    { id: "section2-featured-blogs", label: "Featured Blogs", aliases: ["featured"] },
    { id: "section3-blog-grid", label: "Latest Articles", aliases: ["latest", "articles", "grid"] },
    { id: "section4-categories", label: "Categories", aliases: ["categories", "tags"] },
    { id: "section5-newsletter", label: "Newsletter", aliases: ["newsletter"] },
    { id: "section6-related-posts", label: "Related Posts", aliases: ["related"] },
  ],
  contact: [
    { id: "section1-contact-hero", label: "Hero", aliases: ["hero"] },
    { id: "section2-contact-form", label: "Contact Form", aliases: ["form"] },
    { id: "section3-contact-info", label: "Contact Info", aliases: ["info"] },
    { id: "section4-office-locations", label: "Office Locations", aliases: ["offices", "locations"] },
    { id: "section5-faq", label: "FAQ", aliases: ["faq"] },
    { id: "section6-map", label: "Map", aliases: ["map"] },
    { id: "section7-social-links", label: "Social Links", aliases: ["social"] },
    { id: "section8-contact-cta", label: "Contact CTA", aliases: ["cta"] },
  ],
};

export function getPageKeyFromPathname(pathname: string): PageSectionKey | null {
  if (pathname === "/") return "home";
  if (pathname === "/about") return "about";
  if (pathname === "/services") return "services";
  if (pathname === "/portfolio") return "portfolio";
  if (pathname === "/team") return "team";
  if (pathname === "/blog") return "blog";
  if (pathname === "/contact") return "contact";
  return null;
}

export function getCanonicalSectionId(idOrAlias: string, pageKey: PageSectionKey | null) {
  if (!pageKey) return idOrAlias;
  const item = SECTION_MAP[pageKey].find(
    (section) => section.id === idOrAlias || section.aliases?.includes(idOrAlias),
  );
  return item?.id ?? idOrAlias;
}

export function getSectionIdsForPathname(pathname: string) {
  const pageKey = getPageKeyFromPathname(pathname);
  return pageKey ? SECTION_MAP[pageKey].map((section) => section.id) : [];
}
