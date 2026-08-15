"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { STATUS_FILTER_OPTIONS, TYPE_FILTER_OPTIONS, SORT_OPTIONS } from "@/lib/library";


export default function Sidebar({ allTags }: { allTags: string[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function setParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    router.push(`${pathname}?${params.toString()}`);
  }

  const currentStatus = searchParams.get("status") ?? "";
  const currentType = searchParams.get("type") ?? "";
  const currentSort = searchParams.get("sort") ?? "recent";
  const currentTags = searchParams.get("tags")?.split(",").filter(Boolean) ?? [];
  const currentTagMode = searchParams.get("tagMode") === "AND" ? "AND" : "OR";

  function toggleTag(tagName: string) {
    const next = currentTags.includes(tagName)
      ? currentTags.filter((t) => t !== tagName)
      : [...currentTags, tagName];
    setParam("tags", next.join(","));
  }

  function toggleTagMode() {
    setParam("tagMode", currentTagMode === "AND" ? "OR" : "AND");
  }

  return (
    <aside className="sticky top-4 max-h-screen w-56 shrink-0 self-start overflow-y-auto border-r border-border p-4">
      <div className="mb-6">
        <h2 className="mb-2 text-xs tracking-wide font-semibold uppercase text-muted-foreground">Status</h2>
        <div className="flex flex-col gap-1">
          {STATUS_FILTER_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setParam("status", opt.value)}
              className={`rounded px-3 py-0.5 text-left text-sm hover:bg-muted ${
                currentStatus === opt.value ? "text-variant" : ""
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <h2 className="mb-2 text-xs tracking-wide font-semibold uppercase text-muted-foreground">Type</h2>
        <div className="flex flex-col gap-1">
          {TYPE_FILTER_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setParam("type", opt.value)}
              className={`rounded px-3 py-0.5 text-left text-sm hover:bg-muted ${
                currentType === opt.value ? "rounded px-3 py-1.5 text-left text-sm text-variant":""
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
      <div className="mb-6">
        <h2 className="mb-2 text-xs tracking-wide font-semibold uppercase text-muted-foreground">Rating</h2>
      </div>
      <div className="mb-6">
        <h2 className="mb-2 text-xs tracking-wide font-semibold uppercase text-muted-foreground">Custom Tags</h2>
        {allTags.length > 1 && (
          <div className="mb-2 flex items-center gap-2">
            <span className={`text-xs ${currentTagMode === "OR" ? "text-variant" : "text-muted-foreground"}`}>Any</span>
            <button
              type="button"
              role="switch"
              aria-checked={currentTagMode === "AND"}
              aria-label="Toggle tag match mode"
              onClick={toggleTagMode}
              className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full border-2 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2 ${
                currentTagMode === "AND" ? "bg-variant border-variant" : "bg-gray-200 border-gray-300"
              }`}
            >
              <span
                className={`h-3 w-3 transform rounded-full bg-white shadow transition-transform ${
                  currentTagMode === "AND" ? "translate-x-4" : "translate-x-0.5"
                }`}
              />
            </button>
            <span className={`text-xs ${currentTagMode === "AND" ? "text-variant" : "text-muted-foreground"}`}>All</span>
          </div>
        )}
        <div className="flex flex-col gap-1">
          {allTags.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => toggleTag(tag)}
              className={`rounded px-3 py-0.5 text-left text-sm hover:bg-muted ${
                currentTags.includes(tag) ? "text-variant" : ""
              }`}
            >
              {tag}
            </button>
          ))}
          {allTags.length === 0 && <p className="text-xs text-muted-foreground">No tags yet.</p>}
        </div>
      </div>
      <div className="mb-6">
        <h2 className="mb-2 text-xs tracking-wide font-semibold uppercase text-muted-foreground">Sort</h2>
        <select
          value={currentSort}
          onChange={(e) => setParam("sort", e.target.value)}
          className="w-full rounded border border-border px-2 py-1.5 text-sm"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    </aside>
  );
}
