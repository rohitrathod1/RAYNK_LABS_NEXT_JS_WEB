"use client";

import { useMemo, useState } from "react";
import type { ServicesPageData } from "../types";
import { Categories } from "./categories";
import { ContactCta } from "./cta";
import { Process } from "./process";
import { ServiceInquiryDialog } from "./service-inquiry-dialog";
import { WhyChoose } from "./why";

export function ServicesExperience({ data }: { data: ServicesPageData }) {
  const [selectedService, setSelectedService] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);

  function openServiceDialog(serviceName: string) {
    setSelectedService(serviceName);
    setDialogOpen(true);
  }

  const primaryService = useMemo(() => data.contact_cta.primaryService || "Project Inquiry", [data.contact_cta.primaryService]);
  const secondaryService = useMemo(() => data.contact_cta.secondaryService || "Strategy Consultation", [data.contact_cta.secondaryService]);

  return (
    <>
      <Categories categories={data.categories} services={data.services_list.services} onSelectService={openServiceDialog} />
      <WhyChoose {...data.why_choose_service} />
      <Process {...data.process} />
      <ContactCta {...data.contact_cta} onPrimaryAction={() => openServiceDialog(primaryService)} onSecondaryAction={() => openServiceDialog(secondaryService)} />
      <ServiceInquiryDialog open={dialogOpen} onOpenChange={setDialogOpen} serviceName={selectedService} />
    </>
  );
}
