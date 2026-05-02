import type { PageSEO } from "@/lib/seo";
import type { ContactPageData } from "../types";

export const defaultSeo: PageSEO = {
  title: "Contact Us — RaYnk Labs",
  description: "Get in touch with RaYnk Labs. Reach out to discuss your project, ask questions, or explore collaboration opportunities.",
  keywords: "contact raynk labs, get in touch, project inquiry, web development contact",
  ogImage: "/api/uploads/og-contact.png",
  noIndex: false,
};

export const defaultContactContent: ContactPageData = {
  hero: {
    title: "Contact Us",
    subtitle: "We'd love to hear from you. Reach out to discuss your project or ask any questions.",
    backgroundImage: "placeholder.png",
  },
  contact_info: {
    title: "Get in Touch",
    subtitle: "Here's how you can reach us",
    items: [
      { icon: "MapPin", label: "Address", value: "123 Tech Park, Bangalore, India" },
      { icon: "Phone", label: "Phone", value: "+91 98765 43210" },
      { icon: "Mail", label: "Email", value: "hello@raynklabs.com" },
    ],
    workingHours: "Mon - Fri: 9:00 AM - 6:00 PM",
  },
  contact_form: {
    title: "Send us a Message",
    subtitle: "Fill out the form below and we'll get back to you soon",
    submitText: "Send Message",
  },
  map: {
    title: "Find Us",
    embedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3888.0!2d77.0!3d13.0!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zM0PCsM!5e0!3m2!1sen!2sin!4v0",
  },
  faq: {
    title: "Frequently Asked Questions",
    subtitle: "Find answers to common questions",
    items: [
      {
        question: "What services do you offer?",
        answer: "We offer full-stack web development, mobile app development, UI/UX design, and digital consulting services.",
      },
      {
        question: "How long does a typical project take?",
        answer: "Project timelines vary based on complexity. A simple website may take 2-4 weeks, while complex applications can take 3-6 months.",
      },
      {
        question: "Do you provide ongoing support?",
        answer: "Yes, we offer maintenance and support packages to keep your application running smoothly after launch.",
      },
      {
        question: "Can you work with existing projects?",
        answer: "Absolutely! We can join existing projects, perform audits, and help improve or extend your current application.",
      },
    ],
  },
  contact_cta: {
    title: "Start Your Project Today",
    subtitle: "Ready to bring your idea to life? Let's discuss how we can help you succeed.",
    buttonText: "Get Started",
    buttonLink: "/contact",
  },
};
