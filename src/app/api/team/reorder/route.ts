import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requirePermission } from "@/middleware/permission";

async function requireSuperAdminTeamManager() {
  const session = await requirePermission("MANAGE_TEAM");
  if (session.user.role !== "SUPER_ADMIN") {
    const error = new Error("Super admin access required") as Error & { status: number };
    error.status = 403;
    throw error;
  }
}

function isTransactionStartTimeout(error: unknown) {
  return error instanceof Error && error.message.includes("Unable to start a transaction");
}

async function withDbBusyRetry<T>(operation: () => Promise<T>) {
  let lastError: unknown;
  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      if (!isTransactionStartTimeout(error) || attempt === 2) break;
      await new Promise((resolve) => setTimeout(resolve, 200 * (attempt + 1)));
    }
  }
  throw lastError;
}

export async function POST(req: Request) {
  try {
    await requireSuperAdminTeamManager();
    const body = (await req.json()) as { ids?: unknown };
    const ids = Array.isArray(body.ids) ? body.ids.filter((id): id is string => typeof id === "string") : [];

    if (ids.length === 0) {
      return NextResponse.json({ success: false, error: "Team member order is required" }, { status: 400 });
    }

    for (const [index, id] of ids.entries()) {
      await withDbBusyRetry(() =>
        db.teamMember.update({
          where: { id },
          data: { sortOrder: index },
          select: { id: true },
        }),
      );
    }

    revalidatePath("/team");
    revalidatePath("/admin/team");
    return NextResponse.json({ success: true, data: { ids } });
  } catch (err) {
    const status = (err as { status?: number }).status ?? 500;
    const msg = isTransactionStartTimeout(err)
      ? "Database is busy. Please try again."
      : err instanceof Error
        ? err.message
        : "Error";
    return NextResponse.json({ success: false, error: msg }, { status });
  }
}
