import TrackOrderClient from "@/components/TrackOrderClient";
import { getStoreSettings } from "@/lib/fetcher";
import { resolveSiteContent } from "@/lib/siteContent";

export const metadata = {
  title: "Track Order"
};

export default async function TrackOrderPage({ searchParams }) {
  const params = await searchParams;
  const settings = await getStoreSettings();

  return (
    <TrackOrderClient
      initialOrderId={params?.orderId || ""}
      siteContent={resolveSiteContent(settings)}
    />
  );
}
