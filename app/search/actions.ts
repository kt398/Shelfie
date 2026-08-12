"use server";

import { revalidatePath } from "next/cache";
import { MediaSource, MediaType } from "@prisma/client";
import { prisma } from "@/lib/db";
import { getServerSession } from "@/lib/session";
import { getOmdbById } from "@/lib/omdb";

export type AddToLibraryState =
  | { status: "idle" }
  | { status: "success" }
  | { status: "error"; message: string };

export async function addToLibraryAction(
  imdbId: string,
  _prevState: AddToLibraryState,
  _formData: FormData
): Promise<AddToLibraryState> {
  const session = await getServerSession();
  if (!session?.user) {
    return { status: "error", message: "You must be signed in to add to your library." };
  }

  const outcome = await getOmdbById(imdbId);
  if (!outcome.ok) {
    return {
      status: "error",
      message: outcome.reason === "not_found" ? "That title could not be found." : outcome.message,
    };
  }

  const { detail } = outcome;

  if (detail.type === "episode") {
    return { status: "error", message: "Episodes can't be added to your library." };
  }

  const mediaItem = await prisma.mediaItem.upsert({
    where: { source_externalId: { source: MediaSource.OMDB, externalId: detail.imdbID } },
    update: {
      title: detail.title,
      posterUrl: detail.posterUrl,
      releaseYear: detail.releaseYear,
      creators: detail.director,
      description: detail.plot,
    },
    create: {
      type: detail.type === "series" ? MediaType.TV : MediaType.MOVIE,
      source: MediaSource.OMDB,
      externalId: detail.imdbID,
      title: detail.title,
      posterUrl: detail.posterUrl,
      releaseYear: detail.releaseYear,
      creators: detail.director,
      description: detail.plot,
    },
  });

  await prisma.libraryEntry.upsert({
    where: { userId_mediaItemId: { userId: session.user.id, mediaItemId: mediaItem.id } },
    update: {},
    create: { userId: session.user.id, mediaItemId: mediaItem.id },
  });

  revalidatePath("/search");
  return { status: "success" };
}
