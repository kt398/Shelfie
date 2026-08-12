"use client";

import { useActionState } from "react";
import type { LibraryStatus } from "@prisma/client";
import { updateEntryAction, type LibraryActionState } from "../../actions";
import { STATUS_LABELS } from "../../_components/LibraryCard";
import type { LibraryEntryWithMedia } from "@/lib/library";
import StarRating from "@/components/StarRating";

const initialState: LibraryActionState = { status: "idle" };

function toDateInputValue(date: Date | null): string {
  return date ? date.toISOString().slice(0, 10) : "";
}

export default function EditEntryForm({ entry }: { entry: LibraryEntryWithMedia }) {
  const boundAction = updateEntryAction.bind(null, entry.id);
  const [state, formAction, pending] = useActionState(boundAction, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <div>
        <label className="mb-1 block text-xs text-muted-foreground font-[Segoe UI]" htmlFor="status">
          Status
        </label>
        <select
          id="status"
          name="status"
          defaultValue={entry.status}
          className="w-full rounded border border-border px-3 py-2"
        >
          {(Object.keys(STATUS_LABELS) as LibraryStatus[]).map((s) => (
            <option key={s} value={s}>
              {STATUS_LABELS[s]}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-1 block text-sm text-muted-foreground font-[Segoe UI]" htmlFor="rating">
          Rating
        </label>
        <StarRating
          name="rating"
          defaultValue={entry.rating ?? null}
        />
      </div>

      <div className="flex gap-4">
        <div className="flex-1">
          <label className="mb-1 block text-sm text-muted-foreground font-[Segoe UI]" htmlFor="dateStarted">
            Started
          </label>
          <input
            id="dateStarted"
            name="dateStarted"
            type="date"
            defaultValue={toDateInputValue(entry.dateStarted)}
            className="w-full rounded border border-border px-3 py-2"
          />
        </div>
        <div className="flex-1">
          <label className="mb-1 block text-sm text-muted-foreground font-[Segoe UI]" htmlFor="dateFinished">
            Finished
          </label>
          <input
            id="dateFinished"
            name="dateFinished"
            type="date"
            defaultValue={toDateInputValue(entry.dateFinished)}
            className="w-full rounded border border-border px-3 py-2"
          />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm text-muted-foreground font-[Segoe UI]" htmlFor="comment">
          Comment
        </label>
        <textarea
          id="comment"
          name="comment"
          defaultValue={entry.comment ?? ""}
          rows={4}
          className="w-full rounded border border-border px-3 py-2"
        />
      </div>

      <button
        type="submit"
        disabled={pending}
        className="rounded bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
      >
        {pending ? "Saving..." : "Save"}
      </button>
      {state.status === "error" && <p className="text-sm text-red-600 dark:text-red-400">{state.message}</p>}
      {state.status === "success" && <p className="text-sm text-green-700 dark:text-green-400">Saved.</p>}
    </form>
  );
}
