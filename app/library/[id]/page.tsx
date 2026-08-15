import { notFound } from "next/navigation";
import { getServerSession } from "@/lib/session";
import { getLibraryEntryById, MEDIA_TYPE_LABELS } from "@/lib/library";
import RemoveEntryButton from "../_components/RemoveEntryButton";
import EditEntryForm from "./_components/EditEntryForm";
import Link from "next/link";
import BackButton from "./_components/BackButton";
import { getUserTags } from "@/lib/tags";


type LibraryEntryPageProps = { params: Promise<{ id: string }> };

export default async function LibraryEntryPage({ params }: LibraryEntryPageProps) {
  const { id } = await params;

  const session = await getServerSession();
  if (!session?.user) {
    return <p className="text-muted-foreground">Please sign in to view this item.</p>;
  }

  const entry = await getLibraryEntryById(session.user.id, id);
  const userTags = await getUserTags(session.user.id);
  if (!entry) notFound();

  return (
    <div className="mx-auto max-w-4xl">
      <div className="text-s text-muted-foreground font-[Segoe UI] mb-6 mt-6">
        <BackButton/>
      </div>
      <div className="flex items-start justify-center">
        <div className="mr-3">
          <img
            src={entry.mediaItem.posterUrl ?? undefined}
            alt={entry.mediaItem.title}
            className="aspect-2/3 max-w-60 rounded object-cover"
            />
          <p className="mt-1">{entry.mediaItem.creators}</p>
          <p className="mt-1 text-muted-foreground">{entry.mediaItem.releaseYear}</p>
        </div>
        <div className="ml-3 flex-1">
          <p className="mb-1 text-xs font-[Segoe UI] text-muted-foreground">{MEDIA_TYPE_LABELS[entry.mediaItem.type]}</p>
          <h1 className="mb-4 text-xl mt-0 font-[Georgia]">{entry.mediaItem.title}</h1>
          <EditEntryForm entry={entry} allTags={userTags} />
          <div className="mt-6 border-t border-border pt-4">
            <RemoveEntryButton entryId={entry.id} />
          </div>
        </div>

      </div>
    </div>
  );
}
