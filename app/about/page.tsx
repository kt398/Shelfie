import Image from "next/image";

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <h1 className="mb-4 text-2xl font-bold">About Shelfie</h1>
      <p className="mb-8 text-muted-foreground">
        Shelfie is a personal media tracker for movies, TV shows, and books. Search for titles,
        add them to your library, and keep track of what you&apos;re watching, reading, and
        planning to get to next.
      </p>

      <Image
        src="/screenshot-library.png"
        alt="Shelfie library view showing movies and TV shows with statuses, ratings, and tags"
        width={1200}
        height={470}
        className="mb-8 w-full rounded-lg border border-border"
      />

      <h2 className="mb-2 text-lg font-bold">What you can track</h2>
      <p className="mb-8 text-muted-foreground">
        Movies, TV shows, and books all live in one library, pulled in by searching titles from
        OMDb and Google Books.
      </p>

      <h2 className="mb-2 text-lg font-bold">Stay organized</h2>
      <ul className="mb-8 list-disc space-y-1 pl-5 text-muted-foreground">
        <li>Mark each entry as Planned, Watching/Reading, Completed, Dropped, or On Hold</li>
        <li>Rate what you finish and jot down notes or comments</li>
        <li>Track when you started and finished something</li>
        <li>Create your own custom tags and filter your library by any combination of them</li>
        <li>Filter by status or media type, and sort by recency, rating, or title</li>
      </ul>

      <h2 className="mb-2 text-lg font-bold">Your data</h2>
      <p className="text-muted-foreground">
        Your library is private to your account. Sign in with email and password or with Google
        to get started.
      </p>
    </div>
  );
}
