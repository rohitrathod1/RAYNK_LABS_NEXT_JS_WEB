import { MapPin, Phone, Mail, Clock } from "lucide-react";
import type { ContactInfoSection } from "../types";

const ICON_MAP: Record<string, React.ElementType> = {
  MapPin,
  Phone,
  Mail,
  Clock,
};

export function InfoSection({ title, subtitle, items, workingHours }: ContactInfoSection) {
  return (
    <section className="section-padding bg-background">
      <div className="section-container">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">{title}</h2>
          {subtitle && <p className="text-lg text-muted-foreground">{subtitle}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {items.map((item, i) => {
            const Icon = ICON_MAP[item.icon] ?? MapPin;
            return (
              <div key={i} className="text-center p-6 rounded-lg border bg-card">
                <Icon className="h-8 w-8 mx-auto mb-4 text-primary" />
                <h3 className="font-semibold mb-2">{item.label}</h3>
                <p className="text-muted-foreground">{item.value}</p>
              </div>
            );
          })}
        </div>

        {workingHours && (
          <p className="text-center text-muted-foreground">
            <Clock className="inline h-4 w-4 mr-2" />
            {workingHours}
          </p>
        )}
      </div>
    </section>
  );
}
