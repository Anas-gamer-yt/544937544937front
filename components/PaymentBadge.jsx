export default function PaymentBadge({ children }) {
  return (
    <span className="inline-flex items-center rounded-full border border-[#d4af37]/30 bg-[#d4af37]/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-[#d4af37]">
      {children}
    </span>
  );
}
