"use client";

import Link from "next/link";
import { useEffect } from "react";
import { ArrowRight, CheckCircle2, MessageCircle } from "lucide-react";
import { buildWhatsAppOrderUrl, formatCurrency } from "@/lib/fetcher";
import { resolveSiteContent } from "@/lib/siteContent";

export default function OrderSuccessClient({
  orderId,
  payment,
  total,
  wa,
  name,
  phone,
  siteContent
}) {
  const content = resolveSiteContent(siteContent);
  const whatsappUrl = buildWhatsAppOrderUrl({
    whatsappNumber: wa,
    orderId,
    paymentMethodName: payment,
    total,
    customerName: name
  });

  useEffect(() => {
    if (!whatsappUrl) {
      return undefined;
    }

    const timer = window.setTimeout(() => {
      window.location.assign(whatsappUrl);
    }, 1500);

    return () => window.clearTimeout(timer);
  }, [whatsappUrl]);

  return (
    <div className="page-shell section-shell">
      <div className="surface-card mx-auto max-w-3xl p-8 text-center sm:p-12">
        <span className="mx-auto inline-flex h-20 w-20 items-center justify-center rounded-full bg-brand-secondary/12 text-brand-secondary">
          <CheckCircle2 size={36} />
        </span>
        <p className="mt-6 section-kicker">{content.orderSuccessEyebrow}</p>
        <h1 className="mt-5 font-display text-5xl text-brand-primary sm:text-6xl">
          {content.orderSuccessTitle}
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-brand-muted">
          {content.orderSuccessCopy}
        </p>

        <div className="mt-10 grid gap-4 rounded-[28px] bg-brand-background p-6 text-left sm:grid-cols-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-muted">
              {content.orderSuccessOrderIdLabel}
            </p>
            <p className="mt-2 text-lg font-semibold text-brand-primary">
              {orderId || "Pending"}
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-muted">
              {content.orderSuccessPaymentLabel}
            </p>
            <p className="mt-2 text-lg font-semibold text-brand-primary">
              {payment || "Not selected"}
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-muted">
              {content.orderSuccessTotalLabel}
            </p>
            <p className="mt-2 text-lg font-semibold text-brand-primary">
              {formatCurrency(total)}
            </p>
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
          {whatsappUrl ? (
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="button-primary gap-2"
            >
              <MessageCircle size={16} />
              {content.orderSuccessWhatsAppLabel}
            </a>
          ) : null}
          {orderId && phone ? (
            <Link
              href={`/orders/manage?orderId=${encodeURIComponent(orderId)}&phone=${encodeURIComponent(phone)}`}
              className="button-secondary gap-2"
            >
              Manage Order
            </Link>
          ) : null}
          {orderId ? (
            <Link
              href={`/track-order?orderId=${encodeURIComponent(orderId)}`}
              className="button-secondary gap-2"
            >
              {content.orderSuccessTrackLabel}
            </Link>
          ) : null}
          <Link href="/" className="button-secondary gap-2">
            {content.orderSuccessContinueLabel}
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
}
