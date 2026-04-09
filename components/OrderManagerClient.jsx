"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  MessageSquare,
  RotateCcw,
  Search,
  Star
} from "lucide-react";
import { apiFetch, formatCurrency } from "@/lib/fetcher";
import { resolveSiteContent } from "@/lib/siteContent";

const reviewRatings = [5, 4, 3, 2, 1];
const returnReasonOptions = [
  "Wrong item received",
  "Damaged item",
  "Not as described",
  "Size issue",
  "Changed mind",
  "Other"
];

const initialReviewForm = {
  rating: "5",
  title: "",
  comment: ""
};

const initialReturnForm = {
  reason: "",
  description: ""
};

function formatDate(value) {
  if (!value) {
    return "";
  }

  const parsed = new Date(value);

  if (Number.isNaN(parsed.getTime())) {
    return "";
  }

  return parsed.toLocaleDateString("en-PK", {
    day: "numeric",
    month: "short",
    year: "numeric"
  });
}

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

function StatusBadge({ children, tone = "neutral" }) {
  const className =
    tone === "success"
      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
      : tone === "warning"
        ? "border-amber-200 bg-amber-50 text-amber-700"
        : "border-brand-secondary/20 bg-brand-secondary/10 text-brand-secondary";

  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] ${className}`}
    >
      {children}
    </span>
  );
}

function getOrderStatusTone(status) {
  if (status === "completed" || status === "paid") {
    return "success";
  }

  if (status === "pending_payment") {
    return "warning";
  }

  return "neutral";
}

function getReturnStatusTone(status) {
  if (status === "approved" || status === "completed") {
    return "success";
  }

  if (status === "requested") {
    return "warning";
  }

  return "neutral";
}

function formatCustomerLocation(customer) {
  return [
    customer?.area,
    customer?.city,
    customer?.district,
    customer?.province
  ]
    .filter(Boolean)
    .join(", ");
}

export default function OrderManagerClient({
  initialOrderId = "",
  initialPhone = "",
  siteContent
}) {
  const content = resolveSiteContent(siteContent);
  const [orderId, setOrderId] = useState(initialOrderId);
  const [phone, setPhone] = useState(initialPhone);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [activeReviewItemId, setActiveReviewItemId] = useState("");
  const [activeReturnItemId, setActiveReturnItemId] = useState("");
  const [reviewForms, setReviewForms] = useState({});
  const [returnForms, setReturnForms] = useState({});
  const [didAutoLookup, setDidAutoLookup] = useState(false);

  useEffect(() => {
    if (didAutoLookup || !initialOrderId || !initialPhone) {
      return;
    }

    setDidAutoLookup(true);
    void handleLookup(initialOrderId, initialPhone);
  }, [didAutoLookup, initialOrderId, initialPhone]);

  const orderTotals = useMemo(
    () => ({
      subtotal: Number(order?.subtotal || 0),
      total: Number(order?.total || 0)
    }),
    [order]
  );
  const customerLocation = useMemo(
    () => formatCustomerLocation(order?.customer),
    [order]
  );

  function getReviewForm(orderItemId) {
    return reviewForms[orderItemId] || initialReviewForm;
  }

  function getReturnForm(orderItemId) {
    return returnForms[orderItemId] || initialReturnForm;
  }

  function updateReviewForm(orderItemId, key, value) {
    setReviewForms((current) => ({
      ...current,
      [orderItemId]: {
        ...initialReviewForm,
        ...(current[orderItemId] || {}),
        [key]: value
      }
    }));
  }

  function updateReturnForm(orderItemId, key, value) {
    setReturnForms((current) => ({
      ...current,
      [orderItemId]: {
        ...initialReturnForm,
        ...(current[orderItemId] || {}),
        [key]: value
      }
    }));
  }

  async function handleLookup(nextOrderId = orderId, nextPhone = phone) {
    if (!String(nextOrderId || "").trim() || !String(nextPhone || "").trim()) {
      setError("Please provide both order ID and phone number.");
      return;
    }

    setLoading(true);
    setError("");
    setMessage("");

    try {
      const payload = await apiFetch("/api/orders/lookup", {
        method: "POST",
        data: {
          orderId: String(nextOrderId || "").trim(),
          phone: String(nextPhone || "").trim()
        }
      });

      setOrder(payload?.data || null);
      setOrderId(String(nextOrderId || "").trim());
      setPhone(String(nextPhone || "").trim());
      setActiveReviewItemId("");
      setActiveReturnItemId("");
    } catch (requestError) {
      setOrder(null);
      setError(requestError.message || "Unable to find order.");
    } finally {
      setLoading(false);
    }
  }

  async function handleReviewSubmit(orderItemId) {
    const form = getReviewForm(orderItemId);

    setSubmitting(`review-${orderItemId}`);
    setError("");
    setMessage("");

    try {
      const payload = await apiFetch(
        `/api/orders/${encodeURIComponent(order?.orderId || "")}/reviews`,
        {
          method: "POST",
          data: {
            phone,
            orderItemId,
            rating: Number(form.rating || 5),
            title: form.title,
            comment: form.comment
          }
        }
      );

      setOrder(payload?.data || null);
      setReviewForms((current) => ({
        ...current,
        [orderItemId]: initialReviewForm
      }));
      setActiveReviewItemId("");
      setMessage(content.orderManageReviewSubmittedLabel);
    } catch (requestError) {
      setError(requestError.message || "Unable to submit review.");
    } finally {
      setSubmitting("");
    }
  }

  async function handleReturnSubmit(orderItemId) {
    const form = getReturnForm(orderItemId);

    setSubmitting(`return-${orderItemId}`);
    setError("");
    setMessage("");

    try {
      const payload = await apiFetch(
        `/api/orders/${encodeURIComponent(order?.orderId || "")}/returns`,
        {
          method: "POST",
          data: {
            phone,
            orderItemId,
            reason: form.reason,
            description: form.description
          }
        }
      );

      setOrder(payload?.data || null);
      setReturnForms((current) => ({
        ...current,
        [orderItemId]: initialReturnForm
      }));
      setActiveReturnItemId("");
      setMessage(content.orderManageReturnSubmittedLabel);
    } catch (requestError) {
      setError(requestError.message || "Unable to submit return request.");
    } finally {
      setSubmitting("");
    }
  }

  return (
    <div className="page-shell section-shell">
      <div className="mx-auto max-w-6xl space-y-8">
        <div className="max-w-3xl">
          <p className="section-kicker">{content.orderManageEyebrow}</p>
          <h1 className="mt-5 section-title">{content.orderManageTitle}</h1>
          <p className="mt-5 section-copy">{content.orderManageCopy}</p>
        </div>

        <div className="surface-card p-6 sm:p-8">
          <div className="grid gap-5 lg:grid-cols-[1fr_1fr_auto]">
            <label className="space-y-2">
              <span className="text-sm font-semibold text-brand-text">
                {content.orderSuccessOrderIdLabel}
              </span>
              <input
                value={orderId}
                onChange={(event) => setOrderId(event.target.value)}
                className="w-full rounded-2xl border border-brand-border bg-brand-background px-4 py-3 outline-none focus:border-brand-secondary focus:shadow-focus"
                placeholder="ORD-000001"
              />
            </label>
            <label className="space-y-2">
              <span className="text-sm font-semibold text-brand-text">
                {content.checkoutFieldPhoneLabel}
              </span>
              <input
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                className="w-full rounded-2xl border border-brand-border bg-brand-background px-4 py-3 outline-none focus:border-brand-secondary focus:shadow-focus"
                placeholder="03xx xxx xxxx"
              />
            </label>
            <div className="flex items-end">
              <button
                type="button"
                onClick={() => handleLookup()}
                disabled={loading}
                className="button-primary w-full gap-2 justify-center"
              >
                <Search size={16} />
                {loading
                  ? "Finding..."
                  : content.orderManageLookupButtonLabel}
              </button>
            </div>
          </div>
        </div>

        {message ? (
          <div className="flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            <CheckCircle2 size={18} className="mt-0.5 shrink-0" />
            <p>{message}</p>
          </div>
        ) : null}

        {error ? (
          <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            <AlertCircle size={18} className="mt-0.5 shrink-0" />
            <p>{error}</p>
          </div>
        ) : null}

        {!order ? (
          <div className="surface-card p-10 text-center">
            <p className="section-kicker">{content.orderManageEyebrow}</p>
            <h2 className="mt-5 font-display text-4xl text-brand-primary">
              {content.orderManageLookupEmptyTitle}
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-brand-muted">
              {content.orderManageLookupEmptyCopy}
            </p>
          </div>
        ) : (
          <div className="grid gap-8 xl:grid-cols-[0.76fr_1.24fr]">
            <aside className="space-y-6 xl:sticky xl:top-28 xl:h-fit">
              <div className="surface-card p-6">
                <div className="flex flex-wrap items-center gap-3">
                  <StatusBadge tone={getOrderStatusTone(order.status)}>
                    {order.status?.replace(/_/g, " ")}
                  </StatusBadge>
                  <p className="text-sm font-semibold text-brand-primary">
                    {order.orderId}
                  </p>
                </div>

                <div className="mt-6 space-y-4">
                  <div className="flex items-center justify-between text-sm text-brand-muted">
                    <span>{content.trackStatusLabel}</span>
                    <span className="font-semibold text-brand-primary">
                      {order.status?.replace(/_/g, " ")}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm text-brand-muted">
                    <span>{content.orderSuccessPaymentLabel}</span>
                    <span className="font-semibold text-brand-primary">
                      {order.paymentMethodName}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm text-brand-muted">
                    <span>{content.cartSubtotalLabel}</span>
                    <span className="font-semibold text-brand-primary">
                      {formatCurrency(orderTotals.subtotal)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm text-brand-muted">
                    <span>{content.orderSuccessTotalLabel}</span>
                    <span className="font-semibold text-brand-primary">
                      {formatCurrency(orderTotals.total)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm text-brand-muted">
                    <span>{content.checkoutFieldNameLabel}</span>
                    <span className="font-semibold text-brand-primary">
                      {order.customer?.name}
                    </span>
                  </div>
                  {customerLocation ? (
                    <div className="flex items-center justify-between text-sm text-brand-muted">
                      <span>{content.checkoutFieldCityLabel}</span>
                      <span className="text-right font-semibold text-brand-primary">
                        {customerLocation}
                      </span>
                    </div>
                  ) : null}
                  {order.tracking?.trackingNumber ? (
                    <>
                      <div className="flex items-center justify-between text-sm text-brand-muted">
                        <span>{content.trackCourierLabel}</span>
                        <span className="font-semibold text-brand-primary">
                          {order.tracking.courierName || "-"}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm text-brand-muted">
                        <span>{content.trackTrackingNumberLabel}</span>
                        <span className="font-semibold text-brand-primary">
                          {order.tracking.trackingNumber}
                        </span>
                      </div>
                    </>
                  ) : null}
                </div>

                {order.customer?.address ? (
                  <div className="mt-6 rounded-2xl bg-brand-background px-4 py-3">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-secondary">
                      {content.checkoutFieldAddressLabel}
                    </p>
                    <p className="mt-2 text-sm leading-7 text-brand-muted">
                      {order.customer.address}
                    </p>
                  </div>
                ) : null}

                {order.notes ? (
                  <div className="mt-6 rounded-2xl bg-brand-background px-4 py-3">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-secondary">
                      {content.checkoutOrderNoteLabel}
                    </p>
                    <p className="mt-2 text-sm leading-7 text-brand-muted">
                      {order.notes}
                    </p>
                  </div>
                ) : null}
              </div>

              <div className="surface-card p-6">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-secondary">
                  Help
                </p>
                <p className="mt-3 text-sm leading-7 text-brand-muted">
                  Reviews are available after the order is marked completed. Return requests follow the return policy set on each product.
                </p>
                <div className="mt-5 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => handleLookup(order.orderId, phone)}
                    className="button-secondary gap-2"
                  >
                    <RotateCcw size={16} />
                    Refresh Order
                  </button>
                  <Link href="/" className="button-secondary">
                    Continue Shopping
                  </Link>
                </div>
              </div>
            </aside>

            <section className="space-y-5">
              <div>
                <p className="section-kicker">{content.orderManageItemsTitle}</p>
                <h2 className="mt-4 text-3xl font-semibold text-brand-primary">
                  {order.items?.length || 0} item{order.items?.length === 1 ? "" : "s"}
                </h2>
              </div>

              {(order.items || []).map((item) => {
                const reviewForm = getReviewForm(item._id);
                const returnForm = getReturnForm(item._id);
                const eligibleUntil = formatDate(item.returnPolicy?.eligibleUntil);

                return (
                  <article key={item._id} className="surface-card p-5 sm:p-6">
                    <div className="flex flex-col gap-5 sm:flex-row">
                      <div className="h-28 w-full overflow-hidden rounded-[24px] bg-brand-background sm:w-28">
                        <img
                          src={item.image}
                          alt={item.productName}
                          className="h-full w-full object-cover"
                        />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-xl font-semibold text-brand-primary">
                            {item.productName}
                          </h3>
                          <StatusBadge>{`Qty ${item.quantity}`}</StatusBadge>
                          {item.review ? (
                            <StatusBadge tone="success">
                              {content.orderManageReviewSubmittedLabel}
                            </StatusBadge>
                          ) : null}
                          {item.returnRequest ? (
                            <StatusBadge
                              tone={getReturnStatusTone(item.returnRequest.status)}
                            >
                              {`Return ${item.returnRequest.status}`}
                            </StatusBadge>
                          ) : null}
                        </div>

                        {(item.variantLabel || item.sizeLabel) ? (
                          <p className="mt-2 text-xs font-semibold uppercase tracking-[0.14em] text-brand-secondary">
                            {[item.variantLabel, item.sizeLabel]
                              .filter(Boolean)
                              .join(" / ")}
                          </p>
                        ) : null}

                        <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-brand-muted">
                          <span>{formatCurrency(item.price)}</span>
                          {item.warranty?.days ? (
                            <span>{`${item.warranty.days} day warranty`}</span>
                          ) : null}
                          {item.returnPolicy?.days ? (
                            <span>{`${item.returnPolicy.days} day returns`}</span>
                          ) : null}
                          {eligibleUntil ? <span>{`Return until ${eligibleUntil}`}</span> : null}
                        </div>

                        <div className="mt-5 flex flex-wrap gap-3">
                          {item.product ? (
                            <Link
                              href={`/product/${item.product}`}
                              className="button-secondary"
                            >
                              View Product
                            </Link>
                          ) : null}

                          {item.canReview ? (
                            <button
                              type="button"
                              onClick={() =>
                                setActiveReviewItemId((current) =>
                                  current === String(item._id) ? "" : String(item._id)
                                )
                              }
                              className="button-secondary gap-2"
                            >
                              <MessageSquare size={16} />
                              {content.orderManageReviewActionLabel}
                            </button>
                          ) : null}

                          {item.canReturn ? (
                            <button
                              type="button"
                              onClick={() =>
                                setActiveReturnItemId((current) =>
                                  current === String(item._id) ? "" : String(item._id)
                                )
                              }
                              className="button-secondary gap-2"
                            >
                              <RotateCcw size={16} />
                              {content.orderManageReturnActionLabel}
                            </button>
                          ) : null}
                        </div>

                        {item.review ? (
                          <div className="mt-5 rounded-[22px] bg-brand-background p-4">
                            <div className="flex flex-wrap items-center justify-between gap-3">
                              <p className="font-semibold text-brand-primary">
                                {item.review.title || "Verified review"}
                              </p>
                              <div className="flex items-center gap-1">
                                {renderStars(item.review.rating)}
                              </div>
                            </div>
                            {item.review.comment ? (
                              <p className="mt-3 text-sm leading-7 text-brand-muted">
                                {item.review.comment}
                              </p>
                            ) : null}
                          </div>
                        ) : null}

                        {item.returnRequest ? (
                          <div className="mt-5 rounded-[22px] bg-brand-background p-4">
                            <div className="flex flex-wrap items-center gap-2">
                              <StatusBadge
                                tone={getReturnStatusTone(item.returnRequest.status)}
                              >
                                {`Return ${item.returnRequest.status}`}
                              </StatusBadge>
                              {item.returnRequest.reason ? (
                                <StatusBadge>{item.returnRequest.reason}</StatusBadge>
                              ) : null}
                            </div>
                            {item.returnRequest.description ? (
                              <p className="mt-3 text-sm leading-7 text-brand-muted">
                                {item.returnRequest.description}
                              </p>
                            ) : null}
                            {item.returnRequest.resolutionNote ? (
                              <p className="mt-3 text-sm leading-7 text-brand-muted">
                                Resolution: {item.returnRequest.resolutionNote}
                              </p>
                            ) : null}
                          </div>
                        ) : null}

                        {activeReviewItemId === String(item._id) ? (
                          <div className="mt-5 rounded-[24px] border border-brand-border bg-brand-background/70 p-4 sm:p-5">
                            <div className="grid gap-4 sm:grid-cols-2">
                              <label className="space-y-2">
                                <span className="text-sm font-semibold text-brand-text">
                                  {content.orderManageReviewRatingLabel}
                                </span>
                                <select
                                  value={reviewForm.rating}
                                  onChange={(event) =>
                                    updateReviewForm(item._id, "rating", event.target.value)
                                  }
                                  className="w-full rounded-2xl border border-brand-border bg-white px-4 py-3 outline-none focus:border-brand-secondary focus:shadow-focus"
                                >
                                  {reviewRatings.map((rating) => (
                                    <option key={rating} value={rating}>
                                      {rating} star{rating === 1 ? "" : "s"}
                                    </option>
                                  ))}
                                </select>
                              </label>

                              <label className="space-y-2">
                                <span className="text-sm font-semibold text-brand-text">
                                  {content.orderManageReviewTitleFieldLabel}
                                </span>
                                <input
                                  value={reviewForm.title}
                                  onChange={(event) =>
                                    updateReviewForm(item._id, "title", event.target.value)
                                  }
                                  className="w-full rounded-2xl border border-brand-border bg-white px-4 py-3 outline-none focus:border-brand-secondary focus:shadow-focus"
                                  placeholder="How was this item?"
                                />
                              </label>

                              <label className="space-y-2 sm:col-span-2">
                                <span className="text-sm font-semibold text-brand-text">
                                  {content.orderManageReviewCommentFieldLabel}
                                </span>
                                <textarea
                                  rows={4}
                                  value={reviewForm.comment}
                                  onChange={(event) =>
                                    updateReviewForm(item._id, "comment", event.target.value)
                                  }
                                  className="w-full rounded-2xl border border-brand-border bg-white px-4 py-3 outline-none focus:border-brand-secondary focus:shadow-focus"
                                  placeholder="Share a short verified review."
                                />
                              </label>
                            </div>

                            <div className="mt-4 flex flex-wrap gap-3">
                              <button
                                type="button"
                                onClick={() => handleReviewSubmit(item._id)}
                                disabled={submitting === `review-${item._id}`}
                                className="button-primary"
                              >
                                {submitting === `review-${item._id}`
                                  ? "Submitting..."
                                  : content.orderManageReviewActionLabel}
                              </button>
                              <button
                                type="button"
                                onClick={() => setActiveReviewItemId("")}
                                className="button-secondary"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : null}

                        {activeReturnItemId === String(item._id) ? (
                          <div className="mt-5 rounded-[24px] border border-brand-border bg-brand-background/70 p-4 sm:p-5">
                            <div className="grid gap-4 sm:grid-cols-2">
                              <label className="space-y-2">
                                <span className="text-sm font-semibold text-brand-text">
                                  {content.orderManageReturnReasonLabel}
                                </span>
                                <select
                                  value={returnForm.reason}
                                  onChange={(event) =>
                                    updateReturnForm(item._id, "reason", event.target.value)
                                  }
                                  className="w-full rounded-2xl border border-brand-border bg-white px-4 py-3 outline-none focus:border-brand-secondary focus:shadow-focus"
                                >
                                  <option value="">Select a reason</option>
                                  {returnReasonOptions.map((reason) => (
                                    <option key={reason} value={reason}>
                                      {reason}
                                    </option>
                                  ))}
                                </select>
                              </label>

                              <div className="rounded-2xl bg-white px-4 py-3 text-sm leading-7 text-brand-muted">
                                {item.returnPolicy?.description ||
                                  "Return policy details will be reviewed by support."}
                              </div>

                              <label className="space-y-2 sm:col-span-2">
                                <span className="text-sm font-semibold text-brand-text">
                                  {content.orderManageReturnDescriptionLabel}
                                </span>
                                <textarea
                                  rows={4}
                                  value={returnForm.description}
                                  onChange={(event) =>
                                    updateReturnForm(
                                      item._id,
                                      "description",
                                      event.target.value
                                    )
                                  }
                                  className="w-full rounded-2xl border border-brand-border bg-white px-4 py-3 outline-none focus:border-brand-secondary focus:shadow-focus"
                                  placeholder="Describe the issue and what happened after delivery."
                                />
                              </label>
                            </div>

                            <div className="mt-4 flex flex-wrap gap-3">
                              <button
                                type="button"
                                onClick={() => handleReturnSubmit(item._id)}
                                disabled={submitting === `return-${item._id}`}
                                className="button-primary"
                              >
                                {submitting === `return-${item._id}`
                                  ? "Submitting..."
                                  : content.orderManageReturnActionLabel}
                              </button>
                              <button
                                type="button"
                                onClick={() => setActiveReturnItemId("")}
                                className="button-secondary"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </article>
                );
              })}
            </section>
          </div>
        )}
      </div>
    </div>
  );
}
