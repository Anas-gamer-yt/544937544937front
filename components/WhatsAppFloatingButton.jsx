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
      className="fixed bottom-5 right-5 z-50 inline-flex items-center gap-3 rounded-full bg-brand-secondary px-5 py-4 text-sm font-semibold text-white shadow-2xl shadow-brand-secondary/30 hover:-translate-y-1 hover:bg-teal-500"
    >
      <MessageCircle size={18} />
      WhatsApp
    </a>
  );
}

