"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingBag } from "lucide-react";
import { useCart } from "@/components/providers/CartProvider";

export default function MobileStoreBar() {
  const pathname = usePathname();
  const { cartCount } = useCart();

  if (
    pathname.startsWith("/admin") ||
    pathname.startsWith("/cart") ||
    pathname.startsWith("/checkout") ||
    pathname.startsWith("/orders") ||
    pathname.startsWith("/track-order") ||
    pathname === "/categories" ||
    pathname.startsWith("/search")
  ) {
    return null;
  }

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 px-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] pt-2 md:hidden">
      <div className="glass-panel-strong mx-auto flex max-w-[22rem] items-center gap-2 rounded-[24px] p-2">
        <Link
          href="/categories"
          className="inline-flex min-h-10 flex-1 items-center justify-center rounded-full bg-[#2563eb] px-4 text-[0.8rem] font-semibold text-white shadow-[0_18px_40px_rgba(37,99,235,0.35)]"
        >
          Shop Now
        </Link>
        <Link
          href="/cart"
          className="inline-flex min-h-10 min-w-[6.1rem] items-center justify-center gap-2 rounded-full border border-[#d4af37]/35 bg-white/5 px-3 text-[0.8rem] font-semibold text-white"
        >
          <ShoppingBag size={16} />
          Cart
          <span className="inline-flex min-h-6 min-w-6 items-center justify-center rounded-full bg-[#d4af37] px-1 text-[11px] font-bold text-[#0f172a]">
            {cartCount}
          </span>
        </Link>
      </div>
    </div>
  );
}
