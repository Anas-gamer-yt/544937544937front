import OrderSuccessClient from "@/components/OrderSuccessClient";
import { getStoreSettings } from "@/lib/fetcher";
import { resolveSiteContent } from "@/lib/siteContent";

export const metadata = {
  title: "Order Success"
};

export default async function OrderSuccessPage({ searchParams }) {
  const params = await searchParams;
  const settings = await getStoreSettings();

  return (
    <OrderSuccessClient
      orderId={params?.orderId}
      payment={params?.payment}
      total={params?.total}
      wa={params?.wa}
      name={params?.name}
      phone={params?.phone}
      siteContent={resolveSiteContent(settings)}
    />
  );
}
