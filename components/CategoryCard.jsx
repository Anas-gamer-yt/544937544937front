import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { DEFAULT_CATEGORY_IMAGE } from "@/lib/constants";

export default function CategoryCard({ category, className = "" }) {
  const image = category.image || DEFAULT_CATEGORY_IMAGE;

  return (
    <Link
      href={`/categories/${category.slug}`}
      className={`group relative overflow-hidden rounded-[28px] border border-brand-border bg-white shadow-soft ${className}`.trim()}
    >
      <div className="aspect-[4/5] overflow-hidden">
        <img
          src={image}
          alt={category.name}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-brand-primary via-brand-primary/15 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 p-6 text-white">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-secondary">
              Collection
            </p>
            <h3 className="mt-2 font-display text-3xl leading-none">
              {category.name}
            </h3>
            <p className="mt-3 text-sm text-white/78">
              {category.productCount || 0} products
            </p>
          </div>
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/15 bg-white/10 backdrop-blur">
            <ArrowUpRight size={18} />
          </span>
        </div>
      </div>
    </Link>
  );
}
