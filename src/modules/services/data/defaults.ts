import type { PageSEO } from "@/lib/seo";
import type { ServicesPageData } from "../types";

export const defaultServicesSeo: PageSEO = {
  title: "Our Services — RaYnk Labs",
  description:
    "Explore our comprehensive digital services including web design, SEO optimization, and graphic design.",
  keywords: "web design, SEO, graphic design, digital services, RaYnk Labs",
  ogImage: "/api/uploads/og-services.png",
  noIndex: false,
};

export const defaultServicesContent: ServicesPageData = {
  hero: {
    title: "Our Services",
    subtitle: "Comprehensive digital solutions tailored to your business needs.",
    backgroundImage: "placeholder.png",
  },
  categories: [
    { id: "web-design", name: "Website Design", icon: "Globe" },
    { id: "seo", name: "SEO Optimization", icon: "BarChart3" },
    { id: "graphic-design", name: "Graphic Design", icon: "Palette" },
  ],
  services_list: {
    title: "What We Offer",
    subtitle: "End-to-end digital services to help your business grow.",
    services: [
      {
        icon: "Code",
        title: "Custom Web Development",
        description: "Modern, responsive websites built with cutting-edge technologies.",
        category: "web-design",
        ctaText: "Learn More",
        ctaHref: "/contact",
      },
      {
        icon: "Smartphone",
        title: "Mobile-First Design",
        description: "Websites optimized for all devices with seamless user experience.",
        category: "web-design",
        ctaText: "Learn More",
        ctaHref: "/contact",
      },
      {
        icon: "Search",
        title: "SEO Audit & Strategy",
        description: "Comprehensive SEO analysis and roadmap for higher rankings.",
        category: "seo",
        ctaText: "Learn More",
        ctaHref: "/contact",
      },
      {
        icon: "TrendingUp",
        title: "Performance Optimization",
        description: "Boost your site speed and search engine visibility.",
        category: "seo",
        ctaText: "Learn More",
        ctaHref: "/contact",
      },
      {
        icon: "Figma",
        title: "UI/UX Design",
        description: "Beautiful, intuitive interfaces that convert visitors into customers.",
        category: "graphic-design",
        ctaText: "Learn More",
        ctaHref: "/contact",
      },
      {
        icon: "Image",
        title: "Brand Identity",
        description: "Logos, brand guidelines, and visual assets that tell your story.",
        category: "graphic-design",
        ctaText: "Learn More",
        ctaHref: "/contact",
      },
    ],
  },
  why_choose_service: {
    title: "Why Choose Our Services?",
    subtitle: "We deliver excellence with every project we undertake.",
    points: [
      {
        icon: "Zap",
        title: "Fast Delivery",
        description: "Agile methodology ensures rapid delivery without compromising quality.",
      },
      {
        icon: "Award",
        title: "Proven Expertise",
        description: "Years of experience across industries with measurable results.",
      },
      {
        icon: "Users",
        title: "Dedicated Team",
        description: "A committed team of experts working exclusively on your project.",
      },
    ],
  },
  process: {
    title: "Our Process",
    subtitle: "A streamlined approach to delivering exceptional results.",
    steps: [
      {
        step: 1,
        title: "Plan",
        description: "We analyze your requirements and create a detailed project roadmap.",
        icon: "ClipboardList",
      },
      {
        step: 2,
        title: "Design",
        description: "Our designers create stunning mockups and prototypes for your approval.",
        icon: "Palette",
      },
      {
        step: 3,
        title: "Develop",
        description: "We build your solution using the latest technologies and best practices.",
        icon: "Code",
      },
      {
        step: 4,
        title: "Launch",
        description: "We deploy your project and provide ongoing support and maintenance.",
        icon: "Rocket",
      },
    ],
  },
  contact_cta: {
    heading: "Ready to Get Started?",
    subheading: "Let's discuss how our services can help transform your business.",
    ctaText: "Get Service",
    ctaHref: "/contact",
  },
};
