import Link from "next/link";
import { ArrowRight } from "lucide-react";
import AddToCartButton from "@/components/AddToCartButton";
import PaymentBadge from "@/components/PaymentBadge";
import { DEFAULT_PRODUCT_IMAGE } from "@/lib/constants";
import { formatCurrency } from "@/lib/fetcher";
import {
  getProductDisplayCompareAtPrice,
  getProductDisplayPrice,
  hasVariants
} from "@/lib/productSelection";

export default function ProductCard({ product }) {
  const image = product.images?.[0] || DEFAULT_PRODUCT_IMAGE;
  const stockCount = Number(product.inventoryCount || 0);
  const isOutOfStock = product.inStock === false || stockCount <= 0;
  const displayPrice = getProductDisplayPrice(product);
  const displayCompareAtPrice = getProductDisplayCompareAtPrice(product);
  const productHasVariants = hasVariants(product);

  return (
    <article className="product-card group flex h-full flex-col overflow-hidden rounded-[24px] border border-brand-border bg-white shadow-soft transition duration-300 hover:-translate-y-1 hover:shadow-2xl sm:rounded-[28px]">
      <Link href={`/product/${product._id}`} className="relative overflow-hidden">
        <div className="product-card-media overflow-hidden bg-brand-background">
          <img
            src={image}
            alt={product.name}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        </div>
        <div className="absolute left-3 top-3 sm:left-4 sm:top-4">
          <PaymentBadge>
            {product.category?.name || product.categoryName || "Featured"}
          </PaymentBadge>
        </div>
      </Link>

      <div className="flex flex-1 flex-col gap-4 p-4 sm:gap-5 sm:p-6">
        <div className="space-y-2 sm:space-y-3">
          <Link href={`/product/${product._id}`}>
            <h3 className="line-clamp-2 text-base font-semibold leading-5 text-brand-primary transition group-hover:text-brand-secondary sm:text-xl sm:leading-6">
              {product.name}
            </h3>
          </Link>
          <p className="line-clamp-2 text-xs leading-5 text-brand-muted sm:text-sm sm:leading-6">
            {product.shortDescription || product.description}
          </p>
          {productHasVariants ? (
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-brand-secondary sm:text-xs">
              Multiple options available
            </p>
          ) : null}
        </div>

        <div className="mt-auto flex items-end justify-between gap-3">
          <div>
            <p className="text-lg font-bold text-brand-text sm:text-2xl">
              {formatCurrency(displayPrice)}
            </p>
            {displayCompareAtPrice > displayPrice ? (
              <p className="mt-1 text-xs text-brand-muted line-through sm:text-sm">
                {formatCurrency(displayCompareAtPrice)}
              </p>
            ) : null}
            <p
              className={`mt-1 text-[11px] font-semibold uppercase tracking-[0.14em] sm:text-xs ${
                isOutOfStock ? "text-amber-700" : "text-brand-secondary"
              }`}
            >
              {isOutOfStock
                ? "Out of stock"
                : stockCount <= 5
                  ? `Only ${stockCount} left`
                  : "Ready to ship"}
            </p>
          </div>

          <Link
            href={`/product/${product._id}`}
            className="inline-flex items-center gap-1 text-xs font-semibold text-brand-secondary hover:text-brand-primary sm:gap-2 sm:text-sm"
          >
            Details
            <ArrowRight size={16} />
          </Link>
        </div>

        <AddToCartButton product={product} className="w-full" />
      </div>
    </article>
  );
}
