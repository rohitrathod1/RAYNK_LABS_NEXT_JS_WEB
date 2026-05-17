import { definePageSeo } from "@/modules/seo";
import { SITE_URL } from "@/lib/constants";
import type { ServicesPageData } from "../types";

export const defaultServicesSeo = definePageSeo({
  metaTitle: "Premium Digital Services - RaYnk Labs",
  metaDescription:
    "Explore premium digital services from RaYnk Labs, from product websites and SEO systems to design, optimization, and launch support.",
  keywords: [
    "digital services",
    "web development agency",
    "seo optimization service",
    "ui ux design service",
    "raynk labs services",
  ],
  ogTitle: "Premium Digital Services by RaYnk Labs",
  ogDescription: "Modern websites, SEO systems, design, and growth-ready digital execution.",
  ogImage: "og-services.png",
  twitterCard: "summary_large_image",
  canonicalUrl: `${SITE_URL}/services`,
  structuredData: {
    "@type": "ItemList",
    name: "RaYnk Labs Services",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Custom Web Development" },
      { "@type": "ListItem", position: 2, name: "SEO Audit & Strategy" },
      { "@type": "ListItem", position: 3, name: "UI/UX Design" },
    ],
  },
  robots: "index,follow",
});

export const defaultServicesContent: ServicesPageData = {
  hero: {
    title: "Services Built For Ambitious Growth",
    subtitle:
      "From product websites to performance systems, we design and build digital work that feels premium and converts with intent.",
    backgroundImage: "/about/hero-bg.svg",
  },
  categories: [
    { id: "web-design", name: "Website Design", icon: "Globe" },
    { id: "seo", name: "SEO Optimization", icon: "Search" },
    { id: "graphic-design", name: "Graphic Design", icon: "Palette" },
  ],
  services_list: {
    title: "What We Offer",
    subtitle: "Focused service tracks designed to move brands from static presence to growth-ready execution.",
    services: [
      {
        icon: "Code2",
        title: "Custom Web Development",
        description: "High-performance marketing and product websites built with modern architecture, clean UX, and scalable implementation.",
        category: "web-design",
        ctaText: "Get Service",
        ctaHref: "/contact",
      },
      {
        icon: "Smartphone",
        title: "Mobile-First Design",
        description: "Responsive digital experiences crafted to feel polished, fast, and natural across every screen size that matters.",
        category: "web-design",
        ctaText: "Get Service",
        ctaHref: "/contact",
      },
      {
        icon: "Search",
        title: "SEO Optimization",
        description: "Technical audits, content direction, and ranking strategy designed to improve discoverability without guesswork.",
        category: "seo",
        ctaText: "Get Service",
        ctaHref: "/contact",
      },
      {
        icon: "Gauge",
        title: "Performance Optimization",
        description: "Core Web Vitals, frontend tuning, and conversion-minded speed improvements that make the whole experience sharper.",
        category: "seo",
        ctaText: "Get Service",
        ctaHref: "/contact",
      },
      {
        icon: "PenTool",
        title: "UI/UX Design",
        description: "Interface systems and product flows that look premium, reduce friction, and help users move with confidence.",
        category: "graphic-design",
        ctaText: "Get Service",
        ctaHref: "/contact",
      },
      {
        icon: "SwatchBook",
        title: "Brand Identity",
        description: "Logos, visual systems, and digital brand assets that create consistency across launch, growth, and retention touchpoints.",
        category: "graphic-design",
        ctaText: "Get Service",
        ctaHref: "/contact",
      },
    ],
  },
  why_choose_service: {
    title: "Why Teams Choose RaYnk Labs",
    subtitle: "Execution that stays fast, collaborative, and polished from strategy through launch.",
    points: [
      {
        icon: "Zap",
        title: "Fast, focused execution",
        description: "We keep momentum high without letting the work slip into rushed, generic delivery.",
      },
      {
        icon: "Award",
        title: "Premium product thinking",
        description: "Every decision is shaped around clarity, conversion, and long-term maintainability.",
      },
      {
        icon: "Users",
        title: "Collaborative process",
        description: "You get a close working rhythm, practical communication, and decisions that stay connected to business goals.",
      },
    ],
  },
  process: {
    title: "Our Process",
    subtitle: "A streamlined system that keeps strategy, design, and delivery moving in the same direction.",
    steps: [
      {
        step: 1,
        title: "Discover",
        description: "We map goals, constraints, audience needs, and the real outcome this service should drive.",
        icon: "Compass",
      },
      {
        step: 2,
        title: "Design",
        description: "We shape the structure, visuals, and interactions so the experience feels intentional before build begins.",
        icon: "Palette",
      },
      {
        step: 3,
        title: "Build",
        description: "We implement with modern tooling, QA carefully, and keep the experience performant under real use.",
        icon: "Code2",
      },
      {
        step: 4,
        title: "Launch & Grow",
        description: "We ship cleanly, refine based on feedback, and support the next phase of traction after release.",
        icon: "Rocket",
      },
    ],
  },
  contact_cta: {
    heading: "Ready To Start A Serious Growth Project?",
    subheading:
      "Bring us in for a focused service engagement, a fresh website, an SEO push, or a strategic consultation on what to build next.",
    ctaText: "Start Your Project",
    ctaHref: "/contact",
    secondaryCtaText: "Schedule Consultation",
    secondaryCtaHref: "/contact",
    primaryService: "Project Inquiry",
    secondaryService: "Strategy Consultation",
    trustIndicators: ["Fast response", "Clear scope", "Senior-level execution"],
  },
};
