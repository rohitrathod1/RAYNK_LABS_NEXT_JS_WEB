import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { ForbiddenError, UnauthorizedError } from "@/lib/require-admin";
import type { Session } from "next-auth";

export async function checkPermission(
  session: Session | null,
  permission: string,
): Promise<boolean> {
  if (!session?.user) return false;

  const role = session.user.role as string;
  if (role === "SUPER_ADMIN") return true;

  const userId = session.user.id;
  const userPerms = await db.userPermission.findMany({
    where: { userId },
    include: { permission: { select: { name: true } } },
  });

  return userPerms.some((up) => up.permission.name === permission);
}

export async function requirePermission(permission: string) {
  const session = await auth();

  if (!session?.user) throw new UnauthorizedError();

  const role = session.user.role as string;
  if (role === "SUPER_ADMIN") return session;

  const userId = session.user.id;
  const userPerms = await db.userPermission.findMany({
    where: { userId },
    include: { permission: { select: { name: true } } },
  });

  const hasPermission = userPerms.some((up) => up.permission.name === permission);
  if (!hasPermission) {
    throw new ForbiddenError(`Missing permission: ${permission}`);
  }

  return session;
}
