import { SafeImage } from "@/components/common/safe-image";
import Link from "next/link";

export function TeamSection({ data }: { data: { title: string; subtitle: string; members: Array<{ name: string; role: string; image: string; portfolioUrl?: string }> } }) {
  return (
    <section className="section-padding bg-muted/30">
      <div className="section-container">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">{data.title}</h2>
          {data.subtitle && <p className="text-lg text-muted-foreground">{data.subtitle}</p>}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {data.members.map((member, i) => (
            <div key={i} className="bg-background rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group">
              <div className="relative h-64 w-full">
                <SafeImage
                  src={member.image}
                  alt={member.name}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-6 text-center">
                <h3 className="text-xl font-semibold">{member.name}</h3>
                <p className="text-muted-foreground text-sm mt-1">{member.role}</p>
                {member.portfolioUrl && (
                  <Link
                    href={member.portfolioUrl}
                    className="inline-block mt-3 text-sm text-primary hover:underline"
                  >
                    View Portfolio →
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
