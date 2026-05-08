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
  isVisible?: boolean;
  isActive?: boolean;
  isFeatured?: boolean;
  user?: { email: string; status?: string } | null;
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
    email: member.user?.email ?? null,
    isVisible: member.isVisible ?? member.isActive ?? true,
    isFeatured: member.isFeatured ?? false,
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

    let teamMembers: Array<ReturnType<typeof serializeMember> & { createdAt?: Date | string }>;
    try {
      teamMembers = await teamMemberModel.findMany({
        where: showAll ? undefined : { isVisible: true },
        orderBy: { createdAt: "asc" },
        include: { user: { select: { email: true, status: true } } },
      });
    } catch {
      teamMembers = await teamMemberModel.findMany({
        where: showAll ? undefined : { isActive: true },
        orderBy: { createdAt: "asc" },
      });
    }
    const sortedMembers = teamMembers.sort((a, b) => {
      const featured = Number(Boolean(b.isFeatured)) - Number(Boolean(a.isFeatured));
      if (featured !== 0) return featured;
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
