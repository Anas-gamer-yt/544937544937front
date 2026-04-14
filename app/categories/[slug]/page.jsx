import Link from "next/link";
import { notFound } from "next/navigation";
import MasonryGrid from "@/components/MasonryGrid";
import ProductCard from "@/components/ProductCard";
import { getCategories, getProducts, getStoreSettings } from "@/lib/fetcher";
import { resolveSiteContent } from "@/lib/siteContent";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  return {
    title: slug.replace(/-/g, " ")
  };
}

export default async function CategoryDetailPage({ params, searchParams }) {
  const { slug } = await params;
  const resolvedSearchParams = await searchParams;
  const currentSort = resolvedSearchParams?.sort || "newest";
  const [categories, settings] = await Promise.all([
    getCategories(),
    getStoreSettings()
  ]);
  const content = resolveSiteContent(settings);
  const category = categories.find((item) => item.slug === slug);

  if (!category) {
    notFound();
  }

  const sortOptions = [
    { value: "newest", label: content.categorySortNewestLabel },
    { value: "price-asc", label: content.categorySortPriceAscLabel },
    { value: "price-desc", label: content.categorySortPriceDescLabel }
  ];

  const products = await getProducts({
    categorySlug: slug,
    sort: currentSort
  });

  return (
    <div>
      <section className="border-b border-white/10 bg-[linear-gradient(180deg,#0f172a_0%,#111c32_100%)] text-white">
        <div className="page-shell py-16 sm:py-20">
          <p className="section-kicker reveal-scroll">
            {content.categoryDetailEyebrow}
          </p>
          <h1 className="reveal-scroll reveal-scroll-delay-1 mt-5 font-display text-5xl leading-none sm:text-6xl">
            {category.name}
          </h1>
          <p className="reveal-scroll reveal-scroll-delay-2 mt-5 max-w-2xl text-base leading-8 text-white/72">
            {category.description ||
              content.categoryDetailFallbackCopy}
          </p>
          <div className="reveal-scroll reveal-scroll-delay-3 mt-8 inline-flex rounded-full border border-[#d4af37]/30 bg-[#d4af37]/10 px-4 py-2 text-sm font-semibold text-[#d4af37]">
            {products.length} product{products.length === 1 ? "" : "s"}
          </div>
        </div>
      </section>

      <section className="page-shell section-shell">
        <div className="reveal-scroll flex flex-wrap gap-3">
          {sortOptions.map((option) => {
            const active = currentSort === option.value;

            return (
              <Link
                key={option.value}
                href={`/categories/${slug}?sort=${option.value}`}
                className={`rounded-full px-4 py-2 text-sm font-semibold ${
                  active
                    ? "bg-[#2563eb] text-white shadow-[0_16px_32px_rgba(37,99,235,0.3)]"
                    : "border border-white/10 bg-white/5 text-[#cbd5f5] hover:text-white"
                }`}
              >
                {option.label}
              </Link>
            );
          })}
        </div>

        <MasonryGrid className="masonry-grid-products mt-10">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </MasonryGrid>

        {!products.length ? (
          <div className="reveal-scroll surface-card mt-8 p-8 text-center text-[#cbd5f5]">
            {content.categoryDetailEmptyCopy}
          </div>
        ) : null}
      </section>
    </div>
  );
}
