import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import ProductDetailClient from "@/components/ProductDetailClient";
import ProductCard from "@/components/ProductCard";
import {
  getPaymentMethods,
  getProduct,
  getProducts,
  getStoreSettings
} from "@/lib/fetcher";
import { resolveSiteContent } from "@/lib/siteContent";

export default async function ProductDetailPage({ params }) {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) {
    notFound();
  }

  const [relatedProducts, paymentMethods, settings] = await Promise.all([
    getProducts({
      category: product.category?._id,
      limit: 4
    }),
    getPaymentMethods(),
    getStoreSettings()
  ]);
  const content = resolveSiteContent(settings);
  const productHighlightTitles = [
    content.productHighlightOneTitle,
    content.productHighlightTwoTitle,
    content.productHighlightThreeTitle,
    content.productHighlightFourTitle
  ];
  const filteredRelatedProducts = relatedProducts
    .filter((item) => item._id !== product._id)
    .slice(0, 3);

  return (
    <div className="page-shell section-shell">
      <Link
        href={product.category?.slug ? `/categories/${product.category.slug}` : "/categories"}
        className="reveal-scroll inline-flex items-center gap-2 text-sm font-semibold text-brand-muted hover:text-brand-secondary"
      >
        <ArrowLeft size={16} />
        {content.productBackToCategoryLabel}
      </Link>

      <ProductDetailClient
        product={product}
        paymentMethods={paymentMethods}
        siteContent={content}
        productHighlightTitles={productHighlightTitles}
      />

      <section className="mt-20">
        <div className="reveal-scroll">
          <p className="section-kicker">{content.productRelatedEyebrow}</p>
          <h2 className="mt-4 text-3xl font-semibold text-brand-primary">
            {content.productRelatedTitle}
          </h2>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
          {filteredRelatedProducts.map((item, index) => (
            <div
              key={item._id}
              className={`reveal-scroll reveal-scroll-delay-${index % 4}`}
            >
              <ProductCard product={item} />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
