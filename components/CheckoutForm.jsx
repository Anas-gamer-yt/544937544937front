"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertCircle, ArrowRight, ShieldCheck } from "lucide-react";
import { useState } from "react";
import PaymentBadge from "@/components/PaymentBadge";
import { useCart } from "@/components/providers/CartProvider";
import { apiFetch, formatCurrency } from "@/lib/fetcher";
import { resolveSiteContent } from "@/lib/siteContent";

const OBJECT_ID_PATTERN = /^[a-f\d]{24}$/i;

const initialForm = {
  name: "",
  phone: "",
  address: "",
  paymentMethodId: "",
  notes: "",
  acceptTerms: false,
  acceptReturnPolicy: false
};

export default function CheckoutForm({
  paymentMethods = [],
  whatsappNumber = "",
  siteContent
}) {
  const router = useRouter();
  const { items, subtotal, clearCart } = useCart();
  const content = resolveSiteContent(siteContent);
  const [form, setForm] = useState({
    ...initialForm,
    paymentMethodId: paymentMethods[0]?._id || ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  function hasInvalidCartItems() {
    return items.some((item) => {
      const productId = String(item?.id || "").trim();
      const variantId = String(item?.variantId || "").trim();

      return (
        !OBJECT_ID_PATTERN.test(productId) ||
        (variantId && !OBJECT_ID_PATTERN.test(variantId))
      );
    });
  }

  function handleChange(event) {
    const { name, type, value, checked } = event.target;
    setForm((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!items.length) {
      setError("Your cart is empty.");
      return;
    }

    if (!form.name || !form.phone || !form.address) {
      setError("Please complete all required checkout fields.");
      return;
    }

    if (!form.paymentMethodId) {
      setError("Please choose a payment method.");
      return;
    }

    if (!form.acceptTerms || !form.acceptReturnPolicy) {
      setError(content.checkoutAcceptanceError);
      return;
    }

    if (hasInvalidCartItems()) {
      setError(
        "Your cart contains outdated items. Please remove them and add the products again before checkout."
      );
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const payload = await apiFetch("/api/orders", {
        method: "POST",
        data: {
          customer: {
            name: form.name,
            phone: form.phone,
            address: form.address
          },
          paymentMethodId: form.paymentMethodId,
          acceptedPolicies: {
            termsAndConditions: form.acceptTerms,
            returnPolicy: form.acceptReturnPolicy
          },
          items: items.map((item) => ({
            productId: item.id,
            variantId: item.variantId,
            quantity: item.quantity
          })),
          notes: form.notes
        }
      });

      const order = payload?.data;
      const redirectParams = new URLSearchParams({
        orderId: order.orderId,
        payment: order.paymentMethodName,
        total: String(order.total),
        name: form.name,
        phone: form.phone
      });

      if (whatsappNumber) {
        redirectParams.set("wa", whatsappNumber);
      }

      clearCart();
      router.push(`/orders/success?${redirectParams.toString()}`);
    } catch (requestError) {
      setError(requestError.message || "Unable to place order.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (!items.length) {
    return (
      <div className="page-shell section-shell">
        <div className="surface-card mx-auto max-w-2xl p-10 text-center">
          <p className="section-kicker">{content.checkoutPageEyebrow}</p>
          <h1 className="mt-5 font-display text-5xl text-brand-primary">
            {content.checkoutEmptyTitle}
          </h1>
          <p className="mx-auto mt-4 max-w-lg text-base leading-7 text-brand-muted">
            {content.checkoutEmptyCopy}
          </p>
          <Link href="/categories" className="button-primary mt-8">
            {content.checkoutEmptyCtaLabel}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page-shell section-shell">
      <div className="mb-10 max-w-3xl">
        <p className="section-kicker">{content.checkoutPageEyebrow}</p>
        <h1 className="mt-5 section-title">{content.checkoutPageTitle}</h1>
        <p className="mt-5 section-copy">{content.checkoutPageCopy}</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <form
          onSubmit={handleSubmit}
          className="surface-card space-y-8 p-6 sm:p-8"
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <label className="space-y-2">
              <span className="text-sm font-semibold text-brand-text">
                {content.checkoutFieldNameLabel}
              </span>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                className="w-full rounded-2xl border border-brand-border bg-brand-background px-4 py-3 outline-none focus:border-brand-secondary focus:shadow-focus"
                placeholder="Your full name"
              />
            </label>

            <label className="space-y-2">
              <span className="text-sm font-semibold text-brand-text">
                {content.checkoutFieldPhoneLabel}
              </span>
              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                className="w-full rounded-2xl border border-brand-border bg-brand-background px-4 py-3 outline-none focus:border-brand-secondary focus:shadow-focus"
                placeholder="03xx xxx xxxx"
              />
            </label>

            <label className="space-y-2 sm:col-span-2">
              <span className="text-sm font-semibold text-brand-text">
                {content.checkoutFieldAddressLabel}
              </span>
              <textarea
                name="address"
                value={form.address}
                onChange={handleChange}
                rows={4}
                className="w-full rounded-2xl border border-brand-border bg-brand-background px-4 py-3 outline-none focus:border-brand-secondary focus:shadow-focus"
                placeholder="Complete shipping address as written on ID card"
              />
            </label>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-lg font-semibold text-brand-primary">
                {content.checkoutPaymentMethodsTitle}
              </h2>
              <div className="hidden sm:flex sm:flex-wrap sm:gap-2">
                {paymentMethods.slice(0, 3).map((method) => (
                  <PaymentBadge key={method._id}>{method.name}</PaymentBadge>
                ))}
              </div>
            </div>

            <div className="grid gap-4">
              {paymentMethods.map((method) => {
                const isSelected = method._id === form.paymentMethodId;

                return (
                  <label
                    key={method._id}
                    className={`cursor-pointer rounded-[24px] border p-4 ${
                      isSelected
                        ? "border-brand-secondary bg-brand-secondary/5 shadow-focus"
                        : "border-brand-border bg-white"
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <input
                        type="radio"
                        name="paymentMethodId"
                        value={method._id}
                        checked={isSelected}
                        onChange={handleChange}
                        className="mt-1"
                      />
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <p className="font-semibold text-brand-primary">
                            {method.name}
                          </p>
                          <PaymentBadge>{method.type}</PaymentBadge>
                        </div>
                        {method.accountTitle ? (
                          <p className="text-sm text-brand-muted">
                            Account title: {method.accountTitle}
                          </p>
                        ) : null}
                        {method.accountNumber ? (
                          <p className="text-sm text-brand-muted">
                            Account number: {method.accountNumber}
                          </p>
                        ) : null}
                        {method.instructions ? (
                          <p className="text-sm leading-6 text-brand-muted">
                            {method.instructions}
                          </p>
                        ) : null}
                      </div>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>

          <label className="space-y-2">
            <span className="text-sm font-semibold text-brand-text">
              {content.checkoutOrderNoteLabel}
            </span>
            <textarea
              name="notes"
              value={form.notes}
              onChange={handleChange}
              rows={3}
              className="w-full rounded-2xl border border-brand-border bg-brand-background px-4 py-3 outline-none focus:border-brand-secondary focus:shadow-focus"
              placeholder={content.checkoutOrderNotePlaceholder}
            />
          </label>

          <div className="space-y-4 rounded-[24px] border border-brand-border bg-brand-background p-4 sm:p-5">
            <p className="text-sm font-semibold text-brand-primary">
              {content.checkoutPoliciesTitle}
            </p>

            <label className="flex items-start gap-3 text-sm leading-7 text-brand-muted">
              <input
                type="checkbox"
                name="acceptTerms"
                checked={form.acceptTerms}
                onChange={handleChange}
                className="mt-1"
              />
              <span>
                {content.checkoutTermsCheckboxLabel}{" "}
                <Link
                  href="/terms-and-conditions"
                  target="_blank"
                  className="font-semibold text-brand-primary underline underline-offset-4 hover:text-brand-secondary"
                >
                  {content.footerTermsLabel}
                </Link>
              </span>
            </label>

            <label className="flex items-start gap-3 text-sm leading-7 text-brand-muted">
              <input
                type="checkbox"
                name="acceptReturnPolicy"
                checked={form.acceptReturnPolicy}
                onChange={handleChange}
                className="mt-1"
              />
              <span>
                {content.checkoutReturnPolicyCheckboxLabel}{" "}
                <Link
                  href="/return-policy"
                  target="_blank"
                  className="font-semibold text-brand-primary underline underline-offset-4 hover:text-brand-secondary"
                >
                  {content.footerReturnPolicyLabel}
                </Link>
              </span>
            </label>
          </div>

          {error ? (
            <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              <AlertCircle size={18} className="mt-0.5 shrink-0" />
              <p>{error}</p>
            </div>
          ) : null}

          <button
            type="submit"
            disabled={isSubmitting}
            className="button-primary w-full gap-2"
          >
            {isSubmitting ? "Placing order..." : content.checkoutPlaceOrderLabel}
            <ArrowRight size={16} />
          </button>
        </form>

        <aside className="space-y-6 lg:sticky lg:top-28">
          <div className="surface-card p-6 sm:p-8">
            <div className="flex items-center gap-3">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-brand-primary text-white">
                <ShieldCheck size={18} />
              </span>
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-brand-secondary">
                  {content.checkoutSummaryTitle}
                </p>
                <p className="text-lg font-semibold text-brand-primary">
                  {items.length} item{items.length === 1 ? "" : "s"}
                </p>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              {items.map((item) => (
                <div
                  key={item.lineId}
                  className="flex items-center gap-4 rounded-2xl bg-brand-background p-4"
                >
                  <div className="h-20 w-20 overflow-hidden rounded-2xl bg-white">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-brand-text">{item.name}</p>
                    {(item.variantLabel || item.sizeLabel) ? (
                      <p className="mt-1 text-xs font-semibold uppercase tracking-[0.14em] text-brand-secondary">
                        {[item.variantLabel, item.sizeLabel].filter(Boolean).join(" / ")}
                      </p>
                    ) : null}
                    <p className="mt-1 text-sm text-brand-muted">
                      Qty {item.quantity}
                    </p>
                  </div>
                  <p className="text-sm font-semibold text-brand-primary">
                    {formatCurrency(item.price * item.quantity)}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-6 space-y-4 border-t border-brand-border pt-6">
              <div className="flex items-center justify-between text-sm text-brand-muted">
                <span>{content.cartSubtotalLabel}</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex items-center justify-between text-lg font-semibold text-brand-primary">
                <span>{content.cartTotalLabel}</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-800">
                {content.checkoutPricingNotice}
              </div>
            </div>
          </div>

          <div className="surface-card p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-secondary">
              {content.checkoutPaymentFollowupTitle}
            </p>
            <p className="mt-3 text-sm leading-7 text-brand-muted">
              {content.checkoutFollowupCopy}
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
