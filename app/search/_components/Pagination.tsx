import Link from 'next/link';

type PaginationProps =
  | {
      page: number;
      query: string;
      type?: string;
      totalPages: number;
      hasNextPage?: never;
    }
  | {
      page: number;
      query: string;
      type?: string;
      totalPages?: never;
      hasNextPage: boolean;
    };

export default function Pagination(props: PaginationProps) {
  const { page, query, type } = props;

  function hrefFor(p: number) {
    const params = new URLSearchParams({ q: query });
    if (type) params.set('type', type);
    if (p > 1) params.set('page', String(p));
    return `/search?${params.toString()}`;
  }

  if (props.totalPages !== undefined) {
    const { totalPages } = props;
    if (totalPages <= 1) return null;

    return (
      <div className="mt-6 flex items-center justify-center gap-4 text-sm">
        {page > 1 ? (
          <div>
            <Link
              href={hrefFor(1)}
              className="text-blue-600 dark:text-blue-400 hover:underline mr-2"
            >
              First
            </Link>
            <Link
              href={hrefFor(page - 1)}
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
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
            <Link
              href={hrefFor(page + 1)}
              className="text-blue-600 dark:text-blue-400 hover:underline mr-2"
            >
              Next
            </Link>
            <Link
              href={hrefFor(totalPages)}
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
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

  const { hasNextPage } = props;
  if (page === 1 && !hasNextPage) return null;

  return (
    <div className="mt-6 flex items-center justify-center gap-4 text-sm">
      {page > 1 ? (
        <Link
          href={hrefFor(page - 1)}
          className="text-blue-600 dark:text-blue-400 hover:underline"
        >
          Previous
        </Link>
      ) : (
        <span className="text-muted-foreground/50">Previous</span>
      )}
      <span className="text-muted-foreground">Page {page}</span>
      {hasNextPage ? (
        <Link
          href={hrefFor(page + 1)}
          className="text-blue-600 dark:text-blue-400 hover:underline"
        >
          Next
        </Link>
      ) : (
        <span className="text-muted-foreground/50">Next</span>
      )}
    </div>
  );
}
