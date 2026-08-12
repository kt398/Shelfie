"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Settings } from "lucide-react";


const publicLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
];

const authLinks = [
  { href: "/library", label: "Shelf" },
  { href: "/search", label: "Search" },
];

export default function Navbar() {
  const pathname = usePathname();
  const { data: session, isPending } = authClient.useSession();

  const links = !isPending && session ? [...publicLinks, ...authLinks] : publicLinks;

  return (
    <nav className="flex items-center gap-6 border-b border-border px-6 py-4">
      <span className="font-bold">Shelfie</span>
      <div className="flex flex-1 gap-4">
        {links.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={
                isActive
                  ? "font-semibold text-blue-600 dark:text-blue-400"
                  : "text-muted-foreground hover:text-foreground"
              }
            >
              {link.label}
            </Link>
          );
        })}
      </div>
      {(!isPending && session) ? (
        <Link
          type="button"
          key="settings"
          href="/settings"
        >
          <Settings className="h-4 w-4"/>
        </Link>
      ):(
        null


      )}
      {!isPending &&
        (session ? (
          <button
            type="button"
            onClick={() => authClient.signOut().then(() => window.location.assign("/"))}
            className="text-muted-foreground hover:text-foreground"
          >
            Sign out
          </button>
        ) : (
          <Link href="/login" className="text-muted-foreground hover:text-foreground">
            Sign in
          </Link>
        ))}
    </nav>
  );
}
