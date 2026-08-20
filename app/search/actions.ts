'use server';

import { revalidatePath } from 'next/cache';
import { MediaSource, MediaType } from '@prisma/client';
import { prisma } from '@/lib/db';
import { getServerSession } from '@/lib/session';
import { getOmdbById } from '@/lib/omdb';
import { getBookById } from '@/lib/googlebooks';

export type AddToLibraryState =
  | { status: 'idle' }
  | { status: 'success' }
  | { status: 'error'; message: string };

export async function addToLibraryAction(
  id: string,
  source: 'OMDB' | 'GOOGLE_BOOKS',
  _prevState: AddToLibraryState,
  _formData: FormData
): Promise<AddToLibraryState> {
  const session = await getServerSession();
  if (!session?.user) {
    return {
      status: 'error',
      message: 'You must be signed in to add to your library.',
    };
  }

  let mediaItemData: {
    type: MediaType;
    source: MediaSource;
    externalId: string;
    title: string;
    posterUrl: string | null;
    releaseYear: number | null;
    creators: string | null;
    description: string | null;
  };

  if (source === 'OMDB') {
    const outcome = await getOmdbById(id);
    if (!outcome.ok) {
      return {
        status: 'error',
        message:
          outcome.reason === 'not_found'
            ? 'That title could not be found.'
            : outcome.message,
      };
    }

    const { detail } = outcome;
    if (detail.type === 'episode') {
      return {
        status: 'error',
        message: "Episodes can't be added to your library.",
      };
    }

    mediaItemData = {
      type: detail.type === 'series' ? MediaType.TV : MediaType.MOVIE,
      source: MediaSource.OMDB,
      externalId: detail.id,
      title: detail.title,
      posterUrl: detail.posterUrl,
      releaseYear: detail.releaseYear,
      creators: detail.director,
      description: detail.plot,
    };
  } else {
    const outcome = await getBookById(id);
    if (!outcome.ok) {
      return {
        status: 'error',
        message:
          outcome.reason === 'not_found'
            ? 'That book could not be found.'
            : outcome.message,
      };
    }

    const { detail } = outcome;
    mediaItemData = {
      type: MediaType.BOOK,
      source: MediaSource.GOOGLE_BOOKS,
      externalId: detail.id,
      title: detail.title,
      posterUrl: detail.posterUrl,
      releaseYear: detail.releaseYear,
      creators: detail.authors,
      description: detail.description,
    };
  }

  const {
    type: _type,
    source: mediaSource,
    externalId,
    ...updateData
  } = mediaItemData;

  const mediaItem = await prisma.mediaItem.upsert({
    where: { source_externalId: { source: mediaSource, externalId } },
    update: updateData,
    create: mediaItemData,
  });

  await prisma.libraryEntry.upsert({
    where: {
      userId_mediaItemId: {
        userId: session.user.id,
        mediaItemId: mediaItem.id,
      },
    },
    update: {},
    create: { userId: session.user.id, mediaItemId: mediaItem.id },
  });

  revalidatePath('/search');
  return { status: 'success' };
}
