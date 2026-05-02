import dynamic from "next/dynamic";
import type { ServiceCard } from "../types";

const Button = dynamic(() => import("@/components/ui/button").then((mod) => mod.Button));

export function ServicesGrid({ services }: { services: ServiceCard[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {services.map((service, i) => (
        <div key={i} className="p-6 border rounded-lg hover:shadow-lg transition-shadow bg-card">
          <div className="text-primary mb-4">
            <span className="text-3xl">{service.icon}</span>
          </div>
          <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
          <p className="text-muted-foreground mb-4">{service.description}</p>
          <Button variant="outline" asChild>
            <a href={service.ctaHref}>{service.ctaText}</a>
          </Button>
        </div>
      ))}
    </div>
  );
}
