"use client";

import { useEffect, useState } from "react";
import { AlertCircle, CheckCircle2, Search } from "lucide-react";
import { apiFetch } from "@/lib/fetcher";
import { resolveSiteContent } from "@/lib/siteContent";

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

function getStatusTone(status) {
  if (status === "completed" || status === "processing") {
    return "success";
  }

  if (status === "pending_payment" || status === "paid") {
    return "warning";
  }

  return "neutral";
}

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

export default function TrackOrderClient({
  initialOrderId = "",
  siteContent
}) {
  const content = resolveSiteContent(siteContent);
  const [orderId, setOrderId] = useState(initialOrderId);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [didAutoLookup, setDidAutoLookup] = useState(false);

  useEffect(() => {
    if (didAutoLookup || !initialOrderId) {
      return;
    }

    setDidAutoLookup(true);
    void handleTrack(initialOrderId);
  }, [didAutoLookup, initialOrderId]);

  async function handleTrack(nextOrderId = orderId) {
    const normalizedOrderId = String(nextOrderId || "").trim();

    if (!normalizedOrderId) {
      setError("Please enter your order number.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const payload = await apiFetch("/api/orders/track", {
        method: "POST",
        data: {
          orderId: normalizedOrderId
        }
      });

      setOrder(payload?.data || null);
      setOrderId(normalizedOrderId);
    } catch (requestError) {
      setOrder(null);
      setError(requestError.message || "Unable to track order.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page-shell section-shell">
      <div className="mx-auto max-w-5xl space-y-8">
        <div className="max-w-3xl">
          <p className="section-kicker">{content.trackPageEyebrow}</p>
          <h1 className="mt-5 section-title">{content.trackPageTitle}</h1>
          <p className="mt-5 section-copy">{content.trackPageCopy}</p>
        </div>

        <div className="surface-card p-6 sm:p-8">
          <div className="grid gap-5 md:grid-cols-[1fr_auto]">
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
            <div className="flex items-end">
              <button
                type="button"
                onClick={() => handleTrack()}
                disabled={loading}
                className="button-primary w-full justify-center gap-2 md:w-auto"
              >
                <Search size={16} />
                {loading ? "Tracking..." : content.trackLookupButtonLabel}
              </button>
            </div>
          </div>
        </div>

        {error ? (
          <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            <AlertCircle size={18} className="mt-0.5 shrink-0" />
            <p>{error}</p>
          </div>
        ) : null}

        {!order ? (
          <div className="surface-card p-10 text-center">
            <p className="section-kicker">{content.trackPageEyebrow}</p>
            <h2 className="mt-5 font-display text-4xl text-brand-primary">
              {content.trackLookupEmptyTitle}
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-brand-muted">
              {content.trackLookupEmptyCopy}
            </p>
          </div>
        ) : (
          <div className="grid gap-8 xl:grid-cols-[0.8fr_1.2fr]">
            <aside className="space-y-6 xl:sticky xl:top-28 xl:h-fit">
              <div className="surface-card p-6">
                <div className="flex flex-wrap items-center gap-3">
                  <StatusBadge tone={getStatusTone(order.status)}>
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
                    <span>{content.trackCourierLabel}</span>
                    <span className="font-semibold text-brand-primary">
                      {order.tracking?.courierName || "-"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-4 text-sm text-brand-muted">
                    <span>{content.trackTrackingNumberLabel}</span>
                    <span className="text-right font-semibold text-brand-primary">
                      {order.tracking?.trackingNumber || "-"}
                    </span>
                  </div>
                </div>

                {order.tracking?.trackingNumber ? (
                  <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                    <div className="flex items-start gap-3">
                      <CheckCircle2 size={18} className="mt-0.5 shrink-0" />
                      <p>
                        Tracking assigned on{" "}
                        {formatDate(order.tracking?.assignedAt || order.updatedAt)}.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                    {content.trackNoTrackingCopy}
                  </div>
                )}
              </div>
            </aside>

            <section className="space-y-5">
              <div>
                <p className="section-kicker">{content.trackItemsTitle}</p>
                <h2 className="mt-4 text-3xl font-semibold text-brand-primary">
                  {order.items?.length || 0} item{order.items?.length === 1 ? "" : "s"}
                </h2>
              </div>

              {(order.items || []).map((item) => (
                <article
                  key={item._id}
                  className="surface-card flex flex-col gap-5 p-5 sm:flex-row sm:items-center"
                >
                  <div className="h-24 w-full overflow-hidden rounded-[24px] bg-brand-background sm:w-24">
                    <img
                      src={item.image}
                      alt={item.productName}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-xl font-semibold text-brand-primary">
                      {item.productName}
                    </h3>
                    {(item.variantLabel || item.sizeLabel) ? (
                      <p className="mt-2 text-xs font-semibold uppercase tracking-[0.14em] text-brand-secondary">
                        {[item.variantLabel, item.sizeLabel]
                          .filter(Boolean)
                          .join(" / ")}
                      </p>
                    ) : null}
                    <p className="mt-3 text-sm text-brand-muted">
                      Qty {item.quantity}
                    </p>
                  </div>
                </article>
              ))}
            </section>
          </div>
        )}
      </div>
    </div>
  );
}
