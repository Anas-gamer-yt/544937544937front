import Link from "next/link";
import { ArrowRight, Layers3 } from "lucide-react";
import { DEFAULT_CATEGORY_IMAGE } from "@/lib/constants";

export default function CategoryCard({ category, className = "" }) {
  const image = category.image || DEFAULT_CATEGORY_IMAGE;
  const categoryDescription =
    category.description ||
    `Browse curated picks inside ${category.name} with cleaner filtering and faster scanning.`;

  return (
    <Link
      href={`/categories/${category.slug}`}
      className={`glass-panel-strong group flex h-full flex-col overflow-hidden rounded-[22px] text-white transition duration-300 hover:-translate-y-1 hover:shadow-[0_30px_70px_rgba(2,8,23,0.38)] sm:rounded-[28px] ${className}`.trim()}
    >
      <div className="relative overflow-hidden">
        <div className="category-card-media overflow-hidden bg-[#0b1324]">
          <img
            src={image}
            alt={category.name}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
          />
        </div>

        <div className="glass-chip absolute left-2.5 top-2.5 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-[0.52rem] font-semibold uppercase tracking-[0.14em] text-[#d4af37] sm:left-4 sm:top-4 sm:gap-2 sm:px-3 sm:py-2 sm:text-[0.68rem] sm:tracking-[0.16em]">
          <Layers3 size={12} />
          Collection
        </div>

        <div className="absolute right-2.5 top-2.5 rounded-full bg-[#2563eb] px-2.5 py-1.5 text-[0.52rem] font-semibold uppercase tracking-[0.14em] text-white shadow-[0_12px_28px_rgba(37,99,235,0.35)] sm:right-4 sm:top-4 sm:px-3 sm:py-2 sm:text-[0.68rem] sm:tracking-[0.16em]">
          {category.productCount || 0} items
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-3.5 sm:gap-4 sm:p-6">
        <div className="space-y-2.5 sm:space-y-3">
          <div className="flex items-center gap-2 text-[0.54rem] font-semibold uppercase tracking-[0.14em] text-[#cbd5f5] sm:gap-3 sm:text-[0.68rem] sm:tracking-[0.18em]">
            <span>Collection</span>
            <span className="h-1 w-1 rounded-full bg-[#d4af37]" />
            <span className="text-[#d4af37]">Curated</span>
          </div>

          <h3 className="line-clamp-2 text-[1.02rem] font-semibold leading-[1.12] text-white transition group-hover:text-[#d4af37] sm:text-[1.6rem] sm:leading-[1.1]">
            {category.name}
          </h3>

          <p className="line-clamp-2 text-[0.74rem] leading-5 text-[#cbd5f5] sm:line-clamp-3 sm:text-sm sm:leading-7">
            {categoryDescription}
          </p>
        </div>

        <div className="mt-auto flex items-end justify-between gap-2.5 sm:gap-3">
          <div>
            <p className="text-base font-bold text-white sm:text-xl">
              {category.productCount || 0} products
            </p>
            <p className="mt-1 text-[0.72rem] text-[#94a3b8] sm:text-sm">
              Browse the full category
            </p>
          </div>

          <span className="inline-flex items-center gap-1.5 text-[0.76rem] font-semibold text-[#d4af37] group-hover:text-white sm:gap-2 sm:text-sm">
            Explore
            <ArrowRight size={16} />
          </span>
        </div>
      </div>
    </Link>
  );
}
