export type NavLink = {
  id: string;
  title: string;
  href: string;
  parentId: string | null;
  isVisible: boolean;
  sortOrder: number;
  children?: NavLink[];
  createdAt: Date;
  updatedAt: Date;
};

export type NavLinkWithChildren = NavLink & {
  children: NavLinkWithChildren[];
};

export type NavbarSettings = {
  id: string;
  logoUrl: string | null;
  logoAlt: string | null;
  updatedAt: Date;
};
