import { DEFAULT_PRODUCT_IMAGE } from "@/lib/constants";

export function getActiveVariants(product) {
  return Array.isArray(product?.variants)
    ? product.variants.filter((variant) => variant?.isActive !== false)
    : [];
}

export function hasVariants(product) {
  return getActiveVariants(product).length > 0;
}

export function getVariationOptions(product) {
  return [...new Set(getActiveVariants(product).map((variant) => variant.variation).filter(Boolean))];
}

export function getSizeOptions(product, selectedVariation = "") {
  return [
    ...new Set(
      getActiveVariants(product)
        .filter((variant) =>
          selectedVariation ? variant.variation === selectedVariation : true
        )
        .map((variant) => variant.size)
        .filter(Boolean)
    )
  ];
}

export function findMatchingVariant(product, variation = "", size = "") {
  const activeVariants = getActiveVariants(product);

  if (!activeVariants.length) {
    return null;
  }

  return (
    activeVariants.find(
      (variant) =>
        String(variant.variation || "") === String(variation || "") &&
        String(variant.size || "") === String(size || "")
    ) ||
    activeVariants.find(
      (variant) =>
        String(variant.variation || "") === String(variation || "") &&
        !String(variant.size || "")
    ) ||
    activeVariants.find((variant) => !variation && !size) ||
    null
  );
}

export function getDefaultVariantSelection(product) {
  const activeVariants = getActiveVariants(product);

  if (!activeVariants.length) {
    return {
      variation: "",
      size: "",
      variant: null
    };
  }

  const firstVariant = activeVariants[0];

  return {
    variation: String(firstVariant.variation || ""),
    size: String(firstVariant.size || ""),
    variant: firstVariant
  };
}

export function getVariantDisplayImages(product, variant) {
  if (variant?.images?.length) {
    return variant.images;
  }

  return product?.images?.length ? product.images : [DEFAULT_PRODUCT_IMAGE];
}

export function getProductDisplayPrice(product, variant = null) {
  if (variant) {
    return Number(variant.price || 0);
  }

  const activeVariants = getActiveVariants(product);

  if (activeVariants.length) {
    return Math.min(...activeVariants.map((item) => Number(item.price || 0)));
  }

  return Number(product?.price || 0);
}

export function getProductDisplayCompareAtPrice(product, variant = null) {
  if (variant) {
    return Number(variant.compareAtPrice || 0);
  }

  const activeVariants = getActiveVariants(product);

  if (activeVariants.length) {
    return Math.max(
      ...activeVariants.map((item) => Number(item.compareAtPrice || 0))
    );
  }

  return Number(product?.compareAtPrice || 0);
}

export function getProductAvailableInventory(product, variant = null) {
  if (variant) {
    return Math.max(Number(variant.inventoryCount || 0), 0);
  }

  return Math.max(Number(product?.inventoryCount || 0), 0);
}

export function isSelectionRequired(product) {
  return hasVariants(product);
}

export function buildCartItemPayload(product, variant = null) {
  return {
    variantId: variant?._id || "",
    variantLabel: String(variant?.variation || ""),
    sizeLabel: String(variant?.size || ""),
    sku: String(variant?.sku || product?.sku || ""),
    price: getProductDisplayPrice(product, variant),
    compareAtPrice: getProductDisplayCompareAtPrice(product, variant),
    image: getVariantDisplayImages(product, variant)?.[0] || DEFAULT_PRODUCT_IMAGE
  };
}
