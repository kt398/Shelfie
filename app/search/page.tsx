import { MediaSource } from "@prisma/client";
import { getServerSession } from "@/lib/session";
import { searchOmdb, type OmdbTypeFilter } from "@/lib/omdb";
import { getLibraryExternalIds } from "@/lib/library";
import ResultCard from "./_components/ResultCard";
import Pagination from "./_components/Pagination";
import Sidebar from "./_components/Sidebar";
type SearchPageProps = {
  searchParams: Promise<{ q?: string; type?: string; page?: string }>;
};

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q, type, page } = await searchParams;
  const query = q?.trim() ?? "";

  if (!query) {
    return <p className="text-center text-muted-foreground">Search for a movie or TV show to get started.</p>;
  }

  const session = await getServerSession();
  if (!session?.user) {
    return <p className="text-muted-foreground">Please sign in to search.</p>;
  }

  const typeFilter: OmdbTypeFilter | undefined = type === "movie" || type === "series" ? type : undefined;
  const pageNum = Math.min(100, Math.max(1, Number(page) || 1));

  const outcome = await searchOmdb({ query, type: typeFilter, page: pageNum });

  if (!outcome.ok) {
    if (outcome.reason === "empty") {
      return <p className="text-muted-foreground">No results for &quot;{query}&quot;.</p>;
    }
    return <p className="text-red-600 dark:text-red-400">Search failed: {outcome.message}</p>;
  }

  const externalIds = outcome.results.map((r) => r.imdbID);
  const inLibrary = await getLibraryExternalIds(session.user.id, MediaSource.OMDB, externalIds);
  const totalPages = Math.min(100, Math.ceil(outcome.totalResults / 10));

  return (
    <div className="mx-auto max-w-6xl">
      <div className="flex flex-1 m-6">
        <Sidebar/>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
          {outcome.results.map((result) => (
            <ResultCard key={result.imdbID} result={result} inLibrary={inLibrary.has(result.imdbID)} />
          ))}
        </div>
      </div>
      <Pagination page={pageNum} totalPages={totalPages} query={query} type={type} />
    </div>
  );
}
