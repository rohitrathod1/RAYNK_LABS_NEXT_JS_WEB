export interface HeroSection {
  title: string;
  subtitle: string;
  backgroundImage: string;
}

export interface ContactInfoItem {
  icon: string;
  label: string;
  value: string;
}

export interface ContactInfoSection {
  title: string;
  subtitle: string;
  items: ContactInfoItem[];
  workingHours: string;
}

export interface ContactFormSection {
  title: string;
  subtitle: string;
  submitText: string;
}

export interface MapSection {
  title: string;
  embedUrl: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface FaqSection {
  title: string;
  subtitle: string;
  items: FaqItem[];
}

export interface CtaSection {
  title: string;
  subtitle: string;
  buttonText: string;
  buttonLink: string;
}

export interface ContactPageData {
  hero: HeroSection;
  contact_info: ContactInfoSection;
  contact_form: ContactFormSection;
  map: MapSection;
  faq: FaqSection;
  contact_cta: CtaSection;
}

export interface ContactInquiryInput {
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
}
