import Link from "next/link";
import {
  ArrowRight,
  Headphones,
  ShieldCheck,
  Sparkles,
  Star,
  Truck
} from "lucide-react";
import CategoryCard from "@/components/CategoryCard";
import MasonryGrid from "@/components/MasonryGrid";
import PaymentBadge from "@/components/PaymentBadge";
import ProductCard from "@/components/ProductCard";
import {
  DEFAULT_PRODUCT_IMAGE,
  STORE_NAME
} from "@/lib/constants";
import {
  getCategories,
  getPaymentMethods,
  getProducts,
  getStoreSettings
} from "@/lib/fetcher";
import { resolveSiteContent } from "@/lib/siteContent";

const pillarIcons = [Sparkles, ShieldCheck, Truck];
const promiseIcons = [Star, Headphones, ShieldCheck];

export default async function HomePage() {
  const [categories, featuredProducts, paymentMethods, storeSettings] = await Promise.all([
    getCategories(),
    getProducts({ featured: true, limit: 10 }),
    getPaymentMethods(),
    getStoreSettings()
  ]);
  const storeName = storeSettings?.storeName || STORE_NAME;
  const siteContent = resolveSiteContent(storeSettings);
  const heroStats = [
    {
      value: siteContent.heroStatOneValue,
      label: siteContent.heroStatOneLabel
    },
    {
      value: siteContent.heroStatTwoValue,
      label: siteContent.heroStatTwoLabel
    },
    {
      value: siteContent.heroStatThreeValue,
      label: siteContent.heroStatThreeLabel
    }
  ];
  const trustPillars = [
    {
      title: siteContent.trustPillarOneTitle,
      copy: siteContent.trustPillarOneCopy
    },
    {
      title: siteContent.trustPillarTwoTitle,
      copy: siteContent.trustPillarTwoCopy
    },
    {
      title: siteContent.trustPillarThreeTitle,
      copy: siteContent.trustPillarThreeCopy
    }
  ];
  const servicePromises = [
    {
      title: siteContent.promiseOneTitle,
      copy: siteContent.promiseOneCopy
    },
    {
      title: siteContent.promiseTwoTitle,
      copy: siteContent.promiseTwoCopy
    },
    {
      title: siteContent.promiseThreeTitle,
      copy: siteContent.promiseThreeCopy
    }
  ];

  const heroProducts = featuredProducts.slice(0, 2);

  return (
    <div>
      <section className="relative overflow-hidden bg-brand-primary text-white">
        <div className="grid-fade absolute inset-0 opacity-70" />
        <div className="page-shell relative grid gap-12 py-20 lg:grid-cols-[1.1fr_0.9fr] lg:py-28">
          <div className="max-w-2xl">
            <span className="eyebrow reveal-scroll">
              <span className="h-2 w-2 rounded-full bg-brand-secondary" />
              {siteContent.heroEyebrow}
            </span>
            <h1 className="reveal-scroll reveal-scroll-delay-1 mt-8 font-display text-5xl leading-none sm:text-7xl lg:text-[5.4rem]">
              {siteContent.heroTitlePrefix}{" "}
              <span className="text-brand-secondary">{storeName}</span>
            </h1>
            <p className="reveal-scroll reveal-scroll-delay-2 mt-6 max-w-xl text-base leading-8 text-white/78 sm:text-lg">
              {siteContent.heroDescription}
            </p>

            <div className="reveal-scroll reveal-scroll-delay-3 mt-10 flex flex-col gap-4 sm:flex-row">
              <Link href="/categories" className="button-primary gap-2">
                {siteContent.heroPrimaryCtaLabel}
                <ArrowRight size={16} />
              </Link>
              <Link href="/checkout" className="button-secondary">
                {siteContent.heroSecondaryCtaLabel}
              </Link>
            </div>

            <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {heroStats.map((item, index) => (
                <div
                  key={item.label}
                  className={`reveal-scroll reveal-scroll-delay-${index} rounded-[24px] border border-white/12 bg-white/8 p-5 backdrop-blur`}
                >
                  <p className="font-display text-4xl leading-none text-brand-secondary">
                    {item.value}
                  </p>
                  <p className="mt-3 text-sm leading-6 text-white/72">
                    {item.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative flex flex-col gap-6 lg:items-end lg:pt-8">
            <div className="absolute -left-6 top-10 hidden h-32 w-32 rounded-full bg-brand-secondary/20 blur-3xl lg:block" />
            <div className="absolute -right-6 bottom-0 hidden h-40 w-40 rounded-full bg-brand-cta/25 blur-3xl lg:block" />

            <div className="float-card reveal-scroll surface-card relative z-10 w-full max-w-[34rem] overflow-hidden bg-white/95 p-5 text-brand-text shadow-hero sm:p-6">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-secondary">
                    {siteContent.heroFeaturedEyebrow}
                  </p>
                  <h2 className="mt-2 font-display text-3xl text-brand-primary sm:text-4xl">
                    {siteContent.heroFeaturedTitle}
                  </h2>
                </div>
                <div className="rounded-full bg-brand-background px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-brand-primary">
                  {paymentMethods.length} {siteContent.heroPaymentMethodsLabel}
                </div>
              </div>

              <div className="mt-8 space-y-4">
                {heroProducts.length ? (
                  heroProducts.map((product) => (
                    <div
                      key={product._id}
                      className="flex items-center gap-3 rounded-[24px] bg-brand-background p-3 sm:gap-4 sm:p-4"
                    >
                      <div className="h-20 w-20 overflow-hidden rounded-[20px] bg-white sm:h-24 sm:w-24">
                        <img
                          src={product.images?.[0] || DEFAULT_PRODUCT_IMAGE}
                          alt={product.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-secondary">
                          {product.category?.name || "Collection"}
                        </p>
                        <p className="mt-2 text-base font-semibold text-brand-primary sm:text-lg">
                          {product.name}
                        </p>
                        <p className="mt-2 line-clamp-2 text-xs leading-5 text-brand-muted sm:text-sm sm:leading-6">
                          {product.shortDescription || product.description}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="rounded-[24px] bg-brand-background p-6 text-sm text-brand-muted">
                    Featured products will appear here once the backend catalog is
                    connected.
                  </div>
                )}
              </div>

              <div className="mt-8 flex flex-wrap gap-2">
                {paymentMethods.map((method) => (
                  <PaymentBadge key={method._id}>{method.name}</PaymentBadge>
                ))}
              </div>
            </div>

            <div className="float-card-delay reveal-scroll reveal-scroll-delay-2 surface-card relative z-10 w-full max-w-sm bg-white/92 p-5 text-brand-text lg:mr-10">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-secondary">
                {siteContent.heroCheckoutPathEyebrow}
              </p>
              <p className="mt-3 text-lg font-semibold text-brand-primary">
                {siteContent.heroCheckoutPathTitle}
              </p>
              <p className="mt-3 text-sm leading-6 text-brand-muted">
                {siteContent.heroCheckoutPathCopy}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section-shell">
        <div className="page-shell">
          <div className="reveal-scroll flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="section-kicker">{siteContent.categoriesSectionEyebrow}</p>
              <h2 className="mt-5 section-title">{siteContent.categoriesSectionTitle}</h2>
              <p className="mt-5 section-copy">
                {siteContent.categoriesSectionCopy}
              </p>
            </div>
            <Link
              href="/categories"
              className="inline-flex items-center gap-2 text-sm font-semibold text-brand-primary hover:text-brand-secondary"
            >
              {siteContent.categoriesSectionLinkLabel}
              <ArrowRight size={16} />
            </Link>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {categories.slice(0, 8).map((category, index) => (
              <CategoryCard
                key={category._id}
                category={category}
                className={`reveal-scroll reveal-scroll-delay-${index % 4}`}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="section-shell bg-white">
        <div className="page-shell">
          <div className="reveal-scroll max-w-3xl">
            <p className="section-kicker">{siteContent.featuredSectionEyebrow}</p>
            <h2 className="mt-5 section-title">{siteContent.featuredSectionTitle}</h2>
            <p className="mt-5 section-copy">
              {siteContent.featuredSectionCopy}
            </p>
          </div>

          <MasonryGrid className="masonry-grid-products mt-12">
            {featuredProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </MasonryGrid>

          <div className="mt-10 flex justify-center">
            <Link href="/categories" className="button-secondary gap-2 reveal-scroll">
              Browse full catalog
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      <section className="section-shell">
        <div className="page-shell grid gap-6 lg:grid-cols-3">
          {trustPillars.map((pillar, index) => {
            const Icon = pillarIcons[index];

            return (
              <article
                key={pillar.title}
                className={`reveal-scroll reveal-scroll-delay-${index} surface-card p-8`}
              >
                <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-brand-secondary/12 text-brand-secondary">
                  <Icon size={24} />
                </span>
                <h3 className="mt-6 text-2xl font-semibold text-brand-primary">
                  {pillar.title}
                </h3>
                <p className="mt-4 text-sm leading-7 text-brand-muted">
                  {pillar.copy}
                </p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="section-shell bg-brand-primary text-white">
        <div className="page-shell grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="reveal-scroll">
            <p className="section-kicker !text-brand-secondary">
              {siteContent.whyBuyEyebrow}
            </p>
            <h2 className="mt-5 font-display text-5xl leading-none sm:text-6xl">
              {siteContent.whyBuyTitle}
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {servicePromises.map((item, index) => {
              const Icon = promiseIcons[index];

              return (
                <article
                  key={item.title}
                  className={`reveal-scroll reveal-scroll-delay-${index} rounded-[28px] border border-white/12 bg-white/8 p-6 backdrop-blur`}
                >
                  <Icon size={22} className="text-brand-secondary" />
                  <h3 className="mt-5 text-xl font-semibold">{item.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-white/72">
                    {item.copy}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
