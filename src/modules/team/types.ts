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
  displayName: string;
  role: string;
  bio?: string | null;
  avatar?: string | null;
  githubUrl?: string | null;
  linkedinUrl?: string | null;
  instagramUrl?: string | null;
  youtubeUrl?: string | null;
  email?: string | null;
  isVisible?: boolean;
  isFeatured?: boolean;
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
  displayName: string;
  role?: string;
  bio?: string;
  avatar?: string;
  githubUrl?: string;
  linkedinUrl?: string;
  instagramUrl?: string;
  youtubeUrl?: string;
  isVisible?: boolean;
  isFeatured?: boolean;
}
