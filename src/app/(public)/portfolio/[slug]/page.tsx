import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, GitFork } from "lucide-react";
import { Button } from "@/components/ui/button";
import { JsonLd } from "@/components/shared";
import { resolveImageSrc } from "@/lib/image-url";
import { getPortfolioProject, getPortfolioProjects } from "@/modules/portfolio/data/queries";

interface PortfolioDetailPageProps {
  params: Promise<{ slug: string }>;
}

export const revalidate = 60;

export async function generateStaticParams() {
  try {
    const projects = await getPortfolioProjects();
    return projects.map((project) => ({ slug: project.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: PortfolioDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await getPortfolioProject(slug);

  if (!project) {
    return {
      title: "Project Not Found | RaYnk Labs",
      robots: { index: false, follow: false },
    };
  }

  const title = `${project.title} Case Study | RaYnk Labs Portfolio`;
  const description =
    project.description ?? "Explore this RaYnk Labs project, including goals, execution, and technology choices.";
  const image = resolveImageSrc(project.image);

  return {
    title,
    description,
    alternates: {
      canonical: `/portfolio/${project.slug}`,
    },
    openGraph: {
      title,
      description,
      type: "article",
      url: `/portfolio/${project.slug}`,
      images: [{ url: image, alt: project.title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}

export default async function PortfolioDetailPage({ params }: PortfolioDetailPageProps) {
  const { slug } = await params;
  const [project, allProjects] = await Promise.all([
    getPortfolioProject(slug),
    getPortfolioProjects(),
  ]);

  if (!project || !project.isActive) notFound();

  const relatedProjects = allProjects
    .filter((item) => item.slug !== project.slug && item.category === project.category)
    .slice(0, 3);
  const image = resolveImageSrc(project.image);

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CreativeWork",
          name: project.title,
          description: project.description,
          image,
          url: `https://raynklabs.vercel.app/portfolio/${project.slug}`,
          creator: {
            "@type": "Organization",
            name: "RaYnk Labs",
          },
        }}
      />
      <main className="bg-background">
        <section id="section1-project-hero" className="scroll-mt-24 py-10 sm:py-14">
          <div className="section-container">
            <Button asChild variant="ghost" className="mb-6">
              <Link href="/portfolio">
                <ArrowLeft className="mr-2 h-4 w-4" aria-hidden="true" />
                Back to Portfolio
              </Link>
            </Button>
            <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
              <div className="space-y-5">
                <span className="inline-flex rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold text-primary">
                  {project.category}
                </span>
                <h1 className="text-4xl font-bold leading-tight sm:text-5xl md:text-6xl">
                  {project.title}
                </h1>
                {project.description && (
                  <p className="text-lg leading-relaxed text-muted-foreground">{project.description}</p>
                )}
                <div className="flex flex-wrap gap-3">
                  {project.liveUrl && (
                    <Button asChild>
                      <Link href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                        Live Preview
                        <ArrowUpRight className="ml-2 h-4 w-4" aria-hidden="true" />
                      </Link>
                    </Button>
                  )}
                  {project.githubUrl && (
                    <Button asChild variant="outline">
                      <Link href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                        <GitFork className="mr-2 h-4 w-4" aria-hidden="true" />
                        Source
                      </Link>
                    </Button>
                  )}
                </div>
              </div>
              <div className="relative aspect-[4/3] overflow-hidden rounded-xl border border-border shadow-2xl">
                <Image
                  src={image}
                  alt={project.title}
                  fill
                  priority
                  loading="eager"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        <section id="section2-project-overview" className="scroll-mt-24 bg-muted/30 py-16 sm:py-20">
          <div className="section-container grid gap-6 md:grid-cols-3">
            {[
              ["Problem", "Clarify the user journey, business goal, and conversion gaps before design work begins."],
              ["Solution", "Build a focused digital experience with scalable structure, strong visuals, and fast delivery."],
              ["Outcome", "Launch a maintainable project that can keep improving through content, SEO, and analytics."],
            ].map(([title, copy]) => (
              <article key={title} className="rounded-xl border border-border bg-card p-6 shadow-sm">
                <h2 className="text-xl font-semibold">{title}</h2>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{copy}</p>
              </article>
            ))}
          </div>
        </section>

        {relatedProjects.length > 0 && (
          <section id="section3-related-projects" className="scroll-mt-24 py-16 sm:py-20">
            <div className="section-container space-y-8">
              <div className="max-w-2xl">
                <p className="text-sm font-semibold uppercase tracking-widest text-primary">
                  Related projects
                </p>
                <h2 className="mt-3 text-3xl font-bold sm:text-4xl">More work in {project.category}</h2>
              </div>
              <div className="grid gap-6 md:grid-cols-3">
                {relatedProjects.map((item) => (
                  <Link
                    key={item.id}
                    href={`/portfolio/${item.slug}`}
                    className="group rounded-xl border border-border bg-card p-4 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
                  >
                    <div className="relative aspect-video overflow-hidden rounded-lg">
                      <Image
                        src={resolveImageSrc(item.image)}
                        alt={item.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <h3 className="mt-4 text-lg font-semibold group-hover:text-primary">{item.title}</h3>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
    </>
  );
}
