"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Minus, Plus, ShoppingBag } from "lucide-react";
import { useCart } from "@/components/providers/CartProvider";
import {
  buildCartItemPayload,
  getProductAvailableInventory,
  isSelectionRequired
} from "@/lib/productSelection";

export default function AddToCartButton({
  product,
  variant = null,
  className = "",
  label = "Add to Cart",
  quantityControls = true
}) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const requiresSelection = isSelectionRequired(product) && !variant;
  const inventoryCount = getProductAvailableInventory(product, variant);
  const isOutOfStock = product.inStock === false || inventoryCount <= 0;
  const cartPayload = buildCartItemPayload(product, variant);

  useEffect(() => {
    if (!added) {
      return undefined;
    }

    const timer = window.setTimeout(() => setAdded(false), 1800);
    return () => window.clearTimeout(timer);
  }, [added]);

  function handleClick() {
    addItem(product, quantity, { variant });
    setAdded(true);
  }

  function decrementQuantity() {
    setQuantity((current) => Math.max(1, current - 1));
  }

  function incrementQuantity() {
    setQuantity((current) => Math.min(inventoryCount || 1, current + 1));
  }

  if (requiresSelection) {
    return (
      <Link
        href={`/product/${product._id}`}
        className={`inline-flex items-center justify-center gap-2 rounded-full bg-brand-primary px-4 py-2.5 text-xs font-semibold text-white sm:px-5 sm:py-3 sm:text-sm ${className}`}
      >
        <ShoppingBag size={16} />
        Choose options
      </Link>
    );
  }

  return (
    <div className={`space-y-3 ${className}`}>
      {quantityControls ? (
        <div className="flex items-center justify-between rounded-full border border-brand-border bg-brand-background p-1.5">
          <button
            type="button"
            onClick={decrementQuantity}
            disabled={quantity <= 1}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white text-brand-primary disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="Decrease quantity"
          >
            <Minus size={15} />
          </button>
          <div className="min-w-16 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-muted">
              Qty
            </p>
            <p className="text-sm font-semibold text-brand-primary">{quantity}</p>
          </div>
          <button
            type="button"
            onClick={incrementQuantity}
            disabled={quantity >= Math.max(inventoryCount, 1) || isOutOfStock}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white text-brand-primary disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="Increase quantity"
          >
            <Plus size={15} />
          </button>
        </div>
      ) : null}

      <button
        type="button"
        onClick={handleClick}
        disabled={isOutOfStock}
        className={`inline-flex w-full items-center justify-center gap-2 rounded-full px-4 py-2.5 text-xs font-semibold text-white sm:px-5 sm:py-3 sm:text-sm ${
          isOutOfStock
            ? "cursor-not-allowed bg-slate-400"
            : "bg-brand-cta hover:-translate-y-0.5 hover:bg-orange-500"
        }`}
      >
        <ShoppingBag size={16} />
        {isOutOfStock
          ? "Out of Stock"
          : added
            ? `${quantity} Added`
            : cartPayload.variantLabel || cartPayload.sizeLabel
              ? `${label} · ${quantity}`
              : `${label} · ${quantity}`}
      </button>
    </div>
  );
}
