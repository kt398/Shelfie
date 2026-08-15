"use client";

import { startTransition, useActionState, useState } from "react";
import type { LibraryStatus } from "@prisma/client";
import { updateEntryAction, toggleEntryTagAction, type LibraryActionState } from "../../actions";
import { STATUS_LABELS } from "../../_components/LibraryCard";
import type { LibraryEntryWithMediaAndTags } from "@/lib/library";
import StarRating from "@/components/StarRating";
import Button from "@/components/Button";
import { Tag } from "@prisma/client";

const initialState: LibraryActionState = { status: "idle" };

function toDateInputValue(date: Date | null): string {
  return date ? date.toISOString().slice(0, 10) : "";
}

type EditEntryFormProps = {
  entry: LibraryEntryWithMediaAndTags;
  allTags: Tag[];
};

export default function EditEntryForm({ entry, allTags }: EditEntryFormProps) {
  const boundAction = updateEntryAction.bind(null, entry.id);
  const [state, formAction, pending] = useActionState(boundAction, initialState);
  const [status, setStatus] = useState<LibraryStatus>(entry.status);

  
  return (
    <form action={formAction} className="flex flex-col gap-4">
      <div>
        <label className="mb-1 block text-xs text-muted-foreground font-[Segoe UI]">
          Status
        </label>
        <input type="hidden" name="status" value={status} />
        <div className="flex flex-wrap gap-2">
          {(Object.keys(STATUS_LABELS) as LibraryStatus[]).map((s) => (
            <Button
              key={s}
              type="button"
              variant="variant"
              selected={status === s}
              onClick={() => setStatus(s)}
            >
              {STATUS_LABELS[s]}
            </Button>
          ))}
        </div>
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
        <label className="mb-1 block text-sm text-muted-foreground font-[Segoe UI]">
          Custom Tags
        </label>
        <div className="flex flex-wrap gap-2">
          {allTags.map((tag) => (
            <EntryTagButton key={tag.name} entryId={entry.id} tag={tag} assigned={entry.tags.includes(tag.name)} />
          ))}
          {allTags.length === 0 && (
            <p className="text-sm text-muted-foreground">No tags yet — add some in Settings.</p>
          )}
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

function EntryTagButton({ entryId, tag, assigned }: { entryId: string; tag: Tag; assigned: boolean }) {
  const boundAction = toggleEntryTagAction.bind(null, entryId, tag.name);
  const [, toggleTag, pending] = useActionState(boundAction, initialState);

  return (
    <Button
      type="button"
      variant="variant"
      selected={assigned}
      disabled={pending}
      onClick={() => startTransition(() => toggleTag())}
    >
      {tag.name}
    </Button>
  );
}
