"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import type { FaqSection } from "../types";

export function FaqSection({ title, subtitle, items }: FaqSection) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="section-padding bg-muted/30">
      <div className="section-container max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">{title}</h2>
          {subtitle && <p className="text-lg text-muted-foreground">{subtitle}</p>}
        </div>

        <div className="space-y-4">
          {items.map((item, i) => (
            <div key={i} className="bg-card border rounded-lg overflow-hidden">
              <button
                type="button"
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-muted/50 transition-colors"
              >
                <span className="font-medium">{item.question}</span>
                <ChevronDown
                  className={`h-5 w-5 transition-transform ${openIndex === i ? "rotate-180" : ""}`}
                />
              </button>
              {openIndex === i && (
                <div className="px-4 pb-4 text-muted-foreground">
                  {item.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
