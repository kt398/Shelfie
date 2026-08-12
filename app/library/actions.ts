"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { getServerSession } from "@/lib/session";
import { updateStatusSchema, updateEntrySchema } from "@/lib/validation/library";
import type { LibraryStatus } from "@prisma/client";

export type LibraryActionState =
  | { status: "idle" }
  | { status: "success" }
  | { status: "error"; message: string };

export async function updateStatusAction(
  entryId: string,
  _prevState: LibraryActionState,
  formData: FormData
): Promise<LibraryActionState> {
  const session = await getServerSession();
  if (!session?.user) return { status: "error", message: "You must be signed in." };

  const parsed = updateStatusSchema.safeParse({ status: formData.get("status") });
  if (!parsed.success) return { status: "error", message: "Invalid status." };

  const result = await prisma.libraryEntry.updateMany({
    where: { id: entryId, userId: session.user.id },
    data: { status: parsed.data.status as LibraryStatus },
  });
  if (result.count === 0) return { status: "error", message: "Entry not found." };

  revalidatePath("/library");
  return { status: "success" };
}

export async function updateEntryAction(
  entryId: string,
  _prevState: LibraryActionState,
  formData: FormData
): Promise<LibraryActionState> {
  const session = await getServerSession();
  if (!session?.user) return { status: "error", message: "You must be signed in." };

  const parsed = updateEntrySchema.safeParse({
    status: formData.get("status"),
    rating: formData.get("rating"),
    dateStarted: formData.get("dateStarted"),
    dateFinished: formData.get("dateFinished"),
    comment: formData.get("comment"),
  });
  if (!parsed.success) {
    return { status: "error", message: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  const { status, rating, dateStarted, dateFinished, comment } = parsed.data;
  const result = await prisma.libraryEntry.updateMany({
    where: { id: entryId, userId: session.user.id },
    data: {
      status: status as LibraryStatus,
      rating,
      dateStarted: dateStarted ? new Date(dateStarted) : null,
      dateFinished: dateFinished ? new Date(dateFinished) : null,
      comment,
    },
  });
  if (result.count === 0) return { status: "error", message: "Entry not found." };

  revalidatePath("/library");
  revalidatePath(`/library/${entryId}`);
  return { status: "success" };
}

export async function removeFromLibraryAction(
  entryId: string,
  _prevState: LibraryActionState,
  _formData: FormData
): Promise<LibraryActionState> {
  const session = await getServerSession();
  if (!session?.user) return { status: "error", message: "You must be signed in." };

  const result = await prisma.libraryEntry.deleteMany({
    where: { id: entryId, userId: session.user.id },
  });
  if (result.count === 0) return { status: "error", message: "Entry not found." };

  revalidatePath("/library");
  redirect("/library");
}
