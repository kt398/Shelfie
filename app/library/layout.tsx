import type { ReactNode } from "react";
import { Suspense } from "react";
import Sidebar from "./_components/Sidebar";
import Header from "./_components/Header";


export default function LibraryLayout({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto max-w-6xl">
      <main className="overflow-y-auto p-6">

        {children}
        
      </main>
    </div>
  );
}
