import type { Metadata } from "next";
import { DiscoveryPage } from "@/components/DiscoveryPage";
import { normalizeParams, type RawParams } from "@/lib/params";

export const metadata: Metadata = {
  title: "Esperienze per bambini a Firenze",
  description:
    "Laboratori, musei e natura da vivere con i bambini a Firenze. Filtra per data, età, prezzo e interesse.",
  alternates: { canonical: "/firenze" },
  openGraph: {
    title: "Esperienze per bambini a Firenze",
    description:
      "Laboratori, musei e natura da vivere con i bambini a Firenze. Filtra per data, età, prezzo e interesse.",
    url: "/firenze",
    images: [{ url: "/images/science.png", alt: "giro." }],
  },
};

export default async function FirenzePage({ searchParams }: { searchParams: Promise<RawParams> }) {
  const params = normalizeParams(await searchParams);
  return <DiscoveryPage citySlug="firenze" params={params} />;
}
