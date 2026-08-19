import { redirect } from "next/navigation";
import Link from "next/link";
import { getServerSession } from "@/lib/session";
import Button from "@/components/Button";

export default async function Home() {
  const session = await getServerSession();
  if (session?.user) {
    redirect("/library");
  }

  return (
    <div className="mx-auto max-w-xl px-6 py-24 text-center">
      <h1 className="mb-4 text-3xl font-bold">Shelfie</h1>
      <p className="mb-8 text-muted-foreground">
        A personal media tracker for movies, TV shows, and books. Search for titles, add them to
        your library, and keep track of what you&apos;re watching, reading, and planning to get to
        next.
      </p>
      <div className="flex justify-center gap-3">
        <Link href="/signup">
          <Button variant="primary">Get Started</Button>
        </Link>
        <Link href="/login">
          <Button variant="secondary">Sign in</Button>
        </Link>
      </div>
    </div>
  );
}
