import Link from "next/link";
import { Settings } from "lucide-react";
import { getServerSession } from "@/lib/session";
import NavLinks from "@/components/NavLinks";
import SignOutButton from "@/components/SignOutButton";

const homeLink = { href: "/", label: "Home" };

const publicLinks = [{ href: "/about", label: "About" }];

const authLinks = [
  { href: "/library", label: "Your Shelf" },
  { href: "/search", label: "Search" },
];

export default async function Navbar() {
  const session = await getServerSession();

  const isSignedIn = !!session;
  const links = isSignedIn ? [...publicLinks, ...authLinks] : [homeLink, ...publicLinks];

  return (
    <nav className="flex items-center gap-6 border-b border-border px-6 py-4">
      <span className="font-bold">Shelfie</span>
      <NavLinks links={links} />
      {isSignedIn ? (
        <>
          <Link href="/settings">
            <Settings className="h-4 w-4" />
          </Link>
          <SignOutButton />
        </>
      ) : (
        <Link href="/login" className="text-muted-foreground hover:text-foreground">
          Sign in
        </Link>
      )}
    </nav>
  );
}
