import { MessageCircle } from "lucide-react";

export default function WhatsAppFloatingButton({ whatsappNumber }) {
  const number = String(whatsappNumber || "").replace(/\D/g, "");

  if (!number) {
    return null;
  }

  return (
    <a
      href={`https://wa.me/${number}`}
      target="_blank"
      rel="noreferrer"
      className="fixed bottom-5 right-5 z-50 hidden items-center gap-3 rounded-full border border-white/10 bg-[#16a34a] px-5 py-4 text-sm font-semibold text-white shadow-[0_20px_45px_rgba(22,163,74,0.35)] hover:-translate-y-1 hover:bg-[#15803d] md:inline-flex"
    >
      <MessageCircle size={18} />
      <span>WhatsApp</span>
    </a>
  );
}
