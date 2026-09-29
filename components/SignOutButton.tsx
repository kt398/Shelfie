"use client";

import { authClient } from "@/lib/auth-client";

export default function SignOutButton() {
  return (
    <button
      type="button"
      onClick={() => authClient.signOut().then(() => window.location.assign("/"))}
      className="text-muted-foreground hover:text-foreground"
    >
      Sign out
    </button>
  );
}
