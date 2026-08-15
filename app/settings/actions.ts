"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { getServerSession } from "@/lib/session";
import { createTagSchema } from "@/lib/validation/tags";
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

export type TagActionState =
  | { status: "idle" }
  | { status: "success" }
  | { status: "error"; message: string };

export async function createTagAction(
  _prevState: TagActionState,
  formData: FormData
): Promise<TagActionState> {
  const session = await getServerSession();
  if (!session?.user) return { status: "error", message: "You must be signed in." };

  const parsed = createTagSchema.safeParse({ name: formData.get("name") });
  if (!parsed.success) {
    return { status: "error", message: parsed.error.issues[0]?.message ?? "Invalid tag name." };
  }

  try {
    await prisma.tag.create({ data: { userId: session.user.id, name: parsed.data.name } });
  } catch (err) {
    if (err && typeof err === "object" && "code" in err && err.code === "P2002") {
      return { status: "error", message: "You already have a tag with that name." };
    }
    throw err;
  }

  revalidatePath("/settings");
  return { status: "success" };
}

export async function deleteTagAction(
  tagName: string,
  _prevState: TagActionState,
  _formData: FormData
): Promise<TagActionState> {
  const session = await getServerSession();
  if (!session?.user) return { status: "error", message: "You must be signed in." };

  const result = await prisma.tag.deleteMany({ where: { userId: session.user.id, name: tagName } });
  if (result.count === 0) return { status: "error", message: "Tag not found." };

  revalidatePath("/settings");
  return { status: "success" };
}