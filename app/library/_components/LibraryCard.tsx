"use client";

import { startTransition, useActionState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LibraryStatus, type MediaType } from "@prisma/client";
import { updateStatusAction, type LibraryActionState } from "../actions";
import type { LibraryEntryWithMedia } from "@/lib/library";
import { MEDIA_TYPE_LABELS } from "@/lib/library";
import Button from "@/components/Button";
export const STATUS_LABELS: Record<LibraryStatus, string> = {
  PLANNED: "Planned",
  IN_PROGRESS: "In Progress",
  COMPLETED: "Completed",
  DROPPED: "Dropped",
  ON_HOLD: "On Hold",
};

export const STATUS_BADGE_STYLES: Record<LibraryStatus, string> = {
  PLANNED: "bg-gray-400",
  IN_PROGRESS: "bg-blue-400",
  COMPLETED: "bg-emerald-500",
  DROPPED: "bg-red-900",
  ON_HOLD: "bg-yellow-500",
};

const STATUS_CYCLE: LibraryStatus[] = ["PLANNED", "IN_PROGRESS", "COMPLETED", "ON_HOLD", "DROPPED"];

function getInProgressLabel(mediaType: MediaType): string {
  return mediaType === "BOOK" ? "Reading" : "Watching";
}

function getStatusText(current: LibraryStatus, mediaType: MediaType): string {
  switch(current){
    case "ON_HOLD":
    case "PLANNED": return `Mark as ${getInProgressLabel(mediaType)}`
    case "IN_PROGRESS": return "Mark as Completed"
    case "COMPLETED":
    case "DROPPED": return "View details"
  }
}

function getNextStatus(current: LibraryStatus): LibraryStatus {
  switch (current) {
    case "PLANNED":
    case "ON_HOLD": return LibraryStatus.IN_PROGRESS;
    case "IN_PROGRESS":
    case "COMPLETED": return LibraryStatus.COMPLETED;
    case "DROPPED": return LibraryStatus.DROPPED;
  }
}


const initialState: LibraryActionState = { status: "idle" };

export default function LibraryCard({ entry }: { entry: LibraryEntryWithMedia }) {
  const router = useRouter();
  const boundAction = updateStatusAction.bind(null, entry.id);
  const [, updateStatus] = useActionState(boundAction, initialState);

  function handleStatusClick() {
    if (entry.status === LibraryStatus.COMPLETED || entry.status === LibraryStatus.DROPPED) {
      router.push(`/library/${entry.id}?from=library`);
      return;
    }
    startTransition(() => updateStatus(getNextStatus(entry.status)));
  }


  return (
    <div className="group relative flex flex-col overflow-hidden rounded-md border border-border" >
      <Link href={`/library/${entry.id}?from=library`} className="contents">
        <div className="relative">
          <div className="aspect-2/3 w-full bg-muted
          after:content-[''] after:absolute after:inset-0 after:bg-linear-to-t 
          after:from-black/80 dark:after:from-black after:to-transparent after:pointer-events-none
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
          <div className={`absolute top-2 left-0.5 text-[10.5px] py-0.5 px-1 tracking-wide font-mono font-medium text-white rounded-md ${STATUS_BADGE_STYLES[entry.status]} `}>
            {(entry.status === LibraryStatus.IN_PROGRESS
              ? getInProgressLabel(entry.mediaItem.type)
              : STATUS_LABELS[entry.status]
            ).toUpperCase()}
          </div>
          <div className="absolute bottom-2 left-0.5 p-1">
            <h1 className="text-m text-white font-[Georgia]">{entry.mediaItem.title}</h1>
            <p className="text-[10px] text-gray-300 font-mono">
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
      <Button
        onClick={handleStatusClick}
        className="bg-gray-600! hover:bg-gray-600/90! text-white dark:bg-black/60! absolute inset-x-0 bottom-0 translate-y-full px-3 py-2
        transition-transform duration-150 group-hover:translate-y-0
        group-focus-within:translate-y-0"
      >
        {getStatusText(entry.status, entry.mediaItem.type)}
      </Button>
    </div>
  );
}
