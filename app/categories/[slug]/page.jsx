import Link from "next/link";
import { notFound } from "next/navigation";
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
      <section className="bg-brand-primary text-white">
        <div className="page-shell py-16 sm:py-20">
          <p className="section-kicker reveal-scroll !text-brand-secondary">
            {content.categoryDetailEyebrow}
          </p>
          <h1 className="reveal-scroll reveal-scroll-delay-1 mt-5 font-display text-5xl leading-none sm:text-6xl">
            {category.name}
          </h1>
          <p className="reveal-scroll reveal-scroll-delay-2 mt-5 max-w-2xl text-base leading-8 text-white/72">
            {category.description ||
              content.categoryDetailFallbackCopy}
          </p>
          <div className="reveal-scroll reveal-scroll-delay-3 mt-8 inline-flex rounded-full bg-brand-secondary/12 px-4 py-2 text-sm font-semibold text-brand-secondary">
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
                    ? "bg-brand-secondary text-white"
                    : "border border-brand-border bg-white text-brand-muted hover:text-brand-secondary"
                }`}
              >
                {option.label}
              </Link>
            );
          })}
        </div>

        <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
          {products.map((product, index) => (
            <div
              key={product._id}
              className={`reveal-scroll reveal-scroll-delay-${index % 4}`}
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>

        {!products.length ? (
          <div className="reveal-scroll surface-card mt-8 p-8 text-center text-brand-muted">
            {content.categoryDetailEmptyCopy}
          </div>
        ) : null}
      </section>
    </div>
  );
}
