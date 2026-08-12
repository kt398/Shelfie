"use client";

import { useActionState } from "react";
import { addToLibraryAction, type AddToLibraryState } from "../actions";

const initialState: AddToLibraryState = { status: "idle" };

export default function AddToLibraryButton({ imdbId }: { imdbId: string }) {
  const boundAction = addToLibraryAction.bind(null, imdbId);
  const [state, formAction, pending] = useActionState(boundAction, initialState);

  if (state.status === "success") {
    return (
      <span className="block rounded bg-green-100 dark:bg-green-900/30 px-3 py-1.5 text-center text-sm text-green-700 dark:text-green-400">
        Added
      </span>
    );
  }

  return (
    <form action={formAction}>
      <button
        type="submit"
        disabled={pending}
        className="w-full rounded bg-primary px-3 py-1.5 text-sm text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
      >
        {pending ? "Adding..." : "Add to Library"}
      </button>
      {state.status === "error" && <p className="mt-1 text-xs text-red-600 dark:text-red-400">{state.message}</p>}
    </form>
  );
}
