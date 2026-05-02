import dynamic from "next/dynamic";
import type { WhyChooseSection } from "../types";

const Button = dynamic(() => import("@/components/ui/button").then((mod) => mod.Button));

export function WhyChoose({ title, subtitle, points }: WhyChooseSection) {
  return (
    <section className="py-16 px-4 bg-muted/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-3">{title}</h2>
          {subtitle && <p className="text-lg text-muted-foreground">{subtitle}</p>}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {points.map((point, i) => (
            <div key={i} className="p-6 border rounded-lg text-center bg-card">
              <div className="text-primary mb-4">
                <span className="text-3xl">{point.icon}</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">{point.title}</h3>
              <p className="text-muted-foreground">{point.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
