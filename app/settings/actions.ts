"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { getServerSession } from "@/lib/session";
import type { DateDefault } from "@prisma/client";


export type PreferenceActionState =
  | { status: "idle" }
  | { status: "success" }
  | { status: "error"; message: string };


export async function updateDatePreferenceAction(
  field: "defaultDateStarted" | "defaultDateFinished",
  value: DateDefault,
  _prevState: PreferenceActionState,
  _formData: FormData
): Promise<PreferenceActionState> {
  const session = await getServerSession();
  if (!session?.user) {
    return { status: "error", message: "You must be signed in." };
  }

  await prisma.userPreferences.upsert({
    where: { userId: session.user.id },
    update: { [field]: value },
    create: { userId: session.user.id, [field]: value },
  });

  revalidatePath("/settings");
  return { status: "success" };
}