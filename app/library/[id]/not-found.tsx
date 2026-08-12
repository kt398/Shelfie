import Link from "next/link";

export default function LibraryEntryNotFound() {
  return (
    <div className="mx-auto max-w-xl text-center">
      <p className="text-muted-foreground">This library item could not be found.</p>
      <Link href="/library" className="mt-2 inline-block text-blue-600 dark:text-blue-400 hover:underline">
        Back to your library
      </Link>
    </div>
  );
}
