import type { OmdbSearchResultItem } from "@/lib/omdb";
import AddToLibraryButton from "./AddToLibraryButton";

export default function ResultCard({
  result,
  inLibrary,
}: {
  result: OmdbSearchResultItem;
  inLibrary: boolean;
}) {
  return (
    <div className="flex flex-col overflow-hidden rounded border border-border">
      <div className="aspect-[2/3] w-full bg-muted">
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
      <div className="flex flex-1 flex-col gap-1 p-3">
        <span className="w-fit rounded bg-muted px-2 py-0.5 text-xs uppercase text-muted-foreground">
          {result.type === "series" ? "TV" : "Movie"}
        </span>
        <h3 className="text-sm font-semibold">{result.title}</h3>
        <p className="text-xs text-muted-foreground">{result.year}</p>
        <div className="mt-auto pt-2">
          {inLibrary ? (
            <span className="block rounded bg-green-100 dark:bg-green-900/30 px-3 py-1.5 text-center text-sm text-green-700 dark:text-green-400">
              In Library
            </span>
          ) : (
            <AddToLibraryButton imdbId={result.imdbID} />
          )}
        </div>
      </div>
    </div>
  );
}
