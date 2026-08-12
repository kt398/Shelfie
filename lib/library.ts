import { prisma } from "@/lib/db";
import type { LibraryEntry, MediaItem, MediaSource, LibraryStatus, MediaType } from "@prisma/client";

export type LibraryEntryWithMedia = LibraryEntry & { mediaItem: MediaItem };
export type LibrarySort = "recent" | "rating" | "title";


export const MEDIA_TYPE_LABELS: Record<MediaType, string> = {
  MOVIE: "Movie",
  TV: "TV Show",
  BOOK: "Book",
};


export async function getLibraryEntries(
  userId: string,
  filters: { status?: LibraryStatus; type?: MediaType; sort?: LibrarySort; query?: string; } = {}
): Promise<LibraryEntryWithMedia[]> {
  const { status, query, type, sort = "recent" } = filters;

  const mediaItemFilter: { type?: MediaType; title?: { contains: string; mode: "insensitive" } } = {};
  if (type) mediaItemFilter.type = type;
  if (query) mediaItemFilter.title = { contains: query, mode: "insensitive" };

  const orderBy =
    sort === "rating"
      ? [{ rating: { sort: "desc" as const, nulls: "last" as const } }, { createdAt: "desc" as const }]
      : sort === "title"
        ? [{ mediaItem: { title: "asc" as const } }]
        : [{ createdAt: "desc" as const }];

  return prisma.libraryEntry.findMany({
    where: {
      userId,
      ...(status ? { status } : {}),
      ...(Object.keys(mediaItemFilter).length > 0 ? { mediaItem: mediaItemFilter } : {}),
    },
    include: { mediaItem: true },
    orderBy,
  });
}

export async function getLibraryEntryById(
  userId: string,
  id: string
): Promise<LibraryEntryWithMedia | null> {
  return prisma.libraryEntry.findFirst({
    where: { id, userId },
    include: { mediaItem: true },
  });
}

export async function getLibraryStatusCounts(userId: string): Promise<Record<LibraryStatus, number>> {
  const grouped = await prisma.libraryEntry.groupBy({
    by: ["status"],
    where: { userId },
    _count: { status: true },
  });

  const counts: Record<LibraryStatus, number> = {
    PLANNED: 0,
    IN_PROGRESS: 0,
    COMPLETED: 0,
    DROPPED: 0,
    ON_HOLD: 0,
  };

  for (const group of grouped) {
    counts[group.status] = group._count.status;
  }

  return counts;
}

const STATUS_PARAM_MAP: Record<string, LibraryStatus> = {
  planned: "PLANNED",
  "in-progress": "IN_PROGRESS",
  completed: "COMPLETED",
  dropped: "DROPPED",
  "on-hold": "ON_HOLD",
};

export const STATUS_FILTER_OPTIONS = [
  { value: "", label: "All" },
  { value: "planned", label: "Planned" },
  { value: "in-progress", label: "In Progress" },
  { value: "completed", label: "Completed" },
  { value: "dropped", label: "Dropped" },
  { value: "on-hold", label: "On Hold" },
] as const;

export function parseStatusParam(value?: string): LibraryStatus | undefined {
  return value ? STATUS_PARAM_MAP[value] : undefined;
}

const TYPE_PARAM_MAP: Record<string, MediaType> = { movie: "MOVIE", tv: "TV", book: "BOOK" };

export const TYPE_FILTER_OPTIONS = [
  { value: "", label: "All" },
  { value: "movie", label: "Movies" },
  { value: "tv", label: "TV Shows" },
  { value: "book", label: "Books" },
] as const;

export function parseTypeParam(value?: string): MediaType | undefined {
  return value ? TYPE_PARAM_MAP[value] : undefined;
}

export const SORT_OPTIONS = [
  { value: "recent", label: "Recently Added" },
  { value: "rating", label: "Highest Rated" },
  { value: "title", label: "Title A–Z" },
] as const;

export function parseSortParam(value?: string): LibrarySort {
  return value === "rating" || value === "title" ? value : "recent";
}

export async function getLibraryExternalIds(
  userId: string,
  source: MediaSource,
  externalIds: string[]
): Promise<Set<string>> {
  if (externalIds.length === 0) return new Set();

  const entries = await prisma.libraryEntry.findMany({
    where: {
      userId,
      mediaItem: { source, externalId: { in: externalIds } },
    },
    select: { mediaItem: { select: { externalId: true } } },
  });

  return new Set(entries.map((e) => e.mediaItem.externalId));
}
