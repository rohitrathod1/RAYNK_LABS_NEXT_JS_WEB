import { definePageSeo } from "@/modules/seo";
import type { TeamPageData } from "../types";

export const defaultSeo = definePageSeo({
  metaTitle: "Team - RaYnk Labs",
  metaDescription: "Meet the builders, operators, and creative leads shaping premium digital products at RaYnk Labs.",
  keywords: ["raynk labs team", "startup team", "digital agency team", "product builders", "creative studio team"],
  ogTitle: "Meet the RaYnk Labs Team",
  ogDescription: "A compact team with full-stack range, sharp product taste, and a bias for shipping excellent work.",
  ogImage: "og-team.png",
  twitterCard: "summary_large_image",
  canonicalUrl: "http://localhost:3000/team",
  structuredData: { "@type": "Organization", name: "RaYnk Labs" },
  robots: "index,follow",
});

export const defaultTeamContent: TeamPageData = {
  hero: {
    title: "Meet Our Team",
    subtitle: "The passionate individuals driving product, design, engineering, and growth at RaYnk Labs.",
    backgroundImage: "/about/hero-bg.svg",
  },
  intro: {
    description:
      "At RaYnk Labs, we keep the team intentionally compact and deeply collaborative. Designers, developers, and operators work shoulder to shoulder so decisions happen fast, quality stays high, and every project benefits from shared ownership.",
  },
  founders: {
    title: "Leadership",
    subtitle: "The people setting the pace and raising the bar",
    founders: [
      {
        name: "Rohit Rathod",
        role: "Founder & Product Lead",
        image: "/about/team-rohit.svg",
        bio: "Rohit leads product direction, systems thinking, and the delivery standards that shape the RaYnk Labs experience.",
        portfolioUrl: "/portfolio",
      },
      {
        name: "Priya Sharma",
        role: "Co-Founder & Engineering Lead",
        image: "/about/team-priya.svg",
        bio: "Priya drives architecture, engineering discipline, and the hands-on execution behind reliable digital builds.",
        portfolioUrl: "/portfolio",
      },
    ],
  },
  team_members: {
    title: "Our Team Members",
    subtitle: "Talented individuals making an impact across strategy, design, growth, and engineering.",
  },
  values: {
    title: "Our Values",
    subtitle: "What drives us every day",
    points: [
      {
        icon: "Users",
        title: "Collaboration",
        description:
          "We work in the open, challenge ideas with respect, and build better outcomes by leaning into each other�s strengths.",
      },
      {
        icon: "Lightbulb",
        title: "Innovation",
        description:
          "We stay curious, test quickly, and keep refining the craft so our clients get work that feels current and durable.",
      },
      {
        icon: "Heart",
        title: "Integrity",
        description:
          "Trust is part of the product. We communicate clearly, stay accountable, and avoid shortcuts that create hidden cost later.",
      },
      {
        icon: "TrendingUp",
        title: "Excellence",
        description:
          "We care about polish, performance, and the small details that make a product feel confidently finished.",
      },
      {
        icon: "BookOpen",
        title: "Continuous Learning",
        description:
          "The team grows in public through iteration, feedback, and constant skill sharpening across product and technology.",
      },
    ],
  },
  contact_cta: {
    title: "Join Our Team",
    subtitle: "Join us for full-time roles, internships, collaborations, or thoughtful project conversations.",
    buttonText: "Join Team",
    buttonLink: "/team#section7-join-team",
  },
};
