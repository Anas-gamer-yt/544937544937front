import { Search } from "lucide-react";

export function SectionCard({ title, copy, actions, children }) {
  return (
    <section className="surface-card p-6 sm:p-8">
      <div className="flex flex-col gap-4 border-b border-brand-border pb-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-secondary">
            Admin Section
          </p>
          <h2 className="mt-3 text-2xl font-semibold text-white">
            {title}
          </h2>
          {copy ? (
            <p className="mt-2 max-w-2xl text-sm leading-7 text-[#b8c7e6]">
              {copy}
            </p>
          ) : null}
        </div>
        {actions ? <div className="flex flex-wrap gap-3">{actions}</div> : null}
      </div>
      <div className="pt-6">{children}</div>
    </section>
  );
}

export function TabButton({ icon: Icon, label, active, onClick, count }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center justify-between rounded-[24px] border px-4 py-4 text-left ${
        active
          ? "border-brand-secondary bg-brand-secondary/12 text-white shadow-focus"
          : "border-brand-border bg-white text-brand-muted hover:border-brand-secondary/40 hover:text-brand-primary"
      }`}
    >
      <span className="flex items-center gap-3">
        <Icon size={18} />
        <span className="font-semibold">{label}</span>
      </span>
      {count !== undefined ? (
        <span className="rounded-full bg-brand-background px-3 py-1 text-xs font-semibold text-brand-primary">
          {count}
        </span>
      ) : null}
    </button>
  );
}

export function Field({ label, hint, children }) {
  return (
    <label className="space-y-2">
      <span className="text-sm font-semibold text-brand-text">{label}</span>
      {children}
      {hint ? <p className="text-xs text-brand-muted">{hint}</p> : null}
    </label>
  );
}

export function TextInput(props) {
  return (
    <input
      {...props}
      className={`w-full rounded-2xl border border-brand-border bg-brand-background px-4 py-3 text-brand-text outline-none placeholder:text-brand-muted focus:border-brand-secondary focus:shadow-focus ${
        props.className || ""
      }`}
    />
  );
}

export function SearchInput(props) {
  return (
    <div className="relative">
      <Search
        size={16}
        className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-brand-muted"
      />
      <TextInput {...props} className={`pl-11 ${props.className || ""}`} />
    </div>
  );
}

export function TextArea(props) {
  return (
    <textarea
      {...props}
      className={`w-full rounded-2xl border border-brand-border bg-brand-background px-4 py-3 text-brand-text outline-none placeholder:text-brand-muted focus:border-brand-secondary focus:shadow-focus ${
        props.className || ""
      }`}
    />
  );
}

export function SelectInput(props) {
  return (
    <select
      {...props}
      className={`w-full rounded-2xl border border-brand-border bg-brand-background px-4 py-3 text-brand-text outline-none focus:border-brand-secondary focus:shadow-focus ${
        props.className || ""
      }`}
    />
  );
}

export function ToggleInput({ label, checked, onChange, hint }) {
  return (
    <label className="flex items-start justify-between gap-4 rounded-2xl border border-brand-border bg-brand-background px-4 py-3">
      <span>
        <span className="block text-sm font-semibold text-brand-text">
          {label}
        </span>
        {hint ? <span className="mt-1 block text-xs text-brand-muted">{hint}</span> : null}
      </span>
      <input type="checkbox" checked={checked} onChange={onChange} />
    </label>
  );
}

export function EmptyState({ title, copy }) {
  return (
    <div className="rounded-[24px] border border-dashed border-brand-border bg-brand-background px-6 py-10 text-center">
      <h3 className="text-lg font-semibold text-brand-primary">{title}</h3>
      <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-brand-muted">
        {copy}
      </p>
    </div>
  );
}

export function Badge({ children, tone = "neutral" }) {
  const classes =
    tone === "success"
      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
      : tone === "warning"
        ? "border-amber-200 bg-amber-50 text-amber-700"
        : "border-brand-secondary/20 bg-brand-secondary/10 text-brand-secondary";

  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] ${classes}`}
    >
      {children}
    </span>
  );
}

export function StatusBanner({ message, tone = "error" }) {
  if (!message) {
    return null;
  }

  return (
    <div
      className={`rounded-[24px] border px-4 py-4 text-sm ${
        tone === "success"
          ? "border-emerald-200 bg-emerald-50 text-emerald-700"
          : "border-red-200 bg-red-50 text-red-700"
      }`}
    >
      {message}
    </div>
  );
}
