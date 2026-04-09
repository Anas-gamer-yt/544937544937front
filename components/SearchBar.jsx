"use client";

import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SearchBar({
  initialQuery = "",
  placeholder = "Search products",
  buttonLabel = "Search",
  className = "",
  compact = false,
  onSubmitComplete
}) {
  const router = useRouter();
  const [query, setQuery] = useState(initialQuery);

  function handleSubmit(event) {
    event.preventDefault();
    const normalizedQuery = String(query || "").trim();

    router.push(
      normalizedQuery
        ? `/search?q=${encodeURIComponent(normalizedQuery)}`
        : "/search"
    );

    if (typeof onSubmitComplete === "function") {
      onSubmitComplete();
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={`flex items-center gap-2 rounded-full border border-brand-border bg-white/90 p-1 shadow-soft ${className}`}
      role="search"
    >
      <label className="flex min-w-0 flex-1 items-center gap-2 pl-3">
        <Search size={16} className="shrink-0 text-brand-muted" />
        <span className="sr-only">{buttonLabel}</span>
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={placeholder}
          className={`w-full bg-transparent text-brand-text outline-none placeholder:text-brand-muted ${
            compact ? "py-2 text-sm" : "py-2.5 text-sm sm:text-base"
          }`}
        />
      </label>
      <button
        type="submit"
        className={`inline-flex shrink-0 items-center justify-center rounded-full bg-brand-primary px-4 font-semibold text-white hover:bg-brand-secondary ${
          compact ? "py-2 text-xs" : "py-2.5 text-sm"
        }`}
      >
        {buttonLabel}
      </button>
    </form>
  );
}
