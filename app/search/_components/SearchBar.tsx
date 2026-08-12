"use client";

import { useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

const TYPE_OPTIONS: { value: "" | "movie" | "series"; label: string }[] = [
  { value: "", label: "All" },
  { value: "movie", label: "Movies" },
  { value: "series", label: "TV Shows" },
];

export default function SearchBar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") ?? "");

  function navigate(next: { q?: string; type?: string }) {
    const params = new URLSearchParams(searchParams.toString());
    if (next.q !== undefined) {
      if (next.q) params.set("q", next.q);
      else params.delete("q");
    }
    if (next.type !== undefined) {
      if (next.type) params.set("type", next.type);
      else params.delete("type");
    }
    params.delete("page");
    router.push(`${pathname}?${params.toString()}`);
  }

  const currentType = searchParams.get("type") ?? "";

  return (
    <div className="flex flex-col gap-3">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          navigate({ q: query.trim() });
        }}
        className="flex gap-2"
      >
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search movies and TV shows..."
          className="flex-1 rounded border border-border px-3 py-2"
        />
        <button type="submit" className="rounded bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90">
          Search
        </button>
      </form>
      {!searchParams.has('q') && (
        <div className="flex gap-2">
          {TYPE_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => navigate({ type: opt.value })}
              className={
                currentType === opt.value
                  ? "rounded bg-primary px-3 py-1 text-sm text-primary-foreground"
                  : "rounded border border-border px-3 py-1 text-sm hover:bg-muted"
              }
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
