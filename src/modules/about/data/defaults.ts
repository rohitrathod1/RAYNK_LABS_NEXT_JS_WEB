import { definePageSeo } from "@/modules/seo";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import type { AboutPageData } from "../types";

export const defaultSeo = definePageSeo({
  metaTitle: "About RaYnk Labs - Story, Mission, Team & Collaboration",
  metaDescription:
    "Discover the story behind RaYnk Labs, the team shaping our product mindset, and the ways brands can collaborate with us on digital growth.",
  keywords: [
    "raynk labs",
    "about raynk labs",
    "digital product studio",
    "saas agency team",
    "startup technology partner",
  ],
  ogTitle: "About RaYnk Labs",
  ogDescription: "Meet the team, mission, and collaboration mindset behind RaYnk Labs.",
  ogImage: "og-about.png",
  twitterCard: "summary_large_image",
  canonicalUrl: `${SITE_URL}/about`,
  structuredData: [
    {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
      description:
        "RaYnk Labs is a digital solutions and innovation team building software, websites, branding, SEO systems, and scalable products.",
    },
    {
      "@type": "AboutPage",
      name: "About RaYnk Labs",
      url: `${SITE_URL}/about`,
      description:
        "Learn about RaYnk Labs, our mission, company story, digital innovation approach, and core team.",
      isPartOf: {
        "@type": "WebSite",
        name: SITE_NAME,
        url: SITE_URL,
      },
    },
  ],
  robots: "index,follow",
});

export const defaultAboutContent: AboutPageData = {
  hero: {
    title: "Who We Are",
    subtitle:
      "A product-minded digital team helping ambitious brands turn momentum into durable growth.",
    backgroundImage: "/about/hero-bg.svg",
  },
  story: {
    image: "/about/story-studio.svg",
    content:
      "RaYnk Labs began with a simple conviction: modern businesses deserve digital systems that feel as thoughtful as the brands they represent. We started by helping fast-moving teams close the gap between bold ideas and reliable execution.\n\nOver time, that mission evolved into a sharper operating style. We pair product thinking, design clarity, and engineering discipline so launches feel intentional, not improvised. Instead of shipping disconnected assets, we build momentum across brand, web, and growth surfaces together.\n\nToday, we work like a compact strategic partner for founders, operators, and growing companies. Our focus stays the same: create digital experiences that look premium, move fast, and keep working long after the launch week glow fades.",
  },
  mission: {
    title: "Our Mission & Vision",
    subtitle: "Driving innovation with purpose",
    items: [
      {
        icon: "Eye",
        title: "See the next move",
        description:
          "We design with the long game in mind, helping teams build a digital presence that feels ready for the next stage of growth.",
      },
      {
        icon: "Target",
        title: "Build with precision",
        description:
          "From strategy to shipped product, we focus on clarity, measurable value, and systems that are built to scale cleanly.",
      },
      {
        icon: "HeartHandshake",
        title: "Partner with care",
        description:
          "We work closely, communicate clearly, and stay invested in the outcome so the process feels grounded and collaborative.",
      },
    ],
  },
  why_choose_us: {
    title: "Why Choose RaYnk Labs?",
    subtitle: "What makes our working style feel different in practice",
    points: [
      {
        icon: "Zap",
        title: "Fast without feeling rushed",
        description:
          "We move with urgency, but the work still gets the product thinking, polish, and QA it deserves.",
      },
      {
        icon: "Users",
        title: "Tight collaboration",
        description:
          "We stay close to founders and operators so decisions happen in context instead of being lost in handoff loops.",
      },
      {
        icon: "Award",
        title: "Premium output",
        description:
          "Every interface, content surface, and system we touch is shaped to feel sharp, credible, and production-ready.",
      },
      {
        icon: "Clock3",
        title: "Reliable delivery",
        description:
          "We keep momentum visible through clear priorities, practical updates, and execution that respects your timeline.",
      },
      {
        icon: "ShieldCheck",
        title: "Built with discipline",
        description:
          "Security, maintainability, and operational sanity are part of the product, not a cleanup task for later.",
      },
      {
        icon: "TrendingUp",
        title: "Growth-aware systems",
        description:
          "We build foundations that support launches, campaigns, and future features without turning into brittle one-offs.",
      },
    ],
  },
  core_team: {
    title: "Meet Our Core Team",
    subtitle: "The people behind the strategy, systems, and shipping rhythm",
    members: [
      {
        name: "Rohit Rathod",
        role: "Founder & Product Lead",
        image: "/about/team-rohit.svg",
        bio: "Rohit blends product direction, systems thinking, and execution oversight to keep ambitious digital work grounded in business outcomes.",
        skills: ["Product Strategy", "Web Architecture", "Growth Systems"],
        linkedinUrl: "https://linkedin.com",
        githubUrl: "https://github.com",
        twitterUrl: "https://x.com",
        portfolioUrl: "/portfolio",
      },
      {
        name: "Priya Sharma",
        role: "Design Director",
        image: "/about/team-priya.svg",
        bio: "Priya turns complex ideas into calm, modern interfaces with a sharp eye for hierarchy, usability, and visual trust.",
        skills: ["UI Systems", "Brand Experience", "Design Ops"],
        linkedinUrl: "https://linkedin.com",
        portfolioUrl: "/portfolio",
      },
      {
        name: "Amit Patel",
        role: "Engineering Lead",
        image: "/about/team-amit.svg",
        bio: "Amit focuses on stable implementation, scalable frontends, and the kind of engineering choices that age well under real traffic.",
        skills: ["Next.js", "Performance", "Platform Delivery"],
        linkedinUrl: "https://linkedin.com",
        githubUrl: "https://github.com",
        portfolioUrl: "/portfolio",
      },
      {
        name: "Sneha Singh",
        role: "Growth & Client Success",
        image: "/about/team-sneha.svg",
        bio: "Sneha keeps delivery aligned with client goals, translating feedback into focused next steps and stronger launch outcomes.",
        skills: ["Client Strategy", "Launch Planning", "Retention"],
        linkedinUrl: "https://linkedin.com",
        twitterUrl: "https://x.com",
        portfolioUrl: "/portfolio",
      },
    ],
  },
  social_links: {
    title: "Connect With Us",
    subtitle: "Follow our journey across platforms",
    links: [
      {
        platform: "YouTube",
        url: "https://youtube.com/@raynklabs",
        icon: "Youtube",
      },
      {
        platform: "Podcast",
        url: "https://spotify.com/show/raynklabs",
        icon: "Podcast",
      },
      {
        platform: "Instagram",
        url: "https://instagram.com/raynklabs",
        icon: "Instagram",
      },
    ],
  },
  collaboration_cta: {
    title: "Let’s Build Something That Actually Moves The Needle",
    subtitle:
      "Bring us in for a product push, a sharper website, partnership exploration, or a thoughtful conversation about what your next digital move should be.",
    submitText: "Send Inquiry",
    successMessage: "Thanks for reaching out. We will get back to you shortly.",
    highlights: [
      {
        icon: "Sparkles",
        title: "Work with us",
        description: "For launches, redesigns, growth systems, and digital product execution.",
      },
      {
        icon: "Handshake",
        title: "Partnership ready",
        description: "For agency collaborations, strategic partnerships, and white-label delivery.",
      },
      {
        icon: "MessageSquareText",
        title: "Feedback welcome",
        description: "For product feedback, thoughtful intros, and ideas worth exploring together.",
      },
    ],
  },
};

