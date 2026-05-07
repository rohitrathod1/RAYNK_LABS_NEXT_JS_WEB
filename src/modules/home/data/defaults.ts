import { definePageSeo } from "@/modules/seo";
import type { HomePageData } from "../types";

export const defaultSeo = definePageSeo({
  metaTitle: "RaYnk Labs - Digital Solutions & Innovation",
  metaDescription: "RaYnk Labs delivers web development, software, branding, SEO, and digital products that help businesses grow.",
  keywords: ["raynk labs", "digital solutions", "web development", "software development", "tech innovation"],
  ogTitle: "RaYnk Labs - Digital Solutions & Innovation",
  ogDescription: "Websites, software, branding, SEO, and digital products built for modern business growth.",
  ogImage: "og-home.png",
  twitterCard: "summary_large_image",
  canonicalUrl: "http://localhost:3000",
  structuredData: { "@type": "WebSite", name: "RaYnk Labs" },
  robots: "index,follow",
});
export const defaultHomeContent: HomePageData = {
  hero: {
    heading: "Grow Your Business with Digital Solutions",
    subtitle:
      "We build powerful software, stunning websites, and scalable digital products that transform how you connect with customers and grow your business.",
    ctaPrimaryText: "Get Started",
    ctaPrimaryHref: "/contact",
    ctaSecondaryText: "Contact Us",
    ctaSecondaryHref: "/contact",
    backgroundImage: "placeholder.png",
  },
  initiatives: {
    title: "Our Key Initiatives",
    subtitle: "Driving innovation across multiple fronts to deliver exceptional value.",
    cards: [
      {
        icon: "Rocket",
        title: "Product Development",
        description: "Building scalable SaaS products and custom software solutions from ideation to launch.",
      },
      {
        icon: "GraduationCap",
        title: "Skill Development",
        description: "Empowering the next generation of developers through hands-on projects and mentorship.",
      },
      {
        icon: "Globe",
        title: "Open Source",
        description: "Contributing to the global developer community with tools, libraries, and frameworks.",
      },
      {
        icon: "Handshake",
        title: "Client Solutions",
        description: "Delivering enterprise-grade digital solutions for businesses of all sizes.",
      },
    ],
  },
  services: {
    title: "Our Services",
    subtitle: "End-to-end digital services tailored to your business needs.",
    services: [
      {
        icon: "Code",
        title: "Web Development",
        description: "Modern, responsive websites and web applications built with cutting-edge technologies.",
      },
      {
        icon: "Smartphone",
        title: "Mobile Apps",
        description: "Cross-platform mobile applications that deliver seamless user experiences.",
      },
      {
        icon: "Palette",
        title: "UI/UX Design",
        description: "User-centered design that combines aesthetics with functionality and accessibility.",
      },
      {
        icon: "Cloud",
        title: "Cloud Solutions",
        description: "Scalable cloud infrastructure, deployment, and DevOps automation for reliability.",
      },
      {
        icon: "Shield",
        title: "Cybersecurity",
        description: "Protect your digital assets with comprehensive security audits and implementations.",
      },
      {
        icon: "BarChart3",
        title: "Data Analytics",
        description: "Transform raw data into actionable insights with custom dashboards and reporting.",
      },
      {
        icon: "Megaphone",
        title: "Digital Marketing",
        description: "SEO, content strategy, and performance marketing to amplify your online presence.",
      },
      {
        icon: "Bot",
        title: "AI Integration",
        description: "Leverage artificial intelligence and machine learning to automate and optimize workflows.",
      },
      {
        icon: "LifeBuoy",
        title: "Tech Consulting",
        description: "Expert guidance on technology strategy, architecture decisions, and digital transformation.",
      },
    ],
  },
  why_digital: {
    title: "Why Go Digital?",
    subtitle: "Digital transformation is no longer optional — it's essential for survival and growth.",
    image: "placeholder.png",
    bulletPoints: [
      "Reach customers 24/7 with an always-online presence",
      "Automate repetitive tasks and reduce operational costs by up to 40%",
      "Scale your business without proportional increases in overhead",
      "Make data-driven decisions with real-time analytics and insights",
      "Stay ahead of competitors who haven't yet embraced digital",
      "Build stronger customer relationships through personalized experiences",
    ],
  },
  portfolio_preview: {
    title: "Our Recent Work",
    subtitle: "Explore projects that showcase our expertise and innovation.",
    items: [
      {
        title: "E-Commerce Platform",
        description: "Full-stack marketplace with payment integration and inventory management.",
        image: "placeholder.png",
        href: "/portfolio",
        tags: ["Next.js", "Stripe", "PostgreSQL"],
      },
      {
        title: "Healthcare Dashboard",
        description: "Real-time patient monitoring and analytics platform for hospitals.",
        image: "placeholder.png",
        href: "/portfolio",
        tags: ["React", "D3.js", "Node.js"],
      },
      {
        title: "EdTech Learning App",
        description: "Interactive learning platform with video courses and progress tracking.",
        image: "placeholder.png",
        href: "/portfolio",
        tags: ["React Native", "Firebase", "AWS"],
      },
      {
        title: "SaaS CRM System",
        description: "Customer relationship management tool with automation and reporting.",
        image: "placeholder.png",
        href: "/portfolio",
        tags: ["Next.js", "Prisma", "Redis"],
      },
      {
        title: "Real Estate Portal",
        description: "Property listing platform with virtual tours and agent matching.",
        image: "placeholder.png",
        href: "/portfolio",
        tags: ["Vue.js", "MongoDB", "Mapbox"],
      },
      {
        title: "FinTech Mobile App",
        description: "Budgeting and investment tracking app with bank-level security.",
        image: "placeholder.png",
        href: "/portfolio",
        tags: ["Flutter", "Plaid", "PostgreSQL"],
      },
    ],
  },
  testimonials: {
    title: "What Our Clients Say",
    subtitle: "Real feedback from businesses we've helped transform digitally.",
    testimonials: [
      {
        name: "Rajesh Kumar",
        role: "CEO, TechVentures Inc.",
        avatar: "placeholder.png",
        quote:
          "RaYnk Labs transformed our entire online presence. Our conversion rate increased by 200% within three months of launching the new platform.",
        rating: 5,
      },
      {
        name: "Anita Desai",
        role: "Founder, GreenLeaf Organics",
        avatar: "placeholder.png",
        quote:
          "The team delivered beyond our expectations. They didn't just build a website — they built a growth engine for our business.",
        rating: 5,
      },
      {
        name: "Vikram Singh",
        role: "CTO, DataFlow Analytics",
        avatar: "placeholder.png",
        quote:
          "Professional, responsive, and incredibly talented. They understood our complex requirements and delivered a clean, scalable solution.",
        rating: 5,
      },
    ],
  },
  why_choose_us: {
    title: "Why Choose RaYnk Labs?",
    subtitle: "We combine technical excellence with a deep understanding of business needs.",
    points: [
      {
        icon: "Zap",
        title: "Fast Delivery",
        description: "Agile methodology ensures rapid development without compromising quality.",
      },
      {
        icon: "Award",
        title: "Proven Expertise",
        description: "50+ successful projects across industries with measurable business impact.",
      },
      {
        icon: "Users",
        title: "Dedicated Team",
        description: "A committed team of developers, designers, and strategists working on your project.",
      },
      {
        icon: "RefreshCw",
        title: "Ongoing Support",
        description: "Post-launch maintenance, updates, and optimization to keep your product performing.",
      },
      {
        icon: "Lock",
        title: "Security First",
        description: "Enterprise-grade security practices built into every project from day one.",
      },
      {
        icon: "TrendingUp",
        title: "Scalable Solutions",
        description: "Architecture designed to grow with your business — no costly rewrites needed.",
      },
    ],
  },
  contact_cta: {
    heading: "Ready to Start Your Digital Journey?",
    subheading:
      "Let's discuss how we can help transform your business with the right technology solutions.",
    ctaText: "Contact Us",
    ctaHref: "/contact",
  },
};
