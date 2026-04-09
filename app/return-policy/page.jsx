import PolicyPage from "@/components/PolicyPage";
import { getStoreSettings } from "@/lib/fetcher";
import { resolveSiteContent } from "@/lib/siteContent";

export const metadata = {
  title: "Return Policy"
};

export default async function ReturnPolicyPage() {
  const settings = await getStoreSettings();
  const content = resolveSiteContent(settings);

  return (
    <PolicyPage
      siteContent={content}
      eyebrow={content.returnPolicyPageEyebrow}
      title={content.returnPolicyPageTitle}
      intro={content.returnPolicyPageIntro}
      body={content.returnPolicyPageBody}
    />
  );
}
