import 'server-only';

const GOOGLE_BOOKS_BASE_URL = 'https://www.googleapis.com/books/v1/volumes';
const REQUEST_TIMEOUT_MS = 8000;

interface GoogleBooksVolumeInfo {
  title: string;
  authors?: string[];
  publishedDate?: string;
  description?: string;
  imageLinks?: { thumbnail?: string };
}

interface GoogleBooksErrorShape {
  error?: { code?: number; message?: string };
}

interface GoogleBooksSearchResponse extends GoogleBooksErrorShape {
  items?: { id: string; volumeInfo: GoogleBooksVolumeInfo }[];
}

interface GoogleBooksVolumeResponse extends GoogleBooksErrorShape {
  id?: string;
  volumeInfo?: GoogleBooksVolumeInfo;
}

export interface BooksSearchResultItem {
  id: string;
  source: 'GOOGLE_BOOKS';
  title: string;
  authors: string | null;
  year: string | null;
  posterUrl: string | null;
}

export type BooksSearchOutcome =
  | { ok: true; results: BooksSearchResultItem[]; hasMore: boolean }
  | { ok: false; reason: 'empty' }
  | { ok: false; reason: 'error'; message: string };

export interface BooksDetail {
  id: string;
  title: string;
  authors: string | null;
  posterUrl: string | null;
  description: string | null;
  releaseYear: number | null;
}

export type BooksDetailOutcome =
  | { ok: true; detail: BooksDetail }
  | { ok: false; reason: 'not_found' | 'error'; message: string };

function normalizePoster(imageLinks?: { thumbnail?: string }): string | null {
  // API returns http:// thumbnails; upgrade to https
  return imageLinks?.thumbnail?.replace(/^http:\/\//, 'https://') ?? null;
}

function parseYear(publishedDate?: string): number | null {
  const match = publishedDate?.match(/\d{4}/);
  return match ? Number(match[0]) : null;
}

function getApiKey(): string | null {
  return process.env.GOOGLE_BOOKS_API_KEY ?? null;
}

// The Google Books API intermittently returns transient 503s; retry once.
async function fetchGoogleBooksJson<T extends GoogleBooksErrorShape>(
  url: URL
): Promise<{ status: number; data: T }> {
  for (let attempt = 0; attempt < 2; attempt++) {
    const res = await fetch(url, {
      cache: 'no-store',
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });
    const data: T = await res.json();
    if (res.ok && !data.error) {
      return { status: res.status, data };
    }
    if (attempt === 0) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      continue;
    }
    return { status: res.status, data };
  }
  throw new Error('unreachable');
}

export async function searchBooks(params: {
  query: string;
  page: number;
}): Promise<BooksSearchOutcome> {
  const maxResults = 10;
  const url = new URL(GOOGLE_BOOKS_BASE_URL);
  url.searchParams.set('q', params.query);
  url.searchParams.set('printType', 'books');
  url.searchParams.set('langRestrict', 'en');
  url.searchParams.set('maxResults', String(maxResults));
  url.searchParams.set(
    'startIndex',
    String((Math.max(1, params.page) - 1) * maxResults)
  );
  const apiKey = getApiKey();
  if (apiKey) url.searchParams.set('key', apiKey);

  try {
    const { status, data } =
      await fetchGoogleBooksJson<GoogleBooksSearchResponse>(url);

    if (data.error) {
      return {
        ok: false,
        reason: 'error',
        message:
          data.error.message ?? `Google Books request failed (${status}).`,
      };
    }

    if (!data.items || data.items.length === 0) {
      return { ok: false, reason: 'empty' };
    }

    const results: BooksSearchResultItem[] = data.items.map(
      (item: { id: string; volumeInfo: GoogleBooksVolumeInfo }) => ({
        id: item.id,
        source: 'GOOGLE_BOOKS' as const,
        title: item.volumeInfo.title,
        authors: item.volumeInfo.authors?.join(', ') ?? null,
        year: item.volumeInfo.publishedDate ?? null,
        posterUrl: normalizePoster(item.volumeInfo.imageLinks),
      })
    );

    return {
      ok: true,
      results,
      hasMore: results.length === maxResults,
    };
  } catch {
    return {
      ok: false,
      reason: 'error',
      message: 'Could not reach Google Books. Please try again.',
    };
  }
}

export async function getBookById(
  volumeId: string
): Promise<BooksDetailOutcome> {
  const url = new URL(`${GOOGLE_BOOKS_BASE_URL}/${volumeId}`);
  const apiKey = getApiKey();
  if (apiKey) url.searchParams.set('key', apiKey);

  try {
    const { status, data } =
      await fetchGoogleBooksJson<GoogleBooksVolumeResponse>(url);

    if (data.error) {
      if (status === 404) {
        return {
          ok: false,
          reason: 'not_found',
          message: 'Book not found.',
        };
      }
      return {
        ok: false,
        reason: 'error',
        message:
          data.error.message ?? `Google Books request failed (${status}).`,
      };
    }

    const info = data.volumeInfo ?? { title: '' };

    return {
      ok: true,
      detail: {
        id: data.id ?? volumeId,
        title: info.title,
        authors: info.authors?.join(', ') ?? null,
        posterUrl: normalizePoster(info.imageLinks),
        description: info.description ?? null,
        releaseYear: parseYear(info.publishedDate),
      },
    };
  } catch {
    return {
      ok: false,
      reason: 'error',
      message: 'Could not reach Google Books. Please try again.',
    };
  }
}
