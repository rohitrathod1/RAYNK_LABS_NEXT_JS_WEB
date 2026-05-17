import { definePageSeo } from "@/modules/seo";
import type { ContactPageData } from "../types";
import { CONTACT_MAP } from "../constants";

export const defaultSeo = definePageSeo({
  metaTitle: "Contact RaYnk Labs - Start Your Project",
  metaDescription: "Talk to RaYnk Labs about web products, branding, growth, or digital systems with a premium, fast-moving execution team.",
  keywords: ["contact raynk labs", "get in touch", "project inquiry", "web development contact", "digital studio contact"],
  ogTitle: "Contact RaYnk Labs",
  ogDescription: "Start your next digital project with RaYnk Labs.",
  ogImage: "og-contact.png",
  twitterCard: "summary_large_image",
  canonicalUrl: "http://localhost:3000/contact",
  structuredData: { "@type": "ContactPage", name: "Contact RaYnk Labs" },
  robots: "index,follow",
});

export const defaultContactContent: ContactPageData = {
  hero: {
    title: "Contact Us",
    subtitle: "Tell us what you're building, where you’re stuck, or what kind of momentum you need next. We’ll help you turn it into a clear plan.",
    backgroundImage: "/about/hero-bg.svg",
  },
  contact_info: {
    title: "Get in Touch",
    subtitle: "Reach us through the channel that fits your pace best.",
    items: [
      { icon: "MapPin", label: "Location", value: CONTACT_MAP.locationName },
      { icon: "Phone", label: "Phone", value: "+91 98765 43210" },
      { icon: "Mail", label: "Email", value: "hello@raynklabs.com" },
      { icon: "Clock", label: "Timing", value: "Mon - Fri · 9:00 AM - 6:00 PM" },
    ],
    workingHours: "Typical response within one business day for serious project inquiries.",
  },
  contact_form: {
    title: "Send us a Message",
    subtitle: "Share your goal, current stage, and the kind of result you want. We'll come back with the right next step.",
    submitText: "Send Message",
  },
  map: {
    title: "Find Us",
    embedUrl: CONTACT_MAP.embedUrl,
  },
  faq: {
    title: "Frequently Asked Questions",
    subtitle: "Find quick answers before we talk in detail.",
    items: [
      {
        question: "What services do you offer?",
        answer: "We work across websites, full-stack product builds, UI/UX design, branding systems, SEO, and practical digital growth support.",
      },
      {
        question: "How long does a typical project take?",
        answer: "Smaller launches can move in a few weeks, while deeper product engagements typically run across multiple phases. We scope timelines clearly before kickoff.",
      },
      {
        question: "Do you provide ongoing support?",
        answer: "Yes. We can stay involved for maintenance, SEO, iteration cycles, analytics, and roadmap-based product improvements after launch.",
      },
      {
        question: "Can you work with existing projects?",
        answer: "Absolutely. We often audit existing builds, improve design systems, repair performance issues, and extend products that already have a live user base.",
      },
    ],
  },
  contact_cta: {
    title: "Start Your Project Today",
    subtitle: "If the idea matters, let's get it moving with clear communication and a thoughtful build plan.",
    buttonText: "Start Your Project",
    buttonLink: "/contact#section2-contact-form",
  },
};
