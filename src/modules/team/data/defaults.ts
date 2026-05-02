import type { PageSEO } from "@/lib/seo";
import type { TeamPageData } from "../types";

export const defaultSeo: PageSEO = {
  title: "Our Team — RaYnk Labs",
  description:
    "Meet the talented team behind RaYnk Labs. Discover our founders, developers, designers, and the values that drive us.",
  keywords: "raynk labs team, developers, designers, tech team, company culture",
  ogImage: "/api/uploads/og-team.png",
  noIndex: false,
};

export const defaultTeamContent: TeamPageData = {
  hero: {
    title: "Meet Our Team",
    subtitle: "The passionate individuals driving innovation at RaYnk Labs.",
    backgroundImage: "placeholder.png",
  },
  intro: {
    description:
      "At RaYnk Labs, we believe that great products are built by great teams. Our diverse group of developers, designers, and strategists work together to solve complex problems and deliver exceptional digital experiences. We foster a culture of continuous learning, collaboration, and innovation.",
  },
  founders: {
    title: "Our Founders",
    subtitle: "The visionaries leading the way",
    founders: [
      {
        name: "Rohit Kumar",
        role: "Founder & CEO",
        image: "placeholder.png",
        bio: "With a passion for technology and business, Rohit founded RaYnk Labs to bridge the gap between complex tech and real business needs.",
        portfolioUrl: "/portfolio",
      },
      {
        name: "Priya Sharma",
        role: "Co-Founder & CTO",
        image: "placeholder.png",
        bio: "Priya brings years of technical expertise and leadership to drive our engineering excellence and innovation initiatives.",
        portfolioUrl: "/portfolio",
      },
    ],
  },
  team_members: {
    title: "Our Team Members",
    subtitle: "Talented individuals making an impact",
  },
  values: {
    title: "Our Values",
    subtitle: "What drives us every day",
    points: [
      {
        icon: "Users",
        title: "Collaboration",
        description:
          "We believe the best solutions come from working together, sharing ideas, and respecting diverse perspectives.",
      },
      {
        icon: "Lightbulb",
        title: "Innovation",
        description:
          "We constantly explore new technologies and approaches to stay ahead of the curve and deliver cutting-edge solutions.",
      },
      {
        icon: "Heart",
        title: "Integrity",
        description:
          "We operate with transparency, honesty, and ethical practices in everything we do.",
      },
      {
        icon: "TrendingUp",
        title: "Excellence",
        description:
          "We strive for excellence in every project, paying attention to detail and delivering high-quality results.",
      },
      {
        icon: "BookOpen",
        title: "Continuous Learning",
        description:
          "We invest in our team's growth, encouraging learning and development to stay at the forefront of technology.",
      },
    ],
  },
  contact_cta: {
    title: "Join Our Team",
    subtitle: "Want to work with passionate people on exciting projects? We'd love to hear from you.",
    buttonText: "View Open Positions",
    buttonLink: "/careers",
  },
};
