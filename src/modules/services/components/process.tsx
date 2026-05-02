import dynamic from "next/dynamic";
import type { ProcessSection } from "../types";

const Button = dynamic(() => import("@/components/ui/button").then((mod) => mod.Button));

export function Process({ title, subtitle, steps }: ProcessSection) {
  return (
    <section className="py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-3">{title}</h2>
          {subtitle && <p className="text-lg text-muted-foreground">{subtitle}</p>}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {steps.map((step, i) => (
            <div key={i} className="p-6 border rounded-lg text-center relative bg-card">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
                {step.step}
              </div>
              <div className="text-primary mt-4 mb-3">
                <span className="text-3xl">{step.icon}</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
              <p className="text-muted-foreground text-sm">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
