"use client";

export default function SearchError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="text-center">
      <p className="text-red-600 dark:text-red-400">Something went wrong while searching.</p>
      <button
        type="button"
        onClick={reset}
        className="mt-2 rounded border border-border px-3 py-1.5 text-sm hover:bg-muted"
      >
        Try again
      </button>
    </div>
  );
}
