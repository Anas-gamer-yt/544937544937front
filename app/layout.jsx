import { Inter, Playfair_Display } from "next/font/google";
import "@/styles/globals.css";
import Footer from "@/components/Footer";
import MobileStoreBar from "@/components/MobileStoreBar";
import Navbar from "@/components/Navbar";
import ScrollRevealController from "@/components/ScrollRevealController";
import WhatsAppFloatingButton from "@/components/WhatsAppFloatingButton";
import { CartProvider } from "@/components/providers/CartProvider";
import { STORE_NAME } from "@/lib/constants";
import { getCategories, getStoreSettings } from "@/lib/fetcher";
import { getSiteUrl } from "@/lib/siteMetadata";
import { resolveSiteContent } from "@/lib/siteContent";

const bodyFont = Inter({
  subsets: ["latin"],
  variable: "--font-body"
});

const displayFont = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["600", "700"]
});

export async function generateMetadata() {
  const settings = await getStoreSettings();
  const siteName = settings?.storeName || STORE_NAME;
  const siteContent = resolveSiteContent(settings);
  const siteUrl = getSiteUrl();
  const description = siteContent.heroDescription || siteContent.siteTagline;

  return {
    metadataBase: siteUrl,
    applicationName: siteName,
    title: {
      default: siteName,
      template: `%s | ${siteName}`
    },
    description,
    alternates: {
      canonical: "/"
    },
    manifest: "/manifest.webmanifest",
    icons: {
      icon: "/icon.svg",
      shortcut: "/icon.svg",
      apple: "/icon.svg"
    },
    openGraph: {
      type: "website",
      locale: "en_PK",
      url: "/",
      siteName,
      title: siteName,
      description
    },
    twitter: {
      card: "summary_large_image",
      title: siteName,
      description
    }
  };
}

export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#0f172a"
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
          <div className="min-h-screen pb-24 md:pb-0">
            <ScrollRevealController />
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
              whatsappNumber={storeSettings?.whatsappNumber}
            />
            <MobileStoreBar />
            <WhatsAppFloatingButton
              whatsappNumber={storeSettings?.whatsappNumber}
            />
          </div>
        </CartProvider>
      </body>
    </html>
  );
}
