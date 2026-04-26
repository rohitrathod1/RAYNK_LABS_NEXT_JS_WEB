// Auth guard for Server Actions and API Route Handlers.
// Call as the FIRST statement in every admin mutation.

import { auth } from "@/lib/auth";
import { ADMIN_ROLES, type AdminRole } from "@/lib/constants";

export class UnauthorizedError extends Error {
  status = 401;
  constructor() { super("Unauthorized"); }
}

export class ForbiddenError extends Error {
  status = 403;
  constructor(message = "Forbidden") { super(message); }
}

// Returns the session or throws. Pass "SUPER_ADMIN" to restrict.
export async function requireAdmin(requiredRole?: Extract<AdminRole, "SUPER_ADMIN">) {
  const session = await auth();

  if (!session?.user) throw new UnauthorizedError();

  const role = session.user.role as AdminRole;
  if (!ADMIN_ROLES.includes(role)) throw new ForbiddenError("Invalid role");

  if (requiredRole && role !== "SUPER_ADMIN") {
    throw new ForbiddenError("Super admin access required");
  }

  return session;
}
