import dynamic from "next/dynamic";
import type { ServicesPageData } from "../types";
import { ServiceHero } from "./hero";

const ServicesExperience = dynamic(
  () => import("./experience").then((mod) => mod.ServicesExperience),
  {
    loading: () => <div className="section-padding bg-background"><div className="section-container min-h-[960px] animate-pulse rounded-[2rem] border border-white/8 bg-white/[0.03]" /></div>,
  },
);

export function ServicesPageClient({ data }: { data: ServicesPageData }) {
  return (
    <>
      <ServiceHero {...data.hero} />
      <ServicesExperience data={data} />
    </>
  );
}
