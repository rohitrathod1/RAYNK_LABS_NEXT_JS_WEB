export const CONTACT_SECTIONS = {
  hero: 'section1-contact-hero',
  form: 'section2-contact-form',
  info: 'section3-contact-info',
  offices: 'section4-office-locations',
  faq: 'section5-faq',
  map: 'section6-map',
  social: 'section7-social-links',
  cta: 'section8-contact-cta',
} as const;

export const CONTACT_SERVICE_TYPES = [
  'Website Development',
  'Mobile App',
  'UI/UX Design',
  'SEO & Growth',
  'Branding',
  'AI Solution',
  'Other',
] as const;

export const CONTACT_BUDGET_RANGES = [
  'Below $1,000',
  '$1,000 - $5,000',
  '$5,000 - $10,000',
  '$10,000+',
  'Not sure yet',
] as const;

export const CONTACT_TIMELINES = [
  'ASAP',
  '2 - 4 weeks',
  '1 - 3 months',
  '3+ months',
  'Flexible',
] as const;

export const CONTACT_MAP = {
  locationName: 'Akal University',
  fullAddress: 'Akal University, Talwandi Sabo, Bathinda, Punjab, India',
  googleMapsUrl: 'https://maps.app.goo.gl/B1obe57EuZzM1c3i8',
  embedUrl: 'https://www.google.com/maps?q=Akal%20University&z=15&output=embed',
  travelNote: 'Available for remote collaborations, campus meetings, and scheduled discovery sessions.',
} as const;

export const CONTACT_SOCIAL_LINKS = [
  { label: 'GitHub', href: 'https://github.com' },
  { label: 'LinkedIn', href: 'https://linkedin.com' },
  { label: 'Instagram', href: 'https://instagram.com' },
  { label: 'YouTube', href: 'https://youtube.com' },
  { label: 'Website', href: '/' },
] as const;
