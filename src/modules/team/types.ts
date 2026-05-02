export interface HeroSection {
  title: string;
  subtitle: string;
  backgroundImage: string;
}

export interface IntroSection {
  description: string;
}

export interface Founder {
  name: string;
  role: string;
  image: string;
  bio: string;
  portfolioUrl?: string;
}

export interface FoundersSection {
  title: string;
  subtitle: string;
  founders: Founder[];
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio?: string | null;
  image: string;
  linkedin?: string | null;
  twitter?: string | null;
  github?: string | null;
  portfolio?: string | null;
}

export interface TeamMembersSection {
  title: string;
  subtitle: string;
}

export interface ValuePoint {
  icon: string;
  title: string;
  description: string;
}

export interface ValuesSection {
  title: string;
  subtitle: string;
  points: ValuePoint[];
}

export interface CtaSection {
  title: string;
  subtitle: string;
  buttonText: string;
  buttonLink: string;
}

export interface TeamPageData {
  hero: HeroSection;
  intro: IntroSection;
  founders: FoundersSection;
  team_members: TeamMembersSection;
  values: ValuesSection;
  contact_cta: CtaSection;
}

export interface TeamMemberInput {
  name: string;
  role: string;
  bio?: string;
  image: string;
  linkedin?: string;
  twitter?: string;
  github?: string;
  portfolio?: string;
  isActive?: boolean;
  sortOrder?: number;
}
