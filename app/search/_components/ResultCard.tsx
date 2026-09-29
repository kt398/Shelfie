import type { LibraryStatus, MediaType } from '@prisma/client';
import type { OmdbSearchResultItem } from '@/lib/omdb';
import type { BooksSearchResultItem } from '@/lib/googlebooks';
import { MEDIA_TYPE_LABELS } from '@/lib/library';
import AddToLibraryTray from './AddToLibraryTray';

export default function ResultCard({
  result,
  libraryStatus,
}: {
  result: OmdbSearchResultItem | BooksSearchResultItem;
  libraryStatus?: LibraryStatus;
}) {
  const mediaType: MediaType =
    result.source === 'OMDB'
      ? result.type === 'series'
        ? 'TV'
        : 'MOVIE'
      : 'BOOK';

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-md border border-border">
      <div className="aspect-2/3 w-full bg-muted after:pointer-events-none after:absolute after:inset-0 after:bg-linear-to-t after:from-black/80 after:to-transparent after:content-[''] dark:after:from-black">
        {result.posterUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={result.posterUrl}
            alt={result.title}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">
            No image
          </div>
        )}
      </div>
      <AddToLibraryTray
        id={result.id}
        source={result.source}
        mediaType={mediaType}
        typeLabel={mediaType === 'TV' ? 'TV' : MEDIA_TYPE_LABELS[mediaType]}
        libraryStatus={libraryStatus}
      >
        <h3 className="line-clamp-3 font-[Georgia] text-sm leading-tight text-white">
          {result.title}
        </h3>
        <p className="font-mono text-[10px] text-gray-300">
          {MEDIA_TYPE_LABELS[mediaType]}
          {result.year ? ` · ${result.year}` : ''}
        </p>
      </AddToLibraryTray>
    </div>
  );
}
