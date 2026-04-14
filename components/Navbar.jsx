"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Search, ShoppingBag, X } from "lucide-react";
import { useState } from "react";
import SearchBar from "@/components/SearchBar";
import { STORE_NAME } from "@/lib/constants";
import { useCart } from "@/components/providers/CartProvider";
import { resolveSiteContent } from "@/lib/siteContent";

function normalizePath(href) {
  return String(href || "/").split("#")[0] || "/";
}

function isActivePath(pathname, href) {
  if (String(href || "").includes("#")) {
    return false;
  }

  const targetPath = normalizePath(href);

  if (targetPath === "/") {
    return pathname === "/";
  }

  return pathname.startsWith(targetPath);
}

export default function Navbar({
  categories = [],
  storeName = STORE_NAME,
  siteContent
}) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const { cartCount } = useCart();
  const content = resolveSiteContent(siteContent);
  const featuredCategories = categories.slice(0, 4);
  const navLinks = [
    { href: "/", label: content.navHomeLabel },
    { href: "/#featured", label: content.navShopLabel },
    { href: "/categories", label: content.navCategoriesLabel },
    { href: "/track-order", label: content.navTrackOrderLabel },
    { href: "/#contact", label: content.navContactLabel }
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-white/12 bg-[rgba(10,18,34,0.62)] text-white shadow-[0_18px_44px_rgba(2,8,23,0.18)] backdrop-blur-2xl">
      <div className="page-shell flex min-h-14 items-center gap-1.5 py-2.5 sm:min-h-20 sm:gap-4 sm:py-4">
        <div className="flex min-w-0 flex-1 items-center gap-1.5 sm:gap-3">
          <button
            type="button"
            className="glass-chip inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-white lg:hidden"
            onClick={() => setIsOpen((current) => !current)}
            aria-label="Toggle navigation"
          >
            {isOpen ? <X size={18} /> : <Menu size={18} />}
          </button>

          <Link href="/" className="min-w-0 flex-1">
            <span className="block truncate font-display text-[1.3rem] leading-none text-white sm:text-[2.2rem]">
              {storeName}
            </span>
            <span className="mt-1 hidden text-[0.62rem] font-semibold uppercase tracking-[0.34em] text-[#cbd5f5] sm:block">
              {content.brandLabel}
            </span>
          </Link>
        </div>

        <nav className="ml-6 hidden items-center gap-7 xl:flex">
          {navLinks.map((link) => {
            const active = isActivePath(pathname, link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium tracking-[0.04em] ${
                  active
                    ? "text-[#d4af37]"
                    : "text-[#cbd5f5] hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto hidden min-w-0 max-w-xl flex-1 xl:block">
          <SearchBar
            compact
            placeholder={content.searchPlaceholder}
            buttonLabel={content.searchButtonLabel}
            className="w-full"
          />
        </div>

        <div className="ml-auto flex shrink-0 items-center gap-1.5 lg:ml-4">
          <Link
            href="/search"
            className="glass-chip inline-flex h-9 w-9 items-center justify-center rounded-full text-white xl:hidden"
            aria-label="Search products"
          >
            <Search size={16} />
          </Link>

          <Link
            href="/cart"
            className="relative inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#2563eb] text-white shadow-[0_18px_38px_rgba(37,99,235,0.35)]"
            aria-label="Open cart"
          >
            <ShoppingBag size={16} />
            <span className="absolute -right-1 -top-1 inline-flex min-h-5 min-w-5 items-center justify-center rounded-full bg-[#d4af37] px-1 text-[10px] font-bold text-[#0f172a]">
              {cartCount}
            </span>
          </Link>
        </div>
      </div>

      {isOpen ? (
        <div className="border-t border-white/10 bg-[rgba(17,28,50,0.8)] backdrop-blur-2xl lg:hidden">
          <div className="page-shell flex flex-col gap-5 py-5">
            <SearchBar
              placeholder={content.searchPlaceholder}
              buttonLabel={content.searchButtonLabel}
              className="w-full"
              onSubmitComplete={() => setIsOpen(false)}
            />

            <div className="flex flex-col gap-4">
              {navLinks.map((link) => {
                const active = isActivePath(pathname, link.href);

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className={`text-base font-semibold ${
                      active
                        ? "text-[#d4af37]"
                        : "text-[#f8fafc] hover:text-[#d4af37]"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>

            <div className="flex flex-wrap gap-3 pt-2">
              {featuredCategories.map((category) => (
                <Link
                  key={category._id}
                  href={`/categories/${category.slug}`}
                  onClick={() => setIsOpen(false)}
                  className="glass-chip rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-[#cbd5f5]"
                >
                  {category.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}
