export interface HeroSection {
  heading: string;
  subtitle: string;
  ctaPrimaryText: string;
  ctaPrimaryHref: string;
  ctaSecondaryText: string;
  ctaSecondaryHref: string;
  backgroundImage: string;
}

export interface InitiativeCard {
  icon: string;
  title: string;
  description: string;
}

export interface InitiativesSection {
  title: string;
  subtitle: string;
  cards: InitiativeCard[];
}

export interface ServiceCard {
  icon: string;
  title: string;
  description: string;
}

export interface ServicesSection {
  title: string;
  subtitle: string;
  services: ServiceCard[];
}

export interface WhyDigitalSection {
  title: string;
  subtitle: string;
  image: string;
  bulletPoints: string[];
}

export interface PortfolioItem {
  title: string;
  description: string;
  image: string;
  href: string;
  tags: string[];
}

export interface PortfolioSection {
  title: string;
  subtitle: string;
  items: PortfolioItem[];
}

export interface Testimonial {
  name: string;
  role: string;
  avatar: string;
  quote: string;
  rating: number;
}

export interface TestimonialsSection {
  title: string;
  subtitle: string;
  testimonials: Testimonial[];
}

export interface WhyChoosePoint {
  icon: string;
  title: string;
  description: string;
}

export interface WhyChooseSection {
  title: string;
  subtitle: string;
  points: WhyChoosePoint[];
}

export interface CtaSection {
  heading: string;
  subheading: string;
  ctaText: string;
  ctaHref: string;
}

export interface HomePageData {
  hero: HeroSection;
  initiatives: InitiativesSection;
  services: ServicesSection;
  why_digital: WhyDigitalSection;
  portfolio_preview: PortfolioSection;
  testimonials: TestimonialsSection;
  why_choose_us: WhyChooseSection;
  contact_cta: CtaSection;
}
