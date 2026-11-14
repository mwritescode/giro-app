import { DiscoveryPage } from "@/components/DiscoveryPage";
import { normalizeParams, type RawParams } from "@/lib/params";

export default async function MilanoPage({ searchParams }: { searchParams: Promise<RawParams> }) {
  const params = normalizeParams(await searchParams);
  return <DiscoveryPage citySlug="milano" params={params} />;
}
