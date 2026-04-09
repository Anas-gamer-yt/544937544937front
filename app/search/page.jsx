import ProductCard from "@/components/ProductCard";
import SearchBar from "@/components/SearchBar";
import { getProducts, getStoreSettings } from "@/lib/fetcher";
import { resolveSiteContent } from "@/lib/siteContent";

export const metadata = {
  title: "Search"
};

export default async function SearchPage({ searchParams }) {
  const resolvedSearchParams = await searchParams;
  const query = String(resolvedSearchParams?.q || "").trim();
  const [settings, products] = await Promise.all([
    getStoreSettings(),
    query ? getProducts({ search: query, limit: 24 }) : Promise.resolve([])
  ]);
  const content = resolveSiteContent(settings);

  return (
    <div className="page-shell section-shell">
      <div className="max-w-4xl">
        <p className="section-kicker">{content.searchPageEyebrow}</p>
        <h1 className="mt-5 section-title">{content.searchPageTitle}</h1>
        <p className="mt-5 section-copy">{content.searchPageCopy}</p>
        <div className="mt-8 max-w-2xl">
          <SearchBar
            initialQuery={query}
            placeholder={content.searchPlaceholder}
            buttonLabel={content.searchButtonLabel}
            className="w-full"
          />
        </div>
      </div>

      {query ? (
        <div className="mt-10">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-secondary">
            {products.length} {content.searchResultsLabel}
          </p>

          {products.length ? (
            <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          ) : (
            <div className="surface-card mt-6 p-8 text-center">
              <h2 className="text-2xl font-semibold text-brand-primary">
                {content.searchEmptyTitle}
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-brand-muted">
                {content.searchEmptyCopy}
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="surface-card mt-10 p-8 text-center">
          <h2 className="text-2xl font-semibold text-brand-primary">
            {content.searchStartTitle}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-brand-muted">
            {content.searchStartCopy}
          </p>
        </div>
      )}
    </div>
  );
}
