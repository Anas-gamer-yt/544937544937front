import { getSiteUrl } from "@/lib/siteMetadata";

export default function robots() {
  const siteUrl = getSiteUrl();

  return {
    rules: {
      userAgent: "*",
      allow: "/"
    },
    sitemap: siteUrl ? `${siteUrl.origin}/sitemap.xml` : undefined,
    host: siteUrl?.origin
  };
}
