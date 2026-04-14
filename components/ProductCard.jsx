import Link from "next/link";
import { ArrowRight, Flame, Star } from "lucide-react";
import AddToCartButton from "@/components/AddToCartButton";
import { DEFAULT_PRODUCT_IMAGE } from "@/lib/constants";
import { formatCurrency } from "@/lib/fetcher";
import {
  getProductDisplayCompareAtPrice,
  getProductDisplayPrice,
  hasVariants
} from "@/lib/productSelection";

function getDiscountPercent(compareAtPrice, price) {
  if (!compareAtPrice || compareAtPrice <= price) {
    return 0;
  }

  return Math.round(((compareAtPrice - price) / compareAtPrice) * 100);
}

export default function ProductCard({ product }) {
  const image = product.images?.[0] || DEFAULT_PRODUCT_IMAGE;
  const stockCount = Number(product.inventoryCount || 0);
  const isOutOfStock = product.inStock === false || stockCount <= 0;
  const displayPrice = getProductDisplayPrice(product);
  const displayCompareAtPrice = getProductDisplayCompareAtPrice(product);
  const productHasVariants = hasVariants(product);
  const discountPercent = getDiscountPercent(displayCompareAtPrice, displayPrice);
  const reviewAverage = Number(product.reviewSummary?.averageRating || 0);
  const reviewCount = Number(product.reviewSummary?.totalReviews || 0);
  const urgencyLabel = isOutOfStock
    ? "Out of stock"
    : stockCount <= 6
      ? "Limited stock available"
      : stockCount <= 14
        ? "Selling fast"
        : "Ready to dispatch";

  return (
    <article className="glass-panel-strong group flex h-full flex-col overflow-hidden rounded-[22px] text-white transition duration-300 hover:-translate-y-1 hover:shadow-[0_30px_70px_rgba(2,8,23,0.38)] sm:rounded-[28px]">
      <Link href={`/product/${product._id}`} className="relative overflow-hidden">
        <div className="product-card-media overflow-hidden bg-[#0b1324]">
          <img
            src={image}
            alt={product.name}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
          />
        </div>

        <div className="glass-chip absolute left-2.5 top-2.5 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-[0.52rem] font-semibold uppercase tracking-[0.14em] text-[#d4af37] sm:left-4 sm:top-4 sm:gap-2 sm:px-3 sm:py-2 sm:text-[0.68rem] sm:tracking-[0.16em]">
          <Flame size={12} />
          {urgencyLabel}
        </div>

        {discountPercent ? (
          <div className="absolute right-2.5 top-2.5 rounded-full bg-[#2563eb] px-2.5 py-1.5 text-[0.52rem] font-semibold uppercase tracking-[0.14em] text-white shadow-[0_12px_28px_rgba(37,99,235,0.35)] sm:right-4 sm:top-4 sm:px-3 sm:py-2 sm:text-[0.68rem] sm:tracking-[0.16em]">
            Save {discountPercent}%
          </div>
        ) : null}
      </Link>

      <div className="flex flex-1 flex-col gap-3.5 p-3.5 sm:gap-5 sm:p-6">
        <div className="space-y-2.5 sm:space-y-3">
          <div className="flex items-center gap-2 text-[0.54rem] font-semibold uppercase tracking-[0.14em] text-[#cbd5f5] sm:gap-3 sm:text-[0.68rem] sm:tracking-[0.18em]">
            <span>{product.category?.name || product.categoryName || "Featured"}</span>
            <span className="h-1 w-1 rounded-full bg-[#d4af37]" />
            <span className="inline-flex items-center gap-1 text-[#d4af37]">
              <Star size={11} fill="currentColor" />
              {reviewCount ? reviewAverage.toFixed(1) : "Trusted"}
            </span>
          </div>

          <Link href={`/product/${product._id}`}>
            <h3 className="line-clamp-2 text-[1.02rem] font-semibold leading-[1.15] text-white transition group-hover:text-[#d4af37] sm:text-xl sm:leading-7">
              {product.name}
            </h3>
          </Link>

          <p className="line-clamp-2 text-[0.76rem] leading-5 text-[#cbd5f5] sm:text-sm sm:leading-7">
            {product.shortDescription || product.description}
          </p>

          {productHasVariants ? (
            <p className="hidden text-xs font-semibold uppercase tracking-[0.16em] text-[#d4af37] sm:block">
              Sizes and variations available
            </p>
          ) : null}
        </div>

        <div className="mt-auto space-y-3 sm:space-y-4">
          <div className="flex flex-wrap items-end justify-between gap-2.5 sm:gap-3">
            <div>
              <p className="text-xl font-bold text-white sm:text-2xl">
                {formatCurrency(displayPrice)}
              </p>
              {displayCompareAtPrice > displayPrice ? (
                <p className="mt-1 text-xs text-[#94a3b8] line-through sm:text-sm">
                  {formatCurrency(displayCompareAtPrice)}
                </p>
              ) : (
                <p className="mt-1 text-xs text-[#94a3b8] sm:text-sm">
                  Premium value pricing
                </p>
              )}
            </div>

            <Link
              href={`/product/${product._id}`}
              className="inline-flex items-center gap-1.5 text-[0.76rem] font-semibold text-[#d4af37] hover:text-white sm:gap-2 sm:text-sm"
            >
              View details
              <ArrowRight size={16} />
            </Link>
          </div>

          <AddToCartButton
            product={product}
            label="Buy Now"
            className="w-full"
            mobileCompact
          />
        </div>
      </div>
    </article>
  );
}
