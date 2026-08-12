"use client";

import { useActionState } from "react";
import Link from "next/link";
import type { LibraryStatus } from "@prisma/client";
import { updateStatusAction, type LibraryActionState } from "../actions";
import type { LibraryEntryWithMedia } from "@/lib/library";
import { MEDIA_TYPE_LABELS } from "@/lib/library";
export const STATUS_LABELS: Record<LibraryStatus, string> = {
  PLANNED: "Planned",
  IN_PROGRESS: "In Progress",
  COMPLETED: "Completed",
  DROPPED: "Dropped",
  ON_HOLD: "On Hold",
};

export const STATUS_BADGE_STYLES: Record<LibraryStatus, string> = {
  PLANNED: "bg-gray-100 dark:bg-gray-400",
  IN_PROGRESS: "bg-blue-100 dark:bg-blue-400",
  COMPLETED: "bg-green-100 dark:bg-emerald-500",
  DROPPED: "bg-red-100 dark:bg-red-900",
  ON_HOLD: "bg-amber-100 dark:bg-amber-900",
};

const STATUS_SELECT_OPTIONS: { value: LibraryStatus; label: string }[] = [
  { value: "PLANNED", label: "Planned" },
  { value: "IN_PROGRESS", label: "In Progress" },
  { value: "COMPLETED", label: "Completed" },
  { value: "DROPPED", label: "Dropped" },
  { value: "ON_HOLD", label: "On Hold" },
];

const initialState: LibraryActionState = { status: "idle" };

export default function LibraryCard({ entry }: { entry: LibraryEntryWithMedia }) {
  const boundAction = updateStatusAction.bind(null, entry.id);
  const [, formAction] = useActionState(boundAction, initialState);

  return (
    <div className="flex flex-col overflow-hidden rounded-md border border-border">
      <Link href={`/library/${entry.id}?from=library`} className="contents">
        <div className="relative">
          <div className="aspect-2/3 w-full bg-muted
          after:content-[''] after:absolute after:inset-0 after:bg-linear-to-t 
          after:from-black after:to-transparent after:pointer-events-none
          ">
            {entry.mediaItem.posterUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={entry.mediaItem.posterUrl}
                alt={entry.mediaItem.title}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">
                No image
              </div>
            )}
          </div>
          <div className={`absolute top-2 left-0.5 text-[10px] py-0.5 px-1 font-mono font-medium rounded-md ${STATUS_BADGE_STYLES[entry.status]} `}>
            {STATUS_LABELS[entry.status].toUpperCase()}
          </div>
          <div className="absolute bottom-2 left-0.5 p-1">
            <h1 className="text-m font-[Georgia]">{entry.mediaItem.title}</h1>
            <p className="text-[9px] text-muted-foreground font-mono">
              {MEDIA_TYPE_LABELS[entry.mediaItem.type]} · {entry.mediaItem.releaseYear}
            </p>
          </div>

        </div>
        <div className="flex flex-col gap-1 p-3">
          {entry.rating != null && (
            <span className="text-xs text-amber-400">{"★".repeat(entry.rating)}</span>
          )}
        </div>
      </Link>
      <form action={formAction} onChange={(e) => e.currentTarget.requestSubmit()} className="px-3 pb-3">
        <select name="status" defaultValue={entry.status} className="w-full rounded border border-border px-2 py-1 text-xs">
          {STATUS_SELECT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </form>
    </div>
  );
}
