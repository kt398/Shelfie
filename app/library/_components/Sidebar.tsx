"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { STATUS_FILTER_OPTIONS, TYPE_FILTER_OPTIONS, SORT_OPTIONS } from "@/lib/library";

export default function Sidebar() {
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
              className={`rounded px-3 py-1.5 text-left text-sm hover:bg-muted ${
                currentStatus === opt.value ? "text-variant" : ""
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <h2 className="mb-2 text-xs font-semibold uppercase text-muted-foreground">Type</h2>
        <div className="flex flex-col gap-1">
          {TYPE_FILTER_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setParam("type", opt.value)}
              className={`rounded px-3 py-1.5 text-left text-sm hover:bg-muted ${
                currentType === opt.value ? "rounded px-3 py-1.5 text-left text-sm text-variant":""
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h2 className="mb-2 text-xs font-semibold uppercase text-muted-foreground">Sort</h2>
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
