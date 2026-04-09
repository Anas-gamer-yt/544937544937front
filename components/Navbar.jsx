"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogIn, Menu, ShoppingBag, X } from "lucide-react";
import { useEffect, useState } from "react";
import SearchBar from "@/components/SearchBar";
import { STORE_NAME } from "@/lib/constants";
import { useCart } from "@/components/providers/CartProvider";
import { getAdminSession } from "@/lib/admin";
import { resolveSiteContent } from "@/lib/siteContent";

function isActivePath(pathname, href) {
  if (href === "/") {
    return pathname === "/";
  }

  return pathname.startsWith(href);
}

export default function Navbar({
  categories = [],
  storeName = STORE_NAME,
  siteContent
}) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [hasAdminSession, setHasAdminSession] = useState(false);
  const { cartCount } = useCart();
  const featuredCategories = categories.slice(0, 4);
  const content = resolveSiteContent(siteContent);
  const navLinks = [
    { href: "/", label: content.navHomeLabel },
    { href: "/categories", label: content.navCategoriesLabel },
    { href: "/cart", label: content.navCartLabel },
    { href: "/checkout", label: content.navCheckoutLabel },
    { href: "/track-order", label: content.navTrackOrderLabel }
  ];

  useEffect(() => {
    let active = true;

    getAdminSession().then((admin) => {
      if (active) {
        setHasAdminSession(Boolean(admin));
      }
    });

    return () => {
      active = false;
    };
  }, [pathname]);

  return (
    <header className="sticky top-0 z-50 border-b border-brand-border/80 bg-white/80 backdrop-blur-xl">
      <div className="page-shell flex min-h-20 flex-wrap items-center justify-between gap-4 py-4 xl:flex-nowrap">
        <div className="flex min-w-0 items-center gap-3 sm:gap-4">
          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-brand-border text-brand-primary lg:hidden"
            onClick={() => setIsOpen((current) => !current)}
            aria-label="Toggle navigation"
          >
            {isOpen ? <X size={18} /> : <Menu size={18} />}
          </button>

          <Link href="/" className="min-w-0">
            <span className="block truncate font-display text-2xl leading-none text-brand-primary sm:text-3xl">
              {storeName}
            </span>
            <span className="mt-1 block text-[0.65rem] font-semibold uppercase tracking-[0.34em] text-brand-muted">
              {content.brandLabel}
            </span>
          </Link>
        </div>

        <nav className="hidden items-center gap-6 xl:flex">
          {navLinks.map((link) => {
            const active = isActivePath(pathname, link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-semibold ${
                  active
                    ? "text-brand-primary"
                    : "text-brand-muted hover:text-brand-secondary"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden min-w-0 flex-1 xl:flex xl:max-w-md">
          <SearchBar
            compact
            placeholder={content.searchPlaceholder}
            buttonLabel={content.searchButtonLabel}
            className="w-full"
          />
        </div>

        <div className="ml-auto flex items-center gap-3">
          <Link
            href="/admin"
            className="hidden items-center gap-2 rounded-full border border-brand-border bg-white px-4 py-3 text-sm font-semibold text-brand-primary hover:border-brand-secondary/40 hover:text-brand-secondary sm:inline-flex"
          >
            <LogIn size={16} />
            {hasAdminSession
              ? content.navAdminDashboardLabel
              : content.navAdminLoginLabel}
          </Link>

          <Link
            href="/cart"
            className="relative inline-flex h-12 w-12 items-center justify-center rounded-full bg-brand-primary text-white shadow-lg shadow-brand-primary/20"
            aria-label="Open cart"
          >
            <ShoppingBag size={18} />
            <span className="absolute -right-1 -top-1 inline-flex min-h-6 min-w-6 items-center justify-center rounded-full bg-brand-cta px-1 text-xs font-bold text-white">
              {cartCount}
            </span>
          </Link>
        </div>
      </div>

      {isOpen ? (
        <div className="border-t border-brand-border bg-white lg:hidden">
          <div className="page-shell flex flex-col gap-4 py-5">
            <SearchBar
              placeholder={content.searchPlaceholder}
              buttonLabel={content.searchButtonLabel}
              className="w-full"
              onSubmitComplete={() => setIsOpen(false)}
            />

            {navLinks.map((link) => {
              const active = isActivePath(pathname, link.href);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`text-base font-semibold ${
                    active
                      ? "text-brand-primary"
                      : "text-brand-muted hover:text-brand-secondary"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}

            <div className="flex flex-wrap gap-3 pt-2">
              {featuredCategories.map((category) => (
                <Link
                  key={category._id}
                  href={`/categories/${category.slug}`}
                  onClick={() => setIsOpen(false)}
                  className="rounded-full bg-brand-background px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-brand-primary"
                >
                  {category.name}
                </Link>
              ))}
            </div>

            <Link
              href="/admin"
              onClick={() => setIsOpen(false)}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-brand-border bg-white px-4 py-3 text-sm font-semibold text-brand-primary"
            >
              <LogIn size={16} />
              {hasAdminSession
                ? content.navAdminDashboardLabel
                : content.navAdminLoginLabel}
            </Link>
          </div>
        </div>
      ) : null}
    </header>
  );
}
