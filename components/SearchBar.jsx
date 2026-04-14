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
      className={`glass-panel flex items-center gap-2 rounded-full p-1.5 ${className}`}
      role="search"
    >
      <label className="flex min-w-0 flex-1 items-center gap-2 pl-3">
        <Search size={16} className="shrink-0 text-[#94a3b8]" />
        <span className="sr-only">{buttonLabel}</span>
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={placeholder}
          className={`w-full bg-transparent text-[#f8fafc] outline-none placeholder:text-[#94a3b8] ${
            compact ? "py-2 text-sm" : "py-2.5 text-sm sm:text-base"
          }`}
        />
      </label>
      <button
        type="submit"
        className={`inline-flex shrink-0 items-center justify-center rounded-full bg-[#2563eb] px-4 font-semibold text-white hover:scale-[1.03] hover:bg-[#1d4ed8] ${
          compact ? "py-2 text-xs" : "py-2.5 text-sm"
        }`}
      >
        {buttonLabel}
      </button>
    </form>
  );
}
