"use client";

import { useMemo, useState } from "react";
import { CreditCard, ShieldCheck, Sparkles, Star, Truck } from "lucide-react";
import AddToCartButton from "@/components/AddToCartButton";
import PaymentBadge from "@/components/PaymentBadge";
import ProductGallery from "@/components/ProductGallery";
import { formatCurrency } from "@/lib/fetcher";
import {
  findMatchingVariant,
  getDefaultVariantSelection,
  getProductAvailableInventory,
  getProductDisplayCompareAtPrice,
  getProductDisplayPrice,
  getSizeOptions,
  getVariantDisplayImages,
  getVariationOptions
} from "@/lib/productSelection";
import { resolveSiteContent } from "@/lib/siteContent";

const productHighlightIcons = [Sparkles, CreditCard, ShieldCheck, Truck];

function renderStars(rating) {
  return Array.from({ length: 5 }, (_, index) => (
    <Star
      key={`${rating}-${index}`}
      size={14}
      className={
        index < Math.round(Number(rating || 0))
          ? "fill-amber-400 text-amber-400"
          : "text-slate-300"
      }
    />
  ));
}

export default function ProductDetailClient({
  product,
  paymentMethods = [],
  siteContent,
  productHighlightTitles = []
}) {
  const content = resolveSiteContent(siteContent);
  const defaultSelection = useMemo(
    () => getDefaultVariantSelection(product),
    [product]
  );
  const [selectedVariation, setSelectedVariation] = useState(
    defaultSelection.variation
  );
  const [selectedSize, setSelectedSize] = useState(defaultSelection.size);
  const variationOptions = getVariationOptions(product);
  const sizeOptions = getSizeOptions(product, selectedVariation);
  const selectedVariant = findMatchingVariant(
    product,
    selectedVariation,
    selectedSize
  );
  const displayPrice = getProductDisplayPrice(product, selectedVariant);
  const displayCompareAtPrice = getProductDisplayCompareAtPrice(
    product,
    selectedVariant
  );
  const displayImages = getVariantDisplayImages(product, selectedVariant);
  const inventoryCount = getProductAvailableInventory(product, selectedVariant);
  const isOutOfStock =
    product.inStock === false || Number(inventoryCount || 0) <= 0;
  const reviews = product.reviewSummary?.items || [];
  const reviewAverage = Number(product.reviewSummary?.averageRating || 0);
  const reviewCount = Number(product.reviewSummary?.totalReviews || 0);

  function handleVariationSelect(value) {
    setSelectedVariation(value);
    const nextSizeOptions = getSizeOptions(product, value);
    setSelectedSize((current) =>
      nextSizeOptions.includes(current) ? current : nextSizeOptions[0] || ""
    );
  }

  return (
    <div className="mt-8 grid gap-10 lg:grid-cols-[1.05fr_0.95fr]">
      <ProductGallery images={displayImages} alt={product.name} />

      <div className="space-y-8">
        <div className="reveal-scroll">
          <div className="flex flex-wrap gap-2">
            <PaymentBadge>{product.category?.name || "Collection"}</PaymentBadge>
            {product.tags?.map((tag) => (
              <PaymentBadge key={tag}>{tag}</PaymentBadge>
            ))}
          </div>

          <h1 className="mt-6 font-display text-5xl leading-none text-brand-primary sm:text-6xl">
            {product.name}
          </h1>
          <p className="mt-5 text-base leading-8 text-brand-muted">
            {product.description}
          </p>

          {reviewCount ? (
            <div className="mt-5 flex items-center gap-3">
              <div className="flex items-center gap-1">{renderStars(reviewAverage)}</div>
              <p className="text-sm font-semibold text-brand-primary">
                {reviewAverage}/5 from {reviewCount} review
                {reviewCount === 1 ? "" : "s"}
              </p>
            </div>
          ) : null}
        </div>

        <div className="reveal-scroll reveal-scroll-delay-1 surface-card p-6">
          <div className="flex flex-wrap items-end gap-4">
            <p className="text-4xl font-bold text-brand-text">
              {formatCurrency(displayPrice)}
            </p>
            {displayCompareAtPrice > displayPrice ? (
              <p className="pb-1 text-lg text-brand-muted line-through">
                {formatCurrency(displayCompareAtPrice)}
              </p>
            ) : null}
          </div>
          <p
            className={`mt-4 text-sm font-semibold uppercase tracking-[0.16em] ${
              isOutOfStock ? "text-amber-700" : "text-brand-secondary"
            }`}
          >
            {isOutOfStock
              ? "Out of stock"
              : `${inventoryCount} available in this selection`}
          </p>

          {variationOptions.length ? (
            <div className="mt-6 space-y-3">
              <p className="text-sm font-semibold text-brand-text">
                {product.variantLabel || "Variation"}
              </p>
              <div className="flex flex-wrap gap-2">
                {variationOptions.map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => handleVariationSelect(option)}
                    className={`rounded-full border px-4 py-2 text-sm font-semibold ${
                      selectedVariation === option
                        ? "border-brand-secondary bg-brand-secondary/10 text-brand-primary"
                        : "border-brand-border bg-white text-brand-muted hover:text-brand-primary"
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          ) : null}

          {sizeOptions.length ? (
            <div className="mt-6 space-y-3">
              <p className="text-sm font-semibold text-brand-text">
                {product.sizeLabel || "Size"}
              </p>
              <div className="flex flex-wrap gap-2">
                {sizeOptions.map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setSelectedSize(option)}
                    className={`rounded-full border px-4 py-2 text-sm font-semibold ${
                      selectedSize === option
                        ? "border-brand-secondary bg-brand-secondary/10 text-brand-primary"
                        : "border-brand-border bg-white text-brand-muted hover:text-brand-primary"
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          ) : null}

          <AddToCartButton
            product={product}
            variant={selectedVariant}
            className="mt-6 w-full sm:w-auto"
            label="Add to Cart"
          />
        </div>

        {product.whatsInTheBox?.length ? (
          <div className="reveal-scroll rounded-[24px] border border-brand-border bg-white p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-secondary">
              What's in the box
            </p>
            <ul className="mt-4 space-y-3 text-sm leading-7 text-brand-muted">
              {product.whatsInTheBox.map((item) => (
                <li key={item}>• {item}</li>
              ))}
            </ul>
          </div>
        ) : null}

        {(Number(product.warranty?.days || 0) > 0 ||
          product.warranty?.description ||
          Number(product.returnPolicy?.days || 0) > 0 ||
          product.returnPolicy?.description) ? (
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="reveal-scroll rounded-[24px] border border-brand-border bg-white p-5">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-secondary">
                Warranty
              </p>
              <p className="mt-3 text-lg font-semibold text-brand-primary">
                {Number(product.warranty?.days || 0) > 0
                  ? `${product.warranty.days} day warranty`
                  : "No fixed warranty days"}
              </p>
              <p className="mt-3 text-sm leading-7 text-brand-muted">
                {product.warranty?.description || "Warranty details will be shared by the seller."}
              </p>
            </div>
            <div className="reveal-scroll reveal-scroll-delay-1 rounded-[24px] border border-brand-border bg-white p-5">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-secondary">
                Return policy
              </p>
              <p className="mt-3 text-lg font-semibold text-brand-primary">
                {Number(product.returnPolicy?.days || 0) > 0
                  ? `${product.returnPolicy.days} day return window`
                  : "Returns not available"}
              </p>
              <p className="mt-3 text-sm leading-7 text-brand-muted">
                {product.returnPolicy?.description || "Return policy details are not set for this product."}
              </p>
            </div>
          </div>
        ) : null}

        <div className="grid gap-4 sm:grid-cols-2">
          {productHighlightTitles.map((title, index) => {
            const Icon = productHighlightIcons[index] || Sparkles;

            return (
              <div
                key={`${title}-${index}`}
                className={`reveal-scroll reveal-scroll-delay-${index % 4} rounded-[24px] border border-brand-border bg-white p-5`}
              >
                <Icon size={20} className="text-brand-secondary" />
                <p className="mt-4 font-semibold text-brand-primary">
                  {title}
                </p>
              </div>
            );
          })}
        </div>

        {paymentMethods.length ? (
          <div className="reveal-scroll rounded-[24px] border border-brand-border bg-white p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-secondary">
              {content.productPaymentMethodsTitle}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {paymentMethods.map((method) => (
                <PaymentBadge key={method._id}>{method.name}</PaymentBadge>
              ))}
            </div>
          </div>
        ) : null}

        {reviews.length ? (
          <div className="reveal-scroll rounded-[24px] border border-brand-border bg-white p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-secondary">
              Customer reviews
            </p>
            <div className="mt-5 space-y-4">
              {reviews.map((review) => (
                <div
                  key={review._id}
                  className="rounded-[20px] bg-brand-background p-4"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <p className="font-semibold text-brand-primary">
                      {review.title || "Verified review"}
                    </p>
                    <div className="flex items-center gap-1">
                      {renderStars(review.rating)}
                    </div>
                  </div>
                  {(review.variantLabel || review.sizeLabel) ? (
                    <p className="mt-2 text-xs font-semibold uppercase tracking-[0.14em] text-brand-secondary">
                      {[review.variantLabel, review.sizeLabel].filter(Boolean).join(" / ")}
                    </p>
                  ) : null}
                  <p className="mt-3 text-sm leading-7 text-brand-muted">
                    {review.comment || "Customer left a rating for this completed order."}
                  </p>
                  <p className="mt-3 text-xs font-semibold uppercase tracking-[0.14em] text-brand-muted">
                    {review.customerName || "Verified buyer"}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
