import CategoryCard from "@/components/CategoryCard";
import MasonryGrid from "@/components/MasonryGrid";
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
        <h1 className="mt-4 text-[2.35rem] font-display leading-[1.02] text-white sm:mt-5 sm:text-5xl lg:text-6xl">
          {content.categoriesPageTitle}
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-8 text-[#cbd5f5] sm:mt-5 sm:text-lg">
          {content.categoriesPageCopy}
        </p>
      </div>

      <MasonryGrid className="masonry-grid-categories mt-10 sm:mt-12">
        {categories.map((category) => (
          <CategoryCard key={category._id} category={category} />
        ))}
      </MasonryGrid>
    </div>
  );
}
