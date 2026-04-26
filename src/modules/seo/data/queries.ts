import { db } from "@/lib/db";

export async function getSeoByPage(page: string) {
  return db.seo.findUnique({ where: { page } });
}

export async function getAllSeo() {
  return db.seo.findMany({ orderBy: { page: "asc" } });
}
