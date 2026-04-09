"use client";

import Link from "next/link";
import { ArrowRight, Minus, Plus, Trash2 } from "lucide-react";
import { useCart } from "@/components/providers/CartProvider";
import { formatCurrency } from "@/lib/fetcher";
import { resolveSiteContent } from "@/lib/siteContent";

export default function CartPageClient({ siteContent }) {
  const { items, subtotal, updateQuantity, removeItem } = useCart();
  const content = resolveSiteContent(siteContent);

  if (!items.length) {
    return (
      <div className="page-shell section-shell">
        <div className="surface-card mx-auto max-w-2xl p-10 text-center">
          <p className="section-kicker">{content.cartPageEyebrow}</p>
          <h1 className="mt-5 font-display text-5xl text-brand-primary">
            {content.cartEmptyTitle}
          </h1>
          <p className="mx-auto mt-5 max-w-lg text-base leading-7 text-brand-muted">
            {content.cartEmptyCopy}
          </p>
          <Link href="/categories" className="button-primary mt-8">
            {content.cartEmptyCtaLabel}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page-shell section-shell">
      <div className="mb-10 max-w-3xl">
        <p className="section-kicker">{content.cartPageEyebrow}</p>
        <h1 className="mt-5 section-title">{content.cartPageTitle}</h1>
        <p className="mt-5 section-copy">{content.cartPageCopy}</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-5">
          {items.map((item) => (
            <article
              key={item.lineId}
              className="surface-card flex flex-col gap-5 p-5 sm:flex-row sm:items-center"
            >
              <div className="h-28 w-full overflow-hidden rounded-[24px] bg-brand-background sm:w-28">
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-secondary">
                  {item.categoryName || "Collection"}
                </p>
                <h2 className="mt-2 text-xl font-semibold text-brand-primary">
                  {item.name}
                </h2>
                {(item.variantLabel || item.sizeLabel) ? (
                  <p className="mt-2 text-xs font-semibold uppercase tracking-[0.14em] text-brand-secondary">
                    {[item.variantLabel, item.sizeLabel].filter(Boolean).join(" / ")}
                  </p>
                ) : null}
                <p className="mt-3 text-lg font-semibold text-brand-text">
                  {formatCurrency(item.price)}
                </p>
              </div>
              <div className="flex items-center justify-between gap-4 sm:flex-col sm:items-end">
                <div className="flex items-center gap-2 rounded-full border border-brand-border bg-brand-background p-2">
                  <button
                    type="button"
                    onClick={() => updateQuantity(item.lineId, item.quantity - 1)}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white text-brand-primary"
                    aria-label={`Decrease quantity for ${item.name}`}
                  >
                    <Minus size={16} />
                  </button>
                  <span className="min-w-10 text-center text-sm font-semibold text-brand-text">
                    {item.quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => updateQuantity(item.lineId, item.quantity + 1)}
                    disabled={
                      Number(item.availableInventory || 0) > 0 &&
                      item.quantity >= Number(item.availableInventory || 0)
                    }
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white text-brand-primary disabled:cursor-not-allowed disabled:opacity-50"
                    aria-label={`Increase quantity for ${item.name}`}
                  >
                    <Plus size={16} />
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => removeItem(item.lineId)}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-red-600 hover:text-red-700"
                >
                  <Trash2 size={16} />
                  {content.cartRemoveLabel}
                </button>
              </div>
            </article>
          ))}
        </div>

        <aside className="surface-card h-fit p-6 lg:sticky lg:top-28">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-secondary">
            {content.cartSummaryTitle}
          </p>
          <div className="mt-6 space-y-4 border-b border-brand-border pb-6">
            <div className="flex items-center justify-between text-sm text-brand-muted">
              <span>{content.cartItemsLabel}</span>
              <span>{items.length}</span>
            </div>
            <div className="flex items-center justify-between text-sm text-brand-muted">
              <span>{content.cartSubtotalLabel}</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
          </div>
          <div className="mt-6 flex items-center justify-between text-lg font-semibold text-brand-primary">
            <span>{content.cartTotalLabel}</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>

          <Link href="/checkout" className="button-primary mt-8 w-full gap-2">
            {content.cartCheckoutLabel}
            <ArrowRight size={16} />
          </Link>
        </aside>
      </div>
    </div>
  );
}
