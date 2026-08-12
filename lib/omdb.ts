import "server-only";

const OMDB_BASE_URL = "https://www.omdbapi.com/";
const REQUEST_TIMEOUT_MS = 8000;

export type OmdbTypeFilter = "movie" | "series";

export interface OmdbSearchResultItem {
  imdbID: string;
  title: string;
  year: string;
  type: "movie" | "series";
  posterUrl: string | null;
}

export type OmdbSearchOutcome =
  | { ok: true; results: OmdbSearchResultItem[]; totalResults: number; page: number }
  | { ok: false; reason: "empty" }
  | { ok: false; reason: "error"; message: string };

export interface OmdbDetail {
  imdbID: string;
  title: string;
  year: string;
  type: "movie" | "series" | "episode";
  posterUrl: string | null;
  plot: string | null;
  director: string | null;
  releaseYear: number | null;
}

export type OmdbDetailOutcome =
  | { ok: true; detail: OmdbDetail }
  | { ok: false; reason: "not_found" | "error"; message: string };

function parseYear(year: string): number | null {
  const match = year.match(/\d{4}/);
  return match ? Number(match[0]) : null;
}

function normalizePoster(poster: string | undefined): string | null {
  return !poster || poster === "N/A" ? null : poster;
}

function normalizeText(value: string | undefined): string | null {
  return !value || value === "N/A" ? null : value;
}

function getApiKey(): string | null {
  return process.env.OMDB_API_KEY ?? null;
}

export async function searchOmdb(params: {
  query: string;
  type?: OmdbTypeFilter;
  page?: number;
}): Promise<OmdbSearchOutcome> {
  const apiKey = getApiKey();
  if (!apiKey) {
    return { ok: false, reason: "error", message: "OMDB API key is not configured." };
  }

  const url = new URL(OMDB_BASE_URL);
  url.searchParams.set("apikey", apiKey);
  url.searchParams.set("s", params.query);
  if (params.type) url.searchParams.set("type", params.type);
  url.searchParams.set("page", String(params.page ?? 1));

  try {
    const res = await fetch(url, {
      cache: "no-store",
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });
    const data = await res.json();

    if (data.Response === "False") {
      if (data.Error === "Movie not found!") {
        return { ok: false, reason: "empty" };
      }
      return { ok: false, reason: "error", message: data.Error ?? "OMDB request failed." };
    }

    const results: OmdbSearchResultItem[] = (data.Search ?? [])
      .filter((item: { Type?: string }) => item.Type === "movie" || item.Type === "series")
      .map((item: { Title: string; Year: string; imdbID: string; Type: string; Poster?: string }) => ({
        imdbID: item.imdbID,
        title: item.Title,
        year: item.Year,
        type: item.Type as "movie" | "series",
        posterUrl: normalizePoster(item.Poster),
      }));

    return {
      ok: true,
      results,
      totalResults: Number(data.totalResults) || 0,
      page: params.page ?? 1,
    };
  } catch {
    return { ok: false, reason: "error", message: "Could not reach OMDB. Please try again." };
  }
}

export async function getOmdbById(imdbId: string): Promise<OmdbDetailOutcome> {
  const apiKey = getApiKey();
  if (!apiKey) {
    return { ok: false, reason: "error", message: "OMDB API key is not configured." };
  }

  const url = new URL(OMDB_BASE_URL);
  url.searchParams.set("apikey", apiKey);
  url.searchParams.set("i", imdbId);
  url.searchParams.set("plot", "full");

  try {
    const res = await fetch(url, {
      cache: "no-store",
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });
    const data = await res.json();

    if (data.Response === "False") {
      return { ok: false, reason: "not_found", message: data.Error ?? "Title not found." };
    }

    const type = data.Type as "movie" | "series" | "episode";

    return {
      ok: true,
      detail: {
        imdbID: data.imdbID,
        title: data.Title,
        year: data.Year,
        type,
        posterUrl: normalizePoster(data.Poster),
        plot: normalizeText(data.Plot),
        director: normalizeText(data.Director),
        releaseYear: parseYear(data.Year ?? ""),
      },
    };
  } catch {
    return { ok: false, reason: "error", message: "Could not reach OMDB. Please try again." };
  }
}
