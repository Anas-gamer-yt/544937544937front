import Link from "next/link";
import { STORE_NAME } from "@/lib/constants";
import { resolveSiteContent } from "@/lib/siteContent";

export default function Footer({
  categories = [],
  storeName = STORE_NAME,
  siteContent
}) {
  const featuredCategories = categories.slice(0, 4);
  const content = resolveSiteContent(siteContent);
  const navLinks = [
    { href: "/", label: content.navHomeLabel },
    { href: "/categories", label: content.navCategoriesLabel },
    { href: "/cart", label: content.navCartLabel },
    { href: "/checkout", label: content.navCheckoutLabel },
    { href: "/track-order", label: content.navTrackOrderLabel }
  ];

  return (
    <footer className="mt-20 border-t border-brand-secondary/20 bg-brand-primary text-white">
      <div className="page-shell grid gap-12 py-14 lg:grid-cols-[1.3fr_0.8fr_0.8fr]">
        <div>
          <p className="font-display text-4xl leading-none">{storeName}</p>
          <p className="mt-4 max-w-md text-sm leading-7 text-white/72">
            {content.footerDescription}
          </p>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-brand-secondary">
            {content.footerNavigateTitle}
          </p>
          <div className="mt-5 flex flex-col gap-3 text-sm text-white/72">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="hover:text-brand-secondary"
              >
                {link.label}
              </Link>
            ))}
            <Link href="/admin" className="hover:text-brand-secondary">
              {content.navAdminLoginLabel}
            </Link>
          </div>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-brand-secondary">
            {content.footerCategoriesTitle}
          </p>
          <div className="mt-5 flex flex-col gap-3 text-sm text-white/72">
            {featuredCategories.length ? (
              featuredCategories.map((category) => (
                <Link
                  key={category._id}
                  href={`/categories/${category.slug}`}
                  className="hover:text-brand-secondary"
                >
                  {category.name}
                </Link>
              ))
            ) : (
              <p>{content.footerNoCategoriesCopy}</p>
            )}
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="page-shell flex flex-col gap-4 py-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm leading-7 text-white/70">
            {content.footerPoliciesCopy}
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href="/terms-and-conditions"
              className="button-secondary justify-center border-white/15 bg-white/10 text-white hover:border-brand-secondary hover:bg-white/15 hover:text-white"
            >
              {content.footerTermsLabel}
            </Link>
            <Link
              href="/return-policy"
              className="button-secondary justify-center border-white/15 bg-white/10 text-white hover:border-brand-secondary hover:bg-white/15 hover:text-white"
            >
              {content.footerReturnPolicyLabel}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
