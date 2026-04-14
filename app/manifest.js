import { STORE_NAME } from "@/lib/constants";
import { getStoreSettings } from "@/lib/fetcher";
import { resolveSiteContent } from "@/lib/siteContent";

export default async function manifest() {
  const settings = await getStoreSettings();
  const siteName = settings?.storeName || STORE_NAME;
  const siteContent = resolveSiteContent(settings);

  return {
    name: siteName,
    short_name: siteName,
    description: siteContent.heroDescription || siteContent.siteTagline,
    start_url: "/",
    display: "standalone",
    background_color: "#0f172a",
    theme_color: "#0f172a",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any"
      }
    ]
  };
}
