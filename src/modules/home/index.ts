export type {
  HeroSection,
  InitiativeCard,
  InitiativesSection,
  ServiceCard,
  ServicesSection,
  WhyDigitalSection,
  PortfolioItem,
  PortfolioSection,
  Testimonial,
  TestimonialsSection,
  WhyChoosePoint,
  WhyChooseSection,
  CtaSection,
  HomePageData,
} from "./types";

export {
  heroSchema,
  initiativesSchema,
  servicesSchema,
  whyDigitalSchema,
  portfolioSchema,
  testimonialsSchema,
  whyChooseSchema,
  ctaSchema,
  seoSchema,
} from "./validations";

export type {
  HeroSchema,
  InitiativesSchema,
  ServicesSchema,
  WhyDigitalSchema,
  PortfolioSchema,
  TestimonialsSchema,
  WhyChooseSchema,
  CtaSchema,
} from "./validations";

export {
  updateHomeHero,
  updateHomeInitiatives,
  updateHomeServices,
  updateHomeWhyDigital,
  updateHomePortfolio,
  updateHomeTestimonials,
  updateHomeWhyChoose,
  updateHomeCta,
  updateHomeSeo,
} from "./actions";

export { HomePageContent } from "./components";

export {
  getHomePageData,
  getHomeSection,
  getHomeSeo,
  upsertHomeSection,
  defaultSeo,
  defaultHomeContent,
} from "./data";
