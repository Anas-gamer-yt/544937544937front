import CheckoutForm from "@/components/CheckoutForm";
import { getPaymentMethods, getWhatsAppSettings } from "@/lib/fetcher";
import { resolveSiteContent } from "@/lib/siteContent";

export const metadata = {
  title: "Checkout"
};

export default async function CheckoutPage() {
  const [paymentMethods, whatsappSettings] = await Promise.all([
    getPaymentMethods(),
    getWhatsAppSettings()
  ]);

  return (
    <CheckoutForm
      paymentMethods={paymentMethods}
      whatsappNumber={whatsappSettings?.whatsappNumber}
      siteContent={resolveSiteContent(whatsappSettings)}
    />
  );
}
