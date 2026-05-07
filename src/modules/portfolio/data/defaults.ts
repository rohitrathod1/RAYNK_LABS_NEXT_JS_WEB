import { definePageSeo } from "@/modules/seo";
import type { PortfolioPageData } from "../types";

export const defaultSeo = definePageSeo({
  metaTitle: "RaYnk Labs Portfolio - Our Work & Projects",
  metaDescription: "Explore RaYnk Labs projects across web development, graphic design, SEO, and digital products built for results.",
  keywords: ["portfolio", "web design", "graphic design", "seo projects", "raynk labs work", "case studies"],
  ogTitle: "RaYnk Labs Portfolio",
  ogDescription: "Selected websites, software, SEO, and design work by RaYnk Labs.",
  ogImage: "og-portfolio.png",
  twitterCard: "summary_large_image",
  canonicalUrl: "http://localhost:3000/portfolio",
  structuredData: { "@type": "CollectionPage", name: "RaYnk Labs Portfolio" },
  robots: "index,follow",
});
export const defaultPortfolioContent: PortfolioPageData = {
  hero: {
    title: "Our Portfolio",
    subtitle: "Explore our best work and see how we've helped businesses grow through innovative digital solutions.",
    backgroundImage: "placeholder.png",
  },
  categories_filter: {
    title: "Filter by Category",
    categories: ["All", "Web Development", "Graphic Design", "SEO Projects", "Mobile Apps"],
  },
  projects_grid: {
    title: "Featured Projects",
    subtitle: "A selection of our recent work across various industries and technologies.",
  },
  testimonials: {
    title: "Client Feedback",
    subtitle: "Hear from clients about their experience working with us.",
    testimonials: [
      {
        name: "Sarah Johnson",
        role: "CEO, TechStart Inc.",
        avatar: "placeholder.png",
        quote: "The team delivered an exceptional website that exceeded our expectations. Our online presence has never been stronger.",
        rating: 5,
      },
      {
        name: "Michael Chen",
        role: "Marketing Director, GrowthCo",
        avatar: "placeholder.png",
        quote: "Their design work transformed our brand identity. Professional, creative, and incredibly responsive throughout the process.",
        rating: 5,
      },
      {
        name: "Emily Rodriguez",
        role: "Founder, EcoShop",
        avatar: "placeholder.png",
        quote: "Our e-commerce site went from zero to 1000+ monthly sales within three months of launch. Incredible results.",
        rating: 5,
      },
    ],
  },
  contact_cta: {
    heading: "Start Your Project Today",
    subheading: "Ready to bring your ideas to life? Let's discuss how we can help you achieve your goals.",
    ctaText: "Get Started",
    ctaHref: "/contact",
  },
};
