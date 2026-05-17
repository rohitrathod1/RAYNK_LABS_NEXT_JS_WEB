export interface ServiceHero {
  title: string;
  subtitle: string;
  backgroundImage: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
}

export interface ServiceCard {
  icon: string;
  title: string;
  description: string;
  category: string;
  ctaText: string;
  ctaHref: string;
}

export interface ServicesListSection {
  title: string;
  subtitle: string;
  services: ServiceCard[];
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

export interface ProcessStep {
  step: number;
  title: string;
  description: string;
  icon: string;
}

export interface ProcessSection {
  title: string;
  subtitle: string;
  steps: ProcessStep[];
}

export interface ContactCtaSection {
  heading: string;
  subheading: string;
  ctaText: string;
  ctaHref: string;
  secondaryCtaText: string;
  secondaryCtaHref: string;
  primaryService: string;
  secondaryService: string;
  trustIndicators: string[];
}

export interface ServiceInquiryFormValues {
  fullName: string;
  email: string;
  contactNumber?: string;
  companyName?: string;
  serviceName: string;
  budgetRange: string;
  projectTimeline: string;
  projectDescription: string;
  website?: string;
}

export interface ServicesPageData {
  hero: ServiceHero;
  categories: Category[];
  services_list: ServicesListSection;
  why_choose_service: WhyChooseSection;
  process: ProcessSection;
  contact_cta: ContactCtaSection;
}
