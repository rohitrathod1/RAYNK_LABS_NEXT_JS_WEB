import { db } from "@/lib/db";

export async function getProfileByEmail(email: string) {
  return db.admin.findUnique({
    where: { email },
  });
}

export async function updateProfile(id: string, data: unknown) {
  return db.admin.update({
    where: { id },
    data: data as never,
  });
}
