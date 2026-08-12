"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";


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
        <h1 className="mb-2 font-bold">Filter</h1>
        <h2 className="mb-2 text-xs font-semibold uppercase text-muted-foreground">Type</h2>
        <div className="flex flex-col gap-1">
        </div>
        <h2 className="mb-2 text-xs font-semibold uppercase text-muted-foreground">Year</h2>
        <div className="flex flex-col gap-1">
        </div>
      </div>

      <div>
        <h2 className="mb-2 text-xs font-semibold uppercase text-muted-foreground">Sort</h2>
      </div>
    </aside>
  );
}
