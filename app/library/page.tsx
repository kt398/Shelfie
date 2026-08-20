import Link from "next/link";
import { getServerSession } from "@/lib/session";
import {
  getLibraryEntries,
  parseStatusParam,
  parseTypeParam,
  parseSortParam,
  parseTagsParam,
  parseTagModeParam,
} from "@/lib/library";
import LibraryCard from "./_components/LibraryCard";
import { Suspense } from "react";
import Sidebar from "./_components/Sidebar";
import Header from "./_components/Header";
import { getLibraryStatusCounts } from "@/lib/library";
import { getUserTags } from "@/lib/tags";
export const dynamic = "force-dynamic";

type LibraryPageProps = {
  searchParams: Promise<{ status?: string; type?: string; sort?: string; q?: string; tags?: string; tagMode?: string }>;
};


export default async function LibraryPage({ searchParams }: LibraryPageProps) {
  const { status, type, sort, q, tags, tagMode } = await searchParams;

  const session = await getServerSession();
  if (!session?.user) {
    return <p className="text-muted-foreground">Please sign in to view your library.</p>;
  }

  const parsedTags = parseTagsParam(tags);
  const hasActiveFilters = Boolean(status || type || q || parsedTags.length > 0);
  const entries = await getLibraryEntries(session.user.id, {
    status: parseStatusParam(status),
    type: parseTypeParam(type),
    sort: parseSortParam(sort),
    query: q,
    tags: parsedTags,
    tagMode: parseTagModeParam(tagMode),
  });
  const counts = await getLibraryStatusCounts(session.user.id);
  const userTags = await getUserTags(session.user.id);

  if (entries.length === 0) {
    if (!hasActiveFilters) {
      return (
        <p className="text-muted-foreground">
          Your library is empty.{" "}
          <Link href="/search" className="text-blue-600 dark:text-blue-400 hover:underline">
            Search for movies and TV shows
          </Link>{" "}
          to add some.
        </p>
      );
    }
  }

  return (
  <div className="">
    <Suspense fallback={null}>
      <Header counts={counts}/>
    </Suspense>
    <div className="flex flex-1 gap-2">
      <Suspense fallback={null}>
        <Sidebar allTags={userTags.map((t) => t.name)} />
      </Suspense>
      {/*Display in case active filters hide all entires*/}
      {entries.length === 0 && hasActiveFilters &&     
          <p className="text-muted-foreground ml-4">
            No items match these filters.{" "}
            <Link href="/library" className="text-blue-600 dark:text-blue-400 hover:underline">
              Clear filters
            </Link>
          </p>
      }

      <div className="ml-2 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5 content-start">
        {entries.map((entry) => (
          <LibraryCard key={entry.id} entry={entry} />
        ))}
      </div>
    </div>
  </div>
  );
}
