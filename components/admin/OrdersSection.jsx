import { useMemo, useState } from "react";
import {
  Badge,
  EmptyState,
  Field,
  SearchInput,
  SectionCard,
  SelectInput,
  TextArea
} from "@/components/admin/AdminShared";
import { formatCurrency } from "@/lib/fetcher";

const orderStatuses = [
  { value: "pending_payment", label: "Pending Payment" },
  { value: "paid", label: "Paid" },
  { value: "processing", label: "Processing" },
  { value: "completed", label: "Completed" }
];

const returnStatuses = [
  { value: "requested", label: "Requested" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
  { value: "completed", label: "Completed" }
];

function getOrderBadgeTone(status) {
  if (status === "completed" || status === "paid") {
    return "success";
  }

  if (status === "processing") {
    return "neutral";
  }

  return "warning";
}

function canViewInternalProductUrl(role) {
  return ["super_admin", "manager", "catalog"].includes(
    String(role || "").toLowerCase()
  );
}

function getReturnBadgeTone(status) {
  if (status === "completed" || status === "approved") {
    return "success";
  }

  if (status === "requested") {
    return "warning";
  }

  return "neutral";
}

export default function OrdersSection({
  orders,
  currentUserRole,
  submitting,
  onUpdateStatus,
  onUpdateReturnStatus
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusDrafts, setStatusDrafts] = useState({});
  const [courierDrafts, setCourierDrafts] = useState({});
  const [trackingDrafts, setTrackingDrafts] = useState({});
  const [returnStatusDrafts, setReturnStatusDrafts] = useState({});
  const [resolutionNotes, setResolutionNotes] = useState({});
  const showProductUrl = canViewInternalProductUrl(currentUserRole);
  const filteredOrders = useMemo(() => {
    const normalizedQuery = String(searchQuery || "").trim().toLowerCase();

    if (!normalizedQuery) {
      return orders;
    }

    return orders.filter((order) =>
      [
        order.orderId,
        order.status,
        order.paymentMethodName,
        order.tracking?.courierName,
        order.tracking?.trackingNumber,
        order.customer?.name,
        order.customer?.phone,
        order.customer?.province,
        order.customer?.district,
        order.customer?.city,
        order.customer?.area,
        order.customer?.address,
        ...(order.items || []).flatMap((item) => [
          item.productName,
          item.variantLabel,
          item.sizeLabel,
          item.sku,
          item.productUrl
        ]),
        ...(order.reviews || []).flatMap((review) => [
          review.productName,
          review.title,
          review.comment
        ]),
        ...(order.returnRequests || []).flatMap((request) => [
          request.productName,
          request.reason,
          request.description,
          request.status
        ])
      ]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(normalizedQuery))
    );
  }, [orders, searchQuery]);

  function getDraftReturnStatus(returnRequest) {
    return returnStatusDrafts[returnRequest._id] || returnRequest.status;
  }

  function getDraftStatus(order) {
    return statusDrafts[order._id] || order.status;
  }

  function getDraftCourier(order) {
    return courierDrafts[order._id] ?? order.tracking?.courierName ?? "";
  }

  function getDraftTracking(order) {
    return trackingDrafts[order._id] ?? order.tracking?.trackingNumber ?? "";
  }

  function getResolutionNote(returnRequest) {
    return resolutionNotes[returnRequest._id] ?? returnRequest.resolutionNote ?? "";
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

  return (
    <SectionCard
      title="Customer orders"
      copy="Review the order stream and update payment or fulfillment status directly."
    >
      <div className="mb-5">
        <SearchInput
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          placeholder="Search order ID, customer, item, product URL, review, or return request"
        />
      </div>
      <div className="space-y-4">
        {filteredOrders.map((order) => {
          const customerLocation = formatCustomerLocation(order.customer);

          return (
            <div key={order._id} className="rounded-[24px] bg-brand-background p-5">
            <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-3">
                  <p className="text-lg font-semibold text-brand-primary">
                    {order.orderId}
                  </p>
                  <Badge tone={getOrderBadgeTone(order.status)}>
                    {order.status.replace(/_/g, " ")}
                  </Badge>
                </div>
                <p className="mt-3 text-sm leading-7 text-brand-muted">
                  {order.customer?.name} · {order.customer?.phone}
                </p>
                {customerLocation ? (
                  <p className="text-sm leading-7 text-brand-muted">
                    {customerLocation}
                  </p>
                ) : null}
                <p className="text-sm leading-7 text-brand-muted">
                  {order.customer?.address}
                </p>
                <p className="mt-3 text-sm font-semibold text-brand-primary">
                  {order.paymentMethodName} · {formatCurrency(order.total)}
                </p>
                {order.tracking?.trackingNumber ? (
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    {order.tracking?.courierName ? (
                      <Badge>{order.tracking.courierName}</Badge>
                    ) : null}
                    <Badge tone="success">
                      Tracking: {order.tracking.trackingNumber}
                    </Badge>
                  </div>
                ) : null}
                <div className="mt-4 space-y-2">
                  {(order.items || []).map((item) => (
                    <div
                      key={`${order._id}-${item._id || item.productName}`}
                      className="rounded-2xl border border-brand-border bg-white px-4 py-3"
                    >
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge>{item.productName} × {item.quantity}</Badge>
                        {item.variantLabel ? <Badge>{item.variantLabel}</Badge> : null}
                        {item.sizeLabel ? <Badge>{item.sizeLabel}</Badge> : null}
                        {item.sku ? <Badge>{item.sku}</Badge> : null}
                        {showProductUrl && item.productUrl ? (
                          <a
                            href={item.productUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-sm font-semibold text-brand-secondary hover:text-brand-primary"
                          >
                            Product URL
                          </a>
                        ) : null}
                      </div>
                      {(order.reviews || []).some(
                        (review) => String(review.orderItemId) === String(item._id)
                      ) ? (
                        <div className="mt-3 space-y-2">
                          {(order.reviews || [])
                            .filter(
                              (review) =>
                                String(review.orderItemId) === String(item._id)
                            )
                            .map((review) => (
                              <div
                                key={review._id}
                                className="rounded-2xl bg-brand-background px-4 py-3"
                              >
                                <div className="flex flex-wrap items-center gap-2">
                                  <Badge tone="success">
                                    Review · {review.rating}/5
                                  </Badge>
                                  {review.title ? <Badge>{review.title}</Badge> : null}
                                </div>
                                {review.comment ? (
                                  <p className="mt-2 text-sm leading-7 text-brand-muted">
                                    {review.comment}
                                  </p>
                                ) : null}
                              </div>
                            ))}
                        </div>
                      ) : null}

                      {(order.returnRequests || [])
                        .filter(
                          (request) =>
                            String(request.orderItemId) === String(item._id)
                        )
                        .map((request) => (
                          <div
                            key={request._id}
                            className="mt-3 rounded-2xl border border-brand-border bg-brand-background px-4 py-4"
                          >
                            <div className="flex flex-wrap items-center gap-2">
                              <Badge tone={getReturnBadgeTone(request.status)}>
                                Return · {request.status.replace(/_/g, " ")}
                              </Badge>
                              {request.reason ? <Badge>{request.reason}</Badge> : null}
                            </div>

                            {request.description ? (
                              <p className="mt-3 text-sm leading-7 text-brand-muted">
                                {request.description}
                              </p>
                            ) : null}

                            <div className="mt-4 grid gap-4 lg:grid-cols-[0.7fr_1.3fr_auto]">
                              <Field label="Return status">
                                <SelectInput
                                  value={getDraftReturnStatus(request)}
                                  onChange={(event) =>
                                    setReturnStatusDrafts((current) => ({
                                      ...current,
                                      [request._id]: event.target.value
                                    }))
                                  }
                                  disabled={
                                    submitting === `return-${order._id}-${request._id}`
                                  }
                                >
                                  {returnStatuses.map((status) => (
                                    <option key={status.value} value={status.value}>
                                      {status.label}
                                    </option>
                                  ))}
                                </SelectInput>
                              </Field>

                              <Field label="Resolution note">
                                <TextArea
                                  rows={3}
                                  value={getResolutionNote(request)}
                                  onChange={(event) =>
                                    setResolutionNotes((current) => ({
                                      ...current,
                                      [request._id]: event.target.value
                                    }))
                                  }
                                  placeholder="Add the resolution, approval details, or rejection reason"
                                />
                              </Field>

                              <div className="flex items-end">
                                <button
                                  type="button"
                                  onClick={() =>
                                    onUpdateReturnStatus(
                                      order._id,
                                      request._id,
                                      getDraftReturnStatus(request),
                                      getResolutionNote(request)
                                    )
                                  }
                                  disabled={
                                    submitting === `return-${order._id}-${request._id}`
                                  }
                                  className="button-secondary w-full justify-center"
                                >
                                  {submitting === `return-${order._id}-${request._id}`
                                    ? "Saving..."
                                    : "Save return update"}
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  ))}
                </div>
              </div>
              <div className="w-full max-w-xs space-y-3">
                <Field label="Update status">
                  <SelectInput
                    value={getDraftStatus(order)}
                    onChange={(event) =>
                      setStatusDrafts((current) => ({
                        ...current,
                        [order._id]: event.target.value
                      }))
                    }
                    disabled={submitting === `order-${order._id}`}
                  >
                    {orderStatuses.map((status) => (
                      <option key={status.value} value={status.value}>
                        {status.label}
                      </option>
                    ))}
                  </SelectInput>
                </Field>
                <Field label="Courier name" hint="Optional label shown to the customer.">
                  <input
                    value={getDraftCourier(order)}
                    onChange={(event) =>
                      setCourierDrafts((current) => ({
                        ...current,
                        [order._id]: event.target.value
                      }))
                    }
                    disabled={submitting === `order-${order._id}`}
                    className="w-full rounded-2xl border border-brand-border bg-brand-background px-4 py-3 outline-none focus:border-brand-secondary focus:shadow-focus"
                    placeholder="Leopards, TCS, M&P"
                  />
                </Field>
                <Field
                  label="Tracking number"
                  hint="Required before the order can move to processing."
                >
                  <input
                    value={getDraftTracking(order)}
                    onChange={(event) =>
                      setTrackingDrafts((current) => ({
                        ...current,
                        [order._id]: event.target.value
                      }))
                    }
                    disabled={submitting === `order-${order._id}`}
                    className="w-full rounded-2xl border border-brand-border bg-brand-background px-4 py-3 outline-none focus:border-brand-secondary focus:shadow-focus"
                    placeholder="Enter courier tracking number"
                  />
                </Field>
                <button
                  type="button"
                  onClick={() =>
                    onUpdateStatus(order._id, getDraftStatus(order), {
                      courierName: getDraftCourier(order),
                      trackingNumber: getDraftTracking(order)
                    })
                  }
                  disabled={submitting === `order-${order._id}`}
                  className="button-secondary w-full justify-center"
                >
                  {submitting === `order-${order._id}`
                    ? "Saving..."
                    : "Save order update"}
                </button>
              </div>
            </div>
            </div>
          );
        })}

        {!orders.length ? (
          <EmptyState
            title="No orders available"
            copy="Orders created through checkout will show up here."
          />
        ) : null}

        {orders.length && !filteredOrders.length ? (
          <EmptyState
            title="No matching orders"
            copy="Try a different order ID, customer detail, product name, review text, or return keyword."
          />
        ) : null}
      </div>
    </SectionCard>
  );
}
