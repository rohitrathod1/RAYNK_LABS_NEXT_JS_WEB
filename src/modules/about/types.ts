export interface HeroSection {
  title: string;
  subtitle: string;
  backgroundImage: string;
}

export interface StorySection {
  image: string;
  content: string;
}

export interface MissionItem {
  title: string;
  description: string;
  icon: string;
}

export interface MissionSection {
  title: string;
  subtitle: string;
  items: MissionItem[];
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

export interface TeamMember {
  name: string;
  role: string;
  image: string;
  bio?: string;
  skills?: string[];
  githubUrl?: string;
  linkedinUrl?: string;
  twitterUrl?: string;
  portfolioUrl?: string;
}

export interface CoreTeamSection {
  title: string;
  subtitle: string;
  members: TeamMember[];
}

export interface SocialLink {
  platform: string;
  url: string;
  icon: string;
}

export interface SocialLinksSection {
  title: string;
  subtitle: string;
  links: SocialLink[];
}

export interface CollaborationHighlight {
  icon: string;
  title: string;
  description: string;
}

export interface CollaborationCtaSection {
  title: string;
  subtitle: string;
  submitText: string;
  successMessage: string;
  highlights: CollaborationHighlight[];
}

export interface AboutPageData {
  hero: HeroSection;
  story: StorySection;
  mission: MissionSection;
  why_choose_us: WhyChooseSection;
  core_team: CoreTeamSection;
  social_links: SocialLinksSection;
  collaboration_cta: CollaborationCtaSection;
}
