import { Cormorant_Garamond, Manrope } from "next/font/google";
import "@/styles/globals.css";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import WhatsAppFloatingButton from "@/components/WhatsAppFloatingButton";
import { CartProvider } from "@/components/providers/CartProvider";
import { STORE_NAME } from "@/lib/constants";
import { getCategories, getStoreSettings } from "@/lib/fetcher";
import { resolveSiteContent } from "@/lib/siteContent";

const bodyFont = Manrope({
  subsets: ["latin"],
  variable: "--font-body"
});

const displayFont = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "500", "600", "700"]
});

export async function generateMetadata() {
  const settings = await getStoreSettings();
  const siteName = settings?.storeName || STORE_NAME;
  const siteContent = resolveSiteContent(settings);

  return {
    title: {
      default: siteName,
      template: `%s | ${siteName}`
    },
    description: siteContent.siteTagline
  };
}

export const viewport = {
  width: "device-width",
  initialScale: 1
};

export const dynamic = "force-dynamic";

export default async function RootLayout({ children }) {
  const [categories, storeSettings] = await Promise.all([
    getCategories(),
    getStoreSettings()
  ]);
  const siteContent = resolveSiteContent(storeSettings);

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${bodyFont.variable} ${displayFont.variable} font-body`}
      >
        <CartProvider>
          <div className="min-h-screen">
            <Navbar
              categories={categories}
              storeName={storeSettings?.storeName || STORE_NAME}
              siteContent={siteContent}
            />
            <main>{children}</main>
            <Footer
              categories={categories}
              storeName={storeSettings?.storeName || STORE_NAME}
              siteContent={siteContent}
            />
            <WhatsAppFloatingButton
              whatsappNumber={storeSettings?.whatsappNumber}
            />
          </div>
        </CartProvider>
      </body>
    </html>
  );
}
