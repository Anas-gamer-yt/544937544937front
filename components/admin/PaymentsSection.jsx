import { useMemo, useState } from "react";
import { Pencil, Save, Trash2 } from "lucide-react";
import {
  Badge,
  EmptyState,
  Field,
  SearchInput,
  SectionCard,
  SelectInput,
  TextArea,
  TextInput,
  ToggleInput
} from "@/components/admin/AdminShared";

const paymentTypes = ["wallet", "bank", "cash", "card", "other"];

export default function PaymentsSection({
  payments,
  paymentForm,
  setPaymentForm,
  submitting,
  onSubmit,
  onEdit,
  onToggle,
  onDelete,
  onReset
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const filteredPayments = useMemo(() => {
    const normalizedQuery = String(searchQuery || "").trim().toLowerCase();

    if (!normalizedQuery) {
      return payments;
    }

    return payments.filter((payment) =>
      [
        payment.name,
        payment.type,
        payment.accountTitle,
        payment.accountNumber,
        payment.instructions,
        payment.isEnabled ? "enabled" : "disabled"
      ]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(normalizedQuery))
    );
  }, [payments, searchQuery]);

  return (
    <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
      <SectionCard
        title={paymentForm.id ? "Edit payment method" : "New payment method"}
        copy="These methods appear directly on the public checkout page."
      >
        <form onSubmit={onSubmit} className="space-y-4">
          <Field label="Name">
            <TextInput
              value={paymentForm.name}
              onChange={(event) =>
                setPaymentForm((current) => ({
                  ...current,
                  name: event.target.value
                }))
              }
            />
          </Field>

          <Field label="Type">
            <SelectInput
              value={paymentForm.type}
              onChange={(event) =>
                setPaymentForm((current) => ({
                  ...current,
                  type: event.target.value
                }))
              }
            >
              {paymentTypes.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </SelectInput>
          </Field>

          <Field label="Account title">
            <TextInput
              value={paymentForm.accountTitle}
              onChange={(event) =>
                setPaymentForm((current) => ({
                  ...current,
                  accountTitle: event.target.value
                }))
              }
            />
          </Field>

          <Field label="Account number">
            <TextInput
              value={paymentForm.accountNumber}
              onChange={(event) =>
                setPaymentForm((current) => ({
                  ...current,
                  accountNumber: event.target.value
                }))
              }
            />
          </Field>

          <Field label="Instructions">
            <TextArea
              rows={4}
              value={paymentForm.instructions}
              onChange={(event) =>
                setPaymentForm((current) => ({
                  ...current,
                  instructions: event.target.value
                }))
              }
            />
          </Field>

          <Field label="Sort order">
            <TextInput
              type="number"
              value={paymentForm.sortOrder}
              onChange={(event) =>
                setPaymentForm((current) => ({
                  ...current,
                  sortOrder: event.target.value
                }))
              }
            />
          </Field>

          <ToggleInput
            label="Enabled"
            checked={paymentForm.isEnabled}
            onChange={(event) =>
              setPaymentForm((current) => ({
                ...current,
                isEnabled: event.target.checked
              }))
            }
          />

          <div className="flex flex-wrap gap-3">
            <button
              type="submit"
              disabled={submitting === "payment"}
              className="button-primary gap-2"
            >
              <Save size={16} />
              {submitting === "payment" ? "Saving..." : "Save Payment"}
            </button>
            {paymentForm.id ? (
              <button type="button" onClick={onReset} className="button-secondary">
                Cancel Edit
              </button>
            ) : null}
          </div>
        </form>
      </SectionCard>

      <SectionCard
        title="Payment methods"
        copy="Disable a method without deleting it if you want to hide it from checkout temporarily."
      >
        <div className="mb-5">
          <SearchInput
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Search payment methods, account info, or status"
          />
        </div>
        <div className="space-y-4">
          {filteredPayments.map((payment) => (
            <div key={payment._id} className="rounded-[24px] bg-brand-background p-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-lg font-semibold text-brand-primary">
                      {payment.name}
                    </p>
                    <Badge>{payment.type}</Badge>
                    <Badge tone={payment.isEnabled ? "success" : "warning"}>
                      {payment.isEnabled ? "enabled" : "disabled"}
                    </Badge>
                  </div>
                  <p className="mt-2 text-sm text-brand-muted">
                    {payment.accountTitle || "No account title"}
                  </p>
                  <p className="mt-1 text-sm text-brand-muted">
                    {payment.accountNumber || "No account number"}
                  </p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => onEdit(payment)}
                    className="button-secondary gap-2"
                  >
                    <Pencil size={16} />
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => onToggle(payment._id)}
                    disabled={submitting === `toggle-payment-${payment._id}`}
                    className="button-secondary"
                  >
                    Toggle
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(payment._id)}
                    disabled={submitting === `delete-payment-${payment._id}`}
                    className="inline-flex items-center gap-2 rounded-full border border-red-200 bg-red-50 px-5 py-3 text-sm font-semibold text-red-700 hover:bg-red-100"
                  >
                    <Trash2 size={16} />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}

          {!payments.length ? (
            <EmptyState
              title="No payment methods yet"
              copy="Add at least one enabled payment method before customers check out."
            />
          ) : null}

          {payments.length && !filteredPayments.length ? (
            <EmptyState
              title="No matching payment methods"
              copy="Try a different payment name, method type, account detail, or status."
            />
          ) : null}
        </div>
      </SectionCard>
    </div>
  );
}
