export interface HeroSection {
  title: string;
  subtitle: string;
  backgroundImage: string;
}

export interface CategoriesFilterSection {
  title: string;
  categories: string[];
}

export interface ProjectsGridSection {
  title: string;
  subtitle: string;
}

export interface ProjectItem {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  category: string;
  image: string;
  liveUrl: string | null;
  githubUrl: string | null;
  isFeatured: boolean;
  isActive: boolean;
}

export interface TestimonialItem {
  name: string;
  role: string;
  avatar: string;
  quote: string;
  rating: number;
}

export interface TestimonialsSection {
  title: string;
  subtitle: string;
  testimonials: TestimonialItem[];
}

export interface CtaSection {
  heading: string;
  subheading: string;
  ctaText: string;
  ctaHref: string;
}

export interface PortfolioPageData {
  hero: HeroSection;
  categories_filter: CategoriesFilterSection;
  projects_grid: ProjectsGridSection;
  testimonials: TestimonialsSection;
  contact_cta: CtaSection;
}

export interface PortfolioProjectFormData {
  title: string;
  slug: string;
  description: string;
  category: string;
  image: string;
  liveUrl: string;
  githubUrl: string;
  isFeatured: boolean;
  isActive: boolean;
}
