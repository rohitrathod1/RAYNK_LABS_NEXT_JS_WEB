import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requirePermission } from "@/middleware/permission";
import { teamMemberInputSchema } from "@/modules/team/validations";
import { revalidatePath } from "next/cache";
import type { TeamMember } from "@prisma/client";

type Params = { params: Promise<{ id: string }> };

const includePublicUser = {
  user: { select: { email: true, status: true, role: true } },
};

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

async function requireSuperAdminTeamManager() {
  const session = await requirePermission("MANAGE_TEAM");
  if (session.user.role !== "SUPER_ADMIN") {
    const error = new Error("Super admin access required") as Error & { status: number };
    error.status = 403;
    throw error;
  }
  return session;
}

function serialize(member: (TeamMember & {
  user?: { email: string; status: string; role: string } | null;
}) | null) {
  if (!member) return null;
  return {
    id: member.id,
    displayName: member.displayName,
    role: member.role,
    bio: member.bio,
    avatar: member.avatar,
    githubUrl: member.githubUrl,
    linkedinUrl: member.linkedinUrl,
    instagramUrl: member.instagramUrl,
    youtubeUrl: member.youtubeUrl,
    email: member.user?.email ?? null,
    status: member.user?.status ?? null,
    isVisible: member.isVisible,
    isFeatured: member.isFeatured,
    sortOrder: member.sortOrder,
    createdAt: member.createdAt,
    updatedAt: member.updatedAt,
  };
}

export async function GET(_req: Request, { params }: Params) {
  try {
    const { id } = await params;
    const member = await db.teamMember.findUnique({
      where: { id },
      include: includePublicUser,
    });

    if (!member || !member.isVisible) {
      return NextResponse.json({ success: false, error: "Team member not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: serialize(member) });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Error";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: Params) {
  try {
    await requireSuperAdminTeamManager();
    const { id } = await params;
    const parsed = teamMemberInputSchema.parse(await req.json());

    const updated = await withDbBusyRetry(() =>
      db.teamMember.update({
        where: { id },
        data: {
          displayName: parsed.displayName,
          role: parsed.role,
          bio: parsed.bio || null,
          avatar: parsed.avatar || null,
          githubUrl: parsed.githubUrl || null,
          linkedinUrl: parsed.linkedinUrl || null,
          instagramUrl: parsed.instagramUrl || null,
          youtubeUrl: parsed.youtubeUrl || null,
          isVisible: parsed.isVisible,
          isFeatured: parsed.isFeatured,
        },
      }),
    );

    revalidatePath("/team");
    revalidatePath("/admin/team");
    return NextResponse.json({ success: true, data: serialize(updated) });
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

export async function DELETE(_req: Request, { params }: Params) {
  try {
    await requireSuperAdminTeamManager();
    const { id } = await params;
    await db.teamMember.delete({ where: { id } });
    revalidatePath("/team");
    revalidatePath("/admin/team");
    return NextResponse.json({ success: true, data: {} });
  } catch (err) {
    const status = (err as { status?: number }).status ?? 500;
    const msg = err instanceof Error ? err.message : "Error";
    return NextResponse.json({ success: false, error: msg }, { status });
  }
}
