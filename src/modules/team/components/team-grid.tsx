import { TeamCard } from "./team-card";

export function TeamGrid({
  members,
}: {
  members: Array<{
    id: string;
    displayName: string;
    role: string;
    bio?: string;
    avatar?: string;
    linkedinUrl?: string;
    instagramUrl?: string;
    githubUrl?: string;
    youtubeUrl?: string;
    portfolioUrl?: string;
    email?: string;
    phone?: string;
  }>;
}) {
  if (members.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        No team members found.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {members.map((member) => (
        <TeamCard key={member.id} member={member} />
      ))}
    </div>
  );
}
