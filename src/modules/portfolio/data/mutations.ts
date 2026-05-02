import { db } from "@/lib/db";

export async function upsertPortfolioSection(section: string, content: unknown) {
  return db.portfolioPage.upsert({
    where: { section },
    update: { content: content as never, updatedAt: new Date() },
    create: { section, content: content as never },
  });
}

export async function createPortfolioProject(data: {
  title: string;
  slug: string;
  description?: string;
  category: string;
  image: string;
  liveUrl?: string;
  githubUrl?: string;
  isFeatured: boolean;
  isActive: boolean;
}) {
  return db.portfolioProject.create({ data });
}

export async function updatePortfolioProject(
  id: string,
  data: {
    title?: string;
    slug?: string;
    description?: string;
    category?: string;
    image?: string;
    liveUrl?: string;
    githubUrl?: string;
    isFeatured?: boolean;
    isActive?: boolean;
  }
) {
  return db.portfolioProject.update({
    where: { id },
    data,
  });
}

export async function deletePortfolioProject(id: string) {
  return db.portfolioProject.delete({
    where: { id },
  });
}

export async function toggleProjectFeatured(id: string, isFeatured: boolean) {
  return db.portfolioProject.update({
    where: { id },
    data: { isFeatured },
  });
}

export async function toggleProjectActive(id: string, isActive: boolean) {
  return db.portfolioProject.update({
    where: { id },
    data: { isActive },
  });
}
