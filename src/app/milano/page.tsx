import type { Metadata } from "next";
import { DiscoveryPage } from "@/components/DiscoveryPage";
import { normalizeParams, type RawParams } from "@/lib/params";

export const metadata: Metadata = {
  title: "Esperienze per bambini a Milano",
  description:
    "Laboratori, musei e natura da vivere con i bambini a Milano. Filtra per data, età, prezzo e interesse.",
  alternates: { canonical: "/milano" },
  openGraph: {
    title: "Esperienze per bambini a Milano",
    description:
      "Laboratori, musei e natura da vivere con i bambini a Milano. Filtra per data, età, prezzo e interesse.",
    url: "/milano",
    images: [{ url: "/images/science.png", alt: "giro." }],
  },
};

export default async function MilanoPage({ searchParams }: { searchParams: Promise<RawParams> }) {
  const params = normalizeParams(await searchParams);
  return <DiscoveryPage citySlug="milano" params={params} />;
}
