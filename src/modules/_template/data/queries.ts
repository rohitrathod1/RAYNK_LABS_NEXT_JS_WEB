// Read-only DB operations — used by Server Components and GET API routes.
// Never call these from client components directly.
// Replace the example calls below with your actual Prisma model.

import { db } from "@/lib/db";

export async function getTemplateItems() {
  // return db.yourModel.findMany({ orderBy: { createdAt: "desc" } });
  void db; // placeholder — remove when you add real queries
  return [];
}

export async function getTemplateItemById(id: string) {
  // return db.yourModel.findUnique({ where: { id } });
  void id;
  return null;
}
