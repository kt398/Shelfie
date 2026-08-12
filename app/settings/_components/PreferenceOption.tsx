"use client";

import { useActionState } from "react";
import Button from "@/components/Button";
import { updateDatePreferenceAction, type PreferenceActionState } from "../actions";
import type { DateDefault } from "@prisma/client";

const initialState: PreferenceActionState = { status: "idle" };

export default function PreferenceOption({
  field,
  value,
  label,
  active,
}: {
  field: "defaultDateStarted" | "defaultDateFinished";
  value: DateDefault;
  label: string;
  active: boolean;
}) {
  const boundAction = updateDatePreferenceAction.bind(null, field, value);
  const [, formAction, pending] = useActionState(boundAction, initialState);

  return (
    <form action={formAction} className="inline">
      <Button type="submit" selected={active} disabled={pending}>
        {label}
      </Button>
    </form>
  );
}