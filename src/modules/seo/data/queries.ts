import { db } from "@/lib/db";

export async function getSeoByPage(page: string) {
  return db.seoPage.findUnique({ where: { page } });
}

export async function getAllSeo() {
  return db.seoPage.findMany({ orderBy: { page: "asc" } });
}
