import type { PageSEO } from "@/lib/seo";
import type { AboutPageData } from "../types";

export const defaultSeo: PageSEO = {
  title: "About RaYnk Labs — Our Story, Mission & Team",
  description:
    "Learn about RaYnk Labs — our story, mission, vision, and the team driving digital innovation forward.",
  keywords: "raynk labs, about us, digital agency, tech team, company story",
  ogImage: "/api/uploads/og-about.png",
  noIndex: false,
};

export const defaultAboutContent: AboutPageData = {
  hero: {
    title: "Who We Are",
    subtitle: "A team of passionate innovators building the future of digital solutions.",
    backgroundImage: "placeholder.png",
  },
  story: {
    image: "placeholder.png",
    content:
      "RaYnk Labs was founded with a simple yet powerful vision: to bridge the gap between complex technology and real business needs. What started as a small team of passionate developers has grown into a full-service digital solutions provider.\n\nOur journey began when we recognized that many businesses were struggling to navigate the rapidly evolving digital landscape. We saw an opportunity to not just build software, but to become true partners in our clients' growth stories.\n\nToday, we combine cutting-edge technology with deep business understanding to deliver solutions that don't just work — they drive results. From startups to enterprises, we've helped businesses across industries transform their digital presence and achieve their goals.",
  },
  mission: {
    title: "Our Mission & Vision",
    subtitle: "Driving innovation with purpose",
    items: [
      {
        icon: "Eye",
        title: "Our Vision",
        description:
          "To be the leading force in digital transformation, empowering businesses worldwide with innovative technology solutions.",
      },
      {
        icon: "Target",
        title: "Our Mission",
        description:
          "We build scalable, user-centric digital solutions that solve real problems and create measurable business value.",
      },
      {
        icon: "Heart",
        title: "Our Values",
        description:
          "Integrity, innovation, and impact guide everything we do. We believe in building lasting relationships with our clients.",
      },
    ],
  },
  why_choose_us: {
    title: "Why Choose RaYnk Labs?",
    subtitle: "What sets us apart in the digital landscape",
    points: [
      {
        icon: "Zap",
        title: "Innovation First",
        description:
          "We stay ahead of technology trends to deliver cutting-edge solutions that give you a competitive edge.",
      },
      {
        icon: "Users",
        title: "Client-Centric",
        description:
          "Your success is our success. We work as an extension of your team, understanding your unique needs.",
      },
      {
        icon: "Award",
        title: "Proven Excellence",
        description:
          "With 50+ successful projects and counting, our track record speaks for itself.",
      },
      {
        icon: "Clock",
        title: "On-Time Delivery",
        description:
          "We respect your timelines. Our agile process ensures consistent, predictable delivery.",
      },
      {
        icon: "Shield",
        title: "Security Focused",
        description:
          "Enterprise-grade security practices are baked into every solution we build.",
      },
      {
        icon: "TrendingUp",
        title: "Scalable Growth",
        description:
          "Our solutions grow with your business — no costly rewrites or migrations needed.",
      },
    ],
  },
  core_team: {
    title: "Meet Our Core Team",
    subtitle: "The minds behind RaYnk Labs",
    members: [
      {
        name: "Rohit Kumar",
        role: "Founder & CEO",
        image: "placeholder.png",
        portfolioUrl: "/portfolio",
      },
      {
        name: "Priya Sharma",
        role: "CTO",
        image: "placeholder.png",
        portfolioUrl: "/portfolio",
      },
      {
        name: "Amit Patel",
        role: "Head of Design",
        image: "placeholder.png",
        portfolioUrl: "/portfolio",
      },
      {
        name: "Sneha Singh",
        role: "Lead Developer",
        image: "placeholder.png",
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
};
