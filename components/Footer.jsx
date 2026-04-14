import Link from "next/link";
import { MessageCircle, ShieldCheck, Truck } from "lucide-react";
import { STORE_NAME } from "@/lib/constants";
import { resolveSiteContent } from "@/lib/siteContent";

function formatWhatsAppLink(number) {
  const normalized = String(number || "").replace(/\D/g, "");
  return normalized ? `https://wa.me/${normalized}` : "";
}

export default function Footer({
  categories = [],
  storeName = STORE_NAME,
  siteContent,
  whatsappNumber
}) {
  const featuredCategories = categories.slice(0, 4);
  const content = resolveSiteContent(siteContent);
  const whatsappLink = formatWhatsAppLink(whatsappNumber);
  const navLinks = [
    { href: "/", label: content.navHomeLabel },
    { href: "/#featured", label: content.navShopLabel },
    { href: "/categories", label: content.navCategoriesLabel },
    { href: "/track-order", label: content.navTrackOrderLabel },
    { href: "/#contact", label: content.navContactLabel }
  ];

  return (
    <footer
      id="contact"
      className="mt-20 border-t border-white/10 bg-[#08101f] text-white"
    >
      <div className="page-shell grid gap-12 py-16 lg:grid-cols-[1.35fr_0.85fr_0.85fr_1fr]">
        <div className="max-w-lg">
          <p className="font-display text-4xl leading-none text-white">
            {storeName}
          </p>
          <p className="mt-4 text-base leading-8 text-[#cbd5f5]">
            {content.footerDescription}
          </p>
          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            <div className="glass-panel rounded-[24px] p-4">
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#d4af37]/16 text-[#d4af37]">
                <Truck size={18} />
              </div>
              <p className="mt-3 text-sm font-semibold text-white">
                Nationwide delivery
              </p>
              <p className="mt-1 text-sm text-[#cbd5f5]">
                3 to 5 business days across Pakistan.
              </p>
            </div>
            <div className="glass-panel rounded-[24px] p-4">
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#d4af37]/16 text-[#d4af37]">
                <ShieldCheck size={18} />
              </div>
              <p className="mt-3 text-sm font-semibold text-white">
                Cash on delivery
              </p>
              <p className="mt-1 text-sm text-[#cbd5f5]">
                Trusted checkout with easy returns support.
              </p>
            </div>
          </div>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#d4af37]">
            {content.footerNavigateTitle}
          </p>
          <div className="mt-5 flex flex-col gap-3 text-sm text-[#cbd5f5]">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className="hover:text-white">
                {link.label}
              </Link>
            ))}
            <Link
              href="/terms-and-conditions"
              className="hover:text-white"
            >
              {content.footerTermsLabel}
            </Link>
            <Link href="/return-policy" className="hover:text-white">
              {content.footerReturnPolicyLabel}
            </Link>
          </div>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#d4af37]">
            {content.footerCategoriesTitle}
          </p>
          <div className="mt-5 flex flex-col gap-3 text-sm text-[#cbd5f5]">
            {featuredCategories.length ? (
              featuredCategories.map((category) => (
                <Link
                  key={category._id}
                  href={`/categories/${category.slug}`}
                  className="hover:text-white"
                >
                  {category.name}
                </Link>
              ))
            ) : (
              <p>{content.footerNoCategoriesCopy}</p>
            )}
          </div>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#d4af37]">
            {content.footerSupportTitle}
          </p>
          <p className="mt-5 text-sm leading-7 text-[#cbd5f5]">
            {content.footerSupportCopy}
          </p>

          <div className="mt-5 space-y-3 text-sm text-[#f8fafc]">
            {whatsappLink ? (
              <a
                href={whatsappLink}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 hover:text-[#d4af37]"
              >
                <MessageCircle size={16} />
                {content.footerWhatsAppLabel}: {whatsappNumber}
              </a>
            ) : null}

            {content.footerContactEmail ? (
              <a
                href={`mailto:${content.footerContactEmail}`}
                className="block hover:text-[#d4af37]"
              >
                {content.footerEmailLabel}: {content.footerContactEmail}
              </a>
            ) : null}
          </div>

          <p className="mt-5 text-sm leading-7 text-[#cbd5f5]">
            {content.footerCodCopy}
          </p>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="page-shell flex flex-col gap-4 py-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm leading-7 text-[#cbd5f5]">
            {content.footerPoliciesCopy}
          </p>
          <p className="text-sm text-[#94a3b8]">
            Copyright {new Date().getFullYear()} {storeName}. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
