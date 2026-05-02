export interface BlogPostItem {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  coverImage: string | null;
  author: string;
  tags: string[];
  isPublished: boolean;
  metaTitle: string | null;
  metaDescription: string | null;
  publishedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface BlogHeroSection {
  title: string;
  subtitle: string;
  backgroundImage: string;
}

export interface BlogListSection {
  title: string;
  subtitle: string;
}

export interface BlogPageData {
  hero: BlogHeroSection;
  blog_list: BlogListSection;
}

export interface BlogFormData {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  author: string;
  tags: string;
  isPublished: boolean;
  metaTitle: string;
  metaDescription: string;
}
