import CategoryCard from "@/components/CategoryCard";
import { getCategories, getStoreSettings } from "@/lib/fetcher";
import { resolveSiteContent } from "@/lib/siteContent";

export const metadata = {
  title: "Categories"
};

export default async function CategoriesPage() {
  const [categories, settings] = await Promise.all([
    getCategories(),
    getStoreSettings()
  ]);
  const content = resolveSiteContent(settings);

  return (
    <div className="page-shell section-shell">
      <div className="reveal-scroll max-w-3xl">
        <p className="section-kicker">{content.categoriesPageEyebrow}</p>
        <h1 className="mt-5 section-title">{content.categoriesPageTitle}</h1>
        <p className="mt-5 section-copy">{content.categoriesPageCopy}</p>
      </div>

      <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {categories.map((category, index) => (
          <CategoryCard
            key={category._id}
            category={category}
            className={`reveal-scroll reveal-scroll-delay-${index % 4}`}
          />
        ))}
      </div>
    </div>
  );
}
