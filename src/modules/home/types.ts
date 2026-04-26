export interface HeroSection {
  heading: string;
  subheading: string;
  ctaText: string;
  ctaHref: string;
  secondaryCtaText: string;
  secondaryCtaHref: string;
  backgroundImage: string;
  badgeText: string;
}

export interface MissionSection {
  title: string;
  body: string;
  image: string;
  stats: { label: string; value: string }[];
}

export interface FeaturedProduct {
  name: string;
  description: string;
  image: string;
  href: string;
  badge: string;
}

export interface FeaturedProductsSection {
  title: string;
  subtitle: string;
  products: FeaturedProduct[];
}

export interface HealthBenefit {
  title: string;
  description: string;
  icon: string;
}

export interface HealthBenefitsSection {
  title: string;
  subtitle: string;
  benefits: HealthBenefit[];
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

export interface CtaSection {
  heading: string;
  subheading: string;
  ctaText: string;
  ctaHref: string;
  backgroundImage: string;
}

export interface HomePageData {
  hero: HeroSection;
  mission: MissionSection;
  "featured-products": FeaturedProductsSection;
  "health-benefits": HealthBenefitsSection;
  testimonials: TestimonialsSection;
  cta: CtaSection;
}
