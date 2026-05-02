"use client";

import type { Session } from "next-auth";

export function hasPermission(
  session: Session | null,
  permission: string
): boolean {
  if (!session?.user) return false;
  const role = session.user.role as string;
  if (role === "SUPER_ADMIN") return true;
  const perms = (session.user.permissions as string[]) || [];
  return perms.includes(permission);
}
