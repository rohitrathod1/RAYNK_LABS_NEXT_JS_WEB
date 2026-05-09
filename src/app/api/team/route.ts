import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requirePermission } from "@/middleware/permission";

function serializeMember(member: {
  id: string;
  displayName?: string;
  name?: string;
  role: string;
  bio: string | null;
  avatar?: string | null;
  image?: string | null;
  githubUrl?: string | null;
  github?: string | null;
  linkedinUrl?: string | null;
  linkedin?: string | null;
  instagramUrl?: string | null;
  youtubeUrl?: string | null;
  portfolioUrl?: string | null;
  isVisible?: boolean;
  isActive?: boolean;
  isFeatured?: boolean;
  sortOrder?: number;
  user?: { email: string; mobile?: string | null; portfolio?: string | null; status?: string } | null;
}) {
  return {
    id: member.id,
    displayName: member.displayName ?? member.name ?? "Team Member",
    role: member.role,
    bio: member.bio,
    avatar: member.avatar ?? member.image ?? null,
    githubUrl: member.githubUrl ?? member.github ?? null,
    linkedinUrl: member.linkedinUrl ?? member.linkedin ?? null,
    instagramUrl: member.instagramUrl,
    youtubeUrl: member.youtubeUrl,
    portfolioUrl: member.portfolioUrl ?? member.user?.portfolio ?? null,
    email: member.user?.email ?? null,
    phone: member.user?.mobile ?? null,
    isVisible: member.isVisible ?? member.isActive ?? true,
    isFeatured: member.isFeatured ?? false,
    sortOrder: member.sortOrder ?? 0,
    status: member.user?.status ?? null,
  };
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const showAll = url.searchParams.get("all") === "true";

    if (showAll) {
      await requirePermission("MANAGE_TEAM");
    }

    const sections = await db.teamPage.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
    });
    const data: Record<string, unknown> = {};
    for (const s of sections) data[s.section] = s.content;

    const teamMemberModel = db.teamMember as unknown as {
      findMany: (args: unknown) => Promise<Array<ReturnType<typeof serializeMember> & { createdAt?: Date | string }>>;
    };

    const teamMembers = await teamMemberModel.findMany({
      where: showAll ? undefined : { isVisible: true },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
      include: { user: { select: { email: true, mobile: true, portfolio: true, status: true } } },
    });
    const sortedMembers = teamMembers.sort((a, b) => {
      const order = (a.sortOrder ?? 0) - (b.sortOrder ?? 0);
      if (order !== 0) return order;
      return new Date(a.createdAt ?? 0).getTime() - new Date(b.createdAt ?? 0).getTime();
    });

    return NextResponse.json({
      success: true,
      data: { sections: data, teamMembers: sortedMembers.map(serializeMember) },
    });
  } catch (err) {
    const status = (err as { status?: number }).status ?? 500;
    const msg = err instanceof Error ? err.message : "Error";
    return NextResponse.json({ success: false, error: msg }, { status });
  }
}
