import PolicyPage from "@/components/PolicyPage";
import { getStoreSettings } from "@/lib/fetcher";
import { resolveSiteContent } from "@/lib/siteContent";

export const metadata = {
  title: "Terms & Conditions"
};

export default async function TermsAndConditionsPage() {
  const settings = await getStoreSettings();
  const content = resolveSiteContent(settings);

  return (
    <PolicyPage
      siteContent={content}
      eyebrow={content.termsPageEyebrow}
      title={content.termsPageTitle}
      intro={content.termsPageIntro}
      body={content.termsPageBody}
    />
  );
}
