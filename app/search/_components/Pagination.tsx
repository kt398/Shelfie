import Link from "next/link";

export default function Pagination({
  page,
  totalPages,
  query,
  type,
}: {
  page: number;
  totalPages: number;
  query: string;
  type?: string;
}) {
  if (totalPages <= 1) return null;

  function hrefFor(p: number) {
    const params = new URLSearchParams({ q: query });
    if (type) params.set("type", type);
    if (p > 1) params.set("page", String(p));
    return `/search?${params.toString()}`;
  }

  return (
    <div className="mt-6 flex items-center justify-center gap-4 text-sm">
      {page > 1 ? (
        <div>
        <Link href={hrefFor(1)} className="text-blue-600 dark:text-blue-400 hover:underline mr-2">
          First
        </Link>
        <Link href={hrefFor(page - 1)} className="text-blue-600 dark:text-blue-400 hover:underline">
          Previous
        </Link>
        </div>
      ) : (
        <div>
          <span className="text-muted-foreground/50 mr-2">First</span>
          <span className="text-muted-foreground/50">Previous</span>
        </div>
      )}
      <span className="text-muted-foreground">
        Page {page} of {totalPages}
      </span>
      {page < totalPages ? (
        <div>
        <Link href={hrefFor(page + 1)} className="text-blue-600 dark:text-blue-400 hover:underline mr-2">
          Next
        </Link>
        <Link href={hrefFor(totalPages)} className="text-blue-600 dark:text-blue-400 hover:underline">
          Last
        </Link>
        </div>
      ) : (
        <div>
          <span className="text-muted-foreground/50 mr-2">Next</span>
          <span className="text-muted-foreground/50">Last</span>
        </div>
      )}
    </div>
  );
}
