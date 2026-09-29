import { MediaSource } from '@prisma/client';
import { getServerSession } from '@/lib/session';
import {
  searchOmdb,
  type OmdbTypeFilter,
  type OmdbSearchOutcome,
} from '@/lib/omdb';
import { searchBooks, type BooksSearchOutcome } from '@/lib/googlebooks';
import { getLibraryStatuses } from '@/lib/library';
import ResultCard from './_components/ResultCard';
import Pagination from './_components/Pagination';
type SearchPageProps = {
  searchParams: Promise<{ q?: string; type?: string; page?: string }>;
};

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q, type, page } = await searchParams;
  const query = q?.trim() ?? '';

  if (!query) {
    return (
      <p className="text-center text-muted-foreground">
        Search for a movie or TV show to get started.
      </p>
    );
  }

  const session = await getServerSession();
  if (!session?.user) {
    return <p className="text-muted-foreground">Please sign in to search.</p>;
  }

  const typeFilter: OmdbTypeFilter | undefined =
    type === 'movie' || type === 'series' ? type : undefined;
  const pageNum = Math.min(100, Math.max(1, Number(page) || 1));
  const mediaSource =
    type === 'books' ? MediaSource.GOOGLE_BOOKS : MediaSource.OMDB;

  let outcome: OmdbSearchOutcome | BooksSearchOutcome;
  let paginationProps: { totalPages: number } | { hasNextPage: boolean };
  if (type === 'books') {
    outcome = await searchBooks({
      query,
      page: pageNum,
    });
    paginationProps = { hasNextPage: outcome.ok ? outcome.hasMore : false };
  } else {
    outcome = await searchOmdb({
      query,
      type: typeFilter,
      page: pageNum,
    });
    paginationProps = {
      totalPages: outcome.ok
        ? Math.min(100, Math.ceil(outcome.totalResults / 10))
        : 1,
    };
  }

  if (!outcome.ok) {
    if (outcome.reason === 'empty') {
      return (
        <p className="text-muted-foreground mx-auto max-w-6xl text-center">
          No results for &quot;{query}&quot;.
        </p>
      );
    }
    return (
      <p className="mx-auto max-w-6xl text-red-600 dark:text-red-400 text-center">
        Search failed: {outcome.message}
      </p>
    );
  }

  const externalIds = outcome.results.map((r) => r.id);
  const libraryStatuses = await getLibraryStatuses(
    session.user.id,
    mediaSource,
    externalIds
  );
  return (
    <div className="mx-auto max-w-6xl">
      <div className="flex flex-1 m-6">
        <div className="grid w-full grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
          {outcome.results.map((result) => (
            <ResultCard
              key={result.id}
              result={result}
              libraryStatus={libraryStatuses.get(result.id)}
            />
          ))}
        </div>
      </div>
      <Pagination
        page={pageNum}
        query={query}
        type={type}
        {...paginationProps}
      />
    </div>
  );
}
