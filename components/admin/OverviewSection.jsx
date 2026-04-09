import { Badge, EmptyState, SectionCard } from "@/components/admin/AdminShared";
import { formatCurrency } from "@/lib/fetcher";

function getOrderBadgeTone(status) {
  if (status === "completed" || status === "paid") {
    return "success";
  }

  if (status === "processing") {
    return "neutral";
  }

  return "warning";
}

export default function OverviewSection({
  categories,
  products,
  payments,
  orders
}) {
  const activeCategoryCount = categories.filter((item) => item.isActive).length;
  const enabledPaymentCount = payments.filter((item) => item.isEnabled).length;
  const revenue = orders
    .filter((item) => item.status === "paid" || item.status === "completed")
    .reduce((total, item) => total + Number(item.total || 0), 0);

  return (
    <div className="space-y-6">
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {[
          {
            label: "Active categories",
            value: activeCategoryCount
          },
          {
            label: "Products",
            value: products.length
          },
          {
            label: "Enabled payments",
            value: enabledPaymentCount
          },
          {
            label: "Paid revenue",
            value: formatCurrency(revenue)
          }
        ].map((item) => (
          <div key={item.label} className="surface-card p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-secondary">
              {item.label}
            </p>
            <p className="mt-4 text-3xl font-semibold text-brand-primary">
              {item.value}
            </p>
          </div>
        ))}
      </div>

      <SectionCard
        title="Recent orders"
        copy="Use this snapshot to keep an eye on the latest checkout activity."
      >
        <div className="space-y-4">
          {orders.slice(0, 5).map((order) => (
            <div
              key={order._id}
              className="flex flex-col gap-4 rounded-[24px] bg-brand-background p-5 lg:flex-row lg:items-center lg:justify-between"
            >
              <div>
                <p className="font-semibold text-brand-primary">{order.orderId}</p>
                <p className="mt-1 text-sm text-brand-muted">
                  {order.customer?.name} · {order.customer?.phone}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <Badge tone={getOrderBadgeTone(order.status)}>
                  {order.status.replace(/_/g, " ")}
                </Badge>
                <p className="font-semibold text-brand-primary">
                  {formatCurrency(order.total)}
                </p>
              </div>
            </div>
          ))}

          {!orders.length ? (
            <EmptyState
              title="No orders yet"
              copy="New orders will appear here once customers start checking out."
            />
          ) : null}
        </div>
      </SectionCard>
    </div>
  );
}

