import { notFound } from "next/navigation";
import { getServerSession } from "@/lib/session";
import { getLibraryEntryById, MEDIA_TYPE_LABELS } from "@/lib/library";
import RemoveEntryButton from "../_components/RemoveEntryButton";
import EditEntryForm from "./_components/EditEntryForm";
import Link from "next/link";
import BackButton from "./_components/BackButton";


type LibraryEntryPageProps = { params: Promise<{ id: string }> };

export default async function LibraryEntryPage({ params }: LibraryEntryPageProps) {
  const { id } = await params;

  const session = await getServerSession();
  if (!session?.user) {
    return <p className="text-muted-foreground">Please sign in to view this item.</p>;
  }

  const entry = await getLibraryEntryById(session.user.id, id);
  if (!entry) notFound();

  return (
    <div className="mx-auto max-w-6xl">
      <div className="text-s text-muted-foreground font-[Segoe UI] mb-6 mt-6">
        <BackButton/>
      </div>
      <div className="flex flex-1">
        <div className="mr-6">
          <img
            src={entry.mediaItem.posterUrl ?? undefined}
            alt={entry.mediaItem.title}
            className="aspect-2/3 rounded object-cover"
            />
        </div>
        <div className="ml-6">
          <p className="mb-1 text-xs font-[Segoe UI] text-muted-foreground">{MEDIA_TYPE_LABELS[entry.mediaItem.type]}</p>
          <h1 className="mb-4 text-xl font-bold mt-0">{entry.mediaItem.title}</h1>
          <EditEntryForm entry={entry} />
          <div className="mt-6 border-t border-border pt-4">
            <RemoveEntryButton entryId={entry.id} />
          </div>
        </div>

      </div>
    </div>
  );
}
