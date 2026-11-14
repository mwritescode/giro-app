import { DiscoveryPage } from "@/components/DiscoveryPage";
import { normalizeParams, type RawParams } from "@/lib/params";

export default async function FirenzePage({ searchParams }: { searchParams: Promise<RawParams> }) {
  const params = normalizeParams(await searchParams);
  return <DiscoveryPage citySlug="firenze" params={params} />;
}
