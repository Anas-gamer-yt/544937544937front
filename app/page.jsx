import Link from "next/link";
import {
  ArrowRight,
  Clock3,
  PackageCheck,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Star,
  Truck,
  Users,
  Wallet
} from "lucide-react";
import CategoryCard from "@/components/CategoryCard";
import MasonryGrid from "@/components/MasonryGrid";
import ProductCard from "@/components/ProductCard";
import { DEFAULT_PRODUCT_IMAGE, STORE_NAME } from "@/lib/constants";
import {
  getCategories,
  getPaymentMethods,
  getProducts,
  getStoreSettings
} from "@/lib/fetcher";
import { resolveSiteContent } from "@/lib/siteContent";

const trustBadgeIcons = [Wallet, Truck, Users, RefreshCw];
const whyChooseIcons = [ShieldCheck, Sparkles, PackageCheck, Clock3];

export default async function HomePage() {
  const [categories, featuredProducts, paymentMethods, storeSettings] = await Promise.all([
    getCategories(),
    getProducts({ featured: true, limit: 10 }),
    getPaymentMethods(),
    getStoreSettings()
  ]);

  const storeName = storeSettings?.storeName || STORE_NAME;
  const siteContent = resolveSiteContent(storeSettings);
  const heroBadges = [
    siteContent.heroTrustBadgeOne,
    siteContent.heroTrustBadgeTwo,
    siteContent.heroTrustBadgeThree,
    siteContent.heroTrustBadgeFour
  ].filter(Boolean);
  const whyChooseItems = [
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
    },
    {
      title: siteContent.promiseFourTitle,
      copy: siteContent.promiseFourCopy
    }
  ].filter((item) => item.title && item.copy);
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
    },
    {
      title: siteContent.trustPillarFourTitle,
      copy: siteContent.trustPillarFourCopy
    }
  ].filter((item) => item.title && item.copy);
  const proofStats = [
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
    },
    {
      value: String(paymentMethods.length),
      label: `Active ${siteContent.heroPaymentMethodsLabel} visible before checkout`
    }
  ].filter((item) => item.value && item.label);
  const testimonials = [
    {
      name: siteContent.testimonialOneName,
      quote: siteContent.testimonialOneQuote
    },
    {
      name: siteContent.testimonialTwoName,
      quote: siteContent.testimonialTwoQuote
    },
    {
      name: siteContent.testimonialThreeName,
      quote: siteContent.testimonialThreeQuote
    }
  ].filter((item) => item.name && item.quote);
  const featuredCategoryChips = categories.slice(0, 6);
  const heroPrimaryProduct = featuredProducts[0];
  const heroSecondaryProduct = featuredProducts[1];

  return (
    <div className="overflow-hidden bg-[#0b1120] text-white">
      <section className="relative isolate overflow-hidden border-b border-white/10 bg-[#0f172a]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(212,175,55,0.2),transparent_30%),radial-gradient(circle_at_top_right,rgba(37,99,235,0.2),transparent_28%),linear-gradient(180deg,rgba(15,23,42,0.95),rgba(8,16,31,1))]" />
        <div className="absolute inset-0 opacity-30 [background-image:linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] [background-size:72px_72px]" />

        <div className="page-shell relative grid gap-8 py-10 sm:gap-10 sm:py-16 lg:min-h-[calc(100svh-5rem)] lg:grid-cols-[minmax(0,1.02fr)_minmax(0,0.98fr)] lg:items-center lg:gap-14 lg:py-20">
          <div className="max-w-2xl">
            <p className="reveal-scroll text-sm font-semibold uppercase tracking-[0.28em] text-[#d4af37]">
              {siteContent.heroEyebrow}
            </p>

            <h1 className="reveal-scroll reveal-scroll-delay-1 mt-4 font-display text-[3.2rem] leading-[0.94] text-white sm:mt-6 sm:text-6xl lg:text-[5.5rem]">
              {storeName}
            </h1>

            <p className="reveal-scroll reveal-scroll-delay-2 mt-4 max-w-xl text-[1.55rem] font-medium text-[#e2e8f0] sm:mt-6 sm:text-2xl">
              {siteContent.siteTagline}
            </p>

            <p className="reveal-scroll reveal-scroll-delay-3 mt-4 max-w-xl text-sm leading-7 text-[#cbd5f5] sm:mt-6 sm:text-lg">
              {siteContent.heroDescription}
            </p>

            <div className="reveal-scroll reveal-scroll-delay-3 mt-7 flex flex-col gap-3 sm:mt-10 sm:gap-4 sm:flex-row">
              <Link href="/#featured" className="button-primary gap-2">
                {siteContent.heroPrimaryCtaLabel}
                <ArrowRight size={17} />
              </Link>
              <Link href="/categories" className="button-secondary">
                {siteContent.heroSecondaryCtaLabel}
              </Link>
            </div>

            <div className="mt-7 grid gap-2.5 sm:mt-10 sm:gap-3 sm:grid-cols-2">
              {heroBadges.map((badge, index) => {
                const Icon = trustBadgeIcons[index] || ShieldCheck;

                return (
                  <div
                    key={badge}
                    className={`glass-panel reveal-scroll reveal-scroll-delay-${index % 4} inline-flex items-start gap-3 rounded-[18px] px-3.5 py-3 text-[0.82rem] text-[#e2e8f0] sm:rounded-[22px] sm:px-4 sm:py-4 sm:text-sm`}
                  >
                    <span className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#d4af37]/15 text-[#d4af37] sm:h-9 sm:w-9">
                      <Icon size={15} />
                    </span>
                    <span className="leading-6">{badge}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="relative">
            <div className="reveal-scroll relative mx-auto max-w-[42rem]">
              <div className="absolute -left-8 top-10 hidden h-36 w-36 rounded-full bg-[#d4af37]/20 blur-3xl sm:block" />
              <div className="absolute -right-10 bottom-12 hidden h-40 w-40 rounded-full bg-[#2563eb]/25 blur-3xl sm:block" />

              <div className="glass-panel overflow-hidden rounded-[26px] p-2.5 shadow-[0_40px_90px_rgba(2,8,23,0.48)] sm:rounded-[34px] sm:p-3">
                <div className="relative overflow-hidden rounded-[22px] border border-white/12 bg-[#111c32] sm:rounded-[28px]">
                  <img
                    src={
                      heroPrimaryProduct?.images?.[0] ||
                      categories[0]?.image ||
                      DEFAULT_PRODUCT_IMAGE
                    }
                    alt={heroPrimaryProduct?.name || storeName}
                    className="h-[17rem] w-full object-cover sm:h-[32rem]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-[#020617]/15 to-transparent" />

                  <div className="absolute inset-x-0 bottom-0 p-4 sm:p-8">
                    <div className="glass-chip inline-flex rounded-full px-2.5 py-1.5 text-[0.52rem] font-semibold uppercase tracking-[0.18em] text-[#d4af37] sm:px-3 sm:py-2 sm:text-[0.68rem] sm:tracking-[0.22em]">
                      {siteContent.heroFeaturedEyebrow}
                    </div>
                    <h2 className="mt-3 max-w-[14rem] font-display text-[2rem] leading-[0.95] text-white sm:mt-4 sm:max-w-md sm:text-4xl">
                      {heroPrimaryProduct?.name || siteContent.heroFeaturedTitle}
                    </h2>
                    <p className="mt-2 max-w-[15rem] text-xs leading-5 text-[#dbe5ff] sm:mt-3 sm:max-w-lg sm:text-base sm:leading-7">
                      {heroPrimaryProduct?.shortDescription ||
                        heroPrimaryProduct?.description ||
                        siteContent.heroCheckoutPathCopy}
                    </p>
                  </div>
                </div>
              </div>

              <div className="glass-panel-light reveal-scroll reveal-scroll-delay-2 ml-auto mt-3 w-full max-w-[15.75rem] rounded-[20px] p-4 text-[#0f172a] sm:mx-auto sm:mt-6 sm:max-w-[21rem] sm:rounded-[24px] sm:p-5 lg:ml-auto lg:mr-8 lg:mt-6">
                <p className="text-[0.56rem] font-semibold uppercase tracking-[0.18em] text-[#2563eb] sm:text-[0.68rem] sm:tracking-[0.22em]">
                  {siteContent.heroCheckoutPathEyebrow}
                </p>
                <p className="mt-2 text-base font-semibold leading-6 text-[#0f172a] sm:text-lg">
                  {siteContent.heroCheckoutPathTitle}
                </p>
                <p className="mt-2 text-xs leading-5 text-slate-600 sm:text-sm sm:leading-6">
                  {heroSecondaryProduct?.shortDescription ||
                    siteContent.heroCheckoutPathCopy}
                </p>
                <div className="mt-3 flex flex-wrap gap-2 text-[0.56rem] font-semibold uppercase tracking-[0.14em] text-slate-500 sm:mt-4 sm:text-[0.68rem] sm:tracking-[0.16em]">
                  <span className="rounded-full bg-slate-100 px-2.5 py-1.5 sm:px-3 sm:py-2">
                    {paymentMethods.length} {siteContent.heroPaymentMethodsLabel}
                  </span>
                  <span className="rounded-full bg-slate-100 px-2.5 py-1.5 sm:px-3 sm:py-2">
                    {siteContent.heroSecureCheckoutLabel}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-white/10 bg-[#0b1324]">
        <div className="page-shell grid gap-3 py-5 sm:py-6 lg:grid-cols-4">
          {proofStats.map((item, index) => (
            <article
              key={`${item.value}-${item.label}`}
              className={`glass-panel reveal-scroll reveal-scroll-delay-${index % 4} rounded-[22px] px-4 py-4 sm:px-5`}
            >
              <p className="text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-[#d4af37]">
                {siteContent.proofStripEyebrow}
              </p>
              <p className="mt-3 text-2xl font-semibold text-white sm:text-[2rem]">
                {item.value}
              </p>
              <p className="mt-2 max-w-[16rem] text-sm leading-6 text-[#cbd5f5]">
                {item.label}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section id="collections" className="section-shell bg-[#0b1120]">
        <div className="page-shell">
          <div className="reveal-scroll flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <p className="section-kicker">{siteContent.categoriesSectionEyebrow}</p>
              <h2 className="mt-5 section-title !text-white">
                {siteContent.categoriesSectionTitle}
              </h2>
              <p className="mt-5 section-copy !text-[#cbd5f5]">
                {siteContent.categoriesSectionCopy}
              </p>
              <div className="mt-6 flex flex-wrap gap-2.5">
                {featuredCategoryChips.map((category) => (
                  <Link
                    key={category._id}
                    href={`/categories/${category.slug}`}
                    className="glass-chip rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-[#dbe5ff] hover:text-white"
                  >
                    {category.name}
                  </Link>
                ))}
              </div>
            </div>
            <Link
              href="/categories"
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#d4af37] hover:text-white"
            >
              {siteContent.categoriesSectionLinkLabel}
              <ArrowRight size={16} />
            </Link>
          </div>

          <MasonryGrid className="masonry-grid-categories mt-12">
            {categories.slice(0, 8).map((category) => (
              <CategoryCard key={category._id} category={category} />
            ))}
          </MasonryGrid>
        </div>
      </section>

      <section className="section-shell border-y border-white/10 bg-[#111c32]">
        <div className="page-shell">
          <div className="grid gap-10 xl:grid-cols-[minmax(0,0.78fr)_minmax(0,1.22fr)] xl:items-start">
            <div className="reveal-scroll max-w-xl">
              <p className="section-kicker">{siteContent.whyBuyEyebrow}</p>
              <h2 className="mt-5 section-title !text-white">
                {siteContent.whyBuyTitle}
              </h2>
              <p className="mt-5 text-base leading-8 text-[#cbd5f5] sm:text-lg">
                {siteContent.whyBuyIntroCopy}
              </p>

              <div className="mt-8 space-y-4">
                {trustPillars.map((pillar, index) => (
                  <article
                    key={pillar.title}
                    className={`glass-panel reveal-scroll reveal-scroll-delay-${index % 4} rounded-[24px] px-5 py-5`}
                  >
                    <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#d4af37]">
                      {pillar.title}
                    </p>
                    <p className="mt-3 text-sm leading-7 text-[#cbd5f5]">
                      {pillar.copy}
                    </p>
                  </article>
                ))}
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              {whyChooseItems.map((item, index) => {
                const Icon = whyChooseIcons[index] || ShieldCheck;

                return (
                  <article
                    key={item.title}
                    className={`glass-panel reveal-scroll reveal-scroll-delay-${index % 4} rounded-[28px] p-6 transition duration-300 hover:-translate-y-1 hover:bg-[linear-gradient(180deg,rgba(255,255,255,0.16),rgba(255,255,255,0.07))]`}
                  >
                    <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#d4af37]/15 text-[#d4af37]">
                      <Icon size={20} />
                    </span>
                    <h3 className="mt-6 text-xl font-semibold text-white">
                      {item.title}
                    </h3>
                    <p className="mt-3 text-sm leading-7 text-[#cbd5f5]">
                      {item.copy}
                    </p>
                  </article>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section id="featured" className="section-shell bg-[#0b1120]">
        <div className="page-shell">
          <div className="reveal-scroll flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <p className="section-kicker">{siteContent.featuredSectionEyebrow}</p>
              <h2 className="mt-5 section-title !text-white">
                {siteContent.featuredSectionTitle}
              </h2>
              <p className="mt-5 section-copy !text-[#cbd5f5]">
                {siteContent.featuredSectionCopy}
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <div className="rounded-full border border-[#d4af37]/30 bg-[#d4af37]/10 px-5 py-3 text-sm font-semibold text-[#d4af37]">
                {paymentMethods.length} {siteContent.featuredPaymentsStatusLabel}
              </div>
              <Link
                href="/track-order"
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-[#dbe5ff] hover:text-white"
              >
                {siteContent.featuredTrackCtaLabel}
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>

          <MasonryGrid className="masonry-grid-products mt-12">
            {featuredProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </MasonryGrid>
        </div>
      </section>

      <section className="border-y border-white/10 bg-[#d4af37] py-5 text-[#0f172a]">
        <div className="page-shell flex flex-col gap-3 text-center sm:flex-row sm:items-center sm:justify-between sm:text-left">
          <p className="text-base font-semibold tracking-[0.04em] sm:text-lg">
            {siteContent.urgencyStripText}
          </p>
          <Link
            href="/categories"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-[#0f172a] px-5 py-3 text-sm font-semibold text-white hover:scale-[1.03]"
          >
            {siteContent.heroPrimaryCtaLabel}
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      <section className="section-shell bg-[#111c32]">
        <div className="page-shell">
          <div className="reveal-scroll max-w-2xl">
            <p className="section-kicker">{siteContent.reviewsSectionEyebrow}</p>
            <h2 className="mt-5 section-title !text-white">
              {siteContent.reviewsSectionTitle}
            </h2>
            <p className="mt-5 section-copy !text-[#cbd5f5]">
              {siteContent.reviewsSectionCopy}
            </p>
          </div>

          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {testimonials.map((item, index) => (
              <article
                key={item.name}
                className={`glass-panel-strong reveal-scroll reveal-scroll-delay-${index % 4} rounded-[28px] p-7`}
              >
                <div className="flex items-center gap-1 text-[#d4af37]">
                  {Array.from({ length: 5 }).map((_, starIndex) => (
                    <Star key={starIndex} size={16} fill="currentColor" />
                  ))}
                </div>
                <p className="mt-5 text-base leading-8 text-[#f1f5f9]">
                  "{item.quote}"
                </p>
                <p className="mt-6 text-sm font-semibold uppercase tracking-[0.18em] text-[#dbe5ff]">
                  {item.name}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-shell bg-[#0b1120]">
        <div className="page-shell">
          <div className="glass-panel-strong reveal-scroll rounded-[36px] bg-[linear-gradient(135deg,rgba(23,35,61,0.84)_0%,rgba(28,43,73,0.76)_55%,rgba(34,53,87,0.72)_100%)] px-6 py-12 text-center shadow-[0_36px_90px_rgba(2,8,23,0.35)] sm:px-10 lg:px-16 lg:py-16">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#d4af37]">
              Premium finish
            </p>
            <h2 className="mx-auto mt-5 max-w-3xl font-display text-4xl leading-tight text-white sm:text-5xl lg:text-6xl">
              {siteContent.finalCtaTitle}
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-[#e2e8f0] sm:text-lg">
              {siteContent.finalCtaCopy}
            </p>
            <div className="mt-10 flex justify-center">
              <Link href="/categories" className="button-primary gap-2">
                {siteContent.finalCtaButtonLabel}
                <ArrowRight size={17} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
