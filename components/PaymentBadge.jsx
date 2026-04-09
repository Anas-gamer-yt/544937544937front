export default function PaymentBadge({ children }) {
  return (
    <span className="inline-flex items-center rounded-full border border-brand-secondary/20 bg-brand-secondary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-brand-secondary">
      {children}
    </span>
  );
}
