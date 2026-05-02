import { SafeImage } from "@/components/common/safe-image";
import { ExternalLink } from "lucide-react";

export function TeamCard({ member }: { member: { name: string; role: string; bio?: string; image: string; linkedin?: string; twitter?: string; github?: string; portfolio?: string } }) {
  return (
    <div className="bg-background rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative h-64">
        <SafeImage
          src={member.image}
          alt={member.name}
          fill
          sizes="(min-width: 768px) 33vw, 100vw"
          className="object-cover"
        />
      </div>
      <div className="p-5 space-y-3">
        <div>
          <h3 className="text-xl font-semibold">{member.name}</h3>
          <p className="text-primary text-sm font-medium">{member.role}</p>
        </div>
        {member.bio && (
          <p className="text-sm text-muted-foreground line-clamp-3">{member.bio}</p>
        )}
        <div className="flex items-center gap-3">
          {member.linkedin && (
            <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary" title="LinkedIn">
              <ExternalLink className="w-5 h-5" />
            </a>
          )}
          {member.twitter && (
            <a href={member.twitter} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary" title="Twitter">
              <ExternalLink className="w-5 h-5" />
            </a>
          )}
          {member.github && (
            <a href={member.github} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary" title="GitHub">
              <ExternalLink className="w-5 h-5" />
            </a>
          )}
          {member.portfolio && (
            <a href={member.portfolio} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary" title="Portfolio">
              <ExternalLink className="w-5 h-5" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
