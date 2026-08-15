"use client";

import { useActionState, useRef, useState } from "react";
import Button from "@/components/Button";
import { createTagAction, deleteTagAction, type TagActionState } from "../actions";
import type { Tag } from "@prisma/client";

const initialState: TagActionState = { status: "idle" };

export default function TagsDialog({ tags }: { tags: Tag[] }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [sessionKey, setSessionKey] = useState(0);

  function open() {
    setSessionKey((k) => k + 1);
    dialogRef.current?.showModal();
  }

  return (
    <>
      <Button variant="primary" onClick={open}>
        Manage Tags
      </Button>

      <dialog
        ref={dialogRef}
        className="m-auto w-full max-w-md rounded-lg border border-border bg-background p-6 text-foreground backdrop:bg-black/50"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold">Manage Tags</h2>
          <button
            type="button"
            aria-label="Close"
            onClick={() => dialogRef.current?.close()}
            className="text-muted-foreground hover:text-foreground"
          >
            ✕
          </button>
        </div>

        <TagsDialogContent key={sessionKey} tags={tags} />
        <p className="mt-2 text-sm text-muted-foreground">Note: Case sensitive</p>
      </dialog>
    </>
  );
}

function TagsDialogContent({ tags }: { tags: Tag[] }) {
  const [createState, createFormAction, createPending] = useActionState(createTagAction, initialState);

  return (
    <>
      <form action={createFormAction} className="mt-4 flex gap-2">
        <input
          type="text"
          name="name"
          placeholder="New tag name"
          maxLength={50}
          required
          autoComplete="off"
          className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-400"
        />
        <Button type="submit" variant="primary" disabled={createPending}>
          Add
        </Button>
      </form>
      {createState.status === "error" && (
        <p className="mt-2 text-sm text-destructive">{createState.message}</p>
      )}

      <ul className="mt-4 flex flex-col gap-2">
        {tags.map((tag) => (
          <TagRow key={tag.name} tag={tag} />
        ))}
        {tags.length === 0 && <li className="text-sm text-muted-foreground">No tags yet.</li>}
      </ul>
    </>
  );
}

function TagRow({ tag }: { tag: Tag }) {
  const boundAction = deleteTagAction.bind(null, tag.name);
  const [state, formAction, pending] = useActionState(boundAction, initialState);

  return (
    <li className="flex items-center justify-between rounded-lg border border-border px-3 py-2">
      <span className="text-sm">{tag.name}</span>
      <form action={formAction}>
        <Button type="submit" variant="destructive" disabled={pending} className="px-2 py-1">
          Remove
        </Button>
      </form>
      {state.status === "error" && <span className="text-xs text-destructive">{state.message}</span>}
    </li>
  );
}
