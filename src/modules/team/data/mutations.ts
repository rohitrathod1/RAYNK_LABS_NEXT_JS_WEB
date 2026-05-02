import { db } from "@/lib/db";

export async function upsertTeamSection(section: string, content: unknown) {
  return db.teamPage.upsert({
    where: { section },
    update: { content: content as never, updatedAt: new Date() },
    create: { section, content: content as never },
  });
}

export async function createTeamMember(data: unknown) {
  return db.teamMember.create({
    data: data as never,
  });
}

export async function updateTeamMember(id: string, data: unknown) {
  return db.teamMember.update({
    where: { id },
    data: { ...(data as object), updatedAt: new Date() } as never,
  });
}

export async function deleteTeamMember(id: string) {
  return db.teamMember.delete({
    where: { id },
  });
}
