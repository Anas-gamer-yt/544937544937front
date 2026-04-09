import OrderManagerClient from "@/components/OrderManagerClient";
import { getStoreSettings } from "@/lib/fetcher";
import { resolveSiteContent } from "@/lib/siteContent";

export const metadata = {
  title: "Manage Order"
};

export default async function ManageOrderPage({ searchParams }) {
  const params = await searchParams;
  const settings = await getStoreSettings();

  return (
    <OrderManagerClient
      initialOrderId={params?.orderId || ""}
      initialPhone={params?.phone || ""}
      siteContent={resolveSiteContent(settings)}
    />
  );
}
