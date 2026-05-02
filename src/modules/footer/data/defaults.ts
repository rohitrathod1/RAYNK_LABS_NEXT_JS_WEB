import { SITE_DESCRIPTION, SITE_NAME } from "@/lib/constants";
import type { FooterData } from "../types";

export const fallbackFooterData: FooterData = {
  settings: {
    logo: "/api/uploads/placeholder.png",
    description: SITE_DESCRIPTION || "Default company description.",
    email: "contact@company.com",
    phone: "",
    address: "123 Default St.",
    copyright: `(c) ${new Date().getFullYear()} ${SITE_NAME}. All rights reserved.`,
  },
  sections: [
    {
      id: "fallback-quick-links",
      title: "Quick Links",
      sortOrder: 0,
      isActive: true,
      links: [
        { id: "fallback-home", label: "Home", href: "/", sectionId: "fallback-quick-links", sortOrder: 0 },
        { id: "fallback-about", label: "About", href: "/about", sectionId: "fallback-quick-links", sortOrder: 1 },
        { id: "fallback-services", label: "Services", href: "/services", sectionId: "fallback-quick-links", sortOrder: 2 },
        { id: "fallback-contact", label: "Contact", href: "/contact", sectionId: "fallback-quick-links", sortOrder: 3 },
      ],
    },
    {
      id: "fallback-social",
      title: "Social Links",
      sortOrder: 1,
      isActive: true,
      links: [
        { id: "fallback-linkedin", label: "LinkedIn", href: "https://linkedin.com", sectionId: "fallback-social", sortOrder: 0 },
        { id: "fallback-github", label: "GitHub", href: "https://github.com", sectionId: "fallback-social", sortOrder: 1 },
      ],
    },
  ],
};

export function withFooterFallback(data?: FooterData | null): FooterData {
  const settings = data?.settings ?? {};
  const fallbackSettings = fallbackFooterData.settings ?? {};

  return {
    settings: {
      logo: settings.logo || fallbackSettings.logo,
      description: settings.description || fallbackSettings.description,
      email: settings.email || fallbackSettings.email,
      phone: settings.phone || fallbackSettings.phone,
      address: settings.address || fallbackSettings.address,
      copyright: settings.copyright || fallbackSettings.copyright,
    },
    sections: data?.sections?.length ? data.sections : fallbackFooterData.sections,
  };
}
