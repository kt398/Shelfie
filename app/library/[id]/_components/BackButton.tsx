"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import Button from "@/components/Button";

export default function BackButton() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const cameFromLibrary = searchParams.get("from") === "library";

  if (!cameFromLibrary) {
    return (
      <Link
        href="/library"
        className="rounded-lg px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-muted"
      >
        &lt; Your Shelf
      </Link>
    );
  }

  return (
    <Button variant="ghost" onClick={() => router.back()}>
      &lt; Your Shelf
    </Button>
  );
}
