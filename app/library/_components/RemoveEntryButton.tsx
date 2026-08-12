"use client";

import { useActionState } from "react";
import { removeFromLibraryAction, type LibraryActionState } from "../actions";

const initialState: LibraryActionState = { status: "idle" };

export default function RemoveEntryButton({ entryId }: { entryId: string }) {
  const boundAction = removeFromLibraryAction.bind(null, entryId);
  const [state, formAction, pending] = useActionState(boundAction, initialState);

  return (
    <form
      action={formAction}
      onSubmit={(e) => {
        if (!confirm("Remove this from your library?")) e.preventDefault();
      }}
    >
      <button
        type="submit"
        disabled={pending}
        className="rounded border border-red-300 dark:border-red-800 px-3 py-1.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950 disabled:opacity-50"
      >
        {pending ? "Removing..." : "Remove from Library"}
      </button>
      {state.status === "error" && <p className="mt-1 text-xs text-red-600 dark:text-red-400">{state.message}</p>}
    </form>
  );
}
