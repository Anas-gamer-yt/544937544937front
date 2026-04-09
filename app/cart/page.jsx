import CartPageClient from "@/components/CartPageClient";
import { getStoreSettings } from "@/lib/fetcher";
import { resolveSiteContent } from "@/lib/siteContent";

export const metadata = {
  title: "Cart"
};

export default async function CartPage() {
  const settings = await getStoreSettings();

  return <CartPageClient siteContent={resolveSiteContent(settings)} />;
}
