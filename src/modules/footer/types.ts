export interface FooterSection {
  id: string;
  title: string;
  sortOrder: number;
  isActive: boolean;
  links: FooterLink[];
}

export interface FooterLink {
  id: string;
  label: string;
  href: string;
  sectionId: string;
  sortOrder: number;
}

export interface FooterSettings {
  id?: string;
  logo?: string | null;
  description?: string | null;
  address?: string | null;
  email?: string | null;
  phone?: string | null;
  copyright?: string | null;
}

export interface FooterData {
  sections: FooterSection[];
  settings: FooterSettings | null;
}
