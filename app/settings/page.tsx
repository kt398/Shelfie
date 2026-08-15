import ThemeToggle from "./_components/ThemeToggle";
import Button from "@/components/Button";
import PreferenceOption from "./_components/PreferenceOption";
import TagsDialog from "./_components/TagsDialog";
import { getServerSession } from "@/lib/session";
import { getUserPreferences } from "@/lib/preferences";
import { getUserTags } from "@/lib/tags";

export default async function SettingsPage() {
  const session = await getServerSession();
  if (!session?.user) {
    return <p className="text-muted-foreground">Please sign in to view settings.</p>;
  }

  const prefs = await getUserPreferences(session.user.id);
  const tags = await getUserTags(session.user.id);
  return (
    <div className="mx-auto max-w-xl px-6 py-12">
      <h1 className="text-2xl font-bold my-4">Theme</h1>
      <ThemeToggle/>
      <hr className="my-6 border-t border-border" />
      <h1 className="text-2xl font-bold my-4">General</h1>
      <h2 className="text-lg font-bold my-4">Default Start Date</h2>
      <div className="flex gap-2">
        <PreferenceOption
          field="defaultDateStarted"
          value="TODAY"
          label="Today"
          active={prefs.defaultDateStarted === "TODAY"}
        />
        <PreferenceOption
          field="defaultDateStarted"
          value="EMPTY"
          label="Empty"
          active={prefs.defaultDateStarted === "EMPTY"}
        />
      </div>
      <h2 className="text-lg font-bold my-4">Default End Date</h2>

      <div className="flex gap-2">
        <PreferenceOption
          field="defaultDateFinished"
          value="TODAY"
          label="Today"
          active={prefs.defaultDateFinished === "TODAY"}
        />
        <PreferenceOption
          field="defaultDateFinished"
          value="EMPTY"
          label="Empty"
          active={prefs.defaultDateFinished === "EMPTY"}
        />
      </div>
      <hr className="my-6 border-t border-border" />

      <h1 className="my-4 text-2xl font-bold">Custom Tags</h1>
      <TagsDialog tags={tags} />
      <hr className="my-6 border-t border-border" />

      <h1 className="my-4 text-2xl font-bold">Import/Export Data</h1>
      <Button className="block my-4" variant="primary">Export</Button>
      <Button className="block my-4" variant="primary">Import</Button>
      <hr className="my-6 border-t border-border" />


      <h1 className="my-4 text-2xl font-bold">Delete Account</h1>
      <hr className="my-6 border-t border-border" />


    </div>
  );
}


