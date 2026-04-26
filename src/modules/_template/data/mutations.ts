// Write DB operations — called only from server actions, never directly from the client.
// Replace the example calls below with your actual Prisma model.

import { db } from "@/lib/db";
import type { CreateTemplateSchema, UpdateTemplateSchema } from "../validations";

export async function createTemplateItem(data: CreateTemplateSchema) {
  // return db.yourModel.create({ data });
  void db;
  void data;
  return null;
}

export async function updateTemplateItem({ id, ...data }: UpdateTemplateSchema) {
  // return db.yourModel.update({ where: { id }, data });
  void id;
  void data;
  return null;
}

export async function deleteTemplateItem(id: string) {
  // return db.yourModel.delete({ where: { id } });
  void id;
  return null;
}
