import type { PageSEO } from "@/lib/seo";
import type { HomePageData } from "../types";

export const defaultSeo: PageSEO = {
  title: "RaYnk Labs — Student-Led Tech Innovation Lab",
  description:
    "RaYnk Labs is a student-driven tech innovation lab building software, services, projects, and communities that matter.",
  keywords: "raynk labs, student tech lab, tech innovation, software development, student startup",
  ogImage: "/api/uploads/og-home.png",
  noIndex: false,
};

export const defaultHomeContent: HomePageData = {
  hero: {
    heading: "Building the Future, One Project at a Time",
    subheading:
      "RaYnk Labs is a student-led tech innovation lab turning bold ideas into real products — software, services, and communities that matter.",
    ctaText: "Explore Our Work",
    ctaHref: "/projects",
    secondaryCtaText: "Learn About Us",
    secondaryCtaHref: "/about",
    backgroundImage: "placeholder.png",
    badgeText: "Student-Led Innovation",
  },
  mission: {
    title: "Our Mission",
    body: "We believe students are the most powerful force for technological change. RaYnk Labs gives ambitious students the infrastructure, mentorship, and community to ship real products — not just learn in classrooms.",
    image: "placeholder.png",
    stats: [
      { label: "Projects Shipped", value: "20+" },
      { label: "Active Members", value: "50+" },
      { label: "Technologies", value: "15+" },
      { label: "Communities Built", value: "5+" },
    ],
  },
  "featured-products": {
    title: "What We Build",
    subtitle: "From SaaS tools to open-source libraries — every project starts with a real problem.",
    products: [
      {
        name: "RaYnk Dashboard",
        description: "A full-stack admin dashboard template for rapid product development.",
        image: "placeholder.png",
        href: "/projects",
        badge: "Open Source",
      },
      {
        name: "LabsConnect",
        description: "Community platform connecting student builders across campuses.",
        image: "placeholder.png",
        href: "/projects",
        badge: "In Beta",
      },
      {
        name: "CourseKit",
        description: "A lightweight course creation and delivery system for educators.",
        image: "placeholder.png",
        href: "/projects",
        badge: "Coming Soon",
      },
    ],
  },
  "health-benefits": {
    title: "Why Join RaYnk Labs",
    subtitle: "More than a club — a launchpad for your career in tech.",
    benefits: [
      {
        title: "Real-World Experience",
        description:
          "Ship production-grade software used by real people — not just homework assignments.",
        icon: "Rocket",
      },
      {
        title: "Mentorship & Guidance",
        description:
          "Work with seniors, alumni, and industry professionals who have walked the path.",
        icon: "Users",
      },
      {
        title: "Portfolio That Stands Out",
        description:
          "Build projects you can demo, GitHub repos with actual commits, and products with real users.",
        icon: "Star",
      },
      {
        title: "Community of Builders",
        description:
          "Surround yourself with peers who ship, learn fast, and push each other to do more.",
        icon: "Heart",
      },
      {
        title: "Open Tech Stack",
        description:
          "Learn the tools the industry uses — Next.js, Prisma, Docker, CI/CD, and more.",
        icon: "Code",
      },
      {
        title: "Zero Gatekeeping",
        description:
          "Anyone can contribute. We value curiosity and work ethic over credentials.",
        icon: "Unlock",
      },
    ],
  },
  testimonials: {
    title: "What Members Say",
    subtitle:
      "Hear from students and alumni who have built real things with RaYnk Labs.",
    testimonials: [
      {
        name: "Priya Sharma",
        role: "Software Engineer at Zepto",
        avatar: "placeholder.png",
        quote:
          "RaYnk Labs is where I learned to actually ship code. The experience I got here was worth more than any internship.",
        rating: 5,
      },
      {
        name: "Arjun Mehta",
        role: "Founder, DevFlow",
        avatar: "placeholder.png",
        quote:
          "The community here is the best part. People who take ideas seriously and help each other build fast.",
        rating: 5,
      },
      {
        name: "Sneha Patel",
        role: "Product at Razorpay",
        avatar: "placeholder.png",
        quote:
          "I built my first full-stack product with RaYnk. The mentorship and structured approach made all the difference.",
        rating: 5,
      },
    ],
  },
  cta: {
    heading: "Ready to Build Something Real?",
    subheading:
      "Join RaYnk Labs and be part of a student community that ships products, not just projects.",
    ctaText: "Apply to Join",
    ctaHref: "/careers",
    backgroundImage: "placeholder.png",
  },
};
